/**
 * @file JSDoc type definitions for Job Offer DTOs.
 */

/**
 * @typedef {Object} JobOffer
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {number} departmentId
 * @property {string} departmentName
 * @property {number} recruiterId
 * @property {string} recruiterEmail
 * @property {string} location
 * @property {'CDI'|'CDD'|'FREELANCE'|'STAGE'} contractType
 * @property {'REMOTE'|'HYBRID'|'ONSITE'} workMode
 * @property {'JUNIOR'|'MID'|'SENIOR'} experienceLevel
 * @property {string[]} [requiredSkills]
 * @property {'DRAFT'|'OPEN'|'PAUSED'|'CLOSED'} status
 * @property {string} [publishedAt]
 * @property {string} [closedAt]
 * @property {number} [versionCount]
 * @property {number} [matchScore]
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} JobOfferRequest
 * @property {string} title
 * @property {string} description
 * @property {number} departmentId
 * @property {string} location
 * @property {'CDI'|'CDD'|'FREELANCE'|'STAGE'} contractType
 * @property {'REMOTE'|'HYBRID'|'ONSITE'} workMode
 * @property {'JUNIOR'|'MID'|'SENIOR'} experienceLevel
 * @property {string[]} [requiredSkills]
 */

export {};
