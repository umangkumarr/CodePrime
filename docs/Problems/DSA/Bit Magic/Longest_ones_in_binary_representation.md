---
sidebar_position: 2
---

# Length of the Longest Consecutive 1s in Binary Representation
Given a number `n`, find length of the longest consecutive 1s in its binary representation.

## Examples : 
```txt
Input : n = 14
Output : 3
The binary representation of 14 is 1110.

Input : n = 222
Output : 4
The binary representation of 222 is 11011110.
```

<details><summary>Click - to see solution</summary>

## Solution:
The operation x &= x << 1 reduces length of every sequence of 1s by one in binary representation of x. If we keep doing this operation in a loop, we end up with $x = 0$. The number of iterations required to reach 0 is actually length of the longest consecutive sequence of 1s.

Time Complexity: $log(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <iostream>
using namespace std;

int maxConsecutivesOne(int n) {
    int count = 0;
    while (n) {
        n &= (n >> 1);
        count++;
    }
    return count;
}

int main() {
    cout << maxConsecutivesOne(221);
    return 0;
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
def maxConsecutiveOnes(n):
    count = 0
    while n > 0:            # 1101110
        n &= n << 1         # &11011100
        count += 1          # -> 10010100 repeat
    return count

print(maxConsecutiveOnes(221))
```

</TabItem>
</Tabs>

## Output
```txt
3
```

</details>