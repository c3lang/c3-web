---
title: "C3 0.7.10 - Constdef finally takes shape"
date: 2026-02-26
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
---

After the big enhancement for generics in 0.7.9, coupled with the large number of bug fixes, 0.7.10 is naturally a more modest improvement.

A big change with the 0.7.10 release is that it's built with custom LLVM builds. This allows us to compile without unnecessary dependencies (the c3c binaries infamously depended on libxml2.so.2 due to the LLVM.org precompiled static libraries needing it).

The major change in 0.7.10 is resolving the fate of "const enums", but it also makes some other quality-of-life improvements to the language.

## Constdef

Very early on C3 made the change from C-style "enum is a number" to a strictly ordinal backed enum. What this means, is that there are no gaps in C3 enums. 

If we look at this enum in C, it's perfectly representable in C3:

```c
enum Foo
{
    ABC,
    DEF,
    GHI,
    JKL
};
```

The corresponding C3 enum would simply be:

```c3
enum Foo
{
    ABC,
    DEF,
    GHI,
    JKL
}
```

However, if we had the following C enum, C3 regular enums would not be able to match it:

```c
enum Foo
{
    ABC,
    DEF = 3,
    GHI,
    JKL
};
```

Because now the enum would have a gap, missing the ordinals 1 and 2.

The 1:1 mapping between C3 enums and integers allows C3 enums to support name lookups and associated values without overhead:

```c3
enum Greet : int (String fmt, String country)
{
    HELLO { "Hello %s", "USA" },
    NIHAO { "%s, 你好", "Taiwan"},
    HEJ { "Hej %s", "Sweden" }
}

fn void greet(Greet g, String name)
{
    io::printn("Using %s for greeting in %s.", g.nameof, g.country);
    io::printfn(g.fmt, name);
}

fn void test()
{
    // Prints
    // "Using HEJ for greeting in Sweden."
    // "Hej Sven"    
    greet(HEJ, "Sven");
    // Prints
    // "Using NIHAO for greeting in Taiwan"
    // "小龍, 妳好"
    greet(NIHAO, "小龍");
}
```

In this example, the lookup of `.nameof`, `.country` and `.fmt` is just indexing into an array.

If this had been C, we'd instead have to maintain such an array manually, alternatively solve it with a switch statement:

```c
// C equivalent of .country
const char *get_country(enum Greet g)
{
    switch (g) {
        case GREET_HELLO: return "USA";
        case GREET_NIHAO: return "Taiwan";
        case GREET_HEJ: return "Sweden";
        default: return "Unknown country"
    }
}
```

This need for manual maintenance often leads to bugs, often in the worst possible situation - like when printing to an error log.

So the problems C3's enum is addressing are important to fix, but there is a problem – what about the situation when you need enums with gaps?

### Enums as groups of constants

C's enums conflate two things: (1) a closed set of values mapping 1:1 to an underlying value (2) a grouped set of constants with a distinct type.

A classic variant of (2) in C is defining masks:

```c
typedef enum 
{
    MASK_ABC = 1 << 0,
    MASK_DEF = 1 << 1,
    MASK_GHI = 1 << 2
} Mask;    

Mask start = MASK_ABC | MASK_GHI;
```

In this case there is no intention to go back and forth from value to enum, since values do not map to a single value. Our `MASK_ABC | MASK_GHI` has the value `5`, which doesn't match any of the defined enum values.

The C usage is fine, but enums defined in this way can certainly not have an array or switch lookup to find the name, because there is not even a single name to match on!

Other usages are matching on binary protocols, where the underlying value of each enum value is language-independent. Furthermore, long-term some values may get deprecated and later completely removed.

This type of enum is not a closed set of values, but rather an open set of related constants.

In C, these two are conflated, but that approach is difficult in C3.

### Emulating C enums

The first approach tried in C3 was to create a distinct type with a custom submodule:

```c
// C version
typedef enum {
    FLAG_VSYNC_HINT         = 0x00000040, 
    FLAG_FULLSCREEN_MODE    = 0x00000002, 
    FLAG_WINDOW_RESIZABLE   = 0x00000004,
    ...
} ConfigFlags;

// Usage
ConfigFlags flags = FLAG_VSYNC_HINT | FLAG_FULLSCREEN_MODE;
```

```c3
// Early C3 version
module raylib;
...
typedef ConfigFlags = int;
// Submodule contains the constants
module raylib::config_flags;
const VSYNC_HINT         = 0x00000040; 
const FULLSCREEN_MODE    = 0x00000002; 
const WINDOW_RESIZABLE   = 0x00000004;

module my_game;
import raylib;
// Usage
ConfigFlags flags = config_flags::VSYNC_HINT 
                    | config_flags::FULLSCREEN_MODE;
```

As we can see, usage is very similar, and we get the same distinct type as in C, but there's a significant amount of song and dance to create the config flags.

There was a lot of experimentation in early versions of 0.7.x to allow regular enums to "convert" to integers, this culminated in this functionality:

```c3
// C3 inline enum values
module raylib;

typedef ConfigFlagVal = int;
enum ConfigFlags : int(inline ConfigFlagVal val)
{
    VSYNC_HINT         = 0x00000040, 
    FULLSCREEN_MODE    = 0x00000002, 
    WINDOW_RESIZABLE   = 0x00000004,
}

module my_game;
import raylib;
// Usage
ConfigFlagVal flags = ConfigFlags.VSYNC_HINT 
                      | ConfigFlags.FULLSCREEN_MODE;
// Implicitly what happens is
// ConfigFlagVal flags = ConfigFlags.VSYNC_HINT.val
//                       | ConfigFlags.FULLSCREEN_MODE.val;
```

However, this was deemed way to fiddly and advanced to do, which eventually led to capitulation and the const enums were introduced in 0.7.4:

```c3
// C3 const enums
module raylib;

// "const" creates a const enum
enum ConfigFlags : const int
{
    VSYNC_HINT         = 0x00000040, 
    FULLSCREEN_MODE    = 0x00000002, 
    WINDOW_RESIZABLE   = 0x00000004,
}

module my_game;
import raylib;
// Usage
ConfigFlags flags = ConfigFlags.VSYNC_HINT 
                    | ConfigFlags.FULLSCREEN_MODE;
```

Now we're basically having C enums. But there is something not so nice with this:

```c3
enum Foo : const int
{
    ABC,
    DEF
}
enum Bar : int
{
    ABC,
    DEF
}

fn void test()
{
    io::printn(Foo.DEF); // Prints 1
    io::printn(Bar.DEF); // Prints DEF
}
```

### Enter "constdef"

The C enums were quite different, but shared basically all visual similarities. So it was decided to rename these, there were alternatives such as these:

```c3
const enum Foo
{
    ABC,
    DEF
}
cenum Foo
{
    ABC,
    DEF
}
enumc Foo
{
    ABC,
    DEF
}
```

During this discussion, it was revealed that a lot of people just defaulted to `enum Foo : const int`. Even just calling them `const enum` got people to think they were essentially the same as the regular enums. Some people even expressed the opinion that the const enums should be the default enums.

This showed how the problem had become one of communication: by sharing a similar name, people assumed the same functionality. It just seemed that "const enums" were just like regular enums but "better", because they appeared to give more options, even though as we saw above, const enums weren't able to provide any of the useful features of the regular C3 enums.

A major break with the old syntax was needed. So rather than the conservative "const enum" or "cenum", the name `constdef` was chosen. Since `faultdef`, `typedef` and `attrdef` was already established syntax, that name was in line with other C3 keywords.

So the 0.7.10 version of the example becomes

```c3
// C3 constdef
module raylib;

constdef ConfigFlags : int
{
    VSYNC_HINT         = 0x00000040, 
    FULLSCREEN_MODE    = 0x00000002, 
    WINDOW_RESIZABLE   = 0x00000004,
}

module my_game;
import raylib;
// Usage
ConfigFlags flags = ConfigFlags.VSYNC_HINT 
                    | ConfigFlags.FULLSCREEN_MODE;
```

So semantically we're using the `enum Foo : const int` of 0.7.4, but with a name that clearly indicates its capabilities. In essence it is not very different from the approach of `typedef + const` that we started with, but it's much cleaner.

The change in name makes the trade-off obvious: pick `enum` and you can't change the underlying value, pick `constdef` and you don't get runtime name reflection.

`constdef` goes further than C enums though. It may be any value, not just an integer. So this is just as valid:

```c3
constdef GreetingFmt : String
{
    HELLO = "Hello %s",
    NIHAO = "%s 你好",
    HEJ = "HEJ %s",
}
```

This would be just the same as defining the constants:
```c3
typedef GreetingFmt = String;
const GreetingFmt HELLO = "Hello %s";
const GreetingFmt NIHAO = "%s 你好";
const GreetingFmt HEJ = "HEJ %s";
```

So this extends the C idea of "enums as a distinct set of constants" from just integers to any type.

To further make enums and constdefs distinct, the syntax from the `inline` experiment have been reverted, and to declare associated values for enums `{}` is now used:

```c3
// Pre 0.7.10
enum Foo : (int a)
{
    ABC = 2,
    BCD = 3,
}
enum Bar : (int a, String b)
{
    TEST1 = { 1, "a" },
    TEST2 = { 75, "foo" }
}
// 0.7.10
enum Foo : (int a)
{
    ABC { 2 },
    BCD { 3 },
}
enum Bar : (int a, String b)
{
    TEST1 { 1, "a" },
    TEST2 { 75, "foo" }
}
```

### Compatibility with 0.7.9 and earlier

As per usual, the "const enum" syntax will still work until 0.8.0. Likewise, the old style of declaring associated values for regular enums will keep working. By default, a deprecation notice will be shown, but this can be suppressed by using `--warn-deprecation=no` as a command line option.

## Typedef literal conversion changes

In 0.7.9 and before, distinct types defined with `typedef` would implicitly convert from any literal or constant value. To avoid this behaviour you needed to add `@structlike`. However, it's been established that this is the wrong default. With 0.7.10 the default is swapped up: use `@constinit` to allow implicit casts from constants and by default it's not supported.

However, for backwards compatibility the old behaviour will only yield a deprecation notice.

```c3
// 0.7.9 behaviour
typedef MyNumber = int;
typedef Temperature @structlike = int;

MyNumber n = 0;
// Temperature t = 0; Error: needs explicit conversion
Temperature t = (Temperature)0; 

// 0.7.10
typedef MyNumber @constinit = int;
typedef Temperature = int;

MyNumber n = 0;
// Temperature t = 0; Error: deprecated
Temperature t = (Temperature)0;
```

## Method resolution and `$defined`

A problem has been using `$defined` with methods, since methods are associated with their underlying types fairly late. For this reason 0.7.9 tightened the constraints as to when it was possible to test a method.

Here's a problematic example where the dependency is circular:

```c3
struct Foo { int a; }

fn void Foo.test(&self) @if($defined(Foo.test2))
{}
fn void Foo.test2(&self) @if($defined(Foo.test))
{}
```

While it's important to detect these kinds of circular dependencies, 0.7.9 would also end up disallowing well-ordered used of `$defined` with methods.

This changes in 0.7.10. Rather than checking if the method resolution is complete before `$defined` is invoked, the compiler will "tag" the parent type when its methods are referenced in a `$defined`. If a method is later added to the parent type, a warning will be issued.

So the check is now tied to whether there is legitimate ambiguity to the `$defined`, rather than assuming it is wrong if it's invoked out of order.

This model is easy to implement and also greatly improves on the original check.

## Integrated MSVC SDK download

C3's long had the ability to cross-compile to MSVC, but now at long last this is no longer supported using a separate script, but everything is integrated into the C3 compiler yielding a silky smooth experience whether just building on Windows or cross-compiling.

## Semantics changes

C3's `unsigned % signed` and `unsigned / signed` conversions would typically convert the unsigned part to signed. While this is reasonable for other arithmetics, it leads to very surprising behaviour for division/remainder. Since the cases where this happened was very likely to yield buggy behaviour, this is now a hard error.

Cases like `unsigned % 1` changes to that the denominator is turned into an unsigned value.

Examples:

```c3
int y = 2;
uint x = uint.max / y;  // Invalid, requires explicit cast.
uint y = uint.max / 2;  // Implicitly converts denominator to 2U.
uint z = uint.max / -2; // Invalid, requires explicit cast.  
```

## Warnings

While the C3 compiler has had settings for silencing/enabling warnings through --validation and --silence-deprecation, it didn't have any uniform system for warnings. 0.7.10 changes this and adds `--warn-*` family of custom settings for individual warnings. Expect this to be expanded on in future versions of the compiler.

## Method visibility warnings

Method visibility has been ignored since 0.7.0, but no warning has been issued. Now these warnings have been added, and consequently many stdlib methods have been updated as a result.

```c3
struct Foo { int a; }

// @local is ignored, this is a warning in 0.7.10
fn int Foo.test(self) @local
{
    return self.a;
}

fn int Foo.do_something(self)
{
    return self.test();
}
```

If you were relying on hiding implementation details with local or private methods, use a local / private function instead.

```c3
// Using a @local function instead:
fn int _test(Foo self) @local
{
    return self.a;
}

fn int Foo.do_something(self)
{
    return _test(self);
}
```

## Tooling improvements

**Android Termux support:** has been improved and should now work properly.

**Library support:** `c3c init` for libraries now provides helpful examples of exported functions.

**Improved Vendor Fetch:** `c3c vendor-fetch` now helpfully lists all packages available from vendor.

**Tracking inlining and function sizes:** The `--print-large-functions` has been added. This commandline switch will print out the names of functions that have a large number of instructions. If a seemingly normal function has a large number of instructions, then this signals that the function is likely using too much macro inlining. Aside from longer compile times and larger binary sizes, this will affect the instruction cache, potentially yielding worse performance despite inlining.

## '@deprecated' as a contract directive

`@deprecated` has been available as a contract directive, but it didn't do anything. Starting with 0.7.10 this works properly.

```c3
// Deprecation using attribute:
<* 
 Call this old function
*>   
fn void old_test() @deprecated("use new_test")
{ ... }
// Deprecation using contract

<* 
 Call this old function
 @deprecated "use new_test"
*>   
fn void old_test()
{ ... }
```

## Stdlib updates

- PEM encoding / decoding
- New hash implementations: Murmur3 and Xorshiro128++
- Optional line-length cutoff parameter in `io::readline`
- `array::even`, `array::odd` and `array::unlace` array filtering functions.
- Single-byte code page support (DOS/OEM, Windows/ANSI, and ISO/IEC 8859)
- Discrete and continuous distributions added to std::math

### Changes in the stream API

The original stream API used `isz` and `usz` for `seek` and `available` functions. This has been updated to use 64-bit ints on all platforms. This solves issues working with large files on 32-bit systems.

As part of this, `InStream.seek` is replaced by `set_cursor` and `cursor`.

## Notable fixes

- `--cpu-flags` didn't work if the first item was an exclusion.
- Reallocating overaligned memory with the LibcAllocator was unsafe.
- `std::io::Formatter` would print incorrect values for values exceeding `int128.max`.
- `--safe=no` would accidentally disable compile-time error reporting on compile-time known runtime `@require` checks.
- Member access on a struct returned by an assignment expression, e.g. `(foo = bar()).a` would cause a crash.

## Looking Forward

0.7.11 should bring a healthy number of additions to the stdlib, and there needs to be some early preparation for 0.8.0 as well.

The surrounding tooling is what needs the most attention:

- Evolving beyond vendor-fetch for retrieving libraries.
- The need for a *SOLID* LSP is getting more urgent.
- An official C3 code formatter is needed.
- Likewise, an official C3 docgen is getting increasingly urgent.

## Community and Contributions
This release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

#### PR contributors for this release:

**Stdlib:** Book-reader, Fernando López Guevara, konimarti, Laura Kirsch, Manu Linares, mmoustafa8108, soerlemans, Zack Puhl.

**Compiler & toolchain:** Book-reader, Damien Wilson, Foxy-Boxes, Gantsev Denis, Kiana, Laura Kirsch, Lucas Alves, Manu Linares, Samuel, srkkov

**CI/Infrastructure:** Manu Linares, Rauny, Smite Rust.


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
- C3 is now using its own LLVM libraries when building releases.
- Method resolution and `$defined` now works together well unless definitions are out of order for real.
- Improve error message when using functions as values #2856
- Improve support for Android with Termux.
- Integrated download of the MSVC SDK when compiling for Windows.
- For `c3c init` with library templates, provide example exported functions. #2898
- `unsigned % signed` and `unsigned / signed` is no longer allowed without explicit casts, except for const denominators. #2928
- New enum associated value syntax.
- Individual warning settings added.
- Change typedef and const enums to not convert from literals by default.
- Add `@constinit` to allow old typedef behaviour.
- Include actual element count in the error message when the array initializer size does not match the expected size.
- Add `--print-large-functions` for checking which functions likely dominate the compile time.
- Improve error message when providing `alias` with a typeid expression where a type was expected. #2944
- Const enums removed.
- Constdef declarations introduced.
- Properly support `@deprecated` as contract.
- Support deprecating enum values.
- Improve error when trying to use an extern const as a compile time constant. #2969
- `vendor-fetch` command now lists all available packages by default. #2976
- Typekind enums are changed CONST_ENUM -> CONSTDEF, DISTINCT -> TYPEDEF.

### Stdlib changes
- Summarize sort macros as generic function wrappers to reduce the amount of generated code. #2831
- Remove dependency on temp allocator in String.join.
- Remove dependency on temp allocator in File.open.
- Added PEM encoding/decoding. #2858
- Add Murmur3 hash.
- Add optional line-length limitations to `io::readline` and `io::readline_to_stream`. #2879
- Add Xorshiro128++.
- Add single-byte code page support (DOS/OEM, Windows/ANSI, and ISO/IEC 8859).
- Add `array::even`, `array::odd`, and `array::unlace` macros. #2892
- Add discrete and continuous distributions in `std::math::distributions`.
- Add bitorder functions `store_le`, `load_le`, `store_be`, `store_le`.
- Stream functions now use long/ulong rather than isz/usz for seek/available.
- `instream.seek` is replaced by `set_cursor` and `cursor`.
- `instream.available`, `cursor` etc are long/ulong rather than isz/usz to be correct on 32-bit.
- Enable asynchronous, non-blocking reads of subprocess STDOUT/STDERR pipes on POSIX systems.

### Fixes
- Add error message if directory with output file name already exists
- Regression where nested lambdas would be evaluated twice.
- Compiler crash when using arrays of vectors in lists. #2889
- Fix `list[0].i = 5` when `list[0]` returns a pointer. #2888
- Shadowing not detected for generic declarations #2876
- Const inline enums would not always implicitly get converted to the underlying type.
- Update to dstring.append_string to take any type converting to String.
- Flag `--cpu-flags` doesn't work if the first item is an exclusion. #2905
- Reallocating overaligned memory with the LibcAllocator was unsafe.
- Using [] or .foo on $$ functions would not raise error but instead crash
- Improved underlining errors/warnings when unicode is used. #2887
- Fix std::io::Formatter integer issue for large uint128 decimal values.
- `--safe=no` disabled compile-time errors on compile-time known runtime @require checks #2936
- On assert known false, the message was not shown for no-args.
- Adding the incorrect sized vector to a pointer vector would cause a crash.
- Member access on a struct returned by the assignment expression, cause crash #2947
- Trying to slice an indexable type leads to misleading error message #2958
- Warn on use of visibility modifiers on methods. #2962
- Compiler crash using `??` with a `void?` macro #2973
- Fix issue when extending a generic type with a method in another module.

</details>

### Want To Dive Into C3?

Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).

Discuss this article on [Reddit](https://www.reddit.com/r/ProgrammingLanguages/comments/1rfh2ha/c3_0710_constdef_finally_takes_shape/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button).