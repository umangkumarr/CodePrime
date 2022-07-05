---
displayed_sidebar: null
sidebar_position : 140
tags: [String, Tree, Depth-First Search, Breadth-First Search, Design, Binary Tree]
---

# Serialize and Deserialize Binary Tree

## [Problem](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

<p>Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.</p>

<p>Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.</p>

<p><strong>Clarification:</strong> The input/output format is the same as <a href="/faq/#binary-tree" target="_blank">how LeetCode serializes a binary tree</a>. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
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
</TabItem>
</Tabs>

</details>
