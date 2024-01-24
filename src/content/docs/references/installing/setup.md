---
title: Setup
description: How to set up the C3 compiler
sidebar:
  order: 3
---
C3 has precompiled binaries for Windows, MacOS and Ubuntu. 
For other platforms it should be possible to compile it on any platform LLVM can compile to. You will need CMake installed.

## 1. Install LLVM

See LLVM the [LLVM documentation](https://llvm.org/docs/GettingStarted.html) on how to set up LLVM for development. On MacOS, installing through Homebrew works fine.
Using apt-get on Linux should work fine as well. For Windows you can download suitable pre-compiled LLVM binaries
from https://github.com/c3lang/win-llvm

## 2. Clone the C3 compiler source code from Github

This should be as simple as doing:

```
git clone https://github.com/c3lang/c3c.git
```

... from the command line.

## 3. Build the compiler

Create the build directory:

```
MyMachine:c3c$ mkdir build
MyMachine:c3c$ cd build/
```

Use CMake to set up:

```
MyMachine:c3c/build$ cmake ../
```

Build the compiler:

```
MyMachine:c3c/build$ make
```

## 4. Test it out

```
MyMachine:c3c/build$ ./c3c compile-run ../resources/testfragments/helloworld.c3
```

