---
title: Operator Overloading
description: Operator Overloading
sidebar:
    order: 81
---

C3 has operator overloading for working with containers and for
creating numerical types.

## Overloads for containers

### "Element at" operator `[]`

Implementing `[]` allows a type to use the `my_type[<value>]` syntax:

```c3
struct Foo
{
    double[] x;
}

fn double Foo.get(&self, usz i) @operator([])
{
    return self.x[i];
}
```

It's possible to use any type as the argument, such as a string:

```c3
fn double Bar.get(&self, String str) @operator([])
{
    return self.get_val_by_key(str);
}
```

Only a single `[]` overload is allowed.

### "Element ref" operator `&[]`

Similar to `[]`, the `&[]` operator returns a value for `&my_type[<value>]`, which may
be retrieved in a different way. If this overload isn't defined, then `&my_type[<value>]` would
be a syntax error.

```c3
fn double* Foo.get_ref(&self, usz i) @operator(&[])
{
    return &self.x[i];
}
```

### "Element set" operator `[]=`

This operator, the assignment counterpart of `[]`, allows setting an element using `my_type[<index>] = <value>`.

```c3
fn void Foo.set(&self, usz i, double new_val) @operator([]=)
{
    return self.x[i] = new_val;
}
```

### "len" operator

Unlike the previous operator overloads, the "len" operator simply enables functionality
which augments the `[]`-family of operators: you can use the "from end" syntax e.g `my_type[^1]` 
to get the last element assuming the indexing uses integers.

### Enabling `foreach`

In order to use a type with foreach, e.g. `foreach(d : foo)`, at a minimum, methods 
with overloads for `[]` (`@operator([])`) and `len` (`@operator(len)`) need to be added. 
If `&[]` is implemented, `foreach` by reference will be enabled (e.g. `foreach(double* &d : foo)`).

```c3
fn double Foo.get(&self, usz i) @operator([])
{
    return self.x[i];
}

fn usz Foo.len(&self) @operator(len)
{
    return self.x.len;
}

fn void test(Foo f)
{
    // Print all elements in f
    foreach (d : f)
    {
        io::printfn("%f", d);
    }
}
```

## Operator overloading for numerical types

`+ - * / %` together with unary minus and plus, bit operators `^ | &` and `<< >>` are available for overloading
numerical types. These overloads are limited to user-defined types.

### Symmetric and reverse operators

For numerical types, `@operator_s` (defining a symmetric operator)
and `@operator_r` (defining a reverse operator) are available.

These are only available when matching different types, for example
defining `+` between a Complex number and a double can look like this:

```c3
macro Complex Complex.add_double(self, double d) @operator_s(+)
{
    return self.add(self, complex_from_real(d));
}
```

The above would match both "Complex + double" and "double + Complex",
with the actual evaluation order of the arguments happening in 
the expected order (Something like `get_double() + get_complex()`
would always evaluate the arguments from left to right)

For the `@operator_r`, this is useful in the case when the evaluation
isn't symmetric:

```c3
macro Complex Complex.double_sub_this(self, double d) @operator_r(-)
{
    return complex_from_real(d).sub(self);
}
```

The above would define "double - Complex" but not "Complex - double".

### Resolving overloads

Numerical operators that take more than one operator can be properly overloaded,
so we can for example write a different `+` for adding Complex to int
as opposed to "Complex + double".

However, if "Complex + int" doesn't exist then the integer value will follow
the normal conversion rules to implicitly cast it to a double!

More formally the resolution works in this manner:

1. Is there an exact match to the second argument? If so, then this is picked.
2. Is there a way to match by implicitly casting the second argument? If there 
is only one match, then this is picked. If there are multiple matches, then the operation is ambiguous and will be considered an error.

```c3
struct Foo
{
    float a;
}

fn Foo Foo.minus_float(self, float f) @operator(-) => { .a = self.a - f };
fn Foo Foo.minus_double(self, double d) @operator(-) => { .a = self.a - d };

fn void main()
{
    Foo x = { 1.0f };
    Foo y = { 2.2f };
    Foo zf = x - 2.0f; // Uses Foo.minus_float
    Foo zi = x - 2;    // ERROR: Ambiguous, implicitly cast value matches both overloads.
}

```
### Bitstructs and bit operations

As a special rule, bitstructs may not overload `^ & |`, as these operations are already
defined on bitstructs.

### Combined assignment operators

If `+` is defined for a type, then `+=` is defined as well, and similar for the
other operators. However, it is also possible to explicitly override the combined assignment
operators to optimize those cases.

```c3
struct Foo
{
    int a;
}

fn Foo Foo.add(self, Foo other) @operator(+) => { .a = self.a + other. a };
fn Foo Foo.add_self(&self, Foo other) @operator(+=)
{
    self.a += other.a;
    return *self;
}

fn void main()
{
    Foo x = { 1 };
    Foo y = { 2 };
    Foo z = x + y; // Uses Foo.add
    x += y;        // Uses Foo.add_self
}
```

## Operator overloading for == and !=

Overloading == and != is, like for arithmetics, only allowed on user defined types.
If one is defined, the other is also implicitly defined.

:::note

**Some words of caution**

Operator overloading should always be written to behave in the same manner
as with builtin types. `+` should be used for addition, not concatenation. 
`<<` should be used for left bitshift, not to append values to an array 
or print things to stdout.

Violating the expected behaviour of operators is why operator overloading
is often frowned upon despite its usefulness. Operator overloading that
follows expectation can make the code clearer and easier to read. Violating
expectations on the other hand obfuscates the code and makes it harder to
share. It is bad style and poor taste.
:::
