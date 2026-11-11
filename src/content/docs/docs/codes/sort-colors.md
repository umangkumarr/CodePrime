---
title: "Sort Colors"
description: "Sort an array of 0s, 1s and 2s in place in a single pass with constant extra space, using the Dutch national flag partitioning algorithm."
source: "https://leetcode.com/problems/sort-colors/"
difficulty: "Medium"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are given an array `nums` with `n` objects coloured red, white, or blue. Sort them **[in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** so that objects of the same colour are adjacent, with the colours in the order red, white, and blue.

We use the integers `0`, `1`, and `2` to represent the colours red, white, and blue respectively.

You must solve this problem without using the library's sort function.

**Example 1:**

```text
Input:  nums = [2,0,2,1,1,0]
Output: [0,0,1,1,2,2]
Explanation: The array has two 0s, two 1s and two 2s; sorted in place the 0s come first, then the 1s, then the 2s.
```

**Example 2:**

```text
Input:  nums = [2,0,1]
Output: [0,1,2]
```

**Constraints:**

- `n == nums.length`
- $1 \le n \le 300$
- `nums[i]` is either `0`, `1`, or `2`.

**Follow-up:** Could you come up with a one-pass algorithm using only constant extra space?

## Solution approach

### Intuition

A counting sort (count the `0`s, `1`s and `2`s, then overwrite the array) already runs in $O(n)$, but it needs **two** passes. The follow-up asks for one.

Because there are only three values, we can instead grow three bands at the same time while scanning once — the **Dutch national flag** partition. Keep three pointers so that at every moment:

| Range | Contents |
| --- | --- |
| `[0, lo)` | all `0` |
| `[lo, mid)` | all `1` |
| `[mid, hi]` | not yet examined |
| `(hi, n)` | all `2` |

Look at `nums[mid]` and move it into the band it belongs to. The unknown region shrinks by one element at each step, so the scan ends after at most `n` steps.

### Algorithm

1. Set `lo = 0`, `mid = 0`, `hi = n - 1`.
2. While `mid <= hi`:
   - If `nums[mid] == 0`: swap `nums[lo]` and `nums[mid]`, then increment both `lo` and `mid`. The value swapped in from `lo` is a `1` (or it is the same cell), so it is safe to step past it.
   - If `nums[mid] == 1`: it is already in the middle band; increment `mid`.
   - If `nums[mid] == 2`: swap `nums[mid]` and `nums[hi]`, then decrement `hi`. Do **not** advance `mid`: the value that came from `hi` has not been examined yet.

### Walkthrough

Green cells are final, blue is the element being examined:

![Dutch national flag partition on [2,0,2,1,1,0]](/img/codes/sort-colors/dutch-flag/01.webp)

### Complexity

- **Time:** $O(n)$ — each iteration either advances `mid` or decrements `hi`, so there are at most `n` iterations, all in a single pass.
- **Space:** $O(1)$ — three indices.

### Edge cases

- **Single element** or **all the same colour:** the loop only moves `mid` (or only `hi`) and the array is left unchanged.
- **Already sorted / reverse sorted:** handled identically; no special casing is needed.

## Code

```cpp
class Solution {
   public:
    void sortColors(vector<int>& nums) {
        int lo = 0, mid = 0, hi = (int)nums.size() - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) {
                swap(nums[lo++], nums[mid++]);
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums[mid], nums[hi--]);
            }
        }
    }
};
```

```java
class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) {
                swap(nums, lo++, mid++);
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                swap(nums, mid, hi--);
            }
        }
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}
```

```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        lo, mid, hi = 0, 0, len(nums) - 1
        while mid <= hi:
            if nums[mid] == 0:
                nums[lo], nums[mid] = nums[mid], nums[lo]
                lo += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[hi] = nums[hi], nums[mid]
                hi -= 1
```
