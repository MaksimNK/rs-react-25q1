import { render, screen } from '@testing-library/react';
import NotFoundPage from '../../app/not-found';
import { MemoryRouter } from 'react-router-dom';

describe('NotFoundPage component', () => {
  it('renders 404 message and a link to home', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Go back to Home/i)).toBeInTheDocument();
  });
});
