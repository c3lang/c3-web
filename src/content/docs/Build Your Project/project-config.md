---
title: Project Configuration
description: Project Configuration
sidebar:
    order: 241
---
# Customizing A Project

This is a description of the configuration options in `project.json`:


```json5
{
  // Language version of C3.
  "langrev": "1",
  // Warnings used for all targets.
  "warnings": [ "no-unused" ],
  // Directories where C3 library files may be found.
  "dependency-search-paths": [ "lib" ],
  // Libraries to use for all targets.
  "dependencies": [ ],
  // Authors, optionally with email.
  "authors": [ "John Doe <john.doe@example.com>" ],
  // Version using semantic versioning.
  "version": "0.1.0",
  // Sources compiled for all targets.
  "sources": [ "src/**" ],
  // C sources if the project also compiles C sources
  // relative to the project file.
  // "c-sources": [ "csource/**" ],
  // Include directories for C sources relative to the project file.
  // "c-include-dirs: [ "csource/include" ],
  // Output location, relative to project file.
  "output": "../build",
  // Architecture and OS target.
  // You can use 'c3c --list-targets' to list all valid targets,
  // "target": "windows-x64",
  // Current Target options:
  //    android-aarch64 
  //    elf-aarch64 elf-riscv32 elf-riscv64 elf-x86 elf-x64 elf-xtensa
  //    mcu-x86 mingw-x64 netbsd-x86 netbsd-x64 openbsd-x86 openbsd-x64
  //    freebsd-x86 freebsd-x64 ios-aarch64 
  //    linux-aarch64 linux-riscv32 linux-riscv64 linux-x86 linux-x64 
  //    macos-aarch64 macos-x64 
  //    wasm32 wasm64 
  //    windows-aarch64 windows-x64 
  "targets": {
    "linux-x64": {
      // Executable or library.
      "type": "executable",
      // Additional libraries, sources
      // and overrides of global settings here.
    },
  },
  // Global settings.
  // C compiler if the project also compiles C sources
  // defaults to 'cc'.
  "cc": "cc",
  // CPU name, used for optimizations in the LLVM backend.
  "cpu": "generic",
  // Debug information, may be "none", "full" and "line-tables".
  "debug-info": "full",
  // FP math behaviour: "strict", "relaxed", "fast".
  "fp-math": "strict",
  // Link libc other default libraries.
  "link-libc": true,
  // Memory environment: "normal", "small", "tiny", "none".
  "memory-env": "normal",
  // Optimization: "O0", "O1", "O2", "O3", "O4", "O5", "Os", "Oz".
  "opt": "O0",
  // Code optimization level: "none", "less", "more", "max".
  "optlevel": "none",
  // Code size optimization: "none", "small", "tiny".
  "optsize": "none",
  // Relocation model: "none", "pic", "PIC", "pie", "PIE".
  "reloc": "none",
  // Trap on signed and unsigned integer wrapping for testing.
  "trap-on-wrap": false,
  // Turn safety (contracts, runtime bounds checking, null pointer checks etc).
  "safe": true,
  // Compile all modules together, enables more inlining.
  "single-module": true,
  // Use / don't use soft float, value is otherwise target default.
  "soft-float": false,
  // Strip unused code and globals from the output.
  "strip-unused": true,
  // The size of the symtab, which limits the amount
  // of symbols that can be used. Should usually not be changed.
  "symtab": 1048576,
  // Use the system linker.
  "linker": "cc",
  // Include the standard library.
  "use-stdlib": true,
  // Set general level of x64 cpu: "baseline", "ssse3", "sse4", "avx1", "avx2-v1", "avx2-v2", "avx512", "native".
  "x86cpu": "native",
  // Set max type of vector use: "none", "mmx", "sse", "avx", "avx512", "native".
  "x86vec": "sse",
}
```
        

By default, an executable is assumed, but changing the type to `"static-lib"` or `"dynamic-lib"` 
creates static library and dynamic library targets respectively.

*This part will be updated, so stay tuned!* 

## Compilation options

The project file contains common settings at the top level that can be overridden by each
target by simply assigning that particular key. So if the top level defines `target` to be `macos-x64` and the actual target defines it to be `windows-x64`, then the `windows-x64` target will be used for compilation.

Similarly, compiler command line parameters can be used in turn to override the target setting.

#### `targets`

The list of targets that can be built.

#### `dependencies`

List of C3 libraries (".c3l") to use when compiling the target.

#### `sources`

List of source files to compile or run tests for.

#### `cc`

C compiler to use for compiling C sources (if C sources are compiled together with C3 files).

#### `c-sources`

List of C sources to compile, using the default C compiler.

#### `linker-search-paths`

This adds paths for the linker to search, when linking normal C libraries.

#### `linked-libraries`

This is a list of C libraries to link to. The names need to follow the normal
naming standard for how libraries are provided to the system linker,
so for example on Linux, libraries have names like `libfoo.a` but when
presented to the linker the name is `foo`. As an example `"linked-libraries": ["curl"]`
would on Linux look for the library `libcurl.a` and `libcurl.so` in the 
paths given by "linker-search-paths".

#### `version`

*Not handled yet*

Version for library, will also be provided as a compile time constant.

#### `authors`

*Not handled yet*

List of authors to add for library compilation.

#### `langrev`

*Not handled yet*

The language revision to use. 

#### `features`

This is a list of upper-case constants that can be tested for
in the source code using `$feature(NAME_OF_FEATURE)`.

#### `warnings`

*Not completely supported yet*

List of warnings to enable during compilation.

#### `opt`

Optimization setting: O0, O1, O2, O3, O4, O5, Os, Oz.

## Target options

#### `type`

This mandatory option should be one of "executable", "dynamic-lib" and "static-lib".

*More types will be added*

## Using environment variables

*Not supported yet*

In addition to constants any values starting with "$" will be assumed to be environment variables.

For example `"$HOME"` would on unix systems return the home directory. For strings that start with $ but *should not* be interpreted as an environment variable. For example, the string `"\$HOME"` would be interpreted as the plain string `"$HOME"`.
