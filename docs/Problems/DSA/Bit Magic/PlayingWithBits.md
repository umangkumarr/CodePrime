---
sidebar_position: 4
---
# Sets bits from 1 to N

## Problem Statement
You are gives Q queries each query containing two integers $a$ and $b$. Your task is to count the no of set-bits in for all numbers between $a$ and $b$ (both inclusive).

## Example
```txt
Input: a = 1, b = 1
Output:  1

Input: a = 10, b = 15
Output: 17
```
## Solution

Expected Time Complexity: $Log(n)$
<details><summary>Click - to see solution</summary>

How much the $ith$ bit in every number from $1$ to  $N$ will contribute to the final answer?

It is equal to the number of numbers, in binary representation, having $ith$ bit set.
which is equal to:  $(N / 2^i ) *  2$$^i$$^-$$^1 + X$

$X = (N$ & $(2^i - 1)) - 2^i$$^-$$^1+ 1$  

iff     $X >= 0$

Time Complexity: $Log(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <bits/stdc++.h>
using namespace std;

int AllBitsOneToN(int N) {
    int two = 2, ans = 0;
    int n = N;
    while (n) {
        ans += (N / two) * (two >> 1);
        int t = (N & (two - 1)) - (two >> 1) + 1;
        ans += max(t, 0);
        two <<= 1;
        n >>= 1;
    }
    return ans;
}

int main() {
    int q, a, b, res;
    cin >> q;
    while (q--) {
        cin >> a >> b;
        res = AllBitsOneToN(b) - AllBitsOneToN(a-1);
        cout << res << "\n";
    }
}
```
</TabItem>

<TabItem value="py" label="Python">

```py
def AllbitsOneToN(N):
    two = 2
    ans = 0
    n = N
    while n:
        ans += (N//two)*(two >> 1)
        t = (N % two) - (two >> 1) + 1
        ans += max(0, t)
        two <<= 1
        n >>= 1
    return ans


for q in range(int(input())):
    a, b = map(int, input().split())

    res = AllbitsOneToN(b)
    res -= AllbitsOneToN(a-1)
    
    print(res)
```
</TabItem>
</Tabs>
</details>