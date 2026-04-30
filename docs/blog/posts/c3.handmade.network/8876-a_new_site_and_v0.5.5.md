---
title: "A new site and v0.5.5"
date: 2024-03-18
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8876-a_new_site_and_v0.5.5](https://c3.handmade.network/blog/p/8876-a_new_site_and_v0.5.5)*

Another month and another C3 0.5.x release (read the 0.5.4 announcement [here](https://c3.handmade.network/blog/p/8864-c3_0.5.4_is_out)), grab it here: <https://github.com/c3lang/c3c/releases/tag/v0.5.5>. As work on 0.6.0 is underway, 0.5.5 contains much fewer language updates, and instead mostly contains bug fixes.

In other news, the C3 site has gotten a face-lift: <https://c3-lang.org>. It's still a work in progress with more extensive guides planned.

For 0.5.5 the biggest feature is the new `@link` attribute. It works similar to [#pragma comment(lib, ...)](https://learn.microsoft.com/en-us/cpp/preprocessor/comment-c-cpp?view=msvc-170) supported by MSVC and Clang.

```
module std::os::macos::cf @link(env::DARWIN, "CoreFoundation.framework");

// Use of any functions in this module section
// will implicitly link the CoreFoundation framework

...
```

While library dependencies still can be specified in project and library settings, this features allows fine grained dependency tracking, avoids superfluous linking. You link what you use, not more.

0.5.5 sees a lot of important fixes, such as the broken `output` directory setting for projects (and fixes the
project template for the corresponding setting!)

The standard library has gotten `new_aligned` and `alloc_aligned` as `new` and `alloc` would not work correctly on over-aligned types, such as vectors wider than 16 bytes. In `mem` copy/clear/set functions now has a
separate `inline` variant, which is important as `inline` requires a compile time length.

Previously aligned alloc using libc would have an extra overhead to support it, but now on POSIX and Windows native aligned allocations are used, avoiding this problem.

Here is the full change list:

#### Changes / improvements

* Disallow multiple `_` in a row in digits, e.g. `1__000`.
* Added `@link` attribute.
* New 'linker' build option.
* "linker" project setting updated, "system-linker" removed.

#### Fixes

* Struct/union members now correctly rejects members without storage size #1147.
* `math::pow` will now correctly promote integer arguments.
* Pointer difference would fail where alignment != size (structs etc) #1150
* Fixed array calculation for npot2 vectors.
* `$$memcpy_inline` and `$$memset_inline` fixed.
* `.$Type = ...` and `.$foo = ...` now works #1156.
* `int.min` incorrect behaviour #1154.
* Bitstruct cast to other bitstruct by way of underlying type would fail #1159.
* Bug in `time.add_seconds` #1162.
* Remove initial './' in Win32 paths when running a binary.
* 'output' directory for projects was incorrect in templates.
* Regression: no stacktrace.
* For MacOS, running with higher optimization would crash as initializers were removed.
* `compile-run` and `run` now returns the proper return code.
* Allow String constants -> ichar\*, and allow integer pointers to explicitly convert between unsigned signed.
* Bug in unaligned return value lowering for Aarch64.

#### Stdlib changes

* Added `new_aligned` and `alloc_aligned` functions to prevent accidental under-alignment when allocating simd.
* Fixes to realloc of aligned allocations
* Use native Windows calls on aligned allocations on Windows.
* mem::copy\_inline, mem::clear\_inline and mem::set\_inline added.
* mem::copy / clear / set no longer has an `$inline` attribute.
* Native aligned libc malloc on Windows & POSIX.
* Simplification of the allocator interface.
* CoreFoundation only linked on MacOS when used.

0.5 has feature stability guarantees, so code written for 0.5.0-0.5.4 will work with 0.5.5.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>

## Comments


---
### Comment by Christoffer Lernö

Another month and another C3 0.5.x release (read the 0.5.4 announcement [here](https://c3.handmade.network/blog/p/8864-c3_0.5.4_is_out)), grab it here: <https://github.com/c3lang/c3c/releases/tag/v0.5.5>. As work on 0.6.0 is underway, 0.5.5 contains much fewer language updates, and instead mostly contains bug fixes.

In other news, the C3 site has gotten a face-lift: <https://c3-lang.org>. It's still a work in progress with more extensive guides planned.

For 0.5.5 the biggest feature is the new `@link` attribute. It works similar to [#pragma comment(lib, ...)](https://learn.microsoft.com/en-us/cpp/preprocessor/comment-c-cpp?view=msvc-170) supported by MSVC and Clang.

```
module std::os::macos::cf @link(env::DARWIN, "CoreFoundation.framework");

// Use of any functions in this module section
// will implicitly link the CoreFoundation framework

...
```

While library dependencies still can be specified in project and library settings, this features allows fine grained dependency tracking, avoids superfluous linking. You link what you use, not more.

0.5.5 sees a lot of important fixes, such as the broken `output` directory setting for projects (and fixes the
project template for the corresponding setting!)

The standard library has gotten `new_aligned` and `alloc_aligned` as `new` and `alloc` would not work correctly on over-aligned types, such as vectors wider than 16 bytes. In `mem` copy/clear/set functions now has a
separate `inline` variant, which is important as `inline` requires a compile time length.

Previously aligned alloc using libc would have an extra overhead to support it, but now on POSIX and Windows native aligned allocations are used, avoiding this problem.

Here is the full change list:

#### Changes / improvements

* Disallow multiple `_` in a row in digits, e.g. `1__000`.
* Added `@link` attribute.
* New 'linker' build option.
* "linker" project setting updated, "system-linker" removed.

#### Fixes

* Struct/union members now correctly rejects members without storage size #1147.
* `math::pow` will now correctly promote integer arguments.
* Pointer difference would fail where alignment != size (structs etc) #1150
* Fixed array calculation for npot2 vectors.
* `$$memcpy_inline` and `$$memset_inline` fixed.
* `.$Type = ...` and `.$foo = ...` now works #1156.
* `int.min` incorrect behaviour #1154.
* Bitstruct cast to other bitstruct by way of underlying type would fail #1159.
* Bug in `time.add_seconds` #1162.
* Remove initial './' in Win32 paths when running a binary.
* 'output' directory for projects was incorrect in templates.
* Regression: no stacktrace.
* For MacOS, running with higher optimization would crash as initializers were removed.
* `compile-run` and `run` now returns the proper return code.
* Allow String constants -> ichar\*, and allow integer pointers to explicitly convert between unsigned signed.
* Bug in unaligned return value lowering for Aarch64.

#### Stdlib changes

* Added `new_aligned` and `alloc_aligned` functions to prevent accidental under-alignment when allocating simd.
* Fixes to realloc of aligned allocations
* Use native Windows calls on aligned allocations on Windows.
* mem::copy\_inline, mem::clear\_inline and mem::set\_inline added.
* mem::copy / clear / set no longer has an `$inline` attribute.
* Native aligned libc malloc on Windows & POSIX.
* Simplification of the allocator interface.
* CoreFoundation only linked on MacOS when used.

0.5 has feature stability guarantees, so code written for 0.5.0-0.5.4 will work with 0.5.5.

If you want to read more about C3, check out the documentation: <https://c3-lang.org> or download it and try it out: <https://github.com/c3lang/c3c>