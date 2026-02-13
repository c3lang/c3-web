---
title: Naming Rules
description: Naming Rules
sidebar:
    order: 41
---

C3 introduces fairly rigid naming rules to reduce ambiguity and make the language easy to parse for tools.

As a basic rule, all identifiers are limited to a-z, A-Z, 0-9 and `_`. The initial character can not be a number. Furthermore, all identifiers are limited to 31 character.

### Structs, unions, enums, typedefs and aliasses

All user defined types must start with A-Z after any optional initial `_` and include at least 1 lower case letter. `Bar`, `_T_i12` and `TTi` are all valid names. `_1`, `bAR` and `BAR` are not. For C-compatibility it's possible to alias the type to a external name using the attribute "cname".

```c3
struct Foo @cname("foo")
{
    int x;
    Bar bar;
}

union Bar
{
    int i;
    double d;
}

enum Baz
{
    VALUE_1,
    VALUE_2
}
```

### Variables and parameters

All variables and parameters *except for* global constant variables must start with a-z after any optional initial `_`. `___a` `fooBar` and `_test_` are all valid variable / parameter names. `_`, `_Bar`, `X` are not.

```c3
int theGlobal = 1;

fn void foo(int x)
{
    Foo foo = getFoo(x);
    theGlobal++;
}
```

### Global constants

Global constants must start with A-Z after any optional initial `_`. `_FOO2`, `BAR_FOO`, `X` are all valid global constants, `_`, `_bar`, `x` are not.

```c3
const int A_VALUE = 12;
```

### Enum / Fault members

`enum` and `faultdef` members follow the same naming standard as global constants.

```c3
enum Baz
{
    VALUE_1,
    VALUE_2
}

faultdef OOPS, LOTS_OF_OOPS;
```

### Struct / union members

Struct and union members follow the same naming rules as variables.

### Modules

Module names may contain a-z, 0-9 and `_`, no upper case characters are allowed.

```
module foo;
```

### Functions and macros

Functions and macros must start with a-z after any optional initial `_`.

```c3
fn int anotherFunction()
{
}

macro justDoIt(x)
{
    justDo(x);
}
```

## C3 recommended code style

While C3 doesn't mandate a particular style of naming, the standard library nonetheless uses naming conventions which are recommended for official bindings and standard library contributions:

```c3
alias MyInt = int;    // Types use PascalCase
struct SomeStructType
{
    int a_field;      // Members use snake_case
    double foo_baz;
}
int some_global = 1;  // Globals use snake_case
fn void some_function(int a_param) // Functions and parameters use snake_case
{
    int foo_bar = 4;  // Locals use snake_case
}
// Methods use snake_case, and the first parameter is usually called "self"
fn void SomeStructType.call_me(self, int a)
{
    some_function(self.a_field + a);
}
// Macros use snake_case
macro @some_macro(a)
{
    return a + a;
}
const MY_FOO = 123; // Constants use SCREAMING_SNAKE_CASE
```

So in short:
1. Types use `PascalCase`
2. Constants use `SCREAMING_SNAKE_CASE`
3. Everything else uses `snake_case`

Brace style is often a controversial topic. The C3 standard library uses Allman brace style:
```c3
fn int allman(int foo)
{
    if (foo > 2)
    {
        foo++;
    }
    else
    {
        foo *= foo;
    }
    return foo;
}
```

For canonical C3 code outside of the stdlib and vendor (the official binding repository), prefer either Allman or K&R:

```c3
fn int k_and_r(int foo)
{
    if (foo > 2) {
        foo++;
    } else {
        foo *= foo;
    }
    return foo;
}
```

Regarding tab-vs-spaces, contributions to the C3 stdlib or vendor should use tabs for indentation and spaces for formatting.
