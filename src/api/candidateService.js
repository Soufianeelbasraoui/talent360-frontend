import { axiosClient } from './axiosClient';

export const candidateService = {
  async getCandidate(id = 'me') {
    if (id && id !== 'me') {
      const response = await axiosClient.get(`/api/candidates/${id}`);
      if (response.data?.id) {
        try { localStorage.setItem('t360_candidate_id', String(response.data.id)); } catch {}
      }
      return response.data;
    }

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

    try {
      const apps = await axiosClient.get('/api/applications/me', { params: { page: 0, size: 1 } });
      const foundId = apps.data?.content?.[0]?.candidateId;
      if (foundId) {
        try { localStorage.setItem('t360_candidate_id', String(foundId)); } catch {}
        const response = await axiosClient.get(`/api/candidates/${foundId}`);
        return response.data;
      }
    } catch {}

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

  async updateCandidate(id, data) {
    let candidateId = id;
    if (!candidateId || candidateId === 'me') {
      try { candidateId = localStorage.getItem('t360_candidate_id'); } catch {}
    }
    const response = await axiosClient.put(`/api/candidates/${candidateId}`, data);
    return response.data;
  },

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

  async downloadCv(candidateId) {
    const response = await axiosClient.get(`/api/candidates/${candidateId}/cv`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteCv(candidateId) {
    await axiosClient.delete(`/api/candidates/${candidateId}/cv`);
  },
};
