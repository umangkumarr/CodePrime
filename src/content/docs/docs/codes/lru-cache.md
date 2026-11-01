---
title: "LRU Cache"
description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(int capacity) Initialize…"
source: "https://leetcode.com/problems/lru-cache/"
tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"]
complexity:
  time: "O(1)"
  space: "O(\\text{capacity})"
---

## Problem

<p>Design a data structure that follows the constraints of a <strong><a href="https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU" target="_blank">Least Recently Used (LRU) cache</a></strong>.</p>

<p>Implement the <code>LRUCache</code> class:</p>

<ul>
	<li><code>LRUCache(int capacity)</code> Initialize the LRU cache with <strong>positive</strong> size <code>capacity</code>.</li>
	<li><code>int get(int key)</code> Return the value of the <code>key</code> if the key exists, otherwise return <code>-1</code>.</li>
	<li><code>void put(int key, int value)</code>&nbsp;Update the value of the <code>key</code> if the <code>key</code> exists. Otherwise, add the <code>key-value</code> pair to the cache. If the number of keys exceeds the <code>capacity</code> from this operation, <strong>evict</strong> the least recently used key.</li>
</ul>

<p>The functions&nbsp;<code data-stringify-type="code">get</code>&nbsp;and&nbsp;<code data-stringify-type="code">put</code>&nbsp;must each run in <code>O(1)</code> average time complexity.</p>

## Solution approach

### Intuition

An LRU cache must find a key's value quickly and also know which key was used least recently. A linked list `lst` keeps keys in recency order (most recent at the front, least recent at the back), and hash maps give $O(1)$ access: `mp` from key to value and `itr` from key to its position in `lst`. With the stored iterator we can unlink a key from the middle of the list in $O(1)$ when it is used again.

### Algorithm

1. `get(key)`: return `-1` if the key is not in `mp`; otherwise call `update(key)` to move it to the front, and return `mp[key]`.
2. `put(key, value)`: if the cache is full (`mp.size() == size`) and the key is new, call `evict()`. Then call `update(key)` and set `mp[key] = value`.
3. `update(key)`: if the key already exists, erase it from `lst` using `itr[key]`; push it to the front and store the new iterator.
4. `evict()`: remove the key at `lst.back()` from `itr`, `mp` and the list.

### Complexity

- **Time:** $O(1)$ on average per `get` and `put` — hash-map lookups plus constant-time list operations.
- **Space:** $O(\text{capacity})$ — each stored key appears once in `lst`, `mp` and `itr`.

### Edge cases

- **Updating an existing key when the cache is full:** no eviction happens, because the key is not new; it just moves to the front with its new value.

## Code

```cpp title="C++"
class LRUCache {
    list<int> lst;
    unordered_map<int, int> mp;
    unordered_map<int, list<int>::iterator> itr;
    int size;

   public:
    LRUCache(int capacity) { this->size = capacity; }

    int get(int key) {
        if (mp.find(key) == mp.end()) return -1;
        update(key);
        return mp[key];
    }

    void put(int key, int value) {
        if (mp.size() == size && mp.find(key) == mp.end()) evict();
        update(key);
        mp[key] = value;
    }

    void update(int key) {
        if (mp.find(key) != mp.end()) lst.erase(itr[key]);
        lst.push_front(key);
        itr[key] = lst.begin();
    }

    void evict() {
        itr.erase(lst.back());
        mp.erase(lst.back());
        lst.pop_back();
    }
};

```
