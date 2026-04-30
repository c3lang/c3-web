---
title: "It's February and time for a new C3 release: 0.6.7"
date: 2025-02-16
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8994-it%2527s_february_and_time_for_a_new_c3_release__0.6.7](https://c3.handmade.network/blog/p/8994-it%2527s_february_and_time_for_a_new_c3_release__0.6.7)*

0.6.7 has been interesting. There has been some significant additions to the language that opens for new solutions. Also because it's now finally possible to manipulate compile time arrays in a simple way, there are some simple but useful compile time tricks that now is available. For example, string manipulation at compile time.

So let's have look at the biggest changes.

### Compile time improvements

As previously mentioned, compile time arrays can now be mutated. This allows things like `$arr[$i] = 123`. And at this point, the only thing still not possible to mutate at compile time are struct fields.

In addition to this the concatenation operator, `+++`, now works on all types of arrays, even ones defined with gaps.

### "Inline" enums

It's now possible to set enums to have its ordinal or an associated value marked "inline".

The feature allows an enum value to implicitly convert to that value:

```
enum Foo : int (inline String name, int y, int z)
{
  ABC = { "Hello", 1, 2 },
  DEF = { "World", 2, 3 },
}

fn void main()
{
  String hello = Foo.ABC;
  io::printn(hello); // Prints "Hello"
}
```

### Short function syntax combined with macros

The short function syntax handles macros with trailing bodies in a special way, allowing
the macro's trailing body to work as the body of the function, which simplifies the code when
a function starts with a macro with a body:

```
// 0.6.6
fn Path! new_cwd(Allocator allocator = allocator::heap())
{
  @pool(allocator)
  {
    return new(os::getcwd(allocator::temp()), allocator);
  };
}

// 0.6.7
fn Path! new_cwd(Allocator allocator = allocator::heap()) => @pool()
{
  return new(os::getcwd(allocator::temp()), allocator);
}
```

### C style compound literals

C style compound literals is making a comeback, it's now possible to do `(int[2]) { 1, 2 }`
as an alternative to `int[2] { 1, 2 }`.

This is in preparation for *possibly* changing the syntax for generic modules. Regardless,
this style is probably here to stay.

## Improvements to runtime and unit test error checking

Unaligned loads will now be detected in safe mode, and the test runner has been improved to
check for memory leaks, and the test runner has been greatly updated.

A new module `test` in the standard library adds various test utilities for unit testing.

### Type inference on `??`

Previously the expression `MyEnum f = foo() ?? MyEnum.ABC;` would require the full enum name
as in this example but this has been improved so that in 0.6.7 `MyEnum f = foo() ? ABC;` is
sufficient. This also affects all other types of inference on the right hand side of `??`

### Better bytes printing in the stdlib

0.6.7 adds `%h` and `%H` for printing binary data in hexadecimal.

### Other stdlib improvements

1. Channels for use with threaded code were added.
2. `@select` to perform constant `a ? x : y` at compile time yielding a constant result.
3. `HashMap` is now implementing `Printable`
4. `allocator::wrap` allows quickly creating an arena allocator from a collection of bytes.
5. Nolibc math code was expanded with some additional functions.

### Bug fixes

0.6.7, like 0.6.6, contains about 50 bug fixes of various severity.

# What's next?

There is an ongoing discussion in regards to generic syntax. `(< >)` works, but it not particularly
lightweight. Some other alternatives, such as `< >` `( )` and `[ ]` suffer from ambiguities, so
other options are investigated, such as `$()` and `{}`

Also in a quest to simplify the language, it's an open question whether `{| |}` should be removed or not.
The expression blocks have their uses, but significantly less in C3 with semantic macros than
it would have in C.

Other than that, expansion of the standard library is a priority.

With 0.7.0 scheduled for April, there is pretty much only room for one more 0.6.x release: 0.6.8.

I'm looking forward to cleaning out deprecated code when 0.7.0 finally comes around.

Here is the full change list:

### Changes / improvements

* Contracts @require/@ensure are no longer treated as conditionals, but must be explicitly bool.
* Add `win-debug` setting to be able to pick dwarf for output #1855.
* Error on switch case fallthough if there is more than one newline #1849.
* Added flags to `c3c project view` to filter displayed properties
* Compile time array assignment #1806.
* Allow `+++` to work on all types of arrays.
* Allow `(int[*]) { 1, 2 }` cast style initialization.
* Experimental change from `[*]` to `[?]`
* Warn on if-catch with just a `default` case.
* Compile time array inc/dec.
* Improve error message when using ',' in struct declarations. #1920
* Compile time array assign ops, e.g. `$c[1] += 3` #1890.
* Add `inline` to enums #1819.
* Cleaner error message when missing comma in struct initializer #1941.
* Distinct inline void causes unexpected error if used in slice #1946.
* Allow `fn int test() => @pool() { return 1; }` short function syntax usage #1906.
* Test runner will also check for leaks.
* Improve inference on `??` #1943.
* Detect unaligned loads #1951.

### Fixes

* Fix issue requiring prefix on a generic interface declaration.
* Fix bug in SHA1 for longer blocks #1854.
* Fix lack of location for reporting lambdas with missing return statement #1857.
* Compiler allows a generic module to be declared with different parameters #1856.
* Fix issue with `@const` where the statement `$foo = 1;` was not considered constant.
* Const strings and bytes were not properly converted to compile time bools.
* Concatenating a const empty slice with another array caused a null pointer access.
* Fix `linux-crt` and `linux-crtbegin` not getting recognized as a project paramater
* Fix dues to crash when converting a const vector to another vector #1864.
* Filter `$exec` output from `\r`, which otherwise would cause a compiler assert #1867.
* Fixes to `"exec" use, including issue when compiling with MinGW.
* Correctly check jump table size and be generous when compiling it #1877.
* Fix bug where .min/.max would fail on a distinct int #1888.
* Fix issue where compile time declarations in expression list would not be handled properly.
* Issue where trailing body argument was allowed without type even though the definition specified it #1879.
* Fix issues with @jump on empty `default` or only `default` #1893 #1894
* Fixes miscompilation of nested `@jump` #1896.
* Fixed STB\_WEAK errors when using consts in macros in the stdlib #1871.
* Missing error when placing a single statement for-body on a new row #1892.
* Fix bug where in dead code, only the first statement would be turned into a nop.
* Remove unused $inline argument to mem::copy.
* Defer is broken when placed before a $foreach #1912.
* Usage of @noreturn macro is type-checked as if it returns #1913.
* Bug when indexing into a constant array at compile time.
* Fixing various issues around shifts, like `z <<= { 1, 2 }`.
* `return (any)&foo` would not be reported as an escaping variable if `foo` was a pointer or slice.
* Incorrect error message when providing too many associated values for enum #1934.
* Allow function types to have a calling convention. #1938
* Issue with defer copying when triggered by break or continue #1936.
* Assert when using optional as init or inc part in a for loop #1942.
* Fix bigint hex parsing #1945.
* `bigint::from_int(0)` throws assertion #1944.
* `write` of qoi would leak memory.
* Issue when having an empty `Path` or just "."
* `set_env` would leak memory.
* Fix issue where aligned bitstructs did not store/load with the given alignment.
* Fix issue in GrowableBitSet with sanitizers.
* Fix issue in List with sanitizers.
* Circumvent Aarch64 miscompilations of atomics.
* Fixes to ByteBuffer allocation/free.
* Fix issue where compiling both for asm and object file would corrupt the obj file output.
* Fix `poll` and `POLL_FOREVER`.
* Missing end padding when including a packed struct #1966.
* Issue when scalar expanding a boolean from a conditional to a bool vector #1954.
* Fix issue when parsing bitstructs, preventing them from implementing interfaces.
* Regression `String! a; char* b = a.ptr;` would incorrectly be allowed.
* Fix issue where target was ignored for projects.
* Fix issue when dereferencing a constant string.
* Fix problem where a line break in a literal was allowed.

### Stdlib changes

* Added '%h' and '%H' for printing out binary data in hexadecimal using the formatter.
* Added weakly linked `__powidf2`
* Added channels for threads.
* New `std::core::test` module for unit testing machinery.
* New unit test default runner.
* Added weakly linked `fmodf`.
* Add `@select` to perform the equivalent of `a ? x : y` at compile time.
* `HashMap` is now `Printable`.
* Add `allocator::wrap` to create an arena allocator on the stack from bytes.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

0.6.7 has been interesting. There has been some significant additions to the language that opens for new solutions. Also because it's now finally possible to manipulate compile time arrays in a simple way, there are some simple but useful compile time tricks that now is available. For example, string manipulation at compile time.

So let's have look at the biggest changes.

### Compile time improvements

As previously mentioned, compile time arrays can now be mutated. This allows things like `$arr[$i] = 123`. And at this point, the only thing still not possible to mutate at compile time are struct fields.

In addition to this the concatenation operator, `+++`, now works on all types of arrays, even ones defined with gaps.

### "Inline" enums

It's now possible to set enums to have its ordinal or an associated value marked "inline".

The feature allows an enum value to implicitly convert to that value:

```
enum Foo : int (inline String name, int y, int z)
{
  ABC = { "Hello", 1, 2 },
  DEF = { "World", 2, 3 },
}

fn void main()
{
  String hello = Foo.ABC;
  io::printn(hello); // Prints "Hello"
}
```

### Short function syntax combined with macros

The short function syntax handles macros with trailing bodies in a special way, allowing
the macro's trailing body to work as the body of the function, which simplifies the code when
a function starts with a macro with a body:

```
// 0.6.6
fn Path! new_cwd(Allocator allocator = allocator::heap())
{
  @pool(allocator)
  {
    return new(os::getcwd(allocator::temp()), allocator);
  };
}

// 0.6.7
fn Path! new_cwd(Allocator allocator = allocator::heap()) => @pool()
{
  return new(os::getcwd(allocator::temp()), allocator);
}
```

### C style compound literals

C style compound literals is making a comeback, it's now possible to do `(int[2]) { 1, 2 }`
as an alternative to `int[2] { 1, 2 }`.

This is in preparation for *possibly* changing the syntax for generic modules. Regardless,
this style is probably here to stay.

## Improvements to runtime and unit test error checking

Unaligned loads will now be detected in safe mode, and the test runner has been improved to
check for memory leaks, and the test runner has been greatly updated.

A new module `test` in the standard library adds various test utilities for unit testing.

### Type inference on `??`

Previously the expression `MyEnum f = foo() ?? MyEnum.ABC;` would require the full enum name
as in this example but this has been improved so that in 0.6.7 `MyEnum f = foo() ? ABC;` is
sufficient. This also affects all other types of inference on the right hand side of `??`

### Better bytes printing in the stdlib

0.6.7 adds `%h` and `%H` for printing binary data in hexadecimal.

### Other stdlib improvements

1. Channels for use with threaded code were added.
2. `@select` to perform constant `a ? x : y` at compile time yielding a constant result.
3. `HashMap` is now implementing `Printable`
4. `allocator::wrap` allows quickly creating an arena allocator from a collection of bytes.
5. Nolibc math code was expanded with some additional functions.

### Bug fixes

0.6.7, like 0.6.6, contains about 50 bug fixes of various severity.

# What's next?

There is an ongoing discussion in regards to generic syntax. `(< >)` works, but it not particularly
lightweight. Some other alternatives, such as `< >` `( )` and `[ ]` suffer from ambiguities, so
other options are investigated, such as `$()` and `{}`

Also in a quest to simplify the language, it's an open question whether `{| |}` should be removed or not.
The expression blocks have their uses, but significantly less in C3 with semantic macros than
it would have in C.

Other than that, expansion of the standard library is a priority.

With 0.7.0 scheduled for April, there is pretty much only room for one more 0.6.x release: 0.6.8.

I'm looking forward to cleaning out deprecated code when 0.7.0 finally comes around.

Here is the full change list:

### Changes / improvements

* Contracts @require/@ensure are no longer treated as conditionals, but must be explicitly bool.
* Add `win-debug` setting to be able to pick dwarf for output #1855.
* Error on switch case fallthough if there is more than one newline #1849.
* Added flags to `c3c project view` to filter displayed properties
* Compile time array assignment #1806.
* Allow `+++` to work on all types of arrays.
* Allow `(int[*]) { 1, 2 }` cast style initialization.
* Experimental change from `[*]` to `[?]`
* Warn on if-catch with just a `default` case.
* Compile time array inc/dec.
* Improve error message when using ',' in struct declarations. #1920
* Compile time array assign ops, e.g. `$c[1] += 3` #1890.
* Add `inline` to enums #1819.
* Cleaner error message when missing comma in struct initializer #1941.
* Distinct inline void causes unexpected error if used in slice #1946.
* Allow `fn int test() => @pool() { return 1; }` short function syntax usage #1906.
* Test runner will also check for leaks.
* Improve inference on `??` #1943.
* Detect unaligned loads #1951.

### Fixes

* Fix issue requiring prefix on a generic interface declaration.
* Fix bug in SHA1 for longer blocks #1854.
* Fix lack of location for reporting lambdas with missing return statement #1857.
* Compiler allows a generic module to be declared with different parameters #1856.
* Fix issue with `@const` where the statement `$foo = 1;` was not considered constant.
* Const strings and bytes were not properly converted to compile time bools.
* Concatenating a const empty slice with another array caused a null pointer access.
* Fix `linux-crt` and `linux-crtbegin` not getting recognized as a project paramater
* Fix dues to crash when converting a const vector to another vector #1864.
* Filter `$exec` output from `\r`, which otherwise would cause a compiler assert #1867.
* Fixes to `"exec" use, including issue when compiling with MinGW.
* Correctly check jump table size and be generous when compiling it #1877.
* Fix bug where .min/.max would fail on a distinct int #1888.
* Fix issue where compile time declarations in expression list would not be handled properly.
* Issue where trailing body argument was allowed without type even though the definition specified it #1879.
* Fix issues with @jump on empty `default` or only `default` #1893 #1894
* Fixes miscompilation of nested `@jump` #1896.
* Fixed STB\_WEAK errors when using consts in macros in the stdlib #1871.
* Missing error when placing a single statement for-body on a new row #1892.
* Fix bug where in dead code, only the first statement would be turned into a nop.
* Remove unused $inline argument to mem::copy.
* Defer is broken when placed before a $foreach #1912.
* Usage of @noreturn macro is type-checked as if it returns #1913.
* Bug when indexing into a constant array at compile time.
* Fixing various issues around shifts, like `z <<= { 1, 2 }`.
* `return (any)&foo` would not be reported as an escaping variable if `foo` was a pointer or slice.
* Incorrect error message when providing too many associated values for enum #1934.
* Allow function types to have a calling convention. #1938
* Issue with defer copying when triggered by break or continue #1936.
* Assert when using optional as init or inc part in a for loop #1942.
* Fix bigint hex parsing #1945.
* `bigint::from_int(0)` throws assertion #1944.
* `write` of qoi would leak memory.
* Issue when having an empty `Path` or just "."
* `set_env` would leak memory.
* Fix issue where aligned bitstructs did not store/load with the given alignment.
* Fix issue in GrowableBitSet with sanitizers.
* Fix issue in List with sanitizers.
* Circumvent Aarch64 miscompilations of atomics.
* Fixes to ByteBuffer allocation/free.
* Fix issue where compiling both for asm and object file would corrupt the obj file output.
* Fix `poll` and `POLL_FOREVER`.
* Missing end padding when including a packed struct #1966.
* Issue when scalar expanding a boolean from a conditional to a bool vector #1954.
* Fix issue when parsing bitstructs, preventing them from implementing interfaces.
* Regression `String! a; char* b = a.ptr;` would incorrectly be allowed.
* Fix issue where target was ignored for projects.
* Fix issue when dereferencing a constant string.
* Fix problem where a line break in a literal was allowed.

### Stdlib changes

* Added '%h' and '%H' for printing out binary data in hexadecimal using the formatter.
* Added weakly linked `__powidf2`
* Added channels for threads.
* New `std::core::test` module for unit testing machinery.
* New unit test default runner.
* Added weakly linked `fmodf`.
* Add `@select` to perform the equivalent of `a ? x : y` at compile time.
* `HashMap` is now `Printable`.
* Add `allocator::wrap` to create an arena allocator on the stack from bytes.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>