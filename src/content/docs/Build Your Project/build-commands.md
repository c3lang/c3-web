---
title: Project Build Commands
description: Project Build Commands
sidebar:
    order: 181
---



Building a project is done by invoking the C3 compiler with the `build` or `run` command inside of the project structure. The compiler will search upwards in the file hierarchy until a `project.json` file is found.

You can also [customise the project build config](../project-config/).

## Compile Individual Files

By default the compiler is compiling stand-alone files to output an executable binary.

```bash
c3c <file1> <file2> <file3>
```

## run

When starting out, with C3 it's natural to use `run` to try things out. For larger projects, the built-in build system is recommended instead. 

The `run` command works same as compilation, but also immediately runs the resulting executable.

```bash
c3c run <file1> <file2> <file3>
```

## Common additional parameters

Additional parameters:
- `--lib <path>` add a library to search.
- `--output <path>` override the output directory.
- `--path <path>` execute as if standing at <path>
    
## init

```bash
c3c init <project_name> [optional path]`
```

Create a new project structure in the current directory.

Use the `--template` to select a template. The following are built in:

- `exe` - the default template, produces an executable.
- `static-lib` - template for producing a static library.
- `dynamic-lib` - template for producing a dynamic library.

It is also possible to give the path to a custom template.

Additional parameters:
- `--template <path>` indicate an alternative template to use. 

For example `c3c init hello_world` creates the following structure:

```
hello_world
    |
    ├── LICENSE
    ├── README.md
    ├── build
    ├── docs
    │   ├── about.md
    │   └── src
    │       └── index.html
    ├── lib
    ├── project.c3p
    ├── resources
    ├── src
    │   └── hello_world
    │       └── main.c3
    └── test
        └── hello_world
```
## build

```bash
build [target]
```

Build the project in the current path. It doesn't matter where in the project structure you are. 

The built-in templates define two targets: `debug` (which is the default) and `release`.

## clean

```bash
clean
```

## build-run

```bash
build-run [target]
```

Build the target (if needed) and run the executable.

## clean-run

```bash
clean-run [target]
```

Clean, build and run the target.

## dist

```bash
dist [target]
```

Clean, build and package the target.

## docs

```bash
docs [target]
```

Rebuilds the documentation.

## bench

```bash
bench [target]
```

Runs benchmarks on a target.