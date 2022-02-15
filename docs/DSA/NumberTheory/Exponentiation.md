# Exponentiation

## Problem statement

Find the value of $a^n$.

### Example
```
Input: a = 2,  n = 3
Output: 8
2 raise to the power 3 is 8.
```

### Tages
```Maths```, ```bitmask```

## Solution
Expected Time Complexity: $Log(n)$

<details><summary>Click - to see solution</summary>

## Solution:
Lets take $a = 5$ and $b = 6$.

Further $b$ in binary representation can be written as $(110)_2$

$b = 6 = 2^2 + 2^1 + 2^0•0 = 4 + 2 + 0$

$5^6 = 5^($$^4$$^+$$^2$$^+$$^0$$^) = 5^4•5^2•5^0$

To compute $a^n$ iterate over bits of $n$, if the $ith$ bit is set then multiple $2^i$ with answer.

Time Complexity: $log(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <iostream>
using namespace std;

int Exponent(int a, int n) {
    int ans = 1;
    while (n > 0) {
        int bit = n & 1;
        if (bit) {
            ans = (ans * a);
        }
        n >>= 1;
        a *= a;
    }
    return ans;
}

int main() {
    
    int a = 2;
    int n = 3;
    cout << Exponent(a, n) << "\n";
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
def Exponent(a, n):
    ans = 1
    while (n > 0):
        bit = n & 1
        if bit:
            ans = (ans * a)
        n >>= 1
        a *= a
    return ans

print(Exponent(2, 3))
```

</TabItem>
</Tabs>

## Output
```txt
8
```

</details>




