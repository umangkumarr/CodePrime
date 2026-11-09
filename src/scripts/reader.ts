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

// ---------- Language tabs ----------------------------------------------------------

const LANG_KEY = 'codeprime:lang';
let tabsId = 0;

/** <cp-code-tabs>: C++ / Java / Python versions of one solution (see src/plugins/remark-code-tabs.mjs). */
class CpCodeTabs extends HTMLElement {
  private langs: string[] = [];
  private panels: HTMLElement[] = [];
  private tabs: HTMLButtonElement[] = [];

  connectedCallback() {
    if (this.tabs.length) return;
    this.langs = (this.dataset.langs ?? '').split(' ');
    const labels = (this.dataset.labels ?? '').split('|');
    this.panels = [...this.children].filter((c): c is HTMLElement => c instanceof HTMLElement);
    if (this.panels.length !== this.langs.length) return;

    const id = `cp-code-${++tabsId}`;
    const list = document.createElement('div');
    list.className = 'cp-code-tabs__list not-content';
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Language');
    this.langs.forEach((lang, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'cp-code-tabs__tab';
      tab.textContent = labels[i] ?? lang;
      tab.id = `${id}-tab-${i}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `${id}-panel-${i}`);
      tab.addEventListener('click', () => setLanguage(lang));
      tab.addEventListener('keydown', (e) => this.onKey(e, i));
      this.tabs.push(tab);
      list.append(tab);
      const panel = this.panels[i];
      panel.id = `${id}-panel-${i}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
    });
    this.prepend(list);
    this.show(read(LANG_KEY) ?? 'cpp');
  }

  /** Show `lang` if this block has it; otherwise keep the current tab (or the first). */
  show(lang: string) {
    let index = this.langs.indexOf(lang);
    if (index === -1) index = Math.max(0, this.tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'));
    this.tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      this.panels[i].hidden = !on;
    });
  }

  private onKey(e: KeyboardEvent, i: number) {
    const n = this.tabs.length;
    const next = {ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1}[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setLanguage(this.langs[next]);
    this.tabs[next].focus();
  }
}

/** The chosen language applies to every block on the page and is remembered for the next page. */
function setLanguage(lang: string) {
  write(LANG_KEY, lang);
  const before = document.activeElement?.getBoundingClientRect().top;
  document.querySelectorAll<CpCodeTabs>('cp-code-tabs').forEach((t) => t.show(lang));
  // Keep the clicked tab where it was, even if blocks above it changed height.
  const after = document.activeElement?.getBoundingClientRect().top;
  if (before !== undefined && after !== undefined) window.scrollBy(0, after - before);
}

if (!customElements.get('cp-code-tabs')) customElements.define('cp-code-tabs', CpCodeTabs);

window.addEventListener('storage', (e) => {
  if (e.key === LANG_KEY && e.newValue) document.querySelectorAll<CpCodeTabs>('cp-code-tabs').forEach((t) => t.show(e.newValue!));
});

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
