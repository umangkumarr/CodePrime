---
title: "Implement Trie (Prefix Tree)"
description: "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are…"
source: "https://leetcode.com/problems/implement-trie-prefix-tree/"
tags: ["Hash Table", "String", "Design", "Trie"]
complexity:
  time: "O(L)"
  space: "O(T)"
---

## Problem

<p>A <a href="https://en.wikipedia.org/wiki/Trie" target="_blank"><strong>trie</strong></a> (pronounced as &quot;try&quot;) or <strong>prefix tree</strong> is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.</p>

<p>Implement the Trie class:</p>

<ul>
	<li><code>Trie()</code> Initializes the trie object.</li>
	<li><code>void insert(String word)</code> Inserts the string <code>word</code> into the trie.</li>
	<li><code>boolean search(String word)</code> Returns <code>true</code> if the string <code>word</code> is in the trie (i.e., was inserted before), and <code>false</code> otherwise.</li>
	<li><code>boolean startsWith(String prefix)</code> Returns <code>true</code> if there is a previously inserted string <code>word</code> that has the prefix <code>prefix</code>, and <code>false</code> otherwise.</li>
</ul>

## Solution approach

### Intuition

A trie stores words character by character along paths from the root, so words with a common prefix share nodes. Following the characters of a word from the root either reaches a node or gets stuck. A word was inserted exactly when the path ends at a node marked `terminal`. A prefix exists whenever the path exists at all.

Each `Node` keeps its children in an `unordered_map` from character to child.

### Algorithm

1. The constructor creates a dummy `root`.
2. `insert(word)`: walk from `root`; for each character, create the child if `temp->mp` does not have it, then move to it. Mark the final node with `terminal = true`.
3. `search(word)`: walk the same way, returning `false` as soon as a character is missing. At the end, return `temp->terminal`.
4. `startsWith(word)`: the same walk, but return `true` if it completes, whether or not the node is terminal.

### Complexity

- **Time:** $O(L)$ per operation, where $L$ is the word length — one average $O(1)$ hash-map step per character.
- **Space:** $O(T)$, where $T$ is the total number of inserted characters — at most one node per character.

### Edge cases

- **A word that is only a prefix of another** (e.g. search `"app"` after inserting `"apple"`): the path exists, but `terminal` is `false`, so `search` returns `false` while `startsWith` returns `true`.

## Code

```cpp title="C++"
struct Node {
    unordered_map<char, Node*> mp;
    char c;
    bool terminal;
    Node(char val) {
        c = val;
        terminal = false;
    }
};

class Trie {
   public:
    Node* root;

    Trie() { root = new Node('*'); }

    void insert(string word) {
        int n = word.size();
        Node* temp = root;
        for (int i = 0; i < n; i++) {
            if (temp->mp.find(word[i]) == temp->mp.end()) {
                Node* newNode = new Node(word[i]);
                temp->mp[word[i]] = newNode;
                temp = newNode;
            } else
                temp = temp->mp[word[i]];
        }
        temp->terminal = true;
    }

    bool search(string word) {
        Node* temp = root;
        int n = word.size();
        for (int i = 0; i < n; i++) {
            if (temp->mp.find(word[i]) == temp->mp.end()) return false;
            temp = temp->mp[word[i]];
        }
        return temp->terminal;
    }

    bool startsWith(string word) {
        Node* temp = root;
        int n = word.size();
        for (int i = 0; i < n; i++) {
            if (temp->mp.find(word[i]) == temp->mp.end()) return false;
            temp = temp->mp[word[i]];
        }
        return true;
    }
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */

```
