// CSS follows the OS directly; this keeps browser chrome and diagnostics in sync.
(() => {
  // One-time migration: discard preferences saved by the former manual control.
  try { localStorage.removeItem('portfolio-theme'); } catch { /* Storage is optional. */ }
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  const apply = () => {
    const dark = media?.matches === true;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#061224' : '#f4efe2';
  };
  const listen = () => {
    apply();
    media?.addEventListener('change', apply);
  };
  listen();
  window.addEventListener('pagehide', () => media?.removeEventListener('change', apply));
  window.addEventListener('pageshow', (event) => { if (event.persisted) listen(); });
})();
