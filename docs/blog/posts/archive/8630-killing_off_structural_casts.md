---
title: "Killing off structural casts"
date: 2023-01-09
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8630-killing_off_structural_casts](https://c3.handmade.network/blog/p/8630-killing_off_structural_casts)*

Structural casts are now gone from C3. This was the ability to do this:

```
struct Foo { int a; int b; }
struct Bar { int x; int y; }

fn void test(Foo f)
{
    // Actual layout of Foo is the same as Bar
    Bar b = (Bar)f;
    // This also ok:
    int[2] x = (int[2])f;
}
```

Although I think that in some ways this is a good feature, it is too permissive to be good: it's not always clear that the structural cast is even intended, and yet it suddenly allows a wide range of (explicit) casts. While doing a pointer case like `(Bar*)&f` would usually raise all sorts of warning flags, one would typically assume a value cast to be fairly safe and intentional. Structural casting breaks that.

The intention was a check that essentially confirms that bitcasting from one type to the other will retain match the internal data. This could then be combined with an `@autocast` attribute allowing something like this:

```
fn void foo(@autocast Foo f) { ... }

fn void test()
{
    Bar b = { 1, 2 };
    foo(b); // implicitly foo((Foo)b) due to the @autocast
}
```

The canonical use for this was when an external API could be used with a structurally equivalent internal type: For example you use a library which takes a `Vector2` everywhere, and maybe there is another library in use that has it's `Vector2D`. And finally there is a `Vec2` used internally in the application. With structural casts, these could be used interchangeably as long as they were structurally equivalent.

However, there are other solutions: transparent unions (see the GCC feature), macro forwarding wrappers and user definable conversions.

Then there is the question of use cases: while this vector case is common enough, I can't think of many other uses. (We might also note that when people want operator overloading, it's collections and user defined vector types they will take as examples).

So if the standard library is defining some vector types, or the use of real vector types becomes dominant then the interoperability use case might completely go away.

In any case, this is one more feature that seemed really cool to have, but ended up being less useful than expected.

(It might be somewhat useful to have compile time function that determines if two types are structurally identical though, as this allows you to build macros that work for a set of structurally equivalent types, should you ever want to)

## Comments


---
### Comment by Christoffer Lernö

Structural casts are now gone from C3. This was the ability to do this:

```
struct Foo { int a; int b; }
struct Bar { int x; int y; }

fn void test(Foo f)
{
    // Actual layout of Foo is the same as Bar
    Bar b = (Bar)f;
    // This also ok:
    int[2] x = (int[2])f;
}
```

Although I think that in some ways this is a good feature, it is too permissive to be good: it's not always clear that the structural cast is even intended, and yet it suddenly allows a wide range of (explicit) casts. While doing a pointer case like `(Bar*)&f` would usually raise all sorts of warning flags, one would typically assume a value cast to be fairly safe and intentional. Structural casting breaks that.

The intention was a check that essentially confirms that bitcasting from one type to the other will retain match the internal data. This could then be combined with an `@autocast` attribute allowing something like this:

```
fn void foo(@autocast Foo f) { ... }

fn void test()
{
    Bar b = { 1, 2 };
    foo(b); // implicitly foo((Foo)b) due to the @autocast
}
```

The canonical use for this was when an external API could be used with a structurally equivalent internal type: For example you use a library which takes a `Vector2` everywhere, and maybe there is another library in use that has it's `Vector2D`. And finally there is a `Vec2` used internally in the application. With structural casts, these could be used interchangeably as long as they were structurally equivalent.

However, there are other solutions: transparent unions (see the GCC feature), macro forwarding wrappers and user definable conversions.

Then there is the question of use cases: while this vector case is common enough, I can't think of many other uses. (We might also note that when people want operator overloading, it's collections and user defined vector types they will take as examples).

So if the standard library is defining some vector types, or the use of real vector types becomes dominant then the interoperability use case might completely go away.

In any case, this is one more feature that seemed really cool to have, but ended up being less useful than expected.

(It might be somewhat useful to have compile time function that determines if two types are structurally identical though, as this allows you to build macros that work for a set of structurally equivalent types, should you ever want to)