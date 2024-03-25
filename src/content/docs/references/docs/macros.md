---
title: Macros
description: Macros
sidebar:
    order: 119
---
The macro capabilities of C3 reaches across several constructs: macros (prefixed with `@` at invocation), [generic functions](/references/docs/generics/#generic-functions), [generic modules](/references/docs/generics/#generic-modules), compile time variables (prefixed with `$`), macro compile time execution (using `$if`, `$for`, `$foreach`, `$switch`) and attributes.

## A quick comparison of C and C3 macros

### Conditional compilation

    // C
    #if defined(x) && Y > 3
    int z;
    #endif
    
    // C3
    $if $defined(x) && $y > 3:
        int z;
    $endif

    // or
    int z @if($defined(x) && $y > 3);

    

### Macros

    // C
    #define M(x) ((x) + 2)
    #define UInt32 unsigned int
    
    // Use:
    int y = M(foo() + 2);
    UInt32 b = y;
    
    // C3
    macro m(x)
    {
        return x + 2;
    }
    def UInt32 = uint;
    
    // Use:
    int y = @m(foo() + 2);
    UInt32 b = y;

### Dynamic scoping

    // C
    #define Z() ptr->x->y->z
    int x = Z();
    
    // C3
    ... currently no corresponding functionality ...


### Reference arguments

Use `&` in front of a parameter to capture the variable and pass it by reference without having to explicitly use `&` and pass a pointer. 
(Note that in C++ this is allowed for normal functions, whereas for C3 it is only permitted with macros. Also, 
in C3 the captured argument isn't automatically dereferenced)

    // C
    #define M(x, y) x = 2 * (y);
    ...
    M(x, 3);

    // C3
    macro m(&x, y)
    {
        *x = 2 * y;
    }
    ...
    m(x, 3);


### First class types

    // C
    #define SIZE(T) (sizeof(T) + sizeof(int))
    
    // C3
    macro size($Type)
    {
        return $Type.sizeof + int.sizeof;
    }

### Trailing blocks for macros

    // C
    #define FOR_EACH(x, list) \
    for (x = (list); x; x = x->next)
    
    // Use:
    Foo *it;
    FOR_EACH(it, list) 
    {
        if (!process(it)) return;
    }
    
    
    // C3
    macro for_each(list; @body(it))
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

### First class names

    // C
    #define offsetof(T, field) (size_t)(&((T*)0)->field)
    
    // C3
    macro usz offset($Type, #field)
    {
        $Type* t = null;
        return (usz)(uptr)&t.#field;
    }

### Declaration attributes


    // C
    #define PURE_INLINE __attribute__((pure)) __attribute__((always_inline))
    int foo(int x) PURE_INLINE { ... }
    
    // C3
    define @PureInline = { @pure @inline };
    fn int foo(int) @PureInline { ... }    


### Declaration macros

    // C
    #define DECLARE_LIST(name) List name = { .head = NULL };
    // Use:
    DECLARE_LIST(hello)
    
    // C3
    ... currently no corresponding functionality ...

### Stringification

    #define CHECK(x) do { if (!x) abort(#x); } while(0)
    
    // C3
    macro fn check(#expr)
    {
       if (!#expr) abort($stringify(#expr));
    }

## Top level evaluation

Script languages, and also upcoming languages like *Jai*, 
usually have unbounded top level evaluation. 
The flexibility of this style of meta programming has a trade-off in making the code more challenging to understand. 

In C3, top level compile time evaluation is limited to `@if` attributes to conditionally enable or 
disable declarations. This makes the code easier to read, but at the cost of expressive power.

## Macro declarations

A macro is defined using `macro <name>(<parameters>)`. All user defined macros use the @ symbol if they use the `&` or `#` parameters.

The parameters have different sigils: `$` means compile time evaluated (constant expression or type). `#` indicates an expression that is not yet evaluated, but is bound to where it was defined. Finally `&` is used to *implicitly* pass a parameter by reference.
`@` is required on macros that use `#` and `&` parameters.

A basic swap:

    /**
     * @checked $assignable(*a, $typeof(*b)) && $assignable(*b, $typeof(*a))
     */
    macro void @swap(&a, &b)
    {
        $typeof(*a) temp = *a;
        *a = *b;
        *b = temp;
    }

This expands on usage like this:

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

Note the necessary `&`. Here is an incorrect swap and what it would expand to:

    macro void badswap(a, b)
    {
        $typeof(a) temp = a;
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

## Macro methods

Similar to regular *methods* a macro may also be associated with a particular type:

    struct Foo { ... }
    
    macro Foo.generate(&self) { ... }
    Foo f;
    f.generate();

See the chapter on [functions](/references/docs/functions) for more details.

## Capturing a trailing block

It is often useful for a macro to take a trailing compound statement as an argument. In C++ this pattern is usually expressed with a lambda, but in C3 this is completely inlined.

To accept a trailing block, `; @name(param1, ...)` is placed after declaring the regular macro parameters.

Here's an example to illustrate its use:

    /**
     * A macro looping through a list of values, executing the body once
     * every pass.
     *
     * @require $defined(a.len) && $defined(a[0])
     **/
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
        }
    }
    
    // Expands to code similar to:
    fn void test()
    {
        int[] a = { 1, 2, 3 };
        {
            int[] __a = a;
            for (int __i = 0; i < __a.len; i++)
            {
                io::printfn("Value: %d, x2: %d", __value1, __value2);
            }
        }
    }


## Macros returning values

A macro may return a value, it is then considered an expression rather than a statement:

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

## Calling macros

It's perfectly fine for a macro to invoke another macro or itself.

    macro square(x) { return x * x; }
    
    macro squarePlusOne(x)
    {
        return square(x) + 1; // Expands to "return x * x + 1;"
    }

The maximum recursion depth is limited to the `macro-recursion-depth` build setting.

## Macro vaargs

Macros support the typed vaargs used by C3 functions: `macro void foo(int... args)` and `macro void bar(args...)` 
but it also supports a unique set of macro vaargs that look like C style vaargs: `macro void baz(...)`

To access the arguments there is a family of $va-* built-in functions to retrieve
the arguments:

    macro compile_time_sum(...)
    {
       var $x = 0;
       $for (var $i = 0; $i < $vacount; $i++)
           $x += $vaconst($i);
       $endfor
       return $x;
    }
    $if compile_time_sum(1, 3) > 2: // Will compile to $if 4 > 2
      ...
    $endif

### $vacount

Returns the number of arguments.

### $vaarg

Returns the argument as a regular parameter. The argument is
guaranteed to be evaluated once, even if the argument is used multiple times.

### $vaconst

Returns the argument as a compile time constant, this is suitable for
placing in a compile time variable or use for compile time evaluation,
e.g. `$foo = $vaconst(1)`. This corresponds to `$` parameters.

### $vaexpr

Returns the argument as an unevaluated expression. Multiple uses will
evaluate the expression multiple times, this corresponds to `#` parameters.

### $vatype

Returns the argument as a type. This corresponds to `$Type` style parameters, 
e.g. `$vatype(2) a = 2` 

### $varef

Returns the argument as an lvalue. This corresponds to `&myref` style parameters,
e.g. `*$varef(1) = 123`.

### $vasplat

`$vasplat` allows you to paste the varargs in the call into another call. For example,
if the macro was called with values `"foo"` and `1`, the code `foo($vasplat())`, would become `foo("foo", 1)`.
You can even extract provide a range as the argument: `$vasplat(2..4)` (in this case, this would past in 
arguments 2, 3 and 4).

Nor is it limited to function arguments, you can also use it with initializers:

    int[*] a = { 5, $vasplat(2..), 77 };

## Untyped lists

Compile time variables may hold untyped lists. Such lists may be iterated over or 
implicitly converted to initializer lists:

    var $a = { 1, 2 };
    $foreach ($x : $a)
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

