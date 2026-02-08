/**
 * reCAPTCHA Service
 *
 * Google reCAPTCHA v3 verification for spam protection.
 */

// ============================================================================
// Types
// ============================================================================

export interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  error_codes?: string[];
}

// ============================================================================
// Configuration
// ============================================================================

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MINIMUM_SCORE = 0.5; // Minimum acceptable score (0.0 - 1.0)

// ============================================================================
// Verification Functions
// ============================================================================

/**
 * Verify reCAPTCHA token
 *
 * @param token - The reCAPTCHA token from the client
 * @param expectedAction - Expected action name (optional)
 * @returns Verification result with score
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string
): Promise<RecaptchaVerifyResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured');

    // In development, bypass verification
    if (process.env.NODE_ENV === 'development') {
      console.log('[RECAPTCHA - DEV MODE] Bypassing verification');
      return {
        success: true,
        score: 1.0,
        action: expectedAction,
      };
    }

    return {
      success: false,
      error_codes: ['missing-input-secret'],
    };
  }

  if (!token) {
    return {
      success: false,
      error_codes: ['missing-input-response'],
    };
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA API error: ${response.status}`);
    }

    const result: RecaptchaVerifyResult = await response.json();

    // Validate action if expected
    if (expectedAction && result.action !== expectedAction) {
      console.warn(
        `reCAPTCHA action mismatch: expected "${expectedAction}", got "${result.action}"`
      );
      return {
        ...result,
        success: false,
        error_codes: [...(result.error_codes || []), 'invalid-action'],
      };
    }

    // Check minimum score
    if (result.success && result.score !== undefined && result.score < MINIMUM_SCORE) {
      console.warn(`reCAPTCHA score too low: ${result.score}`);
      return {
        ...result,
        success: false,
        error_codes: [...(result.error_codes || []), 'score-too-low'],
      };
    }

    return result;
  } catch (error: any) {
    console.error('reCAPTCHA verification failed:', error);
    return {
      success: false,
      error_codes: ['network-error'],
    };
  }
}

/**
 * Check if reCAPTCHA is configured
 */
export function isRecaptchaConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY &&
    process.env.RECAPTCHA_SECRET_KEY
  );
}

/**
 * Get reCAPTCHA site key for client-side
 */
export function getRecaptchaSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

// ============================================================================
// Error Helpers
// ============================================================================

/**
 * Get human-readable error message from error codes
 */
export function getRecaptchaErrorMessage(errorCodes: string[]): string {
  const errorMessages: Record<string, string> = {
    'missing-input-secret': 'reCAPTCHA configuration error',
    'invalid-input-secret': 'reCAPTCHA configuration error',
    'missing-input-response': 'Please complete the reCAPTCHA verification',
    'invalid-input-response': 'reCAPTCHA verification failed. Please try again.',
    'bad-request': 'reCAPTCHA verification failed. Please try again.',
    'timeout-or-duplicate': 'reCAPTCHA expired. Please try again.',
    'invalid-action': 'reCAPTCHA verification failed. Please try again.',
    'score-too-low': 'Verification failed. Please try again.',
    'network-error': 'Unable to verify reCAPTCHA. Please check your connection.',
  };

  for (const code of errorCodes) {
    if (errorMessages[code]) {
      return errorMessages[code];
    }
  }

  return 'reCAPTCHA verification failed. Please try again.';
}

// ============================================================================
// React Hook (Client-side)
// ============================================================================

/**
 * Client-side hook instructions:
 *
 * Use in components like:
 *
 * ```tsx
 * 'use client';
 *
 * import { useCallback, useEffect, useState } from 'react';
 *
 * declare global {
 *   interface Window {
 *     grecaptcha: {
 *       ready: (callback: () => void) => void;
 *       execute: (siteKey: string, options: { action: string }) => Promise<string>;
 *     };
 *   }
 * }
 *
 * export function useRecaptcha(siteKey: string) {
 *   const [ready, setReady] = useState(false);
 *
 *   useEffect(() => {
 *     // Load reCAPTCHA script
 *     const script = document.createElement('script');
 *     script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
 *     script.async = true;
 *     script.onload = () => {
 *       window.grecaptcha.ready(() => setReady(true));
 *     };
 *     document.head.appendChild(script);
 *
 *     return () => {
 *       document.head.removeChild(script);
 *     };
 *   }, [siteKey]);
 *
 *   const executeRecaptcha = useCallback(
 *     async (action: string): Promise<string> => {
 *       if (!ready) throw new Error('reCAPTCHA not ready');
 *       return window.grecaptcha.execute(siteKey, { action });
 *     },
 *     [ready, siteKey]
 *   );
 *
 *   return { ready, executeRecaptcha };
 * }
 * ```
 */
