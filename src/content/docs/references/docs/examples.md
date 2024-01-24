---
title: Examples
description: Examples of C3 code
sidebar:
    order: 102
---

#####if-statement
```
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

#####for-loop
```
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

#####foreach-loop
```
fn void example_foreach(float[] values) 
{
    foreach (index, value : values) 
    {
        io::printfn("%d: %f", index, value);
    }
}
```


#####while-loop

```
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

#####enum + switch

Switches have implicit break and scope. Use "nextcase" to implicitly fallthrough or use comma:

```
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

Enums also define `.min` and `.max`, returning the minimum and maximum value for the enum values. `.values` returns an array with all enums.

```
enum State : uint 
{
    START,
    STOP,
}

const uint LOWEST = State.min;
const uint HIGHEST = State.max;

State start = State.values[0];
```

#####defer

Defer will be invoked on scope exit.

```
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
Similarly using `defer try` to execute of success.

```
fn void! test(int x)
{
    defer io::printn("");
    defer io::printn("A");
    defer try io::printn("X");
    defer catch io::printn("B")
    defer catch (err) io::printfn("%s", err.message);
    if (x == 1) return FooError!;
    print("!")
}

test(0); // Prints "!XA"
test(1); // Prints "FOOBA" and returns a FooError
```

#####struct types

```
def Callback = fn int(char c);

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


#####Function pointers

```
module demo;

def Callback = fn int(char* text, int value);

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

#####Error handling

Errors are handled using optional results, denoted with a '!' suffix. A variable of an optional
result type may either contain the regular value or a `fault` enum value.

```
fault MathError
{
    DIVISION_BY_ZERO
}

fn double! divide(int a, int b)
{
    // We return an optional result of type DIVISION_BY_ZERO
    // when b is zero.
    if (b == 0) return MathError.DIVISION_BY_ZERO?;
    return (double)a / (double)b;
}

// Re-returning an optional result uses "!" suffix
fn void! testMayError()
{
    divide(foo(), bar())!;
}

fn void main()
{
    // ratio is an optional result.
    double! ratio = divide(foo(), bar());

    // Handle the optional result value if it exists.
    if (catch err = ratio)
    {
        case MathError.DIVISION_BY_ZERO:
            io::printn("Division by zero\n");
            return;
        default:
            io::printn("Unexpected error!");
            return;
    }
    // Flow typing makes "ratio"
    // have the plain type 'double' here.
    io::printfn("Ratio was %f", ratio);
}
```

```
fn void printFile(String filename)
{
    String! file = io::load_file(filename);

    // The following function is not executed on error.
    io::printfn("Loaded %s and got:\n%s", filename, file);

    if (catch err = file)
    {
        case IoError.FILE_NOT_FOUND:
            io::printfn("I could not find the file %s", filename);
        default:
            io::printfn("Could not load %s.", filename);
    }
}
```

Read more about optionals and error handling [here](../optionals).

##### Contracts

Pre- and postconditions are optionally compiled into asserts helping to optimize the code.
```
/**
 * @param foo "the number of foos" 
 * @require foo > 0, foo < 1000
 * @return "number of foos x 10"
 * @ensure return < 10000, return > 0
 **/
fn int testFoo(int foo)
{
    return foo * 10;
}

/**
 * @param array "the array to test"
 * @param length "length of the array"
 * @require length > 0
 **/
fn int getLastElement(int* array, int length)
{
    return array[length - 1];
}
```

Read more about contracts [here](../contracts).

##### Macros

Macro arguments may be immediately evaluated.
```
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
    return @foo(&square, 2) + a + b; // 9
    // return @foo(square, 2) + a + b; 
    // Error the symbol "square" cannot be used as an argument.
}
```

Macro arguments may have deferred evaluation, which is basically text expansion using `#var` syntax.

```
macro foo(#a, b, #c)
{
    c = a(b) * b;
}

macro foo2(#a)
{
    return a * a;
}

fn int square(int x)
{
    return x * x;
}

fn int test1()
{
    int a = 2;
    int b = 3; 
    foo(square, a + 1, b);
    return b; // 27   
}

fn int test2()
{
    return foo2(1 + 1); // 1 + 1 * 1 + 1 = 3
}
```

Improve macro errors with preconditions:
```
/**
 * @param x "value to square"
 * @require types::is_numeric($typeof(x)) "cannot multiply"
 **/
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

Read more about macros [here](../macros).

##### Methods

It's possible to namespace functions with a union, struct or enum type to enable "dot syntax" calls:

```
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

##### Compile time reflection and execution

Access type information and loop over values at compile time:

    import std::io;

    struct Foo
    {
        int a;
        double b;
        int* ptr;
    }

    macro print_fields($Type)
    {
        $foreach ($field : $Type.membersof)
            io::printfn("Field %s, offset: %s, size: %s, type: %s", 
                    $field.nameof, $field.offsetof, $field.sizeof, $field.typeid.nameof);
        $endforeach
    }


    fn void main()
    {
        print_fields(Foo);
    }

This prints on x64:

```text
Field a, offset: 0, size: 4, type: int
Field b, offset: 8, size: 8, type: double
Field ptr, offset: 16, size: 8, type: int*
```

#### Compile time execution

Macros with only compile time variables are completely evaluated at compile time:

    macro long @fib(long $n)
    {
        $if $n <= 1:
            return $n;
        $else
            return @fib($n - 1) + @fib($n - 2);
        $endif
    }

    const long FIB19 = @fib(19); 
    // Same as const long FIB19 = 4181;

Read more about compile time execution [here](../compiletime).

##### Generic modules

Generic modules implements a generic system.

```
module stack(<Type>);
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
        this.capacity *= 2;
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

```
def IntStack = Stack(<int>);

fn void test()
{
    IntStack stack;
    stack.push(1);
    stack.push(2);
    // Prints pop: 2
    io::printfn("pop: %d", stack.pop());
    // Prints pop: 1
    io::printfn("pop: %d", stack.pop());
    
    Stack(<double>) dstack;
    dstack.push(2.3);
    dstack.push(3.141);
    dstack.push(1.1235);
    // Prints pop: 1.1235
    io::printfn("pop: %f", dstack.pop());
}
```

Read more about generic modules [here](../generics)

##### Dynamic calls

Runtime dynamic dispatch through interfaces:

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

    fn void whoareyou(any* a)
    {
        MyName* b = (MyName*)a;
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

	    any* a = &i;
	    whoareyou(a);
	    a = &d;
	    whoareyou(a);
	    a = &bob;
	    whoareyou(a);
    }

Read more about dynamic calls [here](../anyinterfaces).