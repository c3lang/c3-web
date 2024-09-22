---
title: Project Configuration
description: Project Configuration
sidebar:
    order: 241
---
# Customizing A Project

A new project is provided with a barebone structure in `project.json`:


```json5
{
  "version": "0.1.0",
  "authors": [
    "John Doe <john.doe@example.com>"
  ],
  "langrev": "1",
  "warnings": [ "no-unused" ],
  // sources compiled
  "sources": [ "./**" ],
  // directories where C3 library files may be found
  "dependency-search-paths": [ "lib" ],
  // libraries to use
  "dependencies": [],
  // c compiler
  "cc": "cc",
  // c sources
  "c-sources": [ "./c-source/**" ],
  "targets": {
    "hello_world": {
      "type": "executable"
    }
  }
}
```
        

By default, an executable in assumed, but changing the type to `"static-lib"` or `"dynamic-lib"` 
creates static library and dynamic library targets respectively.

*This part will be updated, stay tuned* 

## Compilation options

The project file contains common settings at the top level, that can be overridden by each
target, by simply assigning that particular key. So if the top level defines `target` to be `macos-x64`
and the actual target defines it to be `windows-x64`, then the `windows-x64` will be used for compilation.

Similarly, compiler command line parameters can be used in turn to override the target setting.

#### targets

The list of targets that can be built.

#### dependencies

List of C3 libraries (".c3l") to use when compiling the target.

#### sources

List of source files to compile.

#### cc

C compiler to use for compiling C sources (if C sources are compiled together with C3 files).

#### c-sources

List of C sources to compile.

#### version

*Not handled yet*

Version for library, will also be provided as a compile time constant.

#### authors

*Not handled yet*

List of authors to add for library compilation.

#### langrev

*Not handled yet*

The language revision to use. 

#### config

*Not added yet*

Under the config you define external constants ("key: value") that will be included in compilation as if they were global macro constants.

#### export

*Not added yet*

Define the list of modules to be exported by a library. Not valid for executables.

#### warnings

*Not completely supported yet*

List of warnings to enable during compilation.

## Target options

#### type

This mandatory option should be one of "executable", "dynamic-lib" and "static-lib".

*More types will be added*

## Using environment variables

*Not supported yet*

In addition to constants any values starting with "$" will be assumed to be environment variables.

For example "$HOME" would on unix systems return the home directory. For strings that start with $ but *should not* be interpreted as an environment variable. For example, the string `"\$HOME"` would be interpreted as the plain string "$HOME"