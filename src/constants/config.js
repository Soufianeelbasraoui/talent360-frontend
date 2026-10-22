/**
 * @file Application configuration and environment variables.
 */

export const APP_CONFIG = Object.freeze({
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  DEBOUNCE_DELAY_MS: 300,
  MAX_CV_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  ALLOWED_CV_EXTENSIONS: ['.pdf', '.docx', '.doc'],
  ALLOWED_CV_MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ],
  DEFAULT_PAGE_SIZE: 10,
});
