---
title: "Maximum sum of non-adjacent elements"
description: "Find the maximum sum of a subsequence with no two adjacent elements using a take-or-skip DP that keeps only two running values."
source: "https://www.naukri.com/code360/problems/maximum-sum-of-non-adjacent-elements_843261"
difficulty: "Medium"
tags: ["Dynamic Programming"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

You are given an array/list of `N` integers. You are supposed to return the maximum sum of the subsequence with the constraint that no two elements are adjacent in the given array/list.

**Note:** A subsequence of an array/list is obtained by deleting some number of elements (can be zero) from the array/list, leaving the remaining elements in their original order.

Complete the function `int maximumNonAdjacentSum(vector<int> &nums)`; the judge reads the `T` test cases and prints the results.

**Example 1:**

```text
Input:  nums = [1, 2, 4]
Output: 5
Explanation: The sum of ARR[0] & ARR[2] is 5 which is greater than ARR[1] which is 2 so the answer is 5.
```

**Example 2:**

```text
Input:  nums = [2, 1, 4, 9]
Output: 11
Explanation: The sum of ARR[0] and ARR[2] is 6, the sum of ARR[1] and ARR[3] is 10, and the sum of ARR[0] and ARR[3] is 11. So if we take the sum of ARR[0] and ARR[3], it will give the maximum sum of sequence in which no elements are adjacent in the given array/list.
```

**Example 3:**

```text
Input:  nums = [1, 2, 3, 5, 4]
Output: 8
Explanation: Out of all the possibilities, if we take the sum of ARR[0], ARR[2] and ARR[4], i.e. 8, it will give the maximum sum of sequence in which no elements are adjacent in the given array/list.
```

**Example 4:**

```text
Input:  nums = [1, 2, 3, 1, 3, 5, 8, 1, 9]
Output: 24
Explanation: Out of all the possibilities, if we take the sum of ARR[0], ARR[2], ARR[4], ARR[6] and ARR[8], i.e. 24, it will give the maximum sum of sequence in which no elements are adjacent in the given array/list.
```

**Constraints:**

- $1 \le T \le 500$
- $1 \le N \le 1000$
- $0 \le$ `ARR[i]` $\le 10^5$
- Time limit: 1 sec.

## Solution approach

### Intuition

Process the array from left to right and, for the prefix ending at index `i`, remember two numbers:

- `take` — the best sum of a valid subsequence of the prefix that **uses** `nums[i]`;
- `skip` — the best sum of a valid subsequence of the prefix that **does not use** `nums[i]`.

If `nums[i]` is used, `nums[i - 1]` must not be, so `take_i = skip_{i-1} + nums[i]`. If `nums[i]` is not used, the previous element may or may not be, so `skip_i = max(take_{i-1}, skip_{i-1})`. Each index depends only on the one before it, so two variables are enough. Trying every subset would be exponential; this looks at each element once.

### Algorithm

1. `take = 0`, `skip = 0` (the empty prefix).
2. For each `x` in `nums`: compute `newTake = skip + x` and `skip = max(take, skip)`, then `take = newTake`.
3. Return `max(take, skip)`.

### Walkthrough

On Example 2, `nums = [2, 1, 4, 9]`:

| `i` | `nums[i]` | `take` | `skip` |
| --- | --- | --- | --- |
| 0 | 2 | 2 | 0 |
| 1 | 1 | 0 + 1 = 1 | max(2, 0) = 2 |
| 2 | 4 | 2 + 4 = 6 | max(1, 2) = 2 |
| 3 | 9 | 2 + 9 = 11 | max(6, 2) = 6 |

The answer is `max(11, 6) = 11`, which corresponds to taking `2` and `9`.

### Complexity

- **Time:** $O(n)$ — one pass over the array.
- **Space:** $O(1)$ — two running values.

### Edge cases

- **Single element:** after one iteration `take = nums[0]`, `skip = 0`, so the answer is `nums[0]`.
- **Zeros:** values are non-negative, so `skip` starting at `0` (the empty subsequence) never causes a wrong answer.
- **Overflow:** at most 500 of the 1000 elements can be chosen, so the sum is at most $500 \cdot 10^5 = 5 \times 10^7$, well within `int`.

## Code

```cpp
int maximumNonAdjacentSum(vector<int> &nums) {
    int take = 0, skip = 0;  // best sums with / without the current element
    for (int x : nums) {
        int newTake = skip + x;
        skip = max(take, skip);
        take = newTake;
    }
    return max(take, skip);
}
```

```java
public class Solution {
    public static int maximumNonAdjacentSum(ArrayList<Integer> nums) {
        int take = 0, skip = 0;  // best sums with / without the current element
        for (int x : nums) {
            int newTake = skip + x;
            skip = Math.max(take, skip);
            take = newTake;
        }
        return Math.max(take, skip);
    }
}
```

```python
def maximumNonAdjacentSum(nums):
    take, skip = 0, 0  # best sums with / without the current element
    for x in nums:
        take, skip = skip + x, max(take, skip)
    return max(take, skip)
```
