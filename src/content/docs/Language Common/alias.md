---
title: Alias
description: The `alias` statement
sidebar:
    order: 61
---

# The `alias` statement

The `alias` statement in C3 is intended for making new names for function pointers, identifiers and types.

## Defining a type alias

`alias <type alias> = <type>` creates a type alias. A Type `alias` needs to follow the naming convention of user defined types (i.e. capitalized
name with at least one lower case letter).

```c3
alias CharPtr = char*;
alias Numbers = int[10];
```

Function pointers _must_ be aliased in C3. The syntax is somewhat different from C:

```c3
alias Callback = fn void(int a, bool b);
```

This defines an alias to function pointer type of a function that returns nothing and requires two arguments: an int and a bool. Here is a sample usage:

```c3
Callback cb = my_callback;
cb(10, false);
```

## typedef types

A `typedef` creates a new type.
A `typedef` does _not_ implicitly convert to or from any other type, unlike a type `alias`.
Literals will convert to the `typedef` types if they would convert to the underlying type.

Because a `typedef` type is a new type, it can have its own methods, like any other user-defined type.

```c3
typedef Foo = int;
Foo f = 0; // Valid since 0 converts to an int.
f = f + 1;
int i = 1;
// f = f + i Error!
f = f + (Foo)i; // Valid
```

## typedef inline

When interacting with various APIs it is sometimes desirable for `typedef` types to implicitly convert *to*
its base type, but not *from* that type.

Behaviour here is analogous how structs may use `inline` to create struct subtypes.

```c3
typedef CString = char*;
typedef ZString = inline char*;
...
CString abc = "abc";
ZString alias = "alias";
// char* from_abc = abc; // Error!
char* from_def = alias; // Valid!
```

## Function and variable aliases

`alias` can also be used to create aliases for functions and variables.

The syntax is `alias <alias> = <original identifier>`.

```c3
fn void foo() { ... }
int foo_var;

alias bar = foo;
alias bar_var = foo_var;

fn void test()
{
  // These are the same:
  foo();
  bar();

  // These access the same variable:
  int x = foo_var;
  int y = bar_var;
}
```

## Using `alias` to create generic types, functions and variables

It is recommended to favour using alias to create aliases for parameterized types, but it can also be used for parameterized functions and variables:

```c3
import generic_foo;

// Parameterized function aliases
alias int_foo_call = generic_foo::foo_call {int};
alias double_foo_call = generic_foo::foo_call {double};

// Parameterized type aliases
alias IntFoo = Foo {int};
alias DoubleFoo = Foo {double};

// Parameterized global aliases
alias int_max_foo = generic_foo::max_foo {int};
alias double_max_foo = generic_foo::max_foo {double};
```

For more information, see the chapter on [generics](/generic-programming/generics/).

## Function pointer default arguments and named parameters

It is possible to attach default arguments to function pointer aliases. There is no requirement
that the function has the same default arguments. In fact, the function pointer may have
default arguments where the function doesn't have it and vice-versa. Calling the function
directly will then use the function's default arguments, and calling through the function pointer
will yield the function pointer alias' default argument.

Similarly, named parameter arguments follow the alias definition when calling through the
function pointer:

```c3
alias TestFn = fn void(int y = 123);

fn void test(int x = 5)
{
    io::printfn("X = %d", x);
}

fn void main()
{
    TestFn test2 = &test;
    test();         // Prints X = 5
    test2();        // Prints X = 123
    test(x: 3);     // Prints X = 3
    test2(y: 4);    // Prints X = 4
}
```
