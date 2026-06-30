/**
 * API Response Handler Utility
 * Handles standardized backend responses from Common Response Utility
 * 
 * Backend Response Format:
 * Success: { success: true, data: {...}, message: "..." }
 * Error: { success: false, error: { message: "...", details: "..." } }
 */

import toast from './toast';
import logger from './logger';

/**
 * Extract data from standardized API response
 * @param {Object} response - Axios response object
 * @returns {*} - The data from the response
 */
export const extractData = (response) => {
  if (!response || !response.data) {
    return null;
  }

  const { data: responseData } = response;

  // Check if it's the new standardized format
  if (responseData.success !== undefined) {
    // New standardized format
    if (responseData.data !== undefined) {
      return responseData.data;
    }
    return responseData;
  }

  // Legacy format - return data as is (for backward compatibility)
  return responseData;
};

/**
 * Extract error message from standardized API response
 * @param {Error} error - Axios error object
 * @returns {string} - Error message
 */
export const extractErrorMessage = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Network error (no response from server)
  if (!error.response) {
    return error.message || 'Network error. Please check your connection.';
  }

  const { data } = error.response;

  // Check if it's the new standardized format
  if (data && data.success === false && data.error) {
    return data.error.message || 'An error occurred';
  }

  // Legacy format - try to extract error message
  if (data) {
    // Try different possible error formats
    if (data.error) {
      return typeof data.error === 'string' ? data.error : data.error.message || 'An error occurred';
    }
    if (data.message) {
      return data.message;
    }
    if (data.details) {
      return data.details;
    }
  }

  // Fallback to HTTP status text
  return error.response.statusText || 'An error occurred';
};

/**
 * Extract validation errors from standardized API response
 * @param {Error} error - Axios error object
 * @returns {Array} - Array of validation errors
 */
export const extractValidationErrors = (error) => {
  if (!error?.response?.data) {
    return [];
  }

  const { data } = error.response;

  // Check if it's the new standardized format
  if (data.success === false && data.error?.validationErrors) {
    return data.error.validationErrors;
  }

  // Legacy format
  if (data.errors) {
    return Array.isArray(data.errors) ? data.errors : [data.errors];
  }

  return [];
};

/**
 * Extract success message from standardized API response
 * @param {Object} response - Axios response object
 * @returns {string|null} - Success message or null
 */
export const extractSuccessMessage = (response) => {
  if (!response?.data) {
    return null;
  }

  const { data } = response;

  // Check if it's the new standardized format
  if (data.success === true && data.message) {
    return data.message;
  }

  return null;
};

/**
 * Extract pagination metadata from standardized API response
 * @param {Object} response - Axios response object
 * @returns {Object|null} - Pagination metadata or null
 */
export const extractPagination = (response) => {
  if (!response?.data) {
    return null;
  }

  const { data } = response;

  // Check if it's the new standardized format with pagination
  if (data.success === true && data.pagination) {
    return data.pagination;
  }

  return null;
};

/**
 * Handle API error with automatic toast notification
 * @param {Error} error - Axios error object
 * @param {Object} options - Options
 * @param {boolean} options.showToast - Show toast notification (default: true)
 * @param {string} options.defaultMessage - Default error message
 * @returns {string} - Error message
 */
export const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    defaultMessage = 'An error occurred'
  } = options;

  const errorMessage = extractErrorMessage(error);
  const validationErrors = extractValidationErrors(error);

  // Log error
  logger.error('API Error:', {
    message: errorMessage,
    status: error.response?.status,
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined
  });

  // Show toast notification
  if (showToast) {
    if (validationErrors.length > 0) {
      // Show validation errors
      const validationMessage = validationErrors
        .map(err => `${err.field || ''}: ${err.message || err}`)
        .join(', ');
      toast.error(`Validation failed: ${validationMessage}`);
    } else {
      toast.error(errorMessage || defaultMessage);
    }
  }

  return errorMessage;
};

/**
 * Handle API success with automatic toast notification
 * @param {Object} response - Axios response object
 * @param {Object} options - Options
 * @param {boolean} options.showToast - Show toast notification (default: true)
 * @param {string} options.customMessage - Custom success message (overrides response message)
 * @returns {*} - Extracted data
 */
export const handleApiSuccess = (response, options = {}) => {
  const {
    showToast = true,
    customMessage = null
  } = options;

  const data = extractData(response);
  const message = customMessage || extractSuccessMessage(response);

  // Show toast notification if message exists
  if (showToast && message) {
    toast.success(message);
  }

  return data;
};

/**
 * Wrapper for API calls that handles standardized responses
 * @param {Promise} apiCall - Promise from axios call
 * @param {Object} options - Options
 * @param {boolean} options.showSuccessToast - Show success toast (default: true)
 * @param {boolean} options.showErrorToast - Show error toast (default: true)
 * @param {string} options.successMessage - Custom success message
 * @returns {Promise} - Promise that resolves with data or rejects with error message
 */
export const apiCall = async (apiCall, options = {}) => {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = null
  } = options;

  try {
    const response = await apiCall;
    const data = extractData(response);
    const message = successMessage || extractSuccessMessage(response);

    if (showSuccessToast && message) {
      toast.success(message);
    }

    return data;
  } catch (error) {
    const errorMessage = handleApiError(error, { showToast: showErrorToast });
    throw new Error(errorMessage);
  }
};

/**
 * Check if response is successful
 * @param {Object} response - Axios response object
 * @returns {boolean} - True if successful
 */
export const isSuccessResponse = (response) => {
  if (!response?.data) {
    return false;
  }

  const { data } = response;

  // New standardized format
  if (data.success !== undefined) {
    return data.success === true;
  }

  // Legacy format - assume success if no error field
  return !data.error;
};

/**
 * Check if response has pagination
 * @param {Object} response - Axios response object
 * @returns {boolean} - True if has pagination
 */
export const hasPagination = (response) => {
  return extractPagination(response) !== null;
};

export default {
  extractData,
  extractErrorMessage,
  extractValidationErrors,
  extractSuccessMessage,
  extractPagination,
  handleApiError,
  handleApiSuccess,
  apiCall,
  isSuccessResponse,
  hasPagination
};

