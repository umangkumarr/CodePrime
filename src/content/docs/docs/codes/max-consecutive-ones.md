---
title: "Max Consecutive Ones"
description: "Return the length of the longest run of consecutive 1s in a binary array with a single pass that tracks the current run length."
source: "https://leetcode.com/problems/max-consecutive-ones/"
difficulty: "Easy"
tags: ["Array"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given a binary array `nums`, return *the maximum number of consecutive* `1`*'s in the array*.

**Example 1:**

```text
Input:  nums = [1,1,0,1,1,1]
Output: 3
Explanation: The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.
```

**Example 2:**

```text
Input:  nums = [1,0,1,1,0,1]
Output: 2
```

**Constraints:**

- $1 \le$ `nums.length` $\le 10^5$
- `nums[i]` is either `0` or `1`.

## Solution approach

### Intuition

Every run of `1`s ends either at a `0` or at the end of the array. Scan once while keeping `cur`, the length of the run of `1`s ending at the current index: a `1` extends it by one, a `0` resets it to zero. The answer is the largest value `cur` ever reaches.

Updating `best` right after every increment (rather than only when a `0` is seen) means a run that reaches the end of the array is counted without a special check after the loop.

### Algorithm

1. Set `best = 0`, `cur = 0`.
2. For each `x` in `nums`: if `x == 1`, increment `cur` and set `best = max(best, cur)`; otherwise reset `cur = 0`.
3. Return `best`.

### Walkthrough

For `nums = [1,1,0,1,1,1]`, `cur` takes the values `1, 2, 0, 1, 2, 3`, so `best = 3`.

### Complexity

- **Time:** $O(n)$ — a single pass.
- **Space:** $O(1)$ — two counters.

### Edge cases

- **Array ends with `1`s** (Example 1): `best` is updated on every `1`, so the final run is included.
- **No `1`s at all:** `cur` never increases and `best` stays `0`.

## Code

```cpp
class Solution {
   public:
    int findMaxConsecutiveOnes(vector<int>& nums) {
        int best = 0, cur = 0;  // cur = length of the run of 1s ending here
        for (int x : nums) {
            if (x == 1) {
                cur++;
                best = max(best, cur);
            } else {
                cur = 0;
            }
        }
        return best;
    }
};
```

```java
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int best = 0, cur = 0;  // cur = length of the run of 1s ending here
        for (int x : nums) {
            if (x == 1) {
                cur++;
                best = Math.max(best, cur);
            } else {
                cur = 0;
            }
        }
        return best;
    }
}
```

```python
class Solution:
    def findMaxConsecutiveOnes(self, nums: list[int]) -> int:
        best = cur = 0  # cur = length of the run of 1s ending here
        for x in nums:
            if x == 1:
                cur += 1
                best = max(best, cur)
            else:
                cur = 0
        return best
```
