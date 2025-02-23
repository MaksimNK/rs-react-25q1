import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../context/ThemeProvider';
import { useTheme } from '../../context/theme-context';

// A dummy component that uses the useTheme hook.
const DummyComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
};

describe('ThemeProvider and useTheme', () => {
  it('throws error when useTheme is used outside of ThemeProvider', () => {
    // Rendering DummyComponent without ThemeProvider should throw.
    expect(() => render(<DummyComponent />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
  });

  it('renders with default theme "light"', () => {
    render(
      <ThemeProvider>
        <DummyComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
  });

  it('updates theme when setTheme is called', () => {
    render(
      <ThemeProvider>
        <DummyComponent />
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /Set Dark/i });
    fireEvent.click(button);
    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
  });

  it('updates the container class based on theme', () => {
    const { container } = render(
      <ThemeProvider>
        <DummyComponent />
      </ThemeProvider>
    );
    // The provider wraps children in a div with class "theme-light" by default.
    expect(container.firstChild).toHaveClass('theme-light');
    const button = screen.getByRole('button', { name: /Set Dark/i });
    fireEvent.click(button);
    // After updating, the class should change to "theme-dark".
    expect(container.firstChild).toHaveClass('theme-dark');
  });
});
