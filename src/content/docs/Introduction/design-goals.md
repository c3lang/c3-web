---
title: Design Goals and Origins
description: A more in-depth guide for topics regarding c3
sidebar:
  order: 2
---

## Design goals

- Procedural "get things done" type of language.
- Stay close to C - only change where there is a significant need.
- Flawless C integration.
- Learning C3 should be easy for a C programmer.
- Dare add conveniences if the value is great.
- Data is inert and zero is initialization.
- Avoid "big ideas".
- Avoid the kitchen sink language trap.

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

- Windows x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-windows.zip), [install instructions](https://github.com/c3lang/c3c#installing-on-windows-with-precompiled-binaries).
- MacOS x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-macos.zip), [install instructions](https://github.com/c3lang/c3c#installing-on-mac-with-precompiled-binaries).
- Ubuntu x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-ubuntu-20.tar.gz), [install instructions](https://github.com/c3lang/c3c#installing-on-debian-with-precompiled-binaries).
- Debian x64 [download](https://github.com/c3lang/c3c/releases/download/latest/c3-linux.tar.gz), [install instructions](https://github.com/c3lang/c3c#installing-on-debian-with-precompiled-binaries).


## Community: 

1. Discord: invite link: https://discord.gg/qN76R87
2. Discourse: https://c3lang.discourse.group

## C3 Origin Story

C3 is an evolution of C, a minimalistic language designed for systems 
programming, enabling the same paradigms and retaining the same syntax 
as far as possible.

C3 started as an extension of the [C2 language](http://www.c2lang.org/) 
by [Bas van den Berg](https://github.com/bvdberg). 
It has evolved significantly, not just in syntax but also 
in regard to error handling, macros, generics and strings.

#### Thank You

Special thank you to: 
- Bas van der Berg the Author of [C2](http://www.c2lang.org)
- Jon Goodwin the Author of [Cone](http://cone.jondgoodwin.com)
- Andrey Penechko the Author of [Vox](https://github.com/MrSmith33/vox).
