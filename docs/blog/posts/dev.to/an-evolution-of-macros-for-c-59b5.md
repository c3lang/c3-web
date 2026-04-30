---
title: "An evolution of macros for C"
date: 2020-01-28
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/an-evolution-of-macros-for-c-59b5](https://dev.to/lerno/an-evolution-of-macros-for-c-59b5)*

*(This text was previously published on Medium)*

I’ve been trying for a long time to think up a good macro system that could replace or extend the C preprocessor and yet be as easy and approachable.

There has recently been a lot of interesting work on alternatives to C and C++, and consequently those languages have tried to fix both macros and templates. In some languages, like Rust, there’s a very rich set of tools to extend the language, the inspiration here has clearly come from languages like LISP where macros have been a way to expand the language itself. There are other approaches though: both Zig and Jai uses compile time execution of the language to avoid any specialized macro syntax. Zig is notable for making this a large part of the language.

In many ways those macro systems are to C’s as a strong typed language is to C’s weakly typed one. The increased type and error control also means added complexity in defining macros. If we write a language that overall is much stricter than C, then this is both fine and necessary. But for C, do we really want to constrict ourselves?

What would a sort of “incremental” improvement for a macro system for C look like? Can we make a minimal extension that doesn’t feel like we’re making a whole new language?

Let us make an attempt!

---

**Step 1**, we could make multiline `#define`s more readable by adding `{ }` to implicitly allow row breaks:

```
#define foo(a, b) \
  int x = run_foo(a, b); \
  if (x > 0) printf("We got foo!\n");

// => 

#define foo(a, b) {
  int x = run_foo(a, b);
  if (x > 0) printf("We got foo!\n");
}
```

**Step 2**, accidentally shadowing other variables is bad. Let’s create unique variable names on demand by a prefix of `$` inside a `#define`:

```
#define foo(a, b) {
  int $x = run_foo(a, b);
  if ($x > 0) printf("We got foo!\n")
}

foo(1, 2); // $x expands to __foo_x_1
foo(100, 20); // $x expands to __foo_x_2 (increment by one for each time expanded)
```

**Step 3**, `__typeof__` is needed to do a lot of nice macros, let’s lift it to a sanctioned `typeof` function. We can now rewrite GCC’s MAX:

```
#define max(a,b) \
   ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a > _b ? _a : _b; })

#define max(a, b) {
  ({
    typeof(a) $a = (a);
    typeof(b) $b = (b);
    $a > $b ? $a : $b;  
  })
}
```

This is about as far as we should take `#define`. For more advanced macros we need a new syntax.

**Step 4**, let’s define non-preprocessor macros using a new `macro` keyword.


```
macro foo(&a, &b) {
  int $x = run_foo(a, b);
  if ($x > 0) printf("We got foo!\n")
}
```

Note the slightly odd “&” prefix. This means we import the entire expression or variable into the scope. Without we simply use the value, so here are the two equivalent versions of `max`:

```
macro max(&a, &b) {
  typeof(a) $a = (a); // (1)
  typeof(b) $b = (b); // (2)
  return $a > $b ? $a : $b; // Return automatically makes this an expression statement.
}

// If we do not use &a, &b then we get evaluated values 
// instead, making it look like
// an untyped version of a static inlined function. The macro 
// below is exactly equivalent to the one at the top.
macro max(a, b) {
  return a > b ? a : b;
}
```

Since `macro` is largely hygienic, `break` and `return` are meaningless in the top scope of the body. For that reason we can reuse `return` to indicate that the macro returns a value, that is, it should be treated as an expression. This allows us to skip `({ })`

**Step 5**: Wrapping something "inside" of a macro is a pain, so for our final extension, let’s define a trailing body parameter that can be expanded:

```
macro for_from_to(a, b, macro body) {
  for (typeof(a) $x = a; $x <= b; $x++) {
    body();
  }    
}

for_from_to(1, 100) {
  printf("Again!\n"); 
}

// expands to:

for (int __for_from_to_x_1 = 1; __for_from_to_x_1 <= 100; __for_from_to_x_1++) {
  printf("Again!\n");
}

macro for_from_to(a, b, macro($v) body) {
  for (typeof(a) $x = 0; $x < a; $x++) {
    body($x);
  }    
}

times_do(1, 100) {
  printf("Loop: %d\n", $v);
}

// expands to:

for (int __for_from_to_x_1 = 1; __for_from_to_x_1 <= 100; __for_from_to_x_1++) {
  printf("Loop: %d\n", __for_from_to_x_1);
}
```

The trailing body is expanded inside of the macro as if it was a macro itself.

---

In the examples above I’ve tried to extend and expand on the C macros rather than replacing it. The new `macro` function is simply an evolved subset of `#define` that can be parsed as normal C except for the lack of types (giving a compiler the ability to issue a lot more errors directly at the macro definition).

This is not the only direction we could have taken the language. Another approach could have been to make it possible to parameterize static inlined functions instead. Those are steps instead of solving a part of the macro problem domain using generic function. In this direction we also have parameterized (generic) structs.

That, however, would bring a significant change to the language. Similarly, a “Rust-like” macro system could offer both expressiveness and safety, but it would be more of a revolution than an evolution.

Sometimes the latter is what you want.
