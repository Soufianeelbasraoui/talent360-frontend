import { axiosClient } from './axiosClient';

/**
 * Service for job offers search, creation, updates, and recommendations.
 */
export const jobService = {
  /**
   * Search jobs with filters and pagination.
   * @param {Object} [params]
   * @param {string} [params.keyword]
   * @param {string} [params.location]
   * @param {string} [params.contractType]
   * @param {string} [params.workMode]
   * @param {string} [params.experienceLevel]
   * @param {string} [params.status]
   * @param {number} [params.departmentId]
   * @param {number} [params.page=0]
   * @param {number} [params.size=10]
   * @returns {Promise<import('@/models/common').Page<import('@/models/job').JobOffer>>}
   */
  async searchJobs(params = {}) {
    const response = await axiosClient.get('/api/jobs', { params });
    return response.data;
  },

  /**
   * Get single job by ID.
   * @param {number} id
   * @returns {Promise<import('@/models/job').JobOffer>}
   */
  async getJobById(id) {
    const response = await axiosClient.get(`/api/jobs/${id}`);
    return response.data;
  },

  /**
   * Create a new job offer in DRAFT status (Recruiter only).
   * @param {import('@/models/job').JobOfferRequest} payload
   * @returns {Promise<import('@/models/job').JobOffer>}
   */
  async createJob(payload) {
    const response = await axiosClient.post('/api/jobs', payload);
    return response.data;
  },

  /**
   * Update an existing job offer.
   * @param {number} id
   * @param {import('@/models/job').JobOfferRequest} payload
   * @returns {Promise<import('@/models/job').JobOffer>}
   */
  async updateJob(id, payload) {
    const response = await axiosClient.put(`/api/jobs/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a job offer.
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteJob(id) {
    await axiosClient.delete(`/api/jobs/${id}`);
  },

  /**
   * Publish job offer (OPEN status).
   * @param {number} id
   * @returns {Promise<import('@/models/job').JobOffer>}
   */
  async publishJob(id) {
    const response = await axiosClient.patch(`/api/jobs/${id}/publish`);
    return response.data;
  },

  /**
   * Close job offer (CLOSED status).
   * @param {number} id
   * @returns {Promise<import('@/models/job').JobOffer>}
   */
  async closeJob(id) {
    const response = await axiosClient.patch(`/api/jobs/${id}/close`);
    return response.data;
  },

  /**
   * Get AI-recommended jobs for authenticated candidate.
   * @param {number} [page=0]
   * @param {number} [size=10]
   * @returns {Promise<import('@/models/common').Page<import('@/models/job').JobOffer>>}
   */
  async getRecommendedJobs(page = 0, size = 10) {
    const response = await axiosClient.get('/api/jobs/recommended', {
      params: { page, size },
    });
    return response.data;
  },
};
