import { axiosClient } from './axiosClient';

export const departmentService = {
  async getAllDepartments() {
    const response = await axiosClient.get('/api/departments');
    return response.data;
  },

  async getDepartmentById(id) {
    const response = await axiosClient.get(`/api/departments/${id}`);
    return response.data;
  },

  async createDepartment(payload) {
    const response = await axiosClient.post('/api/departments', payload);
    return response.data;
  },

  async updateDepartment(id, payload) {
    const response = await axiosClient.put(`/api/departments/${id}`, payload);
    return response.data;
  },

  async deleteDepartment(id) {
    await axiosClient.delete(`/api/departments/${id}`);
  },
};
