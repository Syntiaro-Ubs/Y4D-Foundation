/**
 * Partners Service
 * Partner logo-related API calls
 */
import apiClient from '../client/axiosClient';
import { API_ROUTES } from '../endpoints/routes';
import { handleResponse, handleApiError } from '../../utils/api/responseHandler';
import logger from '../../utils/logger';

export const partnersService = {
  /**
   * Get all partners (with optional region filter)
   * @param {string} region - Optional region ('india', 'global', 'both')
   * @returns {Promise<Array>} Array of partners
   */
  getPartners: async (region = null) => {
    try {
      let url = API_ROUTES.PARTNERS.BASE;
      if (region && region !== 'all') {
        url += `?region=${region}`;
      }
      
      logger.log(`🔄 Fetching partners: region=${region || 'all'}`);
      const response = await apiClient.get(url);
      const data = handleResponse(response);
      logger.log(`✅ Partners loaded: ${data?.length || 0} items`);
      return data || [];
    } catch (error) {
      handleApiError(error, { 
        context: 'partnersService.getPartners',
        showToast: false,
      });
      return [];
    }
  },

  /**
   * Get partner by ID
   * @param {number} id - Partner ID
   * @returns {Promise<Object>} Partner object
   */
  getPartnerById: async (id) => {
    try {
      const response = await apiClient.get(API_ROUTES.PARTNERS.BY_ID(id));
      return handleResponse(response);
    } catch (error) {
      handleApiError(error, { 
        context: `partnersService.getPartnerById(${id})`,
        showToast: true,
      });
      throw error;
    }
  },

  /**
   * Create new partner
   * @param {FormData} formData - Partner data with logo file
   * @returns {Promise<Object>} Created partner
   */
  createPartner: async (formData) => {
    try {
      logger.log('📤 Creating partner...');
      const response = await apiClient.post(API_ROUTES.PARTNERS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = handleResponse(response);
      logger.log('✅ Partner created successfully');
      return data;
    } catch (error) {
      handleApiError(error, { 
        context: 'partnersService.createPartner',
        showToast: true,
      });
      throw error;
    }
  },

  /**
   * Update partner
   * @param {number} id - Partner ID
   * @param {FormData} formData - Updated partner data
   * @returns {Promise<Object>} Updated partner
   */
  updatePartner: async (id, formData) => {
    try {
      logger.log(`✏️ Updating partner ${id}...`);
      const response = await apiClient.put(API_ROUTES.PARTNERS.BY_ID(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = handleResponse(response);
      logger.log('✅ Partner updated successfully');
      return data;
    } catch (error) {
      handleApiError(error, { 
        context: `partnersService.updatePartner(${id})`,
        showToast: true,
      });
      throw error;
    }
  },

  /**
   * Delete partner
   * @param {number} id - Partner ID
   * @returns {Promise<void>}
   */
  deletePartner: async (id) => {
    try {
      logger.log(`🗑️ Deleting partner ${id}...`);
      await apiClient.delete(API_ROUTES.PARTNERS.BY_ID(id));
      logger.log('✅ Partner deleted successfully');
    } catch (error) {
      handleApiError(error, { 
        context: `partnersService.deletePartner(${id})`,
        showToast: true,
      });
      throw error;
    }
  },

  /**
   * Toggle partner active status
   * @param {number} id - Partner ID
   * @param {boolean} isActive - Active status
   * @returns {Promise<Object>} Updated status response
   */
  togglePartnerStatus: async (id, isActive) => {
    try {
      logger.log(`🔄 Toggling partner ${id} status to ${isActive}...`);
      const response = await apiClient.patch(
        `${API_ROUTES.PARTNERS.BASE}/${id}/toggle-status`,
        { is_active: isActive }
      );
      const data = handleResponse(response);
      logger.log('✅ Partner status updated successfully');
      return data;
    } catch (error) {
      handleApiError(error, { 
        context: `partnersService.togglePartnerStatus(${id})`,
        showToast: true,
      });
      throw error;
    }
  },
};

export default partnersService;
