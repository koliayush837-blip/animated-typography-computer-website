import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import {
  getStoreData,
  saveStoreData,
  logActivity,
  getActivityLog,
  createBackup,
  listBackups,
  restoreBackup,
  resetToDefaults,
  UPLOADS_DIR,
} from "./db.js";
import {
  ensureAdminPasswordInitialized,
  verifyPin,
  updatePin,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
  createSession,
  validateSession,
  destroySession,
  COOKIE_NAME,
  getCookieOptions,
} from "./auth.js";

// Load environment variables
dotenv.config();

// Ensure admin password hash is seeded
ensureAdminPasswordInitialized();

export function createExpressApp() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser(process.env.SESSION_SECRET || "default_padmashree_secret"));

  // Static uploads directory
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Multer setup for image uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".png";
      const uniqueName = `img_${Date.now()}_${crypto.randomBytes(6).toString("hex")}${ext}`;
      cb(null, uniqueName);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed."));
      }
    },
  });

  // Client IP helper
  const getClientIp = (req) => {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  };

  // Auth Middleware for protected endpoints
  const requireAdmin = (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];
    if (!token || !validateSession(token)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized: Invalid or expired admin session. Please log in.",
      });
    }
    next();
  };

  // -------------------------------------------------------------
  // Public Endpoint: Get Store Data
  // -------------------------------------------------------------
  app.get("/api/data", (req, res) => {
    try {
      const data = getStoreData();
      res.json({ success: true, data });
    } catch (err) {
      console.error("Failed to fetch store data:", err);
      res.status(500).json({ success: false, error: "Failed to retrieve store data" });
    }
  });

  // -------------------------------------------------------------
  // Public Endpoint: Submit Contact Enquiry
  // -------------------------------------------------------------
  app.post("/api/enquiries", (req, res) => {
    const ip = getClientIp(req);
    const { name, phone, topic, message } = req.body || {};
    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, error: "Name, phone, and message are required" });
    }
    const cleanName = String(name).trim().slice(0, 80);
    const cleanPhone = String(phone).trim().slice(0, 30);
    const cleanTopic = String(topic || "General Enquiry").trim().slice(0, 60);
    const cleanMessage = String(message).trim().slice(0, 500);

    logActivity(
      "CUSTOMER_ENQUIRY",
      `${cleanName} (${cleanPhone}) [${cleanTopic}]: ${cleanMessage}`,
      ip,
    );

    return res.json({
      success: true,
      message: "Enquiry received! Our team will contact you shortly.",
    });
  });

  // -------------------------------------------------------------
  // Auth Endpoints
  // -------------------------------------------------------------
  app.post("/api/auth/login", (req, res) => {
    const ip = getClientIp(req);
    const { pin } = req.body;

    if (!pin || typeof pin !== "string") {
      return res.status(400).json({ success: false, error: "Passkey is required" });
    }

    // Check rate limit
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      logActivity("AUTH_LOCKOUT", `Blocked login attempt due to rate limit (${rateCheck.retryAfterSeconds}s remaining)`, ip);
      return res.status(429).json({
        success: false,
        error: `Too many failed attempts. Temporary lockout active. Please wait ${rateCheck.retryAfterSeconds} seconds.`,
        retryAfter: rateCheck.retryAfterSeconds,
      });
    }

    // Verify PIN against cryptographic salt + hash
    const isValid = verifyPin(pin);
    if (!isValid) {
      const { remaining, locked, retryAfterSeconds } = recordFailedAttempt(ip);
      logActivity("AUTH_FAILED", `Failed passkey attempt (Remaining attempts: ${remaining})`, ip);

      if (locked) {
        return res.status(429).json({
          success: false,
          error: `Too many failed attempts. Account locked for 15 minutes.`,
          retryAfter: retryAfterSeconds,
        });
      }

      return res.status(401).json({
        success: false,
        error: `Incorrect passkey. ${remaining} attempt(s) remaining before lockout.`,
        remainingAttempts: remaining,
      });
    }

    // Reset rate limiter on successful auth
    resetFailedAttempts(ip);

    // Create session and set HttpOnly, SameSite cookie
    const token = createSession(ip);
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    logActivity("AUTH_LOGIN", "Admin logged in successfully", ip);
    return res.json({
      success: true,
      message: "Admin authentication successful",
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    const token = req.cookies[COOKIE_NAME];
    const ip = getClientIp(req);

    if (token) {
      destroySession(token);
    }
    res.clearCookie(COOKIE_NAME, { path: "/" });
    logActivity("AUTH_LOGOUT", "Admin logged out", ip);
    return res.json({ success: true, message: "Logged out successfully" });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies[COOKIE_NAME];
    const isAuthenticated = validateSession(token);
    return res.json({ success: true, authenticated: isAuthenticated });
  });

  app.post("/api/auth/change-pin", requireAdmin, (req, res) => {
    const { currentPin, newPin } = req.body;
    const ip = getClientIp(req);

    if (!currentPin || !newPin) {
      return res.status(400).json({ success: false, error: "Current and new PIN are required" });
    }

    if (!verifyPin(currentPin)) {
      logActivity("PIN_CHANGE_FAIL", "Failed PIN change: incorrect current PIN", ip);
      return res.status(401).json({ success: false, error: "Current PIN is incorrect" });
    }

    try {
      updatePin(newPin);
      // Re-create session for current user
      const token = createSession(ip);
      res.cookie(COOKIE_NAME, token, getCookieOptions());

      logActivity("PIN_CHANGE_SUCCESS", "Admin PIN updated securely", ip);
      return res.json({ success: true, message: "PIN updated successfully. All other sessions invalidated." });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // Protected Activity Log
  // -------------------------------------------------------------
  app.get("/api/activity", requireAdmin, (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30;
    const logs = getActivityLog(limit);
    res.json({ success: true, logs });
  });

  // -------------------------------------------------------------
  // Protected Products Management
  // -------------------------------------------------------------
  app.post("/api/products", requireAdmin, (req, res) => {
    const { categoryId, name, price, tag, image, stockStatus, description, specs, featured } = req.body;
    const ip = getClientIp(req);

    if (!categoryId || !name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Category ID and product name are required" });
    }

    const data = getStoreData();
    const category = data.catalog.find((c) => c.id === categoryId);
    if (!category) {
      return res.status(404).json({ success: false, error: `Category '${categoryId}' not found` });
    }

    const item = {
      name: name.trim(),
      price: price ? String(price).trim() : undefined,
      tag: tag ? String(tag).trim() : undefined,
      image: image ? String(image).trim() : undefined,
      inStock: stockStatus !== "out_of_stock",
      stockStatus: stockStatus || "in_stock",
      description: description ? String(description).trim() : undefined,
      specs: Array.isArray(specs) ? specs.map((s) => String(s).trim()).filter(Boolean) : undefined,
      featured: Boolean(featured),
    };

    category.items.unshift(item);
    saveStoreData(data);
    logActivity("PRODUCT_ADD", `Added product "${item.name}" to category "${category.label}"`, ip);

    return res.json({ success: true, item, data });
  });

  app.put("/api/products/:catId/:index", requireAdmin, (req, res) => {
    const { catId, index } = req.params;
    const idx = parseInt(index, 10);
    const { name, price, tag, image, stockStatus, description, specs, featured } = req.body;
    const ip = getClientIp(req);

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Product name is required" });
    }

    const data = getStoreData();
    const category = data.catalog.find((c) => c.id === catId);
    if (!category || !category.items[idx]) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const prevName = category.items[idx].name;
    category.items[idx] = {
      ...category.items[idx],
      name: name.trim(),
      price: price ? String(price).trim() : undefined,
      tag: tag ? String(tag).trim() : undefined,
      image: image ? String(image).trim() : undefined,
      inStock: stockStatus !== "out_of_stock",
      stockStatus: stockStatus || "in_stock",
      description: description !== undefined ? (description ? String(description).trim() : undefined) : category.items[idx].description,
      specs: Array.isArray(specs) ? specs.map((s) => String(s).trim()).filter(Boolean) : category.items[idx].specs,
      featured: featured !== undefined ? Boolean(featured) : category.items[idx].featured,
    };

    saveStoreData(data);
    logActivity("PRODUCT_UPDATE", `Updated product "${prevName}" -> "${name.trim()}"`, ip);

    return res.json({ success: true, item: category.items[idx], data });
  });

  app.delete("/api/products/:catId/:index", requireAdmin, (req, res) => {
    const { catId, index } = req.params;
    const idx = parseInt(index, 10);
    const ip = getClientIp(req);

    const data = getStoreData();
    const category = data.catalog.find((c) => c.id === catId);
    if (!category || !category.items[idx]) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    const deleted = category.items.splice(idx, 1)[0];
    saveStoreData(data);
    logActivity("PRODUCT_DELETE", `Deleted product "${deleted.name}" from "${category.label}"`, ip);

    return res.json({ success: true, deleted, data });
  });

  // -------------------------------------------------------------
  // Protected Categories Management
  // -------------------------------------------------------------
  app.post("/api/categories", requireAdmin, (req, res) => {
    const { label } = req.body;
    const ip = getClientIp(req);

    if (!label || typeof label !== "string" || !label.trim()) {
      return res.status(400).json({ success: false, error: "Category label is required" });
    }

    const cleanLabel = label.trim();
    const id = cleanLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const data = getStoreData();
    if (data.catalog.some((c) => c.id === id)) {
      return res.status(400).json({ success: false, error: `Category with ID '${id}' already exists` });
    }

    const newCategory = { id, label: cleanLabel, items: [] };
    data.catalog.push(newCategory);
    saveStoreData(data);
    logActivity("CATEGORY_ADD", `Created new category "${cleanLabel}"`, ip);

    return res.json({ success: true, category: newCategory, data });
  });

  app.delete("/api/categories/:catId", requireAdmin, (req, res) => {
    const { catId } = req.params;
    const ip = getClientIp(req);

    const data = getStoreData();
    if (data.catalog.length <= 1) {
      return res.status(400).json({ success: false, error: "Cannot delete the last remaining category" });
    }

    const index = data.catalog.findIndex((c) => c.id === catId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    const deleted = data.catalog.splice(index, 1)[0];
    saveStoreData(data);
    logActivity("CATEGORY_DELETE", `Deleted category "${deleted.label}" and ${deleted.items.length} item(s)`, ip);

    return res.json({ success: true, deleted, data });
  });

  // -------------------------------------------------------------
  // Protected Services Management
  // -------------------------------------------------------------
  app.post("/api/services", requireAdmin, (req, res) => {
    const { title, text, icon, tone } = req.body;
    const ip = getClientIp(req);

    if (!title || !text) {
      return res.status(400).json({ success: false, error: "Title and description text are required" });
    }

    const service = {
      title: title.trim(),
      text: text.trim(),
      icon: icon || "laptop",
      tone: ["white", "navy", "red"].includes(tone) ? tone : "white",
    };

    const data = getStoreData();
    data.services.unshift(service);
    saveStoreData(data);
    logActivity("SERVICE_ADD", `Added service "${service.title}"`, ip);

    return res.json({ success: true, service, data });
  });

  app.put("/api/services/:index", requireAdmin, (req, res) => {
    const idx = parseInt(req.params.index, 10);
    const { title, text, icon, tone } = req.body;
    const ip = getClientIp(req);

    const data = getStoreData();
    if (!data.services[idx]) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    const prevTitle = data.services[idx].title;
    data.services[idx] = {
      title: title ? title.trim() : data.services[idx].title,
      text: text ? text.trim() : data.services[idx].text,
      icon: icon || data.services[idx].icon,
      tone: ["white", "navy", "red"].includes(tone) ? tone : data.services[idx].tone,
    };

    saveStoreData(data);
    logActivity("SERVICE_UPDATE", `Updated service "${prevTitle}"`, ip);

    return res.json({ success: true, service: data.services[idx], data });
  });

  app.delete("/api/services/:index", requireAdmin, (req, res) => {
    const idx = parseInt(req.params.index, 10);
    const ip = getClientIp(req);

    const data = getStoreData();
    if (!data.services[idx]) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    const deleted = data.services.splice(idx, 1)[0];
    saveStoreData(data);
    logActivity("SERVICE_DELETE", `Deleted service "${deleted.title}"`, ip);

    return res.json({ success: true, deleted, data });
  });

  // -------------------------------------------------------------
  // Protected Store / Biz Info
  // -------------------------------------------------------------
  app.put("/api/biz", requireAdmin, (req, res) => {
    const updates = req.body;
    const ip = getClientIp(req);

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ success: false, error: "Invalid updates format" });
    }

    const data = getStoreData();
    data.biz = {
      ...data.biz,
      ...updates,
    };

    saveStoreData(data);
    logActivity("STORE_UPDATE", "Updated store details & contact information", ip);

    return res.json({ success: true, biz: data.biz, data });
  });

  // -------------------------------------------------------------
  // Protected Gallery Photo Management
  // -------------------------------------------------------------
  app.post("/api/gallery", requireAdmin, (req, res) => {
    const { src, cap, alt } = req.body;
    const ip = getClientIp(req);

    if (!src || !cap) {
      return res.status(400).json({ success: false, error: "Image source (src) and caption (cap) are required" });
    }

    const photo = {
      src: src.trim(),
      cap: cap.trim(),
      alt: alt ? alt.trim() : cap.trim(),
    };

    const data = getStoreData();
    if (!Array.isArray(data.gallery)) {
      data.gallery = [];
    }
    data.gallery.unshift(photo);
    saveStoreData(data);
    logActivity("GALLERY_ADD", `Added gallery photo "${photo.cap}"`, ip);

    return res.json({ success: true, photo, data });
  });

  app.delete("/api/gallery/:index", requireAdmin, (req, res) => {
    const idx = parseInt(req.params.index, 10);
    const ip = getClientIp(req);

    const data = getStoreData();
    if (!Array.isArray(data.gallery) || !data.gallery[idx]) {
      return res.status(404).json({ success: false, error: "Gallery photo not found" });
    }

    const deleted = data.gallery.splice(idx, 1)[0];
    saveStoreData(data);
    logActivity("GALLERY_DELETE", `Deleted gallery photo "${deleted.cap}"`, ip);

    return res.json({ success: true, deleted, data });
  });

  // -------------------------------------------------------------
  // Protected Brands & Reviews
  // -------------------------------------------------------------
  app.post("/api/brands", requireAdmin, (req, res) => {
    const { brand } = req.body;
    const ip = getClientIp(req);

    if (!brand || !brand.trim()) {
      return res.status(400).json({ success: false, error: "Brand name required" });
    }

    const b = brand.trim();
    const data = getStoreData();
    if (data.brands.includes(b)) {
      return res.status(400).json({ success: false, error: "Brand already listed" });
    }

    data.brands.push(b);
    saveStoreData(data);
    logActivity("BRAND_ADD", `Added brand "${b}" to ticker`, ip);

    return res.json({ success: true, brand: b, data });
  });

  app.delete("/api/brands/:index", requireAdmin, (req, res) => {
    const idx = parseInt(req.params.index, 10);
    const ip = getClientIp(req);

    const data = getStoreData();
    if (!data.brands[idx]) {
      return res.status(404).json({ success: false, error: "Brand not found" });
    }

    const deleted = data.brands.splice(idx, 1)[0];
    saveStoreData(data);
    logActivity("BRAND_DELETE", `Deleted brand "${deleted}"`, ip);

    return res.json({ success: true, deleted, data });
  });

  app.post("/api/reviews", requireAdmin, (req, res) => {
    const { name, badge, quote, note } = req.body;
    const ip = getClientIp(req);

    if (!name || !quote) {
      return res.status(400).json({ success: false, error: "Reviewer name and quote are required" });
    }

    const review = {
      name: name.trim(),
      badge: badge ? badge.trim() : "5 stars",
      quote: quote.trim(),
      note: note ? note.trim() : "",
    };

    const data = getStoreData();
    data.reviews.unshift(review);
    saveStoreData(data);
    logActivity("REVIEW_ADD", `Added review from "${review.name}"`, ip);

    return res.json({ success: true, review, data });
  });

  app.delete("/api/reviews/:index", requireAdmin, (req, res) => {
    const idx = parseInt(req.params.index, 10);
    const ip = getClientIp(req);

    const data = getStoreData();
    if (!data.reviews[idx]) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    const deleted = data.reviews.splice(idx, 1)[0];
    saveStoreData(data);
    logActivity("REVIEW_DELETE", `Deleted review from "${deleted.name}"`, ip);

    return res.json({ success: true, deleted, data });
  });

  // -------------------------------------------------------------
  // Protected File / Image Upload
  // -------------------------------------------------------------
  app.post("/api/upload", requireAdmin, upload.single("image"), (req, res) => {
    const ip = getClientIp(req);
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided" });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    logActivity("FILE_UPLOAD", `Uploaded file "${req.file.originalname}" -> ${relativeUrl}`, ip);

    return res.json({
      success: true,
      url: relativeUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  });

  // -------------------------------------------------------------
  // Protected Backup & Restore
  // -------------------------------------------------------------
  app.get("/api/backup", requireAdmin, (req, res) => {
    const data = getStoreData();
    const backup = createBackup();
    res.setHeader("Content-Disposition", `attachment; filename="${backup.file}"`);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
  });

  app.get("/api/backups", requireAdmin, (req, res) => {
    const backups = listBackups();
    res.json({ success: true, backups });
  });

  app.post("/api/restore", requireAdmin, (req, res) => {
    const { backupData, confirm } = req.body;
    const ip = getClientIp(req);

    if (!confirm) {
      return res.status(400).json({ success: false, error: "Confirmation flag required to prevent accidental overwrite" });
    }

    try {
      restoreBackup(backupData);
      logActivity("BACKUP_RESTORE", "Restored store data from JSON backup", ip);
      return res.json({ success: true, message: "Store data restored successfully", data: getStoreData() });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post("/api/reset", requireAdmin, (req, res) => {
    const { confirm } = req.body;
    const ip = getClientIp(req);

    if (!confirm) {
      return res.status(400).json({ success: false, error: "Confirmation flag required" });
    }

    const data = resetToDefaults();
    logActivity("STORE_RESET", "Reset store database to factory template defaults", ip);
    return res.json({ success: true, message: "Store restored to template stock", data });
  });

  // Error handling middleware for Multer or other express errors
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
    next();
  });

  return app;
}

