---
title: "String to Integer (atoi)"
description: "Convert a string to a 32-bit signed integer like C's atoi, in one left-to-right scan that clamps on overflow before it can happen."
source: "https://leetcode.com/problems/string-to-integer-atoi/"
difficulty: "Medium"
tags: ["String"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Implement the `myAtoi(string s)` function, which converts a string to a 32-bit signed integer.

The algorithm for `myAtoi(string s)` is as follows:

1. **Whitespace**: Ignore any leading whitespace (`" "`).
2. **Signedness**: Determine the sign by checking if the next character is `'-'` or `'+'`, assuming positivity if neither present.
3. **Conversion**: Read the integer by skipping leading zeros until a non-digit character is encountered or the end of the string is reached. If no digits were read, then the result is 0.
4. **Rounding**: If the integer is out of the 32-bit signed integer range $[-2^{31}, 2^{31} - 1]$, then round the integer to remain in the range. Specifically, integers less than $-2^{31}$ should be rounded to $-2^{31}$, and integers greater than $2^{31} - 1$ should be rounded to $2^{31} - 1$.

Return the integer as the final result.

**Note:** You must not use any built-in library function that converts a string to a number (for example, `atoi`, `stoi`, `Integer.parseInt`, `int()`, `parseInt`, `Number()`). Perform the conversion manually.

**Example 1:**

```text
Input:  s = "42"
Output: 42
Explanation: The caret is the current reader position.
Step 1: "42" (no characters read because there is no leading whitespace)
         ^
Step 2: "42" (no characters read because there is neither a '-' nor '+')
         ^
Step 3: "42" ("42" is read in)
           ^
```

**Example 2:**

```text
Input:  s = "   -042"
Output: -42
Explanation:
Step 1: "   -042" (leading whitespace is read and ignored)
            ^
Step 2: "   -042" ('-' is read, so the result should be negative)
             ^
Step 3: "   -042" ("042" is read in, leading zeros ignored in the result)
               ^
```

**Example 3:**

```text
Input:  s = "1337c0d3"
Output: 1337
Explanation:
Step 1: "1337c0d3" (no characters read because there is no leading whitespace)
         ^
Step 2: "1337c0d3" (no characters read because there is neither a '-' nor '+')
         ^
Step 3: "1337c0d3" ("1337" is read in; reading stops because the next character is a non-digit)
             ^
```

**Example 4:**

```text
Input:  s = "0-1"
Output: 0
Explanation:
Step 1: "0-1" (no characters read because there is no leading whitespace)
         ^
Step 2: "0-1" (no characters read because there is neither a '-' nor '+')
         ^
Step 3: "0-1" ("0" is read in; reading stops because the next character is a non-digit)
          ^
```

**Example 5:**

```text
Input:  s = "words and 987"
Output: 0
Explanation: Reading stops at the first non-digit character 'w'.
```

**Constraints:**

- $0 \le s.length \le 200$
- `s` consists of English letters (lower-case and upper-case), digits (`0`-`9`), `' '`, `'+'`, `'-'`, and `'.'`.

## Solution approach

### Intuition

The statement already is the algorithm: a single left-to-right scan in three phases (spaces, optional sign, digits). The only subtle part is **overflow**. Building the number in an `int` and checking afterwards is undefined behaviour, and even a `long long` would overflow on a long run of digits if we did not stop early.

So we check *before* each step `result = result * 10 + d` whether it would exceed `INT_MAX`. That happens exactly when

`result > INT_MAX / 10`, or `result == INT_MAX / 10` and `d > INT_MAX % 10` (i.e. `d > 7`).

When it would, we can stop immediately: the true value is at least $2^{31}$ in magnitude, so the answer is `INT_MAX` for a positive sign and `INT_MIN` ($-2^{31}$) for a negative one. Note that $-2^{31}$ itself is handled by this clamp too: its magnitude $2^{31}$ does not fit, and clamping to `INT_MIN` gives exactly the right value.

### Algorithm

1. Skip spaces: advance `i` while `s[i] == ' '`.
2. If `s[i]` is `'+'` or `'-'`, record `sign` (`-1` for `'-'`) and advance `i`.
3. While `s[i]` is a digit `d`:
   - if `result > INT_MAX / 10` or (`result == INT_MAX / 10` and `d > INT_MAX % 10`), return `sign == 1 ? INT_MAX : INT_MIN`;
   - otherwise `result = result * 10 + d` and advance `i`.
4. Return `sign * result`.

Every access is guarded by `i < n`, so empty strings and strings that end early are safe.

### Complexity

- **Time:** $O(n)$ — each character is examined at most once.
- **Space:** $O(1)$.

### Edge cases

- **Empty string or only spaces:** the bounds checks stop every phase, and `result` stays `0`.
- **Sign with no digits** (`"-"`, `"+-12"`): the digit loop never runs, so the answer is `0`.
- **Leading zeros** (`"   -042"`): they contribute `0 * 10 + 0` and are harmless.
- **Overflow** (`"-91283472332"`, `"2147483648"`): clamped to `INT_MIN` / `INT_MAX` before any arithmetic overflows.

## Code

```cpp title="C++"
class Solution {
   public:
    int myAtoi(string s) {
        int n = s.size(), i = 0;
        while (i < n && s[i] == ' ') i++;

        int sign = 1;
        if (i < n && (s[i] == '+' || s[i] == '-')) {
            if (s[i] == '-') sign = -1;
            i++;
        }

        int result = 0;
        while (i < n && isdigit(s[i])) {
            int d = s[i] - '0';
            if (result > INT_MAX / 10 || (result == INT_MAX / 10 && d > INT_MAX % 10)) {
                return sign == 1 ? INT_MAX : INT_MIN;
            }
            result = result * 10 + d;
            i++;
        }
        return sign * result;
    }
};
```
