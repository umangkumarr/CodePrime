---
title: "Reverse Linked List"
description: "Reverse a singly linked list by re-pointing each node's next to its predecessor, iteratively with three pointers or recursively."
source: "https://leetcode.com/problems/reverse-linked-list/"
difficulty: "Easy"
tags: ["Linked List", "Recursion"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given the `head` of a singly linked list, reverse the list, and return *the reversed list*.

**Example 1:**

![The list 1→2→3→4→5 reversed to 5→4→3→2→1](https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg)

```text
Input:  head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

**Example 2:**

![The list 1→2 reversed to 2→1](https://assets.leetcode.com/uploads/2021/02/19/rev1ex2.jpg)

```text
Input:  head = [1,2]
Output: [2,1]
```

**Example 3:**

```text
Input:  head = []
Output: []
```

**Constraints:**

- The number of nodes in the list is in the range `[0, 5000]`.
- $-5000 \le$ `Node.val` $\le 5000$

**Follow-up:** A linked list can be reversed either iteratively or recursively. Could you implement both?

## Solution approach

Reversing the list means every arrow `x → y` must become `y → x`, and the old tail becomes the new head. Both approaches flip each arrow exactly once; they differ in where they keep the "rest of the work".

### Approach 1: Iterative

**Intuition.** Walk the list once and split it into two lists as you go: an already-reversed prefix headed by `prev`, and the untouched suffix headed by `curr`. Moving one node from the front of the suffix to the front of the reversed part is just one pointer change — `curr->next = prev`. The only danger is losing the suffix when we overwrite `curr->next`, so we save it in `next` first.

```mermaid
flowchart LR
    B["2 (prev)"] --> A["1"] --> N0[null]
    C["3 (curr)"] --> D["4"] --> E["5"] --> N1[null]
    classDef rev fill:#dcf5e3,stroke:#2e9e57,color:#145c2e
    classDef cur fill:#dbe8ff,stroke:#2f6fde,color:#123b8a
    class A,B rev
    class C cur
```

*State after two steps on Example 1: `2 → 1 → null` is reversed (green), `3 → 4 → 5` is not yet touched. The next step saves `next = 4`, sets `3 → 2`, then moves `prev = 3`, `curr = 4`.*

**Algorithm.**

1. Set `prev = nullptr`, `curr = head`.
2. While `curr` is not null: save `next = curr->next`, set `curr->next = prev`, then advance `prev = curr` and `curr = next`.
3. When `curr` is null every node has been moved; `prev` is the new head. Return it.

**Complexity.** Time $O(n)$ — each node is handled once. Space $O(1)$ — three pointers.

### Approach 2: Recursive

**Intuition.** Trust the recursion to reverse everything after `head`: `reverseList(head->next)` returns `newHead`, the old tail, and leaves `head->next` (the old second node) as the *last* node of that reversed list. To append `head` behind it, set `head->next->next = head`, then cut `head->next = nullptr` because `head` is now the tail.

**Algorithm.**

1. Base case: if `head` is null or has no successor, it is already reversed; return it.
2. `newHead = reverseList(head->next)`.
3. `head->next->next = head`; `head->next = nullptr`.
4. Return `newHead` (unchanged all the way up the recursion).

**Complexity.** Time $O(n)$. Space $O(n)$ — the recursion is as deep as the list (5000 frames at most here, which is fine, but the iterative version is preferred for very long lists).

### Edge cases

- **Empty list** (Example 3): the iterative loop does not run and returns `prev = nullptr`; the recursive base case returns `nullptr`.
- **Single node:** the iterative loop sets its `next` to null (it already was) and returns it; the recursive base case returns it directly.

## Code

```cpp title="Approach 1: Iterative"
class Solution {
   public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }
};
```

```cpp title="Approach 2: Recursive"
class Solution {
   public:
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode* newHead = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        return newHead;
    }
};
```
