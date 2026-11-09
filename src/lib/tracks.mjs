/**
 * Helpers over src/data/sidebar.json, shared by astro.config.mjs (sidebar) and the track pages,
 * so a sheet's route, its sidebar entry and its listing always agree.
 *
 * A sidebar item is either a page id (string) or a group: {label, items}.
 */

/** URL slug for a group label: "Striver SDE Sheet" -> "striver-sde-sheet". */
export function groupSlug(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Number of pages under a list of items, at any depth. */
export function countPages(items) {
  return items.reduce((n, it) => n + (typeof it === 'string' ? 1 : countPages(it.items)), 0);
}

/** Every page id under a list of items, in order. */
export function pageIds(items) {
  return items.flatMap((it) => (typeof it === 'string' ? [it] : pageIds(it.items)));
}

/** What a group holds: "list" when every page is a company interview list, otherwise "problem". */
export function unitOf(items) {
  const ids = pageIds(items);
  return ids.length && ids.every((id) => id === 'docs/interviews' || id.startsWith('docs/interviews/')) ? 'list' : 'problem';
}

/** "12 problems", "1 problem", "5 lists" (the interview lists' own index page is not a list). */
export function countLabel(items) {
  const unit = unitOf(items);
  const n = pageIds(items).filter((id) => id !== 'docs/interviews').length;
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

/** Top-level groups of a sidebar topic. */
export function topGroups(items) {
  return items.filter((i) => typeof i !== 'string');
}

/** Route of a top-level group's own page, e.g. /docs/leetcode/striver-sde-sheet/. */
export function groupRoute(topic, label) {
  return `/docs/${topic}/${groupSlug(label)}/`;
}

/**
 * Sidebar items for a topic where every top-level group starts with a link to its own page
 * ("All problems", or "All lists" for the company lists).
 * @param {string} topic
 * @param {any[]} items
 */
export function withGroupOverviews(topic, items) {
  return items.map((it) =>
    typeof it === 'string' ? it : {...it, items: [{label: `All ${unitOf(it.items)}s`, link: groupRoute(topic, it.label)}, ...it.items]},
  );
}
