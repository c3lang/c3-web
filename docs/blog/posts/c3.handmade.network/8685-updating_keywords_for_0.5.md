---
title: "Updating keywords for 0.5"
date: 2023-04-08
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8685-updating_keywords_for_0.5](https://c3.handmade.network/blog/p/8685-updating_keywords_for_0.5)*

I’ve been working on shaving off the rough corners in the C3 syntax for version 0.5, and one of the changes I'm likely to make is replacing `variant` and `anyerr` with `any` and `anyfault`

"variant" was originally chosen because it wasn't intended for frequent use – unlike most `any` types in other languages. In addition I liked the idea that "any" could be used as a variable name.

As for `anyerr`, it was chosen while I still called the failure result `error`. `anyerr` was than Zig’s `anyerror` and I've in general been happy with the name. The abbreviation doesn't affect readability or clarity.

As the optional/result semantics matured however, it became increasingly clear that `error` (or a shorter "err") made a bad keyword. With its novel semantics it doesn't quite represent an error, and it was important to highlight this. That was why the keyword was changed to `fault` instead of `error`.

I wasn't sure about `fault`, so I tried variants of it - including reusing enums (`enum MyResult : anyerr { ... }`), but everything I tried was in practice less clear than `fault`.

So to avoid too many different terms `anyfault` is likely going to replace `anyerr`. While I would have liked to shorten it, I've found no good way to abbreviate “fault” (unlike “error” -> "err"). Fortunately, `anyerr`/`anyfault` is not used frequently. Currently in the standard library it is just used in two locations. This is in contrast with Zig, where `anyerror` is a common return type.

The experiment using `variant` rather than `any` largely failed: I never really needed `any` as a variable name, and where the type was used `variant` felt less clear than `any` would have been.

This also gives the language a consistent pair:

```
any
anyfault
```

While consistency in name isn't a requirement, it's always nice to have when you can.

Most importantly, the lesson here is that it is fine to pick some keywords and try them out, and its fine to change them. Neither `anyfault` nor `any` were choices I could know were "right" from the beginning. Rather, they are choices that only experience could reveal.

Don't expect your first syntax and keyword choices to be the best ones, but also you need to decide on *something* to get started. No matter how much bikeshedding you do, you can't really predict the feel of a choice until you try it for real.

## Comments


---
### Comment by Christoffer Lernö

I’ve been working on shaving off the rough corners in the C3 syntax for version 0.5, and one of the changes I'm likely to make is replacing `variant` and `anyerr` with `any` and `anyfault`

"variant" was originally chosen because it wasn't intended for frequent use – unlike most `any` types in other languages. In addition I liked the idea that "any" could be used as a variable name.

As for `anyerr`, it was chosen while I still called the failure result `error`. `anyerr` was than Zig’s `anyerror` and I've in general been happy with the name. The abbreviation doesn't affect readability or clarity.

As the optional/result semantics matured however, it became increasingly clear that `error` (or a shorter "err") made a bad keyword. With its novel semantics it doesn't quite represent an error, and it was important to highlight this. That was why the keyword was changed to `fault` instead of `error`.

I wasn't sure about `fault`, so I tried variants of it - including reusing enums (`enum MyResult : anyerr { ... }`), but everything I tried was in practice less clear than `fault`.

So to avoid too many different terms `anyfault` is likely going to replace `anyerr`. While I would have liked to shorten it, I've found no good way to abbreviate “fault” (unlike “error” -> "err"). Fortunately, `anyerr`/`anyfault` is not used frequently. Currently in the standard library it is just used in two locations. This is in contrast with Zig, where `anyerror` is a common return type.

The experiment using `variant` rather than `any` largely failed: I never really needed `any` as a variable name, and where the type was used `variant` felt less clear than `any` would have been.

This also gives the language a consistent pair:

```
any
anyfault
```

While consistency in name isn't a requirement, it's always nice to have when you can.

Most importantly, the lesson here is that it is fine to pick some keywords and try them out, and its fine to change them. Neither `anyfault` nor `any` were choices I could know were "right" from the beginning. Rather, they are choices that only experience could reveal.

Don't expect your first syntax and keyword choices to be the best ones, but also you need to decide on *something* to get started. No matter how much bikeshedding you do, you can't really predict the feel of a choice until you try it for real.