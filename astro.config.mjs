// @ts-check
import {defineConfig} from 'astro/config';
import {unified} from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import mermaid from 'astro-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import rehypeProblemLayout from './src/plugins/rehype-problem-layout.mjs';
import rehypeBaseLinks from './src/plugins/rehype-base-links.mjs';
import rehypeStepCarousel from './src/plugins/rehype-step-carousel.mjs';
import remarkCodeTabs from './src/plugins/remark-code-tabs.mjs';
import {withGroupOverviews} from './src/lib/tracks.mjs';
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import sidebar from './src/data/sidebar.json' with {type: 'json'};
import redirects from './src/data/redirects.json' with {type: 'json'};

const SITE = 'https://umangkumarr.github.io';
const BASE = '/CodePrime';
const GITHUB = 'https://github.com/umangkumarr/CodePrime';
const GA_ID = 'G-EBGEYEL112';

/**
 * Last commit date of every content file, for the sitemap's <lastmod>. Needs full git history
 * (the deploy workflow checks out with fetch-depth: 0); without git, lastmod is simply left out.
 */
function contentDates() {
  const dates = new Map();
  try {
    const log = execFileSync('git', ['log', '--format=@%cI', '--name-only', '--', 'src/content/docs'], {encoding: 'utf8'});
    let date;
    for (const line of log.split('\n')) {
      if (line.startsWith('@')) date = line.slice(1);
      else if (line && !dates.has(line)) dates.set(line, date);
    }
  } catch {
    /* not a git checkout */
  }
  return dates;
}
const dates = contentDates();

/**
 * Source file of a built page URL, e.g. /CodePrime/docs/codes/two-sum/ -> src/content/docs/docs/codes/two-sum.md
 * @param {string} url
 */
function sourceOf(url) {
  const path = new URL(url).pathname.replace(BASE, '').replace(/^\/|\/$/g, '');
  const stem = `src/content/docs/${path || 'index'}`;
  return [`${stem}.md`, `${stem}.mdx`, `${stem}/index.md`, `${stem}/index.mdx`].find((f) => existsSync(f));
}

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // Old Docusaurus URLs → new pages. Static redirect targets are not base-prefixed automatically.
  redirects: Object.fromEntries(Object.entries(redirects).map(([from, to]) => [from, BASE + to])),

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkCodeTabs],
      rehypePlugins: [rehypeKatex, rehypeProblemLayout, rehypeStepCarousel, [rehypeBaseLinks, {base: BASE}]],
    }),
  },

  integrations: [
    // Declared explicitly (Starlight would otherwise add a plain one) so each page gets an accurate <lastmod>.
    sitemap({
      serialize(item) {
        const file = sourceOf(item.url);
        const lastmod = file && dates.get(file);
        return lastmod ? {...item, lastmod} : item;
      },
    }),
    // Must come before Starlight so ```mermaid blocks are claimed first.
    mermaid({theme: 'neutral', autoTheme: true, enableLog: false, mermaidConfig: {securityLevel: 'strict'}}),
    starlight({
      title: 'CodePrime',
      description:
        'DSA interview problems from the Striver SDE sheet and Blind 75, explained step by step with tested C++, Java and Python solutions. For thorough prep and last-minute revision.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      favicon: '/favicon.svg',
      routeMiddleware: './src/routeData.ts',
      social: [{icon: 'github', label: 'GitHub', href: GITHUB}],
      editLink: {baseUrl: `${GITHUB}/edit/main/`},
      lastUpdated: false,
      tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
      customCss: [
        '@fontsource-variable/bricolage-grotesque',
        '@fontsource/ibm-plex-sans/400.css',
        '@fontsource/ibm-plex-sans/400-italic.css',
        '@fontsource/ibm-plex-sans/500.css',
        '@fontsource/ibm-plex-sans/600.css',
        '@fontsource-variable/jetbrains-mono',
        'katex/dist/katex.min.css',
        './src/styles/theme.css',
        './src/styles/content.css',
        './src/styles/glass.css',
      ],
      components: {
        PageTitle: './src/components/overrides/PageTitle.astro',
        MarkdownContent: './src/components/overrides/MarkdownContent.astro',
        SiteTitle: './src/components/overrides/SiteTitle.astro',
      },
      head: [
        // Icons (favicon.svg is added by Starlight): PNG and ICO fallbacks, home-screen icon, web app manifest.
        {tag: 'link', attrs: {rel: 'icon', href: `${BASE}/favicon.ico`, sizes: '48x48'}},
        {tag: 'link', attrs: {rel: 'icon', type: 'image/png', sizes: '96x96', href: `${BASE}/favicon-96.png`}},
        {tag: 'link', attrs: {rel: 'apple-touch-icon', sizes: '180x180', href: `${BASE}/apple-touch-icon.png`}},
        {tag: 'link', attrs: {rel: 'manifest', href: `${BASE}/site.webmanifest`}},
        {tag: 'meta', attrs: {name: 'theme-color', content: '#0b0d12'}},
        {tag: 'meta', attrs: {name: 'author', content: 'Umang Kumar'}},
        // Link previews (Open Graph / X). Starlight already sets og:title, og:description, og:url and og:site_name.
        {tag: 'meta', attrs: {property: 'og:image', content: `${SITE}${BASE}/og.png`}},
        {tag: 'meta', attrs: {property: 'og:image:width', content: '1200'}},
        {tag: 'meta', attrs: {property: 'og:image:height', content: '630'}},
        {tag: 'meta', attrs: {property: 'og:image:alt', content: 'CodePrime: learn the pattern, not the answer'}},
        {tag: 'meta', attrs: {name: 'twitter:image', content: `${SITE}${BASE}/og.png`}},
        {
          tag: 'script',
          attrs: {async: true, src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`},
        },
        {
          tag: 'script',
          content: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`,
        },
      ],
      plugins: [
        starlightSidebarTopics(
          [
            {
              id: 'dsa',
              label: 'DSA Fundamentals',
              link: '/docs/dsa/',
              icon: 'puzzle',
              items: [{label: 'Overview', link: '/docs/dsa/'}, ...sidebar.dsa],
            },
            {
              id: 'leetcode',
              label: 'LeetCode',
              link: '/docs/leetcode/',
              icon: 'list-format',
              items: [{label: 'Overview', link: '/docs/leetcode/'}, ...withGroupOverviews('leetcode', sidebar.leetcode)],
            },
            {
              id: 'euler',
              label: 'Project Euler+',
              link: '/docs/project-euler/',
              icon: 'star',
              items: [{autogenerate: {directory: 'docs/project-euler'}}],
            },
            {
              id: 'system-design',
              label: 'System Design',
              link: '/system-design/',
              icon: 'laptop',
              badge: {text: 'New', variant: 'tip'},
              items: [
                {label: 'Overview', link: '/system-design/'},
                {label: 'Case studies', items: [{autogenerate: {directory: 'system-design/case-studies'}}]},
              ],
            },
          ],
          {
            topics: {
              leetcode: ['/docs/codes/**', '/docs/interviews/**', '/docs/leetcode/**'],
              dsa: ['/docs/dsa/**'],
            },
            exclude: ['/', '/contribute', '/blog', '/blog/**', '/docs/tags', '/docs/tags/**', '/docs/codes/test'],
          },
        ),
      ],
    }),
  ],
});
