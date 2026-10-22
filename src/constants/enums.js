
export const Role = Object.freeze({
  ADMIN: 'ADMIN',
  RECRUITER: 'RECRUITER',
  CANDIDATE: 'CANDIDATE',
});

export const JobStatus = Object.freeze({
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  PAUSED: 'PAUSED',
  CLOSED: 'CLOSED',
});

export const ApplicationStatus = Object.freeze({
  NEW: 'NEW',
  SCREENING: 'SCREENING',
  OFFER: 'OFFER',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
});

export const ContractType = Object.freeze({
  CDI: 'CDI',
  CDD: 'CDD',
  FREELANCE: 'FREELANCE',
  STAGE: 'STAGE',
});

export const WorkMode = Object.freeze({
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ONSITE: 'ONSITE',
});

export const ExperienceLevel = Object.freeze({
  JUNIOR: 'JUNIOR',
  MID: 'MID',
  SENIOR: 'SENIOR',
});

export const AIGenerationType = Object.freeze({
  JD_GENERATION: 'JD_GENERATION',
  CV_ANALYSIS: 'CV_ANALYSIS',
  MATCHING: 'MATCHING',
});
