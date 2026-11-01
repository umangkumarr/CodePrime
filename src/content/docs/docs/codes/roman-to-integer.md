---
title: "Roman to Integer"
description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. text Symbol Value I 1 V 5 X 10 L 50 C 100 D 500 M 1000 For example, 2…"
source: "https://leetcode.com/problems/roman-to-integer/"
tags: ["Hash Table", "Math", "String"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Roman numerals are represented by seven different symbols:&nbsp;<code>I</code>, <code>V</code>, <code>X</code>, <code>L</code>, <code>C</code>, <code>D</code> and <code>M</code>.</p>

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

<p>For example,&nbsp;<code>2</code> is written as <code>II</code>&nbsp;in Roman numeral, just two ones added together. <code>12</code> is written as&nbsp;<code>XII</code>, which is simply <code>X + II</code>. The number <code>27</code> is written as <code>XXVII</code>, which is <code>XX + V + II</code>.</p>

<p>Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not <code>IIII</code>. Instead, the number four is written as <code>IV</code>. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as <code>IX</code>. There are six instances where subtraction is used:</p>

<ul>
	<li><code>I</code> can be placed before <code>V</code> (5) and <code>X</code> (10) to make 4 and 9.&nbsp;</li>
	<li><code>X</code> can be placed before <code>L</code> (50) and <code>C</code> (100) to make 40 and 90.&nbsp;</li>
	<li><code>C</code> can be placed before <code>D</code> (500) and <code>M</code> (1000) to make 400 and 900.</li>
</ul>

<p>Given a roman numeral, convert it to an integer.</p>

## Solution approach

### Intuition

Roman numerals are normally written from largest to smallest, and each symbol is added. The exception is subtractive notation such as `IV` or `CM`: when a symbol is **smaller than the one after it**, it is subtracted instead. So comparing each symbol with its right neighbour decides its sign.

### Algorithm

1. Map each symbol to its value in the dictionary `roman`.
2. For each index `i` up to the second-to-last character:
   - If `roman[s[i]] < roman[s[i+1]]`, subtract `roman[s[i]]` from `z`.
   - Otherwise add it.
3. The last symbol has no right neighbour, so it is always added: return `z + roman[s[-1]]`.

### Complexity

- **Time:** $O(n)$ — one pass over the string.
- **Space:** $O(1)$ — the dictionary has a fixed size of seven entries.

### Edge cases

- **Subtractive pairs**, e.g. `"MCMXCIV"`: `C`, `X` and `I` come before larger symbols and are subtracted, giving $1994$.

## Code

```cpp title="C++"
class Solution:
    def romanToInt(self, s):
        roman = {'M': 1000, 'D': 500, 'C': 100, 'L': 50, 'X': 10, 'V': 5, 'I': 1}
        z = 0
        for i in range(0, len(s) - 1):
            if roman[s[i]] < roman[s[i+1]]:
                z -= roman[s[i]]
            else:
                z += roman[s[i]]
        return z + roman[s[-1]]

```
