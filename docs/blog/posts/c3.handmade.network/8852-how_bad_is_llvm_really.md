---
title: "How bad is LLVM really?"
date: 2024-01-18
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8852-how_bad_is_llvm_really](https://c3.handmade.network/blog/p/8852-how_bad_is_llvm_really)*

LLVM used to be hailed as a great thing, but with language projects such as Rust, Zig and others complaining it's bad and slow and they're moving away from it – how bad is LLVM really?

## What is LLVM?

LLVM of today is not just a compiler backend, it's a whole toolchain, and the project also provides a linker (lld), a C compiler available as a library (Clang) and much more.

Except for the anomaly of Zig (Zig also uses the entire Clang as a library), most language projects simply use the LLVM backend, and possibly also the lld linker.

LLVM, Clang, lld and most other parts of the project are written in C++, with a C API available for LLVM, but not for most of the other libraries.

## The speed problem

When Clang was released, a selling point was that it compiled faster than GCC. Since then this has slipped a bit and GCC and Clang is about equally slow.

The problem is not in optimized builds - most people accept that optimized builds will compile slowly. No, the problem is that *unoptimized builds* compile slowly. How slow? LLVM codegen and linking takes over 98% of the total compilation time for the C3 compiler when codegen is single threaded with no optimizations.

If codegen is 2 magnitudes slower than parsing, lexing and semantic checking *combined*, then you can see why compiler writers might not be totally happy with LLVM's performance.

## Why is LLVM slow?

First a disclaimer: I have only read the LLVM source code a bit, I haven't contributed anything beyond a few small fixes so I'm not an expert.

However, it seems to me that LLVM has a fairly traditional C++ OO design. One thing this results in is an abundance of heap allocations. An early experiment switching the C3 compiler to mimalloc improved LLVM running times with a whopping 10%, which could only be true if memory allocations were a large contributor to the runtime cost. I would have expected LLVM to use arena allocators, but that doesn't seem to be the case for most code.

Heap allocations aside, using C++ or similar languages often invite certain inefficient patterns. It's easy to just rely on high level constructs to solve problems:

Need to check if a list has duplicates? No problem, just grab a hash set and check!

Except if the list is typically only 2-3 entries, then just doing a linear search might be much faster and require no setup. It doesn't matter how clever and fast the hash set is. And they're usually fast – LLVM has lots of optimized containers, but if no container was needed, then it doesn't matter how fast it was.

It's not necessarily bad code, but it's not code this is likely to be highly performant.

## Why is LLVM "bad"?

There are other warts LLVM has. First up, the documentation isn't particularly great. It's not worse than many other libraries I've used, so this is more of a "we all wish it could be better because understanding the backend is hard enough as it is".

More fundamentally though, LLVM is very much a backend for C/C++. While LLVM has test suites, Clang is ultimately the product in the LLVM umbrella that really tests the backend. This results in codegen *not used* by Clang being notoriously unreliable, as well as often poorly optimized (passing structs around by value for instance).

Another consequence is that LLVM often has mandatory UB where C/C++ does. For example, integer division by zero is currently an unescapable undefined behaviour in LLVM – which is bad if your language wanted to define `x / 0` to be `0` for example. Another example is when `i << x` overflows due to `x` being the same or larger than the bit width of `i`. This yields a poison value in LLVM, so if you wanted, say, it to be `0`, you would have add a `select` on every such shift as there is no way to request well defined behaviour. At least in this case the result is a poison value and not UB. C/C++ of course considers `i << x` undefined behaviour for these overflow cases.

So: bugs, not-so-great documentation and assumption of C/C++ semantics are probably the main complaints I've seen.

## The problem with alternatives

Alternatives to LLVM that pop up are Cranelift, QBE etc. However, at the moment none of those offers the same kind of complete solution that LLVM provides - and some of them are slower than using LLVM! If you already started using LLVM's advanced features, you will struggle with feature parity, not to mention the limited platform support.

Integrating with GCC is an alternative, but it doesn't solve the compilation speed problem, nor the other "bad" things about LLVM.

At this point, a lot of projects will start thinking about writing their own backend, and honestly this is probably a better alternative than using anything incomplete off the shelf at the moment, as this ensures there isn't some missing functionality that is impossible to handle later.

So while there are some promising upcoming backends (Tilde Backend comes to mind), there isn't really a drop in replacement for LLVM today.

## LLVM the good parts

While there are these downsides to LLVM, we shouldn't lose track of what it actually brings to the table. It's a full fledged backend that is way more field tested than anything one could hope to write by oneself. It's reliable in the sense that it's not going away tomorrow or in five years. Buried in LLVM + Clang is a treasure trove of domain knowledge that a single developer can't be expected to accumulate on their own.

Being able to use LLVM is a huge service to language developers. What it lacks in speed it wins back in completeness.

## Final words

We all love to complain about LLVM. It's far from perfect, not the least in regards to speed. But at the same time, it is allowing language designers to build compilers that produces production quality machine code on a wide variety of platforms. So really, starting out with LLVM is a good idea. Once there is a backend that works there is plenty of time to explore other backends without any pressure.

So is LLVM bad? Well it has its bad parts, but it's also probably the best backend you can pick for your compiler when you start out (not counting transpiling to C).

You can worry about the bad parts later.

## Comments


---
### Comment by Christoffer Lernö

LLVM used to be hailed as a great thing, but with language projects such as Rust, Zig and others complaining it's bad and slow and they're moving away from it – how bad is LLVM really?

## What is LLVM?

LLVM of today is not just a compiler backend, it's a whole toolchain, and the project also provides a linker (lld), a C compiler available as a library (Clang) and much more.

Except for the anomaly of Zig (Zig also uses the entire Clang as a library), most language projects simply use the LLVM backend, and possibly also the lld linker.

LLVM, Clang, lld and most other parts of the project are written in C++, with a C API available for LLVM, but not for most of the other libraries.

## The speed problem

When Clang was released, a selling point was that it compiled faster than GCC. Since then this has slipped a bit and GCC and Clang is about equally slow.

The problem is not in optimized builds - most people accept that optimized builds will compile slowly. No, the problem is that *unoptimized builds* compile slowly. How slow? LLVM codegen and linking takes over 98% of the total compilation time for the C3 compiler when codegen is single threaded with no optimizations.

If codegen is 2 magnitudes slower than parsing, lexing and semantic checking *combined*, then you can see why compiler writers might not be totally happy with LLVM's performance.

## Why is LLVM slow?

First a disclaimer: I have only read the LLVM source code a bit, I haven't contributed anything beyond a few small fixes so I'm not an expert.

However, it seems to me that LLVM has a fairly traditional C++ OO design. One thing this results in is an abundance of heap allocations. An early experiment switching the C3 compiler to mimalloc improved LLVM running times with a whopping 10%, which could only be true if memory allocations were a large contributor to the runtime cost. I would have expected LLVM to use arena allocators, but that doesn't seem to be the case for most code.

Heap allocations aside, using C++ or similar languages often invite certain inefficient patterns. It's easy to just rely on high level constructs to solve problems:

Need to check if a list has duplicates? No problem, just grab a hash set and check!

Except if the list is typically only 2-3 entries, then just doing a linear search might be much faster and require no setup. It doesn't matter how clever and fast the hash set is. And they're usually fast – LLVM has lots of optimized containers, but if no container was needed, then it doesn't matter how fast it was.

It's not necessarily bad code, but it's not code this is likely to be highly performant.

## Why is LLVM "bad"?

There are other warts LLVM has. First up, the documentation isn't particularly great. It's not worse than many other libraries I've used, so this is more of a "we all wish it could be better because understanding the backend is hard enough as it is".

More fundamentally though, LLVM is very much a backend for C/C++. While LLVM has test suites, Clang is ultimately the product in the LLVM umbrella that really tests the backend. This results in codegen *not used* by Clang being notoriously unreliable, as well as often poorly optimized (passing structs around by value for instance).

Another consequence is that LLVM often has mandatory UB where C/C++ does. For example, integer division by zero is currently an unescapable undefined behaviour in LLVM – which is bad if your language wanted to define `x / 0` to be `0` for example. Another example is when `i << x` overflows due to `x` being the same or larger than the bit width of `i`. This yields a poison value in LLVM, so if you wanted, say, it to be `0`, you would have add a `select` on every such shift as there is no way to request well defined behaviour. At least in this case the result is a poison value and not UB. C/C++ of course considers `i << x` undefined behaviour for these overflow cases.

So: bugs, not-so-great documentation and assumption of C/C++ semantics are probably the main complaints I've seen.

## The problem with alternatives

Alternatives to LLVM that pop up are Cranelift, QBE etc. However, at the moment none of those offers the same kind of complete solution that LLVM provides - and some of them are slower than using LLVM! If you already started using LLVM's advanced features, you will struggle with feature parity, not to mention the limited platform support.

Integrating with GCC is an alternative, but it doesn't solve the compilation speed problem, nor the other "bad" things about LLVM.

At this point, a lot of projects will start thinking about writing their own backend, and honestly this is probably a better alternative than using anything incomplete off the shelf at the moment, as this ensures there isn't some missing functionality that is impossible to handle later.

So while there are some promising upcoming backends (Tilde Backend comes to mind), there isn't really a drop in replacement for LLVM today.

## LLVM the good parts

While there are these downsides to LLVM, we shouldn't lose track of what it actually brings to the table. It's a full fledged backend that is way more field tested than anything one could hope to write by oneself. It's reliable in the sense that it's not going away tomorrow or in five years. Buried in LLVM + Clang is a treasure trove of domain knowledge that a single developer can't be expected to accumulate on their own.

Being able to use LLVM is a huge service to language developers. What it lacks in speed it wins back in completeness.

## Final words

We all love to complain about LLVM. It's far from perfect, not the least in regards to speed. But at the same time, it is allowing language designers to build compilers that produces production quality machine code on a wide variety of platforms. So really, starting out with LLVM is a good idea. Once there is a backend that works there is plenty of time to explore other backends without any pressure.

So is LLVM bad? Well it has its bad parts, but it's also probably the best backend you can pick for your compiler when you start out (not counting transpiling to C).

You can worry about the bad parts later.

---
### Comment by Christoffer Lernö

Lexing, parsing and analysis is about 1-2% of the entire compile time when compiling C3 code *with no optimizations*. The rest is LLVM + linking, where linking is a small part of the time.

You can compare some compiler benchmarks here: <https://github.com/nordlow/compiler-benchmark>

Not that such benchmark really gives the real time compilation will take on general code, but it gives a rough level of magnitude between different compilers (and consequently compiler backends, as this is where the most of the time is spent for something like C)