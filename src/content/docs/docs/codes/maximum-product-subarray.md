---
title: "Maximum Product Subarray"
description: "Find the largest product of a non-empty subarray in one pass by tracking both the maximum and the minimum product of subarrays ending at each index."
source: "https://leetcode.com/problems/maximum-product-subarray/"
difficulty: "Medium"
tags: ["Array", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an integer array `nums`, find a subarray that has the largest product, and return _the product_.

The test cases are generated so that the answer will fit in a **32-bit** integer.

**Note** that the product of an array with a single element is the value of that element.

**Example 1:**

```text
Input:  nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.
```

**Example 2:**

```text
Input:  nums = [-2,0,-1]
Output: 0
Explanation: The result cannot be 2, because [-2,-1] is not a subarray.
```

**Constraints:**

- $1 \le$ `nums.length` $\le 2 \times 10^4$
- $-10 \le$ `nums[i]` $\le 10$
- The product of any subarray of `nums` is **guaranteed** to fit in a **32-bit** integer.

## Solution approach

### Intuition

For maximum **sum** (Kadane's algorithm) it is enough to remember the best sum ending at the previous index. For products that is not enough, because multiplying by a negative number turns the largest product into the smallest and the smallest (most negative) into the largest. A very negative product is therefore valuable: one more negative factor can make it the new maximum.

So for every index `i` keep two values:

- `hi` — the largest product of a subarray ending at `i`,
- `lo` — the smallest product of a subarray ending at `i`.

A subarray ending at `i` is either `nums[i]` alone or a subarray ending at `i - 1` extended by `nums[i]`. Multiplying by `x` is monotonic: increasing when `x > 0`, decreasing when `x < 0`. So the extremes of the extended products come from the previous extremes — from `hi` and `lo` respectively when `x >= 0`, and swapped when `x < 0`.

### Algorithm

1. Initialise `best = hi = lo = nums[0]`.
2. For each later element `x = nums[i]`:
   - If `x < 0`, swap `hi` and `lo` (multiplying by a negative reverses the order).
   - `hi = max(x, hi * x)` and `lo = min(x, lo * x)` — either start fresh at `x` or extend.
   - `best = max(best, hi)`.
3. Return `best`.

A zero needs no special handling: it makes `hi = lo = 0`, and the next element then starts a fresh subarray through the `max(x, ...)` / `min(x, ...)` choice.

### Walkthrough

On `[2,-5,-2,-4,3]` the answer is `24` from `[-2,-4,3]`. Notice how the most negative product `lo` becomes the maximum after the next negative factor:

![hi and lo tracked over [2,-5,-2,-4,3]](/img/codes/maximum-product-subarray/max-min/01.webp)

### Complexity

- **Time:** $O(n)$ — one pass with constant work per element.
- **Space:** $O(1)$ — three integers.

### Edge cases

- **Single element**, e.g. `[-2]`: the loop does not run and `best = -2`.
- **Zeros**, e.g. `[-2,0,-1]`: after the `0`, `hi = 0`, so `best` is at least `0`; `-1` alone cannot beat it.
- **Overflow:** every value of `hi`, `lo` and `hi * x`, `lo * x` is the product of some subarray, which the constraints guarantee fits in an `int`.

## Code

```cpp
class Solution {
   public:
    int maxProduct(vector<int>& nums) {
        int best = nums[0], hi = nums[0], lo = nums[0];
        for (int i = 1; i < (int)nums.size(); ++i) {
            int x = nums[i];
            if (x < 0) swap(hi, lo);
            hi = max(x, hi * x);
            lo = min(x, lo * x);
            best = max(best, hi);
        }
        return best;
    }
};
```

```java
class Solution {
    public int maxProduct(int[] nums) {
        int best = nums[0], hi = nums[0], lo = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int x = nums[i];
            if (x < 0) {
                int t = hi;
                hi = lo;
                lo = t;
            }
            hi = Math.max(x, hi * x);
            lo = Math.min(x, lo * x);
            best = Math.max(best, hi);
        }
        return best;
    }
}
```

```python
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        best = hi = lo = nums[0]
        for i in range(1, len(nums)):
            x = nums[i]
            if x < 0:
                hi, lo = lo, hi
            hi = max(x, hi * x)
            lo = min(x, lo * x)
            best = max(best, hi)
        return best
```
