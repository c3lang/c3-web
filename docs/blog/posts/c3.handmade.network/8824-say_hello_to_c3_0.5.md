---
title: "Say hello to C3 0.5"
date: 2023-11-21
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8824-say_hello_to_c3_0.5](https://c3.handmade.network/blog/p/8824-say_hello_to_c3_0.5)*

*C3 is a programming language that builds on the syntax and semantics of the C language, with the goal of evolving it while still retaining familiarity for C programmers.
It's an evolution, not a revolution: the C-like for programmers who like C.*

It is finally time to release C3 0.5. This version is the first version of the C3 compiler (and by extension, the C3 language)
which is *feature-stable*.

Before 0.5, the language changed in the same minor version, so the 0.4.1 version of the compiler might not compile code written for 0.4.20
and vice versa.

From 0.5 and forward this changes: each future version will have its own branch where bug fixes will happen, but
otherwise the features are *frozen*. New features will be reserved for the dev and master branches. Consequently,
as we announce 0.5, work will actually move on to *0.6* which is where the active development will happen.

This allows people to pick a version to confidently work with, knowing that there will be no changes
to language semantics or the standard library.

## Feature complete

With 0.5, C3 language itself can also be considered feature complete, and for 0.6, 0.7, 0.8, 0.9 the focus will be on the
standard library. A good standard library should address real life use-cases, to solve commonly encountered
issues of the users.

In order to properly *know* what those use-cases are, a diverse set of projects must be written in C3. And for people
to build non-trivial projects in C3 without problems there must be some stability guarantees to the compiler itself.
This is what 0.5 provides, and why we now switch forward to refining the standard library.

## Explore C3

Interested in trying out C3 0.5? Learn more on the language's official site: <https://c3-lang.org>.
Obtain the compiler from GitHub at <https://github.com/c3lang/c3c/issues> and join the community shaping the future of
the C3 programming language.

## Comments


---
### Comment by Christoffer Lernö

*C3 is a programming language that builds on the syntax and semantics of the C language, with the goal of evolving it while still retaining familiarity for C programmers.
It's an evolution, not a revolution: the C-like for programmers who like C.*

It is finally time to release C3 0.5. This version is the first version of the C3 compiler (and by extension, the C3 language)
which is *feature-stable*.

Before 0.5, the language changed in the same minor version, so the 0.4.1 version of the compiler might not compile code written for 0.4.20
and vice versa.

From 0.5 and forward this changes: each future version will have its own branch where bug fixes will happen, but
otherwise the features are *frozen*. New features will be reserved for the dev and master branches. Consequently,
as we announce 0.5, work will actually move on to *0.6* which is where the active development will happen.

This allows people to pick a version to confidently work with, knowing that there will be no changes
to language semantics or the standard library.

## Feature complete

With 0.5, C3 language itself can also be considered feature complete, and for 0.6, 0.7, 0.8, 0.9 the focus will be on the
standard library. A good standard library should address real life use-cases, to solve commonly encountered
issues of the users.

In order to properly *know* what those use-cases are, a diverse set of projects must be written in C3. And for people
to build non-trivial projects in C3 without problems there must be some stability guarantees to the compiler itself.
This is what 0.5 provides, and why we now switch forward to refining the standard library.

## Explore C3

Interested in trying out C3 0.5? Learn more on the language's official site: <https://c3-lang.org>.
Obtain the compiler from GitHub at <https://github.com/c3lang/c3c/issues> and join the community shaping the future of
the C3 programming language.

---
### Comment by Christoffer Lernö

The change list for 0.5:

### Changes / improvements

* Trackable allocator with leak allocation backtraces.
* `$defined` can take a list of expressions.
* `$and` compile time "and" which does not check expressions after the first is an error.
* `$is_const` returns true if an expression is compile time const.
* `$assignable` returns true is an expression may be implicitly cast to a type.
* `$checks` and `@checked` removed, replaced by an improved `$defined`
* Asm string blocks use AT&T syntax for better reliability.
* Distinct methods changed to separate syntax.
* 'exec' directive to run scripts at compile time.
* Project key descriptions in --list command.
* Added `init-lib` to simplify library creation.
* Local `const` work like namespaced global `const`.
* Added `$$atomic_fetch_*` builtins.
* vectors may now contain pointers.
* `void!` does not convert to `anyfault`.
* `$$masked_load` / `$$masked_store` / `$$gather` / `$$scatter` for vector masked load/store.
* `$$select` builtin for vector masked select.
* Added builtin benchmarks by `benchmark`, `compile-benchmark` commands and `@benchmark` attribute.
* Subtype matching in type switches.
* Added parentof typeid property.
* Slice assignment is expanded.
* Enforced optional handling.
* Better dead code analysis, and added dead code errors.
* Exhaustive switches with enums has better analysis.
* Globals may now be initialized with optional values.
* New generic syntax.
* Slice initialization.
* `$feature` for feature flags.
* Native stacktrace for Linux, MacOS and Windows.
* Macro ref parameters are now of pointer type and ref parameters are not assignable.
* Added `nextcase default`.
* Added `$embed` to embed binary data.
* Ad hoc generics are now allowed.
* Allow inferred type on method first argument.
* Fix to void expression blocks
* Temporary objects may now invoke methods using ref parameters.
* Delete object files after successful linking.
* Compile time subscript of constant strings and bytes.
* `@if` introduced, other top level conditional compilation removed.
* Dynamically dispatched interfaces with optional methods.
* `$if` now uses `$if <expr>:` syntax.
* `$assert` now uses `$assert <expr> : <optional message>`
* `$error` is syntax sugar for `$assert false : "Some message"`
* `$include`, `$echo` no longer has mandatory `()` around the arguments.
* `$exec` for including the output of files.
* `assert` no longer allows "try unwrap"
* Updated cpu arguments for x86
* Removed support for ranged case statements that were floats or enums, or non-constant.
* `nextcase` with a constant expression that does not match any case is an error.
* Dropped support for LLVM 13-14.
* Updated grammar and lexer definition.
* Removal of `$elif`.
* any / anyfault may now be aliased.
* `@stdcall` etc removed in favor of `@callconv`
* Empty fault definitions is now an error.
* Better errors on incorrect bitstruct syntax.
* Internal use wildcard type rather than optional wildcard.
* Experimental scaled vector type removed.
* Disallow parameterize attributes without parameters eg `define @Foo() = { @inline }`.
* Handle `@optreturn` contract, renamed `@return!`.
* Restrict interface style functions.
* Optional propagation and assignment '!' and '?' are flipped.
* Add `l` suffix (alias for i64).
* Allow getting the underlying type of anyfault.
* De-duplicate string constants.
* Change @extname => @extern.
* `define` and `typedef` removed.
* `define` is replaced by `def`.
* LLVM "wrapper" library compilation is exception free.
* `private` is replaced by attribute `@private`.
* Addition of `@local` for file local visibility.
* Addition of `@public` for overriding default visibility.
* Default visibility can be overridden per module compile unit. Eg `module foo @private`.
* Optimized macro codegen for -O0.
* Addition of unary `+`.
* Remove possibility to elide length when using ':' for slices.
* Remove the `:` and `;` used in $if, $switch etc.
* Faults have an ordinal.
* Generic module contracts.
* Type inference on enum comparisons, e.g `foo_enum == ABC`.
* Allow {} to initialize basic types.
* String literals default to `String`.
* More const modification detection.
* C3L zip support.
* Support printing object files.
* Downloading of libraries using vendor "fetch".
* Structural casts removed.
* Added "native" option for vector capability.
* `$$shufflevector` replaced with `$$swizzle` and `$$swizzle2`.
* Builtin swizzle accessors.
* Lambdas, e.g `a = int(x, y) => x + y`.
* $$FILEPATH builtin constant.
* `variant` renamed `any`.
* `anyerr` renamed `anyfault`.
* Added `$$wasm_memory_size` and `$$wasm_memory_grow` builtins.
* Add "link-args" for project.
* Possible to suppress entry points using `--no-entry`.
* Added `memory-env` option.
* Use the .wasm extension on WASM binaries.
* Update precedence clarification rules for ^|&.
* Support for casting any expression to `void`.
* Win 32-bit processor target removed.
* Insert null-check for contracts declaring & params.
* Support user defined attributes in generic modules.
* `--strip-unused` directive for small binaries.
* `$$atomic_store` and `$$atomic_load` added.
* `usz`/`isz` replaces `usize` and `isize`.
* `@export` attribute to determine what is visible in precompiled libraries.
* Disallow obviously wrong code returning a pointer to a stack variable.
* Add &^| operations for bitstructs.
* `@noinit` replaces `= void` to opt-out of implicit zeroing.
* Multiple declarations are now allowed in most places, eg `int a, b;`.
* Allow simplified (boolean) bitstruct definitions.
* Allow `@test` to be placed on module declarations.
* Updated name mangling for non-exports.
* `defer catch` and `defer try` statements added.
* Better errors from `$assert`.
* `@deprecated` attribute added.
* Allow complex array length inference, eg `int[*][2][*] a = ...`.
* Cleanup of cast code.
* Removal of `generic` keyword.
* Remove implicit cast enum <-> int.
* Allow enums to use a distinct type as the backing type.
* Update addition and subtraction on enums.
* `@ensure` checks only non-optional results.
* `assert` may now take varargs for formatting.

### Stdlib changes

* Tracking allocator with location.
* `init_new`/`init_temp` for allocating init methods.
* `DString.printf` is now `DString.appendf`.
* Tuple and Maybe types.
* `.as_str()` replaced by `.str_view()`
* Added `math::log(x , base)` and `math::ln(x)`.
* Hashmap keys implicitly copied if copy/free are defined.
* Socket handling.
* `csv` package.
* Many random functions.
* Updated posix/win32 stdlib namespacing
* `process` stdlib
* Stdlib updates to string.
* Many additions to `List`: `remove`, `array_view`, `add_all`, `compact` etc
* Added dstringwriter.
* Improved printf formatting.
* is\_finite/is\_nam/is\_inf added.
* OnStack allocator to easily allocate a stack buffer.
* File enhancements: mkdir, rmdir, chdir.
* Path type for file path handling.
* Distinct `String` type.
* VarString replaced by DString.
* Removal of std::core::str.
* JSON parser and general Object type.
* Addition of `EnumMap`.
* RC4 crypto.
* Matrix identity macros.
* compare\_exchange added.
* `printfln` and `println` renamed `printfn` and `printn`.
* Support of roundeven.
* Added easings.
* Updated complex/matrix, added quaternion maths.
* Improved support for freestanding.
* Improved windows main support, with @winmain annotations.
* `SimpleHeapAllocator` added.
* Added win32 standard types.
* Added `saturated` math.
* Added `@expect`, `@unlikely` and `@likely` macros.
* Temp allocator uses memory-env to determine starting size.
* Temp allocator is now accessed using `mem::temp()`, heap allocator using `mem::heap()`.
* Float parsing added.
* Additions to std::net, ipv4/ipv6 parsing.
* Stream api.
* Random api.
* Sha1 hash function.
* Extended enumset functionality.
* Updated malloc/calloc/realloc/free removing old helper functions.
* Added TrackingAllocator.
* Add checks to prevent incorrect alignment on malloc.
* Updated clamp.
* Added `Clock` and `DateTime`.
* Added posix socket functions.

### Fixes

* Structs returned from macros and then indexed into directly could previously be miscompiled.
* Naked functions now correctly handles `asm`.
* Indexing into arrays would not always widen the index safely.
* Macros with implicit return didn't correctly deduct the return type.
* Reevaluating a bitstruct (due to checked) would break.
* Fix missing comparison between `any`.
* Fix issue of designated initializers containing bitstructs.
* Fix issue of designated initializers that had optional arguments.
* Fixed ++ and -- for bitstructs.
* Fix to bug where library source files were sometimes ignored.
* Types of arrays and vectors are consistently checked to be valid.
* Anonymous bitstructs check of duplicate member names fixed.
* Assignment to anonymous bitstruct members in structs.
* Fix casts on empty initializers.
* Fix to DString reserve.
* Fix where aliases did not do arithmetic promotion.
* @local declarations in generic modules available by accident.
* Fixes missing checks to body arguments.
* Do not create debug declaration for value-only parameter.
* Bug in alignment for atomics.
* Fix to bug when comparing nested arrays.
* Fix to bug when a macro is using rethrow.
* Fixes bug initializing a const struct with a const struct value.
* Fixes bug when `void` is passed to an "any"-vararg.
* Fixed defer/return value ordering in certain cases.
* Fixes to the x64 ABI.
* Updates to how variadics are implemented.
* Fixes to shift checks.
* Fixes to string parsing.
* Bug when rethrowing an optional from a macro which didn't return an optional.
* Fixed issues with ranged cases.
* Disallow trailing ',' in function parameter list.
* Fixed errors on flexible array slices.
* Fix of `readdir` issues on macOS.
* Fix to slice assignment of distinct types.
* Fix of issue casting subarrays to distinct types.
* Fixes to `split`, `rindex_of`.
* List no longer uses the temp allocator by default.
* Remove test global when not in test mode.
* Fix sum/product on floats.
* Fix error on void! return of macros.
* Removed too permissive casts on subarrays.
* Using C files correctly places objects in the build folder.
* Fix of overaligned deref.
* Fix negating a float vector.
* Fix where $typeof(x) { ... } would not be a valid compound literal.
* Fix so that using `var` in `if (var x = ...)` works correctly.
* Fix int[] -> void\* casts.
* Fix in utf8to16 conversions.
* Updated builtin checking.
* Reduce formatter register memory usage.
* Fixes to the "any" type.
* Fix bug in associated values.
* More RISC-V tests and fixes to the ABI.
* Fix issue with hex floats assumed being double despite `f` suffix.
* Fix of the `tan` function.
* Fixes to the aarch64 ABI when passing invalid vectors.
* Fix creating typed compile time variables.
* Fix bug in !floatval codegen.
* Fix of visibility issues for generic methods.
* Fixes to `$include`.
* Fix of LLVM codegen for optionals in certain cases.
* Fix of `$vasplat` when invoked repeatedly.
* Fix to `$$DATE`.
* Fix of attributes on nested bitstructs.
* Fix comparing const values > 64 bits.
* Defer now correctly invoked in expressions like `return a > 0 ? Foo.ABC! : 1`.
* Fix conversion in `if (int x = foo())`.
* Delay C ABI lowering until requested to prevent circular dependencies.
* Fix issue with decls accidentally invalidated during `$checked` eval.
* Fold optional when casting slice to pointer.
* Fixed issue when using named arguments after varargs.
* Fix bug initializing nested struct/unions.
* Fix of bool -> vector cast.
* Correctly widen C style varargs for distinct types and optionals.
* Fix of too aggressive codegen in ternary codegen with array indexing.

---
### Comment by Christoffer Lernö

It allows the language to be easily parsable. The classic problem in a C-like grammar is that it is ambiguous with respect to types vs variables. In C this is typically solved using the "lexer hack", where the parser feeds types back into the lexer. Other methods include outlawing certain types of expressions and using infinite lookahead, this is the method D uses for example.

In C3, the distinct naming rules for types disambiguates the grammar, making it LL(1). Also see here: <https://c3-lang.org/faq/#syntax-language-design>

So to be clear, it's not about trying to enforce some arbitrary name standards, but rather to simplify the grammar. Picking PascalCase for the types was pretty much the only possible choice. I might write a blog post about this some time.