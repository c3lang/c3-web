---
title: "Inspirations for C3's features"
date: 2023-06-10
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8723-inspirations_for_c3%2527s_features](https://c3.handmade.network/blog/p/8723-inspirations_for_c3%2527s_features)*

When designing a new programming language, *research* is incredibly important. While research can be investigating new syntax and new semantics, most of it is actually looking at other language's features and seeing if anything worked extra well and wether it could be useful for your own language.

C3 is derived from [C2](http://c2lang.org), which in turn is an evolution of C, so the basis of the language itself is clear. But what about the features on top of C -where do they come from? I thought it might be amusing to list the features and where they originated.

### Features and where they come from

**Modules** – Java was probably the primary inspiration for a lot of it, since it has a very simple and well understood system with packages. However, Java's imports are actually only about visibility, not about really importing anything, so there are very clear differences. I've written more in detail [here](https://c3.handmade.network/blog/p/8650-a_look_at_modules_in_general__in_the_context_of_c3).

**Generic modules** - This was inspired by macro based container libraries in C, as well as ASTEC's "@module" macro.

**Faults/optionals** - Originally this was similar to [Zig](https://ziglang.org)'s design, but took on inspiration from Herbceptions, Haskell/Rust results, C and Go error handling into something original.

**Macros** - This was based largely on ASTEC but added things like iteration.

**Struct subtyping** - This is a Plan9 feature that also ended up in Go. I got it from reading about the Plan9 C compiler.

**Slices** - This exists in many languages, it's hard to say what languages I based it on.

**Slicing syntax** - The `^1` syntax comes from C#, otherwise it's mostly [D](https://dlang.org) with some looks at Swift and [Odin](https://odin-lang.org).

**Contracts** - While a lot of languages try to add a bit of contract support, [Eiffel](https://www.eiffel.com) is the language I looked at. Placing the contracts in the docs was a change for C3.

**Def** - I started by looking at [D](https://dlang.org). The inclusion of "distinct" types comes from [Odin](https://odin-lang.org). The restriction that function types only to be accessed through `def` is from [C2](http://c2lang.org). The idea that generic modules are instantiated using `def` occurs in earlier languages, I remember looking at Ada in particular.

**Reflection** - I'd say Jai got the ball rolling here, with some additional inspiration from [Odin](https://odin-lang.org). It was clear from the start that reflection like Java or Objective-C was out of question, and that Jai's runtime information was more than I wanted. I read about reflection in other languages as well, with D having quite a bit of influence on the syntax.

**Operator overloading** - I certainly looked at overloading in C++, D and other languages, but in the end the result was a bit in between everything.

**Dynamic calls** - This is from Objective-C.

**Undefined behaviour** - The C3 attitude to UB is strongly influenced by [Odin](https://odin-lang.org), but doesn't go quite that far.

**Implicit conversions** - Originally this borrowed from [Zig](https://ziglang.org), but after a lot of research, it ended as a unique blend of C and Java ideas, without the need for untyped literals.

**Precedence rules** - Just trying to avoid retaining the poor precedence rules of C.

**Project files** - Derived from [C2](http://c2lang.org), but modified.

**Any and typeid types** - mainly inspired by [Odin](https://odin-lang.org).

**Enum associated values** - derived from Java enums.

**Bitstructs** - inspired by [PacketC](https://link.springer.com/content/pdf/10.1007/978-1-4302-4159-1_2.pdf).

**Extended switch** - pattern matching in many languages.

**Flowtyping to unwrap** - Java / [Kotlin](https://kotlinlang.org/docs/null-safety.html#safe-calls) in JetBrains' IDEs.

**Foreach** - ObjC and Java originally. The idea (and syntax!) to allow getting values by ref comes from PHP.

**Base64 and hex literals** - Inspired by language "wish lists" on the web :D.

**Zero init by default** - Ultimately [Odin](https://odin-lang.org) convinced me this was a good idea.

**Array/slice arithmetics** - A subset of [Odin](https://odin-lang.org) and D functionality.

**Type methods** - An extension of [C2](http://c2lang.org) struct functions.

**Attributes** - Based on [C2](http://c2lang.org) attributes

**Defer** - Based on Swift and Jai defer. Extensions `defer catch` and `defer try` were added on top. While [Zig](https://ziglang.org) has a `errdefer` which works like `defer catch` the C3 feature was developed without knowledge of that Zig addition(!)

**Special syntax for compile time** - Mostly driven by a need to make compile time clearer than compile time code in [Zig](https://ziglang.org).

**Visibility rules** - I did lots of research on this, so it's hard to say where it comes from. Certainly some I made up for C3. "Public by default" comes from [Odin](https://odin-lang.org). Some ideas for export and visibility came from [D](https://dlang.org).

**Raw strings** - I experimented with a lot of different styles, ultimately I picked Go style from comparing with [Odin](https://odin-lang.org). Escaping a single backtick by having two in a row is also from some language, but unfortunately I don't recall which one.

**Ranges in initializers** - This is a GCC extension.

**Expression block** - This is a variant of the GCC statement expression that I changed be a self contained block where `return` only jumped out of the block. So it's an evolution of the GCC feature.

**Ranges in case statements** - Yes, this is a GCC extension as well.

**Named arguments** - Probably borrowed from Swift originally.

**Trailing macro body** - This is a unique functionality, but it is somewhat similar to trailing body lambdas in Ruby and later Swift.

**Lambdas** - These are syntactically very similar to Java's lambdas. But of course C3 does not capture closures.

**Static initializers and finalizers** - Syntactically somewhat derived from Java `static` blocks.

**Function syntax** - This is from [C2](http://c2lang.org), but in shortened form (C2 uses `func`)

**Allocators** - Influences from Jai, [Odin](https://odin-lang.org) and [Zig](https://ziglang.org), but ultimately C3 picks its own trade off.

**Temp allocators** - Mostly based off [Odin](https://odin-lang.org) originally.

**Inline asm** - Mostly based on [MSVC inline asm](https://learn.microsoft.com/en-us/cpp/assembler/inline/asm?view=msvc-170).

### Final words

On top of the above, C3 is of course indebted to all the people I've engaged in language discussions with over the years. I should mention Jon Goodwin ([Cone](https://cone.jondgoodwin.com)) and Andrey Penechko ([Vox](https://github.com/MrSmith33/vox)) in particular, but I want to thank everyone who helped with thoughts and feedback (and complaints!) over the years.

Thank you!

---

If you are curious about C3 you can try it at <https://learn-c3.org> or download the compiler from <https://github.com/c3lang/c3c>

P.S. A bonus tidbit: the use of `printn` and `printfn` instead of `println` and `printfln` comes from F#

## Comments


---
### Comment by Christoffer Lernö

When designing a new programming language, *research* is incredibly important. While research can be investigating new syntax and new semantics, most of it is actually looking at other language's features and seeing if anything worked extra well and wether it could be useful for your own language.

C3 is derived from [C2](http://c2lang.org), which in turn is an evolution of C, so the basis of the language itself is clear. But what about the features on top of C -where do they come from? I thought it might be amusing to list the features and where they originated.

### Features and where they come from

**Modules** – Java was probably the primary inspiration for a lot of it, since it has a very simple and well understood system with packages. However, Java's imports are actually only about visibility, not about really importing anything, so there are very clear differences. I've written more in detail [here](https://c3.handmade.network/blog/p/8650-a_look_at_modules_in_general__in_the_context_of_c3).

**Generic modules** - This was inspired by macro based container libraries in C, as well as ASTEC's "@module" macro.

**Faults/optionals** - Originally this was similar to [Zig](https://ziglang.org)'s design, but took on inspiration from Herbceptions, Haskell/Rust results, C and Go error handling into something original.

**Macros** - This was based largely on ASTEC but added things like iteration.

**Struct subtyping** - This is a Plan9 feature that also ended up in Go. I got it from reading about the Plan9 C compiler.

**Slices** - This exists in many languages, it's hard to say what languages I based it on.

**Slicing syntax** - The `^1` syntax comes from C#, otherwise it's mostly [D](https://dlang.org) with some looks at Swift and [Odin](https://odin-lang.org).

**Contracts** - While a lot of languages try to add a bit of contract support, [Eiffel](https://www.eiffel.com) is the language I looked at. Placing the contracts in the docs was a change for C3.

**Def** - I started by looking at [D](https://dlang.org). The inclusion of "distinct" types comes from [Odin](https://odin-lang.org). The restriction that function types only to be accessed through `def` is from [C2](http://c2lang.org). The idea that generic modules are instantiated using `def` occurs in earlier languages, I remember looking at Ada in particular.

**Reflection** - I'd say Jai got the ball rolling here, with some additional inspiration from [Odin](https://odin-lang.org). It was clear from the start that reflection like Java or Objective-C was out of question, and that Jai's runtime information was more than I wanted. I read about reflection in other languages as well, with D having quite a bit of influence on the syntax.

**Operator overloading** - I certainly looked at overloading in C++, D and other languages, but in the end the result was a bit in between everything.

**Dynamic calls** - This is from Objective-C.

**Undefined behaviour** - The C3 attitude to UB is strongly influenced by [Odin](https://odin-lang.org), but doesn't go quite that far.

**Implicit conversions** - Originally this borrowed from [Zig](https://ziglang.org), but after a lot of research, it ended as a unique blend of C and Java ideas, without the need for untyped literals.

**Precedence rules** - Just trying to avoid retaining the poor precedence rules of C.

**Project files** - Derived from [C2](http://c2lang.org), but modified.

**Any and typeid types** - mainly inspired by [Odin](https://odin-lang.org).

**Enum associated values** - derived from Java enums.

**Bitstructs** - inspired by [PacketC](https://link.springer.com/content/pdf/10.1007/978-1-4302-4159-1_2.pdf).

**Extended switch** - pattern matching in many languages.

**Flowtyping to unwrap** - Java / [Kotlin](https://kotlinlang.org/docs/null-safety.html#safe-calls) in JetBrains' IDEs.

**Foreach** - ObjC and Java originally. The idea (and syntax!) to allow getting values by ref comes from PHP.

**Base64 and hex literals** - Inspired by language "wish lists" on the web :D.

**Zero init by default** - Ultimately [Odin](https://odin-lang.org) convinced me this was a good idea.

**Array/slice arithmetics** - A subset of [Odin](https://odin-lang.org) and D functionality.

**Type methods** - An extension of [C2](http://c2lang.org) struct functions.

**Attributes** - Based on [C2](http://c2lang.org) attributes

**Defer** - Based on Swift and Jai defer. Extensions `defer catch` and `defer try` were added on top. While [Zig](https://ziglang.org) has a `errdefer` which works like `defer catch` the C3 feature was developed without knowledge of that Zig addition(!)

**Special syntax for compile time** - Mostly driven by a need to make compile time clearer than compile time code in [Zig](https://ziglang.org).

**Visibility rules** - I did lots of research on this, so it's hard to say where it comes from. Certainly some I made up for C3. "Public by default" comes from [Odin](https://odin-lang.org). Some ideas for export and visibility came from [D](https://dlang.org).

**Raw strings** - I experimented with a lot of different styles, ultimately I picked Go style from comparing with [Odin](https://odin-lang.org). Escaping a single backtick by having two in a row is also from some language, but unfortunately I don't recall which one.

**Ranges in initializers** - This is a GCC extension.

**Expression block** - This is a variant of the GCC statement expression that I changed be a self contained block where `return` only jumped out of the block. So it's an evolution of the GCC feature.

**Ranges in case statements** - Yes, this is a GCC extension as well.

**Named arguments** - Probably borrowed from Swift originally.

**Trailing macro body** - This is a unique functionality, but it is somewhat similar to trailing body lambdas in Ruby and later Swift.

**Lambdas** - These are syntactically very similar to Java's lambdas. But of course C3 does not capture closures.

**Static initializers and finalizers** - Syntactically somewhat derived from Java `static` blocks.

**Function syntax** - This is from [C2](http://c2lang.org), but in shortened form (C2 uses `func`)

**Allocators** - Influences from Jai, [Odin](https://odin-lang.org) and [Zig](https://ziglang.org), but ultimately C3 picks its own trade off.

**Temp allocators** - Mostly based off [Odin](https://odin-lang.org) originally.

**Inline asm** - Mostly based on [MSVC inline asm](https://learn.microsoft.com/en-us/cpp/assembler/inline/asm?view=msvc-170).

### Final words

On top of the above, C3 is of course indebted to all the people I've engaged in language discussions with over the years. I should mention Jon Goodwin ([Cone](https://cone.jondgoodwin.com)) and Andrey Penechko ([Vox](https://github.com/MrSmith33/vox)) in particular, but I want to thank everyone who helped with thoughts and feedback (and complaints!) over the years.

Thank you!

---

If you are curious about C3 you can try it at <https://learn-c3.org> or download the compiler from <https://github.com/c3lang/c3c>

P.S. A bonus tidbit: the use of `printn` and `printfn` instead of `println` and `printfln` comes from F#