---
title: "Why doesn't C3 do import aliasing?"
date: 2024-12-22
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8982-why_doesn%2527t_c3_do_import_aliasing](https://c3.handmade.network/blog/p/8982-why_doesn%2527t_c3_do_import_aliasing)*

Why doesn't C3 allow aliasing of namespaces? Wouldn't `import raylib as rl;` be a good idea?
Why am I so hell-bent on not allowing it?

So, first off, C2 has aliasing. It offers three levels:

1. Importing with the full name.
2. Importing with an alias.
3. Folding the imports (so everything can be used without prefix)

Why didn't I keep this?

## C2's flat module namespace

First off, it's important to realize that C2 has a flat module namespace. There are no `std::core::mem` submodules,
everything is bundled up into fairly large groups of functions and types. For example the `stdio`
module which would have all the `io` functions and so on.

My concern was that it would be very likely for libraries to collide if they were flat.

EVERYONE would want their particular name to be *the* name for something. So now
you can't use library `net` from Foo, because you also want to use the library `net`
from Bar.

Aliasing won't help you because `import net as foonet` only works if you can
disambiguate `net` to begin with.

It's possible people would start gravitating towards "prefix+name", but then
everything would be superheavy name-wise: `import somecompany_networking;` and
you'd *have* to use aliasing because the prefixes are so long.

## Ok, hierarchical - now what?

Obviously no one would want to repeatedly prefix things like `somecompany::networking::open(...)`
(except Zig programmers), so it would seem that `import somecompany::networking as net`
would need to be the default?

And then we could all use `net.Socket socket;` and `net.open("localhost")` (skip to the end if you want to know why C3 uses `::` instead of `.`).

Except what happens now that we started to have hierarchical module names is that we go from
having to rename maybe 2-3 BIG packages to coming up with short names for 20 or 30 modules.

The naming problem is going from fairly trivial to painful.

## The best C naming convention

Let's make a short detour: the best naming convention for library functions in C, is in my opinion: `<category or type>_name(...)`
So for example if you look for something relating to the `Expr` type in the C3 compiler
it would be `expr_<some name>` for the semantic checking, all such functions are `sema_<name>`
and so on.

Wouldn't it be nice to have that kind of formalized? Like `expr.copy_single(expr)` and `sema.resolve_desc(d)`?

## Is there a way to avoid renames?

I was racking my brains for a way to make it work without the need for renaming or namespace folding. The latter was never really recommended in C2, but was left in – probably when
writing your own code and you just wanted everything to feel like a homogeneous code base.

My solution was to match on the minimum necessary prefix to disambiguate two things.
So let's say we had `std::io::File` and `foo::io::File` then we need the full path to know
which `File` was intended – so it would need the full path, but if it was `std::io::File` and
`foo::net::File` then `net::File` and `io::File` would be enough to do the disambiguation.

This would allow people *to use **terse** submodule names* while still avoiding the need
for explicit renaming.

## Formalizing the C coding convention

With submodule names now rarely being used aside from when one was disambiguating
functions, it was now possible to encode the C coding convention and
say that functions need at least one level of module path.

Something like `io::printn("Hello, world")` in C3 should be thought of as
`io_printn("Hello, world")`.

And this is why under this new scheme using import renaming went from "needed"
to "destructive". Because if you're used to seeing `io::printn()` and suddenly
see `io2::printn()` you're going to think this is something completely new,
unless it's code you wrote yourself 15 minutes ago.

## The effect on generic modules

Originally generic modules were instantiated with `import`, so something like:

```
import std::collections::list(<int>) as intlist;
import std::collections::list(<doublelist>) as doublelist;
```

This actually mirrors better what is happening in the compiler, but then using things like
`doublelist::List l` isn't really a user-friendly syntax to use.

With the new style you just imported the generic module and then made defines:

```
import std::collections::list;

def IntList = List(<int>);
def DoubleList = List(<double>);
```

This would have been possible before too, but it wasn't until the aliasing
was removed this style became the "obvious" solution.

## Recursive imports

Another effect of the change was allowing recursive imports. Already I've mentioned how
the number of submodules made it more of a problem with naming imports,
a key reason it has little place in C3 today is because C3 went for *recursive imports*.

So in C3, if you import `std::collections` you will get the module but also any submodule (and their submodules)
directly available. (In fact, C3 experimented with *no import statements at all!*)

Let's say you want to import and add an alias. Fine, but this only affects part of
what you import. Say you'd do `import std::collections as cl`.

Okay, but `std::collections` itself has zero functions and types. This comes back to
the fact that when you start separating things into submodules
you have so many more names if you want to rename them.

### Big modules vs granular modules

In short, what we see is that rename is quite fine when we have
big modules containing a lot of functions. This typically happens
in two cases:

1. You have a flat module namespace – like C2
2. You are using a C library which is modelled as a single flat namespace.

### A good experience in C3 without renaming?

There are good and bad ways to use modules in C3. Unfortunately,
unlike in many other languages, if the library author is sloppy, you will
suffer.

1. You have to think about the usage. The raylib 4 bindings (by yours truly)
   infamously use `module raylib;`. This meant that everyone needed to type `raylib::` in front of all the calls.
   The raylib5 bindings instead use `module raylib5::rl`. Not only did that make all functions now prefix with  
   the more reasonable `rl` prefix, but there is room to add `raymath` as `module raylib5::rm` and so on.
2. Coming from other languages, people often use more namespacing than they need to. It's
   just more to type, worse readability and makes the language look like C++. It's `File f;`, not `std::io::File f;`.
   The latter is the antithesis of good style. – And same with functions, one level, no more.
3. If you're making up names of types, you need to ensure it looks unique because if it has to be
   namespaced then it has failed. So for example `SdlMutex`, not `Mutex`. There is an idea that using the module name
   is good enough to disambiguate types. It isn't, because C3 isn't built to accommodate C++ style.

## Final Word

C3 doesn't have aliasing anymore because of a rather complex
dynamic, and all the organization of the standard library
and such does depend on each other.

Allowing some external mechanism to "hack" a broken module name
and allowing it to be swapped for another at the command line
is one thing (e.g. you have to use that library which has the `raylib` prefix
then you might use something like `--namespace-patch raylib rl` at the command line to
make it alias to `rl` instead) – This is a fairly straightforward enhancement.

To allow C2 aliasing though, that would mean rethinking
everything about C3 modules, so that would require quite
strong reasons for it to happen. But I prefer to never say never,
I just want the language to be as good as possible.

## Bonus: why doesn't C3 use `.`?

The short answer is that `::` makes it possible to do the path shortening.
Otherwise figuring out where the path starts would need to have a very
complicated heuristic. Another thing is that makes sense if your names
are things that won't collide with local variables. Now, in C3 we have
`std::io::file`. If C3 used `.` then something like `File file = file.open("foo.txt", "rb")`
would be ambiguous, whereas with `::` we're always fine:
`File file = file::open("foo.txt", "rb")`.

(It also saves the grammar from being complicated in some other places,
but these are the main reasons).

## Comments


---
### Comment by Christoffer Lernö

Why doesn't C3 allow aliasing of namespaces? Wouldn't `import raylib as rl;` be a good idea?
Why am I so hell-bent on not allowing it?

So, first off, C2 has aliasing. It offers three levels:

1. Importing with the full name.
2. Importing with an alias.
3. Folding the imports (so everything can be used without prefix)

Why didn't I keep this?

## C2's flat module namespace

First off, it's important to realize that C2 has a flat module namespace. There are no `std::core::mem` submodules,
everything is bundled up into fairly large groups of functions and types. For example the `stdio`
module which would have all the `io` functions and so on.

My concern was that it would be very likely for libraries to collide if they were flat.

EVERYONE would want their particular name to be *the* name for something. So now
you can't use library `net` from Foo, because you also want to use the library `net`
from Bar.

Aliasing won't help you because `import net as foonet` only works if you can
disambiguate `net` to begin with.

It's possible people would start gravitating towards "prefix+name", but then
everything would be superheavy name-wise: `import somecompany_networking;` and
you'd *have* to use aliasing because the prefixes are so long.

## Ok, hierarchical - now what?

Obviously no one would want to repeatedly prefix things like `somecompany::networking::open(...)`
(except Zig programmers), so it would seem that `import somecompany::networking as net`
would need to be the default?

And then we could all use `net.Socket socket;` and `net.open("localhost")` (skip to the end if you want to know why C3 uses `::` instead of `.`).

Except what happens now that we started to have hierarchical module names is that we go from
having to rename maybe 2-3 BIG packages to coming up with short names for 20 or 30 modules.

The naming problem is going from fairly trivial to painful.

## The best C naming convention

Let's make a short detour: the best naming convention for library functions in C, is in my opinion: `<category or type>_name(...)`
So for example if you look for something relating to the `Expr` type in the C3 compiler
it would be `expr_<some name>` for the semantic checking, all such functions are `sema_<name>`
and so on.

Wouldn't it be nice to have that kind of formalized? Like `expr.copy_single(expr)` and `sema.resolve_desc(d)`?

## Is there a way to avoid renames?

I was racking my brains for a way to make it work without the need for renaming or namespace folding. The latter was never really recommended in C2, but was left in – probably when
writing your own code and you just wanted everything to feel like a homogeneous code base.

My solution was to match on the minimum necessary prefix to disambiguate two things.
So let's say we had `std::io::File` and `foo::io::File` then we need the full path to know
which `File` was intended – so it would need the full path, but if it was `std::io::File` and
`foo::net::File` then `net::File` and `io::File` would be enough to do the disambiguation.

This would allow people *to use **terse** submodule names* while still avoiding the need
for explicit renaming.

## Formalizing the C coding convention

With submodule names now rarely being used aside from when one was disambiguating
functions, it was now possible to encode the C coding convention and
say that functions need at least one level of module path.

Something like `io::printn("Hello, world")` in C3 should be thought of as
`io_printn("Hello, world")`.

And this is why under this new scheme using import renaming went from "needed"
to "destructive". Because if you're used to seeing `io::printn()` and suddenly
see `io2::printn()` you're going to think this is something completely new,
unless it's code you wrote yourself 15 minutes ago.

## The effect on generic modules

Originally generic modules were instantiated with `import`, so something like:

```
import std::collections::list(<int>) as intlist;
import std::collections::list(<doublelist>) as doublelist;
```

This actually mirrors better what is happening in the compiler, but then using things like
`doublelist::List l` isn't really a user-friendly syntax to use.

With the new style you just imported the generic module and then made defines:

```
import std::collections::list;

def IntList = List(<int>);
def DoubleList = List(<double>);
```

This would have been possible before too, but it wasn't until the aliasing
was removed this style became the "obvious" solution.

## Recursive imports

Another effect of the change was allowing recursive imports. Already I've mentioned how
the number of submodules made it more of a problem with naming imports,
a key reason it has little place in C3 today is because C3 went for *recursive imports*.

So in C3, if you import `std::collections` you will get the module but also any submodule (and their submodules)
directly available. (In fact, C3 experimented with *no import statements at all!*)

Let's say you want to import and add an alias. Fine, but this only affects part of
what you import. Say you'd do `import std::collections as cl`.

Okay, but `std::collections` itself has zero functions and types. This comes back to
the fact that when you start separating things into submodules
you have so many more names if you want to rename them.

### Big modules vs granular modules

In short, what we see is that rename is quite fine when we have
big modules containing a lot of functions. This typically happens
in two cases:

1. You have a flat module namespace – like C2
2. You are using a C library which is modelled as a single flat namespace.

### A good experience in C3 without renaming?

There are good and bad ways to use modules in C3. Unfortunately,
unlike in many other languages, if the library author is sloppy, you will
suffer.

1. You have to think about the usage. The raylib 4 bindings (by yours truly)
   infamously use `module raylib;`. This meant that everyone needed to type `raylib::` in front of all the calls.
   The raylib5 bindings instead use `module raylib5::rl`. Not only did that make all functions now prefix with  
   the more reasonable `rl` prefix, but there is room to add `raymath` as `module raylib5::rm` and so on.
2. Coming from other languages, people often use more namespacing than they need to. It's
   just more to type, worse readability and makes the language look like C++. It's `File f;`, not `std::io::File f;`.
   The latter is the antithesis of good style. – And same with functions, one level, no more.
3. If you're making up names of types, you need to ensure it looks unique because if it has to be
   namespaced then it has failed. So for example `SdlMutex`, not `Mutex`. There is an idea that using the module name
   is good enough to disambiguate types. It isn't, because C3 isn't built to accommodate C++ style.

## Final Word

C3 doesn't have aliasing anymore because of a rather complex
dynamic, and all the organization of the standard library
and such does depend on each other.

Allowing some external mechanism to "hack" a broken module name
and allowing it to be swapped for another at the command line
is one thing (e.g. you have to use that library which has the `raylib` prefix
then you might use something like `--namespace-patch raylib rl` at the command line to
make it alias to `rl` instead) – This is a fairly straightforward enhancement.

To allow C2 aliasing though, that would mean rethinking
everything about C3 modules, so that would require quite
strong reasons for it to happen. But I prefer to never say never,
I just want the language to be as good as possible.

## Bonus: why doesn't C3 use `.`?

The short answer is that `::` makes it possible to do the path shortening.
Otherwise figuring out where the path starts would need to have a very
complicated heuristic. Another thing is that makes sense if your names
are things that won't collide with local variables. Now, in C3 we have
`std::io::file`. If C3 used `.` then something like `File file = file.open("foo.txt", "rb")`
would be ambiguous, whereas with `::` we're always fine:
`File file = file::open("foo.txt", "rb")`.

(It also saves the grammar from being complicated in some other places,
but these are the main reasons).

---
### Comment by Christoffer Lernö

The need to rename a namespace comes from the fact that there are irresolvable namespace collisions in the first place. This solution prevents that from happening.

What would you prefer? That namespace aliases are consistent over all code bases, or that they are only limited by the imagination of the user?

C3 prefers the former while also making sure that there are no irresolvable collisions despite that.

In C3, you cannot have two modules that have the *full* name `net` without them being the same module.

Therefore, disambiguation is not a problem the aliasing will resolve.

The way C3 looks for files is different from Odin. C3 takes a list of files, or directories. *ALL* C3 files in those directories and in those lists of files will be read by the compiler.

If you have libraries, which are basically directories with a small manifest + c3 files + possibly dynamic/static libraries, these are loaded (again completely) if a dependency is declared on the library when you compile.

So for example, you wish to use raylib with a single file you want to compile and run from the command line: `c3c compile-run my_program.c3 --lib raylib`

Now in addition to that in your program you need to write something like `import raylib;` to make the functions available to the code in that module.

So the import statements do not control what is compiled, they simply control what modules are visible.

---
### Comment by Christoffer Lernö

The full name being the full module name, such as `mylib::net`. It is not possible to have two of those from different sources and still consider them distinct. C3 allows extending modules, so they would be seen as different parts of the same module, even if they are placed in different folders.

For C3, it takes a bunch of files of indata. Each of those files may have one or more module *sections* in them. A module section being a part of a module. To make it more understandable, thing about how C++ namespaces work. You can open the same namespace multiple times.

Similarly in C3 you can open the same module and append functions and types to it multiple times and from multiple files.

---
### Comment by Christoffer Lernö

Well yes. If you had two libraries called `io`, how would you even be able to tell them apart? What would `import io;` mean? Importing both?

The only case when it's possible to have two libraries with the same name, is when imports are file based, so you do something like `import "foo/io.lib"` and `import "bar/io.lib"`.

This is not how the module model works in C3, so the case doesn't even arise. While you could certainly have a `foo/io.c3l` and `bar/io.c3l` that you depend on, the way modules work in C3 would *merge* these modules if you use those libraries. And the reason why they are merged is because C3 has a very *open* model. It's possible to extend any module and any type.

In the file version we usually HAVE a longer module name in the sense that the path acts as this module name to differentiate it. It's just that it's informal whereas in C3 or something like Java it's formalized.