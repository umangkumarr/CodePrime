---
title: "Longest Consecutive Sequence"
description: "Find the length of the longest run of consecutive integers in an unsorted array in O(n) time, using a hash set and counting only from run starts."
source: "https://leetcode.com/problems/longest-consecutive-sequence/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "Union Find"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

Given an unsorted array of integers `nums`, return *the length of the longest consecutive elements sequence.*

You must write an algorithm that runs in `O(n)` time.

**Example 1:**

```text
Input:  nums = [100,4,200,1,3,2]
Output: 4
Explanation: The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.
```

**Example 2:**

```text
Input:  nums = [0,3,7,2,5,8,4,6,0,1]
Output: 9
```

**Example 3:**

```text
Input:  nums = [1,0,1,2]
Output: 3
```

**Constraints:**

- $0 \le$ `nums.length` $\le 10^5$
- $-10^9 \le$ `nums[i]` $\le 10^9$

## Solution approach

### Intuition

Sorting and scanning for runs works, but costs $O(n \log n)$. To reach $O(n)$ we need to find runs without sorting.

Put every value in a hash set. A consecutive run `x, x+1, ..., x+k-1` has exactly one **start**: the value `x` for which `x - 1` is *not* in the set. If we only begin counting at starts and walk upward (`x+1`, `x+2`, ...) while the next value exists, every value is visited by at most one walk — the walk of the run it belongs to. So all the walks together take $O(n)$ steps.

Counting from every value instead (not just starts) would revisit the same run again and again and degrade to $O(n^2)$ on input like `[1, 2, ..., n]`.

### Algorithm

1. Insert all of `nums` into the hash set `seen` (this also removes duplicates).
2. For each value `x` in `seen`:
   - If `x - 1` is in `seen`, skip it — `x` is not the start of a run.
   - Otherwise walk `end = x + 1, x + 2, ...` while `end` is in `seen`. The run length is `end - x`; keep the maximum in `best`.
3. Return `best`.

### Walkthrough

For `nums = [100,4,200,1,3,2]`, `seen = {100, 4, 200, 1, 3, 2}`:

- `100`: `99` is absent, so it is a start; `101` is absent, length `1`.
- `4`, `3`, `2`: `3`, `2`, `1` are present, so they are skipped.
- `200`: start, length `1`.
- `1`: `0` is absent, so it is a start; walk `2, 3, 4` are present, `5` is not, length `4`.

The answer is `4`.

### Complexity

- **Time:** $O(n)$ on average — building the set is $O(n)$; each value is the subject of one start check and is stepped over by at most one walk, so the walks total $O(n)$ hash lookups.
- **Space:** $O(n)$ — the hash set.

### Edge cases

- **Empty array:** the set is empty, the loop never runs and `best` stays `0`.
- **Duplicates** (Example 3): the set stores each value once, so `[1,0,1,2]` gives the run `0, 1, 2` of length `3`.
- **Extreme values:** `x - 1` and `end` are computed in `long long`, so `-10^9 - 1` and `10^9 + 1` cannot overflow.

## Code

```cpp title="C++"
class Solution {
   public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<long long> seen(nums.begin(), nums.end());
        int best = 0;
        for (long long x : seen) {
            if (seen.count(x - 1)) continue;  // not the start of a run
            long long end = x + 1;
            while (seen.count(end)) end++;
            best = max(best, (int)(end - x));
        }
        return best;
    }
};
```
