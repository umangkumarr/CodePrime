---
sidebar_position : 18
tags: [Hash Table, Linked List, Design, Doubly-Linked List]
---

# LRU Cache

## [Problem](https://leetcode.com/problems/lru-cache/)

<p>Design a data structure that follows the constraints of a <strong><a href="https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU" target="_blank">Least Recently Used (LRU) cache</a></strong>.</p>

<p>Implement the <code>LRUCache</code> class:</p>

<ul>
	<li><code>LRUCache(int capacity)</code> Initialize the LRU cache with <strong>positive</strong> size <code>capacity</code>.</li>
	<li><code>int get(int key)</code> Return the value of the <code>key</code> if the key exists, otherwise return <code>-1</code>.</li>
	<li><code>void put(int key, int value)</code>&nbsp;Update the value of the <code>key</code> if the <code>key</code> exists. Otherwise, add the <code>key-value</code> pair to the cache. If the number of keys exceeds the <code>capacity</code> from this operation, <strong>evict</strong> the least recently used key.</li>
</ul>

<p>The functions&nbsp;<code data-stringify-type="code">get</code>&nbsp;and&nbsp;<code data-stringify-type="code">put</code>&nbsp;must each run in <code>O(1)</code> average time complexity.</p>

## Solution Approach

Expected Time complexity: $O(logn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
