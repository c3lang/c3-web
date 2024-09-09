---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 114
---

## What is an Optional? 

Optionals are a safer alternative to returning `-1` or `null` from a function, when a valid value can't be returned. An Optional has either a `Result` or is `Empty`. When an Optional is `Empty` it has an `Excuse` about what happened. 

- For example trying to open a missing file returns the `Excuse` of `IoError.FILE_NOT_FOUND`.
- Optionals are declared by adding `!` after the type.
- An `Excuse` is of type `anyfault`.
```c3
int! a = 1; // Optional `Result`
```
Optional `Excuse` is set with `?` after the value.
```c3
int! b = IoError.FILE_NOT_FOUND?; // Optional `Excuse`
```

## Checking if an Optional is `Empty` 

```c3
import std::io;

fn void! test()
{
    // Return an `Excuse` using `?` after the value
    return IoError.FILE_NOT_FOUND?; 
}

fn void! main(String[] args)
{
    // Catch Optional is `Empty` read the `Excuse` 
    if (catch excuse = test())
    {
        io::printfn("test() gave an Excuse: %s", excuse);
        return excuse?; // Returning `Excuse` using `?` after value
    }
}
```

### After checking `Optional` is not `Empty` we must have a `Result` present

We must exit the scope in the `if (catch)` via a `return`, `break`, `continue` 
or rethrow `!` and if execution gets past the `if (catch)` block the `Optional` then behaves like a normal variable.
```c3
fn void! test() 
{
    int! foo = unreliable_function();
    if (catch excuse = foo) 
    {
        return excuse?; // Return `Excuse` with `?` operator
    }
    // `foo` a normal variable here
    io::printfn("foo: %s", foo); // 7
}
```
### Rethrow `!` shorthand validates the Optional `Result`

- Rethrow `!` is a shorthand for `if (catch excuse = foo) return excuse?;`
- After Rethrow `!` the variable can be used as normal, the `Result` was proven valid.

```c3
import std::io;

fn void! main() 
{
    int! foo = 7; // Optional with a `Result` present
    io::printfn("foo: %s", foo)!; // Rethrow `!` function call

    int bar = foo!; // Rethrow `!` assignment
    io::printfn("bar: %s", bar);
}
```

## Optionals affect types and control flow

### Optionals in expressions produce Optionals
Use an Optional anywhere in an expression the outcome will be an Optional too.
```c3
import std::io;

fn void! main(String[] args)
{
    // Returns optional with `Result` of type `int` or an `Excuse`
    int! first_optional = 7;

    // This is optional too:
    int! second_optional = first_optional + 1;

    // Printing by unwrapping optional with rethrow `!`: 
    io::printn(second_optional)!;  
}
```

### Optionals affect function return types

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

    // `optional_argument` makes returned `returned_optional` 
    // Optional too: 
    int! returned_optional = test(optional_argument);
}
```

### Functions may not run when called with Optional arguments

Calling a function with an Optionals as arguments, return first `Excuse` found looking left-to-right. Function excuted if all function arguments which are Optional type have `Result` present.

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
    int! second_optional = 7;

    // Return first `Excuse` we find
    int! third_optional = test(first_optional, second_optional);
    if (catch excuse = third_optional) 
    {
        // excuse == IoError.FILE_NOT_FOUND
        io::printfn("third_optional's Excuse: %s", excuse); 
    }
}
```

## Interfacing with C

For C the interface to C3, the `Excuse` of type `anyfault` is returned as the regular return while the result is passed by reference:

C3 code:
```c3
fn int! get_value();
```
Corresponding C code:
```c
c3fault_t get_value(int *value_ref);
```
The `c3fault_t` is guaranteed to be a pointer sized value.