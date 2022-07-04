---
sidebar_position : 154
tags: [Hash Table, Depth-First Search, Breadth-First Search, Graph]
---

# Clone Graph

## [Problem](https://leetcode.com/problems/clone-graph/)

<p>Given a reference of a node in a <strong><a href="https://en.wikipedia.org/wiki/Connectivity_(graph_theory)#Connected_graph" target="_blank">connected</a></strong> undirected graph.</p>

<p>Return a <a href="https://en.wikipedia.org/wiki/Object_copying#Deep_copy" target="_blank"><strong>deep copy</strong></a> (clone) of the graph.</p>

<p>Each node in the graph contains a value (<code>int</code>) and a list (<code>List[Node]</code>) of its neighbors.</p>

```
class Node {
    public int val;
    public List&lt;Node&gt; neighbors;
}
```

<p>&nbsp;</p>

<p><strong>Test case format:</strong></p>

<p>For simplicity, each node&#39;s value is the same as the node&#39;s index (1-indexed). For example, the first node with <code>val == 1</code>, the second node with <code>val == 2</code>, and so on. The graph is represented in the test case using an adjacency list.</p>

<p><b>An adjacency list</b> is a collection of unordered <b>lists</b> used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.</p>

<p>The given node will always be the first node with <code>val = 1</code>. You must return the <strong>copy of the given node</strong> as a reference to the cloned graph.</p>

## Solution Approach

Expected Time complexity: $O(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<details><summary>Click - to see solution code</summary>

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
class Solution {
   public:
    map<Node*, Node*> nodes;
    map<Node*, int> vis;

    void traverse(Node* root) {
        if (vis.find(root) != vis.end()) return;
        vis[root] = 1;
        Node* newNode = new Node(root->val);
        nodes[root] = newNode;
        for (auto nbr : root->neighbors) {
            traverse(nbr);
        }
    }

    Node* cloneGraph(Node* node) {
        if (!node) return NULL;
        traverse(node);
        for (auto nde : nodes) {
            for (auto nbr : nde.first->neighbors) {
                nde.second->neighbors.push_back(nodes[nbr]);
            }
        }
        return nodes[node];
    }
};

```
</TabItem>
</Tabs>

</details>
