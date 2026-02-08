/**
 * Unit Tests: ContactForm Component
 *
 * Tests the ContactForm component behavior and validation
 * Task: T127 [US3]
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/forms/ContactForm';

// Mock fetch
global.fetch = vi.fn();

// Mock useRecaptcha hook
vi.mock('@/hooks/useRecaptcha', () => ({
  useRecaptcha: () => ({
    executeRecaptcha: vi.fn().mockResolvedValue('mock-recaptcha-token'),
    isReady: true,
    error: null,
  }),
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('should show required field indicators', () => {
      render(<ContactForm />);

      const requiredLabels = screen.getAllByText('*');
      expect(requiredLabels.length).toBeGreaterThan(0);
    });

    it('should show submit button', () => {
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('should show reCAPTCHA notice', () => {
      render(<ContactForm />);

      expect(screen.getByText(/protected by reCAPTCHA/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require name field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should require email field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should require message field', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/message must be at least 10 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should enforce minimum message length', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const messageInput = screen.getByLabelText(/message/i);
      await user.type(messageInput, 'Short');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/message must be at least 10 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('should accept valid form data', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a valid test message.');

      const submitButton = screen.getByRole('button', { name: /send message/i });

      // No validation errors should appear
      expect(screen.queryByText(/must be at least/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: 'Contact inquiry submitted successfully',
        }),
      } as Response);

      render(<ContactForm />);

      // Fill out form
      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@example.com');
      await user.type(messageInput, 'I would like to inquire about your services.');

      // Submit
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Wait for submission
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/contact',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });

      // Check success message
      await waitFor(() => {
        expect(
          screen.getByText(/message has been sent successfully/i)
        ).toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

      // Mock slow response
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ message: 'Success' }),
                } as Response),
              100
            )
          )
      );

      render(<ContactForm />);

      // Fill and submit
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(
        screen.getByLabelText(/message/i),
        'This is a test message for loading state.'
      );

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/sending.../i)).toBeInTheDocument();
      });

      // Button should be disabled
      expect(submitButton).toBeDisabled();
    });

    it('should handle submission errors', async () => {
      const user = userEvent.setup();
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Rate limit exceeded',
        }),
      } as Response);

      render(<ContactForm />);

      // Fill and submit
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test message for error handling.');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Check error message
      await waitFor(() => {
        expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
      });
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Success' }),
      } as Response);

      render(<ContactForm />);

      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'Test message content here.');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText(/message has been sent successfully/i)).toBeInTheDocument();
      });

      // Form should be reset
      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(messageInput.value).toBe('');
      });
    });

    it('should call onSuccess callback after successful submission', async () => {
      const user = userEvent.setup();
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;
      const onSuccess = vi.fn();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Success' }),
      } as Response);

      render(<ContactForm onSuccess={onSuccess} />);

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Testing onSuccess callback.');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/full name/i)).toHaveAttribute('id');
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('id');
      expect(screen.getByLabelText(/phone number/i)).toHaveAttribute('id');
      expect(screen.getByLabelText(/subject/i)).toHaveAttribute('id');
      expect(screen.getByLabelText(/message/i)).toHaveAttribute('id');
    });

    it('should show error messages with proper styling', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('paragraph');
        const hasErrorStyling = errorMessages.some((el) =>
          el.className.includes('text-red')
        );
        expect(hasErrorStyling).toBeTruthy();
      });
    });

    it('should disable inputs during submission', async () => {
      const user = userEvent.setup();
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ message: 'Success' }),
                } as Response),
              100
            )
          )
      );

      render(<ContactForm />);

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/message/i), 'Test for disabled state.');

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/full name/i)).toBeDisabled();
        expect(screen.getByLabelText(/email address/i)).toBeDisabled();
        expect(screen.getByLabelText(/message/i)).toBeDisabled();
      });
    });
  });
});
