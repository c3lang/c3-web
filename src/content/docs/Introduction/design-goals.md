---
title: Design Goals & Background
description: Design Goals & Background
sidebar:
  order: 2
---

## Design goals

- Procedural language, with a pragmatic ethos to get work done.
- Minimalistic, no feature should be unnecessary or redundant.
- Stay close to C - only change where there is a significant need.
- Learning C3 should be easy for a C programmer.
- Seamless C integration.
- Ergonomic common patterns.
- Data is inert.
- Zero Is Initialization (ZII)*.
- Avoid "big ideas".

*\*) "Zero Is Initialization" is an idiom where types and code
is written so that the zero value is a meaningful, initialized
state.*

## Features

- Full C ABI compatibility  
- Module system 
- Generic modules
- Design by contract
- Zero overhead errors
- Semantic macro system
- First-class SIMD vector types
- Struct subtyping
- Safe array access using slices
- Easy to use inline assembly
- Cross-platform standard library which includes dynamic containers and strings
- LLVM backend

## How to get C3
The C3 compiler can be found on github: [https://github.com/c3lang/c3c](https://github.com/c3lang/c3c).

Binaries are directly downloadable for the following platforms:

- Windows x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-windows.zip), 
[install instructions](/install-c3/prebuilt-binaries/#installing-on-windows).
- MacOS x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-macos.zip), 
[install instructions](/install-c3/prebuilt-binaries/#installing-on-mac-arm64).
- Ubuntu x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-ubuntu-20.tar.gz), 
[install instructions](/install-c3/prebuilt-binaries/#installing-on-ubuntu).
- Debian x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-linux.tar.gz), 
[install instructions](/install-c3/prebuilt-binaries/#installing-on-debian).
- Arch [install instructions](/install-c3/prebuilt-binaries/#installing-on-arch-linux)

## C3 Background

C3 is an evolution of C, a minimalistic language designed for systems 
programming, enabling the same paradigms and retaining the same syntax 
as far as possible.

C3 started as an experimental fork of the [C2 language](http://www.c2lang.org/) 
by [Bas van den Berg](https://github.com/bvdberg). 
It has evolved significantly, not just in syntax but also 
in regard to error handling, macros, generics and strings.

