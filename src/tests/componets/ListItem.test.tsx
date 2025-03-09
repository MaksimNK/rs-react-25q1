import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ListItem from '../../components/ListItem';
import { IItem } from '../../types/item';

const mockRouterPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useSearchParams: () => new URLSearchParams(''),
}));

const mockStore = configureMockStore();

describe('ListItem component', () => {
  const items: IItem[] = [
    { name: 'Test Person', url: 'https://swapi.dev/api/people/1/' },
  ];

  beforeEach(() => {
    mockRouterPush.mockClear();
  });

  it('renders list items and handles click', async () => {
    const store = mockStore({
      selectedItem: {
        items: [],
      },
    });

    render(
      <Provider store={store}>
        <ListItem items={items} />
      </Provider>
    );

    const listItem = screen.getByText('Test Person');
    expect(listItem).toBeInTheDocument();

    fireEvent.click(listItem);

    await waitFor(() =>
      expect(mockRouterPush).toHaveBeenCalledWith(
        expect.stringContaining('details=1')
      )
    );
  });
});
