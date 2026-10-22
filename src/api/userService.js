import { axiosClient } from './axiosClient';

export const userService = {
  async getMe() {
    const response = await axiosClient.get('/api/users/me');
    return response.data;
  },

  async updateMe(data) {
    const response = await axiosClient.put('/api/users/me', data);
    return response.data;
  },

  async getAllUsers(page = 0, size = 20) {
    const response = await axiosClient.get('/api/users', {
      params: { page, size },
    });
    return response.data;
  },

  async updateUserStatus(id, active) {
    const response = await axiosClient.patch(`/api/users/${id}/status`, { active });
    return response.data;
  },

  async deleteUser(id) {
    await axiosClient.delete(`/api/users/${id}`);
  },
};
