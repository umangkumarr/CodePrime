---
displayed_sidebar: null
sidebar_position : 178
tags: [Hash Table, String, Design, Trie]
---

# Implement Trie (Prefix Tree)

## [Problem](https://leetcode.com/problems/implement-trie-prefix-tree/)

<p>A <a href="https://en.wikipedia.org/wiki/Trie" target="_blank"><strong>trie</strong></a> (pronounced as &quot;try&quot;) or <strong>prefix tree</strong> is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.</p>

<p>Implement the Trie class:</p>

<ul>
	<li><code>Trie()</code> Initializes the trie object.</li>
	<li><code>void insert(String word)</code> Inserts the string <code>word</code> into the trie.</li>
	<li><code>boolean search(String word)</code> Returns <code>true</code> if the string <code>word</code> is in the trie (i.e., was inserted before), and <code>false</code> otherwise.</li>
	<li><code>boolean startsWith(String prefix)</code> Returns <code>true</code> if there is a previously inserted string <code>word</code> that has the prefix <code>prefix</code>, and <code>false</code> otherwise.</li>
</ul>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
