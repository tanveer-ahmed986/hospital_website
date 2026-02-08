/**
 * Unit Tests: HeroCarousel Component
 *
 * Tests carousel behavior, navigation, and auto-play functionality
 * Task: T150 [Homepage]
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroCarousel, type HeroImage } from '@/components/hero/HeroCarousel';

const mockImages: HeroImage[] = [
  {
    id: '1',
    imageUrl: '/images/hero1.jpg',
    altText: 'Hero image 1',
    caption: 'Welcome to our hospital',
    imageType: 'facility',
  },
  {
    id: '2',
    imageUrl: '/images/hero2.jpg',
    altText: 'Hero image 2',
    caption: 'Expert medical care',
    imageType: 'staff',
  },
  {
    id: '3',
    imageUrl: '/images/hero3.jpg',
    altText: 'Hero image 3',
    caption: 'Modern facilities',
    imageType: 'equipment',
  },
];

describe('HeroCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render carousel with images', () => {
      render(<HeroCarousel images={mockImages} />);

      // Should render first image
      expect(screen.getByAltText('Hero image 1')).toBeInTheDocument();
      expect(screen.getByText('Welcome to our hospital')).toBeInTheDocument();
    });

    it('should render navigation controls', () => {
      render(<HeroCarousel images={mockImages} />);

      expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
      expect(screen.getByLabelText('Pause carousel')).toBeInTheDocument();
    });

    it('should render dot indicators', () => {
      render(<HeroCarousel images={mockImages} />);

      const dots = screen.getAllByRole('tab');
      expect(dots).toHaveLength(3);
    });

    it('should show counter', () => {
      render(<HeroCarousel images={mockImages} />);

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('should render empty state when no images', () => {
      render(<HeroCarousel images={[]} />);

      expect(screen.getByText('No images available')).toBeInTheDocument();
    });

    it('should hide controls when showControls is false', () => {
      render(<HeroCarousel images={mockImages} showControls={false} />);

      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
    });

    it('should hide indicators when showIndicators is false', () => {
      render(<HeroCarousel images={mockImages} showIndicators={false} />);

      expect(screen.queryAllByRole('tab')).toHaveLength(0);
    });
  });

  describe('Navigation', () => {
    it('should navigate to next image on next button click', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} />);

      const nextButton = screen.getByLabelText('Next image');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      });
    });

    it('should navigate to previous image on prev button click', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} />);

      // Go to last image first
      const prevButton = screen.getByLabelText('Previous image');
      await user.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
      });
    });

    it('should wrap around from last to first image', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} />);

      const nextButton = screen.getByLabelText('Next image');

      // Click next 3 times
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
      });
    });

    it('should navigate via dot indicators', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} />);

      const dots = screen.getAllByRole('tab');
      await user.click(dots[2]);

      await waitFor(() => {
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-play', () => {
    it('should auto-advance to next slide', async () => {
      render(<HeroCarousel images={mockImages} autoPlayInterval={5000} />);

      // Initially showing first image
      expect(screen.getByText('1 / 3')).toBeInTheDocument();

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      });
    });

    it('should pause auto-play when pause button clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} autoPlayInterval={5000} />);

      const pauseButton = screen.getByLabelText('Pause carousel');
      await user.click(pauseButton);

      // Fast-forward time
      vi.advanceTimersByTime(10000);

      // Should still be on first image
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('should resume auto-play when play button clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} autoPlayInterval={5000} />);

      // Pause
      const pauseButton = screen.getByLabelText('Pause carousel');
      await user.click(pauseButton);

      // Resume
      const playButton = screen.getByLabelText('Play carousel');
      await user.click(playButton);

      // Fast-forward
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      });
    });

    it('should not auto-play with single image', () => {
      const singleImage = [mockImages[0]];
      render(<HeroCarousel images={singleImage} autoPlayInterval={5000} />);

      // Fast-forward
      vi.advanceTimersByTime(10000);

      // Should still show the same (only) image
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate with arrow keys', async () => {
      render(<HeroCarousel images={mockImages} />);

      // Press right arrow
      await userEvent.keyboard('{ArrowRight}');

      await waitFor(() => {
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
      });

      // Press left arrow
      await userEvent.keyboard('{ArrowLeft}');

      await waitFor(() => {
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
      });
    });

    it('should toggle pause with space key', async () => {
      render(<HeroCarousel images={mockImages} autoPlayInterval={5000} />);

      // Press space to pause
      await userEvent.keyboard(' ');

      // Fast-forward
      vi.advanceTimersByTime(10000);

      // Should still be on first image
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<HeroCarousel images={mockImages} />);

      const carousel = screen.getByRole('region', { name: 'Hero carousel' });
      expect(carousel).toHaveAttribute('aria-live', 'polite');
    });

    it('should have screen reader announcements', () => {
      render(<HeroCarousel images={mockImages} />);

      const announcement = screen.getByText(/showing image 1 of 3/i);
      expect(announcement).toBeInTheDocument();
      expect(announcement).toHaveClass('sr-only');
    });

    it('should have descriptive alt text for images', () => {
      render(<HeroCarousel images={mockImages} />);

      const image = screen.getByAltText('Hero image 1');
      expect(image).toBeInTheDocument();
    });

    it('should mark current dot as active', () => {
      render(<HeroCarousel images={mockImages} />);

      const dots = screen.getAllByRole('tab');
      expect(dots[0]).toHaveAttribute('aria-current', 'true');
      expect(dots[1]).toHaveAttribute('aria-current', 'false');
    });
  });

  describe('Image Display', () => {
    it('should display caption when provided', () => {
      render(<HeroCarousel images={mockImages} />);

      expect(screen.getByText('Welcome to our hospital')).toBeInTheDocument();
    });

    it('should handle image without caption', () => {
      const imageWithoutCaption: HeroImage[] = [
        {
          id: '1',
          imageUrl: '/images/test.jpg',
          altText: 'Test image',
          imageType: 'facility',
        },
      ];

      render(<HeroCarousel images={imageWithoutCaption} />);

      expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single image gracefully', () => {
      const singleImage = [mockImages[0]];
      render(<HeroCarousel images={singleImage} />);

      expect(screen.getByText('1 / 1')).toBeInTheDocument();
      // Controls should still be present but cycling won't change anything
      expect(screen.getByLabelText('Next image')).toBeInTheDocument();
    });

    it('should handle rapid navigation clicks', async () => {
      const user = userEvent.setup({ delay: null });
      render(<HeroCarousel images={mockImages} />);

      const nextButton = screen.getByLabelText('Next image');

      // Click multiple times rapidly
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      // Should complete all transitions
      await waitFor(() => {
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
      });
    });
  });
});
