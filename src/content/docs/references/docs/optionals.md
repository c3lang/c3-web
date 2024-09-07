---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 115
---

## Optionals handle the cases we cannot return the intended value 

Optionals are used for a function that can return a `Result` that is *present* or return a `Result` that is *missing*, along with an `Excuse` about why it was missing.

### What is an `Excuse`?

An `Excuse` represents a reason why a valid `Result` could not be returned, like opening a file but finding it does not exist and returning an `IoError.FILE_NOT_FOUND` for instance. An `Excuse` is always of the `anyfault` type which is a union of all possible `fault` a program can have. A `fault` is defined similarly to an `enum`:

```c3
fault NoHomework
{
    DOG_ATE_MY_HOMEWORK,
    MY_TEXTBOOK_CAUGHT_FIRE,
    DISTRACTED_BY_CAT_PICTURES
}

fn void! main(String[] args)
{
    NoHomework excuse = NoHomework.DOG_ATE_MY_HOMEWORK;

    // The union of all of the program's `fault` types is an `anyfault` type
    // You can convert between different values of `anyfault`
    anyfault another_excuse = excuse;
    excuse = IoError.FILE_NOT_FOUND; // Also ok
}
```

### What is an Optional?

Optionals in C3 act like a tagged union of either the `Result` **or** `Excuse`. When the `Result` is present, the `Excuse` is not. Conversely when the `Result` is missing we can check the `Excuse` to see what happened. This is an alternative to error codes in C.

Similar to a "Result" type in other languages, you can retrieve the underlying `Excuse` test against it and switch over different cases of it. 

Optionals can also be used in a more lightweight way, to detect if `Result` is present or not. This is an alternative way of handling data which might otherwise be `null` in C.

Create an Optional from an existing type by appending `!` to that type.
```c3
int! example = 6; // Optional value with `Result` type of int
```

### Setting the `Result` or the `Excuse` in an Optional

- To set the `Result` of an Optional, use regular assignment
- To set the `Excuse` use the `?` suffix operator.
```c3
int! a = 1;                       // Set the `Result` with `=`
int! b = IoError.FILE_NOT_FOUND?; // Set the `Excuse` with '?' 
```

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

## Detect missing `Result` 
```c3
import std::io;
int! optional_value = IoError.FILE_NOT_FOUND?;

// Detect missing `Result` inside `optional_value` and handle inside scope
if (catch optional_value) 
{
    io::printn("Detected missing `Result`, underlying `Excuse` was ignored.");
} 
```

Detect missing `Result` and retrieve underlying `Excuse`

```c3
import std::io;
int! optional_value = IoError.FILE_NOT_FOUND?;

// Detect missing `Result` and retrieve underlying `Excuse` from `optional_value` 
// Retrieve underlying `Excuse`, assigning to `excuse` inside scope
if (catch excuse = optional_value)
{
    io::printfn("Excuse found: %s", excuse);
} 
```

For example let’s return a `Excuse` from a function.
```c3
import std::io;

/* Returns optional with `Result` of type `void` or an `Excuse` of type `anyfault` */
fn void! test()
{
    return IoError.FILE_NOT_FOUND?; // Return a `Excuse` using `?` suffix
}

fn void! main(String[] args)
{
    // Catch missing `Result` with an underlying `Excuse` defined, assign to `excuse`
    if (catch excuse = test())
    {
        io::printfn("test() gave an Excuse: %s", excuse);
        return excuse?; // Returning `Excuse` using `?` suffix
    }

    io::printn("This code is never reached");
}
```

You can catch one of multiple possible errors by catching them together in a group:
```c3
if (catch excuse = optional1, optional2, foo())
{
    // Detects a missing `Result` in `optional1`, `optional2` or `foo()`
    // Each is checked in left-to-right order
    // Any underlying `Excuse` is assigned to `excuse`
    // foo() is only called if no `Excuse` in either `optional1` or `optional2`
}
```

### Detect missing `Result` and switch on underlying `Excuse`

`if (catch)` can also immediately switch on the `Excuse` value:
```c3
if (catch excuse = optional_value)
{
    case NoHomework.DOG_ATE_MY_HOMEWORK:
        io::printn("Dog ate your file");
    case IoError.FILE_NOT_FOUND:
        io::printn("File not found");
    default:
        io::printfn("Unexpected Excuse: %s", excuse);
        return excuse?;
}
```

Which is shorthand for:

```c3
if (catch excuse = optional_value)
{
    switch (excuse)
    {
        case NoHomework.DOG_ATE_MY_HOMEWORK:
            io::printn("Dog ate your file");
        case IoError.FILE_NOT_FOUND:
            io::printn("File not found");
        default:
            io::printfn("Unexpected Excuse: %s", excuse);
            return excuse?;
    }
}
```

### Detect and handle a missing `Result` makes it no longer Optional 
If scope is exited inside `if (catch)` afterwards the `optional_value` behaves like a normal variable.
Scope exit is `return`, `break`, `continue` or rethrow `!`.
```c3
int! optional_value = unreliable_function();
if (catch excuse = optional_value) 
{
    return excuse?; // Return `Excuse` with `?` operator
}
io::printfn("use optional_value as normal now: %s", optional_value);
```
A helpful shorthand for this is using rethrow `!`
```c3
int optional_value = unreliable_function()!; // rethrow `!` here
io::printfn("use optional_value as normal now: %s", optional_value)!;
```

#### Example returning an Optional `Excuse` OR `Result`
Let's expand this example to something which *may* fail, like opening a file. 

- If the file is not present the `Excuse` will be `IoError.FILE_NOT_FOUND`.
- If the file is present the `Result` will be the first 100 bytes of the file.

Try running this code below with and without a file called `file_to_open.txt` in the same directory.

```c3
import std::io;

/** 
 * Function modifies `buffer` by pointer in the char[] slice
 * Returns optional with `Result` of type `void` or a `Excuse`
**/
fn void! read_file(String filename, char[] buffer)
{
    // Return `Excuse` if failed opening file, using rethrow `!`
    File! file = file::open(filename, "r")!; 

    // At scope exit, close the file if it was opened successfully
    // Discard the `Excuse` from file.close() with (void) cast
    defer (void)file.close(); 

    // Return `Excuse` if failed to read file, using rethrow `!`
    file.read(buffer)!; 
    return; // return the void `Result`
}

fn void! main()
{
    char[] buffer = mem::new_array(char, 100);
    defer free(buffer); // Free memory on scope exit


    // Catch missing `Result` with an underlying `Excuse` defined, assign to `excuse`
    if (catch excuse = read_file("file_to_open.txt", buffer)) 
    {
        io::printfn("Excuse found: %s", excuse);
        return excuse?; // Returning `Excuse` using `?` suffix
    }

    // `buffer` unwrapped so like a normal variable here 
    // because missing `Result` was handled by scope exit in `if (catch)`
    // Only reached when a file was successfully read
    io::printfn("Buffer read: %s", buffer);
    return;
}
```

## Detect `Result` is present 
```c3
// Unwrap the `Result` from `optional_value` to be a normal value inside scope
if (try optional_value) 
{
    io::printfn("value found: %s", optional_value);    
} 

// Unwrap and assign `Result` from `optional_value` to `unwrapped_value` inside scope
if (try unwrapped_value = optional_value)
{
    io::printfn("value found: %s", unwrapped_value);    
}  
```

For example

```c3
import std::io;

/* Returns optional with `Result` of type `int` or an `Excuse` */
fn int! reliable_function()
{
    return 7; // Return a `Result` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result = reliable_function();

    // Unwrap the `Result` from reliable_result
    if (try reliable_result)
    {
        // reliable_result is unwrapped in this scope, can be used as normal
        io::printfn("reliable_result: %s", reliable_result);
    }
}
```
It is possible to add conditions to an `if (try)` but they must be joined with `&&`. Logicial OR `||` conditions are **not** allowed:
```c3
import std::io;

/* Returns optional with `Result` of type `int` or an `Excuse` */
fn int! reliable_function()
{
    return 7; // Return a `Result` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result1 = reliable_function();
    int! reliable_result2 = reliable_function();

    // Unwrap the `Result` from reliable_result1 and reliable_result2
    if (try reliable_result1 && try reliable_result2 && 5 > 2)
    {
        // `reliable_result1` is unwrapped here and can be used as a normal variable
        io::printfn("reliable_result1: %s", reliable_result1);

        // `reliable_result2` is unwrapped here and can be used as a normal variable
        io::printfn("reliable_result2: %s", reliable_result2);
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

/* Returns optional with `Result` of type `int` or an `Excuse` */
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

```c3
import std::io;

fn int test(int input) 
{
    io::printn("test(): inside function body");
    return input;
}

fn void! main(String[] args)
{
    int! optional_argument = 7;

    // `optional_argument` makes returned `returned_optional` Optional too 
    int! returned_optional = test(optional_argument);
}
```

### Functions may not run when called with Optional arguments

Calling a functions with an Optional arguments will only proceed when **all** of the arguments that are Optional type contain a valid `Result`, and therefore no underlying `Excuse`.

```c3
import std::io;

fn int test(int input, int input2) 
{
    io::printn("test(): inside function body");
    return input;
}

fn void! main(String[] args)
{
    int! first_optional = IoError.FILE_NOT_FOUND?; // Missing `Result` and `Excuse` defined
    int! second_optional = IoError.NO_PERMISSION?; // Missing `Result` and `Excuse` defined

    // Arguments are checked left-to-right for a missing `Result` 
    // First detected missing `Result` causes underlying `Excuse` to be returned
    // Here `third_optional` was assigned the `Excuse` in `first_optional`
    int! third_optional = test(first_optional, second_optional);

    if (catch excuse = third_optional) 
    {
        io::printfn("third_optional's Excuse: %s", excuse); // IoError.FILE_NOT_FOUND
    }
    return;
}
```

## Avoiding unwrapping Optionals

### Getting the `Excuse` without unwrapping

Retrieving the underlying errors with `if (catch excuse = optional_value) {...}` is not the only way to get the `Excuse` from an Optional, we can use the macro `@catch` instead.
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    anyfault excuse = @catch(optional_value);
    if (excuse)
    {
        io::printfn("Excuse found: %s", excuse);
    }
    return;
}
```

### Testing for a valid `Result` without unwrapping

The `@ok` macro will return `true` if an Optional `Result` is present and `false` if not. Functionally this is equivalent to `!@catch`
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    bool successful = @ok(optional_value);
    assert(successful == !@catch(optional_value));
    return;
}
```

## Default assign when detected missing `Result` using `??`
If an expression returns a `Excuse` when assigning an Optional make default assignment using `??` operator.

```c3
import std::io;

int regular_value;
int! optional_value = function_may_error();
if (catch optional_value) // A `Excuse` was found in optional_value
{   
    regular_value = -1; // Assign default value when fault was found
}
if (try optional_value;) // A `Result` was found in optional_value
{
    regular_value = optional_value;
}
```

The operator `??` allows you to assign a default `Result` or `Excuse` when an expression contains a missing `Result`:

```c3
// Set default `Result` to -1 when `foo_may_error()` has a missing `Result`
int regular_value = foo_may_error() ?? -1;
```

### Distinguish between two function calls that could return the same `Excuse`

Catch a missing `Result` and change the underlying `Excuse` to a situation specific `Excuse`, that allows us to disitinguish one situation from the other, even with the same starting `Excuse`.

```c3
import std::io;

fault NoHomework
{
    DOG_ATE_MY_HOMEWORK,
    MY_TEXTBOOK_CAUGHT_FIRE,
    DISTRACTED_BY_CAT_PICTURES
}

fn int! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

fn void! main(String[] args) 
{
    int! a = test(); // IoError.FILE_NOT_FOUND
    int! b = test(); // IoError.FILE_NOT_FOUND

    // We can tell these appart by default assigning our own unique `Excuse`
    // Our unique `Excuse` is assigned only if a `Excuse` is found
    int c = test() ?? NoHomework.DOG_ATE_MY_HOMEWORK?;
    int d = test() ?? NoHomework.DISTRACTED_BY_CAT_PICTURES?;

    // If you want to return those unique `Excuse` to the caller, add rethrow `!`
    int e = test() ?? NoHomework.DOG_ATE_MY_HOMEWORK?!;
    int f = test() ?? NoHomework.DISTRACTED_BY_CAT_PICTURES?!;
}
```


## Assert an Optional cannot have a missing `Result` and the program should panic with force unwrap `!!`

Sometimes a missing `Result` is unexpected or cannot be easily handled, so panic if we detect a missing `Result`, this is best used sparingly:
```c3
int! optional_value = foo_may_error();
if (catch excuse = optional_value) 
{
    unreachable("Unexpected fault %s", excuse);
}
// Now optional_value is a regular variable
```

The force unwrap operator `!!` will exit the program if a `Excuse` is returned from `foo_may_error()`.
```c3
int regular_value = foo_may_error()!!;
```

## No void! variables

The `void!` type has no possible representation as a variable, and may
only be a return type. 

Use `if (catch)` to handle a missing `Result` or read the `Excuse`
```c3
fn void! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

if (catch excuse = test()) // Retrieve underlying `Excuse`
{
    io::printfn("Excuse found: %s", excuse);
    return excuse?;
}
```
Or use `if (try)` to handle sucessful outcome of having a `Result` present
```c3
fn void! test() 
{
    return;
}

if (try test()) // Handle `Result` outcome
{
    io::printn("successful test()");
}
```
If you wish to store the possible `Excuse` returned from a `void!` function, use the `@catch` macro to convert the result to an `anyfault`:
```c3
fn void! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

anyfault excuse = @catch(test());
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
    if (catch excuse = result2)
    {
        // The fault may be from foo_may_error
        // or save!
    }    
)
```
#### Returning a fault

Returning a `Excuse` looks like a normal return but with a `?` suffix.

Note this function is referenced in future examples.

```c3
fn void! find_file() 
{
    File! optional_file = file::open("file_to_open.txt", "r"); 
    if (catch excuse = optional_file) 
    {
        return excuse?; // `?` suffix returns `Excuse`
    }
    
    return; 
}
```

#### Calling a function automatically returning any optional result with rethrow `!`

The rethrow `!` suffix will create an implicit return if an `Excuse` is found.

```c3
fn void! find_file_and_test()
{
    find_file()!; // Rethrow `!`

    // Rethrow `!` runs the following:
    // if (catch excuse = find_file()) return excuse?;
}
```

#### Using force unwrap `!!` to panic on `Excuse`

The force unwrap `!!` will issue a panic and exit the program if there is an `Excuse`.

```c3
fn void find_file_and_test()
{
    find_file()!!;

    // Force unwrap `!!` runs the following:
    // if (catch find_file()) unreachable("Unexpected excuse");
}
```

#### Using `if (catch)` to implicitly unwrap `Result` after scope exit

Catching empty `Result` and then exiting the `if (catch)` scope via; `return`, `break`, `continue` or rethrow `!` implicitly unwraps the `optional_value` afterwards:
```c3
fn void find_file_and_no_fault()
{
    File*! optional_value = find_file();    
    if (catch optional_value)
    {
        // Scope exit here required to implicitly unwrap `optional_value` after
        return;
    }
    // `optional_value` is implicitly unwrapped here.
    // and has a type of File*
}
```

#### Only run if there is no fault

```c3
fn void do_something_to_file()
{
    void! optional_value = find_file();    
    if (try optional_value)
    {
        io::printn("I found the file");
    }
}
```

#### Catching and switch on fault
```c3
fn void! find_file_and_parse2()
{
    if (catch excuse = find_file_and_parse())
    {
        case IOError.FILE_NOT_FOUND:
            io::printn("Error loading the file!");
        default:
            return excuse?;
    }
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

#### Test if something has a value without `if (try)`
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
 