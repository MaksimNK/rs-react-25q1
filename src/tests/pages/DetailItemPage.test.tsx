import { render, screen, fireEvent } from '@testing-library/react';
import DetailItemPage from '../../pages/DetailItemPage';
import { fetchSinglePerson } from '../../utils/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../utils/api');
const mockedFetchSinglePerson = fetchSinglePerson as jest.Mock;

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

describe('DetailItemPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading then item details when fetch is successful', async () => {
    const itemData = {
      name: 'Luke Skywalker',
      model: 'T-65 X-wing',
      url: 'https://swapi.dev/api/people/1/',
    };
    mockedFetchSinglePerson.mockResolvedValue(itemData);

    render(
      <MemoryRouter>
        <DetailItemPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    const heading = await screen.findByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Luke Skywalker');
    expect(screen.getByText('T-65 X-wing')).toBeInTheDocument();
  });

  it('renders error message when fetch fails', async () => {
    mockedFetchSinglePerson.mockRejectedValue(new Error('Fetch error'));

    render(
      <MemoryRouter>
        <DetailItemPage />
      </MemoryRouter>
    );

    const errorEl = await screen.findByText(/Error fetching data/i);
    expect(errorEl).toBeInTheDocument();
  });

  it('calls navigate("/") when the close button is clicked', async () => {
    const itemData = {
      name: 'Luke Skywalker',
      model: 'T-65 X-wing',
      url: 'https://swapi.dev/api/people/1/',
    };
    mockedFetchSinglePerson.mockResolvedValue(itemData);

    render(
      <MemoryRouter>
        <DetailItemPage />
      </MemoryRouter>
    );

    await screen.findByRole('heading', { level: 2 });
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
