---
title: "Flattening a Linked List"
description: "Merge n sorted vertical linked lists, joined through next pointers, into one sorted list linked by bottom pointers, using a min-heap k-way merge."
source: "https://practice.geeksforgeeks.org/problems/flattening-a-linked-list/1"
difficulty: "Medium"
tags: ["Linked List"]
complexity:
  time: "O(N \\log n)"
  space: "O(n)"
---

## Problem

In a linked list, every node has two pointers: **next** and **bottom**. The heads of **n** linked lists are connected using the `next` pointer, while the `bottom` pointer points to the next node in the current linked list.

Each linked list is sorted in non-decreasing order of data, and the head nodes are also sorted in non-decreasing order.

Given the **head** of the first linked list, flatten the linked lists into a single sorted linked list such that every node is connected using only the `bottom` pointers.

Complete the function `flatten()` which takes the `head` of the first list and returns the head of the flattened list.

**Example 1:**

![Four vertical lists 5-7-8, 10-20, 19-22 and 28-40-45 joined by next pointers](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/935163/Web/Other/blobid0_1792134717.webp)

```text
Input:  head = [[5,7,8],[10,20],[19,22],[28,40,45]]
Output: 5 -> 7 -> 8 -> 10 -> 19 -> 20 -> 22 -> 28 -> 40 -> 45
Explanation: Bottom pointer of 5 is pointing to 7.
Bottom pointer of 7 is pointing to 8.
Bottom pointer of 10 is pointing to 20 and so on.
So, after flattening the linked list the sorted list will be
5 -> 7 -> 8 -> 10 -> 19 -> 20 -> 22 -> 28 -> 40 -> 45.
```

**Example 2:**

![Four vertical lists 5-7-8-30, 10, 19-22-50 and 28 joined by next pointers](https://media.geeksforgeeks.org/img-practice/prod/addEditProblem/935163/Web/Other/blobid1_1792134741.webp)

```text
Input:  head = [[5,7,8,30],[10],[19,22,50],[28]]
Output: 5 -> 7 -> 8 -> 10 -> 19 -> 22 -> 28 -> 30 -> 50
Explanation: Bottom pointer of 5 is pointing to 7.
Bottom pointer of 7 is pointing to 8.
Bottom pointer of 8 is pointing to 30 and so on.
So, after flattening the linked list the sorted list will be
5 -> 7 -> 8 -> 10 -> 19 -> 22 -> 28 -> 30 -> 50.
```

**Constraints:**

- $0 \le n \le 10^4$
- $1 \le$ number of nodes in each list $\le 50$
- $1 \le$ `node->data` $\le 5 \times 10^5$

**Expected complexities:** Time $O(n \cdot m \cdot \log n)$, auxiliary space $O(n)$, where `m` is the length of a vertical list.

## Solution approach

### Intuition

This is a **k-way merge**: there are `n` sorted vertical lists, and we want one sorted list containing all their nodes. At any moment the next node of the answer must be the smallest node among the current fronts of the `n` lists — every node behind a front is at least as large as that front, because each list is sorted.

A min-heap keyed on `data` gives us that smallest front in $O(\log n)$. When a node is taken from the heap, the only new candidate it creates is the node directly below it (`node->bottom`), so we push that one in its place. The heap therefore never holds more than one node per list.

The usual alternative — recursively merging the last two lists, then the result with the one before, and so on — is shorter to write, but the growing merged list is walked again for every one of the `n` lists, which is $O(N \cdot n)$ in total.

### Algorithm

1. Walk the top row through `next` and push every list head into the min-heap `pq`.
2. Keep a stack-allocated `dummy` node and a pointer `tail` to the last node of the answer.
3. While `pq` is not empty:
   - Pop the smallest node `node`.
   - If `node->bottom` exists, push it: it is the new front of that list.
   - Clear `node->next` (the answer must use only `bottom` links), attach it with `tail->bottom = node`, and move `tail` to it.
4. Return `dummy.bottom`.

The last node popped had no `bottom` (otherwise its successor would still be in the heap), so the answer is correctly terminated without extra work.

### Walkthrough

On Example 1 the heap starts with the four heads `{5, 10, 19, 28}`:

| Pop | Push | Heap afterwards | Answer so far |
| --- | --- | --- | --- |
| 5 | 7 | 7, 10, 19, 28 | 5 |
| 7 | 8 | 8, 10, 19, 28 | 5 7 |
| 8 | — | 10, 19, 28 | 5 7 8 |
| 10 | 20 | 19, 20, 28 | 5 7 8 10 |
| 19 | 22 | 20, 22, 28 | 5 7 8 10 19 |
| 20 | — | 22, 28 | ... 19 20 |
| 22 | — | 28 | ... 20 22 |
| 28 | 40 | 40 | ... 22 28 |
| 40 | 45 | 45 | ... 28 40 |
| 45 | — | (empty) | ... 40 45 |

### Complexity

- **Time:** $O(N \log n)$, where $N$ is the total number of nodes and $n$ the number of vertical lists — every node is pushed and popped exactly once, and the heap holds at most $n$ nodes. With $N \le n \cdot m$ this is within the expected $O(n \cdot m \cdot \log n)$.
- **Space:** $O(n)$ — the heap holds at most one node per list; the answer reuses the existing nodes.

### Edge cases

- **Empty input (`n = 0`):** nothing is pushed, and `dummy.bottom` is `nullptr`.
- **A single list:** its nodes come out of the heap one by one in their original order.
- **Equal values in different lists:** either order is a valid sorted output; the heap simply picks one.

## Code

```cpp
class Solution {
  public:
    Node* flatten(Node* head) {
        auto greaterData = [](Node* a, Node* b) { return a->data > b->data; };
        priority_queue<Node*, vector<Node*>, decltype(greaterData)> pq(greaterData);
        for (Node* list = head; list; list = list->next) pq.push(list);

        Node dummy(0);
        Node* tail = &dummy;
        while (!pq.empty()) {
            Node* node = pq.top();
            pq.pop();
            if (node->bottom) pq.push(node->bottom);
            node->next = nullptr;
            tail->bottom = node;
            tail = node;
        }
        return dummy.bottom;
    }
};
```

```java
class Solution {
    public Node flatten(Node head) {
        PriorityQueue<Node> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.data, b.data));
        for (Node list = head; list != null; list = list.next) pq.add(list);

        Node dummy = new Node(0);
        Node tail = dummy;
        while (!pq.isEmpty()) {
            Node node = pq.poll();
            if (node.bottom != null) pq.add(node.bottom);
            node.next = null;
            tail.bottom = node;
            tail = node;
        }
        return dummy.bottom;
    }
}
```

```python
import heapq


class Solution:
    def flatten(self, head):
        # (data, list index, node): the index breaks ties, since nodes are not comparable.
        pq = []
        i, lst = 0, head
        while lst:
            pq.append((lst.data, i, lst))
            i += 1
            lst = lst.next
        heapq.heapify(pq)

        dummy = Node(0)
        tail = dummy
        while pq:
            _, i, node = heapq.heappop(pq)
            if node.bottom:
                heapq.heappush(pq, (node.bottom.data, i, node.bottom))
            node.next = None
            tail.bottom = node
            tail = node
        return dummy.bottom
```
