---
title: "Compile-time and short-circuit evaluation"
date: 2023-08-30
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8773-compile-time_and_short-circuit_evaluation](https://c3.handmade.network/blog/p/8773-compile-time_and_short-circuit_evaluation)*

Recently a user had a problem with the following code in C3:

```
$if $foo != "" && $foo[0] != '_':
    ...
$endif
```

As a reminder, compile time evaluation is distinguished using a `$` sigil, so in this case the idea was to check
whether the compile time variable `$foo` was an empty string, and if it wasn't, compare the first character with `'_'`.

If `$foo` is indeed an empty string, this code will fail at compile time.

This is because constant folding in C3 follows semantic evaluation, and a binary expression will first type check the
sub expressions `&&` was evaluated. That is, at compile time there is no short-circuit evaluation.

### The curious effect of short-circuit evaluation

We *could* say that for `&&` we only evaluate the left hand side, and if that one is `false`, then we don't
evaluate the rest. This is perfectly legitimate behaviour **BUT** it would mean this
would pass semantic checking as well:

```
if (false && okeoefkepofke[3.141592])
{
    ...
}
```

Why? Because constant folding would need to work the same way: we evaluate the first part to `false`, so now we
never check the expression `okeoefkepofke[3.141592]`.

So now we got this big piece of code that is wrong and never checked...

But obviously no one would write that, right? Except for something like this is quite reasonable code:

```
macro foo($foo)
{
  if ($foo && abc()) { ... }
}
```

This problem is not unique, people using any sort of dynamically typed scripting languages will be familiar
with this exact problem. And the solution – if you care about the code actually working – is to write more tests.

### Trying to eat the cake and keep it

One possibility one can consider, is to have short-circuit behaviour only in compile time constant environments, so:

```
// Const global? Don't evaluate the right hand side.
const bool FOO = false && foewkfoewkf[fefeji]; 

fn void test()
{
    // Compile time conditional? Don't evaluate the right hand side
    $if false && foofoekfe[kfiejfie]:
        ...
    $endif
    // And same with switch:
    $switch
        $case false && fokeokfe[ofkeofk]:
            ...
    $endswitch
    // But this would be an error:
    bool b = false && fokefoek[ofofke]; // Error!
}
```

But if "never short-circuiting" is annoying and unexpected, and "always short-circuiting" requires much more testing,
this "a little of both", creates a corner in the language which can be just as problematic as the former two.
Having expression evaluation behave differently depending on where it's evaluated, is something likely to confuse
even experienced users.

## As usual, language design is a trade-off

For C3, semantic checking is prioritized over compile time convenience.
I think everyone who's been working with macros in C3 knows the lazy evaluation
of macros can easily hide bugs already, and having short-circuiting constant evaluation
would just magnify this problem.

There are languages that consistently uses short-circuiting constant evaluation at compile time instead.
This allows leveraging this the feature for all its conditional compilation. Where C3 uses `$if` or `$switch`
and very clear "this is evaluated at compile time" blocks to facilitate finding compile-time bugs,
other languages may prefer to streamline the look of the code allowing compile-time and runtime
evaluation blur but also being consistent in following the same rules.
While this comes at the aforementioned added cost of testing, it might be a trade-off its users prefer.

## Comments


---
### Comment by Christoffer Lernö

Recently a user had a problem with the following code in C3:

```
$if $foo != "" && $foo[0] != '_':
    ...
$endif
```

As a reminder, compile time evaluation is distinguished using a `$` sigil, so in this case the idea was to check
whether the compile time variable `$foo` was an empty string, and if it wasn't, compare the first character with `'_'`.

If `$foo` is indeed an empty string, this code will fail at compile time.

This is because constant folding in C3 follows semantic evaluation, and a binary expression will first type check the
sub expressions `&&` was evaluated. That is, at compile time there is no short-circuit evaluation.

### The curious effect of short-circuit evaluation

We *could* say that for `&&` we only evaluate the left hand side, and if that one is `false`, then we don't
evaluate the rest. This is perfectly legitimate behaviour **BUT** it would mean this
would pass semantic checking as well:

```
if (false && okeoefkepofke[3.141592])
{
    ...
}
```

Why? Because constant folding would need to work the same way: we evaluate the first part to `false`, so now we
never check the expression `okeoefkepofke[3.141592]`.

So now we got this big piece of code that is wrong and never checked...

But obviously no one would write that, right? Except for something like this is quite reasonable code:

```
macro foo($foo)
{
  if ($foo && abc()) { ... }
}
```

This problem is not unique, people using any sort of dynamically typed scripting languages will be familiar
with this exact problem. And the solution – if you care about the code actually working – is to write more tests.

### Trying to eat the cake and keep it

One possibility one can consider, is to have short-circuit behaviour only in compile time constant environments, so:

```
// Const global? Don't evaluate the right hand side.
const bool FOO = false && foewkfoewkf[fefeji]; 

fn void test()
{
    // Compile time conditional? Don't evaluate the right hand side
    $if false && foofoekfe[kfiejfie]:
        ...
    $endif
    // And same with switch:
    $switch
        $case false && fokeokfe[ofkeofk]:
            ...
    $endswitch
    // But this would be an error:
    bool b = false && fokefoek[ofofke]; // Error!
}
```

But if "never short-circuiting" is annoying and unexpected, and "always short-circuiting" requires much more testing,
this "a little of both", creates a corner in the language which can be just as problematic as the former two.
Having expression evaluation behave differently depending on where it's evaluated, is something likely to confuse
even experienced users.

## As usual, language design is a trade-off

For C3, semantic checking is prioritized over compile time convenience.
I think everyone who's been working with macros in C3 knows the lazy evaluation
of macros can easily hide bugs already, and having short-circuiting constant evaluation
would just magnify this problem.

There are languages that consistently uses short-circuiting constant evaluation at compile time instead.
This allows leveraging this the feature for all its conditional compilation. Where C3 uses `$if` or `$switch`
and very clear "this is evaluated at compile time" blocks to facilitate finding compile-time bugs,
other languages may prefer to streamline the look of the code allowing compile-time and runtime
evaluation blur but also being consistent in following the same rules.
While this comes at the aforementioned added cost of testing, it might be a trade-off its users prefer.