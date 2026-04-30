---
title: "Fixing \"bugs\" in our proposal"
date: 2021-10-05
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8138-fixing_bugs_in_our_proposal](https://c3.handmade.network/blog/p/8138-fixing_bugs_in_our_proposal)*

When we [last left off](https://c3.handmade.network/blog/p/8134-attempting_new_c3_type_conversion_semantics) we had our "attempt 3" which seemed like a promising candidate to research. We expected some problems and here are two:

1. What is the behaviour of when there is both "top down" casts and peer casts? This was never discussed. For example: `x_u64 = a_i32 + b_u32`. As we will see, making the wrong choice here will create overflow bugs.
2. When are constants folded? This matters since we only recursively applied casts the right-hand side is a binary expression. But does that check happen before or after constant folding? The proposal seems to imply it's after, but that would give weird semantics.

### Top down casts & peer casts

Our "test" here is this expression:

```
int32_t a = ...;
uint32_t b = ...;
uint64_t c = a + b;

// Peer -> top down:
uint64_t c = (uint64_t)a + (uint64_t)(int32_t)(b)
```

For some surprising results, set `b = 0x80000000U` and `a = 1` → `c = 0xffffffff80000001ULL`. Top down → peer gives us our expected `c = 0x80000001ULL`.

It's very important that the resolution works in this order:

1. Check that `a` and `b` are valid **widening safe expressions** (see previous article for definition).
2. Evaluate `a` and `b` in isolation, before actually evaluating the binary expression.
3. Cast both to `uint64_t` (note that this differs from peer resolution which would preserve the signedness)
4. Semantically check the binary expression.

This gives us `uint64_t c = (uint64_t)a + (uint64_t)b` which presumably is what we want.

Another thing we need to note though, is that only integer widening + signedness changes happen this way. For example something like `ptrdiff_t x = ptr1 - ptr2` shouldn't start making casts on the pointers!

### When constant folding happens

Constants folded are either constants or literals (assume int 32 bit, long 64 bit):

```
const int FOO = 1;
const int BAR = 2;
int y = ...;
int i = ...;
int j = ...;
long a1 = y + (i + j); // Error, needs explicit cast.
long a2 = y + (FOO + BAR); // Error?
long a3 = y + (1 + 2); // Error?
```

Just arguing for consistency would seem to require that semantics are the same for variables and constants, and by extension also literals. This might be a little disappointing, but consider if one would expect `a` to be `-1`, which would be the case if we would fold constants first:

```
long a = INT_MAX * 2 + 1;
```

With late folding the result becomes:

```
long a = INT_MAX * 2 + 1; // Error, needs explicit cast.
long a2 = INT_MAX * 2; // => 0xfffffffe
long a3 = INT_MAX + 1; // => 0x80000000
```

Which is probably as good as it gets.

Another case is when the left hand side unsigned. In this case we do not actually perform the top down widening, but instead have a general cast on the result:

```
uint b = INT_MAX * 2 + 1; // => 0xffffffff
```

## Conclusion

So far so good, there is no showstopper here, but this serves as a reminder and example of how easy it is to forget implications.

## Comments


---
### Comment by Christoffer Lernö

When we [last left off](https://c3.handmade.network/blog/p/8134-attempting_new_c3_type_conversion_semantics) we had our "attempt 3" which seemed like a promising candidate to research. We expected some problems and here are two:

1. What is the behaviour of when there is both "top down" casts and peer casts? This was never discussed. For example: `x_u64 = a_i32 + b_u32`. As we will see, making the wrong choice here will create overflow bugs.
2. When are constants folded? This matters since we only recursively applied casts the right-hand side is a binary expression. But does that check happen before or after constant folding? The proposal seems to imply it's after, but that would give weird semantics.

### Top down casts & peer casts

Our "test" here is this expression:

```
int32_t a = ...;
uint32_t b = ...;
uint64_t c = a + b;

// Peer -> top down:
uint64_t c = (uint64_t)a + (uint64_t)(int32_t)(b)
```

For some surprising results, set `b = 0x80000000U` and `a = 1` → `c = 0xffffffff80000001ULL`. Top down → peer gives us our expected `c = 0x80000001ULL`.

It's very important that the resolution works in this order:

1. Check that `a` and `b` are valid **widening safe expressions** (see previous article for definition).
2. Evaluate `a` and `b` in isolation, before actually evaluating the binary expression.
3. Cast both to `uint64_t` (note that this differs from peer resolution which would preserve the signedness)
4. Semantically check the binary expression.

This gives us `uint64_t c = (uint64_t)a + (uint64_t)b` which presumably is what we want.

Another thing we need to note though, is that only integer widening + signedness changes happen this way. For example something like `ptrdiff_t x = ptr1 - ptr2` shouldn't start making casts on the pointers!

### When constant folding happens

Constants folded are either constants or literals (assume int 32 bit, long 64 bit):

```
const int FOO = 1;
const int BAR = 2;
int y = ...;
int i = ...;
int j = ...;
long a1 = y + (i + j); // Error, needs explicit cast.
long a2 = y + (FOO + BAR); // Error?
long a3 = y + (1 + 2); // Error?
```

Just arguing for consistency would seem to require that semantics are the same for variables and constants, and by extension also literals. This might be a little disappointing, but consider if one would expect `a` to be `-1`, which would be the case if we would fold constants first:

```
long a = INT_MAX * 2 + 1;
```

With late folding the result becomes:

```
long a = INT_MAX * 2 + 1; // Error, needs explicit cast.
long a2 = INT_MAX * 2; // => 0xfffffffe
long a3 = INT_MAX + 1; // => 0x80000000
```

Which is probably as good as it gets.

Another case is when the left hand side unsigned. In this case we do not actually perform the top down widening, but instead have a general cast on the result:

```
uint b = INT_MAX * 2 + 1; // => 0xffffffff
```

## Conclusion

So far so good, there is no showstopper here, but this serves as a reminder and example of how easy it is to forget implications.