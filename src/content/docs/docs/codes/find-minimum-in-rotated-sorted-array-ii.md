---
title: "Find Minimum in Rotated Sorted Array II"
description: "Find the minimum of a rotated sorted array that may contain duplicates, using binary search against nums[hi] and shrinking hi by one on ties."
source: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/"
difficulty: "Hard"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Suppose an array of length `n` sorted in ascending order is **rotated** between `1` and `n` times. For example, the array `nums = [0,1,4,4,5,6,7]` might become:

- `[4,5,6,7,0,1,4]` if it was rotated `4` times.
- `[0,1,4,4,5,6,7]` if it was rotated `7` times.

Notice that **rotating** an array `[a[0], a[1], a[2], ..., a[n-1]]` 1 time results in the array `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`.

Given the sorted rotated array `nums` that may contain **duplicates**, return _the minimum element of this array_.

You must decrease the overall operation steps as much as possible.

**Example 1:**

```text
Input:  nums = [1,3,5]
Output: 1
```

**Example 2:**

```text
Input:  nums = [2,2,2,0,1]
Output: 0
```

**Constraints:**

- `n == nums.length`
- $1 \le n \le 5000$
- $-5000 \le$ `nums[i]` $\le 5000$
- `nums` is sorted and rotated between `1` and `n` times.

**Follow-up:** This problem is similar to [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/description/), but `nums` may contain **duplicates**. Would this affect the runtime complexity? How and why?

## Solution approach

### Intuition

Use the same binary search as in the version without duplicates: compare `nums[mid]` with the last element of the range, `nums[hi]`, while keeping the invariant "the minimum value is inside `[lo, hi]`".

- `nums[mid] > nums[hi]`: `mid` is in the left (larger) run, so the minimum is strictly right of `mid`.
- `nums[mid] < nums[hi]`: `mid..hi` is ascending, so the minimum is at `mid` or to its left.
- `nums[mid] == nums[hi]`: now we **cannot** tell. In `[3,3,1,3]` the minimum is right of `mid`, but in `[3,1,3,3,3]` it is left of `mid`. What we do know is that `nums[hi]` has a copy at `mid`, so dropping index `hi` cannot lose the minimum value. We shrink the range by one with `hi--`.

### Algorithm

1. Set `lo = 0`, `hi = n - 1`.
2. While `lo < hi`, with `mid = lo + (hi - lo) / 2`:
   - if `nums[mid] > nums[hi]`, set `lo = mid + 1`;
   - else if `nums[mid] < nums[hi]`, set `hi = mid`;
   - else (equal) set `hi = hi - 1`.
3. Return `nums[lo]`.

### Walkthrough

`[3,3,1,3]` is the case that needs the tie rule: at the first step `nums[mid] == nums[hi]`, and the minimum lies to the **right** of `mid`, so neither `hi = mid` nor any halving rule would be safe.

![Binary search with duplicates on [3,3,1,3]](/img/codes/find-minimum-in-rotated-sorted-array-ii/search.gif)

### Complexity

- **Time:** $O(\log n)$ when ties are rare, but $O(n)$ in the worst case — for an input like `[1,1,1,1,0,1,1]` almost every step is a tie that removes only one element.
- **Space:** $O(1)$.

**Follow-up answer:** yes, duplicates change the worst case from $O(\log n)$ to $O(n)$. When `nums[mid] == nums[hi]` (and possibly `nums[lo]` too), the information we see is identical whether the minimum is on the left or the right, so no algorithm can discard half the range; in the extreme `[1,1,...,1,0,1,...,1]` any algorithm must inspect up to every element to find the `0`.

### Edge cases

- **All elements equal:** every step is a tie, `hi` walks down to `0`, and `nums[0]` is returned.
- **Not rotated** (Example 1): the `<` branch always applies and the search behaves like the unique-element version.
- **Single element:** the loop does not run.

## Code

```cpp
class Solution {
   public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi])
                lo = mid + 1;
            else if (nums[mid] < nums[hi])
                hi = mid;
            else
                hi--;  // nums[hi] has a copy at mid, so dropping hi is safe
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
                lo = mid + 1;
            else if (nums[mid] < nums[hi])
                hi = mid;
            else
                hi--;  // nums[hi] has a copy at mid, so dropping hi is safe
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
                lo = mid + 1
            elif nums[mid] < nums[hi]:
                hi = mid
            else:
                hi -= 1  # nums[hi] has a copy at mid, so dropping hi is safe
        return nums[lo]
```
