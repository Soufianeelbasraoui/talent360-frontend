import { APP_CONFIG } from '@/constants/config';

export function validateCvFile(file) {
  if (!file) {
    return { valid: false, error: 'Please choose a document to upload.' };
  }

  if (file.size > APP_CONFIG.MAX_CV_FILE_SIZE_BYTES) {
    const sizeMb = (APP_CONFIG.MAX_CV_FILE_SIZE_BYTES / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds the ${sizeMb} MB limit. Please select a smaller file.`,
    };
  }

  const fileName = file.name || '';
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) {
    return {
      valid: false,
      error: 'File has no extension. Only PDF and DOCX documents are accepted.',
    };
  }

  const ext = fileName.substring(dotIndex).toLowerCase();
  if (!APP_CONFIG.ALLOWED_CV_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension (${ext}). Only PDF (.pdf) and Word (.docx) files are supported.`,
    };
  }

  if (file.type && !APP_CONFIG.ALLOWED_CV_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a standard PDF or DOCX file.',
    };
  }

  return { valid: true };
}
