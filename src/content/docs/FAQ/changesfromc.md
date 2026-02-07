---
title: Changes From C
description: Changes From C
sidebar:
    order: 702
---


Although C3 is trying to improve on C, this does not only mean addition of features, but also removal, or breaking changes:

##### No mandatory header files

There is a C3 interchange header format for declaring interfaces of libraries, but it is only used for special applications.

##### Removal of the old C macro system

The old C macro system is replaced by a new C3 macro system.

##### Import and modules

C3 uses module imports instead of header includes to link modules together.

##### Member access using `.` even for pointers

The `->` operator is removed, access uses dot for both direct and pointer access. Note that this is just single access: to access a pointer of a pointer (e.g. `int**`) an explicit dereference would be needed.

##### Different operator precedence

Notably bit operations have higher precedence than +/- and comparison operators, making code like this: `a & b == c` evaluate like `(a & b) == c` instead of C's `a & (b == c)`. See the page about [precedence rules](/language-rules/precedence/).

##### Removal of the const type qualifier

The const qualifier is only retained for actual constant variables. C3 uses a special type of [post condition](/language-common/contracts/) for functions to indicate that they do not alter input parameters.

```c3
<*
 This function ensures that foo is not changed in the function.
 @param [in] foo
 @param [out] bar
*>
fn void test(Foo* foo, Bar* bar)
{
    bar.y = foo.x;
    // foo.x = foo.x + 1 - compile time error, can't write to 'in' param.
    // int x = bar.y     - compile time error, can't read from an 'out' param.
}
```

*Rationale: const correctness requires littering const across the code base. Although const is useful, it provides weaker guarantees that it appears.*

##### Fixed arrays do not decay and have copy semantics

C3 has three different array types. Variable arrays and slices decay to pointers, but fixed arrays are value objects and do not decay.

```c3
int[3] a = { 1, 2, 3 };
int[4]* b = &a; // ERROR: Implicitly casting 'int[3]*' to 'int[4]*' is not permitted.
int* c = a; // ERROR: Cannot cast 'int[3]' to 'int*'.
int* d = &a; // Valid implicit conversion
int* e = b; // Valid implicit conversion
int[3] f = a; // Copy by value!
```

##### Removal of multiple declaration syntax with initialization

Only a single declaration with initialization is allowed per statement in C3:

```c3
int i, j = 1; // ERROR
int a = 1;    // Ok
int b, c;     // Ok
```

In conditionals, a special form of multiple declarations are allowed but each must then provide its type:

```c3
for (int i = 0, int j = 1; i < 10; i++, j++) { ... }
```

##### Integer promotions rules and safe signed-unsigned comparisons

Promotion rules for integer types are different from C. 
C3 allows implicit widening only
where there is only a single way to widen the expression. To explain the latter:
take the case of `long x = int_val_1 + int_val_2`. In C this would widen the result of the addition:
`long x = (long)(int_val_1 + int_val_2)`, but there is another possible 
way to widen: `long x = (long)int_val_1 + (long)int_val_2`. So, in this case, the widening is disallowed in C3. However, `long x = int_val_1` is unambiguous, so C3 permits it just like C (read more on the [conversion page](/language-rules/conversion/). 

C3 also adds *safe signed-unsigned comparisons*: this means that comparing signed and unsigned values will always yield the correct result:

```c3
// The code below would print "Hello C3!" in C3 and "Hello C!" in C.
int i = -1;
uint j = 1;
if (i < j)
{
    printf("Hello C3!\n");
}
else
{
    printf("Hello C!\n");
}
```

##### `goto` removed

`goto` is removed and replaced with labelled `break` and `continue` together with the `nextcase` statement that allows you to jump between cases in a `switch` statement.

*Rationale: It is very difficult to make goto work well with defer and implicit unwrapping of optional results. It is not just making the compiler harder to write, but
the code is harder to understand as well. The replacements together with `defer` cover many if not all usages of `goto` in regular code.*

##### Implicit break in switches

Empty `case` statements have implicit fall through in C3, otherwise the `nextcase` statement is needed. `nextcase` can also be used to jump to any other `case` statement in the `switch`.

```c3
switch (h)
{
    case 1:
        a = 1;
        nextcase; // Fall through
    case 2:
        b = 123;
    case 3:
        a = 2;
        nextcase 2; // Jump to case 2
    default:
        a = 111;
}
```

##### Locals variables are implicitly zeroed

In C global variables are implicitly zeroed out, but local variables aren’t. In C3 both global and local variables are zeroed out by default, but may be *explicitly* undefined (using the `@noinit` attribute) if you wish to match the C behaviour.

###### Rationale for this change 
- In the "zero-is-initialization" paradigm, zeroing variables, in particular structs, 
is very common. By offering zero initialization by default this **avoids a whole class of vulnerabilities**.
- Another alternative that was considered for C3 was mandatory initialization,
but this adds a lot of extra boilerplate. 
- C3 also offers a way to opt out of zero-initialization, so the change comes at no performance loss.

##### Bitfields replaced by bitstructs

Bitfields are replaced by bitstructs that have a well-defined encapsulating type and an exact bit layout.

```c
// C
struct Foo
{
    int a : 3;
    unsigned b : 4;
    MyEnum c : 7;
};

struct Flags
{
    bool has_hyperdrive : 1;
    bool has_tractorbeam : 1;
    bool has_plasmatorpedoes : 1;
}    

// C3
bitstruct Foo : short
{  
    int a : 0..2;
    uint b : 3..6;
    MyEnum c : 7..13;
}

// Simple form, only allowed when all fields are bools.
struct Flags : char
{
    bool has_hyperdrive;
    bool has_tractorbeam;
    bool has_plasmatorpedoes;
}
```

##### Evaluation order is well-defined

Evaluation order (after precedence, meaning when operators have equal precedence, a.ka. associativity) is left-to-right and in assignment expressions assignment happens after expression evaluation.

##### Signed overflow is well-defined

Signed integer overflow always wraps using 2s complement. It is never undefined behaviour. This is unlike C, where unsigned values wrap around upon overflow but signed values have undefined overflow behavior.

##### Misleading C-like octal syntax removed

The old `0777` octal syntax present in C has been removed and replaced by a `0o` prefix in C3, e.g. `0o777`. Strings in C3 do not support octal sequences aside from `'\0'`.

This change was made because C's octal syntax looks too much like base 10 with leading zeros prepended (as is sometimes used outside of C to represent fixed-width base 10 numbers). Thus, removing such ambiguous octal syntax prevents a common source of subtle numerical errors in C.
