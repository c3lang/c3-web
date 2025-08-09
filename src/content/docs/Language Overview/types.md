---
title: Types
description: Types
sidebar:
    order: 38
---
# Overview

As usual, types are divided into basic types and user defined types (`enum`, `union`, `struct`, `typedef`, `bitstruct`). All types are defined on a global level.

## Naming

All user defined types in C3 starts with upper case. So `MyStruct` or `Mystruct` would be fine, `mystruct_t` or `mystruct` would not.
This naming requirement ensures that the language *is easy to parse for tools*.
It is possible to use attributes to change the *external* name of a type:

```c3
struct Stat @extern("stat")
{
    // ...
}

fn CInt stat(char* pathname, Stat* buf);
```

This affects generated C headers, but little else.

## Differences from C

Unlike C, C3 _does not_ use type qualifiers. `const` exists,
but is a storage class modifier, not a type qualifier.
Instead of `volatile`, volatile loads and stores are implemented using `@volatile_load` and `@volatile_store`.
Restrictions on function parameter usage are implemented though parameter [preconditions](/language-common/contracts/#pre-conditions).

C3's equivalent of C's `typedef` has a slightly different syntax in C3 and is renamed `alias`. In contrast, in C3 a *distinct* type is created when using C3's `typedef` keyword. As such, take care to not confuse C3's `alias` and `typedef` keywords relative to C.

C3 also requires all function pointers to be used with an `alias`. For example:

```c3
alias Callback = fn void();
Callback a = null; // Ok!
fn Callback getCallback() { /* ... */ } // Ok!

// fn fn void() getCallback() { /* ... */ } - ERROR!
// fn void() a = null; - ERROR!
```

## Compile time properties

Types have built in type properties available through `.method` syntax. The following properties 
are common to all C3 runtime types:

1. `alignof` - The standard alignment of the type in bytes. For example `int.alignof` will typically be 4.
2. `kindof` - The category of type, e.g. `TypeKind.POINTER` `TypeKind.STRUCT` (see std::core::types).
3. `extnameof` - Returns a string with the extern name of the type, rarely used.
4. `nameof` - Returns a string with the unqualified name of the type.
5. `qnameof` - Returns a string with the qualified (using the full path) name of the type.
6. `sizeof` - Returns the storage size of the type in bytes.
7. `typeid` - Returns a runtime typeid for the type.
8. `methodsof` - Retuns the methods implemented for a type.
9. `has_tagof(tagname)` - Returns true if the type has a particular tag.
10. `tagof(tagname)` - Retrieves the tag defined on the type.
11. `is_eq` - True if the type implements `==`
12. `is_ordered` - True if the type implements comparisons.
13. `is_substruct` - True if the type has an inline member.

# Basic types

Basic types are divided into floating point types and integer types. 

Integer types are either signed or unsigned.

## Integer types

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

### Integer type properties

Integer types (except for `bool`) also have the following type properties:

1. `max` The maximum value for the type.
2. `min` The minimum value for the type.

### Integer arithmetics

All signed integer arithmetic uses 2's complement.

## Integer constants

Integer constants are 1293832 or -918212.

Integers may be written in decimal, but also

- in binary with the prefix 0b e.g. `0b0101000111011`, `0b011`
- in octal with the prefix 0o e.g. `0o0770`, `0o12345670`
- in hexadecimal with the prefix 0x e.g. `0xdeadbeef` `0x7f7f7f`

In the case of binary, octal and hexadecimal, the type is assumed to be *unsigned*.

Furthermore, underscore `_` may be used to add space between digits to improve readability e.g. `0xFFFF_1234_4511_0000`, `123_000_101_100`

### Integer literal suffix and type

Integer literals follow C rules:

1. A decimal literal is by default `int`. If it does not fit in an `int`, the type is `long` or `int128`. Picking the smallest type that fits the literal.
2. If the literal is suffixed by `u` or `U` it is instead assumed to be an `uint`, but will be `ulong` or `uint128` if it doesn't fit, like in (1).
3. Binary, octal and hexadecimal will implicitly be unsigned.
4. If an `l` or `L` suffix is given, the type is assumed to be `long`. If `ll` or `LL` is given, it is assumed to be `int128`.
5. If the `ul` or `UL` is given, the type is assumed to be `ulong`. If `ull` or `ULL`, then it assumed to be `uint128`.
6. If a binary, octal or hexadecimal starts with zeros, infer type size from the number of bits would be needed if all digits were the maximum for the base.

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

## TwoCC, FourCC and EightCC literals

[FourCC](https://en.wikipedia.org/wiki/FourCC) codes are often used to identify binary format types. C3 adds direct support for 4 character codes, but also 2 and 8 characters:

- 2 character strings, e.g. `'C3'`, would convert to an ushort or short.
- 4 character strings, e.g. `'TEST'`, converts to an uint or int.
- 8 character strings, e.g. `'FOOBAR11'` converts to an ulong or long.

Conversion is always done so that the character string has the correct ordering in memory. This means that the same characters may have different integer values on different architectures due to endianness.

## Base64 and hex data literals

Base64 encoded values work like TwoCC/FourCC/EightCC, in that is it laid out in byte order in memory. It uses the format `b64'<base64>'`. Hex encoded values work as base64 but with the format `x'<hex>'`. In data literals any whitespace is ignored, so `'00 00 11'x` encodes to the same value as `x'000011'`.

In our case we could encode `b64'Rk9PQkFSMTE='` as `'FOOBAR11'`.

Base64 and hex data literals initializes to arrays of the char type:

```c3
char[*] hello_world_base64 = b64"SGVsbG8gV29ybGQh";
char[*] hello_world_hex = x"4865 6c6c 6f20 776f 726c 6421";
```

## String literals, and raw strings

Regular string literals is text enclosed in `" ... "` just like in C. C3 also offers two other types of literals: *multi-line strings* and *raw strings*.

Raw strings uses text between \` \`. Inside of a raw string, no escapes are available. To write a \` double the character:

```c3
String foo = `C:\foo\bar.dll`;
ZString bar = `"Say ``hello``"`;
// Same as
String foo = "C:\\foo\\bar.dll";
String bar = "\"Say `hello`\"";
```

## Floating point types

| Name        | bit size |
|-------------| --------:|
| `bfloat16`* | 16       |
| `float16`*  | 16       |
| `float`     | 32       |
| `double`    | 64       |
| `float128`* | 128      |

*support is still incomplete.

### Floating point type properties

On top of the regular properties, floating point types also have the following properties:

1. `max` The maximum value for the type.
2. `min` The minimum value for the type.
3. `inf` Infinity.
4. `nan` Float NaN.

## Floating point constants

Floating point constants will *at least* use 64 bit precision. Just like for integer constants, it is allowed to use underscore, but it may not occur immediately before or after a dot or an exponential.

Floating point values may be written in decimal or hexadecimal. For decimal, the exponential symbol is e (or E, both are acceptable), for hexadecimal p (or P) is used: `-2.22e-21` `-0x21.93p-10`

By default a floating point literal is of type double, but if the suffix `f` is used (eg `1.0f`), it is instead of 
`float` type.

# C compatibility

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

# Other built-in types

## Pointer types

Pointers mirror C: `Foo*` is a pointer to a `Foo`, while `Foo**` is a pointer to a pointer of Foo.

### Pointer type properties

In addition to the standard properties, pointers also have the `inner` 
property. It returns the type of the object pointed to.

## Optional

An [Optional type](/language-common/optionals-essential/#what-is-an-optional) is created by taking a type and appending `?`.
An Optional type behaves like a tagged union, containing either the
Result or an Empty, which also carries a [fault](#the-fault-type) type.

Once extracted, a `fault` can be converted to another `fault`.

```c3
faultdef MISSING;   // define a fault

int? i;
i = 5;              // Assigning a real value to i.
i = io::EOF?;       // Assigning an optional result to i.
fault b = MISSING;  // Assign a fault to b
b = @catch(i);      // Assign the Excuse in i to b (EOF)
```

Only variables, expressions and function returns may be Optionals.
Function and macro parameters in their definitions may not be optionals.

```c3
fn Foo*? getFoo() { /* ... */ } // ✅ Ok!
int? x = 0; // ✅ Ok!
fn void processFoo(Foo*? f) { /* ... */ } // ❌ fn paramater
```

An Optional value can use the special `if-try` and `if-catch` to unwrap its result or its Empty,
it is also possible to implicitly return if it is Empty using `!` and panic with `!!`.

To learn more about the Optional type and error handling in C3, read the page on [Optionals and error handling](/language-common/optionals-essential/).

:::note
If you want a more regular "optional" value, to store in structs, then you can use the generic `Maybe` type in std::colletions.
:::

## The `fault` type 

When an [Optional](/language-common/optionals-essential/#what-is-an-optional) does not contain a result, it is Empty, but contains a `fault` which explains why there was no
normal value. A fault have the special property that together with the `?` suffix it creates an Empty value:

```c3
int? x = IO_ERROR?; // 'IO_ERROR?' is an Optional Empty.
fault y = IO_ERROR; // Here IO_ERROR is just a regular
                    // value, since it isn't followed by '?'
```

A new `fault` value can only be defined using the `faultdef` statement:

```c3
faultdef IO_ERROR, PARSE_ERROR, NOT_FOUND;
```

Like the [typeid type](#the-typeid-type), a `fault` is pointer sized
and each value defined by `faultdef` is globally unique. This is true even when faults are separately compiled.

:::note
The underlying unique value assigned to a fault may vary each time a program is run.
:::

### Fault nameof

The fault type only has one field: `nameof`, which returns the name of the fault, namespaced with the last module path, e.g. `"io::EOF"`.

## The `typeid` type

The `typeid` holds the runtime representation of a type. Using `<typename>.typeid` a type may be converted to its unique runtime id,
e.g. `typeid a = Foo.typeid;`. The value itself is pointer-sized.

### Typeid fields

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

## The `any` type

C3 contains a built-in variant type, which is essentially struct containing a `typeid` plus a `void*` pointer to a value.
While it is possible to cast the `any` pointer to any pointer type,
it is recommended to use the `anycast` macro or checking the type explicitly first.

```c3
fn void main()
{
    int x;
    any y = &x;
    int* w = (int*)y;                // Returns the pointer to x
    double* z_bad = (double*)y;      // Don't do this!
    double! z = anycast(y, double);  // The safe way to get a value
    if (y.type == int.typeid)
    {
        // Do something if y contains an int*
    }
}
```

Switching over the `any` type is another method to unwrap the pointer inside:

```c3
fn void test(any z)
{
    // Unwrapping switch
    switch (z)
    {
        case int:
            // z is unwrapped to int* here
        case double:
            // z is unwrapped to double* here
    }
    // Assignment switch
    switch (y = z)
    {
        case int:
            // y is int* here
    }
    // Direct unwrapping to a value is also possible:
    switch (w = *z)
    {
        case int:
            // w is int here
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

### `any` fields

At runtime, `any` gives you access to two fields:

1. `some_any.type` - returns the underlying pointee typeid of the contained value.
2. `some_any.ptr` - returns the raw `void*` pointer to the contained value.

### Advanced use of `any`

The standard library has several helper macros to manipulate `any` types:

1. `anycast(some_any, Type)` returns a pointer to `Type*` or `TYPE_MISMATCH` if types don't match.
2. `anymake(ptr, some_typeid)` creates an `any` to a given `typeid` using a `void*`.
3. `some_any.retype_to(some_typeid)` changes the type of an `any` to the given typeid.
4. `some_any.as_inner()` retypes the type of the `any` to the "inner" (see the `inner` type property) of the current type.

```c3
void* some_ptr = foo();
// Essentially (any)(int*)(some_ptr)
any some_int = anymake(some_ptr, int.typeid); 

// Same as anymake(some_int.ptr, uint.type)
any some_uint = some_int.retype_to(uint.typeid);   

struct SomeStruct
{
    inline int a;
}

SomeStruct s = { 3 };
any any_struct = &s;

// Result is same as (any)&s.a
any some_inner_int = any_struct.as_inner();
```

## Array types

Arrays are indicated by `[size]` after the type, e.g. `int[4]`. Slices use the `type[]`. For initialization the wildcard `type[*]` can be used to infer the size
from the initializer. See the chapter on [arrays](/language-common/arrays/).

## Vector types

Vectors use `[<size>]` after the type, e.g. `float[<3>]`, with the restriction that vectors may only form out
of integers, floats and booleans. Similar to arrays, wildcard can be used to infer the size of a vector: `int[<*>] a = { 1, 2 }`.

### Array and vector type properties

Array and vector types also support:

1. `inner` Returning the type of each element.
2. `len` Gives the length of the type.

# User defined types

## Type aliases (C's typedef)

Like in C, C3 has a "typedef" construct, `alias <typename> = <type>`

```c3
alias Int32 = int;
alias Vector2 = float[<2>];

/* ... */

Int32 a = 1;
int b = a;
```

These are not proper types, just aliases, and querying
their properties will query the properties of its aliased type.

## Function pointer types

Function pointers are always used through a `alias`:

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
    callback(); // Works, same as test(0);
    test(); // Works, same as test(1);
    callback(value: 3); // Works, same as test(3)
    test(a: 4); // Works, same as test(4)
    // callback(a: 3); // ERROR!
}
```

### Function pointer type properties

Function pointer types also support:

1. `paramsof` - Returns a list of `ReflectedParam` for each parameter.
2. `returns` - This returns the return type.

## Typedef - Distinct type definitions

`typedef` creates a new type, that has the same properties as the original type
but is distinct from it. It cannot implicitly convert into the other type using the syntax
`typedef <name> = <type>`

```c3
typedef MyId = int;
fn void* get_by_id(MyId id) { ... }

fn void test(MyId id)
{
    void* val = get_by_id(id); // Ok
    void* val2 = get_by_id(1); // Literals convert implicitly
    int a = 1;
    // void* val3 = get_by_id(a); // ERROR expected a MyId
    void* val4 = get_by_id((MyId)a); // Works
    // a = id; // ERROR can't assign 'MyId' to 'int'
}
```

### Inline typedef

Using `inline` in the `typedef` declaration allows a newly created `typedef` type to
implicitly convert to its underlying type:

```c3
typedef Abc = int;
typedef Bcd = inline int;

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

### Typedef type properties

In addition to the normal properties, typedef also supports:

1. `inner` - Returns the type this is based on.
2. `parentof` - If this is an inline typedef, return the same as `inner`.

## Generic types
```c3
import generic_list; // Contains the generic MyList

struct Foo {
    int x;
}

// ✅ alias for each type used with a generic module.
alias IntMyList = MyList {Foo};
MyListFoo working_example;

// ❌ An inline type definition will give an error.
// Only allowed in a type definition or macro
MyList {Foo} failing_example = MyList {Foo};
```
Find out more about [generic types](/generic-programming/generics).

## Enum

Enum or enumerated types use the following syntax:
```c3
enum State : int
{
    WAITING,
    RUNNING,
    TERMINATED
}

// Access enum values via:
State current_state = WAITING; // or '= State.WAITING' 
```
The access requires referencing the `enum`'s name as `State.WAITING` because
an enum like `State` is a separate namespace by default, just like C++'s class `enum`.


### Enum associated values

It is possible to associate each enum value with one or more a static values.
```c3
enum State : int (String description)
{
    WAITING = "waiting",
    RUNNING = "running",
    TERMINATED = "ended",
}

fn void main()
{
    State process = State.RUNNING;
    io::printfn("%s", process.description);
}
```
Multiple static values can be associated with an enum value, for example:
```c3
struct Position
{
    int x;
    int y;
}

enum State : int (String desc, bool active, Position pos)
{
    WAITING    = { "waiting", false, { 1, 2} },
    RUNNING    = { "running", true,  {12,22} },
    TERMINATED = { "ended",   false, { 0, 0} },
}

fn void main()
{
    State process = RUNNING;
    if (process.active)
    {
        io::printfn("Process is: %s", process.desc);
        io::printfn("Position x: %d", process.pos.x);
    }
}
```

### Enum type inference

When an `enum` is used where the type can be inferred, like in switch case-clauses or in variable assignment, the enum name is not required:
```c3
State process = WAITING; // State.WAITING is inferred.
switch (process)
{
    case RUNNING: // State.RUNNING is inferred
        io::printfn("Position x: %d", process.pos.x);
    default:
        io::printfn("Process is: %s", process.desc);
}

fn void test(State s) { ... }

test(RUNNING); // State.RUNNING is inferred
```

If the `enum` without its name matches with a global in the same scope, it needs the enum name to be added as a qualifier, for example:
```c3
module test;

// Global variable
// ❌ Don't do this!
const State RUNNING = State.TERMINATED;

test(RUNNING);       // Ambiguous
test(test::RUNNING); // Uses global variable.
test(State.RUNNING); // Uses enum constant.
```

### Enum to and from ordinal

You can convert an enum to its ordinal with `.ordinal`, and convert it
back with `EnumName.from_ordinal(...)`:

```c3
fn void store_enum(State s)
{
    write_int_to_file(s.ordinal);
}

fn State read_enum()
{
    return State.from_ordinal(read_int_from_file());
}
```

### Const enums

When interfacing with C code, you may encounter enums that are not sequential.
For situations like this, you can use a const enum:

```c3
extern fn KeyCode get_key_code();

enum KeyCode : const CInt
{
    UNKNOWN = 0,
    RETURN = 13,
    ESCAPE = 27,
    BACKSPACE = 8,
    TAB = 9,
    SPACE = 32,
    EXCLAIM, // automatically incremented to 33
    QUOTEDBL,
    HASH,
}

fn void main()
{
    int a = (int) KeyCode.SPACE; // assigns 32 to a
    KeyCode b = 2; // const enums behave like typedef and will not enforce that every value has been declared beforehand
    KeyCode key = get_key_code(); // can safely interact with a C function that returns the same enum
}
```

If you need a const enum to be converted to its assigned value without using a cast, `inline` can be used:
```c3
enum ConstInline : const inline String
{
    A = "Hello",
    B = "World",
}

fn void main()
{
    String a = ConstInline.A; // implicitly converted to string due to inline
    ConstInline b = B;
    String b_str = b;

    io::printfn("%s, %s!", a, b_str); // Prints "Hello, World!"
}

```

Const enums *cannot* have associated values and do not have the `nameof` property at runtime.

### Enum type properties

Enum types have the following additional properties in addition to the usual properties for 
user defined types:

1. `associated` returns an untyped list of types for the associated values.
2. `inner` returns the type of the ordinal.
3. `lookup(value)` lookup an enum by inlined value.
4. `lookup_field(field_name, value)` lookup an enum by associated value.
5. `names` returns a list containing the names of all enums.
6. `from_ordinal(value)` convert an integer to an enum.
7. `values` return a list containing all the enum values of an enum.

## Struct types

Structs are always named:

```c3
struct Person
{
    char age;
    String name;
}
```

A struct's members may be accessed using dot notation, even for pointers to structs.

```c3
fn void test()
{
    Person p;
    p.age = 21;
    p.name = "John Doe";

    io::printfn("%s is %d years old.", p.name, p.age);

    Person* p_ptr_ = &p;
    p_ptr.age = 20; // Ok!

    io::printfn("%s is %d years old.", p_ptr.name, p_ptr.age);
}
```
(One might wonder whether it's possible to take a `Person**` and use dot access. – It's not allowed, only one level of dereference is done.)

To change alignment and packing, [attributes](/language-common/attributes/) such as `@packed` may be used.

### Struct subtyping

C3 allows creating struct subtypes using `inline`:

```c3
struct ImportantPerson
{
    inline Person person;
    String title;
}

fn void print_person(Person p)
{
    io::printfn("%s is %d years old.", p.name, p.age);
}


fn void test()
{
    ImportantPerson important_person;
    important_person.age = 25;
    important_person.name = "Jane Doe";
    important_person.title = "Rockstar";

    // Only the first part of the struct is copied.
    print_person(important_person);
}
```

## Union types

Union types are defined just like structs and are fully compatible with C.

```c3
union Integral
{
    char as_byte;
    short as_short;
    int as_int;
    long as_long;
}
```

As usual unions are used to hold one of many possible values:

```c3
fn void test()
{
    Integral i;
    i.as_byte = 40; // Setting the active member to as_byte

    i.as_int = 500; // Changing the active member to as_int

    // Undefined behaviour: as_byte is not the active member,
    // so this will probably print garbage.
    io::printfn("%d\n", i.as_byte);
}
```

Note that unions only take up as much space as their largest member, so `Integral.sizeof` is equivalent to `long.sizeof`.


### Nested sub-structs / unions

Just like in C99 and later, nested anonymous sub-structs / unions are allowed. Note that
the placement of struct / union names is different to match the difference in declaration.

```c3
struct Person
{
    char age;
    String name;
    union
    {
        int employee_nr;
        uint other_nr;
    }
    union subname
    {
        bool b;
        Callback cb;
    }
}
```

### Union and structs type properties

Structs and unions also support the `membersof` property,
which returns a list of struct members.

## Bitstructs

Bitstructs allows storing fields in a specific bit layout. A bitstruct may only contain
integer types and booleans, in most other respects it works like a struct.

The main differences is that the bitstruct has a *backing type* and each field
has a specific bit range. In addition, it's not possible *to take the address* of a
bitstruct field.

```c3
bitstruct Foo : char
{
    int a : 0..2;
    int b : 4..6;
    bool c : 7;
}

fn void test()
{
    Foo f;
    f.a = 2;

    io::printfn("%d", (char)f); // prints 2
    f.b = 1;
    io::printfn("%d", (char)f); // prints 18
    f.c = true;
    io::printfn("%d", (char)f); // prints 146
}
```

The bitstruct will follow the endianness of the underlying type:

```c3
bitstruct Test : uint
{
    ushort a : 0..15;
    ushort b : 16..31;
}

fn void test()
{
    Test t;
    t.a = 0xABCD;
    t.b = 0x789A;
    char* c = (char*)&t;

    // Prints 789AABCD
    io::printfn("%X", (uint)t);

    for (int i = 0; i < 4; i++)
    {
        // Prints CDAB9A78
        io::printf("%X", c[i]);
    }
    io::printn();
}
```

It is however possible to pick a different endianness, in which case the entire representation
will internally assume big endian layout:

```c3
bitstruct Test : uint @bigendian
{
    ushort a : 0..15;
    ushort b : 16..31;
}
```

In this case the same example yields `CDAB9A78` and `789AABCD` respectively.

Bitstruct backing types may be integers or char arrays. The difference in layout is somewhat subtle:

```c3
bitstruct Test1 : char[4]
{
    ushort a : 0..15;
    ushort b : 16..31;
}
bitstruct Test2 : char[4] @bigendian
{
    ushort a : 0..15;
    ushort b : 16..31;
}

fn void test()
{
    Test1 t1;
    Test2 t2;
    t1.a = t2.a = 0xABCD;
    t1.b = t2.b = 0x789A;

    char* c = (char*)&t1;
    for (int i = 0; i < 4; i++)
    {
        // Prints CDAB9A78 on x86
        io::printf("%X", c[i]);
    }
    io::printn();

    c = (char*)&t2;
    for (int i = 0; i < 4; i++)
    {
        // Prints ABCD789A
        io::printf("%X", c[i]);
    }
    io::printn();
}
```

Bitstructs can be made to have overlapping bit fields. This is useful when modelling
a layout which has multiple different layouts depending on flag bits:

```c3
bitstruct Foo : char @overlap
{
    int a : 2..5;
    // "b" is valid due to the @overlap attribute
    int b : 1..3;
}
```

### Bitstruct type properties

Bitstructs also support:

1. `membersof` - Return a list of all bitstruct members.
2. `inner` - Return the type of the bitstruct "container" type.
