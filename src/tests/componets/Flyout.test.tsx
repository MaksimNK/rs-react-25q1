import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Flyout from '../../components/Flyout';
import selectedItemReducer from '../../redux/selectItemSlice';

const mockSelectedItems = [
  { name: 'X-wing', url: 'https://swapi.dev/api/starships/12/' },
  { name: 'Millennium Falcon', url: 'https://swapi.dev/api/starships/10/' },
];

describe('Flyout component', () => {
  it('renders when items are selected', () => {
    const store = configureStore({
      reducer: {
        selectedItem: selectedItemReducer,
      },
      preloadedState: {
        selectedItem: {
          items: mockSelectedItems,
        },
      },
    });

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    expect(screen.getByText('2 items selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('handles unselect all', async () => {
    const store = configureStore({
      reducer: {
        selectedItem: selectedItemReducer,
      },
      preloadedState: {
        selectedItem: {
          items: mockSelectedItems,
        },
      },
    });

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    await userEvent.click(screen.getByText('Unselect all'));
    expect(store.getState().selectedItem.items).toEqual([]);
  });

  it('generates CSV download link', () => {
    const store = configureStore({
      reducer: {
        selectedItem: selectedItemReducer,
      },
      preloadedState: {
        selectedItem: {
          items: mockSelectedItems,
        },
      },
    });

    render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );

    const downloadLink = screen.getByText('Download').closest('a');
    expect(downloadLink).toHaveAttribute('href');
    expect(downloadLink).toHaveAttribute('download', '2_items.csv');
  });
});
