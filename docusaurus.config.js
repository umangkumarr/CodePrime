// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const math = require('remark-math');
const katex = require('rehype-katex');
const config = {
  title: 'CodePrime',
  tagline: 'One place for Data Structure and Algorithms',
  url: 'https://umangkumarr.github.io',
  baseUrl: '/CodePrime/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'umangkumarr', // Usually your GitHub org/user name.
  projectName: 'CodePrime', // Usually your repo name.
  // themes : ['@docusaurus/theme-live-codeblock'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {

          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-252859791-1',
          anonymizeIP: true,
        },
        gtag: {
          trackingID: 'G-EBGEYEL112',
          anonymizeIP: true,
        },

      }),
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').themeConfig} */
  {
    // announcementBar: {
    //   id: 'support_us',
    //   content:
    //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
    //   backgroundColor: '#fafbfc',
    //   textColor: '#091E42',
    //   isCloseable: false,
    // },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      }
    },
    navbar: {
      title: 'CodePrime',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'DSA',
          label: 'DSA',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'Leetcode',
          label: 'Leetcode',
        },
        {
          type: 'dropdown',
          dropdownActiveClassDisabled: true,
          label: "Projects",
          items: [
            {
              href: 'https://umangkumarr.github.io/AI-Snake/',
              label: 'AI-Snake',
            },
            {
              href: 'https://umangkumarr.github.io/AI-Minesweeper/',
              label: 'AI-Minesweeper',
            },

          ],
        },
        {
          type: 'docSidebar',  // docSidebar
          position: 'left',
          sidebarId: 'ProjectEuler', // foldername
          label: 'ProjectEuler+',     // navbar title
        },
        {
          type: 'docSidebar',  // docSidebar
          position: 'left',
          sidebarId: 'About', // foldername
          label: 'Contribute',     // navbar title
        },



        { to: '/blog', label: 'Blog', position: 'right' },
        {
          href: 'https://github.com/umangkumarr/CodePrime',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Problems',
              to: '/docs/Problems/intro',
            },
          ],
        },
        //   {
        //     title: 'Community',
        //     items: [
        //       {
        //         label: 'Stack Overflow',
        //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //       },
        //       {
        //         label: 'Discord',
        //         href: 'https://discordapp.com/invite/docusaurus',
        //       },
        //       {
        //         label: 'Twitter',
        //         href: 'https://twitter.com/docusaurus',
        //       },
        //     ],
        //   },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/umangkumarr/CodePrime',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CodePrime, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: darkCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
