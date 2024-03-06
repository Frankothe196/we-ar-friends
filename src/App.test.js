import { render, screen } from '@testing-library/react';
import UserInterface from './components/userInterface';

test('Check for welcome screen', () => {
  render(<UserInterface />);
  const textElement = screen.getByText(/Welcome to We AR Friends!/i);
  expect(textElement).toBeInTheDocument();
});
