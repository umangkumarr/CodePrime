---
title: "Reverse Words in a String"
description: "Reverse the order of words in a string, collapsing extra spaces, in place with O(1) extra space by reversing the whole string and then each word."
source: "https://leetcode.com/problems/reverse-words-in-a-string/"
difficulty: "Medium"
tags: ["Two Pointers", "String"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an input string `s`, reverse the order of the **words**.

A **word** is defined as a sequence of non-space characters. The **words** in `s` will be separated by at least one space.

Return *a string of the words in reverse order concatenated by a single space.*

**Note** that `s` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words. Do not include any extra spaces.

**Example 1:**

```text
Input:  s = "the sky is blue"
Output: "blue is sky the"
```

**Example 2:**

```text
Input:  s = "  hello world  "
Output: "world hello"
Explanation: Your reversed string should not contain leading or trailing spaces.
```

**Example 3:**

```text
Input:  s = "a good   example"
Output: "example good a"
Explanation: You need to reduce multiple spaces between two words to a single space in the reversed string.
```

**Constraints:**

- $1 \le$ `s.length` $\le 10^4$
- `s` contains English letters (upper-case and lower-case), digits, and spaces `' '`.
- There is **at least one** word in `s`.

**Follow-up:** If the string data type is mutable in your language, can you solve it **in-place** with $O(1)$ extra space?

## Solution approach

### Intuition

Splitting into a list of words and joining in reverse order is easy but uses $O(n)$ extra space. The follow-up asks for in-place.

The classic trick: **reversing the whole string puts the words in the right order, but each word is spelled backwards.** Reversing every word individually then fixes the spelling. For example `"the sky"` → `"yks eht"` → `"sky the"`.

The extra spaces can be removed in the same pass that reverses the words. Keep a write index `w` behind the read index `i`: copy each word's characters down to `w`, put exactly one space before every word except the first, and finally cut the string at `w`. Because we only ever write a character after reading at least as many, `w <= i` always holds and no unread character is overwritten.

### Algorithm

1. `reverse(s.begin(), s.end())`.
2. Set `w = 0`. Scan with `i` from `0`:
   - Skip spaces (`i++`).
   - At the start of a word: if `w > 0`, write a single separating space `s[w++] = ' '`. Remember `start = w`, then copy the word: `s[w++] = s[i++]` while `s[i]` is not a space.
   - Reverse `s[start, w)` so the word reads forwards again.
3. `s.resize(w)` drops the leftover tail and return `s`.

### Walkthrough

Example 3 (`·` marks a space). Blue is the word just written, green is the finished output prefix:

![In-place word reversal on "a good   example"](/img/codes/reverse-words-in-a-string/reverse-words.gif)

### Complexity

- **Time:** $O(n)$ — one full reversal, one scan, and each character is reversed once more inside its word.
- **Space:** $O(1)$ extra — only indices; the string (received by value, as the judge's signature requires) is modified in place.

### Edge cases

- **Leading / trailing spaces** (Example 2): skipped by the scan and never copied; the separator is only written *before* a word, so no trailing space appears.
- **Multiple spaces between words** (Example 3): all are skipped; exactly one separator is written.
- **A single word with no spaces:** after the two reversals it is unchanged, and `w == n`.

## Code

```cpp
class Solution {
   public:
    string reverseWords(string s) {
        reverse(s.begin(), s.end());
        int n = s.size(), w = 0;
        for (int i = 0; i < n;) {
            if (s[i] == ' ') {
                i++;
                continue;
            }
            if (w > 0) s[w++] = ' ';
            int start = w;
            while (i < n && s[i] != ' ') s[w++] = s[i++];
            reverse(s.begin() + start, s.begin() + w);
        }
        s.resize(w);
        return s;
    }
};
```

```java
class Solution {
    public String reverseWords(String s) {
        char[] c = s.toCharArray();
        int n = c.length, w = 0;
        reverse(c, 0, n);
        for (int i = 0; i < n;) {
            if (c[i] == ' ') {
                i++;
                continue;
            }
            if (w > 0) c[w++] = ' ';
            int start = w;
            while (i < n && c[i] != ' ') c[w++] = c[i++];
            reverse(c, start, w);
        }
        return new String(c, 0, w);
    }

    private void reverse(char[] c, int lo, int hi) {
        for (hi--; lo < hi; lo++, hi--) {
            char t = c[lo];
            c[lo] = c[hi];
            c[hi] = t;
        }
    }
}
```

```python
class Solution:
    def reverseWords(self, s: str) -> str:
        # Python strings are immutable: reverse the whole string, then
        # reverse each word back while compacting into a list of chars.
        c = list(s[::-1])
        n, w, i = len(c), 0, 0
        while i < n:
            if c[i] == ' ':
                i += 1
                continue
            if w > 0:
                c[w] = ' '
                w += 1
            start = w
            while i < n and c[i] != ' ':
                c[w] = c[i]
                w += 1
                i += 1
            c[start:w] = c[start:w][::-1]
        return ''.join(c[:w])
```
