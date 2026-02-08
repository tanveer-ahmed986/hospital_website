/**
 * Form Helper Utilities
 *
 * Reusable utilities for form handling, error formatting, and data transformation.
 */

import type { ZodError } from 'zod';

// ============================================================================
// Error Formatting
// ============================================================================

/**
 * Format Zod validation errors for form display
 */
export function formatZodErrors(error: ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join('.');
    formattedErrors[path] = err.message;
  });

  return formattedErrors;
}

/**
 * Get first error message from field
 */
export function getFieldError(
  errors: Record<string, string> | undefined,
  fieldName: string
): string | undefined {
  return errors?.[fieldName];
}

/**
 * Check if field has error
 */
export function hasFieldError(
  errors: Record<string, string> | undefined,
  fieldName: string
): boolean {
  return !!errors?.[fieldName];
}

// ============================================================================
// Form State Management
// ============================================================================

/**
 * Form state interface
 */
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  touchedFields: Set<string>;
}

/**
 * Create initial form state
 */
export function createFormState<T>(initialData: T): FormState<T> {
  return {
    data: initialData,
    errors: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    touchedFields: new Set(),
  };
}

/**
 * Mark field as touched
 */
export function touchField<T>(
  state: FormState<T>,
  fieldName: string
): FormState<T> {
  return {
    ...state,
    touchedFields: new Set([...state.touchedFields, fieldName]),
  };
}

/**
 * Check if field is touched
 */
export function isFieldTouched<T>(
  state: FormState<T>,
  fieldName: string
): boolean {
  return state.touchedFields.has(fieldName);
}

// ============================================================================
// Data Transformation
// ============================================================================

/**
 * Convert form data to API payload
 */
export function formDataToPayload<T extends Record<string, any>>(
  formData: T
): Record<string, any> {
  const payload: Record<string, any> = {};

  Object.entries(formData).forEach(([key, value]) => {
    // Skip undefined, null, or empty string values
    if (value !== undefined && value !== null && value !== '') {
      payload[key] = value;
    }
  });

  return payload;
}

/**
 * Convert Date to ISO string for API
 */
export function formatDateForApi(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * Convert time string (HH:MM) to 24-hour format
 */
export function formatTimeFor24Hour(time: string): string {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

/**
 * Trim all string values in an object
 */
export function trimFormData<T extends Record<string, any>>(data: T): T {
  const trimmed: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      trimmed[key] = value.trim();
    } else {
      trimmed[key] = value;
    }
  });

  return trimmed as T;
}

// ============================================================================
// File Upload Helpers
// ============================================================================

/**
 * Validate file size (in MB)
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(
  file: File,
  allowedTypes: string[]
): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================================================
// Form Submission Helpers
// ============================================================================

/**
 * Handle form submission with error handling
 */
export async function handleFormSubmit<T, R>(
  data: T,
  submitFn: (data: T) => Promise<R>,
  options?: {
    onSuccess?: (result: R) => void;
    onError?: (error: Error) => void;
    onFinally?: () => void;
  }
): Promise<{ success: boolean; result?: R; error?: Error }> {
  try {
    const result = await submitFn(data);
    options?.onSuccess?.(result);
    return { success: true, result };
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    options?.onError?.(err);
    return { success: false, error: err };
  } finally {
    options?.onFinally?.();
  }
}

/**
 * Debounce function for input validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if all required fields are filled
 */
export function areRequiredFieldsFilled<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => {
    const value = data[field];
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  });
}

/**
 * Get percentage of form completion
 */
export function getFormCompletionPercentage<T extends Record<string, any>>(
  data: T,
  totalFields: number
): number {
  const filledFields = Object.values(data).filter((value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  }).length;

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Compare two form data objects for changes
 */
export function hasFormChanged<T extends Record<string, any>>(
  original: T,
  current: T
): boolean {
  return JSON.stringify(original) !== JSON.stringify(current);
}

/**
 * Reset form to initial state
 */
export function resetFormData<T extends Record<string, any>>(
  initialData: T
): T {
  return JSON.parse(JSON.stringify(initialData));
}
