---
title: "Top K Frequent Words"
description: "Given an array of strings words and an integer k, return the k most frequent strings. Return the answer sorted by the frequency from highest to lowest.…"
source: "https://leetcode.com/problems/top-k-frequent-words/"
tags: ["Hash Table", "String", "Trie", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting"]
complexity:
  time: "O(n + m \\log k)"
  space: "O(m + k)"
---

## Problem

<p>Given an array of strings <code>words</code> and an integer <code>k</code>, return <em>the </em><code>k</code><em> most frequent strings</em>.</p>

<p>Return the answer <strong>sorted</strong> by <strong>the frequency</strong> from highest to lowest. Sort the words with the same frequency by their <strong>lexicographical order</strong>.</p>

## Solution approach

### Intuition

Count the frequency of every word, then keep only the best `k` words in a heap of size `k`. The comparator `comp` orders words so that the heap's top is the **worst** of the kept words: the one with the lowest frequency, or, on a tie, the lexicographically largest. Whenever the heap grows beyond `k`, popping the top throws out the weakest candidate, so the heap always holds the current top `k`.

### Algorithm

1. Count each word's frequency in `freq`.
2. For every `(word, count)` in `freq`, push it into `pq`; if `pq.size() > k`, pop the top.
3. Pop the remaining `k` entries one by one. They come out from worst to best, so insert each at the front of `output`.
4. Return `output`, which lists the most frequent word first, with ties in alphabetical order.

### Complexity

- **Time:** $O(n + m \log k)$ — counting is linear in the number of words $n$, and each of the $m$ distinct words costs $O(\log k)$ in the heap; inserting at the front of `output` adds $O(k^2)$, which is small (string comparisons add a factor of the word length).
- **Space:** $O(m + k)$ — the frequency map and the heap.

### Edge cases

- **Equal frequencies**: the tie-break `a.first < b.first` inside `comp` ensures alphabetically smaller words are kept and listed first.

## Code

```cpp title="C++"
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
