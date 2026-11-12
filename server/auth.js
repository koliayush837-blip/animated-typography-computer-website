import crypto from "crypto";
import { getAuthRecord, saveAuthRecord, logActivity } from "./db.js";

// Session Store: Map<token, { createdAt: number, expiresAt: number, ip: string }>
const activeSessions = new Map();
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Rate Limiter: Map<ip, { attempts: number, firstAttemptAt: number, lockedUntil: number | null }>
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout window

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token);
    }
  }
  for (const [ip, record] of loginAttempts.entries()) {
    if (record.lockedUntil && record.lockedUntil <= now) {
      loginAttempts.delete(ip);
    } else if (now - record.firstAttemptAt > WINDOW_MS && !record.lockedUntil) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Initialize Admin Password Hash if not already set
export function ensureAdminPasswordInitialized() {
  const existing = getAuthRecord();
  if (!existing) {
    const initialPin = process.env.ADMIN_PIN || "admin123";
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(initialPin, salt, 64).toString("hex");
    saveAuthRecord({
      hash,
      salt,
      updatedAt: new Date().toISOString(),
    });
    logActivity("SYSTEM_INIT", "Seeded admin passkey hash securely using scrypt with random salt");
  }
}

// Verify Submitted PIN against Salted Hash
export function verifyPin(submittedPin) {
  const record = getAuthRecord();
  if (!record || !record.hash || !record.salt) {
    return false;
  }
  try {
    const computedHash = crypto.scryptSync(submittedPin, record.salt, 64);
    const storedHash = Buffer.from(record.hash, "hex");
    if (computedHash.length !== storedHash.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedHash, storedHash);
  } catch (err) {
    console.error("PIN verification error:", err);
    return false;
  }
}

// Update Admin PIN
export function updatePin(newPin) {
  if (!newPin || typeof newPin !== "string" || newPin.trim().length < 4) {
    throw new Error("PIN must be at least 4 characters long");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(newPin.trim(), salt, 64).toString("hex");
  saveAuthRecord({
    hash,
    salt,
    updatedAt: new Date().toISOString(),
  });
  // Invalidate all existing sessions on PIN change for security
  activeSessions.clear();
}

// Rate Limiting Logic
export function checkRateLimit(ip) {
  const now = Date.now();
  let record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  // If locked, check if lockout duration has passed
  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }
    // Lockout expired, reset
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  // If outside time window, reset
  if (now - record.firstAttemptAt > WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  return { allowed: true, remaining: Math.max(0, MAX_ATTEMPTS - record.attempts) };
}

export function recordFailedAttempt(ip) {
  const now = Date.now();
  let record = loginAttempts.get(ip);
  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    record = { attempts: 1, firstAttemptAt: now, lockedUntil: null };
  } else {
    record.attempts += 1;
    if (record.attempts >= MAX_ATTEMPTS) {
      record.lockedUntil = now + WINDOW_MS;
    }
  }
  loginAttempts.set(ip, record);

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  const locked = Boolean(record.lockedUntil);
  return { remaining, locked, retryAfterSeconds: locked ? Math.ceil(WINDOW_MS / 1000) : 0 };
}

export function resetFailedAttempts(ip) {
  loginAttempts.delete(ip);
}

// Session Creation & Validation
export function createSession(ip) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = Date.now();
  activeSessions.set(token, {
    ip,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
  });
  return token;
}

export function validateSession(token) {
  if (!token || typeof token !== "string") return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  if (session.expiresAt <= Date.now()) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

export function destroySession(token) {
  if (token) {
    activeSessions.delete(token);
  }
}

export const COOKIE_NAME = "padmashree_admin_session";

export function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: SESSION_TTL_MS,
    path: "/",
  };
}

