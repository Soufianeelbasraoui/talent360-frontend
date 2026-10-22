import { axiosClient } from './axiosClient';

export const applicationService = {
  async apply(jobOfferId) {
    const response = await axiosClient.post('/api/applications', { jobOfferId });
    return response.data;
  },

  async getMyApplications(page = 0, size = 10) {
    const response = await axiosClient.get('/api/applications/me', {
      params: { page, size },
    });
    return response.data;
  },

  async getJobApplications(jobId, page = 0, size = 20, sort = 'matchingScore,desc') {
    const response = await axiosClient.get(`/api/jobs/${jobId}/applications`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  async updateApplicationStatus(id, status) {
    const response = await axiosClient.patch(`/api/applications/${id}/status`, { status });
    return response.data;
  },
};
