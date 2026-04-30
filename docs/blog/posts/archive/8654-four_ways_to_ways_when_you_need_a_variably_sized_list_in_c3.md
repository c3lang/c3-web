---
title: "Four ways to ways when you need a variably sized list in C3"
date: 2023-02-18
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8654-four_ways_to_ways_when_you_need_a_variably_sized_list_in_c3](https://c3.handmade.network/blog/p/8654-four_ways_to_ways_when_you_need_a_variably_sized_list_in_c3)*

In this blog post we'll review four standard ways to handle the case when you need a list with a size which is only known at runtime.

## Use a generic List allocated on the heap

```
import std::io;
import std::collections::list;

// We create a generic List that holds doubles:
define DoubleList = List(<double>);

fn double test_list_on_heap(int len)
{
  DoubleList list;   // By default will allocate on the heap
  defer list.free(); // Free memory at exit with a defer statement.
  for (int i = 0; i < len; i++)
  {
    // Append each element
    list.push(i + 1.0); 
  }
  double sum = 0;
  foreach (d : list) sum += d;
  return sum;
}
```

We can use `list.init(len)` if we have some default length in mind,
otherwise it's not necessary.

## Use a generic List allocated with the temp allocator

Here we instead use the temp allocator to allocate and manage memory.
The `@pool() { ... }` construct will release all temporary allocations
inside of the body block.

```
fn double test_list_on_temp_allocator(int len)
{
  @pool()
  {
    DoubleList list;
    list.temp_init();   // Init using the temp allocator
    for (int i = 0; i < len; i++)
    {
      list.push(i + 1.0);
    }
    double sum = 0;
    foreach (d : list) sum += d;
    // No need to free explicitly!
    return sum;
  };
}
```

## Allocate an array on the heap

This is the conventional way to do it in C if the length is unknown. Note
how we can use `defer` to write the allocation and the free together
to avoid forgetting freeing if there are multiple exits.

```
fn double test_array_on_heap(int len)
{
  double[] arr = mem::new_array(double, len);
  defer free(arr); // Free at function exit.
  for (int i = 0; i < len; i++)
  {
    arr[i] = i + 1.0;
  }
  double sum = 0;
  foreach (d : arr) sum += d;
  return sum;
}
```

## Allocate an array on the temp allocator

Using the temp allocator is as close to doing allocations for free if we need
arbitrarily long lists:

```
fn double test_array_on_temp_allocator(int len)
{
  @pool()
  {
    // The array will be released when exiting `pool()`
    double[] arr = mem::temp_array(double, len); 
    for (int i = 0; i < len; i++)
    {
      arr[i] = i + 1.0;
    }
    double sum = 0;
    foreach (d : arr) sum += d;
    return sum;
  };
}
```

## Summary

We looked at four standard ways to use arbitrarily long lists in C3.
Two of them used a growable list, which is important if you might not
know the exact length in advance. The other two use simple arrays.

This also contrasted using the temp allocator with the heap allocator. In
a later blog post I'll discuss the allocators in more detail.

A gist with the full code can be found [here](https://gist.github.com/lerno/36c6d404da3a8221915dee68ec521bb7).

## Comments


---
### Comment by Christoffer Lernö

In this blog post we'll review four standard ways to handle the case when you need a list with a size which is only known at runtime.

## Use a generic List allocated on the heap

```
import std::io;
import std::collections::list;

// We create a generic List that holds doubles:
define DoubleList = List(<double>);

fn double test_list_on_heap(int len)
{
  DoubleList list;   // By default will allocate on the heap
  defer list.free(); // Free memory at exit with a defer statement.
  for (int i = 0; i < len; i++)
  {
    // Append each element
    list.push(i + 1.0); 
  }
  double sum = 0;
  foreach (d : list) sum += d;
  return sum;
}
```

We can use `list.init(len)` if we have some default length in mind,
otherwise it's not necessary.

## Use a generic List allocated with the temp allocator

Here we instead use the temp allocator to allocate and manage memory.
The `@pool() { ... }` construct will release all temporary allocations
inside of the body block.

```
fn double test_list_on_temp_allocator(int len)
{
  @pool()
  {
    DoubleList list;
    list.temp_init();   // Init using the temp allocator
    for (int i = 0; i < len; i++)
    {
      list.push(i + 1.0);
    }
    double sum = 0;
    foreach (d : list) sum += d;
    // No need to free explicitly!
    return sum;
  };
}
```

## Allocate an array on the heap

This is the conventional way to do it in C if the length is unknown. Note
how we can use `defer` to write the allocation and the free together
to avoid forgetting freeing if there are multiple exits.

```
fn double test_array_on_heap(int len)
{
  double[] arr = mem::new_array(double, len);
  defer free(arr); // Free at function exit.
  for (int i = 0; i < len; i++)
  {
    arr[i] = i + 1.0;
  }
  double sum = 0;
  foreach (d : arr) sum += d;
  return sum;
}
```

## Allocate an array on the temp allocator

Using the temp allocator is as close to doing allocations for free if we need
arbitrarily long lists:

```
fn double test_array_on_temp_allocator(int len)
{
  @pool()
  {
    // The array will be released when exiting `pool()`
    double[] arr = mem::temp_array(double, len); 
    for (int i = 0; i < len; i++)
    {
      arr[i] = i + 1.0;
    }
    double sum = 0;
    foreach (d : arr) sum += d;
    return sum;
  };
}
```

## Summary

We looked at four standard ways to use arbitrarily long lists in C3.
Two of them used a growable list, which is important if you might not
know the exact length in advance. The other two use simple arrays.

This also contrasted using the temp allocator with the heap allocator. In
a later blog post I'll discuss the allocators in more detail.

A gist with the full code can be found [here](https://gist.github.com/lerno/36c6d404da3a8221915dee68ec521bb7).