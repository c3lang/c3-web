---
title: "Considering user-defined numerical types"
date: 2023-01-22
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8635-considering_user-defined_numerical_types](https://c3.handmade.network/blog/p/8635-considering_user-defined_numerical_types)*

Recently, I did some work on the math libraries for C3. This involved working on vector, matrix and complex types. In the process I added some conveniences to the built in (simd) vector types. One result of this was that rather than having a `Vector2` and `Vector3` user defined type, I would simply add methods to `float[<2>]` and `float[<3>]` (+ double versions). This works especially well since `+ - / *` are all defined on vectors.

In other words, even without operator overloading this works:

```
float[<2>] a = get_a();
float[<2>] b = get_b();
return a + b;
```

Seeing as a complex number being nothing other than a vector of two elements, it seemed interesting to implement the complex type that way, and get much arithmetics for free.

Just making a complex type a typedef of `float[<2>]` has problems though. Any method defined on the complex type would be defined on `float[<2>]`!

```
define Complex = float[<2>]; // Type alias
// Define multiply
fn Complex Complex.mul(Complex a, Complex b) 
{
    return {
        a[0] * b[0] - a[1] * b[1], 
        a[1] * b[0] + b[1] * a[0] 
    };
}
...
float[<2>] f = get_f();
f = f.mul(f); // Accidentally get the Complex version!
```

## Distinct types

Now C3 has the concept of "distinct" types. That is, a type which is in practice identical to some type, but has a different name and will not be implicitly cast into the other. For example, I can write `define Id = distinct int` and have the compiler complain if an `int` rather than an `Id` is used.

This is similar to the C trick of wrapping a type in a struct, but without the inconvenience of that method.

This solves our problem form from before:

```
define Complex = distinct float[<2>]; // Distinct type
fn Complex Complex.mul(Complex a, Complex b) 
{
    return {
        a[0] * b[0] - a[1] * b[1], 
        a[1] * b[0] + b[1] * a[0] 
    };
}
float[<2>] f = get_f();
Complex c = get_c();
c = c.mul(c); // Works.
f = f.mul(f); // Compile time error!
```

At first glance this looks promising. Unfortunately the advantages of distinct types becomes a disadvantage: the distinct type retains the functions of the original type. For the `c + d` case this is what we want, but `c * d` is not what we expect:

```
Complex c = { 1, 3 };
Complex d = { 2, 7 };
e = c.mul(d); // Correct! e is { -19, 13 }
e = c * d; // e is { 2, 21 }
```

While we can try to remember to use the right thing, it's far from ideal. Especially if this is baked into the standard library: you can't have a type that mostly behaves incorrectly for regular operators!

## Possible solutions

Since we're able to change the language semantics to try to "fix" this while still using "distinct", there are a few obvious solutions:

1. Being able to "override" an operator for a distinct type. In this case we would override `*` and `/` and leave the other operators. This would be a limited form of overloading.
2. Being able to "turn off" operators. So in this case we turn off `*` and `/` forcing the programmer to use methods, like `mul` and `div` instead.
3. Always require to explicitly inherit operators and methods.

These could work, but we need to recognize the added complexity needed for these solutions. And on top of that, some functionality can't quite be described this way, such as conversion of floats to complex numbers.

## Operator overloading with structs

The common solution in C++ would be a struct with operator overloading to get `+ - * /`. C3 doesn't have operator overloading for numbers, but maybe we could add it?

However, operator overloading is not sufficient to get us conversion from floats to complex numbers. For that we need user-defined conversion operators, which interacts with the type system in various ways. This leaves the whole problem with custom constructor and custom conversions: is `float` -> `Complex` a conversion function on `float` or a construction function on `Complex`? All of this interacts in subtle ways with other implicit conversions.

## Built-in types

Another possibility is of course to make the types built-in. After all this is how C does complex types. But then the problem is how to limit it: ok, complex types built-in but then what about quaternions? Matrices? Matrices with complex numbers? Matrices with quaternions?!

Drawing a line here means some types have better support than others, and trying to go beyond (simd) vectors, it's hard to figure out where that line should be drawn.

## Worth it?

Ultimately each feature needs to be balanced against utility. Are the benefits sufficiently big to motivate the cost. Comparing what is already in C3 against what would be necessary to add, it seems that the cost would be fairly high.

Even if vectors work for complex numbers, matrices are more likely to require operator overloading with structs which is a bigger feature than overriding operators on distinct types. This means that the idea fixing so that `Complex` can be a vector is a feature with very limited use.

General overloading and user-defined conversion functions can be applied to a wider set of types, but has a much higher cost with the primary use restricted to numeric types and string handling.

So even if it's more useful, it's also costs a whole lot more in terms of language complexity, making it ultimately a net negative for the language as a whole.

So unless I have come up with some other solution, user-defined numeric types will have to stick with methods and explicit conversions.

## Comments


---
### Comment by Christoffer Lernö

Recently, I did some work on the math libraries for C3. This involved working on vector, matrix and complex types. In the process I added some conveniences to the built in (simd) vector types. One result of this was that rather than having a `Vector2` and `Vector3` user defined type, I would simply add methods to `float[<2>]` and `float[<3>]` (+ double versions). This works especially well since `+ - / *` are all defined on vectors.

In other words, even without operator overloading this works:

```
float[<2>] a = get_a();
float[<2>] b = get_b();
return a + b;
```

Seeing as a complex number being nothing other than a vector of two elements, it seemed interesting to implement the complex type that way, and get much arithmetics for free.

Just making a complex type a typedef of `float[<2>]` has problems though. Any method defined on the complex type would be defined on `float[<2>]`!

```
define Complex = float[<2>]; // Type alias
// Define multiply
fn Complex Complex.mul(Complex a, Complex b) 
{
    return {
        a[0] * b[0] - a[1] * b[1], 
        a[1] * b[0] + b[1] * a[0] 
    };
}
...
float[<2>] f = get_f();
f = f.mul(f); // Accidentally get the Complex version!
```

## Distinct types

Now C3 has the concept of "distinct" types. That is, a type which is in practice identical to some type, but has a different name and will not be implicitly cast into the other. For example, I can write `define Id = distinct int` and have the compiler complain if an `int` rather than an `Id` is used.

This is similar to the C trick of wrapping a type in a struct, but without the inconvenience of that method.

This solves our problem form from before:

```
define Complex = distinct float[<2>]; // Distinct type
fn Complex Complex.mul(Complex a, Complex b) 
{
    return {
        a[0] * b[0] - a[1] * b[1], 
        a[1] * b[0] + b[1] * a[0] 
    };
}
float[<2>] f = get_f();
Complex c = get_c();
c = c.mul(c); // Works.
f = f.mul(f); // Compile time error!
```

At first glance this looks promising. Unfortunately the advantages of distinct types becomes a disadvantage: the distinct type retains the functions of the original type. For the `c + d` case this is what we want, but `c * d` is not what we expect:

```
Complex c = { 1, 3 };
Complex d = { 2, 7 };
e = c.mul(d); // Correct! e is { -19, 13 }
e = c * d; // e is { 2, 21 }
```

While we can try to remember to use the right thing, it's far from ideal. Especially if this is baked into the standard library: you can't have a type that mostly behaves incorrectly for regular operators!

## Possible solutions

Since we're able to change the language semantics to try to "fix" this while still using "distinct", there are a few obvious solutions:

1. Being able to "override" an operator for a distinct type. In this case we would override `*` and `/` and leave the other operators. This would be a limited form of overloading.
2. Being able to "turn off" operators. So in this case we turn off `*` and `/` forcing the programmer to use methods, like `mul` and `div` instead.
3. Always require to explicitly inherit operators and methods.

These could work, but we need to recognize the added complexity needed for these solutions. And on top of that, some functionality can't quite be described this way, such as conversion of floats to complex numbers.

## Operator overloading with structs

The common solution in C++ would be a struct with operator overloading to get `+ - * /`. C3 doesn't have operator overloading for numbers, but maybe we could add it?

However, operator overloading is not sufficient to get us conversion from floats to complex numbers. For that we need user-defined conversion operators, which interacts with the type system in various ways. This leaves the whole problem with custom constructor and custom conversions: is `float` -> `Complex` a conversion function on `float` or a construction function on `Complex`? All of this interacts in subtle ways with other implicit conversions.

## Built-in types

Another possibility is of course to make the types built-in. After all this is how C does complex types. But then the problem is how to limit it: ok, complex types built-in but then what about quaternions? Matrices? Matrices with complex numbers? Matrices with quaternions?!

Drawing a line here means some types have better support than others, and trying to go beyond (simd) vectors, it's hard to figure out where that line should be drawn.

## Worth it?

Ultimately each feature needs to be balanced against utility. Are the benefits sufficiently big to motivate the cost. Comparing what is already in C3 against what would be necessary to add, it seems that the cost would be fairly high.

Even if vectors work for complex numbers, matrices are more likely to require operator overloading with structs which is a bigger feature than overriding operators on distinct types. This means that the idea fixing so that `Complex` can be a vector is a feature with very limited use.

General overloading and user-defined conversion functions can be applied to a wider set of types, but has a much higher cost with the primary use restricted to numeric types and string handling.

So even if it's more useful, it's also costs a whole lot more in terms of language complexity, making it ultimately a net negative for the language as a whole.

So unless I have come up with some other solution, user-defined numeric types will have to stick with methods and explicit conversions.