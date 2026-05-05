---
title: "Welcome to C3 version 0.6.3"
date: 2024-10-03
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8957-welcome_to_c3_version_0.6.3](https://c3.handmade.network/blog/p/8957-welcome_to_c3_version_0.6.3)*

0.6.3 is out and brings some nice improvements and changes together with bug fixes and standard library additions.

Some highlights:

### New named argument syntax

The old initializer list style named arguments (`.arg = value`) is deprecated and replaced
by a `arg: value` syntax which feels more natural for function invocation. So `foo(.some_arg = 23, .other_arg = b)` should now be `foo(some_arg: 23, other_arg: b)`. The old syntax will be removed in 0.7.

### Slicing of compile time values

C3 now allows slicing of untyped lists and strings. The upcoming 0.6.4 will further support compile time
slicing on all compile time arrays, but in 0.6.3 this is still somewhat limited.

### Splat everywhere

Ever had an int array and wanted to unpack it into a function call? Now you can do that with `...`:

```
int[2] x = some_call();
foo(...x); // Same as `foo(x[0], x[1]);`
```

Some limitations apply: when splatting a slice into a normal argument slots the slice length needs to be known at compile time (although it's straightforward to circumvent if needed).

### Environment variables for configurability

The environment variable `C3C_CC` is introduced to allow overriding the default C compiler chosen when
compiling C sources as part of the compilation proces, and `C3C_LIB` allows pointing to a custom default
standard library location.

### Ad hoc generic type definition changes

Ad hoc generic type definitions, e.g. `List(<int>) x;` have been deprecated for use outside of type declarations and macros. Only generic types marked `@adhoc` are now valid for ad hoc declarations,
examples of such "adhoc enabled" types is the `Maybe` type.

This only applies to types. Functions and constants can be all be used ad-hoc style, e.g. `foo::some_function(<int>)(123)`.

### $ and # "self" arguments for macro methods

It's now possible to use constant or unevaluated expressions for the "self" parameter in macro methods.
This opens up for some useful functionality when using reflection data.

### Extended "vendor-fetch"

A `project-fetch` project function has been added to download missing dependencies for projects into the correct directory, and `c3c vendor-fetch` can now be used to add and download a new project dependency with
a single command.

### Wasm improvements

For Wasm, `wasm32` / `wasm64` targets no longer need to specify `use-libc=no` as they're assumed to be freestanding by default.

In addition to this, there is now support for Wasm modules: The `@wasm` attribute now accepts one or two arguments - with two arguments, the first is then assumed to be the module name.

### Standard library additions

As usual the standard library got a few additions. In 0.6.3 `HashMap` has more
convenient init functions, the standard random has more variants of random out
of the box, cryptographic MD5 and SHA256 hashes were added, as well as HMAC and PBKDF2
support. Datetime has more timezone-related functions and DString received some very
useful insert methods.

### What's next?

0.6.4 will get complete support for compile time slices, and beyond that hopefully further
refinement of the standard library.

For more information about the release, see the full change list:

## 0.6.3 Change list

### Changes / improvements

* Introduce `arg: x` named arguments instead of `.arg = x`, deprecate old style.
* Support splat for varargs #1352.
* Allow `var` in lambdas in macros.
* Support `int[*] { 1, 2, 3 }` expressions.
* Support inline struct designated init as if inline was anonymous.
* Introduce the `.paramsof` property.
* Support environment variable 'C3C\_LIB' to find the standard library.
* Support environment variable 'C3C\_CC' to find the default C compiler.
* Support casting bitstructs to bool.
* Allow user-defined attributes to have typed parameters.
* Add `.gitkeep` files to project subfolders.
* Add `env::COMPILER_BUILD_HASH` and `env::COMPILER_BUILD_DATE`
* Support linking .o files in compilation command. #1417
* Slicing constant strings at compile time works.
* Add `project fetch` subcommand to fetch missing project dependencies (general and target specific)
* Ability of `vendor-fetch` to download the dependencies in the first specified path `dependencies-search-path`
* Ability of `vendor-fetch` to register the fetched dependencies in the project file.
* Allow the "self" parameter to be $/# for macro methods.
* Support compile time slicing of untyped lists.
* Allow specifying an import module using `@wasm` #1305.
* Deprecated inline generic types outside of struct definitions and macros unless marked `@adhoc`.
* Improved method detection in earlier stages of checking.
* Allow `@norecurse` attribute for non-recursive imports #1480.
* wasm32 / wasm64 targets are use-libc=no by default.

### Fixes

* Issue where a lambda wasn't correctly registered as external. #1408
* Generic methods were incorrectly registered as functions, leading to naming collisions. #1402
* Deprecated tuple / triple types.
* Converting a slice to a vector/array would copy too little data.
* Crash when reading an empty 'manifest.json'.
* "optsize" did not work correctly in project.json.
* `l[0].a = 1` now supported for overloads due to better lvalue handling #1357.
* Asserts are retained regardless of optimization when running tests.
* Limit object filename lengths. #1415
* Fix regression for `$include`.
* Correct '.so' suffix on dynamic libraries on Linux.
* Fix bug where inline index access to array in a struct would crash the compiler.
* Asserts are now correctly included and traced in when running tests.
* Use atexit to fix finalizers on Windows #1361.
* Fix bugs in "trap-on-wrap" #1434.
* Bug with casting anyfault to error.
* Lambda / function type would accidentally be processed as a method.
* Fix error message when not finding a particular function.
* Crash invoking a `@body` argument with the wrong number of parameters.
* Fix reordering semantics in struct assignment.
* Regression when passing types as `#expr` arguments. #1461
* Temp allocator overwrites data when doing reset on extra allocated pages. #1462
* User defined attributes could not have more than 1 parameter due to bug.
* Folding a constant array of structs at compile time would cause an assert.
* Enum attributes would be overwritten by enum value attributes.
* LLVM issue with try when bool is combined #1467.
* Segfault using ternary with no assignment #1468.
* Inner types make some errors misleading #1471.
* Fix bug when passing a type as a compile time value.
* Fix bug due to enum associated values not being checked for liveness.
* Regression when compile time accessing a union field not last assigned to.
* Safer seed of rand() for WASM without libc.
* Bad error message aliasing an ident with a path. #1481.
* Error when slicing a struct with an inline array #1488.
* Improved error messages on `Foo a = foo { 1 };` #1496
* Bug in json decoder escape handling.
* Fix bug when reading zip manifest, that would not return a zero terminated string. #1490
* Fix thread tests.
* Detect recursion errors on non-recursive mutexes in safe mode.
* Foreach over distinct pointer failed to be caught as error #1506.
* Foreach over distinct iterable would ignore operator(len).
* Compiler crash when compiling c code in a library without --obj-out #1503.

### Stdlib changes

* Additional init functions for hashmap.
* `format` functions are now functions and work better with splat.
* Add support for the QOI format.
* Add `io::read_new_fully` for reading to the end of a stream.
* Add `io::wrap_bytes` for reading bytes with `io` functions.
* Add `rnd` and `rand_in_range` default random functions.
* Additional timezone related functions for `datetime`.
* Added MD5 and crypto::safe\_compare.
* Added generic HMAC.
* Added generic PBKDF2 implementation.
* DString `reverse`.
* `DString.insert_at` now has variants for other types.
* Added sha256.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

0.6.3 is out and brings some nice improvements and changes together with bug fixes and standard library additions.

Some highlights:

### New named argument syntax

The old initializer list style named arguments (`.arg = value`) is deprecated and replaced
by a `arg: value` syntax which feels more natural for function invocation. So `foo(.some_arg = 23, .other_arg = b)` should now be `foo(some_arg: 23, other_arg: b)`. The old syntax will be removed in 0.7.

### Slicing of compile time values

C3 now allows slicing of untyped lists and strings. The upcoming 0.6.4 will further support compile time
slicing on all compile time arrays, but in 0.6.3 this is still somewhat limited.

### Splat everywhere

Ever had an int array and wanted to unpack it into a function call? Now you can do that with `...`:

```
int[2] x = some_call();
foo(...x); // Same as `foo(x[0], x[1]);`
```

Some limitations apply: when splatting a slice into a normal argument slots the slice length needs to be known at compile time (although it's straightforward to circumvent if needed).

### Environment variables for configurability

The environment variable `C3C_CC` is introduced to allow overriding the default C compiler chosen when
compiling C sources as part of the compilation proces, and `C3C_LIB` allows pointing to a custom default
standard library location.

### Ad hoc generic type definition changes

Ad hoc generic type definitions, e.g. `List(<int>) x;` have been deprecated for use outside of type declarations and macros. Only generic types marked `@adhoc` are now valid for ad hoc declarations,
examples of such "adhoc enabled" types is the `Maybe` type.

This only applies to types. Functions and constants can be all be used ad-hoc style, e.g. `foo::some_function(<int>)(123)`.

### $ and # "self" arguments for macro methods

It's now possible to use constant or unevaluated expressions for the "self" parameter in macro methods.
This opens up for some useful functionality when using reflection data.

### Extended "vendor-fetch"

A `project-fetch` project function has been added to download missing dependencies for projects into the correct directory, and `c3c vendor-fetch` can now be used to add and download a new project dependency with
a single command.

### Wasm improvements

For Wasm, `wasm32` / `wasm64` targets no longer need to specify `use-libc=no` as they're assumed to be freestanding by default.

In addition to this, there is now support for Wasm modules: The `@wasm` attribute now accepts one or two arguments - with two arguments, the first is then assumed to be the module name.

### Standard library additions

As usual the standard library got a few additions. In 0.6.3 `HashMap` has more
convenient init functions, the standard random has more variants of random out
of the box, cryptographic MD5 and SHA256 hashes were added, as well as HMAC and PBKDF2
support. Datetime has more timezone-related functions and DString received some very
useful insert methods.

### What's next?

0.6.4 will get complete support for compile time slices, and beyond that hopefully further
refinement of the standard library.

For more information about the release, see the full change list:

## 0.6.3 Change list

### Changes / improvements

* Introduce `arg: x` named arguments instead of `.arg = x`, deprecate old style.
* Support splat for varargs #1352.
* Allow `var` in lambdas in macros.
* Support `int[*] { 1, 2, 3 }` expressions.
* Support inline struct designated init as if inline was anonymous.
* Introduce the `.paramsof` property.
* Support environment variable 'C3C\_LIB' to find the standard library.
* Support environment variable 'C3C\_CC' to find the default C compiler.
* Support casting bitstructs to bool.
* Allow user-defined attributes to have typed parameters.
* Add `.gitkeep` files to project subfolders.
* Add `env::COMPILER_BUILD_HASH` and `env::COMPILER_BUILD_DATE`
* Support linking .o files in compilation command. #1417
* Slicing constant strings at compile time works.
* Add `project fetch` subcommand to fetch missing project dependencies (general and target specific)
* Ability of `vendor-fetch` to download the dependencies in the first specified path `dependencies-search-path`
* Ability of `vendor-fetch` to register the fetched dependencies in the project file.
* Allow the "self" parameter to be $/# for macro methods.
* Support compile time slicing of untyped lists.
* Allow specifying an import module using `@wasm` #1305.
* Deprecated inline generic types outside of struct definitions and macros unless marked `@adhoc`.
* Improved method detection in earlier stages of checking.
* Allow `@norecurse` attribute for non-recursive imports #1480.
* wasm32 / wasm64 targets are use-libc=no by default.

### Fixes

* Issue where a lambda wasn't correctly registered as external. #1408
* Generic methods were incorrectly registered as functions, leading to naming collisions. #1402
* Deprecated tuple / triple types.
* Converting a slice to a vector/array would copy too little data.
* Crash when reading an empty 'manifest.json'.
* "optsize" did not work correctly in project.json.
* `l[0].a = 1` now supported for overloads due to better lvalue handling #1357.
* Asserts are retained regardless of optimization when running tests.
* Limit object filename lengths. #1415
* Fix regression for `$include`.
* Correct '.so' suffix on dynamic libraries on Linux.
* Fix bug where inline index access to array in a struct would crash the compiler.
* Asserts are now correctly included and traced in when running tests.
* Use atexit to fix finalizers on Windows #1361.
* Fix bugs in "trap-on-wrap" #1434.
* Bug with casting anyfault to error.
* Lambda / function type would accidentally be processed as a method.
* Fix error message when not finding a particular function.
* Crash invoking a `@body` argument with the wrong number of parameters.
* Fix reordering semantics in struct assignment.
* Regression when passing types as `#expr` arguments. #1461
* Temp allocator overwrites data when doing reset on extra allocated pages. #1462
* User defined attributes could not have more than 1 parameter due to bug.
* Folding a constant array of structs at compile time would cause an assert.
* Enum attributes would be overwritten by enum value attributes.
* LLVM issue with try when bool is combined #1467.
* Segfault using ternary with no assignment #1468.
* Inner types make some errors misleading #1471.
* Fix bug when passing a type as a compile time value.
* Fix bug due to enum associated values not being checked for liveness.
* Regression when compile time accessing a union field not last assigned to.
* Safer seed of rand() for WASM without libc.
* Bad error message aliasing an ident with a path. #1481.
* Error when slicing a struct with an inline array #1488.
* Improved error messages on `Foo a = foo { 1 };` #1496
* Bug in json decoder escape handling.
* Fix bug when reading zip manifest, that would not return a zero terminated string. #1490
* Fix thread tests.
* Detect recursion errors on non-recursive mutexes in safe mode.
* Foreach over distinct pointer failed to be caught as error #1506.
* Foreach over distinct iterable would ignore operator(len).
* Compiler crash when compiling c code in a library without --obj-out #1503.

### Stdlib changes

* Additional init functions for hashmap.
* `format` functions are now functions and work better with splat.
* Add support for the QOI format.
* Add `io::read_new_fully` for reading to the end of a stream.
* Add `io::wrap_bytes` for reading bytes with `io` functions.
* Add `rnd` and `rand_in_range` default random functions.
* Additional timezone related functions for `datetime`.
* Added MD5 and crypto::safe\_compare.
* Added generic HMAC.
* Added generic PBKDF2 implementation.
* DString `reverse`.
* `DString.insert_at` now has variants for other types.
* Added sha256.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>