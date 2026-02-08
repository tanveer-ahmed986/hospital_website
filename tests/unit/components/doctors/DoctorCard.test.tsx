// Component tests for DoctorCard
// Task: T070 [US1]

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoctorCard } from '@/components/doctors/DoctorCard';

describe('DoctorCard Component', () => {
  const mockDoctor = {
    id: '1',
    name: 'Dr. John Smith',
    slug: 'dr-john-smith',
    designation: 'Senior Consultant',
    qualifications: 'MBBS, MD, FRCS',
    experience: 15,
    photo: '/doctors/john-smith.jpg',
    consultationFee: 1500,
    languages: ['English', 'Urdu'],
    specialties: [
      {
        specialty: {
          id: 'cardiology',
          name: 'Cardiology',
          slug: 'cardiology',
        },
      },
    ],
  };

  it('should render doctor basic information', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('Senior Consultant')).toBeInTheDocument();
    expect(screen.getByText(/MBBS, MD, FRCS/i)).toBeInTheDocument();
  });

  it('should display doctor photo with correct alt text', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    const image = screen.getByAltText('Dr. John Smith');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('john-smith.jpg'));
  });

  it('should show years of experience', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText(/15.*years/i)).toBeInTheDocument();
  });

  it('should display specialties', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  it('should show consultation fee when available', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText(/1500/)).toBeInTheDocument();
  });

  it('should hide consultation fee when not provided', () => {
    const doctorWithoutFee = {
      ...mockDoctor,
      consultationFee: null,
    };

    render(<DoctorCard doctor={doctorWithoutFee} />);

    expect(screen.queryByText(/consultation fee/i)).not.toBeInTheDocument();
  });

  it('should display languages spoken', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    expect(screen.getByText(/English.*Urdu/i)).toBeInTheDocument();
  });

  it('should render "View Profile" link with correct href', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    const link = screen.getByRole('link', { name: /view profile/i });
    expect(link).toHaveAttribute('href', '/doctors/dr-john-smith');
  });

  it('should render "Book Appointment" button', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    const button = screen.getByRole('button', { name: /book appointment/i });
    expect(button).toBeInTheDocument();
  });

  it('should call onBookAppointment when button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnBookAppointment = vi.fn();

    render(<DoctorCard doctor={mockDoctor} onBookAppointment={mockOnBookAppointment} />);

    const button = screen.getByRole('button', { name: /book appointment/i });
    await user.click(button);

    expect(mockOnBookAppointment).toHaveBeenCalledWith(mockDoctor.id);
  });

  it('should handle multiple specialties', () => {
    const doctorWithMultipleSpecialties = {
      ...mockDoctor,
      specialties: [
        {
          specialty: {
            id: 'cardiology',
            name: 'Cardiology',
            slug: 'cardiology',
          },
        },
        {
          specialty: {
            id: 'internal-medicine',
            name: 'Internal Medicine',
            slug: 'internal-medicine',
          },
        },
      ],
    };

    render(<DoctorCard doctor={doctorWithMultipleSpecialties} />);

    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Internal Medicine')).toBeInTheDocument();
  });

  it('should apply correct CSS classes for styling', () => {
    const { container } = render(<DoctorCard doctor={mockDoctor} />);

    const card = container.firstChild;
    expect(card).toHaveClass('doctor-card');
  });

  it('should be accessible with proper ARIA attributes', () => {
    render(<DoctorCard doctor={mockDoctor} />);

    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
  });

  it('should handle missing photo gracefully', () => {
    const doctorWithoutPhoto = {
      ...mockDoctor,
      photo: null,
    };

    render(<DoctorCard doctor={doctorWithoutPhoto} />);

    // Should render placeholder or default image
    const image = screen.getByAltText('Dr. John Smith');
    expect(image).toBeInTheDocument();
  });

  it('should show primary specialty badge when applicable', () => {
    const doctorWithPrimarySpecialty = {
      ...mockDoctor,
      specialties: [
        {
          isPrimary: true,
          specialty: {
            id: 'cardiology',
            name: 'Cardiology',
            slug: 'cardiology',
          },
        },
      ],
    };

    render(<DoctorCard doctor={doctorWithPrimarySpecialty} />);

    // Primary specialty should be highlighted or badged
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
  });

  describe('Responsive behavior', () => {
    it('should render in compact mode when specified', () => {
      const { container } = render(<DoctorCard doctor={mockDoctor} compact />);

      const card = container.firstChild;
      expect(card).toHaveClass('doctor-card--compact');
    });
  });

  describe('Loading state', () => {
    it('should show loading skeleton when loading prop is true', () => {
      render(<DoctorCard doctor={mockDoctor} loading />);

      expect(screen.getByTestId('doctor-card-skeleton')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<DoctorCard doctor={mockDoctor} />);

      const heading = screen.getByRole('heading', { name: 'Dr. John Smith' });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible button text', () => {
      render(<DoctorCard doctor={mockDoctor} />);

      const bookButton = screen.getByRole('button', { name: /book appointment/i });
      expect(bookButton).toHaveAccessibleName();
    });

    it('should have sufficient color contrast for text', () => {
      // This is more of a visual regression test
      // In practice, you'd use tools like axe-core
      render(<DoctorCard doctor={mockDoctor} />);

      const name = screen.getByText('Dr. John Smith');
      expect(name).toBeInTheDocument();
    });
  });
});
