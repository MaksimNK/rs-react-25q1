import { render, screen, fireEvent } from '@testing-library/react';
import Search from '../../components/Search';

describe('Search component', () => {
  const handleSearchMock = jest.fn();

  beforeEach(() => {
    handleSearchMock.mockClear();
  });

  it('renders with the initial search term', () => {
    render(<Search searchTerm="initial" handleSearch={handleSearchMock} />);
    const input = screen.getByPlaceholderText("Let's find");
    expect(input).toHaveValue('initial');
  });

  it('calls handleSearch with trimmed input on button click', () => {
    render(<Search searchTerm="" handleSearch={handleSearchMock} />);
    const input = screen.getByPlaceholderText("Let's find");
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value: '   test query   ' } });
    fireEvent.click(button);

    expect(handleSearchMock).toHaveBeenCalledWith('test query');
  });

  it('calls handleSearch on pressing Enter', () => {
    render(<Search searchTerm="" handleSearch={handleSearchMock} />);
    const input = screen.getByPlaceholderText("Let's find");

    fireEvent.change(input, { target: { value: 'enter query' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(handleSearchMock).toHaveBeenCalledWith('enter query');
  });
});
