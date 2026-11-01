/**
 * Prefixes the site `base` to root-relative links written in Markdown,
 * so authors can link to `/docs/codes/two-sum/` without knowing the deploy path.
 * @param {{base: string}} options
 */
export default function rehypeBaseLinks({base}) {
  const prefix = base.replace(/\/$/, '');
  /** @param {any} node */
  const visit = (node) => {
    if (node.type === 'element' && node.tagName === 'a') {
      const href = node.properties?.href;
      if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(prefix + '/')) {
        node.properties.href = prefix + href;
      }
    }
    node.children?.forEach(visit);
  };
  return (/** @type {any} */ tree) => visit(tree);
}
