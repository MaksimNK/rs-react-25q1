import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
  it('displays fallback UI when a child component throws an error', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Somthing Wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Error Details/i)).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
