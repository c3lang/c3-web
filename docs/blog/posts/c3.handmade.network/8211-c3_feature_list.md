---
title: "C3 Feature List"
date: 2021-11-09
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8211-c3_feature_list](https://c3.handmade.network/blog/p/8211-c3_feature_list)*

I wrapped up the `bitstruct` code last week, and together with that removed the `virtual` type. Happily this make the language nearly feature complete for 1.0.

This also means I finally have the means to write a fairly solid "what's different from C" list. It's not written in stone, and some things may change, but since the dev from now on is going to be about fleshing out existing features rather than adding new features, any major new features are unlikely.

So without further ado, here's the list of changes from C:

* Module system
* Optional contracts
* Semantic macros
* Templates through generic modules
* Subarrays (slices)
* Foreach
* Distinct types (similar to typedef but the type is distinct)
* Compile time evaluation
* Compile time reflection of types
* Defer
* Arrays as values
* Struct sub-typing (similar to embedded structs in Go)
* Built-in SIMD vectors
* Overloadable foreach, allowing types to define custom foreach.
* Less permissive implicit type conversions and safer widenings
* Subarray assign/set (e.g. `foo[1..3] = 3`)
* Language support for error values
* Type methods (dot-syntax invocation)
* Implicit deref on `.` (removes `->`)
* Bitstructs (well-defined bit packing)
* Expression blocks (similar to GCC statement expressions)
* Enum associated values
* Opt-in structural typing
* Integer types have well defined bit width
* 2cc, 4cc, 8cc literals
* Base64 and hex literals
* Signed overflow is wrapping
* Most C UB moved to "implementation defined behaviour"
* Signed integers are 2s complement
* Typesafe varargs
* "Any" type
* Fewer operator precedence levels
* Build system included

And yes, with some exceptions you can play with these features today.

## Comments


---
### Comment by Christoffer Lernö

I wrapped up the `bitstruct` code last week, and together with that removed the `virtual` type. Happily this make the language nearly feature complete for 1.0.

This also means I finally have the means to write a fairly solid "what's different from C" list. It's not written in stone, and some things may change, but since the dev from now on is going to be about fleshing out existing features rather than adding new features, any major new features are unlikely.

So without further ado, here's the list of changes from C:

* Module system
* Optional contracts
* Semantic macros
* Templates through generic modules
* Subarrays (slices)
* Foreach
* Distinct types (similar to typedef but the type is distinct)
* Compile time evaluation
* Compile time reflection of types
* Defer
* Arrays as values
* Struct sub-typing (similar to embedded structs in Go)
* Built-in SIMD vectors
* Overloadable foreach, allowing types to define custom foreach.
* Less permissive implicit type conversions and safer widenings
* Subarray assign/set (e.g. `foo[1..3] = 3`)
* Language support for error values
* Type methods (dot-syntax invocation)
* Implicit deref on `.` (removes `->`)
* Bitstructs (well-defined bit packing)
* Expression blocks (similar to GCC statement expressions)
* Enum associated values
* Opt-in structural typing
* Integer types have well defined bit width
* 2cc, 4cc, 8cc literals
* Base64 and hex literals
* Signed overflow is wrapping
* Most C UB moved to "implementation defined behaviour"
* Signed integers are 2s complement
* Typesafe varargs
* "Any" type
* Fewer operator precedence levels
* Build system included

And yes, with some exceptions you can play with these features today.