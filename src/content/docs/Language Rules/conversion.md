---
title: Conversions and Promotions
description: Conversions and Promotions
sidebar:
    order: 210
---

## Conversion Rules For C3
C3 differs from C in some crucial respects when it comes to number conversions and promotions. These are the rules for C3:

- Floating point to integer conversions require a cast.
- Intger to floating point conversions do not require a cast.
- `bool` values convert to floating point as `0.0` or `1.0`.
- Widening floating point conversions are only conditionally allowed&dagger;.
- Narrowing conversions require a cast&dagger;.
- Widening integer conversions are only conditionally allowed&dagger;.
- Conversions between signed and unsigned values of the same type do not require a cast. As such, values will wrap around if outside the representable range of the target type.
- In conditionals, conversions from floating point to `bool` do not require a cast. Any non-zero floating point values are considered true.
- Implicit conversion to `bool` only occurs in conditionals or when the value is enclosed in `(...)`, e.g. `bool x = (1.0)` or `if (1.0) { ... }`.

&dagger;: These statements are approximate and have additional nuances to account for.

The reason why conversion from integers to floating point numbers happens implicitly is because floating point numbers can preserve a very wide range of magnitudes, even though the conversion may lose precision in the least significant digits, and thus the approximate sense of what a value was is not lost. In other words, floating point values generally preserve the *relative magnitude* of the other number types, hence implicit conversions to them generally preserve numbers' meaning relative to each other.

In contrast, applications where precision must *always* be retained in *all* numeric digits (such as when all parts of a simulation's space must behave numerically the same, such as occasionally is required for some games that require both a large *but approximately fixed-scale* space and uniformly precise physics) should considering using integers or fixed point numbers instead of floating point numbers. 

Most applications though will work fine with floating point math. Just make sure you understand that the least significant digits in floating point values can behave as if they don't exist as a value scales up, such that (for example) repeatedly adding 1 millions of times in succession can have *no effect* on the value, among other similarly insidiously subtle numerical problems.

C3 uses two's complement arithmetic for all integer math.

### Target type

:::note 
These abbreviations are used in the text below:
- "lhs" means "left hand side".
- "rhs" means "right hand side".
:::

The left hand side of an assignment, or the parameter type in a call, is known as the *target type*. The target type is used for implicit widening and inferring struct initialization.

### Common arithmetic promotion

Like C, C3 uses implicit arithmetic promotion of integer and floating point variables before arithmetic operations:

1. For any floating point type with a bitwidth smaller than 32 bits, widen to `float`. For example, in C3 `float16` converts to `float` before arithmetic is performed.
2. For an integer type smaller than the *minimum arithmetic width*, promote the value to a same-signed integer of the *minimum arithmetic width*. This usually corresponds to a C `int` or `unsigned int`. For example, in C3 `ushort` converts to `uint` before arithmetic is performed.

### Implicit narrowing

Under some circumstances, such as after arithmetic promotion or when initializing from literals, an expression with an integer type may implicitly narrow to a smaller integer type. Similarly, a floating point type may likewise implicitly narrow to a less wide floating point type under the right conditions. This is despite [the above rules](/language-rules/conversion/#conversion-rules-for-c3); it is done only when likely to be safe and natural. This process is determined by the following algorithm:

1. Shifts and assignment use the type of the left hand side (lhs) of the expression.
2. `++`, `--`, `~`, `-`, `!!`, `!` &mdash; all check the inner type.
3. `+`, `-`, `*`, `/`, `%`, `^`, `|`, `&`, `??`, `?:` &mdash; all check both the lhs and the rhs.
4. Narrowing integer or floating point casts: assume the type is the narrowed type.
5. Widening integer or floating point casts: look at the inner expression, ignoring the cast.
6. In the case of any other cast, the data is assumed to be opaque (like untyped binary data; `void*` referenced data) and the type is that of the cast.
7. In the case of an integer literal, instead of looking at the type, check that the integer would fit the type to narrow to.
8. For `.len` access, allow narrowing to C `int` width for better compatibility with C.
9. For all other expressions, check against the size of the type.

As a rough guide: if all the subexpressions originally were small enough before arithmetic promotion or as literals then it's ok to implicitly convert the result. Otherwise though, conversions that could lose information generally require casts.

Examples:
```c3
float16 h = 12.0;
float f = 13.0;
double d = 22.0;

char x = 1;
short y = -3;
int z = 0xFFFFF;
ulong w = -0xFFFFFFF;

x = x + x;  // => Calculated as `x = (char)((int)x + (int)x);`.
x = y + x;  // => Error. Narrowing is not allowed because short y is wider than char x.
h = x * h;  // => Calculated as `h = (float16)((float)x * (float)h);`.
h = f + x;  // => Error. Narrowing is not allowed because float f is wider than float16 h.
```

### Implicit widening

Unlike C, implicit widening will only happen on "simple expressions":
if the expression is a primary expression, or a unary operation on a primary expression.

For assignment, special rules hold. For an assignment to a binary expression, *if* its two subexpressions are "simple expressions" and the binary expression is `+`, `-`, `/`, `*`, allow an implicit promotion of the two sub expressions.

```c3
int a = ...
short b = ...
char c = ...
long d = a; // Valid - simple expression.
int e = (int)(d + (a + b)); // Error
int f = (int)(d + ~b); // Valid
long g = a + b; // Valid
```

As a rule of thumb, if there are more than one possible conversion, then an explicit cast is needed.

Example:

```c3
long h = a + (b + c);

// Possible intention 1
long h = (long)(a + (b + c));

// Possible intention 2
long h = (long)a + (long)(b + c);

// Possible intention 3
long h = (long)a + ((long)b + (long)c);
```

### Maximum type

The *maximum type* is a concept used when unifying two or more types. The algorithm follows:

1. First perform implicit promotion.
2. If both types are the same, the maximum type is this type. 
3. If one type is a floating point type, and the other is an integer type, 
the maximum type is the floating point type. E.g. `int + float -> float`.
4. If both types are floating point types, the maximum type is the widest floating point type. E.g. `float + double -> double`.
5. If both types are integer types with the same signedness, the 
maximum type is the widest integer type of the two. E.g. `uint + ulong -> ulong`.
6. If both types are integer types with different signedness, the 
maximum type is a signed integer with the same bit width as the maximum integer type. `ulong + int -> long`
7. If at least one side is a struct or a pointer to a struct with an 
`inline` directive on a member, check recursively check if the type of 
the inline member can be used to find a maximum type (see below under sub struct conversions)
8. All other cases are errors.
 
### Substruct conversions

Substructs may be used in place of its parent structs in many cases. The rule is as follows:

1. A substruct pointer may implicitly convert to a parent struct.
2. A substruct *value* may be implicitly assigned to a variable with the parent struct type, 
This will *truncate* the value, copying only the parent part of the substruct. However, a 
substruct value cannot be assigned its parent struct.
3. Substruct slices and arrays *can not* be cast (implicitly or explicitly) to an array of the parent struct type.

### Pointer conversions

Pointer conversion between types usually need explicit casts. 
The exception is `void*` which any type may implicitly convert *to* or *from*. 
Conversion rules from and to arrays are detailed under [arrays](/language-common/arrays/)

### Vector conversions

Conversion between underlying vector types need explicit conversions. They work
as regular conversions with one notable exception: converting a `true` boolean
vector value into an int will yield a value with all bits set. So `bool[<2>] { true, false }`
converted to for example `char[<2>]` will yield `{ 255, 0 }`.

Vectors can also be cast to the corresponding array type, for example: `char[<2>]` <=> `char[2]`.

## Binary conversions

#### 1. Multiplication, division, remainder, subtraction / addition with both operands being numbers

These operations are only valid for integer and float types.

1. Resolve the operands.
2. Find the [maximum type](#maximum-type) of the two operands.
3. Promote both operands to the resulting type if both are simple expressions
4. The resulting type of the expression is the [maximum type](#maximum-type).

#### 2. Addition with left side being a pointer

1. Resolve the operands.
2. If the rhs is not an integer, this is an error.   
3. If the rhs has a bit width that exceeds isz, this is an error.
4. The result of the expression is the lhs type.

#### 3. Subtraction with lhs pointer and rhs integer 

1. Resolve the operands.
2. If the right hand type has a bit width that exceeds isz, this is an error.
3. The result of the expression is the left hand type.

#### 4. Subtraction with both sides pointers

1. Resolve the operands.
2. If the either side is a `void*`, it is cast to the other type.
3. If the types of the sides are different, this is an error.   
4. The result of the expression is isz.
5. If this result exceeds the target width, this is an error.

#### 6. Bit operations `^` `&` `|`

These operations are only valid for integers and booleans.

1. Resolve the operands.
2. Find the [maximum type](#maximum-type) of the two operands.
3. Promote both operands to the [maximum type](#maximum-type) if they are simple expressions.
4. The result of the expression is the [maximum type](#maximum-type).

#### 6. Shift operations `<<` `>>` 

These operations are only valid for integers.

1. Resolve the operands.
2. In safe mode, insert a trap to ensure that rhs >= 0 and rhs < bit width of the left hand side.
3. The result of the expression is the lhs type.

#### 7. Assignment operations `+=` `-=` `*=` `*=` `/=` `%=` `^=` `|=` `&=`

1. Resolve the lhs.
2. Resolve the right operand as an assignment rhs.
3. The result of the expression is the lhs type.

#### 8. Assignment shift `>>=` `<<=`

1. Resolve both operands
2. In safe mode, insert a trap to ensure that rhs >= 0 and rhs < bit width of the left hand side.
3. The result of the expression is the lhs type.

#### 9. `&&` and `||`

1. Resolve both operands.
2. Insert bool cast of both operands.
3. The type is bool.

#### 10. `<=` `==` `>=` `!=`

1. Resolve the operands, left to right.
2. Find the [maximum type](#maximum-type) of the two operands.
3. Promote both operands to the [maximum type](#maximum-type).
4. The type is bool.

## Unary conversions

#### 1. Bit negate

1. Resolve the inner operand.
2. If the inner type is not an integer this is an error.   
2. The type is the inner type.

#### 2. Boolean not

1. Resolve the inner operand.
2. The type is bool.

#### 3. Negation

1. Resolve the inner operand.
2. If the type inner type is not a number this is an error.
3. If the inner type is an unsigned integer, cast it to the same signed type.
4. The type is the type of the result from (3)

#### 4. `&` and `&&`

1. Resolve the inner operand.
2. The type is a pointer to the type of the inner operand.

#### 5. `*`

1. Resolve the inner operand.
2. If the operand is not a pointer, or is a `void* ` pointer, this is an error.
3. The type is the pointee of the inner operand's type.

Dereferencing 0 is implementation defined.

#### 6. `++` and `--`

1. Resolve the inner operand.
2. If the type is not a number, this is an error.
3. The type is the same as the inner operand.

## Base expressions

#### 1. Typed identifiers

1. The type is that of the declaration.
2. If the width of the type is less than that of the target type, widen to the target type.
3. If the width of the type is greater than that of the target type, it is an error.

#### 2. Constants and literals

1. If the constant is an integer, it is assumed to be the *arithmetic promotion width* and signed. 
If the suffix `u` is added, it is assumed to be an unsigned number. If a suffix `ixx` or `uxx` 
is given then it is considered a an integer of that type width and signedness. It cannot be implicitly narrowed. 
2. If the constant is a floating point value, it is assumed to be a `double` unless suffixed
 with `f` which is then assumed to be a `float`. If a bit width is given after `f`, 
 it is instead a floating point type of that width.
