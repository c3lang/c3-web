---
title: Memory
description: A guide to computer memory.
sidebar:
    order: 101
---

## Why Is Memory Important?
Memory is the slowest part of a modern computer, [optimising memory is key to system performance](#optimising-memory-is-key-to-performance). Memory is also the key to a large number of security vulnerabilities, [memory safety](#memory-safety) is a way to combat those vulnerabilities.

## Memory Safety
Memory safety is about preventing unwanted memory accesses, for example by accessing data beyong the length of an array, or using a memory pointer after the memory has been freed. 

### Methods To Achieve Memory Safety

- Safe array access patterns like `foreach` which have knowledge of the array's length so cannot iterate beyond it's bounds. 
```c3
int[4] arr = { 1, 7, 3, 5 };
foreach(idx, item : arr)
{
    io::printfn("index: %d item: %s", idx, item);
}
```

- Safe subarray creation using "slices", which are created with knowledge of the array's length, so cannot create subarrays beyond the array bounds, for example:

```c3
int[4] array = {1, 2, 3, 4};
int[] slice = array[0..2];  // {1, 2, 3}
int[] slice = array[0..88]; // A compile error
```

- Automatic memory cleanup inside of `@pool` scope using the temporary allocator, for example:

```c3
@pool()
{
    void* some_mem = talloc(128);
    foo(some_mem);
};
// Temporary allocations are automatically freed here.
```



## Optimising Memory Is Key To Performance

Data is searched for in the order of L1, L2, L3 then RAM. Since L1 cache is the most efficient it dominates CPU performance.

To optimise what is in the fast CPU caches, less accessed data is moved over time, to progressively slower caches in the same order; L1 to L2, then to L3.

Data is fetched from RAM to L1 cache in 64B cache line chunks.

#### Memory Speed

| Memory Type   | Relative Access Time To L1 | CPU Clock Cycles @4GHz |
|---------------|----------------------------|------------------------|
| L1            | x1    | 8     |
| L2            | x5    | 40    |
| L3            | x10   | 80    |
| DDR4/5 RAM    | x45   | 360   | 


#### Memory Capacity

| Memory Type   | Size  | Size In Cache Lines   |
|---------------|-------|-----------------------|
| L1            | 64KB  | 1024                  |
| L2            | 512KB | 8192                  |
| L3            | 2MB   | 32768                 |
| RAM           | 16GB  | 262144                | 


### Performance Implications
How efficiently data fits into 64B cache lines is crucial for modern CPU performance, since it reduces the chance we have to fetch additional data from slower caches or RAM. The two key factors for performance are the memory layout of the individual data structure, and the locality of the data structures in memory. 

Inside densely packed data structures like arrays items are more often prefetched together, iterating arrays is also easily predicted by the CPU, giving good performance. A counter example would be a traditional linked list where the items are related by pointers and are spread throughout the heap and have a very low probability of being prefected together.

The next section discusses the performance impact of the memory layout of a `s data structurestruct`.

#### Struct Memory Alignment
Not all `struct` are equally efficient, you can get significant throughput gains and memory usage reductions by optimising the `struct` memory layout. A `struct` has "alignment" in memory, the biggest struct member typically decides this alignment (unless you manually override it). For example:

In this example `Foo` is 8 byte aligned because it's biggest member is 8 bytes. This means that memory is arranged into 8 byte linear chunks, and `struct` members are packed into these chunks sequentially and any remainder is filled with "padding" up to the next 8 byte alignment.

```c3
// Foo.sizeof is 24 bytes
// Foo.alignof is 8 bytes
struct Foo {
    bool a;   // sizeof 1 bytes
    double b; // sizeof 8 bytes
    int c;    // sizeof 4 bytes
}
```

| `struct Foo` Member | Sizeof | Memory Index | 8 Byte Chunk Index |
|---------------------|--------|--------------|--------------------|
| a         | 1       | 0      | 0    |
| *padding* | **7**   | 1 – 7  | 0    |
| b         | 8       | 8 – 15 | 1    |
| c         | 4       | 16 – 19 | 2   |
| *padding* | **4**   | 20 – 23 | 2   |

This is a lot of padding! We can save 50% of the memory, and boost our L1 cache throughput if we rearrange the `struct` members moving `Foo.a` to the end of the `struct`, for example:

```c3
// Bar.sizeof is 16 bytes
// Bar.alignof is 8 bytes
struct Bar {   
    double b; // sizeof 8 bytes
    int c;    // sizeof 4 bytes
    bool a;   // sizeof 1 bytes
}
```

| `struct Bar` Member | Sizeof | Memory Index | 8 Byte Chunk Index |
|---------------------|--------|--------------|--------------------|
| b         | 8       | 0 – 7       | 0                     |
| c         | 4       | 8 – 11      | 1                     |
| a         | 1       | 12          | 1                     |
| *padding* | **3**   | 13 – 15     | 1                     |


A complete example for your experimentation:

```c3
import std::io;

// Foo.sizeof is 24 bytes
// Foo.alignof is 8 bytes
struct Foo 
{
    bool a;   // sizeof 1 bytes
    double b; // sizeof 8 bytes
    int c;    // sizeof 4 bytes
}

// Bar.sizeof is 16 bytes
// Bar.alignof is 8 bytes
struct Bar 
{   
    double b; // sizeof 8 bytes
    int c;    // sizeof 4 bytes
    bool a;   // sizeof 1 bytes
}

fn void main() 
{
    io::printfn("Foo.sizeof: %sB", Foo.sizeof);
    io::printfn("Foo.alignof: %sB", Foo.alignof); 

    io::printfn("Bar.sizeof: %sB", Bar.sizeof); 
    io::printfn("Bar.alignof: %sB", Bar.alignof); 

    float cache_line_size = 64; // bytes
    
    float foo_per_cache_line = cache_line_size / Foo.sizeof;
    io::printfn("Foo %3.2f per 64B cache line",  foo_per_cache_line);

    float bar_per_cache_line = cache_line_size / Bar.sizeof;
    io::printfn("Bar %3.2f per 64B cache line",  bar_per_cache_line);
}
```

## Arrays

```c3
fn void main()
{
    double[5] arr = {0.0, 1.1, 2.2, 3.3, 4.4};
    io::printfn("arr: %s", arr);
    io::printfn("arr.sizeof %s", $sizeof(arr));

    // pointer to an array is a pointer to the first element
    io::printfn("%s", &arr == &arr[0]);

    // ever wondered why array indexes start from zero?
    // Or wondered what the indexing of an array was doing under the hood?
    io::printfn("%s", arr[4]);
    io::printfn("%s", *((double*)((void*)&arr + 4*double.sizeof)) );

    // lets break that down
    // take the address of the first element of the array
    // We use void* so we can manipulate the address
    void* arr_ptr = (void*)&arr;

    // to select index 4, we increment the arr_ptr by the sizeof 4 double elements
    arr_ptr = arr_ptr + 4*double.sizeof;

    // interpret the data at this address as a pointer to a double
    // then dereference (take the value out)
    double arr_4 =  *(double*)arr_ptr;
    io::printfn("arr[4] == %s   arr_4 == %s", arr[4], arr_4);
}
```


A specific application, format or protocol may require a particular array element alignment
wrap the double with an aligned struct and make an array of those

```c3
struct Aligned16 @align(16) 
{   
    double a;
}

fn void main()
{
    Aligned16[5] arr_16 = {{0.0}, {1.1}, {2.2}, {3.3}, {4.4}};
    io::printfn("arr_16: %s", arr_16);

    io::printfn("arr_16.sizeof %s", $sizeof(arr_16)); // 80 bytes

    // in contrast to 40 bytes earlier with default alignment of 8
    double[5] arr = {0.0, 1.1, 2.2, 3.3, 4.4};
    io::printfn("arr.sizeof %s", $sizeof(arr)); // 40 bytes
}
```