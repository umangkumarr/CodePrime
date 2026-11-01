---
title: "Clone Graph"
description: "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a…"
source: "https://leetcode.com/problems/clone-graph/"
tags: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"]
complexity:
  time: "O((V + E) \\log V)"
  space: "O(V)"
---

## Problem

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

## Solution approach

### Intuition

A deep copy needs one new node for every original node, and the copied edges must point to the **copies**, not the originals. The code splits this into two passes: first create a copy of every reachable node and remember the original-to-copy mapping, then wire up the neighbours using that mapping.

### Algorithm

1. If `node` is null, return `NULL`.
2. `traverse(node)` runs a DFS. For each node not yet in `vis`, it marks the node, creates `newNode` with the same `val`, stores it in `nodes[root]`, and recurses into every neighbour.
3. For every pair `nde` in `nodes`, append `nodes[nbr]` to the copy's `neighbors` for each original neighbour `nbr`, in the same order.
4. Return `nodes[node]`, the copy of the starting node.

### Complexity

- **Time:** $O((V + E) \log V)$ — every vertex and edge is processed once, and each lookup in the ordered `map` costs $O(\log V)$.
- **Space:** $O(V)$ — for the two maps and the recursion stack, not counting the cloned graph.

### Edge cases

- **Empty graph:** a null `node` returns `NULL` immediately.

## Code

```cpp title="C++"
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
