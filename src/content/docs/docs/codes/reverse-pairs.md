---
title: "Reverse Pairs"
description: "Given an integer array nums, return the number of reverse pairs in the array. A reverse pair is a pair (i, j) where 0 <= i < j < nums.length and nums[i] >…"
source: "https://leetcode.com/problems/reverse-pairs/"
tags: ["Array", "Binary Search", "Divide and Conquer", "Binary Indexed Tree", "Segment Tree", "Merge Sort", "Ordered Set"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>Given an integer array <code>nums</code>, return <em>the number of <strong>reverse pairs</strong> in the array</em>.</p>

<p>A reverse pair is a pair <code>(i, j)</code> where <code>0 &lt;= i &lt; j &lt; nums.length</code> and <code>nums[i] &gt; 2 * nums[j]</code>.</p>

## Solution approach

### Intuition

Checking every pair `(i, j)` takes $O(n^2)$. Merge sort helps here: after sorting the left half and the right half separately, each pair with `i` in the left half and `j` in the right half can be counted with two pointers. Because both halves are sorted, the right-half pointer `j` only moves forward as `*i` grows, so counting takes linear time per merge.

### Algorithm

1. `sort_and_count(begin, end)` returns `0` for a range of size 0 or 1.
2. Split at `mid` and add the counts returned for the left half and the right half (each call also sorts its half).
3. For each `i` in the sorted left half, advance `j` through the right half while `*i > 2L * *j`. All elements from `mid` up to, but not including, `j` form a reverse pair with `*i`, so add `j - mid`. The `2L` makes the doubling happen in `long`, avoiding overflow.
4. Merge the two halves with `inplace_merge` and return the total.

### Complexity

- **Time:** $O(n \log n)$ — there are $\log n$ levels, each doing a linear two-pointer count and a linear merge.
- **Space:** $O(n)$ — `inplace_merge` uses a temporary buffer, plus an $O(\log n)$ recursion stack.

## Code

```cpp title="C++"
class Solution {
   public:
    int sort_and_count(vector<int>::iterator begin, vector<int>::iterator end) {
        if (end - begin <= 1) return 0;
        auto mid = begin + (end - begin) / 2;
        int count = sort_and_count(begin, mid) + sort_and_count(mid, end);
        for (auto i = begin, j = mid; i != mid; ++i) {
            while (j != end and *i > 2L * *j) ++j;
            count += j - mid;
        }
        inplace_merge(begin, mid, end);
        return count;
    }

    int reversePairs(vector<int>& nums) {
        return sort_and_count(nums.begin(), nums.end());
    }
};

```
