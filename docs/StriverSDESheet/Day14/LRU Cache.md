---
sidebar_position : 2
tags: [Stack, Hash Map, Doubly-Linked List]
---

# LRU Cache

## Problem Link
https://leetcode.com/problems/lru-cache/

## Solution Approach

Expected Time complexity: $O(n)$

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
