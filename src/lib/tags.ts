import {getCollection, type CollectionEntry} from 'astro:content';

/** Slug used in /docs/tags/<slug>/ — matches the old Docusaurus tag URLs. */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[()[\]]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export type TagInfo = {label: string; slug: string; entries: CollectionEntry<'docs'>[]};

/** Every tag used by published problem pages, most used first. */
export async function getTags(): Promise<TagInfo[]> {
  const docs = await getCollection('docs', (e) => e.id.startsWith('docs/') && !e.data.draft && e.data.tags.length > 0);
  const map = new Map<string, TagInfo>();
  for (const entry of docs) {
    for (const label of entry.data.tags) {
      const slug = tagSlug(label);
      const info = map.get(slug) ?? {label, slug, entries: []};
      info.entries.push(entry);
      map.set(slug, info);
    }
  }
  for (const info of map.values()) {
    info.entries.sort((a, b) => a.data.title.localeCompare(b.data.title));
  }
  return [...map.values()].sort((a, b) => b.entries.length - a.entries.length || a.label.localeCompare(b.label));
}
