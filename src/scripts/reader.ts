/**
 * Reader enhancements for content pages. Everything here is progressive:
 * without JavaScript, solutions are visible and the site still works.
 *
 *  - <cp-solution> spoiler gate with an "always show" preference
 *  - "Mark as solved" toggle + ticks in the sidebar (localStorage)
 *  - ← / → to move between pages
 */

const SOLVED_KEY = 'codeprime:solved';
const ALWAYS_SHOW_KEY = 'codeprime:always-show-solutions';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: preference simply won't persist */
  }
}

// ---------- Solved problems ----------------------------------------------------

function getSolved(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(read(SOLVED_KEY) ?? '[]');
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

function renderSolved() {
  const solved = getSolved();
  document.querySelectorAll<HTMLAnchorElement>('#starlight__sidebar a[href]').forEach((a) => {
    a.toggleAttribute('data-solved', solved.has(a.getAttribute('href') ?? ''));
  });
  document.querySelectorAll<HTMLElement>('.cp-problem-header').forEach((header) => {
    const permalink = header.dataset.permalink ?? '';
    const on = solved.has(permalink);
    const toggle = header.querySelector<HTMLButtonElement>('.cp-solved-toggle');
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(on));
    const label = toggle.querySelector('.cp-solved-toggle__label');
    if (label) label.textContent = on ? 'Solved' : 'Mark as solved';
  });
}

document.addEventListener('click', (event) => {
  const toggle = (event.target as HTMLElement).closest<HTMLButtonElement>('.cp-solved-toggle');
  if (!toggle) return;
  const permalink = toggle.closest<HTMLElement>('.cp-problem-header')?.dataset.permalink;
  if (!permalink) return;
  const solved = getSolved();
  if (solved.has(permalink)) solved.delete(permalink);
  else solved.add(permalink);
  write(SOLVED_KEY, JSON.stringify([...solved]));
  renderSolved();
});

window.addEventListener('storage', (e) => {
  if (e.key === SOLVED_KEY) renderSolved();
  if (e.key === ALWAYS_SHOW_KEY) document.querySelectorAll<CpSolution>('cp-solution').forEach((s) => s.sync());
});

renderSolved();

// ---------- Solution gate --------------------------------------------------------

class CpSolution extends HTMLElement {
  private revealed = false;

  connectedCallback() {
    this.addEventListener('click', this.onClick);
    this.sync();
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
  }

  sync() {
    const always = read(ALWAYS_SHOW_KEY) === 'true';
    this.toggleAttribute('data-open', this.revealed || always);
    this.toggleAttribute('data-always', always);
    const body = this.querySelector<HTMLElement>('.cp-solution__body');
    if (body) body.inert = !(this.revealed || always);
  }

  reveal() {
    this.revealed = true;
    this.sync();
  }

  private onClick = (event: Event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'reveal') this.revealed = true;
    if (action === 'always') write(ALWAYS_SHOW_KEY, 'true');
    if (action === 'hide') {
      this.revealed = false;
      write(ALWAYS_SHOW_KEY, 'false');
    }
    // The "always show" preference is shared, so every gate on the page follows it.
    document.querySelectorAll<CpSolution>('cp-solution').forEach((s) => s.sync());
    if (action !== 'hide') this.querySelector<HTMLElement>('.cp-solution__body')?.focus({preventScroll: true});
  };
}

if (!customElements.get('cp-solution')) customElements.define('cp-solution', CpSolution);

/** A table-of-contents link (or shared URL) pointing inside a hidden section opens that section. */
function revealHashTarget() {
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  const gate = target?.closest<CpSolution>('cp-solution');
  if (!gate || gate.hasAttribute('data-open')) return;
  gate.reveal();
  requestAnimationFrame(() => target?.scrollIntoView());
}

window.addEventListener('hashchange', revealHashTarget);
revealHashTarget();

// ---------- Keyboard navigation ----------------------------------------------------

document.addEventListener('keydown', (e) => {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const target = e.target as HTMLElement | null;
  if (target?.closest('input, textarea, select, [contenteditable="true"], pre, [role="tablist"], dialog')) return;
  if (window.getSelection()?.toString()) return;
  const link = document.querySelector<HTMLAnchorElement>(
    `.pagination-links a[rel="${e.key === 'ArrowLeft' ? 'prev' : 'next'}"]`,
  );
  if (link) {
    e.preventDefault();
    link.click();
  }
});
