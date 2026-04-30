---
title: "Another monthly release: C3 0.6.6 is here"
date: 2025-01-16
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8983-another_monthly_release__c3_0.6.6_is_here](https://c3.handmade.network/blog/p/8983-another_monthly_release__c3_0.6.6_is_here)*

The 0.6.6 release is surprisingly on time despite (or
perhaps thanks to?) the Christmas holidays. It's a new year, and this summer C3 will turn 6. By April, version 0.7.0 will be released, removing deprecated code. The plan is to have one "dot one" release each year until 1.0 is reached (and if everything goes according to plan, the version after 0.9 will be 1.0).

But let's dive into what's new in this release!

### Enum from\_ordinal / ordinal changes

A longstanding pain point with enums has been modeling C enums with
"gaps," as in this example:

```
typedef enum
{
    ABC = 42,
    GHJ = 101
} MyEnum;
```

A workaround in C3 using associated values like this doesn't feel ideal:

```
enum MyEnum : (int val)
{
    ABC = 42,
    GHJ = 101
}
```

This is because you can get the *ordinal* of the enum with a cast, e.g., (int)MyEnum.ABC, whereas retrieving the an associated value requires access, like `MyEnum.ABC.val`.

There are some ideas to bridge this gap, but the fact that the enums would cast
to their ordinal by default made it hard to create a reasonable feature for it.

To address this, casts are now deprecated and replaced by MyEnum.from\_ordinal(value). This type method is essentially a no-op, as is converting an enum to a number with `.ordinal` (e.g. `MyEnum.ABC.ordinal`).

This puts something like `MyEnum.ABC.val` and `MyEnum.ABC.ordinal` on, more
equal footing which will make it easier to implement possible solutions to
the gap enum problem.

### No more `&` macro arguments

Macros differ from functions by allowing 5 (!) additional types of arguments:

1. Compile-time constant arguments ($foo)
2. Compile-time type arguments ($Type)
3. Unevaluated expression arguments (#expr)
4. And, finally, reference arguments (&ref)

With 0.6.6 `&ref` arguments become deprecated. With `#expr` arguments
actually already being able to do what `&ref` does, this is not a loss in
functionality. It does put somewhat more effort in using an `#expr` argument
in terms of checking, but with the fairly marginal use of `&ref` in the
standard library it didn't seem like a loss.

The main advantage for dropping `&ref` is that it no longer needs to be
explained or motivated. It also simplifies the compiler in places where it
ended up adding surprising complexities – but those simplifications can't
be done until 0.7 when `&ref` is removed (rather than deprecated).

More important than the change is that the removal of `&` (which has been around for as long as the macros),
marks the beginning of *consolidating* the language: removing things that
have proven over time to be superfluous.

### `void` rather than `void!` as default for `main`, tests and benchmarks

Another consolidation is the removal of `void!` as a return type for main.

Previously, it was possible to return an optional Empty value from main and have the compiler turn it into a `1` exit code.

This was problematic because it effectively discarded the Optional’s excuse.
It also encouraged bad code which would just rethrow Optionals from functions called by `main`

`void!` was removed from `@test` functions for a similar reason. Actually
panicking (with `!!` rather than `!`) would yield much better error messages
for free. So again the choice between `void` and `void!` for test functions
were not really helpful.

Starting from version 0.6.6, use `void` or `int` as the return type for `main` functions, and `void` for `@test` and `@benchmark` functions.

### `$foreach` iterating over Strings

An oversight previously made it impossible to iterate over `String`s and bytes. With 0.6.6, this now works correctly.

### `var` declaring lambdas

Using `var` has been limited to macros in C3, but now they're also
allowed in functions when declaring lambdas.

### @operator(construct)

An experimental feature called `construct` is available from 0.6.6.

This allows a limited form of static methods on types. For example:

```
fn Foo Foo.new_with_bar(Bar b) @operator(construct)
{
    return { .b = b }; // Same as Foo { .b = b }
}
```

The limitation is that such a method must either return the type or a
pointer to the type with the method. (So in the above example, either
returning `Foo` or `Foo*` would be possible).

Consider this an experimental preview for now!

Standard Library Improvements
The standard library has seen useful additions, including foreach-compatible iterators for `HashMap` and an URL parser.

The default hash functions have been improved, enhancing `HashMap` performance. There have also been other minor additions and changes.

### Bug fixes

This version contains over 50 bug fixes, which is about twice from 0.6.5,
but less than the record setting 0.6.2.

### Refactoring

0.6.6 includes initial steps toward refactoring parts of the frontend representation to facilitate the addition of new backends.
A C backend is planned for this year, making these improvements essential.

### What's next?

The enums might finally get the "gap enum" usecase filled (pun intended),
but it's not clear whether this will happen in 0.6.7 or will be pushed to later.

There is also a glaring hole in compile time evaluation where `$i[1] = 2;` isn't
allowed, but `$a = $i[1];` is. This will need to change, but to do so there
needs to be some refactoring, which ties into the overall changes in the
frontend representation to help the backend lowering, but also static analysis.

Users, despite work under the hood, should see very little of these changes,
except maybe that some corner cases (like compile time subscript above) starts
working.

There are some syntax tweaks coming up, but they should be very minor
and probably not even be visible to most users.

More importantly though, is that C3 will see the beginning of work to
prune unused features from the language, which will then eventually be
removed with 0.7.0.

## 0.6.6 Change list

Here is the full change list

### Changes / improvements

* Split help into normal and "full" help, #1703
* Removed 'headers' command line option.
* Add `enum.from_ordinal` and `fault.from_ordinal`
* Deprecate cast-style conversion from integer <-> enum.
* Make deprecation an error in test mode.
* Add `--win-vs-dirs` to override VS detection dirs.
* Add `"name"` project property to override the name of the resulting binary. #1719
* Improved `add-project` to take arguments.
* Improve error reporting when using type names as the function argument #1750.
* Improve ordering of method registration to support adding methods to generic modules with method constraints #1746
* Support experimental `@operator(construct)` operator overload.
* Allow using 'var' to declare lambdas in functions.
* Add 'validation' setting and make dead code a warning.
* Allow compile time `$foreach` iteration over constant Strings and bytes.
* Improved error message when accessing `@private` from other modules #1769.
* Include `@name` when searching for possible matches to `name` in the error message. #1779
* Improve `@param` parse errors #1777
* Improved `#foo` resolution inside of the compiler.
* Deprecated '&' macro arguments.
* Deprecate `fn void! main() type main functions.
* Deprecate old `void!` @benchmark and @test functions.
* Allow test runners to take String[] arguments.
* Added `--lsp` output.
* Improve the error message when running out of memory.
* Allowed passing arguments to @test / @benchmark runners via `c3c test[benchmark] -- -o --opt1 <arg1>`
* Handle bytes and string literals the same way in terms of zero termination.
* Function comments are stored and displayed with -P.
* Prevent `#hash` arguments from taking code that modifies ct variables. #1794
* Make stringify to recursively enter `#hash` expressions #1834.

### Fixes

* Fix case trying to initialize a `char[*]*` from a String.
* Fix Map & HashMap `put_all_for_create` not copying all elements, causing `init_from_map` to create incomplete copy.
* Fix bug when a macro calling an extern function was called in another module also declaring and calling the same function. #1690
* `static-lib` and `dynamic-lib` options from the command line now produces headers.
* Fix bug outputting exported functions without predefined extname.
* Fix problem where crt1 was linked for dynamic libraries on Linux and BSD. #1710
* Fix CRT detection on Arch Linux.
* Fix lexer allowing a trailing underscore (\_) with hex and binary literals.
* Fix `--list-operators` CLI command printing underscore (\_) and hash (#).
* Fix bug in temp allocator when temp memory is exhausted and allocation needs overaligned mem. #1715
* Incorrectly handles distinct enums and pointers with '+=' and '-=' #1717.
* Prevent DString from being initialized with "".
* Fix bug in OnStackAllocator when freeing overallocated data. #1720
* Use `weak_odr` rather than `weak` on Windows which seems to prevent issues such as #1704.
* Use `weak` on dyn-symbols on Linux.
* Fix crash on project.json not having an empty set of targets.
* Miscompile when indexing an array with small unsigned types for enums.
* Change CBool to be 1 byte.
* `any_to_int` checks value to be int and no longer works with enum.
* Add check in formatter printing "%c".
* Fix bug where `!!` and `!` was not recognized to jump out of the current scope.
* Fix bug when including compile time parameters in trailing body more than once.
* Fix issue with compiling a constant struct containing a string array in a local context.
* Fix error where panic would not properly stop the program when stacktrace couldn't be printed #1751.
* Macros with default arguments to `&`, `#` and type parameters didn't work as expected. #1754.
* `net::poll()` with negative timeout behaved incorrectly.
* Return type inference bugs with macros #1757
* `$defined` in a global scope should accept testing normal macros.
* Assert on add to uninitialized ct variable #1765.
* Dynamic function lookup fails after changing type without dummy anycast #1761
* $vasplat was allowed inside of a function when passed as an argument to a function.
* Prohibit raw vaargs in regular functions with a function body.
* Assert on certain slice to slice casts. #1768.
* Fix vector float -> bool conversion.
* Fix `+a = 1` erronously being accepted.
* Fix not freeing a zero length String
* Macros with trailing bodys aren't allowed as the single statement after a while loop with no body #1772.
* Deref subscripts as needed for macro ref method arguments. #1789
* Change ordering to simplify adding methods to type in conditional modules.
* `#foo` style arguments were not type checked when given a type. #1790
* Bug when using +++ on value build a slice or array: the rhs cast was not done.
* Fix bug preventing compile time slices from being iterated over with `$foreach`.
* Fix bug with defer assignment in macro #1807.
* Fix regression with swizzle references for vectors #1810.
* Assert when partially initializing a constant struct containing a slice #1812.
* Assert concatenating constant slices #1805.
* Do not link "ld" on Linux with no libc.
* Fix bug when multiple `$else` clauses followed an `$if` #1824.
* Report the correct type as not having a method when access fails #1828.
* Prevent temp arena scribbling from causing an asan warning. #1825
* Fix bug where `&i[0] = null` was not detected to be an error #1833.

### Stdlib changes

* Increase BitWriter.write\_bits limit up to 32 bits.
* Updates to `Slice2d`, like `get_xy` and others.
* Added `iter()` `value_iter()` and `key_iter()` to HashMap.
* Add "tokenizer" to String.
* Add "skip\_empty" to split methods. Add split\_to\_buffer method.
* Add `@enum_from_value`.
* Updated hash function.
* Added URL parser.
* Added convenience functions to `Maybe`.
* Added `String.trim_left()` and `.trim_right()`.
* Deprecation of several `&` macros.
* Format functions for timedates.
* Add `@assert_leak()` to assert on memory leaks in the scope.
* Added `double.set_high_word()`, `double.set_low_word()`, and `float.set_word()`.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

The 0.6.6 release is surprisingly on time despite (or
perhaps thanks to?) the Christmas holidays. It's a new year, and this summer C3 will turn 6. By April, version 0.7.0 will be released, removing deprecated code. The plan is to have one "dot one" release each year until 1.0 is reached (and if everything goes according to plan, the version after 0.9 will be 1.0).

But let's dive into what's new in this release!

### Enum from\_ordinal / ordinal changes

A longstanding pain point with enums has been modeling C enums with
"gaps," as in this example:

```
typedef enum
{
    ABC = 42,
    GHJ = 101
} MyEnum;
```

A workaround in C3 using associated values like this doesn't feel ideal:

```
enum MyEnum : (int val)
{
    ABC = 42,
    GHJ = 101
}
```

This is because you can get the *ordinal* of the enum with a cast, e.g., (int)MyEnum.ABC, whereas retrieving the an associated value requires access, like `MyEnum.ABC.val`.

There are some ideas to bridge this gap, but the fact that the enums would cast
to their ordinal by default made it hard to create a reasonable feature for it.

To address this, casts are now deprecated and replaced by MyEnum.from\_ordinal(value). This type method is essentially a no-op, as is converting an enum to a number with `.ordinal` (e.g. `MyEnum.ABC.ordinal`).

This puts something like `MyEnum.ABC.val` and `MyEnum.ABC.ordinal` on, more
equal footing which will make it easier to implement possible solutions to
the gap enum problem.

### No more `&` macro arguments

Macros differ from functions by allowing 5 (!) additional types of arguments:

1. Compile-time constant arguments ($foo)
2. Compile-time type arguments ($Type)
3. Unevaluated expression arguments (#expr)
4. And, finally, reference arguments (&ref)

With 0.6.6 `&ref` arguments become deprecated. With `#expr` arguments
actually already being able to do what `&ref` does, this is not a loss in
functionality. It does put somewhat more effort in using an `#expr` argument
in terms of checking, but with the fairly marginal use of `&ref` in the
standard library it didn't seem like a loss.

The main advantage for dropping `&ref` is that it no longer needs to be
explained or motivated. It also simplifies the compiler in places where it
ended up adding surprising complexities – but those simplifications can't
be done until 0.7 when `&ref` is removed (rather than deprecated).

More important than the change is that the removal of `&` (which has been around for as long as the macros),
marks the beginning of *consolidating* the language: removing things that
have proven over time to be superfluous.

### `void` rather than `void!` as default for `main`, tests and benchmarks

Another consolidation is the removal of `void!` as a return type for main.

Previously, it was possible to return an optional Empty value from main and have the compiler turn it into a `1` exit code.

This was problematic because it effectively discarded the Optional’s excuse.
It also encouraged bad code which would just rethrow Optionals from functions called by `main`

`void!` was removed from `@test` functions for a similar reason. Actually
panicking (with `!!` rather than `!`) would yield much better error messages
for free. So again the choice between `void` and `void!` for test functions
were not really helpful.

Starting from version 0.6.6, use `void` or `int` as the return type for `main` functions, and `void` for `@test` and `@benchmark` functions.

### `$foreach` iterating over Strings

An oversight previously made it impossible to iterate over `String`s and bytes. With 0.6.6, this now works correctly.

### `var` declaring lambdas

Using `var` has been limited to macros in C3, but now they're also
allowed in functions when declaring lambdas.

### @operator(construct)

An experimental feature called `construct` is available from 0.6.6.

This allows a limited form of static methods on types. For example:

```
fn Foo Foo.new_with_bar(Bar b) @operator(construct)
{
    return { .b = b }; // Same as Foo { .b = b }
}
```

The limitation is that such a method must either return the type or a
pointer to the type with the method. (So in the above example, either
returning `Foo` or `Foo*` would be possible).

Consider this an experimental preview for now!

Standard Library Improvements
The standard library has seen useful additions, including foreach-compatible iterators for `HashMap` and an URL parser.

The default hash functions have been improved, enhancing `HashMap` performance. There have also been other minor additions and changes.

### Bug fixes

This version contains over 50 bug fixes, which is about twice from 0.6.5,
but less than the record setting 0.6.2.

### Refactoring

0.6.6 includes initial steps toward refactoring parts of the frontend representation to facilitate the addition of new backends.
A C backend is planned for this year, making these improvements essential.

### What's next?

The enums might finally get the "gap enum" usecase filled (pun intended),
but it's not clear whether this will happen in 0.6.7 or will be pushed to later.

There is also a glaring hole in compile time evaluation where `$i[1] = 2;` isn't
allowed, but `$a = $i[1];` is. This will need to change, but to do so there
needs to be some refactoring, which ties into the overall changes in the
frontend representation to help the backend lowering, but also static analysis.

Users, despite work under the hood, should see very little of these changes,
except maybe that some corner cases (like compile time subscript above) starts
working.

There are some syntax tweaks coming up, but they should be very minor
and probably not even be visible to most users.

More importantly though, is that C3 will see the beginning of work to
prune unused features from the language, which will then eventually be
removed with 0.7.0.

## 0.6.6 Change list

Here is the full change list

### Changes / improvements

* Split help into normal and "full" help, #1703
* Removed 'headers' command line option.
* Add `enum.from_ordinal` and `fault.from_ordinal`
* Deprecate cast-style conversion from integer <-> enum.
* Make deprecation an error in test mode.
* Add `--win-vs-dirs` to override VS detection dirs.
* Add `"name"` project property to override the name of the resulting binary. #1719
* Improved `add-project` to take arguments.
* Improve error reporting when using type names as the function argument #1750.
* Improve ordering of method registration to support adding methods to generic modules with method constraints #1746
* Support experimental `@operator(construct)` operator overload.
* Allow using 'var' to declare lambdas in functions.
* Add 'validation' setting and make dead code a warning.
* Allow compile time `$foreach` iteration over constant Strings and bytes.
* Improved error message when accessing `@private` from other modules #1769.
* Include `@name` when searching for possible matches to `name` in the error message. #1779
* Improve `@param` parse errors #1777
* Improved `#foo` resolution inside of the compiler.
* Deprecated '&' macro arguments.
* Deprecate `fn void! main() type main functions.
* Deprecate old `void!` @benchmark and @test functions.
* Allow test runners to take String[] arguments.
* Added `--lsp` output.
* Improve the error message when running out of memory.
* Allowed passing arguments to @test / @benchmark runners via `c3c test[benchmark] -- -o --opt1 <arg1>`
* Handle bytes and string literals the same way in terms of zero termination.
* Function comments are stored and displayed with -P.
* Prevent `#hash` arguments from taking code that modifies ct variables. #1794
* Make stringify to recursively enter `#hash` expressions #1834.

### Fixes

* Fix case trying to initialize a `char[*]*` from a String.
* Fix Map & HashMap `put_all_for_create` not copying all elements, causing `init_from_map` to create incomplete copy.
* Fix bug when a macro calling an extern function was called in another module also declaring and calling the same function. #1690
* `static-lib` and `dynamic-lib` options from the command line now produces headers.
* Fix bug outputting exported functions without predefined extname.
* Fix problem where crt1 was linked for dynamic libraries on Linux and BSD. #1710
* Fix CRT detection on Arch Linux.
* Fix lexer allowing a trailing underscore (\_) with hex and binary literals.
* Fix `--list-operators` CLI command printing underscore (\_) and hash (#).
* Fix bug in temp allocator when temp memory is exhausted and allocation needs overaligned mem. #1715
* Incorrectly handles distinct enums and pointers with '+=' and '-=' #1717.
* Prevent DString from being initialized with "".
* Fix bug in OnStackAllocator when freeing overallocated data. #1720
* Use `weak_odr` rather than `weak` on Windows which seems to prevent issues such as #1704.
* Use `weak` on dyn-symbols on Linux.
* Fix crash on project.json not having an empty set of targets.
* Miscompile when indexing an array with small unsigned types for enums.
* Change CBool to be 1 byte.
* `any_to_int` checks value to be int and no longer works with enum.
* Add check in formatter printing "%c".
* Fix bug where `!!` and `!` was not recognized to jump out of the current scope.
* Fix bug when including compile time parameters in trailing body more than once.
* Fix issue with compiling a constant struct containing a string array in a local context.
* Fix error where panic would not properly stop the program when stacktrace couldn't be printed #1751.
* Macros with default arguments to `&`, `#` and type parameters didn't work as expected. #1754.
* `net::poll()` with negative timeout behaved incorrectly.
* Return type inference bugs with macros #1757
* `$defined` in a global scope should accept testing normal macros.
* Assert on add to uninitialized ct variable #1765.
* Dynamic function lookup fails after changing type without dummy anycast #1761
* $vasplat was allowed inside of a function when passed as an argument to a function.
* Prohibit raw vaargs in regular functions with a function body.
* Assert on certain slice to slice casts. #1768.
* Fix vector float -> bool conversion.
* Fix `+a = 1` erronously being accepted.
* Fix not freeing a zero length String
* Macros with trailing bodys aren't allowed as the single statement after a while loop with no body #1772.
* Deref subscripts as needed for macro ref method arguments. #1789
* Change ordering to simplify adding methods to type in conditional modules.
* `#foo` style arguments were not type checked when given a type. #1790
* Bug when using +++ on value build a slice or array: the rhs cast was not done.
* Fix bug preventing compile time slices from being iterated over with `$foreach`.
* Fix bug with defer assignment in macro #1807.
* Fix regression with swizzle references for vectors #1810.
* Assert when partially initializing a constant struct containing a slice #1812.
* Assert concatenating constant slices #1805.
* Do not link "ld" on Linux with no libc.
* Fix bug when multiple `$else` clauses followed an `$if` #1824.
* Report the correct type as not having a method when access fails #1828.
* Prevent temp arena scribbling from causing an asan warning. #1825
* Fix bug where `&i[0] = null` was not detected to be an error #1833.

### Stdlib changes

* Increase BitWriter.write\_bits limit up to 32 bits.
* Updates to `Slice2d`, like `get_xy` and others.
* Added `iter()` `value_iter()` and `key_iter()` to HashMap.
* Add "tokenizer" to String.
* Add "skip\_empty" to split methods. Add split\_to\_buffer method.
* Add `@enum_from_value`.
* Updated hash function.
* Added URL parser.
* Added convenience functions to `Maybe`.
* Added `String.trim_left()` and `.trim_right()`.
* Deprecation of several `&` macros.
* Format functions for timedates.
* Add `@assert_leak()` to assert on memory leaks in the scope.
* Added `double.set_high_word()`, `double.set_low_word()`, and `float.set_word()`.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>