---
title: "Remove Duplicates from Sorted Array"
description: "Remove duplicates in place from a sorted array and return the count of unique values, using a read pointer and a write pointer in one pass."
source: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/"
difficulty: "Easy"
tags: ["Array", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an integer array `nums` sorted in **non-decreasing order**, remove the duplicates **[in-place](https://en.wikipedia.org/wiki/In-place_algorithm)** such that each unique element appears only **once**. The **relative order** of the elements should be kept the **same**.

Consider the number of *unique elements* in `nums` to be `k`. After removing duplicates, return the number of unique elements `k`.

The first `k` elements of `nums` should contain the unique numbers in **sorted order**. The remaining elements beyond index `k - 1` can be ignored.

**Custom Judge:**

The judge will test your solution with the following code:

```java
int[] nums = [...]; // Input array
int[] expectedNums = [...]; // The expected answer with correct length

int k = removeDuplicates(nums); // Calls your implementation

assert k == expectedNums.length;
for (int i = 0; i < k; i++) {
    assert nums[i] == expectedNums[i];
}
```

If all assertions pass, then your solution will be **accepted**.

**Example 1:**

```text
Input:  nums = [1,1,2]
Output: 2, nums = [1,2,_]
Explanation: Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

**Example 2:**

```text
Input:  nums = [0,0,1,1,1,2,2,3,3,4]
Output: 5, nums = [0,1,2,3,4,_,_,_,_,_]
Explanation: Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively.
It does not matter what you leave beyond the returned k (hence they are underscores).
```

**Constraints:**

- $1 \le$ `nums.length` $\le 3 \times 10^4$
- $-100 \le$ `nums[i]` $\le 100$
- `nums` is sorted in **non-decreasing** order.

## Solution approach

### Intuition

Because the array is sorted, equal values sit next to each other, so a value is new exactly when it differs from the **last unique value kept so far**.

Use two pointers. The write pointer `k` marks the end of the compacted prefix: `nums[0..k-1]` holds the unique values found so far, in order. The read pointer `i` scans the rest. When `nums[i]` differs from `nums[k - 1]`, it is the next unique value, so copy it to `nums[k]` and grow the prefix. Otherwise it is a duplicate and is skipped. Since `k <= i` at all times, writing to `nums[k]` never overwrites a value that has not been read yet.

### Algorithm

1. Set `k = 1` — the first element is always unique (the array is non-empty).
2. For `i` from `1` to `n - 1`: if `nums[i] != nums[k - 1]`, set `nums[k] = nums[i]` and increment `k`.
3. Return `k`.

### Walkthrough

Example 2. Green cells are the compacted unique prefix `nums[0..k-1]`, blue is the element being read:

![Read and write pointers compacting [0,0,1,1,1,2,2,3,3,4]](/img/codes/remove-duplicates-from-sorted-array/two-pointers.gif)

### Complexity

- **Time:** $O(n)$ — a single pass.
- **Space:** $O(1)$ — the array is modified in place with two indices.

### Edge cases

- **Single element:** the loop does not run and `k = 1` is returned.
- **All elements equal:** every comparison matches `nums[0]`, nothing is written and the answer is `1`.
- **No duplicates:** every element is copied onto itself and `k = n`.

## Code

```cpp
class Solution {
   public:
    int removeDuplicates(vector<int>& nums) {
        int k = 1;
        for (int i = 1; i < (int)nums.size(); i++) {
            if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
        }
        return k;
    }
};
```

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int k = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
        }
        return k;
    }
}
```

```python
class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[k - 1]:
                nums[k] = nums[i]
                k += 1
        return k
```
