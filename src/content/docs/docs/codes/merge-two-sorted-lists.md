---
title: "Merge Two Sorted Lists"
description: "Merge two sorted linked lists into one sorted list by splicing their nodes together, using a dummy head and a single linear walk."
source: "https://leetcode.com/problems/merge-two-sorted-lists/"
difficulty: "Easy"
tags: ["Linked List", "Recursion"]
complexity:
  time: "O(n + m)"
  space: "O(1)"
---

## Problem

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.

**Example 1:**

![list1 = 1→2→4 and list2 = 1→3→4 merged into 1→1→2→3→4→4](https://assets.leetcode.com/uploads/2020/10/03/merge_ex1.jpg)

```text
Input:  list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

**Example 2:**

```text
Input:  list1 = [], list2 = []
Output: []
```

**Example 3:**

```text
Input:  list1 = [], list2 = [0]
Output: [0]
```

**Constraints:**

- The number of nodes in both lists is in the range `[0, 50]`.
- $-100 \le \text{Node.val} \le 100$
- Both `list1` and `list2` are sorted in **non-decreasing** order.

## Solution approach

### Intuition

The smallest node of the merged list is the smaller of the two heads. Once it is taken, the next smallest is again the smaller of the two *current* heads, and so on — exactly the merge step of merge sort. Because we may splice existing nodes, we never allocate: we only rewrite `next` pointers.

The awkward part is the very first node (which list does the head come from?). A **dummy node** removes that special case: we append every chosen node after a `tail` pointer that starts at the dummy, and the answer is `dummy.next`.

Invariant: after each step, `dummy.next … tail` is a sorted list containing exactly the nodes removed so far, and every one of them is `<=` every node still left in `list1` and `list2`.

### Algorithm

1. Create a stack-allocated `dummy` node and set `tail = &dummy`.
2. While both `list1` and `list2` are non-empty:
   - If `list1->val <= list2->val`, link `tail->next = list1` and advance `list1`; otherwise link `list2` and advance `list2`.
   - Move `tail` to the node just linked.
3. At most one list still has nodes; they are all `>=` everything already merged, so link the whole remainder at once: `tail->next = list1 ? list1 : list2`.
4. Return `dummy.next`.

### Walkthrough

Orange cells are the two heads being compared, grey cells have already been spliced out, and in the `out` row (the list hanging off `dummy`) blue marks `tail`:

![Merging [1,2,4] and [1,3,4] with a tail pointer](/img/codes/merge-two-sorted-lists/merge.gif)

### Complexity

- **Time:** $O(n + m)$ — each loop iteration moves one node into the result, and the remainder is attached in $O(1)$.
- **Space:** $O(1)$ — only the dummy node and `tail`; the nodes are relinked in place. (The recursive version is also linear time but uses $O(n + m)$ stack.)

### Edge cases

- **One or both lists empty** (Examples 2 and 3): the loop never runs and step 3 returns the other list (or `nullptr`).
- **Equal values:** `<=` takes the node from `list1` first, so the merge is stable.
- **One list much longer:** its leftover tail is attached in one assignment instead of being walked.

## Code

```cpp
class Solution {
   public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy;
        ListNode* tail = &dummy;
        while (list1 && list2) {
            if (list1->val <= list2->val) {
                tail->next = list1;
                list1 = list1->next;
            } else {
                tail->next = list2;
                list2 = list2->next;
            }
            tail = tail->next;
        }
        tail->next = list1 ? list1 : list2;
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode();
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        tail.next = list1 != null ? list1 : list2;
        return dummy.next;
    }
}
```

```python
class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next
```
