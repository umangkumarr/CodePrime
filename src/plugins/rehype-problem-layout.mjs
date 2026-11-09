import {platformOf} from '../lib/platform.mjs';

/**
 * Gives problem pages (front matter `source:`) their reading layout:
 *
 *   ## Problem  → statement wrapped in a card whose header links to the original problem
 *   ## Solution approach,
 *   ## Code     → each wrapped in its own <cp-solution>, a spoiler gate enhanced by
 *                 src/scripts/reader.ts (without JavaScript the content is simply shown)
 *
 * Authors keep writing plain Markdown; nothing here is required in the source.
 */

const h = (tagName, properties, children = []) => ({type: 'element', tagName, properties, children});
const t = (value) => ({type: 'text', value});

function textOf(node) {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

/** Returns the h2 element for a section boundary (plain h2 or Starlight's heading wrapper). */
function h2Of(node) {
  if (node.type !== 'element') return undefined;
  if (node.tagName === 'h2') return node;
  const cls = node.properties?.className;
  if (node.tagName === 'div' && Array.isArray(cls) && cls.includes('sl-heading-wrapper')) {
    return node.children?.find((c) => c.type === 'element' && c.tagName === 'h2');
  }
  return undefined;
}

function wrapSection(children, headingText, build) {
  const start = children.findIndex((n) => {
    const h2 = h2Of(n);
    return h2 && textOf(h2).trim().toLowerCase() === headingText;
  });
  if (start === -1) return children;
  let end = start + 1;
  while (end < children.length && !h2Of(children[end])) end += 1;
  const section = children.slice(start + 1, end);
  return [...children.slice(0, start + 1), build(section), ...children.slice(end)];
}

const externalIcon = h('svg', {width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none', ariaHidden: 'true'}, [
  h('path', {
    d: 'M6 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5V10M9 2h5v5M14 2 7 9',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }),
]);

export default function rehypeProblemLayout() {
  return (tree, file) => {
    const source = file?.data?.astro?.frontmatter?.source;
    if (typeof source !== 'string') return;
    const platform = platformOf(source);

    let children = tree.children;

    children = wrapSection(children, 'problem', (section) =>
      h('div', {className: ['cp-statement']}, [
        h('div', {className: ['cp-statement__bar', 'not-content']}, [
          h('span', {className: ['cp-statement__platform']}, [t(platform)]),
          h('a', {href: source, target: '_blank', rel: 'noopener noreferrer', className: ['cp-statement__link']}, [
            t('Open original problem'),
            externalIcon,
          ]),
        ]),
        h('div', {className: ['cp-statement__body']}, section),
      ]),
    );

    const tryLink = h('a', {href: source, target: '_blank', rel: 'noopener noreferrer'}, [t(platform)]);

    /** Spoiler gate: the section is blurred until the reader chooses to reveal it. */
    const gate = ({title, text, show, hide}) => (section) =>
      h('cp-solution', {className: ['cp-solution']}, [
        h('div', {className: ['cp-solution__body'], tabIndex: -1}, section),
        h('div', {className: ['cp-solution__gate', 'not-content']}, [
          h('p', {className: ['cp-solution__title']}, [t(title)]),
          h('p', {className: ['cp-solution__text']}, text),
          h('div', {className: ['cp-solution__actions']}, [
            h('button', {type: 'button', className: ['cp-btn', 'cp-btn--solid'], dataAction: 'reveal'}, [t(show)]),
            h('button', {type: 'button', className: ['cp-btn', 'cp-btn--link'], dataAction: 'always'}, [
              t('Always show solutions'),
            ]),
          ]),
        ]),
        h('div', {className: ['cp-solution__bar', 'not-content']}, [
          h('button', {type: 'button', className: ['cp-btn', 'cp-btn--link'], dataAction: 'hide'}, [t(hide)]),
        ]),
      ]);

    children = wrapSection(
      children,
      'solution approach',
      gate({
        title: 'Think before you peek',
        text: [t('Work out an approach on your own first — the explanation will still be here when you want it.')],
        show: 'Show approach',
        hide: 'Hide approach',
      }),
    );

    children = wrapSection(
      children,
      'code',
      gate({
        title: 'Give it a try first',
        text: [t('Attempt the problem on '), tryLink, t(' — the code will still be here.')],
        show: 'Show code',
        hide: 'Hide code',
      }),
    );

    tree.children = children;
  };
}
