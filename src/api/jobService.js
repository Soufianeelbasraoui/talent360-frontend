import { axiosClient } from './axiosClient';

export const jobService = {
  async searchJobs(params = {}) {
    const response = await axiosClient.get('/api/jobs', { params });
    return response.data;
  },

  async getJobById(id) {
    const response = await axiosClient.get(`/api/jobs/${id}`);
    return response.data;
  },

  async createJob(payload) {
    const response = await axiosClient.post('/api/jobs', payload);
    return response.data;
  },

  async updateJob(id, payload) {
    const response = await axiosClient.put(`/api/jobs/${id}`, payload);
    return response.data;
  },

  async deleteJob(id) {
    await axiosClient.delete(`/api/jobs/${id}`);
  },

  async publishJob(id) {
    const response = await axiosClient.patch(`/api/jobs/${id}/publish`);
    return response.data;
  },

  async closeJob(id) {
    const response = await axiosClient.patch(`/api/jobs/${id}/close`);
    return response.data;
  },

  async getRecommendedJobs(page = 0, size = 10) {
    const response = await axiosClient.get('/api/jobs/recommended', {
      params: { page, size },
    });
    return response.data;
  },
};
