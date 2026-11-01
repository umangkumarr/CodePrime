---
title: "Subset Sums"
description: "Given a list arr of N integers, print sums of all subsets in it."
source: "https://practice.geeksforgeeks.org/problems/subset-sums2234/1"
tags: ["Bit Manipulationa", "Recursion"]
complexity:
  time: "O(N \\cdot 2^N)"
  space: "O(2^N)"
---

## Problem

<span>Given a&nbsp;list <strong>arr</strong>&nbsp;of <strong>N</strong> integers, print sums of all subsets in it.</span>

## Solution approach

### Intuition

We need the sum of every subset, so we have to visit all $2^N$ subsets; this can be done with recursion or with bitmasking, and this code uses bitmasking. Each integer `i` from `0` to $2^N - 1$ represents one subset: bit `j` of `i` is set exactly when `arr[j]` is in the subset.

### Algorithm

1. Let `end` be $2^N$.
2. For each mask `i` from `0` to `end - 1`, reset `sm` to `0`.
3. For each `j`, if bit `j` of `i` is set (`(1 << j) & i`), add `arr[j]` to `sm`.
4. Push `sm` into `ans` and return `ans` after all masks.

### Complexity

- **Time:** $O(N \cdot 2^N)$ — there are $2^N$ masks and each is checked bit by bit.
- **Space:** $O(2^N)$ — the output holds one sum per subset.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> subsetSums(vector<int> arr, int N) {
        vector<int> ans;
        int end = pow(2, N), sm = 0;
        for (int i = 0; i < end; i++) {
            sm = 0;
            for (int j = 0; j < N; j++) {
                int bit = (1 << j) & i;
                if (bit) sm += arr[j];
            }
            ans.push_back(sm);
        }
        return ans;
    }
};

```
