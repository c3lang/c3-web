---
title: "On arithmetics and overflow"
date: 2021-02-23
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/on-arithmetics-and-overflow-1kob](https://dev.to/lerno/on-arithmetics-and-overflow-1kob)*

It is generally understood that overflowing an add or a multiplication is usually a bad thing. This seems to imply that the solution is to detect and trap (quit the program or throw an exception) on such errors. But as we will see, the answer isn't that clear cut.

## Commutative and associative addition?

Typically when we work with integers, we prefer that the ordering of the operands doesn't matter. For example, if we see `a + b + c` we'd prefer that `(a + b) + c` is the same as `a + (b + c)`.

Unfortunately, if we trap for overflow this does not hold. Here is an example:

```c
int a = INT_MAX;
int b = 20;
int c = -20;
int d = a + b + c;
```

If we trap on overflow then `(a + b) + c` would trap, but `a + (b + c)` would not. Ooops.

In C the former is even undefined behaviour. Let's pick an `unsigned` example:

```c
unsigned a = UINT_MAX;
unsigned b = 20;
unsigned c = 20;
unsigned d = a + b - c;
```

Because overflow is wrapping in C, this is well defined and gives the expected result. In languages where even *unsigned* overflow is trapped, such as Swift, this will similarly trap or not trap depending on evaluation order. For unsigned we can also design an common overflow (sometimes called an underflow) by having a possible negative intermediate value:

```c
unsigned a = 20;
unsigned b = 0;
unsigned c = 20;
unsigned d = a + b - c;
```

In this case the overflow will happens if we evaluate `a + (b - c)`. Again this is not a problem in C, but will be a problem if the language traps the overflow.

## Trapping overflow fixes actual bugs

So is trapping overflow bad? If they create subtle problems (in particularly in C where it's undefined behaviour), shouldn't we always wrap?

Again, the problem is not as simple as that. With trapping overflow we catch this exploit:

```c
char *ptr = malloc(a * b);
...
ptr[a * i + j + offset] = some_value;
```

We can see here that if there is no trap on overflow, then we can pick `a` and `b` so that the allocated size overflows into a small value, and then `some_value` actually will be written out of bounds.

(This is from an actual exploited overflow in the wilds.)

Some people will point out that with proper bounds checking then the exploit cannot occur either. But that relies on proper bounds being known. It's probably possible to rewrite the code in the example to use *slices* (pointer + length) with bounds checking, but in general we can't rely on that to fix all the various overflows.

## A detour: mixed signedness

A quick question: "What should the type of an unsigned int added to a signed int be?"

For C the answer is "an unsigned int", in C# the answer is "a long".

The C answer seems bad, surely we want something signed to be safe? But there's a reason to this apparent madness:

```c
unsigned a = INT_MAX + 10U;
int b = -10;
...
int d = a + b;
```

In the example above, is the result well defined? – Well, yes it is! All the operands are converted into unsigned and then wrapping addition is performed, followed by an implicit cast back to an integer value.

What had happened if C instead had did a cast on the unsigned to a signed integer? Well `INT_MAX + 10U` results in a large negative number, we then subtract 10 from that value, which results in a value less than `INT_MIN`, which in C is undefined behaviour due to the overflow.

Because signed ints have undefined behaviour for overflow, it's safer to cast to unsigned in C. Implicit conversion between signed and unsigned representations means that the code looks very simple and is mostly right, even though it does clever things.

So what about languages with trapping overflow?

The usual case is that such languages require explicit casts. Let's try that:

```c
unsigned a = INT_MAX + 10U;
int b = -10;
...
int d = (int)a + b; // BOOM!
```

Ok, that didn't work. What about this:

```c
unsigned a = INT_MAX + 10U;
int b = -10;
...
int d = (int)(a + (unsigned)b); // Also BOOM!
```

In the second case the unsigned version of `b` becomes a large positive number, causing the unsigned add to overflow as well.

If you think about it this is quite natural: unsigned maths uses 2s complement numbers and wrapping overflow to represent negative numbers, so without wrapping behaviour adding negative numbers can't work.

Let's look at another common example, now with unsigned:

```c
unsigned x = 10;
int change = -1;
x = x + change;
```

Again this "just works" since C gladly converts `change` to an unsigned value even if it's negative and it just works. With overflow trap on unsigned again it won't work.

Let's look at how we currently could solve this in Zig:

```zig
var x : u32 = 10;
var change : i32 = -1;
x = x +% @bitCast(u32, change);
```

Let's break it down: `@bitCast` is needed to convert the `i32` in the same way `(unsigned)change` would do in C.

Now once we have this 2s complement unsigned, we request wrapping addition using the `+%` operator (Zig has wrapping operator counterparts for all arithmetics operations).

Problem solved!

... Or wait? What happened to our overflow check? For example we could set `x = 0` and `change = -1` and this would happily just work without batting an eye.

The *real* solution that works and traps overflow looks like this:

```zig
x = @intCast(u32, @as(i64, x) + @as(i64, change));
```

So we first go to the larger type (`i64`) perform the add, then try to narrow that number to an `u32`, catching any negative numbers or numbers that exceed the maximum of `u32`.

Now we've come full circle:

1. Introduce trapping "by default" so it's easy to do the right thing.
2. Realize that some cases need to circumvent the trapping to be correct.
3. Find a "correct" solution that is very complicated that people are supposed to follow to do the right thing.

## Enter the left hand side

Unfortunately we're not done yet listing the problems, what about this:

```c
int a = INT_MAX;
long long b = a + a / 2;
```

Is that UB assuming `long long` is larger than `int`? In C, sure it is. What the person writing this probably wanted was the following:

```c
int a = INT_MAX;
long long b = (long long)a + (long long)a / 2;
```

Mostly people don't run into this due to C's promotion rules. For example:

```c
short a = 0x7FFF;
int b = a + a / 2;
```

Will do "the right thing" on all platforms where the `int` is at least 32 bits. This is because C implicitly converts all arguments to an `int` before performing any arithmetic operation.

But as demonstrated by the above examples that only gets you so far. There is a recent language trend to perform arithmetics with the native bit width, leading to new unexpected results (this example is Zig):

```zig
var num1 : i8 = 16;
var num2 : i32 = 3;
var res : i32 = num2 + num1 * num1; // BOOM!
```

Here the multiplication is performed using signed 8 bits, which will overflow on `16 * 16`, even it later would have been promoted to `i32` for the addition.

These are hard to spot errors that will yield runtime errors but look fine to the compiler.

It would be reasonable that the left hand side guides the type used on the right hand side in the assignment, but that adds complexity that few languages want to take on.

## Summary

1. Overflow traps cause unexpected and hard-to-spot non commutative and associative behaviour in expressions that otherwise would have been fine.
2. Wrapping behaviour enables buffer overflows and similar exploits.
3. Overflow traps on unsigned integers makes the mixed signedness case very hard to get right.
4. In most languages it doesn't matter if the left hand sign can contain the number, what matters are the types on the right hand side, which isn't always intuitive or desired.

In my next post I'll investigate ways to try to improve on the status quo.