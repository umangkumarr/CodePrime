---
title: "Reverse Pairs"
description: "Count pairs i < j with nums[i] > 2 * nums[j] in O(n log n), using merge sort with a two-pointer count before each merge."
source: "https://leetcode.com/problems/reverse-pairs/"
difficulty: "Hard"
tags: ["Array", "Binary Search", "Divide and Conquer", "Binary Indexed Tree", "Segment Tree", "Merge Sort", "Ordered Set"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

Given an integer array `nums`, return *the number of **reverse pairs** in the array*.

A **reverse pair** is a pair `(i, j)` where:

- `0 <= i < j < nums.length` and
- `nums[i] > 2 * nums[j]`.

**Example 1:**

```text
Input:  nums = [1,3,2,3,1]
Output: 2
Explanation: The reverse pairs are:
(1, 4) --> nums[1] = 3, nums[4] = 1, 3 > 2 * 1
(3, 4) --> nums[3] = 3, nums[4] = 1, 3 > 2 * 1
```

**Example 2:**

```text
Input:  nums = [2,4,3,5,1]
Output: 3
Explanation: The reverse pairs are:
(1, 4) --> nums[1] = 4, nums[4] = 1, 4 > 2 * 1
(2, 4) --> nums[2] = 3, nums[4] = 1, 3 > 2 * 1
(3, 4) --> nums[3] = 5, nums[4] = 1, 5 > 2 * 1
```

**Constraints:**

- $1 \le$ `nums.length` $\le 5 \times 10^4$
- $-2^{31} \le$ `nums[i]` $\le 2^{31} - 1$

## Solution approach

### Intuition

Checking every pair is $O(n^2)$ — about $1.25 \times 10^9$ pairs here, too slow.

Merge sort splits the array at `mid` and every pair `(i, j)` falls into exactly one of three groups: both in the left half, both in the right half, or `i` on the left and `j` on the right. The first two are counted recursively. For the third group, positions no longer matter — every left element comes before every right element — so we may count them **after each half has been sorted**.

Once both halves are sorted, counting cross pairs is a two-pointer sweep. For a left value `x`, the right values `v` with `x > 2v` form a prefix of the sorted right half. As `x` grows, that prefix can only get longer, so the right pointer `j` never moves backwards and the whole count costs linear time. Then the halves are merged so the caller receives a sorted range — the invariant the next level relies on.

### Algorithm

1. `sortAndCount(begin, end)` returns `0` for a range of size 0 or 1.
2. Split at `mid`; `count = sortAndCount(begin, mid) + sortAndCount(mid, end)`. Both halves are now sorted.
3. Keep `j = mid`. For each `i` in `[begin, mid)`: advance `j` while `j != end` and `*i > 2LL * *j`. Every element in `[mid, j)` pairs with `*i`, so add `j - mid`. The `2LL` makes the doubling happen in 64-bit arithmetic: $2 \times (2^{31} - 1)$ does not fit in an `int`.
4. `inplace_merge(begin, mid, end)` merges the halves, and the function returns `count`.

### Walkthrough

Each frame is one step of the counting sweep inside a merge. Purple is the sorted left half, blue is `*i`, green are the right-half values `v` with `*i > 2v`:

![Merge-sort counting of reverse pairs on [2,4,3,5,1]](/img/codes/reverse-pairs/merge-count.gif)

### Complexity

- **Time:** $O(n \log n)$ — the recursion has $\log n$ levels and each level does a linear sweep and a linear merge.
- **Space:** $O(n)$ — `inplace_merge` allocates a temporary buffer, plus an $O(\log n)$ recursion stack.

### Edge cases

- **Negative numbers:** for `v < 0`, `2v < v`, so many pairs can involve negatives (e.g. `[-1, -1]`: $-1 > -2$ is a pair). The sorted-prefix argument holds for any integers, so no special case is needed.
- **Extreme values:** `2LL * *j` cannot overflow, and the total count is at most $\binom{5 \times 10^4}{2} \approx 1.25 \times 10^9$, which fits in an `int`.
- **Single element:** the base case returns `0`.

## Code

```cpp title="C++"
class Solution {
   public:
    int reversePairs(vector<int>& nums) { return sortAndCount(nums.begin(), nums.end()); }

   private:
    int sortAndCount(vector<int>::iterator begin, vector<int>::iterator end) {
        if (end - begin <= 1) return 0;
        auto mid = begin + (end - begin) / 2;
        int count = sortAndCount(begin, mid) + sortAndCount(mid, end);
        auto j = mid;
        for (auto i = begin; i != mid; ++i) {
            while (j != end && *i > 2LL * *j) ++j;
            count += j - mid;
        }
        inplace_merge(begin, mid, end);
        return count;
    }
};
```
