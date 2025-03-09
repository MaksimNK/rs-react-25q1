import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ListItem from '../../components/ListItem';
import { IItem } from '../../types/item';

const mockRouterPush = jest.fn();
const mockRouterQuery = {};
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    query: mockRouterQuery,
  }),
}));

const mockStore = configureMockStore();

describe('ListItem component', () => {
  const items: IItem[] = [
    { name: 'Test Person', url: 'https://swapi.dev/api/people/1/' },
  ];

  beforeEach(() => {
    mockRouterPush.mockClear();
  });

  it('renders list items and handles click', () => {
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

    expect(mockRouterPush).toHaveBeenCalled();
    const routerPushArg = mockRouterPush.mock.calls[0][0];
    expect(routerPushArg).toEqual({
      pathname: '/',
      query: { details: '1' },
    });
  });
});
