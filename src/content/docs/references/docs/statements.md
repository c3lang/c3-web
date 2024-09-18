---
title: Statements
description: Statements
sidebar:
    order: 112
---

Statements largely work like in C, but with some additions.


## Expression blocks

Expression blocks (delimited using `{| |}`) are compound statements that opens their own function scope.
Jumps cannot be done into or out of a function block, and `return` exits the block, rather than the function as a whole.

The function below prints `World!`

```c3
fn void test()
{
    int a = 0;
    {|
        if (a) return;
        io::printf("Hello ");
        return;
    |};
    io::printf("World!\n");
}
```

Expression blocks may also return values:

```c3
fn void test(int x)
{
    int a = {|
        if (x > 0) return x * 2;
        if (x == 0) return 100;
        return -x;
    |};
    io::printfn("The result was %d", a);
}
```

## Labelled break and continue

Labelled `break` and `continue` lets you break out of an outer scope. Labels can be put on `if`, 
`switch`, `while` and `do` statements.

```c3
fn void test(int i)
{
    if FOO: (i > 0)
    {
        while (1)
        {
            io::printfn("%d", i);
            // Break out of the top if statement.
            if (i++ > 10) break FOO;
        }
    }
}
```

## Do-without-while

Do-while statements can skip the ending `while`. In that case it acts as if the `while` was `while(0)`:

```c3
do
{
    io::printn("FOO");
} while (0);

// Equivalent to the above.
do
{
    io::printn("FOO");
};
```

## Nextcase and labelled nextcase

The `nextcase` statement is used in `switch` and `if-catch` to jump to the next statement:

```c3
switch (i)
{
    case 1:
        doSomething();
        nextcase; // Jumps to case 2
    case 2:
        doSomethingElse();
}
```

It's also possible to use `nextcase` with an expression, to jump to an arbitrary case:

```c3
switch (i)
{
    case 1:
        doSomething();
        nextcase 3; // Jump to case 3
    case 2:
        doSomethingElse();
    case 3:
        nextcase rand(); // Jump to random case
    default:
        io::printn("Ended");
}
```

Which can be used as structured `goto` when creating state machines.

## Switch cases with runtime evaluation

It's possible to use `switch` as an enhanced if-else chain:

```c3
switch (true)
{
    case x < 0:
        xless();
    case x > 0:
        xgreater();
    default:
        xequals();
}
```

The above would be equivalent to writing:

```c3
if (c < 0)
{
    xless();
}
else if (x > 0)
{
    xgreater();
}
else
{
    xequals();
}
```

Note that because of this, the first match is always picked. Consider:

```c3
switch (true)
{
    case x > 0:
        foo();
    case x > 2:
        bar();
}
```

Because of the evaluation order, only `foo()` will be invoked for x > 0, even when x is greater than 2.

It's also possible to omit the conditional after `switch`. In that case it is implicitly assumed to be same as
writing `(true)`

```c3
switch
{
    case foo() > 0:
        bar();
    case test() == 1:
        baz();
}
```