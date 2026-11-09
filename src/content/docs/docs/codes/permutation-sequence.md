---
title: "Permutation Sequence"
description: "Return the k-th permutation of 1..n in lexicographic order directly, picking one digit at a time with the factorial number system."
source: "https://leetcode.com/problems/permutation-sequence/"
difficulty: "Hard"
tags: ["Math", "Recursion"]
complexity:
  time: "O(n^2)"
  space: "O(n)"
---

## Problem

The set `[1, 2, 3, ..., n]` contains a total of `n!` unique permutations.

By listing and labeling all of the permutations in order, we get the following sequence for `n = 3`:

1. `"123"`
2. `"132"`
3. `"213"`
4. `"231"`
5. `"312"`
6. `"321"`

Given `n` and `k`, return the $k^{th}$ permutation sequence.

**Example 1:**

```text
Input:  n = 3, k = 3
Output: "213"
```

**Example 2:**

```text
Input:  n = 4, k = 9
Output: "2314"
```

**Example 3:**

```text
Input:  n = 3, k = 1
Output: "123"
```

**Constraints:**

- $1 \le n \le 9$
- $1 \le k \le n!$

## Solution approach

### Intuition

Generating permutations one by one until the `k`-th costs up to $O(n \cdot n!)$. We can jump straight to the answer instead.

In lexicographic order the permutations are grouped by their first digit. With `n` digits available, each choice of first digit is followed by $(n-1)!$ permutations of the rest. So the first $(n-1)!$ permutations start with the smallest digit, the next $(n-1)!$ with the second smallest, and so on. Using a **0-indexed** rank `k - 1`, the first digit is the one at position $\lfloor (k-1) / (n-1)! \rfloor$ among the remaining digits, and the rank inside that group is $(k-1) \bmod (n-1)!$.

Remove that digit and repeat the same reasoning for the second position with $(n-2)!$, and so on. This is just writing `k - 1` in the **factorial number system**. Switching to 0-indexed `k` is what makes the division exact; with 1-indexed `k` the last permutation of each group would land in the next group.

### Algorithm

1. Fill `fact[i] = i!` for `i` from `0` to `n - 1` (at most $8! = 40\,320$, fits in `int`).
2. Put the digits `1..n` in `digits`, in increasing order, and set `k = k - 1`.
3. For `i` from `n - 1` down to `0`:
   - `idx = k / fact[i]` picks the digit; append `digits[idx]` to `result` and erase it from `digits`.
   - `k %= fact[i]` is the rank among permutations of the remaining digits.
4. Return `result`.

### Walkthrough

Example 2: `n = 4`, `k = 9`, so the 0-indexed rank is `8`.

| `i` | `fact[i]` | `k` | `idx = k / fact[i]` | `digits` before | chosen | `k % fact[i]` |
| --- | --- | --- | --- | --- | --- | --- |
| 3 | 6 | 8 | 1 | `1 2 3 4` | `2` | 2 |
| 2 | 2 | 2 | 1 | `1 3 4` | `3` | 0 |
| 1 | 1 | 0 | 0 | `1 4` | `1` | 0 |
| 0 | 1 | 0 | 0 | `4` | `4` | 0 |

The result is `"2314"`.

### Complexity

- **Time:** $O(n^2)$ — `n` steps, each erasing from a list of at most `n` digits. With $n \le 9$ this is effectively constant.
- **Space:** $O(n)$ — `fact`, `digits` and the result.

### Edge cases

- **`k = 1`** (Example 3): the rank is `0`, every `idx` is `0`, giving the digits in increasing order.
- **`k = n!`:** the rank is `n! - 1`, every `idx` is the last remaining digit, giving the digits in decreasing order.
- **`n = 1`:** one step with `fact[0] = 1` returns `"1"`.

## Code

```cpp
class Solution {
   public:
    string getPermutation(int n, int k) {
        vector<int> fact(n, 1);
        for (int i = 1; i < n; i++) fact[i] = fact[i - 1] * i;

        vector<char> digits;
        for (int d = 1; d <= n; d++) digits.push_back('0' + d);

        string result;
        k--;
        for (int i = n - 1; i >= 0; i--) {
            int idx = k / fact[i];
            result += digits[idx];
            digits.erase(digits.begin() + idx);
            k %= fact[i];
        }
        return result;
    }
};
```

```java
class Solution {
    public String getPermutation(int n, int k) {
        int[] fact = new int[n];
        fact[0] = 1;
        for (int i = 1; i < n; i++) fact[i] = fact[i - 1] * i;

        List<Character> digits = new ArrayList<>();
        for (int d = 1; d <= n; d++) digits.add((char) ('0' + d));

        StringBuilder result = new StringBuilder();
        k--;
        for (int i = n - 1; i >= 0; i--) {
            int idx = k / fact[i];
            result.append(digits.remove(idx));
            k %= fact[i];
        }
        return result.toString();
    }
}
```

```python
class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        fact = [1] * n
        for i in range(1, n):
            fact[i] = fact[i - 1] * i

        digits = [str(d) for d in range(1, n + 1)]

        result = []
        k -= 1
        for i in range(n - 1, -1, -1):
            idx, k = divmod(k, fact[i])
            result.append(digits.pop(idx))
        return ''.join(result)
```
