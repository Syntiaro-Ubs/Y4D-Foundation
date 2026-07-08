/**
 * Centralized Logger Utility
 * 
 * In development: All logs are shown
 * In production: Only errors are shown (console.error)
 * 
 * Usage:
 *   import logger from '../utils/logger';
 *   logger.log('Debug message');
 *   logger.error('Error message');
 */

// Vite production detection:
// - PROD is true when building for production (npm run build)
// - MODE is 'production' when built with npm run build
// - DEV is true when running npm run dev
// Note: npm run dev always runs in development mode, regardless of NODE_ENV
const isDevelopment = import.meta.env.DEV === true && import.meta.env.MODE !== 'production';
const isProduction = import.meta.env.PROD === true || import.meta.env.MODE === 'production';

const logger = {
  /**
   * Log message (only in development)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Error message (only in development)
   */
  error: (...args) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  },

  /**
   * Warning message (only in development)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Info message (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Debug message (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Table output (only in development)
   */
  table: (...args) => {
    if (isDevelopment) {
      console.table(...args);
    }
  },

  /**
   * Group logs (only in development)
   */
  group: (...args) => {
    if (isDevelopment) {
      console.group(...args);
    }
  },

  /**
   * End group (only in development)
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },

  /**
   * Group collapsed (only in development)
   */
  groupCollapsed: (...args) => {
    if (isDevelopment) {
      console.groupCollapsed(...args);
    }
  },
};

export default logger;
