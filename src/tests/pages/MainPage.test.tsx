import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainPage from '../../pages/MainPage';
import selectedItemReducer from '../../redux/selectItemSlice';
import { api } from '../../redux/apiSlice';
import * as reactRouterDom from 'react-router-dom'; // moved to top level

function createTestStore() {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      selectedItem: selectedItemReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
}

jest.mock('../../components/Search', () => ({
  __esModule: true,
  default: ({
    searchTerm,
    handleSearch,
  }: {
    searchTerm: string;
    handleSearch: (value: string) => void;
  }) => (
    <input
      data-testid="search-input"
      value={searchTerm}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleSearch(e.target.value)
      }
    />
  ),
}));

jest.mock('../../components/Pagination', () => ({
  __esModule: true,
  Pagination: ({
    currentPage,
    onPageChange,
  }: {
    currentPage: number;
    totalPages?: number;
    onPageChange: (newPage: number) => void;
  }) => (
    <button
      data-testid="pagination-button"
      onClick={() => onPageChange(currentPage + 1)}
    >
      Next Page
    </button>
  ),
}));

jest.mock('../../components/Flyout', () => ({
  __esModule: true,
  default: () => <div data-testid="flyout">Flyout</div>,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('MainPage Component - Extra Coverage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('navigates to details page if "details" search param exists', async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?details=42']}>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('details/42', {
        replace: true,
      });
    });
  });

  it('updates search term when Search input changes', async () => {
    const fakeSuccessResponse = {
      results: [
        { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      ],
      count: 1,
      next: null,
      previous: null,
    };

    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(fakeSuccessResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    ) as jest.Mock;

    const store = createTestStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    expect(searchInput.value).toBe('');

    fireEvent.change(searchInput, { target: { value: 'Yoda' } });
    expect(searchInput.value).toBe('Yoda');
  });

  it('updates page search param when Pagination button is clicked', async () => {
    const fakeSuccessResponse = {
      results: [
        { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      ],
      count: 20,
      next: null,
      previous: null,
    };

    (global.fetch as jest.Mock) = jest.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify(fakeSuccessResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    ) as jest.Mock;

    const setSearchParamsMock = jest.fn();
    jest
      .spyOn(reactRouterDom, 'useSearchParams')
      .mockReturnValue([new URLSearchParams('?page=1'), setSearchParamsMock]);

    const store = createTestStore();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="*" element={<MainPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });

    const paginationButton = screen.getByTestId('pagination-button');
    fireEvent.click(paginationButton);

    expect(setSearchParamsMock).toHaveBeenCalled();
    const newParams = setSearchParamsMock.mock.calls[0][0] as URLSearchParams;
    expect(newParams.get('page')).toBe('2');
  });
});
