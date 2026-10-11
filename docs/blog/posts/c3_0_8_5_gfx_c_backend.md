---
title: "C3 0.8.5 - A windowing library and a C backend??"
date: 2026-10-11
tags: ["release", "language-features", "compiler"]
authors:
  - lerno
slug: c3_0_8_5_windowing_c_backend
---

C3 0.8.5 is now available, and we really have some **big** news this time, despite the small version bump. We've added both a standard cross-platform windowing module *and* an experimental C backend(!). 

But let's look at them one at a time. You might ask "Why is C3 adding a windowing library?", so let's try to answer that first:

## What should a standard library contain?

There is no real consensus on what a standard library should contain. When Java added both concurrency and cross-platform graphics to its standard library, that shook up the industry.

Before that, selling graphics libraries was good business. Some compilers bundled their own graphics libraries, which also helped with customer retention.

That said, just as Java's concurrency story had its problems, so did its cross-platform graphics library. Providing an experience that can compete with native UI is *hard*. Java's attempt ended up being something of a cautionary tale. However, Qt, wxWidgets and other libraries still managed to eke out a niche for cross-platform UI—at least until the browserification of apps changed the landscape. Today, native UI is competing with things like Electron and Flutter, and it is far from clear that native is winning.

Java's problems seem to have made language designers reluctant to add anything related to graphics. To some extent, this is reasonable: a UI abstraction necessarily makes a lot of *assumptions* about operating systems and user needs. C++ had a proposal for 2D graphics in its standard library, but it was not adopted for similar reasons.

So should there be nothing? If we look at the C++ discussions, one idea floated was something much narrower: functionality for creating windows, drawable surfaces, and handling user input. And if we look at almost any cross-platform graphics library, this is really the common substrate needed.

### Enter `std::gfx`

So in C3, this is exactly what we're building. `std::gfx` handles windows, input, monitors, the clipboard and drag-and-drop, but leaves the drawing to you. It gets you to the point where you have a window and everything needed to render into it—and then it gets out of the way.

```c3
module hello;
import std;

fn void main()
{
	gfx::init("Hello")!!;
	defer gfx::finalize();
	GfxWindow* win = gfx::create_window("Hello", 200, 200, 900, 600)!!;
	defer win.destroy();

	while (!win.should_close())
	{
		if (try e = gfx::wait(gfx::WAIT_FOREVER))
		{
			switch (e.type)
			{
				case WINDOW_CLOSE: 
				    return;
				case KEY_PRESSED:
				    if (e.key.value == ESCAPE) return;
					if (e.key.value == F) win.set_fullscreen(!win.is_fullscreen());
				default:
				    break;
			}
		}
	}
}
```

It runs on Windows, macOS, Linux and BSDs (using Wayland or X11) and in the browser through Emscripten. Wayland support includes the `wlr-layer-shell` protocol.

For rendering, you can create OpenGL or EGL contexts, Vulkan or WebGPU surfaces, a DirectX swap chain on Windows, or a Metal layer on macOS. Alternatively, you can display a plain pixel buffer using `GfxWindow::blit_surface`.

That might sound like fairly limited functionality, but implementing it is a substantial undertaking. `std::gfx` already contains more than 15,000 lines of code, with the X11 and Wayland backends alone accounting for nearly 6,000.

For anyone writing a cross-platform library or application, that is a lot of platform-specific work before the actual rendering can even begin. It is also notoriously difficult to test every backend thoroughly and ensure that it behaves well across all supported platforms.

By making this a part of the standard library, the library will see much broader use, and will consequently be able to shake out many more bugs than an independent C3 library could. It also establishes a set of common types, making interoperability between libraries easier.

And so a word of caution: `std::gfx` is brand new, and while it lives in `std::gfx` rather than `std::experimental`, it should be treated as experimental until 0.9.0. The module is still alpha, and we will want to tweak the API to be butter-smooth.

## The other big thing: an experimental C backend

Having a C backend has long been a goal for C3, but little progress had been made until [Manu Linares](https://manulinares.github.io) decided to give it a go. 

Now, after a lot of hard work, the compiler can emit C instead of going through LLVM, using `--backend=c`. 

The generated C is then built with the C compiler that c3c already knows about (set it with `--cc`), and extra flags for that compiler can be passed using `--cflags`:

```
c3c compile --backend=c --cflags "-std=c23" hello.c3
```

To be clear, the C backend is still **pre-alpha**, and nowhere near parity with the LLVM one. The source has a list of known problems, and the list is still long.

A few of the more important ones:

- Safe mode checks are mostly missing: slice and array bounds, null dereferences, division by zero and enum ranges are not checked, and panic messages are dropped.
- `@section` and `@noinline` are ignored.
- Some builtins, like `$$sysclock` and `$$breakpoint`, don't work.

The test suite runner takes `--backend` as well, so the existing tests can be run against both backends.

So why do we need a C backend? It allows C3 to target platforms not supported by LLVM, as well as environments where you are contractually required to use a particular vendor-provided C or C++ compiler.

Treat this backend as something to experiment with, and please report what you run into.

## Language changes & improvements

### `$feat` takes the same expressions as `@feat`

`@feat` has been able to combine features with `!`, `&`, `|` and parentheses, or to list alternatives separated by commas. `$feat` now accepts exactly the same syntax, so a feature condition can be written the same way no matter where it appears:

```c3
const String PLATFORM = $feat(MACOS & AARCH64, LINUX | WIN32) ? "listed" : "not listed";
```

As with `@feat`, a comma-separated list means "any of these".

### `@section` on local statics

Static variables declared inside a function can now be placed in a named section, just like globals:

```c3
fn int counter()
{
	static int calls @section(".counters");
	return ++calls;
}
```

### Keyword clean-up

In 0.8.3, a set of alternative keywords was added as an experiment. Three of them have now been removed: `cenum` (for `constset`), `faultset` (for `excuse`) and `distinct` (for `typedef`).

`constdef`, `attrdef` and `faultdef` still work, and `constset`, `attrmacro` and `excuse` are what the documentation and the grammar use from now on.

### Cross-compiling for Windows: fetching MSVC headers

`c3c fetch-sdk windows` has until now downloaded the libraries needed to link Windows binaries. With `--fetch-headers` it also downloads the C and C++ headers, so that they are available for cross-compiling with a C compiler:

```
c3c fetch-sdk windows --arch x64 --fetch-headers
```

### Smaller binaries: `--function-sections` and `--data-sections`

`--function-sections` places every function in its own section, and `--data-sections` does the same for global variables. This allows the linker to discard whatever turned out to be unused, in the same way as `-ffunction-sections` and `-fdata-sections` do in C compilers.

```
c3c compile --function-sections=yes --data-sections=yes -o app main.c3
```

### Build fixes

- `C3_LLD_DIR` was only taken into account for static builds of the compiler. It's now also used when linking LLD dynamically.
- `compile-run` when cross compiling to Windows from a POSIX host looked for the executable using backslashes, and failed to find it.
- The compiler's virtual memory handling was reworked, which also resolved a NetBSD issue.

## Standard Library Updates

### Reference types: `NonNull` and `Nullable`

`std::collections::ref` adds two pointer wrappers that move nullability into the type:

- `NonNull{Type}` is a pointer asserted never to be null. It converts implicitly to `Type*`, and the invariant is checked in safe builds.
- `Nullable{Type}` is a pointer that may be null. It can't be converted to a `Type*` or dereferenced. Instead, every accessor returns an optional, so the type checker makes you handle the null case in every build.

```c3
int x = 42;
NonNull{int} nn = ref::nonnull(&x);
Nullable{int} n = nn.to_nullable();

if (try p = n.get()) *p = 7;             // checked access
int v = n.value() ?? -1;                 // or fall back to a default
NonNull{int} back = n.to_nonnull()!!;    // narrow again, as an optional
```

### Operating system bindings

- The macOS bindings were reorganized by framework and split into `std::os::darwin` and `std::os::macos`. The bindings have been expanded and Objective-C message dispatch has been made easier to work with.
- The Win32 bindings were reorganized by header and gained many functions.
- Dynamic libraries can now be loaded the same way on every platform, using `DylibHandle`, `os::dlopen`, `os::dlsym` and the related functions in `std::os`.
- The POSIX libc bindings add `shm_open`, `shm_unlink`, `truncate` and `ftruncate`, and the Linux socket bindings gained the missing `MSG_*` flags.

### Time and numbers

`Duration` arithmetic and the `Time` operations now use saturating maths: a duration or time that would overflow is capped at `long::max` or `long::min` instead of wrapping around. To go with it, there's `time::FOREVER_PAST` next to `time::FOREVER`, plus an expanded set of "diff" methods.

There's also `Duration.to_sec`, `double.is_inf` and `float.is_inf`, and the new `IntRect`, `IntVec2`, `IntVec3` and `IntVec4` types.

## Fixes

Most fixes this time are in compile-time evaluation, operator overloading and vectors:

- `!=` overloaded on structs behaved as `==`, and arrays or slices of structs with an overloaded `==` compared as equal regardless of content. #3547
- The wrong subscript operator overload could be selected when calling a method on the result. #3499
- Vectors created from a cast in a global initializer, e.g. `Foo global = { .v = (int[<3>])8 }`, would miscompile.
- Vectors created from designated initializers with trailing zeroes were lowered incorrectly. #3557
- Macros with `const` declarations were folded at compile time even when the declaration was needed.
- `@nostrip` was dropped on optimized code if no use of the declaration was found, and wasn't accepted on static variables. #3500
- A segfault when unifying ternary types through lazily resolved function pointer types. #3552
- `@swap` now works with arguments that aren't "pure".
- A regression for `vec.pow(x)`.
- `$$bswap` now supports all power-of-two integer sizes, including single bytes, where it's a no-op.
- Source locations for byte literals continued on a new line were wrong.

## Thank yous

I want to especially thank Riley Mabb, the author of [RGFW](https://github.com/ColleagueRiley/RGFW). The std::gfx implementation used RGFW 2.0 as a starting point, and it helped immensely.

Manu Linares has contributed an exceptional amount, not just the C backend, but a lot of testing and fixes on std::gfx, not to mention creating the new C3 [playground](https://play.c3-lang.org).

Again, this release wouldn't have been possible without the C3 community. I'd like to offer my deep thanks to everyone who contributed through code, issue reports, testing, and discussions.

## PR contributors for this release

**Stdlib:**
hchac, Manu Linares, Mathis Laroche.

**Compiler & toolchain:**
Fernando López Guevara, LowByteFox, Manu Linares, Michael Pollind, SMFloris. 

**CI/Infrastructure:**
Darvisim, Manu Linares.

## Change Log

<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- Fetching MSVC also optionally fetches C/C++ headers for cross-compilation
- Experimental C backend.
- Allow the `@section` attribute on local static variables.
- Make `$feat` accept the same syntax as `@feat`.
- Added `@asmname`, which is similar to `@cname` but does not add any normal name-prefixing on targets where that is normal (such as MachO).
- Add `--function-sections` and `--data-sections` (`function-sections` / `data-sections` in project.json) to place each function or global variable in its own section, so the linker can discard unused ones #3051.
- Removed experimental support for `cenum`, `faultset` and `distinct` alternative names.
- Docs now use the `constset`, `attrmacro` and `excuse`.
- The static Linux binary now uses mimalloc for faster codegen and is aliased to `c3-linux.tar.gz`.

### Fixes
- Regression for `vec.pow(x)`.
- Macros with "const" declarations were compile time folded despite needing the declaration.
- Vectors created through casts in globals would miscompile, e.g. `Foo global = { .v = (int[<3>])8 }`.
- Support $$bswap for all power of two integers, including single bytes (in which case it is a no-op).
- Fix source locations for byte literal values continued on a new line.
- Faulty selection of subscript operator overload when calling method #3499
- Retain `@nostrip` on optimized code even if no use is found, static variables may now also have nostrip. #3500
- `!=` overloads on structs behaved as `==` #3547.
- Multi-dimensional array comparisons on types with `==` overloaded would not compare.
- Lazy resolution of function pointer types could cause a segfault when unifying ternary types. #3552
- `@swap` now works with non-pure arguments.
- Incorrect lowering of vectors when created from designated initializers with zeroes at the end.

### Stdlib changes
- Added `std::gfx` module.
- Added `IntRect`, `IntVec2`, `IntVec3` and `IntVec4` types.
- Updated organization of the MacOS / Darwin bindings, reorganized by framework, added many functions and split into std::os::darwin and std::os::macos, with among other things easy ObjC dispatch.
- Updated win32 bindings with many functions, reorganized by header.
- Cross-platform dylib handling with `DylibHandle`, `os::dlopen`, `os::dlsym` and related functions in `std::os`.
- Added `Duration.to_sec`
- Updated POSIX libc with `shm_open`, `shm_unlink`, `truncate` and `ftruncate`.
- Add `NonNull` and `Nullable` types for members with mandatory null checks.
- Cap durations and time to long::max/long::min with saturating maths.
- Added `time::FOREVER_PAST`, `Time::diff_years`, `Time::diff_months`, `time::day`, `time::week`, `time::month`, `time::year`.
- Added `double.is_inf`, `float.is_inf`.

</details>

## Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).