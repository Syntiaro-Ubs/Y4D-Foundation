/**
 * Centralized API Configuration
 * 
 * This file provides a single source of truth for all API endpoints.
 * All API URLs should be imported from here instead of being hardcoded.
 * 
 * Environment Variables:
 * - VITE_API_BASE_URL: Base URL for API endpoints (e.g., http://localhost:5000/api or https://y4d.ngo/dev/api)
 * - VITE_UPLOADS_BASE_URL: Base URL for uploaded files (e.g., http://localhost:5000/api/uploads or https://y4d.ngo/dev/api/uploads)
 */

// Get API base URL from environment variable with fallback
// Handle empty strings (Vite may return empty string instead of undefined)
const getEnvVar = (key, fallback) => {
  const value = import.meta.env[key];
  // Return fallback if value is undefined, null, or empty string
  return (value && value.trim() !== '') ? value.trim() : fallback;
};

// For local development only Provide sensible local defaults with protocol so fetch() works correctly
const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'https://y4d.ngo/dev/api');
const UPLOADS_BASE_URL = getEnvVar('VITE_UPLOADS_BASE_URL', getEnvVar('VITE_UPLOADS_BASE_UR', 'https://y4d.ngo/dev/api/uploads')); 
// For QA/Production only
// const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'https://y4d.ngo/dev/api');
// const UPLOADS_BASE_URL = getEnvVar('VITE_UPLOADS_BASE_URL', 'https://y4d.ngo/dev/api/uploads'); 

// Debug logging (only in development)
import logger from '../utils/logger';

// Only log in development mode (not in production builds)
if (import.meta.env.DEV && import.meta.env.MODE === 'development') {
  logger.log('🔧 API Configuration:', {
    'VITE_API_BASE_URL (raw)': import.meta.env.VITE_API_BASE_URL,
    'VITE_UPLOADS_BASE_URL (raw)': import.meta.env.VITE_UPLOADS_BASE_URL,
    'API_BASE_URL (resolved)': API_BASE_URL,
    'UPLOADS_BASE_URL (resolved)': UPLOADS_BASE_URL,
    'Mode': import.meta.env.MODE,
    'All env vars': Object.keys(import.meta.env).filter(k => k.startsWith('VITE_'))
  });
}

// Server base URL (without /api) - useful for some endpoints
const SERVER_BASE_URL = API_BASE_URL.replace('/api', '');

// Export configuration
export const API_CONFIG = {
  // Base URLs
  API_BASE: API_BASE_URL,
  UPLOADS_BASE: UPLOADS_BASE_URL,
  SERVER_BASE: SERVER_BASE_URL,
  
  // Helper function to get full upload URL
  getUploadUrl: (path) => {
    if (!path) return '';
    // If path already starts with http, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // If path starts with /, remove it
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${UPLOADS_BASE_URL}/${cleanPath}`;
  },
  
  // Helper function to get full API URL
  getApiUrl: (endpoint) => {
    if (!endpoint) return API_BASE_URL;
    // If endpoint already starts with http, return as is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    // If endpoint starts with /, use it directly with API_BASE
    if (endpoint.startsWith('/')) {
      return `${API_BASE_URL}${endpoint}`;
    }
    // Otherwise, add / between base and endpoint
    return `${API_BASE_URL}/${endpoint}`;
  }
};

// Export individual constants for backward compatibility
export const API_BASE = API_CONFIG.API_BASE;
export const UPLOADS_BASE = API_CONFIG.UPLOADS_BASE;
export const SERVER_BASE = API_CONFIG.SERVER_BASE;

// Default export
export default API_CONFIG;

