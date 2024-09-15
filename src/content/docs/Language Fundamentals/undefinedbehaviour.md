---
title: Undefined Behaviour
description: Undefined Behaviour
sidebar:
    order: 47
---

Like C, C3 uses undefined behaviour. In contrast, C3 will *trap* - that is, print an error trace and abort – on undefined behaviour in debug builds. This is similar to using C with a UB sanitizer. It is only during release builds that actual undefined behaviour occurs.

In C3, undefined behaviour means that the compiler is free to interpret *undefined behaviour as if behaviour cannot occur*.

In the example below:

```
uint x = foo();
uint z = 255 / x;
return x != 0;
```

The case of `x == 0` would invoke undefined behaviour for `255/x`. For that reason, 
the compiler may assume that `x != 0` and compile it into the following code: 

```
foo();
return true;
```

As a contrast, the safe build will compile code equivalent to the following.

```
uint x = foo();
if (x == 0) trap("Division by zero")
return true;
```

## List of undefined behaviours

The following operations cause undefined behaviour in release builds of C3:

| operation | will trap in safe builds |
| --------- | :----------------------: |
| int / 0 | Yes |
| int % 0 | Yes |
| reading explicitly uninitialized memory | Possible\* |
| array index out of bounds | Yes |
| dereference `null` | Yes |
| dereferencing memory not allocated | Possible\* |
| dereferencing memory outside of its lifetime | Possible\* |
| casting pointer to the incorrect array | Possible\* |
| violating pre or post conditions | Yes |
| violating asserts | Yes |
| reaching `unreachable()` code | Yes |

\* "Possible" indicates trapping is implementation dependent.

## List of implementation dependent behaviours

Some behaviour is allowed to differ between implementations and platforms.

| operation | will trap in safe builds | permitted behaviour |
| --------- | :----------------------: | :----------------: |
| comparing pointers of different provenance | Optional | Any result |
| subtracting pointers of different provenance | Optional | Any result |
| shifting by more or equal to the bit width | Yes | Any result |
| shifting by negative amount | Yes | Any result |
| conversion floating point <-> integer type is out of range | Optional | Any result |
| conversion between pointer types produces one with incorrect alignment | Optional | Any result / Error  |
| calling a function through a function pointer that does not match the function | Optional | Any result / Error |
| attempt to modify a string literal | Optional | Partial modification / Error |
| modifying a `const` variable | Optional | Partial modification / Error |

## List of undefined behaviour in C, which is defined in C3

### Signed Integer Overflow

Signed integer is always wrapped using 2s complement.

### Modifying the intermediate results of an expression

Behaves as if the intermediate result was stored in a variable on the stack.
