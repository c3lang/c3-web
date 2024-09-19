---
title: Functions
description: Functions
sidebar:
    order: 45
---

C3 has both regular functions and member functions. Member functions are functions namespaced using type names, and allows invocations using the dot syntax.

## Regular functions

Regular functions are the same as C aside from the keyword `fn`, which is followed by the conventional C declaration of `<return type> <name>(<parameter list>)`.

```c3
fn void test(int times)
{
    for (int i = 0; i < times; i++)
    {
        io::printfn("Hello %d", i);
    }
}
```

### Function arguments

C3 allows use of default arguments as well as named arguments. Note that
any unnamed arguments must appear before any named arguments.

```c3
fn int test_with_default(int foo = 1)
{
    return foo;
}

fn void test()
{
    test_with_default();
    test_with_default(100);
}
```

Named arguments

```c3
fn void test_named(int times, double data)
{
    for (int i = 0; i < times; i++)
    {
        io::printf("Hello %d\n", i + data);
    }
}

fn void test()
{
    // Named only
    test_named(times: 1, data: 3.0);

    // Unnamed only
    test_named(3, 4.0);

    // Mixing named and unnamed        
    test_named(15, data: 3.141592);
}
```

Named arguments with defaults:

```c3
fn void test_named_default(int times = 1, double data = 3.0, bool dummy = false)
{
    for (int i = 0; i < times; i++)
    {
        io::printfn("Hello %f", i + data);
    }
}

fn void test()
{
    // Named only
    test_named_default(times: 10, data: 3.5);

    // Unnamed and named
    test_named_default(3, dummy: false);

    // Overwriting an unnamed argument with a named argument is an error:
    // test_named_default(2, times: 3); ERROR!
    
    // Unnamed may not follow named arguments.
    // test_named_default(times: 3, 4.0); ERROR!
}
```

#### Varargs

There are four types of varargs: 

1. single typed
2. explicitly typed any: pass non-any arguments as references
3. implicitly typed any: arguments are implicitly converted to references (use with care)
4. untyped C-style

Examples:

```c3
fn void va_singletyped(int... args)
{
    /* args has type int[] */
}

fn void va_variants_explicit(any*... args)
{
    /* args has type any*[] */
}

fn void va_variants_implicit(args...)
{
    /* args has type any*[] */
}

extern fn void va_untyped(...); // only used for extern C functions

fn void test()
{
    va_singletyped(1, 2, 3);
    
    int x = 1;
    any* v = &x;
    va_variants_explicit(&&1, &x, v); // pass references for non-any arguments
    
    va_variants_implicit(1, x, "foo"); // arguments are implicitly converted to anys
    
    va_untyped(1, x, "foo"); // extern C-function
}
```

For typed varargs, we can pass a slice instead of the individual arguments, by using the splat `...` operator for example:

```c3
fn void test_splat()
{
   int[] x = { 1, 2, 3 };
   va_singletyped(...x);
}   
```
### Splat

- Splat `...` unknown size slice ONLY in a typed vaarg slot.

```c3
fn void va_singletyped(int... args) { 
    io::printfn("%s", args); 
}
fn void main() 
{
    int[2] arr = {1, 2};
    va_singletyped(...arr); // arr is splatting two arguments
}
```

- Splat `...` any array anywhere

```c3
fn void foo(int a, int b, int c) 
{ 
    io::printfn("%s, %s, %s", a, b, c); 
}
fn void main() 
{
    int[2] arr = {1, 2};
    foo(...arr, 7); // arr is splatting two arguments
}
```


- Splat `...` known size slices anywhere

```c3
fn void foo(int a, int b, int c) 
{ 
    io::printfn("%s, %s, %s", a, b, c); 
}
fn void main() 
{
    int[5] arr = {1, 2, 3, 4, 5};
    foo(...arr[:3]); // slice is splatting three arguments
}
```



### Named arguments and varargs

Usually, a parameter after varargs would never be assigned to:  

```c3
fn void testme(int a, double... x, double rate = 1.0) { /* ... */ }

fn void test()
{
    // x is { 2.0, 5.0, 6.0 } rate would be 1.0
    testme(3, 2.0, 5.0, 6.0); 
}
```

However, named arguments can be used to set this value:

```c3
fn void testme(int a, double... x, double rate = 1.0) { /* ... */ }

fn void test()
{
    // x is { 2.0, 5.0 } rate would be 6.0
    testme(3, 2.0, 5.0, .rate = 6.0);
}
```

### Functions and Optional returns

Function return values may be *Optionals* – denoted by `<type>!` indicating that this 
function might either return an Optional with a result, or an Optional with an Excuse.

For example this function might return an Excuse of type `SomeError` or `OtherResult`.

```c3
fn double! test_error()
{
    double val = random_value();
    if (val >= 0.2) return SomeError.BAD_JOSS_ERROR?;
    if (val > 0.5) return OtherError.BAD_LUCK_ERROR?;
    return val;
}
```

*A function call* which is passed one or more *Optional* arguments will only execute 
if all Optional values contain a *result*, otherwise the first Excuse found is returned.

```c3
fn void test()
{
    // The following line is either prints a value less than 0.2
    // or does not print at all:
    io::printfn("%d", test_error());
    
    // ?? sets a default value if an Excuse is found
    double x = (test_error() + test_error()) ?? 100;  
    
    // This prints either a value less than 0.4 or 100:
    io::printfn("%d", x);
}
```

This allows us to chain functions:

```c3
fn void print_input_with_explicit_checks()
{
    String! line = io::readline();
    if (try line)
    {
        // line is a regular "string" here.
        int! val = line.to_int();
        if (try val)
        {
            io::printfn("You typed the number %d", val);
            return;
        }
    }
    io::printn("You didn't type an integer :/ ");
}

fn void print_input_with_chaining()
{
    if (try int val = io::readline().to_int())
    {
        io::printfn("You typed the number %d", val);
        return;
    }
    io::printn("You didn't type an integer :/ ");
}
```

## Methods

Methods look exactly like functions, but are prefixed with the type name and is (usually) 
invoked using dot syntax:

```c3
struct Point
{
    int x;
    int y;
}

fn void Point.add(Point* p, int x) 
{
    p.x += x;
}

fn void example() 
{
    Point p = { 1, 2 };
    
    // with struct-functions
    p.add(10);
    
    // Also callable as:
    Point.add(&p, 10);
}
```

The target object may be passed by value or by pointer:

```c3
enum State
{
    STOPPED,
    RUNNING
}

fn bool State.may_open(State state) 
{
    switch (state)
    {
        case STOPPED: return true;
        case RUNNING: return false;
    }
}
```

### Implicit first parameters

Because the type of the first argument is known, it may be left out. To indicate a pointer `&` is used.

```c3
fn int Foo.test(&self) { /* ... */ }
// equivalent to
fn int Foo.test(Foo* self) { /* ... */ }
fn int Bar.test(self) { /* ... */ }
// equivalent to
fn int Bar.test(Bar self) { /* ... */ }
```

It is customary to use `self` as the name of the first parameter, but it is not required.
    
### Restrictions on methods

- Methods on a struct/union may not have the same name as a member.
- Methods only works on distinct, struct, union and enum types.
- When taking a function pointer of a method, use the full name.
- Using subtypes, overlapping function names will be shadowed.

## Contracts

C3's error handling is not intended to use errors to signal invalid data or to check invariants and post conditions. Instead C3's approach is to add annotations to the function, that conditionally will be compiled into asserts.

As an example, the following code:

```c3
/**
 * @param foo `the number of foos`
 * @require foo > 0, foo < 1000
 * @return `number of foos x 10`
 * @ensure return < 10000, return > 0
 **/
fn int test_foo(int foo)
{
    return foo * 10;
}
```

Will in debug builds be compiled into something like this:

```c3
fn int test_foo(int foo)
{
    assert(foo > 0);
    assert(foo < 1000);
    int _return = foo * 10;
    assert(_return < 10000);
    assert(_return > 0);
    return _return;
}
```

The compiler is allowed to use the contracts for optimizations. For example this:


```c3
fn int test_example(int bar)
{
    // The following is always invalid due to the `@ensure`
    if (test_foo(bar) == 0) return -1;
    return 1;
}
```

May be optimized to:

```c3
fn int test_example(int bar)
{
    return 1;
}
```

In this case the compiler can look at the post condition of `result > 0` to determine that `testFoo(foo) == 0` must always be false.

Looking closely at this code, we not that nothing guarantees that `bar` is not violating the preconditions. In Safe builds this will usually be checked in runtime, but a sufficiently smart compiler will warn about the lack of checks on `bar`. Execution of code violating pre and post conditions has unspecified behaviour.

## Short function declaration syntax

For very short functions, C3 offers a "short declaration" syntax using `=>`:

```c3
// Regular
fn int square(int x)
{
    return x * x;
}
// Short
fn int square_short(int x) => x * x;
```

## Lambdas

It's possible to create anonymous functions using the regular `fn` syntax. Anonymous 
functions are identical to regular functions and do not capture variables from the 
surrounding scope:

```c3
def IntTransform = fn int(int);
fn void apply(int[] arr, IntTransform t)
{
    foreach (&i : arr) *i = t(*i);
}
fn void main()
{
    int[] x = { 1, 2, 5 };
    // Short syntax with inference:
    apply(x, fn (i) => i * i);
    // Regular syntax without inference: 
    // apply(x, fn int(int i) { return i * i; });
    // Prints [1, 4, 25]
    io::printfn("%s", x);        
}
```

## Static initializer and finalizers

It is sometimes useful to run code at startup and shutdown. Static initializers and finalizers
are regular functions annotated with `@init` and `@finalizer` that are run at startup and shutdown respectively:

```c3
fn void run_at_startup() @init
{
    // Run at startup
    some_function.init(512);
} 

fn void run_at_shutdown() @finalizer
{
    some_thing.shutdown();
}
```

Note that invoking `@finalizer` is a best effort attempt by the OS and may not
be called during abnormal shutdown.

### Changing priority of static initializers and finalizers

It is possible to provide an argument to the attributes to set the actual priority. It is recommended
that programs use a priority of 1024 or higher. The higher the value, the later it
will be called. The lowest priority is 65535.

```c3
// Print "Hello World" at startup.

fn void start_world() @init(3000)
{
    io::printn("World");
}
fn void start_hello() @init(2000)
{
    io::print("Hello ");
}
```
