import { render } from '@testing-library/react';
// @ts-ignore
import { fireEvent } from '@testing-library/dom';
import { NextIntlClientProvider } from 'next-intl';
import ThemeToggle from '@/components/ThemeToggle';

const messages = { theme_to_light: 'Switch to light theme', theme_to_dark: 'Switch to dark theme' };

test('toggles dark mode', () => {
  const { getByTestId } = render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeToggle />
    </NextIntlClientProvider>
  );
  const button = getByTestId('theme-toggle');
  fireEvent.click(button);
  expect(document.documentElement.dataset.theme).toBe('dark');
});
