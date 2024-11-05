---
title: Design Goals & Background
description: Design Goals & Background
sidebar:
  order: 2
---


:::note[Want To Download C3?]
[Download C3](/getting-started/prebuilt-binaries/), available on Mac, Windows and Linux.
:::

## Design Goals

- Procedural language, with a pragmatic ethos to get work done.
- Minimalistic, no feature should be unnecessary or redundant.
- Stay close to C - only change where there is a significant need.
- Learning C3 should be easy for a C programmer.
- Seamless C integration.
- Ergonomic common patterns.
- Data is inert.
- Zero Is Initialization (ZII).<sup>*</sup>
- Avoid "big ideas".

<sup>*</sup> *"Zero Is Initialization" is an idiom where types and code
are written so that the zero value is a meaningful, initialized
state.*

## Features

- [Full C ABI compatibility](/language-common/cinterop/)
- [Module system](/language-fundamentals/modules/) 
- [Generic modules](/generic-programming/generics/)
- [Design by contract](/language-common/contracts/)
- [Zero overhead errors](/language-common/optionals-essential/#what-is-an-optional)
- [Semantic macro system](/generic-programming/macros/)
- [First-class SIMD vector types](/language-common/vectors/)
- [Struct subtyping](/language-overview/types/#struct-subtyping)
- [Safe array access using slices](/language-common/arrays/#slice)
- [Safe array iteration using foreach](/language-common/arrays/#iteration-over-arrays)
- [Easy to use inline assembly](/misc-advanced/asm/)
- [Cross-platform standard library which includes dynamic containers and strings](/standard-library/)
- LLVM backend

## C3 Background

C3 is an evolution of C, a minimalistic language designed for systems 
programming, enabling the same paradigms and retaining the same syntax 
as far as possible.

C3 started as an experimental fork of the [C2 language](http://www.c2lang.org/) 
by [Bas van den Berg](https://github.com/bvdberg). 
It has evolved significantly, not just in syntax but also 
in regard to error handling, macros, generics and strings.

