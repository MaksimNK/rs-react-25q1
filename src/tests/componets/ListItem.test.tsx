import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ListItem from '../../components/ListItem';
import { IItem } from '../../utils/api';

// Mock react-router-dom's useSearchParams
const mockSetSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
}));

// Configure mock store
const mockStore = configureMockStore();

describe('ListItem component', () => {
  const items: IItem[] = [
    { name: 'Test Person', url: 'https://swapi.dev/api/people/1/' },
  ];

  it('renders list items and handles click', () => {
    // Create mock store with initial state
    const store = mockStore({
      selectedItem: {
        items: [],
      },
    });

    // Wrap ListItem with Provider
    render(
      <Provider store={store}>
        <ListItem items={items} />
      </Provider>
    );

    // Ensure the item is rendered
    const listItem = screen.getByText('Test Person');
    expect(listItem).toBeInTheDocument();

    // Click on the list item
    fireEvent.click(listItem);

    // Check if setSearchParams was called correctly
    expect(mockSetSearchParams).toHaveBeenCalled();
    const paramsArg = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(paramsArg.get('details')).toBe('1');
  });
});
