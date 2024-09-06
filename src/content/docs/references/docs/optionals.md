---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 115
---

## Optionals handle the cases we cannot return the intended value 

A commonly Optionals are used for a function that can return a value that is *present* or return a value that is *missing*, along with a *reason* why it was missing. We call the intended outcome a `value`, when it could not return a `value` we call that *reason* the `fault`.

### What is a `fault`?

A `fault` represents a reason why a `value` could not be returned, like opening a file but finding it does not exist and returning an `IoError.FILE_NOT_FOUND` for instance. A `fault` is defined similarly to enums:
```c3
fault NoHomework
{
    DOG_ATE_MY_HOMEWORK,
    MY_TEXTBOOK_CAUGHT_FIRE,
    DISTRACTED_BY_CAT_PICTURES
}

fn void! main(String[] args)
{
    NoHomework reason = NoHomework.DOG_ATE_MY_HOMEWORK;

    // The union of all of the program's `fault` types is an `anyfault` type
    // You can convert between different types of `fault`
    anyfault excuse = reason;
    excuse = IoError.FILE_NOT_FOUND; // Also ok
}
```

### What is an Optional?

Optionals in C3 act like a tagged union of either the `value` **or** `fault`. When the `value` is present there is no `fault`, when `value` is missing we can check the `fault` to see the reason for that. This is an alternative to error codes in C.

Similar to a "Result" type in other languages, you can retrieve the underlying `fault` test against it and switch over different cases of it. 

Optionals can also be used in a more lightweight way, to detect if `value` is present or not. This is an alternative way of handling data which might otherwise be `null` in C.

Create an Optional from an existing type by appending `!` to that type.
```c3
int! example = 6; // Optional value with `value` type of int
```

### Setting the `value` or the `fault` in an Optional

- To set the `value` of an Optional, use regular assignment
- To set the `fault` `?` suffix operator.
```c3
int! a = 1;                       // Set the `value` with `=`
int! b = IoError.FILE_NOT_FOUND?; // Set the `fault` with '?' 
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

## Detect missing `value` 
```c3
import std::io;
int! optional_value = IoError.FILE_NOT_FOUND?;

// Detect missing `value` inside `optional_value` and handle inside scope
if (catch optional_value) 
{
    io::printn("Detected missing `value`, underlying fault was ignored.");
} 
```

Detect missing `value` and retrieve underlying `fault`

```c3
import std::io;
int! optional_value = IoError.FILE_NOT_FOUND?;

// Detect missing `value` and retrieve underlying `fault` from `optional_value` 
// Retrieve underlying `fault`, assigning to `excuse` inside scope
if (catch excuse = optional_value)
{
    io::printfn("fault found: %s", excuse);
} 
```

For example let’s return a `fault` from a function.
```c3
import std::io;

/* Returns optional with `value` of type `void` or a `fault` */
fn void! test()
{
    return IoError.FILE_NOT_FOUND?; // Return a `fault` using `?` suffix
}

fn void! main(String[] args)
{
    // Catch if there's a `fault` returned, store `fault` in `excuse`
    if (catch excuse = test())
    {
        io::printfn("test() returned a fault: %s", excuse);
        return excuse?; // Returning `fault` using `?` suffix
    }

    io::printn("This code is never reached");
}
```

You can catch one of multiple possible errors by catching them together in a group:
```c3
if (catch excuse = optional1, optional2, foo())
{
    // Detects a missing `value` in `optional1`, `optional2` or `foo()`
    // Each is checked in left-to-right order
    // Any underlying `fault` is assigned to `excuse`
    // foo() is only called if no fault in either `optional1` or `optional2`
}
```

### Detect missing `value` and switch on underlying `fault`

`if (catch)` can also immediately switch on the fault value:
```c3
if (catch excuse = optional_value)
{
    case NoHomework.DOG_ATE_MY_HOMEWORK:
        io::printn("Dog ate your file");
    case IoError.FILE_NOT_FOUND:
        io::printn("File not found");
    default:
        io::printfn("Unexpected fault: %s", excuse);
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
            io::printfn("Unexpected fault: %s", excuse);
            return excuse?;
    }
}
```

### Detect and handle a missing `value` makes it no longer Optional 
If scope is exited inside `if (catch)` afterwards the `optional_value` behaves like a normal variable.
Scope exit is `return`, `break`, `continue` or rethrow `!`.
```c3
int! optional_value = unreliable_function();
if (catch excuse = optional_value) 
{
    return excuse?; // Return fault with `?` operator
}
io::printfn("use optional_value as normal now: %s", optional_value);
```
A helpful shorthand for this is using rethrow `!`
```c3
int optional_value = unreliable_function()!; // rethrow `!` here
io::printfn("use optional_value as normal now: %s", optional_value)!;
```

#### Example returning an Optional `fault` OR `value`
Let's expand this example to something which *may* fail, like opening a file. 

- If the file is not present the `fault` will be `IoError.FILE_NOT_FOUND`.
- If the file is present the `value` will be the first 100 bytes of the file.

Try running this code below with and without a file called `file_to_open.txt` in the same directory.

```c3
import std::io;

/** 
 * Function modifies `buffer` by pointer in the char[] slice
 * Returns optional with `value` of type `void` or a `fault`
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
    return; // return the void `value`
}

fn void! main()
{
    char[] buffer = mem::new_array(char, 100);
    defer free(buffer); // Free memory on scope exit

    // Catch if there's a `fault` returned, store `fault` in `excuse`
    if (catch excuse = read_file("file_to_open.txt", buffer)) 
    {
        io::printfn("fault found: %s", excuse);
        return excuse?; // Returning `fault` using `?` suffix
    }

    // `buffer` unwrapped so like a normal variable here 
    // because missing `value` was handled by scope exit in `if (catch)`
    // Only reached when a file was successfully read
    io::printfn("Buffer read: %s", buffer);
    return;
}
```

## Detect `value` is present 
```c3
// Unwrap the `value` from `optional_value` to be a normal value inside scope
if (try optional_value) 
{
    io::printfn("value found: %s", optional_value);    
} 

// Unwrap and assign `value` from `optional_value` to `unwrapped_value` inside scope
if (try unwrapped_value = optional_value)
{
    io::printfn("value found: %s", unwrapped_value);    
}  
```

For example

```c3
import std::io;

/* Returns optional with `value` of type `int` or a `fault` */
fn int! reliable_function()
{
    return 7; // Return a `value` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result = reliable_function();

    // Unwrap the `value` from reliable_result
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

/* Returns optional with `value` of type `int` or a `fault` */
fn int! reliable_function()
{
    return 7; // Return a `value` of `int`
}

fn void! main(String[] args)
{
    int! reliable_result1 = reliable_function();
    int! reliable_result2 = reliable_function();

    // Unwrap the `value` from reliable_result1 and reliable_result2
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

/* Returns optional with `value` of type `int` or a `fault` */
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

Calling a functions with an Optional arguments will only proceed when **all** of the arguments that are Optional type contain a valid `value`, and therefore no underlying `fault`.

```c3
import std::io;

fn int test(int input, int input2) 
{
    io::printn("test(): inside function body");
    return input;
}

fn void! main(String[] args)
{
    int! first_optional = IoError.FILE_NOT_FOUND?; // Missing `value` and `fault` assigned
    int! second_optional = IoError.NO_PERMISSION?; // Missing `value` and `fault` assigned

    // Arguments are checked left-to-right for a missing `value` 
    // First detected missing `value` causes underlying `fault` to be returned
    // Here `third_optional` was assigned the fault in `first_optional`
    int! third_optional = test(first_optional, second_optional);

    if (catch excuse = third_optional) 
    {
        io::printfn("third_optional fault: %s", excuse); // IoError.FILE_NOT_FOUND
    }
    return;
}
```

## Avoiding unwrapping Optionals

### Getting the `fault` without unwrapping

Retrieving the underlying errors with `if (catch excuse = optional_value) {...}` is not the only way to get the `fault` from an Optional, we can use the macro `@catch` instead.
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    anyfault excuse = @catch(optional_value);
    if (excuse)
    {
        io::printfn("error found: %s", excuse);
    }
    return;
}
```

### Testing for a valid `value` without unwrapping

The `@ok` macro will return `true` if an Optional `value` is present and `false` if not. Functionally this is equivalent to `!@catch`
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    bool successful = @ok(optional_value);
    assert(successful == !@catch(optional_value));
    return;
}
```

## Default assign when detected missing `value` using `??`
If an expression returns a `fault` when assigning an Optional make default assignment using `??` operator.

```c3
import std::io;

int regular_value;
int! optional_value = function_may_error();
if (catch optional_value) // A `fault` was found in optional_value
{   
    regular_value = -1; // Assign default value when fault was found
}
if (try optional_value;) // A `value` was found in optional_value
{
    regular_value = optional_value;
}
```

The operator `??` allows you to assign a default `value` or `fault` when an expression contains a missing `value`:

```c3
// Set default `value` to -1 when foo_may_error() has a missing `value`
int regular_value = foo_may_error() ?? -1;
```

### Distinguish between two function calls that could return the same `fault`

Catch and return another error which is unique, that allows us to tell two similar `fault` origins apart.

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

    // We can tell these appart by default assigning our own unique `fault`
    // Our unique `fault` is assigned only if a `fault` is found
    int c = test() ?? NoHomework.DOG_ATE_MY_HOMEWORK?;
    int d = test() ?? NoHomework.DISTRACTED_BY_CAT_PICTURES?;

    // If you want to return those unique `fault` to the caller, add rethrow `!`
    int e = test() ?? NoHomework.DOG_ATE_MY_HOMEWORK?!;
    int f = test() ?? NoHomework.DISTRACTED_BY_CAT_PICTURES?!;
}
```


## Assert an Optional cannot have a missing `value` and the program should panic with force unwrap `!!`

Sometimes a missing `value` is unexpected or cannot be easily handled, so panic if we detect a missing `value`, this is best used sparingly:
```c3
int! optional_value = foo_may_error();
if (catch excuse = optional_value) 
{
    unreachable("Unexpected fault %s", excuse);
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

Use `if (catch)` to handle a missing `value` or read the `fault`
```c3
fn void! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

if (catch excuse = test()) // Retrieve underlying `fault`
{
    io::printfn("found fault: %s", excuse);
    return excuse?;
}
```
Or use `if (try)` to handle sucessful outcome of having a `value` present
```c3
fn void! test() 
{
    return;
}

if (try test()) // Handle `value` outcome
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

Returning a `fault` looks like a normal return but with a `?` suffix.

Note this function is referenced in future examples.

```c3
fn void! find_file() 
{
    File! optional_file = file::open("file_to_open.txt", "r"); 
    if (catch excuse = optional_file) 
    {
        return excuse?; // `?` suffix returns `fault`
    }
    
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
    // if (catch excuse = find_file()) return excuse?;
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

#### Using `if (catch)` to implicitly unwrap `value` after scope exit

Catching empty `value` and then exiting the `if (catch)` scope via; `return`, `break`, `continue` or rethrow `!` implicitly unwraps the `optional_value` afterwards:
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
 