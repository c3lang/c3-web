---
title: Compile Time Evaluation
description: Compile time introspection and execution
sidebar:
    order: 84
---
During compilation, constant expressions will automatically be folded. Together with the compile
time conditional statements `$if`, `$switch` and the compile time iteration statements `$for` `$foreach`
it is possible to perform limited compile time execution.

### Compile time values

During compilation, global constants are considered compile time values, as are any
derived constant values, such as type names and sizes, variable alignments, etc.

Inside of a macro or a function, it is possible to define mutable compile time variables. Such local variables are prefixed with `$` (e.g. `$foo`). It is also possible to define local *type* variables, which are also prefixed using `$` (e.g. `$MyType`, `$ParamType`, etc).

Mutable compile time variables are *not* allowed in the global scope.

### Concatenation

The compile time concatenation operator `+++` can be used at compile
time to concatenate arrays and strings:

```c3
macro int[3] @foo(int $y)
{
    int[2] $z = { 1, 2 };
    return $z +++ $y;
}

fn void main()
{
	io::printn(@foo(4)); // prints "{ 1, 2, 4 }"
}
```

### Compile time && and ||

The operators `&&&` and `|||` perform compile time versions of `&&` and
`||`. The difference between the runtime operators is that the right hand side is not type
checked if the left hand side is `false` in the case of `&&&` and true in the case of `|||`.

This allows us to safely write this macro code:
```c3
// Compiles even if @foo doesn't exist
$if $defined(@foo()) &&& @foo():
  ...
$endif
```

If `@foo()` doesn't exist, then this still compiles. However, if we had used `&&` instead this would have been an error:
```c3
$if $defined(@foo()) && @foo(): // ERROR: '@foo' could not be found.
  ...
$endif
```

### `$if` and `$switch`

`$if <const expr>:` takes a compile time constant value and evaluates it to see if it is true or false. If it is true, then the code in the "then" branch is retained and semantically checked, while the `$else` branch – if present – is discarded. And conversely, if the result is false, then the "then" branch is discarded and the `$else` branch is retained. Here are some basic usage examples:

```c3
macro @foo($x, #y)
{
    $if $x > 3:
        #y += $x * $x;
    $else
        #y += $x;
    $endif
}

const int FOO = 10;

fn void test()
{
    int a = 5;
    int b = 4;
    @foo(1, a); // Allowed, expands to a += 1;
    // @foo(b, a); // Error: b is not a compile time constant.
    @foo(FOO, a); // Allowed, expands to a += FOO * FOO;
}
```

For switching between multiple possibilities, use `$switch`.

```c3
macro @foo($x, #y)
{
    $switch $x:
        $case 1:
            #y += $x * $x;
        $case 2:
            #y += $x;
        $case 3:
            #y *= $x;
        $default:
            #y -= $x;
    $endswitch
}
```

Switching without passing a value argument to `$switch` itself is also allowed (much like [normal `switch`](/language-fundamentals/statements/#switch-cases-with-runtime-evaluation)), which works like an if-else chain in that it permits arbitrary conditional expressions per case instead of only allowing a specific constant per case:

```c3
macro @foo($x, #y)
{
    $switch
        $case $x > 10:
            #y += $x * $x;
        $case $x < 0:
            #y += $x;
        $default:
            #y -= $x;
    $endswitch
}
```

### Loops using `$foreach` and `$for`

`$for` ... `$endfor` works analogous to `for`, only it is limited to using compile time variables. `$foreach` ... `$endforeach` similarly
matches the behaviour of `foreach`.

Compile time looping:

```c3
macro foo($a)
{
    $for var $x = 0; $x < $a; $x++:
        io::printfn("%d", $x);
    $endfor
}

fn void test()
{
    foo(2);
    // Expands to ->
    // io::printfn("%d", 0);
    // io::printfn("%d", 1);
}
```

Looping over enums:

```c3
macro foo_enum($SomeEnum)
{
    $foreach $x : $SomeEnum.values:
        io::printfn("%d", (int)$x);
    $endforeach
}

enum MyEnum
{
    A,
    B,
}

fn void test()
{
    foo_enum(MyEnum);
    // Expands to ->
    // io::printfn("%d", (int)MyEnum.A);
    // io::printfn("%d", (int)MyEnum.B);
}
```

:::note
The content of the `$foreach` or `$for` body must be at least a complete statement.
It's not possible to compile partial statements.
:::

### Compile time macro execution

If a macro only takes compile time parameters, that is only `$`-prefixed parameters, and then does not generate any other statements than returns, then the macro will be completely compile time executed.

```c3
macro @test($abc)
{
    return $abc * 2;
}

const int MY_CONST = @test(2); // Will fold to "4"
```

This constant evaluation allows us to write some limited compile time code. For example, this macro will compute Fibonacci numbers at compile time:

```c3
macro long @fib(long $n)
{
    $if $n <= 1:
        return $n;
    $else
        return @fib($n - 1) + @fib($n - 2);
    $endif
}
```

It is important to remember that if we had replaced `$n` with `n` the compiler would have complained. `n <= 1` is not considered to be a constant expression, even if the actual argument to the macro was a constant. This limitation is deliberate, to offer control over what is compiled out and what isn't.

### Conditional compilation at the top level using `@if`

At the top level (where globals are declared; such as functions, variables, etc), conditional compilation is controlled by appending `@if` attributes onto declarations:

```c3
fn void foo_win32() @if(env::WIN32)
{
    /* .... */
}

struct Foo
{
    int a;
    int b @if(env::NO_LIBC);
}
```

The argument to `@if` must be resolvable to a constant at compile time. This means that the argument may also be a compile time evaluated macro:

```c3
macro bool @foo($x) => $x > 2;

int x @if(@foo(5));  // Will be included
int y @if(@foo(0));  // Will not be included
```

In contrast though, attempts to use more general-purpose compile-time features such as `$if` at the top level will cause compilation failure. Compare:

```c3
// Compiles:
fn void func_a() @if(true) 
{ 
	//...
}

// Doesn't compile:
$if true:
fn void func_b()
{ 
	//...
}
$endif
```

For more information about the motivation and rationale behind this design choice to use `@if` (and a limited subset of other compile-time constructs such as `$assert`) at the top level for declarations instead of allowing arbitrary compile-time evaluation, see the related discussion about why in [the part of the macro page that covers top level `@if`](/generic-programming/macros#top-level-evaluation).

#### Evaluation order of top level conditional compilation

Conditional compilation at the top level can cause unexpected ordering issues, especially when combined with
`$defined`. At a high level, there are three phases of evaluation:

1. Non-conditional declarations are registered.
2. Conditional module sections are either discarded or have all of their non-conditional declarations registered.
3. Each module in turn will evaluate `@if` attributes for each module section.

The order of module and module section evaluation in (2) and (3) is not deterministic and any use of `$defined` should not
rely on this ordering.

## Compile time introspection

At compile time, full type information is available. This allows for creation of reusable, code generating macros for things
like serialization.

```c3
usz foo_alignment = Foo.alignof;
usz foo_member_count = Foo.membersof.len;
String foo_name = Foo.nameof;
```

To read more about all the fields available at compile time, see the page on [reflection](/generic-programming/reflection).

## Compile time functions

The following is a list of functions available at compile time:

### `$alignof`

Get the alignment of something.
See [reflection](/generic-programming/reflection/#alignof).

### `$assert`

Check a condition at compile time.

```c3
$assert($arg > 3);
```

### `$defined`

This highly versatile compile time function returns true if a type or identifier is defined. It can also be used on an expression, returning "true" if the outermost expression is valid. Similarly, it can be used with a declaration, e.g. `$defined(int a = foo)` to verify that it's valid to declare a variable with the given argument.

However, be aware that `$defined` is for handling well-defined expressions, not arbitrary syntax. Invalid code placed inside `$defined` will cause compilation to fail, not return false.

See [reflection](/generic-programming/reflection/#defined).

### `$echo`

Print a message to stdout when compiling the code.

### `$embed`

Embed binary data from a file.
See [the "including binary data" secton of the expressions page](/language-fundamentals/expressions/#including-binary-data) to see a few different usage examples.

This is useful for bundling any necessary data inside the executable or library itself so that there is no need for managing separate files when the program is redistributed to users. Such embedded data is fixed at compile time though, and so `$embed` shouldn't be used for files that need to persist changes *between invocations* of the program (e.g. work documents, saved games, etc). However, once loaded, `$embed` data is just arbitrary run-time data and thus you can still create and modify whatever other data you want based on it during each program run.

For example:

```
char[*] img_data = $embed("some_image.png");

import std::io;

fn void main()
{
    io::printn(img_data);
    // Prints an image's raw data
    // as an array of unsigned bytes.
}
```

### `$error`

When this is compiled, issue a compile time error.

### `$eval`

Converts a compile time string to the corresponding variable or function.
See [reflection](/generic-programming/reflection/#eval).

```c3
fn void main()
{
    int x;
    var $s = "x";
    $eval($s) = 3;
    io::printn(x);  // Prints 3
}
```

### `$evaltype`


### `$exec`

Execute a script at compile time and include the result in the source code.
[See more](/language-fundamentals/modules/#exec).

### `$extnameof`, `$qnameof` and `$nameof`

Get the external name of a symbol.
See [reflection](/generic-programming/reflection/#extnameof).

External names are the names written into the symbol table of the executable or library binary, which subsequently may later be used by other programs to call into the binary by linking to those names, such as via foreign function interfaces (FFI) from another language or via direct use of the binary interface (such as enabled by the ABI and library compatibility of C and C3). 

The external name of a symbol in the built binary can be set by attaching an `@export("<intended_symbol_name>")` attribute.

On Linux, the `nm` shell command can be used to view the symbol table of a binary directly, thus enabling determination of what names a foreign program would see when looking at the binary. For example, try running `nm path/to/binary &> nm_out.txt` then viewing the `nm_out.txt` file. The `&>` combines both normal (`stdout`) and error (`stderrr`) output into the file, whereas just `>` would redirect only normal (`stdout`) output. 

On Windows, you can try `dumpbin /SYMBOLS` for debug builds, `dumpbin /EXPORTS` for libraries, or `dumpbin /IMPORTS` for executables, but it may not help as much since large parts of the symbol table may be missing and hence misleading. There may also be tools available only in Visual Studio or associated with it, since Microsoft designs it that way intentionally to encourage programs to be built the way Microsoft wants.

On Mac, try `otool`, `nm`, or `objdump`. Running `brew install binutils` before may help.

### `$feature`

Check if a given feature is enabled. Features are passed using `-D <FEATURE_NAME>` on the command line.

### `$is_const`

Check if the expression is constant at compile time. This is typically used in specialized macros when testing expression parameters like `#foo`.

### `$include`

Includes a file into the current file at the top level as raw text, resulting in that file's text being compiled as if directly written into the location of the `$include`.

As an important limitation, the text may not include a `module` statement.

Note that if pure data inclusion is what you want then `$embed` may be more helpful than `$include`, and if you want dynamic data, `$exec` may be better.

### `$nameof`

Get the local name of a symbol.
See [reflection](/generic-programming/reflection/#nameof-1).

Local names (a.k.a. unqualified names) are the "leaf nodes" (the very last item) of the full namespace path to a symbol.

For example, `$nameof(io::printn)` is `printn`.

### `$offsetof`

Get the offset of a member.
See [reflection](/generic-programming/reflection/#offsetof).

### `$qnameof`

Get the qualified name of a symbol.
See [reflection](/generic-programming/reflection/#qnameof).

Qualified names are the full ("absolute") namespace paths needed to reach a symbol.

For example, `$qnameof(io::printn)` is `std::io::printn`.

### `$vacount`

Return the number of macro vaarg arguments.
For this and other vaarg compile-time functions
[see here](/generic-programming/macros/#macro-vaargs).

### `$vaconst`

Return a vaarg as a `$constant` parameter.

### `$vaexpr`

Return a vaarg as an `#expr` parameter.

### `$vasplat`

Expand the vaargs into an initializer list or function call, thus providing a way of passing part or all of the vaarg list's arguments onward.

To expand only part of a vaarg list rather than all of it, use `$vasplat[<min>..<max>]` with the intended indices instead of just `$vasplat`. See the section on [slicing arrays](/language-common/arrays/#slicing-arrays) to learn more about the wide variety of ways that such index ranges can be formed.

### `$vatype`

Get a vaarg as a `$Type` parameter.

### `$sizeof`

Return the size of an expression.

### `$stringify`

Turn an expression into a string. This is typically used with expression parameters (`#` prefixed parameters) in macros.

Such stringification is very useful for debug printing and code generation, among other things. For example, just to illustrate why:

```c3
import std::io;

macro @show(#expr)
{
    io::printfn("%s == %s", $stringify(#expr), #expr);
}
macro @announce(#expr)
{
    io::printn($stringify(#expr));
    #expr;
}

fn void main()
{
    int num = 0;
    @show(num);
    @announce(num += 5);
    @show(num);
}
```

This elminates redundancy when print debugging. This code could be refined to be better, such as by making `@show` handle [Optionals](/language-common/optionals-essential/#what-is-an-optional) correctly, but the simple version above is less distracting. However, as you can see, code can be annoted for temporary print debugging very easily by using `$stringify` based expression macros. 

### `$typeof`

Get the type of an expression at compile time, without ever evaluating it at run time and thus without causing side effects.

For example, the following C3 test passes:

```
fn void typeof_has_no_side_effects() @test
{
    int minutes_left = 20;
    $assert($typeof(minutes_left += 10).nameof == "int");
    assert(minutes_left == 20);
    
    // The state of `minutes_left` above never changes.
}
```

### `$typefrom`

Get a type from a compile time constant `typeid`. It can also convert a compile-time string to the corresponding type.

See [reflection](/generic-programming/reflection/#typefrom).
