---
title: Install C3 Compiler Binary
description: Installing C3 Compiler Binary
---


# Prebuilt binaries
- [Installing on Windows](#installing-on-windows)
- [Installing on Mac Arm64](#installing-on-mac-arm64)
- [Installing on Linux](#installing-on-linux)

!!! note "Nightly builds"
    Nightly (prerelease) builds are available at the [latest-prerelease-tag](https://github.com/c3lang/c3c/releases/tag/latest-prerelease-tag) release page.

## Installing on Windows
1. [Download and run the installer](https://github.com/c3lang/c3c/releases/latest/download/c3-windows-setup.exe) or the [debug build](https://github.com/c3lang/c3c/releases/latest/download/c3-windows-setup-debug.exe) - it installs the compiler and adds it to your `PATH` automatically.
2. Run `c3c` anywhere on your computer!
```bash
c3c compile ./hello.c3
```

### Manual installation (zip)
If you prefer not to use the installer:
1. [Download the C3 compiler](https://github.com/c3lang/c3c/releases/latest/download/c3-windows.zip) or the [debug build](https://github.com/c3lang/c3c/releases/latest/download/c3-windows-debug.zip).
2. Unzip it into a folder of your choice.
3. Add the folder to your `PATH` environment variable manually.

## Installing on Mac Arm64
1. Make sure you have XCode with command line tools installed.
2. [Download the C3 compiler](https://github.com/c3lang/c3c/releases/latest/download/c3-macos.zip) or the [debug build](https://github.com/c3lang/c3c/releases/latest/download/c3-macos-debug.zip).
3. Unzip executable and standard lib.
4. Run `./c3c`.

!!! note "The binary is not signed"
    You need to approve it with: `xattr -d com.apple.quarantine c3c`, or go to the security settings, approve it, then run it again.


## Installing on Linux
1. [Download the static C3 compiler](https://github.com/c3lang/c3c/releases/latest/download/c3-linux-static.tar.gz) or the [debug build](https://github.com/c3lang/c3c/releases/latest/download/c3-linux-debug.tar.gz).
2. Unpack executable and standard lib.
3. Run `./c3c`.

The static build is self-contained and works across all major Linux distributions without requiring any additional dependencies.

### on Arch Linux
c3c is available in the [official Arch Linux extra repository](https://archlinux.org/packages/extra/x86_64/c3c/):
```bash
pacman -S c3c
```

For the nightly build, use the AUR package [c3c-git](https://aur.archlinux.org/packages/c3c-git):
```bash
yay -S c3c-git
```

## Troubleshooting

**Note:** If you get an error like `No module named 'std::io' could be found`, you may need to set the `C3C_LIB` environment variable to point to the standard library location:

**Bash/Zsh:**
```bash
export C3C_LIB=/path/to/c3c/lib
```

**Fish:**
```fish
set -gx C3C_LIB /path/to/c3c/lib
```

**Windows (PowerShell):**
```powershell
$env:C3C_LIB = "C:\path\to\c3c\lib"
```

### "cc: not found"
On Linux and MacOS, C3 uses the available C compiler to link with the correct libraries. While C3 contains a built-in linker, 
it is likely that your system will lack a complete environment unless a C compiler is available.

Linux users should generally install GCC or Clang, according to their distribution's documentation. 
Below is a list of officially tested distributions and the minimum packages required to compile and link C3 programs:

| Distribution | Required Packages | Command |
|--------------|-------------------|---------|
| **Ubuntu / Debian** | `gcc`, `libc6-dev` | `sudo apt-get install gcc libc6-dev` |
| **Fedora / Rocky** | `gcc` | `sudo dnf install gcc` |
| **Arch Linux** | `gcc` | `sudo pacman -S gcc` |
| **openSUSE** | `gcc`, `glibc-devel` | `sudo zypper install gcc glibc-devel` |
| **Alpine Linux** | `gcc`, `musl-dev` | `sudo apk add gcc musl-dev` |
| **Void Linux** | `gcc` | `sudo xbps-install -S gcc` |

On MacOS, you can either install XCode or download the stand-alone [command-line tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/).
