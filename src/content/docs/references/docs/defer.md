---
title: Defer and Cleanup
description: Defer and Cleanup
sidebar:
    order: 114
---

# Defer 

A `defer` *always* runs at the [end of a scope](#end-of-a-scope) at any point *after* it is declared, `defer` is commonly used to simplify code that needs clean-up; like closing unix file descriptors, freeing dynamically allocated memory or closing database connections.

### End of a scope
The end of a scope also includes `return`, `break`, `continue` or `!` rethrow. 

[Rethrow](../optionals/#using-the-rethrow-operator--to-unwrap-an-optional-value) `!` unwraps the optional, making it a normal variable again if [successful](../optionals), and if unsuccessful it returns the [fault](../optionals) from the function back to the caller.

```c3
fn void test() 
{
    io::printn("print first");
    defer io::printn("print third, on function return");
    io::printn("print second");
    return;
}
```

The `defer` runs **after** the other print statments, at the function return.

### Defer Execution order
When there are multiple `defer` statements they are executed in reverse order of their declaration, last-to-first decalared. 


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
    File! file = file::open(filename, "r")!; // return if fault opening file
    defer { 
        io::printn("File was found, close the file"); 
        if (catch err = file.close()) io::printfn("Fault closing file: %s", fault); 
    }

    file.read(buffer)!; // return if fault reading the file into the buffer
    return buffer;
}
```

If the file named `filename` is found the function will read the content into a buffer, `defer` will then make sure that any open `File` handlers are closed. 
Note that if a scope exit happens before the `defer` declaration, the `defer` will not run, this a useful property because if the file failed to open, we don't need to close it.


## Defer try

A `defer try` is called at [end of a scope](#end-of-a-scope) when exiting with a [successful](../optionals) value.


### Examples

```c3
fn void test() 
{
    defer try io::printn("✅ defer try was run, a success was returned"); 
    return;
}

fn void! main(String[] args) 
{
    test();
}
```

Function returns a [successful](../optionals) value, `defer try` runs on [scope exit](#end-of-a-scope).

```c3
fn void! test() 
{
    defer try io::printn("❌ defer try not run, a fault was returned");
    return IoError.FILE_NOT_FOUND?;
}

fn void! main(String[] args) 
{
    if (catch err = test()) {
        io::printfn("test() returned a fault: %s", err);
    }
}
```

Function returns a [fault](../optionals), `defer try` does not run on [scope exit](#end-of-a-scope).



## Defer catch

A `defer catch` is called at [end of a scope](#end-of-a-scope) when exiting exiting with a [fault](../optionals), and is helpful for cleanup and freeing resources.
 

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
fn String! test()
{
    char[] data = mem::new_array(char, 12)!;
    defer (catch err) 
    {
        io::printfn("fault found: %s", err)
        (void)free(data);
    }
    return IoError.FILE_NOT_FOUND?; // returns fault, memory gets freed
}
```

## Pitfalls with defer and defer catch
If cleaning up memory allocations or resources make sure the `defer` or `defer catch` are declared as close to the resource declaration as possible. This helps to avoid unwanted memory leaks or unwanted resource usage from other code [rethrowing](../optionals/#using-the-rethrow-operator--to-unwrap-an-optional-value) `!` before the `defer catch` declaration. 

```c3
fn void! function_throws() 
{
    return IoError.FILE_NOT_FOUND?;
}

fn String! test()
{
    char[] data = mem::new_array(char, 12)!;
    // function_throws()!;  // ❌ Before the defer catch declaration, memory was NOT freed
    defer (catch err) 
    {
        io::printn("freeing memory");
        (void)free(data);
    }
    function_throws()!;     // ✅ After the defer catch declaration, memory freed correctly

    return (String)data; 
}
```


