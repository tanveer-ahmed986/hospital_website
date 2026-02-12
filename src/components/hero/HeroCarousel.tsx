/**
 * Hero Carousel Component
 *
 * Auto-playing hero carousel with Framer Motion animations
 * Task: T148 [Homepage]
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { CarouselControls } from './CarouselControls';

export interface HeroImage {
  id: string;
  imageUrl: string;
  altText: string;
  caption?: string;
  subtitle?: string;
  link?: string;
  imageType: string;
}

export interface HeroCarouselProps {
  images: HeroImage[];
  autoPlayInterval?: number; // milliseconds
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function HeroCarousel({
  images,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = '',
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || images.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, autoPlayInterval, images.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleDotClick = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, togglePause]);

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  if (images.length === 0) {
    return (
      <div className={`relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-neutral-200 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-neutral-600">No images available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div
      className={`relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-neutral-900 ${className}`}
      role="region"
      aria-label="Hero carousel"
      aria-live="polite"
    >
      {/* Image Container */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentImage.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.altText}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Caption */}
          {currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="container mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-2xl"
                >
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase leading-tight">
                    {currentImage.caption}
                  </h2>
                  {currentImage.subtitle && (
                    <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
                      {currentImage.subtitle}
                    </p>
                  )}
                  {currentImage.link && (
                    <Link
                      href={currentImage.link}
                      className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-md transition-colors duration-200 uppercase text-sm"
                    >
                      Read More
                    </Link>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {showControls && images.length > 1 && (
        <CarouselControls
          currentIndex={currentIndex}
          totalImages={images.length}
          isPaused={isPaused}
          onNext={handleNext}
          onPrev={handlePrev}
          onDotClick={handleDotClick}
          onTogglePause={togglePause}
          showIndicators={showIndicators}
        />
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing image {currentIndex + 1} of {images.length}: {currentImage.altText}
      </div>
    </div>
  );
}
