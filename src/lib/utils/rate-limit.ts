/**
 * Rate Limiting Utility
 *
 * Implements rate limiting for API endpoints to prevent abuse
 * Task: T089 [US1]
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Message to send when rate limit is exceeded */
  message?: string;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Get client identifier from request (IP address or user identifier)
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from headers (handles proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return ip;
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Rate limit middleware
 *
 * @param config Rate limit configuration
 * @returns Middleware function
 *
 * @example
 * ```ts
 * const limiter = rateLimit({
 *   maxRequests: 5,
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 * });
 *
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await limiter(request);
 *   if (rateLimitResult) return rateLimitResult; // Rate limit exceeded
 *
 *   // Process request...
 * }
 * ```
 */
export function rateLimit(config: RateLimitConfig) {
  const { maxRequests, windowMs, message = 'Too many requests. Please try again later.' } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const identifier = getClientIdentifier(request);
    const key = `${request.nextUrl.pathname}:${identifier}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry) {
      // First request from this client
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // Allow request
    }

    if (now > entry.resetTime) {
      // Window has expired, reset counter
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return null; // Allow request
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: {
            message,
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter,
          },
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    // Increment counter and allow request
    entry.count += 1;
    const remaining = maxRequests - entry.count;

    // Set rate limit headers for informational purposes
    // These can be read by the client to implement smart retry logic
    return null; // Allow request
  };
}

/**
 * Get rate limit headers for successful responses
 */
export function getRateLimitHeaders(
  request: NextRequest,
  config: RateLimitConfig
): Record<string, string> {
  const identifier = getClientIdentifier(request);
  const key = `${request.nextUrl.pathname}:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': config.maxRequests.toString(),
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': entry.resetTime.toString(),
  };
}

/**
 * Predefined rate limiters for common use cases
 */
export const rateLimiters = {
  /** Strict rate limit for appointment booking (prevent spam) */
  appointmentBooking: rateLimit({
    maxRequests: 3,
    windowMs: 15 * 60 * 1000, // 3 requests per 15 minutes
    message: 'Too many appointment requests. Please wait before trying again.',
  }),

  /** Moderate rate limit for contact forms */
  contactForm: rateLimit({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
    message: 'Too many contact form submissions. Please wait before trying again.',
  }),

  /** Lenient rate limit for general API endpoints */
  general: rateLimit({
    maxRequests: 100,
    windowMs: 60 * 1000, // 100 requests per minute
    message: 'Too many requests. Please slow down.',
  }),

  /** Slot availability check (allow more frequent checks) */
  slotCheck: rateLimit({
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 requests per minute
    message: 'Too many slot availability checks. Please wait a moment.',
  }),
};
