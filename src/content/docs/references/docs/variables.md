---
title: Variables
description: Variables
sidebar:
    order: 114
---


### Zero init by default

Unlike C, C3 local variables are zero-initialized by default. To avoid zero-init, you need to explicitly opt-out.

```
int x;               // x = 0
int y @noinit;       // y is explicitly undefined and must be assigned before use.

AStruct foo;         // foo is implicitly zeroed
AStruct bar = {};    // boo is explicitly zeroed
AStruct baz @noinit; // baz is explicitly undefined
```

Using a variable that is explicitly undefined before will trap or be initialized to a 
specific value when compiling "safe" and is undefined behaviour in "fast" builds.