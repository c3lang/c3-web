---
title: What Is C3?
description: A guide to the C3 Programming Language
search:
  exclude: true
---

!!! note "Want To Download C3?"
    [Download C3](prebuilt-binaries.md), available on Mac, Windows and Linux.


C3 is an evolution of C and a minimalist systems programming language.

### 🦺 Ergonomics **and** Safety
- Optionals to safely and quickly handle errors and null.
- Defer to clean up resources.
- Slices and foreach for safe iteration.
- Contracts in comments, to add constraints to your code.
- Automatically free memory after use in `@pool` context.

### ⚡ Performance **by** default
- Write SIMD vectors to program the hardware directly.
- Access to different memory allocators to fine tune performance.
- Zero overhead errors.
- Fast compilation times.
- LLVM backend for industrial strength optimisations.
- Easy to use inline assembly.

### 🔋Batteries **included** standard library
- Dynamic containers and strings.
- Cross-platform abstractions for ease of use.
- Access to the native platform when you need it.

### 🔧 Leverage **existing** C or C++ libraries
- Full C ABI compatibility.
- C3 can link C code, C can link C3 code.

### 📦 Modules **are** simple
- Modules namespace code.
- Modules make encapsulation simple with explicit control.
- Interfaces define shared behaviour to write robust libraries.
- Generic modules make extending code easier.
- Simple struct composition and reuse with struct subtyping.

### 🎓 Macros **without** a PhD
- Macros can be similar to normal functions.
- Or write code that understands the types in your code.


⚠️ Warning: Docs may not reflect current language state.
The C3 standard library and compiler are still evolving.
Please verify examples against the compiler and standard library directly.
If you spot mismatches, open a GitHub issue or help us fix them!