---
title: Attributes
description: Attributes
sidebar:
    order: 131
---

Attributes are compile-time annotations on functions, types, global constants and variables. Similar to Java annotations, a decoration may also take arguments. A attribute can also represent a bundle of attributes.

## Built in attributes

### `@align(alignment)` (struct, bitstructs, union, var, fn)

This attribute sets the minimum alignment for a field or a variable.

### `@benchmark` (fn)

Marks the function as a benchmark function. Will be added to the list of benchmark functions when the benchmarks are run,
otherwise the function will not be included in the compilation.

### `@bigendian` (bitstruct)

Lays out the bits as if the data was stored in a big endian type, regardless of host system endianness.

### `@builtin` (fn, macro, global, const)

Allows a macro, function, global or constant be used from another module without the module path prefixed.
Should be used sparingly.

### `@callc` (fn)

Sets the call convention, which may be ignored if the convention is not supported on the target.
Valid arguments are `veccall`, `ccall`, `stdcall`.

### `@deprecated` (types, fn, macro, global, const, member)

Marks the particular type, global, const or member as deprecated, making use trigger a warning.

### `@export` (fn, global, const, enum, union, struct, fault)

Marks this declaration as an export, this ensures it is never removed and exposes it as public when linking.
The attribute takes an optional string value, which is the external name. This acts as if `@extern` had been
added with that name.

### `@extern` (fn, global, const, enum, union, struct, fault)

Sets the external (linkage) name of this declaration.

### `@finalizer` (function)

Make this function run at shutdown. See `@init` for the optional priority. Note that running a
finalizer is a "best effort" attempt by the OS. During abnormal termination it is not guaranteed to run.

The function must be a void function taking no arguments.

### `@if` (all declarations)

Conditionally includes the declaration in the compilation. It takes a constant compile time value argument, if this
value is `true` then the declaration is retained, on false it is removed.

### `@init` (function)

Make this function run at startup before main. It has an optional priority 1 - 65535, with lower
being executed earlier. It is not recommended to use values less than 128 as they are generally
reserved and using them may interfere with standard program initialization.

The function must be a void function taking no arguments.

### `@inline` (fn, call)

Declares a function to always be inlined or if placed on a call, that the call should be inlined.

### `@littleendian` (bitstruct)

Lays out the bits as if the data was stored in a little endian type, regardless of host system endianness.

### `@local` (any declaration)

Sets the visibility to "local", which means it's only visible in the current module section.

### `@maydiscard` (fn, macro)

Allows the return value of the function or macro to be discarded even if it is an optional. Should be
used sparingly.

### `@naked` (fn)

This attribute disables prologue / epilogue emission for the function.

### `@nodiscard` (fn, macro)

The return value may not be discarded.

### `@noinit` (global, local)

Prevents the compiler from zero initializing the variable.

### `@noreturn` (fn)

Declares that the function will never return.

### `@nostrip` (any declaration)

This causes the declaration never to be stripped from the executable, even if it's not used. This
also transitively applies to any dependencies the declaration might have.

### `@obfuscate` (any declaration)

Removes any string values that would identify the declaration in some way. Mostly this is used
on faults and enums to remove the stored names.

### `@operator` (method, macro method)

This attribute has arguments `[]` `[]=` `&[]` and `len` allowing operator overloading for `[]` and `foreach`.
By implementing `[]` and `len`, `foreach` and `foreach_r` is enabled. In order to do `foreach` by reference,
`&[]` must be implemented as well.

### `@overlap` (bitstruct)

Allows bitstruct fields to have overlapping bit ranges.

### `@packed` (struct, union)

Causes all members to be packed as if they had alignment 1. The alignment of the struct/union is set to 1.
This alignment can be overridden with `@align`.

### `@private` (any declaration)

Sets the visibility to "private", which means it is visible in the same module, but not from other modules.

### `@pure` (call)

Used to annotate a non pure function as "pure" when checking for conformance to `@pure` on 
functions.

### `@packed` (struct, union, enum)

If used on a struct or enum: packs the type, including any components to minimum size. On an enum, it uses the smallest representation containing all its values.

### `@reflect` (any declaration)

Adds additional reflection information. Has no effect currently.

### `@section(name)` (fn, const, global)

Declares that a global variable or function should appear in a specific section.

### `@test` (fn)

Marks the function as a test function. Will be added to the list of test functions when the tests are run,
otherwise the function will not be included in the compilation.

### `@unused` (any declaration)

Marks the declaration as possibly unused (but should not emit a warning).

### `@used` (any declaration)

Marks a parameter, value etc. as must being used.

### `@weak` (fn, const, global)

Emits a weak symbol rather than a global.

## User defined attributes

User defined attributes are intended for conditional application of built-in attributes.
 
```
def @MyAttribute = { @noreturn @inline };

// The following two are equivalent:
fn void foo() @MyAttribute { ... }
fn void foo() @noreturn @inline { ... }
```

A user defined attribute may also be completely empty:

```
def @MyAttributeEmpty = {};
```
