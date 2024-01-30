---
title: My first Hello World
description: Let's write our first hello world program in c3
sidebar:
  order: 3
---

The simplest "Hello World" we can write is this:

```c
import std::io;
fn void main()
{
    io::printn("Hello, World!");
}
```

The `import` statement imports other modules, and we want `println` which
is in `std::io`. Import is always recursive, so `import std::io` actually
imports both `std::io` and its sub-modules, such as `std::io::path` (which 
handles file paths).

You could even do `import std;`, which would import the entire standard library
into your project!

Next we define a function, which starts with `fn` followed by the return type. In this
case we don't need to return anything, so we use `void`. Then follows the name `main`, followed
by the parameter list, which is empty.

"main" is a bit special as it is also the entry point to the program. For Unix-like OSes there
are a few different variants, for example we might declare it as `fn void main(String[] args)`.
In that case the parameter "args" contains a *sub array* of strings, which correspond to the
command line arguments, with the first one being the name of the application itself.

`{` and `}` signifies the start and end of the function respectively. Inside we have a single
call to the function `printn` in `std::io`. We use the last part of the path "io" in front of
the function to identify what module it belongs to. We could also have used `std::io::printn`
if we wanted. Just a part of the module path, like "io::printn", is known as "path-shortening"
and is the common way of referring to functions (avoid `std::io::printn`, it's not idiomatic).

The `io::printn` function takes a single argument and prints it, followed by a
line feed.

After this the function ends and the program terminates.

### Compiling the program

Let's take the above program and put it in a file called `hello_world.c3`.

We can then compile it:

```
> c3c compile hello_world.c3
```

And run it:

```
> ./hello_world
```

It should print `Hello, World!` and return back to the command line prompt. 
If you are on Windows, you will have `hello_world.exe` instead. Call it in the same way.

### Compiling and running

When we start out it can be useful to compile and then have the compiler start the
program immediately. We can do that with `compiler-run`:

```
> c3c compile-run hello_world.c3
Program linked to executable 'hello_world'.
Launching hello_world...
Hello, World
> 
```

If you followed along so far: Congratulations! You're now up and running with C3.





