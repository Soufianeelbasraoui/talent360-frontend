/**
 * @file JSDoc type definitions for AI extraction, matching, and JD generation DTOs.
 */

/**
 * @typedef {Object} CvAnalysisResponse
 * @property {number} id
 * @property {number} candidateDocumentId
 * @property {string[]} skills
 * @property {number} experienceYears
 * @property {string} education
 * @property {string[]} languages
 * @property {string[]} certifications
 * @property {string} analyzedAt
 */

/**
 * @typedef {Object} MatchExplanation
 * @property {number} score
 * @property {string[]} matchingSkills
 * @property {string[]} missingSkills
 * @property {boolean} experienceMatch
 * @property {boolean} educationMatch
 * @property {string} summary
 */

/**
 * @typedef {Object} JobMatchResult
 * @property {number} jobId
 * @property {string} title
 * @property {string} departmentName
 * @property {string} location
 * @property {MatchExplanation} matchExplanation
 */

/**
 * @typedef {Object} CandidateMatchResult
 * @property {number} candidateId
 * @property {string} candidateName
 * @property {string} candidateEmail
 * @property {MatchExplanation} matchExplanation
 */

/**
 * @typedef {Object} JdGeneratedDto
 * @property {string} title
 * @property {string} description
 * @property {string[]} responsibilities
 * @property {string[]} requiredSkills
 * @property {string} profile
 * @property {string} conditions
 */

/**
 * @typedef {Object} JdGenerateRequest
 * @property {string} title
 * @property {string} department
 * @property {'JUNIOR'|'MID'|'SENIOR'} experienceLevel
 * @property {string[]} [skills]
 * @property {string} [location]
 * @property {'CDI'|'CDD'|'FREELANCE'|'STAGE'} [contractType]
 */

export {};
