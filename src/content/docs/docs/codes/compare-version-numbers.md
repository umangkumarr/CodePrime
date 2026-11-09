---
title: "Compare Version Numbers"
description: "Compare two dot-separated version strings revision by revision as integers, parsing both strings in place with two pointers and O(1) extra space."
source: "https://leetcode.com/problems/compare-version-numbers/"
difficulty: "Medium"
tags: ["Two Pointers", "String"]
complexity:
  time: "O(n + m)"
  space: "O(1)"
---

## Problem

Given two **version strings**, `version1` and `version2`, compare them. A version string consists of **revisions** separated by dots `'.'`. The **value of the revision** is its **integer conversion** ignoring leading zeros.

To compare version strings, compare their revision values in **left-to-right order**. If one of the version strings has fewer revisions, treat the missing revision values as `0`.

Return the following:

- If `version1 < version2`, return `-1`.
- If `version1 > version2`, return `1`.
- Otherwise, return `0`.

**Example 1:**

```text
Input:  version1 = "1.2", version2 = "1.10"
Output: -1
Explanation: version1's second revision is "2" and version2's second revision is "10": 2 < 10, so
version1 < version2.
```

**Example 2:**

```text
Input:  version1 = "1.01", version2 = "1.001"
Output: 0
Explanation: Ignoring leading zeroes, both "01" and "001" represent the same integer "1".
```

**Example 3:**

```text
Input:  version1 = "1.0", version2 = "1.0.0.0"
Output: 0
Explanation: version1 has less revisions, which means every missing revision are treated as "0".
```

**Constraints:**

- $1 \le$ `version1.length`, `version2.length` $\le 500$
- `version1` and `version2` only contain digits and `'.'`.
- `version1` and `version2` **are valid version numbers**.
- All the given revisions in `version1` and `version2` can be stored in a **32-bit integer**.

## Solution approach

### Intuition

Revisions must be compared as **numbers**, not as text: `"10" > "2"` numerically even though `'1' < '2'` as characters, and `"01"` equals `"001"`. Splitting both strings into integer lists works but needs extra memory. We do not need the lists — only the current pair of revisions — so we can parse both strings side by side with one pointer each:

- read the digits of the next revision of each string, building its integer value (leading zeros contribute nothing: `0 * 10 + 0 = 0`);
- a string that has run out of revisions simply yields `0`, which is exactly the "missing revisions are `0`" rule;
- the first pair of unequal revisions decides the answer.

### Algorithm

1. Set `i = 0` (into `version1`) and `j = 0` (into `version2`).
2. While `i < n` or `j < m`:
   - Parse revision `a` from `version1`: while `i < n` and `version1[i] != '.'`, do `a = a * 10 + digit` and advance `i`. If `i >= n` already, `a` stays `0`.
   - Parse revision `b` from `version2` the same way with `j`.
   - If `a != b`, return `-1` if `a < b`, else `1`.
   - Advance `i` and `j` by one to skip the dots.
3. Every revision matched: return `0`.

For Example 1: the first round reads `a = 1`, `b = 1`; the second reads `a = 2`, `b = 10`, and `2 < 10` returns `-1`.

### Complexity

- **Time:** $O(n + m)$ — every character of both strings is read once.
- **Space:** $O(1)$ — two indices and two integers.

### Edge cases

- **Different numbers of revisions** (Example 3): the shorter string keeps producing `0` until the longer one is exhausted.
- **Leading zeros** (Example 2): they add nothing to the value, so `"01"` and `"001"` both parse to `1`.
- **Overflow:** each revision fits in a 32-bit integer, and the running value never exceeds the final value, so `int` is safe.

## Code

```cpp
class Solution {
   public:
    int compareVersion(string version1, string version2) {
        int i = 0, j = 0, n = version1.size(), m = version2.size();
        while (i < n || j < m) {
            int a = 0, b = 0;
            while (i < n && version1[i] != '.') a = a * 10 + (version1[i++] - '0');
            while (j < m && version2[j] != '.') b = b * 10 + (version2[j++] - '0');
            if (a != b) return a < b ? -1 : 1;
            i++;  // skip the '.'
            j++;
        }
        return 0;
    }
};
```

```java
class Solution {
    public int compareVersion(String version1, String version2) {
        int i = 0, j = 0, n = version1.length(), m = version2.length();
        while (i < n || j < m) {
            int a = 0, b = 0;
            while (i < n && version1.charAt(i) != '.') a = a * 10 + (version1.charAt(i++) - '0');
            while (j < m && version2.charAt(j) != '.') b = b * 10 + (version2.charAt(j++) - '0');
            if (a != b) return a < b ? -1 : 1;
            i++;  // skip the '.'
            j++;
        }
        return 0;
    }
}
```

```python
class Solution:
    def compareVersion(self, version1: str, version2: str) -> int:
        i = j = 0
        n, m = len(version1), len(version2)
        while i < n or j < m:
            a = b = 0
            while i < n and version1[i] != '.':
                a = a * 10 + int(version1[i])
                i += 1
            while j < m and version2[j] != '.':
                b = b * 10 + int(version2[j])
                j += 1
            if a != b:
                return -1 if a < b else 1
            i += 1  # skip the '.'
            j += 1
        return 0
```
