---
title: Reflection
description: Reflection
search:
  boost: 0.9
---

C3 allows both compile time and runtime reflection.

During compile time, some type information is available in the form of compile time constants associated with each type.

Runtime type information is also available by retrieving a `typeid` from a runtime object (such as from an object of type `any` via `<runtime_obj>.type` most commonly) and then comparing the properties of the returned runtime `typeid` against the corresponding properties (if any) of the compile time equivalent `<type>.typeid`. Note however that run time `typeid`s currently have [a much smaller set of available properties](../language-overview/types.md#typeid-fields). 

See [the documentation about the `any` type](../language-overview/types.md#the-any-type) for more information if you want or need runtime reflection. Such runtime info can be switched on or conditionally checked (e.g. via `<runtime_obj>.type == <type>.typeid`) to implement runtime polymorphism.

Compile time information about types is accessed using `::`, e.g. `MyType::size`.

For *values* use `$reflect(<value>)` to access the reflected properties for the underlying value.

The exception is `$Typeof(<value>)`, which creates a type from the type of the value. There are convenience macros like `@sizeof(<value>)`, `@kindof(<value>)` for immediately accessing reflection data without explicitly invoking `$reflect`.

### Type properties & functions

The following type properties and functions are available:

- `alignment` (all runtime types)
- `from_ordinal` (constdef and enum only)
- `has_equals`
- `is_ordered`
- `is_substruct` (struct only)
- `len` (array, vector, enum, constdef - runtime available)
- `lookup_field` (enum)
- `max` / `min` (int and float types)
- `members` (struct, union, enum, bitstruct)
- `methods` (all non-optional runtime types)
- `nan` / `inf` (float types)
- `inner` (runtime types except int, float, struct and union types)
- `kind` (runtime available)
- `name` / `qname` / `cname` (cname is limited to all user-defined types)
- `params` (function types)
- `parent` (constdef, struct, typedef - runtime available)
- `returns` (function types)
- `size` (runtime available)
- `typeid` (all runtime types + untypedlist)
- `get_tag` / `has_tag` (user-defined types)
- `values` (constdef, enum)


#### `alignment`

Returns the alignment in bytes needed for the type.

```c3
struct Foo @align(8)
{
    int a;
}

uint a = Foo::alignment; // 8
```

#### `from_ordinal`

*Only available for constdef and enum.*
Converts an integer value to the enum/constdef of that ordinal. In the case of constdef
it might be different from the actual value.

#### `has_equals`

Is `==` and `!=` supported.

#### `is_ordered`

Are all comparisons supported, either because the type has is built-in or added through operator overloading.

#### `is_substruct`

*Only available for structs.*

True if a struct has an inline member.

#### `len`

Returns the length of the array or vector. For enums and constdefs, it will return the number of constants.

```c3
enum Foo
{
    BAR,
    BAZ
}
sz len = int[4]::len; // 4
int foo_values = Foo::len; // 2
```

#### `lookup_field`

*Only available for enums.*

Look up the enum value by matching the first associated value:

```c3
enum Foo : (int val)
{
    ABC { 3 },
    LIFF { 42 }
}
...
Foo? foo = Foo::lookup_field(val, 42); // Returns Foo.ABC
```

#### `max` / `min`

*Only available for integer and floating point types.*

Returns the maximum / minimum value of the type.

```c3
ushort max_ushort = ushort::max; // 65535
ichar min_ichar = ichar::min; // -128
```

#### `members`

*Only available for enum, bitstruct, struct and union types.*

Returns a *compile time* list containing the fields in a bitstruct, struct or union. For enums it's the associated value declarations. The elements are of type `reflected_ref`, as if you had done `$reflect` on the element.

*Note: As the list is an "untyped" list, you are limited to iterating and accessing it at
compile time.*

```c3
struct Baz
{
    int x;
    Foo* z;
}
String x = Baz::members[1].name; // "z"
```

#### `methods`

This property returns the methods associated with a type as a constant array of strings.

!!! note

    **Warning!**

    Methods are generally registered *after* types are registered, which means that the use of
    "methodsof" may return inconsistent results depending on where in the resolution cycle it is invoked.
    It is always safe to use inside a function.

#### `nan` / `inf`

*Only available for floating point types*

Returns a representation of floating point "NaN" / "infinity".

#### `inner`

This returns a typeid to an "inner" type. What this means is different for each type:

- Array -> the array base type.
- Bitstruct -> underlying base type.
- Distinct -> the underlying type.
- Enum -> underlying enum base type.
- Pointer -> the type being pointed to.
- Vector -> the vector base type.

It is not defined for other types.

#### `kind`

Returns the underlying `TypeKind` as defined in std::core::types.

```c3
TypeKind kind = int::kind; // TypeKind.SIGNED_INT
```

#### `name` / `qname` / `cname`

Returns the name of the type: `qname` is the qualified name, so adds the module path before the name. `cname` returns the external name, and as such isn't available for built-in types.

#### `params`

*Only available for function pointer types.*
Returns a ReflectedParam struct for all function pointer parameters.

```c3
alias TestFunc = fn int(int x, double f);
String s = TestFunc::params[1].name; // "f"
typeid t = TestFunc::params[1].type; // double.typeid
```

#### `parent`

*Only available for typedef, constdef, bitstruct and struct types.*

Returns the typeid of the inline field.

```c3
struct Foo
{
    int a;
}

struct Bar
{
    inline Foo f;
}

String x = Bar::parent.name; // "Foo"
```

#### `returns`

*Only available for function types.*
Returns the typeid of the return type.

```c3
alias TestFunc = fn int(int, double);
String s = TestFunc::returns.name; // "int"
```

#### `size`

Returns the size in bytes for the given type, like C `sizeof`.

```c3
sz x = Foo::size;
```

#### `get_tag` / `has_tag`

`get_tag` retrieves the value of a `@tag` defined on the type, `has_tag` is used to check if the tag exists.

#### `typeid`

Returns the typeid for the given type. `alias`s will return the typeid of the underlying type. The typeid size is the same as that of an `iptr`.

```c3
typeid x = Foo.typeid;
```

#### `values`

Returns a slice containing the values of an enum or constdef.

```c3
enum FooEnum
{
    BAR,
    BAZ
}
String x = FooEnum.values[1].description; // "BAR"
```

## Compile time functions

There are several built-in functions to inspect the code during compile time.

- `$defined`
- `$eval`
- `$stringify`
- `$Typeof`
- `$Typefrom`
- `$reflect`

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

- `SomeType a = <expr>` - checks if `<expr>` can be used to initialize a variable of type `SomeType`
- `var $a = <expr>` - checks if `<expr>` can be compile-time evaluated.
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
    [temporary address](../language-fundamentals/expressions.md#temporary-address)
    of `<expr>`, `<expr>` must already be valid
- `$eval(<expr>)` - check if the [`$eval`](#eval) evaluates to something valid,
    `<expr>` must already be valid
- `<expr>(<arg0>, ...)` - check that the arguments are valid for the `<expr>`
    macro/function, `<expr>` and all args must already be valid
- `<expr>!!` and `<expr>!` - check that `<expr>` is an
    [optional](../language-common/optionals-essential.md#what-is-an-optional),
    `<expr>` must already be valid
- `<expr>?` - check that `<expr>` is a
    [fault](../language-overview/types.md#the-fault-type),
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


#### `$reflect`

Returns a `reflection_ref` of the expression. It can be queried for properties such as name, size, offset, alignment etc.

More information is forthcoming.

#### `$stringify`

Returns the expression as a string. `$stringify` has a special behaviour for handling macro expression parameters, where `$stringify(#foo)` will return the expression contained in `#foo` as a string, exactly as written in the macro call's arguments, rather than simply return `"#foo"`.

Thus, for example:

```c3
import std::io;

macro @describe(#expr)
{
	io::printfn("The value of `%s` is `%s`.", $stringify(#expr), #expr);
}

fn void main()
{
	@describe(sz::size);
  //Prints:
  //  The value of `sz.size` is `8`.
}
```

#### `$Typeof`

Returns the type of an expression or variable.

```c3
Foo f;
$Typeof(f) x = f;
```

#### `$Typefrom` {: #typefrom }

Get a type from a compile time constant `typeid`. It can also convert a compile-time string to the corresponding type.

```c3
$Typefrom("float") f = 12.0f;
$Typefrom(int::typeid) i = 12;
```

## Expression values through `$reflect`

`$reflect` give access to different properties depending on the expression. To determine at compile time that some information is available use `$define($reflect(x).some_property)`.

### `alignment`

Get the alignment of something.
See [reflection](../generic-programming/reflection.md#alignment).

### `cname`

This returns the external name of a symbol.

External names are the names written into the symbol table of the executable or library binary, which subsequently may later be used by other programs to call into the binary by linking to those names, such as via foreign function interfaces (FFI) from another language or via direct use of the binary interface (such as enabled by the ABI and library compatibility of C and C3).

The external name of a symbol in the built binary can be set by attaching an `@export("<intended_symbol_name>")` attribute.

On Linux, the `nm` shell command can be used to view the symbol table of a binary directly, thus enabling determination of what names a foreign program would see when looking at the binary. For example, try running `nm path/to/binary &> nm_out.txt` then viewing the `nm_out.txt` file. The `&>` combines both normal (`stdout`) and error (`stderrr`) output into the file, whereas just `>` would redirect only normal (`stdout`) output.

On Windows, you can try `dumpbin /SYMBOLS` for debug builds, `dumpbin /EXPORTS` for libraries, or `dumpbin /IMPORTS` for executables, but it may not help as much since large parts of the symbol table may be missing and hence misleading. There may also be tools available only in Visual Studio or associated with it, since Microsoft designs it that way intentionally to encourage programs to be built the way Microsoft wants.

On Mac, try `otool`, `nm`, or `objdump`. Running `brew install binutils` before may help.


### `name`

Get the local name of a symbol. Local names (a.k.a. unqualified names) are the "leaf nodes" (the very last item) of the full namespace path to a symbol.

For example, `$reflect(io::printn).name` is `printn`.

### `offset`

Get the offset of a member.

### `qname`

Get the qualified name of a symbol.

Qualified names are the full ("absolute") namespace paths needed to reach a symbol.

For example, `$reflect(io::printn).qname` is `std::io::printn`.

### `size`

Return the size of an expression in bytes.
