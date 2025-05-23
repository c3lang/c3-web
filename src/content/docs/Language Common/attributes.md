---
title: Attributes
description: Attributes
sidebar:
    order: 68
---

Attributes are compile-time annotations on functions, types, global constants and variables. Similar to Java annotations, a decoration may also take arguments. A attribute can also represent a bundle of attributes.

## Built in attributes

### `@align(alignment)`

*Used for: struct, bitstructs, union, var, function*

This attribute sets the minimum alignment for a field or a variable, for example:

```c3
struct Foo @align(32)
{
    int a;
    int b @align(16);
}
```

Note that following C behaviour, `@align` is only able to *increase*
the alignment. If setting a smaller alignment than default is
desired, then use `@packed` (which sets the alignment to 1 for all members)
and then `@align`.

### `@benchmark`

*Used for: function*

Marks the function as a benchmark function. Will be added to the list of benchmark functions when the benchmarks are run,
otherwise the function will not be included in the compilation.

### `@bigendian`

*Used for: bitstruct*

Lays out the bits as if the data was stored in a big endian type, regardless of host system endianness.

### `@builtin`

*Used for: function, macro, global, const*

Allows a macro, function, global or constant be used from another module without the module path prefixed.
Should be used sparingly.

### `@callconv`

*Used for: function*

Sets the calling convention, which may be ignored if the convention is not supported on the target.
Valid arguments are `veccall`, `cdecl`, `stdcall`.

:::caution
On Windows, many calls are tagged `stdcall` in the C
headers. However, this calling convention is only ever used on 32-bit Windows,
and is a no-op on 64-bit Windows.
:::

### `@compact`

*Used for: struct, union*

When placed on a struct or union, it allows the value to be compared
using `==` and `!=`. The restriction is that it may not have any
padding, as if it had the `@nopadding` attribute.

### `@const`

*Used for: macro*

This attribute will ensure that the macro is always compile time
folded (to a constant). Otherwise, a compile time error will
be issued.

### `@deprecated`

*Used for: types, function, macro, global, const, member*

Marks the particular type, global, const or member as deprecated, making use trigger a warning.

### `@dynamic`

*Used for: methods*

Mark a method for dynamic invocation. This allows the method
to be invoked through interfaces.

### `@export`

*Used for: function, global, const, enum, union, struct, faultdef*

Marks this declaration as an export, this ensures it is never removed and exposes it as public when linking.
The attribute takes an optional string value, which is the external name. This acts as if `@extern` had been
added with that name.

### `@extern`

*Used for: function, global, const, enum, union, struct, faultdef*

Sets the external (linkage) name of this declaration.

:::caution
Do not confuse this with [`@export`](#export), which is required
to export a function or global.
:::

### `@finalizer`

*Used for: function*

Make this function run at shutdown. See [`@init`](#init) for the optional priority. Note that running a
finalizer is a "best effort" attempt by the OS. During abnormal termination it is not guaranteed to run.

The function must be a void function taking no arguments.

### `@if`

*Used for: all declarations*

Conditionally includes the declaration in the compilation. It takes a constant compile time value argument, if this
value is `true` then the declaration is retained, on false it is removed.

### `@init`

*Used for: function*

Make this function run at startup before main. It has an optional priority 1 - 65535, with lower
being executed earlier. It is not recommended to use values less than 128 as they are generally
reserved and using them may interfere with standard program initialization.

The function must be a void function taking no arguments.

### `@inline`

*Used for: function, call*

Declares a function to always be inlined or if placed on a call, that the call should be inlined.

### `@link`

*Used for: module, function, macro, global, const*

Syntax for this attribute is `@link(cond, link1, link2, ...)`,
where "link1" etc are strings names for libraries to implicitly
link to when this symbol is used.

In the case of a module section, adding `@link` implicitly places the
attribute on all of its symbols.

### `@littleendian `

*Used for: bitstruct*

Lays out the bits as if the data was stored in a little endian type, regardless of host system endianness.

### `@local`

*Used for: any declaration*

Sets the visibility to "local", which means it's only visible in the current module section.

### `@maydiscard`

*Used for: function, macro*

Allows the return value of the function or macro to be discarded even if it is an optional. Should be
used sparingly.

### `@naked`

*Used for: function*

This attribute disables prologue / epilogue emission for the function.
The body of the function should be a text `asm` statement.

### `@noalias`

*Used for: function parameters*

This is similar to `restrict` in C. A parameter with `@noalias` should
be a pointer type, and the pointer is assumed not to alias to any other
pointer.

### `@nodiscard`

*Used for: function, macro*

The return value may not be discarded.

### `@noinit`

*Used for: global, local variable*

Prevents the compiler from zero initializing the variable.

### `@noinline`

*Used for: function, function call*

Prevents the compiler from inlining the function or a particular function call.

### `@nopadding`

*Used for: struct, union*

Ensures that a struct of union has no padding, emits a
compile time error otherwise.

### `@norecurse`

*Used for: import <module_name> @norecurse*

Import the module but not sub-modules or parent-modules, see [Modules Section](/language-fundamentals/modules/#non-recursive-imports).

### `@noreturn`

*Used for: function, macro*

Declares that the function will never return.

### `@nosanitize`

*Used for: function*

This prevents sanitizers from being added to this function.

### `@nostrip`

*Used for: any declaration*

This causes the declaration never to be stripped from the executable, even if it's not used. This
also transitively applies to any dependencies the declaration might have.

### `@obfuscate`

*Used for: any declaration*

Removes any string values that would identify the declaration in some way. Mostly this is used
on faults and enums to remove the stored names.

### `@operator`

*Used for: method, macro method*

This attribute has arguments `[]` `[]=` `&[]` and `len` allowing subscript [operator overloading](/generic-programming/operator-overloading/) for `[]` and `foreach`.
By implementing `[]` and `len`, `foreach` and `foreach_r` is enabled. In order to do `foreach` by reference,
`&[]` must be implemented as well.

Furthermore `==`, `!=`, bit operations and arithmetics can all be overloaded.

### `@optional`

*Used for: interface methods*

Placed on an interface method, this makes the method optional to
implement for types that implements the interface.

See the [`Printable`](/standard-library/stdlib_refcard#:~:text=interface%20Printable) interface for an example.

### `@overlap`

*Used for: bitstruct*

Allows bitstruct fields to have overlapping bit ranges.

### `@packed`

*Used for: struct, union*

Causes all members to be packed as if they had alignment 1. The alignment of the struct/union is set to 1.
This alignment can be overridden with [`@align`](#alignalignment).

### `@private`

*Used for: any declaration*

Sets the visibility to "private", which means it is visible in the same module, but not from other modules.

### `@pure`

*Used for: call*

Used to annotate a non pure function as "pure" when checking for conformance to `@pure` on
functions.

### `@reflect`

*Used for: any declaration*

Adds additional reflection information. Has no effect currently.

### `@section(name)`

*Used for: function, const, global*

Declares that a global variable or function should appear in a specific section.

### `@tag(name, value)`

*Used for: function, macro, user defined type, struct/union/bitstruct member*

Adds a compile time tag to a type, function or member which can be retrieved
at compile time using reflection: `.has_tagof` and `.tagof`.
Example: `Foo.has_tagof("bar")` will return true if `Foo` has a tag "bar".
`Foo.tagof("bar")` will return the value associated with that tag.

### `@test`

*Used for: function*

Marks the function as a test function. Will be added to the list of test functions when the tests are run,
otherwise the function will not be included in the compilation.

### `@unused`

*Used for: any declaration*

Marks the declaration as possibly unused (but should not emit a warning).

### `@used`

*Used for: any declaration*

Marks a parameter, value etc. as must being used.

### `@wasm `

*Used for: function, global, const*

This attribute may take 0, 1 or 2 arguments. With 0 or 1 arguments
it behaves identical to [`@export`](#export) if it is non-extern. For extern
symbols it behaves like [`@extern`](#extern).

When used with 2 arguments, the first argument is the wasm module,
and the second is the name. It can only be used for `extern` symbols.

### `@winmain`

*Used for: function*

This attribute is ignored on non-windows targets. On Windows,
it will create a `WinMain` entry point that will which calls
the main function. This will give other options for the `main`
argument, and is recommended for Windows GUI applications.

It is only valid for the `main` function.

### `@weak`

*Used for: function, const, global*

Emits a weak symbol rather than a global.

## User defined attributes

User defined attributes are intended for conditional application of built-in attributes.

```c3
attrdef @MyAttribute = @noreturn, @inline;

// The following two are equivalent:
fn void foo() @MyAttribute { /* */ }
fn void foo() @noreturn @inline { /* */ }
```

A user defined attribute may also be completely empty:

```c3
attrdef @MyAttributeEmpty;
```
