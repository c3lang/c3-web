---
title: Builtins
description: Builtins
sidebar:
    order: 126
---
The compiler offers builtin constants and functions. Some are only available on certain targets. All builtins use the `$$`
name prefix.

## Builtin constants

These can all safely be used by the user.

#### $$BENCHMARK_NAMES
An array of names of the benchmark functions.

#### $$BENCHMARK_FNS
An array of addresses to the benchmark functions.

#### $$DATE
The current date.

#### $$FILE
The current file name.

#### $$FILEPATH
The current file with path.

#### $$FUNC
The current function name, will return "<GLOBAL>" on the global level.

#### $$FUNCTION
The current function as an expression.

#### $$LINE
The current line as an integer.

#### $$LINE_RAW
Usually the same as $$LINE, but in case of a macro inclusion it returns the line in the macro rather than
the line where the macro was included.

#### $$MODULE
The current module name.

#### $$TIME
The current time.


## Builtin functions

These functions are *not guaranteed* to exist on all platforms. They are intended for standard library
internal use, and typically the standard library has macros that wrap these builtins, so they should not be used on its own.

#### $$trap

Emits a trap instruction.

#### $$unreachable

Inserts an "unreachable" annotation.

#### $$stacktrace

Returns the current "callstack" reference if available. Compiler dependent.

#### $$volatile_store

Takes a variable and a value and stores the value as a volatile store.

#### $$volatile_load

Takes a variable and returns the value using a volatile load.

#### $$memcpy

Builtin memcpy instruction.

#### $$memset

Builtin memset instruction.

#### $$prefetch

Prefetch a memory location.

#### $$sysclock

Access to the cycle counter register (or similar low latency clock) on supported
architectures (e.g. RDTSC on x86), otherwise $$sysclock will yield 0.

#### $$syscall

Makes a syscall according to the platform convention on platforms where it is supported.

### Math functions

Functions `$$ceil`, `$$trunc`, `$$sin`, `$$cos`, `$$log`, `$$log2`, `$$log10`, `$$rint`, `$$round`
`$$sqrt`, `$$roundeven`, `$$floor`, `$$sqrt`, `$$pow`, `$$exp`, `$$fma` and `$$fabs`, `$$copysign`,
`$$round`, `$$nearbyint`.

Can be applied to float vectors or numbers. Returns the same type.

Functions `$$min`, `$$abs` and `$$max` can be applied to any integer or float number or vector.

Function $pow_int takes a float or floating vector + an integer and returns
the same type as the first parameter.

Saturated addition, subtraction and left shift for integers and integer vectors:
`$$sat_add`, `$$sat_shl`, `$$sat_sub`.

### Bit functions

#### $$fshl and $$fshr

Funnel shift left and right, takes either two integers or two integer vectors.

#### $$ctz, $$clz, $$bitreverse, $$bswap, $$popcount

Bit functions work on an integer or an integer vector.

### Vector functions

`$$reduce_add`, `$$reduce_mul`, `$$reduce_and`, `$$reduce_or`, `$$reduce_xor` work on integer vectors.

`$$reduce_fadd`, `$$reduce_fmul` works on float vectors.

`$$reduce_max`, `$$reduce_min` works on any vector.

`$$reverse` reverses the values in any vector.

`$$shufflevector` rearranges the values of two vectors using a fixed mask into
a resulting vector.

