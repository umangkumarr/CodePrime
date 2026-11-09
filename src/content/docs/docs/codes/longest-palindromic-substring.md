---
title: "Longest Palindromic Substring"
description: "Return the longest palindromic substring of a string, by expanding around every centre in O(n^2) or with Manacher's algorithm in O(n)."
source: "https://leetcode.com/problems/longest-palindromic-substring/"
difficulty: "Medium"
tags: ["Two Pointers", "String", "Dynamic Programming", "Manacher"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given a string `s`, return *the longest palindromic substring* in `s`.

**Example 1:**

```text
Input:  s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

**Example 2:**

```text
Input:  s = "cbbd"
Output: "bb"
```

**Constraints:**

- $1 \le$ `s.length` $\le 1000$
- `s` consist of only digits and English letters.

## Solution approach

Checking every substring for being a palindrome costs $O(n^3)$. Both approaches below avoid it by growing palindromes outward from their centre.

### Approach 1: Expand around centre

**Intuition**

Every palindrome is symmetric around its centre, and there are only `2n - 1` possible centres: each character (odd length) and each gap between two neighbours (even length). From a centre, expand outward while the two ends match; the moment they differ, no longer palindrome with that centre exists. Trying every centre therefore finds every maximal palindrome.

**Algorithm**

1. `expand(s, l, r)` moves `l` left and `r` right while both are inside the string and `s[l] == s[r]`, then returns the length `r - l - 1` of the palindrome `s[l+1 .. r-1]`.
2. For each `i`, take `len = max(expand(s, i, i), expand(s, i, i + 1))` — the odd centre at `i` and the even centre between `i` and `i + 1`.
3. If `len > bestLen`, record it and its start `i - (len - 1) / 2` (this formula is right for both odd and even lengths).
4. Return `s.substr(start, bestLen)`.

**Walkthrough**

Blue cells are the current palindrome around the centre, green is the best found so far:

![Expanding around each centre of "babad"](/img/codes/longest-palindromic-substring/expand.gif)

**Complexity**

- **Time:** $O(n^2)$ — `2n - 1` centres, each expanding at most $O(n)$ steps. For $n \le 1000$ this is about $10^6$ comparisons.
- **Space:** $O(1)$ extra, apart from the returned string.

### Approach 2: Manacher's algorithm

**Intuition**

Expanding from scratch at every centre repeats work: inside a long palindrome, the right half mirrors the left half, so a centre on the right already knows (up to the edge of that palindrome) how far it can expand — exactly as far as its mirror on the left.

To treat odd and even palindromes alike, insert `#` between all characters and at both ends (`"cbbd"` becomes `"#c#b#b#d#"`). Every palindrome in `s` is now an odd-length palindrome in `t` centred at a letter or a `#`, and its **radius** in `t` equals its **length** in `s`.

**Algorithm**

1. Build `t` and an array `rad`, where `rad[i]` is the radius of the longest palindrome in `t` centred at `i`.
2. Track the palindrome reaching furthest right: centre `center`, right edge `right`.
3. For each `i`: if `i < right`, start from `rad[i] = min(right - i, rad[2 * center - i])` — the mirror's radius, capped at the known edge. Then expand naively while the characters on both sides match.
4. If `i + rad[i] > right`, make `i` the new `center`. Track the largest `rad[i]` in `bestLen` and its centre `bestCenter`.
5. The answer starts at index `(bestCenter - bestLen) / 2` of `s` and has length `bestLen`.

**Complexity**

- **Time:** $O(n)$ — every successful naive expansion pushes `right` one step further, and `right` never decreases and never exceeds `2n + 1`, so expansions total $O(n)$ across the whole scan.
- **Space:** $O(n)$ — the strings `t` and the array `rad`.

### Edge cases

- **Single character:** the centre at index `0` gives length `1`, so `s` itself is returned.
- **No palindrome longer than 1** (e.g. `"abc"`): the first character is returned, since every later candidate only ties.
- **Even-length answers** like `"bb"` are found by the gap centres (Approach 1) or by `#` centres (Approach 2).
- **Ties:** both approaches only replace the best on a strictly longer palindrome, so the leftmost longest is returned (`"bab"` for Example 1).

## Code

```cpp title="Approach 1: Expand around centre"
class Solution {
    int expand(const string& s, int l, int r) {
        while (l >= 0 && r < (int)s.size() && s[l] == s[r]) {
            l--;
            r++;
        }
        return r - l - 1;  // length of s[l+1 .. r-1]
    }

   public:
    string longestPalindrome(string s) {
        int start = 0, bestLen = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            int len = max(expand(s, i, i), expand(s, i, i + 1));
            if (len > bestLen) {
                bestLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substr(start, bestLen);
    }
};
```

```java title="Approach 1: Expand around centre"
class Solution {
    private int expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            l--;
            r++;
        }
        return r - l - 1;  // length of s[l+1 .. r-1]
    }

    public String longestPalindrome(String s) {
        int start = 0, bestLen = 0;
        for (int i = 0; i < s.length(); i++) {
            int len = Math.max(expand(s, i, i), expand(s, i, i + 1));
            if (len > bestLen) {
                bestLen = len;
                start = i - (len - 1) / 2;
            }
        }
        return s.substring(start, start + bestLen);
    }
}
```

```python title="Approach 1: Expand around centre"
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)

        def expand(l: int, r: int) -> int:
            while l >= 0 and r < n and s[l] == s[r]:
                l -= 1
                r += 1
            return r - l - 1  # length of s[l+1 .. r-1]

        start = best_len = 0
        for i in range(n):
            length = max(expand(i, i), expand(i, i + 1))
            if length > best_len:
                best_len = length
                start = i - (length - 1) // 2
        return s[start:start + best_len]
```

```cpp title="Approach 2: Manacher's algorithm"
class Solution {
   public:
    string longestPalindrome(string s) {
        string t = "#";
        for (char c : s) {
            t += c;
            t += '#';
        }
        int m = t.size();
        vector<int> rad(m, 0);
        int center = 0, right = 0;  // palindrome reaching furthest right: t[2*center-right .. right]
        int bestLen = 0, bestCenter = 0;
        for (int i = 0; i < m; i++) {
            if (i < right) rad[i] = min(right - i, rad[2 * center - i]);
            while (i - rad[i] - 1 >= 0 && i + rad[i] + 1 < m && t[i - rad[i] - 1] == t[i + rad[i] + 1])
                rad[i]++;
            if (i + rad[i] > right) {
                center = i;
                right = i + rad[i];
            }
            if (rad[i] > bestLen) {
                bestLen = rad[i];
                bestCenter = i;
            }
        }
        return s.substr((bestCenter - bestLen) / 2, bestLen);
    }
};
```

```java title="Approach 2: Manacher's algorithm"
class Solution {
    public String longestPalindrome(String s) {
        int m = 2 * s.length() + 1;
        char[] t = new char[m];  // "#c#b#b#d#"
        Arrays.fill(t, '#');
        for (int i = 0; i < s.length(); i++) t[2 * i + 1] = s.charAt(i);
        int[] rad = new int[m];
        int center = 0, right = 0;  // palindrome reaching furthest right: t[2*center-right .. right]
        int bestLen = 0, bestCenter = 0;
        for (int i = 0; i < m; i++) {
            if (i < right) rad[i] = Math.min(right - i, rad[2 * center - i]);
            while (i - rad[i] - 1 >= 0 && i + rad[i] + 1 < m && t[i - rad[i] - 1] == t[i + rad[i] + 1])
                rad[i]++;
            if (i + rad[i] > right) {
                center = i;
                right = i + rad[i];
            }
            if (rad[i] > bestLen) {
                bestLen = rad[i];
                bestCenter = i;
            }
        }
        int start = (bestCenter - bestLen) / 2;
        return s.substring(start, start + bestLen);
    }
}
```

```python title="Approach 2: Manacher's algorithm"
class Solution:
    def longestPalindrome(self, s: str) -> str:
        t = "#" + "#".join(s) + "#"
        m = len(t)
        rad = [0] * m
        center = right = 0  # palindrome reaching furthest right: t[2*center-right .. right]
        best_len = best_center = 0
        for i in range(m):
            r = min(right - i, rad[2 * center - i]) if i < right else 0
            while i - r - 1 >= 0 and i + r + 1 < m and t[i - r - 1] == t[i + r + 1]:
                r += 1
            rad[i] = r
            if i + r > right:
                center, right = i, i + r
            if r > best_len:
                best_len, best_center = r, i
        start = (best_center - best_len) // 2
        return s[start:start + best_len]
```
