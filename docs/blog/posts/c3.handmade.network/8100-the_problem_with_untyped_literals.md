---
title: "The problem with untyped literals"
date: 2021-09-29
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8100-the_problem_with_untyped_literals](https://c3.handmade.network/blog/p/8100-the_problem_with_untyped_literals)*

## A brief introduction

From Go to Swift, the idea of untyped literals – in particular numbers – have been popularized.
This means that a number like `123` or `283718237218731239821738` doesn't have a type until it needs to fit into a variable or an expression, and at that time it's converted into the type needed.

Usually (but not always), this also allows the expression to hold numbers that exceed the type limit as long as it can be folded into the valid range. So `100000000000000 * 123 / 100000000000000` would be a valid 32-bit integer, even though some sub expressions would not fit, since the constant folded result is `123`.

This is not merely to avoid adding type suffixes (as an example, in C or C++ we would need to explicitly add `L` or `LL` to represent `5000000000` since it would not fit in the default type, which (today) usually is a 32 bit int) – but it's also to avoid casts.

Go, Swift and Rust all have versions of untyped literals, and they're (not coincidentally) also always requiring casts between differently sized integer types. What this means is that in normal cases, something like `short_var1 = short_var2 + 30` would otherwise require a cast to change `30` in our case to a `short` type rather than the default `int`. If C required casts for literals everywhere, this is what it would look like(!):

```
short foo = (short)1;
char c = (char)0;
short bar = foo + (short)3;
int baz = (int)bar + (int)c;
```

So to summarize: untyped literals help to reduce the need for casts, while also freeing the user
from thinking too much about the exact type of the literals.

## All is not simplicity

While this works well for the most part, there is an issue when no type can be inferred from the surroundings. A simple example is this:

```
bool bar = (foo() ? 1 : 2) == (bar() ? 2 : 1);
```

This looks a bit contrived, but there are actual cases where something like this arises. In the example there is no type to guide what runtime type `1` and `2` should have, and yet it needs to be an actual runtime type as this expression must be resolved at runtime.

So what do we do? There are three possibilities:

1. Make it an error.
2. Use a default type.
3. Derive a type from the values.

Each of those have advantages and disadvantages that pop up in different situations.
It's worth pointing out that both Go and Swift picks variants of (2).

## Hard mode: Add implicit type conversion

An important reason why Go has untyped literals is because it's lacking implicit type conversions. But having untyped literals looks like a good improvement on status quo,
which is likely why it was picked up by Zig. I likewise found this an interesting solution for C3 and implemented it.

Unfortunately it turns out there are additional problems when having implicit type conversions. Here is an example:

```
short a = bar();
char c = foo();
// Where does widening occur here?
int d = a + 2 * (c + 3);
```

In the above example there are a lot of options. Let's start with how this was initially (naively) implemented in C3:

```
int d = (int)(a + (short)((char)2 * (c + (char)3)));
```

Regardless whether we have wrapping arithmetics or traps, this - which Zig terms "peer resolution" - is probably not what we want.

Let's remind us that in C we get:

```
int d = (int)a + ((int)2) * ((int)c + (int)3));
```

This illustrates the limitations in trying to infer type by looking at the other operand in a binary expression, the actual behaviour is likely not what you want.

Because Go or Rust would require explicit casts for such an expression, the obfuscation that occurs with implicit widening just don't apply. Trying to add `a` to the term to the right would be an error, and assigning the result of that to `d` would be an error as well.

This worrying behaviour with implicit conversions made me switch C3 to a very C-ish solution: the compiler would promote all operands to either `int` *or* the type of the left side assigned variable / parameter if that was wider.

```
int d = a + 2 * (c + 3); // As if =>
// int d = (int)a + ((int)2) * ((int)c + (int)3));
long f = a + 2 * (c + 3); // As if =>
// long f = (long)a + ((long)2) * ((long)c + (long)3));
```

This simplified the semantics for the user and it's not overly hard to understand which seemed to make it a somewhat acceptable tradeoff.

## Macro problems

Unfortunately there are more places where untyped literals creates worries: Let's say you're writing a macro. The macro should take a value and store it into a temporary variable:

```
macro foo(x)
{
  $typeof(x) y = x;
  while (y-- > 0) do_something();
}
```

When we use this with a variable, everything's fine, but it breaks when we (quite reasonably) try to use it with a literal.

```
int z = 3;
@foo(z); // Works! 
@foo(3); // Error: tries to use an untyped literal
```

This is probably not what we wanted. Using numbers as arguments to macros is a common usecase and must work.

Our three "solutions" to this yield different semantics:

With *(1) - making it an error*, we basically need to have a cast every time. Writing `@foo((int)(3))` is not particularly impressive and makes the language feel rather uncooked.

With *(2) - using a default type*, everything works as long as the untyped literal is small enough to fit the default type. But if it exceeds it then explicit casts are needed. Depending on the macro this may be common or rare. This is better than *(1)*, but still not perfect.

*(3) - picking a type depending on size* seems to allow the greatest flexibility, here we could pick an `int` as default and `long` if it doesn't fit the `int`. This is actually also its weakness: should something that fit in an `ulong` use a signed 128 bit int, or should the value switch to unsigned? If the latter, should the progression be `int` → `uint` → `long` → `ulong`? If so then behaviour may change as the value goes from unsigned to signed and this quite hidden from the reader. And what if unsigned is what we expect but suddenly we get a signed by mistake? And if it just picks signed values, then for every time we need unsigned we need to make a cast?

For languages without implicit conversion, picking (2) will often go a long way: the default type will, if unexpected, cause compile time errors, which makes it fairly easy to spot.

## Is untyped literals a good idea?

Running into these kinds of problems at least make me stop and reconsider my decisions: are untyped literals really a good idea?

I think that judging from the above, the drawbacks are significantly bigger for languages with implicit casts like Zig or C3. Once macros/generic functions are added to the mix this further complicates matters.

If we look at Go, then without generics it has neither of these problems. Therefore it seems to be a fairly clear win, especially since Go can leverage the typeless literals to remove casts.

In C3 on the other hand, the only gain is really to allow bigint compile time folding and avoiding literal suffixes. Other than that it is mostly complicating the language.

That seems to indicate that C3 might benefit from more traditional, typed, literals.

So in the [next blog article](https://c3.handmade.network/blog/p/8108-promotion_strategies_with_typed_literals) I plan to look at what issues would arise from actually adding typed literals (there might be surprises!), and if they'd really solve any meaningful problems for C3.

## Comments


---
### Comment by Christoffer Lernö

## A brief introduction

From Go to Swift, the idea of untyped literals – in particular numbers – have been popularized.
This means that a number like `123` or `283718237218731239821738` doesn't have a type until it needs to fit into a variable or an expression, and at that time it's converted into the type needed.

Usually (but not always), this also allows the expression to hold numbers that exceed the type limit as long as it can be folded into the valid range. So `100000000000000 * 123 / 100000000000000` would be a valid 32-bit integer, even though some sub expressions would not fit, since the constant folded result is `123`.

This is not merely to avoid adding type suffixes (as an example, in C or C++ we would need to explicitly add `L` or `LL` to represent `5000000000` since it would not fit in the default type, which (today) usually is a 32 bit int) – but it's also to avoid casts.

Go, Swift and Rust all have versions of untyped literals, and they're (not coincidentally) also always requiring casts between differently sized integer types. What this means is that in normal cases, something like `short_var1 = short_var2 + 30` would otherwise require a cast to change `30` in our case to a `short` type rather than the default `int`. If C required casts for literals everywhere, this is what it would look like(!):

```
short foo = (short)1;
char c = (char)0;
short bar = foo + (short)3;
int baz = (int)bar + (int)c;
```

So to summarize: untyped literals help to reduce the need for casts, while also freeing the user
from thinking too much about the exact type of the literals.

## All is not simplicity

While this works well for the most part, there is an issue when no type can be inferred from the surroundings. A simple example is this:

```
bool bar = (foo() ? 1 : 2) == (bar() ? 2 : 1);
```

This looks a bit contrived, but there are actual cases where something like this arises. In the example there is no type to guide what runtime type `1` and `2` should have, and yet it needs to be an actual runtime type as this expression must be resolved at runtime.

So what do we do? There are three possibilities:

1. Make it an error.
2. Use a default type.
3. Derive a type from the values.

Each of those have advantages and disadvantages that pop up in different situations.
It's worth pointing out that both Go and Swift picks variants of (2).

## Hard mode: Add implicit type conversion

An important reason why Go has untyped literals is because it's lacking implicit type conversions. But having untyped literals looks like a good improvement on status quo,
which is likely why it was picked up by Zig. I likewise found this an interesting solution for C3 and implemented it.

Unfortunately it turns out there are additional problems when having implicit type conversions. Here is an example:

```
short a = bar();
char c = foo();
// Where does widening occur here?
int d = a + 2 * (c + 3);
```

In the above example there are a lot of options. Let's start with how this was initially (naively) implemented in C3:

```
int d = (int)(a + (short)((char)2 * (c + (char)3)));
```

Regardless whether we have wrapping arithmetics or traps, this - which Zig terms "peer resolution" - is probably not what we want.

Let's remind us that in C we get:

```
int d = (int)a + ((int)2) * ((int)c + (int)3));
```

This illustrates the limitations in trying to infer type by looking at the other operand in a binary expression, the actual behaviour is likely not what you want.

Because Go or Rust would require explicit casts for such an expression, the obfuscation that occurs with implicit widening just don't apply. Trying to add `a` to the term to the right would be an error, and assigning the result of that to `d` would be an error as well.

This worrying behaviour with implicit conversions made me switch C3 to a very C-ish solution: the compiler would promote all operands to either `int` *or* the type of the left side assigned variable / parameter if that was wider.

```
int d = a + 2 * (c + 3); // As if =>
// int d = (int)a + ((int)2) * ((int)c + (int)3));
long f = a + 2 * (c + 3); // As if =>
// long f = (long)a + ((long)2) * ((long)c + (long)3));
```

This simplified the semantics for the user and it's not overly hard to understand which seemed to make it a somewhat acceptable tradeoff.

## Macro problems

Unfortunately there are more places where untyped literals creates worries: Let's say you're writing a macro. The macro should take a value and store it into a temporary variable:

```
macro foo(x)
{
  $typeof(x) y = x;
  while (y-- > 0) do_something();
}
```

When we use this with a variable, everything's fine, but it breaks when we (quite reasonably) try to use it with a literal.

```
int z = 3;
@foo(z); // Works! 
@foo(3); // Error: tries to use an untyped literal
```

This is probably not what we wanted. Using numbers as arguments to macros is a common usecase and must work.

Our three "solutions" to this yield different semantics:

With *(1) - making it an error*, we basically need to have a cast every time. Writing `@foo((int)(3))` is not particularly impressive and makes the language feel rather uncooked.

With *(2) - using a default type*, everything works as long as the untyped literal is small enough to fit the default type. But if it exceeds it then explicit casts are needed. Depending on the macro this may be common or rare. This is better than *(1)*, but still not perfect.

*(3) - picking a type depending on size* seems to allow the greatest flexibility, here we could pick an `int` as default and `long` if it doesn't fit the `int`. This is actually also its weakness: should something that fit in an `ulong` use a signed 128 bit int, or should the value switch to unsigned? If the latter, should the progression be `int` → `uint` → `long` → `ulong`? If so then behaviour may change as the value goes from unsigned to signed and this quite hidden from the reader. And what if unsigned is what we expect but suddenly we get a signed by mistake? And if it just picks signed values, then for every time we need unsigned we need to make a cast?

For languages without implicit conversion, picking (2) will often go a long way: the default type will, if unexpected, cause compile time errors, which makes it fairly easy to spot.

## Is untyped literals a good idea?

Running into these kinds of problems at least make me stop and reconsider my decisions: are untyped literals really a good idea?

I think that judging from the above, the drawbacks are significantly bigger for languages with implicit casts like Zig or C3. Once macros/generic functions are added to the mix this further complicates matters.

If we look at Go, then without generics it has neither of these problems. Therefore it seems to be a fairly clear win, especially since Go can leverage the typeless literals to remove casts.

In C3 on the other hand, the only gain is really to allow bigint compile time folding and avoiding literal suffixes. Other than that it is mostly complicating the language.

That seems to indicate that C3 might benefit from more traditional, typed, literals.

So in the [next blog article](https://c3.handmade.network/blog/p/8108-promotion_strategies_with_typed_literals) I plan to look at what issues would arise from actually adding typed literals (there might be surprises!), and if they'd really solve any meaningful problems for C3.