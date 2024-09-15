---
title: Reflection
description: Reflection
sidebar:
    order: 120
---

C3 allows both compile time and runtime reflection.

During compile time the type information may be directly used as compile time constants, the same data is then available dynamically at runtime.

*Note that not all reflection is implemented in the compiler at this point in time.*

## Compile time reflection

During compile time there are a number of compile time fields that may be accessed directly.

### Type properties

It is possible to access properties on the type itself:

- `alignof`
- `associated`
- `elements`
- `extnameof`
- `inf`
- `inner`
- `kindof`
- `len`
- `max`
- `membersof`
- `min`
- `nan`
- `names`
- `params`
- `parentof`
- `qnameof`
- `returns`
- `sizeof`
- `typeid`
- `values`

#### alignof

Returns the alignment in bytes needed for the type.

    struct Foo @align(8)
    {
        int a;
    }

    uint a = Foo.alignof; // 8

#### associated

*Only available for enums.*
Returns an array containing the types of associated values if any.

    enum Foo : int (double d, String s)
    {
        BAR = { 1.0, "normal" },
        BAZ = { 2.0, "exceptional" }
    }
    String s = Foo.associated[0].nameof; // "double"

#### elements

Returns the element count of an enum or fault.

    enum FooEnum
    {
        BAR,
        BAZ
    }
    int x = FooEnum.elements; // 2


#### inf

*Only available for floating point types*

Returns a representation of floating point "infinity".

#### inner

This returns a typeid to an "inner" type. What this means is different for each type:

- Array -> the array base type.
- Bitstruct -> underlying base type.
- Distinct -> the underlying type.
- Enum -> underlying enum base type.
- Pointer -> the type being pointed to.
- Vector -> the vector base type.

It is not defined for other types.

#### kindof

Returns the underlying `TypeKind` as defined in std::core::types.

    TypeKind kind = int.kindof; // TypeKind.SIGNED_INT

#### len

Returns the length of the array.

    usz len = int[4].len; // 4

#### max

Returns the maximum value of the type (only valid for integer and float types).

    ushort max_ushort = ushort.max; // 65535

#### membersof

*Only available for bitstruct, struct and union types.*

Returns a *compile time* list containing the fields in a bitstruct, struct or union. The
elements have the *compile time only* type of `member_ref`. 

*Note: As the list is an "untyped" list, you are limited to iterating and accessing it at 
compile time.*

    struct Baz
    {
        int x;
        Foo* z;
    }
    String x = Baz.membersof[1].nameof; // "z"

A `member_ref` has properties `alignof`, `kindof`, `membersof`, `nameof`, `offsetof`, `sizeof` and `typeid`.

#### min

Returns the minimum value of the type (only valid for integer and float types).

    ichar min_ichar = ichar.min; // -128

#### names

Returns a slice containing the names of an enum or fault.

    enum FooEnum
    {
        BAR,
        BAZ
    }
    String[] x = FooEnum.names; // ["BAR", "BAZ"]

#### params

*Only available for function types.*
Returns a list typeid for all parameters.

    def TestFunc = fn int(int, double);
    String s = TestFunc.params[1].nameof; // "double"

#### parentof

*Only available for bitstruct and struct types.*
Returns the typeid of the parent type.

    struct Foo
    {
        int a;
    }

    struct Bar
    {
        inline Foo f;
    }

    String x = Bar.parentof.nameof; // "Foo"

#### returns

*Only available for function types.*
Returns the typeid of the return type.

    def TestFunc = fn int(int, double);
    String s = TestFunc.returns.nameof; // "int"

#### sizeof

Returns the size in bytes for the given type, like C `sizeof`.

    usz x = Foo.sizeof;

#### typeid

Returns the typeid for the given type. `def`s will return the typeid of the underlying type. The typeid size is the same as that of an `iptr`.

    typeid x = Foo.typeid;

#### values

Returns a slice containing the values of an enum or fault.

    enum FooEnum
    {
        BAR,
        BAZ
    }
    String x = FooEnum.values[1].nameof; // "BAR"

### Compile time functions

There are several built-in functions to inspect the code during compile time.

- `$alignof`
- `$defined`
- `$eval`
- `$evaltype`
- `$extnameof`
- `$nameof`
- `$offsetof`
- `$qnameof`
- `$sizeof`
- `$stringify`
- `$typeof`

### $alignof

Returns the alignment in bytes needed for the type or member.

    module test::bar;

    struct Foo
    {
      int x;
      char[] y;
    }
    int g = 123;

    $alignof(Foo.x); // => returns 4
    $alignof(Foo.y); // => returns 8 on 64 bit
    $alignof(Foo);   // => returns 8 on 64 bit
    $alignof(g);     // => returns 4

### $defined

Returns true if the expression inside is defined and all sub expressions are valid.

    $defined(Foo.x);     // => returns true
    $defined(Foo.z);     // => returns false
    int[2] abc;
    $defined(abc.len);   // => returns true
    $defined(abc.len()); // => returns false
    $defined((int)abc);  // => returns false
    // $defined(abc.len() + 1)  would be an error

### $eval

Converts a compile time string with the corresponding variable:

    int a = 123;         // => a is now 123
    $eval("a") = 222;    // => a is now 222
    $eval("mymodule::fooFunc")(a); // => same as mymodule::fooFunc(a)

`$eval` is limited to a single, optionally path prefixed, identifier.
Consequently methods cannot be evaluated directly:

    struct Foo { ... }
    fn int Foo.test(Foo* f) { ... }

    fn void test()
    {
       void* test1 = &$eval("test"); // Works
       void* test2 = &Foo.$eval("test"); // Works
       // void* test3 = &$eval("Foo.test"); // Error
    }

### $evaltype

Similar to `$eval` but for types:

    $evaltype("float") f = 12.0f;

### $extnameof

Returns the external name of a type, variable or function. The external name is
the one used by the linker.

    fn void testfn(int x) { }
    String a = $extnameof(g); // => "test.bar.g";
    string b = $extnameof(testfn); // => "test.bar.testfn"

### $nameof

Returns the name of a function or variable as a string without module prefixes.

    fn void test() { }
    int g = 1;

    String a = $nameof(g); // => "g"
    String b = $nameof(test); // => "test"

### $offsetof

Returns the offset of a member in a struct.

    Foo z;
    $offsetof(z.y); // => returns 8 on 64 bit, 4 on 32 bit

### $qnameof

Returns the same as `$nameof`, but with the full module name prepended.

    module abc;
    fn void test() { }
    int g = 1;

    String a = $qnameof(g); // => "abc::g"
    String b = $qnameof(test); // => "abc::test"

### $sizeof

This is used on a value to determine the allocation size needed. `$sizeof(a)` is equivalent
to doing `$typeof(a).sizeof`. Note that this is only used on values and not on types.

    $typeof(a)* x = allocate_bytes($sizeof(a));
    *x = a;

### $stringify

Returns the expression as a string. It has a special behaviour for macro expression parameters,
where `$stringify(#foo)` will return the expression contained in `#foo` rather than simply return
"#foo"

### $typeof

Returns the type of an expression or variable as a type itself.

    Foo f;
    $typeof(f) x = f;
