// File upload security validation

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const;

const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'] as const;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileUpload(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB).` };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return { valid: false, error: `File type "${file.type || 'unknown'}" is not allowed. Only PDF, PNG, and JPG are accepted.` };
  }

  // Check extension
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext as any)) {
    return { valid: false, error: `File extension "${ext}" is not allowed. Only .pdf, .png, .jpg are accepted.` };
  }

  return { valid: true };
}

export function validateMultipleFiles(files: File[]): FileValidationResult {
  for (const file of files) {
    const result = validateFileUpload(file);
    if (!result.valid) return { valid: false, error: `${file.name}: ${result.error}` };
  }
  return { valid: true };
}
