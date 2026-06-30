/**
 * Payment Service
 * All payment-related API calls (Razorpay integration)
 */
import apiClient from '../client/axiosClient';
import { API_ROUTES } from '../endpoints/routes';
import { handleApiError } from '../../utils/api/responseHandler';
import logger from '../../utils/logger';

export const paymentService = {
  /**
   * Get Razorpay public key
   * @returns {Promise<string>} Razorpay public key
   */
  getRazorpayKey: async () => {
    try {
      logger.log('🔑 Fetching Razorpay key...');
      const response = await apiClient.get(API_ROUTES.PAYMENT.KEY);
      const responseData = response.data;
      logger.log('✅ Razorpay key received');
      return responseData.key || responseData;
    } catch (error) {
      handleApiError(error, { 
        context: 'paymentService.getRazorpayKey',
        showToast: true,
      });
      throw error;
    }
  },

  /**
   * Create Razorpay order
   * @param {Object} orderData - { amount, name, email, pan, message }
   * @returns {Promise<Object>} Order details with order_id
   */
  createOrder: async (orderData) => {
    try {
      logger.log('💳 Creating payment order...');
      const response = await apiClient.post(API_ROUTES.PAYMENT.CREATE_ORDER, orderData);
      const responseData = response.data;
      logger.log('✅ Payment order created');
      return responseData;
    } catch (error) {
      handleApiError(error, { 
        context: 'paymentService.createOrder',
        showToast: true,
      });
      throw error;
    }
  },

  /**
   * Verify payment
   * @param {Object} paymentData - { razorpay_payment_id, razorpay_order_id, razorpay_signature }
   * @returns {Promise<Object>} Verification result
   */
  verifyPayment: async (paymentData) => {
    try {
      logger.log('✅ Verifying payment...');
      const response = await apiClient.post(API_ROUTES.PAYMENT.VERIFY_PAYMENT, paymentData);
      const responseData = response.data;
      logger.log('✅ Payment verified successfully');
      return responseData;
    } catch (error) {
      handleApiError(error, { 
        context: 'paymentService.verifyPayment',
        showToast: true,
      });
      throw error;
    }
  },
};

export default paymentService;

