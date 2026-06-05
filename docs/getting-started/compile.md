---
title: Build C3 From Source
description: Build C3 From Source
---

!!! note "Want To Download Pre-Built C3 Binaries?"
    [Download C3](../getting-started/prebuilt-binaries.md), available on Mac, Windows and Linux.

Building C3 from source is straightforward as the CMake configuration can automatically download the [pre-compiled LLVM binaries](https://github.com/c3lang/llvm-for-c3).
You will need `git`, `CMake`, and a C compiler (such as Clang, GCC, or MSVC) installed on your system.

!!! tip "Faster Builds"
    For faster compilation, you can compile in parallel by appending the `-j` flag (e.g., `cmake --build build -j`). Alternatively, if you have [Ninja](https://ninja-build.org/) installed, you can generate Ninja build files by adding `-G Ninja` to the configuration step (e.g., `cmake -B build -S . -G Ninja ...`).

## Compiling on Linux

1. Install the required build dependencies using your distribution's package manager:
    - **Ubuntu / Debian:** `sudo apt-get install cmake git clang libcurl4-openssl-dev`
    - **Fedora:** `sudo dnf install cmake clang git libcurl-devel`
    - **Arch Linux:** `sudo pacman -S curl clang cmake git`
    - **Void Linux:** `sudo xbps-install git cmake clang libcurl-devel`
2. Clone the compiler repository:
    ```bash
    git clone https://github.com/c3lang/c3c.git
    cd c3c
    ```
3. Configure and build the compiler:
    ```bash
    cmake -B build -S . -DC3_FETCH_LLVM=ON -DCMAKE_BUILD_TYPE=Release
    cmake --build build
    ```
4. Run the compiled compiler to verify:
    ```bash
    ./build/c3c compile resources/examples/hash.c3
    ```

## Compiling on macOS

First, ensure you have the Xcode Command Line Tools installed by running:
```bash
xcode-select --install
```

### Using Homebrew

1. Install CMake:
    ```bash
    brew install cmake
    ```
2. Clone the compiler repository:
    ```bash
    git clone https://github.com/c3lang/c3c.git
    cd c3c
    ```
3. Configure and build the compiler:
    ```bash
    cmake -B build -S . -DC3_FETCH_LLVM=ON -DCMAKE_BUILD_TYPE=Release
    cmake --build build
    ```

!!! info "Building via Homebrew Formula"
    You can also compile the latest development version (`master` branch) directly using Homebrew by running `brew install c3c --HEAD`. To upgrade it later, use `brew reinstall c3c`. If you need to customize the compilation settings, you can do so by editing the formula script (using `brew edit c3c`).

### Using MacPorts

If you are using MacPorts, you can either let CMake fetch LLVM automatically or use the MacPorts LLVM package.

To build using automatic LLVM fetching:
1. Install CMake: `sudo port install cmake`
2. Clone the repository and build:
    ```bash
    git clone https://github.com/c3lang/c3c.git
    cd c3c
    cmake -B build -S . -DC3_FETCH_LLVM=ON -DCMAKE_BUILD_TYPE=Release
    cmake --build build
    ```

To build using the LLVM installed via MacPorts:
1. Install the required ports: `sudo port install cmake llvm-17 clang-17`
2. Clone the repository: `git clone https://github.com/c3lang/c3c.git` and enter the directory.
3. Configure pointing to the MacPorts LLVM directory and build:
    ```bash
    export LLVM_DIR=/opt/local/libexec/llvm-17/lib/cmake/llvm
    cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
    cmake --build build
    ```
*See also discussion [#1701](https://github.com/c3lang/c3c/discussions/1701) for details.*

## Compiling on Windows

1. Install Visual Studio 2022 (VS17) with the "Desktop development with C++" workload, or install the [standalone Build Tools](https://aka.ms/vs/stable/vs_BuildTools.exe).
2. Install [Git](https://git-scm.com/install/windows) and [CMake](https://cmake.org/download/).
3. Clone the compiler repository:
    ```bash
    git clone https://github.com/c3lang/c3c.git
    cd c3c
    ```
4. Configure and build the compiler:
    ```bash
    cmake --preset windows-vs-2022-release -D C3_FETCH_LLVM=ON
    cmake --build --preset windows-vs-2022-release
    ```
The resulting executable will be located in `build\Release\c3c.exe`.

For a debug build, configure and build with the debug preset instead:
```bash
cmake --preset windows-vs-2022-debug -D C3_FETCH_LLVM=ON
cmake --build --preset windows-vs-2022-debug
```

## Docker and NixOS

A script is provided to build C3 inside an Ubuntu Docker container:
```bash
./build-with-docker.sh
```

For NixOS users, enter the development shell and configure CMake with the required flags:
```bash
nix develop
cmake -B build -S . $C3_CMAKE_FLAGS
cmake --build build
```
