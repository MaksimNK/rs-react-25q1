import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetailItemPage from '../../components/DetailItemPage';
import { useRouter } from 'next/router';
import * as apiSlice from '../../redux/apiSlice';
import { IItem } from '../../types/item';
import { QueryStatus } from '@reduxjs/toolkit/query';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

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
  let mockRouter: { push: jest.Mock; query: { id: string } };

  beforeEach(() => {
    mockRouter = { push: jest.fn(), query: { id: '1' } };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

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

    // Добавляем пропс id при рендеринге
    render(<DetailItemPage onClose={() => {}} id={mockRouter.query.id} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Luke Skywalker'
      );
      expect(screen.getByText('T-65 X-wing')).toBeInTheDocument();
    });
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

    // Добавляем пропс id при рендеринге
    render(<DetailItemPage onClose={() => {}} id={mockRouter.query.id} />);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    });
  });

  it('calls router.push("/") when the close button is clicked', async () => {
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

    // Добавляем пропс id при рендеринге
    render(
      <DetailItemPage
        onClose={() => mockRouter.push('/')}
        id={mockRouter.query.id}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Luke Skywalker'
      );
    });

    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
