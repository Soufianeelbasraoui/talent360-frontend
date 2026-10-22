/**
 * @file JSDoc type definitions for Application DTOs.
 */

/**
 * @typedef {Object} Application
 * @property {number} id
 * @property {number} candidateId
 * @property {string} candidateName
 * @property {string} candidateEmail
 * @property {number} jobOfferId
 * @property {string} jobOfferTitle
 * @property {'NEW'|'SCREENING'|'OFFER'|'HIRED'|'REJECTED'} status
 * @property {number} [matchingScore]
 * @property {string} appliedAt
 */

/**
 * @typedef {Object} ApplicationRequest
 * @property {number} jobOfferId
 */

/**
 * @typedef {Object} ApplicationStatusUpdateRequest
 * @property {'NEW'|'SCREENING'|'OFFER'|'HIRED'|'REJECTED'} status
 */

export {};
