---
title: "Search in Rotated Sorted Array"
description: "Find a target in a rotated sorted array of distinct values in O(log n) with one binary search that always keeps the half known to be sorted."
source: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
difficulty: "Medium"
tags: ["Array", "Binary Search"]
complexity:
  time: "O(\\log n)"
  space: "O(1)"
---

## Problem

There is an integer array `nums` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, `nums` is **possibly left rotated** at an unknown index `k` (`1 <= k < nums.length`) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (**0-indexed**). For example, `[0,1,2,4,5,6,7]` might be left rotated by `3` indices and become `[4,5,6,7,0,1,2]`.

Given the array `nums` **after** the possible rotation and an integer `target`, return *the index of* `target` *if it is in* `nums`*, or* `-1` *if it is not in* `nums`.

You must write an algorithm with `O(log n)` runtime complexity.

**Example 1:**

```text
Input:  nums = [4,5,6,7,0,1,2], target = 0
Output: 4
```

**Example 2:**

```text
Input:  nums = [4,5,6,7,0,1,2], target = 3
Output: -1
```

**Example 3:**

```text
Input:  nums = [1], target = 0
Output: -1
```

**Constraints:**

- $1 \le$ `nums.length` $\le 5000$
- $-10^4 \le$ `nums[i]` $\le 10^4$
- All values of `nums` are **unique**.
- `nums` is an ascending array that is possibly rotated.
- $-10^4 \le$ `target` $\le 10^4$

## Solution approach

### Intuition

A rotated sorted array is two ascending runs, `[4,5,6,7]` and `[0,1,2]`, where every value of the first run is larger than every value of the second. Plain binary search fails because the whole range is not sorted.

But cut any range `[lo, hi]` at `mid`, and **at least one of the two halves is sorted** — the rotation point can lie in only one of them. Which one is easy to tell with distinct values: if `nums[lo] <= nums[mid]`, the left half `[lo, mid]` contains no drop and is sorted; otherwise the drop is on the left, so the right half `[mid, hi]` is sorted.

For a sorted half, a range check tells us immediately whether `target` can be in it (`nums[lo] <= target < nums[mid]` for the left half). If it can, keep that half; if not, the target can only be in the other half. Either way half the range is discarded per step, so the search stays $O(\log n)$.

### Algorithm

1. `lo = 0`, `hi = n - 1`.
2. While `lo <= hi`:
   - `mid = lo + (hi - lo) / 2`. If `nums[mid] == target`, return `mid`.
   - If `nums[lo] <= nums[mid]` (left half sorted): if `nums[lo] <= target && target < nums[mid]`, set `hi = mid - 1`, else `lo = mid + 1`.
   - Otherwise (right half sorted): if `nums[mid] < target && target <= nums[hi]`, set `lo = mid + 1`, else `hi = mid - 1`.
3. Return `-1`.

### Walkthrough

Example 1, `target = 0`. Blue is `mid`, purple is the half that is sorted, grey is discarded:

![Rotated binary search for 0 in [4,5,6,7,0,1,2]](/img/codes/search-in-rotated-sorted-array/rotated-search/01.webp)

### Complexity

- **Time:** $O(\log n)$ — each iteration halves `[lo, hi]`.
- **Space:** $O(1)$.

### Edge cases

- **Not rotated at all:** `nums[lo] <= nums[mid]` always holds and the algorithm is ordinary binary search.
- **`lo == mid`** (a range of two elements): `nums[lo] <= nums[mid]` is true, the left "half" is the single element `nums[mid]` already checked, so the range test fails and the search moves right — correct.
- **Single element** (Example 3): checked once, then the range closes and `-1` is returned.

## Code

```cpp
class Solution {
   public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {  // [lo, mid] is sorted
                if (nums[lo] <= target && target < nums[mid])
                    hi = mid - 1;
                else
                    lo = mid + 1;
            } else {  // [mid, hi] is sorted
                if (nums[mid] < target && target <= nums[hi])
                    lo = mid + 1;
                else
                    hi = mid - 1;
            }
        }
        return -1;
    }
};
```

```java
class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {  // [lo, mid] is sorted
                if (nums[lo] <= target && target < nums[mid])
                    hi = mid - 1;
                else
                    lo = mid + 1;
            } else {  // [mid, hi] is sorted
                if (nums[mid] < target && target <= nums[hi])
                    lo = mid + 1;
                else
                    hi = mid - 1;
            }
        }
        return -1;
    }
}
```

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:  # [lo, mid] is sorted
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:  # [mid, hi] is sorted
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1
```
