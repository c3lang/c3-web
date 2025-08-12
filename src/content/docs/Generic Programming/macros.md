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

Consider these two examples comparing declaration attribute syntax in C vs C3:

```c
// C Macro
#define PURE_INLINE __attribute__((pure)) __attribute__((always_inline))
int foo(int x) PURE_INLINE { ... }
```

```c3
// C3 Macro
attrdef @NoDiscardInline = @nodiscard, @inline;
fn int foo(int) @NoDiscardInline { ... }
```

Note that C3's equivalent of function purity is a contract constraint, not an attribute.
That is why the C3 example here is not the same in effect as the C example and instead only
demonstrates the broader point of how to combine attributes. C3 *does* have a [`@pure`
attribute](/language-common/attributes/#pure), but it may only be applied to *calls* (not declarations) and doesn't make
the call pure but rather it tells the compiler to *pretend* that the call will be pure
for the purposes of ignoring `@pure` contract constraints when a call is known to be safe.
Do not confuse these two different uses of `@pure` in C3. They are very different.

[C3's equivalent of a pure *declaration*](/language-common/contracts/#pure-in-detail) is a contract constraint written between `<* ... *>`, *not* an attribute appended to the end of a function signature.

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

Script languages, and also upcoming languages like *Jai*, usually have unbounded top level evaluation. The flexibility of this style of meta programming has a trade-off in making the code more challenging to understand.

In C3, top level compile time evaluation is limited to `@if` attributes to conditionally enable or disable declarations and a handful of other somewhat limited compile time evaluation features (e.g. `$assert`, etc). This makes the code easier to read, but comes at the cost of expressive power. However, C3 makes this tradeoff for a carefully balanced and thoughtfully considered reason:

Preventing top level compile time evaluation helps prevent lots of declarations from popping into existence seemingly by magic, which is a common source of codebase intelligibility degrading over time in C and C++. By restricting the system to only either including or removing those declarations that are or aren't applicable, via `@if`, C3 makes it so that you still get conditional compilation and macros but with much less bewildering "magic". 

In effect, top level declarations become always *visible* in C3, regardless of whether they are included or removed, whereas in C and C++ unbounded invisible declarations may occur, causing code to become increasingly opaque and riddled with seemingly indecipherable "magic" and numerous variables and constants seemingly coming from nowhere.

Local function scopes in contrast have the full range of [C3's compile time evaulation features](/generic-programming/compiletime/) available though, which are arguably often more expressive and pleasant to use than C and C++'s equivalents for many use cases.

## Macro declarations

A macro is defined using the syntax `macro <return_type> <name>(<parameters>)`. Specifying the return type of a macro is optional and if omitted the return type is inferred but must always be well defined (hence different paths cannot return different types, etc). 

The parameters have different sigils that must prefix their names where applicable: `$` means compile time evaluated (constant expression or type). `#` indicates an expression that is not yet evaluated, but is bound to where it was defined.

Macros that use any expression parameters (`#`) or trailing macro bodies (`@body(...)`) must have a name that begins with `@`. The reason for this is because macros that *don't* use such features can be thought of as being more similar to normal functions because of the absence of potential for unexpected expression-based behavior, such as the danger of using expression arguments with side effects multiple times unintentionally. 

The `@` warns the reader of a macro call of the possibility that the call may be doing more "magic" or may be more prone to bugs than if the macro lacked the `@`. Thus, unlike most languages, C3 enables the programmer to choose between more safe or more expressive macros and to make that choice immediately clear to the reader.

Note that `$` parameters (unlike `#` and `@body` parameters) do *not* cause a macro to need a `@` prefix, despite what old docs may have misled some users to believe.

For example, here's a basic swap written as a macro instead of using pointers, which makes it potentially more efficient by avoiding pointer indirection overhead:

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

A macro may return a value, in which case it is then considered an expression rather than a statement:

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
but also support a unique set of macro vaargs that look like C-style vaargs: `macro void baz(...)`.

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

Returns the number of arguments passed into the macro's vaarg list.

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
