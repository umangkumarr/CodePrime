# Modular Exponentiation

## Problem statement

Find the value of $(a^n)$%$mod$.

### Example
```
Input: a = 2,  n = 3, mod = 3
Output: 2
2 raise to the power 3 is 8 and 8%3 = 2.
```

### Tages
```Maths```, ```bitmask```

## Solution
Expected Time Complexity: $Log(n)$

<details><summary>Click - to see solution</summary>

## Solution:
Lets take $a = 5$ and $b = 6$.

Further $b$ in binary representation can be written as $(110)_2$

$b = 6 = 2^2 + 2^1 + 2^0*0 = 4 + 2 + 0$

$5^6 = 5^($$^4$$^+$$^2$$^+$$^0$$^) = 5^4*5^2*5^0$

To compute $a^n$ iterate over bits of $n$, if the $ith$ bit is set then multiple $2^i$ with answer and do answer = answer % mod.

Time Complexity: $log(n)$

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++">

```cpp
#include <iostream>
using namespace std;

int ModularExponent(int a, int n, int mod) {
    int ans = 1;
    while (n > 0) {
        int bit = n & 1;
        if (bit) {
            ans = (ans * a) % mod;
        }
        n >>= 1;
        a = (a * a) % mod;
    }
    return ans;
}

int main() {
    
    int a = 2;
    int n = 3;
    int mod = 3
    cout << ModularExponent(a, n, mod) << "\n";
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
def ModularExponent(a, n, mod):
    ans = 1
    while (n > 0):
        bit = n & 1
        if bit:
            ans = (ans * a) % mod
        n >>= 1
        a *= a
        a %= mod
    return ans

print(ModularExponent(2, 3, 3))
```

</TabItem>
</Tabs>

## Output
```txt
2
```

</details>




