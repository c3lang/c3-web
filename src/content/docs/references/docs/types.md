---
title: Types
description: Types
sidebar:
    order: 107
---

As usual, types are divided into basic types and user defined types (enum, union, struct, faults, aliases). All types are defined on a global level.

##### Naming

All user defined types in C3 starts with upper case. So `MyStruct` or `Mystruct` would be fine, `mystruct_t` or `mystruct` would not.
This naming requirement ensures that the language is easy to parse for tools.
It is possible to use attributes to change the external name of a type:

```
struct Stat @extern("stat")
{
    // ...
} 

fn CInt stat(const char* pathname, Stat* buf);
```

This would for example affect generated C headers.

##### Differences from C

Unlike C, C3 does not use type qualifiers. `const` exists, 
but is a storage class modifier, not a type qualifier. 
Instead of `volatile`, volatile loads and stores are used. 
In order to signal restrictions on parameter usage, parameter [preconditions](/references/docs/preconditions/) are used.
`typedef` has a slightly different syntax and renamed `def`.

C3 also requires all function pointers to be used with an alias, so:

    def Callback = fn void();
    Callback a = null; // Ok!
    fn Callback getCallback() { ... } // Ok!
    
    // fn fn void() getCallback() { ... } - ERROR!
    // fn void() a = null; - ERROR!```


## Basic types

Basic types are divided into floating point types, and integer types. Integer types being either signed or unsigned.

##### Integer types

| Name         | bit size | signed |
| :----------- | --------:|:------:|
| bool*        | 1        | no     |
| ichar        | 8        | yes    |
| char         | 8        | no     |
| short        | 16       | yes    |
| ushort       | 16       | no     |
| int          | 32       | yes    |
| uint         | 32       | no     |
| long         | 64       | yes    |
| ulong        | 64       | no     |
| int128       | 128      | yes    |
| uint128      | 128      | no     |
| iptr**       | varies   | yes    |
| uptr**       | varies   | no     |
| isz**        | varies   | yes    |
| usz**        | varies   | no     |

\* `bool` will be stored as a byte.  
\*\* size, pointer and pointer sized types depend on platform.

##### Integer arithmetics

All signed integer arithmetics uses 2's complement.

##### Integer constants

Integer constants are 1293832 or -918212. Without a suffix, suffix type is assumed to the signed integer of *arithmetic promotion width*. Adding the `u` suffix gives a unsigned integer of the same width. Use `ixx` and `uxx` – where `xx` is the bit width for typed integers, e.g. `1234u16`

Integers may be written in decimal, but also

- in binary with the prefix 0b e.g. `0b0101000111011`, `0b011`
- in octal with the prefix 0o e.g. `0o0770`, `0o12345670`
- in hexadecimal with the prefix 0x e.g. `0xdeadbeef` `0x7f7f7f`

In the case of binary, octal and hexadecimal, the type is assumed to be *unsigned*.

Furthermore, underscore `_` may be used to add space between digits to improve readability e.g. `0xFFFF_1234_4511_0000`, `123_000_101_100`


##### TwoCC, FourCC and EightCC

[FourCC](https://en.wikipedia.org/wiki/FourCC) codes are often used to identify binary format types. C3 adds direct support for 4 character codes, but also 2 and 8 characters:

- 2 character strings, e.g. `'C3'`, would convert to an ushort or short.
- 4 character strings, e.g. `'TEST'`, converts to an uint or int. 
- 8 character strings, e.g. `'FOOBAR11'` converts to an ulong or long.
 
Conversion is always done so that the character string has the correct ordering in memory. This means that the same characters may have different integer values on different architectures due to endianess.

##### Base64 and hex data literals

Base64 encoded values work like TwoCC/FourCC/EightCC, in that is it laid out in byte order in memory. It uses the format `b64'<base64>'`. Hex encoded values work as base64 but with the format `x'<hex>'`. In data literals any whitespace is ignored, so `'00 00 11'x` encodes to the same value as `x'000011'`.

In our case we could encode `b64'Rk9PQkFSMTE='` as `'FOOBAR11'`.

Base64 and hex data literals initializes to arrays of the char type:

```
char[*] hello_world_base64 = b64"SGVsbG8gV29ybGQh";
char[*] hello_world_hex = x"4865 6c6c 6f20 776f 726c 6421";
```

##### String literals, and raw strings

Regular string literals is text enclosed in `" ... "` just like in C. C3 also offers two other types of literals: *multi-line strings* and *raw strings*.

Raw strings uses text between \` \`. Inside of a raw string, no escapes are available. To write a \` double the character:

```
char* foo = `C:\foo\bar.dll`;
char* bar = `"Say ``hello``"`;
// Same as
char* foo = "C:\\foo\\bar.dll";
char* bar = "\"Say `hello`\"";
```
     
##### Floating point types

| Name         | bit size |
| ------------ | --------:|
| float16*     | 16       |
| float        | 32       |
| double       | 64       |
| float128*    | 128      |

*support depends on platform

##### Floating point constants

Floating point constants will *at least* use 64 bit precision. Just like for integer constants, it is allowed to use underscore, but it may not occur immediately before or after a dot or an exponential.

Floating point values may be written in decimal or hexadecimal. For decimal, the exponential symbol is e (or E, both are acceptable), for hexadecimal p (or P) is used: `-2.22e-21` `-0x21.93p-10` 

It is possible to type a floating point by adding a suffix:

| Suffix       | type     |
| ------------ | --------:|
| f16          | float16  |
| f32 *or f*   | float    |
| f64          | double   |
| f128         | float128 |

    

### C compatibility

For C compatibility the following types are also defined in std::core::cinterop

| Name         | c type             |
| ------------ | ------------------:|
| CChar        | char               |
| CShort       | short int          |
| CUShort      | unsigned short int |
| CInt         | int                |
| CUInt        | unsigned int       |
| CLong        | long int           |
| CULong       | unsigned long int  |
| CLongLong    | long long          |
| CULongLong   | unsigned long long |
| CFloat       | float              |
| CDouble      | double             |
| CLongDouble  | long double        |

    
Note that signed C char and unsigned char will correspond to `ichar` and `char`. `CChar` is only available to match the default signedness of `char` on the platform.

## Other built-in types

### Pointer types

Pointers mirror C: `Foo*` is a pointer to a `Foo`, while `Foo**` is a pointer to a pointer of Foo.

### The `typeid` type

The `typeid` can hold a runtime identifier for a type. Using `<typename>.typeid` a type may be converted to its unique runtime id, 
e.g. `typeid a = Foo.typeid;`. This value is pointer-sized.

### The `any` type

C3 contains a built-in variant type, which is essentially struct containing a `typeid` plus a `void*` pointer to a value.
It is possible to cast the any pointer to any pointer type, which will return `null` if the types don't match,
or the pointer value otherwise.

    int x;
    any y = &x;
    double *z = (double*)y; // Returns null
    int* w = (int*)y; // Returns the pointer to x

Switching over the `any` type is another method to unwrap the pointer inside:

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
    }

`any.type` returns the underlying pointee typeid of the contained value. `any.ptr` returns 
the raw `void*` pointer.

### Array types

Arrays are indicated by `[size]` after the type, e.g. `int[4]`. Slices use the `type[]`. For initialization the wildcard `type[*]` can be used to infer the size
from the initializer. See the chapter on [arrays](/references/docs/arrays).

### Vector types

Vectors use `[<size>]` after the type, e.g. `float[<3>]`, with the restriction that vectors may only form out
of integers, floats and booleans. Similar to arrays, wildcard can be used to infer the size of a vector: `int[<*>] a = { 1, 2 }`.

## Types created using `def`

### "typedef"

Like in C, C3 has a "typedef" construct, `def <typename> = <type>`

    def Int32 = int;
    def Vector2 = float[<2>];

    ...

    Int32 a = 1;
    int b = a;    

### Function pointer types

Function pointers are always used through a `def`:

    def Callback = fn void(int value);
    Callback callback = &test;

    fn void test(int a) { ... }

To form a function pointer, write a normal function declaration but skipping the function name. `fn int foo(double x)` ->
`fn int(double x)`.

Function pointers can have default arguments, e.g. `def Callback = fn void(int value = 0)` but default arguments
and parameter names are not taken into account when determining function pointer assignability:

    def Callback = fn void(int value = 1);
    fn void test(int a = 0) { ... }

    Callback callback = &main; // Ok
    
    fn void main()
    {
      callback(); // Works, same as test(0);
      test(); // Works, same as test(1);
      callback(.value = 3); // Works, same as test(3)
      test(.a = 4); // Works, same as test(4)
      // callback(.a = 3); ERROR!
    }

### Distinct types

Distinct types is a kind of type alias which creates a new type that has the same properties as the original type
but is - as the name suggests - distinct from it. It cannot implicitly convert into the other type using the syntax 
`distict <name> = <type>`

    distinct MyId = int;
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

#### Inline distinct

Using `inline` in the `distinct` declaration allows a distinct type to implicitly convert to its underlying type:

    distinct Abc = int;
    distinct Bcd = inline int;

    fn void test()
    {
        Abc a = 1;
        Bcd b = 1;

        // int i = a; Error: Abc cannot be implicitly converted to 'int'
        int i = b; // This is valid

        // However, 'inline' does not allow implicit conversion from 
        // the inline type to the distinct type:
        // a = i; Error: Can't implicitly convert 'int' to 'Abc'
        // b = i; Error: Can't implicitly convert 'int' to 'Bcd'
    }

### Generic types

    import generic_list; // Contains the generic MyList

    struct Foo { int x; }

    // Using def - usually recommended:
    def IntMyList = MyList(<int>);
    IntMyList abc;

    // Inline type definition
    MyList<Foo> bcd = MyList(<Foo>);

Read more about generic types on [the page about generics](/references/docs/generics).

## Enum

Enum (enumerated) types use the following syntax:

    enum State : int 
    {
      PENDING,
      RUNNING,
      TERMINATED
    }

Enum constants are namespaces by default, just like C++'s class enums. So accessing the enums above would for example use `State.PENDING` rather than `PENDING`.

### Enum type inference

When an enum is used in where the type can be inferred, like in case-clauses or in variable assignment, it is allowed to drop the enum name:

    State foo = PENDING; // State.PENDING is inferred.
    switch (foo)
    {
      case RUNNING: // State.RUNNING is inferred
        ...
      default:
        ...
    }

    fn void test(State s) { ... }

    ...

    test(RUNNING); // State.RUNNING is inferred


In the case that it collides with a global in the same scope, it needs the qualifier:

    module test;

    fn void testState(State s) { ... }

    const State RUNNING = State.TERMINATED; // Don't do this!

    ... 

    test(RUNNING); // Ambiguous
    test(test::RUNNING); // Uses global.
    test(State.RUNNING); // Uses enum constant.


### Enum associated values

It is possible to associate each enum value with a static value.

    enum State : int (String state_desc, bool active) 
    {
        PENDING("pending start", false),
        RUNNING("running", true),
        TERMINATED("ended", false)
    }

    ...
    
    State s = get_state();

    io::printfn("Currently the process is %s", s.state_desc);
    if (s.active) do_something();

## Faults

`fault` defines a set of optional result values, that are similar to enums, but are used for 
optional returns.

    fault IOResult
    {
      IO_ERROR,
      PARSE_ERROR
    }   

    fault MapResult
    {
      NOT_FOUND
    }
  
Like the typeid, the constants are pointer sized and each value is globally unique, even when 
compared to other faults. For example the underlying value of `MapResult.NOT_FOUND` is guaranteed
to be different from `IOResult.IO_ERROR`. This is true even if they are separately compiled.

A fault may be stored as a normal value, but is also unique in that it may be passed
as the optional result value using the `!` suffix operator.


## Optional Result Types

An *optional result type* is created by taking a type and appending `!`. 
An optional result type is a tagged union containing either the *expected result* or *an optional result value* 
(which is a fault).

    int! i;
    i = 5; // Assigning a real value to i.
    i = IOResult.IO_ERROR?; // Assigning an optional result to i.


Only variables and return variables may be optionals. Function and macro parameters may not be optionals.

    fn Foo*! getFoo() { ... } // Ok!
    fn void processFoo(Foo*! f) { ... } // Error
    int! x = 0; // Ok!


Read more about the optional types on the page about [optionals and error handling](/references/docs/optionals).


## Struct types

Structs are always named:

    struct Person  
    {
        char age;
        String name;
    }

A struct's members may be accessed using dot notation, even for pointers to structs.

    Person p;
    p.age = 21;
    p.name = "John Doe";

    libc::printf("%s is %d years old.", p.age, p.name);

    Person* pPtr = &p;
    pPtr.age = 20; // Ok!

    libc::printf("%s is %d years old.", pPtr.age, pPtr.name);

(One might wonder whether it's possible to take a `Person**` and use dot access. – It's not allowed, only one level of dereference is done.)

To change alignment and packing, optional [attributes](/references/docs/attributes) such as `@packed` may be used.

## Struct subtyping

C3 allows creating struct subtypes using `inline`:

    struct ImportantPerson 
    {
        inline Person person;
        String title;
    }

    fn void printPerson(Person p)
    {
        libc::printf("%s is %d years old.", p.age, p.name);
    }


    ImportantPerson important_person;
    important_person.age = 25;
    important_person.name = "Jane Doe";
    important_person.title = "Rockstar";
    printPerson(important_person); // Only the first part of the struct is copied.


## Union types

Union types are defined just like structs and are fully compatible with C.

    union Integral  
    {
        byte as_byte;
        short as_short;
        int as_int;
        long as_long;
    }

As usual unions are used to hold one of many possible values:

    Integral i;
    i.as_byte = 40; // Setting the active member to as_byte

    i.as_int = 500; // Changing the active member to as_int

    // Undefined behaviour: as_byte is not the active member, 
    // so this will probably print garbage.
    libc::printf("%d\n", i.as_byte); 


Note that unions only take up as much space as their largest member, so `Integral.sizeof` is equivalent to `long.sizeof`.


## Nested sub-structs / unions

Just like in C99 and later, nested anonymous sub-structs / unions are allowed. Note that
the placement of struct / union names is different to match the difference in declaration.

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

## Bitstructs

Bitstructs allows storing fields in a specific bit layout. A bitstruct may only contain
integer types and booleans, in most other respects it works like a struct.

The main differences is that the bitstruct has a *backing type* and each field
has a specific bit range. In addition, it's not possible *to take the address* of a
bitstruct field.

    bitstruct Foo : char
    {
        int a : 0..2;
        int b : 4..6;
        bool c : 7;
    }

    ...
    
    Foo f;
    f.a = 2;
    char x = (char)f;
    io::printfn("%d", (char)f); // prints 2
    f.b = 1;
    io::printfn("%d", (char)f); // prints 18 
    f.c = true;
    io::printfn("%d", (char)f); // prints 146


The bitstruct will follow the endianness of the underlying type:

    bitstruct Test : uint
    {
        ushort a : 0..15;
        ushort b : 16..31;
    }

    ...

    Test t;
    t.a = 0xABCD;
    t.b = 0x789A;
    char* c = (char*)&t;
    io::printfn("%X", (uint)t); // Prints 789AABCD
    for (int i = 0; i < 4; i++) io::printf("%X", c[i]); // Prints CDAB9A78
    io::printn();

It is however possible to pick a different endianness, in which case the entire representation
will internally assume big endian layout:

    bitstruct Test : uint @bigendian
    {
        ushort a : 0..15;
        ushort b : 16..31;
    }

In this case the same example yields `CDAB9A78` and `789AABCD` respectively.

Bitstruct backing types may be integers or char arrays. The difference in layout is somewhat subtle:

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

    ...

    Test1 t1;
    Test2 t2;
    t1.a = t2.a = 0xABCD;
    t1.b = t2.b = 0x789A;
    char* c = (char*)&t1;
    for (int i = 0; i < 4; i++) io::printf("%X", c[i]); // Prints CDAB9A78 on x86
    io::printn();
    c = (char*)&t2;
    for (int i = 0; i < 4; i++) io::printf("%X", c[i]); // Prints ABCD789A
    io::printn();

Bitstructs can be made to have ovelapping bit fields. This is useful when modelling
a layout which has multiple different layouts depending on flag bits:

    bitstruct Foo : char @overlap
    {
        int a : 2..5;
        int b : 1..3; // Only valid due to the @overlap attribute
    }

