---
title: "A New Memory Management Paradigm"
date: 2025-06-12
author: "Josh Ring"
---

<!-- mem::@assert_leak() -->

## The Temp Allocator

In your programs how many times do the same things repeat? A new web request, a new video game frame a new file to parse etc. Each one of those will allocate temporary variables while they are calculating the final result, those all need to be cleaned up. 

Tradationally RAII, reference counting or garbage collection are used to automatically free those variables. Each one has their own tradeoff, [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) introduces types with implicit behaviour rather than plain data, and [reference counting](https://en.wikipedia.org/wiki/Reference_counting) and [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) require additional runtime CPU work and memory for accounting. 

There is now a new configurable option designed specifically for temporary variables; enter the temporary variable allocator or *temp allocator* for short, and it has language level support in C3 as `@pool(){...}` this defines a scope where the memory allocated using the temp allocator are automatically reset at the end of the `@pool(){...}` scope, for example:
```c
fn int example(int input) 
{
    @pool()
    {
        // Allocate temp_variable on the heap with temp allocator
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
We only create the temp allocator if it is being used, so we don't pay for what we're not using.

### Memory Is Cleaned Up

Memory leaks would typically result if using `malloc()` and forgetting to call `free()` in traditional C and that memory would become unvailable to the program over time. To show that this can't happen we can use the Valgrind tool to analyse for memory leaks:

```bash
valgrind ./pool_example |& grep "All heap blocks were freed"
==129129== All heap blocks were freed -- no leaks are possible
```
**Success!** We have relatively performant memory allocations managed automatically without needing [RAII](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization), [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) or [reference counting](https://en.wikipedia.org/wiki/Reference_counting). There are some tradeoffs made here, but the temp allocator and those tradeoffs are configurable as we will see later.

### Configuring The Temp Allocator

Earlier we mentioned tradeoffs, one such tradeoff is the temp allocator internally has an resizable allocation buffer. This is a configurable tradeoff which you can tailor using a `@pool_init(){...}` context and setting the `pool_size` argument. You can also configure the backing `allocator` which is by default the heap allocator `mem` and the `buffer_size`. 

```c
fn int example(int input)
{
    @pool_init(allocator: mem, pool_size: 16, buffer_size: 16)
    {
        // Allocate temp_variable on the heap 
        int* temp_variable = mem::tnew(int);
        *temp_variable = 56;
        input = input + *temp_variable;
        return input;	
    };
}
```

The `pool_size` by default this is 256KB and using the technique above you can adjust this to suit your application at a granular level, on a per-thread basis.


### Improving The Developer Experience

#### We Can Omit @pool(){...}
Let's make this as simple as possible, we can actually omit the `@pool(){...}` all together! 

The compiler automatically adds a `@pool(){...}` context to the `main()` function for us, once it finds a temp allocation function like `mem::tnew()`, without an enclosing `@pool(){...}` context. That simplifies our code to:

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

#### Handy Shorthand

When configuring the temp allocator with `@pool_init(){...}` we can reduce the code's nesting using lambda function syntax `=>` making it even simpler as:

```c
fn int example(int input) => @pool_init(allocator: mem, pool_size: 16, buffer_size: 16)
{
    // Allocate temp_variable on the heap 
    int* temp_variable = mem::tnew(int);
    *temp_variable = 56;
    input = input + *temp_variable;
    return input;	
}
```

### Conclusion

We showed off the temp allocator, a new memory management technique in C3, with configurable memory tradeoffs and good usability. 

### Want To Dive Into C3?
Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries)

Have questions? Come and chat to us on [Discord](https://discord.gg/qN76R87).