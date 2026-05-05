---
title: "More on error handling in C3"
date: 2020-07-03
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/more-on-error-handling-in-c3-3bee](https://dev.to/lerno/more-on-error-handling-in-c3-3bee)*

When we left off, C3 was looking like this:

```
int! index = atoi(readLine());
if (index) {
  printf("Thx for the number\n");
  // Index is now int.
  ... 
 }
```

I somewhat off-handedly mentioned that some sort of `guard` statement would be needed to extract the error and the need to handle things like `index && index > 0`

As usual in language design, things become less easy the more you flesh out the spec.

The first obvious problem is using `if (index)` for unwrapping.

Here's a problematic piece of code:

```
bool! b = someCall();
// Is this checking if b is true or non error?
if (b) { ... }
```

A way around this would be to explicitly indicate the success check:

```
bool! b = someCall();
// Use the ? to indicate unwrapping
if (b?) { ... }
```

This seems fine, but now that we made `b?` doing implicit unwrapping we're making pretty complicated things possible:

```
bool! b = someCall();
if (i > 0 && b? && ((b = someCall())? || i > 100) { ... }
```

In the example above the compiler has to figure out that b might possibly have an error...

To deal with this we need to do real full [flow typing](https://en.wikipedia.org/wiki/Flow-sensitive_typing), which increases the complexity of implementing the compiler by quite a bit. That's not the only problem: flow typing means types implicitly change. A quick look at the code above - is it easy to see that `b` will not be unwrapped in the body?

So flow typing has both advantages and disadvantages.

One of the core principles I try to follow building this language is that it should not be hard to write a compiler for it. It's by necessity a multi pass compiler, but other things it's nice to keep simple.

There are ways to do so. For example, unwrapping might require what in other languages are called a "if-let":

```
bool! b = someCall();
if (bool b1 = b?) { ... }
```

Here there is no implicit unwrap, it's just another variable introduced in the scope. This is all well, but pretty verbose. It would be nice to have a shortcut for the `bool b = b?` case.

Again the language design becomes more complex than one likes. C3 has a pretty flexible `if` statement that allows you to write things like:

```
if (int a = foo(), b = bar(), int c = baz()) { ... }
```

However in this case only the final result (that of `baz()`) counts. If it looked like this:

```
if (int a = foo()?, b = bar(), int c = baz()) { ... }
```

We'd have to make sure that the call to `foo()` didn't return an error AND that `baz()` was non zero.

So what should we do?

It's time to take a step back and review our options without making assumptions that we unwrap things with `if`.

First let us construct our `guard` statement – the one taking  a block to execute if there is an error:

```
int! i = ...
catch (err = i)
{
   ... handle the error ...
}
```

We can do some very simple flow typing here:
1. If a variable is caught using a `catch`
2. And the catch has a jump at all exits
3. Then the variable can be types to the non failable version of it after the catch.

```
int! i = ...
catch (err = i)
{
   ...
   return;
}
// i is int here
```

So that works. This is much easier than if we hade overloaded `if` to handle error unwrapping. What if we introduce `try` to be like `if` but only for unwrapping:

```
try (int j = i) 
{ 
 ... only executes if i is not an error ...
}
try (i) 
{ 
 ... i is implicitly unwrapped to int ...
}
```

So to wrap up, here are some elements of the error handling:

```
int! i = ...

// Default value if it is an error
int j = i else 0;

// Jump on error
int k = i else return;

// Check error
try (i)
{
  printf("i was: %d\n", i);
}

// Conditional execution
// this line is only called
// if i is not an error.
printf("i was: %d\n", i);

// Composition:
bool! b = checkFoo(getFoo(i));
int! l = i + 1;

// Returning something that may be an error
if (z > 0) return i;

// Check if error
bool wasError = check(i);

// Check if success
bool wasSuccess = try(i);
 
// Returning an error
return MyError!;
```

The error handling still has some ways to go, but it's getting closer to something that also handles the various possible corner cases and not just the simplest use cases.