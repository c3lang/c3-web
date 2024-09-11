---
title: Optionals and Error Handling
description: Optionals and Error Handling
sidebar:
    order: 114
---

## What is an Optional? 

Optionals are a safer alternative to returning `-1` or `null` from 
a function, when a valid value can't be returned. An Optional 
has either a “Result” or is “Empty”. When an Optional 
is “Empty” it has an ”Excuse” explaining what happened. 

- For example trying to open a missing file returns the ”Excuse” of `IoError.FILE_NOT_FOUND`.
- Optionals are declared by adding `!` after the type.
- An ”Excuse” is of the type `anyfault`.
```c3
int! a = 1; // Set the Optional to a “Result”
```
The Optional “Excuse” is set with `?` after the value.
```c3
// Set the Optional to “Empty” with a specific “Excuse”.
int! b = IoError.FILE_NOT_FOUND?; 
```

## 🎁 Unwrapping an Optional
:::note

Unwrapping an Optional is safe because it checks it has a 
“Result” present before trying to use it.

After unwrapping a variable is a non-Optional, and behaves 
like a normal variable.
:::

## Checking if an Optional is “Empty” 

```c3
import std::io;

fn void! test()
{
    // Return an “Excuse” by adding '?' after the fault.
    return IoError.FILE_NOT_FOUND?; 
}

fn void main(String[] args)
{
    // If the Optional is “Empty”, assign the
    // “Excuse” to a variable: 
    if (catch excuse = test())
    {
        io::printfn("test() gave an Excuse: %s", excuse);
    }
}
```

### Automatically unwrapping an Optional “Result”

If we escape the current scope from an `if (catch my_var)` using a `return`, `break`, `continue` 
or [Rethrow](#using-the-rethrow-operator--to-unwrap-an-optional-value) `!`,
then the variable is automatically [unwrapped](#unwrapping-an-optional) to a non-Optional:
```c3
fn void! test() 
{
    int! foo = unreliable_function();
    if (catch excuse = foo) 
    {
        // Return the “Excuse” with `?` operator
        return excuse?;
    }
    // Because the compiler knows 'foo' cannot
    // be “Empty” here, it is unwrapped to non-Optional
    // 'int foo' in this scope:
    io::printfn("foo: %s", foo); // 7
}
```
### Using the Rethrow operator `!` to unwrap an Optional value

- The Rethrow operator `!` will return from the function with the “Excuse” if an expression is “Empty”.
- The resulting value will be [unwrapped](#unwrapping-an-optional) to a non-Optional. 

```c3
import std::io;

// Function returning an Optional
fn int! maybe_func() { /* ... */ }

fn void! main() 
{
    // ❌ This will be a compile error
    // maybe_function() returns an Optional
    // and 'bar' is not declared Optional:
    // int bar = maybe_function();
    
    int bar = maybe_function()!; 
    // ✅ The above is equivalent to:    
    // int! temp = maybe_function();
    // if (catch excuse = temp) return excuse?

    // Now temp is unwrapped to a non-Optional
    int bar = temp; // ✅ This is OK
}
```

## ⚠️ Optionals affect types and control flow

### Optionals in expressions produce Optionals
Use an Optional anywhere in an expression the resulting
expression will be an Optional too.
```c3
import std::io;

fn void! main(String[] args)
{
    // Returns Optional with “Result” of type `int` or an “Excuse”
    int! first_optional = 7;

    // This is Optional too:
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
the “Result” will be the first “Excuse” found looking left-to-right. 
The function is only executed if all Optional arguments
have a “Result”.

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

    // Return first “Excuse” we find
    int! third_optional = test(first_optional, second_optional);
    if (catch excuse = third_optional) 
    {
        // excuse == IoError.FILE_NOT_FOUND
        io::printfn("third_optional's Excuse: %s", excuse); 
    }
}
```

## Interfacing with C

For C the interface to C3, the “Excuse” of type `anyfault` 
is returned as the regular return while the “Result” is passed by reference:

C3 code:
```c3
fn int! get_value();
```
Corresponding C code:
```c
c3fault_t get_value(int *value_ref);
```
The `c3fault_t` is guaranteed to be a pointer sized value.