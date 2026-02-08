/**
 * useRecaptcha Hook
 *
 * Manages Google reCAPTCHA v3 integration
 * Task: T088 [US1]
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export interface UseRecaptchaReturn {
  /** Whether reCAPTCHA is loaded and ready */
  isReady: boolean;
  /** Execute reCAPTCHA and get token */
  executeRecaptcha: (action: string) => Promise<string | null>;
  /** Any error that occurred during reCAPTCHA execution */
  error: string | null;
}

export function useRecaptcha(): UseRecaptchaReturn {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      setError('reCAPTCHA site key not configured');
      return;
    }

    // Check if reCAPTCHA script is already loaded
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
        });
      }
    };

    script.onerror = () => {
      setError('Failed to load reCAPTCHA script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        `script[src^="https://www.google.com/recaptcha/api.js"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [siteKey]);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string | null> => {
      if (!siteKey) {
        setError('reCAPTCHA site key not configured');
        return null;
      }

      if (!isReady) {
        setError('reCAPTCHA not ready yet');
        return null;
      }

      try {
        const token = await window.grecaptcha.execute(siteKey, { action });
        setError(null);
        return token;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'reCAPTCHA execution failed';
        setError(errorMessage);
        return null;
      }
    },
    [siteKey, isReady]
  );

  return {
    isReady,
    executeRecaptcha,
    error,
  };
}
