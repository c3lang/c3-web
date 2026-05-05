---
title: "A zoo of casts"
date: 2020-07-14
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/a-zoo-of-casts-4bob](https://dev.to/lerno/a-zoo-of-casts-4bob)*

I recently made a post on Reddit to ask about various types of cast syntax. For posterity's sake I'm recording them here.

Note that I'm ignoring the behaviour of the cast. Some languages have different syntax for upcasts, downcasts, bitcasts etc. I'm not concerned with that here. This is merely a list of variants of visual syntax. Consequently I list `:>` even though that's only a special form of cast for F#, and only one of the many `keyword<type>(x)` casts for C++, even though there are many variants.

Also I apologize in advance if the attribution is incorrect somewhere. I don't know all the languages I list here.

(The list of languages for each is also incomplete – it's just a sample)

    cast(x, int)        MATLAB
    int(x)              Pascal
    <int>x              Typescript
    (int)x              C/C++/Java/Beef/C#
    static_cast<int>    C++
    x as int            C#/Swift/Rust
    x as! int           Swift
    cast(x as int)      SQL
    cast(int)x          D, Jai
    @as(int, x)         Zig
    [int]x              Pike
    (int)(x)            Go
    x :>                F#
    cast[int](x)        Nim
    x.as(int)           Crystal/Ecstasy
    x->(int)            Frost
    (x: int)            Flow
    cast<int>(x)        C2
    x.asInstanceOf(int) Scala
    x.(int)             Go
    x $ int             ChucK
    int'(x)             Verilog
    
For fun, here are other permutations of the cast syntax that may or may not be useful:

    (x as int)       
    (x, int)
    x<int>
    x::int
    (int : x)
    (int x)
    int::x
    (x :: int)
    cast(x -> int)
    x to int
    x#int
    int:x
    x.as[int]
    x[int]
    x.int
    (int >> x)

C3 is currently using `cast(x, int)` but that might change.

When evaluating syntax, readability is important and it is always nice if the precedence is crystal clear.

As an example: `x as Foo[4]` – would that be `x as (Foo[4])` or `(x as Foo)[4]`? Precedence rules will obviously decide, but if we compare with `cast<Foo[4]>(x)` the latter is much clearer because there is no need to know the precedence. 

But length also matters: `x = int(y) + int(z)` is succinct while `x = cast(y, int) + cast(z, int)` feels quite a bit more wordy.

Picking a good cast syntax for a language is clearly one of difficult trade-offs.