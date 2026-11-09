---
title: "Roman to Integer"
description: "Convert a Roman numeral to an integer in one pass by subtracting each symbol that is smaller than the symbol after it and adding the rest."
source: "https://leetcode.com/problems/roman-to-integer/"
difficulty: "Easy"
tags: ["Hash Table", "Math", "String"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Roman numerals are represented by seven different symbols: `I`, `V`, `X`, `L`, `C`, `D` and `M`.

```text
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```

For example, `2` is written as `II` in Roman numeral, just two ones added together. `12` is written as `XII`, which is simply `X + II`. The number `27` is written as `XXVII`, which is `XX + V + II`.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not `IIII`. Instead, the number four is written as `IV`. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as `IX`. There are six instances where subtraction is used:

- `I` can be placed before `V` (5) and `X` (10) to make 4 and 9.
- `X` can be placed before `L` (50) and `C` (100) to make 40 and 90.
- `C` can be placed before `D` (500) and `M` (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.

**Example 1:**

```text
Input:  s = "III"
Output: 3
Explanation: III = 3.
```

**Example 2:**

```text
Input:  s = "LVIII"
Output: 58
Explanation: L = 50, V= 5, III = 3.
```

**Example 3:**

```text
Input:  s = "MCMXCIV"
Output: 1994
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
```

**Constraints:**

- $1 \le$ `s.length` $\le 15$
- `s` contains only the characters `('I', 'V', 'X', 'L', 'C', 'D', 'M')`.
- It is **guaranteed** that `s` is a valid roman numeral in the range `[1, 3999]`.

## Solution approach

### Intuition

In a valid numeral the symbols are written from largest to smallest, and each one is simply added. The only exception is the six subtractive pairs, and they all have the same shape: a **smaller symbol immediately before a larger one**. In `IV`, the `I` is worth $-1$; in `CM`, the `C` is worth $-100$.

So the sign of each symbol depends only on its right neighbour: subtract it if the next symbol is larger, otherwise add it. The last symbol has no right neighbour and is always added.

### Algorithm

1. `value(c)` maps a symbol to its value.
2. For each index `i`, let `cur = value(s[i])`. If `i + 1 < n` and `cur < value(s[i + 1])`, subtract `cur` from `total`; otherwise add it.
3. Return `total`.

### Walkthrough

`"MCMXCIV"`:

| Symbol | Next | Sign | `total` |
| --- | --- | --- | --- |
| `M` 1000 | `C` 100 | + | 1000 |
| `C` 100 | `M` 1000 | − | 900 |
| `M` 1000 | `X` 10 | + | 1900 |
| `X` 10 | `C` 100 | − | 1890 |
| `C` 100 | `I` 1 | + | 1990 |
| `I` 1 | `V` 5 | − | 1989 |
| `V` 5 | — | + | 1994 |

### Complexity

- **Time:** $O(n)$ — one pass; each symbol is looked up at most twice.
- **Space:** $O(1)$ — the symbol table is a fixed `switch`.

### Edge cases

- **Single symbol** (`"M"`): there is no neighbour, so it is added.
- **Equal neighbours** (`"III"`, `"XX"`): not smaller than the next one, so they are added.

## Code

```cpp title="C++"
class Solution {
   public:
    int romanToInt(string s) {
        int n = s.size(), total = 0;
        for (int i = 0; i < n; i++) {
            int cur = value(s[i]);
            if (i + 1 < n && cur < value(s[i + 1]))
                total -= cur;
            else
                total += cur;
        }
        return total;
    }

   private:
    static int value(char c) {
        switch (c) {
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            default: return 1000;  // 'M'
        }
    }
};
```
