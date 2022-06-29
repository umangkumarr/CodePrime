---
sidebar_position : 3
tags: [Stack, Hash Map, Doubly-Linked List, Linked List]
---

# LFU Cache

## Problem Link
https://leetcode.com/problems/lfu-cache/

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
struct Node {
    int key, value, freq;
    Node *next;
    Node *prev;
    Node(int k, int v, int f) {
        key = k, value = v, freq = f;
        next = prev = NULL;
    }
};

struct dlist {
    Node *head, *tail;
    int size;

    dlist() {
        head = new Node(-1, -1, 0);
        tail = new Node(-1, -1, 0);
        head->next = tail;
        tail->prev = head;
        size = 0;
    }

    Node *addNode(int k, int v, int f) {
        size++;
        Node *newNode = new Node(k, v, f);
        newNode->next = head->next;
        head->next->prev = newNode;
        newNode->prev = head;
        head->next = newNode;
        return newNode;
    }

    void delNode(Node *&node) {
        size--;
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    int empty() { return size == 0; }
};

class LFUCache {
    int cap, cnt, mf;
    map<int, Node *> mp;
    map<int, dlist *> fmap;

   public:
    LFUCache(int capacity) {
        cap = capacity;
        cnt = 0;
        mf = 0;
    }

    int get(int key) {
        if (mp.find(key) == mp.end()) return -1;
        Node *ptr = mp[key];
        fmap[ptr->freq]->delNode(ptr);
        cnt--;
        if (fmap[ptr->freq]->empty()) {
            if (mf == ptr->freq) mf = ptr->freq + 1;
            fmap.erase(ptr->freq);
        }

        if (fmap.find(ptr->freq + 1) != fmap.end()) {
            Node *ptrr =
                fmap[ptr->freq + 1]->addNode(key, ptr->value, ptr->freq + 1);
            mp[key] = ptrr;
            cnt++;
        } else {
            cnt++;
            dlist *ptrr = new dlist();
            fmap[ptr->freq + 1] = ptrr;
            Node *node =
                fmap[ptr->freq + 1]->addNode(key, ptr->value, ptr->freq + 1);
            mp[key] = node;
        }

        return ptr->value;
    }

    void put(int key, int value) {
        if (cap == 0) return;
        if (mp.find(key) != mp.end()) {
            Node *ptr = mp[key];
            fmap[ptr->freq]->delNode(ptr);
            if (fmap[ptr->freq]->empty()) {
                if (mf == ptr->freq) mf = ptr->freq + 1;
                fmap.erase(ptr->freq);
            }
            if (fmap.find(ptr->freq + 1) != fmap.end()) {
                Node *node =
                    fmap[ptr->freq + 1]->addNode(key, value, ptr->freq + 1);
                mp[key] = node;
            } else {
                dlist *ptrr = new dlist();
                fmap[ptr->freq + 1] = ptrr;
                Node *node =
                    fmap[ptr->freq + 1]->addNode(key, value, ptr->freq + 1);
                mp[key] = node;
            }
            return;
        }

        if (cnt == cap) {
            Node *ptr = fmap[mf]->tail->prev;
            fmap[mf]->delNode(ptr);
            cnt--;
            if (fmap[mf]->empty()) {
                fmap.erase(mf);
            }
            mp.erase(ptr->key);
        }

        mf = 0;
        if (fmap.find(mf) != fmap.end()) {
            Node *ptr = fmap[mf]->addNode(key, value, mf);
            mp[key] = ptr;
            cnt++;
            return;
        }

        cnt++;
        dlist *ptr = new dlist();
        fmap[mf] = ptr;
        Node *node = fmap[mf]->addNode(key, value, mf);
        mp[key] = node;
    }
};

```
</TabItem>
</Tabs>

</details>
