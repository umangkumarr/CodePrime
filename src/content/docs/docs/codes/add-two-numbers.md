---
title: "Add Two Numbers"
description: "Add two numbers stored as reversed digit linked lists by walking both lists together with a carry, building the result behind a dummy head."
source: "https://leetcode.com/problems/add-two-numbers/"
difficulty: "Medium"
tags: ["Linked List", "Math", "Recursion"]
complexity:
  time: "O(\\max(m, n))"
  space: "O(1)"
---

## Problem

You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example 1:**

![Two lists 2→4→3 and 5→6→4 adding to 7→0→8](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

```text
Input:  l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2:**

```text
Input:  l1 = [0], l2 = [0]
Output: [0]
```

**Example 3:**

```text
Input:  l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

**Constraints:**

- The number of nodes in each linked list is in the range `[1, 100]`.
- $0 \le$ `Node.val` $\le 9$
- It is guaranteed that the list represents a number that does not have leading zeros.

## Solution approach

### Intuition

A list can have 100 digits, far more than any built-in integer holds, so we must add digit by digit. The lists store the digits in reverse order, so the head of each list is the ones digit — exactly the order in which we add numbers on paper. Walk both lists together, add the two current digits plus the carry, write down `sum % 10` as a new node, and carry `sum / 10` into the next position.

A **dummy head** node avoids special-casing the first output node: we always append after the tail `p`, and the answer is `dummy.next`.

### Algorithm

1. Create a dummy node `dummy`, a tail pointer `p = &dummy`, and `carry = 0`.
2. While `l1`, `l2`, or `carry` is non-zero:
   - `sum = carry`, plus `l1->val` if `l1` is not null (then advance `l1`), plus `l2->val` if `l2` is not null (then advance `l2`);
   - append `new ListNode(sum % 10)` after `p`, move `p` to it, and set `carry = sum / 10`.
3. Return `dummy.next`.

For Example 1: `2 + 5 = 7`, then `4 + 6 = 10` (write `0`, carry `1`), then `3 + 4 + 1 = 8`, giving `7 → 0 → 8`.

### Complexity

- **Time:** $O(\max(m, n))$ — each node of each list is visited once, where $m$ and $n$ are the list lengths.
- **Space:** $O(1)$ extra — only the output list of $\max(m, n) + 1$ nodes at most is allocated.

### Edge cases

- **Different lengths:** once one list ends it contributes `0` and the loop continues with the other.
- **Final carry** such as Example 3: after both lists end, `carry == 1` triggers one more iteration that appends the extra `1`.
- **Both zero:** one iteration produces the single node `0`.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0), *p = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int sum = carry;
            if (l1) sum += l1->val, l1 = l1->next;
            if (l2) sum += l2->val, l2 = l2->next;
            p->next = new ListNode(sum % 10);
            p = p->next;
            carry = sum / 10;
        }
        return dummy.next;
    }
};
```
