---
title: Hello World
description: Learn to write hello world
sidebar:
  order: 30
---

:::note[Not installed the C3 compiler yet?]
[Download C3](/getting-started/prebuilt-binaries), available on Mac, Windows and Linux.
:::

## 👋 Hello world
Let's start with the traditional first program, Hello World in C3:

```c3
import std::io;

fn void main()
{
    io::printn("Hello, World!");
}
```

The [`import`](/language-fundamentals/modules/#importing-modules) statement imports other modules, and we want `printn` which
is in `std::io`.

Next we define a [function](/language-fundamentals/functions/) which starts with the `fn` keyword followed by the return type. We don't need to return anything, so return `void`. The function name `main` then follows, followed by the function's parameter list, which is empty.
```c3
fn void main() {}
```

:::note
The function named `main` is a bit special, as it is where the program starts, or the entry point of the program.

For Unix-like OSes there are a few different variants, for example we might declare it as `fn void main(String[] args)`. In that case the parameter "args" contains a [slice](/language-common/arrays/#slice) of strings, of the program's command line arguments, starting with the name of the program, itself.
:::


### 🔭 Function scope
`{` and `}` signifies the start and end of the function respectively, 
we call this the function's scope. Inside the function scope we have a single function 
call to `printn` inside `std::io`. We use the last part of the path "io" in front of
the function to identify what module it belongs to.

### 📏 Imports can use a shorthand
We could have used the original longer path: `std::io::printn`
if we wanted, but we *can* shorten it to just the lowest level module like `io::printn`. This is the *convention* in C3 and is is known as "path-shortening", it avoids writing long import paths that can make code harder to read.

```diff lang="cpp"
- std::io::printn("Hello, World!");
+ io::printn("Hello, World!");

```

The `io::printn` function takes a single argument and prints it, followed by a newline, then the function ends and the program terminates.


## 🔧 Compiling the program

Let's take the above program and put it in a file called `hello_world.c3`.

We can then compile it with:

```bash 
c3c compile hello_world.c3
```

And run it:

```bash
./hello_world
```

It should print `Hello, World!` and return back to the command line prompt. 
If you are on Windows, you will have `hello_world.exe` instead. Call it in the same way.

### 🏃 Compiling and running

When we start out it can be useful to compile and then have the compiler start the
program immediately. We can do that with `compile-run`:

```bash {4}
$ c3c compile-run hello_world.c3
> Program linked to executable 'hello_world'.
> Launching hello_world...
> Hello, World
```

Want more options when compiling? [Check the c3c compiler build options](/build-your-project/build-commands/).
### 🎉 Successfully working? 
Congratulations! You're now up and running with C3.

### ❓ Need help?
We're happy to help on the [C3 Discord](https://discord.gg/qN76R87).
