import { render, screen } from '@testing-library/react';
import App from './App';

test('renders budget tracker heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/budget tracker/i);
  expect(headingElement).toBeInTheDocument();
});