import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import Item from '../../components/Item';
import selectedItemReducer from '../../redux/selectItemSlice';

const mockItem = {
  name: 'X-wing',
  model: 'T-65B X-wing',
  url: 'https://swapi.dev/api/starships/12/',
};

describe('Item component', () => {
  it('toggles selection', async () => {
    const store = configureStore({
      reducer: {
        selectedItem: selectedItemReducer,
      },
    });

    render(
      <Provider store={store}>
        <Item data={mockItem} />
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');

    await userEvent.click(checkbox);
    expect(store.getState().selectedItem.items).toContainEqual(mockItem);

    await userEvent.click(checkbox);
    expect(store.getState().selectedItem.items).not.toContainEqual(mockItem);
  });

  it('displays model when available', () => {
    const store = configureStore({
      reducer: {
        selectedItem: selectedItemReducer,
      },
    });

    render(
      <Provider store={store}>
        <Item data={mockItem} />
      </Provider>
    );

    expect(screen.getByText(/Model: T-65B X-wing/)).toBeInTheDocument();
  });
});
