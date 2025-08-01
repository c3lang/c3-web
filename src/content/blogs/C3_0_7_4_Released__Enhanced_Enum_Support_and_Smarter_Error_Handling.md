---
title: "C3 0.7.4 Released: Enhanced Enum Support and Smarter Error Handling"
date: 2025-01-08
author: "Christoffer Lernö"
---

C3 version 0.7.4 brings a substantial set of improvements focused on better enum support, enhanced error handling, improved debugging capabilities, and numerous quality-of-life improvements. Here's a comprehensive look at what's new.

## Major Language Features

### Enhanced Enum Support
One of the most significant changes in 0.7.4 is the introduction of **const enums**.
- **Const enums**: You can now declare `enum Foo : const`, which behaves like C enums but supports any underlying type
- **Direct enum casting**: Casting to and from regular enums is now possible again without needing `.ordinal` and `.from_ordinal` methods
- **Deprecation warning**: Inline associated enum values are now deprecated (use `--use-old-enums` to maintain compatibility)

### New Error Handling Macros
C3 0.7.4 introduces two useful new macros for streamlined error handling:
- **`@try`**: Takes an lvalue and returns a `void?`. It assigns the value if successful, otherwise returns the error.
- **`@try_catch`**: Extended version that takes an lvalue, an expression, and the expected error value, it will return a `bool?`.

These macros can significantly reduce boilerplate when working with `if-catch`.

### Compile-Time Improvements
Several compile-time features have been enhanced:
- **`$typeof` improvements**: Now returns compile-time types in more contexts
- **`@is_const` introduction**: This macro replaces the deprecated `$is_const`, and is based on `$defined`
- **Multiline contract comments**: Contract documentation can now span multiple lines

## Developer Experience Enhancements
### Better Error Messages and Debugging
C3 0.7.4 focuses heavily on improving the developer experience:
- **Improved error messages**: Better reporting for missing enum qualifiers, struct initialization errors, and unsigned-to-signed conversion issues
- **Common mistake detection**: The compiler now catches accidental `foo == BAR;` where `foo = BAR;` was likely intended
- **Enhanced debugging output**: Added `--echo-prefix` for customizing `$echo` statement prefixes with `{FILE}` and `{LINE}` support

### Assembly and Low-Level Development
- **`--list-asm` flag**: View all supported assembly instructions
- **Unaligned access detection**: The compiler now checks for unaligned array access
- **Thread synchronization**: New `thread::fence` function provides thread fencing capabilities

### Build System Improvements
- **Smarter output directories**: Projects now output to `out` by default, with temp folders used for command-line builds
- **Absolute path support**: `$embed` now accepts absolute paths
- **Math library auto-linking**: libc math functions are now only linked when math functions are used.
- **Author field improvements**: The project `authors` field can now be accessed using `env::AUTHORS` and `env::AUTHOR_EMAILS`.

## Performance and Memory Management
### Hash Function Additions
The standard library now includes several new high-performance hash functions:
- komihash
- a5hash
- metrohash64 and metrohash128
- wyhash2 variants
- SipHash family of keyed PRFs

### Memory Management Improvements
- **Virtual memory**: New virtual memory library and arena allocator
- **Smaller memory limits**: Support for even more restrictive memory environments
- **Arena allocator fixes**: Resolved resize bugs in ArenaAllocator, DynamicArenaAllocator, and BackedArenaAllocator
- **No temp allocator in backtrace**: Removed temp allocator usage in backtrace printing.

## Standard Library Enhancements
### Cryptography and Security
- **Whirlpool hash**: Added the Whirlpool cryptographic hash function
- **Ed25519**: Elliptic curve digital signature algorithm support

### String and I/O Operations
- **`string::bformat`**: New binary formatting capabilities
- **Enhanced formatting**: The format option now supports pointers `%h`
- **String case conversion**: Functions for converting between snake_case and PascalCase

### Concurrency Improvements
- **Condition variable enhancements**: Added `ConditionVariable.wait_until` and `ConditionVariable.wait_for`
- **Stream I/O**: New `readline_to_stream` function for stream-based input

### Experimental Features
- **Reference counting**: `Ref` and `RefCounted` experimental types
- **Memory safety types**: `Volatile` and `UnalignedRef` generic types for typesafe volatile and unaligned references.

## Bug Fixes and Stability
Version 0.7.4 includes over 40 bug fixes addressing:
- Platform-specific issues (Android, Windows, POSIX)
- Compile-time constant evaluation
- Memory management edge cases
- Type system consistency
- Code generation improvements

Notable fixes include proper handling of null ZString comparisons, correct bounds checking for const ranges, and fixes to complex number operations.

## Deprecations and Migration
Several features have been deprecated and to streamline the language:
- `$is_const` → `@is_const`
- `$assignable` → `@assignable_to`
- `allocator::heap()` → `mem` and `allocator::temp()` → `tmem`
- Inline associated enum values (use `--use-old-enums` for compatibility)

## Diving deeper into the new const enums

C3 introduced ordinal based enums in 0.3.0. This allowed the language to support associated enum values and enum → string conversions at runtime with zero overhead. The downside was the lack of support for C enums with gaps. While possible to address with constants or associated values, it lacked the ease of C enums. However, C enums could not be made to properly support things the same things as the 0.3 C3 enums did.

The new "const enum" solves this problem. It works like a distinct type, with constants associated with it. It is defined like an enum, with `const` added after `:`. Its behaviour is the same as you would expect from C:

```c3
enum ConstEnum : const short
{
    ABC = 1,
    BDE,     // Implicitly 2
    DEF = 100
}
```

But the const enums can do things C enums can't do:

```c3
enum Greeting : const inline String
{
    HELLO = "Hello",
    WORLD = "World",
    YO    = "Yo"
}

fn void main()
{
    // Prints "Hello"
    io::printn(Greeting.HELLO); 
    // Inline allows implicit conversion to String
    io::printn(Greeting.YO == "Yo");
    // Inference works like for regular enums 
    Greeting g = WORLD; 
}
```

:::note[Note On reflection]
The cost we pay for this is that we cannot get the ordinal, nor the name, so neither `Greeting.YO.nameof` nor `Greeting.YO.ordinal` will work.
:::


## TLDR;

C3 0.7.4 introduces improved enum support, new error handling macros, and several enhancements to the developer experience. Key additions include const enums with flexible underlying types, direct enum casting, and streamlined error-handling via @try and @try_catch. The release also brings better error messages, improved debugging tools, and expanded standard library features such as new hash functions, Ed25519 support, and virtual memory management. Numerous bug fixes and deprecations aim to improve language consistency and performance. This version marks continued progress toward language maturity and usability.

### Change Log
<details>
	<summary class="
		text-black 
		dark:text-white
		font-medium
		text-lg
		"
	>
		Click for full change log
	</summary>

### Changes / improvements
- Added const enums: `enum Foo : const`. Behaves like C enums but may be any type.
- Casting to / from an enum is now possible again. No need to use `.ordinal` and `.from_ordinal`.
- Inline associated enum values are deprecated, use `--use-old-enums` to re-enable them.
- `$typeof` may return a compile time type.
- Improved error messages on missing qualifier on enum value. #2260
- Add `--echo-prefix` to edit the prefix with `$echo` statements. Supports {FILE} and {LINE}
- Catch accidental `foo == BAR;` where `foo = BAR;` was most likely intended. #2274
- Improve error message when doing a rethrow in a function that doesn't return an optional.
- Add `--list-asm` to view all supported `asm` instructions.
- Formatting option "%h" now supports pointers.
- Improve error on unsigned implicit conversion to signed.
- Update error message for struct initialization #2286
- Add SipHash family of keyed PRFs. #2287
- `$is_const` is deprecated in favour of `@is_const` based on `$defined`.
- Multiline contract comments #2113
- Removed the use of temp allocator in backtrace printing.
- `env::AUTHORS` and `env::AUTHOR_EMAILS` added.
- Suppress codegen of panic printing with when panic messages are set to "off".
- Implicit linking of libc math when libc math functions are used.
- Allow even smaller memory limits.
- Check unaligned array access.
- Add "@structlike" for typedefs.
- "poison" the current function early when a declaration can't be correctly resolved.
- Add komihash, a5hash, metrohash64, metrohash128, and wyhash2 variants with tests/benchmark. #2293
- '$assignable' is deprecated.
- Deprecate allocator::heap() and allocator::temp()
- Add `thread::fence` providing a thread fence.
- Place output in `out` by default for projects. Use temp folder for building at the command line.
- Allow absolute paths for `$embed`.
- Add `@try` and `@try_catch`.
- Assignment evaluation order now right->left, following C++17 and possibly C23.

### Fixes
- mkdir/rmdir would not work properly with substring paths on non-windows platforms.
- Hex string formatter check incorrectly rejected slices.
- Correctly reject interface methods `type` and `ptr`.
- Comparing a null ZString with a non-null ZString would crash.
- Switch case with const non-int / enum would be treated as ints and crash. #2263
- Missing bounds check on upper bound with const ranges `foo[1:3]`.
- Check up the hierarchy when considering if an interface cast is valid #2267.
- Fix issue with labelled break inside of a $switch.
- Non-const macros may not return untyped lists.
- `$for` ct-state not properly popped.
- Inline `r / complex` for complex numbers fixed.
- Const slice lengths were not always detected as constant.
- Const slice indexing was not bounds checked.
- Initialize pool correctly in print_backtrace.
- `--max-mem` now works correctly again.
- Casting a fault to a pointer would trigger an assert.
- Make `to_float` more tolerant to spaces.
- Fixes to thread local pointer handling.
- Fixes to JSON parsing and Object.
- Array indices are now using int64 internally.
- Bit shift operation fails with inline uint enum despite matching underlying type #2279.
- Fix to codegen when using a bitstruct constant defined using a cast with an operator #2248.
- Function pointers are now compile time constants.
- Splat 8 arguments can sometimes cause incorrect behaviour in the compiler. #2283
- Correctly poison the analysis after a failed $assert or $error. #2284
- `$foo` variables could be assigned non-compile time values.
- `$foo[0] = ...` was incorrectly requiring that the assigned values were compile time constants.
- "Inlined at" would sometimes show the current location.
- Fixed bug splatting constants into constants.
- Resize bug when resizing memory down in ArenaAllocator, DynamicArenaAllocator, BackedArenaAllocator.
- Error message for missing arg incorrect for methods with zero args #2296.
- Fix stringify of $vaexpr #2301.
- Segfault when failing to cast subexpression to 'isz' in pointer subtraction #2305.
- Fix unexpected display of macro definition when passing a poisoned expression #2305.
- `@links` on macros would not be added to calling functions.
- Fix `Formatter.print` returning incorrect size.
- A distinct type based on an array would yield .len == 0
- Overloading addition with a pointer would not work.
- Copying const enums and regular enums incorrect #2313.
- Regression: Chaining an optional together with contracts could in some cases lose the optional.
- `char[*] b = *(char[*]*)&a;` would crash the compiler if `a` was a slice. #2320
- Implicitly cast const int expressions would sometimes not be detected as compile time const.
- Using @noreturn in a short body macro would not work properly #2326.
- Bug when reporting error in a macro return would crash the compiler #2326.
- Short body return expression would not have the correct span.
- Fix issue where recursively creating a dir would be incorrectly marked as a failure the first time.
- `@format` did not work correctly with macros #2341.
- Crash when parsing recursive type declaration #2345.
- Remove unnecessary "ret" in naked functions #2344.
- Lambdas now properly follow its attributes #2346.
- Not setting android-ndk resulted in a "set ndk-path" error.
- Lambda deduplication would be incorrect when generated at the global scope.
- Disallow accessing parameters in a naked function, as well as `return`, this fixes #1955.
- Assigning string literal to char[<*>] stores pointer rather than characters. #2357

### Stdlib changes
- Improve contract for readline. #2280
- Added Whirlpool hash.
- Added Ed25519.
- Added string::bformat.
- Virtual memory library.
- New virtual emory arena allocator.
- Added `WString.len`.
- Added `@addr` macro.
- Add `ConditionVariable.wait_until` and `ConditionVariable.wait_for`
- Added readline_to_stream that takes a stream.
- Added `Ref` and `RefCounted` experimental functionality.
- Added `Volatile` generic type.
- Added `UnalignedRef` generic type.
- Add String conversion functions snake_case -> PascalCase and vice versa.

</details>

### Want To Dive Into C3?
Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).

