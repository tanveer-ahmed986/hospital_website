/**
 * Safe Image Component
 *
 * Client component wrapper for images with error handling
 */

'use client';

import React, { useState } from 'react';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export function SafeImage({ fallback, onError, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  if (hasError) {
    return null;
  }

  return <img {...props} onError={handleError} />;
}
