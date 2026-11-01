---
title: "Sort Colors"
description: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the…"
source: "https://leetcode.com/problems/sort-colors/"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

<p>Given an array <code>nums</code> with <code>n</code> objects colored red, white, or blue, sort them <strong><a href="https://en.wikipedia.org/wiki/In-place_algorithm" target="_blank">in-place</a> </strong>so that objects of the same color are adjacent, with the colors in the order red, white, and blue.</p>

<p>We will use the integers <code>0</code>, <code>1</code>, and <code>2</code> to represent the color red, white, and blue, respectively.</p>

<p>You must solve this problem without using the library&#39;s sort function.</p>

## Solution approach

### Intuition

There are only three possible values: `0`, `1` and `2`. So instead of a general sort we can count how many times each value appears (counting sort) and then overwrite the array with that many `0`s, then `1`s, then `2`s.

### Algorithm

1. Count the occurrences of each colour in the array `a` of size 3, using `a[arr[i]]++`.
2. Keep a write position `j` starting at `0`.
3. For each colour `i` from `0` to `2`, write `i` into `arr[j++]` exactly `a[i]` times.

### Complexity

- **Time:** $O(n)$ — one pass to count and one pass to rewrite the array.
- **Space:** $O(1)$ — the count array has a fixed size of 3.

## Code

```cpp title="C++"
class Solution {
   public:
    void sortColors(vector<int>& arr) {
        int a[] = {0, 0, 0};
        int n = arr.size();
        for (int i = 0; i < n; i++) a[arr[i]]++;
        int j = 0;
        for (int i = 0; i < 3; i++) {
            for (int k = 0; k < a[i]; k++) arr[j++] = i;
        }
    }
};

```
