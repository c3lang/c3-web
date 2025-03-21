---
title: Comparisons With Other Languages
description: How C3 compares to other languages
sidebar:
    order: 701
---
An important question to answer is "How does C3 compare to other similar programming languages?".
Here is an extremely brief (and not yet complete) overview.

## C

As C3 is an evolution of C, the languages are quite similar.
C3 adds features, but also removes a few.

##### In C3 but not in C

- Module system
- Integrated build system
- Generics
- Semantic Macros
- Error handling
- Defer
- Value methods
- Associated enum data
- Distinct types and subtypes
- Optional contracts
- Built-in slices
- Foreach for iteration over arrays and types
- Dynamic calls and types

##### In C but not in C3

- Qualified types (`const`, `volatile` etc)
- Unsafe implicit conversions

## C++

C++ is a complex object oriented "almost superset" of C. It tries to be everything to everyone,
while squeezing this into a C syntax. The language is well known for its
many pitfalls and quirky corners – as well as its long compile times.

C3 is in many ways different from C++ in the same way that C is different from C++,
but the semantic macro system and the generics close the gap in terms of writing
reusable generic code. The C3 module system and error handling is also very
different from how C++ does things.

##### In C++ but not in C3

- Objects and classes
- RAII
- Exceptions

##### In C3 but not in C++

- Module system (yet)
- Integrated build system
- Semantic macros
- Error handling
- Defer
- Associated enum data
- Built-in slices
- Dynamic calls

## Rust

Rust is a safe systems programming language. While not quite as complex as C++,
it is still a feature rich programming language with semantic macros, traits and
pattern matching to mention a few.

Error handling is handled using `Result` and `Optional` which is similar to 
how C3 works.

C3 compares to Rust much like C, although the presence of built-in slices and 
strings reduces the places where C3 is unsafe. Rust provides arrays and strings,
but they are not built in.

##### In Rust but not in C3

- RAII
- Memory safety
- Safe union types with functions
- Different syntax from C
- Pattern matching
- Async built in

##### In C3 but not in Rust

- Same ease of programming as C
- Optional contracts
- Familiar C syntax and behaviour
- Dynamic calls

## Zig

Zig is a systems programming language with extensive compile time execution to
enable polymorphic functions and parameterized types. It aims to be a C replacement.

Compared to C3, Zig tries to be a completely new language in terms of syntax and feel.
C3 uses macros to a modest degree where it is more pervasive in Zig, and
does not depart from C to the same degree. Like Rust, it features slices as a first
class type. The standard library uses an explicit allocator to allow it to work
with many different allocation strategies.

Zig is a very ambitious project, aiming to support as many types of platforms as
possible.

##### In Zig but not in C3

- Pervasive compile time execution.
- Memory allocation failure is an error.
- Toolchain uses build files written in native Zig.
- Different syntax and behaviour compared to C.
- Structs define namespace.
- Async primitives built in.
- Arbitrary integer sizes.

##### In C3 but not in Zig

- Module system.
- Integrated build system.
- C ABI compatibility by default.
- Optional contracts.
- Familiar C syntax and behaviour.
- Dynamic interfaces.
- Built in benchmarks.

## Jai

Jai is a programming language aimed at high performance game programming.
It has an extensive compile time meta programming functionality, even
to the point of being able to run programs at compile time. It also
has compile-time polymorphism, a powerful macro system and uses 
an implicit context system to switch allocation schemes.

##### In Jai but not in C3

- Pervasive compile time execution.
- Jai's compile time execution is the build system.
- Different syntax and behaviour compared to C.
- More powerful macro system than C3.
- Implicit constructors.

##### In C3 but not in Jai

- Module system.
- Integrated build system.
- Optional contracts.
- Familiar C syntax and behaviour.
- Fairly small language.
- Dynamic interfaces.

## Odin

Odin is a language built for high performance but tries to remain
a simple language to learn. Superficially the syntax shares much with
Jai, and some of Jai's features things – like an implicit context – also shows up
in Odin. In contrast with both Jai and Zig, Odin uses only minimal compile time evaluation
and instead only relies on parametric polymorphism to ensure reuse.
It also contains conveniences, like maps and arrays built into
the language. For error handling it relies on Go style tuple returns.

##### In Odin but not in C3

- Different syntax and behaviour compared to C.
- Ad hoc parametric polymorphism.
- Multiple return values.
- Error handling through multiple returns.
- A rich built in set of types.

##### In C3 but not in Odin

- Familiar C syntax and behaviour.
- Semantic macros.
- Value methods.
- Optional contracts.
- Built in error handling.
- Dynamic interfaces.

## D

D is an incredibly extensive language, it covers anything C++ does and adds much more.
D manages this with much fewer syntactic quirks than C++. It is a strong,
feature-rich language.

##### In D but not in C3

- Objects and classes.
- RAII.
- Exceptions.
- Optional GC.

*+ Many, many more features.* 

##### In C3 but not in D

- Fairly small language.