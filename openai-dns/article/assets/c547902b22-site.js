(() => {
  const root = document.getElementById('alignment-pages-overview');
  root.addEventListener('click', event => {
    const principles = event.target.closest('[data-disclosure-principles]');
    if (principles && principles.getAttribute('href') === '#') event.preventDefault();
    const archive = event.target.closest('[data-toggle-archive]');
    if (!archive) return;
    const older = root.querySelector('[data-archive="older"]');
    const willExpand = older.hidden;
    older.hidden = !willExpand;
    archive.setAttribute('aria-expanded', String(willExpand));
    archive.querySelector('[data-archive-label]').textContent = willExpand ? 'Show less' : 'Load more';
    if (willExpand) {
      const firstLink = older.querySelector('a');
      firstLink?.focus({ preventScroll: true });
    }
  });
  const contents = [...root.querySelectorAll('.ap-contents a')];
  function highlightContents() {
    const sections = contents.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 120) active = section;
    }
    for (const link of contents) {
      if (link.hash === '#' + active?.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  if (contents.length) {
    let queued = false;
    window.addEventListener('scroll', () => {
      if (!queued) requestAnimationFrame(() => { highlightContents(); queued = false; });
      queued = true;
    }, { passive: true });
    highlightContents();
  }
})();
