---
title: Build Commands
description: Build Commands
sidebar:
    order: 240
---



Building a project is done by invoking the C3 compiler with the `build` or `run` command inside of the project structure. The compiler will search upwards in the file hierarchy until a `project.json` file is found.

You can also [customise the project build config](/build-your-project/project-config/).

## Compile Individual Files

By default the compiler is compiling stand-alone files to output an executable binary.

```bash
c3c compile <file1> <file2> <file3>
```

## Run

When starting out, with C3 it's natural to use `compile-run` to try things out. For larger projects, the built-in build system is recommended instead. 

The `compile-run` command works same as compilation, but also immediately runs the resulting executable.

```bash
c3c compile-run <file1> <file2> <file3>
```

## Common additional parameters

Additional parameters:
- `--lib <path>` add a library to search.
- `--output <path>` override the output directory.
- `--path <path>` execute as if standing at <path>
    
## Init a new project

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
$ tree .
.
└── hello_world
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

Check the [project configuration docs](/build-your-project/project-config/) to learn more about configuring your project.

## Build

```bash
c3c build [target]
```

Build the project in the current path. It doesn't matter where in the project structure you are. 

The built-in templates define two targets: `debug` (which is the default) and `release`.

## Clean

```bash
c3c clean
```

## Build and Run

```bash
c3c run [target]
```

Build the target (if needed) and run the executable.

## Clean and Run

```bash
c3c clean-run [target]
```

Clean, build and run the target.

## Dist

```bash
c3c dist [target]
```

*Not properly added yet*

Clean, build and package the target for distribution.

## Docs


```bash
c3c docs [target]
```

*Not added yet* 

Rebuilds the documentation. 


## Bench

```bash
c3c bench [target]
```

Runs benchmarks on a target.