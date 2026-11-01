---
title: "Repeated String Match"
description: "Given two strings a and b, return the minimum number of times you should repeat string a so that string b is a substring of it. If it is impossible for…"
source: "https://leetcode.com/problems/repeated-string-match/"
tags: ["String", "String Matching"]
complexity:
  time: "O((m / n + 1) \\cdot (m + n) \\cdot m)"
  space: "O(m + n)"
---

## Problem

<p>Given two strings <code>a</code> and <code>b</code>, return <em>the minimum number of times you should repeat string </em><code>a</code><em> so that string</em> <code>b</code> <em>is a substring of it</em>. If it is impossible for <code>b</code>​​​​​​ to be a substring of <code>a</code> after repeating it, return <code>-1</code>.</p>

<p><strong>Notice:</strong> string <code>&quot;abc&quot;</code> repeated 0 times is <code>&quot;&quot;</code>, repeated 1 time is <code>&quot;abc&quot;</code> and repeated 2 times is <code>&quot;abcabc&quot;</code>.</p>

## Solution approach

### Intuition

For `b` to be a substring of `a` repeated `count` times, the repeated string must be at least as long as `b`. It also never needs more than `b.length() / a.length() + 2` copies: one partial copy at the start, the full copies in the middle, and one partial copy at the end. So we keep appending `a` and stop at the first repetition that contains `b`, or give up after that bound.

### Algorithm

1. Start with `s = a` and `count = 1`, and compute `maxPossibleRepetions = b.length() / a.length() + 2`.
2. Repeat up to `maxPossibleRepetions` times:
   - If `s.find(b)` succeeds, return `count`.
   - Otherwise append `a` to `s` and increment `count`.
3. If `b` was never found, return `-1`.

### Complexity

Let $n$ = `a.length()` and $m$ = `b.length()`.

- **Time:** $O((m / n + 1) \cdot (m + n) \cdot m)$ in the worst case — the loop runs about $m / n + 2$ times, and each `find` on a string of length up to $m + 2n$ can cost $O((m + n) \cdot m)$; in practice `find` is close to linear.
- **Space:** $O(m + n)$ — the string `s`.

### Edge cases

- **Already a substring**, e.g. `a = "abc"`, `b = "bc"`: the first check succeeds and the answer is `1`.

## Code

```cpp title="C++"
class Solution {
   public:
    int repeatedStringMatch(string a, string b) {
        string s = a;
        int count = 1;
        int maxPossibleRepetions = b.length() / a.length() + 2;
        for (int i = 1; i <= maxPossibleRepetions; i++) {
            int f = s.find(b);
            if (f != -1) return count;
            s = s + a;
            count++;
        }
        return -1;
    }
};

```
