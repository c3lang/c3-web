---
title: Advanced Error Handling
description: Advanced Error Handling
sidebar:
    order: 65
---

### Optionals are only defined in certain code
✅ Variable declarations
```c3
int? example = unreliable_function();
```
✅ Function return signature
```c3
fn int? example() { /* ... */ }
```

## Handling an empty Optional

### File reading example
- If the file is present, the Optional result will be the first 100 bytes of the file.
- If the file is not present, the Optional `Excuse` (the `fault`) will be `io::FILE_NOT_FOUND`.

Try running this code below with and without a file called `file_to_open.txt` in the same directory.

```c3
import std::io;

<*
 Function modifies 'buffer'
 Returns an Optional with a 'char[]' result
 OR an empty Optional with an Excuse
*>
fn char[]? read_file(String filename, char[] buffer)
{
    // Return Excuse if opening a file failed, using Rethrow `!`
    File file = file::open(filename, "r")!;

    // At scope exit, close the file.
    // Discard the Excuse from file.close() with (void) cast
    defer (void)file.close();

    // Return Excuse if reading failed, using Rethrow `!`
    file.read(buffer)!;
    return buffer; // return a buffer result
}

fn void? test_read()
{
    char[] buffer = mem::new_array(char, 100);
    defer free(buffer); // Free memory on scope exit

    char[]? read_buffer = read_file("file_to_open.txt", buffer);
    // Catch the empty Optional and assign the Excuse
    // to `excuse`
    if (catch excuse = read_buffer)
    {
        io::printfn("Excuse found: %s", excuse);
        // Returning Excuse using the `?` suffix
        return excuse?;
    }

    // `read_buffer` behaves like a normal variable here
    // because the Optional being empty was handled by 'if (catch)'
    // which automatically unwrapped 'read_buffer' at this point.
    io::printfn("read_buffer: %s", read_buffer);
}

fn void main()
{
    test_read()!!; // Panic on failure.
}
```

### Return a default value if Optional is empty
The `??` operator allows us to return a default value if the Optional is empty.
```c3
import std::io;

fn void test_bad()
{
    int regular_value;
    int? optional_value = function_may_error();

    // An empty Optional found in optional_value
    if (catch optional_value)
    {
        // Assign default result when empty.
        regular_value = -1;
    }

    // A result was found in optional_value
    if (try optional_value)
    {
        regular_value = optional_value;
    }
    io::printfn("The value was: %d", regular_value);
}

fn void test_good()
{
    // Return '-1' when `foo_may_error()` is empty.
    int regular_value = foo_may_error() ?? -1;

    io::printfn("The value was: %d", regular_value);
}
```

#### Modifying the returned Excuse

A common use of `??` is to catch an empty Optional and change
the `Excuse` to another more specific `Excuse`, which
allows us to distinguish one failure from the other,
even when they had the same `Excuse` originally.

```c3
import std::io;

faultdef DOG_ATE_HOMEWORK, TEXTBOOK_ON_FIRE;

fn int? test()
{
    return io::FILE_NOT_FOUND?;
}

fn void? examples()
{
    int? a = test(); // io::FILE_NOT_FOUND
    int? b = test(); // io::FILE_NOT_FOUND

    // We can tell these apart by default assigning our own unique
    // Excuse. Our custom Excuse is assigned only if an
    // empty Optional is returned.
    int? c = test() ?? DOG_ATE_HOMEWORK?;
    int? d = test() ?? TEXTBOOK_ON_FIRE?;

    // If you want to immediately return with an Excuse,
    // use the "?" and "!" operators together, see the code below:
    int? e = test() ?? DOG_ATE_HOMEWORK?!;
    int? f = test() ?? TEXTBOOK_ON_FIRE?!;
}
```

### Force unwrapping expressions

The force [unwrap](/language-common/optionals-essential/#-unwrapping-an-optional) operator `!!` will
make the program panic and exit if the expression is an empty optional.
This is useful when the error should – in normal cases – not happen
and you don't want to write any error handling for it.
That said, it should be used with great caution in production code.

```c3
fn void find_file_and_test()
{
    find_file()!!;

    // Force unwrap '!!' is roughly equal to:
    // if (catch find_file()) unreachable("Unexpected excuse");
}
```

### Find empty Optional without reading the Excuse

```c3
import std::io;
fn void test()
{
    int? optional_value = io::FILE_NOT_FOUND?;

    // Find empty Optional, then handle inside scope
    if (catch optional_value)
    {
        io::printn("Found empty Optional, the Excuse was not read");
    }
}
```

## Run code if the Optional has a result
This is a convenience method, the logical inverse of
[`if (catch)`](/language-common/optionals-essential/#checking-if-an-optional-is-empty)
and is helpful when you don't care about the empty branch of
the code or you wish to perform an early return.
```c3
fn void test()
{
    // 'optional_value' is a non-Optional variable inside the scope
    if (try optional_value)
    {
        io::printfn("Result found: %s", optional_value);
    }

    // The Optional result is assigned to 'unwrapped_value' inside the scope
    if (try unwrapped_value = optional_value)
    {
        io::printfn("Result found: %s", unwrapped_value);
    }
}
```

Another example:

```c3
import std::io;

// Returns Optional result with `int` type or empty with an Excuse
fn int? reliable_function()
{
    return 7; // Return a result
}

fn void main(String[] args)
{
    int? reliable_result = reliable_function();

    // Unwrap the result from reliable_result
    if (try reliable_result)
    {
        // reliable_result is unwrapped in this scope, can be used as normal
        io::printfn("reliable_result: %s", reliable_result);
    }
}
```
It is possible to add conditions to an `if (try)` but they must be
joined with `&&`. However you **cannot** use logical OR (`||`) conditions:
```c3
import std::io;

// Returns Optional with an 'int' result or empty with an Excuse
fn int? reliable_function()
{
    return 7; // Return an Optional result
}

fn void main(String[] args)
{
    int? reliable_result1 = reliable_function();
    int? reliable_result2 = reliable_function();

    // Unwrap the result from reliable_result1 and reliable_result2
    if (try reliable_result1 && try reliable_result2 && 5 > 2)
    {
        // `reliable_result1` can be used as a normal variable here.
        io::printfn("reliable_result1: %s", reliable_result1);

        // `reliable_result2` can be used as a normal variable here.
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

### Getting the Excuse

Retrieving the `Excuse` with [`if (catch excuse = optional_value) {...}`](/language-common/optionals-essential/#checking-if-an-optional-is-empty)
is not the only way to get the `Excuse` from an Optional, we can use the macro `@catch` instead.
Unlike `if (catch)` this will never cause automatic [unwrapping](/language-common/optionals-essential/#-unwrapping-an-optional).

```c3
fn void main(String[] args)
{
    int? optional_value = io::FILE_NOT_FOUND?;

    fault excuse = @catch(optional_value);
    if (excuse)
    {
        io::printfn("Excuse found: %s", excuse);
    }
}
```

### Checking if an Optional has a result without unwrapping

The `@ok` macro will return `true` if an Optional result is present and
`false` if the Optional is empty.
Functionally this is equivalent to [`!@catch`](#getting-the-excuse), meaning no Excuse was found, for example:

```c3
fn void main(String[] args)
{
    int? optional_value = 7;

    bool result_found = @ok(optional_value);
    assert(result_found == !@catch(optional_value));
}
```

## No void? variables

The `void?` type has no possible representation as a variable, and may
only be a function return type.

:::note
The main function cannot return an optional.
:::

To store the `Excuse` returned from a `void?` function without
[`if (catch foo = optional_value)`](/language-common/optionals-essential/#checking-if-an-optional-is-empty),
use the [`@catch`](#getting-the-excuse) macro to convert the Optional to a `fault`:
```c3
fn void? test()
{
    return io::FILE_NOT_FOUND?;
}

fault excuse = @catch(test());
```
