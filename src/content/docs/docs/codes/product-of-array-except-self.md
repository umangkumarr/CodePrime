---
title: "Product of Array Except Self"
description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The product of…"
source: "https://leetcode.com/problems/product-of-array-except-self/"
tags: ["Array", "Prefix Sum"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given an integer array <code>nums</code>, return <em>an array</em> <code>answer</code> <em>such that</em> <code>answer[i]</code> <em>is equal to the product of all the elements of</em> <code>nums</code> <em>except</em> <code>nums[i]</code>.</p>

<p>The product of any prefix or suffix of <code>nums</code> is <strong>guaranteed</strong> to fit in a <strong>32-bit</strong> integer.</p>

<p>You must write an algorithm that runs in&nbsp;<code>O(n)</code>&nbsp;time and without using the division operation.</p>

## Solution approach

### Intuition

This code uses division. If we know the product of all **non-zero** elements, `prod`, and how many zeros `cnt` the array has, every answer follows directly:

- **More than one zero:** every product includes a zero, so the whole answer is `0`.
- **Exactly one zero:** only the zero's own position gets a non-zero answer, namely `prod`; every other position is `0`.
- **No zeros:** the answer at `i` is `prod / nums[i]`.

### Algorithm

1. In one pass, multiply every non-zero value into `prod` (a `long long`) and count zeros in `cnt`.
2. If `cnt > 1`, overwrite `nums` with `n` zeros and return it.
3. Otherwise, for each `i`:
   - If `nums[i] == 0`, set it to `prod`.
   - Else set it to `(prod * (cnt ^ 1)) / nums[i]`. Here `cnt ^ 1` is `1` when there are no zeros and `0` when there is one, so the result is either `prod / nums[i]` or `0`.
4. Return `nums`, which is reused as the output.

### Complexity

- **Time:** $O(n)$ — two linear passes.
- **Space:** $O(1)$ extra — the answer is written back into `nums`.

### Edge cases

- **Single zero**, e.g. `[1, 2, 0, 4]`: the result is `[0, 0, 8, 0]`.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> productExceptSelf(vector<int>& nums) {
        long long prod = 1;
        int n = nums.size();
        int cnt = 0;
        for (int i = 0; i < n; i++) {
            if (nums[i])
                prod *= nums[i];
            else
                cnt++;
        }
        if (cnt > 1) {
            nums.clear();
            nums.resize(n);
            return nums;
        }
        for (int i = 0; i < n; i++) {
            if (nums[i] == 0)
                nums[i] = prod;
            else
                nums[i] = (prod * (cnt ^ 1)) / nums[i];
        }
        return nums;
    }
};
```
