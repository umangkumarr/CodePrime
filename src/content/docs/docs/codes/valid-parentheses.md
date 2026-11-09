---
title: "Valid Parentheses"
description: "Check whether a string of (), [] and {} brackets is properly matched and nested, using a stack of currently open brackets."
source: "https://leetcode.com/problems/valid-parentheses/"
difficulty: "Easy"
tags: ["String", "Stack"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**

```text
Input:  s = "()"
Output: true
```

**Example 2:**

```text
Input:  s = "()[]{}"
Output: true
```

**Example 3:**

```text
Input:  s = "(]"
Output: false
```

**Example 4:**

```text
Input:  s = "([])"
Output: true
```

**Example 5:**

```text
Input:  s = "([)]"
Output: false
```

**Constraints:**

- $1 \le$ `s.length` $\le 10^4$
- `s` consists of parentheses only `'()[]{}'`.

## Solution approach

### Intuition

Rule 2 says brackets must close in the reverse order of opening: the bracket opened **most recently** must be the **first** one closed. That is last-in, first-out — a stack.

Keep a stack of brackets that are open but not yet closed. An opening bracket is pushed. A closing bracket must match the bracket on top of the stack (rules 1 and 2); if the stack is empty, there is nothing for it to close (rule 3). At the end, anything left on the stack was never closed.

### Algorithm

1. For each character `c` of `s`:
   - If `c` is `(`, `[` or `{`, push it onto `st`.
   - Otherwise compute the matching opener `open` for `c`. If `st` is empty or `st.top() != open`, return `false`; else pop.
2. Return `st.empty()`.

### Walkthrough

Example 5, `"([)]"`:

| `c` | stack before | action |
| --- | --- | --- |
| `(` | empty | push |
| `[` | `(` | push |
| `)` | `( [` | top is `[`, not `(` — return `false` |

Example 4, `"([])"`, pushes `(` and `[`, then `]` pops `[` and `)` pops `(`, leaving the stack empty: `true`.

### Complexity

- **Time:** $O(n)$ — each character is pushed and popped at most once.
- **Space:** $O(n)$ — the stack holds up to `n` openers, e.g. for `"(((("`.

### Edge cases

- **Closing bracket first** (`"]"`): the stack is empty, so the code returns `false`.
- **Unclosed brackets** (`"(["`): the loop finishes but the stack is not empty, so `st.empty()` is `false`.
- **Odd length:** always ends with a mismatch or a non-empty stack, so no special case is needed.

## Code

```cpp
class Solution {
   public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                char open = c == ')' ? '(' : c == ']' ? '[' : '{';
                if (st.empty() || st.top() != open) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};
```

```java
class Solution {
    public boolean isValid(String s) {
        ArrayDeque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                char open = c == ')' ? '(' : c == ']' ? '[' : '{';
                if (st.isEmpty() || st.pop() != open) return false;
            }
        }
        return st.isEmpty();
    }
}
```

```python
class Solution:
    def isValid(self, s: str) -> bool:
        match = {')': '(', ']': '[', '}': '{'}
        stack = []
        for c in s:
            if c in '([{':
                stack.append(c)
            elif not stack or stack.pop() != match[c]:
                return False
        return not stack
```
