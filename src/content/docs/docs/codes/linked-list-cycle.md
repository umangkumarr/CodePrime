---
title: "Linked List Cycle"
description: "Detect whether a linked list contains a cycle in O(1) memory with Floyd's tortoise and hare: a fast pointer catches a slow one only inside a loop."
source: "https://leetcode.com/problems/linked-list-cycle/"
difficulty: "Easy"
tags: ["Hash Table", "Linked List", "Two Pointers", "Floyd's Cycle Finding Algorithm"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given `head`, the head of a linked list, determine if the linked list has a cycle in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer. Internally, `pos` is used to denote the index of the node that tail's `next` pointer is connected to. **Note that `pos` is not passed as a parameter**.

Return `true` _if there is a cycle in the linked list_. Otherwise, return `false`.

**Example 1:**

![List 3 → 2 → 0 → -4 with -4 pointing back to 2](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png)

```text
Input:  head = [3,2,0,-4], pos = 1
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).
```

**Example 2:**

![List 1 → 2 with 2 pointing back to 1](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test2.png)

```text
Input:  head = [1,2], pos = 0
Output: true
Explanation: There is a cycle in the linked list, where the tail connects to the 0th node.
```

**Example 3:**

![A single node 1 with no cycle](https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist_test3.png)

```text
Input:  head = [1], pos = -1
Output: false
Explanation: There is no cycle in the linked list.
```

**Constraints:**

- The number of the nodes in the list is in the range $[0, 10^4]$.
- $-10^5 \le$ `Node.val` $\le 10^5$
- `pos` is `-1` or a **valid index** in the linked-list.

**Follow-up:** Can you solve it using $O(1)$ (i.e. constant) memory?

## Solution approach

### Intuition

Remembering every visited node in a hash set detects a revisit, but uses $O(n)$ memory. Floyd's **tortoise and hare** uses two pointers instead: `slow` moves one node per step, `fast` moves two.

- **No cycle:** `fast` runs ahead and reaches the end of the list (`nullptr`), so we answer `false`.
- **Cycle:** `fast` can never leave the loop, and `slow` eventually enters it too. From then on, every step `fast` closes the gap to `slow` by exactly one node (it moves 2, `slow` moves 1). A gap that shrinks by one each step cannot jump over zero, so `fast` lands **exactly** on `slow` within one lap of the cycle.

So the two pointers meet if and only if the list has a cycle.

### Algorithm

1. Set `slow = fast = head`.
2. While `fast` and `fast->next` are not `nullptr`:
   - `slow = slow->next`, `fast = fast->next->next`;
   - if `slow == fast`, return `true`.
3. Return `false`.

### Walkthrough

Example 1 (`3 → 2 → 0 → -4 → back to 2`):

| Step | `slow` | `fast` |
| --- | --- | --- |
| start | `3` | `3` |
| 1 | `2` | `0` |
| 2 | `0` | `2` |
| 3 | `-4` | `-4` — they meet, return `true` |

To find **where** the cycle starts as well, see [Linked List Cycle II](/docs/codes/linked-list-cycle-ii/).

### Complexity

- **Time:** $O(n)$ — without a cycle `fast` reaches the end in `n / 2` steps; with one, `slow` enters the cycle within `n` steps and is caught within one more lap.
- **Space:** $O(1)$ — two pointers; the list is only read.

### Edge cases

- **Empty list:** `fast` is `nullptr`, the loop never runs, and `false` is returned.
- **Single node** (Example 3): `fast->next` is `nullptr`, so `false`.
- **Self-loop** on one node: `fast->next->next` is that node, so the pointers meet after one step.

## Code

```cpp
class Solution {
   public:
    bool hasCycle(ListNode *head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};
```

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
```

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False
```
