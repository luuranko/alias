import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text Alias', () => {
  render(<App />);
  const linkElement = screen.getByText(/'Alias'/i);
  expect(linkElement).toBeInTheDocument();
});
