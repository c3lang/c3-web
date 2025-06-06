---
title: Macros
description: Macros
sidebar:
    order: 83
---
The macro capabilities of C3 reaches across several constructs:
macros, [generic functions, generic modules](/generic-programming/generics/), and [compile time variables](/generic-programming/compiletime/#compile-time-values)
(prefixed with `$`), macro compile time execution (using `$if`, `$for`, `$foreach`, `$switch`) and attributes.

## A quick comparison of C and C3 macros

### Conditional compilation

```c
// C Macro
#if defined(x) && Y > 3
int z;
#endif
```

```c3
// C3 Macro
$if $defined(x) && Y > 3:
    int z;
$endif

// or
int z @if($defined(x) && Y > 3);
```


### Macros
```c
// C Macro
#define M(x) ((x) + 2)
#define UInt32 unsigned int

// Use:
int y = M(foo() + 2);
UInt32 b = y;
```

```c3
// C3 Macro
macro m(x)
{
    return x + 2;
}
alias UInt32 = uint;

// Use:
int y = m(foo() + 2);
UInt32 b = y;
```

### Dynamic scoping
```c
// C Macro
#define Z() ptr->x->y->z
int x = Z();
```

```c3
// C3 Macro
... currently no corresponding functionality ...
```

### Expression arguments


```c
// C Macro
#define M(x, y) x = 2 * (y);
...
M(x, 3);
```

```c3
// C3 Macro
macro @m(#x, y)
{
    #x = 2 * y;
}
...
@m(x, 3);
```

### First class types

```c
// C Macro
#define SIZE(T) (sizeof(T) + sizeof(int))
```

```c3
// C3 Macro
macro size($Type)
{
    return $Type.sizeof + int.sizeof;
}
```

### Trailing blocks for macros

```c
// C Macro
#define FOR_EACH(x, list) \
for (x = (list); x; x = x->next)

// Use:
Foo *it;
FOR_EACH(it, list)
{
    if (!process(it)) return;
}
```

```c3
// C3 Macro
macro @for_each(list; @body(it))
{
    for ($typeof(list) x = list; x; x = x.next)
    {
        @body(x);
    }
}

// Use:
@for_each(list; Foo* x)
{
    if (!process(x)) return;
}
```

### First class names

```c
// C Macro
#define offsetof(T, field) (size_t)(&((T*)0)->field)
```

```c3
// C3 Macro
macro usz @offset($Type, #field)
{
    $Type* t = null;
    return (usz)(uptr)&t.#field;
}
```

### Declaration attributes

```c
// C Macro
#define PURE_INLINE __attribute__((pure)) __attribute__((always_inline))
int foo(int x) PURE_INLINE { ... }
```

```c3
// C3 Macro
attrdef @NoDiscardInline = { @nodiscard @inline };
fn int foo(int) @NoDiscardInline { ... }
```

### Declaration macros
```c
// C Macro
#define DECLARE_LIST(name) List name = { .head = NULL };
// Use:
DECLARE_LIST(hello)
```

```c3
// C3 Macro
... currently no corresponding functionality ...
```
### Stringification

```c
// C Macro
#define CHECK(x) do { if (!x) abort(#x); } while(0)
```

```c3
// C3 Macro
macro @check(#expr)
{
    if (!#expr) abort($stringify(#expr));
}
```

## Top level evaluation

Script languages, and also upcoming languages like *Jai*,
usually have unbounded top level evaluation.
The flexibility of this style of meta programming has a trade-off in making the code more challenging to understand.

In C3, top level compile time evaluation is limited to `@if` attributes to conditionally enable or
disable declarations. This makes the code easier to read, but at the cost of expressive power.

## Macro declarations

A macro is defined using `macro <name>(<parameters>)`. All user defined macros use the @ symbol if they use the `$` or `#` parameters.

The parameters have different sigils:
`$` means compile time evaluated (constant expression or type). `#` indicates an expression that is not yet evaluated,
but is bound to where it was defined. `@` is required on macros that use `#` parameters or trailing macro bodies.

A basic swap:

```c3
<*
 @checked $defined(#a = #b, #b = #a)
*>
macro void @swap(#a, #b)
{
    var temp = #a;
    #a = #b;
    #b = temp;
}
```

This expands on usage like this:

```c3
fn void test()
{
    int a = 10;
    int b = 20;
    @swap(a, b);
}
// Equivalent to:
fn void test()
{
    int a = 10;
    int b = 20;
    {
        int __temp = a;
        a = b;
        b = __temp;
    }
}
```

Note the necessary `#`. Here is an incorrect swap and what it would expand to:

```c3
macro void badswap(a, b)
{
    var temp = a;
    a = b;
    b = temp;
}

fn void test()
{
    int a = 10;
    int b = 20;
    badswap(a, b);
}
// Equivalent to:
fn void test()
{
    int a = 10;
    int b = 20;
    {
        int __a = a;
        int __b = b;
        int __temp = __a;
        __a = __b;
        __b = __temp;
    }
}
```

## Macro methods

Similar to regular *methods* a macro may also be associated with a particular type:

```c3
struct Foo { ... }

macro Foo.generate(&self) { ... }
Foo f;
f.generate();
```

See the chapter on [functions](/language-fundamentals/functions/) for more details.

## Capturing a trailing block

It is often useful for a macro to take a trailing compound statement as an argument. In C++ this pattern is usually expressed with a lambda, but in C3 this is completely inlined.

To accept a trailing block, `; @name(param1, ...)` is placed after declaring the regular macro parameters.

Here's an example to illustrate its use:

```c3
<*
 A macro looping through a list of values, executing the body once
 every pass.

 @require $defined(a.len) && $defined(a[0])
*>
macro @foreach(a; @body(index, value))
{
    for (int i = 0; i < a.len; i++)
    {
        @body(i, a[i]);
    }
}

fn void test()
{
    double[] a = { 1.0, 2.0, 3.0 };
    @foreach(a; int index, double value)
    {
        io::printfn("a[%d] = %f", index, value);
    };
}

// Expands to code similar to:
fn void test()
{
    double[] a = { 1.0, 2.0, 3.0 };
    {
        double[] __a = a;
        for (int __i = 0; __i < __a.len; __i++)
        {
            int __index = __i;
            double __value = __a[__i];
            io::printfn("a[%d] = %f", __index, __value);
        }
    }
}
```

## Macros returning values

A macro may return a value, it is then considered an expression rather than a statement:

```c3
macro square(x)
{
    return x * x;
}

fn int getTheSquare(int x)
{
    return square(x);
}

fn double getTheSquare2(double x)
{
    return square(x);
}
```

## Calling macros

It's perfectly fine for a macro to invoke another macro or itself.

```c3
macro square(x) { return x * x; }

macro squarePlusOne(x)
{
    return square(x) + 1; // Expands to "return x * x + 1;"
}
```

The maximum recursion depth is limited to the `macro-recursion-depth` build setting.

## Macro vaargs

Macros support the typed vaargs used by C3 functions: `macro void foo(int... args)` and `macro void bar(args...)`
but it also supports a unique set of macro vaargs that look like C style vaargs: `macro void baz(...)`

To access the arguments there is a family of $va-* built-in functions to retrieve
the arguments:

```c3
macro compile_time_sum(...)
{
    var $x = 0;
    $for var $i = 0; $i < $vacount; $i++:
        $x += $vaconst[$i];
    $endfor
    return $x;
}
$if compile_time_sum(1, 3) > 2: // Will compile to $if 4 > 2
    ...
$endif
```

### `$vacount`

Returns the number of arguments.

### `$vaarg`

Returns the argument as a regular parameter. The argument is
guaranteed to be evaluated once, even if the argument is used multiple times.

### `$vaconst`

Returns the argument as a compile time constant, this is suitable for
placing in a compile time variable or use for compile time evaluation,
e.g. `$foo = $vaconst[1]`. This corresponds to `$` parameters.

### `$vaexpr`

Returns the argument as an unevaluated expression. Multiple uses will
evaluate the expression multiple times, this corresponds to `#` parameters.

### `$vatype`

Returns the argument as a type. This corresponds to `$Type` style parameters,
e.g. `$vatype(2) a = 2`

### `$vasplat`

`$vasplat` allows you to paste the vaargs in the call into another call. For example,
if the macro was called with values `"foo"` and `1`, the code `foo($vasplat)`, would become `foo("foo", 1)`.
You can even extract provide a range as the argument: `$vasplat[2..4]` (in this case, this would paste in
arguments 2, 3 and 4).

Nor is it limited to function arguments, you can also use it with initializers:

```c3
int[*] a = { 5, $vasplat[2..], 77 };
```

## Untyped lists

Compile time variables may hold untyped lists. Such lists may be iterated over or
implicitly converted to initializer lists:

```c3
var $a = { 1, 2 };
$foreach $x : $a:
    io::printfn("%d", $x);
$endforeach
int[2] x = $a;
io::printfn("%s", x);
io::printfn("%s", $a[1]);
// Will print
// 1
// 2
// [1, 2]
// 2
```
