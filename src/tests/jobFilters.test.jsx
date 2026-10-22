import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobListPage } from '@/features/jobs/list/JobListPage';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('Job Filters & Listings', () => {
  it('renders search input and filter selects', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/jobs?tab=all']}>
          <JobListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText(/search by job title/i)).toBeInTheDocument();
    expect(screen.getByText(/recommended jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/all jobs/i)).toBeInTheDocument();
  });

  it('filters job list by search query keyword', async () => {
    const queryClient = createTestQueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/jobs?tab=all']}>
          <JobListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText(/search by job title/i);
    await user.type(searchInput, 'React');

    await waitFor(() => {
      expect(screen.getByText(/React Front-End Architect/i)).toBeInTheDocument();
    });
  });
});
