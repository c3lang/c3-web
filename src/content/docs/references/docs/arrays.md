---
title: Arrays
description: Arrays
sidebar:
    order: 109
---

Arrays has a central role in programming. C3 offers build-in arrays, slices and [vectors](/references/docs/vectors/).
The standard library enhances this further with dynamically sized arrays and other collections.

## Fixed arrays

`<type>[<size>]` e.g. `int[4]`. These are treated as values and will be copied if given as parameter. Unlike C, the number is part of its type. Taking a pointer to a fixed array will create a pointer to a fixed array, e.g. `int[4]*`. 

Unlike C, fixed arrays do not decay into pointers, instead an `int[4]*` may be implicitly converted into an `int*`.


    // C
    int foo(int *a) { ... }
    
    int x[3] = { 1, 2, 3 };
    foo(x);
    
    // C3
    fn int foo(int *a) { ... }

    int x[3] = { 1, 2, 3 };
    foo(&x);


When you want to initialize a fixed array without specifying the size, use the [*] array syntax:

    int[3] a = { 1, 2, 3 };
    int[*] b = { 4, 5, 6 }; // Type inferred to be int[3]

## Slice

The final type is the slice `<type>[]`  e.g. `int[]`. A slice is a view into either a fixed or variable array. Internally it is represented as a struct containing a pointer and a size. Both fixed and variable arrays may be converted into slices, and slices may be implicitly converted to pointers:
    
    int[4] a = { 1, 2, 3, 4};
    int[] b = &a; // Implicit conversion is always ok.
    int[4] c = (int[4])b; // Will copy the value of b into c.
    int[4]* d = (int[4])a; // Equivalent to d = &a
    b.len; // Returns 4
    e += 1;
    int* f = b; // Equivalent to e = &a
    f = d; // implicit conversion ok.

### Slicing arrays

It's possible to use a range syntax to create slices from pointers, arrays and other slicess. They either use range syntax:
`arr[<start index>..<end index>]` (the end index is included in the final result) or start + len syntax: `arr[<start index> : len]`

    
    int[5] a = { 1, 20, 50, 100, 200 };
    int[] b = a[0..4]; // The whole array as a slice.
    int[] b2 = a[0:5]; // Same as above.
    int[] c = a[2..3]; // { 50, 100 }
    int[] c2 = a[2:2]; // Same as above.

It's possible to omit the first and last index in ranges, and the start index for start + len.
Omitting the start index will default it to 0, omitting the end index will set it to the last valid
index (this is not allowed on pointers). Length cannot be omitted in start + len syntax.

The following are all equivalent:

    int[5] a = { 1, 20, 50, 100, 200 };
    int[] b = a[0..4];
    int[] c = a[..4];
    int[] d = a[0..];
    int[] e = a[..];
    int[] f = a[0:5];
    int[] g = a[:5];

One may also slice from the end. Again this is not allowed for pointers.

    int[5] a = { 1, 20, 50, 100, 200 };
    int[] b = a[1..^2]; // { 20, 50, 100 }
    int[] c = a[^3..]; // { 50, 100, 200 }
    int[] d = a[^3:2]; // { 50, 100 }

One may also use assign to slices:

    int[3] a = { 1, 20, 50 };
    a[1..2] = 0; // a = { 1, 0, 0}

Or copy slices to slices:

    int[3] a = { 1, 20, 50 };
    int[3] b = { 2, 4, 5 }
    a[1..2] = b[0..1]; // a = { 1, 2, 4}

Copying overlapping ranges, e.g. `a[1..2] = a[0..1]` is undefined behaviour.

    
### Conversion list

| | int[4] | int[] | int[4]* | int* |
|:-:|:-:|:-:|:-:|:-:|
| int[4] | copy | - | - | - |
| int[] | - | assign | assign | - |
| int[4]* | - | cast | assign | cast |
| int* | - | assign | assign | assign |

Note that all casts above are inherently unsafe and will only work if the type cast is indeed compatible.

For example:

```c3
int[4] a;
int[4]* b = &a;
int* c = b;
// Safe cast:
int[4]* d = (int[4]*)c; 
int e = 12;
int* f = &e;
// Incorrect, but not checked
int[4]* g = (int[4]*)f;
// Also incorrect but not checked.
int[] h = f[0..2];
```

#### Internals

Internally the layout of a slice is guaranteed to be `struct { <type>* ptr; usz len; }`.

There is a built-in struct `std::core::runtime::SubArrayContainer` which has the exact data layout of the fat array pointers. It is defined to be

```c3
struct SubArrayContainer
{
    void* ptr;
    usz len;
}
```

## Iteration over arrays

You may iterate over slices, arrays and vectors using `foreach (Type x : array)`:

```c3
int[4] a = { 1, 2, 3, 5 };
foreach (int x : a)
{
    ...
}
```

Using `&` it is possible to get an element by reference rather than by copy.
Furthermore, by providing two variable name, the first is assumed to be the
index:

```c3
Foo[4] a = { ... };
foreach (int idx, Foo* &f : a)
{
    f.abc = idx; // Mutates the array element
}
```
It is possible to enable foreach on any type 
by implementing "len" and "[]" methods and annotating them using the `@operator` attribute:

```c3
struct DynamicArray
{
    usz count;
    usz capacity;
    int* elements;
}

macro int DynamicArray.get(DynamicArray* arr, usz element) @operator([])
{
    return arr.elements[element];
}

macro usz DynamicArray.count(DynamicArray* arr) @operator(len)
{
    return arr.count;
}

fn void DynamicArray.push(DynamicArray* arr, int value)
{
    arr.ensure_capacity(arr.count + 1);  // Function not shown in example.
    arr.elements[arr.count++] = value;
}

fn void test()
{
    DynamicArray v;
    v.push(3);
    v.push(7);

    // Will print 3 and 7
    foreach (int i : v)
    {
        io::printfn("%d", i);
    }
}
```

For more information, see [operator overloading](/references/docs/operators)

## Dynamic arrays and lists

The standard library offers dynamic arrays and other collections in the `std::collections` module.

```c3
fn void test()
{
    List(<String>) list;
    list.new_init();     // Initialize the list on the heap.
    list.push("Hello");  // Add the string "Hello"
    list.push("World");
    foreach (s : list)
    {
        io::printn(s);   // Prints "Hello", then "World"
    }
    String s = list[1]; // s is "World"
    list.free();        // Free all memory associated with list.
}
```

