---
title: "Prerequisites"
description: "The bitwise operators (NOT, AND, OR, XOR, shifts) and the handful of bit tricks every bit-manipulation problem builds on."
---

Everything you need before starting bit manipulation: what each bitwise operator does, and the small set of tricks that the rest of this section builds on.

Integers are stored in binary. In C++ an `int` is (on every mainstream platform) 32 bits, and negative numbers use **two's complement**: $-x$ is stored as $\sim x + 1$. The examples below show only the low bits that matter.

## Bitwise operators

Each operator works on every bit position independently, which is why they run in $O(1)$.

| Operator | Name | Result bit is 1 when… | Example (`a = 5 = 0101`, `b = 3 = 0011`) |
| --- | --- | --- | --- |
| `~a` | NOT | the bit of `a` is 0 | `~5 = -6` (every bit flipped) |
| `a & b` | AND | both bits are 1 | `0101 & 0011 = 0001 = 1` |
| `a \| b` | OR | at least one bit is 1 | `0101 \| 0011 = 0111 = 7` |
| `a ^ b` | XOR | the bits differ | `0101 ^ 0011 = 0110 = 6` |
| `a << k` | left shift | bit moved $k$ places left | `5 << 1 = 1010 = 10` |
| `a >> k` | right shift | bit moved $k$ places right | `5 >> 1 = 0010 = 2` |

### NOT ( `~` )

NOT flips **all 32 bits**, not just the ones you wrote down. For `5 = 000…0101` it gives `111…1010`, which in two's complement is $-6$. In general:

$$\sim x = -x - 1$$

If you only want to flip the low $k$ bits, XOR with a mask instead: `x ^ ((1 << k) - 1)`. For `5` and $k = 3$ that is `101 ^ 111 = 010 = 2`.

### AND, OR, XOR

- **AND** keeps a bit only where both operands have it: use it to *test* or *clear* bits.
- **OR** keeps a bit where either operand has it: use it to *set* bits.
- **XOR** keeps a bit where the operands differ: use it to *toggle* bits. Two facts make XOR special: `x ^ x = 0` and `x ^ 0 = x`, so XOR-ing a value in twice cancels it.

### Left shift ( `<<` )

`x << k` moves every bit $k$ places to the left and fills the vacated low bits with **0**. Each place doubles the value, so

$$x \ll k = x \cdot 2^k \qquad\text{e.g. } 1 \ll 1 = 2,\; 1 \ll 2 = 4,\; 1 \ll 3 = 8,\; 1 \ll n = 2^n$$

as long as the result still fits in the type. `1 << 31` already overflows a 32-bit `int`; write `1LL << k` when $k$ can reach 31 or more.

### Right shift ( `>>` )

`x >> k` moves every bit $k$ places to the right; the low $k$ bits fall off. For a non-negative `x` the vacated **high** bits are filled with 0, so

$$x \gg k = \left\lfloor \frac{x}{2^k} \right\rfloor \qquad\text{e.g. } 4 \gg 1 = 2,\; 6 \gg 1 = 3,\; 5 \gg 1 = 2,\; 16 \gg 4 = 1$$

For a **negative** signed value the high bits are filled with copies of the sign bit (an *arithmetic* shift), so `-8 >> 1 == -4` and `-1 >> 1 == -1`. A loop such as `while (x) x >>= 1;` therefore never ends for negative `x`; use an `unsigned` type when you shift bits out one at a time.

Shifting by a negative amount, or by at least the width of the type (`x << 32` on an `int`), is undefined behaviour in C++.

## Tricks used everywhere

Bit $i$ means the bit worth $2^i$, counting from $i = 0$ at the right.

| Task | Expression | Why it works |
| --- | --- | --- |
| Is bit $i$ set? | `(x >> i) & 1` | moves bit $i$ to position 0, then isolates it |
| Set bit $i$ | `x \| (1 << i)` | OR with a single 1 at position $i$ |
| Clear bit $i$ | `x & ~(1 << i)` | AND with all 1s except position $i$ |
| Toggle bit $i$ | `x ^ (1 << i)` | XOR flips exactly that bit |
| Lowest set bit | `x & -x` | $-x = \sim x + 1$ flips everything above the lowest 1 |
| Clear the lowest set bit | `x & (x - 1)` | `x - 1` turns the lowest 1 into 0 and the 0s below it into 1s |
| Is `x` a power of two? | `x > 0 && (x & (x - 1)) == 0` | a power of two has exactly one set bit |
| Number of set bits | `__builtin_popcount(x)` (`std::popcount` in C++20) | counts the 1s directly |

Example: `x = 12 = 1100`. Then `x & -x = 0100 = 4` (the lowest set bit) and `x & (x - 1) = 1100 & 1011 = 1000 = 8` (the lowest set bit removed).

Applying `x &= x - 1` until `x` becomes 0 runs once per set bit, a classic way to count them (Kernighan's method).
