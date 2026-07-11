---
title: "C3 0.8.2 A modest improvement"
date: 2026-07-10
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
slug: 0_8_2_a_modest_improvement
---

C3 0.8.2 is out. This release brings a batch of language ergonomics improvements — most notably reusable target templates for libraries and generic constdef — along with new reflection capabilities and a round of bug fixes. 

Compared to 0.8.1, this is a rather modest release, but anyway, here's what's new:

## Language changes & improvements

### Reusable target configurations for libraries

Libraries can now expose a templates map in their manifest, and projects can pull one into a target with template: "library/template". Template properties load first and target-local settings override them, so libraries can ship sensible, shareable build configurations instead of asking every user to copy-paste setup.

### Reflection for generics

`Foo::is_generic(...)`, `Foo::generic_qname`, and `Foo::generic_args` finally lets you inspect generic instantiations.

```c3
alias Foo = List{int};

fn void main()
{
	typeid t = List{String}::generic_args[0]; //String::typeid
	String name = Foo::generic_qname; // "std::collections::list::List"
	bool x = Foo::is_generic(List); // true
	bool y = int::is_generic(List); // false
}
```

### Bitstruct properties

Bitstruct members gain `bitoffset` and `bitsize` properties:

```c3
bitstruct Foo : uint
{
   uint a : 0..1;
   bool b : 6;
   bool c : 10;
   int d : 14..20;
}

fn void main()
{
    int a = $reflect(Foo.a).bitsize; // 2
    int b = $reflect(Foo.d).bitoffset; // 14
    int c = $reflect(Foo.c).bitoffset; // 10
}
```

### New @param options: own, init and drop

It's now possible to annotate more than in/inout/out on parameters: 

1. `own` signifies that the function will in some way retain the variable beyond the scope of the function. 
2. `drop` means that the pointer and the data pointed to will be invalid when the function returns.
3. `init` means that the data in pointed to will be initialized by the function.

This can be used by the compiler for static analysis and also documents the function or macro.

```c3
<* 
 @param [own] f
*> 
fn void foo(Foo* f)
{
    some_global.foo = f;
}
```

### Asm stack alignment

Before 0.8.2, all asm blocks would be stack aligned, which didn't match C behaviour. This is now fixed. Stack alignment is now opt-in by using `@align`:

```c3
asm // Unaligned
{
  syscall;
}

asm @align // Stack aligned
{
  syscall;
}
```

### Windows improvements

The Windows subsystem can now be set directly. Windows can still use `@winmain` to implicitly set the Window subsystem, but all subsystems are now available, allowing for things like EFI applications.

## Standard library

- `Atomic.compare_exchange` added.
- `array::contains_slice` and `array::index_of_slice` for substring-style searches over arrays.
- `log::register_dynamic_category`, for libraries to define their own logging categories dynamically.
- `String.index_of` and `rindex_of` now accept finding empty strings.

## Fixes

### Stdlib fixes

- Denormal (subnormal) results are now handled correctly by `String.to_double()` — very small magnitudes near the floating-point floor previously came out wrong.
- A float literal with an uppercase F suffix was incorrectly typed as a double instead of a float.
- JSON serialization now correctly handles Unicode and \v (#3353).
- IPv6 parsing: "a::b:c:d:e:f:0" is now accepted as valid.
- A regression in BackedArenaAllocator when destroying it could cause a crash.
- Fixed macOS regression which was breaking stack traces.

### Compiler fixes

- `$stringify` would sometimes wrap output in extra parentheses.
- `constdef` vector with an alias was incorrectly lowered
- The compiler asserted when concatenating a struct to an `untypedlist`
- `untypedlist` was not detected as invalid as an enum associated-value type or as a pointer


## Thank yous

Again, this release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

### PR contributors for this release

**Stdlib:**
AtomicSynth, Book-reader, GuineaPigUuhh and Manu Linares

**Compiler & toolchain:**
Book-reader, Johannes Müller, Manu Linares, Osama Badeeb, rickyadastra and Rodrigo Camacho

**CI/Infrastructure:**
Hade and Manu Linares

### Change Log
<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- `@weak` now works with all declarations.
- Add `@align` for asm blocks to stack align them. Stack alignment is no longer default.
- Allow setting Windows subsystem directly.
- Add `bitoffset` and `bitsize` reflection properties to bitstruct members. #3219
- Improve error message on trying to cast char array to String. #3343
- Add `Foo::is_generic(...)`, `Foo::generic_qname` and `Foo::generic_args`. #2909 #3329
- Add `own`, `init` and `drop` parameter annotations.
- `constdef` can now be generic.
- Libraries can now expose reusable target configurations via a `templates` map in their manifest, which projects reference from a target using `template: "library/template"`. Properties from the template are loaded first and can be overridden by target-local settings.

### Stdlib changes
- `Atomic.compare_exchange` added.
- Added `array::contains_slice` and `array::index_of_slice`.
- `String.index_of` and `rindex_of` will now accept finding empty strings.
- Add log::register_dynamic_category, for libraries that wish to define their own categories dynamically.

### Fixes
- `$stringify` would sometimes include parens.
- Regression when destroying a BackedArenaAllocator in some cases #3332.
- `"a::b:c:d:e:f:0"` was not parsed as a valid ipv6 string.
- `constdef` vector with alias incorrectly lowered #3335.
- Compiler asserts on concatenating a struct to an untypedlist #3326.
- `untypedlist` was not detected as invalid in enum associated value type or as a pointer #3342.
- Regression using non-posix libc.
- Crash with an optional struct recursively defined with a function type. #3358
- Denormal results were not handled correctly by `String.to_double()`.
- A float literal with an uppercase 'F' suffix would be a `double` instead of a `float`.
- Json serialization would not correctly handle unicode and `\v`. #3353
- Semantic checking was incorrect in the case of `&a - &b` where one or both are optional and the result isn't assigned.
- Regression on MacOS, breaking stack trace.

</details>

### Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).