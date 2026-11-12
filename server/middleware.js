import { createExpressApp } from "./app.js";

export function createApiMiddleware() {
  const app = createExpressApp();
  return (req, res, next) => {
    // Only intercept requests destined for /api or /uploads
    if (req.url.startsWith("/api") || req.url.startsWith("/uploads")) {
      return app(req, res, next);
    }
    next();
  };
}

