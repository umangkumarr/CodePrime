---
title: "Subarray with given XOR"
description: "Given an array of integers A and an integer B. Find the total number of subarrays having bitwise XOR of all elements equals to B."
source: "https://www.interviewbit.com/problems/subarray-with-given-xor/"
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array of integers A and an integer B.

Find the total number of subarrays having bitwise XOR of all elements equals to B.

## Solution approach

### Intuition

Let `xorr` be the XOR of the prefix ending at index `i`. A subarray ending at `i` has XOR `B` exactly when some earlier prefix XOR `p` satisfies `xorr ^ p = B`, that is, `p = xorr ^ B`. So if we count how many times each prefix XOR has appeared, the number of good subarrays ending at `i` is the count of `xorr ^ B`. Checking every pair of start and end points would take $O(n^2)$.

### Algorithm

1. Start with `mp[0] = 1` to represent the empty prefix.
2. For each `i`, update `xorr ^= A[i]`.
3. If `xorr ^ B` is in `mp`, add `mp[xorr ^ B]` to `ans`.
4. Increment `mp[xorr]`.
5. Return `ans`.

### Complexity

- **Time:** $O(n)$ — one pass with $O(1)$ average hash-map operations.
- **Space:** $O(n)$ — the map can hold up to $n + 1$ prefix XOR values.

### Edge cases

- **Subarray starting at index 0**: handled by the initial `mp[0] = 1`.

## Code

```cpp title="C++"
int Solution::solve(vector<int> &A, int B) {
    int n = A.size();
    int xorr = 0;
    unordered_map<int, int> mp;
    mp[0] = 1;
    int ans = 0;
    for (int i = 0; i < n; i++) {
        xorr ^= A[i];
        if (mp.find(xorr ^ B) != mp.end()) {
            ans += mp[xorr ^ B];
        }
        mp[xorr]++;
        ;
    }
    return ans;
}

```
