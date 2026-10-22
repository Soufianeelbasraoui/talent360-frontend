/**
 * @file JSDoc type definitions for common pagination and API error responses.
 */

/**
 * @template T
 * @typedef {Object} Page
 * @property {T[]} content
 * @property {number} [pageNumber]
 * @property {number} [number]
 * @property {number} [pageSize]
 * @property {number} [size]
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {boolean} last
 * @property {boolean} first
 */

/**
 * @typedef {Object} ApiError
 * @property {string} timestamp
 * @property {number} status
 * @property {string} message
 * @property {string} path
 * @property {Record<string, string>} [errors]
 */

export {};
