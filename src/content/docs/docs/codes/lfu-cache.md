---
title: "LFU Cache"
description: "Design and implement a data structure for a Least Frequently Used (LFU) cache. Implement the LFUCache class: LFUCache(int capacity) Initializes the object…"
source: "https://leetcode.com/problems/lfu-cache/"
tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"]
complexity:
  time: "O(\\log n)"
  space: "O(\\text{capacity})"
---

## Problem

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

## Solution approach

### Intuition

An LFU cache evicts the key with the lowest use count, and among those, the least recently used one. Grouping keys **by frequency** makes this cheap: each frequency gets its own doubly linked list ordered by recency (newest at the head), and we track the minimum frequency `mf`. The victim is then always the tail of the list for `mf`.

A second map from key to its list node lets us find, unlink and move any key without scanning.

### Algorithm

1. `dlist` is a doubly linked list with dummy `head` and `tail`; `addNode` inserts at the front and `delNode` unlinks a node. `mp` maps key to `Node`, and `fmap` maps frequency to its `dlist`.
2. `get(key)`: return `-1` if the key is missing. Otherwise unlink its node from `fmap[ptr->freq]`; if that list becomes empty, erase it and, if it was the minimum, set `mf = ptr->freq + 1`. Re-insert the key at the front of `fmap[ptr->freq + 1]` (creating that list if needed), update `mp`, and return the value.
3. `put(key, value)` on an existing key: same promotion as `get`, but the new node stores the new `value`.
4. `put` on a new key: if `cnt == cap`, evict `fmap[mf]->tail->prev`, erase an emptied list, and remove the key from `mp`. Then set `mf = 0` and insert the key with frequency `0` at the front of `fmap[0]`.

### Complexity

- **Time:** $O(\log n)$ per `get` and `put` — `mp` and `fmap` are ordered `map`s; the list operations themselves are $O(1)$.
- **Space:** $O(\text{capacity})$ — at most `cap` live nodes plus one list per distinct frequency.

### Edge cases

- **`capacity` is `0`:** `put` returns immediately and nothing is stored.
- **Tie on frequency:** the tail of `fmap[mf]` is the least recently used key with that count, so it is evicted first.

## Code

```cpp title="C++"
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
