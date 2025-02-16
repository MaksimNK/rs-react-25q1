import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FirstTest from '../components/FirstTest';

describe('First test', () => {
  test('render component', async () => {
    render(<FirstTest />);
    expect(screen.getByText(/First Test/i)).toBeInTheDocument();
  });
});
