---
title: "Multiply Strings"
description: "Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string. Note: You must…"
source: "https://leetcode.com/problems/multiply-strings/"
tags: ["Math", "String", "Simulation"]
complexity:
  time: "O(n \\cdot m)"
  space: "O(n + m)"
---

## Problem

<p>Given two non-negative integers <code>num1</code> and <code>num2</code> represented as strings, return the product of <code>num1</code> and <code>num2</code>, also represented as a string.</p>

<p><strong>Note:</strong>&nbsp;You must not use any built-in BigInteger library or convert the inputs to integer directly.</p>

## Solution approach

### Intuition

This is grade-school long multiplication. Multiply the longer number by one digit of the shorter number at a time, shift that partial product left by the digit's position (by appending zeros), and add all the partial products together with string addition. Working on strings avoids overflow for numbers far larger than any built-in integer type.

### Algorithm

1. `add(s1, s2)` adds two digit strings from right to left with a `carry` and returns the sum in normal order.
2. In `multiply`, swap so that `s1` is the shorter string (length `n`), then reverse both strings so index `0` is the least significant digit.
3. For each digit `s1[i]`, build the partial product `s`: push `i` zeros for the shift, then each digit of `(s1[i] - '0') * (s2[j] - '0') + carry`, then any final `carry`. Reverse `s` to normal order and set `ans = add(ans, s)`.
4. Finally strip leading zeros from `ans` (by reversing, popping trailing `'0'` characters while more than one digit remains, and reversing back) and return it.

### Complexity

- **Time:** $O(n \cdot m)$ — `n` is the length of the shorter number and `m` of the longer one; each of the `n` rounds builds and adds strings of length $O(n + m)$, and $n \le m$.
- **Space:** $O(n + m)$ — the partial product and the running sum.

### Edge cases

- **Multiplying by zero** such as `"0" * "456"`: `ans` becomes `"000"`, and stripping stops at one digit, giving `"0"`.

## Code

```cpp title="C++"
class Solution {
   public:
    string add(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();
        string s = "";
        int i = n - 1, j = m - 1, carry = 0;
        while (i >= 0 && j >= 0) {
            int a = (s1[i] - '0') + (s2[j] - '0') + carry;
            carry = a / 10;
            a = a % 10;
            s.push_back(a + '0');
            i--;
            j--;
        }
        while (i >= 0) {
            int a = s1[i] - '0' + carry;
            carry = a / 10;
            a = a % 10;
            s.push_back(a + '0');
            i--;
        }

        while (j >= 0) {
            int a = s2[j] - '0' + carry;
            carry = a / 10;
            a = a % 10;
            s.push_back(a + '0');
            j--;
        }

        if (carry) {
            s.push_back('0' + carry);
        }

        reverse(s.begin(), s.end());
        return s;
    }

    string multiply(string s1, string s2) {
        int n = s1.length();
        int m = s2.length();
        if (n > m) {
            swap(s1, s2);
            swap(n, m);
        }
        reverse(s1.begin(), s1.end());
        reverse(s2.begin(), s2.end());

        int carry = 0;
        string s = "", ans = "";
        for (int i = 0; i < n; i++) {
            s = "";
            carry = 0;
            for (int k = 0; k < i; k++) s.push_back('0');
            for (int j = 0; j < m; j++) {
                int a = (s1[i] - '0') * (s2[j] - '0') + carry;
                carry = a / 10;
                a = a % 10;
                s.push_back(a + '0');
            }
            if (carry) {
                s.push_back(carry + '0');
            }
            reverse(s.begin(), s.end());
            ans = add(ans, s);
        }
        reverse(ans.begin(), ans.end());
        n = ans.length();
        int i = n - 1;
        while (i > 0 && ans[i] == '0') {
            ans.pop_back();
            i--;
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
```
