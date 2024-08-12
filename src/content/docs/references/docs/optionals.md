---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 115
---

Optionals in C3 work differently from other languages:

1. It is similar to a "Result" type in capabilities.
2. It is not quite a type: it can be used for variable and return values - but not for parameters or struct member types.
3. It "cascades" the optional-ness of an expression, somewhat reminiscent of the "flatmap" operation.
4. A function called with an Optional is only invoked if it has an actual value.
 
## What is an Optional?

In C3 it is either:

1. A variable that works as a union between a `fault` value and an actual value, we call this latter the "result".
2. A return value that is either a `fault` or a result.

We can construct an Optional by adding the `!` suffix to a type:

```c
int! a; // An optional value with the result type of "int"

fn int! foo() // A function returning an optional value with the result type of "int"
{
  ...
}  
```

It is not possible to create an Optional of an Optional (so for example `int!!` is never valid).

*Using* a variable or return with an Optional type yields an optional:

    int! a = ...
    fn int! foo() { ... }
    
    double! x = a * 3.14159;
    double! y = foo() * 0.3333333333;
    double! z = x * y;

Similar to basic operations it's possible to use an Optional value as a call parameter. The return value then becomes Optional

    int! a = ...
    fn double bar(int x) { ... }

    // "bar" can be called because the result type of the Optional is "int"
    // but the return value will become Optional:
    double! x = bar(a);

## Optional execution

The most important feature of Optionals is how it will only optionally execute
operations. Given a call with the arguments a0, a1, ... the call will only 
be invoked if all of the arguments evaluate to real values.

    int! a = 1;
    int! b = MyResult.FOO?;

    // "baz" called, because "a" is has a result. 
    int! z = baz(a, a);  // same as z = bar(1, 1)

    // "baz" is not called, because "b" evaluates to a fault
    int! y = baz(a, b);

    // Due to evaluation ordering "abc" is called, but not "def" nor "baz":
    int! x = baz(abc(a), def(b));

    // Due to evaluation ordering none of "abc", "def" or "baz" is called:
    int! x2 = baz(def(b), abc(a));

We can think of the above example `int! x = baz(a, b)` as the following:

1. Evaluate the first argument.
2. If it is a `fault` then we're done, set `x` to this fault.
3. Evaluate the second argument.
4. If it is a `fault` then we're done, set `x` to this fault.
5. Execute `baz` with the result values from the arguments.

Optional execution allows us to avoid dealing with intermediary errors, we can simply
collect them together:

`int! x = foo_return_optional(other_return_optional(optional_value))`

## Optional unwrapping

It's not possible to assign an Optional to a non-optional type:

```c
int! a = ...

int b = a; // <- ERROR, can't assign "int!" to "int"
```

To assign it we have two options, `if-try` and implicit unwrap.

### If-try

If-try tests an Optional and executes the "then" part if the value is a result.

    int! a = ...;
    int b;
  
    if (try int x = a) 
    {
        // This part only executes if "a" has a result.
        b = x; 
    }

There are abbreviated variants of `if-try`:

    if (try x = a) { ... } // Infer type of "x"
    if (try a) { ... } // Unwrap "a" inside of this context.

It is possible to add conditions to an `if-try` but they must be joined with `&&`
"or" (i.e. `||`) is not allowed:

    if (try a && try z && a > z)
    {
        // Only executes if a and z have results 
        // *and* a > z
        ...
    }

    // if (try a || try z) { ... } <- ERROR!


### If-catch

If-catch works the other way and only executes if the Optional is a fault:

    if (catch anyfault f = a) 
    {
        // Handle the fault
    }

Just like for if-try there are abbreviated variants:

    if (catch f = a) { ... } // "f" has the type of "anyfault"
    if (catch a) { ... } // Discards the actual fault value

It is possible to catch multiple errors by grouping them with `,`:

    if (catch f = a, b, foo()) 
    {
        // Returns the fault from a, b or foo()
        // trying each in order.
        // foo() is only called if neight a nor b has a fault.
    }
    
### Implicit unwrapping with if-catch.

If an `if-catch` returns or jumps out of the current scope in some way, then
the variable becomes implicit unwrapped to its result type in that scope:

    int! a = foo_may_error();
    
    if (catch a)
    {
        return;
    }

    // a is now considered a plain int:
    int b = a; 

### Getting the fault without unwrapping

If-catch is not necessary in order to get the underlying fault from any Optional. Instead the macro `@catch` 
may be used.

    int! a = ...

    anyfault f = @catch(a);

    if (!f)
    {
        // No error!
    }

### If-catch switching

If-catch can also immediately switch on the fault value:

    if (catch a) 
    {
        case MyResult.FOO:
            ...
        case IoError.NO_SUCH_FILE:
            ...
        case IoError.FILE_NOT_DIR:
            ...
        default:
            ...
    }

The above being equivalent to:

    if (catch f = a) 
    {
        switch (f)
        {
            case MyResult.FOO:
                ...
            case IoError.NO_SUCH_FILE:
                ...
            case IoError.FILE_NOT_DIR:
                ...
            default:
                ...
        }
    }


### Testing for a result without unwrapping

The `@ok` macro will return `true` if an Optional is a result and `false`
if it is a fault. Functionally this is equivalent to `!@catch`

    int! a = ...

    bool was_ok = @ok(a);
    assert(was_ok == !@catch(a));

## `fault` and `anyfault`

Faults are defined similar to simple enums:

    fault MyResult
    {
        SOMETHING_HAPPENED,
        UNEXPECTED_ERROR,
    }

The union of all of such types is `anyfault`:

    MyResult foo = MyResult.UNEXPECTED_ERROR;

    anyfault x = foo;
    x = IoError.NO_SUCH_FILE; // Also ok

## Setting the `result` and the `fault`

To set the `result` of an Optional, use regular assignment, and
to set the `fault` `?` suffix operator.

    int! a = 1;
    int! b = MyResult.UNEXPECTED_ERROR?; // <- '?' sets the fault

    MyResult foo = MyResult.UNEXPECTED_ERROR;
    anyfault bar = IoError.NO_SUCH_FILE;

    int! c = foo?; // c has the fault MyResult.UNEXPECTED_ERROR
    int! d = bar?; // d has the fault IoError.NO_SUCH_FILE?

## Rethrow, or-else and force unwrap

Three helper operators are provided for working with Optionals:
rethrow `!`, or-else `??` and force unwrap `!!`.

### Rethrow 

Sometimes the optional fault needs to be propagated upwards, here is 
an example:

    int! a = foo_may_error();

    if (catch f = a)
    {
        return f?; // Pass the fault upwards.
    }

To simplify this the rethrow operator `!` can be used:

    // Equivalent to the code above.
    int! a = foo_may_error()!;

Because the rethrow operator automatically returns on a fault, the return value
turns into its result. In the above example the type of `foo_may_error()!` becomes `int`:

    int b = foo_may_error()!; // This works

### Or-else

Sometimes we have this situation:

    int! a_temp = foo_may_error();
    int a;
    if (try a_temp)
    {   
        a = a_temp;
    }
    else
    {
        a = -1;
    }

The or-else operator `??` works similar to `?:` allowing you to do this in a single expression:

    // Equivalent to the above
    int a = foo_may_error() ?? -1;

### Force unwrap

Sometimes a `fault` is completely unexpected, and we want to assert if 
it happens:

    int! a = foo_may_error();
    if (catch f = a) 
    {
        unreachable("Unexpected fault %s", f);
    }
    ... use "a" as int here ...

The force unwrap operator `!!` allows us to express this similar to rethrow and or-else:

    int a = foo_may_error()!!;

## No void! variables

The `void!` type has no possible representation as a variable, and may
only be a return type. To store the result of a `void!` function,
one can use the `@catch` macro to convert the result to
an `anyfault`:

    fn void! test() { ... }

    anyfault f = @catch(test());

## Examples

#### Basic usage with immediate error handling

    // Open a file, we will get an optional result:
    // Either a File* or an error.
    File*! file = file::open("foo.txt");

    // We can extract the optional result value using "catch"
    if (catch f = file)
    {
        // Might print "Error was FILE_NOT_FOUND"
        io::printfn("Error was %s", f.name()); 
    
        // Might print "Error code: 931938210"
        io::printfn("Error code: %d", (uptr)err); 
        return;
    }

    // Because of implicit unwrapping, the type of
    // `file` is File* here.

We can also execute just in case of success:

    File*! file2 = file::open("bar.txt");

    // Only true if there is an expected result.
    if (try file2)
    {
        // Inside here file2 is a regular File*
    }

#### Composability of calls

    fn int! foo_may_error() { ... }
    fn int mult(int i) { ... }
    fn int! save(int i) { ... }
    
    fn void test()
    (
        // "mult" is only called if "fooMayError()"
        // returns a non optional result.
        int! j = mult(foo_may_error());
        
        int! k = save(mult(foo_may_error()));
        if (catch f = k)
        {
            // The fault may be from foo_may_error
            // or save!
        }    
    )

#### Returning a fault

Returning a fault looks like a normal return but with the `?`

```
fn void! find_file()
{
    if (file::exists("foo.txt")) return IoError.FILE_NOT_FOUND?;
    /* ... */
}
```

#### Calling a function automatically returning any optional result

The `!` suffix will create an implicit return on a fault.

```
fn void! find_file_and_test()
{
    find_file()!;
    // Implictly:
    // if (catch f = find_file()) return f?;
}
```

#### Force unwrapping to panic on fault

The `!!` will issue a panic if there is a fault.

```
fn void find_file_and_test()
{
    find_file()!!;
    // Implictly:
    // if (catch find_file()) unreachable("Unexpected error");
}
```

#### Catching faults to implicitly unwrap

Catching faults and then exiting the scope will implicitly unwrap the
variable:

    fn void find_file_and_no_fault()
    {
        File*! res = find_file();    
        if (catch res)
        {
            io::printn("An error occurred!");
            // Jump required for unwrapping!
            return;
        }
        // res is implicitly unwrapped here.
        // and have an effective type of File*.
    }


#### Only run if there is no fault

```
fn void do_something_to_file()
{
    void! res = find_file();    
    if (try res)
    {
        io::printn("I found the file");
    }
}
```

#### Catching and switch on fault

    fn void! find_file_and_parse2()
    {
        if (catch f = find_file_and_parse())
        {
            case IOError.FILE_NOT_FOUND:
                io::printn("Error loading the file!");
            default:
                return f?;
        }
    }
    

#### Default values using or-else


    fn int get_int()
    {
        return get_int_number_or_fail() ?? -1;
    }


#### Get the fault from an optional without `if-catch`

    fn void test_catch()
    {
        int! i = get_something();
        anyfault maybe_fault = @catch(i);
        if (maybe_fault)
        {
            // Do something with the fault
        }
    }

#### Test if something has a value without `if-try`

    fn void test_something()
    {
        int! i = try_it();
        bool worked = @ok(i);
        if (worked)
        {
            io::printn("Horray! It worked.");
        }
    }

### Some common techniques

Here follows some common techniques using optional values.

#### Catch and return another error

In this case we don't want to return the underlying fault, but instead return out own replacement error.

    fn void! return_own()
    {
        int! i = try_something() ?? OurError.SOMETHING_FAILED?;
        .. do things ..
    }

    fn void! return_own_rethrow()
    {
        int i = try_something() ?? OurError.SOMETHING_FAILED?!; // Cause immediate rethrow
        .. do things ..
    }

#### Using void! as a boolean

A common pattern in C is to use a boolean result to indicate success. `void!` can be used
in a similar way:

    // C
    bool store_foo(Foo* f)
    {
        if (!foo_repository_is_valid()) return false;
        return foo_repo_store_foo(f);
    }
    
    void test()
    {
        Foo* f = foo_create();
        if (store_foo(f)) 
        {
            puts("Storage worked");
            return;
        }
        ...
    }


    // C3
    fn void! store_foo(Foo* f)
    {
        if (!foo_repository_is_valid()) return FooFaults.INVALID_REPO?;
        return foo_repo_store_foo(f);
    }

    fn void test()
    {
        Foo* f = foo_create();
        if (@ok(store_foo(f))) 
        {
            io::printn("Storage worked");
            return;
        }
        ...
    }
    
## Interfacing with C

For C the interface to C3, the fault is returned as the regular return while the result
is passed by reference:

C3 code:

    fn int! get_value();

Corresponding C code:

    c3fault_t get_value(int *value_ref);

The `c3fault_t` is guaranteed to be a pointer sized value.
