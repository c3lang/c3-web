---
title: Libraries
description: Libraries
sidebar:
    order: 227
---

*Note, the library system is in early alpha, everything below is subject to change*

C3 allows convenient packaging of C3 source files optionally with  statically or dynamically linked libraries.
To use such a library, simply pass the path to the library directory and add the library you wish to link to.
The compiler will resolve any dependencies to other libraries and only compile those that are in use.

## How it works

A library may be used either packaged or unpacked. If unpacked, it is simply a directory with the `.c3l`
suffix, which contains all the necessary files, if packed, this is simply a compressed variant of 
a directory with the same structure.

### The specification

In the top of the library resides the `manifest.json` file which has the following structure:

```json
{
  "provides" : "my_lib",
  "execs" : [],
  "targets" : {
    "macos-x64" : {
      "linkflags" : [],
      "dependencies" : [],
      "linked-libs" : ["my_lib_static", "Cocoa.framework", "c"]
    },
    "windows-x64" : {
      "linkflags" : ["/stack:65536"],
      "dependencies" : ["ms_my_extra"],
      "linked-libs" : ["my_lib_static", "kernel32"],
      "execs" : [],
    }
  }
}
```

In the example here, this library supports two targets: **macos-x64** and **windows-x64**. If 
we tried to use it with any other target, the compiler would give an error.

We see that if we use the **windows-x64** target it will also load the **ms_my_extra** library. And
we also see that the linker would have a special argument on that platform.

Both targets expect `my_lib_static` to be available for linking. If this library provides this
or dynamic library it will be in the target sub-directories, so it likely has the path 
`windows-x64/my_lib_static.lib` and `macos-z64/libmy_lib_static.a`.

### Source code

Aside from the manifest, C3 will read any C and C3 files in the same directory as `manifest.json`
as well as any files in the target subdirectory for the current target. For static libraries
typically a `.c3i` file (that is, a C3 file without any implementations) is provided, similar to
how .h files are used in C.

### Additional actions

`"exec"`, which is available both at the top level and per-target, lists the scripts which will be
invoked when a library is used. This requires running the compiler at **full trust level** using the 
`--trust=full` option.

## How to – automatically – export libraries

*This is not implemented yet, docs will materialize once it is finished*

