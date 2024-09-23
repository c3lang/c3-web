---
title: Expressions
description: Expressions
sidebar:
    order: 42
---

Expressions work like in C, with one exception: it is possible to take the address of a temporary. This uses the operator `&&` rather than `&`.

Consequently, this is valid:
```c3
fn void test(int* x) { ... }

test(&&1);

// In C:
// int x = 1;
// test(&x);
```
## Well-defined evaluation order

Expressions have a well-defined evaluation order:

1. Binary expressions are evaluated from left to right.
2. Assignment occurs right to left, so `a = a++` would result in `a` being unchanged.
3. Call arguments are evaluated in parameter order.

## Compound literals

C3 has C's compound literals, but unlike C's cast style syntax `(MyStruct) { 1, 2 }`, 
it uses C++ syntax: `MyStruct { 1, 2 }`.
```c3
struct Foo
{
    int a;
    double b;
}

fn void test1(Foo x) { ... }

... 

test1(Foo { 1, 2.0 });
```

Arrays follow the same syntax:
```c3
fn void test2(int[3] x) { ... }

...

test2(int[3] { 1, 2, 3 });
```

Note that when it's possible, inferring the type is allowed, so we have for the above examples:
```c3
test1({ 1, 2.0 });
test2({ 1, 2, 3 });
```
One may take the address of temporaries, using `&&` (rather than `&` for normal variables). This allows the following:

Passing a [slice](/language-common/arrays/#slice)

```c3
fn void test(int[] y) { ... }

// Using &&
test(&&int[3]{ 1, 2, 3 });

// Explicitly slicing:
test(int[3]{ 1, 2, 3 }[..]);

// Using a slice directly as a temporary:
test(int[]{ 1, 2, 3 });

// Same as above but with inferred type:
test({ 1, 2, 3 });
```

Passing the pointer to an [array](/language-common/arrays)

```c3
fn void test1(int[3]* z) { ... }
fn void test2(int* z) { ... }

test1(&&int[3]{ 1, 2, 3 });
test2(&&int[3]{ 1, 2, 3 });
```

## Constant expressions

In C3 all _constant expressions_ are guaranteed to be calculated at compile time. The following are considered constant expressions:

1. The `null` literal.
2. Boolean, floating point and integer literals.
3. The result of arithmetics on constant expressions.
4. Compile time variables (prefixed with `$`)
5. Global constant variables with initializers that are constant expressions.
6. The result of macros that does not generate code and only uses constant expressions.
7. The result of a cast if the value is cast to a boolean, floating point or integer type and the value that is converted is a constant expression.
8. String literals.
9. Initializer lists containing constant values.

Some things that are *not* constant expressions:

1. Any pointer that isn't the `null` literal, even if it's derived from a constant expression.
2. The result of a cast except for casts of constant expressions to a numeric type.
3. Compound literals - even when values are constant expressions.

## Including binary data

The `$embed(...)` function includes the contents of a file into the compilation as a
constant array of bytes:

```c3
char[*] my_image = $embed("my_image.png");
```

The result of an embed work similar to a string literal and can implicitly convert to a `char*`, 
`void*`, `char[]`, `char[*]` and `String`.

##### Limiting length

It's possible to limit the length of included with the optional second parameter.

```c3
char[4] my_data = $embed("foo.txt", 4);
```

##### Failure to load at compile time and defaults

Usually it's a compile time error if the file can't be included, but sometimes it's useful to only optionally include it. 
If this is desired, declare the left hand side an [Optional](/language-common/optionals-essential/#what-is-an-optional):

```c3
char[]! my_image = $embed("my_image.png");
```

`my_image` with be an optional `IoError.FILE_NOT_FOUND?` if the image is missing.

This also allows us to pass a [default value using `??`](/language-common/optionals-advanced/#return-a-default-value-if-optional-is-empty):
```c3
char[] my_image = $embed("my_image.png") ?? DEFAULT_IMAGE_DATA;
```