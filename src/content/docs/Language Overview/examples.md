---
title: Examples
description: Examples of C3 code
sidebar:
    order: 35
---
## Overview
This is meant for a quick reference, to the learn more of the details, check the relevant sections.

## If Statement
```c3
fn void if_example(int a)
{
    if (a > 0)
    {
        // ..
    }
    else
    {
        // ..
    }
}
```

## For Loop
```c3
fn void example_for()
{
    // the for-loop is the same as C99.
    for (int i = 0; i < 10; i++)
    {
        io::printfn("%d", i);
    }

    // also equal
    for (;;)
    {
        // ..
    }
}
```

## Foreach Loop
```c3
// Prints the values in the slice.
fn void example_foreach(float[] values)
{
    foreach (index, value : values)
    {
        io::printfn("%d: %f", index, value);
    }
}

// Updates each value in the slice
// by multiplying it by 2.
fn void example_foreach_by_ref(float[] values)
{
    foreach (&value : values)
    {
        *value *= 2;
    }
}
```

## While Loop

```c3
fn void example_while()
{
    // again exactly the same as C
    int a = 10;
    while (a > 0)
    {
        a--;
    }

    // Declaration
    while (Point* p = getPoint())
    {
        // ..
    }
}
```

## Enum And Switch

Switches have implicit break and scope. Use "nextcase" to implicitly fallthrough or use comma:

```c3
enum Height : uint
{
    LOW,
    MEDIUM,
    HIGH,
}

fn void demo_enum(Height h)
{
    switch (h)
    {
        case LOW:
        case MEDIUM:
            io::printn("Not high");
            // Implicit break.
        case HIGH:
            io::printn("High");
    }

    // This also works
    switch (h)
    {
        case LOW:
        case MEDIUM:
            io::printn("Not high");
            // Implicit break.
        case Height.HIGH:
            io::printn("High");
    }

    // Completely empty cases are not allowed.
    switch (h)
    {
        case LOW:
            break; // Explicit break required, since switches can't be empty.
        case MEDIUM:
            io::printn("Medium");
        case HIGH:
            break;
    }

    // special checking of switching on enum types
    switch (h)
    {
        case LOW:
        case MEDIUM:
        case HIGH:
            break;
        default:    // warning: default label in switch which covers all enumeration value
            break;
    }

    // Using "nextcase" will fallthrough to the next case statement,
    // and each case statement starts its own scope.
    switch (h)
    {
        case LOW:
            int a = 1;
            io::printn("A");
            nextcase;
        case MEDIUM:
            int a = 2;
            io::printn("B");
            nextcase;
        case HIGH:
            // a is not defined here
            io::printn("C");
    }
}
```


Enums are always namespaced.

Enum support various reflection properties: `.values` returns an array with all enums. `.len` or `.elements` returns the number
of enum values, `.inner` returns the storage type. `.names` returns an array with the names of all enums. `.associated`
returns an array of the typeids of the associated values for the enum.

```c3
enum State : uint
{
    START,
    STOP,
}

State start = State.values[0];
usz enums = State.elements;   // 2
String[] names = State.names; // [ "START", "STOP" ]
```

## Defer

Defer will be invoked on scope exit.

```c3
fn void test(int x)
{
    defer io::printn();
    defer io::print("A");
    if (x == 1) return;
    {
        defer io::print("B");
        if (x == 0) return;
    }
    io::print("!");
}

fn void main()
{
    test(1); // Prints "A"
    test(0); // Prints "BA"
    test(10); // Prints "B!A"
}
```

Because it's often relevant to run different defers when having an error return there is also a way to create an error defer, by using the `catch` keyword directly after the defer.
Similarly using `defer try` can be used to only run if the scope exits in a regular way.

```c3
fn void? test(int x)
{
    defer io::printn("");
    defer io::print("A");
    defer try io::print("X");
    defer catch io::print("B");
    defer (catch err) io::printf("%s", err);
    if (x == 1) return NOT_FOUND?;
    io::print("!");
}

test(0); // Prints "!XA"
test(1); // Prints "builtin::NOT_FOUNDBA" and returns a NOT_FOUND
```

## Struct Types

```c3
alias Callback = fn int(char c);

enum Status : int
{
    IDLE,
    BUSY,
    DONE,
}

struct MyData
{
    char* name;
    Callback open;
    Callback close;
    State status;

    // named sub-structs (x.other.value)
    struct other
    {
        int value;
        int status;   // ok, no name clash with other status
    }

    // anonymous sub-structs (x.value)
    struct
    {
        int value;
        int status;   // error, name clash with other status in MyData
    }

    // anonymous union (x.person)
    union
    {
        Person* person;
        Company* company;
    }

    // named sub-unions (x.either.this)
    union either
    {
        int this;
        bool  or;
        char* that;
    }
}
```


## Function Pointers

```c3
module demo;

alias Callback = fn int(char* text, int value);

fn int my_callback(char* text, int value)
{
    return 0;
}

Callback cb = &my_callback;

fn void example_cb()
{
    int result = cb("demo", 123);
    // ..
}
```

## Error Handling

Errors are handled using optional results, denoted with a '?' suffix. A variable of an optional
result type may either contain the regular value or a `fault` enum value.

```c3
faultdef DIVISION_BY_ZERO;

fn double? divide(int a, int b)
{
    // We return an optional result of type DIVISION_BY_ZERO
    // when b is zero.
    if (b == 0) return DIVISION_BY_ZERO?;
    return (double)a / (double)b;
}

// Re-returning an optional result uses "?" suffix
fn void? testMayError()
{
    divide(foo(), bar())!;
}

fn void main()
{
    // ratio is an optional result.
    double? ratio = divide(foo(), bar());

    // Handle the optional result value if it exists.
    if (catch err = ratio)
    {
        switch (err)
        {
            case DIVISION_BY_ZERO:
                io::printn("Division by zero");
                return;
            default:
                io::printn("Unexpected error!");
                return;
        }
    }
    // Flow typing makes "ratio"
    // have the plain type 'double' here.
    io::printfn("Ratio was %f", ratio);
}
```

```c3
fn void print_file(String filename)
{
    String? file = (String)file::load_temp(filename);

    // The following function is not called on error,
    // so we must explicitly discard it with a void cast.
    (void)io::printfn("Loaded %s and got:%s", filename, file);

    if (catch err = file)
    {
        switch(err)
        {
            case io::FILE_NOT_FOUND:
                io::printfn("I could not find the file %s", filename);
            default:
                io::printfn("Could not load %s.", filename);
        }
    }
}

// Note that the above is only illustrating how Optionals may skip
// call invocation. A more normal implementation would be:

fn void print_file2(String filename)
{
    String? file = (String)file::load_temp(filename);

    if (catch err = file)
    {
        // Print the error
        io::printfn("Failed to load %s: %s", filename, err);
        // We return, so that below 'file' will be unwrapped.
        return;
    }
    // No need for a void cast here, 'file' is unwrappeed to 'String'.
    io::printfn("Loaded %s and got:\n%s", filename, file);
}
```



Read more about optionals and error handling [here](/language-common/optionals-essential/#what-is-an-optional).

## Contracts

Pre- and postconditions are optionally compiled into asserts helping to optimize the code.
```c3
<*
 @param foo "the number of foos"
 @require foo > 0, foo < 1000
 @return "number of foos x 10"
 @ensure return < 10000, return > 0
*>
fn int testFoo(int foo)
{
    return foo * 10;
}

<*
 @param array "the array to test"
 @param length "length of the array"
 @require length > 0
*>
fn int getLastElement(int* array, int length)
{
    return array[length - 1];
}
```

Read more about contracts [here](/language-common/contracts/).

## Struct Methods

It's possible to namespace functions with a union, struct or enum type to enable "dot syntax" calls:

```c3
struct Foo
{
    int i;
}

fn void Foo.next(Foo* this)
{
    if (this) this.i++;
}

fn void test()
{
    Foo foo = { 2 };
    foo.next();
    foo.next();
    // Prints 4
    io::printfn("%d", foo.i);
}
```


## Macros

Macro arguments may be immediately evaluated.
```c3
macro foo(a, b)
{
    return a(b);
}

fn int square(int x)
{
    return x * x;
}

fn int test()
{
    int a = 2;
    int b = 3;
    return foo(&square, 2) + a + b; // 9
    // return foo(square, 2) + a + b;
    // Error the symbol "square" cannot be used as an argument.
}
```

Macro arguments may have deferred evaluation, which is basically duplication of the expression using `#var` syntax.

```c3
macro @foo(#a, b, #c)
{
    #c = #a(b) * b;
}

macro @foo2(#a)
{
    return #a * #a;
}

fn int square(int x)
{
    return x * x;
}

fn int test1()
{
    int a = 2;
    int b = 3;
    @foo(square, a + 1, b);
    return b; // 27
}

fn int printme(int a)
{
    io::printn(a);
    return a;
}

fn int test2()
{
    return @foo2(printme(2)); // Returns 2 and prints "2" twice.
}
```

Improve macro errors with preconditions:
```c3
<*
 @param x "value to square"
 @require types::is_numeric($typeof(x)) "cannot multiply"
*>
macro square(x)
{
    return x * x;
}

fn void test()
{
    square("hello"); // Error: cannot multiply "hello"
    int a = 1;
    square(&a); // Error: cannot multiply '&a'
}
```

Read more about macros [here](/generic-programming/macros/).

### Compile Time Reflection & Execution

Access type information and loop over values at compile time:

```c3
import std::io;

struct Foo
{
    int a;
    double b;
    int* ptr;
}

macro print_fields($Type)
{
    $foreach $field : $Type.membersof:
        io::printfn("Field %s, offset: %s, size: %s, type: %s",
                $field.nameof, $field.offsetof, $field.sizeof, $field.typeid.nameof);
    $endforeach
}


fn void main()
{
    print_fields(Foo);
}
```

This prints on x64:

```text
Field a, offset: 0, size: 4, type: int
Field b, offset: 8, size: 8, type: double
Field ptr, offset: 16, size: 8, type: int*
```

### Compile Time Execution

Macros with only compile time variables are completely evaluated at compile time:

```c3
macro long fib(long $n)
{
    $if $n <= 1:
        return $n;
    $else
        return fib($n - 1) + fib($n - 2);
    $endif
}

const long FIB19 = fib(19);
// Same as const long FIB19 = 4181;
```
:::note
C3 macros are designed to provide a replacement for C preprocessor macros. They extend such macros by providing compile time evaluation using constant folding, which offers an IDE friendly, limited, compile time execution.

However, if you are doing more complex compile time code generation it is recommended to use `$exec` and related techniques to generate code in external scripts instead.
:::
Read more about compile time execution [here](/generic-programming/compiletime/).


## Operator Overloading

```c3
struct Vec2
{
    int x, y;
}

fn Vec2 Vec2.add(self, Vec2 other) @operator(+)
{
    return { self.x + other.x, self.y + other.y };
}

fn Vec2 Vec2.sub(self, Vec2 other) @operator(-)
{
    return { self.x - other.x, self.y - other.y };
}

fn void main()
{
    Vec2 v1 = { 1, 2 };
    Vec2 v2 = { 100, 4 };
    Vec2 v3 = v1 + v2;    // v3 = { 101, 6 }
}
```

Read more about operator overloading [here](generic-programming/operator-overloading/).

## Generic Modules

Generic modules implements a generic system.

```c3
module stack {Type};
struct Stack
{
    usz capacity;
    usz size;
    Type* elems;
}


fn void Stack.push(Stack* this, Type element)
{
    if (this.capacity == this.size)
    {
        this.capacity = this.capacity ? this.capacity * 2 : 16;
        this.elems = realloc(this.elems, Type.sizeof * this.capacity);
    }
    this.elems[this.size++] = element;
}

fn Type Stack.pop(Stack* this)
{
    assert(this.size > 0);
    return this.elems[--this.size];
}

fn bool Stack.empty(Stack* this)
{
    return !this.size;
}
```

Testing it out:

```c3
alias IntStack = Stack {int};

fn void test()
{
    IntStack stack;
    stack.push(1);
    stack.push(2);
    // Prints pop: 2
    io::printfn("pop: %d", stack.pop());
    // Prints pop: 1
    io::printfn("pop: %d", stack.pop());

    Stack {double} dstack;
    dstack.push(2.3);
    dstack.push(3.141);
    dstack.push(1.1235);
    // Prints pop: 1.1235
    io::printfn("pop: %f", dstack.pop());
}
```

Read more about generic modules [here](/generic-programming/generics/)

## Dynamic Calls

Runtime dynamic dispatch through interfaces:

```c3
import std::io;

// Define a dynamic interface
interface MyName
{
    fn String myname();
}

struct Bob (MyName) { int x; }

// Required implementation as Bob implements MyName
fn String Bob.myname(Bob*) @dynamic { return "I am Bob!"; }

// Ad hoc implementation
fn String int.myname(int*) @dynamic { return "I am int!"; }

fn void whoareyou(any a)
{
    MyName b = (MyName)a;
    if (!&b.myname)
    {
        io::printn("I don't know who I am.");
        return;
    }
    io::printn(b.myname());
}

fn void main()
{
    int i = 1;
    double d = 1.0;
    Bob bob;

    any a = &i;
    whoareyou(a);
    a = &d;
    whoareyou(a);
    a = &bob;
    whoareyou(a);
}
```

Read more about dynamic calls [here](/generic-programming/anyinterfaces/).
