---
title: C3 For C Programmers
description: A quick primer on C3 for C programmers
sidebar:
    order: 36
---

## Overview
This is intended for existing C programmers.

This primer is intended as a guide to how the C syntax –
and in some cases C semantics – is different in C3. It is intended to help you take a piece of C code and understand
how it can be converted manually to C3.

## Struct, Enum And Union Declarations

Don't add a `;` after enum, struct and union declarations, and note the slightly
different syntax for declaring a named struct inside of a struct.

```c
// C
typedef struct
{
    int a;
    struct
    {
        double x;
    } bar;
} Foo;

// C3
struct Foo
{
    int a;
    struct bar
    {
        double x;
    }
}
```

Also, user defined types are used without a `struct`, `union` or `enum` keyword, as
if the name was a C typedef.

## Arrays

Array sizes are written next to the type and arrays do not decay to pointers,
you need to do it manually:

```c
// C
int x[2] = { 1, 2 };
int *y = x;

// C3
int[2] x = { 1, 2 };
int* y = &x;
```

You will probably prefer slices to pointers when passing data around:

```c
// C
int x[100] = ...;
int y[30] = ...;
int z[15] = ...;
sort_my_array(x, 100);
sort_my_array(y, 30);
// Sort part of the array!
sort_my_array(z + 1, 10);

// C3
int[100] x = ...;
int[30] y = ...;
sort_my_array(&x); // Implicit conversion from int[100]* -> int[]
sort_my_array(&y); // Implicit conversion from int[30]* -> int[]
sort_my_array(z[1..10]); // Inclusive ranges!
```

Note that declaring an array of inferred size will look different in C3:

```c
// C
int x[] = { 1, 2, 3 }; // x is int[3]

// C3
int[*] x = { 1, 2, 3 }; // x is int[3]
```

Arrays are trivially copyable:

```c
// C
int x[3] = ...;
int y[3];
for (int i = 0; i < 3; i++) y[i] = x[i];

// C3
int[3] x = ...;
int[3] y = x;
```

Find out more about [arrays](/language-common/arrays/).

## Undefined Behaviour

C3 has less undefined behaviour, in particular integers are defined as using 2s
complement and signed overflow is wrapping. Find out more about [undefined behaviour](/language-rules/undefined-behaviour/).

## Functions

Functions are declared like C, but you need to put `fn` in front:

```c
// C:
int foo(Foo *b, int x, void *z) { ... }

// C3
fn int foo(Foo* b, int x, void* z) { ... }
```

Find out more more about [functions](/language-fundamentals/functions/), including named arguments and default arguments.

## Calling C Functions

Declare a function (or variable) with `extern` and it will be possible to
access it from C3:

```c3
// To access puts:
extern fn int puts(char*);
...
puts("Hello world");
```

Note that currently only the C standard library is automatically passed to the linker.
In order to link with other libraries, you need to explicitly tell
the compiler to link them.

If you want to use a different identifier inside of your C3 code compared to
the function or variable's external name, use the `@cname` attribute:

```c3
extern fn int _puts(char* message) @cname("puts");
...
_puts("Hello world"); // <- calls the puts function in libc
```

## Identifiers

Name standards are enforced:

```c3
// Starting with uppercase and followed somewhere by at least
// one lower case is a user defined type:
Foo x;
M____y y;

// Starting with lowercase is a variable or a function or a member name:

x.myval = 1;
int z = 123;
fn void fooBar(int x) { ... }

// Only upper case is a constant or an enum value:

const int FOOBAR = 123;
enum Test
{
    STATE_A,
    STATE_B
}
```

## Variable Declaration

Multiple declarations together with initialization isn't allowed in C3:

```c
// C
int a, b = 4; // Not allowed in C3

// C3
int a;
int b = 4;
```

In C3, variables are always zero initialized, unless you explicitly opt out using `@noinit`:

```c
// C
int a = 0;
int b;

// C3
int a;
int b @noinit;
```

## C's `typedef` and `#define` become `alias`

C's `typedef` is replaced by `alias`:

```c
// C
typedef Foo* FooPtr;

// C3
alias FooPtr = Foo*;
```

`alias` also allows you to do things that C uses `#define` for:

```c
// C
#define println puts
#define my_excellent_string my_string

char *my_string = "Party on";
...
println(my_excellent_string);

// C3
alias println = puts;
alias my_excellent_string = my_string;

char* my_string = "Party on";
...
println(my_excellent_string);
```

Find out more about [`alias`](/language-common/alias/).


## `typedef` creates new types

`typedef` in C3 creates a new type with it's own methods, and the original type cannot implictly convert to this new type, unless cast.

```c
typedef MyId = int;

fn void get_by_id(MyId id)
{
    return;
}

fn test()
{
    MyId valid = 7;
    int invalid = 7;
    get_by_id(valid); // allowed
    get_by_id(invalid); // not allowed
}
```


## Basic Types

Several C types that would be variable sized are fixed size, and others changed names:

```c
// C
int16_t a;
int32_t b;
int64_t c;
uint64_t d;
size_t e;
ssize_t f;
ptrdiff_t g;
intptr_t h;

// C3
short a;    // Guaranteed 16 bits
int b;      // Guaranteed 32 bits
long c;     // Guaranteed 64 bits
ulong d;    // Guaranteed 64 bits
int128 e;   // Guaranteed 128 bits
uint128 f;  // Guaranteed 128 bits
usz g;      // Same as C size_t, depends on target
isz h;      // Same as C ptrdiff_t
iptr i;     // Same as intptr_t depends on target
uptr j;     // Same as uintptr_t depends on target
```

Find out more about [types](/language-overview/types/).

## Modules And Import Instead Of `#include`

Declaring the module name is not mandatory, but if you leave it out the file name will be used
as the module name. Imports are recursive.

```c3
module otherlib::foo;

fn void test() { ... }
struct FooStruct { ... }

module mylib::bar;
import otherlib;
fn void myCheck()
{
    foo::test(); // foo prefix is mandatory.
    mylib::foo::test(); // This also works;
    FooStruct x; // But user defined types don't need the prefix.
    otherlib::foo::FooStruct y; // But it is allowed.
}
```

## Comments

The `/* */` comments are nesting

```text
/* This /* will all */ be commented out */
```

Note that doc contracts starting with `<*` and ending with `*>`, have special rules for parsing them, and are _not_ considered a regular comment. Find out more about [contracts](/language-common/contracts/).

C3 also treats `#!` on the first line as a line comment `//`.

## Type Qualifiers

Qualifiers like `const` and `volatile` are removed, but `const` before a constant
will make it treated as a compile time constant. The constant does not need to be typed.

```c3
const A = false;
// Compile time
$if A:
  // This will not be compiled
$else
  // This will be compiled
$endif
```

`volatile` is replaced by macros for volatile load and store.

## `goto` Removed

`goto` is removed, but there is labelled `break` and `continue` as well as `defer`
to handle the cases when it is commonly used in C.

```c
// C
Foo *foo = malloc(sizeof(Foo));

if (tryFoo(foo)) goto FAIL;
if (modifyFoo(foo)) goto FAIL;

free(foo);
return true;

FAIL:
free(foo);
return false;
```

```c3
// C3, direct translation:
do FAIL:
{
    Foo* foo = malloc(Foo.sizeof);

    if (tryFoo(foo)) break FAIL;
    if (modifyFoo(foo)) break FAIL;

    free(foo);
    return true;
};
free(foo);
return false;

// C3, using defer:
Foo* foo = malloc(Foo.sizeof);
defer free(foo);

if (tryFoo(foo)) return false;
if (modifyFoo(foo)) return false;

return true;
```

## Changes To `enum` and introducing `constdef`

C3 enums gives new features, such as returning the name of the enum value at runtime. Their underlying representation always starts at 0 without gaps. For C enums with gaps, C3 uses `constdef` instead:

```c
// C 
enum Foo
{
    ABC,
    DEF,
    GHI
};
enum Bar
{
    OOPS = 4,
    HELLO,
    TESTME = 10
};       

void test(enum Bar b, enum Foo f)
{
    printf("%d %d\n", b, f);
}

void testme()
{
    // prints "4 1"
    test(OOPS, DEF);
}
```

```c3
// C3
import std::io;
enum Foo
{
    ABC,
    DEF,
    GHI
}
constdef Bar
{
    OOPS = 4,
    HELLO,
    TESTME = 10
}

fn void test(Bar b, Foo f)
{
    io::printfn("%s %s", b, f);
}

fn void testme()
{
    // prints "4 DEF"
    test(OOPS, DEF);
}
```

Read more about enums [here](/language-overview/enum).

## Changes To `switch`

- `case` statements automatically break.
- Use `nextcase` to fallthrough to the next statement.
- Empty `case` statements have implicit fallthrough.

For example:

```c
// C
switch (a)
{
    case 1:       // Implicit fall-through
    case 2:
        doOne();
        break;    // Explicit break
    case 3:
        i = 0;    // Implicit fall-through
    case 4:
        doFour();
        break;    // Explicit break
    case 5:
        doFive(); // Implicit fall-through
    default:
        return false;
}

// C3
switch (a)
{
    case 1:       // Empty case implicit fall-through
    case 2:
        doOne();  // Automatic break
    case 3:
        i = 0;
        nextcase; // Explicit fall-through
    case 4:
        doFour(); // Automatic break
    case 5:
        doFive();
        nextcase; // Explicit fall-through
    default:
        return false;
}
```

We can jump to an arbitrary switch-case label in C3:

```c3
// C
switch (a)
{
    case 1:
        doOne();
        goto LABEL3;
    case 2:
        doTwo();
        break;
    case 3:
    LABEL3:
        doThree();
    default:
        return false;
}

// C3
switch (a)
{
    case 1:
        doOne();
        nextcase 3;
    case 2:
        doTwo();
    case 3:
        doThree();
        nextcase;
    default:
        return false;
}
```

## Bitfields Are Replaced By Explicit Bitstructs

A bitstruct has an explicit container type, and each field has an exact bit range.

```c3
bitstruct Foo : short
{
    int a : 0..2; // Exact bit ranges, bits 0-2
    uint b : 3..6;
    MyEnum c : 7..13;
}
```

There exists a simplified form for a bitstruct containing only booleans,
it is the same except the ranges are left out:

```c3
bitstruct Flags : char
{
    bool has_hyperdrive;
    bool has_tractorbeam;
    bool has_plasmatorpedoes;
}
```

For more information see [the section on bitstructs](/language-overview/types//#bitstructs).

## Other Changes

The following things are enhancements to C, that don't have an equivalent in C.

- [Defer](/language-common/defer/)
- [Methods](/language-fundamentals/functions/#methods)
- [Optionals](/language-common/optionals-essential/#what-is-an-optional)
- [Semantic macros](/generic-programming/macros/)
- [Generic modules](/generic-programming/generics/)
- [Contracts](/language-common/contracts/)
- [Compile time evaluation](/generic-programming/compiletime/)
- [Reflection](/generic-programming/reflection/)
- [Operator overloading](/generic-programming/operator-overloading/)
- [Macro methods](/generic-programming/macros/#macro-methods)
- [Static initialize and finalize functions](/language-fundamentals/functions/#static-initializer-and-finalizers)
- [Dynamic interfaces](/generic-programming/anyinterfaces/)

**For the full list of all new features** see the [feature list](/faq/allfeatures/).

Finally, the [FAQ](/faq/) answers many questions you might have as you start out.
