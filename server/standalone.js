import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createExpressApp } from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "..", "dist");

const app = createExpressApp();
const PORT = process.env.PORT || 3000;

// Serve static build in production
app.use(express.static(DIST_DIR));

// Fallback to index.html for SPA routing
app.get("*", (req, res, next) => {
  if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
    return next();
  }
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Padmashree Computers Production Server running on port ${PORT}`);
});

