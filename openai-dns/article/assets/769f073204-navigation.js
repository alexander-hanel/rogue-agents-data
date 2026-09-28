(() => {
  const header = document.querySelector('.ap-header');
  if (!header) return;
  const toggle = header.querySelector('.ap-menu-toggle');
  const nav = header.querySelector('.ap-nav');
  const content = document.querySelector('main') || document.querySelector('.content');
  const footer = document.querySelector('.ap-footer');
  const mobile = matchMedia('(max-width: 48rem)');
  function setMenu(open) {
    header.dataset.menuOpen = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (content) content.inert = open;
    if (footer) footer.inert = open;
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches) setMenu(false);
  });
})();
