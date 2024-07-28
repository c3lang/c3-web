---
title: Basic types and values
description: Get an overview of C3's basic types and values
sidebar:
  order: 4
---

C3 provides a similar set of fundamental data types as C: integers, floats, arrays and pointers. On top of this it 
expands on this set by adding slices and vectors, as well as the `any` and `typeid` types for advanced use. 

## Integers

C3 has signed and unsigned integer types. The built-in signed integer types are `ichar`, `short`, `int`, `long`,
`int128`, `iptr` and `isz`. `ichar` to `int128` have all well-defined power-of-two bit sizes, whereas `iptr`
has the same number of bits as a `void*` and `isz` has the same number of bits as the maximum difference 
between two pointer. For each signed integer type there is a corresponding unsigned integer type: `char`, 
`ushort`, `uint`, `ulong`, `uint128`, `uptr` and `usz`.

| type    | signed? | min    | max       | bits   |
|---------|---------|--------|-----------|--------|
| ichar   | yes     | -128   | 128       | 8      |
| short   | yes     | -32768 | 32767     | 16     |
| int     | yes     | -2^31  | 2^31 - 1  | 32     |
| long    | yes     | -2^63  | 2^63 - 1  | 64     |
| int128  | yes     | -2^127 | 2^127 - 1 | 128    |
| iptr    | yes     | varies | varies    | varies |
| isz     | yes     | varies | varies    | varies |
| char    | no      | 0      | 255       | 8      |
| ushort  | no      | 0      | 65535     | 16     |
| uint    | no      | 0      | 2^32 - 1  | 32     |
| ulong   | no      | 0      | 2^64 - 1  | 64     |
| uint128 | no      | 0      | 2^128 - 1 | 128    |
| uptr    | no      | 0      | varies    | varies |
| usz     | no      | 0      | varies    | varies |

On 64-bit machines `iptr`/`uptr` and `isz`/`usz` are usually 64-bits, like `long`/`ulong`. 
On 32-bit machines on the other hand they are generally `int`/`uint`.

### Integer constants

Numeric constants typically use decimal, e.g. `234`, but may also use hexadecimal (base 16) numbers by prefixing
the number with `0x` or `0X`, e.g. `int a = 0x42edaa02;`. There is also octal (base 8) using the 
`0o` or `0O` prefix, and `0b` for binary (base 2) numbers:

Numbers may also insert underscore `_` between digits to improve readability, e.g. `1_000_000`.

```c3
a = -2_000;
b = 0o770;
c = 0x7f7f7f;
```

For decimal numbers, the value is assumed to be a signed `int`, unless the number doesn't fit in an
`int`, in which case it is assumed to be the smallest signed type it *does* fit in (`long` or `int128`).

For hexadecimal, octal and binary, the type is assumed to be unsigned.

A integer literal can *implicitly* convert to a floating point literal, or an integer of 
a different type provided the number fits in the type.

### Constant suffixes

If you want to ensure that a constant is of a certain type, you can either add an explicit cast 
like: `(ushort)345`, or use an integer suffix: `345u16`.

The following integer suffixes are available:

| suffix |    type |
|--------|--------:|
| i8     |   ichar |
| i16    |   short |
| i32    |     int |
| i64    |    long |
| i128   |  int128 |
| u8     |    char |
| u16    |  ushort |
| u32    |    uint |
| u      |    uint |
| u64    |   ulong |
| u128   | uint128 |

Note how `uint` also has the `u` suffix.

## Booleans

A `bool` will be either `true` or `false`. Although a bool is only a single bit of data, 
it should be noted that it is stored in a byte.

```c
bool b = true;
bool f = false;
```

### Character literals

A character literal is a value enclosed in `'``'`. Its value is intepreted as being its 
ASCII value for a single character. 

It is also possible to use 2, 4 or 8 character wide character literals. Such are interpreted
as `ushort`, `uint` and `ulong` respectively and are laid out in memory from left to right.
This means that the actual value depends on the [endianess](https://en.wikipedia.org/wiki/Endianness)
of the target.

- 2 character literals, e.g. `'C3'`, would convert to an ushort.
- 4 character literals, e.g. `'TEST'`, converts to an uint.
- 8 character literals, e.g. `'FOOBAR11'` converts to an ulong.

The 4 character literals correspond to the layout of [FourCC](https://en.wikipedia.org/wiki/FourCC)
codes. It will also correctly arrange unicode characters in memory. E.g. `Char32 smiley = '\u1F603'`

## Floating point types

As is common, C3 has two floating point types: `float` and `double`. `float` is the 32 bit floating
point type and `double` is 64 bits. 

### Floating point constants

Floating point constants will *at least* use 64 bit precision. 
Just like for integer constants, it is possible to use `_` to improve
readability, but it may not occur immediately before or after a dot or an exponential.

C3 supports floating points values either written in decimal or hexadecimal formats. 
For decimal, the exponential symbol is e (or E, both are acceptable), 
for hexadecimal p (or P) is used: `-2.22e-21` `-0x21.93p-10`

While floating point numbers default to `double` it is possible to type a 
floating point by adding a suffix:

| Suffix       | type     |
| ------------ | --------:|
| f32 *or f*   | float    |
| f64          | double   |

## Arrays

Arrays have the format `Type[size]`, so for example: `int[4]`. An array is a type consisting
of the same element repeated a number of times. Our `int[4]` is essentially four `int` values
packed together.

For initialization it's sometimes convenient to use the wildcard `Type[*]` declaration, which
infers the length from the number of elements:

```c3
int[3] abc = { 1, 2, 3 }; // Explicit int[3]
int[*] bcd = { 1, 2, 3 }; // Implicit int[3]
```

Read more about initializing arrays in [the chapter on arrays](/references/docs/arrays/).

## Slices

Slices have the format `Type[]`. Unlike the array, a slice does not hold the values themselves
but instead presents a view of some underlying array or vector.

Slices have two properties: `.ptr`, which retrieves the array it points to, and `.len` which
is the length of the slice - that is, the number of elements it is possible to index into.

Usually we can get a slice by taking the address of an array:

```c3
int[3] abc = { 1, 2, 3 }; 
int[] slice = &abc;       // A slice pointing to abc with length 3 
```

Because indexing into slices is range checked in safe mode, slices are vastly more safe
providing pointer + length separately.

## Vectors

Similar to arrays, vectors use the format `Type[<size>]`, with the restriction that vectors may only form out
of integers, floats and booleans. Similar to arrays, wildcard can be used to infer the size of a vector: 

```c3
int[<*>] a = { 1, 2 };
```

Vectors are based on hardware SIMD vectors, and supports many different operations that work
on all elements in parallel, including arithmetics:

```c3
int[<2>] b = { 3, 8 };
int[<2>] c = { 7, 2 };
int[<2>] d = b * c;    // d is { 21, 16 }
```

Vector initialization and literals work the same way as arrays, using `{ ... }`

## String literals

Like C, string literals is text enclosed in `" "` just like in C. These support
escape sequences like `\n` for line break and need to use `\"` for any `"` inside of the
string.

C3 also offers *raw strings* which are enclosed in `` ` ` ``. 
Inside of a raw string, no escapes are available, and to write a `` ` ``, simply double the character:

```c3
char* foo = `C:\foo\bar.dll`;
char* bar = `"Say ``hello``"`;
// Same as
char* foo = "C:\\foo\\bar.dll";
char* bar = "\"Say `hello`\"";
```

String literals are special in that they can convert to several different types: `String`,
`char` and `ichar` arrays and slices and finally `ichar*` and `char*`.

## Base64 and hex data literals

Base64 literals are strings prefixed with `b64` to containing
[Base64 encoded](https://en.wikipedia.org/wiki/Base64) data, which
is converted into a char array at compile time:

```c3
// The array below contains the characters "Hello World!"
char[*] hello_world_base64 = b64"SGVsbG8gV29ybGQh";
```

The corresponding hex data literals convert a hexadecimal string rather than Base64:

```c3
// The array below contains the characters "Hello World!"
char[*] hello_world_hex = x"4865 6c6c 6f20 776f 726c 6421";
```
## Pointer types

Pointers have the syntax `Type*`. A pointer is a memory address where one or possibly more
elements of the underlying address is stored. Pointers can be stacked: `Foo*` is a pointer to a `Foo`
while `Foo**` is a pointer to a pointer to `Foo`.

The pointer type has a special literal called `null`, which is an invalid, empty pointer.

### `void*`

The `void*` type is a special pointer which implicitly converts to any other pointer. It is not "a pointer to void",
but rather a wildcard pointer which matches any other pointer.

## Printing values

Printing values can be done using `io::print`, `io::printn`, `io::printf` and `io::printfn`. This requires
importing the module `std::io`. 

:::note
The `n` variants of the print functions will add a newline after printing, which is what we'll often 
use in the examples, but `print` and `printf` work the same way.

:::

```c3
import std::io; // Get the io functions.

fn void main()
{
    int a = 1234;
    ulong b = 0xFFAABBCCDDEEFF;
    double d = 13.03e-04;
    char[*] hex = x"4865 6c6c 6f20 776f 726c 6421";
    io::printn(a);
    io::printn(b);
    io::printn(d);
    io::printn(hex);
}
```

If you run this program you will get:

```
1234
71963842633920255
0.001303
[72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33]
```

To get more control we can format the output using `printf` and `printfn`:

```c3
import std::io;
fn void main()
{
    int a = 1234;
    ulong b = 0xFFAABBCCDDEEFF;
    double d = 13.03e-04;
    char[*] hex = x"4865 6c6c 6f20 776f 726c 6421";
    io::printfn("a was:                        %d", a);
    io::printfn("b in hex was:                 %x", b);
    io::printfn("d in scientific notation was: %e", d);
    io::printfn("Bytes as string:              %s", (String)&hex);
}
```

We can apply the [standard printf formatting rules](https://en.cppreference.com/w/c/io/fprintf), but 
unlike in C/C++ there is no need to indicate the type when using `%d` - it will print unsigned and 
signed up to `int128`, in fact there is no support for `%u`, `%lld` etc in `io::printf`. Furthermore,
`%s` works not just on strings but on any type:

```c3
import std::io;

enum Foo
{
    ABC,
    BCD,
    EFG,
}
fn void main()
{
    int a = 1234;
    uint128 b = 0xFFEEDDCC_BBAA9988_77665544_33221100;
    Foo foo = BCD;
    io::printfn("a: %s, b: %d, foo: %s", a, b, foo);
}
```

This prints:

```
a: 1234, b: 340193404210632335760508365704335069440, foo: BCD
```