---
title: Contracts
description: Contracts
sidebar:
    order: 66
---

Contracts are optional pre- and post-conditions checks that the compiler may use for optimization and runtime checks. Note that _compilers are not obliged to process pre- and post-conditions at all_. However, violating either pre- or post-conditions is considered undefined behaviour, so a compiler may optimize as if they always hold – even if a potential bug may cause them to be violated.

# Pre-conditions

Pre-conditions are usually used to validate incoming arguments. 
Each condition must be an expression that can be evaluated to a boolean. 
Pre-conditions use the `@require` annotation, and optionally can have an 
error message to display after them.

```c3
<*
 @require foo > 0, foo < 1000, "optional error msg"
*>
fn int testFoo(int foo)
{
    return foo * 10;
}
```

# Post conditions

Post conditions are evaluated to make checks on the resulting state after passing through the function.
The post condition uses the `@ensure` annotation. Where `return` is used to represent the return value from the function. 


    
```c3
<*
 @require foo != null
 @ensure return > foo.x
*>
fn uint checkFoo(Foo* foo)
{
    uint y = abs(foo.x) + 1;
    // If we had row: foo.x = 0, then this would be a compile time error.
    return y * abs(foo.x);
}
```

## Parameter annotations

`@param` supports `[in]` `[out]` and `[inout]`. These are only applicable
for pointer arguments. `[in]` disallows writing to the variable,
`[out]` disallows reading from the variable. Without an annotation,
pointers may both be read from and written to without checks. If an `&` is placed
in front of the annotation (e.g. `[&in]`), then this means the pointer must be non-null
and is checked for `null`.

| Type          | readable? | writable? | use as "in"? | use as "out"? | use as "inout" |
|---------------|:---------:|:---------:|:------------:|:-------------:|:--------------:|
| no annotation |    Yes    |    Yes    |     Yes      |      Yes      |      Yes       |
| `in`          |    Yes    |    No     |     Yes      |      No       |       No       |
| `out`         |    No     |    Yes    |      No      |      Yes      |       No       |
| `inout`       |    Yes    |    Yes    |     Yes      |      Yes      |      Yes       |

However, it should be noted that the compiler might not detect whether the annotation is correct or not! This program might compile, but will behave strangely:

```c3
fn void bad_func(int* i)
{
    *i = 2;
}

<*
 @param [&in] i
*>
fn void lying_func(int* i)
{
    bad_func(i); // The compiler might not check this!
}

fn void test()
{
    int a = 1;
    lying_func(&a);
    io::printf("%d", a); // Might print 1!
}
```

However, compilers will usually detect this:

```c3
<*
 @param [&in] i
*>
fn void bad_func(int* i)
{
    *i = 2; // <- Compiler error: cannot write to "in" parameter
}
```

### Pure in detail

The `pure` annotation allows a program to make assumptions in regard to how the function treats global variables. 
Unlike for `const`, a pure function is not allowed to call a function which is known to be impure.

However, just like for `const` the compiler might not detect whether the annotation 
is correct or not! This program might compile, but will behave strangely:

```c3
int i = 0;

def SecretFn = fn void();

fn void bad_func()
{
    i = 2;
}

<*
 @pure
*>
fn void lying_func(SecretFn f)
{
    f(); // The compiler cannot reason about this!
}

fn void main()
{
    i = 1;
    lying_func(&bad_func);
    io::printf("%d", i); // Might print 1!
}
```

However, compilers will usually detect this:

```c3
int i = 0;

def SecretFn = fn void();

fn void bad_func()
{
    i = 2;
}

<*
 @pure
*>
fn void lying_func(SecretFn f)
{
    f(); // <- ERROR: Only '@pure' functions may be called. 
}

fn void main()
{
    i = 1;
    lying_func(&bad_func);
    io::printf("%d", i); // Might print 1!
}
```

Consequently, circumventing "pure" annotations is undefined behaviour.


# Pre conditions for macros

In order to check macros, it's often useful to use the builtin `$defined`
function which returns true if the code inside would pass semantic checking.


```c3
<*
 @require $defined(resource.open, resource.open()), `Expected resource to have an "open" function`
 @require resource != nil
 @require $assignable(resource.open(), void*)
*>
macro open_resource(resource)
{
    return resource.open();
}
```
