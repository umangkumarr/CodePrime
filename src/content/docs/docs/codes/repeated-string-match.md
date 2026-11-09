---
title: "Repeated String Match"
description: "Find the fewest copies of a whose concatenation contains b, in linear time by running KMP over a virtually repeated a."
source: "https://leetcode.com/problems/repeated-string-match/"
difficulty: "Medium"
tags: ["String", "String Matching"]
complexity:
  time: "O(n + m)"
  space: "O(m)"
---

## Problem

You are given two strings `a` and `b` consisting of lowercase English letters.

Return the **minimum** number of times you should repeat string `a` so that string `b` is a **substring** of it. If it is **impossible** for `b` to be a substring of `a` after repeating it, return `-1`.

**Note:** string `"abc"` repeated 0 times is `""`, repeated 1 time is `"abc"` and repeated 2 times is `"abcabc"`.

**Example 1:**

```text
Input:  a = "abcd", b = "cdabcdab"
Output: 3
Explanation: We return 3 because by repeating a three times "ab[cdabcdab]cd", b is a substring of it.
```

**Example 2:**

```text
Input:  a = "a", b = "aa"
Output: 2
```

**Constraints:**

- $1 \le$ `a.length`, `b.length` $\le 10^4$
- `a` and `b` consist of lowercase English letters.

## Solution approach

Let $n$ = `a.length()` and $m$ = `b.length()`.

### Intuition

Think of the infinite string `T = aaaa...`, where `T[i] = a[i % n]`. Any occurrence of `b` in some repetition of `a` is an occurrence in `T`, and because `T` is periodic with period `n`, if `b` occurs anywhere it also occurs starting at some position `start` in `[0, n)` (shift it left by a multiple of `n`). The earliest such occurrence ends at index `start + m - 1 <= n + m - 2`, so it is enough to scan the first `n + m - 1` characters of `T`.

If the first occurrence ends at index `end`, it lies inside the first `end + 1` characters of `T`, which need exactly $\lceil (end + 1) / n \rceil$ copies of `a`. The first occurrence has the smallest `end`, so it gives the minimum count.

Finding the first occurrence of `b` in `T` is a classic pattern search. Calling `find` on longer and longer concatenations can cost $O(n \cdot m)$ per call; **KMP** does it in one linear scan without even building `T` — we read `a[i % n]` on the fly.

### Algorithm

1. Build the KMP failure array `fail` for `b`: `fail[i]` is the length of the longest proper prefix of `b[0..i]` that is also its suffix.
2. Scan `i = 0 .. n + m - 2`, with `c = a[i % n]` and `k` = number of characters of `b` currently matched:
   - While `k > 0` and `b[k] != c`, fall back with `k = fail[k - 1]`.
   - If `b[k] == c`, increment `k`.
   - If `k == m`, `b` ends at index `i`: return `(i + n) / n`, which is $\lceil (i + 1) / n \rceil$.
3. If the scan finishes without a match, return `-1`.

### Walkthrough

Example 1, `a = "abcd"`, `b = "cdabcdab"`: the scan covers `T[0..10] = "abcdabcdabc"`. KMP first completes `b` at `i = 9` (`T[2..9] = "cdabcdab"`), so the answer is `(9 + 4) / 4 = 3`: the match spills into the third copy of `a`.

### Complexity

- **Time:** $O(n + m)$ — building `fail` is $O(m)$ and the scan reads $n + m - 1$ characters; KMP's fall-backs are amortised against the increments of `k`.
- **Space:** $O(m)$ — the failure array. The repeated string is never materialised.

### Edge cases

- **`b` shorter than `a` and already inside it** (`a = "abc"`, `b = "bc"`): the match ends at `i = 2`, giving `(2 + 3) / 3 = 1`.
- **`b` needs a character `a` does not have** (`a = "ab"`, `b = "ac"`): no match in the scanned window, return `-1`.
- **Single-character `a`** (Example 2): the window has length `n + m - 1 = 2`, exactly enough for `"aa"`.

## Code

```cpp title="C++"
class Solution {
   public:
    int repeatedStringMatch(string a, string b) {
        int n = a.size(), m = b.size();
        vector<int> fail(m, 0);
        for (int i = 1, k = 0; i < m; i++) {
            while (k > 0 && b[i] != b[k]) k = fail[k - 1];
            if (b[i] == b[k]) k++;
            fail[i] = k;
        }
        // Scan T = aaa... (T[i] = a[i % n]); the first match starts before index n.
        for (int i = 0, k = 0; i < n + m - 1; i++) {
            char c = a[i % n];
            while (k > 0 && b[k] != c) k = fail[k - 1];
            if (b[k] == c) k++;
            if (k == m) return (i + n) / n;
        }
        return -1;
    }
};
```
