// @ts-check
import {defineConfig} from 'astro/config';
import {unified} from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import mermaid from 'astro-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import rehypeProblemLayout from './src/plugins/rehype-problem-layout.mjs';
import rehypeBaseLinks from './src/plugins/rehype-base-links.mjs';
import remarkCodeTabs from './src/plugins/remark-code-tabs.mjs';
import {withGroupOverviews} from './src/lib/tracks.mjs';
import sidebar from './src/data/sidebar.json' with {type: 'json'};
import redirects from './src/data/redirects.json' with {type: 'json'};

const SITE = 'https://umangkumarr.github.io';
const BASE = '/CodePrime';
const GITHUB = 'https://github.com/umangkumarr/CodePrime';
const GA_ID = 'G-EBGEYEL112';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // Old Docusaurus URLs → new pages. Static redirect targets are not base-prefixed automatically.
  redirects: Object.fromEntries(Object.entries(redirects).map(([from, to]) => [from, BASE + to])),

  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkCodeTabs],
      rehypePlugins: [rehypeKatex, rehypeProblemLayout, [rehypeBaseLinks, {base: BASE}]],
    }),
  },

  integrations: [
    // Must come before Starlight so ```mermaid blocks are claimed first.
    mermaid({theme: 'neutral', autoTheme: true, enableLog: false}),
    starlight({
      title: 'CodePrime',
      description:
        'Data structures, algorithms, interview problems and system design — explained, solved and organised.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      favicon: '/favicon.svg',
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
      ],
      components: {
        PageTitle: './src/components/overrides/PageTitle.astro',
        MarkdownContent: './src/components/overrides/MarkdownContent.astro',
        SiteTitle: './src/components/overrides/SiteTitle.astro',
      },
      head: [
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
