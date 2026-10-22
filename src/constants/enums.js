/**
 * @file System enums matching backend Spring Boot definitions.
 * All enums are frozen to prevent accidental mutation.
 */

/**
 * System user roles.
 * @enum {string}
 */
export const Role = Object.freeze({
  ADMIN: 'ADMIN',
  RECRUITER: 'RECRUITER',
  CANDIDATE: 'CANDIDATE',
});

/**
 * Job offer publication lifecycle statuses.
 * @enum {string}
 */
export const JobStatus = Object.freeze({
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  PAUSED: 'PAUSED',
  CLOSED: 'CLOSED',
});

/**
 * Candidate application workflow statuses.
 * @enum {string}
 */
export const ApplicationStatus = Object.freeze({
  NEW: 'NEW',
  SCREENING: 'SCREENING',
  OFFER: 'OFFER',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
});

/**
 * Employment contract types.
 * @enum {string}
 */
export const ContractType = Object.freeze({
  CDI: 'CDI',
  CDD: 'CDD',
  FREELANCE: 'FREELANCE',
  STAGE: 'STAGE',
});

/**
 * Work arrangement modes.
 * @enum {string}
 */
export const WorkMode = Object.freeze({
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ONSITE: 'ONSITE',
});

/**
 * Candidate experience tiers.
 * @enum {string}
 */
export const ExperienceLevel = Object.freeze({
  JUNIOR: 'JUNIOR',
  MID: 'MID',
  SENIOR: 'SENIOR',
});

/**
 * AI generation log types.
 * @enum {string}
 */
export const AIGenerationType = Object.freeze({
  JD_GENERATION: 'JD_GENERATION',
  CV_ANALYSIS: 'CV_ANALYSIS',
  MATCHING: 'MATCHING',
});
