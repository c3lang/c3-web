---
title: "Thoughts on numeric literal type inference rules for a C-like programming language"
date: 2020-05-03
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/thoughts-on-numeric-literal-type-inference-rules-for-a-c-like-programming-language-4fpb](https://dev.to/lerno/thoughts-on-numeric-literal-type-inference-rules-for-a-c-like-programming-language-4fpb)*

For the [C3](http://www.c3-lang.org/) language I’m working on I wanted to improve on *C*’s integers.

Recent languages have gravitated towards removing many implicit casts: *Rust*, *Swift*, *Go*, *Zig* and *Odin* all fall into this camp.

Studying *Go* in particular is illuminating: they recognize that removing implicit casts creates usability issues, and changes *numeric literals* to be *BigInts*, implicitly convertible into any sufficiently large integer type.

*Swift*, *Zig* and *Odin* all pick up this idea, but in slightly different ways. 

*Zig* uses what it calls [peer type resolution](https://ziglang.org/documentation/master/#Peer-Type-Resolution) to describe how the conversion from “compile time integer” (the *BigInt* representation) occurs in various circumstances, such as in binary expressions. This is basically picking a common type that all sub expressions can coerce into. Here are some examples: As an example, adding a variable of type `i32` with a constant “123” will convert the constant from *BigInt* to `i32`. The common type here is `i32` and this is the type the constant will be cast to. When adding `i32` and `i64` the common type is instead `i64` and so on.

This peer type resolution breaks down in expressions like:
```
var y : i32 = if (x > 2) 1 else 2;
```
In this example 1 and 2 are both *BigInt* types, but the expression is a runtime one and needs a definite integer type.

In *Go*, this situation is resolved by falling back on a default type size: `int`. In *Go* this is a 32-bit or 64-bit value depending on platform.

*Zig* doesn't have that, so other strategies must be employed. As of 0.6.0, *Zig* will parse the above, but will not accept either of the following.

```
if (x > 2) 1 else 2;
var y : i32 = 1 + if (x > 2) 1 else 2;
```

Peer type resolution might also at times create odd results. Consider the following *Zig* code:
```
var foo : i16 = 0x7FFF;
var bar : i32 = foo + 1;

// The above is equivalent to:
var foo : i16 = 0x7FFF;
var temp : i16 = foo + 1;
var bar : i32 = temp;

```
Because of peer type resolution this would overflow. One could imagine a behaviour more similar to what *C* would often give you by resolving the add `foo + 1` *after* casting both to the type of `bar`.

For *Odin*, *Swift* and *Go* this example is more obvious, because there are no widening conversions. In *Go* for example we would have to write this:

```
var foo int16 = 0x7FFF
var bar int32 = int32(x + 1)
```

In this case it's clear that in `x + 1` neither `x` nor `1` are int32, so the fact that `bar` returns `-32768` is expected.

It's important to emphasize that these are conventions, there is not strictly any right or wrong, rather it's about a trade off between convenience and how prone it is to cause bugs.

*C3* – like *Zig* – allows safe widening conversions, and so it needs to decide whether it should follow the *Zig* behaviour or the "convert first" approach. To me the *Zig* behaviour is a bit counter-intuitive. I'd prefer the widening to happen before the addition. Here we might consider `int a = b + c` where `b` and `c` are signed chars. Is it intuitive that this add should overflow on `b` and `c` both equal to `64`? I think it's better to avoid possible overflows if possible, and doing widening first helps that.

To achieve this we use *bi-directional type checking*. This works by "pushing down" the expected type and optionally casting to the expected type. As we saw in the *Zig* example, it does that for assignment, but retains peer type resolution when we nest deeper into expressions.

To illustrate this, here is some *C3* code, it should look fairly familiar – note that like in *Java*, *C#* and *D* the sizes of the types are well defined. An `int` is always 32 bits:

```
short foo = 0x7FFF;
int bar = foo + 1;
// The above is equivalent to:
short foo = 0x7FFF;
int bar = cast(foo, int) + cast(1, int);
```

What happens during semantic analysis in *C3* is this:
1. Found declaration of `bar`
2. Analyse the init expression to the declaration, pass down the type `int`
3. The init expression is a binary add, analyse left side, pass down the type `int` to the analysis.
4. Left side is smaller than `int`, promote to `int`.
5. Analyse right side, passing down the type `int`.
6. Right side is compile time integer, try to convert to `int` (this will be a compile time error if the value does not fit in an integer).
7. Binary sub expressions are resolved. Find a common type of both sides, which in this case is `int`.
8. Implicitly cast binary expression to `int` if necessary (not necessary in this case).
9. Check the type of the binary expression if it matches `int`

So let's have a look at a case when conversion *isn't* possible and a compile time error occurs.
```
long foo = 1;
int bar = foo + 2;
```
Semantic analysis is in this case.
1. Found declaration of `bar`
2. Analyse the init expression to the declaration, pass down the type `int`
3. The init expression is a binary add, analyse left side, pass down the type `int` to the analysis.
4. Left side is `long`, it cannot be implicitly cast to `int`.
5. Analyse right side, passing down the type `int`.
6. Right side is compile time integer, try to convert to `int` (this will be a compile time error if the value does not fit in an integer).
7. Binary sub expressions are resolved. Find if the common type which is `long` in this case.
8. Since the right hand side is `int`, cast to `long`.
9. The resulting binary expression now has type `long`.
10. Check the type of the binary expression if it matches `int`, it doesn't and cannot be implicitly converted to `int` either. A compile time error "`long` cannot be implicitly converted to `int`" is displayed.

Given the above examples it might seem like one could simply do away with any "peer type resolution".

However, there are cases where top down resolution fails. Here is an example:

```
short x = ...
if (x + 1 < 100) { ... }
```

In this case we don't have a type hint. This is what happens when resolving the comparison.

1. Analyse left hand size, with type passed down as `NULL`.
2. Analyse `x + 1` with type passed down as `NULL`.
3. Left hand side is `short` and right hand side is `compile time integer`. The common type is `short`
4. Right hand side in addition is implicitly cast to `short`.
5. Left hand side in the comparison has the type `short`.
5. Analyse right hand side of comparison, this is a `compile time integer`.
6. Find a common type between `short` and `compile time integer`, which is `short`.
7. Implicitly cast right hand side in comparison to `short`
8. Analysis is complete.

That is not to say that these two methods are sufficient(!) here is an example from **gingerBill** (author of *Odin*): `((x > 1 ? 3000 : 2 + 1000) == 2)`. The problem here is that all values are compile time integers, so no type hint can be found anywhere.

This can either be considered a compile time error because it's "under typed", or default to some integer type: either the register sized integer (*Go*'s strategy) or some other similar strategy. *C3* currently picks the first option (compile time error) because of the difficulty of picking a good default that doesn't accidentally cause odd behaviour and due to how uncommon this is.