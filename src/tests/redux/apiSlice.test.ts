// apiSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import { api } from '../../redux/apiSlice';
import selectedItemReducer from '../../redux/selectItemSlice';

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

describe('apiSlice endpoints', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetchData returns expected data', async () => {
    const fakeResponse = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' }],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(fakeResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const store = createTestStore();

    const result = await store.dispatch(
      api.endpoints.fetchData.initiate({
        category: 'people',
        searchTerm: 'Test',
        page: 1,
      })
    );

    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(fakeResponse);
  });

  it('fetchSinglePerson returns expected data', async () => {
    const fakePerson = {
      name: 'Luke Skywalker',
      model: 'T-65 X-wing',
      url: 'https://swapi.dev/api/people/1/',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify(fakePerson), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const store = createTestStore();

    const result = await store.dispatch(
      api.endpoints.fetchSinglePerson.initiate({
        id: '1',
        category: 'people',
      })
    );

    expect(result.error).toBeUndefined();
    expect(result.data).toEqual(fakePerson);
  });

  it('fetchData handles error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Internal Server Error' }), {
        status: 500,
        statusText: 'Internal Server Error',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const store = createTestStore();

    const result = await store.dispatch(
      api.endpoints.fetchData.initiate({
        category: 'people',
        searchTerm: 'Test',
        page: 1,
      })
    );

    expect(result.error).toBeDefined();
    expect((result.error as any).status).toBe(500);
  });
});
