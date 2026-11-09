---
title: "Middle of the Linked List"
description: "Return the middle node of a singly linked list (the second one if there are two) in one pass with slow and fast pointers."
source: "https://leetcode.com/problems/middle-of-the-linked-list/"
difficulty: "Easy"
tags: ["Linked List", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given the `head` of a singly linked list, return *the middle node of the linked list*.

If there are two middle nodes, return **the second middle** node.

**Example 1:**

![The list 1→2→3→4→5 with node 3 highlighted as the middle](https://assets.leetcode.com/uploads/2021/07/23/lc-midlist1.jpg)

```text
Input:  head = [1,2,3,4,5]
Output: [3,4,5]
Explanation: The middle node of the list is node 3.
```

**Example 2:**

![The list 1→2→3→4→5→6 with node 4 highlighted as the second middle](https://assets.leetcode.com/uploads/2021/07/23/lc-midlist2.jpg)

```text
Input:  head = [1,2,3,4,5,6]
Output: [4,5,6]
Explanation: Since the list has two middle nodes with values 3 and 4, we return the second one.
```

**Constraints:**

- The number of nodes in the list is in the range `[1, 100]`.
- $1 \le \text{Node.val} \le 100$

## Solution approach

### Intuition

Counting the nodes and then walking `count / 2` steps works, but needs two passes. We can do it in one with the **slow and fast pointer** (tortoise and hare) technique: `slow` moves one node per step and `fast` moves two. When `fast` runs off the end of the list, `slow` has covered exactly half the distance, so it is standing on the middle.

Invariant: after `k` steps, `slow` is node `k` and `fast` is node `2k` (0-indexed). The loop stops at the first `k` for which node `2k` or node `2k + 1` does not exist, i.e. `k = floor(n / 2)` — which is the middle for odd `n` and the **second** middle for even `n`, exactly what the problem asks.

### Algorithm

1. Set `slow = fast = head`.
2. While `fast` and `fast->next` both exist: `slow = slow->next`, `fast = fast->next->next`.
3. Return `slow`.

### Walkthrough

Example 2, with `slow` in blue and `fast` in orange (the trailing `null` is where `fast` falls off the list):

![slow and fast pointers on 1→2→3→4→5→6](/img/codes/middle-of-the-linked-list/slow-fast.gif)

### Complexity

- **Time:** $O(n)$ — `fast` visits about every second node, so the loop runs $\lfloor n/2 \rfloor$ times in a single pass.
- **Space:** $O(1)$ — two pointers.

### Edge cases

- **Single node:** `fast->next` is null, the loop never runs and `head` is returned.
- **Even length:** the loop stops when `fast` becomes null (not when `fast->next` is null), which leaves `slow` on the second middle, as in Example 2.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* middleNode(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;
    }
};
```
