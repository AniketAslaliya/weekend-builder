import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VoteButton } from '@/components/ui/VoteButton';
import { useAuth } from '@/hooks/useAuth';
import { useVoteRateLimit } from '@/hooks/useRateLimit';

// Mock hooks
jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/useRateLimit');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseVoteRateLimit = useVoteRateLimit as jest.MockedFunction<typeof useVoteRateLimit>;

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('VoteButton', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
    } as any);

    mockUseVoteRateLimit.mockReturnValue({
      isLimited: false,
      remainingRequests: 30,
      checkRateLimit: jest.fn().mockResolvedValue(true),
      getRemainingTime: jest.fn().mockReturnValue(0),
    } as any);
  });

  it('renders vote count correctly', () => {
    renderWithProviders(
      <VoteButton projectId="project-1" voteCount={42} hasVoted={false} onVote={jest.fn()} />
    );
    
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows voted state when user has voted', () => {
    renderWithProviders(
      <VoteButton projectId="project-1" voteCount={42} hasVoted={true} onVote={jest.fn()} />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-error-500'); // Assuming voted state has this class
  });

  it('calls onVote when clicked', async () => {
    const mockOnVote = jest.fn();
    renderWithProviders(
      <VoteButton projectId="project-1" voteCount={42} hasVoted={false} onVote={mockOnVote} />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(mockOnVote).toHaveBeenCalledWith('project-1');
    });
  });

  it('prevents voting when rate limited', async () => {
    mockUseVoteRateLimit.mockReturnValue({
      isLimited: true,
      remainingRequests: 0,
      checkRateLimit: jest.fn().mockResolvedValue(false),
      getRemainingTime: jest.fn().mockReturnValue(30000),
    } as any);

    const mockOnVote = jest.fn();
    renderWithProviders(
      <VoteButton projectId="project-1" voteCount={42} hasVoted={false} onVote={mockOnVote} />
    );
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(mockOnVote).not.toHaveBeenCalled();
    });
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders(
      <VoteButton projectId="project-1" voteCount={42} hasVoted={false} onVote={jest.fn()} />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-pressed');
  });
});