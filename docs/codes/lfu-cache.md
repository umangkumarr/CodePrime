---
sidebar_position : 84
tags: [Hash Table, Linked List, Design, Doubly-Linked List]
---

# LFU Cache

## [Problem](https://leetcode.com/problems/lfu-cache/)

<p>Design and implement a data structure for a <a href="https://en.wikipedia.org/wiki/Least_frequently_used" target="_blank">Least Frequently Used (LFU)</a> cache.</p>

<p>Implement the <code>LFUCache</code> class:</p>

<ul>
	<li><code>LFUCache(int capacity)</code> Initializes the object with the <code>capacity</code> of the data structure.</li>
	<li><code>int get(int key)</code> Gets the value of the <code>key</code> if the <code>key</code> exists in the cache. Otherwise, returns <code>-1</code>.</li>
	<li><code>void put(int key, int value)</code> Update the value of the <code>key</code> if present, or inserts the <code>key</code> if not already present. When the cache reaches its <code>capacity</code>, it should invalidate and remove the <strong>least frequently used</strong> key before inserting a new item. For this problem, when there is a <strong>tie</strong> (i.e., two or more keys with the same frequency), the <strong>least recently used</strong> <code>key</code> would be invalidated.</li>
</ul>

<p>To determine the least frequently used key, a <strong>use counter</strong> is maintained for each key in the cache. The key with the smallest <strong>use counter</strong> is the least frequently used key.</p>

<p>When a key is first inserted into the cache, its <strong>use counter</strong> is set to <code>1</code> (due to the <code>put</code> operation). The <strong>use counter</strong> for a key in the cache is incremented either a <code>get</code> or <code>put</code> operation is called on it.</p>

<p>The functions&nbsp;<code data-stringify-type="code">get</code>&nbsp;and&nbsp;<code data-stringify-type="code">put</code>&nbsp;must each run in <code>O(1)</code> average time complexity.</p>

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
