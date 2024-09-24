---
title: Roadmap For C3
description: Roadmap For C3
sidebar:
  order: 3
---


## C3 Roadmap

### C3 Is Feature Stable

The C3 `0.6.x` series can be run in production with the same general caveats for using any pre-`1.0` software.

While we strive to have zero bug count, there are still bugs being 
found. This means that anyone using it in production would need to stay
 updated with the latest fixes.

The focus of `0.7`–`0.9` will be fleshing out the cross-platform standard 
library and make sure the syntax and semantics are solid. Also, the 
toolchain will expand and improve. [Please refer to this issue for what's 
left in terms of features for `1.0`](https://github.com/c3lang/c3c/issues/1456).


The intended roadmap has one major `0.1` release per year:
| Date       |  Release  |
|------------|-----------|
| 2025-04-01 |    0.7    |
| 2026-04-01 |    0.8    |
| 2027-04-01 |    0.9    |
| 2028-04-01 |    1.0    |

### Compatability

Minor releases in the same major release series are compatible. 

For example `0.6.0`, `0.6.1`, ... `0.6.x` are compatible and `0.7.0`, `0.7.1`, ... `0.7.x` are compatible.


### Standard library
The standard library is less mature than the compiler. It needs more 
functionality and more tests. The compiler reaching a `1.0` release only 
means a language freeze, the standard library will continue to evolve 
past the `1.0` release.