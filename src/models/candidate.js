/**
 * @file JSDoc type definitions for Candidate DTOs.
 */

/**
 * @typedef {Object} CandidateDocument
 * @property {number} id
 * @property {string} fileName
 * @property {string} fileUrl
 * @property {string} fileType
 * @property {string} uploadedAt
 */

/**
 * @typedef {Object} Candidate
 * @property {number} id
 * @property {number} userId
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [phone]
 * @property {string} [location]
 * @property {string} [linkedin]
 * @property {string} [github]
 * @property {string} [bio]
 * @property {string[]} [skills]
 * @property {number} [experienceYears]
 * @property {string} [education]
 * @property {string} [preferencesJson]
 * @property {CandidateDocument[]} [documents]
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} CandidateUpdateRequest
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [phone]
 * @property {string} [location]
 * @property {string} [linkedin]
 * @property {string} [github]
 * @property {string} [bio]
 * @property {string[]} [skills]
 * @property {number} [experienceYears]
 * @property {string} [education]
 * @property {string} [preferencesJson]
 */

export {};
