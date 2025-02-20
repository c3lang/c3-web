---
title: Statements
description: Statements
sidebar:
    order: 43
---

Statements largely work like in C, but with some additions.

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

The function below prints `World!` if `x` is zero, otherwise it prints `Hello World!`.

```c3
fn void test(int x)
{
    do 
    {
        if (!x) break;
        io::printf("Hello ");
    };
    io::printf("World!\n");
}
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

It's also possible to use `nextcase` with an expression, to jump to an arbitrary case or between labeled switch statements:

```c3
switch MAIN: (enum_var)
    case FOO:
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
                nextcase MAIN: BAR;  // Jump to outer (MAIN) switch
        } 
    case BAR:
        io::printn("BAR");
    default:
        break;
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
if (x < 0)
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

## Jumptable switches with "@jump"

Regular switch statements with only enum or integer cases may use the `@jump`
attribute. This attribute ensures that the switch is implemented as
a jump using a jumptable. In C this is possible to do manually using labels and
calculated gotos which are extensions available in GCC/Clang.

The behaviour of the switch itself does not change with a jumptable,
but some restrictions will apply. Typically used for situations
like bytecode interpreters, it might perform worse 
or better than a regular switch depending on the situation.
`nextcase` statements will also use jumptable dispatch when
`@jump` is used.