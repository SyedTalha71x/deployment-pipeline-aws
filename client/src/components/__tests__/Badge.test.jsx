/* eslint-disable no-unused-vars */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../badge';

describe('Badge Component', () => {
  const mockBadge = {
    name: 'Achievement Badge',
    description: 'Unlocked achievement',
    icon: '/test-icon.png'
  };

  it('should render nothing if badge prop is null', () => {
    const { container } = render(<Badge badge={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing if badge prop is undefined', () => {
    const { container } = render(<Badge badge={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render badge with name and description', () => {
    render(<Badge badge={mockBadge} />);
    
    expect(screen.getByText('Achievement Badge')).toBeInTheDocument();
    expect(screen.getByText('Unlocked achievement')).toBeInTheDocument();
  });

  it('should render badge image with correct alt text', () => {
    render(<Badge badge={mockBadge} />);
    
    const img = screen.getByAltText('Achievement Badge');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test-icon.png');
  });

  it('should use placeholder image if icon is not provided', () => {
    const badgeWithoutIcon = {
      name: 'Badge',
      description: 'Description',
      icon: undefined
    };

    render(<Badge badge={badgeWithoutIcon} />);
    
    const img = screen.getByAltText('Badge');
    expect(img).toHaveAttribute('src', '/placeholder.svg');
  });

  it('should render with default size classes', () => {
    const { container } = render(<Badge badge={mockBadge} size="default" />);
    
    expect(container.querySelector('.w-24')).toBeInTheDocument();
    expect(container.querySelector('.h-24')).toBeInTheDocument();
  });

  it('should render with small size classes', () => {
    const { container } = render(<Badge badge={mockBadge} size="small" />);
    
    expect(container.querySelector('.w-16')).toBeInTheDocument();
    expect(container.querySelector('.h-16')).toBeInTheDocument();
  });

  it('should render with large size classes', () => {
    const { container } = render(<Badge badge={mockBadge} size="large" />);
    
    expect(container.querySelector('.w-32')).toBeInTheDocument();
    expect(container.querySelector('.h-32')).toBeInTheDocument();
  });

  it('should render title with correct size class for small badge', () => {
    const { container } = render(<Badge badge={mockBadge} size="small" />);
    
    const title = screen.getByText('Achievement Badge');
    expect(title).toHaveClass('text-sm');
  });

  it('should render description with correct size class for large badge', () => {
    const { container } = render(<Badge badge={mockBadge} size="large" />);
    
    const description = screen.getByText('Unlocked achievement');
    expect(description).toHaveClass('text-base');
  });
});