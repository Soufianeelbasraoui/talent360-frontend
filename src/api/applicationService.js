import { axiosClient } from './axiosClient';

/**
 * Service for candidate applications lifecycle and recruiter review.
 */
export const applicationService = {
  /**
   * Submit job application (Candidate only).
   * @param {number} jobOfferId
   * @returns {Promise<import('@/models/application').Application>}
   */
  async apply(jobOfferId) {
    const response = await axiosClient.post('/api/applications', { jobOfferId });
    return response.data;
  },

  /**
   * Get applications of logged-in candidate.
   * @param {number} [page=0]
   * @param {number} [size=10]
   * @returns {Promise<import('@/models/common').Page<import('@/models/application').Application>>}
   */
  async getMyApplications(page = 0, size = 10) {
    const response = await axiosClient.get('/api/applications/me', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get applications for a specific job offer (Recruiter / Admin).
   * @param {number} jobId
   * @param {number} [page=0]
   * @param {number} [size=20]
   * @param {string} [sort='matchingScore,desc']
   * @returns {Promise<import('@/models/common').Page<import('@/models/application').Application>>}
   */
  async getJobApplications(jobId, page = 0, size = 20, sort = 'matchingScore,desc') {
    const response = await axiosClient.get(`/api/jobs/${jobId}/applications`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  /**
   * Move application to new workflow status.
   * @param {number} id
   * @param {'NEW'|'SCREENING'|'OFFER'|'HIRED'|'REJECTED'} status
   * @returns {Promise<import('@/models/application').Application>}
   */
  async updateApplicationStatus(id, status) {
    const response = await axiosClient.patch(`/api/applications/${id}/status`, { status });
    return response.data;
  },
};
