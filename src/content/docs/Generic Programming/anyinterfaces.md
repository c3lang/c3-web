---
title: Interfaces and Any Type
description: Interfaces and Any Type
sidebar:
    order: 80
---

## Working with the type of `any` at runtime.

The `any` type is recommended for writing code that is polymorphic at runtime where macros are not appropriate.
It can be thought of as a typed `void*`.

An `any` can be created by assigning any pointer to it. You can then query the `any` type for the typeid of
the enclosed type (the type the pointer points to) using the `type` field.

This allows switching over the typeid, using a normal switch:

```c3
switch (my_any.type)
{
    case Foo.typeid:
        ...
    case Bar: // .typeid can be elided
        ...
}
```

Sometimes one needs to manually construct an any-pointer, which
is typically done using the `any_make` function: `any_make(ptr, type)`
will create an `any` pointing to `ptr` and with typeid `type`.

Since the runtime `typeid` is available, we can query for any runtime `typeid` property available
at runtime, for example the size, e.g. `my_any.type.sizeof`. This allows us to do a lot of work
on with the enclosed data without knowing the details of its type.

For example, this would make a copy of the data and place it in the variable `any_copy`:
```c3
void* data = malloc(a.type.sizeof);
mem::copy(data, a.ptr, a.type.sizeof);
any any_copy = any_make(data, a.type);
```

## Variable argument functions with implicit `any`

Regular typed vaargs are of a single type, e.g. `fn void abc(int x, double... args)`.
In order to take variable functions that are of multiple types, `any` may be used.
There are two variants:

### Explicit `any` vararg functions

This type of function has a format like `fn void vaargfn(int x, any... args)`. Because only
pointers may be passed to an `any`, the arguments must explicitly be pointers (e.g. `vaargfn(2, &b, &&3.0)`).

While explicit, this may be somewhat less user-friendly than implicit vararg functions:

### Implicit `any` vararg functions

The implicit `any` vararg function has instead a format like `fn void vaanyfn(int x, args...)`.
Calling this function will implicitly cause taking the pointer of the values (so for
example in the call `vaanyfn(2, b, 3.0)`, what is actually passed are `&b` and `&&3.0`).

Because this passes values implicitly by reference, care must be taken *not* to mutate any
values passed in this manner. Doing so would very likely break user expectations.

## Interfaces

Most statically typed object-oriented languages implement extensibility using virtual pointer tables (vtables). In C, and by extension
C3, this is possible to emulate by passing around structs containing a pointer to a list of function pointers in addition to the data.

While this is efficient and often the best solution, it puts certain assumptions on the code and makes interfaces
more challenging to evolve over time.

As an alternative there are languages (such as Objective-C) which instead use message passing to dynamically typed
objects, where the availability of functionality may be queried at runtime.

C3 provides this latter functionality over the `any` type using *interfaces*.

### Defining an interface

The first step is to define an interface:

```c3
interface MyName
{
    fn String myname();
}
```

While `myname` will behave as a method, we declare it without a type. Note here that unlike normal methods we leave
out the first "self" argument.

### Implementing the interface

To declare that a type implements an interface, add it after the type name:

```c3
struct Baz (MyName)
{
    int x;
}

// Note how the first argument differs from the interface.
fn String Baz.myname(Baz* self) @dynamic
{
    return "I am Baz!";
}
```

If a type declares an interface but does not implement its methods then that is a compile time error.
A type may implement multiple interfaces by placing them all inside of `()`, e.g. `struct Foo (VeryOptional, MyName) { ... }`.

A limitation is that only user-defined types may declare they are implementing interfaces. To make existing types
implement interfaces is possible but does not provide compile time checks.

One of the interfaces available in the standard library is Printable, which contains `to_format` and `to_new_string`.
If we implemented it for our struct above it might look like this:

```c3
fn String Baz.to_new_string(Baz baz, Allocator allocator) @dynamic
{
    return string::printf("Baz(%d)", baz.x, allocator: allocator);
}
```

### `@dynamic` methods

A method must be declared `@dynamic` to implement an interface, but a method may also be declared `@dynamic` *without* the type declaring it implementing a particular interface. For example, this allows us to write:

```c3
// This will make "int" satisfy the MyName interface
fn String int.myname(int*) @dynamic
{
    return "I am int!";
}
```

`@dynamic` methods have their reference retained in the runtime code and can also be searched for at runtime and invoked
from the `any` type.

### Referring to an interface by pointer

An interface, e.g. `MyName`, can be cast back and forth to `any`, but only types which
implement the interface completely may implicitly be cast to the interface.

So for example:

```c3
Bob b = { 1 };
double d = 0.5;
int i = 3;
MyName a = &b;          // Valid, Bob implements MyName.
// MyName c = &d;       // Error, double does not implement MyName.
MyName c = (MyName)&d;  // Would break at runtime as double doesn't implement MyName
// MyName z = &i;       // Error, implicit conversion because int doesn't explicitly implement it.
MyName* z = (MyName)&i; // Explicit conversion works and is safe at runtime if int implements "myname"
```

### Calling dynamic methods

Methods implementing interfaces are like normal methods, and if called directly, they are just normal function calls. The
difference is that they may be invoked through the interface:

```c3
fn void whoareyou(MyName a)
{
    io::printn(a.myname());
}
```

If we have an optional method we should first check that it is implemented:

```c3
fn void do_something(VeryOptional z)
{
    if (&z.do_something)
    {
        z.do_something(1, null);
    }
}
```

We first query if the method exists on the value. If it does we actually run it.

Here is another example, showing how the correct function will be called depending on type, checking
for methods on an `any`:

```c3
fn void whoareyou2(any a)
{
    // Query if the function exists
    if (!&a.myname)
    {
        io::printn("I don't know who I am.");
        return;
    }
    // Dynamically call the function
    io::printn(((MyName)a).myname());
}

fn void main()
{
    int i;
    double d;
    Bob bob;

    any a = &i;
    whoareyou2(a); // Prints "I am int!"
    a = &d;
    whoareyou2(a); // Prints "I don't know who I am."
    a = &bob;
    whoareyou2(a); // Prints "I am Bob!"
}
```

### Subtype inheritance

A `struct` with an "inline" member or a `typedef` which is declared with "inline", will 
inherit dynamic methods from its inline "parent". This inheritance is not
available for "inline" enums.

### Reflection invocation
*This functionality is not yet implemented and may see syntax changes*

It is possible to retrieve any `@dynamic` function by name and invoke it:

```c3
alias VoidMethodFn = fn void(void*);

fn void* int.test_something(&self) @dynamic
{
    io::printfn("Testing: %d", *self);
}

fn void main()
{
    int z = 321;
    any a = &z;
    VoidMethodFn test_func = a.reflect("test_something");
    test_func(a); // Will print "Testing: 321"
}
```

This feature allows methods to be linked up at runtime.

