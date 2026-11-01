---
title: "Implement a Queue using array"
description: "Implement a Queue using array"
source: "https://bit.ly/3HsAmy9"
tags: ["Queue", "Array"]
complexity:
  time: "O(1)"
  space: "O(n)"
---

## Problem

Implement a Queue using array

## Solution approach

### Intuition

A queue removes elements in the order they were added. This code implements it as a singly linked list: new elements join at the `tail`, and elements leave from the `head`. Keeping a pointer to both ends makes every operation constant time, and the queue grows as needed without a fixed capacity.

### Algorithm

1. `enqueue(data)` creates a `Node`. If the queue is empty, it becomes both `head` and `tail`; otherwise it is linked after `tail` and becomes the new `tail`.
2. `dequeue()` returns `-1` if the queue is empty. Otherwise it saves `head`, moves `head` to `head->next`, resets `tail` to `NULL` if the queue became empty, frees the old node, and returns its `data`.
3. `front()` returns `head->data`, or `-1` if the queue is empty.
4. `isEmpty()` checks that both `head` and `tail` are `NULL`.

### Complexity

- **Time:** $O(1)$ per operation — each one changes only a couple of pointers.
- **Space:** $O(n)$ — one node per element in the queue.

### Edge cases

- **Removing the last element** also resets `tail`, so the next `enqueue` correctly starts a new list.

## Code

```cpp title="C++"
class Node {
   public:
    int data;
    Node *next;
    Node(int data) {
        this->data = data;
        this->next = NULL;
    }
};
class Queue {
   public:
    Node *head, *tail;
    Queue() {
        head = NULL;
        tail = NULL;
    }

    bool isEmpty() { return (head == NULL && tail == NULL); }

    void enqueue(int data) {
        Node *newNode = new Node(data);
        if (head == NULL) {
            head = newNode;
            tail = newNode;
        } else {
            tail->next = newNode;
            tail = newNode;
        }
    }

    int dequeue() {
        if (head == NULL) return -1;
        Node *temp = head;
        head = head->next;
        if (head == NULL) tail = NULL;
        int x = temp->data;
        delete (temp);
        return x;
    }

    int front() {
        if (head == NULL) return -1;
        return (head->data);
    }
};  
```
