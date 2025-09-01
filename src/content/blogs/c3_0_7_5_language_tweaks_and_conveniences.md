---
title: "C3 Language at 0.7.5: Language tweaks and conveniences"
date: 2025-09-01
author: "Christoffer Lernö"
---

The C3 programming language has reached 0.7.5, marking another milestone in the language's evolution. This release brings improvements to language features, developer experience, and standard library functionality.

Here's what's new and improved in this update.

## Major Language Features

### Module Aliasing Support
One of the new features in 0.7.5 is the introduction of module aliasing with the syntax `alias foo = module std::io`. This enhancement improves user control over code organization and readability, allowing developers to create shorter names for modules where needed.

### Enhanced Compile-Time Capabilities
The compile-time system has received several additions:
- **Optional macro params**: Gives macros arguments that are optional without requiring a default value.
- **`???`**: Compile time ternary, guaranteed to resolve at compile time and will not execute the false branch.
- **`@safeinfer`**: Enables the use of `var` in function contexts, where it was previously disallowed.
- **New mathematical builtins**: `@intlog2`, `@clz`, `@min`, `@max` and functions are now available at compile time.
- **`bitsizeof` macro builtin**: Provides bit-level size information for types.

### Operator Overloading Evolution
C3 0.7.5 brings improvements to operator overloading:
- `@operator(==)` now also enables `switch` statement support for the type.
- Enhanced chained array access: `foo[x][y] = b` now can pass through multiple levels of overloads, and works as expected with proper overload resolution.
- `Type.is_eq` now correctly returns true for types with equality overloads.

### Type System Enhancements
- **`$kindof`**: Shorthand for `$typeof(...).kindof` which simplifies contract checks.
- **Implicit type conversions**: Types now convert to `typeid` implicitly, streamlining contracts and compile time programming.
- **Enhanced `$defined`**: It now accepts declarations, like `$defined(int x = y)` which removes the need for macros like `@assignable_to`.
- **Struct inheritance**: Struct and typedef subtypes now inherit dynamic methods.

## Developer Experience Improvements
### Better Error Messages and Safety
The compiler now provides more helpful diagnostics:
- Improved error messages for missing `$endif` and missing `if` bodies.
- Better directory creation error messages in project and library creation
- Huge stack object overflow protection with configurable `--max-stack-object-size`

### Build System Enhancements
- **Library management**: `c3l`-libraries now package linked libraries in a directory specified by the `"linklib-dir"` setting.
- **Cross-platform improvements**: Enhanced support for different operating systems and architectures

## Standard Library Expansion
### New Data Structures and Utilities
The standard library has grown:
- **`FileMmap`**: Memory-mapped file management
- **`FixedBlockPool`**: Memory pool for fixed-size objects
- **`HashSet`**: Generic hash set implementation with `values` method support
- **`AsciiCharset`**: Fast ASCII character matching utilities
- **Logging system**: Introduction of `std::core::log` for common logging .

### Enhanced String Operations
String manipulation gets a boost with:
- **`String.contains_char`**: Character containment checking
- **`String.trim_charset`**: Trimming based on character sets
- **Functional array operations**: New macros including `@zip`, `@reduce`, `@filter`, `@any`, `@all`, `@sum`, `@product` and `@indices_of`.

## Breaking Changes and Deprecations
### Important Deprecations
Several features have been deprecated in favor of improved alternatives:
- `@compact` comparison behavior (use `--use-old-compact-eq` for compatibility)
- `add_array` in favor of `push_all` on lists.
- `@assignable_to` in favor of using `$define`.
- `@typekind` in favor of using `$kindof`.
- `@typeis` in favor of `$typeof(foo) == Type`.
- `@select` in favor of `$foo ??? #expr1 : #expr2`.

## Performance and Bug Fixes
### Critical Fixes
This release addresses numerous important issues:
- ASAN triggering fixes in `List.remove_at`
- AVX512 vector handling corrections
- Codegen improvements for if-try expressions
- Memory allocation optimizations for 32-bit machines
- Recursive generic creation detection

### Platform-Specific Improvements
- Enhanced Android and OpenBSD support
- Improved native CPU detection
- Better cross-compilation support

## Looking Forward

Deprecations of many type introspection macros, such as `@typekind` and `@typeis` is together with the improvements in `$defined`, the implicit type conversions to `typeid` and `$kindof` spearheading a shift to making constraint checking succinct while also being completely obvious. Relying on macros would often make the constraints less clear to a reader. On top of this we get compile time ternary using `??? :` to succinctly express compile time selection between two expressions. With the changes, the code is as short to type but without the need to remember particulars of one macro over the other.

Overall, C3 0.7.5 represents another step in maturing the language's core features while laying the groundwork for future enhancements. The focus will continue to be aimed at improve developer experience, performance, and language consistency. Many of the standard library additions are contributions from the community around C3, which is providing essential feedback and direction to polish the language further. C3 is step-by-step establishing itself as a modern evolution of C that maintains simplicity while adding powerful abstractions.

## Demo

For a deeper look at the changes, watch the demo: https://www.youtube.com/watch?v=OuZBxdM_YEI

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
- Support `alias foo = module std::io` module aliasing.
- Add compile-time `@intlog2` macro to math.
- Add compile-time `@clz` builtin. #2367
- Add `bitsizeof` macro builtins. #2376
- Add compile-time `@min` and `@max` builtins. #2378
- Deprecate `@compact` use for comparison. Old behaviour is enabled using `--use-old-compact-eq`.
- Switch available for types implementing `@operator(==)`.
- `Type.is_eq` is now true for types with `==` overload.
- Methods ignore visibility settings.
- Allow inout etc on untyped macro parameters even if they are not pointers.
- Deprecate `add_array` in favour of `push_all` on lists.
- Fix max module name to 31 chars and the entire module path to 63 characters.
- Improve error message for missing `$endif`.
- `foo[x][y] = b` now interpreted as `(*&foo[x])[y] = b` which allows overloads to do chained [] accesses.
- Error if a stack allocated variable is too big (configurable with `--max-stack-object-size`).
- Add `@safeinfer` to allow `var` to be used locally.
- Types converts to typeid implicitly.
- Allow `$defined` take declarations: `$defined(int x = y)`
- Struct and typedef subtypes inherit dynamic functions.
- Improved directory creation error messages in project and library creation commands.
- `@assignable_to` is deprecated in favour of `$define`
- Add `linklib-dir` to c3l-libraries to place their linked libraries in. Defaults to `linked-libs`
- If the `os-arch` linked library doesn't exist, try with `os` for c3l libs.
- A file with an inferred module may not contain additional other modules.
- Update error message for missing body after if/for/etc #2289.
- `@is_const` is deprecated in favour of directly using `$defined`.
- `@is_lvalue(#value)` is deprecated in favour of directly using `$defined`.
- Added `$kindof` compile time function.
- Deprecated `@typekind` macro in favour of `$kindof`.
- Deprecated `@typeis` macro in favour of `$typeof(#foo) == int`.
- `$defined(#hash)` will not check the internal expression, just that `#hash` exists. Use `$defined((void)#hash)` for the old behaviour.
- Added optional macro arguments using `macro foo(int x = ...)` which can be checked using `$defined(x)`.
- Add compile time ternary `$val ??? <expr> : <expr>`.

### Fixes
- List.remove_at would incorrectly trigger ASAN.
- With avx512, passing a 512 bit vector in a union would be lowered incorrectly, causing an assert. #2362
- Codegen error in `if (try x = (true ? io::EOF? : 1))`, i.e. using if-try with a known Empty.
- Codegen error in `if (try x = (false ? io::EOF? : 1))`, i.e. using if-try with a CT known value.
- Reduce allocated Vmem for the compiler on 32 bit machines.
- Bug causing a compiler error when parsing a broken lambda inside of an expression.
- Fixed: regression in comments for `@deprecated` and `@pure`.
- Detect recursive creation of generics #2366.
- Compiler assertion when defining a function with return type untyped_list #2368.
- Compiler assert when using generic parameters list without any parameters. #2369
- Parsing difference between "0x00." and "0X00." literals #2371
- Fixed bug generating `$c += 1` when `$c` was derived from a pointer but behind a cast.
- Compiler segfault when using bitwise not on number literal cast to bitstruct #2373.
- Formatter did not properly handle "null" for any, and null for empty faults. #2375
- Bitstructs no longer overloadable with bitops. #2374
- types::has_equals fails with assert for bitstructs #2377
- Fix `native_cpus` functionality for OpenBSD systems. #2387
- Assert triggered when trying to slice a struct.
- Improve codegen for stack allocated large non-zero arrays.
- Implement `a5hash` in the compiler for compile-time `$$str_hash` to match `String.hash()`.
- Functions being tested for overload are now always checked before test.
- Compile time indexing at compile time in a $typeof was no considered compile time.
- Slicing a constant array with designated initialization would not update the indexes.
- Fix for bug when `@format` encountered `*` in some cases.
- Compiler segfault on global slice initialization with null[:0] #2404.
- Use correct allocator in `replace`.
- Regression: 1 character module names would create an error.
- Compiler segfault with struct containing list of structs with an inline member #2416
- Occasionally when using macro method extensions on built-in types, the liveness checker would try to process them. #2398
- Miscompilation of do-while when the while starts with a branch #2394.
- Compiler assert when calling unassigned CT functions #2418.
- Fixed crash in header generation when exporting functions with const enums (#2384).
- Fix incorrect panic message when slicing with negative size.
- Incorrect type checking when &[] and [] return optional values.
- Failed to find subscript overloading on optional values.
- `Socket.get_option` didn't properly call `getsockopt`, and `getsockopt` had an invalid signature.
- Taking the address of a label would cause a crash. #2430
- `@tag` was not allowed to repeat.
- Lambdas on the top level were not exported by default. #2428
- `has_tagof` on tagged lambdas returns false #2432
- Properly add "inlined at" for generic instantiation errors #2382.
- Inlining a const as an lvalue would take the wrong path and corrupt the expression node.
- Grabbing (missing) methods on function pointers would cause crash #2434.
- Fix alignment on jump table.
- Fix correct `?` after optional function name when reporting type errors.
- Make `log` and `exp` no-strip.
- `@test`/`@benchmark` on module would attach to interface and regular methods.
- Deprecated `@select` in favor of `???`.
- Enum inference, like `Foo x = $eval("A")`, now works correctly for `$eval`.
- Fix regression where files were added more than once. #2442
- Disambiguate types when they have the same name and need cast between each other.
- Compiler module-scope pointer to slice with offset, causes assert. #2446
- Compiler hangs on == overload if other is generic #2443
- Fix missing end of line when encountering errors in project creation.
- Const enum methods are not being recognized. #2445
- $defined returns an error when assigning a struct initializer with an incorrect type #2449

### Stdlib changes
- Add `==` to `Pair`, `Triple` and TzDateTime. Add print to `Pair` and `Triple`.
- Add OpenBSD to `env::INET_DEVICES` and add required socket constants.
- Added `FileMmap` to manage memory mapped files.
- Add `vm::mmap_file` to memory map a file.
- Updated hash functions in default hash methods.
- Added `FixedBlockPool` which is a memory pool for fixed size blocks.
- Added the experimental `std::core::log` for logging.
- Added array `@zip` and `@zip_into` macros. #2370
- Updated termios bindings to use bitstructs and fixed some constants with incorrect values #2372
- Add Freestanding OS types to runtime `env::` booleans.
- Added libloaderapi to `std::os::win32`.
- Added `HashSet.values` and `String.contains_char` #2386
- Added `&[]` overload to HashMap.
- Deprecated `PollSubscribes` and `PollEvents` in favour of `PollSubscribe` and `PollEvent` and made them const enums.
- Added `AsciiCharset` for matching ascii characters quickly.
- Added `String.trim_charset`.
- Added array `@reduce`, `@filter`, `@any`, `@all`, `@sum`, `@product`, and `@indices_of` macros.
- `String.bformat` has reduced overhead.
- Supplemental `roundeven` has a normal implementation.

</details>

### Want To Dive Into C3?
Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).
