import { render, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';

test('toggles dark mode', () => {
  const { getByTestId } = render(<ThemeToggle />);
  const button = getByTestId('theme-toggle');
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('dark');
});
