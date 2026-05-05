---
title: "Too much power, too poor accuracy - the story of $checks in C3"
date: 2023-10-25
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8810-too_much_power%252C_too_poor_accuracy_-_the_story_of_checks_in_c3](https://c3.handmade.network/blog/p/8810-too_much_power%252C_too_poor_accuracy_-_the_story_of_checks_in_c3)*

Recently C3 lost its `$checks()` function. It would take any sequence of declarations and
expressions, and if it failed to semantically check anywhere, return false.

It was an extremely powerful and flexible way of testing pretty much anything at compile time. Some examples:

```
// Test if a value may be indexed:
$checks(a[0]);
// Test if something supports addition:
$checks(a + a);
// Test if you can assign something to the type of another variable
$checks(b = a);
// Test if you can call a function with the values of two variables
$checks(foo(a, b));
// Check if a type has a particular field
$checks(Foo x, x.my_field);
// Check if a type is ordered
$checks(Foo x, x < x);
```

In essence, `$checks` was a Swiss Army knife for compile-time validation, making it redundant to employ
multiple compile-time functions like `$defined(x)`. So, why did we part ways with `$checks` (and its contract counterpart `@checked`)?

Well, it turns out that with power comes also lack of clarity. Take, for example, the `$checks(foo(a, b))` call
– it could potentially fail for a multitude of reasons:

1. `foo` might not be visible in the scope.
2. `foo` needs to be called with the module name, e.g. `my_module::foo`
3. `foo` might not be a callable variable pointer or function.
4. `a` might not be visible in the scope.
5. `b` might not be visible in the scope.
6. `foo` might take fewer than 2 or more than 2 arguments.
7. There could be a type mismatch between `a` and the first parameter of `foo`.
8. There could be a type mismatch between `b` and the second parameter of `foo`.

So while we might have wanted to test for some of these, it might fail for any of the listed cases and there is no
way we can determine which one, unless we move it out of the `$checks` and test it so that it errors just the same way.

While this is a problem when *writing* the `$checks`, it also poses a problem when *refactoring*, as it is hard to tell
when you accidentally change something that breaks inside of `$checks`, causing it to reject legitimate parameters.

So `$checks` unfortunately combines power with inexactness. In fact, its power comes from being inexact and just
bundling all the implicit checks together.

### The alternative solution

C3 already had `$defined(...)` which would do a lightweight check if a variable or a field was defined. Its functionality
had almost completely been eclipsed by `$checks(...)` but now got a new life: `$defined` would semantically check *all
but the outermost part* of a nested expression. The final expression would then be conditionally checked.

The new behaviour was reminiscent of `$checks`, but would only have a single "tested" semantic check. For example,
`$defined(foo(a, b))` would return true if it checked correctly, and false *only* if "foo" wasn't callable or didn't
accept 2 arguments.

The downside is that `$defined` must be carefully crafted to correctly do each "test" it supports.

But all in all, this is a substantial upgrade to correct compile time checking, which is very important in C3.

---

Addition: without `$checks` the various examples instead become:

```
// Test if a value may be indexed:
$defined(a[0]);
// Test if something supports addition:
types::is_numerical($typeof(a))
// Test if you can assign something to the type of another variable
$assignable(a, $typeof(b));
// Test if you can call a function with the values of two variables
$defined(foo(a, b));
// Check if a type has a particular field
$defined(Foo{}.my_field);
// Check if a type is ordered
Foo.is_ordered
```

## Comments


---
### Comment by Christoffer Lernö

Recently C3 lost its `$checks()` function. It would take any sequence of declarations and
expressions, and if it failed to semantically check anywhere, return false.

It was an extremely powerful and flexible way of testing pretty much anything at compile time. Some examples:

```
// Test if a value may be indexed:
$checks(a[0]);
// Test if something supports addition:
$checks(a + a);
// Test if you can assign something to the type of another variable
$checks(b = a);
// Test if you can call a function with the values of two variables
$checks(foo(a, b));
// Check if a type has a particular field
$checks(Foo x, x.my_field);
// Check if a type is ordered
$checks(Foo x, x < x);
```

In essence, `$checks` was a Swiss Army knife for compile-time validation, making it redundant to employ
multiple compile-time functions like `$defined(x)`. So, why did we part ways with `$checks` (and its contract counterpart `@checked`)?

Well, it turns out that with power comes also lack of clarity. Take, for example, the `$checks(foo(a, b))` call
– it could potentially fail for a multitude of reasons:

1. `foo` might not be visible in the scope.
2. `foo` needs to be called with the module name, e.g. `my_module::foo`
3. `foo` might not be a callable variable pointer or function.
4. `a` might not be visible in the scope.
5. `b` might not be visible in the scope.
6. `foo` might take fewer than 2 or more than 2 arguments.
7. There could be a type mismatch between `a` and the first parameter of `foo`.
8. There could be a type mismatch between `b` and the second parameter of `foo`.

So while we might have wanted to test for some of these, it might fail for any of the listed cases and there is no
way we can determine which one, unless we move it out of the `$checks` and test it so that it errors just the same way.

While this is a problem when *writing* the `$checks`, it also poses a problem when *refactoring*, as it is hard to tell
when you accidentally change something that breaks inside of `$checks`, causing it to reject legitimate parameters.

So `$checks` unfortunately combines power with inexactness. In fact, its power comes from being inexact and just
bundling all the implicit checks together.

### The alternative solution

C3 already had `$defined(...)` which would do a lightweight check if a variable or a field was defined. Its functionality
had almost completely been eclipsed by `$checks(...)` but now got a new life: `$defined` would semantically check *all
but the outermost part* of a nested expression. The final expression would then be conditionally checked.

The new behaviour was reminiscent of `$checks`, but would only have a single "tested" semantic check. For example,
`$defined(foo(a, b))` would return true if it checked correctly, and false *only* if "foo" wasn't callable or didn't
accept 2 arguments.

The downside is that `$defined` must be carefully crafted to correctly do each "test" it supports.

But all in all, this is a substantial upgrade to correct compile time checking, which is very important in C3.

---

Addition: without `$checks` the various examples instead become:

```
// Test if a value may be indexed:
$defined(a[0]);
// Test if something supports addition:
types::is_numerical($typeof(a))
// Test if you can assign something to the type of another variable
$assignable(a, $typeof(b));
// Test if you can call a function with the values of two variables
$defined(foo(a, b));
// Check if a type has a particular field
$defined(Foo{}.my_field);
// Check if a type is ordered
Foo.is_ordered
```