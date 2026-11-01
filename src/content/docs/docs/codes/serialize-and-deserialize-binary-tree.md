---
title: "Serialize and Deserialize Binary Tree"
description: "Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or…"
source: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/"
tags: ["String", "Tree", "Depth-First Search", "Breadth-First Search", "Design", "Binary Tree"]
complexity:
  time: "O(n)"
  space: "O(n)"
---

## Problem

<p>Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.</p>

<p>Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.</p>

<p><strong>Clarification:</strong> The input/output format is the same as <a href= "" target="_blank">how LeetCode serializes a binary tree</a>. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.</p>

## Solution approach

### Intuition

A tree can be written as a nested string, where each node is its value followed by its children wrapped in markers: `L(...)` for the left child and `R(...)` for the right child, with each marker present only if that child exists. For example, a root `1` with children `2` and `3` becomes `1L(2)R(3)`. The parentheses mark exactly where each subtree ends, so a recursive parser can rebuild the same shape.

### Algorithm

1. `serialize` returns `""` for an empty tree. Otherwise `serial` appends `to_string(root->val)`, then `L(` + left subtree + `)` and `R(` + right subtree + `)` for whichever children exist. It also prints the string with `cout`.
2. `deserialize` returns `NULL` for an empty string. Otherwise it stores the string in `d` and calls `deserial(j)` with the shared index `j = 0`.
3. `deserial(i)` reads the number (digits and an optional `-`) starting at `i`, and creates a node from it.
4. If the next character is `'L'`, skip `"L("`, build the left child recursively, then skip `')'`. Do the same for `'R'`. Return the node.

### Complexity

- **Time:** $O(n)$ — each node is written and parsed once, and node values have a bounded number of digits.
- **Space:** $O(n)$ — the serialized string, plus an $O(h)$ recursion stack in both directions.

### Edge cases

- **Negative values:** the parser accepts `'-'` as part of a number, so `-5L(3)` parses correctly.

## Code

```cpp title="C++"
class Codec {
   public:
    string s = "";
    void serial(TreeNode* root) {
        string a = to_string(root->val);
        s += a;
        if (root->left) {
            s += "L(";
            serial(root->left);
            s.push_back(')');
        }
        if (root->right) {
            s += "R(";
            serial(root->right);
            s.push_back(')');
        }
    }

    string serialize(TreeNode* root) {
        if (!root) return "";
        serial(root);
        cout << s << "\n";
        return s;
    }

    string d;
    TreeNode* deserial(int& i) {
        int j = i;
        while ((d[j] >= '0' && d[j] <= '9') || d[j] == '-') j++;
        string num(d.begin() + i, d.begin() + j);
        int val = stoi(num);
        TreeNode* root = new TreeNode(val);
        i = j;
        if (d[i] == 'L') {
            i += 2;
            root->left = deserial(i);
            i++;
        }
        if (d[i] == 'R') {
            i += 2;
            root->right = deserial(i);
            i++;
        }
        return root;
    }

    TreeNode* deserialize(string data) {
        if (data.length() == 0) return NULL;
        this->d = data;
        int j = 0;
        return deserial(j);
    }
};

```
