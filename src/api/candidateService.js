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

    // Call /api/candidates/me directly
    try {
      const response = await axiosClient.get('/api/candidates/me');
      if (response.data?.id) {
        try { localStorage.setItem('t360_candidate_id', String(response.data.id)); } catch {}
        return response.data;
      }
    } catch {
      // Fallback: check cached ID
      let cachedId = null;
      try { cachedId = localStorage.getItem('t360_candidate_id'); } catch {}
      if (cachedId) {
        try {
          const response = await axiosClient.get(`/api/candidates/${cachedId}`);
          if (response.data?.id) return response.data;
        } catch {}
      }
    }

    return null;
  },

  async updateCandidate(id, data) {
    let candidateId = id;
    if (!candidateId || candidateId === 'me') {
      try { candidateId = localStorage.getItem('t360_candidate_id'); } catch {}
    }
    if (!candidateId || candidateId === 'me') {
      try {
        const me = await axiosClient.get('/api/candidates/me');
        if (me.data?.id) {
          candidateId = me.data.id;
          try { localStorage.setItem('t360_candidate_id', String(candidateId)); } catch {}
        }
      } catch {}
    }
    const response = await axiosClient.put(`/api/candidates/${candidateId}`, data);
    return response.data;
  },

  async uploadCv(candidateId, file, onUploadProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const url = candidateId && candidateId !== 'me'
      ? `/api/candidates/${candidateId}/cv`
      : '/api/candidates/me/cv';

    const response = await axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  async downloadCv(candidateId) {
    const url = candidateId && candidateId !== 'me'
      ? `/api/candidates/${candidateId}/cv`
      : '/api/candidates/me/cv';
    const response = await axiosClient.get(url, {
      responseType: 'blob',
    });
    return response.data;
  },

  async deleteCv(candidateId) {
    const url = candidateId && candidateId !== 'me'
      ? `/api/candidates/${candidateId}/cv`
      : '/api/candidates/me/cv';
    await axiosClient.delete(url);
  },
};
