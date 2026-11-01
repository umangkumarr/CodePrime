---
title: "Valid Parentheses"
description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open…"
source: "https://leetcode.com/problems/valid-parentheses/"
tags: ["String", "Stack"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Given a string <code>s</code> containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.</p>

<p>An input string is valid if:</p>

<ol>
	<li>Open brackets must be closed by the same type of brackets.</li>
	<li>Open brackets must be closed in the correct order.</li>
</ol>

## Solution approach

### Intuition

The most recently opened bracket must be the first one closed. A stack captures exactly this: push each opening bracket, and every closing bracket must match the bracket on top of the stack.

### Algorithm

1. For each character of `s`: if it is `(`, `[` or an opening curly brace, push it onto `st`.
2. Otherwise it is a closing bracket. If `st` is non-empty and its top is the matching opening bracket, pop it; else return `false`.
3. After the loop, return `true` only if `st` is empty, meaning every opening bracket was closed.

### Complexity

- **Time:** $O(n)$ — each character is pushed and popped at most once.
- **Space:** $O(n)$ — the stack can hold every character, e.g. for `"(((("`.

### Edge cases

- **Closing bracket first**, such as `"]"`: the stack is empty, so the code returns `false`.
- **Unclosed brackets**, such as `"(["`: the final emptiness check returns `false`.

## Code

```cpp title="C++"
class Solution {
   public:
    bool isValid(string s) {
        stack<char> st;
        for (int i = 0; i < s.length(); i++) {
            if (s[i] == '(' || s[i] == '[' || s[i] == '{')
                st.push(s[i]);
            else {
                if (s[i] == '}' && st.size() && st.top() == '{') {
                    st.pop();
                } else if (s[i] == ']' && st.size() && st.top() == '[') {
                    st.pop();
                } else if (s[i] == ')' && st.size() && st.top() == '(') {
                    st.pop();
                } else {
                    return false;
                }
            }
        }
        if (st.size()) return false;
        return true;
    }
};

```
