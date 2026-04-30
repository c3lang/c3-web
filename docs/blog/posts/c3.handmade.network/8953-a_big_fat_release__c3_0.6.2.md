---
title: "A big fat release: C3 0.6.2"
date: 2024-09-03
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8953-a_big_fat_release__c3_0.6.2](https://c3.handmade.network/blog/p/8953-a_big_fat_release__c3_0.6.2)*

The 0.6.2 release is here, and a lot has happened since 0.6.1.

Mainly it's that C3 has seen a lot of new users which have explored the corners
of the compiler and also filed request for improvements.

Let's start with the language additions:

### &&& and ||| operators

0.5.0 introduced the compile time `$and` and `$or` functions. These worked at
compile time and would not even type check the right hand side if the left hand
side was invalid. So for example `$and(false, a < 1.0)` would be accepted even if
`a` wasn't in the current scope.

It felt like this feature should be more part of the language proper, so two new
operators were added: `&&&` and `|||` to replace `$and` and `$or` respectively.

They were chosen for being visually distinct. Other alternatives, such as `$&` were
discarded for not being sufficiently easy to spot.

### The +++ operator

Somewhat on trial is the `+++` operator. Similar to `&&&` and `|||` it replaces a
compile time function – or actually two: `$concat` and `$append`. We can for example write
`"name:" +++ Foo.nameof` to get `"name:Foo"` at compile time.

The operator is slightly controversial and there will be trials with other syntax
alternatives, but for now - feel welcome to try it out.

### New attributes: @const, @noalias and @tag

A macro with only compile time constructs will be folded at compile time,
but until now there's not been a simple way to check it. The `@const` attribute
in 0.6.2 can be added to a macro to give an error if it's not completely compile
time folded.

There is also the experimental `@noalias` attribute to put on parameters. As might
be guessed, this indicates to the compiler that the parameter will not alias with
any other pointer, similar to C's `restrict`.

Finally there is the `@tag` attribute. It allows you to add a key-value pair to any
declaration, which later can be checked with `.tagof` and `.has_tagof` compile time
methods.

This can be used to add arbitrary metadata to types.

### Compile time additions

Aside from `.tagof` and `.has_tagof` mentioned above, there is `.methodsof` to get
methods associated with a type, and member reflection types has a `.get` method to
generate runtime getters: `$member.get(value)`. And finally `is_substruct` to check
if a struct has an inline member.

### RISCV ASM support

Thanks to contributor Chuck Benedict, there is now inline asm for RISCV processors
as well!

## Language changes

With the addition of new operators, `$and`, `$or`, `$concat` and `$append` are getting
phased out.

`$vasplat()` also gets a new look: it can now be used directly as `$vasplat`
or ranged using `$vasplat[2..3]`. This is more consistent with the rest of the language.
Similarly `$vaarg` and others are getting brackets rather than parenthesis: `$vaarg[2]`.

Implicit scalar to vector conversions is also getting a bit less generous. They now only
happen with initializers and in binary expressions.

## Standard library changes

There has been some added functionality, but mostly tweaks and small additions to existing
features.

## Fixes

On top of this the 0.6.2 release contains over 50 bug fixes, from standard library
bugs to unhandled corner cases in the compiler. This is all thanks to having so many more users.

## Where to next?

Language feature wise, 0.6.3 will look at named parameters and allowing more pervasive use
of splat (`...`) in calls.

Other than that, 0.6.3 will try to add more toolchain improvements and better support
for other targets than x64 and Aarch64.

Here is the full change list:

### Changes / improvements

* Updated LLVM passes
* Added `is_substruct` type property.
* Scalar -> vector not implicit in call or assign.
* Added `--vector-conv` to enable the old scalar->vector conversion behaviour.
* Added "weak" type aliases `def Foo = my_foo::Foo @weak;`
* `*-add` keys in targets in `manifest.json` and `project.json` are deprecated.
* Made "add" the default for things like `sources`, `dependencies` and other keys in project and library files.
* Give some symbol name suggestions when the path is matched.
* Don't generate .o files on `compile` and `compile-run` if there is no `main`.
* c3c init-lib does not create the directory with the .c3l suffix #1253
* Permit foreach values to be optional.
* Add `--show-backtrace` option to disable backtrace for even smaller binary.
* Untested Xtensa support.
* && doesn't work correctly with lambdas #1279.
* Fix incorrect override of optimization levels when using projects.
* Add experimental `@noalias` attribute.
* Add a `--run-once` option to delete the output file after running it.
* Add `@const` attribute for macros, for better error messages with constant macros.
* Add `wincrt` setting to libraries.
* Add `+++` `&&&` `|||` as replacement for `$concat`, `$and` and `$or`.
* Add `methodsof` to type info for struct, union and bitstruct.
* Added `@tag` `tagof` and `has_tagof` to user defined types and members.
* Added `c-include-dirs` project/manifest setting.
* The compiler now skips UTF8 BOM.
* Printable values passed to the Formatter as pointers, will print as if passed by value.
* Pointers are rendered with "0x" prefix when passed to '%s'.
* Add temp allocator scribble.
* Use PIC by default on Linux.
* `$exec` may now provide a stdin parameter.
* Introduce `$vaarg[...]` syntax and deprecate the old `$vaarg(...)`.
* Similar change to `$vasplat`: `$vasplat` and `$vasplat[1..]`.
* Add `$member.get(value)` to replace `value.$eval($member.nameof)`
* Improve the error message when the compilation does not produce any files #1390.
* Add `fmod` implementation for nolibc.

### Fixes

* Broken WASM library code.
* Regression: Invalid is\_random implementation due to changes in 0.6.
* `dbghelp.lib` was linked even on nolibc on Windows.
* Fix incorrect linker selection on some platforms.
* Struct members declared in a single line declaration were not sharing attributes. #1266
* `opt` project setting now properly documented.
* Incorrect justify formatting of integers.
* Assertion with duplicate function pointer signatures #1286
* Distinct func type would not accept direct function address assign. #1287
* Distinct inline would not implement protocol if the inlined implemented it. #1292
* Distinct inline can now be called if it is aliasing a function pointer.
* Bug in List add\_array when reserving memory.
* Fix issue where a compile time parameter is followed by "...".
* Fix issue with some conversions to untyped list.
* Issue where a `if (catch e = ...)` in a defer would be incorrectly copied. Causing codegen error.
* Variable in if-try / if-catch cannot be a reused variable name.
* Vararg interfaces were broken.
* LLVM codegen for constants in enums could fail.
* Fixes to the socket functions.
* Improved output when pointer is out of range.
* Better error when casting to a distinct fails.
* With single module, name the .o file after what `-o` provides. #1306
* Bitstruct members can now have attributes.
* `%` analysis was incorrect for int vectors.
* When resolving inherited interfaces, the interface type wasn't always resolved.
* Fix issues when checking methods and interfaces hasn't been resolved yet.
* Fix Vec2.angle
* Update to libc::setjmp on Win32, to do no stack unwinding.
* Recursively follow interfaces when looking up method.
* Int128 alignment change in LLVM fixed on x64.
* Fix interface lazy resolution errors.
* Interface resolution when part of generics #1348.
* Assert not properly traced #1354.
* Ordering issues with `$include` / `$exec` fixed #1302.
* Issues with wincrt linking.
* Debug info with recursive canonical type usage could cause segfault.
* Missing check on optional left hand side for `s.x`.
* Incorrect zero analysis on `foo["test"] = {}` #1360.
* Bug converting untyped list #1360.
* Benchmark / test no longer suppresses debug info. #1364.
* Bug when compile time subtracting a distinct type.
* `insert_at` incorrectly prevented inserts at the end of a list.
* Fix aligned alloc for Win32 targets.
* Compiler didn't detect when a module name was used both as a generic and regular module.
* Assigning a const zero to an aliased distinct caused an error.
* `--path` is now properly respected.
* `--test` will now provide the full filename and the column.
* Fix of bug in `defer (catch err)` with a direct return error.
* Too restrictive compile time checks for @const.
* Fixes to wasm nolibc in the standard library.
* Fixed int128 div/mod.
* Fix WASM memory init priority.
* Fix bug with `defer (catch err)` when used together with regular defer.
* Methods can now properly be aliased using `def` #1393.
* Memory leak in Object when not using temp allocators.
* Tracking allocator would double the allocations in the report.
* `printf` will now show errors in the output when there are errors.
* Bug where `if try` would work incorrectly in a macro.
* Prevent loading / storing large structs with LLVM.

### Stdlib changes

* `send` and `recv` added to `libc` for Posix / Win32.
* Add support to destroy temp allocators.
* Deprecated `path.append`, `path.tappend`, `getcwd`, `tgetcwd`, `path.absolute`, `ls`.
* Deprecated `env::get_config_dir`, replaced by `env::new_get_config_dir`.
* Added `path.has_extension`, `path.new_append`, `path.temp_append`, `new_cwd`, `temp_cwd`, `path.new_absolute`, `new_ls`, `temp_ls`.
* Added `dstring.replace`
* New hashmap type, `Map`
* Added `ElasticArray`.
* Added `types::is_signed`, `types::is_unsigned` and `types::inner_type`.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

The 0.6.2 release is here, and a lot has happened since 0.6.1.

Mainly it's that C3 has seen a lot of new users which have explored the corners
of the compiler and also filed request for improvements.

Let's start with the language additions:

### &&& and ||| operators

0.5.0 introduced the compile time `$and` and `$or` functions. These worked at
compile time and would not even type check the right hand side if the left hand
side was invalid. So for example `$and(false, a < 1.0)` would be accepted even if
`a` wasn't in the current scope.

It felt like this feature should be more part of the language proper, so two new
operators were added: `&&&` and `|||` to replace `$and` and `$or` respectively.

They were chosen for being visually distinct. Other alternatives, such as `$&` were
discarded for not being sufficiently easy to spot.

### The +++ operator

Somewhat on trial is the `+++` operator. Similar to `&&&` and `|||` it replaces a
compile time function – or actually two: `$concat` and `$append`. We can for example write
`"name:" +++ Foo.nameof` to get `"name:Foo"` at compile time.

The operator is slightly controversial and there will be trials with other syntax
alternatives, but for now - feel welcome to try it out.

### New attributes: @const, @noalias and @tag

A macro with only compile time constructs will be folded at compile time,
but until now there's not been a simple way to check it. The `@const` attribute
in 0.6.2 can be added to a macro to give an error if it's not completely compile
time folded.

There is also the experimental `@noalias` attribute to put on parameters. As might
be guessed, this indicates to the compiler that the parameter will not alias with
any other pointer, similar to C's `restrict`.

Finally there is the `@tag` attribute. It allows you to add a key-value pair to any
declaration, which later can be checked with `.tagof` and `.has_tagof` compile time
methods.

This can be used to add arbitrary metadata to types.

### Compile time additions

Aside from `.tagof` and `.has_tagof` mentioned above, there is `.methodsof` to get
methods associated with a type, and member reflection types has a `.get` method to
generate runtime getters: `$member.get(value)`. And finally `is_substruct` to check
if a struct has an inline member.

### RISCV ASM support

Thanks to contributor Chuck Benedict, there is now inline asm for RISCV processors
as well!

## Language changes

With the addition of new operators, `$and`, `$or`, `$concat` and `$append` are getting
phased out.

`$vasplat()` also gets a new look: it can now be used directly as `$vasplat`
or ranged using `$vasplat[2..3]`. This is more consistent with the rest of the language.
Similarly `$vaarg` and others are getting brackets rather than parenthesis: `$vaarg[2]`.

Implicit scalar to vector conversions is also getting a bit less generous. They now only
happen with initializers and in binary expressions.

## Standard library changes

There has been some added functionality, but mostly tweaks and small additions to existing
features.

## Fixes

On top of this the 0.6.2 release contains over 50 bug fixes, from standard library
bugs to unhandled corner cases in the compiler. This is all thanks to having so many more users.

## Where to next?

Language feature wise, 0.6.3 will look at named parameters and allowing more pervasive use
of splat (`...`) in calls.

Other than that, 0.6.3 will try to add more toolchain improvements and better support
for other targets than x64 and Aarch64.

Here is the full change list:

### Changes / improvements

* Updated LLVM passes
* Added `is_substruct` type property.
* Scalar -> vector not implicit in call or assign.
* Added `--vector-conv` to enable the old scalar->vector conversion behaviour.
* Added "weak" type aliases `def Foo = my_foo::Foo @weak;`
* `*-add` keys in targets in `manifest.json` and `project.json` are deprecated.
* Made "add" the default for things like `sources`, `dependencies` and other keys in project and library files.
* Give some symbol name suggestions when the path is matched.
* Don't generate .o files on `compile` and `compile-run` if there is no `main`.
* c3c init-lib does not create the directory with the .c3l suffix #1253
* Permit foreach values to be optional.
* Add `--show-backtrace` option to disable backtrace for even smaller binary.
* Untested Xtensa support.
* && doesn't work correctly with lambdas #1279.
* Fix incorrect override of optimization levels when using projects.
* Add experimental `@noalias` attribute.
* Add a `--run-once` option to delete the output file after running it.
* Add `@const` attribute for macros, for better error messages with constant macros.
* Add `wincrt` setting to libraries.
* Add `+++` `&&&` `|||` as replacement for `$concat`, `$and` and `$or`.
* Add `methodsof` to type info for struct, union and bitstruct.
* Added `@tag` `tagof` and `has_tagof` to user defined types and members.
* Added `c-include-dirs` project/manifest setting.
* The compiler now skips UTF8 BOM.
* Printable values passed to the Formatter as pointers, will print as if passed by value.
* Pointers are rendered with "0x" prefix when passed to '%s'.
* Add temp allocator scribble.
* Use PIC by default on Linux.
* `$exec` may now provide a stdin parameter.
* Introduce `$vaarg[...]` syntax and deprecate the old `$vaarg(...)`.
* Similar change to `$vasplat`: `$vasplat` and `$vasplat[1..]`.
* Add `$member.get(value)` to replace `value.$eval($member.nameof)`
* Improve the error message when the compilation does not produce any files #1390.
* Add `fmod` implementation for nolibc.

### Fixes

* Broken WASM library code.
* Regression: Invalid is\_random implementation due to changes in 0.6.
* `dbghelp.lib` was linked even on nolibc on Windows.
* Fix incorrect linker selection on some platforms.
* Struct members declared in a single line declaration were not sharing attributes. #1266
* `opt` project setting now properly documented.
* Incorrect justify formatting of integers.
* Assertion with duplicate function pointer signatures #1286
* Distinct func type would not accept direct function address assign. #1287
* Distinct inline would not implement protocol if the inlined implemented it. #1292
* Distinct inline can now be called if it is aliasing a function pointer.
* Bug in List add\_array when reserving memory.
* Fix issue where a compile time parameter is followed by "...".
* Fix issue with some conversions to untyped list.
* Issue where a `if (catch e = ...)` in a defer would be incorrectly copied. Causing codegen error.
* Variable in if-try / if-catch cannot be a reused variable name.
* Vararg interfaces were broken.
* LLVM codegen for constants in enums could fail.
* Fixes to the socket functions.
* Improved output when pointer is out of range.
* Better error when casting to a distinct fails.
* With single module, name the .o file after what `-o` provides. #1306
* Bitstruct members can now have attributes.
* `%` analysis was incorrect for int vectors.
* When resolving inherited interfaces, the interface type wasn't always resolved.
* Fix issues when checking methods and interfaces hasn't been resolved yet.
* Fix Vec2.angle
* Update to libc::setjmp on Win32, to do no stack unwinding.
* Recursively follow interfaces when looking up method.
* Int128 alignment change in LLVM fixed on x64.
* Fix interface lazy resolution errors.
* Interface resolution when part of generics #1348.
* Assert not properly traced #1354.
* Ordering issues with `$include` / `$exec` fixed #1302.
* Issues with wincrt linking.
* Debug info with recursive canonical type usage could cause segfault.
* Missing check on optional left hand side for `s.x`.
* Incorrect zero analysis on `foo["test"] = {}` #1360.
* Bug converting untyped list #1360.
* Benchmark / test no longer suppresses debug info. #1364.
* Bug when compile time subtracting a distinct type.
* `insert_at` incorrectly prevented inserts at the end of a list.
* Fix aligned alloc for Win32 targets.
* Compiler didn't detect when a module name was used both as a generic and regular module.
* Assigning a const zero to an aliased distinct caused an error.
* `--path` is now properly respected.
* `--test` will now provide the full filename and the column.
* Fix of bug in `defer (catch err)` with a direct return error.
* Too restrictive compile time checks for @const.
* Fixes to wasm nolibc in the standard library.
* Fixed int128 div/mod.
* Fix WASM memory init priority.
* Fix bug with `defer (catch err)` when used together with regular defer.
* Methods can now properly be aliased using `def` #1393.
* Memory leak in Object when not using temp allocators.
* Tracking allocator would double the allocations in the report.
* `printf` will now show errors in the output when there are errors.
* Bug where `if try` would work incorrectly in a macro.
* Prevent loading / storing large structs with LLVM.

### Stdlib changes

* `send` and `recv` added to `libc` for Posix / Win32.
* Add support to destroy temp allocators.
* Deprecated `path.append`, `path.tappend`, `getcwd`, `tgetcwd`, `path.absolute`, `ls`.
* Deprecated `env::get_config_dir`, replaced by `env::new_get_config_dir`.
* Added `path.has_extension`, `path.new_append`, `path.temp_append`, `new_cwd`, `temp_cwd`, `path.new_absolute`, `new_ls`, `temp_ls`.
* Added `dstring.replace`
* New hashmap type, `Map`
* Added `ElasticArray`.
* Added `types::is_signed`, `types::is_unsigned` and `types::inner_type`.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

---
### Comment by Christoffer Lernö

No, C3 just supports asm and LLVM IR output on top of the normal binary output.