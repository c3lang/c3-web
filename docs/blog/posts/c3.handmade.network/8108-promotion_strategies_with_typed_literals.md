---
title: "Promotion strategies with typed literals"
date: 2021-10-02
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8108-promotion_strategies_with_typed_literals](https://c3.handmade.network/blog/p/8108-promotion_strategies_with_typed_literals)*

This is continuing the previous [article](https://c3.handmade.network/blog/p/8100-the_problem_with_untyped_literals) on literals.

C3 is pervasively written to assume untyped literals, so what would the effect be if it changed to typed literals again?

Let's remind us of the rules for C3 with untyped literals:

1. All operands are widened to the minimum arithmetic type (typically a 32 bit int) if needed.
2. If the left-hand side is instead an integer of a larger width, all operands are instead widened to this type.
3. The end result may be implicitly narrowed only if all the operands were as small as the type to narrow to.

To exemplify:

```
short b = ...
char c = ...

// 1. Widening
$typeof(b + c) => int
// $typeof((int)(b) + (int)(c))

// 2. Left hand side widening
long z = b + c;
// => long z = (long)(b) + (long)(c);

// 3. Implicit narrowing.
short w = b + c;
// => short w = (short)((int)(b) + (int)(c))
```

## Simple assignments

Let's start with simple assignments, where the lack of implicit narrowing tends to be a problem.

```
func void foo(short s) { ... }
func void ufoo(ushort us) { ... }
...

short s = 1234; // Allowed??
foo(1234); // Allowed??
ushort us = 65535; // Allowed??
ufoo(65535); // Allowed??
```

This is certainly something we would like to allow, so some additional rule is needed on top of just the literal types.

## Binary expressions

We next turn to binary expressions:

```
short s = foo();
s = s + 1234; // Allowed??
```

This example is subtly different, because looking at the types there is no direct conversion. Keep in mind rule (3) which permits narrowing. It requires us to keep track of both the original and current type. The types are something like this `short = (int was short) + (int was int)`. If we try to unify the binary expression, should the resulting type be "int was short" or "int was int"?

If we had `s = s + 65535` we would strictly want "int was int" – which causes a type error, and then preferably "int was short" in the case with `1234`. Is this possible?

In short: yes, although it does add special check for merging constants on every binary node. That said it has some very far-reaching consequences.

## Peer resolution woes

In Zig, which only has implicit widening, this occurs in binary expressions. So if you had `int + short` the right-hand side would be promoted to `int`. For a single binary expression this makes sense, but what if you have this:

```
char c = bar();
char d = bar2();
short s = foo();
int a = c + d + s;
```

If we use the "peer resolution" approach, this would be resolved in this manner: `int a = (int)((short)(c + d) + s)`. But if we reorder the terms, like `int a = s + c + d`, we get `int a = (int)((s + (short)c) + (short)d)` (assume additions are done using the resulting bit width of the sub expressions).

This means that in the original ordering we have mod-2^8 addition (or even undefined!) behaviour if the sum of `c` and `d` can't fit in a `char`, but with the first ordering there is no problem. Or in other words: *we just lost associativity for addition!*

That said, C has the same problem, but only when adding `int` with expressions which has types larger than `int`.

This example exhibits the same issue in C:

```
int32_t i = bar();
int32_t j = bar2();
int64_t k = foo();
int64_t a = i + j + k; 
// Evaluated as 
// int64_t a = (int64_t)(i + j) + k;
```

Previous to the 64-bit generation, the `int` was generally register sized in C, so doing larger-than-register-sized additions were rare and consequently less of a problem.

This prompted me to investigate a different approach for C3, using left side widening. On 64-bits, this would still be default 32-bit widening, but if the assigned typ was 64-bit, all operands would be widened to 64-bits instead, so as if it was written `int64_t a = (int64_t)i + (int64_t)j + k`. This is achieved by "pushing down" the left-hand type during semantic analysis (see rule 2).

The reason it must be pushed down during the pass, rather than doing it *after* evaluation, is that the type affects untyped literal evaluation and constant folding. Here is an example:

```
int32_t b = 1;
int64_t a = b + (b + ~0);
```

If we don't push down the type, then we need to use the closest thing, which either `b` - which has type `int32_t` - or just the default arithmetic promotion type, which is "int" in C.

```
// Use `int` to constant fold ~0 and 
// cast all to int64_t afterwards.
int64_t a = (int64_t)b + ((int64_t)b + (int64_t)(~(int)0));

// Use `int64_t` on 0 before constant folding:
int64_t a = (int64_t)b + ((int64_t)b + (~(int64_t)0));
```

We still have problems though, like in this case:

```
double d = 1.0 + (~0 + a);
```

If we the analysis in this order:

1. Analyse `1.0`
2. Analyse `0`
3. Analyse `~0`
4. Analyse `a`
5. Analyse `a + ~0`
6. Analyse `1.0 + (a + ~0)`
7. Analyse `d = 1.0 + (a + ~0)`

Then here we see that even though we know `a` to be `int64_t` we can't use that fact to type `0`, because it is analysed after `0`. And worse: the `a` might actually be an arbitrarily complex expression – something that you can't tell until you analysed it!

For that reason, even with untyped values, `0` is forced to default to `int`, with this result: `double d = 1.0 + (double)((int64_t)~(int)0 + a)`

Another example is shown below.

```
int64_t x = 0x7FFF_FFFF * 4;
int64_t y = x - 0x7FFF_FFFF * 2;
// y = 4294967294
double d = x - 0x7FFF_FFFF * 2; 
// d = 8589934590.0
```

Here due to no widening hint from a "double", the two expressions behave in a completely different manner.

## Setting realistic goals

Ideally we would like semantics that eliminate unnecessary casts, and requires casts where cast semantics are intended. Since the compiler can't read our mind, we will need to at least sacrifice a little of one of those goals. In C, elimination of unnecessary casts are prioritized, although these days with the common set of warnings it is somewhat less true.

In addition to this, we would also like to make sure arithmetics happens with the bit width the user intended, and that code should be can be interpreted locally without having to know the details of variables defined far away – this is particularly important if the compiler does not detect mismatches.

Even more important is a simple programmer mental model for semantics: easy to understand semantics that are less convenient trumps convenient but complex semantics.

## Strategies

In order to get started, let's list a bunch of possible strategies for widening and narrowing semantics.

#### Strategies for widening

1. Early fold, late cast (deep traversal).
2. Left hand side widening & error on peer widening.
3. No implicit widening.
4. Peer resolution widening (C style).
5. Re-evaluation.
6. Top casting but error on subexpressions.
7. Common integer promotion (C style).
8. Pre-traversal evaluation.

#### Strategies for narrowing

1. Always allow (C style).
2. Narrowing on direct literal assignment only.
3. Original type is smaller or same as narrowed type. Literals always ok.
4. As (3) but literals are size checked.
5. No implicit narrowing.

#### Strategies for conversion of signed/unsigned

1. Prefer unsigned (C style).
2. Prefer signed.
3. Disallow completely.

We should also note that there is no need to limit ourselves to a single strategy. For example, in Java `char c = 1 + 1;` is valid, but this isn't:

```
char d = 1;
char c = 1 + d;
```

Here the simple literal assignment is considered a special case where implicit conversion is allowed. In other words, we're seeing a combination of strategies.

### Case study 1: "C rules"

C in general works well, except for the unsafe narrowings – until we reach "larger than int" sizes. In this case we get *peer resolution widening*, which produces bad results for sub expressions:

```
int a = 0x7FFFFFFF;
int64_t x = a + 1;
// => x = -2147483648
```

In general working with a combination of `int` and larger-than-int types work poorly with C.

### Case study 2: "C + left side widening"

This is using the current C3 idea of using the left side type to increase the type implicitly widened to. Our C example works:

```
int a = 0x7FFFFFFF;
int64_t x = a + 1;
// => x = 2147483648 with left side widening
```

As previously mentioned, this breaks down when there is no left side type, which then defaults to C *peer resolution widening*.

```
int a = 0x7FFFFFFF;
int64_t b = 0;
double d = (double)((a + 1) + b);
// => x = -2147483648.0
```

In the [next article](https://c3.handmade.network/blog/p/8134-attempting_new_c3_type_conversion_semantics) I will walk through various new ideas for promotion semantics with analysis.

## Comments


---
### Comment by Christoffer Lernö

This is continuing the previous [article](https://c3.handmade.network/blog/p/8100-the_problem_with_untyped_literals) on literals.

C3 is pervasively written to assume untyped literals, so what would the effect be if it changed to typed literals again?

Let's remind us of the rules for C3 with untyped literals:

1. All operands are widened to the minimum arithmetic type (typically a 32 bit int) if needed.
2. If the left-hand side is instead an integer of a larger width, all operands are instead widened to this type.
3. The end result may be implicitly narrowed only if all the operands were as small as the type to narrow to.

To exemplify:

```
short b = ...
char c = ...

// 1. Widening
$typeof(b + c) => int
// $typeof((int)(b) + (int)(c))

// 2. Left hand side widening
long z = b + c;
// => long z = (long)(b) + (long)(c);

// 3. Implicit narrowing.
short w = b + c;
// => short w = (short)((int)(b) + (int)(c))
```

## Simple assignments

Let's start with simple assignments, where the lack of implicit narrowing tends to be a problem.

```
func void foo(short s) { ... }
func void ufoo(ushort us) { ... }
...

short s = 1234; // Allowed??
foo(1234); // Allowed??
ushort us = 65535; // Allowed??
ufoo(65535); // Allowed??
```

This is certainly something we would like to allow, so some additional rule is needed on top of just the literal types.

## Binary expressions

We next turn to binary expressions:

```
short s = foo();
s = s + 1234; // Allowed??
```

This example is subtly different, because looking at the types there is no direct conversion. Keep in mind rule (3) which permits narrowing. It requires us to keep track of both the original and current type. The types are something like this `short = (int was short) + (int was int)`. If we try to unify the binary expression, should the resulting type be "int was short" or "int was int"?

If we had `s = s + 65535` we would strictly want "int was int" – which causes a type error, and then preferably "int was short" in the case with `1234`. Is this possible?

In short: yes, although it does add special check for merging constants on every binary node. That said it has some very far-reaching consequences.

## Peer resolution woes

In Zig, which only has implicit widening, this occurs in binary expressions. So if you had `int + short` the right-hand side would be promoted to `int`. For a single binary expression this makes sense, but what if you have this:

```
char c = bar();
char d = bar2();
short s = foo();
int a = c + d + s;
```

If we use the "peer resolution" approach, this would be resolved in this manner: `int a = (int)((short)(c + d) + s)`. But if we reorder the terms, like `int a = s + c + d`, we get `int a = (int)((s + (short)c) + (short)d)` (assume additions are done using the resulting bit width of the sub expressions).

This means that in the original ordering we have mod-2^8 addition (or even undefined!) behaviour if the sum of `c` and `d` can't fit in a `char`, but with the first ordering there is no problem. Or in other words: *we just lost associativity for addition!*

That said, C has the same problem, but only when adding `int` with expressions which has types larger than `int`.

This example exhibits the same issue in C:

```
int32_t i = bar();
int32_t j = bar2();
int64_t k = foo();
int64_t a = i + j + k; 
// Evaluated as 
// int64_t a = (int64_t)(i + j) + k;
```

Previous to the 64-bit generation, the `int` was generally register sized in C, so doing larger-than-register-sized additions were rare and consequently less of a problem.

This prompted me to investigate a different approach for C3, using left side widening. On 64-bits, this would still be default 32-bit widening, but if the assigned typ was 64-bit, all operands would be widened to 64-bits instead, so as if it was written `int64_t a = (int64_t)i + (int64_t)j + k`. This is achieved by "pushing down" the left-hand type during semantic analysis (see rule 2).

The reason it must be pushed down during the pass, rather than doing it *after* evaluation, is that the type affects untyped literal evaluation and constant folding. Here is an example:

```
int32_t b = 1;
int64_t a = b + (b + ~0);
```

If we don't push down the type, then we need to use the closest thing, which either `b` - which has type `int32_t` - or just the default arithmetic promotion type, which is "int" in C.

```
// Use `int` to constant fold ~0 and 
// cast all to int64_t afterwards.
int64_t a = (int64_t)b + ((int64_t)b + (int64_t)(~(int)0));

// Use `int64_t` on 0 before constant folding:
int64_t a = (int64_t)b + ((int64_t)b + (~(int64_t)0));
```

We still have problems though, like in this case:

```
double d = 1.0 + (~0 + a);
```

If we the analysis in this order:

1. Analyse `1.0`
2. Analyse `0`
3. Analyse `~0`
4. Analyse `a`
5. Analyse `a + ~0`
6. Analyse `1.0 + (a + ~0)`
7. Analyse `d = 1.0 + (a + ~0)`

Then here we see that even though we know `a` to be `int64_t` we can't use that fact to type `0`, because it is analysed after `0`. And worse: the `a` might actually be an arbitrarily complex expression – something that you can't tell until you analysed it!

For that reason, even with untyped values, `0` is forced to default to `int`, with this result: `double d = 1.0 + (double)((int64_t)~(int)0 + a)`

Another example is shown below.

```
int64_t x = 0x7FFF_FFFF * 4;
int64_t y = x - 0x7FFF_FFFF * 2;
// y = 4294967294
double d = x - 0x7FFF_FFFF * 2; 
// d = 8589934590.0
```

Here due to no widening hint from a "double", the two expressions behave in a completely different manner.

## Setting realistic goals

Ideally we would like semantics that eliminate unnecessary casts, and requires casts where cast semantics are intended. Since the compiler can't read our mind, we will need to at least sacrifice a little of one of those goals. In C, elimination of unnecessary casts are prioritized, although these days with the common set of warnings it is somewhat less true.

In addition to this, we would also like to make sure arithmetics happens with the bit width the user intended, and that code should be can be interpreted locally without having to know the details of variables defined far away – this is particularly important if the compiler does not detect mismatches.

Even more important is a simple programmer mental model for semantics: easy to understand semantics that are less convenient trumps convenient but complex semantics.

## Strategies

In order to get started, let's list a bunch of possible strategies for widening and narrowing semantics.

#### Strategies for widening

1. Early fold, late cast (deep traversal).
2. Left hand side widening & error on peer widening.
3. No implicit widening.
4. Peer resolution widening (C style).
5. Re-evaluation.
6. Top casting but error on subexpressions.
7. Common integer promotion (C style).
8. Pre-traversal evaluation.

#### Strategies for narrowing

1. Always allow (C style).
2. Narrowing on direct literal assignment only.
3. Original type is smaller or same as narrowed type. Literals always ok.
4. As (3) but literals are size checked.
5. No implicit narrowing.

#### Strategies for conversion of signed/unsigned

1. Prefer unsigned (C style).
2. Prefer signed.
3. Disallow completely.

We should also note that there is no need to limit ourselves to a single strategy. For example, in Java `char c = 1 + 1;` is valid, but this isn't:

```
char d = 1;
char c = 1 + d;
```

Here the simple literal assignment is considered a special case where implicit conversion is allowed. In other words, we're seeing a combination of strategies.

### Case study 1: "C rules"

C in general works well, except for the unsafe narrowings – until we reach "larger than int" sizes. In this case we get *peer resolution widening*, which produces bad results for sub expressions:

```
int a = 0x7FFFFFFF;
int64_t x = a + 1;
// => x = -2147483648
```

In general working with a combination of `int` and larger-than-int types work poorly with C.

### Case study 2: "C + left side widening"

This is using the current C3 idea of using the left side type to increase the type implicitly widened to. Our C example works:

```
int a = 0x7FFFFFFF;
int64_t x = a + 1;
// => x = 2147483648 with left side widening
```

As previously mentioned, this breaks down when there is no left side type, which then defaults to C *peer resolution widening*.

```
int a = 0x7FFFFFFF;
int64_t b = 0;
double d = (double)((a + 1) + b);
// => x = -2147483648.0
```

In the [next article](https://c3.handmade.network/blog/p/8134-attempting_new_c3_type_conversion_semantics) I will walk through various new ideas for promotion semantics with analysis.