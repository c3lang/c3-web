---
title: Optionals - Advanced
description: Optionals - Advanced
sidebar:
    order: 115
---

These features are *nice to haves*, you should be able to do what you need mostly using the [standard Optionals features](./optionals_intro.md).

### Optionals are only defined in certain code
✅ Variable declarations
```c3
int! example = unreliable_function();
```
✅ Function return signature
```c3
fn int! example() { ... }
```

## Handling `Empty` Optional


### File reading example 
Let's expand this example to something which *may* fail, like opening a file. 

- If the file is present the `Result` will be the first 100 bytes of the file.
- If the file is not present the `Excuse` will be `IoError.FILE_NOT_FOUND`.

Try running this code below with and without a file called `file_to_open.txt` in the same directory.

```c3
import std::io;

/** 
 * Function modifies `buffer`
 * Returns Optional with `Result` of type `char[]` or an `Excuse`
**/
fn char[]! read_file(String filename, char[] buffer)
{
    // Return `Excuse` if failed opening file, using rethrow `!`
    File! file = file::open(filename, "r")!; 

    // At scope exit, close the file if it was opened successfully
    // Discard the `Excuse` from file.close() with (void) cast
    defer (void)file.close(); 

    // Return `Excuse` if failed to read file, using rethrow `!`
    file.read(buffer)!; 
    return buffer; // return the buffer `Result`
}

fn void! main()
{
    char[] buffer = mem::new_array(char, 100);
    defer free(buffer); // Free memory on scope exit

    // Catch missing `Result` with an underlying `Excuse` defined, assign to `excuse`
    char[]! read_buffer = read_file("file_to_open.txt", buffer);
    if (catch excuse = read_buffer) 
    {
        io::printfn("Excuse found: %s", excuse);
        return excuse?; // Returning `Excuse` using `?` suffix
    }

    // `read_buffer` behaves like a normal variable here 
    // because missing `Result` was handled by scope exit in `if (catch)`
    io::printfn("read_buffer: %s", read_buffer);
}
```

### Using force unwrap `!!` to panic on `Empty` Optional

The force unwrap `!!` will issue a panic and exit the program if Optional is `Empty`.

```c3
fn void find_file_and_test()
{
    find_file()!!;

    // Force unwrap `!!` runs the following:
    // if (catch find_file()) unreachable("Unexpected excuse");
}
```

### Find `Empty` Optional without reading `Excuse` 
```c3
import std::io;
int! optional_value = IoError.FILE_NOT_FOUND?;

// Find `Empty` Optional handling inside scope
if (catch optional_value) 
{
    io::printn("Found `Empty` Optional, the `Excuse` was not read");
} 
```

### Find `Empty` Optional and switch on `Excuse`

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

## Find `Result` is present 
This is a convenience method, the logical inverse of [`if (catch)`](./optionals/#checking-if-an-optional-is-empty) and is helpful when you don't care about the `Empty` Optional branch of the code or wish to perform an early return.
```c3
// Unwrap the `Result` from `optional_value` to be a normal variable inside scope
if (try optional_value) 
{
    io::printfn("Result found: %s", optional_value);    
} 

// Unwrap and assign `Result` from `optional_value` to `unwrapped_value` inside scope
if (try unwrapped_value = optional_value)
{
    io::printfn("Result found: %s", unwrapped_value);    
}  
```

For example

```c3
import std::io;

// Returns optional with `Result` of type `int` or an `Excuse`
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
It is possible to add conditions to an `if (try)` but they must be 
joined with `&&`. Logical OR (`||`) conditions are **not** allowed:
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

## Shorthands to work with Optionals

### Getting the `Excuse`

Retrieving the `Excuse` with `if (catch excuse = optional_value) {...}` is not the only way to get the `Excuse` from an Optional, we can use the macro `@catch` instead.
```c3
fn void! main(String[] args)
{
    int! optional_value = IoError.FILE_NOT_FOUND?;
    
    anyfault excuse = @catch(optional_value);
    if (excuse)
    {
        io::printfn("Excuse found: %s", excuse);
    }
}
```

### Check Optional has a `Result` without unwrapping

The `@ok` macro will return `true` if an Optional `Result` is present and `false` if not. Functionally this is equivalent to `!@catch`
```c3
fn void! main(String[] args)
{
    int! optional_value = 7;
    
    bool result_found = @ok(optional_value);
    assert(result_found == !@catch(optional_value));
}
```

### Assert an Optional cannot have a missing `Result` and the program should panic with force unwrap `!!`

If an `Empty` Optional is unexpected or cannot be easily handled we can panic, use sparingly:
```c3
int! optional_value = foo_may_error();
if (catch excuse = optional_value) 
{
    unreachable("Unexpected excuse %s", excuse);
}
// Now optional_value is a regular variable
```

The force unwrap operator `!!` will exit the program if a `Excuse` is returned from `foo_may_error()`.
```c3
int regular_value = foo_may_error()!!;
```

## No void! variables

The `void!` type has no possible representation as a variable, and may
only be a function return type. 

Use `if (catch)` to handle an `Empty` Optional or read the `Excuse`
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
Or use `if (try)` to handle `Result` in Optional
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
Store the `Excuse` returned from a `void!` function without `if (catch foo = optional_value)`, use the `@catch` macro to convert the result to an `anyfault`:
```c3
fn void! test() 
{
    return IoError.FILE_NOT_FOUND?;
}

anyfault excuse = @catch(test());
```


## Default assign when Optional is `Empty` using `??`
If an expression returns a `Empty` Optional default assign using `??` operator.

```c3
import std::io;

int regular_value;
int! optional_value = function_may_error();
if (catch optional_value) // A `Empty` Optional found in optional_value
{   
    regular_value = -1; // Assign default `Result` when `Empty` Optional
}

if (try optional_value;) // A `Result` was found in optional_value
{
    regular_value = optional_value;
}
```

The operator `??` allows you to assign a default `Result` or `Excuse` when an expression contains a missing `Result`:

```c3
// Set default `Result` to -1 when `foo_may_error()` returns an `Empty` Optional
int regular_value = foo_may_error() ?? -1;
```

### Signpost the unique origin of the same `Excuse`

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


 