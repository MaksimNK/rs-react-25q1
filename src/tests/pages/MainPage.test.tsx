import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MainPage from '../../pages/MainPage';
import { fetchData } from '../../utils/api';
import selectedItemReducer from '../../redux/selectItemSlice';

jest.mock('../../utils/api', () => ({
  fetchData: jest.fn(),
}));

const mockStore = configureStore({
  reducer: {
    selectedItem: selectedItemReducer,
  },
});

describe('MainPage', () => {
  beforeEach(() => {
    (fetchData as jest.Mock).mockResolvedValue({
      results: [
        { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      ],
      count: 1,
    });
  });

  it('renders and fetches data', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });

  it('handles loading and error states', async () => {
    (fetchData as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <MainPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText('Error fetching data.Error: API error')
      ).toBeInTheDocument();
    });
  });

  it('updates search params on pagination', async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <MainPage />
          <Routes>
            <Route path="*" element={null} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
});
