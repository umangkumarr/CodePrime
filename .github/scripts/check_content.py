"""Content checks for CodePrime, run in CI on every pull request.

  python3 .github/scripts/check_content.py

Problem pages (src/content/docs/docs/codes/*.md, *.mdx; drafts skipped) must have:
  - front matter: title, description, source, difficulty, complexity
  - "## Problem" with at least one example and a constraints list
  - "## Solution approach" and "## Code"
  - in "## Code": every solution as consecutive ```cpp, ```java and ```python blocks
    (the site turns each run into one C++ | Java | Python tab group)
DSA articles and Project Euler pages that contain code must follow the same three-language rule.
Everywhere: every Python block must parse, and every /img/... image must exist in public/.
Search metadata, on every page under src/content/docs (drafts skipped): a `description` of 50–160 characters
(Google cuts longer ones off), and system design case studies must also declare `difficulty`.

Exit status is non-zero when any page fails, with one line per problem found.
"""

import ast
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONTENT = os.path.join(ROOT, 'src', 'content', 'docs')
DOCS = os.path.join(CONTENT, 'docs')
DESCRIPTION_LIMITS = (50, 160)
FENCE = re.compile(r'^```([\w+-]*)([^\n]*)\n(.*?)^```[ \t]*$', re.S | re.M)
LANG_KEY = {'cpp': 'cpp', 'c++': 'cpp', 'java': 'java', 'python': 'python', 'py': 'python'}


def front_matter(text):
    m = re.match(r'---\n(.*?)\n---\n', text, re.S)
    return m.group(1) if m else ''


def section(text, heading):
    """Body of a '## heading' section, up to the next '## ' heading."""
    m = re.search(rf'^## {re.escape(heading)}[ \t]*\n(.*?)(?=^## |\Z)', text, re.S | re.M)
    return m.group(1) if m else None


def language_groups(code_text):
    """Return problems with the cpp -> java -> python grouping of the code blocks in `code_text`."""
    problems = []
    fences = [(m.start(), m.end(), LANG_KEY.get(m.group(1))) for m in FENCE.finditer(code_text)]
    fences = [f for f in fences if f[2]]
    if not fences:
        return ['no C++/Java/Python code blocks']
    i = 0
    while i < len(fences):
        run = fences[i:i + 3]
        langs = [f[2] for f in run]
        gaps = [code_text[a[1]:b[0]] for a, b in zip(run, run[1:])]
        if langs != ['cpp', 'java', 'python']:
            problems.append(f'expected a cpp, java, python run but found {langs} (code block {i + 1})')
            break
        if any(g.strip() for g in gaps):
            problems.append(f'text between the cpp/java/python blocks of solution {i // 3 + 1} breaks the tab group')
        i += 3
    return problems


def python_syntax(text):
    problems = []
    for m in FENCE.finditer(text):
        if LANG_KEY.get(m.group(1)) != 'python':
            continue
        try:
            ast.parse(m.group(3))
        except SyntaxError as e:
            problems.append(f'Python block does not parse: line {e.lineno}: {e.msg}')
    return problems


def images(text):
    problems = []
    for url in re.findall(r'\]\((/img/[^)\s]+)', text) + re.findall(r'src="(/img/[^"]+)"', text):
        if not os.path.exists(os.path.join(ROOT, 'public', url.lstrip('/'))):
            problems.append(f'missing image {url}')
    return problems


def search_metadata(path, text):
    """Front matter that search results depend on (see "Search metadata" in CLAUDE.md)."""
    fm = front_matter(text)
    problems = []
    m = re.search(r'^description:\s*(.*)$', fm, re.M)
    description = m.group(1).strip().strip('"\'') if m else ''
    low, high = DESCRIPTION_LIMITS
    if not description:
        problems.append('front matter: missing description (it is the Google snippet)')
    elif not low <= len(description) <= high:
        problems.append(f'front matter: description is {len(description)} characters; keep it {low}-{high}')
    rel = os.path.relpath(path, CONTENT).replace(os.sep, '/')
    if rel.startswith('system-design/case-studies/') and not re.search(r'^difficulty:\s*"?(Easy|Medium|Hard)"?\s*$', fm, re.M):
        problems.append('front matter: system design case studies need difficulty: Easy, Medium or Hard')
    return problems


def check_problem(text):
    problems = []
    fm = front_matter(text)
    for key in ('title', 'description', 'source', 'difficulty', 'complexity'):
        if not re.search(rf'^{key}:', fm, re.M):
            problems.append(f'front matter is missing `{key}`')
    statement = section(text, 'Problem')
    if statement is None:
        problems.append('missing "## Problem"')
    else:
        if 'Example' not in statement:
            problems.append('"## Problem" has no example')
        if 'Constraints' not in statement:
            problems.append('"## Problem" has no constraints')
    if section(text, 'Solution approach') is None:
        problems.append('missing "## Solution approach"')
    code = section(text, 'Code')
    if code is None:
        problems.append('missing "## Code"')
    else:
        problems += language_groups(code)
    return problems


def main():
    failures = 0
    checked = 0
    targets = []
    codes = os.path.join(DOCS, 'codes')
    for name in sorted(os.listdir(codes)):
        if name.endswith(('.md', '.mdx')):
            targets.append((os.path.join(codes, name), True))
    for sub in ('dsa', 'project-euler'):
        for dirpath, _, files in os.walk(os.path.join(DOCS, sub)):
            for name in sorted(files):
                if name.endswith(('.md', '.mdx')):
                    targets.append((os.path.join(dirpath, name), False))

    for path, is_problem in targets:
        text = open(path, encoding='utf-8').read()
        if re.search(r'^draft:\s*true', front_matter(text), re.M):
            continue
        has_code = any(LANG_KEY.get(m.group(1)) for m in FENCE.finditer(text))
        if not is_problem and not has_code:
            continue
        checked += 1
        if is_problem:
            problems = check_problem(text)
        else:
            body = section(text, 'Code') or text
            problems = language_groups(body)
        problems += python_syntax(text) + images(text)
        for p in problems:
            print(f'{os.path.relpath(path, ROOT)}: {p}')
        failures += bool(problems)

    # Search metadata on every content page, not only those with code.
    for dirpath, _, files in os.walk(CONTENT):
        for name in sorted(files):
            if not name.endswith(('.md', '.mdx')):
                continue
            path = os.path.join(dirpath, name)
            text = open(path, encoding='utf-8').read()
            if re.search(r'^draft:\s*true', front_matter(text), re.M):
                continue
            problems = search_metadata(path, text)
            for p in problems:
                print(f'{os.path.relpath(path, ROOT)}: {p}')
            failures += bool(problems)

    print(f'Checked {checked} pages: {failures} with problems.')
    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
