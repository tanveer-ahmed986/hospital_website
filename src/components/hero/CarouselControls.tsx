/**
 * Carousel Controls Component
 *
 * Navigation controls for hero carousel (arrows, dots, pause button)
 * Task: T149 [Homepage]
 */

'use client';

import React from 'react';

export interface CarouselControlsProps {
  currentIndex: number;
  totalImages: number;
  isPaused: boolean;
  onNext: () => void;
  onPrev: () => void;
  onDotClick: (index: number) => void;
  onTogglePause: () => void;
  showIndicators?: boolean;
}

export function CarouselControls({
  currentIndex,
  totalImages,
  isPaused,
  onNext,
  onPrev,
  onDotClick,
  onTogglePause,
  showIndicators = true,
}: CarouselControlsProps) {
  return (
    <>
      {/* Previous Button */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center group z-10"
        aria-label="Previous image"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center group z-10"
        aria-label="Next image"
      >
        <svg
          className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            {/* Pause/Play Button */}
            <button
              onClick={onTogglePause}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors flex items-center justify-center"
              aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
            >
              {isPaused ? (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {/* Dot Indicators */}
            {showIndicators && (
              <div
                className="flex gap-2"
                role="tablist"
                aria-label="Carousel navigation"
              >
                {Array.from({ length: totalImages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                    role="tab"
                  />
                ))}
              </div>
            )}

            {/* Counter */}
            <div className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {totalImages}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
