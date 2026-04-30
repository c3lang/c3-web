---
title: "Fixes and improvements: C3 0.6.1 is here"
date: 2024-07-25
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8934-fixes_and_improvements__c3_0.6.1_is_here](https://c3.handmade.network/blog/p/8934-fixes_and_improvements__c3_0.6.1_is_here)*

It's time to release 0.6.1. There's been a bit longer to the x.x.1 than for 0.5.0 -> 0.5.1, and as a result there are quite a bit of additions.

Additions first: `$append` (appending to a compile time array) and `$concat` (combining two compile time arrays) were added as well as some compile time string macros: `@str_hash(...)` (hash a string at compile time), `@str_upper` / `@str_lower` (convert a compile time string to upper / lower case) and `@str_find` (find a substring in a string at compile time).

An important addition is `@unaligned_load` and `@unaliged_store` for loading/storing data to unaligned pointers.

In general there has been some relaxation constraints for some features. Trailing bodies, for example, may now use all type of macro argument kinds, like type arguments, and compile time folding of constant structs and arrays now work in all cases.

The standard library hasn't seen many changes since 0.6.0, but there have been some small enhancements.

The full changelist:

### Changes / improvements

* Addition of $append and $concat functions.
* Added $$str\_hash, $$str\_upper, $$str\_lower, $$str\_find builtins.
* Improved error notes when call expressions have errors.
* Trailing body arguments may now be `&ref`, `#hash`, `$const` and `$Type` arguments.
* "panic-msg" setting to suppress panic message output.
* Require `@export` functions to have `@export` types.
* Disallow leading/trailing/duplicate '\_' in module names.
* Updated mangling.
* Added `$$unaligned_load` and `$$unaligned_store`.
* `--no-headers` option to suppress creating headers when generating a library.
* Support c-file compilation in libraries.
* Allow using $defined(&a[1]) to check if the operation is supported.
* Max number of members in a struct is limited to 65535.
* The maximum number of parameters in a call is now 255, up from 127.
* Array comparison now uses built-in memcmp on LLVM to enable optimizations.
* Prevent implicit array casts to pointers with higher alignment #1237.
* Macro `$case` statements now pick the first match and does not evaluate the rest.
* `manifest.json` is now checked for incorrect keys.
* Added `--list-manifest-properties` to list the available properties in `manifest.json`.
* Indexing into a constant array / struct now works at compile time.
* Improved error message when trying user foreach with an untyped list.

### Fixes

* Error with unsigned compare in `@ensure` when early returning 0 #1207.
* Prevent Mach-O from removing `@init` and `@dynamic` in a more reliable way #1200.
* Fix of missing copy of parameterized custom attributes.
* Fixed crash on certain recursive function definitions #1209.
* Return the typekind "FUNC" for a function pointer.
* No longer possible to dereference a function pointer.
* Fix bug with @jump miscompile.
* Bit negate does implicit integer promotion.
* Bitstructs, unions and flexible arrays now correctly emitted in headers.
* Fix distinct inline conversions.
* Bit negating const zero flags would give an incorrect result.
* Fix to scalar -> vector conversions.
* Bug fix for rethrow + defer catch.
* Wrong size for structs containing overaligned structs #1219
* $typeof(\*x) should be valid when x is an `[out]` parameter #1226
* Fix ABI lowering for 128 bit vectors on Linux.
* Bad error message when using a generic method without generic parameters #1228
* Private function called from nested macro not visible to linker #1232
* Bitstructs in structs would not be correctly be handled in some cases.
* Fix problem where a $$FUNC would return "<GLOBAL>" when evaluated for a static in a function #1236.
* `ordinal` is no longer a valid associated value name for enums.
* Constants defined by indexing into another constant could fail codegen.
* Stdlib nolibc code bugs fixed.
* Regression: duplicate symbols with static variable declared in macro #1248.
* Unsplat with named parameters was accidentally disallowed.
* Reference parameter doesn't work with vector subscript #1250.
* The msvc\_sdk script failed to work properly on windows when run in folders with spaces.

### Stdlib changes

* Added `remove_first_item` `remove_last_item` and `remove_item` as aliases for the `match` functions.
* Added @str\_hash, @str\_upper, @str\_lower, @str\_find compile time macros.
* Remove "panic" text from unreachable() when safe mode is turned off.
* Added `@unaligned_store` and `@unaligned_load`.
* Null ZString, DString or pointer prints "(null)" for printf.
* Updated sorting API.
* Insertion sort and counting sort added.
* Added missing `mem` and `mem::allocator` functions for aligned allocations.
* Added `new_init_with_array` and `temp_init_with_array` for List.
* Fixed posix `NativeMutex.lock_timeout`.
* Fixed `env::ARCH_32_BIT` and `env::ARCH_64_BIT`.
* Added `time::us`.

## Comments


---
### Comment by Christoffer Lernö

It's time to release 0.6.1. There's been a bit longer to the x.x.1 than for 0.5.0 -> 0.5.1, and as a result there are quite a bit of additions.

Additions first: `$append` (appending to a compile time array) and `$concat` (combining two compile time arrays) were added as well as some compile time string macros: `@str_hash(...)` (hash a string at compile time), `@str_upper` / `@str_lower` (convert a compile time string to upper / lower case) and `@str_find` (find a substring in a string at compile time).

An important addition is `@unaligned_load` and `@unaliged_store` for loading/storing data to unaligned pointers.

In general there has been some relaxation constraints for some features. Trailing bodies, for example, may now use all type of macro argument kinds, like type arguments, and compile time folding of constant structs and arrays now work in all cases.

The standard library hasn't seen many changes since 0.6.0, but there have been some small enhancements.

The full changelist:

### Changes / improvements

* Addition of $append and $concat functions.
* Added $$str\_hash, $$str\_upper, $$str\_lower, $$str\_find builtins.
* Improved error notes when call expressions have errors.
* Trailing body arguments may now be `&ref`, `#hash`, `$const` and `$Type` arguments.
* "panic-msg" setting to suppress panic message output.
* Require `@export` functions to have `@export` types.
* Disallow leading/trailing/duplicate '\_' in module names.
* Updated mangling.
* Added `$$unaligned_load` and `$$unaligned_store`.
* `--no-headers` option to suppress creating headers when generating a library.
* Support c-file compilation in libraries.
* Allow using $defined(&a[1]) to check if the operation is supported.
* Max number of members in a struct is limited to 65535.
* The maximum number of parameters in a call is now 255, up from 127.
* Array comparison now uses built-in memcmp on LLVM to enable optimizations.
* Prevent implicit array casts to pointers with higher alignment #1237.
* Macro `$case` statements now pick the first match and does not evaluate the rest.
* `manifest.json` is now checked for incorrect keys.
* Added `--list-manifest-properties` to list the available properties in `manifest.json`.
* Indexing into a constant array / struct now works at compile time.
* Improved error message when trying user foreach with an untyped list.

### Fixes

* Error with unsigned compare in `@ensure` when early returning 0 #1207.
* Prevent Mach-O from removing `@init` and `@dynamic` in a more reliable way #1200.
* Fix of missing copy of parameterized custom attributes.
* Fixed crash on certain recursive function definitions #1209.
* Return the typekind "FUNC" for a function pointer.
* No longer possible to dereference a function pointer.
* Fix bug with @jump miscompile.
* Bit negate does implicit integer promotion.
* Bitstructs, unions and flexible arrays now correctly emitted in headers.
* Fix distinct inline conversions.
* Bit negating const zero flags would give an incorrect result.
* Fix to scalar -> vector conversions.
* Bug fix for rethrow + defer catch.
* Wrong size for structs containing overaligned structs #1219
* $typeof(\*x) should be valid when x is an `[out]` parameter #1226
* Fix ABI lowering for 128 bit vectors on Linux.
* Bad error message when using a generic method without generic parameters #1228
* Private function called from nested macro not visible to linker #1232
* Bitstructs in structs would not be correctly be handled in some cases.
* Fix problem where a $$FUNC would return "<GLOBAL>" when evaluated for a static in a function #1236.
* `ordinal` is no longer a valid associated value name for enums.
* Constants defined by indexing into another constant could fail codegen.
* Stdlib nolibc code bugs fixed.
* Regression: duplicate symbols with static variable declared in macro #1248.
* Unsplat with named parameters was accidentally disallowed.
* Reference parameter doesn't work with vector subscript #1250.
* The msvc\_sdk script failed to work properly on windows when run in folders with spaces.

### Stdlib changes

* Added `remove_first_item` `remove_last_item` and `remove_item` as aliases for the `match` functions.
* Added @str\_hash, @str\_upper, @str\_lower, @str\_find compile time macros.
* Remove "panic" text from unreachable() when safe mode is turned off.
* Added `@unaligned_store` and `@unaligned_load`.
* Null ZString, DString or pointer prints "(null)" for printf.
* Updated sorting API.
* Insertion sort and counting sort added.
* Added missing `mem` and `mem::allocator` functions for aligned allocations.
* Added `new_init_with_array` and `temp_init_with_array` for List.
* Fixed posix `NativeMutex.lock_timeout`.
* Fixed `env::ARCH_32_BIT` and `env::ARCH_64_BIT`.
* Added `time::us`.