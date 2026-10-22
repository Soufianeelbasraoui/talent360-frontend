import { axiosClient } from './axiosClient';

/**
 * Service for AI extraction, candidate-job matching, and JD generation.
 */
export const aiService = {
  /**
   * Analyze uploaded CV and extract skills, education, languages.
   * @param {number} candidateDocumentId
   * @returns {Promise<import('@/models/ai').CvAnalysisResponse>}
   */
  async analyzeCv(candidateDocumentId) {
    const response = await axiosClient.post('/api/ai/cv/analyze', { candidateDocumentId });
    return response.data;
  },

  /**
   * Match and score jobs for the authenticated candidate.
   * @returns {Promise<import('@/models/ai').JobMatchResult[]>}
   */
  async matchJobsForCandidate() {
    const response = await axiosClient.post('/api/ai/matching/jobs');
    return response.data;
  },

  /**
   * Match and rank candidates for a job offer (Recruiter / Admin).
   * @param {number} jobId
   * @returns {Promise<import('@/models/ai').CandidateMatchResult[]>}
   */
  async matchCandidatesForJob(jobId) {
    const response = await axiosClient.post('/api/ai/matching/candidates', { jobId });
    return response.data;
  },

  /**
   * Generate draft job description with AI (Recruiter only).
   * @param {import('@/models/ai').JdGenerateRequest} payload
   * @returns {Promise<import('@/models/ai').JdGeneratedDto>}
   */
  async generateJobDescription(payload) {
    const response = await axiosClient.post('/api/ai/job-description/generate', payload);
    return response.data;
  },
};
