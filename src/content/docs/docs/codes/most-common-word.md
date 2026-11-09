---
title: "Most Common Word"
description: "Return the most frequent non-banned word in a paragraph, ignoring case and punctuation, by tokenising once and counting words in a hash map."
source: "https://leetcode.com/problems/most-common-word/"
difficulty: "Easy"
tags: ["Array", "Hash Table", "String", "Counting"]
complexity:
  time: "O(n + b)"
  space: "O(n + b)"
---

## Problem

Given a string `paragraph` and a string array of the banned words `banned`, return *the most frequent word that is not banned*. It is **guaranteed** there is **at least one word** that is not banned, and that the answer is **unique**.

The words in `paragraph` are **case-insensitive** and the answer should be returned in **lowercase**.

**Note** that words can not contain punctuation symbols.

**Example 1:**

```text
Input:  paragraph = "Bob hit a ball, the hit BALL flew far after it was hit.", banned = ["hit"]
Output: "ball"
Explanation:
"hit" occurs 3 times, but it is a banned word.
"ball" occurs twice (and no other word does), so it is the most frequent non-banned word in the paragraph.
Note that words in the paragraph are not case sensitive,
that punctuation is ignored (even if adjacent to words, such as "ball,"),
and that "hit" isn't the answer even though it occurs more because it is banned.
```

**Example 2:**

```text
Input:  paragraph = "a.", banned = []
Output: "a"
```

**Constraints:**

- $1 \le \text{paragraph.length} \le 1000$
- `paragraph` consists of English letters, space `' '`, or one of the symbols: `"!?',;."`.
- $0 \le \text{banned.length} \le 100$
- $1 \le \text{banned[i].length} \le 10$
- `banned[i]` consists of only lowercase English letters.

## Solution approach

### Intuition

A "word" is simply a maximal run of letters: every space or punctuation symbol ends the current word. So one left-to-right scan can cut the paragraph into words, lowercasing letters as it goes so that `"BALL"` and `"ball"` become the same key. Counting those words in a hash map and putting the banned words in a hash set lets us skip banned words in $O(1)$ and pick the most frequent remaining one. Uniqueness of the answer means ties never need breaking.

### Algorithm

1. Put every banned word into the set `ban`.
2. Scan `paragraph`, appending each letter (lowercased) to `word`. When a non-letter is met, or the paragraph ends, the current `word` is complete: if it is non-empty and not in `ban`, increment `count[word]` and update `best` / `bestCount` if this word's count is now larger than `bestCount`. Then clear `word`.
3. Return `best`.

Looping one position past the end (`i <= paragraph.size()`) treats the end of the string as one more separator, so a final word with no trailing punctuation (like `"a"` in `"... a"`) is still counted.

### Complexity

- **Time:** $O(n + b)$ — `n` is `paragraph.length` and `b` the total length of `banned`; each character is appended and hashed a constant number of times.
- **Space:** $O(n + b)$ — the counts map and the banned set.

### Edge cases

- **Punctuation attached to words** (`"ball,"`, `"hit."`): the symbol ends the word and is never part of it.
- **Several separators in a row** (`", "`): they produce empty `word`s, which are ignored.
- **Mixed case** (`"Bob"`, `"BALL"`): letters are lowercased before counting, so the answer is returned in lowercase.

## Code

```cpp
class Solution {
   public:
    string mostCommonWord(string paragraph, vector<string>& banned) {
        unordered_set<string> ban(banned.begin(), banned.end());
        unordered_map<string, int> count;
        string word, best;
        int bestCount = 0;
        for (size_t i = 0; i <= paragraph.size(); i++) {
            if (i < paragraph.size() && isalpha((unsigned char)paragraph[i])) {
                word += tolower((unsigned char)paragraph[i]);
                continue;
            }
            if (!word.empty() && !ban.count(word) && ++count[word] > bestCount) {
                bestCount = count[word];
                best = word;
            }
            word.clear();
        }
        return best;
    }
};
```

```java
class Solution {
    public String mostCommonWord(String paragraph, String[] banned) {
        Set<String> ban = new HashSet<>(Arrays.asList(banned));
        Map<String, Integer> count = new HashMap<>();
        StringBuilder word = new StringBuilder();
        String best = "";
        int bestCount = 0;
        for (int i = 0; i <= paragraph.length(); i++) {
            char c = i < paragraph.length() ? paragraph.charAt(i) : ' ';
            if (Character.isLetter(c)) {
                word.append(Character.toLowerCase(c));
                continue;
            }
            if (word.length() > 0) {
                String w = word.toString();
                if (!ban.contains(w)) {
                    int cnt = count.merge(w, 1, Integer::sum);
                    if (cnt > bestCount) {
                        bestCount = cnt;
                        best = w;
                    }
                }
                word.setLength(0);
            }
        }
        return best;
    }
}
```

```python
import re
from collections import Counter


class Solution:
    def mostCommonWord(self, paragraph: str, banned: list[str]) -> str:
        ban = set(banned)
        count = Counter(w for w in re.findall(r"[a-z]+", paragraph.lower()) if w not in ban)
        return count.most_common(1)[0][0]
```
