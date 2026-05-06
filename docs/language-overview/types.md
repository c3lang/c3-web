---
title: Types
description: Types
---
## Overview

As usual, types are divided into basic types and user defined types (`enum`, `union`, `struct`, `typedef`, `bitstruct`). All types are defined on a global level.

### Naming

All user-defined types in C3 start with upper-case. So `MyStruct` or `Mystruct` would be fine, `mystruct_t` or `mystruct` would not.
This naming requirement ensures that the language *is easy to parse for tools*.
It is possible to use attributes to change the *external* name of a type:

```c3
struct Stat @cname("stat")
{
    // ...
}

fn CInt stat(char* pathname, Stat* buf);
```

This affects generated C headers, but little else.

### Differences from C

Unlike C, C3 _does not_ use type qualifiers. `const` exists,
but is a storage class modifier, not a type qualifier.
Instead of `volatile`, volatile loads and stores are implemented using `@volatile_load` and `@volatile_store`.
Restrictions on function parameter usage are implemented through parameter [preconditions](../language-common/contracts.md#pre-conditions).

C3's equivalent of C's `typedef` has a slightly different syntax in C3 and is renamed `alias`. In contrast, in C3 a *distinct* type is created when using C3's `typedef` keyword. As such, take care to not confuse C3's `alias` and `typedef` keywords relative to C.

C3 also requires all function pointers to be used with an `alias`. For example:

```c3
alias Callback = fn void();
Callback a = null; // Ok!
fn Callback getCallback() { /* ... */ } // Ok!

// fn fn void() getCallback() { /* ... */ } - ERROR!
// fn void() a = null; - ERROR!
```

### Compile time properties

Types have built in type properties available through `.method` syntax. The following properties 
are common to all C3 runtime types:

1. `alignof` - The standard alignment of the type in bytes. For example `int.alignof` will typically be 4.
2. `kindof` - The category of type, e.g. `TypeKind.POINTER` `TypeKind.STRUCT` (see std::core::types).
3. `extnameof` - Returns a string with the extern name of the type, rarely used.
4. `nameof` - Returns a string with the unqualified name of the type.
5. `qnameof` - Returns a string with the qualified (using the full path) name of the type.
6. `sizeof` - Returns the storage size of the type in bytes.
7. `typeid` - Returns a runtime typeid for the type.
8. `methodsof` - Returns the methods implemented for a type.
9. `has_tagof(tagname)` - Returns true if the type has a particular tag.
10. `tagof(tagname)` - Retrieves the tag defined on the type.
11. `is_eq` - True if the type implements `==`
12. `is_ordered` - True if the type implements comparisons.
13. `is_substruct` - True if the type has an inline member.

\*Note: 0.8.0 moves to the `int::align` syntax instead.

## Basic types

Basic types are divided into floating point types and integer types. 

Integer types are either signed or unsigned.

### Integer types

| Name        | bit size | signed |
|:------------| --------:|:------:|
| `bool`&dagger;    | 1        | no     |
| `ichar`     | 8        | yes    |
| `char`      | 8        | no     |
| `short`     | 16       | yes    |
| `ushort`    | 16       | no     |
| `int`       | 32       | yes    |
| `uint`      | 32       | no     |
| `long`      | 64       | yes    |
| `ulong`     | 64       | no     |
| `int128`    | 128      | yes    |
| `uint128`   | 128      | no     |
| `iptr`&Dagger;  | varies   | yes    |
| `uptr`&Dagger;  | varies   | no     |
| `isz`&Dagger;   | varies   | yes    |
| `usz`&Dagger;   | varies   | no     |

&dagger;: `bool` will be stored as a byte.

&Dagger;: Size, pointer and pointer-sized types depend on the target platform.

*Note that `isz` is renamed `sz` from 0.8.0 and onwards.*

#### Integer type properties

Integer types (except for `bool`) also have the following type properties:

1. `max` The maximum value for the type.
2. `min` The minimum value for the type.

#### Integer arithmetics

All signed integer arithmetic uses 2's complement.

### Integer constants

Integer constants are 1293832 or -918212.

Integers may be written in decimal, but also

- in binary with the prefix 0b e.g. `0b0101000111011`, `0b011`
- in octal with the prefix 0o e.g. `0o0770`, `0o12345670`
- in hexadecimal with the prefix 0x e.g. `0xdeadbeef` `0x7f7f7f`

In the case of binary, octal and hexadecimal, the type is assumed to be *unsigned*.

Furthermore, underscore `_` may be used to add space between digits to improve readability e.g. `0xFFFF_1234_4511_0000`, `123_000_101_100`

#### Integer literal suffix and type

Integer literals follow C's rules:

1. A decimal literal is by default `int`. If it does not fit in an `int`, the type is `long` or `int128`. Picking the smallest type that fits the literal.
2. If the literal is suffixed by `u` or `U` it is instead assumed to be an `uint`, but will be `ulong` or `uint128` if it doesn't fit, like in (1).
3. Binary, octal and hexadecimal will implicitly be unsigned.
4. If an `l` or `L` suffix is given, the type is assumed to be `long`. If `ll` or `LL` is given, it is assumed to be `int128`.
5. If the `ul` or `UL` is given, the type is assumed to be `ulong`. If `ull` or `ULL`, then it assumed to be `uint128`.
6. If a binary, octal or hexadecimal starts with zeros, infer the type size from the number of bits that would be needed if all digits were the maximum for the base.

```c3
$typeof(1);              // int
$typeof(1u);             // uint
$typeof(1L);             // long
$typeof(0x11);           // uint, hex is unsigned by default
$typeof(0x1ULL);         // uint128
$typeof(4000000000);     // long, since the number exceeds int.max
$typeof(0x000000000000); // ulong: 12 hex chars indicate a 48 bit value
$typeof(0b000000000000); // uint: 12 binary chars indicate a 12 bit value
```

### TwoCC, FourCC and EightCC literals

[FourCC](https://en.wikipedia.org/wiki/FourCC) codes are often used to identify binary format types. C3 adds direct support for 4 character codes, but also 2 and 8 characters:

- 2 character strings, e.g. `'C3'`, would convert to an ushort or short.
- 4 character strings, e.g. `'TEST'`, converts to an uint or int.
- 8 character strings, e.g. `'FOOBAR11'` converts to an ulong or long.

Conversion is always done so that the character string has the correct ordering in memory. This means that the same characters may have different integer values on different architectures due to endianness.

### Base64 and hex data literals

Base64 encoded values work like TwoCC/FourCC/EightCC, in that it is laid out in byte order in memory. It uses the format `b64'<base64>'`. Hex encoded values work as base64 but with the format `x'<hex>'`. In data literals any whitespace is ignored, so `'00 00 11'x` encodes to the same value as `x'000011'`.

In our case we could encode `b64'Rk9PQkFSMTE='` as `'FOOBAR11'`.

Base64 and hex data literals initializes to arrays of the char type:

```c3
char[*] hello_world_base64 = b64"SGVsbG8gV29ybGQh";
char[*] hello_world_hex = x"4865 6c6c 6f20 776f 726c 6421";
```

### String literals, and raw strings

Regular string literals is text enclosed in `" ... "` just like in C. C3 also offers another type of literal: *raw strings*.

Raw strings uses text between \` \`. Inside of a raw string, no escapes are available, and it can span across multiple lines. To write a \` double the character:

```c3
String foo = `C:\foo\bar.dll`;
ZString bar = `"Say ``hello``"`;
String baz =
`pushq %rax;
addq $1, %rax;
popq %rax;`;
// Same as
String foo = "C:\\foo\\bar.dll";
String bar = "\"Say `hello`\"";
String baz = "pushq %rax;\naddq $1, %rax;\npopq %rax;";
```

### Floating point types

| Name        | bit size |
|-------------| --------:|
| `bfloat16`&dagger; | 16       |
| `float16`&dagger;  | 16       |
| `float`     | 32       |
| `double`    | 64       |
| `float128`&dagger; | 128      |

&dagger;: Support is still incomplete and not all systems have native support.

#### Floating point type properties

On top of the regular properties, floating point types also have the following properties:

1. `max` The maximum value for the type.
2. `min` The minimum value for the type.
3. `inf` Infinity.
4. `nan` Float NaN.

### Floating point constants

Floating point constants will *at least* use 64 bit precision. Just like for integer constants, it is allowed to use underscore, but it may not occur immediately before or after a dot or an exponential.

Floating point values may be written in decimal or hexadecimal. For decimal, the exponential symbol is e (or E, both are acceptable), for hexadecimal p (or P) is used: `-2.22e-21` `-0x21.93p-10`

By default a floating point literal is of type double, but if the suffix `f` is used (eg `1.0f`), it is instead of 
`float` type.

## C compatibility

For C compatibility the following types are also defined in std::core::cinterop

| Name          | C type               |
|---------------| --------------------:|
| `CChar`       | `char`               |
| `CShort`      | `short int`          |
| `CUShort`     | `unsigned short int` |
| `CInt`        | `int`                |
| `CUInt`       | `unsigned int`       |
| `CLong`       | `long int`           |
| `CULong`      | `unsigned long int`  |
| `CLongLong`   | `long long`          |
| `CULongLong`  | `unsigned long long` |
| `CLongDouble` | `long double`        |

`float` and `double` will always match their C counterparts.

Note that signed C char and unsigned char will correspond to `ichar` and `char`. `CChar` is only available to match the default signedness of `char` on the platform.

## Other built-in types

### Pointer types

Pointers mirror C: `Foo*` is a pointer to a `Foo`, while `Foo**` is a pointer to a pointer of Foo.

#### Pointer type properties

In addition to the standard properties, pointers also have the `inner` 
property. It returns the type of the object pointed to as a `typeid`.

### Optional

An [Optional type](../language-common/optionals-essential.md#what-is-an-optional) is created by taking a type and appending `~`.
An Optional type behaves like a tagged union, containing either the
Result or an Empty, which also carries a [fault](#the-fault-type) type.

Once extracted, a `fault` can be converted to another `fault`.

```c3
faultdef MISSING;   // define a fault

int? i;
i = 5;              // Assigning a real value to i.
i = io::EOF~;       // Assigning an optional result to i.
fault b = MISSING;  // Assign a fault to b
b = @catch(i);      // Assign the Excuse in i to b (EOF)
```

Only variables, expressions and function returns may be Optionals.
Function and macro parameters in their definitions may not be optionals.

```c3
fn Foo*? getFoo() { /* ... */ } // ✅ Ok!
int? x = 0; // ✅ Ok!
fn void processFoo(Foo*? f) { /* ... */ } // ❌ fn parameter
```

An Optional value can use the special `if-try` and `if-catch` to unwrap its result or its Empty,
it is also possible to implicitly return if it is Empty using `!` and panic with `!!`.

To learn more about the Optional type and error handling in C3, read the page on [Optionals and error handling](../language-common/optionals-essential.md).

!!! note
    If you want a more regular "optional" value, to store in structs, then you can use the generic `Maybe` type in std::collections.

### The `fault` type 

When an [Optional](../language-common/optionals-essential.md#what-is-an-optional) does not contain a result, it is Empty, but contains a `fault` which explains why there was no
normal value. A fault have the special property that together with the `~` suffix it creates an Empty value:

```c3
int? x = IO_ERROR~; // 'IO_ERROR~' is an Optional Empty.
fault y = IO_ERROR; // Here IO_ERROR is just a regular
                    // value, since it isn't followed by '~'
```

A new `fault` value can only be defined using the `faultdef` statement:

```c3
faultdef IO_ERROR, PARSE_ERROR, NOT_FOUND;
```

Like the [typeid type](#the-typeid-type), a `fault` is pointer sized
and each value defined by `faultdef` is globally unique. This is true even when faults are separately compiled.

!!! note
    The underlying unique value assigned to a fault may vary each time a program is run.

#### Fault nameof

The fault type only has one field: `nameof`, which returns the name of the fault, namespaced with the last module path, e.g. `"io::EOF"`.

### The `typeid` type

The `typeid` holds the runtime representation of a type. Using `<typename>.typeid` a type may be converted to its unique runtime id,
e.g. `typeid a = Foo.typeid;`. The value itself is pointer-sized.

#### Typeid fields

At compile time, a typeid value has all the properties of its underlying type:

```c3
String a = int.nameof;        // "int"
String b = int.typeid.nameof; // "int"
```

However, at runtime only a few are available:

1. `sizeof` - always supported.
2. `kindof` - always supported.
3. `parentof` - supported on distinct and struct types, returning the inline member type.
4. `inner` - supported on types implementing it.
5. `names` - supported on enum types.
6. `len` - supported on arrays, vectors and enums.

### The `any` type

C3 contains a built-in variant type, which is essentially a struct containing a `typeid` plus a `void*` pointer to a value.
While it is possible to cast the `any` pointer to any pointer type, it is recommended to use the `anycast` macro or checking the type explicitly first. With the `anycast` macro, the return will be
an optional, which is empty if there is a mismatch.

```c3
fn void main()
{
    int x;
    any y = &x;
    int* w = (int*)y;                // Returns the pointer to x
    double* z_bad = (double*)y;      // Don't do this!
    double*? z = anycast(y, double); // The safe way to get a value
    if (y.type == int.typeid)
    {
        // Do something if y contains an int*
    }
    if (try v = anycast(y, int))
    {
        // same as above, but v holds the unwrapped int*
    }
}
```

You can use a switch to check an `any`'s type, as well. After the type has been confirmed, it is safe to dereference.

```c3
fn void test(any z)
{
    // Switch
    switch (z.type)
    {
        case int:
            // This is safe here:
            int* y = (int*)z;
        case double:
            // This is safe here:
            double* y = (double*)z;
    }
    // Assignment switch
    switch (y = z, y.type)
    {
        case int:
            // This is safe here:
            int* x = (int*)y;
    }
    // Finally, if we just want to deal with the case
    // where it is a single specific type:
    if (z.type == int.typeid)
    {
        // This is safe here:
        int* a = (int*)z;
    }
    if (try b = *anycast(z, int))
    {
        // b is an int:
        foo(b * 3);
    }
}
```

Note that in `switch`es, if a substruct type is passed in and it's parent matches first, it will take priority.

```c3
fn void test(any z) 
{
    // Will always be seen as the parent type.
    switch (z.type) 
    {
        case Parent:
            // code...
        case Subtype:
            // code that will never execute...
    }
    // So order the subtypes first 
    // if you're comparing them against their parent.

    // Of course, this is still useful in cases
    // of inherited types where the parent isn't in the switch.
    switch (z.type) 
    {
        case Parent:
            // modify data both Parent and Subtype have
        case SomethingElse:
            // completely different type code
    }
}
```

If you don't want the child type detected as the parent type, a `typedef` can be used to create a distinct type without changing any data.

#### `any` fields

At runtime, `any` gives you access to two fields:

1. `some_any.type` - returns the underlying pointee typeid of the contained value.
2. `some_any.ptr` - returns the raw `void*` pointer to the contained value.

#### Advanced use of `any`

The standard library has several helper macros to manipulate `any` types:

1. `anycast(some_any, Type)` returns a pointer to `Type*` or `TYPE_MISMATCH` if types don't match.
2. `any_make(ptr, some_typeid)` creates an `any` to a given `typeid` using a `void*`.
3. `some_any.retype_to(some_typeid)` changes the type of an `any` to the given typeid.
4. `some_any.as_inner()` retypes the type of the `any` to the "inner" (see the `inner` type property) of the current type.

```c3
void* some_ptr = foo();
// Essentially (any)(int*)(some_ptr)
any some_int = any_make(some_ptr, int.typeid);

// Same as any_make(some_int.ptr, uint.type)
any some_uint = some_int.retype_to(uint.typeid);   

typedef SomeType = int;

SomeType s = 3;
any any_val = &s;

// Result is same as (any)&s.a
any some_inner_int = any_val.as_inner();
```

### Array types

Arrays are indicated by `[size]` after the type, e.g. `int[4]`. Slices use the `type[]`. For initialization the wildcard `type[*]` can be used to infer the size
from the initializer. See the chapter on [arrays](../language-common/arrays.md).

### Vector types

Vectors use `[<size>]` after the type, e.g. `float[<3>]`, with the restriction that vectors may only form out
of integers, floats and booleans. Similar to arrays, wildcard can be used to infer the size of a vector: `int[<*>] a = { 1, 2 }`.

#### Array and vector type properties

Array and vector types also support:

1. `inner` Returning the type of each element.
2. `len` Gives the length of the type.

## User defined types

### Type aliases (C's typedef)

C3 has a construct that behaves essentially the same as C's "typedef", an `alias`, and it is declared using the syntax `alias <new_name> = <old_name>`. For example:

```c3
alias Int32 = int;
alias Vector2 = float[<2>];

/* ... */

Int32 a = 1;
int b = a;
```

These are not proper types, just aliases, and querying
their properties will query the properties of its aliased type.

### Function pointer types

Function pointers are always used through an `alias`:

```c3
alias Callback = fn void(int value);
Callback callback = &test;

fn void test(int a) { /* ... */ }
```

To form a function pointer, write a normal function declaration but skipping the function name. `fn int foo(double x)` ->
`fn int(double x)`.

Function pointers can have default arguments, e.g. `alias Callback = fn void(int value = 0)` but default arguments
and parameter names are not taken into account when determining function pointer assignability:

```c3
alias Callback = fn void(int value = 1);
fn void test(int a = 0) { /* ... */ }

Callback callback = &test; // Ok

fn void main()
{
    callback(); // Works, same as test(1);
    test(); // Works, same as test(0);
    callback(value: 3); // Works, same as test(3)
    test(a: 4); // Works, same as test(4)
    // callback(a: 3); // ERROR!
}
```

#### Function pointer type properties

Function pointer types also support:

1. `paramsof` - Returns a list of `ReflectedParam` for each parameter.
2. `returns` - This returns the return type.

### Typedef - Distinct type definitions

`typedef` creates a new type, that has the same properties as the original type but is distinct from it. It cannot implicitly convert into the other type using the syntax
`typedef <name> = <type>`

```c3
typedef MyId = int;
typedef MyId2 @constinit = int;
fn void* get_by_id(MyId id) { ... }
fn void* get_by_id2(MyId2 id) { ... }

fn void test(MyId id)
{
    void* val = get_by_id(id); // Ok
    
    // void* val2 = get_by_id(1); // ERROR expected a MyId
    // Use `@constinit` to allow implicit conversion from 
    // literals
    void* val2 = get_by_id2(1); 
     
    int a = 1;        
    // void* val3 = get_by_id(a); // ERROR expected a MyId
    // `@constinit` doesn't work on non-literals
    // void* val3 = get_by_id2(a); // ERROR expected a MyId2
    void* val4 = get_by_id((MyId)a); // Works
    // a = id; // ERROR can't assign 'MyId' to 'int'
}
```

#### Inline typedef

Using `inline` in the `typedef` declaration allows a newly created `typedef` type to implicitly convert to its underlying type:

```c3
typedef Abc @constinit = int;
typedef Bcd @constinit = inline int;

fn void test()
{
    Abc a = 1;
    Bcd b = 1;

    // int i = a; Error: Abc cannot be implicitly converted to 'int'
    int i = b; // This is valid

    // However, 'inline' does not allow implicit conversion from
    // the inline type to the typedef type:
    // a = i; Error: Can't implicitly convert 'int' to 'Abc'
    // b = i; Error: Can't implicitly convert 'int' to 'Bcd'
}
```

#### Aligned typedefs

It's possible to use `typedef` to create underaligned types. For example, typically an `int` will be 4 byte aligned, but we can create a 2-byte aligned type using `typedef IntAlign2 = int @align(2);`.

#### Storage SIMD types

Vectors are normally stored and passed as arrays to prevent SIMD alignment overhead. However, it's possible to define types that exactly match the SIMD types in C and other languages for storage and argument passing. These types are defined with `typedef` and the `@simd` attribute, similar to aligned typedefs: `typedef Float4 = float[<4>] @simd`

#### Typedef type properties

In addition to the normal properties, typedef also supports:

1. `inner` - Returns the type this is based on as a `typeid`.
2. `parentof` - If this is an inline typedef, return the same as `inner`.

### Generic types
```c3
import generic_list; // Contains the generic MyList

struct Foo 
{
    int x;
}

// ✅ alias for each type used with a generic module.
alias MyListFoo = MyList {Foo};
MyListFoo working_example;

fn void main()
{
    // ❌ A nested inline type definition in a function context
    // will yield an error, it's only available on the top 
    // level or in macros. Prefer aliases.
    MyList {MyList {int}} failing_example;
}
```
Find out more about [generic types](../generic-programming/generics.md).

### Enum and constdefs

These correspond to C's enum. See [enums and constdefs](../language-common/enums.md).


### Struct types

Read more about [unions and structs](../language-common/structs-and-unions.md) and [bitstructs](../language-common/bitstructs.md).

