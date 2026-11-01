---
title: "Add Binary"
description: "Given two binary strings a and b, return their sum as a binary string."
source: "https://leetcode.com/problems/add-binary/"
tags: ["Math", "String", "Bit Manipulation", "Simulation"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

<p>Given two binary strings <code>a</code> and <code>b</code>, return <em>their sum as a binary string</em>.</p>

## Solution approach

### Intuition

Add the two strings the way you add numbers by hand: start from the last digit of each, add the digits and the carry, write down `sum % 2`, and carry `sum / 2` to the next column. Running the loop while either string has digits left **or** a carry remains handles strings of different lengths and a final carry.

### Algorithm

1. Set `i` and `j` to the last indices of `a` and `b`, and the carry `c` to `0`.
2. While `i >= 0`, `j >= 0`, or `c == 1`:
   - add `a[i]` to `c` if `i` is still valid, and move `i` left;
   - add `b[j]` to `c` if `j` is still valid, and move `j` left;
   - prepend the digit `c % 2` to the result `s`;
   - set `c = c / 2` as the carry for the next column.
3. Return `s`.

### Complexity

- **Time:** $O(n^2)$ — the loop runs $n = \max(|a|, |b|) + 1$ times, but each `char + s` prepend copies the whole string built so far.
- **Space:** $O(n)$ — for the result string.

### Edge cases

- **Final carry** such as `"1" + "1"`: the `c == 1` condition runs one extra iteration to produce `"10"`.

## Code

```cpp title="C++"
class Solution {
   public:
    string addBinary(string a, string b) {
        string s = "";

        int c = 0, i = a.size() - 1, j = b.size() - 1;
        while (i >= 0 || j >= 0 || c == 1) {
            c += i >= 0 ? a[i--] - '0' : 0;
            c += j >= 0 ? b[j--] - '0' : 0;
            s = char(c % 2 + '0') + s;
            c /= 2;
        }

        return s;
    }
};
```
