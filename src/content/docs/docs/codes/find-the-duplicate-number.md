---
title: "Find the Duplicate Number"
description: "Find the single repeated value among n + 1 integers in [1, n] without modifying the array, in O(n) time and O(1) space using Floyd's cycle detection."
source: "https://leetcode.com/problems/find-the-duplicate-number/"
difficulty: "Medium"
tags: ["Array", "Two Pointers", "Binary Search", "Bit Manipulation", "Pigeonhole Principle", "Floyd's Cycle Finding Algorithm"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive.

There is only **one repeated number** in `nums`, return _this repeated number_.

You must solve the problem **without** modifying the array `nums` and using only constant extra space.

**Example 1:**

```text
Input:  nums = [1,3,4,2,2]
Output: 2
```

**Example 2:**

```text
Input:  nums = [3,1,3,4,2]
Output: 3
```

**Example 3:**

```text
Input:  nums = [3,3,3,3,3]
Output: 3
```

**Constraints:**

- $1 \le n \le 10^5$
- `nums.length == n + 1`
- $1 \le$ `nums[i]` $\le n$
- All the integers in `nums` appear only **once** except for **precisely one integer** which appears **two or more** times.

**Follow-up:**

- How can we prove that at least one duplicate number must exist in `nums`?
- Can you solve the problem in linear runtime complexity?

## Solution approach

### Intuition

**Why a duplicate must exist:** there are `n + 1` numbers but only `n` possible values in `[1, n]`, so by the pigeonhole principle two of them are equal.

Sorting or a hash set would find it, but the first modifies the array and the second uses $O(n)$ space. Instead, read the array as a **linked list**: index `i` points to index `nums[i]`. Every value is in `[1, n]`, so every pointer stays inside the array, and starting from index `0` we can keep following pointers forever. Since there are finitely many indices, the walk must eventually enter a **cycle**.

No index points back to `0` (no value is `0`), so `0` is not on the cycle and the walk reaches the cycle from outside. The index where it enters the cycle has two incoming pointers: one from the path and one from inside the cycle. Two indices `i != j` with `nums[i] == nums[j]` means that value is the duplicate. So **the duplicate is the entrance of the cycle**, and Floyd's tortoise-and-hare algorithm finds a cycle entrance in linear time with two pointers.

### Algorithm

1. **Find a meeting point.** Start `slow` and `fast` at index `0`. Repeatedly move `slow = nums[slow]` (one step) and `fast = nums[nums[fast]]` (two steps) until they are equal. Once both are on the cycle, the gap between them shrinks by one each step, so they must meet.
2. **Find the entrance.** Put `slow` back at `0` and move both pointers one step at a time; they meet exactly at the cycle entrance. (If the path to the cycle has length `a` and the meeting point is `b` steps into the cycle of length `c`, then `slow` walked `a + b` and `fast` walked `2(a + b)`, so `a + b` is a multiple of `c`; hence walking `a` more steps from the meeting point lands on the entrance, just like walking `a` steps from `0`.)
3. Return the meeting index — the duplicate value.

### Walkthrough

Example 1, `nums = [1,3,4,2,2]`. Following `i → nums[i]` from `0` gives `0 → 1 → 3 → 2 → 4 → 2 → ...`. Index `2` is pointed to from both `3` and `4`, so it is where the path enters the cycle, and `2` is the answer:

[![Index graph 0 → 1 → 3 → 2 → 4 → 2: the cycle is entered at index 2, the duplicate](/img/codes/find-the-duplicate-number/index-graph.png)](/img/codes/find-the-duplicate-number/index-graph.png)

Phase 1: `slow` visits `1, 3, 2, 4`, `fast` visits `3, 4, 4, 4` — they meet at `4`. Phase 2: from `0` and `4`, they move to `1`/`2`, `3`/`4`, `2`/`2` and meet at `2`.

### Complexity

- **Time:** $O(n)$ — phase 1 ends within `a + c` steps of `slow`, and phase 2 takes `a` steps, both at most $n + 1$.
- **Space:** $O(1)$ — two indices, and the array is only read.

### Edge cases

- **The duplicate appears many times** (Example 3, `[3,3,3,3,3]`): `0 → 3 → 3`, a self-loop at `3`. Its entrance is still the duplicate.
- **`n == 1`** (`[1,1]`): `0 → 1 → 1`, so the answer `1` is found immediately.

## Code

```cpp
class Solution {
   public:
    int findDuplicate(vector<int>& nums) {
        // Treat i -> nums[i] as a linked list; the duplicate is where the cycle starts.
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};
```

```java
class Solution {
    public int findDuplicate(int[] nums) {
        // Treat i -> nums[i] as a linked list; the duplicate is where the cycle starts.
        int slow = 0, fast = 0;
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);

        slow = 0;
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
}
```

```python
class Solution:
    def findDuplicate(self, nums: list[int]) -> int:
        # Treat i -> nums[i] as a linked list; the duplicate is where the cycle starts.
        slow = nums[0]
        fast = nums[nums[0]]
        while slow != fast:
            slow = nums[slow]
            fast = nums[nums[fast]]

        slow = 0
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow
```
