/**
 * Rate Limiting Middleware
 * Provides different rate limits for different types of endpoints
 */

const rateLimit = require('express-rate-limit');
const consoleLogger = require('../utils/logger');

/**
 * Rate limiter for authentication endpoints (login, registration, password reset)
 * Stricter limits to prevent brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again after 15 minutes',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    consoleLogger.warn('Rate limit exceeded for auth endpoint', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Too many authentication attempts, please try again after 15 minutes',
      retryAfter: '15 minutes'
    });
  },
  skip: (req) => {
    // Skip rate limiting in development for testing
    return process.env.NODE_ENV === 'development' && req.query.skipRateLimit === 'true';
  }
});

/**
 * Rate limiter for general API endpoints
 * More lenient for regular API usage
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per windowMs
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    consoleLogger.warn('Rate limit exceeded for API endpoint', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Rate limiter for file upload endpoints
 * Stricter limits due to resource-intensive nature
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: {
    error: 'Too many file uploads, please try again after 1 hour',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    consoleLogger.warn('Rate limit exceeded for upload endpoint', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Too many file uploads, please try again after 1 hour',
      retryAfter: '1 hour'
    });
  }
});

/**
 * Rate limiter for public endpoints (read-only)
 * More lenient for public content access
 */
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per windowMs
  message: {
    error: 'Too many requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    consoleLogger.warn('Rate limit exceeded for public endpoint', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Rate limiter for admin endpoints
 * Moderate limits for admin operations
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per windowMs
  message: {
    error: 'Too many admin requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    consoleLogger.warn('Rate limit exceeded for admin endpoint', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userId: req.user?.id
    });
    res.status(429).json({
      error: 'Too many admin requests, please try again later',
      retryAfter: '15 minutes'
    });
  }
});

module.exports = {
  authLimiter,
  apiLimiter,
  uploadLimiter,
  publicLimiter,
  adminLimiter
};

