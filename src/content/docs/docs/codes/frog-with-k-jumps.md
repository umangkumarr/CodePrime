---
title: "Frog with k jumps"
description: "Find the minimum total cost for a frog to reach the last stone when each jump may skip up to K stones, using a one-dimensional DP over the stones."
source: "https://atcoder.jp/contests/dp/tasks/dp_b"
difficulty: "Easy"
tags: ["Dynamic Programming"]
complexity:
  time: "O(N \\cdot K)"
  space: "O(N)"
---

## Problem

There are $N$ stones, numbered $1, 2, \ldots, N$. For each $i$ ($1 \le i \le N$), the height of Stone $i$ is $h_i$.

There is a frog who is initially on Stone $1$. He will repeat the following action some number of times to reach Stone $N$:

- If the frog is currently on Stone $i$, jump to one of the following: Stone $i + 1, i + 2, \ldots, i + K$. Here, a cost of $|h_i - h_j|$ is incurred, where $j$ is the stone to land on.

Find the minimum possible total cost incurred before the frog reaches Stone $N$.

**Input** is given from standard input in the format

```text
N K
h_1 h_2 ... h_N
```

**Output:** print the minimum possible total cost incurred.

**Example 1:**

```text
Input:
5 3
10 30 40 50 20
Output: 30
Explanation: If we follow the path 1 → 2 → 5, the total cost incurred would be
|10 - 30| + |30 - 20| = 30.
```

**Example 2:**

```text
Input:
3 1
10 20 10
Output: 20
Explanation: If we follow the path 1 → 2 → 3, the total cost incurred would be
|10 - 20| + |20 - 10| = 20.
```

**Example 3:**

```text
Input:
2 100
10 10
Output: 0
Explanation: If we follow the path 1 → 2, the total cost incurred would be |10 - 10| = 0.
```

**Example 4:**

```text
Input:
10 4
40 10 20 70 80 10 20 70 80 60
Output: 40
Explanation: If we follow the path 1 → 4 → 8 → 10, the total cost incurred would be
|40 - 70| + |70 - 70| + |70 - 60| = 40.
```

**Constraints:**

- All values in input are integers.
- $2 \le N \le 10^5$
- $1 \le K \le 100$
- $1 \le h_i \le 10^4$

## Solution approach

### Intuition

Think about the **last** jump of an optimal route to stone `i`. It started on one of the `K` stones before it, say stone `j`. Whatever the frog did before reaching `j`, it should have done it as cheaply as possible — any cheaper way to reach `j` would make the whole route cheaper. So, with `dp[j]` the minimum cost to reach stone `j`,

$$
dp[i] = \min_{\max(0,\, i-K) \le j < i} \big( dp[j] + |h_i - h_j| \big), \qquad dp[0] = 0.
$$

Every `dp[j]` on the right refers to a stone to the left of `i`, so filling the array from left to right always has the needed values ready. The answer is `dp[N-1]` (stones are 0-indexed in the code).

With $K = 2$ this is the classic "Frog 1" problem; here the window of predecessors is simply wider.

### Algorithm

1. Read `n`, `k` and the heights `h`.
2. Set `dp[0] = 0` and every other entry to `INT_MAX`.
3. For each `i` from `1` to `n - 1`, for each `j` from `max(0, i - k)` to `i - 1`, set `dp[i] = min(dp[i], dp[j] + abs(h[i] - h[j]))`.
4. Print `dp[n - 1]`.

### Walkthrough

Example 1 (`K = 3`, heights `10 30 40 50 20`). Blue is the stone being filled, orange its window of possible predecessors, and green the predecessor that gives the minimum:

![DP for Frog with K jumps on heights 10 30 40 50 20 with K = 3](/img/codes/frog-with-k-jumps/frog-dp/01.webp)

### Complexity

- **Time:** $O(N \cdot K)$ — each stone looks at up to `K` predecessors; at most $10^5 \cdot 100 = 10^7$ steps.
- **Space:** $O(N)$ — the arrays `h` and `dp`.

The largest possible answer is about $(N - 1) \cdot 10^4 \le 10^9$, which fits in an `int`.

### Edge cases

- **`K >= N`** (Example 3): `max(0, i - k)` clamps the window to the stones that exist, so the frog may jump straight to the end.
- **`K = 1`** (Example 2): the window holds a single stone and the frog must visit every stone.

## Code

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> h(n);
    for (int& x : h) cin >> x;

    vector<int> dp(n, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i < n; i++) {
        for (int j = max(0, i - k); j < i; j++) {
            dp[i] = min(dp[i], dp[j] + abs(h[i] - h[j]));
        }
    }
    cout << dp[n - 1] << '\n';
    return 0;
}
```

```java
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StreamTokenizer in = new StreamTokenizer(new BufferedReader(new InputStreamReader(System.in)));
        in.nextToken();
        int n = (int) in.nval;
        in.nextToken();
        int k = (int) in.nval;
        int[] h = new int[n];
        for (int i = 0; i < n; i++) {
            in.nextToken();
            h[i] = (int) in.nval;
        }

        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i < n; i++) {
            for (int j = Math.max(0, i - k); j < i; j++) {
                dp[i] = Math.min(dp[i], dp[j] + Math.abs(h[i] - h[j]));
            }
        }
        System.out.println(dp[n - 1]);
    }
}
```

```python
import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, k = int(data[0]), int(data[1])
    h = list(map(int, data[2:2 + n]))

    dp = [0] * n
    for i in range(1, n):
        lo, hi = max(0, i - k), h[i]
        dp[i] = min([d + abs(hi - x) for d, x in zip(dp[lo:i], h[lo:i])])
    print(dp[n - 1])


main()
```
