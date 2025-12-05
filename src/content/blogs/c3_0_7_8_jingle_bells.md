---
title: "Jingle bells, C3 0.7.8 "
date: 2025-12-05
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
---

With Christmas on the horizon, C3 gets another monthly update to 0.7 with 0.7.8. As usual it brings a set of small tweaks and fixes. Let's see what we got:

## Struct splatting

0.7.7 added struct initializer splatting, but it was a special case. And while it has been possible to splat an array or slice into both initializers and calls, structs didn't support that. This has been amended in 0.7.8:

```c3
struct Foo
{
	int a;
	double b;
}

fn void test(int x, double y, int a)
{
	io::printfn("%s %s", x * a, y * a);
}

fn int main()
{
	Foo f = { 42, 3.14 };
	test(...f, 2);          // prints 84 6.280000
	return 0;
}
```

## Swizzle initialization for vectors

While vectors can use names to reference the first four values, e.g. `foo.x` as well as supporting swizzling: `foo.xy`, designated initialization has been limited to using the same syntax as arrays: `{ [0..1] = 1.2, [2] = 3.2 }`.

With this improvement, it's now possible to use the name of the components directly:

```c3
float[<3>] x = { .xy = 1.2, .z = 3.3 };
// Same as float[<3>] x = { [0..1] = 1.2, [2] = 3.2 };
```
A limitation is that any swizzling syntax, like `.xy` must indicate a consecutive gapless range, so initializing using for example `.zx` or `.xz` would not be allowed.

## Function referencing in `@return?` for simplified fault declarations

Before we had this:

```c3
faultdef BAD_ZERO, BAD_ONE, TOO_BIG;
<*
 @return? BAD_ZERO, BAD_ONE
*> 
fn int? foo(int a)
{
    switch (a)
    {
        case 0: return BAD_ZERO?;
        case 1: return BAD_ONE?;
        default: return a * 2;  
    }
}

// We must repeat the errors of "foo"
<*
 @return? BAD_ZERO, BAD_ONE, TOO_BIG
*> 
fn int? bar(int a)
{
    if (a > 100) return TOO_BIG?;
    return foo(a) ^ 12;
}
```

With this improvement, we can refer to the errors of a function (or function pointer) in the `@return?` statements:

```c3
<*
 @return? foo!, TOO_BIG
*> 
fn int? bar(int a)
{
    if (a > 100) return TOO_BIG?;
    return foo(a) ^ 12;
}
```

## Enums now support `membersof` to return associated values.

Enums used to only support the type property `.associated` which returned a list of the associated value types. Enums now instead use `.membersof`, which works like the same property on structs. `.associated` has been deprecated as `.membersof` includes its information.

```c3
enum Foo : (String x, int val)
{
	ABC = { "Hello", 3 },
	DEF = { "World", -100 },
}

fn int main()
{
	io::printn(Foo.membersof[0].get(Foo.ABC)); // Print "Hello"
	io::printn(Foo.membersof[1].get(Foo.DEF)); // Print -100
	$assert Foo.membersof[0].type == String.typeid;
	io::printn(Foo.membersof[0].nameof);       // prints x
	Foo f = ABC;
	io::printn(Foo.membersof[1].get(f));       // prints 3
	return 0;
}
```

## @param directives for ... parameters

C vaargs on functions were previously not possible to reference using `@param`. This has been improved, allowing "..." to be referenced:

```c3
<* 
 @param fmt : "the format string"
 @param ... : "the arguments to print" 
*>
extern fn int printf(ZString fmt, ...);
```

## Missing imports allowed if module `@if` evaluates to false

This change means that if you add imports to a module that isn't enabled, they are not checked:

```c3
module foo @if(false);
import non_existing_lib; // Missing module

fn int test()
{
    return 0;
}
```

Prior to 0.7.8 this would be reported as an error due to `non_existing_lib` not being a valid module, but from 0.7.8 such errors are only reported if the importing module is enabled. In this example, changing `@if(false)` to `@if(true)` would make the import reported as an error.

## Linux musl support

A `--linux-libc` command line option has been added, supporting `gnu` and `musl` options. This is the beginning of official musl support for the C3C compiler, contributed by DylanDoesProgramming.

## Support of `int $foo...` arguments

Named macro vaargs were incorrectly handled prior to 0.7.7, but the change in 0.7.7 inadvertently prevented typed const vaargs like `int $foo...`. This is now enabled again.

## Small bag of improvements

- String merging of `"foo" "bar"` is now much more efficient, handling very long strings easily.
- Win32 got a default exception handler thanks to TechnicalFowl.
- `$schema` was added as a key in `project.json`.
- The `@simd` implementation was changed, and `@simd` is now possible to use directly after the type as needed.
- `--test-nocapture` is deprecated in favour of `--test-show-output`.
- Xtensa target no longer enabled by default on LLVM 22, use `-DXTENSA_ENABLE` to enable it instead.

## Fixes
0.7.8 contains around 30 fixes, with the increase compared to 0.7.7 mostly depending on the vector ABI changes which yielded some regressions to clean up in 0.7.8.

## Stdlib changes

The MacOS bindings in std::os::macos nicely got a bunch of additions contributed by Glenn Kirk, and printing typeids now prints the actual underlying id as well. Printing BigInts was optimized and printf now has caching which makes printing on Win32 faster.

## Looking Forward

Several things are in the pipe: possibly updating the syntax for turning a fault into an optional, going from `return io::EOF?;` to some syntax that makes the grammar simpler. Inline asm is still waiting for its revision, and there should be a review of the casting rules. Finally, generating proper headers when building static and dynamic is rather overdue.

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
- Improve multiline string parser inside compiler #2552.
- Missing imports allowed if module `@if` evaluates to false #2251.
- Add default exception handler to Win32 #2557.
- Accept `"$schema"` as key in `project.json` #2554.
- Function referencing in `@return?` for simplified fault declarations. Check `@return?` eagerly #2340.
- Enums now work with `membersof` to return the associated values. #2571
- Deprecated `SomeEnum.associated` in favour of `SomeEnum.membersof`
- Refactored `@simd` implementation.
- Improve error message for `Foo{}` when `Foo` is not a generic type #2574.
- Support `@param` directives for `...` parameters. #2578
- Allow splatting of structs. #2555
- Deprecate `--test-nocapture` in favour of `--test-show-output` #2588.
- Xtensa target no longer enabled by default on LLVM 22, Compile with `-DXTENSA_ENABLE` to enable it instead
- Add `float[<3>] x = { .xy = 1.2, .z = 3.3 }` swizzle initialization for vectors. #2599
- Support `int $foo...` arguments. #2601
- Add musl support with `--linux-libc=musl`.

### Fixes
- `Foo.is_eq` would return false if the type was a `typedef` and had an overload, but the underlying type was not comparable.
- Remove division-by-zero checks for floating point in safe mode #2556.
- Fix division-by-zero checks on `a /= 0` and `b /= 0f` #2558.
- Fix fmod `a %= 0f`.
- Regression vector ABI: initializing a struct containing a NPOT vector with a constant value would crash LLVM. #2559
- Error message with hashmap shows "mangled" name instead of original #2562.
- Passing a compile time type implicitly converted to a typeid would crash instead of producing an error. #2568
- Compiler assert with const enum based on vector #2566
- Fix to `Path` handling `c:\foo` and `\home` parent. #2569
- Fix appending to `c:\` or `\` #2569.
- When encountering a foreach over a `ZString*` it would not properly emit a compilation error, but hit an assert #2573.
- Casting a distinct type based on a pointer to an `any` would accidentally be permitted. #2575
- `overflow_*` vector ops now correctly return a bool vector.
- Regression vector ABI: npot vectors would load incorrectly from pointers and other things. #2576
- Using `defer catch` with a (void), would cause an assertion. #2580
- Fix decl attribute in the wrong place causing an assertion. #2581
- Passing a single value to `@wasm` would ignore the renaming.
- `*(int*)1` incorrectly yielded an assert in LLVM IR lowering #2584.
- Fix issue when tests encounter a segmentation fault or similar.
- With project.json, when overriding with an empty list the base settings would still be used. #2583
- Add sigsegv stacktrace in test and regular errors for Darwin Arm64. #1105
- Incorrect error message when using generic type that isn't imported #2589
- `String.to_integer` does not correctly return in some cases where it should #2590.
- Resolving a missing property on a const enum with inline, reached an assert #2597.
- Unexpected maybe-deref subscript error with out parameter #2600.
- Bug on rethrow in return with defer #2603.
- Fix bug when converting from vector to distinct type of wider vector. #2604
- `$defined(hashmap.init(mem))` causes compiler segfault #2611.
- Reference macro parameters syntax does not error in certain cases. #2612
- @param name parsing too lenient #2614.

### Stdlib changes
- Add `CGFloat` `CGPoint` `CGSize` `CGRect` types to core_foundation (macOS).
- Add `NSStatusItem` const enum to ns module (macOS).
- Add `NSWindowCollectionBehavior` `NSWindowLevel` `NSWindowTabbingMode` to ns module (macOS).
- Add `ns::eventmask_from_type` function to objc (macOS).
- Deprecate objc enums in favour of const inline enums backed by NS numerical types, and with the NS prefix, to better align with the objc api (macOS).
- Deprecate `event_type_from` function in favour of using NSEvent directly, to better align with the objc api (macOS).
- Add unit tests for objc and core_foundation (macOS).
- Make printing typeids give some helpful typeid data.
- Add `NSApplicationTerminateReply` to ns module (macOS).
- Add `registerClassPair` function to objc module (macOS).
- Somewhat faster BigInt output.
- Cache printf output.

</details>

### Want To Dive Into C3?

Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).

Discuss this article on [Reddit](https://www.reddit.com/r/programming/comments/1okzgsu/c3_077_vector_abi_changes_riscv_improvements_and/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).