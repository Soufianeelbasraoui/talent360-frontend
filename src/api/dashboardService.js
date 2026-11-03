import { axiosClient } from './axiosClient';

export const dashboardService = {
  async getRecruiterStats() {
    const response = await axiosClient.get('/api/dashboard/recruiter');
    return response.data;
  },

  async getAdminStats() {
    const response = await axiosClient.get('/api/dashboard/admin');
    return response.data;
  },
};

