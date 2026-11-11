/**
 * Turns a walkthrough written as its first frame, `![alt](/img/codes/<slug>/<name>/01.webp)`, into a step
 * carousel of every frame in that folder. `frames.json` next to the frames gives the count and size.
 *
 * The output works without JavaScript: the frames sit in a horizontal scroll-snap track, so they can be swiped
 * or scrolled one step at a time. `src/scripts/steps.ts` adds the step counter, previous/next buttons, dots
 * and keyboard control. Must run before `rehype-base-links` (which prefixes the site base to `src`).
 */
import fs from 'node:fs';
import path from 'node:path';

const FIRST_FRAME = /^\/img\/codes\/([^/]+)\/([^/]+)\/01\.webp$/;
const PUBLIC = path.resolve('public');

/** @param {string} tag @param {Record<string, unknown>} properties @param {any[]} [children] */
const h = (tag, properties, children = []) => ({type: 'element', tagName: tag, properties, children});

/** @param {any} img */
function carousel(img) {
  const src = String(img.properties?.src ?? '');
  const match = FIRST_FRAME.exec(src);
  if (!match) return null;
  const dir = path.join(PUBLIC, 'img', 'codes', match[1], match[2]);
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'frames.json'), 'utf8'));
  const count = Number(manifest.frames);
  const alt = String(img.properties.alt ?? '');
  const base = src.slice(0, -'01.webp'.length);

  const slides = Array.from({length: count}, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return h('li', {className: ['cp-steps__slide'], ariaLabel: `Step ${i + 1} of ${count}`}, [
      h('img', {
        src: `${base}${n}.webp`,
        alt: `${alt}, step ${i + 1} of ${count}`,
        width: manifest.width,
        height: manifest.height,
        loading: i === 0 ? 'eager' : 'lazy',
        decoding: 'async',
        draggable: 'false',
      }),
    ]);
  });

  return h(
    'figure',
    {className: ['cp-steps', 'not-content'], dataSteps: String(count), style: `--cp-steps-w: ${manifest.width}px`},
    [
      h('ol', {className: ['cp-steps__track'], tabIndex: 0, ariaLabel: `${alt} (${count} steps)`}, slides),
      h('figcaption', {className: ['cp-steps__caption']}, [{type: 'text', value: `${count} steps. Swipe or scroll to move between them.`}]),
    ],
  );
}

export default function rehypeStepCarousel() {
  /** @param {any} node */
  const visit = (node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      // Markdown puts a lone image inside a paragraph: replace the whole paragraph.
      if (child.type === 'element' && child.tagName === 'p') {
        const kids = child.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
        if (kids.length === 1 && kids[0].tagName === 'img') return carousel(kids[0]) ?? child;
      }
      if (child.type === 'element' && child.tagName === 'img') return carousel(child) ?? child;
      visit(child);
      return child;
    });
  };
  return (/** @type {any} */ tree) => visit(tree);
}
