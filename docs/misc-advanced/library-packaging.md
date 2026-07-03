---
title: Library Packaging
description: Library Packaging
---

*Note that the library system is in early alpha. Everything below is subject to change.*

C3 allows convenient packaging of C3 source files optionally with statically or dynamically linked libraries.
To use such a library, simply pass the path to the library directory and add the library you wish to link to.
The compiler will resolve any dependencies to other libraries and only compile those that are in use.

## How it works

A library may be used either packaged or unpacked. If unpacked, it is simply a directory with the `.c3l` suffix, which contains all the necessary files. If packed, it is simply a compressed variant of a directory with the same structure.

### The specification

In the top of the library resides the `manifest.json` file which has the following structure:

```json
{
  "provides" : "my_lib",
  "exec" : [],
  "targets" : {
    "macos-x64" : {
      "link-args" : [],
      "dependencies" : [],
      "linked-libraries" : ["my_lib_static", "Cocoa.framework", "c"]
    },
    "windows-x64" : {
      "link-args" : ["/stack:65536"],
      "dependencies" : ["ms_my_extra"],
      "linked-libraries" : ["my_lib_static", "kernel32"],
      "exec" : []
    }
  }
}
```

In the example above, this library supports two targets: **macos-x64** and **windows-x64**. If we tried to use it with any other target, the compiler would give an error.

We see that if we use the **windows-x64** target it will also load the **ms_my_extra** library. We also see that the linker would have a special argument on that platform.

Both targets expect `my_lib_static` to be available for linking. If this library provides this static or dynamic library it will be in the target sub-directories, so it likely has the path `windows-x64/my_lib_static.lib` or `macos-x64/libmy_lib_static.a`.

### Source code

Aside from the manifest, C3 will read any C and C3 files in the same directory as `manifest.json`, as well as any files in the target subdirectory for the current target. For static libraries,
typically a `.c3i` file (that is, a C3 file without any implementations) is provided, similar to
how `.h` files are used in C.

### Additional actions

`"exec"`, which is available both at the top level and per-target, lists the scripts which will be
invoked when a library is used. This requires running the compiler at **full trust level** using the 
`--trust=full` option.

## How to – automatically – export libraries

*This feature is not implemented yet. The documentation for this feature will materialize once it is finished.*

## Manifest Reference

The full list of supported keys can be viewed in your terminal at any time by running `c3c --list-manifest-properties`. Below is the complete reference of these properties.

??? info "Global Manifest Properties"

    | Property | Type | Description |
    | :--- | :--- | :--- |
    | `provides` | String | The library name. |
    | `targets` | Object | The map of supported platforms. |
    | `dependencies` | Array | List of C3 libraries to also include. |
    | `sources` | Array | Paths to library sources for targets, such as interface files. |
    | `c-sources` | Array | Set the C sources to be compiled. |
    | `c-include-dirs`| Array | Set the include directories for C sources. |
    | `cc` | String | Set C compiler (defaults to 'cc'). |
    | `cflags` | Array | C compiler flags. |
    | `exec` | Array | Scripts run for all platforms. |
    | `linklib-dir` | String | Set the directory where to find linked libraries. |
    | `wincrt` | String | Windows CRT linking: `none`, `static`, `dynamic`. |
    | `vendor` | Object | Vendor specific extensions, ignored by `c3c`. |

??? info "Target-Specific Properties"

    | Property | Type | Description |
    | :--- | :--- | :--- |
    | `sources` | Array | Additional library sources to be compiled for this target. |
    | `sources-override` | Array | Paths to library sources for this target, overriding global settings. |
    | `c-sources` | Array | Additional C sources to be compiled for the target. |
    | `c-sources-override` | Array | C sources to be compiled, overriding global settings. |
    | `c-include-dirs` | Array | C source include directories for the target. |
    | `c-include-dirs-override` | Array | Additional C source include directories for the target, overriding global settings. |
    | `cc` | String | Set C compiler (defaults to 'cc'). |
    | `cflags` | Array | Additional C compiler flags for the target. |
    | `cflags-override` | Array | C compiler flags for the target, overriding global settings. |
    | `dependencies` | Array | List of C3 libraries to also include for this target. |
    | `exec` | Array | Scripts to also run for the target. |
    | `linked-libraries` | Array | Libraries linked by the linker for this target, overriding global settings. |
    | `link-args` | Array | Linker arguments for this target. |
    | `wincrt` | String | Windows CRT linking: `none`, `static`, `dynamic`. |
    | `vendor` | Object | Vendor specific extensions, ignored by `c3c`. |