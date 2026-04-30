---
title: "\"auto\" is a language design smell"
date: 2022-11-16
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8587-auto_is_a_language_design_smell](https://c3.handmade.network/blog/p/8587-auto_is_a_language_design_smell)*

It's increasingly popular to use type inference for variable declarations.

– and it's understandable, after all who wants
to write something like `Foobar<Baz<Double, String>, Bar>` more than once?

I would argue that "auto" (or your particular language's equivalent) is an anti-pattern *when the type is
fully known*.

### When is type inference used?

Few are arguing for replacing:

```
int i = get_val();
```

by

```
auto i = get_val();
```

The latter is longer and gives less information. Still, some **"auto all the things!"** fanatics argue that this
is right. Because *maybe* at some time you change what `get_val()` returns and then you need to change one less place,
so now rather than having a syntax error where the function is invoked you get it later at some other place to
make it extra hard to debug...

But most people will argue it's mainly for when the type gets complex. For example:

```
std::map<std::string,std::vector<int> >::iterator it = myMap.begin();
// vs
auto it = myMap.begin();
```

Another important use is when you write macros or templates and the type has to be inferred. Here's a C3 example:

```
// No type inference
macro @swap1(&a, &b)
{
  $typeof(a) temp = a;
  a = b;
  b = temp;	
}
// vs
macro @swap2(&a, &b)
{
  var temp = a;
  a = b;
  b = temp;	
}
```

So we have two common cases:

* When type is unknown
* When the type name grows long and complex.

### Where do long type names come from?

No one is arguing against the use of type inference when the type isn't known or generic – this use makes perfect sense.

– But there is a problem with the `auto it = myMap.begin()` use, where type inference is
a desired shorthand to *only because the type names are too long*.

Type names only become long because parameterized types usually carry their parameterization in their type (well, some Java "enterprise" code manages long type names anyway, but that's beside the point).

This inevitably causes type signatures to blow up. It's usually possible to write typedefs to make the types shorter, but few are doing that because it's convenient to just define the type directly with parameters as opposed to doing type defines, plus sometimes the parameterization is actually
helpful to determine if it matches a particular generic function.

So basically the way we parameterize types in most languages cause the type name blowup that is then mitigated with type inference.

### Again, the problem with type inference

I'm not going to rehash the arguments made here: <https://austinhenley.com/blog/typeinference.html>.
I am mostly in agreement with them.

I think the most important thing is that the type declarations *locally* documents the assumptions in the
code. If I ever need to "hover over a variable in the IDE to find the type" (as some suggest as a solution),
it means that it is unclear from the local code context what the type is. Since the type of a variable is fundamental to how
the code works, this should never be unclear – which is why the type declaration serves as strong support
for code reading. (Explicit variable types also makes it easy to text search for type usage and for the IDE to track types).

While this is bad, the problem with long type signatures often makes up for it. Type inference becomes a necessary because of how parameterized types work.

I would strongly object the idea of introducing type inference it to languages that don't have issues with long type names, such
as C (or C3), because fundamentally it is something that will make to code less clear to read and consequently: bugs harder to catch.

### The design smell

"auto" is a language design smell because it is typically a sign of the language having types parameterized in a way that makes them inconveniently long.

The type inference thus becomes a language design band-aid which lets people ignore tackling the very real issue of long type names.

### If long type names are bad, why is everyone doing it?

Unfortunately there is an added complication: there aren't many good alternatives. Enforcing something like typedefs to use parameterized types *works* but is not particularly elegant.

There are other possibilities that could be explored, such as eliding the parameterization completely, but retaining the
rest of the type (e.g. `iterator it = myMap.begin`) and similar ideas that straddle both inference and types trying to get the best of both worlds.

Such explorations are uncommon though, which the "auto" style type inference is probably to blame for. A popular band-aid is easier to apply than to find a more innovative solution.

## Comments


---
### Comment by Christoffer Lernö

It's increasingly popular to use type inference for variable declarations.

– and it's understandable, after all who wants
to write something like `Foobar<Baz<Double, String>, Bar>` more than once?

I would argue that "auto" (or your particular language's equivalent) is an anti-pattern *when the type is
fully known*.

### When is type inference used?

Few are arguing for replacing:

```
int i = get_val();
```

by

```
auto i = get_val();
```

The latter is longer and gives less information. Still, some **"auto all the things!"** fanatics argue that this
is right. Because *maybe* at some time you change what `get_val()` returns and then you need to change one less place,
so now rather than having a syntax error where the function is invoked you get it later at some other place to
make it extra hard to debug...

But most people will argue it's mainly for when the type gets complex. For example:

```
std::map<std::string,std::vector<int> >::iterator it = myMap.begin();
// vs
auto it = myMap.begin();
```

Another important use is when you write macros or templates and the type has to be inferred. Here's a C3 example:

```
// No type inference
macro @swap1(&a, &b)
{
  $typeof(a) temp = a;
  a = b;
  b = temp;	
}
// vs
macro @swap2(&a, &b)
{
  var temp = a;
  a = b;
  b = temp;	
}
```

So we have two common cases:

* When type is unknown
* When the type name grows long and complex.

### Where do long type names come from?

No one is arguing against the use of type inference when the type isn't known or generic – this use makes perfect sense.

– But there is a problem with the `auto it = myMap.begin()` use, where type inference is
a desired shorthand to *only because the type names are too long*.

Type names only become long because parameterized types usually carry their parameterization in their type (well, some Java "enterprise" code manages long type names anyway, but that's beside the point).

This inevitably causes type signatures to blow up. It's usually possible to write typedefs to make the types shorter, but few are doing that because it's convenient to just define the type directly with parameters as opposed to doing type defines, plus sometimes the parameterization is actually
helpful to determine if it matches a particular generic function.

So basically the way we parameterize types in most languages cause the type name blowup that is then mitigated with type inference.

### Again, the problem with type inference

I'm not going to rehash the arguments made here: <https://austinhenley.com/blog/typeinference.html>.
I am mostly in agreement with them.

I think the most important thing is that the type declarations *locally* documents the assumptions in the
code. If I ever need to "hover over a variable in the IDE to find the type" (as some suggest as a solution),
it means that it is unclear from the local code context what the type is. Since the type of a variable is fundamental to how
the code works, this should never be unclear – which is why the type declaration serves as strong support
for code reading. (Explicit variable types also makes it easy to text search for type usage and for the IDE to track types).

While this is bad, the problem with long type signatures often makes up for it. Type inference becomes a necessary because of how parameterized types work.

I would strongly object the idea of introducing type inference it to languages that don't have issues with long type names, such
as C (or C3), because fundamentally it is something that will make to code less clear to read and consequently: bugs harder to catch.

### The design smell

"auto" is a language design smell because it is typically a sign of the language having types parameterized in a way that makes them inconveniently long.

The type inference thus becomes a language design band-aid which lets people ignore tackling the very real issue of long type names.

### If long type names are bad, why is everyone doing it?

Unfortunately there is an added complication: there aren't many good alternatives. Enforcing something like typedefs to use parameterized types *works* but is not particularly elegant.

There are other possibilities that could be explored, such as eliding the parameterization completely, but retaining the
rest of the type (e.g. `iterator it = myMap.begin`) and similar ideas that straddle both inference and types trying to get the best of both worlds.

Such explorations are uncommon though, which the "auto" style type inference is probably to blame for. A popular band-aid is easier to apply than to find a more innovative solution.