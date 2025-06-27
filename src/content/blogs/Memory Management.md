---
title: "A New Memory Management Paradigm"
date: 2025-06-12
author: "Josh Ring"
---

## Context: Computer Memory

Broadly there are two types of memory allocation in your programs, the stack and the heap. 

### The Stack

Allocation on the [stack](https://en.wikipedia.org/wiki/Stack_register) uses super fast [CPU registers](https://en.wikipedia.org/wiki/CPU_cache) and this memory is automatically managed, but very limited in size typically around 64KB.

### The Heap

Allocation on the heap uses system main memory, which is 100 times slower than the stack and between 4KB to typically several GB in size. The heap has to be managed by the program and is often called [dynamic memory allocation](https://en.wikipedia.org/wiki/Memory_management), because it's managed at runtime. 

### Memory Leaks

When we allocate memory, with say `malloc()` typically we need to `free()` it afterwards, otherwise we can't use that memory until the OS process exits. This is called a [memory leak](https://en.wikipedia.org/wiki/Memory_leak) and can lead to restricting or running out of available system memory when they happen in longer running processes like games, operating systems and web browsers.

### Avoiding Memory Leaks

Common solutions are [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization), [reference counting](https://en.wikipedia.org/wiki/Reference_counting) or [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) which automatically free those variables. 

Each method has different tradeoffs. 
- [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) needs classes or structs to manage their own memory cleanup with a lot of extra code.
- [Reference counting](https://en.wikipedia.org/wiki/Reference_counting) counts how many users each memory allocation has, when this hits zero the memory is freed. Reference counting is expensive with multiple CPU cores as we need to synchronise these counts and share information between cores.
- [Garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) competes with the program for both memory and CPU time reducing program performance and increaing memory usage.


## Memory Allocation Regions

Memory allocation regions, go by various names: arenas, pools, contexts; they are efficient for managing many memory allocations and can be freed in a single operation, they are particularly effective when we know the memory will not be needed later. That is, we know the memory's lifetime. This idea is powerful in many applications like web servers receiving requests or database starting transactions, as used by the [Apache webserver](https://httpd.apache.org/) and the [Postgres database](https://www.postgresql.org/).

Memory allocation regions make it easier to manage memory because after you create the region you can allocate as many times as you have capacity for, and only need to free it once. However you still need to remember to free them, and if you forget to do that free, then that memory will leak.

### Enter The Temp Allocator

The Temp allocator in C3 is a region based allocator which is automatically reset once execution leaves it's scope, so you cannot forget to free the memory and can't leak memory. The Temp allocator has builtin support in C3 as `@pool()` and using it you can define the scope where the allocated variables are available, for example:

```c
fn int example(int input) 
{
    @pool()
    {
        // Allocate temp_variable on the heap with Temp allocator
        int temp_variable = mem::tnew(int);
        temp_variable = 56;
        input = input + temp_variable;
        return input;
    }; // Automatically cleanup temp_variable
} 

fn void main()
{
    int result = example(1);
    assert(result == 57, "The result should be 57");
}
```

### Investigate With Valgrind

Valgrind is a tool which detects memory leaks and we can use it to show the temp allocator managed the memory for us automatically.

```bash
valgrind ./pool_example |& grep "All heap blocks were freed"
==129129== All heap blocks were freed -- no leaks are possible
```
### Success!
We have relatively performant memory allocations managed automatically without needing [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization), [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) or [reference counting](https://en.wikipedia.org/wiki/Reference_counting). There are some tradeoffs made here, but the temp allocator and those tradeoffs are configurable as we will see later.

### In Simple Cases Omit @pool()
Let's make this as simple as possible, we can actually omit the `@pool()` all together! 

The compiler automatically adds a `@pool()` scope to the `main()` function for us, once it finds a temp allocation function like `mem::tnew()`, without an enclosing `@pool()` scope. That simplifies our code to:

```c
fn int example(int input)
{
    // Allocate temp_variable on the heap
    // @pool() temp allocator created for us by the compiler
    int* temp_variable = mem::tnew(int);
    *temp_variable = 56;
    input = input + *temp_variable;
    return input;
}
```


## How The Temp Allocator Works


C3 has [trailing body macros](/generic-programming/macros/#trailing-blocks-for-macros) which automate the setting up and freeing of the arena allocator used inside the temp allocator.

The temp allocator uses an arena allocator internally and when that's full it manages heap allocations via a linked list.
 
![pool allocator as it fills up](/blogs/memory-management/pool_allocator.jpg)

With a single memory allocation region we have to wait till the end of the scope to reset the memory, which might mean we need a bigger than strictly necessary memory allocation. 

![pool allocator as it fills up](/blogs/memory-management/arena_capacity_single.jpg)

### Nested Allocators For More Control

![pool allocator as it fills up](/blogs/memory-management/nested_allocators.jpg)


Using nested allocators we can reset the arena memory that we have finished using, before reaching the end of the temp allocator's scope. Nested allocators are also automatically managed but give us greater control, if used for appropriately sized regions this can reduce peak memory usage and allow smaller buffer sizes.

![pool allocator as it fills up](/blogs/memory-management/arena_capcity_multiple.jpg)

### Configuring The Temp Allocator

The design of the temp allocator is flexible, so you can configure it to make the tradeoffs which suit your application. The default settings should be fine for most use-cases, but when you need to tweak the settings you can control the temp allocator via `@pool_init` adjusting:

- `allocator` inside the temp allocator, uses heap allocator `mem` by default.
- `pool_size` of the parent temp allocator in bytes.
- `reserve_size` is the default size for a `@pool` without config.
- `min_size` is the minimum size a nested allocator needs, if there's less than this amount left in the temp allocator buffer, we'll need to make a new temp allocator of size `realloc_size`. If `min_size` is too small we will fallback to heap allocations too often. If `min_size` is too large, we will need to reallocate new temp allocators too often.
- `realloc_size` when we've filled up the temp allocator and don't have space to add a `min_size` nested allocator, we create a new temp allocator of size `realloc_size` bytes. We can then add the existing allocations into that temp allocator along with the new nested allocator. 


```c
fn int example(int input)
{
    @pool_init(
        allocator: mem, 
        pool_size: 1024, 
        reserve_size: 512,
        min_size: 256
        realloc_size: 8192
    )
    {
        // Allocate temp_variable on the heap 
        int* temp_variable = mem::tnew(int);
        *temp_variable = 56;
        input = input + *temp_variable;
        return input;
    };
}
```

### A Handy Shorthand

When configuring the temp allocator with `@pool_init()` we can reduce the code's nesting using lambda function syntax `=>` making it even simpler as:

```c
fn int example(int input) => @pool_init(allocator: mem, pool_size: 1024)
{
    // Allocate temp_variable on the heap 
    int* temp_variable = mem::tnew(int);
    *temp_variable = 56;
    input = input + *temp_variable;
    return input;
}
```


## Conclusion

We showed off the temp allocator, a new memory management technique in C3, with configurable memory tradeoffs and good usability. 

## Want To Dive Into C3?
Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries)

Have questions? Come and chat to us on [Discord](https://discord.gg/qN76R87).


