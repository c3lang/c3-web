---
title: "Operator Overloading: C3 0.7.1"
date: 2025-04-30
author: "Christoffer Lernö"
---


0.7.0 was supposed to be THE big change this year, but 0.7.1 is actually quitely introducing some very important features.

### Operator overloading

Operator overloading has been added to help games and maths programming, a [previous blog goes into more depth](https://c3.handmade.network/blog/p/9019-c3_goes_game_and_maths_friendly_with_operator_overloading), below is a short overview.


#### Operator overloading overview
The `@operator` attribute defines the overload for `Vec + int` 

To define something like `int + Vec` there are two additional attributes added: 

- `@operator_s` ("symmetric operator") allows either type to go first.
- `@operator_r` ("reverse operator") requires the second term to be the first one in the arithmetic expression.

#### Examples

Overloading with the `@operator` overload attribute:

```c3
// Defining a simple add: "Complex + Complex"
macro Complex Complex.add(self, Complex b) @operator(+)
{
    return { .v = self.v + b.v };
} 
// Define the self-modifying +=: "Complex += Complex"
macro Complex Complex.add_this(&self, Complex b) @operator(+=) 
{
    return { .v = self.v += b.v };
}
```

Overloading with the `@operator_s` symmetric overload attribute:

```c3
// This defines "Quaternion * Real" /and/ "Real * Quaternion"
macro Quaternion Quaternion.scale(self, Real s) @operator_s(*)
{
    return { .v = self.v * s };
}
```

Overloading with the `@operator_r` reverse overload attribute:

```c3
// This defines "Real / Complex"
macro Complex Complex.div_real_inverse(Complex c, Real r) @operator_r(/) 
{
    return ((Complex) { .r = self }).div(c);
}
```


### More static checking

An important step towards correctness is that `@require` contracts for 
functions are now inlined at the caller site in safe mode. This has always 
been a thing for macros, but now this works for functions as well. 

This means simple errors can be caught by the compiler, such as using a null 
pointer where it wasn't allowed or passing a zero where the argument:

```c3
<*
 @require a > 0 : "The parameter cannot be zero"
*>
fn void test(int a)
{ ... }

fn void main()
{
    // Compile time error: contract violation 
    // "The parameter cannot be zero"
    test(0); 
}
```

This is just the start. C3 will increasingly use more static analysis to check correctness at compile time.

### Improvements to attributes

`@if` attributes now work on locals and aliases defined using `alias` can now be `@deprecated`.

### Enum lookup

0.6.9 and 0.7.0 introduced ways to let an enum convert to its associated value:

```c3
enum Foo : (inline int val)
{
    ABC = 3,
    LIFF = 42
}

fn void main()
{
    int val = Foo.LIFF; // Same as Foo.LIFF.val
}
```

Still, converting *from* such a associated value *to* an enum used the rather unknown `@enum_from_value` macro.

To make this more convenient, enums gain two new type functions `.lookup` and `.lookup_field`:
- `lookup(value)` lookup an enum by inlined value.
- `lookup_field(field_name, value)` lookup an enum by associated value.

```c3
fn void main()
{
    Foo? foo = Foo.lookup(42);            // Returns Foo.LIFF
    Foo? foo2 = Foo.lookup_field(val, 3); // Returns Foo.ABC
    Foo? foo3 = Foo.lookup_field(val, 1); // Returns NO_FOUND?
}
```

### Other changes

- `String str = ""` was not guaranteed to return a pointer to a null terminated empty string, unlike `ZString str = ""`. This was a little inconsistent, so both return the same thing now.
- Slice assignment `foo[..] = bar` would sometimes mean copying the right hand side to each element of `foo` and sometimes it meant a slice copy. Now semantics have been tightened: `foo[..] = bar` assigns to each element and `foo[..] = bar[..]` is a copy.
- `c3c build` now picks the first target rather than the first executable.
- Finally the Win32 thread implementation has been improved.

##  What's next?

Following this release, the focus will be on improving the standard library organization. New guidelines for submitting modules have been adopted to ensure that the implementation can be worked on without having to be tied to a pull request. Right now an [updated matrix library](https://github.com/m0tholith/c3math) is actively worked on.

There is also a [new repo for uncurated C3 resources](https://github.com/c3lang/c3-showcase), where anyone can be showcased: So if you have a project you want to share – do file a pull request.


### Change Log
<details>
	<summary class="
		text-black 
		dark:text-white
		font-medium
		text-lg
		"
	>
		Click for full change log
	</summary>
	
### Changes / improvements
- Better errors on some common casting mistakes (pointer->slice, String->ZString, deref pointer->array) #2064.
- Better errors trying to convert an enum to an int and vice versa.
- Function `@require` checks are added to the caller in safe mode. #186
- Improved error message when narrowing isn't allowed.
- Operator overloading for `+ - * / % & | ^ << >> ~ == != += -= *= /= %= &= |= ^= <<= >>=`
- Add `@operator_r` and `@operator_s` attributes.
- More stdlib tests: `sincos`, `ArenaAllocator`, `Slice2d`.
- Make aliases able to use `@deprecated`.
- Refactored stdlib file organization.
- Allow `@if` on locals.
- String str = "" is now guaranteed to be null terminated. #2083
- Improved error messages on `Foo { 3, abc }` #2099.
- `Foo[1..2] = { .baz = 123 }` inference now works. #2095
- Deprecated old inference with slice copy. Copying must now ensure a slicing operator at the end of the right hand side: `foo[1..2] = bar[..]` rather than the old `foo[1..2] = bar`. The old behaviour can be mostly retained with `--use-old-slice-copy`).
- Added `Enum.lookup` and `Enum.lookup_field`.
- `c3c build` picks first target rather than the first executable #2105.
- New Win32 Mutex, ConditionVariable and OnceFlag implementation

### Fixes
- Trying to cast an enum to int and back caused the compiler to crash.
- Incorrect rounding at compile time going from double to int.
- Regression with invalid setup of the WASM temp allocator.
- Correctly detect multiple overloads of the same type.
- ABI bug on x64 Linux / MacOS when passing a union containing a struct of 3 floats. #2087 
- Bug with slice acces as inline struct member #2088.
- `@if` now does implicit conversion to bool like `$if`. #2086
- Fix broken enum inline -> bool conversions #2094.
- `@if` was ignored on attrdef, regression 0.7 #2093.
- `@ensure` was not included when the function doesn't return a value #2098.
- Added missing `@clone_aligned` and add checks to `@tclone`
- Comparing a distinct type with an enum with an inline distinct type failed unexpectedly.
- The `%s` would not properly print function pointers.
- Compiler crash when passing an untyped list as an argument to `assert` #2108.
- `@ensure` should be allowed to read "out" variables. #2107
- Error message for casting generic to incompatible type does not work properly with nested generics #1953
- Fixed enum regression after 0.7.0 enum change.
- ConditionVariable now properly works on Win32

### Stdlib changes
- Hash functions for integer vectors and arrays.
- Prefer `math::I` and `math::I_F` for `math::IMAGINARY` and `math::IMAGINARYF` the latter is deprecated.
- Add `array::contains` to check for a value in an array or slice.

</details>

### Want To Dive Into C3?
Check out the [documentation](/getting-started) 
or [download it and try it out](/getting-started/prebuilt-binaries), if you have any questions chat to us on [Discord](https://discord.gg/qN76R87).