---
title: C Interoperability
description: C Interoperability
sidebar:
    order: 68
---

C3 is C ABI compatible. That means you can call C from C3, and call C3 from C without having to
do anything special. As a quick way to call C, you can simply declare the function as a 
C3 function but with `extern` in front of it. As long as the function is linked, it will work:

```c3
extern fn void puts(char*); // C "puts"

fn void main()
{
    // This will call the "puts"
    // function in the standard c lib.
    puts("Hello, world!"); 
}
```

To use a different identifier inside of your C3 code compared to the function or variable’s external name, use the @extern attribute:

```c3
extern fn void foo_puts(char*) @extern("puts"); // C "puts"

fn void main()
{
    foo_puts("Hello, world!"); // Still calls C "puts"
}
```

While C3 functions are available from C using their external name, it's often useful to
define an external name using `@extern` to match C usage.

```c3
module foo;
fn int square(int x)
{
    return x * x;
}

fn int square2(int x) @extern("square")
{
    return x * x;
}
```

Calling from C:

```c3
extern int square(int);
int foo_square(int) __attribute__ ((weak, alias ("foo.square")));

void test()
{
    // This would call square2
    printf("%d\n", square(11));

    // This would call square
    printf("%d\n", foo_square(11));
}
```

## Linking static and dynamic libraries

If you have a library `foo.a` or `foo.so` or `foo.obj` (depending on type and OS), just add
`-l foo` on the command line, or in the project file add it to the `linked-libraries` value, e.g.
`"linked-libraries" = ["foo"]`.

To add library search paths, use `-L <directory>` from the command line and `linker-search-paths`
the project file (e.g. `"linker-search-paths" = ["../mylibs/", "/extra-libs/"]`)

### Gotchas

- Bitstructs will be seen as its backing type, when used from C. 
- C bit fields must be manually converted to a C3 bitstruct with the correct layout for each target platform.
- C assumes the enum size is `CInt`
- C3 uses fixed integer sizes, this means that `int` and `CInt` does not *need* to be the same though in practice on 32/64 bit machines, `long` is usually the *only* type that differs in size between C and C3.
- Passing arrays by value like in C3 must be represented as passing a struct containing the array.
- Atomic types are not supported by C3.
    - In C3 there are generic Atomic types instead.
- There are no `volatile` and `const` **qualifiers** like in C. 
    - C3 has [global constants](/language-fundamentals/naming/#global-constants) declared with `const`. 
    - Instead of the `volatile` type qualifier, there are standard library macros `@volatile_load` and `@volatile_store`.
- In C3, fixed arrays do *not* decay into pointers like in C. 
    - Inside a C3 binding to a C function with an array argument, pass a pointer to the C3 array to get the correct behaviour. 
    - Inside a C binding to a C3 function with an array argument, the passed pointer eg `int[4]*` may be implicitly converted into an `int*`.
