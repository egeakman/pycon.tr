const storageKey = 'theme-preference';      // persists explicit user choice across visits
const sessionLockKey = 'theme-locked';      // avoids system sync until tab closes

const getColorPreference = () => {
  const saved = localStorage.getItem(storageKey);
  if (saved === 'light' || saved === 'dark') return saved;
  // no saved preference → follow system
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const reflectPreference = () => {
  document.documentElement.setAttribute('data-theme', theme.value);
  const btn = document.querySelector('#theme-toggle');
  if (btn) btn.setAttribute('aria-label', theme.value);
};

const setPreference = (value) => {
  theme.value = value;
  // user explicitly chose → persist and lock for this session
  localStorage.setItem(storageKey, theme.value);
  sessionStorage.setItem(sessionLockKey, '1');
  reflectPreference();
};

const onClick = () => {
  // toggle only between light/dark (explicit override)
  setPreference(theme.value === 'light' ? 'dark' : 'light');
};

const theme = {
  value: getColorPreference(),
};

// Set early to avoid flash
reflectPreference();

window.onload = () => {
  reflectPreference();
  document.querySelector('#theme-toggle')?.addEventListener('click', onClick);
};

// Listen to system changes (unless overridden/locked)
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({ matches: isDark }) => {
    const hasExplicitChoice = !!localStorage.getItem(storageKey);
    const sessionLocked = !!sessionStorage.getItem(sessionLockKey);
    if (hasExplicitChoice || sessionLocked) return; // ignore until tab closes
    theme.value = isDark ? 'dark' : 'light';
    reflectPreference();
  });
