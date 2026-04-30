---
title: "Imports and modules"
date: 2022-05-16
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8417-imports_and_modules](https://c3.handmade.network/blog/p/8417-imports_and_modules)*

When talking about packages / modules, I think it's useful to start with Java. As a language C/C++ but with an import / module system from the beginning, it ended up being a very influential.

## Importing a namespace or a graph

Interestingly, the `import` statement in Java doesn't actually import anything. It's a simple namespace folding mechanism, allowing you to use something like `java.util.Random` as just `Random`. The fact that you can use the fully qualified name somewhere later in the source code to implicitly use another package, means that the imports do not fully define the dependencies of a Java source file.

In Java, given a collection of source files, all must be compiled to determine the actual dependencies. However, we can imagine instead a different model where the import statements create a dependency graph, starting from the source file that is the main entry point. In this model we may have N source files, but not all are even compiled, since only the subset M can be reached from the import graph.

This later model allows some extra features. For example we can build the feature where including a source file may also implicitly cause a dynamic or static library to be linked. Because only the source code in the graph is compiled, we'll then only get the extra link parameter if the imports reach the source file with the parameter.

The disadvantage is that the imports need to have a clear way of finding the additional dependencies. This is typically done with a file hierarchy or strict naming scheme, so that importing `foo.bar` allows the compiler to easily find the file or files that define that particular module.

## Folding the import

For module systems that allow sub modules, so that there's both `foo.bar` and `foo.baz`, the problem with verbosity appears: do we really want to type `std.io.net.Socket` everywhere? I think the general consensus is that this is annoying.

The two common ways to solve this are namespace folding and namespace renaming, but I'm going to present one more which I term namespace shortening.

The namespace folding is the easiest. You import `std.io.net` and now you can use `Socket` unqualified. This is how it works in Java. However, we should note that in Java any global or function is actually prefixed with the class name, which means that even when folding the namespace, your globals and "functions" (static methods) ends up having a prefix.

To overcome collisions and shortcomings of namespace folding, there's namespace renaming, where the import explicitly renames the module name in the file scope, so `std.io.net` might become `n` and you now use `n.Socket` rather than the fully folded or fully qualified name. The downside is naming this namespace alias. Naming things well is known to be one of the harder things in programming, and it can also add to the confusion if the alias is chosen to be different in different parts of the program, e.g. `n.Socket` in one file and `netio.Socket` in another.

A way to address the renaming problem is to recognize that usually only the last namespace element is sufficient to distinguish one function from another, so we can allow an abbreviated namespace, allowing the shortened namespace to be used in place of the full one. With this scheme `std.io.net.open_socket()`, `io.net.open_socket()` and `net.open_socket()` are all valid as long as there is no ambiguity (for example, if an import made `foo.net.open_socket()` available in the current scope, then `net.open_socket()` would be ambiguous and a longer path, like `io.net.open_socket()` would be required). C3 uses this scheme for all globals, functions and macros and it seems successful so far.

## Lots of imports

In Java, imports quickly became fairly onerous to write, since using a class `foo.bar.Baz` would use another class from `foo.bar.Bar` and now both needed to be imported. While wildcard imports helped a bit, those would pull in more classes than necessary, and so inspecting the import statements would obfuscate the actual dependencies.

As a workaround, languages like D added the concept of re-exported imports (D calls this feature "public imports"). So in our `foo.bar.Baz` case, it could import `foo.bar.Bar` and re-export it. So that an import of `foo.bar.Baz` implicitly imports `foo.bar.Bar` as well. The downside here again is that it's not possible from looking at the imports to see what the actual dependencies are.

A related feature is implicit imports determined by the namespace hierarchy. So for example in Java, any source file in the package `foo.bar.baz` has all the classes of `foo.bar` implicitly folded into its namespace. This folding goes bottom up, but not the other way around. So while `foo.bar.baz.AbcClass` sees `foo.bar.Baz`, `Baz` can't access `foo.bar.baz.AbcClass` without an explicit import.

## An experiment: no imports

For C3 I wanted to try going completely without imports. This was feasible mainly due to two observations: (1) type names tend to be fairly universally unique (2) methods and globals are usually unique with a shortened namespace. So given, `Foo` and `foo::some_function()` these should mostly be unique without the need for imports. So this is a completely implicit import scheme.

This is completmented by the compiler requiring the programmer to explicitly say which libraries should be used for compilation. So imports could be said to be done globally for the whole program in the build settings.

This certainly works, but has a drawback: let's say a program relies on a library like Raylib. Now Raylib in itself will create a lot of types and functions and while it's no problem to resolve them, it could make it confusing for a casual reader "Oh, a Vector2, is this part of the C3 standard library?", whereas having an `import raylib;` at the top would immediately hint to the reader where Vector2 might be found.

## Wildcard imports for all?

The problem with zero imports suggests an alternative of wildcard imports as the default, so `import raylib;` would be the standard type of imports and would recursively import everything in raylib, and similarly `import std;` would get the whole standard library. This would be more for the reader of the code to find the dependencies than being necessary for the compiler.

One problem with this design are the sub modules visibility rules: "what does `foo::bar::baz` and `foo::bar` see?"

Java would allow `foo::bar::baz` to see the `foo::bar` parent module, but not vice versa. However, looking at the actual usage patterns, it seems to make sense to make this bidirectional, so that all are visible to each other.

But if parent and children modules are visible to each other, what about sibling modules? E.g. does `foo::bar::baz` see `foo::bar::abc`? In actual usecases there are arguments both for and against. But if we have sibling visibility what about `foo::def` and `foo::bar::abc`? Could they be visible to each other? And if not, would such rules get complicated?

To create a more practical scenario, imagine that we have the following:

1. `std::io::file::open_filename_for_read()` a function to open a file for reading
2. `std::io::Path` representing a general path.
3. `std::io::OpenMode` a distinct type for a mask value for file or resource opening
4. `std::io::readoptions::READ_ONLY` a constant of type `OpenMode`

Let's say this is the implementation of (1)

```
fn File* open_filename_for_read(char[] filename)
{
  Path* p = io::path_from_string(foo);
  defer io::path_free(p);
  return file::open_file(p, readoptions::READ_ONLY);
}
```

Here we see that `std::io::file` must be able to use `std::io` and `std::io::readoptions`. The `readoptions` sub module needs `std::io` but not the `file` sub module. Note how C3 uses a function in a sub module as other languages would typically use static methods. If we want to avoid excessive imports in this case, then `file` would need sibling and parent visibility, whereas the `readoptions` use only requires parent visibility.

Excessive rules around visibility is both hard to implement well, hard to test and hard to remember, so it might be preferrable to simply say that a module has visibility to any other module in the same top module. The downside would of course be that visibility is much wider than what's probably desired (e.g. `std::math` having visibility to `std::io`).

## Conclusions and further research for C3

Like everything in language design, imports and modules have a lot of trade-offs. Import statements may be used to narrow down the dependency graph, but at the same time a language with a lot of imports don't necessarily use them in that manner. For namespace folding it matters a lot whether functions are usually grouped as static methods or free functions. Imports can be used to implicitly determine things like linking arguments, in which case the actual import graph matters.

For C3, the scheme with implicit imports works thanks to library imports also being restricted by build scripts, but high level imports could still improve readability. However such a scheme would probably need recursive imports which raises the question of implicit imports between sub modules. For C3 in particular this an important usability concern as sub modules are used to organize functions and constants more than is common in many other languages. This is the area I'm currently researching, but I hope that within a few weeks I can have a design candidate.

## Comments


---
### Comment by Christoffer Lernö

When talking about packages / modules, I think it's useful to start with Java. As a language C/C++ but with an import / module system from the beginning, it ended up being a very influential.

## Importing a namespace or a graph

Interestingly, the `import` statement in Java doesn't actually import anything. It's a simple namespace folding mechanism, allowing you to use something like `java.util.Random` as just `Random`. The fact that you can use the fully qualified name somewhere later in the source code to implicitly use another package, means that the imports do not fully define the dependencies of a Java source file.

In Java, given a collection of source files, all must be compiled to determine the actual dependencies. However, we can imagine instead a different model where the import statements create a dependency graph, starting from the source file that is the main entry point. In this model we may have N source files, but not all are even compiled, since only the subset M can be reached from the import graph.

This later model allows some extra features. For example we can build the feature where including a source file may also implicitly cause a dynamic or static library to be linked. Because only the source code in the graph is compiled, we'll then only get the extra link parameter if the imports reach the source file with the parameter.

The disadvantage is that the imports need to have a clear way of finding the additional dependencies. This is typically done with a file hierarchy or strict naming scheme, so that importing `foo.bar` allows the compiler to easily find the file or files that define that particular module.

## Folding the import

For module systems that allow sub modules, so that there's both `foo.bar` and `foo.baz`, the problem with verbosity appears: do we really want to type `std.io.net.Socket` everywhere? I think the general consensus is that this is annoying.

The two common ways to solve this are namespace folding and namespace renaming, but I'm going to present one more which I term namespace shortening.

The namespace folding is the easiest. You import `std.io.net` and now you can use `Socket` unqualified. This is how it works in Java. However, we should note that in Java any global or function is actually prefixed with the class name, which means that even when folding the namespace, your globals and "functions" (static methods) ends up having a prefix.

To overcome collisions and shortcomings of namespace folding, there's namespace renaming, where the import explicitly renames the module name in the file scope, so `std.io.net` might become `n` and you now use `n.Socket` rather than the fully folded or fully qualified name. The downside is naming this namespace alias. Naming things well is known to be one of the harder things in programming, and it can also add to the confusion if the alias is chosen to be different in different parts of the program, e.g. `n.Socket` in one file and `netio.Socket` in another.

A way to address the renaming problem is to recognize that usually only the last namespace element is sufficient to distinguish one function from another, so we can allow an abbreviated namespace, allowing the shortened namespace to be used in place of the full one. With this scheme `std.io.net.open_socket()`, `io.net.open_socket()` and `net.open_socket()` are all valid as long as there is no ambiguity (for example, if an import made `foo.net.open_socket()` available in the current scope, then `net.open_socket()` would be ambiguous and a longer path, like `io.net.open_socket()` would be required). C3 uses this scheme for all globals, functions and macros and it seems successful so far.

## Lots of imports

In Java, imports quickly became fairly onerous to write, since using a class `foo.bar.Baz` would use another class from `foo.bar.Bar` and now both needed to be imported. While wildcard imports helped a bit, those would pull in more classes than necessary, and so inspecting the import statements would obfuscate the actual dependencies.

As a workaround, languages like D added the concept of re-exported imports (D calls this feature "public imports"). So in our `foo.bar.Baz` case, it could import `foo.bar.Bar` and re-export it. So that an import of `foo.bar.Baz` implicitly imports `foo.bar.Bar` as well. The downside here again is that it's not possible from looking at the imports to see what the actual dependencies are.

A related feature is implicit imports determined by the namespace hierarchy. So for example in Java, any source file in the package `foo.bar.baz` has all the classes of `foo.bar` implicitly folded into its namespace. This folding goes bottom up, but not the other way around. So while `foo.bar.baz.AbcClass` sees `foo.bar.Baz`, `Baz` can't access `foo.bar.baz.AbcClass` without an explicit import.

## An experiment: no imports

For C3 I wanted to try going completely without imports. This was feasible mainly due to two observations: (1) type names tend to be fairly universally unique (2) methods and globals are usually unique with a shortened namespace. So given, `Foo` and `foo::some_function()` these should mostly be unique without the need for imports. So this is a completely implicit import scheme.

This is completmented by the compiler requiring the programmer to explicitly say which libraries should be used for compilation. So imports could be said to be done globally for the whole program in the build settings.

This certainly works, but has a drawback: let's say a program relies on a library like Raylib. Now Raylib in itself will create a lot of types and functions and while it's no problem to resolve them, it could make it confusing for a casual reader "Oh, a Vector2, is this part of the C3 standard library?", whereas having an `import raylib;` at the top would immediately hint to the reader where Vector2 might be found.

## Wildcard imports for all?

The problem with zero imports suggests an alternative of wildcard imports as the default, so `import raylib;` would be the standard type of imports and would recursively import everything in raylib, and similarly `import std;` would get the whole standard library. This would be more for the reader of the code to find the dependencies than being necessary for the compiler.

One problem with this design are the sub modules visibility rules: "what does `foo::bar::baz` and `foo::bar` see?"

Java would allow `foo::bar::baz` to see the `foo::bar` parent module, but not vice versa. However, looking at the actual usage patterns, it seems to make sense to make this bidirectional, so that all are visible to each other.

But if parent and children modules are visible to each other, what about sibling modules? E.g. does `foo::bar::baz` see `foo::bar::abc`? In actual usecases there are arguments both for and against. But if we have sibling visibility what about `foo::def` and `foo::bar::abc`? Could they be visible to each other? And if not, would such rules get complicated?

To create a more practical scenario, imagine that we have the following:

1. `std::io::file::open_filename_for_read()` a function to open a file for reading
2. `std::io::Path` representing a general path.
3. `std::io::OpenMode` a distinct type for a mask value for file or resource opening
4. `std::io::readoptions::READ_ONLY` a constant of type `OpenMode`

Let's say this is the implementation of (1)

```
fn File* open_filename_for_read(char[] filename)
{
  Path* p = io::path_from_string(foo);
  defer io::path_free(p);
  return file::open_file(p, readoptions::READ_ONLY);
}
```

Here we see that `std::io::file` must be able to use `std::io` and `std::io::readoptions`. The `readoptions` sub module needs `std::io` but not the `file` sub module. Note how C3 uses a function in a sub module as other languages would typically use static methods. If we want to avoid excessive imports in this case, then `file` would need sibling and parent visibility, whereas the `readoptions` use only requires parent visibility.

Excessive rules around visibility is both hard to implement well, hard to test and hard to remember, so it might be preferrable to simply say that a module has visibility to any other module in the same top module. The downside would of course be that visibility is much wider than what's probably desired (e.g. `std::math` having visibility to `std::io`).

## Conclusions and further research for C3

Like everything in language design, imports and modules have a lot of trade-offs. Import statements may be used to narrow down the dependency graph, but at the same time a language with a lot of imports don't necessarily use them in that manner. For namespace folding it matters a lot whether functions are usually grouped as static methods or free functions. Imports can be used to implicitly determine things like linking arguments, in which case the actual import graph matters.

For C3, the scheme with implicit imports works thanks to library imports also being restricted by build scripts, but high level imports could still improve readability. However such a scheme would probably need recursive imports which raises the question of implicit imports between sub modules. For C3 in particular this an important usability concern as sub modules are used to organize functions and constants more than is common in many other languages. This is the area I'm currently researching, but I hope that within a few weeks I can have a design candidate.