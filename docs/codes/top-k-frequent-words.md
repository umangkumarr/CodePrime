---
sidebar_position : 10
tags: [Hash Table, String, Trie, Sorting, Heap (Priority Queue), Bucket Sort, Counting]
---

# Top K Frequent Words

## [Problem](https://leetcode.com/problems/top-k-frequent-words/)

<p>Given an array of strings <code>words</code> and an integer <code>k</code>, return <em>the </em><code>k</code><em> most frequent strings</em>.</p>

<p>Return the answer <strong>sorted</strong> by <strong>the frequency</strong> from highest to lowest. Sort the words with the same frequency by their <strong>lexicographical order</strong>.</p>

## Solution Approach

Expected Time complexity: $O(nlogn)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    vector<string> topKFrequent(vector<string>& words, int k) {
        unordered_map<string, int> freq;
        for (auto w : words) {
            freq[w]++;
        }

        auto comp = [&](const pair<string, int>& a,
                        const pair<string, int>& b) {
            return a.second > b.second ||
                   (a.second == b.second && a.first < b.first);
        };
        typedef priority_queue<pair<string, int>, vector<pair<string, int>>,
                               decltype(comp)>
            my_priority_queue_t;
        my_priority_queue_t pq(comp);

        for (auto w : freq) {
            pq.emplace(w.first, w.second);
            if (pq.size() > k) pq.pop();
        }

        vector<string> output;
        while (!pq.empty()) {
            output.insert(output.begin(), pq.top().first);
            pq.pop();
        }
        return output;
    }
};
```
</TabItem>
</Tabs>

</details>
