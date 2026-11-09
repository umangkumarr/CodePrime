/**
 * Prefixes the site `base` to root-relative links and image sources written in Markdown,
 * so authors can link to `/docs/codes/two-sum/` without knowing the deploy path.
 * @param {{base: string}} options
 */
export default function rehypeBaseLinks({base}) {
  const prefix = base.replace(/\/$/, '');
  /** @param {any} node */
  const visit = (node) => {
    const attr = node.type === 'element' ? {a: 'href', img: 'src'}[node.tagName] : undefined;
    if (attr) {
      const url = node.properties?.[attr];
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(prefix + '/')) {
        node.properties[attr] = prefix + url;
      }
    }
    node.children?.forEach(visit);
  };
  return (/** @type {any} */ tree) => visit(tree);
}
