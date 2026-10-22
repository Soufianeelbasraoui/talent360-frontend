import { axiosClient } from './axiosClient';

export const aiService = {
  async analyzeCv(candidateDocumentId) {
    const response = await axiosClient.post('/api/ai/cv/analyze', { candidateDocumentId });
    return response.data;
  },

  async matchJobsForCandidate() {
    const response = await axiosClient.post('/api/ai/matching/jobs');
    return response.data;
  },

  async matchCandidatesForJob(jobId) {
    const response = await axiosClient.post('/api/ai/matching/candidates', { jobId });
    return response.data;
  },

  async generateJobDescription(payload) {
    const response = await axiosClient.post('/api/ai/job-description/generate', payload);
    return response.data;
  },
};
