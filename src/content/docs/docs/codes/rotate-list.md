---
title: "Rotate List"
description: "Rotate a linked list to the right by k places in O(n) by closing it into a ring and cutting it after node n - k mod n."
source: "https://leetcode.com/problems/rotate-list/"
difficulty: "Medium"
tags: ["Linked List", "Two Pointers"]
complexity:
  time: "O(n)"
  space: "O(1)"
---

## Problem

Given the `head` of a linked list, rotate the list to the right by `k` places.

**Example 1:**

![1→2→3→4→5 rotated right once and twice, ending as 4→5→1→2→3](https://assets.leetcode.com/uploads/2020/11/13/rotate1.jpg)

```text
Input:  head = [1,2,3,4,5], k = 2
Output: [4,5,1,2,3]
```

**Example 2:**

![0→1→2 rotated right four times, ending as 2→0→1](https://assets.leetcode.com/uploads/2020/11/13/roate2.jpg)

```text
Input:  head = [0,1,2], k = 4
Output: [2,0,1]
```

**Constraints:**

- The number of nodes in the list is in the range `[0, 500]`.
- $-100 \le$ `Node.val` $\le 100$
- $0 \le k \le 2 \times 10^9$

## Solution approach

### Intuition

Rotating right by one moves the last node to the front. Doing that `k` times is far too slow when $k$ can be $2 \times 10^9$, but two observations make it a single pointer surgery:

- Rotating a list of length `n` by `n` places gives back the same list, so only `k % n` matters.
- Rotating right by `k` (with `0 < k < n`) means the last `k` nodes move, unchanged, to the front. The new head is node number `n - k` (0-based) and the new tail is the node just before it.

If we link the old tail to the old head, the list becomes a **ring** and every rotation of it is the same ring cut at a different place. So: close the ring, walk to the new tail, and cut after it.

[![List 1 to 5 closed into a ring by linking 5 back to 1, then cut after 3 so 4 becomes the new head](/img/codes/rotate-list/ring-cut.png)](/img/codes/rotate-list/ring-cut.png)

*Example 1: `n = 5`, `k = 2`. The ring is cut after node `3`, which is `n - k - 1 = 2` steps from the old head.*

### Algorithm

1. If the list is empty, return it.
2. Walk to the old `tail`, counting the length `n`.
3. `k %= n`. If `k == 0`, the list is unchanged; return `head`.
4. Close the ring: `tail->next = head`.
5. Starting at `head`, step `n - k - 1` times to reach `newTail`.
6. `newHead = newTail->next`, cut with `newTail->next = nullptr`, and return `newHead`.

### Complexity

- **Time:** $O(n)$ — one pass to measure the list and at most one more partial pass to find the cut.
- **Space:** $O(1)$ — a few pointers; nodes are relinked, not copied.

### Edge cases

- **Empty list:** returned immediately (also avoids `k % 0`).
- **`k` a multiple of `n`** (including `k = 0`, or a single-node list): `k % n == 0`, return `head` without closing the ring.
- **`k` larger than `n`** (Example 2: `k = 4`, `n = 3`): reduced to `k = 1`.

## Code

```cpp
class Solution {
   public:
    ListNode* rotateRight(ListNode* head, int k) {
        if (!head) return head;
        int n = 1;
        ListNode* tail = head;
        while (tail->next) {
            tail = tail->next;
            n++;
        }
        k %= n;
        if (k == 0) return head;
        tail->next = head;  // close the ring
        ListNode* newTail = head;
        for (int i = 0; i < n - k - 1; i++) newTail = newTail->next;
        ListNode* newHead = newTail->next;
        newTail->next = nullptr;
        return newHead;
    }
};
```

```java
class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null) return head;
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            n++;
        }
        k %= n;
        if (k == 0) return head;
        tail.next = head;  // close the ring
        ListNode newTail = head;
        for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;
        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}
```

```python
class Solution:
    def rotateRight(self, head: ListNode | None, k: int) -> ListNode | None:
        if not head:
            return head
        n, tail = 1, head
        while tail.next:
            tail = tail.next
            n += 1
        k %= n
        if k == 0:
            return head
        tail.next = head  # close the ring
        new_tail = head
        for _ in range(n - k - 1):
            new_tail = new_tail.next
        new_head = new_tail.next
        new_tail.next = None
        return new_head
```
