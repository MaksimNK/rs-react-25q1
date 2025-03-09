import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../../app/page'; // HomePage is in the app folder now
import { useRouter, useSearchParams } from 'next/navigation';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import * as apiSlice from '../../redux/apiSlice';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../../redux/apiSlice', () => {
  const actualApiSlice = jest.requireActual('../../redux/apiSlice');
  return {
    ...actualApiSlice,
    useFetchDataQuery: jest.fn(),
    useFetchSinglePersonQuery: jest.fn(),
  };
});

interface RouterQuery {
  search?: string;
  page?: string;
  details?: string;
}

const mockPush = jest.fn();

const mockUseRouter = () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });
};

const mockUseSearchParams = (query: RouterQuery) => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: (key: keyof RouterQuery) => query[key] || null,
    toString: () => {
      const params = new URLSearchParams(query as Record<string, string>);
      return params.toString();
    },
  });
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading', async () => {
    const query: RouterQuery = { search: '', page: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error message when data fetch fails', async () => {
    const query: RouterQuery = { search: '', page: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'Network Error' },
      isLoading: false,
    });

    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
  });

  it('renders items list when data is successfully fetched', async () => {
    const mockData = {
      count: 20,
      results: [
        {
          name: 'Luke Skywalker',
          model: 'T-65 X-wing',
          url: 'https://swapi.dev/api/people/1/',
        },
        {
          name: 'Leia Organa',
          model: 'CR90 corvette',
          url: 'https://swapi.dev/api/people/2/',
        },
      ],
    };
    const query: RouterQuery = { search: '', page: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();
  });

  it('renders pagination when there are multiple pages', async () => {
    const mockData = {
      count: 20,
      results: [
        {
          name: 'Luke Skywalker',
          model: 'T-65 X-wing',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    };
    const query: RouterQuery = { search: '', page: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<HomePage />);
    // Assuming your Pagination component renders "Page 1"
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
  });

  it('calls router.push with updated search term and page when a new search is made', async () => {
    const query: RouterQuery = { search: '', page: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      error: null,
      isLoading: false,
    });

    renderWithProviders(<HomePage />);
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Skywalker' } });
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(`/?search=Skywalker&page=1`)
    );
  });

  it('renders detail item page when details are in the query', async () => {
    const mockItem = { name: 'Luke Skywalker', model: 'T-65 X-wing' };
    const query: RouterQuery = { search: '', page: '1', details: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchSinglePersonQuery as jest.Mock).mockReturnValue({
      data: mockItem,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/T-65 X-wing/i)).toBeInTheDocument();
  });

  it('calls handleCloseDetails when close button is clicked', async () => {
    const query: RouterQuery = { search: '', page: '1', details: '1' };
    mockUseRouter();
    mockUseSearchParams(query);
    (apiSlice.useFetchSinglePersonQuery as jest.Mock).mockReturnValue({
      data: { name: 'Luke Skywalker', model: 'T-65 X-wing' },
      error: null,
      isLoading: false,
    });

    renderWithProviders(<HomePage />);
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    await waitFor(() =>
      // Here we expect router.push to be called with a URL string without "details" parameter
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\?(.+)&page=1/)
      )
    );
  });
});
