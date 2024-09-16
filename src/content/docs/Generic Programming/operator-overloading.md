---
title: Operator Overloading
description: Operator Overloading
sidebar:
    order: 81
---

C3 allows some *limited* operator overloading for working with containers. 

## "Element at" operator []

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

It's possible to use any type as argument, such as a string:

```c3
fn double Bar.get(&self, String str) @operator([])
{
    return self.get_val_by_key(str);
}
```

Only a single [] overload is allowed.

## "Element ref" operator &[]

Similar to [], the operator returns a value for `&my_type[<value>]`, which may
be retrieved in a different way. If this overload isn't defined, then `&my_type[<value>]` would
be a syntax error.

```c3
fn double* Foo.get_ref(&self, usz i) @operator(&[])
{
    return &self.x[i];
}
```

## "Element set" operator []=

The counterpart of [] allows setting an element using `my_type[<index>] = <value>`.

```c3
fn void Foo.set(&self, usz i, double new_val) @operator([]=)
{
    return self.x[i] = new_val;
}
```

## "len" operator

Unlike the previous operator overloads, the "len" operator simply enables functionality
which augments the `[]`-family of operators: you can use the "from end" syntax e.g `my_type[^1]` 
to get the last element assuming the indexing uses integers.

## Enabling 'foreach'

In order to use a type with foreach, e.g. `foreach(d : foo)`, at a minimum `[]` and `len` need to
be implemented. If `&[]` is implemented, foreach by reference is enabled (e.g. `foreach(double* &d : foo)`)

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

:::note

Operator overloading is limited, by design, as these features delivered the most value while still keeping the language as simple as possible.

:::