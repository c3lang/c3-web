---
title: "C3 0.7.9 - New generics and new optional syntax"
date: 2026-01-29
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
---

0.7.9 revamps the generics, moving from a strict module-based generic module to something similar to conventional generics, but retaining the advantages of module-based generics.

## New generics

C3 traditionally had a generic approach which was based on the concept of generic modules:

```c3
module list {Type};

struct List
{
    Type* data;  // Type is an alias in this module scope
    usz capacity;
    usz size;
}

fn List new_list() { ... }
```

When one symbol of the module is generated, all are:

```c3
List{int} a; // This also generates list::new_list{int}
```

This grouping allowed constraints to be placed on the module:
```c3
<*
 @require $defined((Type){} + (Type){}) : "Type must respond to +'"
*> 
module num {Type};

fn Type add_two(Type t1, Type t2)
{
    return t1 + t2;
}

fn Type add_three(Type t1, Type t2, Type t3)
{
    return t1 + t2 + t3;
}

module test;
import num;

fn void main()
{
    int i = num::add_two{int}(1, 2);
    // This next gives "Type must respond to +" as error,
    // same happens if num::add_two is instantiated instead.
    void* ptr = num::add_three{void*}(null, null, null); 
}
```

The advantage of this is that the generic checking can be centralized and easily inlined at the calling site. However, having to create a new module for every generic is very heavy-weight, and increased dependency on macros.

### Group-based generics

Rather than setting the unit to be the module, the new generic system has *module groups*. A module declaration in the same module with the same argument name/names are considered belonging to the same group. The parameters are declared after the module or declaration.

```c3
module some_module;
fn Type foo(Type t) <Type> // Group 1
{
    return t * 2;
}

fn Type bar(Type t1, Type t2) <Type> // Group 1
{
    return t1 * t2
}

fn OtherType baz(OtherType t1, OtherType t2) <OtherType> // Group 2
{
    return t1 / t2;
}
```

Only all declarations in the same group are instantiated together:

```c3
foo{int}(1); // Instantiates foo and bar, not baz
baz({double}(1.3, 0.5); // Instantiates baz only
```

Adding it to the module declaration, makes all declarations in the module section marked with that group, making it compatible with old module-based generics:

```c3
module my_generic <Type>;

struct Foo  // Implicitly <Type>
{
    Type a, b;
}
fn Type test() => {}; // Implicitly <Type>

module other;
import my_generic;

Foo{int} x;
fn main()
{
    Foo{int} y = my_generic::test{int}();
}
```

### Combining constraints

Constraints will be shared between declarations in the same group, except for function and macro declarations:

```c3
module test;

<* @require $Type.kindof == SIGNED_INT : "Must be a signed integer" *>
struct Foo <Type>
{
    Type a, b;
}
<* require $Type.sizeof >= 4 : "Must be at least 32 bits" *>
const Foo BAZ <Type> = { 1, 2 };

fn void test()
{
    Foo{int} i; // Works
    Foo{short} s; // Error: "Must be at least 32 bits"
    Foo{double} s; // Error: "Must be a signed integer"
}
```

### Generic inference

Generics don't do general inference (although some improvements might happen in later versions). However, in assigment it will infer to the same parameters as the assigned-to expression used.

```c3
module test;

struct Foo <Type>
{
    Type a, b;
}
fn Type test() <Type> => {};

fn main()
{
    Foo{int} y = test(); // inferred to be test{int}
}
```

### Further refinement

Aside from the more lightweight use, the new generics feature allows migration from code that today may use macros. As a later improvement, inference may get better to allow more use without explicit arguments. On top of this, it could later allow things like generics taking typed constants.

## New Optional syntax

Previous to 0.7.9 the following held:

```c3
int? y = 1; // Asign a regular value
int? x = io::EOF?; // Assign the excuse io::EOF to, making it an Empty optional
int z1 = x!; // Rethrow if x is Empty
int z2 = x!!; // Panic if x is Empty
int z3 = x ?? 3; // Return 3 if x is Empty
```

Unfortunately the suffix `?` requires a very roundabout grammar, with very special handling to avoid conflict with ternary `?`. During the development of 0.7.9 we tested a lot of alternatives, such as `^io::EOF` and `?io::EOF`, but finally it was decided that suffix `~` was the least bad.

So starting from 0.7.9 suffix `?` is deprecated and replaced by `~`:

```c3
int? x = io::EOF~;
```

This also affects the two so-called "nani" pseudo-operators `?!` and `?!!`:

```c3
// Before:
io::EOF?!;  // Create io::EOF and immediately rethrow it
io::EOF?!!; // Create io::EOF and immediately panic

// After – goodbye "nani" 😭
io::EOF~!;
io::EOF~!!;
```

Note that the change only affects turning a fault into an Optional. Type declarations still use `?` suffix to indicate an optional type.

## Extended platform support

### Custom Libc

`--custom-libc` is a new alternative to libc/no-libc, which allows the stdlib to work as if a regular libc is available but doesn't automatically link to a particular libc. This can be used to provide replacement libc implementations.

### Support for NetBSD

Improvements have been made for NetBSD support as a target.

## Changes to reflection

The shorthand `foo.$abc` for `foo.eval("$abc")` has been introduced:

```c3
// Before:
macro get_field(v, String $fieldname)
{
    return v.$eval($fieldname);
}
// After:
macro get_field(v, String $fieldname)
{
    return v.$fieldname;
}
```

## New builtins

`$$int_to_mask` and `$$mask_to_int` efficiently converts from an integer into a vector bool bitmask and back.

They're available as `math::int_to_mask(VectorType, val)` and `bool_vector.mask_to_int()`.

In addition to this, `$$unaligned_load` and `$$unaligned_store` now also takes an "is_volatile" parameter, allowing for volatile unaligned loads.

New compile time constants are also available: `$$VERSION` and `$$PRERELEASE`, which return the compiler version and whether it is a prerelease version or not.

## Windows improvements

On win32 utf-8 console output is now enabled by default in compiled programs.

## Deprecated multi-level array length inference 

Because of the complexity to implement it, array length inference where anything other than the top level is inferred (e.g. `int[*][*]` or `int[*]*`) is deprecated.

There were a lot of bugs with this feature, and the complexity simply was not worth the very rare use case. Note here that C doesn't support it either.

## Fixes

Thanks to the hard work of contributors exploring corner-cases plus the uncommonly long development time, this version contains over 120 fixes(!).

## Stdlib changes

### Deprecations

Several functions relating to threads no longer need to be checked for the return value, and will return void in 0.8.0: Mutex's `destroy()`, `unlock()` and `lock()`, Thread's `destroy()`, `join()` and `detach()`, ConditionVariable's `destroy()`, `signal()`, `broadcast()` and `wait()`. Using these wrong are instead contract violations.

For `DString.append_chars` is deprecated: use `DString.append_string` instead. Appending a dstring should use `DString.append_dstring` instead.
 
Using `EMPTY_MACRO_SLOT` has been deprecated as well, since there are good replacements for it.

### Crypto and hashing

This version adds: Poly1305, Ripemd, Chacha20, Blake2, Blake3 and streebog.

### New functions for unaligned load and store

`mem::store` and `mem::load` has been added, which mostly replace existing macros for volatile and unaligned load/store. In addition to this they allow unaligned and volatile access to be combined.

### Assorted additions

`@in` macro checks a constant in a list at compile time. ThreadPool has `join()` to wait for all threads without destroying the threads in the pool. `any.to` and `any.as` methods corresponding to anycast. The ansi module adds a struct to print arbitrary ansi RGB values to a formatter without allocation. `allocator` gains `realloc_array` functions for reallocating an array created using `alloc_array`.  

## Looking Forward

For 0.7.10, there are already some really nice additions in the PR queue to improve tooling. The generics can be further refined, which will also likely happen this next release. Compile time evaluation order – which now changed a bit with the new generics, needs to be rewritten a bit in the next cycle as well.

And finally we hope C3 will finally rely on its own LLVM library builds for Linux and MacOS with 0.7.10.

## Community and Contributions
This release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

### Change Log
<details>
	<summary class="
		text-black 
		dark:text-white
		font-medium
		text-lg
		"
	>
		Click for full change log
	</summary>

### Changes / improvements
- Add `--custom-libc` option for custom libc implementations.
- Support for NetBSD.
- Testing for the presence of methods at the top level is prohibited previous to method registration.
- `$$mask_to_int` and `$$int_to_mask` to create bool masks from integers and back.
- Better error messages when slicing a pointer to a slice or vector. #2681
- Generics using ad-hoc `<...>` rather than module based.
- Reduced memory usage for backtraces on Linux.
- On win32 utf-8 console output is now enabled by default in compiled programs
- Add `$$VERSION` and `$$PRERELEASE` compile time constants.
- Require () around assignment in conditionals. #2716
- $$unaligned_load and $$unaligned_store now also takes a "is_volatile" parameter.
- Module-based generics using {} is deprecated.
- Create optional with `~` instead of `?`. `return io::EOF?;` becomes `return io::EOF~`.
- Deprecated use of `?` to create optional.
- Make `foo.$abc` implicitly mean `foo.eval("$abc")`.
- Deprecating multi-level array length inference. `int[*][*]` is deprecated and will be removed 0.8.0.
- Combining argument-less initialization with argument init for bitstructs is now allowed e.g. `{ .b, .c = 123 }`.

### Fixes
- Remove use of LLVMGetGlobalContext for single module compilation.
- Fixed bug where constants would get modified when slicing them. #2660
- Regression with npot vector in struct triggering an assert #2219.
- Casting bitstruct to wider base type should be single step #2616.
- Optional does not play well with bit ops #2618.
- `Bytebuffer.grow` was broken #2622.
- Hex escapes like `"\x80"` would be incorrectly lowered. #2623
- Ignore const null check on deref in `$defined` and `$sizeof` #2633.
- Subscripting of constant slices would sometimes be considered non-constant #2635.
- Compiler crash when concatenating structs and arrays to an untyped list.
- Strings assigned to longer arrays would crash codegen, e.g. `char[10] x = "abcd`.
- Typedefs and structs with inline types supporting lengthof would not work with lengthof #2641.
- `$defined(foo())` now correctly errors if `foo()` would require a path.
- `@if($defined((char*){}.foo()))` does not error if `foo` is missing.
- Hard limit of 127 characters for identifiers.
- `$$LINE` would sometimes yield the incorrect format.
- Fix error message when a method has the wrong type for the first argument.
- Unit tests allocating too much `tmem` without `@pool` would cause errors in unrelated tests. #2654
- Incorrect rounding for decimals in formatter in some cases. #2657
- Incorrectly using LLVMStructType when emitting dynamic functions on MachO #2666
- FixedThreadPool join did not work correctly.
- Fix bug when creating bool vectors in certain cases.
- Compiler assert when passing returning CT failure immediately rethrown #2689.
- Converting between simd/non-simd bool vector would hit a compiler assert. #2691
- `i<n>` suffixes were not caught when n < 8, causing an assert.
- Parse error in `$defined` was not handled correctly, leading to an assertion.
- Assert when struct/array size would exceed 4 GB.
- Assert when encountering a malformed module alias.
- Assert when encountering a test function with raw vaarg parameters.
- `foo.x` was not always handled correctly when `foo` was optional.
- `x'1234' +++ (ichar[1]) { 'A' }` would fail due to missing const folding.
- Miscompilation: global struct with vector could generate an incorrect initializer.
- `String.tokenize_all` would yield one too many empty tokens at the end.
- `String.replace` no longer depends on `String.split`.
- Fix the case where `\u<unicode char>` could crash the compiler on some platforms.
- Designated initialization with ranges would not error on overflow by 1.
- `io::read_fully` now handles unbounded streams properly.
- Crash when doing a type property lookup for const inline enums in some cases #2717.
- Incorrect alignment on typedef and local variable debug info.
- Assert on optional-returning-function in a comma expression. #2722
- Creating recursive debug info for functions could cause assertions.
- bitorder::read and bitorder::write may fail because of unaligned access #2734.
- Fix `LinkedList.to_format` to properly iterate linked list for printing.
- Hashing a vector would not use the entire vector in some cases.
- Fix to `temp_directory` on Windows #2762.
- Too little memory reserved when printing backtrace on Darwin #2698.
- In some cases, a type would not get implicitly converted to a typeid #2764.
- Assert on defining a const fault enum with enumerator and fault of the same name. #2732
- Passing a non-conststring to module attributes like @cname would trigger an assert rather than printing an error. #2771
- Passing different types to arg 1 and 2 for $$matrix_transpose would trigger an assert. #2771
- Zero init of optional compile time variable would crash the compiler. #2771
- Using multiple declaration for generics in generic module would fail. #2771
- Defining an extern const without a type would crash rather than print an error. #2771
- Typedef followed by brace would trigger an assert. #2771
- Union with too big member would trigger an assert. #2771
- Bitstruct with unevaluated user-defined type would cause a crash. #2771
- Using named parameters with builtins would cause a crash. #2771
- In some cases, using missing identifiers with builtins would cause a crash. #2771
- Using `$defined` with function call missing arguments would cause a crash. #2771
- Adding @nostrip to a test function would crash. #2771
- Mixing struct splat, non-named params and named params would crash rather than to print an error. #2771
- Creating a char vector from bytes would crash. #2771
- Using $$wstr16 with an illegal argument would crash instead of printing an error. #2771
- Empty struct after `@if` processing was not detected, causing a crash instead of an error. #2771
- Comparing an uint and int[<4>] was incorrectly assumed to be uint compared to int, causing a crash instead of an error. #2771
- When an `int[*][6]` was given too few values, the compiler would assert instead of giving an error. #2771
- Inferring length from a slice was accidentally not an error.
- Eager evaluation of macro arguments would break inferred arrays on some platforms. #2771.
- Vectors not converted to arrays when passed as raw vaargs. #2776
- Second value in switch range not checked properly, causing an error on non-const values. #2777
- Broken cast from fault to array pointer #2778.
- $typeof untyped list crashes when trying to create typeid from it. #2779
- Recursive constant definition not properly detected, leading to assert #2780
- Failed to reject void compile time variables, leading to crash. #2781
- Inferring the size of a slice with an inner inferred array using {} isn't detected as error #2783
- Bug in sysv abi when passing union in with floats #2784
- When a global const has invalid attributes, handling is incorrect, leading to a crash #2785.
- `int? ?` was not correctly handled. #2786
- Casting const bytes to vector with different element size was broken #2787
- Unable to access fields of a const inline enum with an aggregate underlying type. #2802
- Using an optional type as generic parameter was not properly caught #2799
- Instantiating an alias of a user-defined type was not properly caught #2798
- Too deeply nested scopes was a fatal crash and not a regular semantic error. #2796
- Recursive definition of tag not detected with nested tag/tagof #2790
- Attrdef eval environment lacked rtype, causing error on invalid args #2797
- $typeof(<type>) returns typeinfo, causing errors #2795.
- Empty ichar slice + byte concatenation hit an assert. #2789
- Remove dependency on test tmp library for stdlib compiler tests. #2800
- Comparing a flexible array member to another type would hit an assert. #2830
- Underlying slice type not checked correctly in $defined #2829
- Checking for exhaustive cases is done even in if-chain switch if all is enum #2828
- Constant shifting incorrectly doesn't flatten the underlying vector base #2825
- String not set as attributes resolved breaking has_tagof #2824
- Self referencing forward resolved const enum fails to be properly detected #2823
- Incorrectly try compile time int check on vector #2815
- Generating typeid from function gives incorrect typeid #2816
- Recursive definitions not discovered when initializer is access on other const #2817
- Slice overrun detected late hit codegen assert #2822
- Compile time dereference of a constant slice was too generous #2821
- Constant deref of subscript had inserted checks #2818
- Raw vaargs with optional return not lowered correctly #2819
- Early exit in macro call crashes codegen #2820
- Empty enums would return the values as zero sized arrays #2838
- Store of zero in lowering did not properly handle optionals in some cases #2837
- Bitstruct accidentally allowed other arrays than char arrays #2836
- Bitstruct as substruct fails to properly work with designated initializers. #2827
- Bug when initializing an inferred array with deep structure using designated init #2826
- Packed .c3l files without compressions weren't unpacked correctly.
- Lowering of optional in && was incorrect #2843
- Resolving &X.b when X is a const incorrectly checked for runtime constness #2842
- Alignment param on $$unaligned_* not checked for zero #2844
- Fix alignment for uint128 to 16 with WASM targets.
- Incorrect assert in struct alignment checking #2841
- Packed structs sometimes not lowered as such.
- Crash when creating `$Type*` where `$Type` is an optional type #2848
- Crashes when using `io::EOF~!` in various unhandled places. #2848
- Crash when trying to create a const zero untyped list #2847
- Incorrect handling when reporting fn with optional compile time type #2862
- Optional in initializer cause a crash #2864
- Negating a global address with offset was a counted as a global runtime constant #2865
- Converting static "make_slice" to array failed to be handled #2866
- Narrowing a not expression was incorrectly handled #2867
- Vector shift by optional scalar failed #2868
- Initializer did not correctly handle second rethrow #2870
- Crash encountering panic in if-else style switch #2871
- Crash in slice expression when it contains a rethrow #2872
- Multiple issues when rethrowing inside of expressions #2873

### Stdlib changes
- Add `ThreadPool` join function to wait for all threads to finish in the pool without destroying the threads.
- Add `@in` compile-time macro to check for a value in a variable list of constants. #2662
- Return of Thread/Mutex/CondVar `destroy()` is now "@maydiscard" and should be ignored. It will return void in 0.8.0.
- Return of Mutex `unlock()` and `lock()` is now "@maydiscard" and should be ignored. They will return void in 0.8.0.
- Return of ConditionVariable `signal()` `broadcast()` and `wait()` are now "@maydiscard". They will return void in 0.8.0.
- Return of Thread `detatch()` is now "@maydiscard". It will return void in 0.8.0.
- Buffered/UnbufferedChannel, and both ThreadPools have `@maydiscard` on a set of functions. They will return void in 0.8.0.
- Pthread bindings correctly return Errno instead of CInt.
- Return of Thread `join()` is now "@maydiscard".
- Add `poly1305` one-time Message Authentication Code and associated tests. #2639
- Add `ripemd` hashing and associated tests. #2663
- Add `chacha20` stream cipher and associated tests. #2643
- Add `BLAKE2` (optionally keyed) cryptographic hashing with associated tests. #2648
- Add `BLAKE3` XOF and associated tests. #2667
- Add `Elf32_Shdr` and `Elf64_Shdr` to `std::os::linux`.
- Add `any.to` and `any.as`.
- Deprecated `DString.append_chars`, use `DString.append_string`
- Deprecated `DString.append_string` for DStrings, use `DString.append_dstring` instead.
- Added `DString.append_bytes`.
- Add `streebog` (aka "GOST-12") hashing with 256-bit and 512-bit outputs. #2659
- Add unit tests for HMAC 256 based on RFC 4231. #2743
- Add extra `AsciiCharset` constants and combine its related compile-time/runtime macros. #2688
- Use a `Printable` struct for ansi RGB formatting instead of explicit allocation and deprecate the old method.
- HashSet.len() now returns usz instead of int. #2740
- Add `mem::store` and `mem::load` which may combine both aligned and volatile operations.
- Deprecated `EMPTY_MACRO_SLOT` and its related uses, in favor of `optional_param = ...` named macro arguments. #2805
- Add tracking of peak memory usage in the tracking allocator.
- Added `realloc_array`, `realloc_array_aligned`, and `realloc_array_try` to `allocator::`. #2760

</details>

### Want To Dive Into C3?

Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).

Discuss this article on [Hacker News](https://news.ycombinator.com/item?id=46833493) or [Reddit](https://www.reddit.com/r/programming/comments/1qsexe1/c3_programming_language_079_migrating_away_from/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).