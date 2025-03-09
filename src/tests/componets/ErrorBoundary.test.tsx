import { render, screen, waitFor } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary component', () => {
  it('displays fallback UI when a child component throws an error', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText(/Something Went Wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/Error Details/i)).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });
});
