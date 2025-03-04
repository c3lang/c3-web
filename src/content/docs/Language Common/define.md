---
title: Define
description: The `def` statement
sidebar:
    order: 61
---

# The `def` statement

The `def` statement in C3 is intended for aliasing identifiers and types.

## Defining a type alias

`def <type alias> = <type>` creates a type alias. Type aliases need to follow the name convention of user defined types (i.e. capitalized
names with at least one lower case letter).

```c3
def CharPtr = char*;
def Numbers = int[10];
```

Function pointers _must_ be aliased in C3. The syntax is somewhat different from C:

```c3
def Callback = fn void(int a, bool b);
```

This defines an alias to function pointer type of a function that returns nothing and requires two arguments: an int and a bool. Here is a sample usage:

```c3
Callback cb = my_callback;
cb(10, false);
```

## Distinct types

Similar to `def` aliases are `distinct` which create distinct new types. Unlike type aliases,
they do not implicitly convert to or from any other type.
Literals will convert to the distinct types if they would convert to the underlying type.

Because a distinct type is a standalone type, it can have its own methods, like any other user-defined type.

```c3
distinct Foo = int;
Foo f = 0; // Valid since 0 converts to an int.
f = f + 1;
int i = 1;
// f = f + i Error!
f = f + (Foo)i; // Valid
```

## Distinct inline

When interacting with various APIs it is sometimes desirable for distinct types to implicitly convert *to* 
its base type, but not *from* that type.

Behaviour here is analogous how structs may use `inline` to create struct subtypes.

```c3
distinct CString = char*;
distinct ZString = inline char*;
...
CString abc = "abc";
ZString def = "def";
// char* from_abc = abc; // Error!
char* from_def = def; // Valid!
```

## Function and variable aliases

`def` can also be used to create aliases for functions and variables.

The syntax is `def <alias> = <original identifier>`.

```c3
fn void foo() { ... }
int foo_var;

def bar = foo;
def bar_var = foo_var;

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

## Using `def` to create generic types, functions and variables

It is recommended to favour using def to create aliases for parameterized types, but it can also be used for parameterized functions and variables:

```c3
import generic_foo;

// Parameterized function aliases
def int_foo_call = generic_foo::foo_call(<int>);
def double_foo_call = generic_foo::foo_call(<double>);

// Parameterized type aliases
def IntFoo = Foo(<int>);
def DoubleFoo = Foo(<double>);

// Parameterized global aliases
def int_max_foo = generic_foo::max_foo(<int>);
def double_max_foo = generic_foo::max_foo(<double>);
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
def TestFn = fn void(int y = 123);

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
