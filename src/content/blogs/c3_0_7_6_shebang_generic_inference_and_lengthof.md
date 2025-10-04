---
title: "C3 Language at 0.7.6: Shebang, generic inference and lengthof()"
date: 2025-10-04
readingTime: "5 min"
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
---

The C3 programming language continues its steady evolution with version 0.7.6, focusing on quality-of-life improvements and language refinements While previous 0.7.x versions have seen some notable additions to the language itself, 0.7.6 only adds a few minor features, with nothing new planned for 0.7.7. Originally the inline asm updates and fixes were scheduled for 0.7.6, the discussion around the semantics took too much time for it to make it to 0.7.6.

In other news, C3 is now tracked by Linguist on GitHub which means code on GitHub will finally have highlighting for C3 files.

## New Features and Improvements

- **Built-in function`lengthof()`** - The new `lengthof` function provides a unified way to use the result of the method or function tagged `@operator(len)`. For builtin types with length, such as arrays, this will lower into a `.len` field access. This allows building macros that leverage `@operator(len)` without having to use `foreach`.
- **Shebang Support:** C3 source files now support `#!` comments on the first line, simplifying using C3 code in scripts.
- **Generic parameter inference:** - Generic parameter inference from left to right is added: `List{int} x = list::NOHEAP;`.
- **A new `+++=` operator** - This complements the `+++` compile time concatenation operator to make code that use repeated concatenation shorter and more concise.
- **Enhanced `$defined`** - `$defined` now also supports `$nameof`, `$offsetof` and `$alignof`, so that the code can query if the builtins are supported for the particular argument. This is particularly useful for lazy arguments.
- **Slice and Array Comparisons:** User-defined types implementing the `==` operator overload can now be properly compared when used in slices and arrays.
- **Project version builtin:** You can now access your project version using `env::PROJECT_VERSION`. It reflects exactly the string in `project.json`.

## Standard Library Expansions

- **InterfaceList:** - A new container for storing values that implement specific interfaces, enabling more flexible polymorphic programming.
- **Enhanced LinkedList:** - Now supports array view operations including `[]` indexing and both forward and reverse `foreach` iteration (#2438).
- **Cross-Platform File System Support:** - Directory location support has been added for home, documents, downloads and other folders in the `path` module.
- **Added I/O Operations:** - `io::skip` for skipping data and little-endian family for read/write operations `io::read_le`, `io::write_le`.
- **CVaList support:** - Added MacOS AArch64 and Linux/MacOS x64 valist support with `CVaList`.

## Community and Contributions
This release wouldn't have been possible without the incredible C3C community. The collaborative effort in identifying, reporting, and fixing the numerous issues addressed in this release exemplifies the strength of the C3C development community.

_The C3 team remains committed to creating a modern, safe, and fast programming language that doesn't compromise on the low-level control that makes C so enduring. Thank you to everyone who has contributed to making this release possible!_

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
- Add lengthof() compile time function #2439
- Allow doc comments on individual struct members, faultdefs and enum values #2427.
- `$alignof`, `$offsetof` and `$nameof` can now be used in `$defined`.
- Infer generic parameters lhs -> rhs: `List{int} x = list::NOHEAP`.
- Unify generic and regular module namespace.
- `env::PROJECT_VERSION` now returns the version in project.json.
- Comparing slices and arrays of user-defined types that implement == operator now works #2486.
- Add 'loop-vectorize', 'slp-vectorize', 'unroll-loops' and 'merge-functions' optimization flags #2491.
- Add exec timings to -vv output #2490.
- Support #! as a comment on the first line only.
- Add `+++=` operator.

### Fixes
- Compiler assert with var x @noinit = 0 #2452
- Confusing error message when type has [] overloaded but not []= #2453
- $defined(x[0] = val) causes an error instead of returning false when a type does not have []= defined #2454
- Returning pointer to index of slice stored in a struct from method taking self incorrectly detected as returning pointer to local variable #2455.
- Inlining location when accessing #foo symbols.
- Improve inlined-at when checking generic code.
- Fix codegen bug in expressions like `foo(x()) ?? io::EOF?` causing irregular crashes.
- Correctly silence "unsupported architecture" warning with `--quiet` #2465
- Overloading &[] should be enough for foreach. #2466
- Any register allowed in X86_64 inline asm address. #2463
- int val = some_int + some_distinct_inline_int errors that int cannot be cast to DistinctInt #2468
- Compiler hang with unaligned load-store pair. #2470
- `??` with void results on both sides cause a compiler crash #2472.
- Stack object size limit error on a static object. #2476
- Compiler segfault when modifying variable using an inline assembly block inside defer #2450.
- Compile time switch over type would not correctly compare function pointer types.
- Regression: Compiler segfault when assigning struct literal with too few members #2483
- Fix compile time format check when the formatting string is a constant slice.
- Compiler segfault for invalid e-mails in project.json. #2488
- Taking `.ordinal` from an enum passed by pointer and then taking the address of this result would return the enum, not int.
- Alias and distinct types didn't check the underlying type wasn't compile time or optional.
- Incorrect nameof on nested struct names. #2492
- Issue not correctly aborting compilation on recursive generics.
- Crash during codegen when taking the typeid of an empty enum with associated values.
- Assert when the binary doesn't get created and --run-once is used. #2502
- Prevent `foo.bar = {}` when `bar` is a flexible array member. #2497
- Fix several issues relating to multi-level inference like `int[*][*]` #2505
- `$for int $a = 1; $a < 2; $a++` would not parse.
- Fix lambda-in-macro visibility, where lambdas would sometimes not correctly link if used through a macro.
- Dead code analysis with labelled `if` did not work properly.
- Compiler segfault when splatting variable that does not exist in untyped vaarg macro #2509

### Stdlib changes
- Added Advanced Encryption Standard (AES) algorithm (ECB, CTR, CBC modes) in `std::crypto::aes`.
- Added generic `InterfaceList` to store a list of values that implement a specific interface
- Added `path::home_directory`, `path::documents_directory`, `path::videos_directory`, `path::pictures_directory`, `path::desktop_directory`, `path::screenshots_directory`,
  `path::public_share_directory`, `path::templates_directory`, `path::saved_games_directory`, `path::music_directory`, `path::downloads_directory`.
- Add `LinkedList` array_view to support `[]` and `foreach`/`foreach_r`. #2438
- Make `LinkedList` printable and add `==` operator. #2438
- CVaList support on MacOS aarch64, SysV ABI x64.
- Add `io::skip` and `io::read_le` and `io::write_le` family of functions.

</details>

### Want To Dive Into C3?

Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).
