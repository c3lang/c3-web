---
title: Contracts
description: Contracts
sidebar:
    order: 67
---

Contracts are optional pre- and post-condition checks that the compiler may 
use for static analysis, runtime checks and optimization. Note that 
_conforming C3 compilers are not obliged to use pre- and post-conditions at all_. 

However, violating either pre- or post-conditions is unspecified behaviour, 
and a compiler may optimize code as if they are always true – even if 
a potential bug may cause them to be violated.

In safe mode, pre- and post-conditions are checked using runtime asserts.

# Pre-conditions

Pre-conditions are usually used to validate incoming arguments.
Each condition must be an expression that can be evaluated to a boolean.
Pre-conditions use the `@require` annotation, and optionally can have an
error message to display after them.

```c3
<*
 @require foo > 0, foo < 1000 : "optional error msg"
*>
fn int test_foo(int foo)
{
    return foo * 10;
}
```

If we now write the following code:

```c3
fn void main()
{
    test_foo(0);
}
```

With *c3c* (the standard C3 compiler) we will get a compile time error, saying
that the contract is violated. However, expressions requiring more static analysis
are often only caught at runtime.

# Post conditions

Post conditions are evaluated to make checks on the resulting state after passing through the function.
The post condition uses the `@ensure` annotation. Where `return` is used to represent the return value from the function.

```c3
<*
 @require foo != null
 @ensure return > foo.x
*>
fn uint check_foo(Foo* foo)
{
    uint y = abs(foo.x) + 1;
    
    // If we put `foo.x = 0;` here, then it
    // would cause a run-time contract error.
    
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

| Type          | readable? | writable? | use as "in"? | use as "out"? | use as "inout"? |
|---------------|:---------:|:---------:|:------------:|:-------------:|:---------------:|
| no annotation |    Yes    |    Yes    |     Yes      |      Yes      |       Yes       |
| `in`          |    Yes    |    No     |     Yes      |      No       |        No       |
| `out`         |    No     |    Yes    |      No      |      Yes      |        No       |
| `inout`       |    Yes    |    Yes    |     Yes      |      Yes      |       Yes       |

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
    io::printfn("%d", a); // Might print 2!
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

fn void bad_func()
{
    i = 2;
}

<*
 @pure
*>
fn void lying_func()
{
    bad_func() @pure; // Call bad_func by assuring it is pure!
}

fn void main()
{
    i = 1;
    lying_func();
    io::printfn("%d", i); // Might print 2!
}
```

Circumventing "pure" annotations will cause the compiler optimize under the assumption
that globals are not affected, even if this isn't true.


# Pre-conditions for macros

In order to check macros, it's often useful to use the builtin `$defined`
function which returns true if the code inside would pass semantic checking.


```c3
<*
 @require $defined(resource.open, resource.open()) : `Expected resource to have an "open" function`
 @require resource != nil
 @require $assignable(resource.open(), void*)
*>
macro open_resource(resource)
{
    return resource.open();
}
```

# Contract support

A C3 compiler may have different levels of contract use:

| Level | Behaviour                                                                                                                                    |
|-------|----------------------------------------------------------------------------------------------------------------------------------------------|
| 0     | Contracts are only semantically checked                                                                                                      |
| 1     | `@require` may be compiled into asserts inside of the function. Compile time violations detected through constant folding should not compile |
| 2     | As Level 1, but `@ensures` are also checked                                                                                                  |
| 3     | `@require` is added at caller side as well                                                                                                   |
| 4     | Static analysis is extended beyond compile time folding |

The c3c compiler currently does level 3 checking.
