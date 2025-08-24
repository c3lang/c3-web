---
title: Precedence
description: Precedence
sidebar:
    order: 211
---

Precedence rules in C3 differ from C and C++. 

Here are all precedence levels in C3, listed from highest (1) to lowest (11):

1. `()`, `[]`, `.`, `!!` postfix `!`, `++` and `--` 
2. `@`, prefix `-`, `~`, prefix `*`, `&`, prefix `++` and `--`
3. infix `*`, `/`, `%`
4. `<<`, `>>`
5. `^`, `|`, infix `&`
6. `+`, infix `-`, `+++`
7. `==`, `!=`, `>=`, `<=`, `>`, `<`
8. `&&`, `&&&`
9. `||`, `|||`
10. ternary `?:` and binary `??`
11. `=`, `*=`, `/=`, `%=`, `+=`, `-=`, `<<=`, `>>=`, `&=`, `^=`, `|=`


The main difference is that bitwise operations and shift have higher precedence than addition/subtraction and multiplication/division in C3. Bitwise operations also have higher precedence than the relational operators. Also, there is no difference in precedence between `&&` and `||` or between the bitwise operators.

Examples:

```c3
a + b >> c + d

(a + b) >> (c + d)  // C  (+ and - are evaluated before >>)
a + (b >> c) + d    // C3 (>> is evaluated before + and -)


a & b == c

a & (b == c)        // C  (bitwise operators are evaluated after relational)
(a & b) == c        // C3 (bitwise operators are evaluated before relational)


a > b == c < d

(a > b) == (c < d)  // C  (< > binds tighter than ==)
((a > b) == c) < d  // C3 (Error. Requires parenthesis to disambiguate!)


a | b ^ c & d

a | ((b ^ c) & d)   // C  (All bitwise operators have different precedence)
((a | b) ^ c) & d   // C3 (Error. Requires parenthesis to disambiguate!)
```

The change in precedence of the bitwise operators corrects a long standing issue in the C specification. The change in precedence for shift operations helps make the precedence less surprising and hence also less error prone.

C3's changes to the precedence of relational and equality operations, and all bitwise operations, were motivated by simplification: few remember the exact differences in precedence between bitwise operators in C. Thus, by assigning equal precedence to such error-prone groups of operators, C3 makes it so that parenthesis are required, thereby reducing the potential for confusion and subtle logical errors.

Left-to-right associativity within each group of related operators offers a very simple model to think about the resulting order of operations, and encourages use of explicit ordering, as best practice in C is to use parentheses anyway. Only the most conventionally common precedence rules (e.g. multiplication vs addition, etc) are placed on separate precedence levels in C3 and thus convenience and clarity are balanced without significantly sacrificing either.
