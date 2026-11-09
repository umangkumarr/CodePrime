---
title: "Find Minimum in Rotated Sorted Array"
description: "Find the minimum of a rotated sorted array of unique integers in O(log n) by binary searching on a comparison of nums[mid] with nums[hi]."
source: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/"
difficulty: "Medium"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times. For example, the array `nums = [0,1,2,4,5,6,7]` might become:

- `[4,5,6,7,0,1,2]` if it was rotated `4` times.
- `[0,1,2,4,5,6,7]` if it was rotated `7` times.

Notice that **rotating** an array `[a[0], a[1], a[2], ..., a[n-1]]` 1 time results in the array `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`.

Given the sorted rotated array `nums` of **unique** elements, return _the minimum element of this array_.

You must write an algorithm that runs in `O(log n) time`.

**Example 1:**

```text
Input:  nums = [3,4,5,1,2]
Output: 1
Explanation: The original array was [1,2,3,4,5] rotated 3 times.
```

**Example 2:**

```text
Input:  nums = [4,5,6,7,0,1,2]
Output: 0
Explanation: The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.
```

**Example 3:**

```text
Input:  nums = [11,13,15,17]
Output: 11
Explanation: The original array was [11,13,15,17] and it was rotated 4 times.
```

**Constraints:**

- `n == nums.length`
- $1 \le n \le 5000$
- $-5000 \le$ `nums[i]` $\le 5000$
- All the integers of `nums` are **unique**.
- `nums` is sorted and rotated between `1` and `n` times.

## Solution approach

### Intuition

A rotated sorted array is two ascending runs, `[large values][small values]`, and the minimum is the first element of the second run (or `nums[0]` if the array is not rotated). Every element of the first run is greater than every element of the second run, in particular greater than the last element of the array.

So comparing `nums[mid]` with the last element of the current range, `nums[hi]`, tells us which run `mid` is in:

- `nums[mid] > nums[hi]`: `mid` is in the first (large) run, so the minimum is strictly to its right.
- `nums[mid] < nums[hi]`: the stretch `mid..hi` is ascending, so the minimum is at `mid` or to its left.

Keep the invariant "the minimum is inside `[lo, hi]`" and halve the range each step.

### Algorithm

1. Set `lo = 0`, `hi = n - 1`.
2. While `lo < hi`:
   - `mid = lo + (hi - lo) / 2`;
   - if `nums[mid] > nums[hi]`, set `lo = mid + 1`;
   - otherwise set `hi = mid` (`mid` itself may be the minimum).
3. When `lo == hi`, the range holds one element: return `nums[lo]`.

### Walkthrough

Example 2, `[4,5,6,7,0,1,2]`:

![Binary search for the minimum of [4,5,6,7,0,1,2]](/img/codes/find-minimum-in-rotated-sorted-array/search.gif)

### Complexity

- **Time:** $O(\log n)$ — the range `[lo, hi]` halves in every iteration.
- **Space:** $O(1)$.

### Edge cases

- **Not rotated** (rotated `n` times, Example 3): `nums[mid] < nums[hi]` always, so `hi` shrinks to `0`.
- **Single element:** the loop does not run and `nums[0]` is returned.
- Why compare with `nums[hi]` and not `nums[lo]`: in an unrotated array `nums[mid] > nums[lo]` would wrongly push the search right, whereas the comparison with `nums[hi]` is correct in both cases.

## Code

```cpp
class Solution {
   public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi])
                lo = mid + 1;  // mid is in the left (larger) run
            else
                hi = mid;  // mid..hi is ascending; the minimum is at or left of mid
        }
        return nums[lo];
    }
};
```

```java
class Solution {
    public int findMin(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi])
                lo = mid + 1;  // mid is in the left (larger) run
            else
                hi = mid;  // mid..hi is ascending; the minimum is at or left of mid
        }
        return nums[lo];
    }
}
```

```python
class Solution:
    def findMin(self, nums: list[int]) -> int:
        lo, hi = 0, len(nums) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if nums[mid] > nums[hi]:
                lo = mid + 1  # mid is in the left (larger) run
            else:
                hi = mid  # mid..hi is ascending; the minimum is at or left of mid
        return nums[lo]
```
