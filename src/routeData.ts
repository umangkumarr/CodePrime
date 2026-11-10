/**
 * Search metadata for content pages (Starlight route middleware, see `routeMiddleware` in astro.config.mjs).
 *
 * Problem, DSA and Project Euler pages get:
 *  - a <title> shaped like real searches: "Two Sum — Solution in C++, Java & Python | CodePrime"
 *    (the visible H1 stays "Two Sum")
 *  - og:type "article"
 *  - JSON-LD: a TechArticle describing what the page teaches, and a BreadcrumbList
 *    (Home › LeetCode › sheet › problem) that Google can show instead of the raw URL.
 *
 * Every value comes from the page's front matter and src/data/sidebar.json, so new pages get this automatically.
 */
import {defineRouteMiddleware} from '@astrojs/starlight/route-data';
import sidebar from './data/sidebar.json';
import {groupRoute} from './lib/tracks.mjs';
import {platformOf} from './lib/platform.mjs';

type Item = string | {label: string; items: Item[]};
type HeadEntry = {tag: string; attrs?: Record<string, string | boolean | undefined>; content?: string};

const SITE_NAME = 'CodePrime';
const LANGS = 'C++, Java & Python';
const PERSON_ID = 'https://umangkumarr.github.io/#person';

/** The top-level sidebar group (sheet) that lists `id`, if any. */
function sheetOf(topic: 'leetcode' | 'dsa', id: string): string | undefined {
  const contains = (items: Item[]): boolean => items.some((i) => (typeof i === 'string' ? i === id : contains(i.items)));
  for (const group of sidebar[topic] as Item[]) {
    if (typeof group !== 'string' && contains(group.items)) return group.label;
  }
  return undefined;
}

function setMeta(head: HeadEntry[], key: 'name' | 'property', name: string, content: string) {
  const existing = head.find((h) => h.tag === 'meta' && h.attrs?.[key] === name);
  if (existing) existing.attrs = {...existing.attrs, content};
  else head.push({tag: 'meta', attrs: {[key]: name, content}});
}

export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const {entry, head} = route;
  const id = entry.id;
  const kind = id.startsWith('docs/codes/')
    ? 'problem'
    : id.startsWith('docs/dsa/') && id !== 'docs/dsa'
      ? 'dsa'
      : id.startsWith('docs/project-euler/') && id !== 'docs/project-euler'
        ? 'euler'
        : undefined;
  if (!kind) return;

  const site = context.site ?? new URL('https://umangkumarr.github.io');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const abs = (path: string) => new URL(`${base}${path}`, site).href;
  const url = abs(`/${id}/`);
  const {title, description, tags = [], difficulty, source} = entry.data;

  // Title shaped like the searches people make.
  const eulerNumber = kind === 'euler' ? String(parseInt(id.split('/').pop() ?? '', 10)) : '';
  const searchTitle =
    kind === 'problem'
      ? `${title} — Solution in ${LANGS}`
      : kind === 'euler'
        ? `Project Euler ${eulerNumber}: ${title} — ${LANGS}`
        : `${title} — Explained with ${LANGS}`;
  const titleTag = head.find((h) => h.tag === 'title');
  if (titleTag) titleTag.content = `${searchTitle} | ${SITE_NAME}`;
  setMeta(head, 'property', 'og:title', searchTitle);
  setMeta(head, 'property', 'og:type', 'article');

  // Breadcrumbs: Home › track › sheet › page.
  const crumbs: {name: string; url: string}[] = [{name: SITE_NAME, url: abs('/')}];
  if (kind === 'problem') {
    crumbs.push({name: 'LeetCode', url: abs('/docs/leetcode/')});
    const sheet = sheetOf('leetcode', id);
    if (sheet) crumbs.push({name: sheet, url: abs(groupRoute('leetcode', sheet))});
  } else if (kind === 'dsa') {
    crumbs.push({name: 'DSA Fundamentals', url: abs('/docs/dsa/')});
  } else {
    crumbs.push({name: 'Project Euler+', url: abs('/docs/project-euler/')});
  }
  crumbs.push({name: title, url});

  const proficiency = ({Easy: 'Beginner', Medium: 'Intermediate', Hard: 'Expert'} as Record<string, string>)[difficulty ?? ''];
  const article: Record<string, unknown> = {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: searchTitle,
    name: title,
    description,
    url,
    mainEntityOfPage: url,
    image: abs('/og.png'),
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: {'@id': PERSON_ID},
    publisher: {'@id': PERSON_ID},
    isPartOf: {'@type': 'WebSite', '@id': `${abs('/')}#website`, name: SITE_NAME, url: abs('/')},
    keywords: [title, ...tags, 'C++', 'Java', 'Python', kind === 'euler' ? 'Project Euler' : 'coding interview'].join(', '),
    about: tags.map((t: string) => ({'@type': 'Thing', name: t})),
  };
  if (proficiency) article.proficiencyLevel = proficiency;
  if (source) article.isBasedOn = {'@type': 'CreativeWork', name: `${title} on ${platformOf(source)}`, url: source};

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      article,
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({'@type': 'ListItem', position: i + 1, name: c.name, item: c.url})),
      },
      {'@type': 'Person', '@id': PERSON_ID, name: 'Umang Kumar', url: 'https://umangkumarr.github.io/'},
    ],
  };
  head.push({tag: 'script', attrs: {type: 'application/ld+json'}, content: JSON.stringify(graph)});
});
