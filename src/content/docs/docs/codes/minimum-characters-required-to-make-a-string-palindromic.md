---
title: "Minimum Characters required to make a String Palindromic"
description: "Find the fewest characters to insert at the front of a string to make it a palindrome, via its longest palindromic prefix found with the KMP failure function."
source: "https://www.interviewbit.com/problems/minimum-characters-required-to-make-a-string-palindromic/"
difficulty: "Medium"
tags: ["Two Pointers", "String", "String Matching"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given a string `A`. The only operation allowed is to insert characters at the beginning of the string.

Find how many minimum characters are needed to be inserted to make the string a palindrome string.

Complete the function `int Solution::solve(string A)`, which returns the minimum number of characters that must be inserted.

**Example 1:**

```text
Input:  A = "ABC"
Output: 2
Explanation: Insert 'B' at the beginning, the string becomes "BABC".
             Insert 'C' at the beginning, the string becomes "CBABC".
```

**Example 2:**

```text
Input:  A = "AACECAAAA"
Output: 2
Explanation: Insert 'A' at the beginning, the string becomes "AAACECAAAA".
             Insert 'A' at the beginning, the string becomes "AAAACECAAAA".
```

**Constraints:**

- $1 \le |A| \le 10^6$

## Solution approach

### Intuition

Inserting only at the front cannot change anything about how `A` *starts*. Write `A = P + R`, where `P` is the **longest palindromic prefix** of `A`. Prepending `reverse(R)` gives `reverse(R) + P + R`, which is a palindrome, so `|R| = n - |P|` characters always suffice. Conversely, any palindrome of the form `X + A` has a palindromic prefix of `A` at its centre, so no fewer characters can work. The answer is therefore

$$
n - (\text{length of the longest palindromic prefix of } A).
$$

A prefix `A[0..L)` is a palindrome exactly when it equals its own reverse, and the reverse of a prefix of `A` is a **suffix** of `rev = reverse(A)`. So we need the longest prefix of `A` that is also a suffix of `rev` — a classic string-matching question. Run the **KMP** matcher with `A` as the pattern over the text `rev`: after the last character of `rev`, the number of pattern characters matched, `j`, is the length of the longest prefix of `A` that ends the text. That is `|P|`.

Checking every prefix directly is $O(n^2)$, which is too slow for $n = 10^6$; KMP never moves backwards in the text, so it is linear.

### Algorithm

1. Build the KMP failure array `fail`, where `fail[i]` is the length of the longest proper prefix of `A[0..i]` that is also a suffix of it.
2. Scan `rev` (the characters of `A` from back to front) with `j = 0` matched characters. For each character `c`:
   - while `j > 0` and `c != A[j]`, fall back with `j = fail[j - 1]`;
   - if `c == A[j]`, extend the match: `j++`.
3. `j` is now the length of the longest palindromic prefix; return `n - j`.

`j` can only reach `n` on the very last character of `rev` (that happens exactly when `A` is itself a palindrome), so `A[j]` is never read out of range.

### Walkthrough

Example 2: scanning `rev = "AAAACECAA"`. The blue cell is the character just read; `j` is how many characters of `A = "AACECAAAA"` are currently matched:

![KMP match of A against reverse(A) for AACECAAAA](/img/codes/minimum-characters-required-to-make-a-string-palindromic/kmp.gif)

The scan ends with `j = 7`: the prefix `"AACECAA"` is a palindrome, so `9 - 7 = 2` characters must be added.

### Complexity

- **Time:** $O(n)$ — building `fail` and the scan are both linear, because `j` grows by at most one per character and every fall-back strictly decreases it.
- **Space:** $O(n)$ — the `fail` array.

### Edge cases

- **`A` already a palindrome** (including a single character): the scan matches all `n` characters and the answer is `0`.
- **All characters distinct**, as in Example 1: only `A[0]` is a palindromic prefix, `j = 1` and the answer is `n - 1`.
- **Long runs of one character** such as `"AAAB"`: the fall-backs through `fail` keep the scan linear instead of restarting the comparison.

## Code

```cpp
int Solution::solve(string A) {
    int n = A.size();

    // fail[i]: longest proper prefix of A[0..i] that is also its suffix
    vector<int> fail(n, 0);
    for (int i = 1, k = 0; i < n; i++) {
        while (k > 0 && A[i] != A[k]) k = fail[k - 1];
        if (A[i] == A[k]) k++;
        fail[i] = k;
    }

    // Match A against reverse(A); j ends as the longest prefix of A that is
    // a suffix of reverse(A), i.e. the longest palindromic prefix of A.
    int j = 0;
    for (int i = n - 1; i >= 0; i--) {
        while (j > 0 && A[i] != A[j]) j = fail[j - 1];
        if (A[i] == A[j]) j++;
    }
    return n - j;
}
```

```java
public class Solution {
    public int solve(String A) {
        int n = A.length();

        // fail[i]: longest proper prefix of A[0..i] that is also its suffix
        int[] fail = new int[n];
        for (int i = 1, k = 0; i < n; i++) {
            while (k > 0 && A.charAt(i) != A.charAt(k)) k = fail[k - 1];
            if (A.charAt(i) == A.charAt(k)) k++;
            fail[i] = k;
        }

        // Match A against reverse(A); j ends as the longest prefix of A that is
        // a suffix of reverse(A), i.e. the longest palindromic prefix of A.
        int j = 0;
        for (int i = n - 1; i >= 0; i--) {
            while (j > 0 && A.charAt(i) != A.charAt(j)) j = fail[j - 1];
            if (A.charAt(i) == A.charAt(j)) j++;
        }
        return n - j;
    }
}
```

```python
class Solution:
    def solve(self, A: str) -> int:
        n = len(A)

        # fail[i]: longest proper prefix of A[0..i] that is also its suffix
        fail = [0] * n
        k = 0
        for i in range(1, n):
            while k > 0 and A[i] != A[k]:
                k = fail[k - 1]
            if A[i] == A[k]:
                k += 1
            fail[i] = k

        # Match A against reverse(A); j ends as the longest prefix of A that is
        # a suffix of reverse(A), i.e. the longest palindromic prefix of A.
        j = 0
        for i in range(n - 1, -1, -1):
            while j > 0 and A[i] != A[j]:
                j = fail[j - 1]
            if A[i] == A[j]:
                j += 1
        return n - j
```
