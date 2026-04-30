---
title: "C3 0.7.11 - The last v0.7"
date: 2026-04-06
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
search:
  exclude: true
---

With 0.7.11 we've reached the end of the 0.7 era. It's been a really good year for C3, improving on rough edges and expanding the stdlib.

This release is headlined by an updated matrix library. Aside from that, it’s a refinement release, bringing numerous fixes but no major changes.

## Language changes

### `constdef` inference through binary operations

`constdef` is often used to define masks:

```c3
constdef Foo
{
    AUDIO = 0b01,
    VIDEO = 0b10,
    /* ... */
}
```

In 0.7.10 inference worked through assignment but not expressions:

```c3
Foo f = AUDIO; // Ok
f = Foo.AUDIO | Foo.VIDEO; // Ok
// f = AUDIO | VIDEO - this is an error
```

From 0.7.11 onwards, the inference works:
```c3
f = Foo.AUDIO | Foo.VIDEO; // Ok
f = AUDIO | VIDEO; // Also ok in 0.7.11
```

### Updated `@weak`

`@weak`, which changes linkage, now also supports having multiple definitions of the same declaration in the same source code, allowing the non-"weak" definition to win. This allows things like changing code from this:

```c3
fn void foo() @if(env::POSIX)
{
    io::printn("Works!");
}

fn void foo() @if(!env::POSIX)
{
    abort("Unsupported foo()");
}
```
To this:
```c3
fn void foo() @if(env::POSIX)
{
    io::printn("Works!");
}

fn void foo() @weak
{
    abort("Unsupported foo()");
}
```

### Warning on $$builtin use

Builtins (functions prefixed with `$$`, such as `$$unreachable`) are intended to be accessed through standard library macros, not used directly. They are considered internal and may change without warning.

This wasn’t previously clear, and some code ended up using them directly. The compiler will now issue a warning when such builtins are used outside the standard library.

### Zero element enums forbidden

Before 0.7.11, the language allowed empty enums. In practice, they were not fully supported and could lead to incorrect behavior.

Given their limited usefulness and the inability to define a valid zero value, empty enums have been removed from the language.

### Misc improvements

C3 now also detects large temporaries when creating slices on the stack.

## Standard library

### Updated Matrix library

The big change is the updated Matrix library. The new matrix type is column major, aligning it with most graphics and math libraries. It has also undergone quite an overhaul, with methods and functions updated and fixed. The default aliases are now based on floats rather than doubles, which fits with common usage.

The predefined aliases are:

- `Quat` - quaternion
- `Mat2` - 2x2 matrix
- `Mat3` - 3x3 matrix
- `Mat4` - 4x4 matrix
- `Vec2` - 2d vector
- `Vec3` - 3d vector
- `Vec4` - 4d vector
- `Rect` - 2d rectangle

The matrix perspective and ortho, project and unproject functions are now right-handed [0,1].

### std::mem improvements

- `std::mem::allocator` is deprecated and split into `std::core::mem::allocators` containing allocators and `std::core::mem::alloc` for various allocation methods. This means replacing most `allocator::*` calls with `alloc::*`, e.g. `allocator::calloc` becomes `alloc::calloc`.
- `@unaligned_load` and `@unaligned_store` are deprecated in favour of `mem::load` and `mem::store`, which also supports unaligned *volatile* load/store operations.

### std::encoding improvements

- Serialization to and from structs using JSON is now available.
- Functions for gzip compression and decompression added.
- Support for AES encrypted Zip files
- Base32/Base64/Hex/Codepage encoding deprecated encode_buffer/decode_buffer, replacing them with `encode_into` and `decode_into`.

### Crypto / hashes

- Keccak, SHA3, Shake, CShake, kmac, Turboshake, Tuplehash and Parallelhash were added.
- The remaining Xoshiro and xoroshiro PRNG variants were added.
- Added Argon2 hash.
- `entropy` module for generating cryptographically secure random bytes.
- `random::seeder` no longer uses temp memory.

### Date / Time

- DateTime and DateTimeTz are now `Printable` and can be used directly with `printf`
- DateTime now has a `to_format` method.

### Misc improvements

- The backtrace has been cleaned up on Linux.
- ZString now has a hash method.
- Simple member-wise struct comparison using `member_eq`.
- `always_assert` macro, which asserts even in unsafe mode.
- `file::last_modified` was added.
- `SubProcess` was renamed `Process` and refreshed with new, more streamlined, functions.
- Use methods `short_name()` and `@short_name()` to get the unqualified fault name, e.g. `io::EOF` becomes `EOF`.

## Toolchain

### Removal of support for LLVM 17/18 and fixes for LLVM 22

On most platforms, the C3 compiler is linked with custom-built LLVM libraries, which reduces the need to support older versions of LLVM.

0.7.10 was incompatible with LLVM 22, which is fixed in this version.

### Fully static builds of C3C for Linux

With 0.7.11, MUSL-based builds of the compiler are available on Linux.

### Unified SDK fetching with Android support

0.7.10 brought automatic download of the MSVC SDK without needing external scripts. In 0.7.11, this is extended to support Android, with the goal of bringing in more targets, such as the MacOS SDK for effortless cross-compilation.

## Bug fixes

0.7.11 brings many major and minor bug fixes, see the complete release notes for details.

## Looking Forward

Next up will be 0.8.0. As usual, this means there will be breaking changes. The most obvious target is all the deprecated functionality, from `enum Foo : const int` to the old matrix library.

However, the big upcoming change is the so-called "Szmageddon": C3 will change from unsigned sizes (`usz`) to signed sizes by default. This will also affect type promotion rules and literal types.

## Community and Contributions
This release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

#### PR contributors for this release:

**Stdlib:**
Alexandru Paniș, Book-reader, Bram Windey, Dave Akers, Disheng Su, Flanderzz, Konimarti, Manu Linares, LowByteFox, Siladi, Skunky, Technical Fowl, Zack Puhl

**Compiler & toolchain:**
Dmitry Atamanov, Lucas Alves, Manu Linares, Nmurrell07, Rodrigo Camacho

**CI/Infrastructure:**
Manu Linares, Mehdi Chinoune, Sisyphus1813, Zack Puhl

### Change Log
<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- Removed support for LLVM 17, 18.
- Detect large temporaries when creating slices on the stack #2665
- Search for the linker in PATH; use the builtin linker if CC missing. #2906
- `constdef` inference through binary expressions: `Foo f = Foo.AUDIO | Foo.VIDEO` can be written `Foo f = AUDIO | VIDEO;`
- Fix for LLVM 22+ compatibility #2987
- `@weaklink` for just affecting linkage.
- Add a fully static build of `c3c` for Linux. #2949
- `@weak` now allows direct overriding of `@weak` definitions with a real definition.
- Unified SDK fetching under `c3c fetch-sdk <target>` (windows, android) and added support for automatic Android NDK (r29) download. Better progress bar. #3019
- Improved Linux backtrace readability by stripping internal panic and runtime startup frames. #3008
- Added repetition compression for deep recursive stacks in backtraces. #3008
- Added new builtins: `$$acos`, `$$asin`, `$$atan`, `$$cosh`, `$$exp10`, `$$sinh`, `$$tan` and `$$tanh`.
- Added the rest of the `xoshiro` and `xoroshiro` PRNG variants. #3027
- Improve error when using keyword as identifier #3066
- Warn when using $$builtin functions outside of the stdlib #3065
- Zero element enums now disallowed.

### Stdlib changes
- Add contract on `any_to_enum_ordinal` and `any_to_int` to improve error when passed an empty any. #2977
- Add hash method for ZStrings. #2982
- Added json serialization from structs.
- Add `keccak` and Keccak-based hash functions: `sha3`, `shake`, `cshake`, `kmac`, `turboshake`, `tuplehash`, and `parallelhash`. #2728
- Added `fault.short_name` and `fault.@short_name` to get just the fault name for both run and compile time. #3002
- Compiler runtime functions extracted outside of std.
- Add the GZIP file format (RFC 1952).
- Add file::last_modified.
- Make DateTime and DateTimeTz `Printable`.
- Add `to_format` functionality for DateTime.
- `SubProcess`/`process::create`/`process::execute_stdout_to_buffer` deprecated, replaced by `Process`/`process:spawn`/`process::run_capture_stdout`.
- Add support for AES-encrypted Zip files (AE-1 and AE-2 formats).
- Add `Argon2` memory-hard hashing with associated tests. #2773
- Matrix type is now column major.
- Fix matrix perspective and ortho, project and unproject to be RH [0,1]
- Add vec3 methods: `rejection`, `project`, implement `unproject`.
- Add vector function `cubic_hermite`
- Deprecated `sq_magnitude`, `barycenter`, `towards`, `ortho_normalize`, `clamp_mag`, use `length_sq`, `barycentric`, `move_towards`, `orthonormalize`, `clamp_length` instead.
- Add Quaternion conversion functions to from Euler angles and axis+angle.
- `math::deg_to_rad` and `math::rad_to_deg` respects the underlying type, returning `float` on a `float` argument.
- Added `float.to_radians` and `float.to_degrees` and the same for `double`.
- Added `Quat`, `Mat2`, `Mat3` and `Mat4`, `Vec2`, `Vec3`, `Vec4` aliases.
- Added `is_normalized` to Quaternion and floating point vectors.
- Added `quaternion::from_rotation` and `quaternion::from_normalized_rotation`
- Added `Rect` type.
- Added `matrix::frustum`.
- Added `math::@abs` for compile time `abs`.
- Make `Errno` a constdef containing all definitions. Deprecated `libc::errno` constants.
- `random::seeder` no longer uses temp memory.
- Add simple member-wise struct comparison with `member_eq`. #2801
- `std::core::mem::allocator` deprecated and split into `std::core::mem::allocators` containing allocators and `std::core::mem::alloc` for various allocation methods.
- Add `always_assert` builtin macro.
- Add an `entropy` module to generate cryptographically-secure random bytes. #3022
- Add a builtin `TIMEOUT` fault definition. #3022
- Base32, Base64, Hex and Codepage encoding deprecates `encode_buffer` and `decode_buffer`. Those are replaced by `encode_into` and `decode_into` with `dst` being the first argument. #3055
- `hex::encode_bytes` and `hex::decode_bytes` are deprecated in favour of `hex::encode_bytes_into` and `hex::decode_bytes_into` which has `dst` the first argument. #3055
- Deprecation of `@unaligned_load` and `@unaligned_store`. Use `mem::load` and `mem::store` instead.

### Fixes
- `@deprecated` in function contracts would be processed twice, causing a compilation error despite being correct.
- Name conflict with auto-imported std::core, but it should have lower priority #2902
- Regression: missing generic nesting check on non-types.
- Improved stringify.
- PollSubscribe was incorrectly an int instead of ushort. #2997
- SubProcessOptions.search_user_path did nothing on non-windows systems despite comment saying it should #2845
- AES implementation fixed to be constant time #2806
- Object would not properly compile on 32-bit Linux.
- `read_varint` and `write_varint` did not work properly for ulong and wider.
- `io::EOF.nameof` would yield just `EOF` whereas resolving it at runtime would (correctly) yield `io::EOF`.
- `$stringify` would incorrectly capture lambdas. #2986
- Regression: `String` was not implicitly `@constinit` #2983
- Compiler does not propagate @noreturn through macros using short declaration syntax #3011
- Debug info emitted on `-Os` #3015
- @assert_leak() would not work properly with `--safe=no` #3012.
- Duplicate symbols when building executables on Termux. #2984
- `double[<*>].max` and `.min` were broken.
- Incorrect codegen, crashing the compiler, when passing a `{ .xy = 1 }` constant initializer vector to a function taking a vector, hitting vec->array conversion. #3035
- Folding an anon struct member at compile time would crash #3034.
- Crash in sema_compare_weak_decl when replacing a function declaration from a .c3i file in some cases #3031
- Issue with 'inline' keyword on enum and constdef #3032.
- When checking aliases `alias FOO = _BAR` the compiler would incorrectly would say that `_BAR` wasn't a constant.
- Wasm32 builds crash on startup (unreachable!) due to atexit signature mismatch #3040
- `@nodiscard`, `@maydiscard` and `@noreturn` weren't properly handled for function type declarations.
- `$defined` with body expansion would not correctly check if parameters were the right type.
- `mask_from_int` would miscompile on some platforms.
- Overaligning structs while using `@packed` would cause incorrect lowering #3000
- Splatting a literal into a typed vaarg, e.g. `test(...(int[2]){ 88, 99 }, a: 123)` could cause the compiler to crash.
- `&some_global[0]` was incorrectly considered a global constant when `some_global` was a slice.
- Taking the type of a macro identifier would give the wrong error.
- Taking the type of a `$$builtin` function would crash the compiler.
- Wrong error message when trying to take the address of a `$$builtin` function.
- Accessing a (non-existing) property on a type-call would crash the compiler.
- Crash instead of error when having two vaargs and the last one is an untyped vaarg.
- Detect recursive declaration `int[type()] type`.
- Compiler would not propagate error when `$$str_find` or `$$str_hash` arguments were invalid, causing a crash.
- Error on wrong expression when the slice range start is out of range.
- `void{}` would be looked up as generic in some cases and cause a crash.
- Inferring generic parameters recursively would fail to construct a valid source location and crash.
- Comparing an array of function pointers with any other type could crash rather than being an error.
- Crashing on codegen if an internal fault in if-catch is guaranteed to bypass the conditional.
- In `$foreach` in some cases the elements was an untyped variable which would cause a crash.
- Creating a global slice would be runtime checked for null in some cases.
- `@ensure` and `@require` could contain rethrows, which then would crash the compiler.
- Crash when using `$defined($Type)` and `$Type` is a typeid.
- Assigning to a subscripted const like `{1, 2}[n] = 33` wasn't marked as an error and resulted in a crash.
- Codegen for the case when an assert always panics would cause a crash.
- Lambda check might run against a missing type definition if the function type alias was invalid.
- Missing check when doing `$foo++` would crash the compiler if the variable wasn't initialized.
- Incorrect handling of attribute operator symbols could crash the compiler instead of producing an error.
- Crash instead of error when the first method parameter is a vaarg.
- Fixes to UnalignedRef.
- Codegen would not pop debug location for a never-entered for loop, crashing LLVM lowering.
- Double negating a vector would cause a crash in lowering.
- Combining operator overload on a variadic method would cause a crash rather than emitting an error in some cases.
- Lambdas as default arguments were tagged with the wrong module, leading to linking issues.
- An initializer list with an optional field was incorrectly considered constant.
- Fix in ringbuffer for the case of popping at position 0.

</details>

### Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).

Discuss this article on [Reddit](https://www.reddit.com/r/programming/comments/1set2gu/c3_closes_out_its_07_era_focusing_on_simplicity/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) or [Hacker News](https://news.ycombinator.com/item?id=47673495).