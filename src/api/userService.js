import { axiosClient } from './axiosClient';

/**
 * Service for user and administrative account management.
 */
export const userService = {
  /**
   * Get current authenticated user details.
   * @returns {Promise<import('@/models/user').User>}
   */
  async getMe() {
    const response = await axiosClient.get('/api/users/me');
    return response.data;
  },

  /**
   * Update current user profile or password.
   * @param {import('@/models/user').UpdateUserRequest} data
   * @returns {Promise<import('@/models/user').User>}
   */
  async updateMe(data) {
    const response = await axiosClient.put('/api/users/me', data);
    return response.data;
  },

  /**
   * List paginated users (Admin only).
   * @param {number} [page=0]
   * @param {number} [size=20]
   * @returns {Promise<import('@/models/common').Page<import('@/models/user').User>>}
   */
  async getAllUsers(page = 0, size = 20) {
    const response = await axiosClient.get('/api/users', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Toggle user active status (Admin only).
   * @param {number} id
   * @param {boolean} active
   * @returns {Promise<import('@/models/user').User>}
   */
  async updateUserStatus(id, active) {
    const response = await axiosClient.patch(`/api/users/${id}/status`, { active });
    return response.data;
  },

  /**
   * Delete user permanently (Admin only).
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteUser(id) {
    await axiosClient.delete(`/api/users/${id}`);
  },
};
