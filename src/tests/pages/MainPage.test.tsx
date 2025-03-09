import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MainPage from '../../pages/index';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import * as apiSlice from '../../redux/apiSlice';

interface RouterQuery {
  search?: string;
  page?: string;
  details?: string;
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../redux/apiSlice', () => {
  const actualApiSlice = jest.requireActual('../../redux/apiSlice');
  return {
    ...actualApiSlice,
    useFetchDataQuery: jest.fn(),
    useFetchSinglePersonQuery: jest.fn(),
  };
});

const mockPush = jest.fn();

const mockUseRouter = (query: RouterQuery) => {
  (useRouter as jest.Mock).mockReturnValue({
    query,
    push: mockPush,
  });
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

describe('MainPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is loading', async () => {
    mockUseRouter({ search: '', page: '1' });
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error message when data fetch fails', async () => {
    mockUseRouter({ search: '', page: '1' });
    // Simulate error state
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'Network Error' },
      isLoading: false,
    });

    renderWithProviders(<MainPage />);
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

    mockUseRouter({ search: '', page: '1' });
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<MainPage />);
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

    mockUseRouter({ search: '', page: '1' });
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/Page 1/i)).toBeInTheDocument();
  });

  it('calls router.push with updated search term and page when a new search is made', async () => {
    mockUseRouter({ search: '', page: '1' });
    (apiSlice.useFetchDataQuery as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      error: null,
      isLoading: false,
    });

    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Skywalker' } });

    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/',
        query: { search: 'Skywalker', page: '1' },
      })
    );
  });

  it('renders detail item page when details are in the query', async () => {
    const mockItem = { name: 'Luke Skywalker', model: 'T-65 X-wing' };
    mockUseRouter({ search: '', page: '1', details: '1' });
    // Simulate fetching detail item data
    (apiSlice.useFetchSinglePersonQuery as jest.Mock).mockReturnValue({
      data: mockItem,
      error: null,
      isLoading: false,
    });

    renderWithProviders(<MainPage />);
    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.getByText(/T-65 X-wing/i)).toBeInTheDocument();
  });

  it('calls handleCloseDetails when close button is clicked', async () => {
    mockUseRouter({ search: '', page: '1', details: '1' });
    (apiSlice.useFetchSinglePersonQuery as jest.Mock).mockReturnValue({
      data: { name: 'Luke Skywalker', model: 'T-65 X-wing' },
      error: null,
      isLoading: false,
    });

    renderWithProviders(<MainPage />);
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/',
        query: { search: '', page: '1' },
      })
    );
  });
});
