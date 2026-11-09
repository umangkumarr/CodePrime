---
title: "Kth Largest Element in an Array"
description: "Find the k-th largest element without sorting, using randomised quickselect with a three-way partition that copes with duplicates in expected O(n)."
source: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
difficulty: "Medium"
tags: ["Array", "Divide and Conquer", "Sorting", "Heap (Priority Queue)", "Quickselect"]
complexity:
  time: "O(n) \\text{ expected}"
  space: "O(1)"
---

## Problem

Given an integer array `nums` and an integer `k`, return _the_ `kth` _largest element in the array_.

Note that it is the `kth` largest element in the sorted order, not the `kth` distinct element.

Can you solve it without sorting?

**Example 1:**

```text
Input:  nums = [3,2,1,5,6,4], k = 2
Output: 5
```

**Example 2:**

```text
Input:  nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

**Constraints:**

- $1 \le k \le$ `nums.length` $\le 10^5$
- $-10^4 \le$ `nums[i]` $\le 10^4$

## Solution approach

### Intuition

In ascending order the k-th largest element sits at index `target = n - k`. Sorting finds it in $O(n \log n)$, but we only need **one** position to be right.

**Quickselect** borrows the partition step of quicksort. Pick a pivot and rearrange the current range into three blocks:

| Block | Contents |
| --- | --- |
| `[lo, lt)` | values `< pivot` |
| `[lt, gt]` | values `== pivot` |
| `(gt, hi]` | values `> pivot` |

Every value in the middle block is now at its final sorted position. If `target` falls inside it, the pivot is the answer. Otherwise the answer lies entirely in the left or the right block, so we continue in that block only and **throw the other one away** — unlike quicksort, which must recurse into both.

Two details make this robust:

- **Random pivot.** A fixed pivot (say, always the first element) degrades to $O(n^2)$ on sorted input. A random pivot splits off a constant fraction of the range on average, giving $n + n/2 + n/4 + \dots = O(n)$ expected work.
- **Three-way partition.** With a two-way partition, an array of many equal values (for example all zeros) makes every round remove only one element. Grouping all copies of the pivot together removes them in one round. The partition itself is the Dutch national flag scan from [Sort Colors](/docs/codes/sort-colors/).

A min-heap of size `k` is an alternative ($O(n \log k)$ time, $O(k)$ space); quickselect is faster and works in place.

### Algorithm

1. Set `target = n - k`, `lo = 0`, `hi = n - 1`.
2. Repeat:
   - choose `pivot = nums[r]` for a random `r` in `[lo, hi]`;
   - three-way partition `nums[lo..hi]` with pointers `lt`, `i`, `gt`: smaller values are swapped to `lt`, larger ones to `gt`, equal ones are skipped;
   - if `target < lt`, continue in `[lo, lt - 1]`; if `target > gt`, continue in `[gt + 1, hi]`;
   - otherwise `target` is in the pivot block: return `pivot`.

The range `[lo, hi]` always contains index `target`, so the loop ends.

### Walkthrough

Example 2 (`k = 4`, so `target = 5`). The animation uses the pivots `3`, `5`, `4` in turn (the code picks them at random). Grey cells are discarded, blue cells equal the pivot and are in their final place:

![Quickselect on [3,2,3,1,2,4,5,5,6] with k = 4](/img/codes/kth-largest-element-in-an-array/quickselect.gif)

### Complexity

- **Time:** $O(n)$ expected — each round is linear in the current range, and a random pivot shrinks the range geometrically on average. The worst case is $O(n^2)$ but has vanishing probability.
- **Space:** $O(1)$ — the partition is in place and the loop is iterative.

### Edge cases

- **All values equal:** the first partition puts everything in the pivot block and returns immediately.
- **Duplicates around the answer** (Example 2): copies are counted separately because only positions matter, matching "k-th largest in sorted order, not distinct".
- **`k = 1` or `k = n`:** `target` is the last or first index; nothing special is required.

## Code

```cpp
class Solution {
   public:
    int findKthLargest(vector<int>& nums, int k) {
        static mt19937 rng(random_device{}());
        int target = (int)nums.size() - k;  // index of the answer in ascending order
        int lo = 0, hi = (int)nums.size() - 1;
        while (true) {
            int pivot = nums[lo + rng() % (hi - lo + 1)];
            // nums[lo, lt) < pivot, nums[lt, i) == pivot, nums(gt, hi] > pivot
            int lt = lo, i = lo, gt = hi;
            while (i <= gt) {
                if (nums[i] < pivot) {
                    swap(nums[lt++], nums[i++]);
                } else if (nums[i] > pivot) {
                    swap(nums[i], nums[gt--]);
                } else {
                    i++;
                }
            }
            if (target < lt) {
                hi = lt - 1;
            } else if (target > gt) {
                lo = gt + 1;
            } else {
                return pivot;
            }
        }
    }
};
```

```java
class Solution {
    private static final Random RNG = new Random();

    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k;  // index of the answer in ascending order
        int lo = 0, hi = nums.length - 1;
        while (true) {
            int pivot = nums[lo + RNG.nextInt(hi - lo + 1)];
            // nums[lo, lt) < pivot, nums[lt, i) == pivot, nums(gt, hi] > pivot
            int lt = lo, i = lo, gt = hi;
            while (i <= gt) {
                if (nums[i] < pivot) {
                    swap(nums, lt++, i++);
                } else if (nums[i] > pivot) {
                    swap(nums, i, gt--);
                } else {
                    i++;
                }
            }
            if (target < lt) {
                hi = lt - 1;
            } else if (target > gt) {
                lo = gt + 1;
            } else {
                return pivot;
            }
        }
    }

    private static void swap(int[] a, int i, int j) {
        int t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
}
```

```python
import random


class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        target = len(nums) - k  # index of the answer in ascending order
        lo, hi = 0, len(nums) - 1
        while True:
            pivot = nums[random.randint(lo, hi)]
            # nums[lo, lt) < pivot, nums[lt, i) == pivot, nums(gt, hi] > pivot
            lt, i, gt = lo, lo, hi
            while i <= gt:
                if nums[i] < pivot:
                    nums[lt], nums[i] = nums[i], nums[lt]
                    lt += 1
                    i += 1
                elif nums[i] > pivot:
                    nums[i], nums[gt] = nums[gt], nums[i]
                    gt -= 1
                else:
                    i += 1
            if target < lt:
                hi = lt - 1
            elif target > gt:
                lo = gt + 1
            else:
                return pivot
```
