---
title: "Count Inversions"
description: "Count the pairs i < j with arr[i] > arr[j] in an array of distinct integers in O(n log n), counting split inversions while merge sorting."
source: "https://www.naukri.com/code360/problems/count-inversions_615"
difficulty: "Medium"
tags: ["Array", "Divide and Conquer", "Merge Sort"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

For a given integer array/list `ARR` of size `N` containing all distinct values, find the total number of **inversions** that may exist.

An inversion is defined for a pair of integers in the array/list when the following two conditions are met:

1. `ARR[i] > ARR[j]`
2. `i < j`

where `i` and `j` are indices ranging from `0` to `N - 1`.

Complete the function `getInversions(long long *arr, int n)` which returns the number of inversions as a `long long`.

**Example 1:**

```text
Input:  N = 3, ARR = [3, 2, 1]
Output: 3
Explanation: The inversions are (3, 2), (3, 1) and (2, 1).
```

**Example 2:**

```text
Input:  N = 5, ARR = [2, 5, 1, 3, 4]
Output: 4
Explanation: The inversions are (2, 1), (5, 1), (5, 3) and (5, 4).
```

**Constraints:**

- $1 \le N \le 10^5$
- $1 \le$ `ARR[i]` $\le 10^9$
- All values in `ARR` are distinct.

## Solution approach

### Intuition

Checking every pair is $O(N^2)$, about $5 \cdot 10^9$ comparisons for $N = 10^5$ — too slow. Merge sort counts inversions almost for free.

Split the array into a left and a right half. Every inversion is either inside the left half, inside the right half, or **split** (one element in each half). The first two kinds are counted recursively. After the recursive calls both halves are sorted, and sorting a half does not change which split pairs are inversions (it only reorders elements within the half). So while merging, whenever the smallest remaining right element `arr[j]` is smaller than the smallest remaining left element `arr[i]`, it is smaller than **every** remaining left element — and each of those `mid - i` elements forms an inversion with it.

### Algorithm

1. `sortCount(arr, buf, lo, hi)` works on the half-open range `[lo, hi)` and returns the number of inversions inside it, leaving the range sorted.
2. If the range has fewer than two elements, return `0`.
3. Let `mid = lo + (hi - lo) / 2`. Add the counts of `[lo, mid)` and `[mid, hi)` from recursive calls.
4. Merge with `i` over the left half and `j` over the right half into `buf`:
   - if `arr[i] <= arr[j]`, take `arr[i]`;
   - otherwise take `arr[j]` and add `mid - i` (the left elements still waiting, all larger than `arr[j]`).
5. Copy the leftovers, copy `buf[lo, hi)` back into `arr`, and return the total.
6. `getInversions` allocates `buf` once and calls `sortCount(arr, buf, 0, n)`.

### Walkthrough

The last merge of Example 2. The left half `[2, 5, 1]` has already been sorted to `[1, 2, 5]` (contributing 2 inversions) and the right half `[3, 4]` (contributing 0):

![Merging [1,2,5] with [3,4] while counting split inversions](/img/codes/count-inversions/merge-count.gif)

### Complexity

- **Time:** $O(N \log N)$ — $\log N$ levels of recursion, each doing $O(N)$ total merging work.
- **Space:** $O(N)$ — the merge buffer `buf`, plus $O(\log N)$ recursion stack.

### Edge cases

- **The answer can reach $N(N-1)/2 \approx 5 \cdot 10^9$**, which overflows `int`; the counts are `long long`.
- **`N == 1`:** the range has fewer than two elements, so the answer is `0`.
- **Equal values** cannot occur here, but the `<=` comparison would correctly not count them anyway.

## Code

```cpp
long long sortCount(long long* arr, vector<long long>& buf, int lo, int hi) {
    if (hi - lo < 2) return 0;
    int mid = lo + (hi - lo) / 2;
    long long count = sortCount(arr, buf, lo, mid) + sortCount(arr, buf, mid, hi);

    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        if (arr[i] <= arr[j]) {
            buf[k++] = arr[i++];
        } else {
            count += mid - i;  // arr[j] is smaller than every element left in [i, mid)
            buf[k++] = arr[j++];
        }
    }
    while (i < mid) buf[k++] = arr[i++];
    while (j < hi) buf[k++] = arr[j++];
    copy(buf.begin() + lo, buf.begin() + hi, arr + lo);
    return count;
}

long long getInversions(long long* arr, int n) {
    vector<long long> buf(n);
    return sortCount(arr, buf, 0, n);
}
```

```java
public class Solution {
    public static long getInversions(long arr[], int n) {
        return sortCount(arr, new long[n], 0, n);
    }

    private static long sortCount(long[] arr, long[] buf, int lo, int hi) {
        if (hi - lo < 2) return 0;
        int mid = lo + (hi - lo) / 2;
        long count = sortCount(arr, buf, lo, mid) + sortCount(arr, buf, mid, hi);

        int i = lo, j = mid, k = lo;
        while (i < mid && j < hi) {
            if (arr[i] <= arr[j]) {
                buf[k++] = arr[i++];
            } else {
                count += mid - i;  // arr[j] is smaller than every element left in [i, mid)
                buf[k++] = arr[j++];
            }
        }
        while (i < mid) buf[k++] = arr[i++];
        while (j < hi) buf[k++] = arr[j++];
        System.arraycopy(buf, lo, arr, lo, hi - lo);
        return count;
    }
}
```

```python
def getInversions(arr, n):
    buf = [0] * n

    def sort_count(lo, hi):
        if hi - lo < 2:
            return 0
        mid = (lo + hi) // 2
        count = sort_count(lo, mid) + sort_count(mid, hi)

        i, j, k = lo, mid, lo
        while i < mid and j < hi:
            if arr[i] <= arr[j]:
                buf[k] = arr[i]
                i += 1
            else:
                count += mid - i  # arr[j] is smaller than every element left in [i, mid)
                buf[k] = arr[j]
                j += 1
            k += 1
        buf[k:k + mid - i] = arr[i:mid]
        k += mid - i
        buf[k:hi] = arr[j:hi]
        arr[lo:hi] = buf[lo:hi]
        return count

    return sort_count(0, n)
```
