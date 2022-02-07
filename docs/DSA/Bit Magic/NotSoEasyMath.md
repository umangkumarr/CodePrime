---
sidebar_position: 3
---

# Not So Easy Math

## Problem statement

After the release of Avengers, Ironman and Thor got into a fight and Ironman challenged Thor to find out the number of numbers between 1 and n which are divisible by any of the prime numbers less than 20. Ironman being great at maths quickly answered the question but then Thor asked him to write a program for it. Ironman however found it quite difficult as he did not wanted to write so many lines of code. He knows that you are smart and can code this up easily. Can you do it?

## Constraints

$1 <= t <= 10$

$1 <= n <= 10^1$$^8$



## Sample Input
```txt
5
5
10
12
15
18
```

## Sample Output
```txt
4
9
11
14
17
```
<details><summary>Click - to see solution</summary>

## Solution
Use Inclusive and Exclusive Principle to solve the problem.

*Links* - https://cp-algorithms.com/combinatorics/inclusion-exclusion.html

Time complexity: $O(2^8)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <iostream>
using namespace std;
#define lli long long int

lli prime[8] = {2, 3, 5, 7, 11, 13, 17, 19};

int main() {
    int t;
    cin >> t;
    while (t--) {
        lli n;
        cin >> n;
        lli ans = 0;
        for (int i = 1; i < (1 << 8); i++) {
            int setbit = __builtin_popcount(i);
            int deno = 1;
            for (int j = 0; j < 8; j++) {
                int mask = 1 << j;
                if (mask & i) {
                    deno *= prime[j];
                }
            }
            if (setbit & 1) {
                ans += n / deno;
            } else {
                ans -= n / deno;
            }
        }
        cout << ans << '\n';
    }
}
```
</TabItem>

<TabItem value="py" label="Python">

```py
prime = [2, 3, 5, 7, 11, 13, 17, 19]

for t in range(int(input())):
    n = int(input())
    i = 1; ans = 0
    while i < (1 << 8):
        setbit = bin(i).count('1')
        deno = 1
        for j in range(0, 8):
            mask = ((1 << j) & i)
            if mask:
                deno = deno * prime[j]

        if (setbit & 1):
            ans += n//deno
        else:
            ans -= n//deno
        i += 1

    print(ans)

```

</TabItem>
</Tabs>

</details>