import { render } from '@testing-library/react';
// @ts-ignore
import { fireEvent } from '@testing-library/dom';
import ThemeToggle from '@/components/ThemeToggle';

test('toggles dark mode', () => {
  const { getByTestId } = render(<ThemeToggle />);
  const button = getByTestId('theme-toggle');
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('dark');
});
