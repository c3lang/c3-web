---
title: Precedence
description: Precedence
---

Precedence rules in C3 differs from C/C++. Here are all precedence levels in C3, listed from highest (1) to lowest (12):


1. `()`, `[]`, `.`, postfix `!`, `!!`, `~`, `++` and `--`
2. prefix `-`, `~`, `!`, `!!`, `*`, `&`, `++`, `--`
3. infix `*`, `/`, `%`
4. `<<`, `>>`
5. `^`, `|`, infix `&`
6. `?:`, `??`
7. `+`, infix `-`, `+++`
8. `==`, `!=`, `>=`, `<=`, `>`, `<`
9. `&&`, `&&&`
10. `||`, `|||`
11. `?`
12. `=`, `*=`, `/=`, `%=`, `+=`, `-=`, `<<=`, `>>=`, `&=`, `^=`, `|=`

The postfix operators `!` (rethrow) and `!!` (force unwrap) work on Optionals, while postfix `~` turns a fault into an empty Optional, as in `return NOT_FOUND~;`.

Prefix `!!` is listed separately because `!!` is a single token. It has the same meaning as `! !a`.

`?:` (Elvis) is also a single token, so it must be written without whitespace: `a ?: b`. Written as `a ? : b`, it is parsed as an incomplete ternary.


The main difference is that bitwise operations and shift have higher precedence than addition/subtraction in C3, but still lower than multiplication/division. Bitwise operations also have higher precedence than the relational operators. Also, there is no difference in precedence between the bitwise operators.

Examples:

```c3
a + b >> c + d

(a + b) >> (c + d) // C (+ - are evaluated before >>)
a + (b >> c) + d   // C3 (>> is evaluated before + -)


a & b == c

a & (b == c)       // C  (bitwise operators are evaluated after relational)
(a & b) == c       // C3 (bitwise operators are evaluated before relational)


a > b == c < d

(a > b) == (c < d) // C  (< > binds tighter than ==)
((a > b) == c) < d // C3 Error, requires parenthesis!


a | b ^ c & d

a | ((b ^ c) & d)  // C  (All bitwise operators have different precedence)
((a | b) ^ c) & d  // C3 Error, requires parenthesis!
```

The change in precedence of the bitwise operators corrects a long standing issue in the C specification. The change in precedence for shift operations goes towards making the precedence less surprising.

Conflating the precedence of relational and equality operations, and all bitwise operations was motivated by simplification: few remember the exact internal differences in precedence between bitwise operators. Parenthesis is required for those conflated levels of precedence.

Left-to-right offers a very simple model to think about the internal order of operations, and encourages use of explicit ordering, as best practice in C is to use parentheses anyway.
