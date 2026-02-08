/**
 * API Response Helpers
 *
 * Standardized utilities for API responses, error handling, and HTTP status codes.
 */

import { NextResponse } from 'next/server';

// ============================================================================
// Response Types
// ============================================================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Success Responses
// ============================================================================

/**
 * Create success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Create response (201 Created)
 */
export function createdResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return successResponse(data, message, 201);
}

/**
 * No content response (204 No Content)
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================================================
// Error Responses
// ============================================================================

/**
 * Create error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

/**
 * Bad request response (400)
 */
export function badRequestResponse(
  message: string = 'Bad request',
  details?: any
): NextResponse<ApiErrorResponse> {
  return errorResponse('BAD_REQUEST', message, 400, details);
}

/**
 * Unauthorized response (401)
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized'
): NextResponse<ApiErrorResponse> {
  return errorResponse('UNAUTHORIZED', message, 401);
}

/**
 * Forbidden response (403)
 */
export function forbiddenResponse(
  message: string = 'Forbidden'
): NextResponse<ApiErrorResponse> {
  return errorResponse('FORBIDDEN', message, 403);
}

/**
 * Not found response (404)
 */
export function notFoundResponse(
  resource: string = 'Resource'
): NextResponse<ApiErrorResponse> {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404);
}

/**
 * Conflict response (409)
 */
export function conflictResponse(
  message: string = 'Resource already exists'
): NextResponse<ApiErrorResponse> {
  return errorResponse('CONFLICT', message, 409);
}

/**
 * Validation error response (422)
 */
export function validationErrorResponse(
  message: string = 'Validation failed',
  errors?: Record<string, string>
): NextResponse<ApiErrorResponse> {
  return errorResponse('VALIDATION_ERROR', message, 422, { errors });
}

/**
 * Too many requests response (429)
 */
export function tooManyRequestsResponse(
  message: string = 'Too many requests'
): NextResponse<ApiErrorResponse> {
  return errorResponse('TOO_MANY_REQUESTS', message, 429);
}

/**
 * Internal server error response (500)
 */
export function internalServerErrorResponse(
  message: string = 'Internal server error'
): NextResponse<ApiErrorResponse> {
  return errorResponse('INTERNAL_SERVER_ERROR', message, 500);
}

/**
 * Service unavailable response (503)
 */
export function serviceUnavailableResponse(
  message: string = 'Service temporarily unavailable'
): NextResponse<ApiErrorResponse> {
  return errorResponse('SERVICE_UNAVAILABLE', message, 503);
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================================================
// Request Parsing Helpers
// ============================================================================

/**
 * Parse JSON body from request
 */
export async function parseJsonBody<T = any>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw new Error('Invalid JSON body');
  }
}

/**
 * Get query parameters from URL
 */
export function getQueryParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Get query parameter value
 */
export function getQueryParam(
  url: string,
  param: string
): string | null {
  const urlObj = new URL(url);
  return urlObj.searchParams.get(param);
}

/**
 * Get pagination params from query
 */
export function getPaginationParams(url: string): {
  page: number;
  limit: number;
  skip: number;
} {
  const urlObj = new URL(url);
  const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
  const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)), // Max 100 items per page
    skip: (page - 1) * limit,
  };
}

// ============================================================================
// Response Formatting
// ============================================================================

/**
 * Format paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<ApiSuccessResponse<PaginatedResponse<T>>> {
  const totalPages = Math.ceil(total / limit);

  return successResponse({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}

// ============================================================================
// CORS Headers
// ============================================================================

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  allowedOrigins: string[] = ['*']
): NextResponse {
  const origin = allowedOrigins[0]; // Simplified for now

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

/**
 * Handle OPTIONS preflight request
 */
export function handleOptionsRequest(): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return addCorsHeaders(response);
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Safe error message extraction
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Check if error is a known API error
 */
export function isApiError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    error.success === false &&
    'error' in error
  );
}
