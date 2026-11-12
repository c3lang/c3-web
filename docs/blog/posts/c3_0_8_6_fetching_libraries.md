---
title: "C3 0.8.6 - Let's grab those libraries"
date: 2026-11-12
tags: ["release", "language-features", "compiler"]
authors:
  - lerno
slug: c3_0_8_6_fetching_libraries
---

C3 0.8.6 is now available. The two main features are the revamped library fetch functionality and a target for packaging full-source libraries. It also sees improvements to compilation speed and reduces the binary size of safe-mode binaries by one third. It also contains fixes from a systematic review of casts, vectors and calling conventions.

## Libraries: packaging and fetching

C3 libraries are distributed as `.c3l` files. These are zip archives with C3 sources, headers, prebuilt binaries per target and a `manifest.json`. Until now, we used a stop-gap solution: downloads from the [c3lang/vendor](https://github.com/c3lang/vendor) repository. While this *worked*, it had no support for versioning and created unnecessary friction as well as a single supported source. Packaging libraries was also a manual affair with multiple steps.

The flagship features of 0.8.6 are two new additions to deal with that: a target for building a library from source, a simple repository protocol, versions and checksums.

### Creating a source library

There's a new target type, `source-lib`. It packs C3 source files into a `.c3l`, which can be shipped.

```json
{
  "version": "0.1.0",
  "authors": [ "John Doe <john.doe@example.com>" ],
  "sources": [ "src/**" ],
  "targets": {
    "my_lib": {
      "type": "source-lib"
    }
  }
}
```

`c3c build my_lib` writes `my_lib.c3l` with a generated manifest. A few files can also be packed without a project:

```
c3c source-lib src/my_lib.c3 src/extra.c3 -o my_lib
```

To go with this, a manifest without `targets` now works for every platform, which is what a library made only from source needs, and manifests may contain `version`, `authors` and `langrev`.

### Fetching from a repository

`c3c fetch` adds the ability to download libraries from custom *repositories*, addressed as `<namespace>/<name>[@<version>]`:

```
c3c fetch-list raylib            # search
c3c fetch-info c3lang/raylib6    # versions, checksums, sizes
c3c fetch c3lang/raylib6         # download the latest version
c3c fetch c3lang/sqlite3@1.0.0   # or a specific one
```

Inside a project, the library is installed in the first dependency search path and its name is added to `dependencies`. Libraries are now unpacked into a `<name>.c3l` directory by default. Use `--decompress=no` to keep the zip.

A repository is deliberately basic: it only requires three paths that answer `GET` requests (`index.json`, `info/<namespace>/<name>` and `download/<namespace>/<name>@<version>`). That means any static file host works. The default repository is served directly from a branch of the vendor repository on GitHub. A version may give a `url` that the library is downloaded from instead, so the files themselves can live on GitHub releases. To use another repository, pass `--fetch-url`, or set `fetch-url` in `project.json`.

Every download is verified against the sha256 checksum in the repository, and you can also lock a dependency to an exact checksum, so that a library can't change under you even if the repository does:

```
c3c fetch c3lang/raylib6@1.0.0:d96a68af8dc785ebbc2d7b9f90b024bb5f67829e1d7e890bf1aa5e3f5d794e5b
```

This builds on – and at the same time entirely replaces – `vendor-fetch`, which only supported pulling the latest version of a library from the vendor repository.

### Project dependencies

`dependencies` may now name repository libraries, optionally with a version, checksum and repository URL: `[<url>:]<namespace>/<name>[@<version>][:<sha256>]`. The build itself only uses the name – the rest is for `project fetch`:

```json
"dependencies": [ "c3lang/raylib6@1.0.0", "c3lang/sqlite3" ]
```

`c3c project fetch` without arguments lists what is missing, and with arguments fetches exactly those libraries:

```
$ c3c project fetch
Missing dependencies, fetch them with 'c3c project fetch <library>...':
  raylib6
  sqlite3
$ c3c project fetch raylib6 sqlite3
```

(Note: That `project fetch` doesn't automatically fetch dependencies is a deliberate decision.)

## Smaller binaries in safe mode

In safe mode, C3 checks array bounds, null dereferences, shifts, casts, unwraps and so on, and each check that can fail needs code to report the failure with a message, a file, a function and a line. In 0.8.5 each of those sites built its own message, and this adds up: in a large program there are tens of thousands of them.

In 0.8.6, the code for checks was optimized, and panic functions were created on demand and reused. The effect on executable size was quite substantial: binary sizes were reduced by 30% or more.

### Changes to `PanicFn` and `--panicfn`

To support this, the panic function signature has changed. It now gets a short, always static `summary`, plus an optional format string and its arguments with the details:

```c3
alias PanicFn = fn void(String summary, String file, String function, int line, String fmt, any[] args);
```

If you have your own panic handler, it needs to be updated. `resources/examples/panic_override.c3` shows how.

`--panicfn` also works properly now (#3443). It names a function rather than a function pointer variable, and that function becomes the initial value of `builtin::panic`, so panics from the standard library and `abort` reach it too, not only the ones generated by the compiler.

Finally, the `--panic-msg` and `--show-backtrace` combinations were made consistent: with `--panic-msg=no` you still get the short summary with file, function and line, unless you also pass `--show-backtrace=no`, in which case a failed check just traps.

While the change to the panic function type is, strictly speaking, a break, note that changing the panic function did not quite work properly before this.

## Stricter rules

### Casts

For this release, we did a fairly thorough review of the cast rules as implemented. This unearthed a bunch of corner-case crashes and miscompilations – but also some conversions that were simply too permissive:

```c3
ulong x = -1;          // Error: out of range for 'ulong', just like 'uint x = -1' was
int[3] a;
uint[3] b = a;         // Error: same size signed <-> unsigned in arrays, slices and vectors
                       // now needs an explicit cast, just like 'int' to 'uint'
float16 h = some_bf;           // Error: 'bfloat' and 'float16' no longer convert implicitly
void* p = (void*)some_int128;  // Error: narrow it first, '(void*)(uptr)some_int128'
int i = (int)1e30;             // Error: a constant float that doesn't fit is now a compile error
```

In the other direction, an explicit cast from a slice to a pointer is now allowed for any pointer type, the same way as a cast between pointers.

### `else if` needs braces

C3 has always required `{ }` around the statement of an `else`, but `else if` accidentally didn't (#3473). Now it does:

```c3
if (x == 0)
{
	foo();
}
else if (x == 1) foo(); // Error: An 'else if' must use '{ }' even around a single statement.
```

### Duplicate designated initializers

Initializing the same member twice is now an error rather than silently using the last value (#3579):

```c3
Foo f = { .a = 1, .b = 2, .a = 3 }; // Error: This element is assigned twice in the same initializer.
```

This only applies when the initializer is literally used twice. Other uses, such as struct splatting or using `.$eval(...)`, are not affected. 

## Other compiler changes

### Errors in generic code show where they were instantiated

An error inside generics that only shows up for certain parameters used to be hard to track down, because it didn't say which instantiation caused it (#3588). Now there's a note pointing to it:

```
 11:     self.size += by;
                      ^^
rect.c3:11:15: error: 'float' cannot implicitly be converted to 'int[<2>]', but you may use a cast.

 18: alias IntRect = Rectangle{int};
                     ^^^^^^^^^
rect.c3:18:17: note: Instantiated here.
```

### Compiler statistics with `--stats`

`--stats=summary` prints where the time and memory went during compilation, `--stats=full` adds lists of the largest modules and functions, and `--stats=json` (or `--stats-file`) saves everything as JSON for tooling. This replaces the more ad-hoc `--print-large-functions` and the previous stats.

```
━━ SUMMARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Wall time                   758.1 ms
 Throughput                  133.3 k physical lines/s
 Frontend                    274.9 ms, 36.3 % (initialization, parsing and analysis)
 Codegen wall / thread time  96.8 ms / 351.4 ms
 Effective parallelism       3.63× of 8 threads, 24 tasks
 Arena memory                100.3 MB, upper bound for the peak, LLVM excluded
 Largest phase               Linking, 46.2 % of wall time
 Largest module              std.io, 27.0 % of summed module time
```

### Project files: `depends-on` and environment variables

Targets can now depend on other targets, which are built first, in the listed order:

```json
"targets": {
  "my_lib": { "type": "static-lib", "depends-on": [ "generate" ] },
  "my_app": { "type": "executable", "depends-on": [ "my_lib" ] }
}
```

Strings in `project.json` can use environment variables written as `${NAME}`, and `env` / `env-override` set variables for the `exec` scripts (#3580):

```json
{
  "env": [ "MODE=release" ],
  "targets": {
    "my_target": {
      "type": "executable",
      "cc": "${CC}",
      "linker-search-paths": [ "${SDK_PATH}/lib" ]
    }
  }
}
```

### Smaller things

- `@asmname` sets the exact symbol name, without the platform's C name mangling that `@cname` gets (such as the leading underscore on macOS). This is useful for linker-generated symbols, e.g. `extern char start @asmname("section$start$__DATA$__mysect");`. This is the same as the `asm` attribute in GCC.
- LLVM IR (`.ll`) and bitcode (`.bc`) files can be passed to the compiler, just like `.o` files (#3339).
- `-gline-tables-only` emits only line table debug info.
- Selectors for `@dynamic` methods are now a stable 128-bit value computed from the method name, instead of the address of a symbol that the linker had to merge.
- An empty infinite loop like `for (;;) {}` was compiled as a panic, which in optimized builds could break the code *around* the loop (#3630). It is now a real infinite loop, which is what embedded code waiting for an interrupt wants. The old check is available in safe mode with `--infinite-loop-detect=yes`.
- Paths with non-ASCII characters now work on Windows, both for files and for processes started by the compiler (#3605, #3606).
- An error in one of the compiler's worker threads, such as a failing C file, could crash the compiler (#3584).

## The C backend

The experimental C backend from 0.8.5 has seen a lot of work: it's now about 3× faster, prunes unused types and declarations from the generated C, supports `$$sysclock` and `@asmname`, and fixes many codegen differences with the LLVM backend. There's some work done for compiling the output with the MSVC compiler.

So the backend is still experimental, but progress is being made.

## Standard Library Updates

### Compression and hashing

`std::compression` and `std::hash` got a big round of work:

- `crc32` is much sped up, which also affects things like zip.
- The deflate decompressor was rewritten as a table-driven decoder, giving 2–3× faster decompression.
- `deflate`, `gzip` and `zip` take an optional compression `level`, from `deflate::MIN_LEVEL` (fastest) to `deflate::MAX_LEVEL` (smallest). The default produces the same output as before, and incompressible data is now stored instead of expanded.
- Many `zip` fixes: double close on errors, ZIP64 archives with a comment or exactly 65535 entries, CRC32 verification on `extract`, and more.

```c3
char[] packed = deflate::compress(mem, data, level: 9)!;
```

### Regex

`std::encoding::regex` is faster, and integer overflows in the regex compiler were fixed (CVE-2026-107891). As part of this, the faults and flags were renamed to descriptive names, e.g. `NOMATCH` is now `NO_MATCH` and `ICASE` is `IGNORE_CASE`. `NOSUB` was removed.

### Other additions

- `file::chmod` and `File.chmod`, using `FilePermission` (#3536).
- `file::open_fd` opens a `File` from a file descriptor.
- `List.push`, `insert_at` and `push_front` are faster, and `remove_item` and `compact` are now single pass instead of quadratic. `remove_first` and `remove_last` take an `unordered` parameter.
- Matrices gained `perspective_infinite`, `perspective_reverse_z` and `perspective_infinite_reverse_z`, as well as `column`, `row`, `set_column`, `set_row` and `scale_factors`.
- `math::sign` supports floats.
- `XmlSerializer.add_raw` writes unescaped text.
- OpenBSD gets `libc::termios` support, plus `pledge` and `unveil`.

### `std::gfx`

The new windowing module got a good amount of real-world use and fixes: vsync can now be turned off with OpenGL (#3577), Win32 supports shared OpenGL contexts and respects more pixel format hints, several X11 problems were fixed, as were hidden and transparent mouse cursors, key mappings and mouse wheel deltas on WASM.

## Fixes

A selection of the fixes, the full list is in the change log below:

- ABI: `char`/`ushort` arguments to C functions weren't zero/sign-extended on macOS arm64 (#3593), overaligned structs and HFA/HVA were passed incorrectly on Linux aarch64, and Win64 returned `@simd` vectors through memory instead of `XMM0` (#3628).
- Vectors: `/`, `%` and `>>` on unsigned integer vectors used signed operations, `%` on float vectors was wrong, `v[^i]` with a non-constant `i` wrote the wrong element, `v.xy++` didn't change the vector, and the `$$overflow_*` builtins were lowered incorrectly for vectors.
- Constant folding: `int::min / -1`, `!=` on faults and on global addresses, and the sign of NaN were all folded incorrectly.
- `a += e` on an optional `a` did not assign the fault when `e` was a fault.
- Using a const or an enum associated value from another module that referred to a private symbol could fail to link.
- Instantiating a generic with an anonymous inner struct or union crashed the compiler (#3631), and generic inference failed with optional expected types (#3612).
- `String.escape` returned a truncated result once it outgrew its initial capacity (#3592).
- A regression broke slices and pointers over 2 GB (#3595).
- Loading several C3 dylibs on macOS regressed, and `@finalizer` now runs in the correct order.
- Compiling with the standard library on OpenBSD could produce illegal instructions on some processors (#3563).
- `c3c project fetch` could hang (#3562), and temporary directories were left behind by `compile`, `fetch` and the SDK fetch commands (#3553).

## Upgrading

Most code will compile unchanged, but these changes may require updates:

- `else if` with a single statement needs braces.
- The stricter cast rules. If you relied on undocumented behaviour for negative constants to wider unsigned types, signed/unsigned array, slice and vector conversions and `int128` to pointer, then you might need an explicit cast somewhere.
- Assigning the same member twice in an initializer is an error.
- Custom panic handlers must use the new `PanicFn` signature, and `--panicfn` now names a function.
- `--print-large-functions` is gone, use `--stats=full`.
- The regex faults and flags were renamed.
- `fetch` unpacks libraries into a directory by default, and `project fetch` only fetches the libraries it is given.
- `for (;;) {}` no longer panics.

## Thank yous

As always, this release wouldn't have been possible without the C3 community. Thank you to everyone who contributed code, reported issues, tested, and discussed.

Special thanks to sponsors who went the extra mile: andromeda-fp, Josh Ring and konimarti.


## PR contributors for this release

**Stdlib:**

andromeda-fp, Berat121, Manu Linares, Michael Pollind, Ricardo Tomasi.

**Compiler & toolchain:**
Book-reader, Manu Linares, Michael Pollind, Tonis, yyxxryrx.

**CI/Infrastructure:**
Manu Linares.

## Change Log

<details markdown="1">
<summary>Click for full change log</summary>

### Changes / improvements
- `@asmname` allows defining external names like `@cname` but without normal name mangling.
- Improved GfxKey mappings.
- Add the `source-lib` target type (and `c3c source-lib` command) to pack the C3 sources, C sources and headers of a project into a `.c3l` library.
- `.c3l` manifests without `targets` now work for all platforms, and may contain `version`, `authors` and `langrev`.
- `fetch`, `vendor-fetch` and `project fetch` now unpack libraries into a `<name>.c3l` directory by default. Use `--decompress=no` to keep them compressed.
- `fetch` now verifies the downloaded library against the `checksum` (`sha256:<hex>`) of the registry, and refuses a library that doesn't match.
- `dependencies`, in projects and in library manifests, may name a registry library as `[<url>:]<namespace>/<name>[@<version>]`. The build only uses the name.
- `fetch` adds just the library name to `dependencies`.
- `project fetch` only fetches the libraries it is given: `c3c project fetch <library>...`. Without any, it lists the missing ones. Each must be a dependency of the project, or of a library that is installed. A name uses the path of the dependency, or is looked up in the registry: the `fetch-url` project property or `--fetch-url` for the project's dependencies, the default registry for those of libraries.
- A version in the registry's library info may have a `url`, which `fetch` downloads the library from instead of from the registry itself.
- A registry library can be locked to a checksum: `<namespace>/<name>@<version>:<sha256>`. `fetch` refuses a library that doesn't match.
- An `else if` now requires `{ }` around a single statement, like `else` does. `else if (x) foo();` is an error. #3473
- Add `depends-on` to project targets, allowing them to depend on other targets.
- LLVM IR (`.ll`) and bitcode (`.bc`) files can be added to the compilation, just like .o files #3339
- `project.json` strings (except `exec` and `type`) expand environment variables written as `${NAME}`. #3580
- Add `env` and `env-override` to `project.json`, setting environment variables (`"NAME=value"`) for the `exec` scripts. #3580
- Add `-gline-tables-only` to emit line tables debug info only.
- Disallow `{ .a = 1, .a = 1 }`. #3579
- Add better instantiation error output.
- Implicitly converting a negative constant to a wider unsigned type, e.g. `ulong x = -1;`, is now correctly an error.
- Improved the error when implicitly casting an enum to an integer, it now points to the explicit cast.
- Casting a non-constant integer larger than a pointer, e.g. an `int128`, to a pointer is now an error. Cast it to `uptr` first.
- Converting between signed and unsigned integers of the same size in arrays, slices and vectors, e.g. `int[3]` to `uint[3]`, requires explicit casts.
- `float16` and `bfloat` no longer convert implicitly to each other, as both directions lose information.
- An explicit cast of a slice to a pointer is now allowed for any pointer type, like a cast between pointers.
- Selectors are now a stable 128 bit signature. The first 16 bytes are guaranteed unique.
- Add `--stats=<none|summary|full|json>` for compiler statistics.
- Removed `--print-large-functions`, `--stats=full` replaces it.
- Compiler generated panics will now be emitted to the `std::core::runtime::panics` module.
- `PanicFn` is changed to support both formatting and non-formatted messages.
- `--panic-msg=no` only traps if `--show-backtrace=no` is also set, otherwise it gives the short message with file, function and line. `--show-backtrace=no` stops passing file, function and line.
- `--panicfn` now names a function rather than a function pointer variable, and sets the initial value of `builtin::panic` through the new `$$PANIC_FN`, so stdlib panics and `abort` also reach it. #3443
- Make panic on infinite loops opt-in with `--infinite-loop-detect=yes` – and is only added in safe mode. #3630

### Fixes
- Compressed `.c3l` libraries were not unpacked again when only files other than `manifest.json` had changed.
- Fixed regression for MacOS loading multiple C3 dylibs. `@finalizer` now correctly works in descending order.
- Fix miscompilation for OpenBSD on later processors. #3563
- Polling a GfxEvent for a window and having events on other windows would silently discard the last event.
- Setting no-border state during fullscreen on Win32 would not work properly.
- X11 window destruction order was incorrect.
- Win32 did not support sharing of OpenGL contexts.
- Win32 OpenGL pixel format selection ignored several hints.
- Added `FAILED_TO_CREATE_WGL_CONTEXT` for Win32 WGL format fails.
- Win32 handle would leak on drag-and-drop when dnd was disabled.
- X11 mode change did not change the stored mode.
- X11 window name is now kept when recreating a window for opengl init.
- Doc viewer collision between modules and declarations sharing the same path. #3572
- Fixes to transparent mouse pointer.
- Compiler crashes when using a value derived from a const as an initializer elsewhere. #3574
- Improve OpenGL-handling of vsync.
- Regression for emscripten, accidentally retainin unused panic functions. #3575.
- Compiler hangs on c3c project fetch #3562
- Temp dirs were left behind by `c3c compile` (including unpacked `.c3l` libraries), `fetch-list`, `vendor-fetch` and the SDK fetch commands, in particular after errors. #3553
- Fix integer overflow vulnerabilities in regex compiler (CVE-2026-107891). #3585
- Compiler crashes when emitting line-tables debug info. #3581
- Do not pass PIE/PIC on Windows. #3586
- Crashes in slice->vector and ptrvec->intvec conversions.
- Implicit cast rules too loose for slice->arrptr.
- Invalid lowering for `(Bitstruct)-1` where the bitstruct is backed by an unsigned type.
- Cast to `any` from typedef with an underlying inline pointer, would cause a crash.
- Cast from constant `bool[<2>]` to `float[<2>]` would crash.
- Padding would be incorrectly lowered in things like `(char[<8>])(char[8])"abc"`.
- Const casting a const slice derived from a zero array initializer (e.g. `(bool)(int[])(int[3]){}`) would incorrectly return false.
- Casting a constant to an alias to an enum would be incorrectly checked.
- Cast to aliased bitstruct would fail when non-aliased cast would succeed.
- Casting an optional distinct index would incorrectly fail.
- Aarch64 MacOS did not zero/sign-extend args (and Win32 Aarch64 incorrectly did). #3593
- Overaligned structs were not passed correctly on Linux Aarch64.
- Add alignstack for Linux Aarch64 ABI for correct HFA/HVA handling.
- `string::unescape` and `string::escape` would not work correctly after initial size was reached. #3592
- `$defined` on an untyped list that cannot be converted, e.g. `$defined(int[*] y = $list)` with `var $list = { 1, "a" };`, would print an error instead of being false.
- An empty constant string could not be converted to an array, e.g. `char[4] x = "";`.
- A constset inlining a constset that in turn inlines a third one, could not be implicitly converted to the one in the middle.
- `$defined` on an implicit pointer conversion was true for pointers to distinct types, and printed an error instead of being false when the pointee alignment would increase.
- Casting a `typeid` or `fault` to a wider signed integer, e.g. `(int128)t`, would sign extend instead of zero extend.
- An implicit cast between unrelated distinct types would report the error twice.
- The hints in cast errors (for enums, distinct types, `ZString` and pointers to slices) were missing when the value was optional.
- Casting between `float16` and `bfloat`, also in vectors, would abort the compiler. An explicit cast now converts through `float`.
- Casting a constant float to an integer it does not fit, e.g. `(int)1e30`, `(char)300.5`, infinity or NaN, would abort the compiler or give a wrong value. It is now an error, also for the elements of a constant float vector or array cast to an integer vector.
- An inline distinct signed integer, or an inline constset of one, would implicitly convert to an unsigned integer of the same size, e.g. `uint y = my_inline_int;`, which `int` to `uint` does not allow.
- Explicitly casting a pointer wrapped in an inline distinct type to `any` or an interface was an error, even though the implicit cast worked.
- A struct implementing an interface through an alias, e.g. `struct Foo (IAlias)`, would not convert to the interface, and an interface inheriting through an alias would not convert to its parent.
- Casting an enum to a distinct type over that enum, e.g. `(MyFoo)foo` with `typedef MyFoo = Foo;`, was an error. It is now allowed with an explicit cast, like for a distinct type over an integer.
- Errors in multithreaded compilation tasks, such as a failing `c-sources` file, could crash the compiler. A failing task now aborts the remaining tasks and the compiler exits with an error. #3584
- Fix error message rethrowing in a non-function context.
- Fix name mangling of untyped list.
- `"max-vector-size"` was not whitelisted as a project property.
- In some cases, optional ref was extracted before it was created during LLVM IR codegen #3598.
- Bitstruct method did not check if field with the same name existed #3602.
- Casting a constant string (or constant bytes) to a vector at compile time would cause a crash. #3601
- Support unicode paths on Windows when running processes from the compiler. #3605
- Fixes to i128 compiler_rt.
- Using a const from another module that refers to a private symbol would fail to link in some cases e.g. `static List{int} g = list::ONHEAP{int};`.
- Reading an enum associated value at runtime from another module would fail to link if it referred to a private symbol.
- A function only used in an `@ensure` could be stripped when it wasn't the first statement to run on return, failing to link.
- The sign of constant NaN expressions was ignored during codegen.
- Generic type inference fails with optional expected types #3612.
- Signed shift amounts narrower than the shifted value were zero extended affecting the panic message of an invalid shift amount.
- A function with `@test @benchmark` would effectively never be included.
- Incorrect compiler error using `from_ordinal` when exceeding max.
- Concatenated base64 literals lost decoded bytes after the first chunk.
- Improve accuracy of `log` and `logf` without a C library (wasm32, freestanding, or `-D C3_MATH`).
- 16-byte align JmpBuf on Win32.
- Win64 returned `@simd` vectors through a hidden pointer instead of XMM0. #3628
- Fix regression when slices or pointers exceed 2 GB. #3595
- `XmlSerializer.start_doc` was missing the closing quote after the encoding.
- `XmlSerializer` escaped comments and processing instructions when serializing a document.
- `gfx::get_vulkan_physical_device_presentation_support` was broken.
- `argon2::tencode` took `key_id` as a `char` instead of a `char[]`.
- The libc allocator was incorrectly declared in `std::core::mem::allocator`.
- Fixes to the `benchmarks.c3`, `map.c3` and `xml/3_xml_write_stream.c3` examples.
- A global slice of vectors, e.g. `int[<2>][] g = { { 1, 2 } };`, would be lowered incorrectly.
- Instantiating a generic with the type of an anonymous inner struct/union would crash the compiler. #3631
- Anonymous inner structs/unions of the same parent shared a name. They are now named by member index, e.g. `Foo.0`.
- Inner structs/unions of a generic struct lacked the generic parameters in their name.
- Fix Win32 compiler support  for paths containing non-ASCII characters. #3606
- A constant struct containing a union initialized by a smaller member was emitted too small.
- Codegen for `%` on float vectors was incorrect.
- `/`, `%` and `>>` on unsigned integer vectors used signed operations.
- Assigning to `v[^i]` on a vector with a non-constant `i` wrote the wrong element.
- Assigning to a vector element or swizzle discarded would not evaluate right to left.
- `++` and `--` on a multi-component swizzle, e.g. `v.xy++`, did not change the vector.
- Comparing constant bitstructs could crash the compiler.
- Constant `!=` on faults and on addresses of globals returned the result of `==`.
- `a += e` on an optional `a` did not assign the fault when `e` was a fault. It now works like `a = a + e`.
- Constant folding of `int::min / -1` was incorrect.
- `return`, `break`, `continue`, `nextcase` and rethrow in a macro's trailing body were allowed when the macro invoked the body from a `defer`.
- `!` on a non-bool vector gave the wrong lanes when stored into a bool vector.
- The `$$overflow_add`, `$$overflow_sub` and `$$overflow_mul` were lowered incorrectly for vectors.
- `!` on an optional vector lost the optional and could cause the compiler to crash.
- `math::overflow_add` and `math::overflow_sub` failed on vectors.

### Stdlib changes
- Added termios support for OpenBSD.
- Add `file::open_fd` to open files directly from file descriptors.
- Changed regex fault and flag names, removed `NOSUB`. #3585
- Added missing `__muloti4` to compiler_rt.
- `List.insert_at` and `List.push_front` now use a single `memmove` instead of an element-by-element shift. `List.push` has an inline fast path when there is spare capacity.
- `List.remove_item`, `List.compact` (and the same functions on `FixedList`) are now single pass instead of quadratic.
- Cryptos now try to use funnel shift and rotation.
- Add `unordered` parameter to `List.remove_first` and `.remove_last`
- Added `matrix::perspective_infinite`, `matrix::perspective_reverse_z` and `matrix::perspective_infinite_reverse_z`.
- Added `column`, `row`, `set_column` and `set_row` to `Matrix2x2`, `Matrix3x3` and `Matrix4x4`, and `scale_factors` to `Matrix3x3` and `Matrix4x4`.
- `math::sign` now supports floats.
- Add `chmod` support #3536.
- `std::hash::crc32` now uses slicing-by-16, about 5x faster. This also speeds up gzip and zip.
- `std::hash::adler32` `update` is about 3.5x faster (blocked modulo and portable vectors), results unchanged.
- Rewrite `std::compression::deflate` inflate: table driven decoder, 2-3x faster decompression; truncated input is now rejected and `Inflater.init` works with the default `bit_reader_buf`.
- Add an optional `level` (1-9) to `std::compression::deflate` `compress`, `compress_stream` and `Deflater.init`; the default level produces the same output as before. Faster deflate encoding, and incompressible data is stored instead of expanded.
- Add an optional `level` to `std::compression::gzip` `compress`, `compress_stream` and `GzipWriter.init` (sets XFL per RFC 1952); the default is unchanged.
- Add an optional `level` to `std::compression::zip` `ZipArchive.open_writer` and `ZipArchive.write_file` (DEFLATE only); the default is unchanged.
- Fix several `std::compression::zip` problems: `open` and `recover` closed the file twice on errors, `open` failed on ZIP64 archives with a comment or exactly 65535 entries, rejected data after the end record, and silently dropped entries after a broken central directory header. `recover` now reads ZIP64 local headers, `extract` verifies the CRC32 and no longer overwrites the modification time, `ZipEntryReader.seek` rejects negative positions, and the central directory flags match the local header.
- Added `XmlSerializer.add_raw` to write unescaped text.
</details>

## Want To Dive Into C3?

Check out the [documentation](../../getting-started/introduction.md) or [download it and try it out](../../getting-started/prebuilt-binaries.md).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).
