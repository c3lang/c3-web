---
title: "Are modules without imports \"considered harmful\"?"
date: 2022-02-05
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8337-are_modules_without_imports_considered_harmful](https://c3.handmade.network/blog/p/8337-are_modules_without_imports_considered_harmful)*

Can you really do a module system without import statements? And should you? If you’re like me you’d probably initially dismiss the idea: “surely that can only work for very simple examples!”

But someone filed an issue to add it to C3, so I had to motivate why it would be difficult / impossible to do well (this actually ended with me redesigning the module system quite a bit).
– But the question whether it’s possible stuck with me.

# Why it shouldn't work

Let’s quickly review the problems with no imports (where modules are loaded automatically).

## 1. Ambiguities

The classic example is the function “open”, which is would clash with open in all other modules, making it necessary to use the full module names:

```
module foo;
fn File* open(char* filename) { … }

module bar;
fn Connection* open(char* url) { … }

module baz;
fn void test()
{
   open(“foo.txt”); // Which one is intended?
}
```

## 2. Bad search & code completion

When all files are basically importing everything then every public function should be listed for code completion or search.

If you'd just match your own code it wouldn’t be so bad, but add to that the whole standard library + any library you’re importing… you'll get a lot of matches.

## 3. Compiling more than necessary

Some languages use imports to figure out exactly what files to compile. Implicitly having everything imported is means everything needs to be analyzed during compilation.

## 4. Dependencies are not obvious

Explicit imports help both readers of the source code and things like IDEs to limit the files the current file depends on in a simple way.

## Summing it up

All in all the situation looks pretty grim so there’s a reason why we don’t see this.

There are outliers: pre-namespace PHP, and from what I’ve heard there’s a Prolog variant which has a form of auto import as well. Unfortunately these examples offer very little in terms of encouragement.

# Making a try

Despite this I found that I personally couldn’t really dismiss the idea entirely, for my own peace of mind I had to make sure it wasn’t possible. Let’s revisit the problems:

## 1. Ambiguities

In this case I actually had the problem halfway solved: in C3 all functions are expected to be called with at least a partial path qualifier.

To call the function `foo()` from `module std::bar` in another module you have to write `bar::foo()` to call it (`std::bar::foo()` works as well).

I haven't seen the idea of using abbreviated module paths elsewhere, and so it seems to be a novel invention. It should be possible to implement in any namespace scheme where namespaces are separate from types.

However for C3 structs and other user defined types do not require any qualifiers. The reasoning is that type names in general tend to be fairly unique except where two libraries trying to abstract the same thing (for example two file IO libraries will probably both use `File` as a type name somewhere)

Name collisions are rare with explicit imports, but for implicit imports this might become a real issue.

```
module foo::io;
struct File { ... }

module std::io;
struct File { ... }

module bar;
File *f; // Is which File is this?
```

Fortunately we can introduce a simple feature to help us out: if we reintroduce `import` but change its meaning so that it simply makes the imported module’s types and functions *preferred* over modules that aren’t imported when doing type resolution.

So returning to the example with `File`: rather than to have to type `foo::io::File` to disambiguate it from `std::io::File` we simply add `import foo::io` to the start of the file:

```
module bar;
import foo::io;

File *f; // This is foo::io::File
```

If we sort of squint at it this is actually a little like Java’s imports work: they only add possibility to use the imported classes without qualifiers.

This seems like **(1)** could be considered solvable for any language that are fine with path qualifiers in front of functions and globals like in C3.

### 3. Compiling more than necessary

For reasons that will become apparent later, let's jump to this point first.

Trying to solve this requires us to look at our compilation model in general. For the more extreme version of this, let’s assume that all our libraries are in source form rather than precompiled. We can say we roughly have 3 types of source code: *the application code*, *external libraries* and the *standard library*.

In C3 you already specify the libraries you want to add by specifying the libraries you need for the project. The problem here are projects that bring in their own dependencies.

There’s an simple model we could use here:

* the application code only sees what is public in the actual libraries imported.
* the external libraries are resolved seeing only the dependencies they have and not the application code

Let’s say you have a library which allows you to set up an HTTPS service, which in turn uses a crypto library: your application code will not see the crypto library and the HTTPS service will not see other libraries that the application code uses.

To summarize:

1. **Application code:** sees library and standard library public types, variables and functions.
2. **Library:** sees only public declarations of its own dependencies and the standard library.
3. **Standard library:** only sees itself.

Here we're moving dependencies and imports from the source files into the build configuration.

Unfortunately, in practice we will likely still parse most of the code and start decide what needs to be lowered into actual code after analysis. In other words this is not necessarily a win. Parsing and semantic analysis is a small part of the compile time so avoiding doing it for some code doesn't necessarily help much.

## Java "modules"

Taking a detour now: Java has a large standard library and typically frameworks have a fair amount of additional dependencies. To address this Java introduced “modules” in *Project Jigsaw* (not to be confused with the Java packages that are used with import). Jigsaw modules are essentially creating groups of Java packages documented in a special file that also specifies dependencies to other “modules”. The idea is to drastically reduce the number of packages that need to be bundled for an application.

This is very similar to the compilation issue above. By providing a file which in detail describes what parts of the libraries the application uses, the compiler can actually begin with those library definitions before lexing and parsing starts. So in your app you could perhaps not just define the libraries you want to use, but also specify the subset of the modules we are actually depending on. In practical terms we define in a single place what our imports are and the compiler just needs to work with this subset. This is sort of an analogue of keeping a precompiled header in C with all the external library headers you want to use in the project. Although we're not necessarily reducing the compile time more, we're making the job a lot simpler for the compiler.

## 2. Bad search & code completion

Armed with this we can go back to the question of search: if we now use these package dependency files we've suddenly reduced the lookup for code completion to the subset of packages we actually use in our project, which effectively resolves this issue.

## 4. Dependencies are not obvious

We’re also ready to tackle the dependencies because we're now in a much better situation than with per-file imports: we can see all dependencies our project has, and also what dependencies the libraries we depend on have by inspection of a few files.

If libraries split their dependencies into multiple groups we can also get a reduction in the number of libraries we need for compilation.

As an example, let us envision a http server library which both supports http and https. The latter depends on a cryptography library which contains multiple types of algorithms. If the library is split into multiple modules, then we can perhaps let the http part simply depend on a TCP library, whereas the https also depends on some cryptography algorithms, but perhaps only in use for https.

Depending on how much granularity there is, something not using https might avoid the download of the cryptography library, and even if https is included, packages with deprecated hash and crypto algorithms do not need to be included to compile the https library.

# Does this mean it works?

It seems like for most module systems it could work – given that the caveats listed are satisfied.

But should one do it? I would hedge my bets and say "possibly". Regular imports requires less of the language and is the proven approach, but I believe I've shown that "modules without imports" could still be up for consideration when designing a language.

## Comments


---
### Comment by Christoffer Lernö

Can you really do a module system without import statements? And should you? If you’re like me you’d probably initially dismiss the idea: “surely that can only work for very simple examples!”

But someone filed an issue to add it to C3, so I had to motivate why it would be difficult / impossible to do well (this actually ended with me redesigning the module system quite a bit).
– But the question whether it’s possible stuck with me.

# Why it shouldn't work

Let’s quickly review the problems with no imports (where modules are loaded automatically).

## 1. Ambiguities

The classic example is the function “open”, which is would clash with open in all other modules, making it necessary to use the full module names:

```
module foo;
fn File* open(char* filename) { … }

module bar;
fn Connection* open(char* url) { … }

module baz;
fn void test()
{
   open(“foo.txt”); // Which one is intended?
}
```

## 2. Bad search & code completion

When all files are basically importing everything then every public function should be listed for code completion or search.

If you'd just match your own code it wouldn’t be so bad, but add to that the whole standard library + any library you’re importing… you'll get a lot of matches.

## 3. Compiling more than necessary

Some languages use imports to figure out exactly what files to compile. Implicitly having everything imported is means everything needs to be analyzed during compilation.

## 4. Dependencies are not obvious

Explicit imports help both readers of the source code and things like IDEs to limit the files the current file depends on in a simple way.

## Summing it up

All in all the situation looks pretty grim so there’s a reason why we don’t see this.

There are outliers: pre-namespace PHP, and from what I’ve heard there’s a Prolog variant which has a form of auto import as well. Unfortunately these examples offer very little in terms of encouragement.

# Making a try

Despite this I found that I personally couldn’t really dismiss the idea entirely, for my own peace of mind I had to make sure it wasn’t possible. Let’s revisit the problems:

## 1. Ambiguities

In this case I actually had the problem halfway solved: in C3 all functions are expected to be called with at least a partial path qualifier.

To call the function `foo()` from `module std::bar` in another module you have to write `bar::foo()` to call it (`std::bar::foo()` works as well).

I haven't seen the idea of using abbreviated module paths elsewhere, and so it seems to be a novel invention. It should be possible to implement in any namespace scheme where namespaces are separate from types.

However for C3 structs and other user defined types do not require any qualifiers. The reasoning is that type names in general tend to be fairly unique except where two libraries trying to abstract the same thing (for example two file IO libraries will probably both use `File` as a type name somewhere)

Name collisions are rare with explicit imports, but for implicit imports this might become a real issue.

```
module foo::io;
struct File { ... }

module std::io;
struct File { ... }

module bar;
File *f; // Is which File is this?
```

Fortunately we can introduce a simple feature to help us out: if we reintroduce `import` but change its meaning so that it simply makes the imported module’s types and functions *preferred* over modules that aren’t imported when doing type resolution.

So returning to the example with `File`: rather than to have to type `foo::io::File` to disambiguate it from `std::io::File` we simply add `import foo::io` to the start of the file:

```
module bar;
import foo::io;

File *f; // This is foo::io::File
```

If we sort of squint at it this is actually a little like Java’s imports work: they only add possibility to use the imported classes without qualifiers.

This seems like **(1)** could be considered solvable for any language that are fine with path qualifiers in front of functions and globals like in C3.

### 3. Compiling more than necessary

For reasons that will become apparent later, let's jump to this point first.

Trying to solve this requires us to look at our compilation model in general. For the more extreme version of this, let’s assume that all our libraries are in source form rather than precompiled. We can say we roughly have 3 types of source code: *the application code*, *external libraries* and the *standard library*.

In C3 you already specify the libraries you want to add by specifying the libraries you need for the project. The problem here are projects that bring in their own dependencies.

There’s an simple model we could use here:

* the application code only sees what is public in the actual libraries imported.
* the external libraries are resolved seeing only the dependencies they have and not the application code

Let’s say you have a library which allows you to set up an HTTPS service, which in turn uses a crypto library: your application code will not see the crypto library and the HTTPS service will not see other libraries that the application code uses.

To summarize:

1. **Application code:** sees library and standard library public types, variables and functions.
2. **Library:** sees only public declarations of its own dependencies and the standard library.
3. **Standard library:** only sees itself.

Here we're moving dependencies and imports from the source files into the build configuration.

Unfortunately, in practice we will likely still parse most of the code and start decide what needs to be lowered into actual code after analysis. In other words this is not necessarily a win. Parsing and semantic analysis is a small part of the compile time so avoiding doing it for some code doesn't necessarily help much.

## Java "modules"

Taking a detour now: Java has a large standard library and typically frameworks have a fair amount of additional dependencies. To address this Java introduced “modules” in *Project Jigsaw* (not to be confused with the Java packages that are used with import). Jigsaw modules are essentially creating groups of Java packages documented in a special file that also specifies dependencies to other “modules”. The idea is to drastically reduce the number of packages that need to be bundled for an application.

This is very similar to the compilation issue above. By providing a file which in detail describes what parts of the libraries the application uses, the compiler can actually begin with those library definitions before lexing and parsing starts. So in your app you could perhaps not just define the libraries you want to use, but also specify the subset of the modules we are actually depending on. In practical terms we define in a single place what our imports are and the compiler just needs to work with this subset. This is sort of an analogue of keeping a precompiled header in C with all the external library headers you want to use in the project. Although we're not necessarily reducing the compile time more, we're making the job a lot simpler for the compiler.

## 2. Bad search & code completion

Armed with this we can go back to the question of search: if we now use these package dependency files we've suddenly reduced the lookup for code completion to the subset of packages we actually use in our project, which effectively resolves this issue.

## 4. Dependencies are not obvious

We’re also ready to tackle the dependencies because we're now in a much better situation than with per-file imports: we can see all dependencies our project has, and also what dependencies the libraries we depend on have by inspection of a few files.

If libraries split their dependencies into multiple groups we can also get a reduction in the number of libraries we need for compilation.

As an example, let us envision a http server library which both supports http and https. The latter depends on a cryptography library which contains multiple types of algorithms. If the library is split into multiple modules, then we can perhaps let the http part simply depend on a TCP library, whereas the https also depends on some cryptography algorithms, but perhaps only in use for https.

Depending on how much granularity there is, something not using https might avoid the download of the cryptography library, and even if https is included, packages with deprecated hash and crypto algorithms do not need to be included to compile the https library.

# Does this mean it works?

It seems like for most module systems it could work – given that the caveats listed are satisfied.

But should one do it? I would hedge my bets and say "possibly". Regular imports requires less of the language and is the proven approach, but I believe I've shown that "modules without imports" could still be up for consideration when designing a language.