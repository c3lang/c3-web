---
title: Variables
description: Variables
sidebar:
    order: 41
---


### Zero init by default

Unlike C, C3 local variables are zero-initialized by default. To avoid zero initialization, you need to explicitly opt-out.

```c3
int x;               // x = 0
int y @noinit;       // y is explicitly undefined and must be assigned before use.

AStruct foo;         // foo is implicitly zeroed
AStruct bar = {};    // bar is explicitly zeroed
AStruct baz @noinit; // baz is explicitly undefined
```

Using a variable that is explicitly undefined before will trap or be initialized to a 
specific value when compiling "safe" and is undefined behaviour in "fast" builds.

To observe the effect of unintialized memory, try setting the optimization level to `-O2` or higher, such as via `c3c run -O5` in a project, and printing a `@noinit` variable's value.
