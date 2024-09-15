---
title: Vectors
description: Vectors
sidebar:
    order: 62
---

Vectors - where possible - based on underlying hardware vector implementations. A vector is similar to an array, but 
with additional functionality. The restriction is that a vector may only consist of elements that are numerical
types, boolean or pointers.

A vector is declared similar to an array but uses `[<>]` rather than `[]`, e.g. `int[<4>]`.

(If you are searching for the counterpart of C++'s `std::vector`, look instead at the standard
library [`List` type](/references/docs/arrays/#dynamic-arrays-and-lists).)

## Arithmetics on vectors

Vectors support all arithmetics and other operations supported by its underlying type. The operations are
always performed elementwise.

```c3
int[<2>] a = { 23, 11 };
int[<2>] b = { 2, 1 };
int[<2>] c = a * b;     // c = { 46, 11 }
```

For integer and boolean types, bit operations such as `^ | & << >>` are available, and for pointers, pointer arithmetic
is supported.

### Scalar values

Scalar values will implicitly widen to vectors when used with vectors:

```c3
int[<2>] d = { 21, 14 };
int[<2>] e = d / 7;      // e = { 3, 2 }
int[<2>] f = 4;          // f = { 4, 4 }
```

## Additional operations

The `std::math` module contains a wealth of additional operations available on vectors using dot-method syntax.

- `.sum()` - sum all vector elements.
- `.product()` - multiply all vector elements.
- `.max()` - get the maximum element.
- `.min()` - get the minimum element.
- `.dot(other)` - return the dot product with the other vector.
- `.length(other)` - return the square root of the dot product (not available on integer vectors).
- `.distance(other)` - return the length of the difference of the two vectors (not available on integer vectors).
- `.normalize()` - return a normalized vector (not available on integer vectors).
- `.comp_lt(other)` - return a boolean vector with a component wise "<" 
- `.comp_le(other)` - return a boolean vector with a component wise "<="  
- `.comp_eq(other)` - return a boolean vector with a component wise "=="  
- `.comp_gt(other)` - return a boolean vector with a component wise ">"  
- `.comp_ge(other)` - return a boolean vector with a component wise ">="  
- `.comp_ne(other)` - return a boolean vector with a component wise "!="  

Dot methods available for scalar values, such as `ceil`, `fma` etc are in general also available for vectors.

## Swizzling

Swizzling using dot notation is supported, using x, y, z, w *or* r, g, b, a:

```c3
int[<3>] a = { 11, 22, 33 };
int[<4>] b = a.xxzx;                         // b = { 11, 11, 33, 11 }
int c = b.w;                                 // c = 11;
char[<4>] color = { 0x11, 0x22, 0x33, 0xFF };
char red = color.r;                          // red = 0x11
```

## Array-like operations

Like arrays, it's possible to make slices and iterate over vectors. It should be noted that the storage alignment of
vectors are often different from arrays, which should be taken into account when storing vectors.