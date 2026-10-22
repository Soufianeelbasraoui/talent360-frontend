import { describe, it, expect } from 'vitest';
import { validateCvFile } from '@/utils/fileValidation';

describe('validateCvFile', () => {
  it('rejects empty/null file', () => {
    const result = validateCvFile(null);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Please choose a document');
  });

  it('rejects file exceeding 5MB limit', () => {
    const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'resume.pdf', {
      type: 'application/pdf',
    });
    const result = validateCvFile(largeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('exceeds the 5 MB limit');
  });

  it('rejects unsupported file extensions', () => {
    const exeFile = new File(['code'], 'malware.exe', {
      type: 'application/octet-stream',
    });
    const result = validateCvFile(exeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file extension');
  });

  it('accepts valid PDF file under 5MB', () => {
    const pdfFile = new File(['valid pdf content'], 'cv_sara.pdf', {
      type: 'application/pdf',
    });
    const result = validateCvFile(pdfFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('accepts valid DOCX file under 5MB', () => {
    const docxFile = new File(
      ['valid word content'],
      'cv_sara.docx',
      {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }
    );
    const result = validateCvFile(docxFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});
