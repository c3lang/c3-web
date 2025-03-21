---
title: Defer and Cleanup
description: Defer and Cleanup
sidebar:
    order: 66
---

# Defer 

A `defer` *always* runs at the [end of a scope](#end-of-a-scope) at any point *after* it is declared, `defer` is commonly used to simplify code that needs clean-up; like closing unix file descriptors, freeing dynamically allocated memory or closing database connections.

### End of a scope
The end of a scope also includes `return`, `break`, `continue` or [rethrow `!`](/language-common/optionals-essential/#using-the-rethrow-operator--to-unwrap-an-optional-value). 

```c3
fn void test() 
{
    io::printn("print first");
    defer io::printn("print third, on function return");
    io::printn("print second");
    return;
}
```
The `defer` runs **after** the other print statements, at the function return.

:::note
[Rethrow `!`](/language-common/optionals-essential/#using-the-rethrow-operator--to-unwrap-an-optional-value) unwraps the Optional result if present, afterwards the previously Optional variable is a normal variable again, if the Optional result is empty then the Excuse is returned from the function back to the caller.
:::

### Defer Execution order
When there are multiple `defer` statements they are executed in reverse order of their declaration, last-to-first declared. 

```c3
fn void test() 
{
    io::printn("print first");
    defer io::printn("print third, defers execute in reverse order");
    defer io::printn("print second, defers execute in reverse order");
    return;
}
```

### Example defer

```c3
import std::io;

fn char[]! file_read(String filename, char[] buffer)
{   
    // return Excuse if failed to open file
    File file = file::open(filename, "r")!; 

    defer { 
        io::printn("File was found, close the file"); 
        if (catch excuse = file.close()) 
        {
            io::printfn("Fault closing file: %s", excuse); 
        }
    }

    // return if fault reading the file into the buffer
    file.read(buffer)!; 
    return buffer;
}
```

If the file named `filename` is found the function will read the content into a buffer, 
`defer` will then make sure that any open `File` handlers are closed. 
Note that if a scope exit happens before the `defer` declaration, the `defer` will not run, this a useful property because if the file failed to open, we don't need to close it.


## `defer try`

A `defer try` is called at [end of a scope](#end-of-a-scope) when the returned [Optional contained a result](/language-common/optionals-essential/#what-is-an-optional) value.

### Examples

```c3
fn void! test() 
{
    defer try io::printn("✅ defer try run"); 
    // Returned an Optional result
    return;
}

fn void main(String[] args) 
{
    (void)test();
}
```
Function returns an [Optional result](/language-common/optionals-essential/#what-is-an-optional) value, 
this means `defer try` runs on [scope exit](#end-of-a-scope).

```c3
fn void! test() 
{
    defer try io::printn("❌ defer try not run");
    // Returned an Optional Excuse
    return IoError.FILE_NOT_FOUND?;
}

fn void main(String[] args) 
{
    if (catch err = test()) 
    {
        io::printfn("test() returned a fault: %s", err);
    }
}
```
Function returns an [Optional Excuse](/language-common/optionals-essential/#what-is-an-optional), 
this means the `defer try` does *not* run on [scope exit](#end-of-a-scope).

## `defer catch`

A `defer catch` is called at [end of a scope](#end-of-a-scope) when exiting exiting with an 
[Optional Excuse](/language-common/optionals-essential/#what-is-an-optional), and is helpful for logging, cleanup and freeing resources.
 

```c3
defer catch { ... }
```

```c3
defer (catch err) { ... };
```
When the fault is captured this is convenient for logging the fault:

```c3
defer (catch err) io::printfn("fault found: %s", err)
```
### Memory allocation example

```c3
import std::core::mem;

fn char[]! test()
{
    char[] data = mem::new_array(char, 12)!;
    
    defer (catch err) 
    {
        io::printfn("Excuse found: %s", err)
        (void)free(data);
    }

    // Returns Excuse, memory gets freed
    return IoError.FILE_NOT_FOUND?; 
}
```

:::caution[Pitfalls with `defer` and `defer catch`]
If cleaning up memory allocations or resources make sure the `defer` or `defer catch` 
are declared as close to the resource declaration as possible. 
This helps to avoid unwanted memory leaks or unwanted resource usage from other code [rethrowing `!`](/language-common/optionals-essential/#using-the-rethrow-operator--to-unwrap-an-optional-value) before the `defer catch` was even declared. 

```c3
fn void! function_throws() 
{
    return IoError.FILE_NOT_FOUND?;
}

fn String! test()
{
    char[] data = mem::new_array(char, 12)!;
    
    // ❌ Before the defer catch declaration
    // memory was NOT freed
    // function_throws()!;  

    defer (catch err) 
    {
        io::printn("freeing memory");
        (void)free(data);
    }

    // ✅ After the defer catch declaration
    // memory freed correctly
    function_throws()!;     

    return (String)data; 
}
```
:::
