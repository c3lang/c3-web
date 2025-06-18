---
title: Reflection
description: Reflection
sidebar:
    order: 85
---

C3 allows both compile time and runtime reflection.

During compile time the type information may be directly used as compile time constants, the same data is then available dynamically at runtime.

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
- `methodsof`
- `min`
- `nan`
- `nameof`
- `names`
- `paramsof`
- `parentof`
- `qnameof`
- `returns`
- `sizeof`
- `typeid`
- `values`

#### `alignof`

Returns the alignment in bytes needed for the type.

```c3
struct Foo @align(8)
{
    int a;
}

uint a = Foo.alignof; // 8
```

#### `associated`

*Only available for enums.*
Returns an array containing the types of associated values if any.

```c3
enum Foo : int (double d, String s)
{
    BAR = { 1.0, "normal" },
    BAZ = { 2.0, "exceptional" }
}
String s = Foo.associated[0].nameof; // "double"
```

#### `inf`

*Only available for floating point types*

Returns a representation of floating point "infinity".

#### `inner`

This returns a typeid to an "inner" type. What this means is different for each type:

- Array -> the array base type.
- Bitstruct -> underlying base type.
- Distinct -> the underlying type.
- Enum -> underlying enum base type.
- Pointer -> the type being pointed to.
- Vector -> the vector base type.

It is not defined for other types.

#### `kindof`

Returns the underlying `TypeKind` as defined in std::core::types.

```c3
TypeKind kind = int.kindof; // TypeKind.SIGNED_INT
```

#### `len`

Returns the length of the array.

```c3
usz len = int[4].len; // 4
```

#### `max`

Returns the maximum value of the type (only valid for integer and float types).

```c3
ushort max_ushort = ushort.max; // 65535
```

#### `membersof`

*Only available for bitstruct, struct and union types.*

Returns a *compile time* list containing the fields in a bitstruct, struct or union. The
elements have the *compile time only* type of `member_ref`.

*Note: As the list is an "untyped" list, you are limited to iterating and accessing it at
compile time.*

```c3
struct Baz
{
    int x;
    Foo* z;
}
String x = Baz.membersof[1].nameof; // "z"
```

A `member_ref` has properties `alignof`, `kindof`, `membersof`, `nameof`, `offsetof`, `sizeof` and `typeid`.

#### `methodsof`

This property returns the methods associated with a type as a constant array of strings.

Methods are generally registered *after* types are registered, which means that the use of 
"methodsof" may return inconsistent results depending on where in the resolution cycle it is invoked.
It is always safe to use inside a function.

#### `min`

Returns the minimum value of the type (only valid for integer and float types).

```c3
ichar min_ichar = ichar.min; // -128
```

#### `nameof`

Returns the name of the type.

#### `names`

Returns a slice containing the names of an enum.

```c3
enum FooEnum
{
    BAR,
    BAZ
}
String[] x = FooEnum.names; // ["BAR", "BAZ"]
```

#### `paramsof`

*Only available for function pointer types.*
Returns a ReflectParam struct for all function pointer parameters.

```c3
alias TestFunc = fn int(int x, double f);
String s = TestFunc.paramsof[1].name; // "f"
typeid t = TestFunc.paramsof[1].type; // double.typeid
```

#### `parentof`

*Only available for bitstruct and struct types.*
Returns the typeid of the parent type.

```c3
struct Foo
{
    int a;
}

struct Bar
{
    inline Foo f;
}

String x = Bar.parentof.nameof; // "Foo"
```

#### `returns`

*Only available for function types.*
Returns the typeid of the return type.

```c3
alias TestFunc = fn int(int, double);
String s = TestFunc.returns.nameof; // "int"
```

#### `sizeof`

Returns the size in bytes for the given type, like C `sizeof`.

```c3
usz x = Foo.sizeof;
```

#### `typeid`

Returns the typeid for the given type. `alias`s will return the typeid of the underlying type. The typeid size is the same as that of an `iptr`.

```c3
typeid x = Foo.typeid;
```

#### `values`

Returns a slice containing the values of an enum.

```c3
enum FooEnum
{
    BAR,
    BAZ
}
String x = FooEnum.values[1].nameof; // "BAR"
```

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

#### `$alignof`

Returns the alignment in bytes needed for the type or member.

```c3
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
```

#### `$defined`

Returns `true` when the expression(s) inside are defined and all sub expressions
are valid.
```c3
$defined(Foo);       // => true
$defined(Foo.x);     // => true
$defined(Foo.baz);   // => false

Foo foo = {};
// Check if a method exists:
$if $defined(foo.call):
    // Check what the method accepts:
    $switch :
       $case $defined(foo.call(1)) :
           foo.call(1);
       $default :
           // do nothing
    $endswitch
$endif

// Other way to write that:
$if $defined(foo.call, foo.call(1)):
    foo.call(1);
$endif
```

The full list of what `$defined` can check:
- `*<expr>` - checks if `<expr>` can be dereferenced, `<expr>` must already be valid
- `<expr>[<index>]` - checks if indexing is valid, `<expr>` and `<index>` must
    already be valid, and when possible to check at compile-time if `<index>`
    is out of bounds this will return `false`
- `<expr>[<index>] = <value>` - same as above, but also checks if `<value>` can
    be assigned, `<expr>`, `<index>` and `<value>` must already be valid
- `<expr>.<ident1>.<ident2>` - check if `.<ident2>` is valid, `<expr>.<ident1>`
    must already be valid ("ident" is short for "identifier")
- `ident`, `#ident`, `@ident`, `IDENT`, `$$IDENT`, `$ident` - check if identifier
    exists
- `Type` - check if the type exists
- `&<expr>` - check if you can take the address of `<expr>`, `<expr>` must
    already be valid
- `&&<expr>` - check if you can take the
    [temp address](https://c3-lang.org/language-fundamentals/expressions/#_top)
    of `<expr>`, `<expr>` must already be valid
- `$eval(<expr>)` - check if the [`$eval`](#eval) evaluates to something valid,
    `<expr>` must already be valid
- `<expr>(<arg0>, ...)` - check that the arguments are valid for the `<expr>`
    macro/function, `<expr>` and all args must already be valid
- `<expr>!!` and `<expr>!` - check that `<expr>` is an
    [optional](/language-common/optionals-essential/#what-is-an-optional),
    `<expr>` must already be valid
- `<expr>?` - check that `<expr>` is a
    [fault](/language-overview/types/#the-fault-type),
    `<expr>` must already be valid
- `<expr1> binary_operator <expr2>` - check if the `binary_operator` (`+`, `-`,
    ...) is defined between the two expressions, both expressions must already
    be valid
- `(<Type>)<expr>` - check if `<expr>` can be casted to `<Type>`, both `<Type>`
    and `<expr>` must already be valid

If for example `<expr>` is not defined when trying `(<Type>)<expr>` this will
result in a compile-time error.


#### `$eval`

Converts a compile time string with the corresponding variable:

```c3
int a = 123;         // => a is now 123
$eval("a") = 222;    // => a is now 222
$eval("mymodule::fooFunc")(a); // => same as mymodule::fooFunc(a)
```

`$eval` is limited to a single, optionally path prefixed, identifier.
Consequently methods cannot be evaluated directly:

```c3
struct Foo { ... }
fn int Foo.test(Foo* f) { ... }

fn void test()
{
    void* test1 = &$eval("test"); // Works
    void* test2 = &Foo.$eval("test"); // Works
    // void* test3 = &$eval("Foo.test"); // Error
}
```

#### `$evaltype`

Similar to `$eval` but for types:

```c3
$evaltype("float") f = 12.0f;
```

#### `$extnameof`

Returns the external name of a type, variable or function. The external name is
the one used by the linker.

```c3
fn void testfn(int x) { }
String a = $extnameof(g); // => "test.bar.g";
String b = $extnameof(testfn); // => "test.bar.testfn"
```

#### `$nameof`

Returns the name of a function or variable as a string without module prefixes.

```c3
fn void test() { }
int g = 1;

String a = $nameof(g); // => "g"
String b = $nameof(test); // => "test"
```

#### `$offsetof`

Returns the offset of a member in a struct.

```c3
Foo z;
$offsetof(z.y); // => returns 8 on 64 bit, 4 on 32 bit
```

#### `$qnameof`

Returns the same as `$nameof`, but with the full module name prepended.

```c3
module abc;
fn void test() { }
int g = 1;

String a = $qnameof(g); // => "abc::g"
String b = $qnameof(test); // => "abc::test"
```

#### `$sizeof`

This is used on a value to determine the allocation size needed. `$sizeof(a)` is equivalent
to doing `$typeof(a).sizeof`. Note that this is only used on values and not on types.

```c3
$typeof(a)* x = allocate_bytes($sizeof(a));
*x = a;
```

#### `$stringify`

Returns the expression as a string. It has a special behaviour for macro expression parameters,
where `$stringify(#foo)` will return the expression contained in `#foo` rather than simply return
"#foo"

#### `$typeof`

Returns the type of an expression or variable as a type itself.

```c3
Foo f;
$typeof(f) x = f;
```
