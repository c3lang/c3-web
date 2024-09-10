---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 114
---

## What is an Optional? 

Optionals are a safer alternative to returning `-1` or `null` from 
a function, when a valid value can't be returned. An Optional 
has either a *result* or is *empty*. When an Optional 
is empty it has an `Excuse` explaining what happened. 

- For example trying to open a missing file returns the `Excuse` of `IoError.FILE_NOT_FOUND`.
- Optionals are declared by adding `!` after the type.
- An `Excuse` is of the type `anyfault`.
```c3
int! a = 1; // Set the Optional to a result
```
The Optional `Excuse` is set with `?` after the value.
```c3
// Set the Optional to empty with a specific Excuse.
int! b = IoError.FILE_NOT_FOUND?; 
```

## Checking if an Optional is *empty* 

```c3
import std::io;

fn void! test()
{
    // Return an 'Excuse' by adding '?' after the fault.
    return IoError.FILE_NOT_FOUND?; 
}

fn void main(String[] args)
{
    // If the Optional is empty, assign the
    // 'Execuse' to a variable: 
    if (catch ex = test())
    {
        io::printfn("test() gave an Excuse: %s", ex);
    }
}
```

### Implicitly unwapping an Optional result

If we escape the current scope from an `if (catch my_var)` using a `return`, `break`, `continue` 
or [rethrow](#rethrow--shorthand-validates-the-optional-result) `!`,
then the variable is implicitly non-optional:
```c3
fn void! test() 
{
    int! foo = unreliable_function();
    if (catch ex = foo) 
    {
        return ex?; // Return the 'Excuse' with `?` operator
    }
    // Because the compiler knows 'foo' cannot
    // be empty here, it will unwrap it to a regular
    // 'int foo' in this scope:
    io::printfn("foo: %s", foo); // 7
}
```
### Using the rethrow `!` to unwrap an Optional value

- Rethrow `!` will return from the function with the `Execuse` if an expression is *empty*.
- The resulting value will be non-optional. 

```c3
import std::io;

// Function returning an Optional
fn int! maybe_func() { /* ... */ }

fn void! main() 
{
    // Error, maybe_function() returns an Optional
    // and 'bar' is not optional:
    // int bar = maybe_function();
    
    int bar = maybe_function()!; 
    // The above is equivalent to:    
    // int! __temp = maybe_function();
    // if (catch ex = temp) return ex?
    // int bar = __temp; // Ok, because __temp is unwrapped
}
```

## Optionals affect types and control flow

### Optionals in expressions produce Optionals
Use an Optional anywhere in an expression the resulting
expression will be an Optional too.
```c3
import std::io;

fn void! main(String[] args)
{
    // Returns optional with `Result` of type `int` or an `Excuse`
    int! first_optional = 7;

    // This is optional too:
    int! second_optional = first_optional + 1;
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

### Functions conditionally run when called with Optional arguments

When calling a function with an Optionals as arguments, 
the result will be the first `Excuse` found looking left-to-right. 
The function is only executed if all Optional arguments
have *results*.

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

For C the interface to C3, the `Excuse` of type `anyfault` 
is returned as the regular return while the result is passed by reference:

C3 code:
```c3
fn int! get_value();
```
Corresponding C code:
```c
c3fault_t get_value(int *value_ref);
```
The `c3fault_t` is guaranteed to be a pointer sized value.