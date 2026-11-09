---
title: "Add Binary"
description: "Add two binary strings and return the sum as a binary string, using column-by-column addition with a carry from the least significant bit."
source: "https://leetcode.com/problems/add-binary/"
difficulty: "Easy"
tags: ["Math", "String", "Bit Manipulation", "Simulation"]
complexity:
  time: "O(\\max(m, n))"
  space: "O(1)"
---

## Problem

Given two binary strings `a` and `b`, return _their sum as a binary string_.

**Example 1:**

```text
Input:  a = "11", b = "1"
Output: "100"
```

**Example 2:**

```text
Input:  a = "1010", b = "1011"
Output: "10101"
```

**Constraints:**

- $1 \le$ `a.length`, `b.length` $\le 10^4$
- `a` and `b` consist only of `'0'` or `'1'` characters.
- Each string does not contain leading zeros except for the zero itself.

## Solution approach

### Intuition

The strings can be up to $10^4$ bits long, so they cannot be converted to a built-in integer type. Instead, add them the way you add numbers on paper: start from the last (least significant) digit of each, add the two digits and the carry, write down `sum % 2`, and carry `sum / 2` into the next column.

Digits are produced from least to most significant, so we append them to `res` and reverse once at the end. Prepending each digit (`s = digit + s`) would copy the whole string every time and make the solution quadratic.

### Algorithm

1. Set `i` and `j` to the last indices of `a` and `b`, and `carry = 0`.
2. While `i >= 0`, `j >= 0`, or `carry` is non-zero:
   - add `a[i]` (if `i >= 0`) and `b[j]` (if `j >= 0`) to `carry`, moving `i` and `j` left;
   - append the digit `carry % 2` to `res`;
   - set `carry /= 2`.
3. Reverse `res` and return it.

For Example 2, the columns from the right are `0+1`, `1+1`, `0+0+carry`, `1+1`, and a final carry: the digits written are `1, 0, 1, 0, 1`, which reversed is `"10101"`.

### Complexity

- **Time:** $O(\max(m, n))$ — one iteration per column (plus at most one for the final carry) and one reversal, where $m$ and $n$ are the lengths of `a` and `b`.
- **Space:** $O(1)$ extra beyond the output string.

### Edge cases

- **Different lengths:** a string whose index has gone negative contributes `0`.
- **Final carry** such as `"1" + "1"`: the `carry` condition runs one more iteration and produces `"10"`.
- **`"0" + "0"`:** one iteration writes `0` and the result is `"0"`, with no leading zeros.

## Code

```cpp title="C++"
class Solution {
   public:
    string addBinary(string a, string b) {
        string res;
        int i = (int)a.size() - 1, j = (int)b.size() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry) {
            if (i >= 0) carry += a[i--] - '0';
            if (j >= 0) carry += b[j--] - '0';
            res.push_back(char('0' + carry % 2));
            carry /= 2;
        }
        reverse(res.begin(), res.end());
        return res;
    }
};
```
