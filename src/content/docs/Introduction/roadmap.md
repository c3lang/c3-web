---
title: Roadmap For c3
description: Roadmap For C3
sidebar:
  order: 3
---


## C3 Roadmap

### C3 is stable
The C3 `0.6.x` series can be run in production. 

There are no known miscompilations or bugs. 
However, there are still bugs being found (and rapidly fixed), so anyone using it in production 
would need to stay updated with the latest fixes.

The focus of `0.7` and higher will be stability, and fixing increasingly rare bugs in existing features.


The intended roadmap has one major 0.1 release per year:
| Date       |  Release  |
|------------|-----------|
| 2024-04-01 |   `0.7`   |
| 2025-04-01 |   `0.8`   |
| 2026-04-01 |   `0.9`   |
| 2027-04-01 |   `1.0`   |

### Compatability

Minor releases in the same major release series are compatible. 

For example `0.6.0`, `0.6.1`, ... `0.6.x` are compatible and `0.7.0`, `0.7.1`, ... `0.7.x` are compatible.


### Standard library
The standard library is less mature than the compiler. It needs more functionality and more tests. The compiler reaching a 1.0 release only means a language freeze, the standard library will continue to evolve past the 1.0 release.