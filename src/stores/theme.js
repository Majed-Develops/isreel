import { writable } from 'svelte/store';

const initial = (() => {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
})();

export const theme = writable(initial);

function applyTheme(val) {
  const root = document.documentElement;
  if (val === 'light') {
    root.setAttribute('data-theme', 'light');
  } else if (val === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}

// apply immediately and on changes
if (typeof document !== 'undefined') {
  applyTheme(initial);
  theme.subscribe((val) => {
    try { localStorage.setItem('theme', val); } catch {}
    applyTheme(val);
  });
}

