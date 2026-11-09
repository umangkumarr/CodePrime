# Contributing to CodePrime

Thanks for helping! Typo fixes, clearer explanations, better solutions, new problems and new visuals are all welcome.

The full guide, with the page template, lives on the site: **[Contribute](https://umangkumarr.github.io/CodePrime/contribute/)** (source: `src/content/docs/contribute.md`). The essentials:

## Good first contributions

- Fix a typo or an unclear sentence in an explanation.
- Add a walkthrough animation or a Mermaid diagram to a problem whose explanation would be easier with a picture.
- Add a problem that is missing from a sheet.
- Spot a wrong or slow solution? Open an issue with the input that breaks it.

## The rules every problem page follows

1. **The full official statement**: description, every example and the constraints, with `source:` pointing to the original problem.
2. **An explanation that teaches**: `### Intuition`, `### Algorithm`, `### Complexity` (with reasons) and `### Edge cases` under `## Solution approach`.
3. **Three languages in `## Code`**: a ```` ```cpp ````, a ```` ```java ```` and a ```` ```python ```` block, one after another with nothing in between. The site turns each such run into one C++ | Java | Python tab group. Use the judge's own function signature, and the same algorithm and complexity in every language.
4. **Tested before it is submitted**: run each solution on the official examples and on random inputs against a simple brute force. Say in the pull request how you tested it.

## Before you open a pull request

```sh
npm install
python3 .github/scripts/check_content.py   # structure, code tabs, Python syntax, images
npm run check                              # type-check
npm run build                              # the site must build
```

CI runs the same checks on every pull request. Then fork the repository, create a branch, and open a pull request into `main` that says what you changed and how you tested it. All changes are reviewed by the maintainer before they are merged.
