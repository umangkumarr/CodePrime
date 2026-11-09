---
title: "Two Sum"
description: "Return the indices of the two numbers that add up to a target, in one pass using a hash map from value to index to find each complement."
source: "https://leetcode.com/problems/two-sum/"
difficulty: "Easy"
tags: ["Array", "Hash Table"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an array of integers `nums` and an integer `target`, return _indices of the two numbers such that they add up to `target`_.

You may assume that each input would have **_exactly_ one solution**, and you may not use the _same_ element twice.

You can return the answer in any order.

**Example 1:**

```text
Input:  nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: The sum of nums[0] and nums[1] is 2 + 7 = 9, which equals the target.
Therefore, the indices [0, 1] are returned.
```

**Example 2:**

```text
Input:  nums = [3,2,4], target = 6
Output: [1,2]
Explanation: The sum of nums[1] and nums[2] is 2 + 4 = 6, which equals the target.
Therefore, the indices [1, 2] are returned.
```

**Example 3:**

```text
Input:  nums = [3,3], target = 6
Output: [0,1]
Explanation: The sum of nums[0] and nums[1] is 3 + 3 = 6, which equals the target.
Therefore, the indices [0, 1] are returned.
```

**Constraints:**

- $2 \le$ `nums.length` $\le 10^4$
- $-10^9 \le$ `nums[i]` $\le 10^9$
- $-10^9 \le$ `target` $\le 10^9$
- **Only one valid answer exists.**

**Follow-up:** Can you come up with an algorithm that is less than $O(n^2)$ time complexity?

## Solution approach

### Intuition

Checking every pair is $O(n^2)$. But for a fixed `nums[i]` there is only **one** value that can complete the pair: `target - nums[i]`. So the question for each element becomes "have I already seen its complement, and where?" — a hash-map lookup in $O(1)$ on average.

Scan left to right and keep a map `seen` from each value to its index. When we reach `i`, the map holds exactly the elements **before** `i`. If the complement is there, we have the pair; otherwise we record `nums[i]` and move on. Because the two answer indices `j < i` are found when the scan reaches `i` (by then `nums[j]` is in the map), one pass suffices. Looking up **before** inserting means an element can never pair with itself.

### Algorithm

1. Create an empty map `seen` from value to index (keyed by `long long`, see Edge cases).
2. For each index `i`:
   - Compute `need = target - nums[i]` in `long long`.
   - If `need` is in `seen`, return `{seen[need], i}`.
   - Otherwise store `seen[nums[i]] = i`.
3. The problem guarantees an answer, so the loop always returns; the final `return {}` only satisfies the compiler.

### Complexity

- **Time:** $O(n)$ on average — one pass with $O(1)$ expected hash operations per element.
- **Space:** $O(n)$ — the map may store up to `n - 1` values.

### Edge cases

- **Duplicate values** (`[3,3]`, `target = 6`): at `i = 1` the first `3` is already in `seen`, so `[0,1]` is returned.
- **Using an element twice** (`[3,2,4]`, `target = 6`): at `i = 0` the map is empty, so `3 + 3` is never matched with itself.
- **Overflow:** `target - nums[i]` lies in $[-2 \cdot 10^9, 2 \cdot 10^9]$, which overflows `int`, so it is computed in `long long`. A complement outside the `int` range simply is not found.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<long long, int> seen;  // value -> index
        for (int i = 0; i < (int)nums.size(); i++) {
            long long need = (long long)target - nums[i];
            auto it = seen.find(need);
            if (it != seen.end()) return {it->second, i};
            seen[nums[i]] = i;
        }
        return {};
    }
};
```
