---
title: "Merge Sorted Array"
description: "Merge two sorted arrays into the first one in place, filling nums1 from the back with three pointers so nothing unread is overwritten."
source: "https://leetcode.com/problems/merge-sorted-array/"
difficulty: "Easy"
tags: ["Array", "Two Pointers", "Sorting"]
complexity:
  time: "O(m + n)"
  space: "O(1)"
---

## Problem

You are given two integer arrays `nums1` and `nums2`, sorted in **non-decreasing order**, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.

**Merge** `nums1` and `nums2` into a single array sorted in **non-decreasing order**.

The final sorted array should not be returned by the function, but instead be _stored inside the array_ `nums1`. To accommodate this, `nums1` has a length of `m + n`, where the first `m` elements denote the elements that should be merged, and the last `n` elements are set to `0` and should be ignored. `nums2` has a length of `n`.

**Example 1:**

```text
Input:  nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]
Explanation: The arrays we are merging are [1,2,3] and [2,5,6].
The result of the merge is [1,2,2,3,5,6] with the elements at positions 0, 1 and 3 coming from nums1.
```

**Example 2:**

```text
Input:  nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]
Explanation: The arrays we are merging are [1] and [].
The result of the merge is [1].
```

**Example 3:**

```text
Input:  nums1 = [0], m = 0, nums2 = [1], n = 1
Output: [1]
Explanation: The arrays we are merging are [] and [1].
The result of the merge is [1].
Note that because m = 0, there are no elements in nums1. The 0 is only there to ensure the merge result can fit in nums1.
```

**Constraints:**

- `nums1.length == m + n`
- `nums2.length == n`
- $0 \le m, n \le 200$
- $1 \le m + n \le 200$
- $-10^9 \le$ `nums1[i]`, `nums2[j]` $\le 10^9$

**Follow-up:** Can you come up with an algorithm that runs in $O(m + n)$ time?

## Solution approach

### Intuition

The usual merge (take the smaller front element) would need a separate buffer: writing into `nums1` from the front would overwrite elements of `nums1` that have not been read yet.

Merge **from the back** instead. The largest remaining element is at the end of one of the two arrays, and it belongs at the last free position `k` of `nums1`. Writing there is always safe: the positions `k + 1 ..` are already final, and `k = i + j + 1` where `i` and `j` point at the last unread elements of `nums1` and `nums2`. Since `j >= -1`, `k > i`, so the write never lands on an unread element of `nums1`. The trailing zeros are exactly the room this needs.

### Algorithm

1. `i = m - 1`, `j = n - 1`, `k = m + n - 1`.
2. While `j >= 0` (elements of `nums2` remain):
   - If `i >= 0` and `nums1[i] > nums2[j]`, write `nums1[k--] = nums1[i--]`.
   - Otherwise write `nums1[k--] = nums2[j--]`.
3. When `j < 0`, the remaining `nums1[0..i]` are already in place, so nothing is left to do.

### Walkthrough

Example 1 (green cells are final; `i` and `j` mark the elements being compared):

![Backward merge on Example 1](/img/codes/merge-sorted-array/backward-merge.gif)

### Complexity

- **Time:** $O(m + n)$ — every iteration fills one position.
- **Space:** $O(1)$ — three indices; the merge happens inside `nums1`.

### Edge cases

- **`n = 0`** (Example 2): the loop does not run; `nums1` is already correct.
- **`m = 0`** (Example 3): `i = -1`, so every step copies from `nums2`.
- **Equal values:** on a tie the `nums2` element is written first (it goes further right), which keeps the result sorted.

## Code

```cpp
class Solution {
   public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j])
                nums1[k--] = nums1[i--];
            else
                nums1[k--] = nums2[j--];
        }
    }
};
```

```java
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j])
                nums1[k--] = nums1[i--];
            else
                nums1[k--] = nums2[j--];
        }
    }
}
```

```python
class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        i, j, k = m - 1, n - 1, m + n - 1
        while j >= 0:
            if i >= 0 and nums1[i] > nums2[j]:
                nums1[k] = nums1[i]
                i -= 1
            else:
                nums1[k] = nums2[j]
                j -= 1
            k -= 1
```
