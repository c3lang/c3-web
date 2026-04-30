---
title: "Why implicit imports fails"
date: 2022-07-01
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8448-why_implicit_imports_fails](https://c3.handmade.network/blog/p/8448-why_implicit_imports_fails)*

As [previously discussed](https://c3.handmade.network/blog/p/8417-imports_and_modules), it might be possible to do implicit imports so using `Foo` would implicitly do it. In C3 due to the overall rules, this leads to few ambiguities (go back to the [blog post](https://c3.handmade.network/blog/p/8417-imports_and_modules) to review how it works)

After using this for quite a while, I ended up concluding that full implicit imports are bad. You want enough high level importing to feel that there is *some* documentation of what is included to hint at the possible origin of types.

An example is when read some code that relies on an external graphics library and you encounter a type like `Point` or `Vector2`. Because at that point you can't be sure whether this is a type from the external library or from some obscure part of the standard library. Same with something like `Socket` or `Connection`: is that `Socket` from a standard lib networking library, or is it from some external imported library? If the standard library is big enough then you can't know for sure – and finding out is not easy.

So you want at least a high level import, but possibly not `import std::net::socket` granularity, but rather something like `import std::net` or `import raylib` at the top of the file – enough to make it easy to find the types and functions.

So the new updated scheme has wildcard inclusion by default (so `import std::net` would include all the sub modules).

In addition, I've also made modules implicitly import any other module with the same top domain. So code in `std::net::socket` would see the code in `std::net::http` without the need for an explicit import.

This means that if you start a project with some top module, for example `mygame`, then in the module `mygame::gameloop` you'll automatically import `mygame::maths` and `mygame::data`.

There are some issues with the latter. In particular, all of the standard library modules would see all other standard library modules! It's quite possible to address that, but first I want to make sure it's a problem in practice. Even completely implicit imports "almost worked", so maybe this isn't much of a problem.

## Comments


---
### Comment by Christoffer Lernö

As [previously discussed](https://c3.handmade.network/blog/p/8417-imports_and_modules), it might be possible to do implicit imports so using `Foo` would implicitly do it. In C3 due to the overall rules, this leads to few ambiguities (go back to the [blog post](https://c3.handmade.network/blog/p/8417-imports_and_modules) to review how it works)

After using this for quite a while, I ended up concluding that full implicit imports are bad. You want enough high level importing to feel that there is *some* documentation of what is included to hint at the possible origin of types.

An example is when read some code that relies on an external graphics library and you encounter a type like `Point` or `Vector2`. Because at that point you can't be sure whether this is a type from the external library or from some obscure part of the standard library. Same with something like `Socket` or `Connection`: is that `Socket` from a standard lib networking library, or is it from some external imported library? If the standard library is big enough then you can't know for sure – and finding out is not easy.

So you want at least a high level import, but possibly not `import std::net::socket` granularity, but rather something like `import std::net` or `import raylib` at the top of the file – enough to make it easy to find the types and functions.

So the new updated scheme has wildcard inclusion by default (so `import std::net` would include all the sub modules).

In addition, I've also made modules implicitly import any other module with the same top domain. So code in `std::net::socket` would see the code in `std::net::http` without the need for an explicit import.

This means that if you start a project with some top module, for example `mygame`, then in the module `mygame::gameloop` you'll automatically import `mygame::maths` and `mygame::data`.

There are some issues with the latter. In particular, all of the standard library modules would see all other standard library modules! It's quite possible to address that, but first I want to make sure it's a problem in practice. Even completely implicit imports "almost worked", so maybe this isn't much of a problem.