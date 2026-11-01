---
title: "Intersection of Two Linked Lists"
description: "Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection…"
source: "https://leetcode.com/problems/intersection-of-two-linked-lists/"
tags: ["Hash Table", "Linked List", "Two Pointers"]
complexity:
  time: "O((n + m) \\log n)"
  space: "O(n)"
---

## Problem

<p>Given the heads of two singly linked-lists <code>headA</code> and <code>headB</code>, return <em>the node at which the two lists intersect</em>. If the two linked lists have no intersection at all, return <code>null</code>.</p>

<p>For example, the following two linked lists begin to intersect at node <code>c1</code>:</p>
<img alt="" src="https://assets.leetcode.com/uploads/2021/03/05/160_statement.png" />
<p>The test cases are generated such that there are no cycles anywhere in the entire linked structure.</p>

<p><strong>Note</strong> that the linked lists must <strong>retain their original structure</strong> after the function returns.</p>

<p><strong>Custom Judge:</strong></p>

<p>The inputs to the <strong>judge</strong> are given as follows (your program is <strong>not</strong> given these inputs):</p>

<ul>
	<li><code>intersectVal</code> - The value of the node where the intersection occurs. This is <code>0</code> if there is no intersected node.</li>
	<li><code>listA</code> - The first linked list.</li>
	<li><code>listB</code> - The second linked list.</li>
	<li><code>skipA</code> - The number of nodes to skip ahead in <code>listA</code> (starting from the head) to get to the intersected node.</li>
	<li><code>skipB</code> - The number of nodes to skip ahead in <code>listB</code> (starting from the head) to get to the intersected node.</li>
</ul>

<p>The judge will then create the linked structure based on these inputs and pass the two heads, <code>headA</code> and <code>headB</code>&nbsp;to your program. If you correctly return the intersected node, then your solution will be <strong>accepted</strong>.</p>

## Solution approach

### Intuition

Two lists intersect exactly when they share a **node** (the same address in memory), not merely an equal value. So if we remember every node of list A, the first node of list B that we have already seen is the intersection point.

Comparing every node of B against every node of A would take $O(n \cdot m)$; storing A's nodes in a lookup table avoids that rescanning.

### Algorithm

1. Walk list A with `temp` and mark every node pointer in the map `mp` (`mp[temp] = 1`).
2. Reset `temp` to `headB` and walk list B.
3. Return the first node for which `mp[temp]` is set; it is the first shared node.
4. If list B ends without a hit, return `NULL`.

### Complexity

- **Time:** $O((n + m) \log n)$ — every node of both lists is inserted into or looked up in an ordered `map`, each costing $O(\log n)$.
- **Space:** $O(n)$ — the map holds every node of list A.

### Edge cases

- **No intersection:** list B is walked to the end and `NULL` is returned.
- **Equal values but different nodes** are not matched, because the map is keyed by pointer.

## Code

```cpp title="C++"
class Solution {
   public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        map<ListNode *, int> mp;
        ListNode *temp;
        temp = new ListNode;
        temp = headA;
        while (temp) {
            mp[temp] = 1;
            temp = temp->next;
        }
        temp = headB;
        while (temp) {
            if (mp[temp]) return temp;
            temp = temp->next;
        }
        return NULL;
    }
};

```
