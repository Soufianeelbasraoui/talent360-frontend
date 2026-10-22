import { axiosClient } from './axiosClient';

/**
 * Service for candidate profile and CV operations.
 */
export const candidateService = {
  /**
   * Get candidate profile by ID or current logged in candidate.
   * @param {number|string} [id='me']
   * @returns {Promise<import('@/models/candidate').Candidate>}
   */
  async getCandidate(id = 'me') {
    if (id && id !== 'me') {
      const response = await axiosClient.get(`/api/candidates/${id}`);
      if (response.data?.id) {
        try { localStorage.setItem('t360_candidate_id', String(response.data.id)); } catch {}
      }
      return response.data;
    }

    // 1. Check cached candidate ID
    let cachedId = null;
    try { cachedId = localStorage.getItem('t360_candidate_id'); } catch {}
    if (cachedId) {
      try {
        const response = await axiosClient.get(`/api/candidates/${cachedId}`);
        if (response.data?.id) return response.data;
      } catch {
        try { localStorage.removeItem('t360_candidate_id'); } catch {}
      }
    }

    // 2. Try getting candidate ID from candidate applications
    try {
      const apps = await axiosClient.get('/api/applications/me', { params: { page: 0, size: 1 } });
      const foundId = apps.data?.content?.[0]?.candidateId;
      if (foundId) {
        try { localStorage.setItem('t360_candidate_id', String(foundId)); } catch {}
        const response = await axiosClient.get(`/api/candidates/${foundId}`);
        return response.data;
      }
    } catch {}

    // 3. Fallback: probe IDs (owner candidate will return 200)
    for (let probeId = 1; probeId <= 25; probeId++) {
      try {
        const response = await axiosClient.get(`/api/candidates/${probeId}`);
        if (response.data?.id) {
          try { localStorage.setItem('t360_candidate_id', String(response.data.id)); } catch {}
          return response.data;
        }
      } catch (err) {
        if (err?.response?.status === 403 || err?.response?.status === 404) {
          continue;
        }
        break;
      }
    }

    return null;
  },

  /**
   * Update candidate profile.
   * @param {number|string} id
   * @param {import('@/models/candidate').CandidateUpdateRequest} data
   * @returns {Promise<import('@/models/candidate').Candidate>}
   */
  async updateCandidate(id, data) {
    let candidateId = id;
    if (!candidateId || candidateId === 'me') {
      try { candidateId = localStorage.getItem('t360_candidate_id'); } catch {}
    }
    const response = await axiosClient.put(`/api/candidates/${candidateId}`, data);
    return response.data;
  },

  /**
   * Upload CV document with progress callback.
   * @param {number} candidateId
   * @param {File} file
   * @param {(progressEvent: any) => void} [onUploadProgress]
   * @returns {Promise<import('@/models/candidate').CandidateDocument>}
   */
  async uploadCv(candidateId, file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post(`/api/candidates/${candidateId}/cv`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  /**
   * Download candidate CV as blob.
   * @param {number} candidateId
   * @returns {Promise<Blob>}
   */
  async downloadCv(candidateId) {
    const response = await axiosClient.get(`/api/candidates/${candidateId}/cv`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete uploaded candidate CV.
   * @param {number} candidateId
   * @returns {Promise<void>}
   */
  async deleteCv(candidateId) {
    await axiosClient.delete(`/api/candidates/${candidateId}/cv`);
  },
};
