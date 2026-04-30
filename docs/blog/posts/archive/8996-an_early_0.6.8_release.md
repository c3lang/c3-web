---
title: "An early 0.6.8 release"
date: 2025-03-01
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8996-an_early_0.6.8_release](https://c3.handmade.network/blog/p/8996-an_early_0.6.8_release)*

# Release 0.6.8

0.6.8 is to be the last release before 0.7.0 and had a short cycle of development - only two weeks. As usual it has
fixes, but more importantly, it prepares for 0.7.0.

So let's dive into what's new in this release!

## "New generics" - List{int}

0.6.8 has the flag `--enable-new-generics`, which implements the new syntax for generics,
from, for example, `List(<int>) a;` to `List{int} a;`. With this flag the compound literal syntax
of `Foo { 1, 2 }` is disallowed, instead it uses C-style `(Foo) { 1, 2 }`.

## Expression blocks and @operator(construct) deprecated

The expression blocks `{| |}` helps you turn any sequence of statements into an expression. This would be
immensely useful in C-like macros, but with semantic macros in C3 it's much less so, to the point that
it's being removed in 0.7.0. The feature isn't bad, it just hasn't been useful *enough* to keep it.

The `@operator(construct)` which allowed static method-like invocations on types is deprecated. It was
introduced in 0.6.6 as an experiment, but will ultimately be removed in the next version.

## Changes to the stdlib

After a lot of testing during the last year, we're retiring the `new_*` and `temp_` functions. The
old pattern of `foo.new_init` becomes `foo.init(mem)` with "mem" being the default heap allocator,
and initializers with temp allocators usin `foo.tinit()`.

## Tooling changes

The compiler now places temporaries in `.build` by default when using `compile`. There is a
`--suppress-run` for benchmark and test targets to not run them immediately. There is also a
`--build-env` option to get some information about the build environment.

## What's next:

The release of 0.7.0 is planned for early April, with the main feature being the new generics and
and standard library "standardization" aroud "init(mem)". The other big thing is of course
the removal of deprecated functionality.

There are some long standing issues, like completing the `asm` functionality and resolving some
of the semantics around `#hash` arguments that hopefully will be fixed in 0.7.0 as well.

Even though focus is on 0.7.0, a 0.6.9 version might appear if there is an urgent need for bug fixes in 0.6.x.

Here is the full change list:

## 0.6.8 Change list

### Changes / improvements

* Increase precedence of `(Foo) { 1, 2 }`
* Add `--enable-new-generics` to enable `Foo{int}` generic syntax.
* `{| |}` expression blocks deprecated.
* c3c `--test-leak-report` flag for displaying full memory lead report if any
* Output into /.build/obj/<platform> by default.
* Output llvm/asm into llvm/<platform> and asm/<platform> by default.
* Add flag `--suppress-run`. For commands which may run executable after building, skip the run step. #1931
* Add `--build-env` for build environment information.
* Deprecation of `@operator(construct)`.

### Fixes

* Bug appearing when `??` was combined with boolean in some cases.
* Test runner --test-disable-sort didn't work, c3c was expecting --test-nosort
* Test runner with tracking allocator assertion at failed test #1963
* Test runner with tracking allocator didn't properly handle teardown\_fn
* Correctly give an error if a character literal contains a line break.
* Implicitly unwrapped optional value in defer incorrectly copied #1982.
* Crash when trying to define a method macro that isn't `@construct` but has no arguments.
* Regression, `.gitkeep` files were generated incorrectly.
* Aliases are now correctly handled as if they were variables/functions in regards to namespacing and accept `@builtin`.
* Correctly handle in/out when interacting with inout.
* Don't delete .o files not produced by the compiler.
* Fix optional jumps in expression lists, #1942.
* Several fixes for .o files and -o output, improving handling and naming.
* Fix bug casting bool to int to other int #1995.
* `@if` declarations were missing from -P output #1973.
* Check exe and lib output so -o works with directories.
* Swizzling an inline vector in a struct would cause a crash.
* Fixed error and poor error message when using an invalid target name.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

# Release 0.6.8

0.6.8 is to be the last release before 0.7.0 and had a short cycle of development - only two weeks. As usual it has
fixes, but more importantly, it prepares for 0.7.0.

So let's dive into what's new in this release!

## "New generics" - List{int}

0.6.8 has the flag `--enable-new-generics`, which implements the new syntax for generics,
from, for example, `List(<int>) a;` to `List{int} a;`. With this flag the compound literal syntax
of `Foo { 1, 2 }` is disallowed, instead it uses C-style `(Foo) { 1, 2 }`.

## Expression blocks and @operator(construct) deprecated

The expression blocks `{| |}` helps you turn any sequence of statements into an expression. This would be
immensely useful in C-like macros, but with semantic macros in C3 it's much less so, to the point that
it's being removed in 0.7.0. The feature isn't bad, it just hasn't been useful *enough* to keep it.

The `@operator(construct)` which allowed static method-like invocations on types is deprecated. It was
introduced in 0.6.6 as an experiment, but will ultimately be removed in the next version.

## Changes to the stdlib

After a lot of testing during the last year, we're retiring the `new_*` and `temp_` functions. The
old pattern of `foo.new_init` becomes `foo.init(mem)` with "mem" being the default heap allocator,
and initializers with temp allocators usin `foo.tinit()`.

## Tooling changes

The compiler now places temporaries in `.build` by default when using `compile`. There is a
`--suppress-run` for benchmark and test targets to not run them immediately. There is also a
`--build-env` option to get some information about the build environment.

## What's next:

The release of 0.7.0 is planned for early April, with the main feature being the new generics and
and standard library "standardization" aroud "init(mem)". The other big thing is of course
the removal of deprecated functionality.

There are some long standing issues, like completing the `asm` functionality and resolving some
of the semantics around `#hash` arguments that hopefully will be fixed in 0.7.0 as well.

Even though focus is on 0.7.0, a 0.6.9 version might appear if there is an urgent need for bug fixes in 0.6.x.

Here is the full change list:

## 0.6.8 Change list

### Changes / improvements

* Increase precedence of `(Foo) { 1, 2 }`
* Add `--enable-new-generics` to enable `Foo{int}` generic syntax.
* `{| |}` expression blocks deprecated.
* c3c `--test-leak-report` flag for displaying full memory lead report if any
* Output into /.build/obj/<platform> by default.
* Output llvm/asm into llvm/<platform> and asm/<platform> by default.
* Add flag `--suppress-run`. For commands which may run executable after building, skip the run step. #1931
* Add `--build-env` for build environment information.
* Deprecation of `@operator(construct)`.

### Fixes

* Bug appearing when `??` was combined with boolean in some cases.
* Test runner --test-disable-sort didn't work, c3c was expecting --test-nosort
* Test runner with tracking allocator assertion at failed test #1963
* Test runner with tracking allocator didn't properly handle teardown\_fn
* Correctly give an error if a character literal contains a line break.
* Implicitly unwrapped optional value in defer incorrectly copied #1982.
* Crash when trying to define a method macro that isn't `@construct` but has no arguments.
* Regression, `.gitkeep` files were generated incorrectly.
* Aliases are now correctly handled as if they were variables/functions in regards to namespacing and accept `@builtin`.
* Correctly handle in/out when interacting with inout.
* Don't delete .o files not produced by the compiler.
* Fix optional jumps in expression lists, #1942.
* Several fixes for .o files and -o output, improving handling and naming.
* Fix bug casting bool to int to other int #1995.
* `@if` declarations were missing from -P output #1973.
* Check exe and lib output so -o works with directories.
* Swizzling an inline vector in a struct would cause a crash.
* Fixed error and poor error message when using an invalid target name.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>