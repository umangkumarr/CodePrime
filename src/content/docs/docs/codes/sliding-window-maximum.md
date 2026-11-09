---
title: "Sliding Window Maximum"
description: "Return the maximum of every window of size k as it slides over an array, in O(n) time using a monotonic deque of indices."
source: "https://leetcode.com/problems/sliding-window-maximum/"
difficulty: "Hard"
tags: ["Array", "Queue", "Sliding Window", "Heap (Priority Queue)", "Monotonic Queue"]
complexity:
  time: "O(n)"
  space: "O(k)"
---

## Problem

You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.

Return *the max sliding window*.

**Example 1:**

```text
Input:  nums = [1,3,-1,-3,5,3,6,7], k = 3
Output: [3,3,5,5,6,7]
Explanation:
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
```

**Example 2:**

```text
Input:  nums = [1], k = 1
Output: [1]
```

**Constraints:**

- $1 \le nums.length \le 10^5$
- $-10^4 \le nums[i] \le 10^4$
- $1 \le k \le nums.length$

## Solution approach

### Intuition

Recomputing each window's maximum costs $O(k)$ per window, $O(n \cdot k)$ overall; a balanced tree or heap brings that down to $O(n \log k)$. We can do better by noticing which elements can **never** be a maximum again.

If `j < i` and `nums[j] <= nums[i]`, then `nums[j]` is useless from the moment `i` enters the window: every future window that contains `j` also contains `i` (`i` leaves later), and `nums[i]` is at least as large. So we may throw `j` away.

After discarding all such useless elements, the indices that remain have **strictly decreasing values** from front to back. Keep them in a deque `dq`:

- the front `dq.front()` is the index of the current window's maximum;
- new indices are pushed at the back after popping every smaller-or-equal value they dominate;
- the front is popped once it slides out of the window.

### Algorithm

1. For each index `i` from `0` to `n - 1`:
   - If `dq.front() == i - k`, that index has just left the window: pop it from the front.
   - While `dq` is non-empty and `nums[dq.back()] <= nums[i]`, pop from the back.
   - Push `i` at the back.
   - Once the first window is complete (`i >= k - 1`), append `nums[dq.front()]` to `ans`.
2. Return `ans`.

### Walkthrough

Example 1. The blue cell is the new element `i`, orange cells are the indices still in `dq` (front first), grey cells are outside the window:

![Monotonic deque on [1,3,-1,-3,5,3,6,7] with k = 3](/img/codes/sliding-window-maximum/deque.gif)

### Complexity

- **Time:** $O(n)$ — every index is pushed onto `dq` once and popped at most once, so all the `while` loops together do at most `n` pops.
- **Space:** $O(k)$ — `dq` only holds indices inside the current window (the output itself takes $n - k + 1$ slots).

### Edge cases

- **`k == 1`:** each element is popped by the next one or by the window check, and every element is its own maximum.
- **Equal values:** the `<=` pops the older copy, so the front is always the most recent index of the maximum and leaves the window as late as possible.
- **`k == n`:** only one window, `ans` has a single value.

## Code

```cpp
class Solution {
   public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;  // indices; their values are strictly decreasing
        vector<int> ans;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (!dq.empty() && dq.front() == i - k) dq.pop_front();
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) ans.push_back(nums[dq.front()]);
        }
        return ans;
    }
};
```

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        ArrayDeque<Integer> dq = new ArrayDeque<>();  // indices; their values are strictly decreasing
        int[] ans = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            if (!dq.isEmpty() && dq.peekFirst() == i - k) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];
        }
        return ans;
    }
}
```

```python
from collections import deque


class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()  # indices; their values are strictly decreasing
        ans = []
        for i, x in enumerate(nums):
            if dq and dq[0] == i - k:
                dq.popleft()
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                ans.append(nums[dq[0]])
        return ans
```
