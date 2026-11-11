---
title: "K-th element of two sorted Arrays"
description: "Find the k-th smallest element of the union of two sorted arrays in O(log min(n, m)) by binary searching how many elements to take from each."
source: "https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1"
difficulty: "Medium"
tags: ["Array", "Divide and Conquer", "Binary Search"]
complexity:
  time: "O(\\log \\min(n, m))"
  space: "O(1)"
---

## Problem

Given two sorted arrays `a[]` and `b[]` and an element `k`, find the element that would be at the **k-th** position of the combined sorted array.

Complete the function `kthElement()` which takes the arrays `a`, `b` and the integer `k` and returns the k-th element (1-based) of their merged order.

**Example 1:**

```text
Input:  a[] = [2, 3, 6, 7, 9], b[] = [1, 4, 8, 10], k = 5
Output: 6
Explanation: The final combined sorted array would be [1, 2, 3, 4, 6, 7, 8, 9, 10]. The 5th element of this array is 6.
```

**Example 2:**

```text
Input:  a[] = [1, 4, 8, 10, 12], b[] = [5, 7, 11, 15, 17], k = 6
Output: 10
Explanation: Combined sorted array is [1, 4, 5, 7, 8, 10, 11, 12, 15, 17]. The 6th element of this array is 10.
```

**Constraints:**

- $1 \le k \le$ `size(a) + size(b)`
- $1 \le$ `a.size()`, `b.size()` $\le 10^6$
- $0 \le$ `a[i]`, `b[i]` $\le 10^8$

## Solution approach

### Intuition

Merging the two arrays until `k` elements have been produced works, but costs $O(k)$ — up to $2 \times 10^6$ steps. We can do much better by asking a different question: **how many of the first `k` merged elements come from `a`?**

Suppose the answer is `cutA`; then `cutB = k - cutA` come from `b`. Take the prefixes `a[0..cutA)` and `b[0..cutB)`. They are exactly the `k` smallest elements if and only if every element on the left of both cuts is no larger than every element on the right:

- `a[cutA - 1] <= b[cutB]` (the last taken `a` is not bigger than the first untaken `b`), and
- `b[cutB - 1] <= a[cutA]` (and vice versa).

The conditions inside each array hold automatically because both arrays are sorted. When both cross-conditions hold, the k-th element is the larger of the two last taken elements, `max(a[cutA - 1], b[cutB - 1])`.

If the first condition fails, we took too many from `a`, so `cutA` must shrink; if the second fails, we took too few, so `cutA` must grow. That monotonic behaviour lets us **binary search `cutA`**. Missing neighbours (a cut at the very start or end of an array) are treated as $-\infty$ / $+\infty$.

`cutA` can range only over `[max(0, k - m), min(k, n)]`: we cannot take more than `n` from `a`, and must take at least `k - m` because `b` supplies at most `m`. Searching over the **shorter** array makes the cost $O(\log \min(n, m))$.

### Algorithm

1. If `a` is longer than `b`, swap their roles so `n = a.size()` is the smaller size.
2. Set `lo = max(0, k - m)` and `hi = min(k, n)`.
3. While `lo <= hi`:
   - `cutA = (lo + hi) / 2`, `cutB = k - cutA`;
   - read `aLeft`, `aRight`, `bLeft`, `bRight` around the cuts, using `INT_MIN` / `INT_MAX` past the ends;
   - if `aLeft > bRight`, set `hi = cutA - 1`; else if `bLeft > aRight`, set `lo = cutA + 1`;
   - otherwise return `max(aLeft, bLeft)`.

### Walkthrough

Example 2: green cells are the elements taken by the current cuts, orange cells are the first untaken elements that the cross-conditions compare against.

![Binary search on the cut position for a = [1,4,8,10,12], b = [5,7,11,15,17], k = 6](/img/codes/k-th-element-of-two-sorted-array/partition/01.webp)

### Complexity

- **Time:** $O(\log \min(n, m))$ — a binary search over the cut in the shorter array, $O(1)$ work per step.
- **Space:** $O(1)$ — a few indices (the role swap is a recursive call made at most once).

### Edge cases

- **All `k` elements come from one array:** `cutA` is `0` or `cutB` is `0`; the missing left neighbour becomes `INT_MIN`, so `max` picks the other array's element.
- **`k = n + m`:** `lo = hi = n`, both right neighbours are `INT_MAX`, and the answer is the larger of the two last elements.
- **Duplicates across arrays:** the conditions use `<=`, so equal values on both sides of a cut are accepted.

## Code

```cpp
class Solution {
   public:
    int kthElement(vector<int>& a, vector<int>& b, int k) {
        if (a.size() > b.size()) return kthElement(b, a, k);
        int n = a.size(), m = b.size();
        int lo = max(0, k - m), hi = min(k, n);
        while (lo <= hi) {
            int cutA = lo + (hi - lo) / 2;  // elements taken from a
            int cutB = k - cutA;            // elements taken from b
            int aLeft = cutA > 0 ? a[cutA - 1] : INT_MIN;
            int aRight = cutA < n ? a[cutA] : INT_MAX;
            int bLeft = cutB > 0 ? b[cutB - 1] : INT_MIN;
            int bRight = cutB < m ? b[cutB] : INT_MAX;
            if (aLeft > bRight) {
                hi = cutA - 1;
            } else if (bLeft > aRight) {
                lo = cutA + 1;
            } else {
                return max(aLeft, bLeft);
            }
        }
        return -1;  // unreachable for 1 <= k <= n + m
    }
};
```

```java
class Solution {
    public int kthElement(int a[], int b[], int k) {
        if (a.length > b.length) return kthElement(b, a, k);
        int n = a.length, m = b.length;
        int lo = Math.max(0, k - m), hi = Math.min(k, n);
        while (lo <= hi) {
            int cutA = lo + (hi - lo) / 2;  // elements taken from a
            int cutB = k - cutA;            // elements taken from b
            int aLeft = cutA > 0 ? a[cutA - 1] : Integer.MIN_VALUE;
            int aRight = cutA < n ? a[cutA] : Integer.MAX_VALUE;
            int bLeft = cutB > 0 ? b[cutB - 1] : Integer.MIN_VALUE;
            int bRight = cutB < m ? b[cutB] : Integer.MAX_VALUE;
            if (aLeft > bRight) {
                hi = cutA - 1;
            } else if (bLeft > aRight) {
                lo = cutA + 1;
            } else {
                return Math.max(aLeft, bLeft);
            }
        }
        return -1;  // unreachable for 1 <= k <= n + m
    }
}
```

```python
class Solution:
    def kthElement(self, a, b, k):
        if len(a) > len(b):
            a, b = b, a
        n, m = len(a), len(b)
        lo, hi = max(0, k - m), min(k, n)
        while lo <= hi:
            cut_a = (lo + hi) // 2  # elements taken from a
            cut_b = k - cut_a       # elements taken from b
            a_left = a[cut_a - 1] if cut_a > 0 else float('-inf')
            a_right = a[cut_a] if cut_a < n else float('inf')
            b_left = b[cut_b - 1] if cut_b > 0 else float('-inf')
            b_right = b[cut_b] if cut_b < m else float('inf')
            if a_left > b_right:
                hi = cut_a - 1
            elif b_left > a_right:
                lo = cut_a + 1
            else:
                return max(a_left, b_left)
        return -1  # unreachable for 1 <= k <= n + m
```
