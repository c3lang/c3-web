---
title: Project Configuration
description: Project Configuration
---
# Customizing A Project

This is a description of the configuration options in `project.json`:
<br/>
(you can see the full list executing `c3c --list-project-properties`)


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
  "targets": {
    "my_app": {
      // Executable or library.
      "type": "executable",
	  // Architecture and OS target.
	  // You can use 'c3c --list-targets' to list all valid targets,
	  // "target": "linux-x64",
	  // Current Target options:
	  //    android-aarch64 
	  //    elf-aarch64 elf-riscv32 elf-riscv64 elf-x86 elf-x64 elf-xtensa
	  //    mcu-x86 mingw-x64 netbsd-x86 netbsd-x64 openbsd-x86 openbsd-x64
	  //    freebsd-x86 freebsd-x64 ios-aarch64 
	  //    linux-aarch64 linux-riscv32 linux-riscv64 linux-x86 linux-x64 
	  //    macos-aarch64 macos-x64 
	  //    wasm32 wasm64 
	  //    windows-aarch64 windows-x64 
	  // Additional libraries, sources
      // and overrides of global settings here.
    },
  },
  // Global settings.
  // C compiler if the project also compiles C sources
  // defaults to 'cc'.
  "cc": "cc",
  // C compiler flags
  "cflags": "",
  // Set the include directories for C sources.
  "c-include-dirs": "",
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
  // Set the stack argument probing mode: "none", "call", "inline".
  "stack-probe": "call",
  // Set the stack size threshold for argument probing in bytes.
  "stack-probe-size": 4096,
  // Set the stack protection level: "none", "basic", "strong", "all".
  "stack-protector": "basic",
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
  // Enable sanitizer: none, address, memory, thread.
  "sanitize": "none",
  // Features enabled for all targets.
  "features": [ "", ""],
}
```
        

By default, an executable is assumed, but changing the type to `"static-lib"` or `"dynamic-lib"` 
creates static library and dynamic library targets respectively.

## Compilation options

The project file contains common settings at the top level that can be overridden by each
target by simply assigning that particular key. So if the top level defines `target` 
to be `macos-x64` and the actual target defines it to be `windows-x64`, then the `windows-x64` target will be used for compilation.

Similarly, compiler command line parameters can be used in turn to override the target setting.

#### `targets`

The list of targets that can be built.

#### `dependencies`

List of C3 libraries (".c3l") to use when compiling the target.

#### `sources`

List of source files to compile.

#### `test-sources`

List of additional source files to compile when running tests.

#### `cc`

C compiler to use for compiling C sources (if C sources are compiled together with C3 files).

#### `c-sources`

List of C sources to compile, using the default C compiler.

#### `linker-search-paths`

This adds paths for the linker to search, when linking normal C libraries.

#### `linked-libraries`

This is a list of C libraries to link to. The names need to follow the normal
naming standard for how libraries are provided to the system linker. 
So, for example, on Linux libraries have names like `libfoo.a` but when
presented to the linker the name is `foo`. As an example `"linked-libraries": ["curl"]`
would on Linux look for the library `libcurl.a` and `libcurl.so` in the 
paths given by "linker-search-paths".

#### `version`

*Not handled yet.*

Version for the library. Will also be provided as a compile time constant.

#### `authors`

List of authors who are credited with creating and/or working on the project.

These can be accessed as lists using env::AUTHORS, which gives a list of names,
and env::AUTHOR_EMAILS, which gives a list of their e-mails (where available).

The formatting is expected to be in the format "first last <optional email>",
e.g. `John Doe <john.doe@example.com>`.

#### `langrev`

*Not handled yet.*

The language revision to use. 

#### `features`

This is a list of upper-case constants that can be tested for
in the source code using `$feat(NAME_OF_FEATURE)`.

#### `warnings`

*Not completely supported yet.*

List of warnings to enable during compilation.

#### `opt`

Optimization setting: O0, O1, O2, O3, O4, O5, Os, Oz.

#### `stack-probe`

Set the stack argument probing mode: `"none"`, `"call"`, or `"inline"`.

#### `stack-probe-size`

Set the stack size threshold for argument probing in bytes (default: `4096`).

#### `stack-protector`

Set the stack protection level: `"none"`, `"basic"`, `"strong"`, or `"all"`.

## Target options

#### `type`

This mandatory option should be one of:

1. "executable" – a normal executable application.
2. "dynamic-lib" - a dynamic library.
3. "static-lib" - static library.
4. "benchmark" - target that only runs benchmarks.
5. "test" - target that only runs tests.
6. "object-files" - compile to object files, but does not perform any linking.
7. "prepare" - target that does not perform any compilation, but may do things like invoking other scripts using "exec".

#### `depends-on`

Target only. A list of other targets in the project that are built before this target, in the listed order.

```json
{
  "targets": {
    "generate": {
      "type": "prepare",
      "exec": [ "./generate_sources.sh" ]
    },
    "my_lib": {
      "type": "static-lib",
      "depends-on": [ "generate" ]
    },
    "my_app": {
      "type": "executable",
      "depends-on": [ "my_lib" ]
    }
  }
}
```

Building `my_app` above first builds `generate`, then `my_lib`, and finally `my_app`.
The dependencies of a dependency are built first, and a target is only built once even if it's listed several times.
It is an error to depend on a target that doesn't exist, or to have targets that depend on each other in a cycle.

Each dependency is built by a separate `c3c` invocation, which gets the command line options given to the original build (except those that only make sense for the selected target).
Use `--no-deps` to build only the selected target. The `clean` command does not clean the dependencies.

## Running scripts

#### `exec`

A list of commands run before the target is compiled. For a `"prepare"` target, the scripts are all that is run.
Running scripts requires **full trust level**, which is enabled with `--trust=full` from the command line.

```json
{
  "exec": [ "./generate_version.sh", "gen_bindings.c3 --verbose" ],
  "targets": {
    "my_target": {
      "type": "executable",
      "exec": [ "./target_specific.sh" ]
    }
  }
}
```

There are two kinds of entries:

- If the first word ends with `.c3`, the C3 file is compiled on the fly and run, with the rest of the entry as its command line arguments.
  Several files can be compiled together by separating them with `;`, as in `"foo.c3;bar.c3 arg"`.
- Otherwise the entry is run as a shell command.

Entries are run in the listed order, but the `exec` entries of a target are run *before* the top level `exec` entries.
Any output from the scripts is printed, unless `-q` / `--quiet` is used. If a script fails, the build stops.

`exec` entries are not expanded by `c3c` (see [using environment variables](#using-environment-variables)),
the shell handles any `$VAR` in them, and sees the variables set by `env`.

#### `exec-override`

Target only. A list of scripts that replaces the top level `exec` for the target, instead of being added to it.

#### `script-dir`

The directory where `.c3` scripts are found. It is relative to the project file. Default: `"scripts"`.

#### `exec-dir`

The directory where the `exec` entries are run, relative to the project file. Default: the same as `script-dir`.

These are the same directories that the `$exec` compile time directive uses (see [Modules](../language-fundamentals/modules.md)),
and may also be set with the `--script-dir` and `--exec-dir` command line options.

## Using environment variables

Environment variables can be used in `project.json` strings with `${NAME}`. The variable is replaced by its value when the project is loaded:

```json
{
  "targets": {
    "my_target": {
      "type": "executable",
      "cc": "${CC}",
      "sources": [ "${HOME}/my_sources/**" ],
      "linker-search-paths": [ "${SDK_PATH}/lib" ]
    }
  }
}
```

The expansion works in all strings, including those in lists, with these exceptions:

- `exec` and `exec-override` are not expanded by `c3c`, they are run by the shell, which expands them itself.
- `type`, `targets`, `vendor` and `$schema` are not expanded.

Only the `${NAME}` form is expanded: `$NAME`, `$1` or a lone `$` are left unchanged. A name may contain letters, digits and `_`, but it can't start with a digit.

To write a literal `${`, use `$${`. For example `"$${HOME}"` becomes the plain string `"${HOME}"`.

If a variable is not defined, it is an error. This is only reported if the target using it is selected (or is built as a dependency through `depends-on`), so a target needing a variable only available on some platforms doesn't prevent building other targets. An error in the top level settings (outside of `targets`) is always reported.

### `env`

Environment variables can be set for the scripts run by `exec`, using a list of `"NAME=value"` strings:

```json
{
  "env": [ "MODE=release" ],
  "targets": {
    "my_target": {
      "type": "prepare",
      "env": [ "OUTPUT=${HOME}/out", "EXTRA=1" ],
      "exec": [ "./build.sh" ]
    }
  }
}
```

The `env` entries are expanded like other strings, using the environment `c3c` was started with.
The variables only exist while the `exec` scripts of the target run, afterwards the previous values are restored.
They are not set for `$exec` in the source code.

`env` at the top level is used by all targets. The `env` of a target is added to the top level `env`. If the same name appears more than once, the last entry is used,
so a target `env` takes precedence over the top level `env`. Use `env-override` to replace the top level `env` completely for a target.

!!! tip "JSON5 Support"
    `project.json5` is also supported if comments are needed.
