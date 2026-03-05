const express = require("express");
const router = express.Router();
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");
const rateLimit = require("express-rate-limit");

const geminiController = require("../controller/gemini.controller");

//🔥 Rate limiting middleware (5 requests per minute for authenticated users, 2 for guests)
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: (req) => {
    const isAuth = !!req.auth?.userId;
    return isAuth ? 10 : 2; // 10 requests for authenticated, 2 for guests
  },
  message: {
    success: false,
    message: "Too many requests, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers["x-forwarded-for"] || req.ip || "guest";
  }
});

//🔥 Optional auth middleware (allows guest access)
const optionalAuth = (req, res, next) => {
  ClerkExpressWithAuth()(req, res, (err) => {
    if (err) {
      req.auth = null;
    }
    next();
  });
};

// POST - Generate code using Gemini API
router.post(
  "/generate-code",
  optionalAuth,  // Temporarily disabled for testing - now re-enabled
  rateLimiter,
  geminiController.generateCode
);

// GET - Get user history (requires authentication)
router.get(
  "/history",
  ClerkExpressWithAuth(),
  geminiController.getUserHistory
);

module.exports = router;