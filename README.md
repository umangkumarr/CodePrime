# CodePrime

One place for data structures, algorithms, interview problems and system design — every solution explained with its intuition, algorithm and complexity.

**Live site:** https://umangkumarr.github.io/CodePrime/

Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build): static HTML, built-in search, light and dark themes, and Mermaid diagrams.

## Run locally

Requires **Node.js 22.12+**.

```sh
npm install
npm run dev        # http://localhost:4321/CodePrime/
npm run build      # production build in dist/
npm run preview    # serve the production build
npm run check      # type-check
```

## Project layout

| Path | What lives there |
| --- | --- |
| `src/content/docs/docs/codes/` | Problem pages (one Markdown file each) |
| `src/content/docs/docs/dsa/` | DSA fundamentals articles |
| `src/content/docs/docs/interviews/` | Company interview lists |
| `src/content/docs/docs/project-euler/` | Project Euler+ solutions |
| `src/content/docs/system-design/` | System design overview and case studies |
| `src/content/docs/blog/` | Blog posts |
| `src/data/sidebar.json` | Sidebar groups for the DSA and LeetCode topics |
| `src/data/redirects.json` | Old Docusaurus URLs → new pages |
| `src/plugins/` | Markdown pipeline: problem layout and base-path links |
| `src/components/` | Problem header, track and list pages, Starlight overrides |
| `src/styles/` | Design tokens and reading styles |

## Writing content

See the [contribution guide](https://umangkumarr.github.io/CodePrime/contribute/) (`src/content/docs/contribute.md`) for the problem page format, multi-language code tabs and system design case studies.

## Deployment

Every push to `main` builds and deploys the site through GitHub Actions (`.github/workflows/deploy.yml`). In the repository settings, set **Pages → Source** to **GitHub Actions**.
