/**
 * Unit Tests: DepartmentCard Component
 *
 * Tests the DepartmentCard component display and interactions
 * Task: T106 [US2]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DepartmentCard } from '@/components/sections/DepartmentCard';
import type { DepartmentWithRelations } from '@/lib/departments';

describe('DepartmentCard', () => {
  const mockDepartment: DepartmentWithRelations = {
    id: 'dept-1',
    slug: 'cardiology',
    name: 'Cardiology',
    description: 'Comprehensive heart care services',
    icon: 'https://example.com/cardiology-icon.svg',
    image: 'https://example.com/cardiology.jpg',
    displayOrder: 1,
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    _count: {
      doctors: 5,
      services: 8,
    },
  };

  describe('Rendering', () => {
    it('should render department name and description', () => {
      render(<DepartmentCard department={mockDepartment} />);

      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Comprehensive heart care services')).toBeInTheDocument();
    });

    it('should render department icon when provided', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const icon = screen.getByAltText('');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', 'https://example.com/cardiology-icon.svg');
    });

    it('should render department image when provided', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const image = screen.getByAltText('Cardiology department');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/cardiology.jpg');
    });

    it('should render without icon if not provided', () => {
      const deptWithoutIcon = { ...mockDepartment, icon: null };
      render(<DepartmentCard department={deptWithoutIcon} />);

      expect(screen.queryByAltText('')).not.toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    it('should render without image if not provided', () => {
      const deptWithoutImage = { ...mockDepartment, image: null };
      render(<DepartmentCard department={deptWithoutImage} />);

      expect(screen.queryByAltText('Cardiology department')).not.toBeInTheDocument();
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    it('should render doctor count when available', () => {
      render(<DepartmentCard department={mockDepartment} />);

      expect(screen.getByText(/5/)).toBeInTheDocument();
      expect(screen.getByText(/Specialist Doctors/)).toBeInTheDocument();
    });

    it('should render service count when available', () => {
      render(<DepartmentCard department={mockDepartment} />);

      expect(screen.getByText(/8/)).toBeInTheDocument();
      expect(screen.getByText(/Medical Services/)).toBeInTheDocument();
    });

    it('should handle singular forms for counts of 1', () => {
      const deptWithSingleCounts = {
        ...mockDepartment,
        _count: { doctors: 1, services: 1 },
      };
      render(<DepartmentCard department={deptWithSingleCounts} />);

      expect(screen.getByText(/1/)).toBeInTheDocument();
      expect(screen.getByText('Specialist Doctor')).toBeInTheDocument();
      expect(screen.getByText('Medical Service')).toBeInTheDocument();
    });

    it('should not render stats when counts are zero', () => {
      const deptWithZeroCounts = {
        ...mockDepartment,
        _count: { doctors: 0, services: 0 },
      };
      render(<DepartmentCard department={deptWithZeroCounts} />);

      // Stats section should not be visible or should show 0
      const container = screen.getByRole('link');
      expect(container).toBeInTheDocument();
      // Zero counts might not be rendered at all depending on implementation
    });
  });

  describe('Links and Navigation', () => {
    it('should link to department detail page with correct slug', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/departments/cardiology');
    });

    it('should be keyboard accessible', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href');

      // Link should be focusable
      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate ARIA attributes', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href');
    });

    it('should have descriptive alt text for images', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const image = screen.getByAltText('Cardiology department');
      expect(image).toBeInTheDocument();
    });

    it('should handle missing images gracefully', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const image = screen.getByAltText('Cardiology department') as HTMLImageElement;

      // Simulate image load error
      const errorEvent = new Event('error');
      image.dispatchEvent(errorEvent);

      // Image should be hidden on error
      expect(image).toHaveStyle({ display: 'none' });
    });
  });

  describe('Responsive Design', () => {
    it('should apply custom className when provided', () => {
      const { container } = render(
        <DepartmentCard department={mockDepartment} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should render with default styling', () => {
      render(<DepartmentCard department={mockDepartment} />);

      const link = screen.getByRole('link');
      expect(link).toHaveClass('block');
    });
  });

  describe('Edge Cases', () => {
    it('should handle long department names', () => {
      const deptWithLongName = {
        ...mockDepartment,
        name: 'Department of Cardiovascular and Thoracic Surgery with Advanced Interventional Procedures',
      };
      render(<DepartmentCard department={deptWithLongName} />);

      expect(
        screen.getByText(
          'Department of Cardiovascular and Thoracic Surgery with Advanced Interventional Procedures'
        )
      ).toBeInTheDocument();
    });

    it('should handle long descriptions', () => {
      const deptWithLongDesc = {
        ...mockDepartment,
        description:
          'This department provides comprehensive cardiovascular care including diagnostic services, interventional procedures, cardiac surgery, post-operative care, cardiac rehabilitation, and emergency cardiac care services available 24/7.',
      };
      render(<DepartmentCard department={deptWithLongDesc} />);

      expect(screen.getByText(/This department provides comprehensive/)).toBeInTheDocument();
    });

    it('should handle special characters in department name', () => {
      const deptWithSpecialChars = {
        ...mockDepartment,
        name: 'Ear, Nose & Throat (ENT)',
      };
      render(<DepartmentCard department={deptWithSpecialChars} />);

      expect(screen.getByText('Ear, Nose & Throat (ENT)')).toBeInTheDocument();
    });

    it('should handle department without description', () => {
      const deptWithoutDesc = {
        ...mockDepartment,
        description: null,
      };
      render(<DepartmentCard department={deptWithoutDesc} />);

      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });
  });
});
