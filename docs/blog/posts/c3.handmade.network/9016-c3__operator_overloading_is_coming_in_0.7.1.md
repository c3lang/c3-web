---
title: "C3: Operator overloading is coming in 0.7.1"
date: 2025-04-14
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/9016-c3__operator_overloading_is_coming_in_0.7.1](https://c3.handmade.network/blog/p/9016-c3__operator_overloading_is_coming_in_0.7.1)*

Initially I had planned 0.7.1 to be mostly patching 0.7.0, but plans change.

The big news is that operator overloading is coming. Not just the existing overload of `[]` `&[]` and `[]=`, but arithmetics, bit operations and equals is all coming.

Comparisons is conspicuously missing, but might arrive.

Overloading is here to simplify creating numerical types that can be manipulated with the normal operators.

Consequently, there won't be anything like C++, where you can overload deref, dot invocation, casts etc. Also, overloads may not manipulate global state.

All in all, using these overloads for anything but numerical types is not intended (yes, so don't string concat with `+` nor should you use `<<` to append to lists etc)

Operator overloading will only allowed on user defined types.

## Comments


---
### Comment by Christoffer Lernö

Initially I had planned 0.7.1 to be mostly patching 0.7.0, but plans change.

The big news is that operator overloading is coming. Not just the existing overload of `[]` `&[]` and `[]=`, but arithmetics, bit operations and equals is all coming.

Comparisons is conspicuously missing, but might arrive.

Overloading is here to simplify creating numerical types that can be manipulated with the normal operators.

Consequently, there won't be anything like C++, where you can overload deref, dot invocation, casts etc. Also, overloads may not manipulate global state.

All in all, using these overloads for anything but numerical types is not intended (yes, so don't string concat with `+` nor should you use `<<` to append to lists etc)

Operator overloading will only allowed on user defined types.