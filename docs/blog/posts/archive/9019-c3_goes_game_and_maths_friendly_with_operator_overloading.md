---
title: "C3 goes game and maths friendly with operator overloading"
date: 2025-04-21
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/9019-c3_goes_game_and_maths_friendly_with_operator_overloading](https://c3.handmade.network/blog/p/9019-c3_goes_game_and_maths_friendly_with_operator_overloading)*

Operator overloading is a divisive feature. It's been used for atrocious hacks, and to make code totally unreadable, but it's also the reason people stick to a C-like subset of C++ rather than using plain C for projects.

C3 has had operator overloading for a long time, but only for array indexing. In fact there are four different overloads: `len` `[]` `[]=` and `&[]`. Together they do not only enable indexing, but more importantly they enable `foreach`.

If a type implements `len` and at least one of `[]` and `&[]`, then you get `foreach` on that type. `&[]` is required for `foreach` with ref arguments though. And while you can use `[]` without implementing `len`, you need `len` for reverse indexing like `a[^3]`.

However, I've resisted adding operator overloading for arithmetics and equals. Such a change brings us further away from C semantics than I've felt comfortable with. It can certainly be extremely misused and cause confusion.

But, as of 0.7.1 it's in the language. So what made me change my mind?

Most important to me is the fact that in practice people need this. C already has features that can be misused, such as untyped pointers, and we still use it. The same can be said of operator overloading.

## Overview

C3 allows the arithmetic operators `+ - * / %` and unary `-` to be overloaded. In addition to this, bit operators `^ | &` and `<< >>` may be overloaded. `==` and `!=` and "operator + assign" operators such as `+=` and `<<=` are also possible to overload.

Some technical details:

1. You can create multiple overloads for a single type, for example `Vec * Vec` and `Vec * int`.
2. Only user defined types may be overloaded. However, bitstructs already have `^ | &` defined, so those may not be overloaded.
3. Overloading `==` will implicitly make `!=` work and vice versa.
4. "operator + assign" operators are not required, they will be generated from the operator if not present.

### Working with primitive types

While it's not possible to add `@operator` (the attribute usually used to define the overload) to define something like `int + Vec`, there are two additional attributes added: `@operator_s` ("symmetric operator") and `@operator_r` ("reverse operator") to help it. The former allows either type to go first, and `@operator_r` requires the second term to be the first one in the arithmetic expression.

### Examples

```
// Defining a simple add: "Complex + Complex"
macro Complex Complex.add(self, Complex b) @operator(+) => { .v = self.v + b.v };
// Define the self-modifying +=: "Complex += Complex"
macro Complex Complex.add_this(&self, Complex b) @operator(+=) => { .v = self.v += b.v };
```

The use of the symmetric operator overloading:

```
// This defines "Quaternion * Real" /and/ "Real * Quaternion"
macro Quaternion Quaternion.scale(self, Real s) @operator_s(*) => { .v = self.v * s };
```

And finally, reverse operator:

```
// This defines "Real / Complex"
macro Complex Complex.div_real_inverse(Complex c, Real r) @operator_r(/) => ((Complex) { .r = self }).div(c);
```

## The goals and non-goals of C3 operator overloading

The goal of overloading in C3 is allow arithmetics to be used on more types than the built in ones. In C,
types such as Complex needs to be implemented in the language itself to get access to `+ - * /`. Expanding the number of builtin types is possible, and the solution the programming language Odin uses. In Odin there is a rich number of builtins, including quaternion and matrix types.

There is a limit to this, as each builtin would increase the complexity of the language itself. I recently considered fixed point types which in the absence of operator overloading would have to use method syntax or be builtins. The former makes such types second class and builtins would increase the language complexity.

That this is such a popular feature with maths and game programming also speaks strongly for its inclusion.

But we also have non goals for C3: I don't want operator overloading that is used to create "magic" solutions in C++. So overloading for things like casting operations, dereference, method dot and logical comparisons are out of scope.

The goal is to enable numerical types to be used in a convenient manner, not to enable advanced abstractions with smart pointers and the like.

That said, there are some omissions:

1. Comparison operators: useful for some numerical types, such as fixed point numbers, but less so for others – like a complex number or a matrix. Does it need to be in?
2. Bool conversion: again more useful for fixed point numbers than other numerical types even though zero may be well defined. That's said, it's easily abused.

So at least for 0.7.1, these are omitted.

## C3: An evolved C + operator overloading

C3 brings a lot of conveniences and improvements to C: slices, modules, generics, error handling, SIMD vectors, methods, contracts and more.

Mostly these are incremental improvements. If we look at something like slices, C can have slice types too, using macros, but it's inconvenient. Similar with generics (macro-based generics are possible in C), SIMD vectors, contracts etc.

On the other hand `.method()` syntax is certainly not in C, and C3 has much more compile time reflection available, but this is rarely a major pain point for C programmers. Operator overloading on the other hand: this is something you can't properly emulate in C. So for C programmers that *really* need operator overloading, there isn't really any way to get this. C++ or some similarly more complex language - such as Rust – is the only way out.

Of the recent indie C alternatives: Odin, Zig, C3 and Hare, only C3 offers operator overloading(\*). Odin, as previously mentioned, addresses the issue with a rich set of builtin numerical types instead.

So moving forward it's possible that this feature should be pushed a bit more as it differentiates C3 from the alternatives. People looking for a simpler alternative to C++ for "C + operator overloading", now has C3 as another option to consider.

(\* One should note that Jai, Jonathan Blow's C++ alternative geared towards game programming, offers operator overloading)

## Wrapping it up

It's taken a long time for C3 to get operator overloading, but now that it's finally here, the language will lean into it, taking advantage of what it offers. Some features, such as `@compact` implicitly allowing comparisons will likely be removed. The standard library will add fixed point numbers and potentially leverage it for other things as well that otherwise was so marginal as to never be considered (saturating integers comes to mind).

I have been extremely reluctant to add operator overloading for arithmetics and resisted it for years, so the fact that we're adding it to C3 *anyway* is showing how much value it brings.

0.7.1 will officially be released the 1st of May (possibly earlier)

## Comments


---
### Comment by Christoffer Lernö

Operator overloading is a divisive feature. It's been used for atrocious hacks, and to make code totally unreadable, but it's also the reason people stick to a C-like subset of C++ rather than using plain C for projects.

C3 has had operator overloading for a long time, but only for array indexing. In fact there are four different overloads: `len` `[]` `[]=` and `&[]`. Together they do not only enable indexing, but more importantly they enable `foreach`.

If a type implements `len` and at least one of `[]` and `&[]`, then you get `foreach` on that type. `&[]` is required for `foreach` with ref arguments though. And while you can use `[]` without implementing `len`, you need `len` for reverse indexing like `a[^3]`.

However, I've resisted adding operator overloading for arithmetics and equals. Such a change brings us further away from C semantics than I've felt comfortable with. It can certainly be extremely misused and cause confusion.

But, as of 0.7.1 it's in the language. So what made me change my mind?

Most important to me is the fact that in practice people need this. C already has features that can be misused, such as untyped pointers, and we still use it. The same can be said of operator overloading.

## Overview

C3 allows the arithmetic operators `+ - * / %` and unary `-` to be overloaded. In addition to this, bit operators `^ | &` and `<< >>` may be overloaded. `==` and `!=` and "operator + assign" operators such as `+=` and `<<=` are also possible to overload.

Some technical details:

1. You can create multiple overloads for a single type, for example `Vec * Vec` and `Vec * int`.
2. Only user defined types may be overloaded. However, bitstructs already have `^ | &` defined, so those may not be overloaded.
3. Overloading `==` will implicitly make `!=` work and vice versa.
4. "operator + assign" operators are not required, they will be generated from the operator if not present.

### Working with primitive types

While it's not possible to add `@operator` (the attribute usually used to define the overload) to define something like `int + Vec`, there are two additional attributes added: `@operator_s` ("symmetric operator") and `@operator_r` ("reverse operator") to help it. The former allows either type to go first, and `@operator_r` requires the second term to be the first one in the arithmetic expression.

### Examples

```
// Defining a simple add: "Complex + Complex"
macro Complex Complex.add(self, Complex b) @operator(+) => { .v = self.v + b.v };
// Define the self-modifying +=: "Complex += Complex"
macro Complex Complex.add_this(&self, Complex b) @operator(+=) => { .v = self.v += b.v };
```

The use of the symmetric operator overloading:

```
// This defines "Quaternion * Real" /and/ "Real * Quaternion"
macro Quaternion Quaternion.scale(self, Real s) @operator_s(*) => { .v = self.v * s };
```

And finally, reverse operator:

```
// This defines "Real / Complex"
macro Complex Complex.div_real_inverse(Complex c, Real r) @operator_r(/) => ((Complex) { .r = self }).div(c);
```

## The goals and non-goals of C3 operator overloading

The goal of overloading in C3 is allow arithmetics to be used on more types than the built in ones. In C,
types such as Complex needs to be implemented in the language itself to get access to `+ - * /`. Expanding the number of builtin types is possible, and the solution the programming language Odin uses. In Odin there is a rich number of builtins, including quaternion and matrix types.

There is a limit to this, as each builtin would increase the complexity of the language itself. I recently considered fixed point types which in the absence of operator overloading would have to use method syntax or be builtins. The former makes such types second class and builtins would increase the language complexity.

That this is such a popular feature with maths and game programming also speaks strongly for its inclusion.

But we also have non goals for C3: I don't want operator overloading that is used to create "magic" solutions in C++. So overloading for things like casting operations, dereference, method dot and logical comparisons are out of scope.

The goal is to enable numerical types to be used in a convenient manner, not to enable advanced abstractions with smart pointers and the like.

That said, there are some omissions:

1. Comparison operators: useful for some numerical types, such as fixed point numbers, but less so for others – like a complex number or a matrix. Does it need to be in?
2. Bool conversion: again more useful for fixed point numbers than other numerical types even though zero may be well defined. That's said, it's easily abused.

So at least for 0.7.1, these are omitted.

## C3: An evolved C + operator overloading

C3 brings a lot of conveniences and improvements to C: slices, modules, generics, error handling, SIMD vectors, methods, contracts and more.

Mostly these are incremental improvements. If we look at something like slices, C can have slice types too, using macros, but it's inconvenient. Similar with generics (macro-based generics are possible in C), SIMD vectors, contracts etc.

On the other hand `.method()` syntax is certainly not in C, and C3 has much more compile time reflection available, but this is rarely a major pain point for C programmers. Operator overloading on the other hand: this is something you can't properly emulate in C. So for C programmers that *really* need operator overloading, there isn't really any way to get this. C++ or some similarly more complex language - such as Rust – is the only way out.

Of the recent indie C alternatives: Odin, Zig, C3 and Hare, only C3 offers operator overloading(\*). Odin, as previously mentioned, addresses the issue with a rich set of builtin numerical types instead.

So moving forward it's possible that this feature should be pushed a bit more as it differentiates C3 from the alternatives. People looking for a simpler alternative to C++ for "C + operator overloading", now has C3 as another option to consider.

(\* One should note that Jai, Jonathan Blow's C++ alternative geared towards game programming, offers operator overloading)

## Wrapping it up

It's taken a long time for C3 to get operator overloading, but now that it's finally here, the language will lean into it, taking advantage of what it offers. Some features, such as `@compact` implicitly allowing comparisons will likely be removed. The standard library will add fixed point numbers and potentially leverage it for other things as well that otherwise was so marginal as to never be considered (saturating integers comes to mind).

I have been extremely reluctant to add operator overloading for arithmetics and resisted it for years, so the fact that we're adding it to C3 *anyway* is showing how much value it brings.

0.7.1 will officially be released the 1st of May (possibly earlier)