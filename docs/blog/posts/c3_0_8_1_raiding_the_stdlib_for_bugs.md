---
title: "C3 0.8.1 Raiding the stdlib for bugs"
date: 2026-06-10
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
slug: 0_8_1_raiding_the_stdlib_for_bugs
---

"Bug fixes" is probably the least exciting thing you can lead with, but after 0.8.0 settled things in the language, it was natural to spend 0.8.1 hunting bugs.

Quite a few were found: over 100 fixes landed — most being corner cases, but a few are real, including a textbook Zip-Slip vulnerability in the zip extractor(!).

Outside of compiler development, there's also been significant progress on the specification [here](https://c3-lang.org/implementation-details/specification/), which is necessary for C3 to be able to sign off on 1.0 in two years.

## Language changes

### Access refected fields using `a.$field` and `a.$field = b`. 

Previously, you could mutate and access fields on a struct by using `$field.get(struct_value)` and `$field.set(struct_value, new_field_value)`. This is replaced by a much more streamlined `struct_value.$field` and `struct_value.$field = new_field_value` with the old variants deprecated:

```c3
struct Foo
{
    int i;
    bool b;
}

fn void test()
{
    var $field = $reflect(Foo.i);
    Foo f = { 45, true };
    // 0.8.0 prints 45
    io::printn($field.get(f)); 
    // 0.8.1 prints 45
    io::printn(f.$field);
    // 0.8.1 alternative syntax, also prints 45
    io::printn(f.$eval($reflect(Foo.i)));
    
    // 0.8.0 sets f.i to 44
    $field.set(f, 44); 
    // 0.8.1 sets f.i to 44
    f.$field = 44;
    // 0.8.1 alternative syntax
    f.$eval($reflect(Foo.i)) = 44;
}
```

### Access to project path at compile time

`env::PROJECT_PATH` now returns the path to the project at compile time. This is mainly useful with `$embed` and similar compile time commands.

### `$vaarg[^1]` supported

```c3
macro foo(...)
{
    // 0.8.0
    var x = $vaarg[$vaarg.len - 1];
    // 0.8.1 – with ^ support
    var x = $vaarg[^1];
}
```

## Stdlib changes

### Changes to API:

- `LinkedHashMap` renamed `OrderedMap`, `LinkedHashSet` renamed `OrderedSet`. Old names are deprecated.
- Enhanced `path::ls` functionality: it now supports wildcard search.
- `ini::parse` and related take an `error_line` argument to identify the line with error.
- Stricter JSON marshaling: it will return INVALID_NUMBER when encountering an inf or NaN for a float, and reject `1.` literals.
- `@loop_over_ai` would leak fds, deprecated and replaced by `@loop_over_addresses`.
- `spawn` now allows binding I/O and using different settings per pipe.
- `io::write_all` now retries on incomplete writes.
- `FixedThreadPool` and `ThreadPool` are deprecated; they will be replaced by a new thread pool in a later 0.8.x version.

### Additions to the stdlib

#### Concurrency & Threads

The `BufferedChannel` and `UnbufferedChannel` both gained non-blocking push/pop, using `try_push` and `try_pop`. In addition, `UnboundedChannel` was added. Such a channel will grow on demand, unlike `BufferedChannel` which has a fixed size.

This release also offers a preview of `ThreadGroup` for running tasks in parallel and collecting the results.

#### Platform support

`libc::errno` is now available on FreeBSD.

#### Compile time

The new `values::expand` macro turns strings containing expressions into values. This can be useful in some cases, as `$reflect` only creates statements.


## Fixes

The 0.8.1 release contains over 100 fixes to stdlib, almost exclusively on the stdlib. The vast majority are stdlib corner cases.

The largest category is **encoding and parsing**: UTF-8/16/32 conversion edge cases (BOM handling, surrogate pairs, length detection), JSON's float precision and surrogate pair handling, varint signed-integer round-trips, base32/base64/codepage encoders that leaked memory on error, and PEM parsing on malformed input.

**Memory management** got a sweep. BackingArenaAllocator, DynamicArenaAllocator, OnStackAllocator, and the Vmem temp allocator each had at least one bug in a realloc, calloc, or destroy path. `SortedMap` had a possible array overflow. `Deque.free` didn't reset capacity, leaving the struct in a state that crashed on reuse. Wasm allocation could over-reserve unnecessarily.

**Threading and synchronization** got a check too: `__atomic_compare_exchange` had an incorrect implementation, `lock_timeout` on POSIX would sleep the full requested duration on every retry, the `stack_size` setting for thread creation was ignored on POSIX, and thread priority on Win32 was off by one. `UnbufferedChannel` could yield unpredictable values because its memory wasn't zeroed at creation.

**Security**: the Zip extraction code had a textbook Zip-Slip vulnerability — a malicious archive could write outside the target directory via `..` components, absolute paths, or sibling-prefix paths in entry names. Fixed with up-front rejection of obviously-bad names plus a post-normalization containment check.

A handful of small correctness fixes touched types people use every day: `DateTime.diff_years` now handles leap years correctly, `DString.replace` handles empty needles and uninitialized strings without crashing, `Formatter` saturates instead of overflowing on absurd widths like `%2147483648d`, the URL parser stopped failing on `user@host` form and stopped silently dropping ports from bracketed IPv6 hosts, and `process::run_capture_stdout` no longer strips a character from output that doesn't end in `\n`.

Most of these are invisible if you've been using C3 successfully as they tighten the code paths nobody normally hits. But the stdlib now does the obviously right thing in considerably more corners than it did in 0.8.0.

## Summarizing

To summarize: 0.8.1 is basically a stdlib release. Over 100 fixes — most are corner cases, a few are real (the Zip-Slip vulnerability in the zip extractor being the most notable). The user-visible additions worth a look: `UnboundedChannel`, `try_push`/`try_pop` on the existing channels, and a preview of `ThreadGroup`. The old `FixedThreadPool` and `ThreadPool` are deprecated; replacements are planned for later in 0.8.x.

So, same language as 0.8.0, just a bit sturdier library under it.

## Thank yous

Again, this release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

### PR contributors for this release

**Stdlib:**
Alexandru Paniș, as2te, cmann1, Elusive239, Eugene Blikh, Fernando López Guevara, Johannes Müller, Kevin Hovsäter, Manu Linares, Maxine Bonnette and Zathyy

**Compiler & toolchain:**
Akshat, Book-reader, Fernando López Guevara, Johannes Müller, Kevin Hovsäter, Manu Linares and Matthew Nagy

**CI/Infrastructure:**
Fernando López Guevara, Manu Linares and plapinski

### Change Log
<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- Add `$$PROJECT_PATH`, accessible through `env::PROJECT_PATH`.
- Deprecate `$field.get(a)` and `$field.set(a, b)`. Replaced by `a.$field` and `a.$field = b`.
- Add `a.$eval($field)` as a variant of `a.$field`.
- Add JSON pretty print.
- `$$atomic_store` and `$$atomic_load` take an alignment parameter.
- `$vaarg[^1]` is supported. #3276
- Improve error message when a keyword is used as a block parameter. #3275
- Correct tag method error messages from `tagof`/`has_tagof` to `get_tag` and `has_tag`
- Don't resume parsing when implicit module names yield invalid names.

### Stdlib changes
- Add math::TAU / math::TWO_PI
- Add `values::expand` to turn strings containing expressions into values.
- Enhanced `path::ls` functionality, like searching for wildcard.
- `LinkedHashMap` renamed `OrderedMap`, `LinkedHashSet` renamed `OrderedSet`. Old names are deprecated.
- Added initial cpudetect on Linux / MacOS Aarch64.
- Enable libc::errno for FreeBSD.
- Checking filesize on Win32 now correctly reports errors. Getting the filesize now rejects directories.
- `ini::parse` and related takes an `error_line` argument to identify the line with error.
- JSON marshaling will return INVALID_NUMBER when encountering an inf or NaN for a float.
- JSON decoding will reject `1.` literals.
- `spawn` now allows binding I/O and using different settings per pipe.
- `@loop_over_ai` would leak fds, deprecated and replaced by `@loop_over_addresses`.
- Correctly return error on native_fwrite and native_fread.
- Prevent infinite spin on `io::read_fully`, `File.load_buffer`, `File.load` and `File.save`.
- `io::write_all` now retries on incomplete writes.
- `GrowableBitSet.max_bit_set` added.
- Added `UnboundedChannel`.
- `BufferedChannel` and `UnbufferedChannel` get non-blocking push/pop.
- `FixedThreadPool` and `ThreadPool` deprecated.

### Fixes
- `@volatile_store` on arrays were sometimes incorrectly lowered.
- NPOT vectors as associated variables were incorrectly lowered on load. #3228
- `.get_tag` and `.has_tag` did not work properly for globals and locals.
- Vectors stored in unions lowered incorrectly causing an assert #3234
- Segmentation fault during library fetch when the "dependencies" key is missing in project.json. #3233
- `.tags` would crash if no attribute with arguments were present.
- `Rect.merge_point` would sometimes result in a point outside of the rect.
- Possible array overflow in `SortedMap`.
- Possible memory overwrite in BackingArenaAllocator on realloc.
- Realloc could cause data corruption in DynamicArenaAllocator.
- OnStackAllocator would not correctly clear memory on calloc.
- Vmem temp allocator would not correctly free all vmem on destroy.
- Wasm memory allocation could overallocate unnecessarily.
- VirtualMemory contract off by one error.
- CPU detect of leaf7 on x86 incorrect.
- Fixed project benchmark target parsing. #3237
- Incorrect type on `UIntLE` and `UIntBE`.
- CVaList would behave different incorrectly for types larger than 8 bytes on some platforms.
- UTF32 BOM detection was broken.
- Sort from DString.less was inconsistent.
- Fix io::skip using 'read' vs 'read_byte', causing an error.
- `Slice2d.slice` incorrectly handled slices with x/y offset and 0/negative length together.
- `String.to_integer` incorrectly accepted some invalid characters for hex.
- Removed broken `StringIterator.get`.
- Fix to refcount behaviour, preventing issue on release.
- `File.close` should always invalidate the pointer on close, even on failures.
- Overlong conversions to unicode for `%c` at boundaries.
- Do not rely on implicit allocation for getcwd.
- Skipping symlinks wasn't properly implemented for Win32.
- Reverse indexing a value that overloads indexing would index an anonymous copy of the value.
- Fix case where member.set would hit an assert.
- Same type casts would not become rvalues.
- Hex decoding would leak memory on failure.
- `Codepage.by_name` would not use normalized name.
- `@return? bar!` didn't work if the identifier matched a macro.
- Copying compile time strings during compile time folding with strings containing 0 would sometimes get truncated. #3267
- Pem parsing did not correctly handle an empty body, nor when the first line was too short.
- Additional pem parsing bugs on malformed data handled.
- Compiler would crash when getting the `kind`, `qname`, or `alignment` of an `untypedlist`.
- `untypedlist` incorrectly had `size` property.
- JSON handling of UTF16 surrogate pairs fixed.
- `base32`, `base64` and `codepage` would leak memory on encode/decode errors.
- Indexing into a type with a `$reflect` value would sometimes cause a crash.
- Using a faultdef hidden behind `@if` would cause a crash.
- Taking the type of a macro method would cause a crash.
- Cap array size to avoid overflow when making multidimensional arrays that are too large.
- DynamicArenaAllocator would incorrectly handle some reuse cases.
- `__atomic_compare_exchange` had an incorrect implementation.
- `channel::create_unbuffered` would not correctly zero out memory, potentially yielding unpredictable results.
- `lock_timeout` on Posix would sleep the entire sleep before retrying, and it would fail if it managed to sleep.
- `stack_size` setting for threads was ignored on Posix.
- Setting thread priority on Win32 was off by one.
- Non-power-of-two-sized member of @bigendian bitstruct backed by char array wasn't working #3283.
- Binary bitwise operations were not considered simple.
- `$expand` was incorrectly made generic in generic modules. #3274
- Mangle lambdas in macros without `@` to ensure they work correctly on elf #3217.
- `DString.replace("", "X");` would crash.
- `DString.read_from_stream` would not return the correct length when `available` was not supported by the stream.
- `@str_camelcase` would yield same result as `@str_pascalcase`. #3287
- `conv::utf8to32` would not zero terminate when the zero would be at the end of the buffer.
- `char16_to_utf8_unsafe` would not load low byte unaligned when required.
- Not all invalid UTF8 was detected.
- UTF16 length detection was incorrect for utf16 with surrogate pairs.
- Initializing a variable which has the type of an optional struct using a const value would fail codegen. #3288
- Parsing a malformed hex float would not correctly get reported.
- Parsing an integer with trailing space would incorrectly be reported as an error.
- `String.escape` used the incorrect default for stripping quotes.
- mem::equals would not correctly compare slices of with element size > 1.
- `AsciiCharset.contains` incorrectly handled char > 127.
- Reuse of recently freed DynamicArenaAllocator allocations failed.
- Crash in codegen in some cases when RHS of a `&&` or `||` was unreachable at lowering.
- Visibility modifiers were incorrectly allowed on enum/constdef members.
- Datetime format could not handle negative offsets with non-zero minutes.
- NormalDist.random could occasionally return inf.
- Url parser would fail on `foo@bar.com`.
- Url parser would drop the port on `http://[::1]:8080`.
- Ipv6 classification - is_link_local etc, was incorrect
- env::get/set_var for Win32 would appear to fail when succeeding.
- env::get_var had a race condition on Win32.
- process::run_capture_stdout would remove the last character, even when it wasn't `\n`.
- Add missing `__powisf2` to compiler_rt.
- `//` would count newlines twice when parsing JSONC.
- `Path::for_posix(".a/..")` was not parsed correctly.
- `SortedMap.clear` and `SortedMap.free` would work incorrectly on map initialized with ONHEAP.
- `GrowableBitSet` would yield the wrong length.
- `GrowableBitSet` would not work correctly on backing types bigger than uint.
- `DString.replace` would not work correctly in some cases.
- `ByteWriter.ensure_capacity` did realloc unnecessarily when the data exactly matched capacity.
- `DString.equals` used `int` rather than `sz` for len comparison.
- `DString.replace_char` would crash on empty DString.
- `io::read_varint` and `io::write_varint`: handling for signed integers was broken.
- `io::write_tiny_bytearray` and `io::write_short_bytearray` could have incomplete writes.
- Splatting a partially raw array into a macro would miscompile. #3302
- Getting the tag for an enum parameter caused a crash. #3307
- Json marshalling of floats would lose precision.
- Crash when initializing a bitstruct from an untyped list.
- Shifting a vector by a non-numeric type would cause a crash rather than a compiler error.
- Recursive macros were not detected when going by way of a lambda.
- Compile time concatenation with an empty slice was lacking checks, causing a compiler crash.
- Fix zip slip vulnerability.
- Fixed issues with `Object.to_value`.
- `DString.len` was incorrectly marked `@dynamic`.
- Qoi decoder wasn't correctly signaling all invalid data.
- Casting a constant string to a float vector was buggy, causing a compiler crash.
- Codepage detection could fail values after the last element.
- Xml parsing could leak memory if root was preceeded by Pi nodes.
- `DateTime.diff_years` would not handle leap years properly.
- `Deque.free` would not reset the capacity, making it break if later reused.
- `Formatter` would overflow in cases like `%2147483648d`.
- Distributions would drop convergence control setting on recursion.
- In some rare cases `available()` could leave the stream in an unexpected state.

</details>

### Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).