---
title: "Fixing lexical scopes... badly"
date: 2021-12-21
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8272-fixing_lexical_scopes..._badly](https://c3.handmade.network/blog/p/8272-fixing_lexical_scopes..._badly)*

[Last time](https://c3.handmade.network/blog/p/8271-implementing_lexical_scopes_in_a_simple_but_wrong_way) we were looking at this example:

```
macro int testmacro(int x)
{
  int z = 2;
  for (int i = 0; i < x; i++)
  {
    z *= 2;
  }
  return z;
}     

fn int test(int y)
{
  int z = getValue(y);
  int x = @testmacro(z);
  return z + x;
}
```

In our previous solution, we had the variables in an array, where each scope would keep track of the current and last
local. Before entering the `testmacro`, this list is `[int y, int z, int x]`, but entering the macro we would get
`[int y, int z, int x, int x, int z]`. Which would mean shadowing.

A naive solution would be name mangling, let's say macro names are prefixed with something:
`[int y, int z, int x, int _testmacro$x, int _testmacro$z`. Our lookup must then:

1. Lookup with the macro prefix.
2. If not found, lookup without the macro prefix, but in this case only accept globals.

Aside from not actually solving later problems, it's complex for no real benefit, because we can essentially
insert a sentinel in the list: `[int y, int z, int x, SENTINEL, int x, int z]`.

Now when we scan back we always stop at the sentinel value. This means that entering the macro scope we simply
push the sentinel value on the stack of locals (this is not the only way to introduce the same effect, but
it's the simplest version to explain). When looking up locals in the array we can now stop as soon as we reach either
the first element OR the sentinel value.

Problem solved?

### Resolution without hierarchies

If your macro resolution only takes values, then this solution is sufficient. However, often we want to use
macros to provide an expression that only *conditionally* is evaluated. In C3 we use `#` in front of the variable
identifier to indicate an unresolved expression.

```
macro foo(#expr)
{
  return #expr * #expr;
}
fn int test(int z)
{
  return @foo(call(z));
  // => return call(z) * call(z);
}
```

Now we're running into problems. Both `z` and `call` should be resolved in the `test` function scope. Ooops.

What happens if we tag the `#expr` with the current scope? This seems like it could work, but in C3, like with GCC
statement expressions, we can introduce new variables.

```
macro int two_times(#expr)
{
  int w = 1;
  #expr;
  #expr;
  return w;
}
  
fn void test2(int z)
{
  @two_times({| int y = z; call(y); |});
}
```

So we go into `two_times` with `[int z]`, then add `w` for `[int z, SENTINEL, int w]`. Now when we evaluate `two_times`
we would like something like this: `[int z, int y, SENTINEL, int w]`. That is, we slip in a new scope in the function
scope, and not in the macro scope we pushed.

#### Trying a hack

What we might realize here is that if we evaluate `expr` just to the declaration before entering, so that all
declarations ar resolved, we might just get the behaviour we want. So something like this:

1. Enter test2 scope
2. Push z
3. Start evaluating the macro call.
4. Take the macro call argument and only check the declarations.
5. Enter expr scope
6. Push y
7. Resolve z
8. Resolve y
9. Pop expr scope
10. Pass in this pre-checked expression into the macro.
11. Enter the two\_times scope
12. Push w
13. Copy `#expr` and insert it.
14. Evaluate `#expr` - which will not need a lookup
15. Copy `#expr` and insert it.
16. Evaluate `#expr` - which will not need a lookup
17. Lookup w
18. Pop the macro scope
19. Pop the test2 scope

This scheme *looks* like it would work, but there are questions: what if the declarations inside should not be resolved
the same way twice? What if the `expr` instead looks like:

```
@two_times({|
  $if (@some_compile_time_macro(...)):
    int y = 0;
  $else:
    int z = 0;
  $endif;
  $if ($defined(y)):
    y = 1;
  $endif;
|});
```

Here it's not clear that two invocations of the same `expr` will even lower to the same declarations! So we can't
do the lookup ahead of time.

The alternative is to completely evaluate `expr`, not just the declarations. It's a possible solution, but
the corner cases with this approach are hard to foresee.

#### Summary

If our macros only take values then we can retain a simple model for symbol lookup using a single stack. However, if
we can provide expressions or even statements, then these need to not only resolve symbols in the original scope but
also possibly introduce them. Pre-checking expressions do not work well with compile time evaluation, since they
may change every evaluation.

But maybe there is some way to salvage the model? We'll look at that next.

## Comments


---
### Comment by Christoffer Lernö

[Last time](https://c3.handmade.network/blog/p/8271-implementing_lexical_scopes_in_a_simple_but_wrong_way) we were looking at this example:

```
macro int testmacro(int x)
{
  int z = 2;
  for (int i = 0; i < x; i++)
  {
    z *= 2;
  }
  return z;
}     

fn int test(int y)
{
  int z = getValue(y);
  int x = @testmacro(z);
  return z + x;
}
```

In our previous solution, we had the variables in an array, where each scope would keep track of the current and last
local. Before entering the `testmacro`, this list is `[int y, int z, int x]`, but entering the macro we would get
`[int y, int z, int x, int x, int z]`. Which would mean shadowing.

A naive solution would be name mangling, let's say macro names are prefixed with something:
`[int y, int z, int x, int _testmacro$x, int _testmacro$z`. Our lookup must then:

1. Lookup with the macro prefix.
2. If not found, lookup without the macro prefix, but in this case only accept globals.

Aside from not actually solving later problems, it's complex for no real benefit, because we can essentially
insert a sentinel in the list: `[int y, int z, int x, SENTINEL, int x, int z]`.

Now when we scan back we always stop at the sentinel value. This means that entering the macro scope we simply
push the sentinel value on the stack of locals (this is not the only way to introduce the same effect, but
it's the simplest version to explain). When looking up locals in the array we can now stop as soon as we reach either
the first element OR the sentinel value.

Problem solved?

### Resolution without hierarchies

If your macro resolution only takes values, then this solution is sufficient. However, often we want to use
macros to provide an expression that only *conditionally* is evaluated. In C3 we use `#` in front of the variable
identifier to indicate an unresolved expression.

```
macro foo(#expr)
{
  return #expr * #expr;
}
fn int test(int z)
{
  return @foo(call(z));
  // => return call(z) * call(z);
}
```

Now we're running into problems. Both `z` and `call` should be resolved in the `test` function scope. Ooops.

What happens if we tag the `#expr` with the current scope? This seems like it could work, but in C3, like with GCC
statement expressions, we can introduce new variables.

```
macro int two_times(#expr)
{
  int w = 1;
  #expr;
  #expr;
  return w;
}
  
fn void test2(int z)
{
  @two_times({| int y = z; call(y); |});
}
```

So we go into `two_times` with `[int z]`, then add `w` for `[int z, SENTINEL, int w]`. Now when we evaluate `two_times`
we would like something like this: `[int z, int y, SENTINEL, int w]`. That is, we slip in a new scope in the function
scope, and not in the macro scope we pushed.

#### Trying a hack

What we might realize here is that if we evaluate `expr` just to the declaration before entering, so that all
declarations ar resolved, we might just get the behaviour we want. So something like this:

1. Enter test2 scope
2. Push z
3. Start evaluating the macro call.
4. Take the macro call argument and only check the declarations.
5. Enter expr scope
6. Push y
7. Resolve z
8. Resolve y
9. Pop expr scope
10. Pass in this pre-checked expression into the macro.
11. Enter the two\_times scope
12. Push w
13. Copy `#expr` and insert it.
14. Evaluate `#expr` - which will not need a lookup
15. Copy `#expr` and insert it.
16. Evaluate `#expr` - which will not need a lookup
17. Lookup w
18. Pop the macro scope
19. Pop the test2 scope

This scheme *looks* like it would work, but there are questions: what if the declarations inside should not be resolved
the same way twice? What if the `expr` instead looks like:

```
@two_times({|
  $if (@some_compile_time_macro(...)):
    int y = 0;
  $else:
    int z = 0;
  $endif;
  $if ($defined(y)):
    y = 1;
  $endif;
|});
```

Here it's not clear that two invocations of the same `expr` will even lower to the same declarations! So we can't
do the lookup ahead of time.

The alternative is to completely evaluate `expr`, not just the declarations. It's a possible solution, but
the corner cases with this approach are hard to foresee.

#### Summary

If our macros only take values then we can retain a simple model for symbol lookup using a single stack. However, if
we can provide expressions or even statements, then these need to not only resolve symbols in the original scope but
also possibly introduce them. Pre-checking expressions do not work well with compile time evaluation, since they
may change every evaluation.

But maybe there is some way to salvage the model? We'll look at that next.