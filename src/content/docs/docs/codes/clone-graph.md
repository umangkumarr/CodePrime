---
title: "Clone Graph"
description: "Deep-copy a connected undirected graph with a single DFS and a hash map from each original node to its copy, which also stops the walk at cycles."
source: "https://leetcode.com/problems/clone-graph/"
difficulty: "Medium"
tags: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"]
complexity:
  time: "O(V + E)"
  space: "O(V)"
---

## Problem

Given a reference of a node in a **[connected](https://en.wikipedia.org/wiki/Connectivity_(graph_theory)#Connected_graph)** undirected graph.

Return a **[deep copy](https://en.wikipedia.org/wiki/Object_copying#Deep_copy)** (clone) of the graph.

Each node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.

```text
class Node {
    public int val;
    public List<Node> neighbors;
}
```

**Test case format:**

For simplicity, each node's value is the same as the node's index (1-indexed). For example, the first node with `val == 1`, the second node with `val == 2`, and so on. The graph is represented in the test case using an adjacency list.

**An adjacency list** is a collection of unordered **lists** used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.

The given node will always be the first node with `val = 1`. You must return the **copy of the given node** as a reference to the cloned graph.

**Example 1:**

![A 4-node cycle: 1-2, 2-3, 3-4, 4-1](https://assets.leetcode.com/uploads/2019/11/04/133_clone_graph_question.png)

```text
Input:  adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.
1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4).
4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).
```

**Example 2:**

![A single node with no neighbors](https://assets.leetcode.com/uploads/2020/01/07/graph.png)

```text
Input:  adjList = [[]]
Output: [[]]
Explanation: Note that the input contains one empty list. The graph consists of only one node with
val = 1 and it does not have any neighbors.
```

**Example 3:**

```text
Input:  adjList = []
Output: []
Explanation: This an empty graph, it does not have any nodes.
```

**Constraints:**

- The number of nodes in the graph is in the range `[0, 100]`.
- $1 \le$ `Node.val` $\le 100$
- `Node.val` is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The Graph is connected and all nodes can be visited starting from the given node.

## Solution approach

### Intuition

A deep copy needs exactly one new node per original node, and every copied edge must point to a **copy**, never to an original. Both requirements are met by a map `copies` from each original node to its clone:

- the first time a node is reached, create its copy and record it in `copies`;
- every later time (the graph has cycles — an undirected edge alone is a 2-cycle `u → v → u`), return the existing copy instead of making another one.

The crucial detail is the order: the copy is registered in `copies` **before** recursing into the neighbours. When the DFS walks back along an edge to a node that is still being cloned, it finds that node's copy in the map and stops, so the recursion terminates and shared neighbours are not duplicated.

### Algorithm

1. If `node` is null, return null (empty graph).
2. `clone(node, copies)`:
   - If `node` is already in `copies`, return its copy.
   - Otherwise create `copy = new Node(node->val)` and store `copies[node] = copy`.
   - For each `nbr` in `node->neighbors` (in order), append `clone(nbr, copies)` to `copy->neighbors`.
   - Return `copy`.
3. Return `clone(node, copies)` for the given node.

### Walkthrough

The DFS on Example 1. Blue calls create a copy; grey calls find the copy already in the map and return at once:

[![DFS call tree for clone(1) on Example 1: clone(1), clone(2), clone(3) and clone(4) create copies; repeat calls find the copy already made](/img/codes/clone-graph/dfs-calls.png)](/img/codes/clone-graph/dfs-calls.png)

Each copy collects the results of its children in the same order as the original list: `1' → [2', 4']`, `2' → [1', 3']`, `3' → [2', 4']`, `4' → [1', 3']`.

### Complexity

- **Time:** $O(V + E)$ — each node is created once and each adjacency entry (two per undirected edge) triggers one call with an expected $O(1)$ hash lookup.
- **Space:** $O(V)$ — the `copies` map and the recursion stack (at most `V` deep), not counting the cloned graph itself.

### Edge cases

- **Empty graph (`adjList = []`):** `node` is null and null is returned.
- **Single node with no neighbours:** one copy is created and the loop does nothing.
- **Cycles:** stopped by the map lookup, as shown above.

## Code

```cpp
class Solution {
    Node* clone(Node* node, unordered_map<Node*, Node*>& copies) {
        auto it = copies.find(node);
        if (it != copies.end()) return it->second;

        Node* copy = new Node(node->val);
        copies[node] = copy;  // register before recursing so cycles stop here
        for (Node* nbr : node->neighbors) copy->neighbors.push_back(clone(nbr, copies));
        return copy;
    }

   public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        unordered_map<Node*, Node*> copies;
        return clone(node, copies);
    }
};
```

```java
class Solution {
    private Node clone(Node node, Map<Node, Node> copies) {
        Node copy = copies.get(node);
        if (copy != null) return copy;

        copy = new Node(node.val);
        copies.put(node, copy);  // register before recursing so cycles stop here
        for (Node nbr : node.neighbors) copy.neighbors.add(clone(nbr, copies));
        return copy;
    }

    public Node cloneGraph(Node node) {
        if (node == null) return null;
        return clone(node, new HashMap<>());
    }
}
```

```python
class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:
        if not node:
            return None
        copies = {}

        def clone(node):
            if node in copies:
                return copies[node]
            copy = Node(node.val)
            copies[node] = copy  # register before recursing so cycles stop here
            copy.neighbors = [clone(nbr) for nbr in node.neighbors]
            return copy

        return clone(node)
```
