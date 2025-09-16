---
title: Memory Handling
description: Memory Handling
sidebar:
    order: 64
---

Like in C, memory is manually managed in C3. An object can either be passed as a value on the stack, or it can be separately allocated.

```c3
fn void test()
{
    int a = 12;     // This variable is allocated on the stack.
    int b = a;      // This copies the value from a to the stack variable b.
    int[2] c = { 1, 2 };
    int[2] d = c;   // In C3 arrays are values and are copied by value.
    io::printn(d);  // Prints "{ 1, 2 }"
    c[0] = 10;
    io::printn(c);  // Prints "{ 10, 2 }"
    io::printn(d);  // Prints "{ 1, 2 }"
}
```

### Allocating on the heap

The problem with stack allocations is that the length and sizes must be known up front. Imagine if we wanted to create an array with `n` number of entries and return that as a slice.

A first attempt might be:

```c3
const MAX_NUMBER = 100;
<* @require n >= 0 && n <= MAX_NUMBER *>
fn int[] create_array(int n)
{
    int[MAX_NUMBER] arr;
    for (int i = 0; i < n; i++)
    {
        arr[i] = i;
    }
    return arr[:n];  // Error: returns a pointer to a stack allocated variable
}
```

Aside from the problem with having a `MAX_NUMBER`, we can't return a pointer to this array, even as a slice, because the memory where `arr` is stored is returned when the call to `create_array` returns.

The normal solution here is to allocate memory on the heap instead, the code might look like this:

```c3
<* @require n >= 0 *>
fn int[] create_array(int n)
{
    int* arr = malloc(n * int.sizeof);
    for (int i = 0; i < n; i++)
    {
        arr[i] = i;
    }
    return arr[:n]; // Turn the pointer into a slice with length "n"
}
```

This allocates enough memory to hold `n` ints, and returns the result.

The downside is that we must make sure that we release the memory back when we're done:

```c3
fn void test()
{   
    int[] array = create_array(3);
    do_things(array);
    free(array);                   // Release memory back to the OS
}
```

:::note
There are convenience functions in the standard library to allocate arrays on the heap. Use `mem::new_array(int, n)` - zero initialized - or `mem::alloc_array(int, n)` - not initialized - rather than `malloc` directly.  
:::

### Temporary allocations

Having to clean up heap allocations is not always convenient. For example, what if we wanted to do this:

```c3
fn void test_leak()
{   
    do_things(create_array(3)); // What about releasing the memory?
}
```

In this example `do_things` would need to release the data, or we leak memory. But we're just using this temporarily – we always just create it and then delete it. Isn't there any simpler way?

In C3, the solution is using the temporary allocator. Allocation with the temporary allocator is just like with the heap allocator, but it uses the `@pool` macro to flush all temporary allocators deeper down in the call tree:

```c3
fn void some_function()
{
    @pool()
    {
        do_calculations();
    }; 
    // All temporary allocations inside of do_calculations 
    // and deeper down is freed when exiting the `@pool` scope.
}
```

To allocate we use `tmalloc`, which works the same as `malloc`, but uses the temporary allocator.

```c3
<* @require n >= 0 *>
fn int[] create_temp_array(int n)
{
    int* arr = tmalloc(n * int.sizeof);
    for (int i = 0; i < n; i++)
    {
        arr[i] = i;
    }
    return arr[:n];
}

fn void test_temp()
{   
    do_things(create_temp_array(3)); // Creates a temporary array
}

fn void a_function()
{
    @pool()
    {
        test_temp();
        void* date = tmalloc(1000);
    };
    // All temporary memory is released when exiting `@pool()`
}
```

Using single line function body syntax `=>` we can write this even more compact as:

```c3
fn void a_function() => @pool()
{
    test_temp();
    void* date = tmalloc(1000);
}
```

We can even nest `@pool`s:

```c3
fn void nested()
{
    @pool()
    {
        int* a = tmalloc(int.sizeof);
        *a = 123;
        // Only 'a' is valid
        @pool()
        {
            int* b = tmalloc(int.sizeof);
            *b = *a;
            // Both 'b' and 'a' are valid
        };
        // 'b' is relased, only 'a' is valid
        io::printn(*a);
    };
    // 'a' is released
}
```

:::note[Temp allocator pitfalls]

Because temporary allocations are released using `@pool`, you should never pass temporary allocated data to other threads or store them in variables that outlive the `@pool` scope.

The compiler will try to detect using temporary data after free, but the ability to do so depends on whether the code is compiled with safety checks / address sanitizer or not. Support will also differ between OS and architectures.

Always make sure that temporary allocations aren't used beyond the scope of their `@pool`.
:::

### Functions that allocate

Standard library functions that allocate generally require you to pass an allocator. This allows you to use the standard heap allocator, `mem`, the temp allocator `tmem` or some other Allocator you might be using instead:

```c3
List{int} list;
list.init(mem);   // "list" will use the heap allocator
list.push(1);
list.push(42);
io::printn(list); // Prints "{ 1, 42 }"
list.free();      // Free the memory in the list
```

If you are using `mem`, then in general you will need to free it in some way. Either it's built into the type, such as in the `List` example above, or else you will need to handle it yourself, like in this case:

```c3
String s = string::format(mem, "Hello %s", "World");
// The string "s" is allocated on the heap
io::printn(s);
// Prints "Hello World"
free(s);                                  
// Frees the string
```

On the other hand, if you use the temp allocator, you only need to make sure it's wrapped in a `@pool`:

```c3
@pool()
{
   List{int} list;
   list.init(tmem);   // "list" will use the temp allocator
   list.push(1);
   list.push(42);
   io::printn(list);
   
   String s = string::format(tmem, "Hello %s", "World"); 
   io::printn(s);
}; // s and list are freed here, because they used temp memory
```

Because of the usefulness of the temp allocator idiom, there are often temp allocator versions of functions, prefixed "t" or "temp_":

```c3
@pool()
{
   List{int} list;
   list.tinit();                                          // Use the temp allocator
   list.push(1);
   list.push(42);
   
   String s = string::tformat("Hello %s", "World"); // Use the temp allocator
};
```

### Implicit initialization

Some types, such as `List`, `HashMap` and `DString` will use the temp allocator by default if they are not initialized. 

```c3
@pool()
{
   List{int} list;
   list.push(1);   // Implicitly initialize with the temp allocator
   list.push(42);
   
   DString str;                      // DString is a dynamic string
   str.appendf("Hello %s", "World");
   // The "appendf" implicitly initializes "str" with the temp allocator
   str.insert_at(5, ",");            
   str.append("!");
   io::printn(str);                  // Prints Hello, World!
}; // list and str is freed here
```

This is often useful for locals, but in the case of globals, you might want the container
to default use the heap allocator. For most containers there is a `ONHEAP` constant which
allows you to statically initialize globals to use the heap allocator:

```c3
List {int} l = list::ONHEAP {int};
fn void main()
{
    l.push(1); // Implicitly allocates on the heap, not the temp allcator.
}
```

### Beyond allocating raw memory

In C, memory is allocated with plain `malloc` (uninitialized memory) and `calloc` (zero-initialized memory). The C3 standard library provides those, but also additional convenience functions:

#### `new` and `alloc` macros

The `new` and `alloc` macros takes a type and allocates just enough memory for that value. This is often more convenient and clear than `Foo* f = malloc(Foo.sizeof)`.

```c3
Foo* f = mem::new(Foo);    // Returns a zero initialized pointer for a type
int* p = mem::alloc(int);  // Same as 'new' but memory is uninitialized
Foo* t = mem::tnew(Foo);   // Same as 'new' but using the temp allocator
```

`new` and `tnew` also takes an optional initializer, allowing you to allocate and initialize in a single call.
```c3
Foo* f = mem::new(Foo, { 1, 2 });
// Equivalent to:
Foo* f = mem::alloc(Foo);
*f = { 1, 2 };
```

There are also more specialized functions such as `new_with_padding` and `new_aligned`, the former when you need to add additional memory at the end of the allocation, and `new_aligned` for when you have overaligned types – typically vectors with alignment greater than 16.


#### `new_array` and `alloc_array` for creating arrays

```c3
// Returns a pointer to a Foo[3] array, zero initialized
Foo[] arr = mem::new_array(Foo, 3);  
// Same but memory is unitialized
Foo[] a2 = mem::alloc_array(Foo, 3); 
// Same as new_array, but using the temp allocator
Foo[] tarr = mem::temp_array(Foo, 3); 
```

#### `@clone`

`@clone` allows you to take a value and create a pointer copy of it.

```c3
// Creates an int pointer, initialized to 33
int* x = @clone(33);        
// Same as @clone but using the temp allocator
int* y = @tclone(33);       
int[] z = { 1, 2 };
// This clones the elements of a slice or array, in this case "z"
int[] a = @clone_slice(z);  
// Same as @clone_slice, but using the temp allocator
int[] t = @tclone_slice(z);
```

