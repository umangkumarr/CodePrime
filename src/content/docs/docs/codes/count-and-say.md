---
title: "Count and Say"
description: "Return the n-th term of the count-and-say sequence by iteratively applying run-length encoding to the previous term, starting from \"1\"."
source: "https://leetcode.com/problems/count-and-say/"
difficulty: "Medium"
tags: ["String"]
complexity:
  time: "O(n \\cdot L)"
  space: "O(L)"
---

## Problem

The **count-and-say** sequence is a sequence of digit strings defined by the recursive formula:

- `countAndSay(1) = "1"`
- `countAndSay(n)` is the run-length encoding of `countAndSay(n - 1)`.

[Run-length encoding](http://en.wikipedia.org/wiki/Run-length_encoding) (RLE) is a string compression method that works by replacing each maximal group of consecutive identical characters with the concatenation of the length of the group followed by the character itself. For example, to compress the string `"3322251"` we replace `"33"` with `"23"`, replace `"222"` with `"32"`, replace `"5"` with `"15"`, and replace `"1"` with `"11"`. Thus the compressed string becomes `"23321511"`.

Given a positive integer `n`, return _the_ `n`<sup>th</sup> _element of the **count-and-say** sequence_.

**Example 1:**

```text
Input:  n = 4
Output: "1211"
Explanation:
countAndSay(1) = "1"
countAndSay(2) = RLE of "1" = "11"
countAndSay(3) = RLE of "11" = "21"
countAndSay(4) = RLE of "21" = "1211"
```

**Example 2:**

```text
Input:  n = 1
Output: "1"
Explanation: This is the base case.
```

**Constraints:**

- $1 \le n \le 30$

**Follow-up:** Could you solve it iteratively?

## Solution approach

### Intuition

Each term is produced from the previous one by "reading it aloud": split it into maximal runs of equal digits and write each run as its length followed by the digit. So the answer is this transformation applied $n - 1$ times to `"1"`, which is naturally a loop — no recursion needed, which answers the follow-up.

A run in this sequence never contains more than three equal digits (a well-known property of the sequence), so every run length is a single digit. The code still converts the length with `to_string`, so it would stay correct even without relying on that fact.

### Algorithm

1. Start with `s = "1"`.
2. Repeat `n - 1` times:
   - Scan `s` with index `i`. From each `i`, advance `j` while `s[j] == s[i]`; the run is `s[i..j)` with length `j - i`.
   - Append `to_string(j - i)` and the digit `s[i]` to `next`, then continue from `i = j`.
   - Replace `s` with `next`.
3. Return `s`.

### Complexity

- **Time:** $O(n \cdot L)$, where $L$ is the length of the $n$-th term — each of the $n - 1$ steps scans a string of length at most $L$. (Terms grow by a factor of about $1.3$ per step, so $L$ is roughly $4500$ for $n = 30$.)
- **Space:** $O(L)$ — only the current and the next term are kept.

### Edge cases

- **`n == 1`:** the loop body never runs and `"1"` is returned.

## Code

```cpp
class Solution {
   public:
    string countAndSay(int n) {
        string s = "1";
        for (int step = 1; step < n; step++) {
            string next;
            for (size_t i = 0; i < s.size();) {
                size_t j = i;
                while (j < s.size() && s[j] == s[i]) j++;
                next += to_string(j - i);
                next += s[i];
                i = j;
            }
            s = move(next);
        }
        return s;
    }
};
```

```java
class Solution {
    public String countAndSay(int n) {
        String s = "1";
        for (int step = 1; step < n; step++) {
            StringBuilder next = new StringBuilder();
            for (int i = 0; i < s.length();) {
                int j = i;
                while (j < s.length() && s.charAt(j) == s.charAt(i)) j++;
                next.append(j - i).append(s.charAt(i));
                i = j;
            }
            s = next.toString();
        }
        return s;
    }
}
```

```python
class Solution:
    def countAndSay(self, n: int) -> str:
        s = "1"
        for _ in range(n - 1):
            parts = []
            i = 0
            while i < len(s):
                j = i
                while j < len(s) and s[j] == s[i]:
                    j += 1
                parts.append(str(j - i))
                parts.append(s[i])
                i = j
            s = "".join(parts)
        return s
```
