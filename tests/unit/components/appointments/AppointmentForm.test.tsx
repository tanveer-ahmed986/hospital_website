// Component tests for AppointmentForm
// Task: T081 [US1]

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';

describe('AppointmentForm Component', () => {
  const mockDoctor = {
    id: 'doctor-1',
    name: 'Dr. John Smith',
    slug: 'dr-john-smith',
  };

  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<AppointmentForm doctor={mockDoctor} />);

    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reason for visit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/appointment date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/appointment time/i)).toBeInTheDocument();
  });

  it('should display doctor name in form header', () => {
    render(<AppointmentForm doctor={mockDoctor} />);

    expect(screen.getByText(/Dr. John Smith/i)).toBeInTheDocument();
  });

  it('should validate required fields on submit', async () => {
    const user = userEvent.setup();
    render(<AppointmentForm doctor={mockDoctor} />);

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/patient name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<AppointmentForm doctor={mockDoctor} />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should validate phone number format', async () => {
    const user = userEvent.setup();
    render(<AppointmentForm doctor={mockDoctor} />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, '123');

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    });
  });

  it('should validate appointment date is in future', async () => {
    const user = userEvent.setup();
    render(<AppointmentForm doctor={mockDoctor} />);

    const dateInput = screen.getByLabelText(/appointment date/i);
    await user.type(dateInput, '2020-01-01');

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/date must be in the future/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          id: 'appt-1',
          status: 'pending',
        },
      }),
    });

    render(<AppointmentForm doctor={mockDoctor} onSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText(/patient name/i), 'John Doe');
    await user.type(screen.getByLabelText(/phone number/i), '+923001234567');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/reason for visit/i), 'Regular checkup');
    await user.type(screen.getByLabelText(/appointment date/i), '2026-03-15');

    // Select time slot
    const timeSelect = screen.getByLabelText(/appointment time/i);
    await user.selectOptions(timeSelect, '10:00');

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should show loading state while submitting', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => ({ success: true }) }), 100)
        )
    );

    render(<AppointmentForm doctor={mockDoctor} />);

    // Fill form
    await user.type(screen.getByLabelText(/patient name/i), 'John Doe');
    await user.type(screen.getByLabelText(/phone number/i), '+923001234567');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/appointment date/i), '2026-03-15');
    await user.selectOptions(screen.getByLabelText(/appointment time/i), '10:00');

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    expect(screen.getByText(/booking/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should display error message on submission failure', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        error: {
          message: 'Time slot is not available',
        },
      }),
    });

    render(<AppointmentForm doctor={mockDoctor} onError={mockOnError} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/patient name/i), 'John Doe');
    await user.type(screen.getByLabelText(/phone number/i), '+923001234567');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/appointment date/i), '2026-03-15');
    await user.selectOptions(screen.getByLabelText(/appointment time/i), '10:00');

    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/time slot is not available/i)).toBeInTheDocument();
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it('should fetch and display available time slots when date is selected', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          slots: [
            { time: '09:00', available: true },
            { time: '09:15', available: true },
            { time: '09:30', available: false },
          ],
        },
      }),
    });

    render(<AppointmentForm doctor={mockDoctor} />);

    const dateInput = screen.getByLabelText(/appointment date/i);
    await user.type(dateInput, '2026-03-15');

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /09:00/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /09:15/i })).toBeInTheDocument();
    });
  });

  it('should disable unavailable time slots', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          slots: [
            { time: '09:00', available: true },
            { time: '09:30', available: false },
          ],
        },
      }),
    });

    render(<AppointmentForm doctor={mockDoctor} />);

    await user.type(screen.getByLabelText(/appointment date/i), '2026-03-15');

    await waitFor(() => {
      const unavailableSlot = screen.getByRole('option', { name: /09:30.*unavailable/i });
      expect(unavailableSlot).toBeDisabled();
    });
  });

  it('should clear time slots when date is changed', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          slots: [{ time: '09:00', available: true }],
        },
      }),
    });

    render(<AppointmentForm doctor={mockDoctor} />);

    const dateInput = screen.getByLabelText(/appointment date/i);
    await user.type(dateInput, '2026-03-15');

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /09:00/i })).toBeInTheDocument();
    });

    await user.clear(dateInput);
    await user.type(dateInput, '2026-03-16');

    // Time slots should be fetched again for new date
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<AppointmentForm doctor={mockDoctor} />);

      expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should announce validation errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<AppointmentForm doctor={mockDoctor} />);

      const submitButton = screen.getByRole('button', { name: /book appointment/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should have keyboard navigation support', async () => {
      const user = userEvent.setup();
      render(<AppointmentForm doctor={mockDoctor} />);

      await user.tab();
      expect(screen.getByLabelText(/patient name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/phone number/i)).toHaveFocus();
    });
  });

  describe('reCAPTCHA integration', () => {
    it('should render reCAPTCHA widget', () => {
      render(<AppointmentForm doctor={mockDoctor} />);

      expect(screen.getByTestId('recaptcha-widget')).toBeInTheDocument();
    });

    it('should require reCAPTCHA verification before submission', async () => {
      const user = userEvent.setup();
      render(<AppointmentForm doctor={mockDoctor} recaptchaRequired />);

      // Fill form without reCAPTCHA
      await user.type(screen.getByLabelText(/patient name/i), 'John Doe');
      await user.type(screen.getByLabelText(/phone number/i), '+923001234567');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      const submitButton = screen.getByRole('button', { name: /book appointment/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please complete the recaptcha/i)).toBeInTheDocument();
      });
    });
  });
});
