---
title: "More splat and bug fixes: C3 0.6.5 is released"
date: 2024-12-14
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8979-more_splat_and_bug_fixes__c3_0.6.5_is_released](https://c3.handmade.network/blog/p/8979-more_splat_and_bug_fixes__c3_0.6.5_is_released)*

0.6.5 is out, and it brings some improvements and a bunch of bug fixes.

## Splat in initializers

Splat has gained more and more features the last releases, and this is likely the last one, allowing
you to splat into initializers. This means something like this now works:

```
struct Foo { int a; int b; }

fn void test(int[2] x)
{
  Foo f = { ...x };
}
```

## Improved [] overloading

Using `list[i] *= 2;` or `list[i]++` where "list" was a type with subscript overloading (such as List)
was not possible. This now works fine.

## Improved Optionals

Previously using `a++` where "a" was an optional, had required using the optional result. This is now no longer
the case, and

```
int! a = foo();
a++;
```

Works fine.

## Updated command line options

A "quiet" option using `-q` is now available to suppress all non-error output. Furthermore the `--debug-log` and `--debug-stats`
have been replaced by `-v`, `-vv` and `-vvv` for increasing verbosity.

## Stdlib changes

Various fixes are in the 0.6.5, as well as a more convenient API when doing base32/64 encoding.
Other small quality-of-life additions such as `file::save` have found its way into the standard library as well.

## What's next

Looking towards the 0.7.0 release, there might be a breaking change in how pointer subscripting works.

Currently, given `int[5]* a;` doing `a[0]` will subscript the pointer, returning an `int[5]` value. This is often
not what one desires and creates a fair amount of confusion. For this reason, subscripting pointers might be disallowed,
making pointers to arrays implicitly dereference the pointer (so `a[0]` in our example would implicitly be `(*a)[0]`)
with `*(pointer + i)` still working as usual. The future will tell how this should be tackled in C3.

Here is the full change list:

## 0.6.5 Change list

### Changes / improvements

* Allow splat in initializers.
* Init command will now add `test-sources` to `project.json` #1520
* `a++` may be discarded if `a` is optional and ++/-- works for overloaded operators.
* Improve support for Windows cross compilation on targets with case sensitive file systems.
* Add "sources" support to library `manifest.json`, defaults to root folder if unspecified.
* Add char\_at method in DString and operators [], len, []= and &[].
* Add `-q` option, make `--run-once` implicitly `-q`.
* Add `-v`, `-vv` and `-vvv` options for increasing verbosity, replacing debug-log and debug-stats options.

### Fixes

* Fix bug where `a > 0 ? f() : g()` could cause a compiler crash if both returned `void!`.
* `@builtin` was not respected for generic modules #1617.
* Fix issue writing a single byte in the WriteBuffer
* A distinct inline pointer type can now participate in pointer arithmetics.
* Support &a[0] returning the distinct type when applying it to a distinct of a pointer.
* Fix error when calling `HashMap.remove` on uninitialized `HashMap`.
* Fix issue with resolved try-unwrap in defer.
* Fix issue with overloaded subscript and ++/-- and assign ops (e.g. `*=`)
* Fix issue with properties in different targets not being respected #1633.
* Indexing an Optional slice would crash in codegen #1636.
* SimpleHeapAllocator bug when splitting blocks allowed memory overrun.
* Not possible to alias or take reference for extension methods on non-user defined types. #1637
* Prevent methods from using names of properties or fields. #1638
* b64 / hex data strings can now be used with ` as well.
* Contracts on generic modules would evaluate too late, sometimes not catching the error until it already occurred elsewhere.
* Fix bug preventing optionals from being used in ranges or as indices.
* Crash compiling for arm64 when returning 16 byte and smaller structs by value not a power of 2 #1649.
* Enforce single module compilation for static libraries to make constructors run properly.
* Crash when using --no-obj without compile-only. #1653
* Do not produce expression locations for windows.
* Issue where multiple methods were accepted for the same type.
* Issue where a method was linked to a type alias instead of the underlying type.
* Fix Fnv1a encoding.
* Fix issue with accessing arrays in access-overloaded types, e.g. `list[1][2]` #1665.
* Cast removing arbitrary array indices and converting them to pointers should always be fine #1664
* Incorrect "no-libc" definition of `cos`, making it unavailable for wasm.
* Fix issue with the adjoint and inverse calculations for `Matrix2x2`.
* It was possible to create 0 length arrays using byte literals. #1678
* Crash when a constant null typeid is checked for properties. #1679

### Stdlib changes

* Add `io::MultiReader`, `io::MultiWriter`, and `io::TeeReader` structs.
* Updated Base32 API.
* Add `file::save`.
* Add `memcpy` / `memset` / `memcmp` to nolibc.
* Add `sort::quickselect` to find the k-th smallest element in an unordered list.
* Add `sort::is_sorted` to determine if a list is sorted.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

0.6.5 is out, and it brings some improvements and a bunch of bug fixes.

## Splat in initializers

Splat has gained more and more features the last releases, and this is likely the last one, allowing
you to splat into initializers. This means something like this now works:

```
struct Foo { int a; int b; }

fn void test(int[2] x)
{
  Foo f = { ...x };
}
```

## Improved [] overloading

Using `list[i] *= 2;` or `list[i]++` where "list" was a type with subscript overloading (such as List)
was not possible. This now works fine.

## Improved Optionals

Previously using `a++` where "a" was an optional, had required using the optional result. This is now no longer
the case, and

```
int! a = foo();
a++;
```

Works fine.

## Updated command line options

A "quiet" option using `-q` is now available to suppress all non-error output. Furthermore the `--debug-log` and `--debug-stats`
have been replaced by `-v`, `-vv` and `-vvv` for increasing verbosity.

## Stdlib changes

Various fixes are in the 0.6.5, as well as a more convenient API when doing base32/64 encoding.
Other small quality-of-life additions such as `file::save` have found its way into the standard library as well.

## What's next

Looking towards the 0.7.0 release, there might be a breaking change in how pointer subscripting works.

Currently, given `int[5]* a;` doing `a[0]` will subscript the pointer, returning an `int[5]` value. This is often
not what one desires and creates a fair amount of confusion. For this reason, subscripting pointers might be disallowed,
making pointers to arrays implicitly dereference the pointer (so `a[0]` in our example would implicitly be `(*a)[0]`)
with `*(pointer + i)` still working as usual. The future will tell how this should be tackled in C3.

Here is the full change list:

## 0.6.5 Change list

### Changes / improvements

* Allow splat in initializers.
* Init command will now add `test-sources` to `project.json` #1520
* `a++` may be discarded if `a` is optional and ++/-- works for overloaded operators.
* Improve support for Windows cross compilation on targets with case sensitive file systems.
* Add "sources" support to library `manifest.json`, defaults to root folder if unspecified.
* Add char\_at method in DString and operators [], len, []= and &[].
* Add `-q` option, make `--run-once` implicitly `-q`.
* Add `-v`, `-vv` and `-vvv` options for increasing verbosity, replacing debug-log and debug-stats options.

### Fixes

* Fix bug where `a > 0 ? f() : g()` could cause a compiler crash if both returned `void!`.
* `@builtin` was not respected for generic modules #1617.
* Fix issue writing a single byte in the WriteBuffer
* A distinct inline pointer type can now participate in pointer arithmetics.
* Support &a[0] returning the distinct type when applying it to a distinct of a pointer.
* Fix error when calling `HashMap.remove` on uninitialized `HashMap`.
* Fix issue with resolved try-unwrap in defer.
* Fix issue with overloaded subscript and ++/-- and assign ops (e.g. `*=`)
* Fix issue with properties in different targets not being respected #1633.
* Indexing an Optional slice would crash in codegen #1636.
* SimpleHeapAllocator bug when splitting blocks allowed memory overrun.
* Not possible to alias or take reference for extension methods on non-user defined types. #1637
* Prevent methods from using names of properties or fields. #1638
* b64 / hex data strings can now be used with ` as well.
* Contracts on generic modules would evaluate too late, sometimes not catching the error until it already occurred elsewhere.
* Fix bug preventing optionals from being used in ranges or as indices.
* Crash compiling for arm64 when returning 16 byte and smaller structs by value not a power of 2 #1649.
* Enforce single module compilation for static libraries to make constructors run properly.
* Crash when using --no-obj without compile-only. #1653
* Do not produce expression locations for windows.
* Issue where multiple methods were accepted for the same type.
* Issue where a method was linked to a type alias instead of the underlying type.
* Fix Fnv1a encoding.
* Fix issue with accessing arrays in access-overloaded types, e.g. `list[1][2]` #1665.
* Cast removing arbitrary array indices and converting them to pointers should always be fine #1664
* Incorrect "no-libc" definition of `cos`, making it unavailable for wasm.
* Fix issue with the adjoint and inverse calculations for `Matrix2x2`.
* It was possible to create 0 length arrays using byte literals. #1678
* Crash when a constant null typeid is checked for properties. #1679

### Stdlib changes

* Add `io::MultiReader`, `io::MultiWriter`, and `io::TeeReader` structs.
* Updated Base32 API.
* Add `file::save`.
* Add `memcpy` / `memset` / `memcmp` to nolibc.
* Add `sort::quickselect` to find the k-th smallest element in an unordered list.
* Add `sort::is_sorted` to determine if a list is sorted.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>