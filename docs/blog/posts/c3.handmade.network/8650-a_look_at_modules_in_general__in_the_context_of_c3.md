---
title: "A look at modules (in general + in the context of C3)"
date: 2023-02-15
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8650-a_look_at_modules_in_general__in_the_context_of_c3](https://c3.handmade.network/blog/p/8650-a_look_at_modules_in_general__in_the_context_of_c3)*

Despite being a general concept, modules are often very different from language
to language. One major reason for this is that overall language semantics puts many
constraints on how modules may work. However, despite these constraints there
is a lot of specific design work required.

I'm going to look at the modules in general and also talk a little about how [C3 modules](https://c3-lang.org/modules/) work.

## An initial observation

When making a module system one first have to decide whether a module is a separate
concept or not. Because if the language has the idea of static variables and
functions attached to a type there is actually already a sort of module system present.

Here is a short snippet written in the [C2 language](http://c2lang.org/site/language/struct_functions/) to illustrate this:

```
// File bar.c2
module bar;
// Plain function
func int get_one() {
    return 1;
}  

// File foo.c2
module foo;
import bar;
type Bar struct {
  int x;
}  
// Static function
func int Bar.get_one() {
    return 1;
}

func void test() {
    int a = Bar.get_one();
    int b = bar.get_one();
}
```

The type here acts as namespace in itself. If we extend the type with static
variable we can similarly emulate namespaced global variables.

Most languages with methods on their types gladly accept this ambiguity, but one
can draw the conclusion that modules are not needed and only structs are necessary.
This is the approach taken by [Zig](https://ziglang.org). The downside is that it also leads
to counter-intuitive things such as "a file is a struct" and having
to explicitly arrange sub-modules in a hierarchy.

The other way to resolve the ambiguity is to have type methods, but abolish
static methods and globals. This is the approach of C3. The downside is that
some methods that are naturally static, such as `Foo.new_instance()` or constants
`Foo.MAX_VALUE` can't be expressed.

We can also note that Java, while having "packages" use classes as the primary
namespacing mechanism for free functions and constants, which is a bit more relaxed
than Zig's approach, since the hierarchy is external.

## Sub-modules and paths

### Flat vs hierarchal

The module namespace can be flat with a single module name or hierarchal, where
modules have sub-modules. While flat modules are nice to work with and easy
to implement, there is much more contention for unique names. This can mean that
module names may need to have longer names to require uniqueness, e.g. `mylib_io`
for the flat module and `mylib::io` for the hierarchal.
But hierarchal modules in general have an even worse problem with length:
e.g. `std.debug.print("Hello, world!\n", .{});` (with apologies to Zig).

### Aliasing and import

The obvious solutions to long names are aliasing and namespace imports. Here is again
a C2 example:

```
import networking as net; // Aliasing
import filesystem local; // Namespace import


// Equivalent:
doSomething(); // Namespace import
filesystem.doSomething();

// Equivalent:
net.connect(); // Aliased
networking.connect();
```

The downside of aliasing is that aliases may differ between authors
and implementations. So while someone might alias `networking` to `net`,
someone else uses `nw`. This together with the difficulty of naming aliases
makes it a less attractive solution. Full namespace import avoids naming
issues, but makes it much less clear what are local functions and
what is implemented elsewhere.

### C3 path shortening

C3 has a hierarchal module system but employs path shortening. This is
basically that the first part of a module path may be elided:
`std::net::sockets::new_from_url(url)` can be used as `sockets::new_from_url(url)`
as long as it is not ambiguous.

Requiring at least the sub-module name in the path is a design decision
to avoid the readability problems mentioned with namespace imports.
In the example "new\_from\_url(url)" on its own lacks the context that the "sockets::"
prefix gives.

Surveying other languages it's clear that usually contain sufficient
context in their names. For this reason they are exempt from
the prefix requirement in C3.

Note how something similar happens in Java in practice: `java.math.BigInteger` is
the import, you then use `BigInteger`, but call static "functions" namespaced:
`BigInteger prime = BigInteger.probablePrime(128, rnd);`

In the Java case this comes from `import java.math.BigInteger`
being an actual namespace import, but then the classes
themselves provide a second layer or namespacing.

## Visibility

The other major component to modules is visibility between modules. Note
that nothing is saying that explicit imports are necessary: with full
paths the correct types, functions and variables may be found anyway.

With "import" statements the most common scheme is this:

* Modules not imported: no visibility.
* Module imported: public declarations are visible.

### Hierarchal visibility

As a complement to the above in hierarchal module systems, a module
may see non-public declarations in sub modules and/or parent modules.

The desire to have this feature arise from wanting to separate the
visible "api layer" module and the internal "implementation layer" modules
that which contains implementation details that may change over time.

The downside of this method for modules to peek into other modules is the need
to build this into the hierarchy.

### "Friend" visibility

As an alternative to the above hierarchal visibility above is to declare "friend"
modules that may access the module. This has fewer constraints than trying to
fit modules neatly into the right sort of hierarchy just to get the correct
visibility between modules.

There is still the drawback that in order to "friend" another module, the
module needs to know of that other module.

### Becoming a "friend"

Often the concept of visibility is conflated with some idea of "internal safety":
"I make this private to make it *safe* from other modules". This is trying
to interpolate the metaphor too far. Visibility and access modifiers are there
to help the user of the types to use / override functionality in the correct way.
"Public" communicates that this function is made for general consumption,
"private" means internal consumption and it not being part of the surface API
of the functionality.

However, *if one knows what one is doing* then circumventing these protections
can be useful. For example:

* There may be a bug that can be circumvented by calling private methods.
* One may want to exploit the particular functionality of a specific version
  of a library.
* One may want to modify behaviour for some other reason that the author did not foresee.

Often languages have convoluted ways of circumventing visibility in these cases,
e.g. calling functions using reflection in Java, just because the need does arise.

The obvious way is then for a module to be able to declare itself the friend of a
module. A C3 example:

```
module test;
fn void fn_private() @private {}

module foo;
import test @public; // Override visibility

fn void main()
{
    // This is not an error due to the "@private" import.
    test::fn_private();
}
```

We can note that C3 has public by default. It is possible to
set a different default:

```
module test2 @private;

fn void fn_private() {}
fn void fn_public() @public {} // Explicitly needs @public!
```

## Visibility levels

To talk about visibility at all we need at least two levels
to differentiate between. Usually these are *public* and *private*,
where *public* means visible outside of the
module and *private* being visible only inside of the module.

In fact, we could stop here because this will in most cases be all
we need. For this reason there is a possibility to not encode this
in a keyword, but in the name itself: Go's "uppercase means public" and Dart's
"leading underscore means private" (note: I considered the latter for C3).

### Between "private" and "public"

If we want hierarchal visibility, then we need another level above
private but below public, indicating that something is available
to other modules (below or above) in the hierarchy.

Similarly, for the "friend" module visibility we need a visibility level
for this behaviour. As an example Rust has `pub(in path)` and `pub(crate)`
(although note that both of those are somewhat constrained).

### Below "private"

If modules may span multiple source files, there is the possibility of another
visibility level, where visibility is restricted to the file with the declaration.
This is C's `static`, Swift's `fileprivate` and C3's `@local` (Note:
while C3 could have used `static` for globals and functions, it's a
poor name for type visibility. This is why `@local` was chosen instead).

This is not exhaustive: depending on language features more visibility levels
might be possible. For C3 with `import @private`, having "public", "private"
and "local" seems to cover most use cases.

## Imports

While imports usually is a good way to determine dependencies, this is not
guaranteed. As an example: while most Java programmers may think of Java's `import`
as importing classes, all it actually does is to fold namespaces.

The point here is that while import may roughly correspond to the dependency graph,
it's not guaranteed to exactly do so. *This means that imports
is usually simply a way to limit the pollution of the current namespace*.

This is very valuable though, in fact this is a variant of the public / private division:
importing is picking a set of modules that can be accessed (= is public to the current module).

### Narrow imports

In the Java world, wildcard imports (e.g. `import java.util.*`) is
by tradition considered bad. Instead Java source files often contain
a litany of single class imports. This is such a problem that most IDEs
offer to both hide the list of imports and manage it for you.

In the Java case the tangible benefit claimed is that if you do something like this:

```
import java.util.*;
import java.sql.*;
```

You have problem if you try to use `Date` since it's now unambiguous.

Having written a lot of Java code that works with the DB I can confidently
say that the problem here is not the imports, but the reuse of `Date` in
both Java packages. If the `java.sql` class had a reasonable name
like `SqlDate` this import would not have been a problem *AND* there would
be no confusion when trying to use a `java.util.Date` and `java.sql.Date`
in the same code, which happens quite often.

So the fact that the above is touted as a reason just shows how
weak the arguments are for narrow imports in Java.

*HOWEVER* if a language uses import to actually pull in dependencies,
then narrow is likely better, but it's important to note that this isn't
necessarily the case. It's not true in Java, nor is it true in C3.

### No imports?

One might think that dumping all modules in the current namespace would be
unworkable, but if we already use the full path to types and functions, there
are no ambiguities. Even C3 abbreviated paths work fine in general.

The downside is that now things like code completion is going to match
*EVERYTHING in all modules*, which just makes for a much worse experience.
This also affects things like error messages. The imports help
the compiler (and an IDE) to make better guesses and in general just be more
friendly.

### A middle ground

In C3 imports are implicitly wildcard, so `import std::io` will also import
sub modules to `std::io`. It's also possible to have more than one import in
a single row, e.g. `import std::io, std::math;`. To me this seems like a
reasonable compromise.

More controversially, C3 modules will implicitly import parent and child modules.
So `std::io::socket` could implicitly import `std::io`, `std` and the
child module `std::io::socket::channel`. I am not sure of this feature
and it might go away. That said, because there is no
sibling module import (e.g. `std::io` does not implicitly import `std::math`),
the namespace pollution is still fairly low.

### Dependency resolution

If the import does not resolve the actual dependency graph, then all
code must be at least parsed and analysed. For the C3 compiler this is
not a problem, since lexing, parsing and semantic analysis is a fraction
of the total compilation time. However, it's desirable to output only the
part of the code that is in use.

## Exports

We have one more problem: just because a function is public doesn't mean
it should be exported in a library.

We can illustrate this with a simple example: let's say we want to build a simple
web scraper which creates a list of all the image URLs on a web page.
To do so we use a module which handles http + https and writes a thin
layer on top with a single function that takes a string and returns a
list or strings with the URLs. In other word, we only have
a single function that we want to export.

But if we create a static library with this functionality
and naively export the public functions we will get the
not just get our single function, but the
public functions of the http module as well...
plus public functions of anything the http module uses!

While the linker might strip unused code when creating an executable,
even in this case we will still generate code that is not used.

### Explicit exports

The first necessary feature is to be able to mark functions and globals
as being exported. Note that being exported is orthogonal to public / private.
Public and private is about source level visibility, and exports is
about library and linker visibility.

Because exported functions are usually public, some languages conflate
public and export, making `export` simply a variant of *"public"*.
(In C3 the `@export` makes a function or global exported, it has no effect
on visibility between modules).

### Entry points => dependency graph

With `export` we're now able to make a real dependency graph. For a regular
executable the `main` function can be considered the entry point,
otherwise we use functions marked `export` to trace dependencies.

## Summary

* We have looked how static methods and member overlap with module namespaced
  functions and globals. This means namespacing can be done with modules,
  static methods and member or a combination thereof. C3 uses modules only.
* Modules may be flat or hierarchal. C3 uses a hierarchal module namespace.
* Various methods may be used to reduce repetitive module prefixing. Aliasing
  namespace inlining are common. C3 uses path shortening.
* The simplest visibility semantics only has public and private.
* Accessing "private" functions is useful, and there are various solutions.
* One method is adding a special visibility level to let a parent or child module
  access private functions.
* Another method is defining what other modules as "friends" to access private
  functions as if they were public.
* C3 allows a module to import private functions of other modules.
* C3 has three visibility levels: `@public` `@private` and `@local`. "local"
  means it is local to the current module section.
* Imports can be narrow or wide. C3 prefers wildcard imports. Narrow imports
  is mostly useful when imports directly can infer the dependency graph.
* Exports need to be different from "all of the public functions".
* C3 uses `@export` to mark declarations to export.

*If you want to try out C3, you can test it here: <https://learn-c3.org>*.

## Comments


---
### Comment by Christoffer Lernö

Despite being a general concept, modules are often very different from language
to language. One major reason for this is that overall language semantics puts many
constraints on how modules may work. However, despite these constraints there
is a lot of specific design work required.

I'm going to look at the modules in general and also talk a little about how [C3 modules](https://c3-lang.org/modules/) work.

## An initial observation

When making a module system one first have to decide whether a module is a separate
concept or not. Because if the language has the idea of static variables and
functions attached to a type there is actually already a sort of module system present.

Here is a short snippet written in the [C2 language](http://c2lang.org/site/language/struct_functions/) to illustrate this:

```
// File bar.c2
module bar;
// Plain function
func int get_one() {
    return 1;
}  

// File foo.c2
module foo;
import bar;
type Bar struct {
  int x;
}  
// Static function
func int Bar.get_one() {
    return 1;
}

func void test() {
    int a = Bar.get_one();
    int b = bar.get_one();
}
```

The type here acts as namespace in itself. If we extend the type with static
variable we can similarly emulate namespaced global variables.

Most languages with methods on their types gladly accept this ambiguity, but one
can draw the conclusion that modules are not needed and only structs are necessary.
This is the approach taken by [Zig](https://ziglang.org). The downside is that it also leads
to counter-intuitive things such as "a file is a struct" and having
to explicitly arrange sub-modules in a hierarchy.

The other way to resolve the ambiguity is to have type methods, but abolish
static methods and globals. This is the approach of C3. The downside is that
some methods that are naturally static, such as `Foo.new_instance()` or constants
`Foo.MAX_VALUE` can't be expressed.

We can also note that Java, while having "packages" use classes as the primary
namespacing mechanism for free functions and constants, which is a bit more relaxed
than Zig's approach, since the hierarchy is external.

## Sub-modules and paths

### Flat vs hierarchal

The module namespace can be flat with a single module name or hierarchal, where
modules have sub-modules. While flat modules are nice to work with and easy
to implement, there is much more contention for unique names. This can mean that
module names may need to have longer names to require uniqueness, e.g. `mylib_io`
for the flat module and `mylib::io` for the hierarchal.
But hierarchal modules in general have an even worse problem with length:
e.g. `std.debug.print("Hello, world!\n", .{});` (with apologies to Zig).

### Aliasing and import

The obvious solutions to long names are aliasing and namespace imports. Here is again
a C2 example:

```
import networking as net; // Aliasing
import filesystem local; // Namespace import


// Equivalent:
doSomething(); // Namespace import
filesystem.doSomething();

// Equivalent:
net.connect(); // Aliased
networking.connect();
```

The downside of aliasing is that aliases may differ between authors
and implementations. So while someone might alias `networking` to `net`,
someone else uses `nw`. This together with the difficulty of naming aliases
makes it a less attractive solution. Full namespace import avoids naming
issues, but makes it much less clear what are local functions and
what is implemented elsewhere.

### C3 path shortening

C3 has a hierarchal module system but employs path shortening. This is
basically that the first part of a module path may be elided:
`std::net::sockets::new_from_url(url)` can be used as `sockets::new_from_url(url)`
as long as it is not ambiguous.

Requiring at least the sub-module name in the path is a design decision
to avoid the readability problems mentioned with namespace imports.
In the example "new\_from\_url(url)" on its own lacks the context that the "sockets::"
prefix gives.

Surveying other languages it's clear that usually contain sufficient
context in their names. For this reason they are exempt from
the prefix requirement in C3.

Note how something similar happens in Java in practice: `java.math.BigInteger` is
the import, you then use `BigInteger`, but call static "functions" namespaced:
`BigInteger prime = BigInteger.probablePrime(128, rnd);`

In the Java case this comes from `import java.math.BigInteger`
being an actual namespace import, but then the classes
themselves provide a second layer or namespacing.

## Visibility

The other major component to modules is visibility between modules. Note
that nothing is saying that explicit imports are necessary: with full
paths the correct types, functions and variables may be found anyway.

With "import" statements the most common scheme is this:

* Modules not imported: no visibility.
* Module imported: public declarations are visible.

### Hierarchal visibility

As a complement to the above in hierarchal module systems, a module
may see non-public declarations in sub modules and/or parent modules.

The desire to have this feature arise from wanting to separate the
visible "api layer" module and the internal "implementation layer" modules
that which contains implementation details that may change over time.

The downside of this method for modules to peek into other modules is the need
to build this into the hierarchy.

### "Friend" visibility

As an alternative to the above hierarchal visibility above is to declare "friend"
modules that may access the module. This has fewer constraints than trying to
fit modules neatly into the right sort of hierarchy just to get the correct
visibility between modules.

There is still the drawback that in order to "friend" another module, the
module needs to know of that other module.

### Becoming a "friend"

Often the concept of visibility is conflated with some idea of "internal safety":
"I make this private to make it *safe* from other modules". This is trying
to interpolate the metaphor too far. Visibility and access modifiers are there
to help the user of the types to use / override functionality in the correct way.
"Public" communicates that this function is made for general consumption,
"private" means internal consumption and it not being part of the surface API
of the functionality.

However, *if one knows what one is doing* then circumventing these protections
can be useful. For example:

* There may be a bug that can be circumvented by calling private methods.
* One may want to exploit the particular functionality of a specific version
  of a library.
* One may want to modify behaviour for some other reason that the author did not foresee.

Often languages have convoluted ways of circumventing visibility in these cases,
e.g. calling functions using reflection in Java, just because the need does arise.

The obvious way is then for a module to be able to declare itself the friend of a
module. A C3 example:

```
module test;
fn void fn_private() @private {}

module foo;
import test @public; // Override visibility

fn void main()
{
    // This is not an error due to the "@private" import.
    test::fn_private();
}
```

We can note that C3 has public by default. It is possible to
set a different default:

```
module test2 @private;

fn void fn_private() {}
fn void fn_public() @public {} // Explicitly needs @public!
```

## Visibility levels

To talk about visibility at all we need at least two levels
to differentiate between. Usually these are *public* and *private*,
where *public* means visible outside of the
module and *private* being visible only inside of the module.

In fact, we could stop here because this will in most cases be all
we need. For this reason there is a possibility to not encode this
in a keyword, but in the name itself: Go's "uppercase means public" and Dart's
"leading underscore means private" (note: I considered the latter for C3).

### Between "private" and "public"

If we want hierarchal visibility, then we need another level above
private but below public, indicating that something is available
to other modules (below or above) in the hierarchy.

Similarly, for the "friend" module visibility we need a visibility level
for this behaviour. As an example Rust has `pub(in path)` and `pub(crate)`
(although note that both of those are somewhat constrained).

### Below "private"

If modules may span multiple source files, there is the possibility of another
visibility level, where visibility is restricted to the file with the declaration.
This is C's `static`, Swift's `fileprivate` and C3's `@local` (Note:
while C3 could have used `static` for globals and functions, it's a
poor name for type visibility. This is why `@local` was chosen instead).

This is not exhaustive: depending on language features more visibility levels
might be possible. For C3 with `import @private`, having "public", "private"
and "local" seems to cover most use cases.

## Imports

While imports usually is a good way to determine dependencies, this is not
guaranteed. As an example: while most Java programmers may think of Java's `import`
as importing classes, all it actually does is to fold namespaces.

The point here is that while import may roughly correspond to the dependency graph,
it's not guaranteed to exactly do so. *This means that imports
is usually simply a way to limit the pollution of the current namespace*.

This is very valuable though, in fact this is a variant of the public / private division:
importing is picking a set of modules that can be accessed (= is public to the current module).

### Narrow imports

In the Java world, wildcard imports (e.g. `import java.util.*`) is
by tradition considered bad. Instead Java source files often contain
a litany of single class imports. This is such a problem that most IDEs
offer to both hide the list of imports and manage it for you.

In the Java case the tangible benefit claimed is that if you do something like this:

```
import java.util.*;
import java.sql.*;
```

You have problem if you try to use `Date` since it's now unambiguous.

Having written a lot of Java code that works with the DB I can confidently
say that the problem here is not the imports, but the reuse of `Date` in
both Java packages. If the `java.sql` class had a reasonable name
like `SqlDate` this import would not have been a problem *AND* there would
be no confusion when trying to use a `java.util.Date` and `java.sql.Date`
in the same code, which happens quite often.

So the fact that the above is touted as a reason just shows how
weak the arguments are for narrow imports in Java.

*HOWEVER* if a language uses import to actually pull in dependencies,
then narrow is likely better, but it's important to note that this isn't
necessarily the case. It's not true in Java, nor is it true in C3.

### No imports?

One might think that dumping all modules in the current namespace would be
unworkable, but if we already use the full path to types and functions, there
are no ambiguities. Even C3 abbreviated paths work fine in general.

The downside is that now things like code completion is going to match
*EVERYTHING in all modules*, which just makes for a much worse experience.
This also affects things like error messages. The imports help
the compiler (and an IDE) to make better guesses and in general just be more
friendly.

### A middle ground

In C3 imports are implicitly wildcard, so `import std::io` will also import
sub modules to `std::io`. It's also possible to have more than one import in
a single row, e.g. `import std::io, std::math;`. To me this seems like a
reasonable compromise.

More controversially, C3 modules will implicitly import parent and child modules.
So `std::io::socket` could implicitly import `std::io`, `std` and the
child module `std::io::socket::channel`. I am not sure of this feature
and it might go away. That said, because there is no
sibling module import (e.g. `std::io` does not implicitly import `std::math`),
the namespace pollution is still fairly low.

### Dependency resolution

If the import does not resolve the actual dependency graph, then all
code must be at least parsed and analysed. For the C3 compiler this is
not a problem, since lexing, parsing and semantic analysis is a fraction
of the total compilation time. However, it's desirable to output only the
part of the code that is in use.

## Exports

We have one more problem: just because a function is public doesn't mean
it should be exported in a library.

We can illustrate this with a simple example: let's say we want to build a simple
web scraper which creates a list of all the image URLs on a web page.
To do so we use a module which handles http + https and writes a thin
layer on top with a single function that takes a string and returns a
list or strings with the URLs. In other word, we only have
a single function that we want to export.

But if we create a static library with this functionality
and naively export the public functions we will get the
not just get our single function, but the
public functions of the http module as well...
plus public functions of anything the http module uses!

While the linker might strip unused code when creating an executable,
even in this case we will still generate code that is not used.

### Explicit exports

The first necessary feature is to be able to mark functions and globals
as being exported. Note that being exported is orthogonal to public / private.
Public and private is about source level visibility, and exports is
about library and linker visibility.

Because exported functions are usually public, some languages conflate
public and export, making `export` simply a variant of *"public"*.
(In C3 the `@export` makes a function or global exported, it has no effect
on visibility between modules).

### Entry points => dependency graph

With `export` we're now able to make a real dependency graph. For a regular
executable the `main` function can be considered the entry point,
otherwise we use functions marked `export` to trace dependencies.

## Summary

* We have looked how static methods and member overlap with module namespaced
  functions and globals. This means namespacing can be done with modules,
  static methods and member or a combination thereof. C3 uses modules only.
* Modules may be flat or hierarchal. C3 uses a hierarchal module namespace.
* Various methods may be used to reduce repetitive module prefixing. Aliasing
  namespace inlining are common. C3 uses path shortening.
* The simplest visibility semantics only has public and private.
* Accessing "private" functions is useful, and there are various solutions.
* One method is adding a special visibility level to let a parent or child module
  access private functions.
* Another method is defining what other modules as "friends" to access private
  functions as if they were public.
* C3 allows a module to import private functions of other modules.
* C3 has three visibility levels: `@public` `@private` and `@local`. "local"
  means it is local to the current module section.
* Imports can be narrow or wide. C3 prefers wildcard imports. Narrow imports
  is mostly useful when imports directly can infer the dependency graph.
* Exports need to be different from "all of the public functions".
* C3 uses `@export` to mark declarations to export.

*If you want to try out C3, you can test it here: <https://learn-c3.org>*.