---
title: "C3 reaches the 0.6 milestone!"
date: 2024-06-13
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8918-c3_reaches_the_0.6_milestone%2521](https://c3.handmade.network/blog/p/8918-c3_reaches_the_0.6_milestone%2521)*

It's been three months and finally version 0.6.0 is here!

C3 was on a monthly update cycle, so what happened to version 0.5.6? Actually the main branch contained a releasable 0.5.6 for the last two months, but I didn't release it. A release takes a bit of time updating everything and making announcements and so on, and I felt that maybe I should just release version 0.6.0 instead – rather than to push the relatively small 0.5.6.

But on the other hand I kept delaying 0.6.0, because I was looking for more breaking changes to add (recall that 0.5.x cannot introduce any breaking changes for 0.5 code, so 0.6.0 is where the breaking changes happen)

However, now 0.6.0 is stable enough, and there has lately been very little to backport into the 0.5.x branch. So it's time to do the 0.6.0 release.

Let's go through what happened since 0.5.5 first:

### Updated enum syntax

Using enums with associated values now look more like defining C enums than Java enums:

```
// Old
enum Foo : int (int value, double value2)
{
    A(1, 2.0),
    B(2, 4.0)
}
enum Bar : int (int value)
{
    C(7),
    D(9)
}

// New
enum Foo : int (int value, double value2)
{
    A = { 1, 2.0 },
    B = { 2, 4.0 }
}
enum Bar : int (int value)
{
    C = 7, // Also possible to write as C = { 7 }
    D = 9
}
```

The new syntax also allows the enum size to be elided when there are *associated values*:

```
enum Foo : (int value, double value2)
{
    A = { 1, 2.0 },
    B = { 2, 4.0 }
}
```

There were other ideas around the enums, allowing them to be used more like unordered C enums. However, the experimental attempts showed little promise. Maybe this will be revisited for version 0.7.

### Changes to any / interfaces

Two things changed, the most important thing is that the 0.5 change where `any` was handled written as a pointer (`any*`) was rolled back. This was a trade-off: in some cases using `any*` felt like it better expressed what was going on, but in other cases it ended up being confusing.

Secondly `@default` implementations for interfaces were removed. The need for these were greatly reduced when the stdlib moved from "call the method on the type" to "call a function with the interface" style (see std::io for examples).

### Guaranteed jump tables

For switches it's now possible to get guaranteed calculated goto jump tables by using the `@jump` attribute:

```
switch (a) @jump
{
    case 1: res(1);
    case 3: res(3);
}
```

The above code will lower to an array of jump destinations which is indexed into and then jumped to.

### RGBA swizzling

In addition to swizzling using `xyzw` it's now possible to use `rgba` as well:

```
int[<4>] abc = { 1, 2, 3, 4 };
int[<3>] z = abc.xwz; // Grabs index 1, 4 and 3
int[<3>] c = abc.rab; // Same as above
```

### More distinct types

It's now possible to make distinct types out of `void`, `typeid`, `anyfault` and fault types.

### Catch an error in defer

It's now possible to get the error thrown when using `defer catch` statements:

```
defer catch io::printn("Exit due to some error"); 
defer (catch err) io::printfn("Exit due to: %s", err); // New
```

### Stricter semantics for `if try`

It's no longer possible to do:

```
if (try foo() + 1) { ... }
```

The semantics of this code was a bit confusing, so in 0.6.0 you may no longer do "if try" binary or unary expressions. You may however still test expressions like `if (try (foo() + 1))`.

### Changes in command-line arguments

* Added `--output-dir` to set the output directory.
* Added `--print-input` to print all files used for compilation.
* Removed `--system-linker` and replaced it by `--linker` which also allows setting custom linkers.

### Stricter `@if` evaluation

Evaluating `@if` on the top level is always subject to ordering issues. For this reason 0.6 does not permit conditional definition guarded by `@if` to depend on something that in itself depended on `@if`.

```
int foo;
// This would succeed on 0.5.x, but changing the
// ordering, placing `B` before `a` would be a compile error.
const B @if($defined(foo)) = 1;
const B @if(!$defined(foo)) = 2;
int a @if(B == 1);
```

In 0.6.0 the above code is an error, as "a" depends on the conditional "B".

This change helps preventing the user from accidentally building code that depends on top level ordering.

### `assert(false)` disallowed

Aside from (compile time known) unused branches and tests, asserts that are compile time evaluated to be false are now compile time errors. This allows asserts to detect more broken code at compile time.

```
const A = 1;
if (A == 0)
{
  assert(false); // Ok, dead branch.
}
else
{
  assert(false); // This is a compile time error
}
assert(A == 0); // Also a compile time error.
```

### More permissive function definitions

Functions definitions may now be recursive (e.g. a function type taking as argument a pointer to itself).

### Better errors for inlined macros

The code now provides a backtrace to where the macro was first inlined when detecting an error.

### Improved debug information

The debug information has gotten an overhaul, in particular debug information for macros are much improved.

### Changes to the stdlib

Various fixes, but perhaps most importantly list types now consistently use `push` rather than `add`, and `pop` now always return an Optional result.

## The full change list 0.5.5 -> 0.6.0

### Changes / improvements

* `@default` implementations for interfaces removed.
* `any*` => `any`, same for interfaces.
* Private / local globals now have `internal` visibility in LLVM.
* Updated enum syntax.
* 'rgba' also available for swizzling.
* The name "subarray" has been replaced by the more well known name "slice' across the codebase.
* Improved alignment handling.
* Add `--output-dir` to command line. #1155
* Allow making distinct types out of "void", "typeid", "anyfault" and faults.
* Removed `--system-linker` setting.
* "Try" expressions may not be any binary or unary expressions. So for example `try foo() + 1` is disallowed.
* Added `$$REGISTER_SIZE` for int register size.
* `assert(false)` only allowed in unused branches or in tests. Compile time failed asserts is a compile time error.
* Require expression blocks returning values to have the value used.
* Detect "unsigned >= 0" as errors.
* Improve callstack debug information #1184.
* Request jump table using @jump for switches.
* Improved inline debug information.
* Improved error messages on inlined macros.
* Introduce MSVC compatible SIMD ABI.
* `$foreach` doesn't create an implicit syntactic scope.
* Error of `@if` depends on `@if`
* Support `defer (catch err)`
* Added `print-input` command argument to print all files used for compilation
* Allow recursive function definitions as long as they are pointers. #1182
* Default CPU to native if less than AVX, otherwise use AVX.
* Bounds checking on length for `foo[1:2]` slicing #1191.
* Foreach uses non-wrapping add/dec.

### Fixes

* Fixed issue in safe mode when converting enums.
* Better checking of operator methods.
* Bug when assigning an optional from an optional.
* Lambdas were not type checked thoroughly #1185.
* Fix problems using reflection on interface types #1203.
* `@param` with unnamed macro varargs could crash the compiler.
* Compiler crash using enum nameof from different module #1205.
* Incorrect length passed to scratch buffer printf.
* Casting to a bitstruct would be allowed even if the type was the wrong size.
* Generic modules parameterized with constants would sometimes get the wrong parameterized module name causing conversion errors #1192.
* Duplicate emit of expressions on negation would incorrectly compile negated macros.
* Casting a slice address to its pointer type should not compile #1193.
* Union is not properly zero-initialized with designated initializer #1194.
* Compile time fmod evaluates to 0 #1195.
* Assertion failed when casting (unsigned) argument to enum #1196
* Correct debug info on parameters without storage.
* Fix location on foreach debug output.
* Compiler crash on designated initializer for structs with bitstruct.

### Stdlib changes

* "init\_new/init\_temp" removed.
* LinkedList API rewritten.
* List "pop" and "remove" function now return Optionals.
* RingBuffer API rewritten. Allocator interface changed.
* Deprecated Allocator, DString and mem functions removed.
* "identity" functions are now constants for Matrix and Complex numbers.
* Removed 'append' from Object and List, replaced by 'push'.
* `GenericList` renamed `AnyList`.
* Proper handling of '.' and Win32 '//server' paths.
* Path normalization - fix possible null terminator out of bounds.
* Add 'zstr' variants for `string::new_format` / `string::tformat`.
* Fix mutex and wait signatures for Win32.

0.6 has feature stability guarantees, code written for 0.6.0 will work with all of 0.6.x.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

It's been three months and finally version 0.6.0 is here!

C3 was on a monthly update cycle, so what happened to version 0.5.6? Actually the main branch contained a releasable 0.5.6 for the last two months, but I didn't release it. A release takes a bit of time updating everything and making announcements and so on, and I felt that maybe I should just release version 0.6.0 instead – rather than to push the relatively small 0.5.6.

But on the other hand I kept delaying 0.6.0, because I was looking for more breaking changes to add (recall that 0.5.x cannot introduce any breaking changes for 0.5 code, so 0.6.0 is where the breaking changes happen)

However, now 0.6.0 is stable enough, and there has lately been very little to backport into the 0.5.x branch. So it's time to do the 0.6.0 release.

Let's go through what happened since 0.5.5 first:

### Updated enum syntax

Using enums with associated values now look more like defining C enums than Java enums:

```
// Old
enum Foo : int (int value, double value2)
{
    A(1, 2.0),
    B(2, 4.0)
}
enum Bar : int (int value)
{
    C(7),
    D(9)
}

// New
enum Foo : int (int value, double value2)
{
    A = { 1, 2.0 },
    B = { 2, 4.0 }
}
enum Bar : int (int value)
{
    C = 7, // Also possible to write as C = { 7 }
    D = 9
}
```

The new syntax also allows the enum size to be elided when there are *associated values*:

```
enum Foo : (int value, double value2)
{
    A = { 1, 2.0 },
    B = { 2, 4.0 }
}
```

There were other ideas around the enums, allowing them to be used more like unordered C enums. However, the experimental attempts showed little promise. Maybe this will be revisited for version 0.7.

### Changes to any / interfaces

Two things changed, the most important thing is that the 0.5 change where `any` was handled written as a pointer (`any*`) was rolled back. This was a trade-off: in some cases using `any*` felt like it better expressed what was going on, but in other cases it ended up being confusing.

Secondly `@default` implementations for interfaces were removed. The need for these were greatly reduced when the stdlib moved from "call the method on the type" to "call a function with the interface" style (see std::io for examples).

### Guaranteed jump tables

For switches it's now possible to get guaranteed calculated goto jump tables by using the `@jump` attribute:

```
switch (a) @jump
{
    case 1: res(1);
    case 3: res(3);
}
```

The above code will lower to an array of jump destinations which is indexed into and then jumped to.

### RGBA swizzling

In addition to swizzling using `xyzw` it's now possible to use `rgba` as well:

```
int[<4>] abc = { 1, 2, 3, 4 };
int[<3>] z = abc.xwz; // Grabs index 1, 4 and 3
int[<3>] c = abc.rab; // Same as above
```

### More distinct types

It's now possible to make distinct types out of `void`, `typeid`, `anyfault` and fault types.

### Catch an error in defer

It's now possible to get the error thrown when using `defer catch` statements:

```
defer catch io::printn("Exit due to some error"); 
defer (catch err) io::printfn("Exit due to: %s", err); // New
```

### Stricter semantics for `if try`

It's no longer possible to do:

```
if (try foo() + 1) { ... }
```

The semantics of this code was a bit confusing, so in 0.6.0 you may no longer do "if try" binary or unary expressions. You may however still test expressions like `if (try (foo() + 1))`.

### Changes in command-line arguments

* Added `--output-dir` to set the output directory.
* Added `--print-input` to print all files used for compilation.
* Removed `--system-linker` and replaced it by `--linker` which also allows setting custom linkers.

### Stricter `@if` evaluation

Evaluating `@if` on the top level is always subject to ordering issues. For this reason 0.6 does not permit conditional definition guarded by `@if` to depend on something that in itself depended on `@if`.

```
int foo;
// This would succeed on 0.5.x, but changing the
// ordering, placing `B` before `a` would be a compile error.
const B @if($defined(foo)) = 1;
const B @if(!$defined(foo)) = 2;
int a @if(B == 1);
```

In 0.6.0 the above code is an error, as "a" depends on the conditional "B".

This change helps preventing the user from accidentally building code that depends on top level ordering.

### `assert(false)` disallowed

Aside from (compile time known) unused branches and tests, asserts that are compile time evaluated to be false are now compile time errors. This allows asserts to detect more broken code at compile time.

```
const A = 1;
if (A == 0)
{
  assert(false); // Ok, dead branch.
}
else
{
  assert(false); // This is a compile time error
}
assert(A == 0); // Also a compile time error.
```

### More permissive function definitions

Functions definitions may now be recursive (e.g. a function type taking as argument a pointer to itself).

### Better errors for inlined macros

The code now provides a backtrace to where the macro was first inlined when detecting an error.

### Improved debug information

The debug information has gotten an overhaul, in particular debug information for macros are much improved.

### Changes to the stdlib

Various fixes, but perhaps most importantly list types now consistently use `push` rather than `add`, and `pop` now always return an Optional result.

## The full change list 0.5.5 -> 0.6.0

### Changes / improvements

* `@default` implementations for interfaces removed.
* `any*` => `any`, same for interfaces.
* Private / local globals now have `internal` visibility in LLVM.
* Updated enum syntax.
* 'rgba' also available for swizzling.
* The name "subarray" has been replaced by the more well known name "slice' across the codebase.
* Improved alignment handling.
* Add `--output-dir` to command line. #1155
* Allow making distinct types out of "void", "typeid", "anyfault" and faults.
* Removed `--system-linker` setting.
* "Try" expressions may not be any binary or unary expressions. So for example `try foo() + 1` is disallowed.
* Added `$$REGISTER_SIZE` for int register size.
* `assert(false)` only allowed in unused branches or in tests. Compile time failed asserts is a compile time error.
* Require expression blocks returning values to have the value used.
* Detect "unsigned >= 0" as errors.
* Improve callstack debug information #1184.
* Request jump table using @jump for switches.
* Improved inline debug information.
* Improved error messages on inlined macros.
* Introduce MSVC compatible SIMD ABI.
* `$foreach` doesn't create an implicit syntactic scope.
* Error of `@if` depends on `@if`
* Support `defer (catch err)`
* Added `print-input` command argument to print all files used for compilation
* Allow recursive function definitions as long as they are pointers. #1182
* Default CPU to native if less than AVX, otherwise use AVX.
* Bounds checking on length for `foo[1:2]` slicing #1191.
* Foreach uses non-wrapping add/dec.

### Fixes

* Fixed issue in safe mode when converting enums.
* Better checking of operator methods.
* Bug when assigning an optional from an optional.
* Lambdas were not type checked thoroughly #1185.
* Fix problems using reflection on interface types #1203.
* `@param` with unnamed macro varargs could crash the compiler.
* Compiler crash using enum nameof from different module #1205.
* Incorrect length passed to scratch buffer printf.
* Casting to a bitstruct would be allowed even if the type was the wrong size.
* Generic modules parameterized with constants would sometimes get the wrong parameterized module name causing conversion errors #1192.
* Duplicate emit of expressions on negation would incorrectly compile negated macros.
* Casting a slice address to its pointer type should not compile #1193.
* Union is not properly zero-initialized with designated initializer #1194.
* Compile time fmod evaluates to 0 #1195.
* Assertion failed when casting (unsigned) argument to enum #1196
* Correct debug info on parameters without storage.
* Fix location on foreach debug output.
* Compiler crash on designated initializer for structs with bitstruct.

### Stdlib changes

* "init\_new/init\_temp" removed.
* LinkedList API rewritten.
* List "pop" and "remove" function now return Optionals.
* RingBuffer API rewritten. Allocator interface changed.
* Deprecated Allocator, DString and mem functions removed.
* "identity" functions are now constants for Matrix and Complex numbers.
* Removed 'append' from Object and List, replaced by 'push'.
* `GenericList` renamed `AnyList`.
* Proper handling of '.' and Win32 '//server' paths.
* Path normalization - fix possible null terminator out of bounds.
* Add 'zstr' variants for `string::new_format` / `string::tformat`.
* Fix mutex and wait signatures for Win32.

0.6 has feature stability guarantees, code written for 0.6.0 will work with all of 0.6.x.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>