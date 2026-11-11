---
title: "Remove Nth Node From End of List"
description: "Remove the nth node from the end of a singly linked list in one pass, using two pointers kept n nodes apart behind a dummy head."
source: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/"
difficulty: "Medium"
tags: ["Linked List", "Two Pointers"]
complexity:
  time: "O(L)"
  space: "O(1)"
---

## Problem

Given the `head` of a linked list, remove the $n^{th}$ node from the end of the list and return its head.

**Example 1:**

![The list 1→2→3→4→5 with node 4 removed, giving 1→2→3→5](https://assets.leetcode.com/uploads/2020/10/03/remove_ex1.jpg)

```text
Input:  head = [1,2,3,4,5], n = 2
Output: [1,2,3,5]
```

**Example 2:**

```text
Input:  head = [1], n = 1
Output: []
```

**Example 3:**

```text
Input:  head = [1,2], n = 1
Output: [1]
```

**Constraints:**

- The number of nodes in the list is `sz`.
- $1 \le sz \le 30$
- $0 \le$ `Node.val` $\le 100$
- $1 \le n \le sz$

**Follow-up:** Could you do this in one pass?

## Solution approach

### Intuition

The direct method counts the length `L`, then walks again to node `L - n`. That is two passes; the follow-up asks for one.

To find the `n`-th node from the end without knowing `L`, keep **two pointers exactly `n` nodes apart**. When the front pointer `fast` falls off the end of the list, the back pointer `slow` is `n` nodes behind the end — which is exactly the node *before* the one to delete, if we start both from a dummy node placed in front of `head`.

The dummy node also removes the special case of deleting the head itself: the head simply becomes "the node after the dummy", and we return `dummy.next` at the end.

### Algorithm

1. Create a `dummy` node whose `next` is `head`. Set `fast = head` and `slow = &dummy`.
2. Advance `fast` by `n` nodes. Now `fast` is `n` nodes ahead of `slow->next`.
3. While `fast` is not null, advance both `fast` and `slow` by one node. The gap is preserved.
4. When `fast` becomes null, `slow->next` is the `n`-th node from the end. Save it as `target`, unlink it with `slow->next = target->next`, and free it.
5. Return `dummy.next`.

### Walkthrough

`D` is the dummy node. Blue is `slow`, orange is the node `fast` points at; the gap between them never changes:

![Two pointers n = 2 apart on the list 1→2→3→4→5](/img/codes/remove-nth-node-from-end-of-list/two-pointers/01.webp)

### Complexity

- **Time:** $O(L)$ — `fast` visits every node once and `slow` trails behind it, all in a single pass.
- **Space:** $O(1)$ — a dummy node and two pointers.

### Edge cases

- **Removing the head** (`n == sz`, e.g. Example 2 or `[1,2]` with `n = 2`): after step 2 `fast` is already null, so `slow` stays at `dummy` and `dummy.next` is moved past the head. The result may be an empty list.
- **Removing the tail** (`n = 1`, Example 3): `slow` stops at the second-to-last node and its `next` becomes null.

## Code

```cpp
class Solution {
   public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode* fast = head;
        ListNode* slow = &dummy;
        for (int i = 0; i < n; i++) fast = fast->next;
        while (fast) {
            fast = fast->next;
            slow = slow->next;
        }
        ListNode* target = slow->next;
        slow->next = target->next;
        delete target;
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = head, slow = dummy;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

```python
class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        dummy = ListNode(0, head)
        fast, slow = head, dummy
        for _ in range(n):
            fast = fast.next
        while fast:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next
```
