/**
 * @file JSDoc type definitions for User and Auth DTOs.
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {'ADMIN'|'RECRUITER'|'CANDIDATE'} role
 * @property {boolean} active
 * @property {string} createdAt
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} accessToken
 * @property {string} [refreshToken]
 * @property {string} tokenType
 * @property {number} expiresInMs
 * @property {number} userId
 * @property {string} email
 * @property {'ADMIN'|'RECRUITER'|'CANDIDATE'} role
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} email
 * @property {string} password
 * @property {'ADMIN'|'RECRUITER'|'CANDIDATE'} role
 * @property {string} [firstName]
 * @property {string} [lastName]
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {string} [currentPassword]
 * @property {string} [newPassword]
 */

export {};
