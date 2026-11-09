/**
 * <cp-notepad>: per-problem scratchpad (see src/components/Notepad.astro).
 *
 *  - notes autosave to localStorage under `codeprime:notes:<permalink>` (this browser only)
 *  - the panel's open state and width are remembered, so it stays open across problems
 *  - Tab / Shift+Tab indent and outdent; Esc leaves the editor (keyboard users can then Tab away)
 *  - Alt+N toggles the panel from anywhere on the page
 */

const NOTES_PREFIX = 'codeprime:notes:';
const OPEN_KEY = 'codeprime:notes-open';
const WIDTH_KEY = 'codeprime:notes-width';
const INDENT = '  ';

const TEMPLATES: Record<string, string> = {
  dryrun: [
    'Dry run — input: ',
    '',
    '| step | i | j | state | note |',
    '|------|---|---|-------|------|',
    '| 1    |   |   |       |      |',
    '| 2    |   |   |       |      |',
    '',
  ].join('\n'),
  approach: [
    '## Idea',
    '- ',
    '',
    '## Steps',
    '1. ',
    '',
    '## Complexity',
    '- time:  O()',
    '- space: O()',
    '',
    '## Edge cases',
    '- ',
    '',
  ].join('\n'),
};

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null || value === '') localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

class CpNotepad extends HTMLElement {
  private fab!: HTMLButtonElement;
  private panel!: HTMLElement;
  private text!: HTMLTextAreaElement;
  private status!: HTMLElement;
  private count!: HTMLElement;
  private saveTimer = 0;

  private get storageKey() {
    return NOTES_PREFIX + (this.dataset.key ?? location.pathname);
  }

  private ready = false;

  connectedCallback() {
    // The page column is an isolated stacking context; live at <body> level so the panel can sit above
    // the sidebars. Moving the element re-runs connectedCallback, so set up only once, at the new spot.
    if (this.parentElement !== document.body) {
      document.body.append(this);
      return;
    }
    if (this.ready) return;
    this.ready = true;
    this.fab = this.querySelector('.cp-notepad__fab')!;
    this.panel = this.querySelector('.cp-notepad__panel')!;
    this.text = this.querySelector('.cp-notepad__text')!;
    this.status = this.querySelector('.cp-notepad__status')!;
    this.count = this.querySelector('.cp-notepad__count')!;

    this.text.value = read(this.storageKey) ?? '';
    this.refreshMeta();
    const width = Number(read(WIDTH_KEY));
    if (width > 0) this.style.setProperty('--cp-notepad-width', `${width}px`);

    this.fab.addEventListener('click', () => this.setOpen(true, true));
    this.panel.addEventListener('click', this.onToolbar);
    this.text.addEventListener('input', this.onInput);
    this.text.addEventListener('keydown', this.onEditorKey);
    this.querySelector('.cp-notepad__resize')?.addEventListener('pointerdown', this.onResizeStart as EventListener);
    document.addEventListener('keydown', this.onGlobalKey);
    window.addEventListener('storage', this.onStorage);
    window.addEventListener('pagehide', this.flush);

    this.setOpen(read(OPEN_KEY) === 'true', false);
  }

  disconnectedCallback() {
    if (!this.ready || this.isConnected) return;
    this.ready = false;
    this.flush();
    document.removeEventListener('keydown', this.onGlobalKey);
    window.removeEventListener('storage', this.onStorage);
    window.removeEventListener('pagehide', this.flush);
  }

  private setOpen(open: boolean, focus: boolean) {
    this.panel.hidden = !open;
    this.toggleAttribute('data-open', open);
    document.documentElement.toggleAttribute('data-notes-open', open);
    this.fab.setAttribute('aria-expanded', String(open));
    write(OPEN_KEY, open ? 'true' : null);
    if (open && focus) this.text.focus();
    if (!open && focus) this.fab.focus();
  }

  private onInput = () => {
    this.status.textContent = 'Saving…';
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(this.flush, 400);
    this.refreshMeta();
  };

  private flush = () => {
    window.clearTimeout(this.saveTimer);
    const ok = write(this.storageKey, this.text.value);
    this.status.textContent = ok ? 'Saved in this browser' : 'Could not save (storage unavailable)';
  };

  private refreshMeta() {
    const value = this.text.value;
    const lines = value === '' ? 0 : value.split('\n').length;
    this.count.textContent = `${lines} line${lines === 1 ? '' : 's'} · ${value.length} chars`;
    this.toggleAttribute('data-has-notes', value.trim() !== '');
  }

  /** Replace the current selection (or insert at the caret) and keep undo history where supported. */
  private insert(snippet: string) {
    this.text.focus();
    const {selectionStart: s, value} = this.text;
    const needsBreak = s > 0 && value[s - 1] !== '\n';
    const content = (needsBreak ? '\n' : '') + snippet;
    if (!document.execCommand?.('insertText', false, content)) {
      this.text.setRangeText(content, s, this.text.selectionEnd, 'end');
      this.onInput();
    }
  }

  private onToolbar = async (event: Event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-np]')?.dataset.np;
    if (!action) return;
    if (action === 'close') this.setOpen(false, true);
    if (action in TEMPLATES) this.insert(TEMPLATES[action]);
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(this.text.value);
        this.status.textContent = 'Copied to clipboard';
      } catch {
        this.text.select();
        this.status.textContent = 'Press Ctrl/⌘+C to copy';
      }
    }
    if (action === 'download') {
      const title = this.dataset.title ?? document.title;
      const body = `# ${title}\n\n${location.href}\n\n${this.text.value}\n`;
      const url = URL.createObjectURL(new Blob([body], {type: 'text/markdown'}));
      const a = Object.assign(document.createElement('a'), {href: url, download: `${this.dataset.slug ?? 'notes'}-notes.md`});
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    if (action === 'clear' && this.text.value && confirm('Delete your notes for this problem?')) {
      this.text.value = '';
      this.flush();
      this.refreshMeta();
      this.text.focus();
    }
  };

  private onEditorKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.text.blur();
      return;
    }
    if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const {selectionStart: s, selectionEnd: end, value} = this.text;
    const lineStart = value.lastIndexOf('\n', s - 1) + 1;
    if (!e.shiftKey && s === end) {
      this.insertRaw(INDENT);
      return;
    }
    // Indent / outdent every line touched by the selection.
    const block = value.slice(lineStart, end);
    const lines = block.split('\n');
    const changed = lines.map((l) => (e.shiftKey ? l.replace(/^ {1,2}|^\t/, '') : INDENT + l)).join('\n');
    this.text.setSelectionRange(lineStart, end);
    this.insertRaw(changed);
    this.text.setSelectionRange(lineStart, lineStart + changed.length);
  };

  private insertRaw(content: string) {
    if (!document.execCommand?.('insertText', false, content)) {
      this.text.setRangeText(content, this.text.selectionStart, this.text.selectionEnd, 'end');
      this.onInput();
    }
  }

  private onGlobalKey = (e: KeyboardEvent) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === 'KeyN') {
      e.preventDefault();
      this.setOpen(this.panel.hidden, true);
    } else if (e.key === 'Escape' && !this.panel.hidden && this.panel.contains(document.activeElement)) {
      this.setOpen(false, true);
    }
  };

  /** Keep two tabs on the same problem in sync. */
  private onStorage = (e: StorageEvent) => {
    if (e.key === this.storageKey && document.activeElement !== this.text) {
      this.text.value = e.newValue ?? '';
      this.refreshMeta();
    }
  };

  private onResizeStart = (e: PointerEvent) => {
    e.preventDefault();
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);
    this.setAttribute('data-resizing', '');
    const move = (ev: PointerEvent) => {
      const width = Math.min(Math.max(window.innerWidth - ev.clientX, 280), window.innerWidth * 0.6);
      this.style.setProperty('--cp-notepad-width', `${Math.round(width)}px`);
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      this.removeAttribute('data-resizing');
      const width = parseInt(this.style.getPropertyValue('--cp-notepad-width'), 10);
      if (width > 0) write(WIDTH_KEY, String(width));
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  };
}

if (!customElements.get('cp-notepad')) customElements.define('cp-notepad', CpNotepad);

export {};
