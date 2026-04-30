---
title: "New contract syntax with 0.6.4"
date: 2024-11-09
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8965-new_contract_syntax_with_0.6.4](https://c3.handmade.network/blog/p/8965-new_contract_syntax_with_0.6.4)*

Finally 0.6.4 is out. This version has some very important improvements
working with constant slices. It is also more permissive when it comes to working with generic types.

But perhaps the change which is the most obvious is the introduction of a new contract syntax using `<* *>`, away from the
Javadoc-like `/** */` which was hard to differentiate from comments.

### Constant slices

Constant slices has gotten a lot of low in 0.6.4. Constant vectors
can now convert into constant slices, and slicing arrays, bytes and
constant slices are now compile time operations.

This also adds constant bytes to/from `char[]` conversions.

### New contract syntax

The use of `/** */` for declaring a doc/contract block has been
around for a long time in C3.

Unfortunately it has a glaring problem: if you accidentally
forget a `*` and write `/* */` your docs are considered comments
and are silently ignored. This is obviously very bad.

Another problem would be code where the user accidentally typed `/** */`
for comments inside a function or similar. This was very hard to
give some proper errors for without complicating parsing.

By picking a different syntax - `<* *>`, these problems go away.
They also address some of the criticisms against using doc-comments
for contracts.

### Interface/any changes

Previously it was possible to assign a `void*` to an interface or `any`.
This led to the weird situation of the type inside being `void`,
which is a nonsense value and required special handling for it
to work properly in almost all code. This is no longer allowed.

As an improvement interfaces now support `.ptr` and `.type`
directly without casting to an `any`.

### Ternary

Inference now works across ternary, so for example:
`ZString a = b > 0 ? "x" : "y";` would do the right thing.

0.6.4 also fixes a crash when returning a struct or vector from a
ternary expression.

### Weakly linking the standard library

The standard library is now weakly linked, which allows
multiple copies of the same standard library to work when linked
together. Otherwise things like using a static library written
in C3 would have problems linking to a C3 program.

## What's next?

0.6.5 will clean up the CLI, tests and overall improvements.
While tagged unions are discussed, it's unclear whether they will
be considered for the next release.

A problem which keeps popping up is the packaged LLVM libraries.
These are frequently broken causing unnecessary work for everyone.
Currently the Windows libraries are precompiled by a separate CI.
This will probably be the way forward for all platforms, and that
work will probably go into the 0.6.5 release cycle as well.

## 0.6.4 Change list

There are many other fixes and changes, see the full changelist:

### Changes / improvements

* Const vector -> const slice implicit conversion.
* Slicing arrays, slices and bytes at compile time #1466.
* Better error for `int a[4] = ...`. #1518
* Better error for `int Foo(int a)` declarations #1516
* Improve error message in the case of `MyInterface x = foo;` #1522
* Deprecate `@adhoc`, allow non-nested ad hoc generic types.
* Constant bytes <=> char[] conversion should work #1514.
* Infer now works across ternary.
* Interfaces now support .ptr and .type directly without casting to `any`.
* Switch to `<* *>` docs.
* Improve error messages on expressions like `var $type = int;` #1553.
* Disallow casting a `void*` to `any` or an interface, unless it is `null`.
* Defer resolution of declarations when looked up in `def` aliased #1559.
* Adding constants to the Json AST #1540
* Adding info to the globals inside Json AST #1541
* Null-check function pointer invocation #1573.
* `string::new_struct_to_str` and `io::struct_to_format` to dump struct data.
* `io::print` will now print structs.
* Improve error message when using `void` aliases as variable storage type.
* Add a target type: "prepare" which doesn't compile anything (but may run `exec`)

### Fixes

* `Unsupported int[*] $x = { 1, 2, 3, 4 }` #1489.
* Unexpected compile error using a typed constant with `copysign` #1517
* Incorrect subscript resolution #1519.
* Segfault with passing a program with `-` using stdin.
* Using no module with `-` would reject the program.
* Unintended deref of pointers with methods caused regression with hash function.
* Fix broken sincos function.
* Bug when a continue is copied in a defer.
* Compiler error when any/interface initialized using {} #1533.
* Bug when defers and $if were combined in a macro, which would cause miscompilation.
* Fixes to the CSV reader.
* Crash returning struct or vector from function using ternary expression #1537.
* Improved error message on invalid subscript index type #1535.
* Improved error message when declaring a variable `void!`.
* Cannot use void as a generic parameter #1546
* Interfaces not correctly copied with generics #1545
* Memory leak in keys.new\_list fixed.
* Standard library is now correctly weakly linked, fixing the use of C3 .so together with executable. #1549, #1107.
* Wrong error message for interface methods with body #1536.
* Empty expression block would crash compiler with debug on #1554.
* Improve infer conversions on constants, e.g. `ZString a = foo ? "a" : "b";` #1561
* Show error when declarations do not start with `fn` in interfaces. #1565
* `if (try foo)` was handled incorrectly inside a defer.
* `&self` argument not implicitly null checked. #1556.
* `(uptr)&((Foo*)null).a` incorrectly inserts a null check. #1544
* Incorrect error message when `$eval` is provided an invalid string. #1570
* `HashMap.copy_keys` did not properly copy keys which needed to be allocated #1569
* Named vector component access would not fold at compile time. #1574
* `$define` would occasionally not properly evaluate declarations it encountered.
* Fixes with error handling recursive `@tag` #1583.
* Sometimes generating introspection info would not be in the global scope causing a crash #1586.
* @tag on macros cannot be retrieved with tagof #1582
* Taking the $typeof of a wildcard optional returns `void!`.

### Stdlib changes

* Remove unintended print of `char[]` as String
* Add read/write to stream with big endian ints.
* Move accidently hidden "wrap\_bytes".
* Added CBool #1530.
* Added encoding/base32 module.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

Finally 0.6.4 is out. This version has some very important improvements
working with constant slices. It is also more permissive when it comes to working with generic types.

But perhaps the change which is the most obvious is the introduction of a new contract syntax using `<* *>`, away from the
Javadoc-like `/** */` which was hard to differentiate from comments.

### Constant slices

Constant slices has gotten a lot of low in 0.6.4. Constant vectors
can now convert into constant slices, and slicing arrays, bytes and
constant slices are now compile time operations.

This also adds constant bytes to/from `char[]` conversions.

### New contract syntax

The use of `/** */` for declaring a doc/contract block has been
around for a long time in C3.

Unfortunately it has a glaring problem: if you accidentally
forget a `*` and write `/* */` your docs are considered comments
and are silently ignored. This is obviously very bad.

Another problem would be code where the user accidentally typed `/** */`
for comments inside a function or similar. This was very hard to
give some proper errors for without complicating parsing.

By picking a different syntax - `<* *>`, these problems go away.
They also address some of the criticisms against using doc-comments
for contracts.

### Interface/any changes

Previously it was possible to assign a `void*` to an interface or `any`.
This led to the weird situation of the type inside being `void`,
which is a nonsense value and required special handling for it
to work properly in almost all code. This is no longer allowed.

As an improvement interfaces now support `.ptr` and `.type`
directly without casting to an `any`.

### Ternary

Inference now works across ternary, so for example:
`ZString a = b > 0 ? "x" : "y";` would do the right thing.

0.6.4 also fixes a crash when returning a struct or vector from a
ternary expression.

### Weakly linking the standard library

The standard library is now weakly linked, which allows
multiple copies of the same standard library to work when linked
together. Otherwise things like using a static library written
in C3 would have problems linking to a C3 program.

## What's next?

0.6.5 will clean up the CLI, tests and overall improvements.
While tagged unions are discussed, it's unclear whether they will
be considered for the next release.

A problem which keeps popping up is the packaged LLVM libraries.
These are frequently broken causing unnecessary work for everyone.
Currently the Windows libraries are precompiled by a separate CI.
This will probably be the way forward for all platforms, and that
work will probably go into the 0.6.5 release cycle as well.

## 0.6.4 Change list

There are many other fixes and changes, see the full changelist:

### Changes / improvements

* Const vector -> const slice implicit conversion.
* Slicing arrays, slices and bytes at compile time #1466.
* Better error for `int a[4] = ...`. #1518
* Better error for `int Foo(int a)` declarations #1516
* Improve error message in the case of `MyInterface x = foo;` #1522
* Deprecate `@adhoc`, allow non-nested ad hoc generic types.
* Constant bytes <=> char[] conversion should work #1514.
* Infer now works across ternary.
* Interfaces now support .ptr and .type directly without casting to `any`.
* Switch to `<* *>` docs.
* Improve error messages on expressions like `var $type = int;` #1553.
* Disallow casting a `void*` to `any` or an interface, unless it is `null`.
* Defer resolution of declarations when looked up in `def` aliased #1559.
* Adding constants to the Json AST #1540
* Adding info to the globals inside Json AST #1541
* Null-check function pointer invocation #1573.
* `string::new_struct_to_str` and `io::struct_to_format` to dump struct data.
* `io::print` will now print structs.
* Improve error message when using `void` aliases as variable storage type.
* Add a target type: "prepare" which doesn't compile anything (but may run `exec`)

### Fixes

* `Unsupported int[*] $x = { 1, 2, 3, 4 }` #1489.
* Unexpected compile error using a typed constant with `copysign` #1517
* Incorrect subscript resolution #1519.
* Segfault with passing a program with `-` using stdin.
* Using no module with `-` would reject the program.
* Unintended deref of pointers with methods caused regression with hash function.
* Fix broken sincos function.
* Bug when a continue is copied in a defer.
* Compiler error when any/interface initialized using {} #1533.
* Bug when defers and $if were combined in a macro, which would cause miscompilation.
* Fixes to the CSV reader.
* Crash returning struct or vector from function using ternary expression #1537.
* Improved error message on invalid subscript index type #1535.
* Improved error message when declaring a variable `void!`.
* Cannot use void as a generic parameter #1546
* Interfaces not correctly copied with generics #1545
* Memory leak in keys.new\_list fixed.
* Standard library is now correctly weakly linked, fixing the use of C3 .so together with executable. #1549, #1107.
* Wrong error message for interface methods with body #1536.
* Empty expression block would crash compiler with debug on #1554.
* Improve infer conversions on constants, e.g. `ZString a = foo ? "a" : "b";` #1561
* Show error when declarations do not start with `fn` in interfaces. #1565
* `if (try foo)` was handled incorrectly inside a defer.
* `&self` argument not implicitly null checked. #1556.
* `(uptr)&((Foo*)null).a` incorrectly inserts a null check. #1544
* Incorrect error message when `$eval` is provided an invalid string. #1570
* `HashMap.copy_keys` did not properly copy keys which needed to be allocated #1569
* Named vector component access would not fold at compile time. #1574
* `$define` would occasionally not properly evaluate declarations it encountered.
* Fixes with error handling recursive `@tag` #1583.
* Sometimes generating introspection info would not be in the global scope causing a crash #1586.
* @tag on macros cannot be retrieved with tagof #1582
* Taking the $typeof of a wildcard optional returns `void!`.

### Stdlib changes

* Remove unintended print of `char[]` as String
* Add read/write to stream with big endian ints.
* Move accidently hidden "wrap\_bytes".
* Added CBool #1530.
* Added encoding/base32 module.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>