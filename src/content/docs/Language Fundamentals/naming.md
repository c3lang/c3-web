---
title: Naming Rules
description: Naming Rules
sidebar:
    order: 41
---

C3 introduces fairly rigid naming rules to reduce ambiguity and make the language easy to parse for tools.

As a basic rule, all identifiers are limited to a-z, A-Z, 0-9 and `_`. The initial character can not be a number. Furthermore, all identifiers are limited to 31 character.

### Structs, unions, enums and faults

All user defined types must start with A-Z after any optional initial `_` and include at least 1 lower case letter. `Bar`, `_T_i12` and `TTi` are all valid names. `_1`, `bAR` and `BAR` are not. For C-compatibility it's possible to alias the type to a external name using the attribute "extern".

```c3
struct Foo @extern("foo")
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

faultdef OOPS, LOTS_OF_OOPS;
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

### Enum / Fault definitions

`enum` and `faultdef` definitions follow the same naming standard as global constants.

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
fn void theMostAmazingFunction()
{
    return;
}

macro justDoIt(x)
{
    justDo(x);
}
```