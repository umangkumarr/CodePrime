---
title: "Next Permutation"
description: "Rearrange an array into the next lexicographically greater permutation in place, by finding the pivot, swapping it with its successor and reversing the suffix."
source: "https://leetcode.com/problems/next-permutation/"
difficulty: "Medium"
tags: ["Array", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.

- For example, for `arr = [1, 2, 3]`, the following are all the permutations of `arr`: `[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]`.

The **next permutation** of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the **next permutation** of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

Examples:

- The next permutation of `arr = [1, 2, 3]` is `[1, 3, 2]`.
- The next permutation of `arr = [2, 3, 1]` is `[3, 1, 2]`.
- The next permutation of `arr = [3, 2, 1]` is `[1, 2, 3]` because `[3, 2, 1]` does not have a lexicographical larger rearrangement.

Given an array of integers `nums`, *find the next permutation of* `nums`.

The replacement must be **[in place](https://en.wikipedia.org/wiki/In-place_algorithm)** and use only constant extra memory.

**Example 1:**

```text
Input:  nums = [1,2,3]
Output: [1,3,2]
```

**Example 2:**

```text
Input:  nums = [3,2,1]
Output: [1,2,3]
```

**Example 3:**

```text
Input:  nums = [1,1,5]
Output: [1,5,1]
```

**Constraints:**

- $1 \le \text{nums.length} \le 100$
- $0 \le \text{nums[i]} \le 100$

## Solution approach

### Intuition

Generating all permutations and sorting them is $O(n! \cdot n)$. Instead, think about how a number "counts up": the next larger arrangement changes the array **as far to the right as possible**.

1. **Find the pivot.** Look at the longest suffix that is **non-increasing** (read left to right). Such a suffix is already the largest possible arrangement of its own elements, so no change confined to it can make the array larger. The element just before it, `nums[i]`, is the pivot: it is the rightmost position that *can* grow, because something larger than it sits in the suffix.
2. **Grow the pivot by as little as possible.** Swap `nums[i]` with the **smallest suffix element that is greater than it**. Since the suffix is non-increasing, that is the **rightmost** element greater than `nums[i]`, found by scanning from the end.
3. **Make the rest as small as possible.** After the swap, the suffix is still non-increasing (the value placed into it fits exactly where the old one was in the order). Its smallest arrangement is ascending, so **reverse** it.

If no pivot exists, the whole array is non-increasing — it is the last permutation — and reversing it gives the first (ascending) one, exactly as required.

### Algorithm

1. Set `i = n - 2` and move left while `nums[i] >= nums[i + 1]`. Afterwards `nums[i + 1 .. n - 1]` is the longest non-increasing suffix, and `i` is the pivot (or `-1`).
2. If `i >= 0`: set `j = n - 1`, move left while `nums[j] <= nums[i]`, then `swap(nums[i], nums[j])`.
3. Reverse `nums[i + 1 .. n - 1]` (when `i = -1` this reverses the whole array).

### Walkthrough

On `[1,3,5,4,2]` (not an official example, but it shows every step). Orange is the non-increasing suffix, blue the pivot, purple its swap partner:

![Next permutation of [1,3,5,4,2]](/img/codes/next-permutation/steps/01.webp)

### Complexity

- **Time:** $O(n)$ — at most one scan to find `i`, one to find `j`, and one reverse.
- **Space:** $O(1)$ — everything happens in place.

### Edge cases

- **Last permutation** (`[3,2,1]`, Example 2): `i` ends at `-1`, no swap happens, and reversing the whole array gives `[1,2,3]`.
- **Duplicates** (`[1,1,5]`, `[1,5,1]`): using `>=` and `<=` treats equal values as "not larger", so `[1,5,1]` correctly becomes `[5,1,1]`, and `[1,1,5]` becomes `[1,5,1]`.
- **Single element:** `i` starts at `-1`, and reversing a one-element range does nothing.

## Code

```cpp
class Solution {
   public:
    void nextPermutation(vector<int>& nums) {
        int n = nums.size();
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;  // pivot: rightmost i with nums[i] < nums[i+1]
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;  // rightmost element larger than the pivot
            swap(nums[i], nums[j]);
        }
        reverse(nums.begin() + i + 1, nums.end());
    }
};
```

```java
class Solution {
    public void nextPermutation(int[] nums) {
        int n = nums.length;
        int i = n - 2;
        while (i >= 0 && nums[i] >= nums[i + 1]) i--;  // pivot: rightmost i with nums[i] < nums[i+1]
        if (i >= 0) {
            int j = n - 1;
            while (nums[j] <= nums[i]) j--;  // rightmost element larger than the pivot
            swap(nums, i, j);
        }
        for (int l = i + 1, r = n - 1; l < r; l++, r--) swap(nums, l, r);
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
    def nextPermutation(self, nums: list[int]) -> None:
        n = len(nums)
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:  # pivot: rightmost i with nums[i] < nums[i+1]
            i -= 1
        if i >= 0:
            j = n - 1
            while nums[j] <= nums[i]:  # rightmost element larger than the pivot
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        l, r = i + 1, n - 1
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1
```
