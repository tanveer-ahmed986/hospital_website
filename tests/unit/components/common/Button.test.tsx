/**
 * Unit Tests for Button Component
 *
 * Tests button functionality, variants, accessibility, and user interactions.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/common/Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--color-primary)]');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--color-secondary)]');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border-2');
  });

  it('applies correct size styles', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    // Check for spinner SVG
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  it('renders with full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('renders left icon correctly', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    render(
      <Button leftIcon={<LeftIcon />}>With Left Icon</Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders right icon correctly', () => {
    const RightIcon = () => <span data-testid="right-icon">→</span>;
    render(
      <Button rightIcon={<RightIcon />}>With Right Icon</Button>
    );

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>With Ref</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('uses correct button type', () => {
    const { rerender } = render(<Button type="button">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('supports keyboard navigation', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Keyboard Test</Button>);

    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('has accessible focus styles', () => {
    render(<Button>Focus Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2');
  });
});
