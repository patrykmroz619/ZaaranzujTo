import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else if (theme === 'light') root.classList.remove('dark');
  else root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme };
}
