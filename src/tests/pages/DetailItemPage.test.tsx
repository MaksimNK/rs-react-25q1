import { render, screen, fireEvent } from '@testing-library/react';
import DetailItemPage from '../../pages/DetailItemPage';
import { MemoryRouter } from 'react-router-dom';
import * as apiSlice from '../../redux/apiSlice';
import { IItem } from '../../types/item';
import { QueryStatus } from '@reduxjs/toolkit/query';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
  };
});

interface FakeQueryResult<T> {
  data?: T;
  error?: unknown;
  isLoading: boolean;
  refetch: () => Promise<{
    status: QueryStatus;
    originalArgs: { id: string; category: string };
    requestId: string;
    endpointName: string;
    startedTimeStamp: number;
    fulfilledTimeStamp: number;
  }>;
}

describe('DetailItemPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders item details when fetch is successful', async () => {
    const itemData: IItem = {
      name: 'Luke Skywalker',
      model: 'T-65 X-wing',
      url: 'https://swapi.dev/api/people/1/',
    };

    const fakeResult: FakeQueryResult<IItem> = {
      data: itemData,
      error: undefined,
      isLoading: false,
      refetch: () =>
        Promise.resolve({
          status: QueryStatus.fulfilled,
          originalArgs: { id: '1', category: 'people' },
          requestId: 'dummy',
          endpointName: 'fetchSinglePerson',
          startedTimeStamp: Date.now(),
          fulfilledTimeStamp: Date.now(),
        }),
    };

    const useFetchSinglePersonQueryMock = jest.spyOn(
      apiSlice,
      'useFetchSinglePersonQuery'
    );
    useFetchSinglePersonQueryMock.mockReturnValue(
      fakeResult as unknown as ReturnType<
        typeof apiSlice.useFetchSinglePersonQuery
      >
    );

    render(
      <MemoryRouter>
        <DetailItemPage />
      </MemoryRouter>
    );

    const heading = await screen.findByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Luke Skywalker');
    expect(screen.getByText('T-65 X-wing')).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    const fakeErrorResult: FakeQueryResult<IItem> = {
      data: undefined,
      error: { status: 500, data: 'Error' },
      isLoading: false,
      refetch: () =>
        Promise.resolve({
          status: QueryStatus.rejected,
          originalArgs: { id: '1', category: 'people' },
          requestId: 'dummy',
          endpointName: 'fetchSinglePerson',
          startedTimeStamp: Date.now(),
          fulfilledTimeStamp: Date.now(),
        }),
    };

    const useFetchSinglePersonQueryMock = jest.spyOn(
      apiSlice,
      'useFetchSinglePersonQuery'
    );
    useFetchSinglePersonQueryMock.mockReturnValue(
      fakeErrorResult as unknown as ReturnType<
        typeof apiSlice.useFetchSinglePersonQuery
      >
    );

    render(
      <MemoryRouter>
        <DetailItemPage />
      </MemoryRouter>
    );

    const errorEl = await screen.findByText(/Error fetching data/i);
    expect(errorEl).toBeInTheDocument();
  });

  it('calls navigate("/") when the close button is clicked', async () => {
    const itemData: IItem = {
      name: 'Luke Skywalker',
      model: 'T-65 X-wing',
      url: 'https://swapi.dev/api/people/1/',
    };

    const fakeResult: FakeQueryResult<IItem> = {
      data: itemData,
      error: undefined,
      isLoading: false,
      refetch: () =>
        Promise.resolve({
          status: QueryStatus.fulfilled,
          originalArgs: { id: '1', category: 'people' },
          requestId: 'dummy',
          endpointName: 'fetchSinglePerson',
          startedTimeStamp: Date.now(),
          fulfilledTimeStamp: Date.now(),
        }),
    };

    const useFetchSinglePersonQueryMock = jest.spyOn(
      apiSlice,
      'useFetchSinglePersonQuery'
    );
    useFetchSinglePersonQueryMock.mockReturnValue(
      fakeResult as unknown as ReturnType<
        typeof apiSlice.useFetchSinglePersonQuery
      >
    );

    render(
      <MemoryRouter>
        <DetailItemPage />
      </MemoryRouter>
    );

    const heading = await screen.findByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Luke Skywalker');

    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
