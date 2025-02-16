import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeSelector from '../../components/ThemeSelector';
import { useTheme } from '../../context/ThemeProvider';

jest.mock('../../context/ThemeProvider', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
  })),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeSelector', () => {
  beforeEach(() => {
    mockUseTheme.mockClear();
  });

  it('renders with current theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });

    render(<ThemeSelector />);

    expect(screen.getByLabelText(/select theme/i)).toHaveValue('dark');
    expect(screen.getByRole('option', { name: 'Light' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dark' })).toBeInTheDocument();
  });

  it('updates theme on selection change', async () => {
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeSelector />);

    const select = screen.getByLabelText(/select theme/i);
    await userEvent.selectOptions(select, 'dark');

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ThemeSelector />);
    expect(asFragment()).toMatchSnapshot();
  });
});
