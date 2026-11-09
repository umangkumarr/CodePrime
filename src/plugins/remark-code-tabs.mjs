/**
 * Groups consecutive code blocks in different languages into one <cp-code-tabs> element:
 *
 *   ```cpp      ```java      ```python
 *   ...         ...          ...
 *   ```         ```          ```
 *
 * becomes a single tabbed block (C++ | Java | Python). The tabs themselves are added by
 * src/scripts/reader.ts, which also remembers the reader's language; without JavaScript the
 * blocks simply stay stacked. A block's `title="..."` meta still shows as its frame title, so a page
 * with several approaches writes one run of fences per approach.
 */

const LANGS = {cpp: 'C++', 'c++': 'C++', java: 'Java', python: 'Python', py: 'Python'};
const keyOf = (lang) => ({'c++': 'cpp', py: 'python'})[lang] ?? lang;

function group(parent) {
  if (!Array.isArray(parent.children)) return;
  const out = [];
  let run = [];
  const flush = () => {
    const keys = run.map((n) => keyOf(n.lang));
    if (run.length >= 2 && new Set(keys).size === keys.length) {
      out.push({
        type: 'codeTabs',
        data: {
          hName: 'cp-code-tabs',
          hProperties: {
            className: ['cp-code-tabs'],
            dataLangs: keys.join(' '),
            dataLabels: run.map((n) => LANGS[n.lang]).join('|'),
          },
        },
        children: run,
      });
    } else {
      out.push(...run);
    }
    run = [];
  };
  for (const node of parent.children) {
    if (node.type === 'code' && node.lang && LANGS[node.lang]) {
      // A language that is already in the run starts the next group (e.g. Approach 2 right after Approach 1).
      if (run.some((n) => keyOf(n.lang) === keyOf(node.lang))) flush();
      run.push(node);
    } else {
      flush();
      out.push(node);
      group(node);
    }
  }
  flush();
  parent.children = out;
}

export default function remarkCodeTabs() {
  return (tree) => group(tree);
}
