---
sidebar_position: 2
---

# Longest Consecutive 1s in Binary Representation
Given a number `n`, find length of the longest consecutive 1s in its binary representation.

### Examples : 
```txt
Input : n = 14
Output : 3
The binary representation of 14 is 1110.

Input : n = 222
Output : 4
The binary representation of 222 is 11011110.
```

### Solution:

<strong>Using Bit Magic: </strong> The idea is based on the concept that if we AND a bit sequence with a shifted version of itself, we’re effectively removing the trailing 1 from every sequence of consecutive 1s.  


<code>
&nbsp; 11101111   (x)   <br/>
    &amp; 11011110   (x &lt;&lt; 1)  <br/>
    ----------  <br/>
&nbsp; 11001110   (x &amp; (x &lt;&lt; 1))   <br/>
&nbsp;   ^    ^  <br/>
&nbsp;   |    |  <br/>
&nbsp; trailing 1 removed  <br/>
</code>

So the operation x = (x & (x << 1)) reduces length of every sequence of 1s by one in binary representation of x. If we keep doing this operation in a loop, we end up with x = 0. The number of iterations required to reach 0 is actually length of the longest consecutive sequence of 1s.

<strong>Time Complexity:</strong>

$log(n)$

<hr/>

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

### Output:
```txt
3
```
