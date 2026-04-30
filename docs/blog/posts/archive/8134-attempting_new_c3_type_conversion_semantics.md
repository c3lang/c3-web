---
title: "Attempting new C3 type conversion semantics"
date: 2021-10-04
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8134-attempting_new_c3_type_conversion_semantics](https://c3.handmade.network/blog/p/8134-attempting_new_c3_type_conversion_semantics)*

As a reminder, in the [last article](https://c3.handmade.network/blog/p/8108-promotion_strategies_with_typed_literals) I listed the following strategies:

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

To begin with, we'll try the "Early fold, late cast" for widening.
This is essentially a modification on the peer resolution widening.

## Attempt 1 - "Early fold, late cast"

Here we first fold all constants, then "peer promote" the types *recursively* downwards. How this differs from C is illustrated below:

```
int32_t y = foo();
int64_t x = bar();
double w = x + (y * 2);
// C semantics:
// double w = (double)(x + (int64_t)(y * 2));
// Early fold, late cast:
// double w = (double)(x + ((int64_t)y * (int64_t)2));
```

So far this looks pretty nice, but unfortunately the "early fold" part has less positive consequences:

```
int32_t y = foo();
int64_t x = bar();
int32_t max = INT32_MAX;
double w = x + (y + (INT32_MAX + 1));
double w2 = x + (y + (max + 1));
// Early fold, late cast:
// double w = (double)(x + ((int64_t)y + (int64_t)-2147483648));
// double w2 = (double)(x + ((int64_t)y 
//             + ((int64_t)max + (int64_t)1)));
```

The good thing about this wart is that it is at least locally observable - as long as it's clear from the source code what will be constant folded.

All in all, while slightly improving the semantics, we can't claim to have solved all the problems with peer resolution while the semantics got more complicated.

## Attempt 2 "Re-evaluation"

This strategy is more theoretical than anything. With this strategy we attempt to first evaluate the maximum type, then re-evaluate everything by casting to this maximum type. It's possible to do this in multiple ways: deep copying the expression, two types of evaluation passes etc.

Our problematic example from *attempt 1* works:

```
int32_t y = foo();
int64_t x = bar();
int32_t max = INT32_MAX;
double w = x + (y + (INT32_MAX + 1));
// => first pass type analysis: int64_t + (int32_t + (int + int))
// => max type in sub expression is int64_t
// => double w = (double)(x + ((int64_t)y 
//               + ((int64_t)INT_MAX + (int64_t)1)));
```

However, we somewhat surprisingly get code that are hard to reason about locally even in this case:

```
// elsewhere int64_t x = ... or int32_t x = ... 
int32_t y = foo();
double w = x + (y << 16);
// If x is int64_t:
// double w = (double)(x + ((int64_t)y << 16));
// If x is int32_t
// double w = (double)(x + (y << 16));
```

Here it's clear that we get different behaviour: in the case of `int32_t` the bits are shifted out, whereas for `int64_t` they are retained. There are better (but more complicated) examples to illustrate this, but it is proving that even with "ideal" semantics, we lose locality.

## Rethinking "perfect"

Let's go back to the example we had with Java in the last article:

```
char d = 1;
char c = 1 + d; // Error
char c = (char)(1 + d); // Ok
```

In this case the first is ok, but the second isn't. The special case takes care of the most common use, but for anything non-trivial an explicit cast is needed.

What if we would say that this is okay:

```
int64_t x = foo();
int32_t y = bar();
double w = x + y
```

But this isn't:

```
int64_t x = foo();
int32_t y = bar();
double w = x + (y + y);
//             ^^^^^^^
// Error, can't implicitly promote complex expression
// of type int32_t to int64_t.
```

Basically we give up widening *except* for where we don't need to recurse deep into the sub-expressions. Let's try it out:

## Attempt 3: Hybrid peer resolution and no implicit cast

We look at our first example.

```
int32_t y = foo();
int64_t x = bar();
double w = x + (y * 2); // Error
```

This is an error, but we can do two different things in order to make it work, depending on what behaviour we want:

```
// A
double w = x + (y * 2LL); // Promote y
// B
double w = x + (int64_t)(y * 2); // Promote y * 2
```

Yes, this some extra work, but also note that suddenly we have much better control over what the actual types are compared to the "perfect" promotion. Also note that changing the type of x cannot silently change semantics here.

The second example:

```
int32_t y = foo();
int64_t x = bar();
int32_t max = INT32_MAX;
double w = x + (y + (INT32_MAX + 1)); // Error
```

Again we get an error, and again there are multiple ways to remove this ambiguity. To promote the internal expression to use int64\_t, we just have to nudge it a little bit:

```
double w = x + (y + (INT32_MAX + 1LL)); // Ok!
```

And of course if we want C behaviour, we simply put the cast outside:

```
double w = x + (int64_t)(y + (INT32_MAX + 1)); // Ok!
```

Note here how effective the type of the literal is in nudging the semantics in the correct direction!

## Adding narrowing to "attempt 3"

For narrowing we have multiple options, the simplest is following the Java model, although it could be considered to be unnecessarily conservative.

The current C3 model uses a "original type / active type" model. This makes it hard do any checks, like accepting `char c1 = c + 127` but rejecting `char c1 = c + 256` on account of `256` overflowing `char`.

If this type checking system is altered, it should be possible to instead pass a "required max type" downwards. The difference is in practice only if literals that exceed the left-hand side are rejected.

For most other purposes they work, and seem fairly safe as they are a restricted variant of C semantics. There is already an implementation of this in C3 compiler.

## Handling unsigned conversions

The current model in C3 allow free implicit conversions between signed and unsigned types of the same size. However, the result is the signed type rather than the unsigned.

However, naively promoting all types to signed doesn't work well:

```
ushort c = 2;
uint d = 0x80000000;
uint e = d / 2; // => c0000000 ????
// If it was e = (uint)((int)d / (int)2);
```

Consequently C3 tries to promote to the signedness of the underlying type:

```
uint e = d / 2; 
// e = d / (uint)2; 
// => 0x40000000
```

Given the lack of languages with this sort of promotion, there might very well be serious issues with it, but in such cases we could limit unsigned conversion to the cases where it's fairly safe. For now though, let's keep this behaviour until we have more solid examples of it creating serious issues.

### Summarizing attempt 3:

1. We define a **receiving type**, which is the parameter type the expression is passed as a value to, or the variable type for in the case of an assignment. This receiving type may also be empty. Example: `short a = foo + (b / c)`, in this case the type is `short`.
2. We define a **widening safe expression** as any expression except: add, sub, mult, div, rem, left/right shift, bit negate, negate, ternary, bit or/xor/and.
3. We define a **widening allowed expression** as a binary add, sub, mult, div where the sub expressions are **widening safe expressions**.
4. Doing a depth first traversal on sub expressions, the following occurs in order:
   1. The type is checked.
   2. If the type is an integer and has a smaller bit width than the minimum arithmetic integer width, then it is cast to the corresponding minimum integer with the same signedness.
5. If the expression is a binary add/sub/div/mod/mult/bit or/ bit xor/bit and then the following are applied in order.
   1. If both sub expressions are integers but of different size, check the smaller sub expression. If the smaller sub expression is a **widening safe expression** insert a widening cast to the same size, with retained signedness. Otherwise, if the smaller sub expression is a **widening allowed expression**, insert a widening cast to the same size with retained signedness on the smaller expression's two sub expressions. Otherwise this is a type error.
   2. If one sub expression is an unsigned integer, and the other is signed, and the signed is non-negative constant literal, then the literal sub expression is cast to type of the unsigned sub expression.
   3. If one sub expression is unsigned and the other is signed, the unsigned is cast to the signed type.
   4. If one sub expression is bool or integer, and the other is a floating point type, then the integer sub expression is cast to the
6. Using the **receiving type**, ignoring inserted implicit casts, recursively check sub expressions:
   1. If the type is wider than the **receiving type**, and the sub expression is a literal which does not fit in the **receiving type**, this is a literal out of range error.
   2. the **receiving type**, and the sub expression is a not a literal, and the sub expression's type is wider than the **receiving type** then this is an error.
   3. If an explicit cast is encountered, set **receiving type** for sub expression checking to empty.

Wheew! That was a lot and fairly complex. We can sum it up a bit simpler:

1. Implicit narrowing only works if all sub expressions would fit in the target type.
2. Implicit widening will only be done on non-arithmetic expressions or simple `+-/%*` binary expressions. In the second case the widening is done on the sub expressions rather than the binary expression as a whole.
3. Integer literals can be implicitly cast to any type as long as it fits in the resulting type.

## Conclusion

We tried three different semantics for implicit conversions using typed literals. A limited hybrid solution (our attempt 3) doesn't immediately break and consequently warrants some further investigation, but we're extremely far from saying that "this is good". Quite the opposite, we should treat as likely broken in multiple ways, where our task is to find out where.

We've already attempted various solutions, just to find corner cases with fairly awful semantics, even leaving aside implementation issues.

So it should be fairly clear that there are no perfect solutions, but only trade-offs to various degrees. (That said, some solutions are clearly worse than others)

It's also very clear that a healthy skepticism is needed towards one's designs and ideas. What looks excellent and clear today may tomorrow turn out to have fatal flaws. Backtracking and fixing flaws should be part of the design process and I believe it's important to keep an open mind, because as you research you might find that feature X which you thought was really good / really bad, is in fact the opposite.

When doing language design it's probably good to be mentally prepared to be wrong a lot.

(Also see the [follow up](https://c3.handmade.network/blog/p/8138-fixing_bugs_in_our_proposal), where we patch some of the problems!)

## Comments


---
### Comment by Christoffer Lernö

As a reminder, in the [last article](https://c3.handmade.network/blog/p/8108-promotion_strategies_with_typed_literals) I listed the following strategies:

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

To begin with, we'll try the "Early fold, late cast" for widening.
This is essentially a modification on the peer resolution widening.

## Attempt 1 - "Early fold, late cast"

Here we first fold all constants, then "peer promote" the types *recursively* downwards. How this differs from C is illustrated below:

```
int32_t y = foo();
int64_t x = bar();
double w = x + (y * 2);
// C semantics:
// double w = (double)(x + (int64_t)(y * 2));
// Early fold, late cast:
// double w = (double)(x + ((int64_t)y * (int64_t)2));
```

So far this looks pretty nice, but unfortunately the "early fold" part has less positive consequences:

```
int32_t y = foo();
int64_t x = bar();
int32_t max = INT32_MAX;
double w = x + (y + (INT32_MAX + 1));
double w2 = x + (y + (max + 1));
// Early fold, late cast:
// double w = (double)(x + ((int64_t)y + (int64_t)-2147483648));
// double w2 = (double)(x + ((int64_t)y 
//             + ((int64_t)max + (int64_t)1)));
```

The good thing about this wart is that it is at least locally observable - as long as it's clear from the source code what will be constant folded.

All in all, while slightly improving the semantics, we can't claim to have solved all the problems with peer resolution while the semantics got more complicated.

## Attempt 2 "Re-evaluation"

This strategy is more theoretical than anything. With this strategy we attempt to first evaluate the maximum type, then re-evaluate everything by casting to this maximum type. It's possible to do this in multiple ways: deep copying the expression, two types of evaluation passes etc.

Our problematic example from *attempt 1* works:

```
int32_t y = foo();
int64_t x = bar();
int32_t max = INT32_MAX;
double w = x + (y + (INT32_MAX + 1));
// => first pass type analysis: int64_t + (int32_t + (int + int))
// => max type in sub expression is int64_t
// => double w = (double)(x + ((int64_t)y 
//               + ((int64_t)INT_MAX + (int64_t)1)));
```

However, we somewhat surprisingly get code that are hard to reason about locally even in this case:

```
// elsewhere int64_t x = ... or int32_t x = ... 
int32_t y = foo();
double w = x + (y << 16);
// If x is int64_t:
// double w = (double)(x + ((int64_t)y << 16));
// If x is int32_t
// double w = (double)(x + (y << 16));
```

Here it's clear that we get different behaviour: in the case of `int32_t` the bits are shifted out, whereas for `int64_t` they are retained. There are better (but more complicated) examples to illustrate this, but it is proving that even with "ideal" semantics, we lose locality.

## Rethinking "perfect"

Let's go back to the example we had with Java in the last article:

```
char d = 1;
char c = 1 + d; // Error
char c = (char)(1 + d); // Ok
```

In this case the first is ok, but the second isn't. The special case takes care of the most common use, but for anything non-trivial an explicit cast is needed.

What if we would say that this is okay:

```
int64_t x = foo();
int32_t y = bar();
double w = x + y
```

But this isn't:

```
int64_t x = foo();
int32_t y = bar();
double w = x + (y + y);
//             ^^^^^^^
// Error, can't implicitly promote complex expression
// of type int32_t to int64_t.
```

Basically we give up widening *except* for where we don't need to recurse deep into the sub-expressions. Let's try it out:

## Attempt 3: Hybrid peer resolution and no implicit cast

We look at our first example.

```
int32_t y = foo();
int64_t x = bar();
double w = x + (y * 2); // Error
```

This is an error, but we can do two different things in order to make it work, depending on what behaviour we want:

```
// A
double w = x + (y * 2LL); // Promote y
// B
double w = x + (int64_t)(y * 2); // Promote y * 2
```

Yes, this some extra work, but also note that suddenly we have much better control over what the actual types are compared to the "perfect" promotion. Also note that changing the type of x cannot silently change semantics here.

The second example:

```
int32_t y = foo();
int64_t x = bar();
int32_t max = INT32_MAX;
double w = x + (y + (INT32_MAX + 1)); // Error
```

Again we get an error, and again there are multiple ways to remove this ambiguity. To promote the internal expression to use int64\_t, we just have to nudge it a little bit:

```
double w = x + (y + (INT32_MAX + 1LL)); // Ok!
```

And of course if we want C behaviour, we simply put the cast outside:

```
double w = x + (int64_t)(y + (INT32_MAX + 1)); // Ok!
```

Note here how effective the type of the literal is in nudging the semantics in the correct direction!

## Adding narrowing to "attempt 3"

For narrowing we have multiple options, the simplest is following the Java model, although it could be considered to be unnecessarily conservative.

The current C3 model uses a "original type / active type" model. This makes it hard do any checks, like accepting `char c1 = c + 127` but rejecting `char c1 = c + 256` on account of `256` overflowing `char`.

If this type checking system is altered, it should be possible to instead pass a "required max type" downwards. The difference is in practice only if literals that exceed the left-hand side are rejected.

For most other purposes they work, and seem fairly safe as they are a restricted variant of C semantics. There is already an implementation of this in C3 compiler.

## Handling unsigned conversions

The current model in C3 allow free implicit conversions between signed and unsigned types of the same size. However, the result is the signed type rather than the unsigned.

However, naively promoting all types to signed doesn't work well:

```
ushort c = 2;
uint d = 0x80000000;
uint e = d / 2; // => c0000000 ????
// If it was e = (uint)((int)d / (int)2);
```

Consequently C3 tries to promote to the signedness of the underlying type:

```
uint e = d / 2; 
// e = d / (uint)2; 
// => 0x40000000
```

Given the lack of languages with this sort of promotion, there might very well be serious issues with it, but in such cases we could limit unsigned conversion to the cases where it's fairly safe. For now though, let's keep this behaviour until we have more solid examples of it creating serious issues.

### Summarizing attempt 3:

1. We define a **receiving type**, which is the parameter type the expression is passed as a value to, or the variable type for in the case of an assignment. This receiving type may also be empty. Example: `short a = foo + (b / c)`, in this case the type is `short`.
2. We define a **widening safe expression** as any expression except: add, sub, mult, div, rem, left/right shift, bit negate, negate, ternary, bit or/xor/and.
3. We define a **widening allowed expression** as a binary add, sub, mult, div where the sub expressions are **widening safe expressions**.
4. Doing a depth first traversal on sub expressions, the following occurs in order:
   1. The type is checked.
   2. If the type is an integer and has a smaller bit width than the minimum arithmetic integer width, then it is cast to the corresponding minimum integer with the same signedness.
5. If the expression is a binary add/sub/div/mod/mult/bit or/ bit xor/bit and then the following are applied in order.
   1. If both sub expressions are integers but of different size, check the smaller sub expression. If the smaller sub expression is a **widening safe expression** insert a widening cast to the same size, with retained signedness. Otherwise, if the smaller sub expression is a **widening allowed expression**, insert a widening cast to the same size with retained signedness on the smaller expression's two sub expressions. Otherwise this is a type error.
   2. If one sub expression is an unsigned integer, and the other is signed, and the signed is non-negative constant literal, then the literal sub expression is cast to type of the unsigned sub expression.
   3. If one sub expression is unsigned and the other is signed, the unsigned is cast to the signed type.
   4. If one sub expression is bool or integer, and the other is a floating point type, then the integer sub expression is cast to the
6. Using the **receiving type**, ignoring inserted implicit casts, recursively check sub expressions:
   1. If the type is wider than the **receiving type**, and the sub expression is a literal which does not fit in the **receiving type**, this is a literal out of range error.
   2. the **receiving type**, and the sub expression is a not a literal, and the sub expression's type is wider than the **receiving type** then this is an error.
   3. If an explicit cast is encountered, set **receiving type** for sub expression checking to empty.

Wheew! That was a lot and fairly complex. We can sum it up a bit simpler:

1. Implicit narrowing only works if all sub expressions would fit in the target type.
2. Implicit widening will only be done on non-arithmetic expressions or simple `+-/%*` binary expressions. In the second case the widening is done on the sub expressions rather than the binary expression as a whole.
3. Integer literals can be implicitly cast to any type as long as it fits in the resulting type.

## Conclusion

We tried three different semantics for implicit conversions using typed literals. A limited hybrid solution (our attempt 3) doesn't immediately break and consequently warrants some further investigation, but we're extremely far from saying that "this is good". Quite the opposite, we should treat as likely broken in multiple ways, where our task is to find out where.

We've already attempted various solutions, just to find corner cases with fairly awful semantics, even leaving aside implementation issues.

So it should be fairly clear that there are no perfect solutions, but only trade-offs to various degrees. (That said, some solutions are clearly worse than others)

It's also very clear that a healthy skepticism is needed towards one's designs and ideas. What looks excellent and clear today may tomorrow turn out to have fatal flaws. Backtracking and fixing flaws should be part of the design process and I believe it's important to keep an open mind, because as you research you might find that feature X which you thought was really good / really bad, is in fact the opposite.

When doing language design it's probably good to be mentally prepared to be wrong a lot.

(Also see the [follow up](https://c3.handmade.network/blog/p/8138-fixing_bugs_in_our_proposal), where we patch some of the problems!)