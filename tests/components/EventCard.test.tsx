import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EventCard } from '@/components/ui/EventCard';

const mockEvent = {
  id: '1',
  title: 'Test Event',
  description: 'Test Description',
  theme: 'Test Theme 🎯',
  emoji: '🎯',
  startDate: '2025-01-20T09:00:00Z',
  endDate: '2025-01-21T21:00:00Z',
  status: 'upcoming' as const,
  participants: 100,
  projects: 25,
  category: 'AI',
  featured: true,
  totalPrizePool: 5000,
  location: 'Global (Online)',
  bannerUrl: 'https://example.com/banner.jpg'
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Theme 🎯')).toBeInTheDocument();
    expect(screen.getByText('100 builders')).toBeInTheDocument();
    expect(screen.getByText('25 projects')).toBeInTheDocument();
  });

  it('shows featured badge for featured events', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const mockOnClick = jest.fn();
    renderWithProviders(<EventCard event={mockEvent} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(mockEvent.id);
  });

  it('is accessible', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label');
    expect(card).toBeInTheDocument();
  });
});