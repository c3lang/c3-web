---
title: "Memory Regions A New Old Idea"
date: 2025-07-09
author: "Josh Ring"
---

For us to talk about managing memory in a language we need to establish some context.

## Computer Memory

Broadly there are two types of memory allocation in your programs, the stack and the heap. 

### The Stack

Allocation on the [stack](https://en.wikipedia.org/wiki/Stack_register) is automatically managed, but limited in size typically 512KB – 8MB depending on the platform.

### The Heap

Allocation on the heap is [manually managed](https://en.wikipedia.org/wiki/Memory_management) and can support larger allocations up to several GB in size depending on your hardware specs.

### Memory Leaks

When we allocate memory, with say `malloc()` typically we need to `free()` it afterwards, otherwise we can't use that memory until the OS process exits. This is called a [memory leak](https://en.wikipedia.org/wiki/Memory_leak) and can lead to restricting or running out of available system memory when they happen in longer running processes like games, operating systems and web browsers.

### Avoiding Memory Leaks

Common solutions are [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization), [reference counting](https://en.wikipedia.org/wiki/Reference_counting) or [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) which automatically free those variables. 

Each method has different tradeoffs. 
- [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) needs classes or structs to manage their own memory cleanup with a lot of extra code.
- [Reference counting](https://en.wikipedia.org/wiki/Reference_counting) counts how many users each memory allocation has, when this hits zero the memory is freed. Reference counting is expensive with multiple CPU cores as we need to synchronise these counts and share information between cores.
- [Garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) competes with the program for both memory and CPU time reducing program performance and increaing memory usage.


## Memory Allocation Regions

Memory allocation regions, go by various names: arenas, pools, contexts; The idea dates back to the 1960's with the IBM OS/360 mainframes having a similar system. Memory regions are efficient for managing many memory allocations and can be freed in a single operation, and are particularly effective when we know the memory will not be needed later. That is, we know the memory's lifetime. This idea is powerful and used in many applications like web server request handlers or database transactions, as used by the [Apache webserver](https://httpd.apache.org/) and the [Postgres database](https://www.postgresql.org/). 

Memory allocation regions use a single buffer so have good locality because all the allocation are closely associated together, making it more efficient for CPU access, compared to traditional `malloc` where allocations are spread throughout the heap.

Memory allocation regions may make it easier to manage memory, however you still need to *remember* to free them, and if you forget to do call free, then that memory will still leak.

### Enter The Temp Allocator

The Temp allocator in C3 is a region based allocator which is *automatically* reset once execution leaves it's scope, so you cannot forget to free the memory and can't leak memory. The Temp allocator in C3 is a builtin in the standard library, called `@pool()` and using it you can define the scope where the allocated variables are available, for example:

```c
fn int example(int input) 
{
    @pool()
    {
        // Allocate temp_variable on the heap with Temp allocator
        int* temp_variable = mem::tnew(int);
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

### Check With Valgrind

Valgrind is a tool which detects memory leaks and we can use it to show the temp allocator managed the memory for us automatically.

```bash
valgrind ./pool_example |& grep "All heap blocks were freed"
==129129== All heap blocks were freed -- no leaks are possible
```
### Success!
We have relatively performant memory allocations managed automatically without needing [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization), [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) or [reference counting](https://en.wikipedia.org/wiki/Reference_counting). 


## Controlling Variable Cleanup

Normally temp allocated variables are cleaned up at the end of the closest `@pool` scope, but what if you have nested `@pool` and want explicit control over when it's cleaned up? Assign the temp allocator with the scope you need to a variable, and use it explicitly. The temp allocator in a scope is a global variable called `tmem`.
 
```c
fn String* example(int input)
{
    // global temp allocator from main() scope
    Allocator temp_allocator = tmem;

    @pool()
    {
        // Allocate on the global temp allocator
        String* returned = allocator::new(temp_allocator, String);
        *returned = string::format(temp_allocator, "modified %s", input);
        return returned;
    };
}

fn void main()
{
    // global temp allocator, tmem created here
    @pool()
    {
        String* returned = example(42);
        // "modified 42" string returned
        io::printn(*returned);
    };
}
```

### A Handy Shorthand

We can reduce the code's nesting using short function declaration syntax `=>` making it even simpler as:

```c
fn int example(int input) => @pool(reserve: 2048)
{
    // Allocate temp_variable on the heap 
    int* temp_variable = mem::tnew(int);
    *temp_variable = 56;
    input = input + *temp_variable;
    return input;
}
```

### In Simple Cases Omit @pool()
Happy with the defaults? We can actually omit the `@pool()` all together!

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

## Conclusion

We showed off the temp allocator, a new memory management technique in C3, with configurable memory tradeoffs and good usability. 

## Want To Dive Into C3?
Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries)

Have questions? Come and chat to us on [Discord](https://discord.gg/qN76R87).


