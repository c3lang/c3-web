---
title: Essential Error Handling
description: Essential Error Handling
sidebar:
    order: 64
---

In this section we will go over the *essential* information about Optionals and safe methods for working with them. For example, this page covers [`if (catch optional_value)`](#checking-if-an-optional-is-empty) and the [Rethrow operator `!`](#using-the-rethrow-operator--to-unwrap-an-optional-value), among other things.

In the [advanced section](/language-common/optionals-advanced/) (the next website page after this one), there are other *nice to have* features that will be covered, such as: an alternative to safely unwrap a result from an Optional using [`if (try optional_value)`](/language-common/optionals-advanced/#run-code-if-the-optional-has-a-result), an unsafe method to [force unwrap `!!`](/language-common/optionals-advanced/#force-unwrapping-expressions) a result from an Optional, return [default values for optionals `??`](/language-common/optionals-advanced/#return-a-default-value-if-optional-is-empty) if they are empty (i.e. if they contain a `fault`) and other more specialised concepts.

## What is an Optional?

Optionals are a safer alternative to returning -1 or null from a function when a valid value can’t be returned (as is commonly done in C and elsewhere, but which is often a messy and error-prone approach). Optionals offer a cleaner and much more generalized way of indicating such unavailable (i.e. out of domain or out of range) or erroneous return values and communicate intent far better. 

When an Optional is "empty", it has an `Excuse` (a `fault`) explaining what happened.

- For example, trying to open a missing file returns the `Excuse` (the `fault`) `io::FILE_NOT_FOUND`.
- Optionals are declared by adding `?` after the intended normal (valid, non-`fault`) type of the Optional. So, for example, to represent an integer that is sometimes unrepresentable due to the presence of a `fault`, you would write its type as `int?`.
- `@catch` can be used to retrieve the `fault` (if any) from an Optional's `Excuse`.
```c3
int? a = 1; // Set the Optional to a result
```
An Optional's `Excuse` (the `fault`) is set by writing `?` after the `fault` value.
```c3
// Set the Optional to empty with a specific Excuse.
int? b = io::FILE_NOT_FOUND?;
```

## 🎁 Unwrapping an Optional
:::note

Unwrapping an Optional is safe because the language checks whether the Optional has a ("non-empty", non-`fault` &mdash; hence representable as intended) result present before trying to use it. Used properly, this enables easy handling of special cases.

After unwrapping, the variable then behaves like a normal variable: a non-Optional.
:::

## Checking if an Optional is empty

```c3
import std::io;

fn void? test()
{
    // Return an Excuse by adding '?' after the fault.
    return io::FILE_NOT_FOUND?;
}

fn void main(String[] args)
{
    // If the Optional is empty, assign the
    // Excuse to a variable:
    if (catch excuse = test())
    {
        io::printfn("test() gave an Excuse: %s", excuse);
    }
}
```

### Automatically unwrapping an Optional result

If we escape the current scope from an `if (catch my_var)` using a `return`, `break`, `continue`
or [Rethrow](#using-the-rethrow-operator--to-unwrap-an-optional-value) `!`,
then the variable is automatically [unwrapped](#-unwrapping-an-optional) to a non-Optional:
```c3
fn void? test()
{
    int? foo = unreliable_function();
    if (catch excuse = foo)
    {
        // Return the excuse with the `?` operator,
        // converting it from a `fault` back into an Optional.
        return excuse?;
    }
    // Because the compiler knows 'foo' cannot
    // be empty here, it is unwrapped to non-Optional
    // 'int foo' in this scope:
    io::printfn("foo: %s", foo); // 7
}
```
### Using the Rethrow operator `!` to unwrap an Optional value

- The Rethrow operator `!` will return from the function with the `Excuse` if the Optional result is empty.
- The resulting value will be [unwrapped](#-unwrapping-an-optional) to a non-Optional.

```c3
import std::io;

// Function returning an Optional
fn int? maybe_func() { /* ... */ }

fn void? test()
{
    // int bar = maybe_func();
    // ❌ The above would be a compile error
    // because `maybe_func()` returns an Optional
    // and `bar` is just an `int`, not an Optional `int?`.

    int bar = maybe_func()!;
    // ✅ The above is equivalent to:
    // int bar;
    // {
    //   int? temp = maybe_func();
    //   if (catch excuse = temp) { return excuse?; }
    //   else { bar = temp; }
    //}
}
```

## ⚠️ Optionals affect types and control flow

### Optionals in expressions produce Optionals
If you use an Optional anywhere in an expression then the resulting
expression will be an Optional too.
```c3
import std::io;

fn void main(String[] args)
{
    // Returns Optional with result of type `int` or an Excuse
    int? first_optional = 7;

    // This is Optional too:
    int? second_optional = first_optional + 1;
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

fn void main(String[] args)
{
    int? optional_argument = 7;

    // `optional_argument` makes returned `returned_optional`
    // Optional too:
    int? returned_optional = test(optional_argument);
}
```

### Functions conditionally run when called with Optional arguments

When calling a function with an Optional as an argument,
the result will be the first Excuse found looking left-to-right through the function call's argument list. The function is only executed if all Optional arguments have normal results (i.e. don't contain `fault`s). This ensures orderly handling of "errors" and special cases before calls.

```c3
import std::io;

fn int test(int input, int input2)
{
    io::printn("test(): inside function body");
    return input;
}

fn void main(String[] args)
{
    int? first_optional = io::FILE_NOT_FOUND?;
    int? second_optional = 7;

    // Return first excuse we find
    int? third_optional = test(first_optional, second_optional);
    if (catch excuse = third_optional)
    {
        // excuse == io::FILE_NOT_FOUND
        io::printfn("third_optional's Excuse: %s", excuse);
    }
}
```

## Interfacing with C

To create functions in C that properly interface with C3's Optional system whenever a C function needs to return a C3 Optional of type `T?`:

- The C function must return `c3fault_t` (not `T`), which corresponds to the potential `Excuse` (the `fault`) of the C3 Optional.
- Simultaneously, the actual value of the Optional of C3 type `T?` (if any) must be set via an output pointer of C type `T*`.

For example:


```c3
// C3 code:
fn int? get_value();
```

```c
// Corresponding C code:
c3fault_t get_value(int *value_ref);
```
The `c3fault_t` is guaranteed to be a pointer sized value.
