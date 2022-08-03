---
sidebar_position : 2
tags: [Queue, Array]
---

# Implement a Queue using array

## [Problem](https://bit.ly/3HsAmy9)

Implement a Queue using array

## Solution Approach
Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
