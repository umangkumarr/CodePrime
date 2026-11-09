---
title: "Climbing Stairs"
description: "Count the distinct ways to climb n stairs taking 1 or 2 steps at a time, using the Fibonacci recurrence with two rolling variables."
source: "https://leetcode.com/problems/climbing-stairs/"
difficulty: "Easy"
tags: ["Math", "Dynamic Programming", "Memoization"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?

**Example 1:**

```text
Input:  n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps
```

**Example 2:**

```text
Input:  n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```

**Constraints:**

- $1 \le n \le 45$

## Solution approach

### Intuition

Look at the **last** move of any way to reach step `i`: it is either a 1-step from `i - 1` or a 2-step from `i - 2`. These two groups do not overlap and together cover every way, so

$$
\text{ways}(i) = \text{ways}(i - 1) + \text{ways}(i - 2), \qquad \text{ways}(0) = \text{ways}(1) = 1.
$$

This is the Fibonacci sequence shifted by one. Plain recursion recomputes the same values exponentially often; computing bottom-up fixes that, and since each value needs only the previous two, two variables replace the whole table.

### Algorithm

1. Keep `prev = ways(i - 2)` and `curr = ways(i - 1)`, starting with `prev = curr = 1` (`ways(0)` and `ways(1)`).
2. For `i` from `2` to `n`: compute `next = curr + prev`, then shift: `prev = curr`, `curr = next`.
3. Return `curr`, which now holds `ways(n)`.

For `n = 3`: `ways(2) = 1 + 1 = 2`, `ways(3) = 2 + 1 = 3`.

### Complexity

- **Time:** $O(n)$ — one loop over the steps.
- **Space:** $O(1)$ — two integers.

### Edge cases

- **`n == 1`:** the loop does not run and `curr = 1` is returned.
- **`n == 45`:** the answer is $1\,836\,311\,903$, which still fits in a 32-bit `int` (`n = 46` would overflow).

## Code

```cpp
class Solution {
   public:
    int climbStairs(int n) {
        int prev = 1, curr = 1;
        for (int i = 2; i <= n; i++) {
            int next = curr + prev;
            prev = curr;
            curr = next;
        }
        return curr;
    }
};
```

```java
class Solution {
    public int climbStairs(int n) {
        int prev = 1, curr = 1;
        for (int i = 2; i <= n; i++) {
            int next = curr + prev;
            prev = curr;
            curr = next;
        }
        return curr;
    }
}
```

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        prev, curr = 1, 1
        for _ in range(2, n + 1):
            prev, curr = curr, curr + prev
        return curr
```
