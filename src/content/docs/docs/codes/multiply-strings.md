---
title: "Multiply Strings"
description: "Multiply two non-negative integers given as decimal strings without converting them, by accumulating digit products into a positional result array."
source: "https://leetcode.com/problems/multiply-strings/"
difficulty: "Medium"
tags: ["Math", "String", "Simulation"]
complexity:
  time: "O(m \\cdot n)"
  space: "O(m + n)"
---

## Problem

Given two non-negative integers `num1` and `num2` represented as strings, return the product of `num1` and `num2`, also represented as a string.

**Note:** You must not use any built-in BigInteger library or convert the inputs to integer directly.

**Example 1:**

```text
Input:  num1 = "2", num2 = "3"
Output: "6"
```

**Example 2:**

```text
Input:  num1 = "123", num2 = "456"
Output: "56088"
```

**Constraints:**

- $1 \le \text{num1.length}, \text{num2.length} \le 200$
- `num1` and `num2` consist of digits only.
- Both `num1` and `num2` do not contain any leading zero, except the number `0` itself.

## Solution approach

### Intuition

The inputs can have 200 digits, far beyond any built-in integer type, so we do long multiplication by hand. Instead of building each partial product as a string and adding strings together, notice **where** each digit product lands.

Let `m = num1.size()` and `n = num2.size()`. Index digits from the left, so `num1[i]` has place value $10^{m-1-i}$ and `num2[j]` has place value $10^{n-1-j}$. Their product has place value $10^{(m-1-i)+(n-1-j)}$. The product has at most `m + n` digits; in an array `res` of that length, indexed from the left, that place value is exactly position `i + j + 1`. So:

> every digit product `num1[i] * num2[j]` is added into `res[i + j + 1]`, and any carry goes into `res[i + j]`.

If we process `i` and `j` from right to left, positions are filled from least significant upwards. At each step we add the product to the current value of `res[i + j + 1]`, keep the last digit there, and push the tens into `res[i + j]`. Each `res[k]` may temporarily exceed 9, but it is normalised again when a later step (smaller `i + j`) adds into it and carries out of it, so at the end every cell is a single digit.

### Algorithm

1. If either number is `"0"`, return `"0"`.
2. Let `res` be an array of `m + n` zeros.
3. For `i` from `m - 1` down to `0`, and `j` from `n - 1` down to `0`:
   - `sum = (num1[i] - '0') * (num2[j] - '0') + res[i + j + 1]`;
   - `res[i + j + 1] = sum % 10`;
   - `res[i + j] += sum / 10`.
4. Convert `res` to a string, skipping leading zeros (there is at most one, at `res[0]`).

### Walkthrough

Example 2, `123 × 456`. The blue cell is `res[i + j + 1]` receiving the product, the orange cell `res[i + j]` receives the carry:

![Digit products of 123 × 456 accumulating into the result array](/img/codes/multiply-strings/positions.gif)

### Complexity

- **Time:** $O(m \cdot n)$ — one constant-time update per pair of digits, plus a linear pass to build the string. (Adding whole partial-product strings would cost $O(m \cdot (m + n))$.)
- **Space:** $O(m + n)$ — the `res` array (also the size of the answer).

### Edge cases

- **A zero operand** (`"0" × "456"`): returned as `"0"` straight away; otherwise the leading-zero skip would produce an empty string.
- **No carry into the top position** (`"2" × "3"` gives `res = [0, 6]`): the leading `0` is skipped.
- **Large intermediate values:** a cell holds at most `81 + 9 + carry`, so `int` never overflows.

## Code

```cpp title="C++"
class Solution {
   public:
    string multiply(string num1, string num2) {
        if (num1 == "0" || num2 == "0") return "0";
        int m = num1.size(), n = num2.size();
        vector<int> res(m + n, 0);
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int sum = (num1[i] - '0') * (num2[j] - '0') + res[i + j + 1];
                res[i + j + 1] = sum % 10;
                res[i + j] += sum / 10;
            }
        }
        string ans;
        for (int d : res)
            if (!(ans.empty() && d == 0)) ans += char('0' + d);
        return ans;
    }
};
```
