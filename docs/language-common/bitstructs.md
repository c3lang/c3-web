---
title: Enums
description: Learn how C3 bitstructs work
---

## Bitstructs

Bitstructs allow storing fields in a specific bit layout. A bitstruct may only contain
integer types and booleans, in most other respects it works like a struct.

The main difference is that the bitstruct has a *backing type* and each field
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
    
    // Normal designated initializers are supported
    f = { .a = 1, .b = 3, .c = false };
    
    // As a special case, boolean fields may drop
    // the initializer value, this implicitly sets them
    // to true. Below the '.c' is the same as '.c = true'
    f = { .a = 2, .b = 2, .c };
}
```

### Bitstruct endianness

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

It is, however, possible to pick a different endianness, in which case the entire representation will internally assume big-endian layout:

```c3
bitstruct Test : uint @bigendian
{
    ushort a : 0..15;
    ushort b : 16..31;
}
```

In this case the same example yields `CDAB9A78` and `789AABCD` respectively.

### Bitstruct backing types

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

### Bitstructs with overlapping fields

Bitstructs can be made to have overlapping bit fields. This is useful when modeling
a layout which has multiple different layouts depending on flag bits:

```c3
bitstruct Foo : char @overlap
{
    int a : 2..5;
    // "b" is valid due to the @overlap attribute
    int b : 1..3;
}
```

### Boolean-only bitstructs

When a boolean consists of only bool fields, the bit position may be dropped, and the bit position is inferred:

```c3
// The following produce exactly the same layout:
bitstruct Explicit : int
{
    bool a : 0;
    bool b : 1;
    bool c : 2;
}
bitstruct Implicit : int
{
    bool a;
    bool b;
    bool c;
}
```

### Bitstructs as bit masks

It is possible to use bitstructs to implement bitmasks without using the explicit masking values, see the following example:

```c3
constdef BitMaskEnum : uint
{
    ABC = 1 << 0,
    DEF = 1 << 1,
    ACTIVE = 1 << 5,
}

bitstruct BitMask : uint
{
    bool abc : 0;
    bool def : 1;
    bool active: 5;
}

fn void test()
{
    // Classic bit mask:
    BitMaskEnum foo = BitMaskEnum.ABC | BitMaskEnum.DEF;
    BitMaskEnum bar = BitMaskEnum.ACTIVE | BitMaskEnum.ABC;
    BitMaskEnum baz = foo & bar;
    if (baz & BitMaskEnum.ACTIVE) { ... }
    
    // Using a bitstruct
    BitMask a = { .abc, .def }; // Just .abc is the same as .abc = true
    BitMask b = { .active, .abc };
    BitMask c = a & b;
    if (c.active) { ... }
    
    assert((uint)b == (uint)bar, "Layout is the same");
}
```

### Bitstruct type properties

Bitstructs also support:

1. `membersof` - Return a list of all bitstruct members. (use `member` in 0.8.0+).
2. `inner` - Return the type of the bitstruct "container" type.
