---
title: Frequently Asked Questions
description: Frequently asked questions about C3
sidebar:
    order: 105
---
## Standard library

**Q:** What are the most fundamental modules in the standard library?

**A:** By default C3 will implicitly import anything in `std::core` into
your files. It contains string functions, allocators and conveniences for
doing type introspection. The latter is in particular useful when writing
contracts for macros:

- `std::core::array` functions for working with arrays.
- `std::core::builtin` contains functions that are to be used without a module
  prefix, `unreachable()`, `bitcast()`, `@catch()` and `@ok()`
  are especially important.
- `std::core::cinterop` contains types which will match the C types on the platform.
- `std::core::dstring` Has the dynamic string type.
- `std::core::mem` contains `malloc` etc, as well as functions for atomic
  and volatile load / store.
- `std::core::string` has all string functionality, including conversions,
  splitting and searching strings.

Aside from the `std::core` module, `std::collections` is important as it
holds various containers. Of those the generic `List` type in `std::collections::list`
and the `HashMap` in `std::collections::map` are very frequently used.

IO is a must, and `std::io` contains `std::io::file` for working with files,
`std::io::path` for working with paths. `std::io` itself contains
functionality to writing to streams in various ways. Useful streams can
be found in the `stream` sub folder.

Also of interest could be `std::net` for sockets. `std::threads` for
platform independent threads, `std::time` for dates and timers, `std::libc` for
invoking libc functions. `std::os` for working with OS specific code and
`std::math` for math functions and vector methods.


**Q:** How do strings work?

**A:** C3 defines a native string type `String`, which is a distinct `char[]`. Because
`char[]` is essentially a pointer + length, some care has to be taken to
ensure that the pointer is properly managed.

For dynamic strings, or as a string builder, use `DString`. To get a String from
a DString you can either get a *view* using `str_view()` or make a copy using `copy_str()`.
In the former case, the String may become invalid if DString is then mutated.

`ZString` is a distinct zero terminated `char*`. It is used to model zero-terminated
strings like in C. It is mostly useful interfacing with C.

`WString` is a `Char16*`, useful on those platforms, like Win32, where this
is the common unicode format. Like ZString, it is mostly useful when interfacing
with C.

## Language features

**Q:** How do I use slices?

**A:** Slices are typically preferred in any situation where one in C would pass
a pointer + length. It is a struct containing a pointer + a length.

Given an array, pointer or another slice you use either `[start..end]`
or `[start:len]` to create it:

```c3
int[100] a;
int[] b = a[3..6]; // Or a[3:4]
b[0] = 1;          // Same as a[3] = 1
```

You can also just pass a pointer to an array:

```c3
b = &a; // Same as b = a[0..99];
```

The start and/or end may be omitted:

```c3
a[..6]; // a[0..6]
a[1..]; // a[1..99]
a[..];  // a[0..99];
```

It is possible to use ranges to assign:

```c3
a[1..2] = 5;         // Assign 5 to a[1] and a[2]
a[1..3] = a[11..13]; // Copy 11-13 to 1-3
```

It is important to remember that the *lifetime* of a slice is the same
as the lifetime of its underlying pointer:

```c3
fn int[] buggy_code()
{
    int[3] a;
    int[] b = a[0..1];
    return b; // returning a pointer to a!
}
```

**Q:** What are vectors?

**A:** Vectors are similar to arrays, but declared with `[< >]` rather than `[ ]`, the element type may also only
be of integer, float, bool or pointer types. Vectors are backed by SIMD types on supported platforms. Arithmetics
available on the element type is available on the vector and is done element wise:

```c3
int[<2>] pos = { 1, 3 };
int[<2>] speed = { 5, 7 };
pos += speed;              // pos is now { 6, 10 }
```

Swizzling is also supported:

```c3
int[<3>] test = pos.yxx;    // test is now { 10, 6, 6 }
```

Any scalar value will be expanded to the vector size:

```c3
// Same as speed = speed * { 2, 2 }    
speed = speed * 2;
```

## Memory management

**Q:** How do I work with memory?

**A:** There is `malloc`, `calloc` and `free` just like in C. The main difference is that these will invoke whatever
the current heap allocator is, which does not need to be the allocator provided by libc. You can get the current heap
allocator using `allocator::heap()` and do allocations directly. There is also a temporary allocator.

Convenience functions are available for allocating particular types: `mem::new(Type)` would allocate a single `Type`
on the heap and zero initialize it. `mem::alloc(Type)` does the same but without zero initialization.

Alternatively, `mem::new` can take a second initializer argument:

```c3
Foo* f1 = malloc(Foo.sizeof);                   // No initialization
Foo* f2 = calloc(Foo.sizeof);                   // Zero initialization
Foo* f3 = mem::new(Foo);                        // Zero initialization
Foo* f4 = mem::alloc(Foo);                      // No initialization
Foo* f5 = mem::new(Foo, { 4, 10.0, .a = 123 }); // Initialized to argument
```

For arrays `mem::new_array` and `mem::alloc_array` works in corresponding ways:

```c3
Foo* foos1 = malloc(Foo.sizeof * len);    // No initialization
Foo* foos2 = calloc(Foo.sizeof * len);    // Zero initialization
Foo[] foos3 = mem::new_array(Foo, len);   // Zero initialization
Foo[] foos4 = mem::alloc_array(Foo, len); // No initialization
```

Regardless of how they are allocated, they can be freed using `free()`

**Q:** How does the temporary allocator work?

**A:** The temporary allocator is a kind of stack allocator. `talloc`, `tcalloc` and `trealloc` correspond to
`malloc`, `calloc` and `realloc`. There is no `free`, as temporary allocations are free when pool of temporary
objects are released. You use the `@pool()` macro to create a temporary allocation scope. When execution exits
this scope, the temporary objects are all freed:

```c3
@pool()
{
    void* some_mem = talloc(128);
    foo(some_mem);
}; 
// Temporary allocations are automatically freed here.
```

Similar to the heap allocator, there is also `mem::temp_new`, `mem::temp_alloc`, `mem::temp_new_array` and `mem::temp_alloc_array`,
which all work like their heap counterparts.

**Q:** How can I return a temporarily allocated object from inside a temporary allocation scope?

**A:** You need to pass in a copy of the temp allocator *outside* of `@pool` and allocate explicitly
using that allocator. In addition, you need to pass this temp allocator to `@pool` to make the
new temp allocator aware of the external temp allocator:

```c3
// Store the temp allocator
Allocator* temp = allocator::temp();
@pool(temp)
{
    // Note, 'allocator::temp() != temp' here!
    void* some_mem = talloc(128);
    // Allocate this on the external temp allocator
    Foo* foo = temp.new(Foo); 
    foo.z = foo(some_mem);
    // Now "some_mem" will be released,
    // but the memory pointed to by "foo" is still valid.
    return foo;
};
```

## Interfacing with C code

**Q:** How do I call a C function from C3?

**A:** Just copy the C function definition and prefix it with `extern` (and don't forget the `fn` as well).

Imagine for example that you have the function `double test(int a, void* b)`. To call it from C3 just declare
`extern fn double test(CInt a, void* b)` in the C3 code.

**Q:** My C function / global has a name that doesn't conform to the C3 name requirements, just `extern fn` doesn't 
work.

**A:** In this case you need to give the function a C3-compatible name and then use the `@extern` attribute to 
indicate its actual external name. For example, the function `int *ABC(void *x)` could be declared in the C3 code as
`extern fn int* abc(void* x) @extern("ABC")`.

There are many examples of this in the `std::os` modules.

## Patterns

**Q:** When do I put functionality in method and when is it a free function?

**A:** In the C3 standard library, free functions are preferred unless the function is only acting on the particular
type. Some exceptions exist, but prefer things like `io::fprintf(file, "Hello %s", name)` over 
`file.fprintf("Hello %s", name)`. The former also has the advantage that it's easier to extend to work with many
types.

**Q:** Are there any naming conventions in the standard library what one should know about?

**A:** Yes. A function or method with `new` in the name will in general do one or more allocations and can take an
optional allocator. A function or method with `temp` in the name will usually allocate using the temp allocator. 
The method `free` will free all memory associated with a type. `destroy` is similar to `free` but also indicates
that other resources (such as file handles) are released. In some cases `close` is used instead of `destroy`.

Function and variable names use `snake_case` (all lower case with `_` separating words).

**Q:** How do I create overloaded methods?

**A:** This can be achieved with macro methods.

Imagine you have two methods:

```c3
fn void Obj.func1(&self, String... args) @private {} // varargs variant
fn void Obj.func2(&self, Foo* pf) @private {} // Foo pointer variant
```

We can now create a macro method on `Obj` which compiles to different calls depending on arguments:

```c3
// The macro must be vararg, since the functions take different amount of arguments
macro void Obj.func(&self, ...)
{
    // Does it have a single argument of type 'Foo*'?
    $if $vacount == 1 && @typeis($vaarg(0), Foo*):
        // If so, dispatch to func2
        return self.func2($vaarg(0));
    $else
        // Otherwise, dispatch all varargs to func1 
        return self.func1($vasplat());
    $endif
}
```

The above would make it possible to use both `obj.func("Abc", "Def")` and `obj.func(&my_foo)`.

## Syntax & Language design

**Q:** Why does C3 require that types start with upper case but functions with lower case?

**A:** C grammar is ambiguous. Usually compilers implement either the so-called lexer hack, but other methods
exist as well, such as delayed parsing. It is also possible to make it unambiguous using infinite lookahead.

However, all of those methods makes it much harder for tools to search the source code accurately. By making
the naming convention part of the grammar, C3 is straightforward to parse with a single token lookahead.

**Q:** Why are there no closures and only non-capturing lambdas?

**A:** With closures, life-time management of captured variables become important to track. This can become
arbitrarily complex, and without RAII or any other memory management technique it is fairly difficult to
make code safe. Non-capturing lambdas on the other hand are fairly safe.

**Q:** Why is it called C3 and not something better?

**A:** Naming a programming language isn't easy. Most programming languages have pretty bad names, and
while C3 isn't the best, no real better alternative has come along.

**Q:** Why are there no static methods?

**A:** Static methods creates a tension between free functions in modules and functions namespaced by the type.
Java for example, resolves this by not having free functions at all. C3 solves it by not having static methods (nor
static variables). Consequently more functions becomes part of the module rather than the type.

