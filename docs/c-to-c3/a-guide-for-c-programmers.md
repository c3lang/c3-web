---
title: A Guide For C Programmers
description: A quick primer on C3 for C programmers
---

## Overview
This is intended for existing C programmers.

This primer is intended as a guide to how the C syntax –
and in some cases C semantics – are different in C3. It is intended to help you take a piece of C code and understand how it can be converted manually to C3.

## Functions

Functions are declared like C, but you need to put `fn` in front:

```c
// C:
int foo(Foo *b, int x, void *z) { ... }
```
```c3
// C3
fn int foo(Foo* b, int x, void* z) { ... }
```

Find out more about [functions](../language-fundamentals/functions.md), including named arguments and default arguments.

### Calling C Functions

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

## New macro system

The old C macro system is replaced by a new C3 macro system. 

Read more about [semantic macros](../generic-programming/macros.md).

## Identifiers

### Naming standards

Name standards are strictly enforced, to simplify the C3 grammar:

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

### Multiple declarations are restricted

Multiple declaration with initialization isn't allowed in C3:

```c
// C
int a, b = 4; // Not allowed in C3
```
```c3
// C3
int a;
int b = 4;
```

In conditionals, a special form of multiple declarations is allowed but each must then provide its type:

```c3
for (int i = 0, int j = 1; i < 10; i++, j++) 
{  
    io::printfn("%d %d", i, j);
}
```

### Zero initialization by default

In C global variables are implicitly zeroed out, but local variables aren’t. In C3 both global and local variables are zeroed out by default, but may be *explicitly* undefined (using the `@noinit` attribute) if you wish to match the C behaviour.

```c
// C
int a = 0;
int b;
```
```c3
// C3
int a;
int b @noinit;
```


### Removal of the const type qualifier

The const qualifier is only retained for actual constant variables. C3 uses a special type of [post condition](../language-common/contracts.md) for functions to indicate that they do not alter input parameters.

```c3
<*
 This function ensures that foo is not changed in the function.
 @param [in] foo
 @param [out] bar
*>
fn void test(Foo* foo, Bar* bar)
{
    bar.y = foo.x;
    // foo.x = foo.x + 1 - compile time error, can't write to 'in' param.
    // int x = bar.y     - compile time error, can't read from an 'out' param.
}
```

## Expressions

### Bit operator precedence changed

Notably bit operations have higher precedence than +/- and comparison operators, making code like this: `a & b == c` evaluate like `(a & b) == c` instead of C's `a & (b == c)`. The elvis operator, `?:`, also binds tighter than ternary. See the page about [precedence rules](../language-rules/precedence.md).

### 0-prefix octal syntax removed

The old `0777` octal syntax present in C has been removed and replaced by a `0o` prefix in C3, e.g. `0o777`. Strings in C3 do not support octal sequences aside from `'\0'`.

## Member access using `.` even for pointers

The `->` operator is removed, access uses dot for both direct and pointer access. Note that this is just single access: to access a pointer of a pointer (e.g. `int**`) an explicit dereference would be needed.

In the special case of needing to dereference and index into an array, use `.[]` syntax:

```c3
int[3] a;
int[3]* b = &a; // Different from C!
// b[1] = 3; ERROR: expected an int[3] but got an int.
(*b)[1] = 3; // Works
b.[1] = 3; // Same as the above
```

This situation does not arise in C, due to pointer decay.

### Signed overflow is well-defined

Signed integer overflow always wraps using 2s complement. It is never undefined behaviour.

### Restrictions in implicit conversion rules

C3 does not permit implicit narrowing. Implicit widening is only allowed when there is only a single way to widen an expression.

Take the case of `long x = int_val_1 + int_val_2`. In C this would widen the result of the addition:
`long x = (long)(int_val_1 + int_val_2)`, but there is another possible
way to widen: `long x = (long)int_val_1 + (long)int_val_2`. So, in this case, the widening is disallowed in C3. However, `long x = int_val_1` is unambiguous, so C3 permits it just like C (read more on the [conversion page](../language-rules/conversion.md)).

### Evaluation order is well-defined

Evaluation order (after precedence, meaning when operators have equal precedence, a.k.a. associativity) is left-to-right. In assignment expressions, assignment happens after expression evaluation.

```c3
int a = foo() + bar(); // Always evaluates foo() before bar()
*(baz()) = foo(); // foo() evaluates before baz()
```

## Types

### Struct, Enum And Union Declarations

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
```
```c3
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

Also, user-defined types are used without a `struct`, `union` or `enum` keyword, as
if the name was a C typedef.

### Arrays

Array sizes are written next to the type, and arrays do not decay to pointers, you need to do it manually:

```c
// C
int x[2] = { 1, 2 };
int *y = x;
```
```c3
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
```
```c3
// C3
int[100] x = {};
int[30] y = {};
sort_my_array(&x); // Implicit conversion from int[100]* -> int[]
sort_my_array(&y); // Implicit conversion from int[30]* -> int[]
sort_my_array(z[1..10]); // Inclusive ranges!
```

Note that declaring an array of inferred size will look different in C3:

```c
// C
int x[] = { 1, 2, 3 }; // x is int[3]
```
```c3
// C3
int[*] x = { 1, 2, 3 }; // x is int[3]
```

Arrays are trivially copyable:

```c
// C
int x[3] = { 1, 2, 3 };
int y[3];
for (int i = 0; i < 3; i++) y[i] = x[i];
```
```c3
// C3
int[3] x = { 1, 2, 3 };
int[3] y = x; // Copy by value!
```
Find out more about [arrays](../language-common/arrays.md).

### C's `typedef` and `#define` become `alias`

C's `typedef` is replaced by `alias`:

```c
// C
typedef Foo* FooPtr;
```
```c3
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
```
```c3
// C3
alias println = puts;
alias my_excellent_string = my_string;

char* my_string = "Party on";
...
println(my_excellent_string);
```

Find out more about [`alias`](../language-common/alias.md).

### `typedef` creates new types

`typedef` in C3 creates a new type with it's own methods, and the original type cannot implicitly convert to this new type, unless cast.

```c
typedef MyId = int;

fn void get_by_id(MyId id)
{
    return;
}

fn void test()
{
    MyId valid = 7;
    int invalid = 7;
    get_by_id(valid); // allowed
    get_by_id(invalid); // not allowed
}
```

### Changes To `enum` and introducing `constdef`

C3 enums give new features, such as returning the name of the enum value at runtime. Their underlying representation always starts at 0 without gaps. For C enums with gaps, C3 uses `constdef` instead:

<div class="lp-grid-2" style="gap: 1.5rem;" markdown="1">

<div markdown="1">
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
</div>

<div markdown="1">
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
</div>

</div>

Read more about enums [here](../language-common/enums.md).

### Bitfields Are Replaced By Explicit Bitstructs

A bitstruct has an explicit container type, and each field has an exact bit range.

```c3
bitstruct Foo : short
{
    int a : 0..2; // Exact bit ranges, bits 0-2
    uint b : 3..6;
    MyEnum c : 7..13;
}
```

There exists a simplified form for a bitstruct containing only booleans, it is the same except the ranges are left out:

```c3
bitstruct Flags : char
{
    bool has_hyperdrive;
    bool has_tractorbeam;
    bool has_plasmatorpedoes;
}
```

For more information see [the page on bitstructs](../language-common/bitstructs.md).

### Fixed size basic types

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
```
```c3
// C3
short a;    // Guaranteed 16 bits
int b;      // Guaranteed 32 bits
long c;     // Guaranteed 64 bits
ulong d;    // Guaranteed 64 bits
int128 e;   // Guaranteed 128 bits
uint128 f;  // Guaranteed 128 bits
sz g;       // Same as C ptrdiff_t, ssize_t, depends on target
usz h;      // Same as C size_t, depends on target 
iptr i;     // Same as intptr_t depends on target
uptr j;     // Same as uintptr_t depends on target
```

Find out more about [types](../language-overview/types.md).

### Type Qualifiers

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

## Modules

### Modules And Import Instead Of `#include`

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

### No mandatory header files

There is a C3 interchange header format for declaring interfaces of libraries, but it is only used in special cases.

## Comments

The `/* */` comments are nesting

```text
/* This /* will all */ be commented out */
```

Note that doc contracts starting with `<*` and ending with `*>`, have special rules for parsing them, and are _not_ considered a regular comment. Find out more about [contracts](../language-common/contracts.md).

C3 also treats `#!` on the first line as a line comment `//`.

## Statements

### `goto` Removed

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
    Foo* foo = malloc(Foo::size);

    if (tryFoo(foo)) break FAIL;
    if (modifyFoo(foo)) break FAIL;

    free(foo);
    return true;
};
free(foo);
return false;

// C3, using defer:
Foo* foo = malloc(Foo::size);
defer free(foo);

if (tryFoo(foo)) return false;
if (modifyFoo(foo)) return false;

return true;
```

### Changes To `switch`

- `case` statements automatically break.
- Use `nextcase` to fallthrough to the next statement.
- Empty `case` statements have implicit fallthrough.

#### Implicit break in switches

Empty `case` statements have implicit fall through in C3, otherwise the `nextcase` statement is needed. `nextcase` can also be used to jump to any other `case` statement in the `switch`.

For example:

<div class="lp-grid-2" style="gap: 1.5rem;" markdown="1">

<div markdown="1">
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
```
</div>

<div markdown="1">
```c3
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
</div>

</div>

We can jump to an arbitrary switch-case label in C3:

<div class="lp-grid-2" style="gap: 1.5rem;" markdown="1">

<div markdown="1">
```c
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
```
</div>

<div markdown="1">
```c3
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
</div>

</div>

## Undefined Behaviour

C3 has less undefined behaviour, in particular integers are defined as using 2s
complement and signed overflow is wrapping. Find out more about [undefined behaviour](../language-rules/undefined-behaviour.md).

## Other Changes

The following things are enhancements to C, that don't have an equivalent in C.

- [Defer](../language-common/defer.md)
- [Methods](../language-fundamentals/functions.md#methods)
- [Optionals](../language-common/optionals-essential.md#what-is-an-optional)
- [Generic modules](../generic-programming/generics.md)
- [Contracts](../language-common/contracts.md)
- [Compile time evaluation](../generic-programming/compiletime.md)
- [Reflection](../generic-programming/reflection.md)
- [Operator overloading](../generic-programming/operator-overloading.md)
- [Macro methods](../generic-programming/macros.md#macro-methods)
- [Static initialize and finalize functions](../language-fundamentals/functions.md#static-initializer-and-finalizers)
- [Dynamic interfaces](../generic-programming/anyinterfaces.md)

**For the full list of all new features** see the [feature list](../faq/allfeatures.md).

Finally, the [FAQ](../faq/index.md) answers many questions you might have as you start out.
