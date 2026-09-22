---
title: "C3 0.8.4 The last renaming"
date: 2026-09-18
tags: ["release", "language-features", "compiler"]
authors:
  - lerno
slug: c3_0_8_4_last_renaming
---

C3 0.8.4 is now available. This release expands parameter reflection and contracts, adds configurable stack probing and stack protection, introduces iOS support, and brings a new collection type and stream utilities to the standard library.

This release is titled “The Last Renaming” because it very likely contains the final adjustments to C3’s keyword set – and I think we’ve finally got them right.

Changing keywords is hardly the best way to convey stability, but sometimes it is necessary. In C3's case 0.9.0 means syntactic freeze of the language, so getting the choice right in the 0.8.x cycle is vital.

Of course, as usual the old keywords will still work as part of the backwards compatibility with 0.8.3 and earlier, but moving to the new ones are recommended.

## Language changes & improvements

### Renaming preview for 0.9 – changing the -def family

`faultdef` and `attrdef` were introduced in 0.7.0 and `constdef` in 0.7.10. The idea was to unify them under an easy-to-remember "def" suffix. Unfortunately a downside is that this pushes them to retain a similar syntactic shape. After much discussion, we're experimentally introducing new names:

* `faultdef` -> `excuse`
* `attrdef` -> `attrmacro`
* `constdef` -> `constset`

`excuse` comes from the general terminology, where the fault returned for an empty optional is called the "excuse" in the documentation. That this becomes a keyword further cements that term. In addition, `excuse` gains a shape with `{}`, not supported by `faultdef`:

```c3
excuse
{
    MY_FAULT,
    SOME_ONE_ELSES_FAULT,
}
```

`attrmacro` was chosen because `attrdef` takes parameters and in general acts closer to a macro than an alias.

Both `cenum` and `constset` were considered. Eventually the latter won out because it establishes a stronger independent feature, whereas the `cenum` hints at it just being an "enum that works like in C", which isn't correct.

Note that `attrdef`, `constdef` and `faultdef` will work throughout the entire 0.8.x cycle. The new keywords are considered an experimental change, and will be evaluated until 0.9.0. It will become the standard in 0.9.0 only if it's decided that the names are an improvement.

### Pinpointing `@require` failures

It is now possible to associate a requirement with a particular parameter by placing it in brackets after `@require`:

```c3
<*
 @require [a] a > 0 : "a must be greater than zero"
*>     
fn void example(int a)
{
    // ...
}
```

This lets diagnostics point directly to the argument responsible for a failed precondition, making contract failures easier to understand at the call site.

### Parameter reflection

Parameter reflection is more capable in 0.8.4. `$reflect(foo).param_struct` and `Foo::param_struct` provide access to a function's parameters as a struct. This allows macros to build up calls by populating each field, and then use struct splat to make the call:

```c3
fn void foo(int a, double b) { }

fn void test()
{
	// The parameter struct has fields `a` and `b`
	var $ParamStruct = $reflect(foo).param_struct;
	// Create a struct 
	$ParamStruct s;
	// Populate them.
	s.a = 10;
	s.b = 2.3;
	// Use struct splatting to make the call
	foo(...s);
}
```

Parameters can now also carry `@tag` attributes, and reflected parameters support `get_tag`, `tags`, and `has_tag`.

It is also possible to inspect a parameter's default value through `.default_value`.

As part of this work, `FooFn::params` now returns reflected references rather than `ReflectedParam` values. Code using this reflection API may need to be updated.

### Conditional aliases

Alias definitions now accept ternary expressions. This makes it possible to select an implementation using a feature flag without wrapping the alias in a separate conditional declaration:

```c3
alias foo = $feat(ABC) ? foo_1 : foo_2;
```

## Compiler and toolchain

### Stack hardening and the x86 red zone

C3 0.8.4 adds several controls for stack hardening. The new `--stack-probe`, `--stack-probe-size`, and `--stack-protector` options configure stack probing and stack-canary generation from the command line.

Individual functions and lambdas can override these settings with `@stackprobe(level)`, `@nostackprobe`, `@stackprotector(level)`, and `@nostackprotector`. Naked functions no longer receive stack protectors by default.

The new `@noredzone` attribute disables use of the x86-64 red zone for a function. As a temporary safety measure, functions on ELF x86-64 are emitted without red-zone use. ELF and COFF output also gained support for the `dso_local` attribute.

The `--implicit-float` setting provides control over the emission of floating-point operations. This is useful for low-level targets where implicitly generated floating-point instructions are undesirable.

### Platform and build improvements

This release adds support for targeting iOS. LLVM compilation scheduling has also been adjusted so the largest modules are built first, helping make better use of parallel compilation.

Project target types `benchmark` and `test` now work correctly with `c3c benchmark` and `c3c test`, including targeted benchmark functions. Project names passed to `c3c init` may now contain `-`, and the new `--keep-obj` option preserves object files after building and linking.

The compiler can now warn about unused locals and parameters with `--warn-unusedlocal` and `--warn-unusedparam`. Diagnostics have been improved for incorrect panic-function names, excessively long source lines or underlines, and build options incorrectly written with `=`.

### Faster slice equality

Equality comparisons between slices of flat types are now lowered to `memcmp` instead of scalar loops, reducing the cost of comparing suitable slices.

## Standard Library Updates

### Streams and collections

The standard library now includes `CachedInStream` and `CachedOutStream`, as well as the new `std::collections::Tree` collection.

`InStream.read` has been made consistent: it returns `0` at end of file instead of throwing `io::EOF`, and it now requires a non-empty destination buffer. Code which catches `io::EOF` from `InStream.read` should be updated to check the returned byte count instead.

Ranges gained a `range::slice` macro, and `Path.is_link` can be used to determine whether a path is a symbolic link.

### Networking, logging and memory

Sockets can now report both ends of a connection through `Socket.peer_address`, `Socket.peer_port`, `Socket.local_address`, and `Socket.local_port`. Logging gained `log::get_logger`.

`RefCounted` has been reworked slightly to differentiate between finalization and freeing.

### Thread pool changes

The old deprecated `pool::ThreadPool` is now disabled by default, and the new `thread::ThreadPool` is enabled by default. The old implementation is exposed as `ThreadPoolOld`, with `-D OLD_THREADPOOL` available for restoring the old name, for projects that do not want to change the name to `ThreadPoolOld`.

## Fixes

This release fixes a broad set of compiler crashes and miscompilations, particularly around generics, vectors, bitstruct operations, default arguments, and deferred control flow.

Notable compiler fixes include:

- Generic declarations disabled with `@feat` are no longer instantiated.
- Generic aliases inside functions no longer cause the compiler to hang.
- Generic function pointers are resolved before use regardless of generic resolution order.
- Dead-code detection is preserved correctly when leaving a scope.
- A `switch` inside `defer` is no longer copied incorrectly during compilation.
- Debug information for default-initialized arguments and code generation for decrementing bitstruct fields no longer crash with LLVM 23.
- Struct initializers containing arrays of vectors are aligned correctly.
- Reversing vectors larger than 128 elements no longer corrupts the heap.
- `$$mod` on unsigned integers now emits an unsigned remainder operation.
- Optional-vector-to-array casts now generate correct code.
- Overloading from-end subscripts such as `foo[^1] = 2` now works correctly.
- The configured C compiler is now used consistently.

The standard library also received several correctness fixes. Large left shifts now work for `BigInt`, copying a `DString` no longer overwrites its allocator, and `FixedBlockPool` handles changes to `grow_capacity` correctly. Fixes also landed for `mem::equals`, UTF-16 surrogate pairs in `String.escape`, virtual-memory reserve page sizes, and stale thread IDs returned by `thread::current` on POSIX.

String case-conversion attributes such as `@str_pascalcase` and `@str_camelcase` now retain digits instead of treating them as discarded word separators.

## Thank yous

Again, this release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to everyone who contributed through code, issue reports, testing, and discussions.


### PR contributors for this release

**Stdlib:**
Archishman Nag, m0tholith, Manu Linares, Ricardo Tomasi, Senthilnathan, Velikiy Kirill.

**Compiler & toolchain:**
Alexandru Paniș, Darvisim, Manu Linares, neerajnangireddy, rickyadastra, ssimb, Vyacheslav Denisov.

**CI/Infrastructure:**
Darvisim, Fernando López Guevara, Manu Linares.

### Change Log

<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- Improved error message when providing an incorrect name for the panic function.
- Add the ability to pinpoint a `@require` using the `@require [a] a > 0 : "a must be greater than zero"` syntax. #1804
- `benchmark` and `test` project targets now work properly with `c3c benchmark` and `c3c test`.
- Add `$reflect(foo).param_struct` and `Foo::param_struct` properties. #3099
- Allow the parse `faultset { ... }`. For `faultset`, `faultconst` and `excuse`.
- Improved error messages when underlined error is too long, or lines are too long. #3383
- Add `--implicit-float` setting to control emission of floating point operations. #3449
- Allow parameters to have `@tag` #3084
- `FooFn::params` no longer returns `ReflectedParam` but a reflected reference. This allows get_tag/tags/has_tag.
- Allow parameters to be queried for the default value using `.default_value`.
- Allow ternary in alias definitions, e.g. `alias foo = $feat(ABC) ? foo_1 : foo_2`. #3464
- On elf-x64, add noredzone to functions as a stopgap solution.
- Add `--stack-probe`, `--stack-probe-size` and `--stack-protector` to configure stack probing and stack canary generation. #3437
- Add `stack-probe` and `stack-protector` project options. #3437
- Add `@stackprobe(level)`, `@nostackprobe`, `@stackprotector(level)` and `@nostackprotector` attributes on functions and lambdas. #3437
- Naked functions no longer have stack protectors by default.
- Add `@noredzone` attribute.
- Add `dso_local` attribute on ELF/COFF.
- Let LLVM build the biggest modules first.
- Support for iOS.
- Allow `-` in `c3c init some-project`.
- `--keep-obj` added, to prevent object files from being deleted after building/linking.
- Slice equality for flat types is now lowered to `memcmp`, avoiding scalar loops. #3491
- Add `--warn-unusedlocal` and `--warn-unusedparam` to detect unused parameters and locals. #3485
- Improve the error message for build options which use `=`.
- Add control registers to x86 inline assembly

### Stdlib changes
- `CachedInStream` and `CachedOutStream` added.
- `InStream.read` now consistently returns 0 on EOF, and never throws io::EOF, and requires a non-zero buffer target.
- `pool::ThreadPool` now only available using `ThreadPoolOld` unless `-D OLD_THREADPOOL` is used.
- Add `std::collections::Tree`.
- `std::net` added `Socket.peer_address`, `peer_port`, `local_address`, and `local_port` for retrieving remote and local socket address information. #3460
- Add a `range::slice` macro.
- Add `log::get_logger`.
- `RefCounted` now correctly makes a difference between dealloc and free.
- `Path.is_link` added.

### Fixes
- Vmem incorrectly handled reserve page sizes.
- `@return` was accepted in doc comments for non-function/macro declarations.
- Can not run targeted benchmark function in project #1651.
- Detection of dead code would get reset after visiting a scope, causing a crash in codegen. #3453.
- Switch was incorrectly copied inside of defer, causing crash in codegen. #3454
- Codegen for debug info was incorrect for default init on arguments, causing crash with LLVM23.
- Codegen for bitstruct `b.foo--` was incorrect, causing crash with LLVM23.
- `@str_pascalcase`/`@str_camelcase` treated digits as word separators and dropped them from the output. #3287
- Typedef access resolution preferred inner type field over method. #3457
- Generic gets instantiated despite being disabled with `@feat` #3459
- Compiler hangs with generic alias in function. #3470
- Resolution order for generics may cause generic function pointers to not get resolved before use. #3471
- Stale tid in `thread::current` on POSIX. #3472
- Compiler crashes on implicitly casting a `&a - &b` to another type. #3477
- BigInt shift left would not work correctly with shifts over 32 bits.
- DString copy would accidentally overwrite the allocator.
- FixedBlockPool would not correctly handle changes to grow_capacity.
- Fix bug in `mem::equals` calculating the last part to compare.
- Miscompilation of struct initializers when a struct contained an array of vectors, causing incorrect alignment. #3483
- `String.escape` would not correctly handle UTF16 pairs.
- Heap buffer corruption when reversing vectors larger than 128 elements due to an undersized allocation.
- `$$mod` on unsigned integers emitted signed division instead of unsigned remainder.
- Improved codegen for casting an optional vector to an array.
- Overload for `^1`, e.g. `foo[^1] = 2` did not work correctly. #3496
- Correctly use defined C compiler in all cases. #3495

</details>

### Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

https://news.ycombinator.com/item?id=49798843
Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).

Discuss this article on [Hacker News](https://news.ycombinator.com/item?id=49798843).