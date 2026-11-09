---
title: "Group Anagrams"
description: "Group strings that are anagrams of each other by hashing each word under a canonical key, its letters sorted with a counting sort."
source: "https://leetcode.com/problems/group-anagrams/"
difficulty: "Medium"
tags: ["Array", "Hash Table", "String", "Sorting"]
complexity:
  time: "O(n \\cdot L)"
  space: "O(n \\cdot L)"
---

## Problem

Given an array of strings `strs`, group the **anagrams** together. You can return the answer in **any order**.

An **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

**Example 1:**

```text
Input:  strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
Explanation:
- There is no string in strs that can be rearranged to form "bat".
- The strings "nat" and "tan" are anagrams as they can be rearranged to form each other.
- The strings "ate", "eat", and "tea" are anagrams as they can be rearranged to form each other.
```

**Example 2:**

```text
Input:  strs = [""]
Output: [[""]]
```

**Example 3:**

```text
Input:  strs = ["a"]
Output: [["a"]]
```

**Constraints:**

- $1 \le$ `strs.length` $\le 10^4$
- $0 \le$ `strs[i].length` $\le 100$
- `strs[i]` consists of lowercase English letters.

## Solution approach

### Intuition

Two words are anagrams exactly when they contain the same letters with the same multiplicities. Sorting a word's letters erases their order and keeps only those multiplicities, so **anagrams have the same sorted form, and non-anagrams have different ones**. The sorted form is therefore a perfect key: put every word into a hash map bucket under its key, and each bucket is one group.

Sorting each word with a comparison sort costs $O(L \log L)$. Because the alphabet has only 26 letters, a **counting sort** produces the same sorted key in $O(L + 26)$: count each letter, then write `'a'` `cnt[0]` times, `'b'` `cnt[1]` times, and so on.

### Algorithm

1. For each word `s` in `strs`, build `sortedKey(s)`: count the letters into `cnt[26]`, then append each letter as many times as it occurs, in alphabetical order.
2. Append `s` to `groups[key]`, where `groups` is a hash map from key to the list of words.
3. Move every bucket of `groups` into `ans` and return it.

### Walkthrough

For Example 1 the keys are:

| Word | Key | Bucket |
| --- | --- | --- |
| `eat` | `aet` | `aet → [eat]` |
| `tea` | `aet` | `aet → [eat, tea]` |
| `tan` | `ant` | `ant → [tan]` |
| `ate` | `aet` | `aet → [eat, tea, ate]` |
| `nat` | `ant` | `ant → [tan, nat]` |
| `bat` | `abt` | `abt → [bat]` |

The three buckets are the three groups (in whatever order the hash map iterates them, which the problem allows).

### Complexity

- **Time:** $O(n \cdot L)$ on average, where $n$ is the number of words and $L$ the maximum length — building a key is $O(L + 26)$, and hashing and comparing it is $O(L)$.
- **Space:** $O(n \cdot L)$ — the map stores every key and every word.

### Edge cases

- **Empty strings** (Example 2): all of them get the key `""` and form one group.
- **Repeated identical words** are anagrams of each other, so they land in the same bucket.
- **A word with no anagram partner** (like `"bat"`) forms a group of size one.

## Code

```cpp
class Solution {
  public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) groups[sortedKey(s)].push_back(s);

        vector<vector<string>> ans;
        ans.reserve(groups.size());
        for (auto& [key, words] : groups) ans.push_back(move(words));
        return ans;
    }

  private:
    // Counting sort over 'a'..'z': the letters of s in sorted order, in O(L + 26).
    static string sortedKey(const string& s) {
        int cnt[26] = {};
        for (char c : s) cnt[c - 'a']++;
        string key;
        key.reserve(s.size());
        for (int i = 0; i < 26; i++) key.append(cnt[i], char('a' + i));
        return key;
    }
};
```

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) groups.computeIfAbsent(sortedKey(s), key -> new ArrayList<>()).add(s);
        return new ArrayList<>(groups.values());
    }

    // Counting sort over 'a'..'z': the letters of s in sorted order, in O(L + 26).
    private static String sortedKey(String s) {
        int[] cnt = new int[26];
        for (int i = 0; i < s.length(); i++) cnt[s.charAt(i) - 'a']++;
        char[] key = new char[s.length()];
        int pos = 0;
        for (int i = 0; i < 26; i++) {
            for (int c = 0; c < cnt[i]; c++) key[pos++] = (char) ('a' + i);
        }
        return new String(key);
    }
}
```

```python
from collections import defaultdict


class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
        for s in strs:
            groups[self.sortedKey(s)].append(s)
        return list(groups.values())

    # Counting sort over 'a'..'z': the letters of s in sorted order, in O(L + 26).
    @staticmethod
    def sortedKey(s: str) -> str:
        cnt = [0] * 26
        for ch in s:
            cnt[ord(ch) - 97] += 1
        return ''.join(chr(97 + i) * c for i, c in enumerate(cnt) if c)
```
