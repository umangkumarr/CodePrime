---
title: "Contains Duplicate"
description: "Decide whether any value appears at least twice in an array in one pass, using a hash set and stopping at the first repeat."
source: "https://leetcode.com/problems/contains-duplicate/"
difficulty: "Easy"
tags: ["Array", "Hash Table", "Sorting"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.

**Example 1:**

```text
Input:  nums = [1,2,3,1]
Output: true
Explanation: The element 1 occurs at the indices 0 and 3.
```

**Example 2:**

```text
Input:  nums = [1,2,3,4]
Output: false
Explanation: All elements are distinct.
```

**Example 3:**

```text
Input:  nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
```

**Constraints:**

- $1 \le$ `nums.length` $\le 10^5$
- $-10^9 \le$ `nums[i]` $\le 10^9$

## Solution approach

### Intuition

Comparing every pair is $O(n^2)$. Instead, scan the array once and remember every value seen so far in a hash set. A value is a duplicate exactly when it is already in the set at the moment we reach it, and we can stop right there — there is no need to look at the rest of the array.

(Sorting and checking neighbours, `nums[i] == nums[i - 1]`, is an alternative with $O(n \log n)$ time and no extra set, but it reorders the input.)

### Algorithm

1. Create an empty `unordered_set<int> seen`, reserving room for `nums.size()` values to avoid rehashing.
2. For each `x` in `nums`: try to insert it. `insert` returns `false` in `.second` when `x` was already present — return `true`.
3. If the loop finishes, all values were distinct: return `false`.

For Example 1, `1`, `2`, `3` are inserted, then inserting the second `1` fails and the answer is `true`.

### Complexity

- **Time:** $O(n)$ expected — one hash-set insert per element, each $O(1)$ on average; the scan stops at the first duplicate.
- **Space:** $O(n)$ — the set holds up to `n` distinct values.

### Edge cases

- **Single element:** one successful insert, then `false`.
- **Duplicate at the very start** (Example 3): detected on the second element, without reading the rest.
- **Negative and large values:** a hash set has no range assumptions, so $\pm 10^9$ is fine.

## Code

```cpp title="C++"
class Solution {
   public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        seen.reserve(nums.size());
        for (int x : nums) {
            if (!seen.insert(x).second) return true;
        }
        return false;
    }
};
```
