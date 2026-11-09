---
title: "Maximum Subarray"
description: "Find the largest sum of a non-empty contiguous subarray using Kadane's algorithm, with a divide-and-conquer alternative for the follow-up."
source: "https://leetcode.com/problems/maximum-subarray/"
difficulty: "Medium"
tags: ["Array", "Divide and Conquer", "Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an integer array `nums`, find the subarray with the largest sum, and return _its sum_.

A **subarray** is a contiguous non-empty sequence of elements within an array.

**Example 1:**

```text
Input:  nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.
```

**Example 2:**

```text
Input:  nums = [1]
Output: 1
Explanation: The subarray [1] has the largest sum 1.
```

**Example 3:**

```text
Input:  nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.
```

**Constraints:**

- $1 \le$ `nums.length` $\le 10^5$
- $-10^4 \le$ `nums[i]` $\le 10^4$

**Follow-up:** If you have figured out the $O(n)$ solution, try coding another solution using the **divide and conquer** approach, which is more subtle.

## Solution approach

### Approach 1: Kadane's algorithm

**Intuition**

Let `cur` be the largest sum of a subarray that **ends at** the current index. A subarray ending at index `i` is either `nums[i]` alone or a subarray ending at `i - 1` extended by `nums[i]`, so

`cur = max(nums[i], cur + nums[i])`.

In words: if the best sum ending just before `i` is negative, it can only hurt, so drop it and start fresh at `nums[i]`. The answer is the largest `cur` seen over all end positions. Checking every subarray would be $O(n^2)$; this needs one pass.

**Algorithm**

1. `best = nums[0]`, `cur = 0`.
2. For each `x` in `nums`: `cur = max(x, cur + x)`, then `best = max(best, cur)`.
3. Return `best`.

**Walkthrough** on Example 1 (blue is the current element, green the subarray behind `best`):

![Kadane's algorithm on [-2,1,-3,4,-1,2,1,-5,4]](/img/codes/maximum-subarray/kadane.gif)

**Complexity**

- **Time:** $O(n)$ — one pass.
- **Space:** $O(1)$.

### Approach 2: Divide and conquer (follow-up)

**Intuition**

Split the range at the middle `m`. The best subarray lies entirely in the left half, entirely in the right half, or **crosses** the middle — and a crossing subarray is a best suffix of the left half glued to a best prefix of the right half. If every recursive call returns four numbers for its range,

| Field | Meaning | Combine rule |
| --- | --- | --- |
| `total` | sum of the whole range | `L.total + R.total` |
| `prefix` | best sum of a prefix | `max(L.prefix, L.total + R.prefix)` |
| `suffix` | best sum of a suffix | `max(R.suffix, R.total + L.suffix)` |
| `best` | best sum of any subarray | `max(L.best, R.best, L.suffix + R.prefix)` |

then each combine step is $O(1)$, and no linear scan for the crossing case is needed.

**Algorithm**

1. `solve(l, r)`: for a single element all four fields equal `nums[l]`.
2. Otherwise recurse on `[l, m]` and `[m + 1, r]` and combine with the rules above.
3. Return `solve(0, n - 1).best`.

**Complexity**

- **Time:** $O(n)$ — the recursion tree has `2n - 1` nodes with $O(1)$ work each. (The common textbook version that rescans the crossing sum at every level is $O(n \log n)$.)
- **Space:** $O(\log n)$ — recursion depth.

### Edge cases

- **All negative numbers**, e.g. `[-3,-1,-2]`: Kadane's `cur` restarts at every element, and `best` becomes the largest single element `-1`; the divide-and-conquer leaves start from real elements, so it also never returns an empty-subarray `0`.
- **Single element** (Example 2): Kadane runs one iteration; `solve` hits the base case immediately.
- **Overflow:** the largest possible sum is $10^5 \cdot 10^4 = 10^9$, which fits in an `int`.

## Code

```cpp title="Approach 1: Kadane's algorithm"
class Solution {
   public:
    int maxSubArray(vector<int>& nums) {
        int best = nums[0], cur = 0;
        for (int x : nums) {
            cur = max(x, cur + x);
            best = max(best, cur);
        }
        return best;
    }
};
```

```cpp title="Approach 2: Divide and conquer"
class Solution {
    struct Info {
        int total, prefix, suffix, best;
    };

    Info solve(const vector<int>& a, int l, int r) {
        if (l == r) return {a[l], a[l], a[l], a[l]};
        int m = l + (r - l) / 2;
        Info L = solve(a, l, m), R = solve(a, m + 1, r);
        return {L.total + R.total,
                max(L.prefix, L.total + R.prefix),
                max(R.suffix, R.total + L.suffix),
                max({L.best, R.best, L.suffix + R.prefix})};
    }

   public:
    int maxSubArray(vector<int>& nums) {
        return solve(nums, 0, (int)nums.size() - 1).best;
    }
};
```
