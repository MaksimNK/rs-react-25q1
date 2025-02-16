import { fetchData, fetchSinglePerson } from '../../utils/api';
import ENDPOINTS from '../../utils/endpoint';

const mockApiResponse = {
  count: 82,
  next: 'https://swapi.dev/api/people/?page=2',
  previous: null,
  results: [
    {
      name: 'Luke Skywalker',
      model: undefined,
      url: 'https://swapi.dev/api/people/1/',
    },
  ],
};

describe('fetchData', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return API response data when fetch is successful', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });

    const data = await fetchData('people', '', 1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('people')
    );
    expect(data).toEqual(mockApiResponse);
  });

  it('should append search query and page to URL when searchTerm is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    });
    await fetchData('people', 'luke', 2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=luke')
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=2')
    );
  });

  it('should return an empty response when fetch returns a response with ok false', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => 'Some error',
    });
    const data = await fetchData('people', '', 1);
    expect(data).toEqual({ count: 0, next: null, previous: null, results: [] });
  });

  it('should return an empty response when fetch fails (rejected promise)', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));
    const data = await fetchData('people', '', 1);
    expect(data).toEqual({ count: 0, next: null, previous: null, results: [] });
  });

  it('should return an empty response when category is invalid', async () => {
    const data = await fetchData('invalidCategory', '', 1);
    expect(data).toEqual({ count: 0, next: null, previous: null, results: [] });
  });
});

describe('fetchSinglePerson', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return single person data when fetch is successful', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse.results[0],
    });
    const data = await fetchSinglePerson('1');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('people/1/')
    );
    expect(data).toEqual(mockApiResponse.results[0]);
  });

  it('should return null when fetch returns a response with ok false', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => 'Error message',
    });
    const data = await fetchSinglePerson('1');
    expect(data).toBeNull();
  });

  it('should return null when fetch fails (rejected promise)', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));
    const data = await fetchSinglePerson('1');
    expect(data).toBeNull();
  });

  it("should return null when category 'people' is not found in ENDPOINTS", async () => {
    const originalEndpoints = { ...ENDPOINTS };
    delete ENDPOINTS['people'];

    const data = await fetchSinglePerson('1');
    expect(data).toBeNull();

    Object.assign(ENDPOINTS, originalEndpoints);
  });
});
