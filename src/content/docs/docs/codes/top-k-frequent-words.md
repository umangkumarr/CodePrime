---
title: "Top K Frequent Words"
description: "Return the k most frequent words, ties broken alphabetically, in O(n log k) time by keeping the k best words in a min-heap ordered by (frequency, word)."
source: "https://leetcode.com/problems/top-k-frequent-words/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "String", "Trie", "Sorting", "Heap (Priority Queue)", "Bucket Sort", "Counting"]
complexity:
  time: "O(n \\log k)"
  space: "O(n)"
---

## Problem

Given an array of strings `words` and an integer `k`, return *the* `k` *most frequent strings*.

Return the answer **sorted** by **the frequency** from highest to lowest. Sort the words with the same frequency by their **lexicographical order**.

**Example 1:**

```text
Input:  words = ["i","love","leetcode","i","love","coding"], k = 2
Output: ["i","love"]
Explanation: "i" and "love" are the two most frequent words.
Note that "i" comes before "love" due to a lower alphabetical order.
```

**Example 2:**

```text
Input:  words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4
Output: ["the","is","sunny","day"]
Explanation: "the", "is", "sunny" and "day" are the four most frequent words, with the number of occurrence being 4, 3, 2 and 1 respectively.
```

**Constraints:**

- $1 \le words.length \le 500$
- $1 \le words[i].length \le 10$
- `words[i]` consists of lowercase English letters.
- `k` is in the range `[1, The number of unique words[i]]`

**Follow-up:** Could you solve it in $O(n \log k)$ time and $O(n)$ extra space?

## Solution approach

### Intuition

Count the words with a hash map. The answer order is a single ranking: word `a` **beats** word `b` if it is more frequent, or equally frequent and alphabetically smaller. Sorting all `m` distinct words by this rule costs $O(m \log m)$; the follow-up asks for $O(n \log k)$.

To keep only the `k` best words, use a **min-heap of size `k`** whose top is the *worst* of the words kept so far. Push each distinct word; whenever the heap grows to `k + 1`, pop its top. A popped word is beaten by `k` other words, so it can never be in the answer. After all words are processed the heap holds exactly the top `k`, and popping it yields them from worst to best — reversing that gives the required order.

The comparator does the tie-breaking: with `better(a, b)` meaning "`a` beats `b`", a `priority_queue` built on `better` keeps the element that beats nobody — the worst — on top.

### Algorithm

1. Count `freq[w]` for every word.
2. For each `(word, count)` in `freq`: push it into `heap`; if `heap.size() > k`, pop.
3. Pop the heap into `ans` (worst first), then reverse `ans`.

### Walkthrough

Example 2 with `k = 4`: `freq = {the: 4, is: 3, sunny: 2, day: 1}`. Whatever order the map yields, the heap never exceeds four entries and nothing is popped, because there are exactly four distinct words. Popping gives `day, sunny, is, the`; reversed, `["the","is","sunny","day"]`.

For Example 1 with `k = 2`, `freq = {i: 2, love: 2, leetcode: 1, coding: 1}`. Each time a third word enters, the top is the worst word in the heap — a frequency-1 word, or between equal frequencies the alphabetically **larger** one — so both frequency-1 words are popped, and among `i` and `love` the heap returns `love` before `i`. Reversed: `["i","love"]`.

### Complexity

Let `n` be the number of words and `m` the number of distinct words.

- **Time:** $O(n \log k)$ — counting is $O(n)$ (word length is at most 10), and each of the `m <= n` pushes and pops costs $O(\log k)$.
- **Space:** $O(n)$ — the hash map holds `m` words; the heap and the answer hold at most `k + 1`.

### Edge cases

- **Ties at the cut-off:** the comparator ranks equal counts alphabetically, so the alphabetically larger word is popped first, as required.
- **`k` equals the number of distinct words:** nothing is ever popped during insertion; the heap simply sorts every word.

## Code

```cpp title="C++"
class Solution {
   public:
    vector<string> topKFrequent(vector<string>& words, int k) {
        unordered_map<string, int> freq;
        for (const string& w : words) freq[w]++;

        // better(a, b): a ranks above b. The heap's top is therefore the worst word kept.
        auto better = [](const pair<int, string>& a, const pair<int, string>& b) {
            return a.first != b.first ? a.first > b.first : a.second < b.second;
        };
        priority_queue<pair<int, string>, vector<pair<int, string>>, decltype(better)> heap(better);

        for (auto& [word, count] : freq) {
            heap.push({count, word});
            if ((int)heap.size() > k) heap.pop();
        }

        vector<string> ans;
        while (!heap.empty()) {
            ans.push_back(heap.top().second);
            heap.pop();
        }
        reverse(ans.begin(), ans.end());
        return ans;
    }
};
```
