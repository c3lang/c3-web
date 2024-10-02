---
title: Pointers
description: A guide to using pointers.
sidebar:
    order: 101
---



A pointer points to a variable's address in memory. This may be memory on the stack or heap.

## Pointers And Arrays

A pointer to an array will always point to the first element, for example:

```c3
fn void main()
{
    int[2] array = {1, 2}; 
    assert( &array == &array[0] );
}
```

## Pointers And Struct

```c3
struct Foo {
    int a;
    int b;
}

fn void main()
{
    Foo f = { .a = 10, .b = 20 };
    io::printfn("equal? %s", (void*)&f == (void*)&f.a); // True
}
```

Iluvme — Today at 12:17
oh so pointing to an element inside of it, its the same as pointing to the struct directly ?

Caleb — Today at 12:18
The first item though
[12:18]
Like an array, a struct is just a chunk of data
So pointing to the struct is the same as pointing to its first field

```c3
struct Foo {
    int a;
    int b;
}

fn void main()
{
    Foo f = { .a = 10, .b = 20 };

    io::printfn("equal? %s", (void*)&f == (void*)&f.a); // true
    io::printfn("equal? %s", (void*)&f == (void*)&f.b); // false
    io::printfn("equal? %s", (void*)&f + int.sizeof == (void*)&f.b); // true
}

```


<!-- Experiment with the sizeof struct with bool at the start vs the end

struct Foo {
    int a;
    int b;
    bool c;
}
struct Bar {
    bool c;
    int a;
    int b;
}

fn void main() 
{
    io::printfn("sizeof Foo: %s", $sizeof(Foo));
    io::printfn("sizeof Bar: %s", $sizeof(Bar));
} -->



/////////////////////////////////////


Ok, and so pointers to array will always point to the first element right
[12:11]
so &array is equal to &array[0] (edited)

Caleb — Today at 12:12
yes
NEW

Iluvme — Today at 12:12
ok ok
[12:12]
hhmhm then not my issue

Caleb — Today at 12:14
Same thing with structs:
struct Foo {
    int a;
    int b;
}

fn void main(){
    Foo f = { 10, 20 };
    io::printfn("equal? %s", (void*)&f == (void*)&f.a); // True
}

Iluvme — Today at 12:17
oh so pointing to an element inside of it, its the same as pointing to the struct directly ?

Caleb — Today at 12:18
The first item though
[12:18]
Because like an array, a struct is just a chunk of data
So pointing to the struct is the same as pointing to its first field


io::printfn("equal? %s", (void*)&f == (void*)&f.a); // true
io::printfn("equal? %s", (void*)&f == (void*)&f.b); // false
io::printfn("equal? %s", (void*)&f + int.sizeof == (void*)&f.b); // true



Experiment with the sizeof struct with bool at the start vs the end

struct Foo {
    int a;
    int b;
    bool c;
}
struct Bar {
    bool c;
    int a;
    int b;
}

fn void main() 
{
    io::printfn("sizeof Foo: %s", $sizeof(Foo));
    io::printfn("sizeof Bar: %s", $sizeof(Bar));
}