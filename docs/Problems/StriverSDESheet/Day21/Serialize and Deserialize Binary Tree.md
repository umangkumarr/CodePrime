---
sidebar_position : 8
tags: [Tree, Breadth-First Search, Binary Tree]
---

# Serialize and Deserialize Binary Tree

## Problem Link
https://leetcode.com/problems/serialize-and-deserialize-binary-tree/

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
