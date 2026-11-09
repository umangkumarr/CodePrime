---
title: "Implement strStr()"
description: "Return the index of the first occurrence of needle in haystack, or -1, in linear time with the Knuth–Morris–Pratt (KMP) prefix-function algorithm."
source: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/"
difficulty: "Easy"
tags: ["Two Pointers", "String", "String Matching"]
complexity:
  time: "O(n + m)"
  space: "O(m)"
---

## Problem

Given two strings `needle` and `haystack`, return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.

**Example 1:**

```text
Input:  haystack = "sadbutsad", needle = "sad"
Output: 0
Explanation: "sad" occurs at index 0 and 6.
The first occurrence is at index 0, so we return 0.
```

**Example 2:**

```text
Input:  haystack = "leetcode", needle = "leeto"
Output: -1
Explanation: "leeto" did not occur in "leetcode", so we return -1.
```

**Constraints:**

- $1 \le$ `haystack.length`, `needle.length` $\le 10^4$
- `haystack` and `needle` consist of only lowercase English characters.

## Solution approach

### Intuition

The direct method tries every starting position and compares character by character. When a comparison fails after `j` matching characters, it shifts the needle by one and starts comparing **from scratch**, throwing away what it just learned — $O(n \cdot m)$ in the worst case (think `haystack = "aaaa...ab"`, `needle = "aaab"`).

Knuth–Morris–Pratt never re-reads a haystack character. After matching `needle[0..j-1]` we know exactly what the last `j` haystack characters are: they **are** `needle[0..j-1]`. If the next character mismatches, the next alignment that could still succeed is the one where a **prefix** of the needle lines up with a **suffix** of that matched part. Taking the longest such prefix loses no possible match.

That information depends only on the needle, so it is precomputed in `lps` ("longest proper prefix which is also a suffix"):

> `lps[i]` = the length of the longest proper prefix of `needle[0..i]` that is also a suffix of `needle[0..i]`.

For `needle = "ababc"`, `lps = [0, 0, 1, 2, 0]`: in `"abab"` the prefix `"ab"` is also a suffix, so `lps[3] = 2`.

On a mismatch with `j` characters matched we set `j = lps[j - 1]` — "pretend we have matched only that many" — and compare the same haystack character again. The haystack index `i` only ever moves forward.

### Algorithm

1. **Build `lps`.** Keep `len`, the length of the current prefix-suffix. For each `i` from `1` to `m - 1`:
   - while `len > 0` and `needle[i] != needle[len]`, fall back with `len = lps[len - 1]`;
   - if `needle[i] == needle[len]`, extend: `len++`;
   - set `lps[i] = len`.
2. **Search.** Keep `j`, the number of needle characters currently matched. For each `i` from `0` to `n - 1`:
   - while `j > 0` and `haystack[i] != needle[j]`, fall back with `j = lps[j - 1]`;
   - if `haystack[i] == needle[j]`, `j++`;
   - if `j == m`, the needle ends at `i`, so return `i - m + 1`.
3. Return `-1`.

Building `lps` is the same procedure as the search, run with the needle against itself.

### Walkthrough

The official examples never need a fall-back, so this trace uses `haystack = "abababcab"`, `needle = "ababc"` (`lps = [0,0,1,2,0]`). Green cells matched, red is a mismatch, and the second row shows where the needle is aligned:

![KMP search for ababc in abababcab](/img/codes/implement-strstr/kmp-search.gif)

After the mismatch at `i = 4`, the matched `"abab"` ends with `"ab"`, which is also how the needle starts, so the needle slides forward by two and keeps those two characters matched (`j = lps[3] = 2`) instead of starting over.

### Complexity

- **Time:** $O(n + m)$. In the search loop `j` grows by at most one per haystack character, so it grows at most $n$ times in total; every fall-back makes `j` strictly smaller, so there can be at most $n$ fall-backs overall. The same argument bounds building `lps` by $O(m)$.
- **Space:** $O(m)$ — the `lps` array.

### Edge cases

- **`needle` longer than `haystack`:** `j` can never reach `m`, so the loop ends and `-1` is returned.
- **First occurrence:** the function returns as soon as `j == m`, so the earliest match wins (Example 1 returns `0`, not `6`).
- **Overlapping or repetitive patterns** (`needle = "aaab"` in `"aaaaaab"`): the fall-backs keep the useful overlap, which is exactly where the naive method degrades.

## Code

```cpp
class Solution {
  public:
    int strStr(string haystack, string needle) {
        int n = haystack.size(), m = needle.size();

        // lps[i]: longest proper prefix of needle[0..i] that is also a suffix of it.
        vector<int> lps(m, 0);
        for (int i = 1, len = 0; i < m; i++) {
            while (len > 0 && needle[i] != needle[len]) len = lps[len - 1];
            if (needle[i] == needle[len]) len++;
            lps[i] = len;
        }

        for (int i = 0, j = 0; i < n; i++) {
            while (j > 0 && haystack[i] != needle[j]) j = lps[j - 1];
            if (haystack[i] == needle[j]) j++;
            if (j == m) return i - m + 1;
        }
        return -1;
    }
};
```

```java
class Solution {
    public int strStr(String haystack, String needle) {
        int n = haystack.length(), m = needle.length();

        // lps[i]: longest proper prefix of needle[0..i] that is also a suffix of it.
        int[] lps = new int[m];
        for (int i = 1, len = 0; i < m; i++) {
            while (len > 0 && needle.charAt(i) != needle.charAt(len)) len = lps[len - 1];
            if (needle.charAt(i) == needle.charAt(len)) len++;
            lps[i] = len;
        }

        for (int i = 0, j = 0; i < n; i++) {
            while (j > 0 && haystack.charAt(i) != needle.charAt(j)) j = lps[j - 1];
            if (haystack.charAt(i) == needle.charAt(j)) j++;
            if (j == m) return i - m + 1;
        }
        return -1;
    }
}
```

```python
class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        m = len(needle)

        # lps[i]: longest proper prefix of needle[0..i] that is also a suffix of it.
        lps = [0] * m
        length = 0
        for i in range(1, m):
            while length > 0 and needle[i] != needle[length]:
                length = lps[length - 1]
            if needle[i] == needle[length]:
                length += 1
            lps[i] = length

        j = 0
        for i, ch in enumerate(haystack):
            while j > 0 and ch != needle[j]:
                j = lps[j - 1]
            if ch == needle[j]:
                j += 1
            if j == m:
                return i - m + 1
        return -1
```
