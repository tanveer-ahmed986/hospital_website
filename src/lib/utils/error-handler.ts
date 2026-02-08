/**
 * Error Handling Middleware and Utilities
 *
 * Centralized error handling for API routes with logging and proper responses.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import {
  errorResponse,
  validationErrorResponse,
  internalServerErrorResponse,
  notFoundResponse,
  conflictResponse,
  badRequestResponse,
} from './api-helpers';
import { formatZodErrors } from './form-helpers';

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(422, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, 'NOT_FOUND', `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, 'UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, 'FORBIDDEN', message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, 'CONFLICT', message);
    this.name = 'ConflictError';
  }
}

// ============================================================================
// Error Handler Middleware
// ============================================================================

/**
 * Handle errors in API route handlers
 */
export function handleApiError(error: unknown): NextResponse {
  // Log error for debugging (in production, use proper logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', error);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = formatZodErrors(error);
    return validationErrorResponse('Validation failed', formattedErrors);
  }

  // Custom application errors
  if (error instanceof AppError) {
    return errorResponse(error.code, error.message, error.statusCode, error.details);
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return badRequestResponse('Invalid data provided');
  }

  // Standard Error objects
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An error occurred processing your request';

    return internalServerErrorResponse(message);
  }

  // Unknown errors
  return internalServerErrorResponse('An unexpected error occurred');
}

/**
 * Handle Prisma-specific errors
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    // Unique constraint violation
    case 'P2002':
      const field = (error.meta?.target as string[])?.join(', ') || 'field';
      return conflictResponse(`A record with this ${field} already exists`);

    // Foreign key constraint failed
    case 'P2003':
      return badRequestResponse('Invalid reference to related record');

    // Record not found
    case 'P2025':
      return notFoundResponse();

    // Record required but not found
    case 'P2018':
      return notFoundResponse();

    // Default: internal server error
    default:
      return internalServerErrorResponse(
        process.env.NODE_ENV === 'development'
          ? `Database error: ${error.code}`
          : 'A database error occurred'
      );
  }
}

// ============================================================================
// Async Handler Wrapper
// ============================================================================

/**
 * Wrap async API route handler with error handling
 */
export function asyncHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// ============================================================================
// Error Logging
// ============================================================================

/**
 * Log error to console (replace with proper logging service in production)
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    console.error({
      timestamp,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
    });
  } else {
    console.error({
      timestamp,
      error,
      context,
    });
  }

  // In production, send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { contexts: { additional: context } });
  // }
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Assert value is not null/undefined
 */
export function assertExists<T>(
  value: T | null | undefined,
  message: string = 'Value is required'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new ValidationError(message);
  }
}

/**
 * Assert condition is true
 */
export function assert(
  condition: boolean,
  message: string = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new ValidationError(message);
  }
}

/**
 * Throw not found error
 */
export function throwNotFound(resource: string = 'Resource'): never {
  throw new NotFoundError(resource);
}

/**
 * Throw unauthorized error
 */
export function throwUnauthorized(message?: string): never {
  throw new UnauthorizedError(message);
}

/**
 * Throw forbidden error
 */
export function throwForbidden(message?: string): never {
  throw new ForbiddenError(message);
}

/**
 * Throw conflict error
 */
export function throwConflict(message?: string): never {
  throw new ConflictError(message);
}

// ============================================================================
// Try-Catch Wrapper
// ============================================================================

/**
 * Safely execute function and catch errors
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, { operation: errorMessage });
    throw error;
  }
}

/**
 * Execute function with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 5000,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}
