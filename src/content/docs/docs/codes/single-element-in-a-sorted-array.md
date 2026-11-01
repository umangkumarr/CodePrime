---
title: "Single Element in a Sorted Array"
description: "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.…"
source: "https://leetcode.com/problems/single-element-in-a-sorted-array/"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(n + \\log R \\cdot \\log n)"
  space: "O(1)"
---

## Problem

<p>You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.</p>

<p>Return <em>the single element that appears only once</em>.</p>

<p>Your solution must run in <code>O(log n)</code> time and <code>O(1)</code> space.</p>

## Solution approach

### Intuition

Every value appears twice except one. Pick a value $x$ and count the elements `<= x`. If the single element is greater than $x$, all the counted elements come in pairs, so the count is even. If the single element is `<= x`, the count is odd. This test is monotonic in $x$, so we can binary search over the **range of values** between the minimum and maximum of the array for the smallest $x$ that gives an odd count. That $x$ is the single element.

Because `nums` is sorted, the count of elements `<= mid` is just `upper_bound(..., mid)`.

### Algorithm

1. Scan `nums` once to find `min` and `max`.
2. While `min < max`, take `mid = min + (max - min) / 2` and set `elems` to the number of elements `<= mid` using `upper_bound`.
3. If `elems` is odd, the answer is at most `mid`, so set `max = mid`; otherwise set `min = mid + 1`.
4. Return `min`.

### Complexity

- **Time:** $O(n + \log R \cdot \log n)$ — a linear scan for `min`/`max`, then $\log R$ binary-search steps (where $R$ is `max - min`), each doing an $O(\log n)$ `upper_bound`.
- **Space:** $O(1)$ — only a few variables.

### Edge cases

- **Single-element array**: `min == max`, so the loop is skipped and that element is returned.

## Code

```cpp title="C++"
class Solution {
   public:
    int singleNonDuplicate(vector<int>& nums) {
        int n = nums.size();
        int max = INT_MIN, min = INT_MAX;
        for (int i = 0; i < n; i++) {
            max = max < nums[i] ? nums[i] : max;
            min = min > nums[i] ? nums[i] : min;
        }

        while (min < max) {
            int mid = min + (max - min) / 2;
            int elems =
                upper_bound(nums.begin(), nums.end(), mid) - nums.begin();
            if (elems % 2) {
                max = mid;
            } else {
                min = mid + 1;
            }
        }
        return min;
    }
};

```
