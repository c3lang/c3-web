---
title: "C3 0.8.0 The Core Language Is Settling"
date: 2026-05-14
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
slug: 0_8_0_the_core_language_is_settling
search:
  exclude: true
---

C3 is a programming language that evolves C – the same low-level model but with modern ergonomics. With 0.8.0, we're getting our first real glimpse of what C3 1.0 will look like: the core language design is now locking into its final shape.

Two changes are big enough to deserve their own posts. The compile time reflection system has been reworked into its final form — and in the process we got to kill off half the builtins: [link](https://c3-lang.org/blog/lets-kill-off-half-the-builtins-in-080/). And we're making the move to signed by default, correcting what turned out to be a five-year mistake: [link](https://c3-lang.org/blog/unsigned-sizes-a-five-year-mistake/).

As with all 0.x.0 releases, we've tried to collect all the breaking changes into this single release, so the rest of the 0.8.x line can stay backwards compatible.

Aside from the reflection changes, these are the major changes:

## Distinct types

### Distinct types now defaults to be "structlike"

0.7.4 introduced the concept of `@structlike` which meant a distinct type could not implicitly convert from a literal. With 0.8.0 we flip the defaults: by default distinct types do not convert from literals, but with `@constinit` they do:

```c3
// 0.7.4
distinct Foo7 = int;
distinct Bar7 @structlike = int;

Foo7 f = 1;      // Ok
// Bar7 b = 1; ERROR!
Bar7 b = (Bar7)1; // Ok 

// 0.8.0
distinct Foo8 @constinit = int;
distinct Bar8 = int;

Foo8 f = 1;      // Ok
// Bar8 b = 1; ERROR!
Bar8 b = (Bar8)1; // Ok 
```

Often people were assuming "structlike" behaviour, cause accidental bugs. For this reason we flipped the defaults.

## Enums and constdef

### No more +/-

Doing addition on enums is no longer possible:

```c3
// 0.7.4
MyEnum foo = BAR;
MyEnum baz = foo + 1; // OK!

// 0.8.0
MyEnum foo = BAR;
// MyEnum baz = foo + 1; ERROR!
MyEnum baz = (MyEnum)(foo.ordinal + 1); // OK
```

### Enhanced ++/--

Enums still support `++`/`--` and get implicit wrapping when overshooting the ends:
```c3
enum MyEnum
{
    ABC,
    DEF,
    GHI
}
fn void test()
{
    MyEnum e = ABC;
    e++; // e is now DEF
    e++; // e is now GHI
    e++; // e is now ABC through overflow wrapping
    e--; // e is now GHI through underflow wrapping
}
```

### Removed `inline` enums

To simplify the language, `inline` enums were dropped.

```c3
// Ok in 0.7.x, error in 0.8.0
enum YourEnum : inline int
{
    TEST
}

int x = YourEnum.TEST; // Valid due to inline
```

### Implicit conversion to ordinal when used as index

Enums will now implicitly convert to ordinals when used as index:

```c3
enum YourEnum8
{
    HELLO,
    WORLD
}

fn void test()
{
    int[2] x;
    x[YourEnum8.WORLD] = 123; // Same as x[1] = 123
}
```

### `.nameof` has become `.description`

```c3
enum Foo
{
    TESTING,
    THE,
    NEW,
    DESCRIPTION
}

// 0.7.11
String s = TESTING.nameof;      // "TESTING"

// 0.8.0
String s = TESTING.description; // "TESTING"
```

### Constdef now infers through unary negations

Unary negation would previously prevent constdef inference
```c3
constdef Abc
{
    ABC = 4,
    DEF = -4
}

Abc a = ABC; // Ok
Abc b = -ABC; // Ok in 0.8.0
Abc c = ~ABC; // Ok in 0.8.0
```

## Operator overloading

### Overloads for comparisons

`@operator(<)` is now added, so that a type which overloads both `<` and `==` can participate in all comparisons.

### `@operator(!=)` removed

`@operator(!=)` was removed as it had limited usefulness.

## Compile time enhancements

### Shadow an `a = ...` parameter if it's not defined

Shadowing is now allowed:

```c3
macro @foo(a = ...)
{
    $if !$defined(a)
        var a = 123; // Previously a shadowing error
    $endif
    return a * 2;    
}
```

### Use `$eval` as the name of a named parameter

```c3
foo(arg: 2);

// Possible since 0.8.0:
foo($eval("arg"): 2);
```

### `untypedlist` as a new builtin type

During compile time, some compile time arrays get the type "untypedlist", containing a (possibly heterogenous) list of values. Previously it was possible to create it, but it wasn't possible to directly reference the type. This changes with 0.8.0:

```c3
// 0.7.11 - 'var' is the only possibility
var $foo = { 1, "hello", 3.14 };

// 0.8.0
untypedlist $foo2 = { 1, "hello", 3.14 };
```

The main use is to be able to test whether an expression is an untyped list or not. Regular variables cannot have this type, it's a compile time type only.

### Added a `tags` property

An often requested functionality is getting all the tags on a type or member. This is now finally possible in 0.8.0:

```c
struct Foo @tag("a", "hello") @tag("b", "test")
{
    int x @tag("c", 5);
}

int a_global @tag("d", 3.14);

String[] $tags_of_foo = Foo::tags; // { "a", "b" }
String[] $tags_of_x = $reflect(Foo.x).tags; // { "c" }
String[] $tags_of_a_global = $reflect(a_global).tags; // { "d" }
```

Also note that name for retrieving and testing for tags have changed to `get_tag` and `has_tag`.

### Allow taking the type of an interface method

It's now possible to take the type of an interface method:

```c3
interface TestInterface
{
    fn void hello_world(String name);
}

$Typeof(TestInterface.hello_world) x;
```

### `$expand` compile time function

The new `$expand` compile time function allows turning any string to code. For this reason it's inherently LSP/IDE hostile, but simplifies cases where otherwise `$exec` was the only option:

```c3

import std::io;

// This code prints "Hello"
$expand(`fn void hello() { io::printn("Hello"); }`);

fn void main()
{
    $expand(@sprintf("%s();", "hello"));
}
```

Use with care.

### Removal of $xxxxof style builtins, updated type access

This has its own article: https://c3-lang.org/blog/lets-kill-off-half-the-builtins-in-080/


## Contracts

### `@mustinit`

This attribute enforces initialization of a type:

```c3
struct Foo @mustinit
{
    int a;
}

fn void test()
{
    // Foo f @noinit; ERROR, must be initialized
    Foo f2; // Ok, zero initialization is fine
}
```

## Generics

### Generic inference now looks through pointers

This did not work in 0.7.11, but will infer `{int}` in 0.8.0:

```c3
// "create_buffered" is a generic function
BufferedChannel{int}* c = channel::create_buffered(mem, 1);
```

### Nested generics in generic functions/methods

An omission prevented this from working:
```c3
fn List{List{Type}} return_nested_list() <Type>
{
    List{List{Type}} l;
    l.init();
    return l;
}
```

## Syntax changes

### Removal of deprecated syntax:

- Removed `iXX` and `uXX` suffixes.
- Removed `Enum.lookup`.
- Removed `?` as suffix operator in the expression `io::EOF?`.

### `??` and `?:` has new precedence and binds tighter than `+` and `-`

This change is tied to the removal of `?` as a suffix operator. Previously there were essentially parser hacks to get the right precedence in various situations, such as `foo() ?? io::EOF?!`.  The new precedence places `??` and `?:` tighter than `+ -`, but looser than `| & ^`.


With this tighter precedence, some things change meaning:

```c3
// Parses as (foo() ?? io::EOF~) + 3 in 0.8.0
int a = foo() ?? io::EOF~ + 3;

// Parses as (b ?: 4) + foo() in 0.8.0
int a = b ?: 4 + foo();

// Still parses as as (foo() ?? (b | 3))
int a = foo() ?? b | 3;
```

### `$Typeof` and `$Typefrom` instead of `$typeof`, $typefrom`

This is a simple name change, to make it clearer that they can be in a type slot, as opposed to being a value.

### `alias Foo = int::typeid` now works

```c3
macro typeid @get_type()
{
    return SOME_CONST ? int : double;
}

// 0.7.11
alias Foo = $Typefrom(@get_type());

// 0.8.0
alias Foo = @get_type();
```

## Toolchain changes

### `docgen` command for html documentation generation

This major addition to the C3 compiler now allows you do produce high quality documentation out of the box. This is also (finally!) ensuring that this site has up to date docs: https://c3-lang.org/standard-library/docs.html.

### Support for Emscripten

The C3 compiler now has experimental support for Emscripten out of the box.

### Reduced library dependency scanning

Only used libraries are now scanned for dependencies. Let's say you have two libraries in your /lib folder "a.c3l" and "b.c3l", "b.c3l" depends on "c.c3l" which isn't in the folder. However, your code only uses "a.c3l". Previously this would have been an error, signalling it could not find "c.c3l" despite it not being used which complicated cross platform compilation setups.

### Windows installer for the C3 compiler

To simplify getting the C3 compiler up on Windows for beginners, there's now a Windows installer.

## Stdlib changes

### Changes to API:

- `BufferedChannel` and `UnbufferedChannel` are now pointers
- JSON api changes: `parse` -> `load`, `parse_string` -> `parse`. It now supports two flavors of JSON: JSON and JSONC
- `std::math` name changes: `PI_2` => `HALF_PI`, `PI_4` => `QUARTER_PI`, `DIV_PI` => `INV_PI` etc, `cosec` => `csc`, `cotan` => `cot`, `muladd` => `mad`
- `std::time` name changes: `diff_hour` => `diff_hours`. `DateTime.set_date` => `DateTime.set`, `datetime::from_date_*` => `datetime::at_*`
- `std::hash` method name convention changes: `updatec` / `update_char` => `update_byte`.
- `std::string` name changes: `strip` => `strip_prefix`, `strip_end` => `strip_suffix`.
- Ordering of `object::new_*` arguments are now "allocator first".
- `InStream.set_cursor` is renamed `seek`, and the old `seek` is removed.
- The `Path` API now is split into `PathPosix` and `PathWin`, `Path` is implicitly castable to `String` and loses the `str_view()` method. Use `path::tnew` instead of `path::temp` for a temporary path.
- PanicFn now takes an `int` for row.
- `ElasticArray` renamed `FixedList`.
- Updated `ref::new` argument order.

### Additions to the stdlib

- Add `SortedMap` based on skip lists.
- Add `OneShotChannel` to `std::thread::channel` for single-send/single-receive thread synchronization.
- Add `std::collections::Deque`.
- Ini parser and encoder.
- Mergesort added.
- `std::encoding::xml` for XML parsing and serialization.

- Make `DString.append_repeat` polymorphic adding `append_string_repeat` and `append_char_repeat`. `DString.append_inline` for optimized uses.
- `List` and `FixedList` adds a `remove_unordered_at`.
- `channel::create_unbuffered` and `channel::create_buffered` to create channels
- `String.compare_to` and `String.compare_to_ignore_case` added.
- `RingBuffer` now conforms to `foreach` and adds additional functions.
- `conv::detect_bom`, converts utf16/utf32 from bytes with byteswaped / unaligned data.
- `Object.to_value` was added to convert an object to a value.
- Add multi part and extension support to `Path.append`.

## Fixes

The 0.8.0 release contains around 50 fixes to stdlib but also addressing issues around vector lowering.

## Summarizing

This is just the diff between 0.7.11 and 0.8.0. Compared against 0.7.0 the list would be huge — which might raise a worry: is the language not stabilizing?

But the opposite is true. The difference between 0.7.11 and 0.8.0 is actually fairly small. Most of the work from 0.7.0 to 0.7.11 went into refinements — closing gaps in semantics and functionality, and responding to concerns from real-world use. If you're looking at C3 from the outside, a small breaking-change diff this late in the 0.7 series is a good sign: the design is settling, and 1.0 is coming into view. The docgen work is a key piece of that puzzle, and it's now in place.

For 0.8.x we're looking forward to continuing to flesh out the stdlib, improving generics inference, and tackling the remaining tasks needed for 1.0.

## Thank yous

Again, this release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

I'd like to especially thank Manu Linares who this month single-handedly implemented the Docgen in the compiler, and refreshed the website as well.

### PR contributors for this release

**Stdlib:**
Christian Reifberger, cmann1, corleypc, Darvisim, Fernando López Guevara, Manu Linares, Mathis Laroche, Nyr24, Peng He, Sander van den Bosch, surrealism21.

**Compiler & toolchain:**
Dmitry Atamanov, Fernando López Guevara, Johannes Müller, Manu Linares, Tomás Lopes, Zack Puhl,

**CI/Infrastructure:**
Fernando López Guevara, Manu Linares, LowByteFox

### Change Log
<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- Removed "old-enums, old-slice-copy and old-compact-eq" feature flags.
- Removed deprecated `$evaltype`.
- Removed all deprecated (as of 0.7.11) types and functions from the stdlib.
- Removed deprecated `iXX` and `uXX` suffixes.
- Removed deprecated `Enum.lookup`.
- Removed deprecated `?` as suffix operator in the expression `io::EOF?`.
- Removed deprecated `module foo {Type}` generic syntax.
- Distinct types now defaults to be "structlike"
- Removed `@structlike` attribute.
- Removed deprecated `@extern` attribute.
- `:` in contracts before description is now mandatory.
- Removed deprecated `Enum.associated` (use `Enum::members`).
- Removed deprecated `Enum.elements` (use `Enum::len`).
- Removed deprecated `foo_function.params` (use `$reflect(foo_function).params`).
- Removed deprecated `$is_const`.
- Removed deprecated `$assignable`.
- Enums now no longer directly support `+` and `-` – use ordinals instead.
- For enums, using `++` and `--` will step through enums with implicit wrap-around.
- Rename `isz` -> `sz`.
- Make $sizeof, $alignof and all similar functions return `sz` instead of `usz`.
- Align literal types with C semantics.
- Use value promotion instead of signedness promotion to int. So that small unsigned types promote to int, not uint.
- Add a `@mustinit` attribute to enforce zero-initialization of a type. #3094
- Improve error message when keyword is used instead of an expression. #3088
- Add `--warn-recursivecontracts`.
- Mutex.destroy and friends no longer return optionals.
- Remove `@operator(!=)` overload.
- Add `@operator(<)` overload, enabling type comparison overloads.
- Generic inference can now look through pointer.
- Enums now implicitly convert to their ordinal when used as indices.
- Enums can no longer declare themselves `inline`.
- Nested generics allowed inside generic functions/methods.
- `a = ...` parameters may be shadowed if not defined.
- `$eval` can now be used with named parameters, e.g. `foo($eval("arg"): 2)` #3090
- Type properties are now accessed using `::` and the "of" suffix, removed: `int.sizeof` -> `int::size`
- Added `$reflect` with properties `name`, `cname`, `qname`, `offset`, `alignment`, `size`.
- Added `@kindof`, `@alignof` and `@sizeof` macros.
- Removed `$nameof`, `$extnameof`, `$qnameof`, `$offsetof`, `$alignof`, `$kindof`, `$sizeof`.
- `.nameof` is changed to `.description` on `fault` and enum types.
- Type property `is_eq` is renamed `has_equals`.
- Type function `tagof` is renamed `get_tag`.
- Add `untypedlist` as a usable type #2647.
- `??` and `?:` has new precedence and binds tighter than `+` and `-`
- Added the `tags` property for types and `$reflect`.
- Allow taking the type of an interface method.
- Add `$expand` compile time function to convert strings to code.
- Constdef now infers through unary negations.
- Only used libraries are scanned for dependencies. #3144
- `$vaconst`, `$vaexpr` and `$vatype` removed.
- Improve error message on unsupported typeid runtime access at runtime. #3170
- Added support for Emscripten.
- Replace `$vacount` by `$vaarg.len`, replace `$vasplat` by `...$vaarg`.
- `$vaarg` behaves as `$vaexpr`.
- Added `docgen` command to generate documentation.
- Added `jmpabs` x86 CPU feature.
- Implicit unsigned <-> signed integer conversions removed.
- Added C3 Compiler setup installer for Windows
- `alias Foo = int::typeid` now works.
- `$typeof` => `$Typeof`, `$typefrom` => `$Typefrom`.

### Stdlib changes
- Add `List.remove_unordered_at`.
- PanicFn now takes an `int` for row.
- Add `std::collections::Deque`.
- Add `compare_to` and `compare_to_ignore_case` to `String`. #3096
- Add `SortedMap` based on skip lists.
- Add `OneShotChannel` to `std::thread::channel` for single-send/single-receive thread synchronization.
- `BufferedChannel` and `UnbufferedChannel` are now pointers, create using `create_unbuffered` and `create_buffered`
- `RingBuffer` now conforms to `foreach` and adds additional functions.
- Ini parser and encoder.
- Updated `ref::new` argument order.
- Support setting thread stack size.
- Support setting thread priority.
- Support syscall on RISCV.
- Make `DString.append_repeat` polymorphic adding `append_string_repeat` and `append_char_repeat`.
- Add `DString.append_inline` for optimized uses.
- Ordering of `object::new_*` arguments are now "allocator first".
- Add `remove_unordered_at` to FixedList.
- Changed `json` to support two flavors of JSON: JSON and JSONC.
- Changed `json` API: `parse` -> `load`, `parse_string` -> `parse`.
- `conv::detect_bom`, convert utf16/utf32 from bytes with byteswap / unaligned data.
- Mergesort added.
- `set_cursor` is renamed `seek`, and the old `seek` is removed.
- `std::math` name changes: `PI_2` => `HALF_PI`, `QUARTER_PI` => `PI_4`, `DIV_PI` => `INV_PI` etc, `cosec` => `csc`, `cotan` => `cot`, `muladd` => `mad`
- `std::time` name changes: `diff_hour` => `diff_hours`. `DateTime.set_date` => `DateTime.set`, `datetime::from_date_*` => `datetime::at_*`
- `std::hash` method name convention changes: `updatec` / `update_char` => `update_byte`.
- `std::string` name changes: `strip` => `strip_prefix`, `strip_end` => `strip_suffix`.
- `std::collections::object` added `Object.to_value` to convert from an object to a value.
- `std::encoding::xml` added for XML parsing and serialization.
- Fix `Path.append` separator not honoring the specified environment.
- Add multi part and extension support to `Path.append`.
- The `Path` API now is split into `PathPosix` and `PathWin`, `Path` is implicitly castable to `String` and loses the `str_view()` method. Use `path::tnew` instead of `path::temp` for a temporary path.

### Fixes
- Slice comparison lowering would not work correctly in macros in some cases. #3095
- Attributes `@allow_deprecated`, `@constinit`, `@noalias`, `@nostrip`, and `@optional` would erroneously accept parameters. #3098
- Fix pipe handle leaks across concurrent process spawns #10067.
- `$$trap` was incorrectly marked noreturn.
- Recursive inclusion of contracts was not detected.
- `\r` was not filtered when piping a source file from stdin.
- SHA-3 and Keccak contexts are now explicitly `@mustinit` structures. #3110
- `UnbufferedChannel` would deadlock on multiple producers.
- Don't override `sigaltstack` when running with `--sanitize=address`. #3115
- Binary search broken for some supported functions.
- Fix bug casting `(void*[<3>])x`.
- Compiler crash compiling a switch with a constant case range overlapping a constant case value. #3127
- Incorrect handling of overaligned struct fields #3136
- EnumSet with more than 128 entries was broken.
- Handle underflow in zip.
- Bugs in check for name suggestions on name mismatch.
- Fix bug where only one ensure would not be inlined correctly. #3162
- Incorrect error message when casting to non-existent enum.
- Macro `$Type = ...` would not work correctly with `$defined`
- Fix enum value handling in `Object` (`std::collections::object`) to conform with changes in enums.
- Compiler assert in certain cases with ?? and void returns. #3168
- Bug in compiler-rt for i128 shift.
- LinkedBlockingQueue.push_timeout did not work correctly.
- Splat into vaarg macro, where vaarg is not used #2782.
- Comparison with floats had incorrect codegen, leading to incorrect results for NaN #3175.
- Zeroing out simd vectors in a struct could in some cases lead to incorrect lowering #3179.
- Incorrect lowering when returning a struct to an optional value on Win64 in some cases #3180.
- Fix bug where a method is considered doubly generic if declared in a generic module for a generic type. #3176
- Fix exp10 on platforms without exp10 as an LLVM builtin.
- LLVM 23 compatibility: map `Os`/`Oz` to `O2` pass pipeline, fix `returnaddress` intrinsic signature, add `optsize`/`minsize` function attributes.
- Warning for ignored visibility modifiers was not emitted for macro methods #3071
- `while (String? x = foo()!)` was accidentally allowed causing a lowering error.
- Crash casting uint to bitstruct inside struct field assignment #3187
- Vec2/Vec3 transform missed matrix translation.
- Matrix rotation ignored matrix itself.
- Fix BigInt shr, to_format, and others.
- Fix ends in TDist.quantile, FDist.pdf, ChiSquaredDist.pdf
- Fix to easing expo_in and bounce_inout.
- `deque` with shrinking a zero sized list caused infinite loop.
- Printing an enummap yielded the wrong character count.
- Incorrect contract in `FixedList` allowed insert out of range.
- Fix double-free in InterfaceList.
- Object.set_at was incorrect.
- Bitstruct with backing char[n] would occasionally be incorrectly stored.
- fmuladd lowering crashes on `a + -(b * c)` with fastmath.
- Constant folding `-30 % -7` would incorrectly yield "2".
- Parsing << in asm would not be correctly handled.
- Incorrect lowering for `float[<3>]` when placed aligned in a struct.

</details>

### Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).