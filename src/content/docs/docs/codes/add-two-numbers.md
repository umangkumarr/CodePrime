---
title: "Add Two Numbers"
description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains…"
source: "https://leetcode.com/problems/add-two-numbers/"
tags: ["Linked List", "Math", "Recursion"]
complexity:
  time: "O(\\max(m, n))"
  space: "O(\\max(m, n))"
---

## Problem

<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum&nbsp;as a linked list.</p>

<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>

## Solution approach

### Intuition

The lists store the digits in reverse order, so the head of each list is the ones digit. That is exactly the order in which we add numbers by hand, so we can walk both lists together, add the matching digits plus the carry, and append each result digit to a new list.

### Algorithm

1. Create a dummy node `root` and a tail pointer `p` that points to it; set `carry = 0`.
2. While `l1`, `l2`, or `carry` is non-zero:
   - compute `sm` as the sum of the current digits (a missing list counts as `0`) plus `carry`;
   - append a new node with value `sm % 10` after `p`, and set `carry = sm / 10`;
   - move `l1` and `l2` forward if they are not null, and move `p` to the new node.
3. Return `root.next`, skipping the dummy node.

### Complexity

- **Time:** $O(\max(m, n))$ — each node of each list is visited once.
- **Space:** $O(\max(m, n))$ — for the output list; only $O(1)$ extra apart from it.

### Edge cases

- **Different lengths:** a finished list contributes `0` until the other one ends.
- **Final carry** such as `[5] + [5]`: the `carry` condition adds one more node, giving `[0, 1]`.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        int carry = 0;
        ListNode root(0), *p = &root;
        while (l1 || l2 || carry) {
            int sm = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
            p->next = new ListNode(sm % 10);
            carry = sm / 10;
            l1 = (l1 ? l1->next : l1);
            l2 = (l2 ? l2->next : l2);
            p = p->next;
        }
        return root.next;
    }
};

```
