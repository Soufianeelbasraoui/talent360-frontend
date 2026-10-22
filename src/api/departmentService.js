import { axiosClient } from './axiosClient';

/**
 * Service for department organization management.
 */
export const departmentService = {
  /**
   * List all company departments.
   * @returns {Promise<import('@/models/department').Department[]>}
   */
  async getAllDepartments() {
    const response = await axiosClient.get('/api/departments');
    return response.data;
  },

  /**
   * Get department by ID.
   * @param {number} id
   * @returns {Promise<import('@/models/department').Department>}
   */
  async getDepartmentById(id) {
    const response = await axiosClient.get(`/api/departments/${id}`);
    return response.data;
  },

  /**
   * Create department (Admin / Recruiter).
   * @param {import('@/models/department').DepartmentRequest} payload
   * @returns {Promise<import('@/models/department').Department>}
   */
  async createDepartment(payload) {
    const response = await axiosClient.post('/api/departments', payload);
    return response.data;
  },

  /**
   * Update department (Admin / Recruiter).
   * @param {number} id
   * @param {import('@/models/department').DepartmentRequest} payload
   * @returns {Promise<import('@/models/department').Department>}
   */
  async updateDepartment(id, payload) {
    const response = await axiosClient.put(`/api/departments/${id}`, payload);
    return response.data;
  },

  /**
   * Delete department (Admin only).
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteDepartment(id) {
    await axiosClient.delete(`/api/departments/${id}`);
  },
};
