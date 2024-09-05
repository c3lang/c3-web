---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 115
---

## Optionals handle the cases we cannot return the intended value 

A common example using optionals is for a function that can return an intended value or it can provide reasons why it could not. We call the intended outcome a `result`, when it could not return a `result` we call that reason the `fault`.

### What is a `fault`?

A `fault` represents a reason why a `result` could not be returned, like opening a file but finding it does not exist and returning an `IoError.FILE_NOT_FOUND` for instance. A `fault` is defined similarly to simple enums:
```c3
fault NoPurchaseReason
{
    BOOK_NOT_FOUND,
    BOOK_OUT_OF_STOCK,
}

fn void! main(String[] args)
{
    NoPurchaseReason order_failed = NoPurchaseReason.BOOK_NOT_FOUND;

    // The union of all of the program's `fault` types is an `anyfault` type
    // You can convert between different types of `fault`
    anyfault example = order_failed;
    example = IoError.FILE_NOT_FOUND; // Also ok
}
```

### What is an Optional?

Optionals act like a tagged union of either the `result` **or** `fault`, either of which can be unpacked in C3.

Similar to a "Result" type in other languages, the `fault` is specific and something you can unpack and test against and switch over.

Create an Optional from an existing type by appending `!` to that type.
```c3
int! example = 6; // Optional value with `result` type of int
```

#### Setting the `result` or the `fault` in an Optional

- To set the `result` of an Optional, use regular assignment
- To set the `fault` `?` suffix operator.
```c3
int! a = 1;                       // Set the `result` with `=`
int! b = IoError.FILE_NOT_FOUND?; // Set the `fault` with '?' 
```

#### Run code if we find a `fault` in the Optional: 
```c3
// Detect `fault` inside "optional_value", handle inside scope
if (catch optional_value) {...} 

// Detect and Unwrap `fault` from "optional_value" and assign to `err` inside scope
if (catch err = optional_value) {...} 
```
If you `catch` the `fault` and exit the scope via `return`, `break`, `continue` or rethrow `!`, you have handled the `fault`, and `optional_value` converts to a normal variable, implicitly unwrapping it.
```c3
int! optional_value = unreliable_function();
if (catch err = optional_value) return err?; 
io::printfn("use optional_value as normal now: %s", optional_value);
```
A helpful shorthand for this is using rethrow `!`
```c3
int optional_value = unreliable_function()!; // rethrow `!` here
io::printfn("use optional_value as normal now: %s", optional_value)!;
```
For more details see [Detect and Unwrap fault](#detect-and-unwrap-fault).

#### Run code if we find a `result` in the Optional: 
```c3
// Detect and Unwrap `result` inside "optional_value", use inside scope
if (try optional_value) {...} 

// Detect, Unwrap and assign `result` from "optional_value" to `value` inside of this context
if (try value = optional_value) {...} 
```

You can also rethrow `!` function calls with Optionals to run if there is a `result` else return the `fault` to the caller.
```c3
int! optional_value = 7;
io::printn(optional_value)!; // Rethrow `!` Prints 7
```
For more details see [Detect and Unwrap result](#detect-and-unwrap-result).

### Optionals are only defined in certain code
- ✅ Variable declarations
```c3
int! example = unreliable_function();
```

- ✅ Function return signature
```c3
fn int! example() { ... }
```

- ❌ Function parameter
```c3
fn void example(int parameter) { ... }
```

- ❌ Struct member types
```c3
struct Example {
    int member;
}
```

- ❌ Being an Optional cannot be nested. 
```c3
int!! example;  // This is invalid
int! example;   // This is valid
```

## Examples of Optionals

### Example returning an Optional `fault`
Optionals are best explained by example, first let's return a `fault` from a function to see how we can deal with it.


```c3
import std::io;

/* Returns optional with `result` of type `void` or a `fault` */
fn void! test()
{
    return IoError.FILE_NOT_FOUND?; // Return a `fault` using `?` suffix
}

fn void! main(String[] args)
{
    // Catch if there's a `fault` returned, store `fault` in `err`
    if (catch err = test()) 
    { 
        io::printfn("test() returned a fault: %s", err);
        return err?; // Returning `fault` using `?` suffix
    }

    io::printn("This code is never reached");
}
```
Above we saw that a `fault` can be caught, logged and used to prevent the program from continuing. 

### Example returning an Optional `fault` OR `result`
Let's expand this example to something which *may* fail, like opening a file. 

- If the file is not present the `fault` will be `IoError.FILE_NOT_FOUND`.
- If the file is present the `result` will be the first 100 bytes of the file.

Try running this code below with and without a file called `file_to_open.txt` in the same directory.

```c3
import std::io;

/** 
 * Function modifies `buffer` by pointer in the char[] slice
 * Returns optional with `result` of type `void` or a `fault`
**/
fn void! read_file(String filename, char[] buffer)
{
    // Return `fault` if failed opening file, using rethrow `!`
    File! file = file::open(filename, "r")!; 

    // At scope exit, close the file if it was opened successfully
    // Discard the `fault` from file.close() with (void) cast
    defer (void)file.close(); 

    // Return `fault` if failed to read file, using rethrow `!`
    file.read(buffer)!; 
    return; // return the void `result`
}

fn void! main()
{
    char[] buffer = mem::new_array(char, 100);
    defer free(buffer); // Free memory on scope exit

    // Catch if there's a `fault` returned, store `fault` in `err`
    if (catch err = read_file("file_to_open.txt", buffer)) 
    {
        io::printfn("fault found: %s", err);
        return err?; // Returning `fault` using `?` suffix
    }

    // `buffer` was unwrapped as `fault` was handled by `if (catch)`
    // Only reached when a file was successfully read
    io::printfn("Buffer read: %s", buffer);
    return;
}
```

## Unwrapping optionals

### Detect and Unwrap `fault`

#### Unwrap the `fault` with `if (catch)`
The `fault` inside Optionals can be unwrapped with `if (catch ...)`
```c3
// Detect `fault` in optional_value, discard `fault` value
if (catch optional_value) { ... } 

// Detect `fault` in optional_value, assign err = `fault` value
if (catch err = optional_value) { ... } 
```
You can catch one of multiple possible errors by catching them together in a group:
```c3
if (catch err = optional1, optional2, foo())
{
    // Detects a `fault` in optional1, optional2 or foo()
    // Catches the first found `fault` in left-to-right order
    // foo() is only called if no fault in either `optional1` or `optional2`
}
```

#### Implicit Unwrap of `result` after `if (catch)` 
The Optional is implicitly unwrapped to a regular type if there is any kind of scope exit in the `if (catch)` block such as: `return`, `break`, `continue` or `!` rethrow. 

In general `if (catch)` is a sensible default because it explicitly handles the fault, and the implicit unwrapping of the `result` after handling the `fault` in the `if (catch)` makes code simple to read.

```c3
import std::io;

/* Returns optional with `result` of type `int` or a `fault` */
fn int! reliable_function()
{
    return 7; // Return a `result` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result = reliable_function();
    
    // Catch if there's a `fault` returned, store `fault` in `err`
    if (catch err = reliable_result) 
    {
        io::printfn("reliable_function() returned a fault: %s", err);
        return err?; // Returning `fault` using `?` suffix
    }
    
    // reliable_result is implicitly unwrapped here as we exited scope inside if (catch)
    io::printfn("reliable_result: %s", reliable_result);
}
```

#### Unwrap then switch on `fault` with `if (catch)`

`if (catch)` can also immediately switch on the fault value:
```c3
if (catch optional_value)
{
    case NoPurchaseReason.BOOK_NOT_FOUND:
        ...
    case IoError.NO_SUCH_FILE:
        ...
    case IoError.FILE_NOT_DIR:
        ...
    default:
        ...
}
```

Which is shorthand for:

```c3
if (catch err = optional_value)
{
    switch (err)
    {
        case NoPurchaseReason.BOOK_NOT_FOUND:
            ...
        case IoError.NO_SUCH_FILE:
            ...
        case IoError.FILE_NOT_DIR:
            ...
        default:
            ...
    }
}
```

### Detect and Unwrap `result`

#### Unwrapping the `result` with Rethrow `!`
Optionals can be unwrapped with rethrow `!` to extract the `result` if it is defined, or `return` the `fault` if that is defined.

```c3
import std::io;

fn void! main(String[] args)
{
    int! first_optional = 7;
    io::printn(first_optional)!; // Prints 7

    int! second_optional = IoError.FILE_NOT_FOUND?;
    io::printn(second_optional)!; // Returns `fault` & program exits
    return;
}
```

#### Unwrapping the `result` with `if (try )`

`if (try)` tests for a valid `result` in an Optional and if valid executes the code block.

```c3
// Unwrap optional_value and assign to x inside of this context.
if (try x = optional_value) { ... }

// Unwrap optional_value inside of this context.
if (try optional_value) { ... }     
```

For example

```c3
import std::io;

/* Returns optional with `result` of type `int` or a `fault` */
fn int! reliable_function()
{
    return 7; // Return a `result` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result = reliable_function();
    
    // Unwrap the `result` from reliable_result
    if (try reliable_result) 
    {
        // reliable_result is unwrapped in this scope, can be used as normal
        io::printfn("reliable_result: %s", reliable_result);
    }
}
```

It is possible to add conditions to an `if (try)` but they must be joined with `&&`. Logicial OR `||` conditions are not allowed:

```c3
import std::io;

/* Returns optional with `result` of type `int` or a `fault` */
fn int! reliable_function()
{
    return 7; // Return a `result` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result1 = reliable_function();
    int! reliable_result2 = reliable_function();
    
    // Unwrap the `result` from reliable_result
    if (try reliable_result1 && try reliable_result2 && 5 > 2) 
    {
        // reliable_result is unwrapped here and can be used as a normal variable
        io::printfn("reliable_result: %s", reliable_result);
    }

    // ERROR cannot use logical OR `||`
    // if (try reliable_result1 || try reliable_result2) 
    // {
    //     io::printn("this can never happen);
    // }
}
```

## Optionals affect types and control flow

### Optionals affect result types when used
Use an Optional anywhere in an expression the outcome will be an Optional too.
```c3
import std::io;

/* Returns optional with `result` of type `int` or a `fault` */
fn int! test() 
{
    return 7;
}

fn void! main(String[] args)
{
    int! first_optional = test();
    int! second_optional = first_optional + 1; // This is optional too
    io::printn(second_optional)!; // Printing by unwrapping optional with rethrow `!` 

    return;
}
```

### Optionals affect function return value types when used
Calling a function with any arguments of Optional type will make the return value Optional type as well. The Optional function arguments are checked left-to-right and the first encountered `fault` in the function arguments is returned before running the function. 

```c3
import std::io;

fn int test(int input) 
{
    io::printn("test(): inside function body");
    return input;
}

fn void! main(String[] args)
{
    int! first_optional = 7;

    // Argument `first_optional` makes `second_optional` Optional too 
    int! second_optional = test(first_optional);
    
    int! third_optional = IoError.FILE_NOT_FOUND?;

    // `forth_optional` contains the fault = IoError.FILE_NOT_FOUND
    // We never enterred the function body with a `fault` argument
    int! forth_optional = test(third_optional); 
    return;
}
```

### Functions may not run when called with Optional arguments

Calling a functions with an Optional arguments will only proceed when **all** of the arguments that are Optional type contain a valid `result`, and no `fault`.

```c3
import std::io;

fn int test(int input, int input2) 
{
    io::printn("test(): inside function body");
    return input;
}

fn void! main(String[] args)
{
    int! first_optional = IoError.FILE_NOT_FOUND?;
    int! second_optional = IoError.NO_PERMISSION?;

    // Arguments evaluated left-to-right `first_optional` contained a fault
    // `third_optional` was assigned the fault in `first_optional`
    int! third_optional = test(first_optional, second_optional);  // IoError.FILE_NOT_FOUND
    return;
}
```


## Avoiding unwrapping Optionals

### Getting the `fault` without unwrapping

Unwrapping errors with `if (catch err = optional_value) {...}` is not the only way to get the `fault` from an Optional, we can use the macro `@catch` instead.
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    anyfault err = @catch(optional_value);
    if (err)
    {
        io::printfn("error found: %s", err);
    }
    return;
}
```

### Testing for a valid `result` without unwrapping

The `@ok` macro will return `true` if an Optional is a `result` and `false`
if it is a `fault`. Functionally this is equivalent to `!@catch`
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    bool successful = @ok(optional_value);
    assert(successful == !@catch(optional_value));
    return;
}
```

## Set default Optional `result` when `fault` was assigned using `??`
When assigning to an Optional if an expression returns a `fault` we can assign a default `result` using the `??` operator.

```c3
int regular_value;
int! optional_value = function_may_error();
if (catch optional_value) // A `fault` was found in optional_value
{   
    regular_value = -1; // Assign default value when fault was found
}
if (try optional_value;) // A `result` was found in optional_value
{
    regular_value = optional_value;
}
```

The operator `??` allows you to set a default value, set when an expression is a `fault`:

```c3
// Set default `result` to -1 when foo_may_error() is a `fault`
int regular_value = foo_may_error() ?? -1;
```

This is similar to the [elvis operator `?:`](../specification/#ternary-elvis-and-or-else-expressions) which sets a default value in case a value is false.

## Assert unwrap of Optional should not fail with force unwrap `!!`

Sometimes a `fault` is unexpected or cannot be easily handled, so assert if we detect a `fault`, this is best used sparingly:
```c3
int! optional_value = foo_may_error();
if (catch err = optional_value) 
{
    unreachable("Unexpected fault %s", err);
}
// Now optional_value is a regular variable
```

The force unwrap operator `!!` will exit the program if a `fault` is returned from `foo_may_error()`.
```c3
int regular_value = foo_may_error()!!;
```

## No void! variables

The `void!` type has no possible representation as a variable, and may
only be a return type. 

Use `if (catch)` to handle `fault`
```c3
fn void! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

if (catch err = test()) // Capture returned `fault`
{
    io::printfn("found fault: %s", err);
    return err?;
}
```
Or use `if (try)` to handle `result`
```c3
fn void! test() 
{
    return;
}

if (try test()) // Handle `result` outcome
{
    io::printn("successful test()");
}
```
If you wish to store the possible `fault` returned from a `void!` function, use the `@catch` macro to convert the result to an `anyfault`:
```c3
fn void! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

anyfault err = @catch(test());
```



## More Examples Of Optionals

#### Composability of calls
```c3
fn int! foo_may_error() { ... }
fn int mult(int i) { ... }
fn int! save(int i) { ... }

fn void test()
(
    // "mult" is only called if "fooMayError()"
    // returns a non optional result.
    int! result1 = mult(foo_may_error());
    
    int! result2 = save(mult(foo_may_error()));
    if (catch err = result2)
    {
        // The fault may be from foo_may_error
        // or save!
    }    
)
```
#### Returning a fault

Returning a fault looks like a normal return but with the `?`.

Note this function is referenced in future examples.

```c3
fn void! find_file() 
{
    File! file = file::open("file_to_open.txt", "r")!; 
    return;
}
```

#### Calling a function automatically returning any optional result with rethrow `!`

The rethrow `!` suffix will create an implicit return if a `fault` is found.

```c3
fn void! find_file_and_test()
{
    find_file()!; // Rethrow `!`

    // Rethrow `!` runs the following:
    // if (catch err = find_file()) return err?;
}
```

#### Using force unwrap `!!` to panic on `fault`

The force unwrap `!!` will issue a panic and exit the program if there is a `fault`.

```c3
fn void find_file_and_test()
{
    find_file()!!;

    // Force unwrap `!!` runs the following:
    // if (catch find_file()) unreachable("Unexpected error");
}
```

#### Using `if (catch)` to implicitly unwrap `result` after scope exit

Catching faults and then exiting the scope will implicitly unwrap the
variable:
```c3
fn void find_file_and_no_fault()
{
    File*! result = find_file();    
    if (catch err = result)
    {
        io::printfn("An error occurred: %s", err);
        
        // Scope exit here required to implicitly unwrap after
        return;
    }
    // result is implicitly unwrapped here.
    // and has a type of File*
}
```

#### Only run if there is no fault

```c3
fn void do_something_to_file()
{
    void! result = find_file();    
    if (try result)
    {
        io::printn("I found the file");
    }
}
```

#### Catching and switch on fault
```c3
fn void! find_file_and_parse2()
{
    if (catch err = find_file_and_parse())
    {
        case IOError.FILE_NOT_FOUND:
            io::printn("Error loading the file!");
        default:
            return err?;
    }
}
```

#### Setting default values for when `fault` is returned using `??`

```c3
fn int get_int()
{
    return get_int_number_or_fail() ?? -1;
}
```

#### Get the fault from an optional without `if (catch)`
```c3
fn void test_catch()
{
    int! result = get_something();
    anyfault maybe_fault = @catch(result);
    if (maybe_fault)
    {
        // Do something with the fault
    }
}
```

#### Test if something has a value without `if-try`
```c3
fn void test_something()
{
    int! optional_value = try_it();
    bool result_is_ok = @ok(optional_value);
    if (result_is_ok)
    {
        io::printn("Horray! Result is OK.");
    }
}
```

### Some common techniques

Here follows some common techniques using optional values.

#### Catch and return another error

In this case we don't want to return the underlying `fault`, but instead return our own replacement `fault`.
```c3
fn void! return_own()
{
    // Default value is assigned our own `fault`
    int! i = try_something() ?? OurError.SOMETHING_FAILED?; 
    .. do things ..
}

fn void! return_own_rethrow()
{
    // Rethrow our default `fault`
    int i = try_something() ?? OurError.SOMETHING_FAILED?!;
    .. do things ..
}
```

#### Using `void!` as a boolean

A common pattern in C is to use a boolean result to indicate success. `void!` can be used
in a similar way:
```c
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
```

```c3
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
```
    
## Interfacing with C

For C the interface to C3, the fault is returned as the regular return while the result
is passed by reference:

C3 code:
```c3
fn int! get_value();
```
Corresponding C code:
```c
c3fault_t get_value(int *value_ref);
```
The `c3fault_t` is guaranteed to be a pointer sized value.
     