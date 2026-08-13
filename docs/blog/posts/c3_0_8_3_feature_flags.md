---
title: "C3 0.8.3 Feature flags"
date: 2026-08-13
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
slug: c3_0_8_3_feature_flags
---

C3 0.8.3 is now available. The most notable change is the addition of the `@feat` attribute, which will be the new
way to do top-level conditional compilation.

## Language changes & improvements

### @feat

This release adds the `@feat` attribute, which is replacing the older `@if` usage on non-generic top-level declarations. This attribute is essentially the same as `@if($feature(...))` before 0.8.3, but top-level `@if` is now getting phased out except for use in generics.

#### The problem with `@if`

Before `@if` we had `$if` on the top level, mirroring C's `#if` and `#ifdef`. However, this gave very little information for the compiler when someone tried to use a declaration guarded by `$if`. So `@if` was introduced to give more granular support and to make it easier for IDEs to figure out "go-to definition" style functionality.

Unfortunately, `@if` still had the problem of `$if`, which is that its argument could be any arbitrary compile time constant expression. But what happens if we use something like `@if(Foo::methods.len == 3)`? Well, if the compiler hasn't yet reached a stage where `Foo` is analysed, its analysis is now forced. Furthermore, even if `Foo` is analysed, methods might not be registered yet, giving subtly wrong answers. Because C3 runs in multiple passes, there is no canonical ordering of which thing to analyse first, so it was quite unpredictable. Even though refinements were constantly made to the ordering, the underlying flaw was unsolvable.

#### The insight

Surveying the use of `@if` they roughly fell into one of three categories:

1. Conditionally include depending on compilation target, e.g. `@if(env::WIN32)`
2. Include "if no other implementation is found", e.g. `@if(!$defined(String))`.
3. Conditionally add functionality depending on generic type, e.g. `@if($defined((Type){} + (Type){}))`

Of these, the (3) didn't pose a problem in most cases, because in general it happened fairly late. In the case of (2), this was now mostly covered by the new behaviour of `@weak` (introduced in 0.7.11).

So what about `@if(env::WIN32)`? This was almost completely confined to the `std::core::env` module, which would define constants and derived constants based on compiler builtins, and all of those cases could actually be directly passed in by the compiler.

#### Introducing @feat

As previously mentioned, `@feat` is essentially `$if($feature(...))` but to make this work, the compiler now provides many feature flags built-in, such as `WIN32`, `LINUX`, `BIG_ENDIAN` etc. In general any use of `env::CONSTANT` has a `@feat(CONSTANT)` counterpart.

This solves the ordering problem because all these constants are known before declarations are registered, so any symbols with `@feat` can be filtered early. This is not only beneficial for the compiler – LSPs and editors can take advantage of this and accurately determine what's available at compile time.

In more detail, `@feat` may take multiple constants, in which case it is satisfied on any match:

```c3
fn void foo() @feat(WIN32, MACOS) // available on WIN32 and MACOS
{}
```

It's also possible to use `|` instead:
```c3
fn void foo() @feat(WIN32 | MACOS) // alternative syntax
{}
```

`!` may be used to negate a feature:
```c3
fn void foo() @feat(!WIN32) // available on anything other than WIN32
{}
```

Multiple `@feat` means all must be satisfied:
```c3
fn void foo() @feat(MACOS) @feat(AARCH64) // only on Aarch64 MacOS
{}
```

It's possible to use `&` as an alternative:
```c3
fn void foo() @feat(MACOS & AARCH64) // only on Aarch64 MacOS
{}
```

More complex expressions using `|` `&` and `!` are allowed:
```c3
fn void foo() @feat((MACOS & AARCH64) | !LIBC) // On Aarch64 MacOS or not with libc
{}
```

Together with this the `$feature` function has been renamed `$feat` (`$feature` is now deprecated and will be removed in 0.9.0).

### Possible keyword changes

0.7.0 introduced the family of "-def" keywords: `constdef`, `typedef`, `faultdef` and `attrdef`. After evaluating this for a little over a year, there has been some doubt whether these are really good enough. For this reason 0.8.3 introduces experimental aliases for each:

- `constdef` -> `constset`, `cenum`
- `typedef` -> `distinct`
- `faultdef` -> `faultconst`, `faultset`, `excuse`
- `attrdef` -> `attrgroup`, `attrmacro`

These are considered *experimental*, meaning that there is no stability guarantee. Versions 0.8.4 and onwards are free to remove these aliases.

Please take time to try them out and offer feedback on them.

### Fetching MacOS

Previously, automated fetching of the Windows SDK was added. This version adds SDK fetching for MacOS as well, allowing completely effortless cross-compilation to MacOS from any other platform.

### Windows Aarch64 support

With this version the C3 compiler finally supports Aarch64 as a Windows target.

## Standard Library Updates

### Regex

With this release, C3 finally has regex support. Please note that the API is considered experimental and may change in a later 0.8.x version.

### Other changes

JSON/object unmarshaling is now available through `json::unmarshal`, `object::unmarshal`, and related functions. `json::temp_load` is deprecated in favor of `json::tload`.

Geometry code should note one behavior change: `Rect.contains_point` is now exclusive on the maximum edge. A new `Bounds` type has also been added for rectangular regions represented by `min` and `max`, with operations inclusive along the boundary edge.

`LinkedList` and `Deque` now have a `prepend` method, `FixedList` has `is_full()`, and ranges gained `range::upto`, `range::inclusive`, `range::exclusive`, `Range.to_array`, and `ExclusiveRange.to_array`.

Other useful additions include `io::read_buffer` and comparison operators for `DateTime`.

Finally, the tracking allocator is now able to track cross-thread allocation.

## Fixes

This release fixes a wide range of correctness issues, including generics, compile-time execution, JSON parsing, IO streams, compression, networking, AES CTR, RISC-V ABI handling, doc generation, and several compiler crashes.

Notable fixes include:

- Generic functions and values now correctly require a prefix.
- The arena allocator no longer errors in safe mode when freeing the last memory while the arena is full.
- `LinkedList.push_front_all` now preserves the expected order.
- `BitSet.len` now reports the bit set length instead of the underlying type size.
- RFC 3339 formatting now emits the correct value for microseconds.
- Timed `tcp::connect` now returns the real result instead of always failing with `io::GENERAL_ERROR`.
- Generic methods are no longer checked before their generic type is fully registered.
- `_erff` now invokes C `erff` instead of `erf`.
- AES CTR no longer loses sync for data whose size is not a multiple of 16.
- JSON no longer accepts `\v` as whitespace.
- JSONC parsing no longer loops indefinitely on unterminated comments.
- `io::read_all` now handles split data.
- `Scanner` now handles chunked data correctly.
- `Gzip` readers can now handle streams without seek support.
- `io::printf("%3d", 1)` now returns the correct printed length.
- RISC-V structs with mixed floating-point and integer fields are now passed and returned by value correctly.

Doc generation also received several fixes: `attrdef` declarations and docs are emitted, `alias` doc comments are included, `@return` contracts are rendered, `compiler_rt` is excluded when `--emit-stdlib=no`, and empty JSON fields are omitted for slimmer output.

## Thank yous

Again, this release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

### PR contributors for this release

**Stdlib:**
cmann1, Darvisim, hchac, Lado, Manu Linares, Omar Alani

**Compiler & toolchain:**
Darvisim, Fernando López Guevara, Lado, LowByteFox, Manu Linares, 

**CI/Infrastructure:**
LowByteFox, Manu Linares, ttambow

### Change Log
<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- Windows aarch64 is now supported.
- Tracking allocator can now accept cross-thread allocations.
- Filter test backtraces #3368
- Improved GDB compatibility for macros.
- Fail when "emcc" is unavailable instead of falling back to the built-in wasm linker.
- Support fetching MacSDK for easy cross compilation.
- Add `@feat` attribute, deprecate `@if` on non-generic top level declarations.
- Add `$feat` compile time function. `$feature` is deprecated and replaced by `$feat`.
- Experimental support for `constset`, `cenum`, `faultconst`, `faultset`, `excuse`, `attrgroup`, `attrmacro`, `distinct`.
- Defer resolution of typedef alignment and generics, allowing more recursive definitions.
- Improve error message on multiple <* *> in a row. #2971
- Add the `lgdt` and `lidt` instructions to x86 inline assembly.

### Stdlib changes
- LinkedList and Deque added a `prepend` method.
- Added `FixedList.is_full()` method
- `Rect.contains_point` is now exclusive on the maximum edge.
- Add `Bounds` - a rectangular region stored as a `min` and `max` value, with all operations being inclusive along the boundary edge.
- Experimental regex support.
- Improved RFC 3986 compatibility.
- JSON unmarshaling support, `json::unmarshal` and family.
- Object unmarshaling support, `object::unmarshal` and family.
- `json::temp_load` deprecated in favour of `json::tload`.
- `Object::is_map` now returns true for empty objects.
- Add `range::upto`, `range::inclusive` and `range::exclusive` macros.
- Add `io::read_buffer`.
- `DateTime` enable comparison operators.
- Add `Range.to_array` and `ExclusiveRange.to_array` methods.

### Fixes
- Generic functions and values incorrectly would not require a prefix. #3374
- Arena allocator would error in safe mode when freeing the last memory and the arena was full. #3378
- LinkedList `push_front_all` was appending in the wrong order.
- `BitSet.len` would yield the size of the underlying type, not the length.
- RFC3339 formatting would yield incorrect value for microseconds.
- `--obj` will always retain the object files. #3380
- ThreadGroup with function returning `void` was broken.
- Timed `tcp::connect` always failed with `io::GENERAL_ERROR` instead of the real result.
- Compile time struct with zeroed union member access causes compiler error #3382.
- Generic methods checked before the generic type is fully registered.
- Math function `_erff` invoked C `erf` function instead of `erff` function #3391
- Defining local constants inside a macro causes it to fail to @const fold. #3397
- AES CTR would lose sync on data not multiples of 16.
- In some cases, on macros rethrowing optional values codegen could fail.
- Json accepted incorrectly accepted `\v` as whitespace.
- JSONC parsing on unterminated comments would loop indefinitely.
- ZII array constdef would cause an assert. #3411
- Calling a constant void macro inside a macro stops it from being constant. #3410
- Using io::struct_to_format with `$force_dump = true` failed to compile.
- `$foo += 1` would not do a copy, leading to incorrect update of `$foo`. #3400
- `foreach (foo::Type t : x)` would not parse properly. #3423
- Docgen improvements and fixes: emit `attrdef` declarations/docs, include `alias` doc comments, render `@return` contracts, exclude `compiler_rt` when `--emit-stdlib=no`, and omit empty JSON fields for slimmer output #3422.
- Several uses of InStream didn't properly handle io::EOF.
- Fixes to memory handling during zip loading.
- Multireader reading after a final empty read would crash.
- RISC-V structs with mixed FP and integer fields were corrupted when passed or returned by value. #3428
- `io::read_all` didn't handle split data.
- `Scanner` would not correctly handle chunked data.
- `Gzip` reader couldn't handle a stream without seek.
- `io::printf("%3d", 1)` would return the wrong printed length. #3432
- Crash when using ternary operator with vector type and inline constdef #3433
- Crash on assign-op to compile-time subscript with non-const result #3419

</details>

### Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).