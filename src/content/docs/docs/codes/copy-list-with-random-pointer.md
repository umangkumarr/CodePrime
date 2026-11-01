---
title: "Copy List with Random Pointer"
description: "A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.…"
source: "https://leetcode.com/problems/copy-list-with-random-pointer/"
tags: ["Hash Table", "Linked List"]
complexity:
  time: "O(n \\log n)"
  space: "O(n)"
---

## Problem

<p>A linked list of length <code>n</code> is given such that each node contains an additional random pointer, which could point to any node in the list, or <code>null</code>.</p>

<p>Construct a <a href="https://en.wikipedia.org/wiki/Object_copying#Deep_copy" target="_blank"><strong>deep copy</strong></a> of the list. The deep copy should consist of exactly <code>n</code> <strong>brand new</strong> nodes, where each new node has its value set to the value of its corresponding original node. Both the <code>next</code> and <code>random</code> pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state. <strong>None of the pointers in the new list should point to nodes in the original list</strong>.</p>

<p>For example, if there are two nodes <code>X</code> and <code>Y</code> in the original list, where <code>X.random --&gt; Y</code>, then for the corresponding two nodes <code>x</code> and <code>y</code> in the copied list, <code>x.random --&gt; y</code>.</p>

<p>Return <em>the head of the copied linked list</em>.</p>

<p>The linked list is represented in the input/output as a list of <code>n</code> nodes. Each node is represented as a pair of <code>[val, random_index]</code> where:</p>

<ul>
	<li><code>val</code>: an integer representing <code>Node.val</code></li>
	<li><code>random_index</code>: the index of the node (range from <code>0</code> to <code>n-1</code>) that the <code>random</code> pointer points to, or <code>null</code> if it does not point to any node.</li>
</ul>

<p>Your code will <strong>only</strong> be given the <code>head</code> of the original linked list.</p>

## Solution approach

### Intuition

The hard part of a deep copy is the `random` pointer: when we create a copy of a node, the node its `random` points to may not have been copied yet. Splitting the work into two passes removes that problem. First create a copy of every node and remember which copy belongs to which original; then every pointer of the original can be translated into the matching pointer of the copy.

### Algorithm

1. Walk the list with `temp` and, for every original node, create `newNode` with the same `val`. Store the pair in the map `mp` (original to copy).
2. Walk the list again. For each original node `temp`, set `mp[temp]->next = mp[temp->next]` and `mp[temp]->random = mp[temp->random]`.
3. A `nullptr` key is not in the map, so `mp[nullptr]` default-constructs to `nullptr`, which is exactly what a missing `next` or `random` should become.
4. Return `mp[head]`, the copy of the head.

### Complexity

- **Time:** $O(n \log n)$ — two passes over the list, and each `std::map` access costs $O(\log n)$.
- **Space:** $O(n)$ — the map holds one entry per node (not counting the copied list itself).

### Edge cases

- **Empty list:** both loops are skipped and `mp[head]` returns `nullptr`.
- **`random` pointing to the node itself** or to `NULL`: both are handled by the same map lookup.

## Code

```cpp title="C++"
class Solution {
   public:
    Node* copyRandomList(Node* head) {
        Node* temp = head;
        map<Node*, Node*> mp;
        while (temp) {
            Node* newNode = new Node(temp->val);
            mp[temp] = newNode;
            temp = temp->next;
        }
        temp = head;
        while (temp) {
            mp[temp]->next = mp[temp->next];
            mp[temp]->random = mp[temp->random];
            temp = temp->next;
        }
        return mp[head];
    }
};

```
