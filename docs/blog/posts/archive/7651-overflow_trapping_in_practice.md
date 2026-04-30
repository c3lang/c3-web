---
title: "Overflow trapping in practice"
date: 2021-02-26
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/7651-overflow_trapping_in_practice](https://c3.handmade.network/blog/p/7651-overflow_trapping_in_practice)*

Last post about arithmetics I listed the following problems related to overflow and arithmetics:
  

1. Overflow traps on unsigned integers makes the mixed signedness case very hard to get right.
2. Overflow traps cause unexpected and hard-to-spot non commutative and associative behaviour in expressions that otherwise would have been fine.
3. Wrapping behaviour enables buffer overflows and similar exploits.
4. In most languages it doesn't matter if the left hand sign can contain the number, what matters are the types on the right hand side, which isn't always intuitive or desired.

  
Let's look at some attempts to fix these problems, starting with handling mixed signedness.
  
  

## Mixed signedness

  
  
As we saw in the previous post, mixed signedness is not trivial. The choices made by C are actually fairly reasonable if the idea is to make most situations "just work" as the user intended. However whatever the solution, they all have their own set of problems. Looking at these first will allow us to understand ramifications of other choices later on.
  
  

### 1. "Widen and narrow"

  
This method relies on widening the operands to a common super type. Let us look at our old example:
  
  

```
unsigned x = 10;
int change = -1;
x = x + change;
```

  
  
The idea is that we promote all operands to the biggest type that can contain both operands, in this case it's likely a long long and perform the operation using that type. The trap is then in an implicit cast back to the original size.
  
  
The code above would implicitly be turned into:
  

```
unsigned x = 10;
int change = -1;
long long _temp = (long long)x + (long long)change;
if (_temp < 0 || _temp > UINT_MAX) panic();
x = (unsigned)_temp;
```

  
  
This strategy works, with the caveat that we need to always be able to find a wider type in order to do this widening.
  
  
In a language like Zig, which allows arbitrarily wide operands, this is not a problem but if there are a fixed number of types – what do we do? In C# the solution is basically to say that this works up to 32 bits, but signed and unsigned 64 bit ints cannot be combined, even though unsigned 64 bit integers should be fairly common.
  
  
If we insist that all integer types need to have an unsigned counterpart then we either need to stop at some arbitrary place - like C# does – or provide arbitrarily wide integers. Another solution is to provide a signed "maxint" that has no unsigned counterpart.
  
  
Pros:
  
- Conceptually simple.
  
- unsigned + signed has a definite type.
  
  
Cons:
  
- Widening may have a performance cost.
  
- The listed strategies to pick a wider integer (C# / Zig / maxint) all have drawbacks.
  
  

### 2. "Prefer signed"

  
This method relies on always converting to the signed type, given two equal types:
  
  
The code above would implicitly be turned into:
  
  

```
unsigned x = 10;
int change = -1;
// Possibly insert trap here:
// if (x > INT_MAX) panic();
int _temp = (int)x + change;
if (_temp < 0) panic();
x = (unsigned)_temp;
```

  
  
If signed addition overflow is a trapping error we need to have the signed int overflow check on x or otherwise it would be possible to add a large unsigned to a positive signed and get a negative result which would be inconsistent. However, if signed overflow is no error then the unsigned check isn't needed.
  
  
Unfortunately, with the overflow check we essentially forbid the unsigned value from having the top bit set which both adds add gotcha as well as making it unusable in some cases.
  
  
Pros:
  
- Conceptually simple.
  
- Definite result type.
  
- Efficient.
  
  
Cons:
  
- Broken if signed overflow is an error.
  
  

### 3. "Prefer unsigned"

  
This is what C does. With wrapping unsigned arithmetics this often yields the expected result, but there are counter examples such as:
  
  

```
unsigned x = 2;
int y = -100;
unsigned z = 10
if (z < x + y) unexpectedCall();
```

  
  
In the above code, the right hand side becomes a large number as y is converted into a large unsigned number. Division has a similar issue as unsigned and signed division works differently.
  
  
If conversion of the signed number instead traps on negative numbers, we're forced to cast, but even that won't help if unsigned overflow is an error.
  
  
Pros:
  
- Fairly simple.
  
- Efficient.
  
  
Cons:
  
- Does not work if unsigned overflow is an error.
  
- The unsigned result may give unexpected results when it is used for comparison or division.
  
- The resulting type might not always be obvious.
  
  

### 4. "Use a function"

  
This solution instead provides functions for various combinations, it might look like this:
  
  

```
unsigned x = 10;
int change = -1;
x = addSignedToUnsignedWithTrap(x, change);
```

  
  
How the function works doesn't matter to us here, we just know it will trap if the addition didn't work and give us the correct answer otherwise.
  
  
Pros:
  
- Well defined and easy to understand.
  
- Definite result type.
  
  
Cons:
  
- Clunky.
  
- Programmers might look for easier but "wrong" solutions.
  
  

### 5. "Require explicit casts"

  
A common solution is to require explicit casts, but as we see above in the "Use unsigned" and "Use signed" variants this doesn't necessarily work if there are overflows traps. Worse, it might potentially obscure issues:
  
  

```
unsigned x = 10;
int y = -50;
unsigned z = x + (unsigned)y; // No unsigned overflow, so ok?
```

  
  
Here the problem isn't that we're casting a negative value to a unsigned one – this is actually in many cases what we want. It's that we can't determine when the addition underflows and when it doesn't.
  
  
Since explicit casts encompass all of the strategies 1-3, we don't need to tie us to a particular (possibly inferior) solution. On the other hand it may take quite a bit of effort and deep understanding of the possible issues to do "the right thing". The whole idea behind making more overflow trapping is to make the default more safe. If that is the intention, then forcing the programmer to pick just the right set of casts to avoid bugs and potential attack vectors seem inconsistent.
  
  
Pros:
  
- Well defined and easy to understand.
  
- Definite result type.
  
- Free to pick the optimal strategy.
  
  
Cons:
  
- Does not work well when overflow is an error.
  
- May implicity remove safeguards.
  
- Picking the optimal set of casts is not always obvious.
  
  

### 5. "Mixed signedness type"

  
A more utopian idea is for unsigned/signed mixes to have no definite type, instead being inferred or creating multiple code paths depending on the result. The complexity and unpredictability, in particular in non-trivial examples makes it hard to view it as a reasonable solution:
  
  

```
unsigned x = ...;
int y = ...;
z = (x + y) / (x - y); // Signed or unsigned division here?
```

  
  
  
  

## The forgotten left hand side

  
  
As an example I mentioned that Zig currently uses the binary operand types when resolving arithmetics, so for example this will overflow:
  
  

```
var num1 : i8 = 16;
var num2 : i32 = 3;
var res : i32 = num2 + num1 * num1; // Boom!
```

  
  
It might feel odd that Zig chose this behaviour, but it's not strange. The reason we don't have this is because C makes an implicit widening to int for all operands first. This is why adding two ints and assigning it to a long long in C cannot result in a value larger than INT\_MAX, even though the long long might be able to contain several billion times as big.
  
  
The only difference between C and Zig is that we run into this problem more often in the latter. Rust also allows i8 \* i8, but there is no implicit widening, so it's more obvious as to what's happening.
  
  

### Left hand side widening

  
A simple algorithm for widening using the left hand side, given that all operands have the same signedness is the following:
  

1. Store the left hand side type, and assign this as the *target type*.
2. Depth first, look at the first leaf operand, which is any operand that already has a definite type (e.g. variable, explicit cast, call). If the type is larger than the *target type* this is a type error. If it is smaller, promote it to the target type.
3. Repeat on all leaf nodes.
4. Derive types of the branch nodes.
5. At this point all branch nodes should have the same type as the *target type* already (or there was a type error).

  
  
This algorithm can be modified to handle implicit conversion of mixed signedness as well.
  
  
If implicit widening is used, then it is probably a good idea to widen using the left hand side regardless of whether the overall behaviour is trapping or not.
  
  
  

## Reviewing the options

  
If we go back and look at overflow in general, it's instructive to look at what some other languages do:
  
  
**C**
  
- Implicit casts between all integer types.
  
- Implicit widening to int before arithmetics.
  
- Unsigned arithmetic wraps.
  
- Signed overflow is undefined behaviour.
  
  
**Rust**
  
- No implicit casts.
  
- Trap in debug on unsigned overflow, wrap in release.
  
- Trap in debug on signed overflow, wrap in release.
  
  
**Go**
  
- No implicit casts.
  
- Wrapping unsigned overflow.
  
- Wrapping signed overflow.
  
  
**Zig**
  
- Only safe, widening casts.
  
- Trap in debug on unsigned overflow, UB in release.
  
- Trap in debug on signed overflow, UB in release.
  
  
**Swift**
  
- No implicit casts.
  
- Trap on unsigned overflow.
  
- Trap on signed overflow.
  
  

### Downsides

  
The problems with C's system is well known: the lack of trapping overflow together with its lack of bounds checking enables buffer overflows and other attacks. This is made worse by the undefined behaviour on signed integers. While C compilers often give wrapping semantics in unoptimized builds, optimized builds may assume overflows never happen, giving different behaviour with optimization on. Implicit casts means that potentially harmful truncating casts are extremely difficult to spot. With UB sanitation it's easy to turn such UB into traps, giving similar to checks as Rust or Zig, but only for signed overflow.
  
  
On the other hand, C mostly preserves associativity and commutativity, and has few problems working with mixed signedness. The implicit widening means that overflow rarely happen in normal cases. Usually C "just works" – except when it doesn't.
  
  
With languages that trap, such as Rust, Swift and Zig we are much more likely to run into trapping behaviour for intermediate values. For Zig in particular this is problematic, since there is implicit widening and it's not obvious that the computation on the right hand side might use a much smaller bit width than the left hand side would indicate. In Rust and Swift at least it's obvious where the widening occurs. On the other hand, it can be argued that requiring explicit widening where it is safe is fairly noisy. If Zig would use the left hand side to widen all operands before calculation, the problem with implicit widening would largely go away.
  
  
Both Rust and Zig restricts overflow trapping to debug versions. While fuzz testing and regular testing is likely to use the debug version, they're not protected where it is the most sensitive: in production. Zig's choice of UB is daring – the behaviour of overflow bugs will be hard to predict.
  
  
Go with its wrapping behaviour is lacking the tools to check overflow with normal operators, but at the same time this means that like Swift the code is guaranteed to work the same regardless of debug or release mode. We can also safely use casts to use signed and unsigned numbers together, something that isn't easy in the other languages.
  
  

### A brief summary

  
Wrapping semantics offers the least protection against exploits, but works well with types of mixed signeness. Both Rust and Zig has some checks, but against undiscovered exploits in the wild they leave the protection off, trading safety for speed. Swift is the most consistent in preventing overflows, but like all the languages except for Go and C works poorly with mixed signedness in operands.
  
  
Ideally we would like both good safety and good mixed signedness use, but none of the languages above is able to provide this combination. Also, trapping is not always desired, especially for unsigned integers as this sometimes give unexpected traps when intermediate values underflow even though the expression as a whole is valid. Triggering such traps can in themselves be used to trigger DoS attacks in languages like Swift, while worse exploits are potentially possible in languages with undefined behaviour.
  
  

## Looking for solutions

  
  
Trapping overflow is the last line of defense against exploits. Since the result of a trap often is a panic, the best one can achieve is a crash. In test, this is useful for finding bugs, but when used "in production", we only gain something if the overflow is leading to something worse than crashing. As mentioned above, overflow in unsigned trapping arithmetics might actually be false errors, creating unnecessary possibilities of crashing an application.
  
  
In an ideal situation without any constraints, we would prefer to use infinitely ranged integers to perform our calculations, and then only trap if the the result does not fit in the target type. But unfortunate it is not practical to do so in most cases.
  
  
One mitigating strategy against intermediate underflow could be to promote all unsigned operands to a signed integer twice the bit width. For example an u32 could be evaluated as i64. This would also allow us to safely mix signed and unsigned arithmetics in a natural way, working like the "Widen and narrow" strategy discussed for mixed arithmetics. As we recall the downside is the need for a signed maximum type and doing arithmetics with a wider type.
  
  
With addition and subtraction we can be sure that reordering won't affect the result.
  
  

```
unsigned a, b, c, d, e, f;
...
// All the following would then behave
// identical regardless of values of a, b and c.
d = a + b - c;
e = a + (b - c);
f = (a + b) - c;
```

  
  
The actual trap here happens during the implicit narrowing before the assignment.
  
  
If we desire trapping in release builds, such can be prohibitive, even when it is just a single "branch on overflow" jump. Here the ["As-if Infinitely Ranged Integer" Model](https://resources.sei.cmu.edu/asset_files/TechnicalNote/2010_004_001_15164.pdf) offers a way for cheap release build traps. The underlying idea is that overflows do not immediately need to be detected. For example, in d = a + b + c we only need to check the overflow flag before the assignment. In this case the number of checks are cut in half, but even greater savings are possible. The paper reports an approximate slowdown around 6% for a simple implementation.
  
  
What if all integers wrapped? There are a non-trivial amount of errors in C that are due to developers erronously assuming wrapping. While wrapping allows under-checked parameters to cause follow up errors, the behaviour is well understood and matches the underlying hardware. To simplify certain need-to-be-safe expressions, without having to use functions it's possible to introduce trapping operators e.g. a ~+ b, or checked expressions e.g. checked(a + b). Operators in particular avoid the problem where unexpected trapping happens for intermediate results.
  
  

### Adding implicit conversions

  
Zig and C both have implicit conversions. While C has pervasive implicit conversions, Zig only allows "safe" widenings that preserves all values. Other languages use explicit casts.
  
  
If we decide to use a solution that sometimes do implicit widenings, such as the idea of to widen unsigned types to a signed before arithmetics, then it is fairly natural to combine this with implicit widening and even possibly implicit narrowing with tests.
  
  
Because the sizes matter for trapping purposes, it is likely better to always require explicit widenings unless all operands are promoted to the same type.
  
  

```
char a = 16;
// Surprising if a * a would trap on
// 8 multiplication overflow
int b = a * a;
```

  
  
It is possible however to use the left hand side for implicit operand widening rather than just considering the other operand. Zig could likely gain a lot by adopting such a scheme.
  
  
If instead integers wrap, then converting between unsigned and signed is safe, and having implicit widenings are largely safe. Even though wrapping integers allow lossless conversion between signed and unsigned, it will be useful to clearly indicate what sort of types are used in expressions like (a + b) / (c + d) where types are mixed. A (a + (unsigned)b) / (c + (unsigned)d) would clearly show the intent, unlike some solution that implicitly picked signed or unsigned by default.
  
  

### Summing it up

  
There are various ways to go about overflow trapping and mixed type arithmetics. In general we can split clearly between "wrap by default" and "trap by default". Even within each subgroup there are a wide range of solutions, each with its own set of advantages and drawbacks. Picking a strategy is by necessity a trade-off, not only in runtime cost but also in what sort of vulnerabilities they remain susceptible to.
  
  
Hopefully this article has provided a rough overview of the problem space as well as some novel ideas that can be explored further, such as the *maxint* promotion.

## Comments


---
### Comment by Christoffer Lernö

Last post about arithmetics I listed the following problems related to overflow and arithmetics:
  

1. Overflow traps on unsigned integers makes the mixed signedness case very hard to get right.
2. Overflow traps cause unexpected and hard-to-spot non commutative and associative behaviour in expressions that otherwise would have been fine.
3. Wrapping behaviour enables buffer overflows and similar exploits.
4. In most languages it doesn't matter if the left hand sign can contain the number, what matters are the types on the right hand side, which isn't always intuitive or desired.

  
Let's look at some attempts to fix these problems, starting with handling mixed signedness.
  
  

## Mixed signedness

  
  
As we saw in the previous post, mixed signedness is not trivial. The choices made by C are actually fairly reasonable if the idea is to make most situations "just work" as the user intended. However whatever the solution, they all have their own set of problems. Looking at these first will allow us to understand ramifications of other choices later on.
  
  

### 1. "Widen and narrow"

  
This method relies on widening the operands to a common super type. Let us look at our old example:
  
  

```
unsigned x = 10;
int change = -1;
x = x + change;
```

  
  
The idea is that we promote all operands to the biggest type that can contain both operands, in this case it's likely a long long and perform the operation using that type. The trap is then in an implicit cast back to the original size.
  
  
The code above would implicitly be turned into:
  

```
unsigned x = 10;
int change = -1;
long long _temp = (long long)x + (long long)change;
if (_temp < 0 || _temp > UINT_MAX) panic();
x = (unsigned)_temp;
```

  
  
This strategy works, with the caveat that we need to always be able to find a wider type in order to do this widening.
  
  
In a language like Zig, which allows arbitrarily wide operands, this is not a problem but if there are a fixed number of types – what do we do? In C# the solution is basically to say that this works up to 32 bits, but signed and unsigned 64 bit ints cannot be combined, even though unsigned 64 bit integers should be fairly common.
  
  
If we insist that all integer types need to have an unsigned counterpart then we either need to stop at some arbitrary place - like C# does – or provide arbitrarily wide integers. Another solution is to provide a signed "maxint" that has no unsigned counterpart.
  
  
Pros:
  
- Conceptually simple.
  
- unsigned + signed has a definite type.
  
  
Cons:
  
- Widening may have a performance cost.
  
- The listed strategies to pick a wider integer (C# / Zig / maxint) all have drawbacks.
  
  

### 2. "Prefer signed"

  
This method relies on always converting to the signed type, given two equal types:
  
  
The code above would implicitly be turned into:
  
  

```
unsigned x = 10;
int change = -1;
// Possibly insert trap here:
// if (x > INT_MAX) panic();
int _temp = (int)x + change;
if (_temp < 0) panic();
x = (unsigned)_temp;
```

  
  
If signed addition overflow is a trapping error we need to have the signed int overflow check on x or otherwise it would be possible to add a large unsigned to a positive signed and get a negative result which would be inconsistent. However, if signed overflow is no error then the unsigned check isn't needed.
  
  
Unfortunately, with the overflow check we essentially forbid the unsigned value from having the top bit set which both adds add gotcha as well as making it unusable in some cases.
  
  
Pros:
  
- Conceptually simple.
  
- Definite result type.
  
- Efficient.
  
  
Cons:
  
- Broken if signed overflow is an error.
  
  

### 3. "Prefer unsigned"

  
This is what C does. With wrapping unsigned arithmetics this often yields the expected result, but there are counter examples such as:
  
  

```
unsigned x = 2;
int y = -100;
unsigned z = 10
if (z < x + y) unexpectedCall();
```

  
  
In the above code, the right hand side becomes a large number as y is converted into a large unsigned number. Division has a similar issue as unsigned and signed division works differently.
  
  
If conversion of the signed number instead traps on negative numbers, we're forced to cast, but even that won't help if unsigned overflow is an error.
  
  
Pros:
  
- Fairly simple.
  
- Efficient.
  
  
Cons:
  
- Does not work if unsigned overflow is an error.
  
- The unsigned result may give unexpected results when it is used for comparison or division.
  
- The resulting type might not always be obvious.
  
  

### 4. "Use a function"

  
This solution instead provides functions for various combinations, it might look like this:
  
  

```
unsigned x = 10;
int change = -1;
x = addSignedToUnsignedWithTrap(x, change);
```

  
  
How the function works doesn't matter to us here, we just know it will trap if the addition didn't work and give us the correct answer otherwise.
  
  
Pros:
  
- Well defined and easy to understand.
  
- Definite result type.
  
  
Cons:
  
- Clunky.
  
- Programmers might look for easier but "wrong" solutions.
  
  

### 5. "Require explicit casts"

  
A common solution is to require explicit casts, but as we see above in the "Use unsigned" and "Use signed" variants this doesn't necessarily work if there are overflows traps. Worse, it might potentially obscure issues:
  
  

```
unsigned x = 10;
int y = -50;
unsigned z = x + (unsigned)y; // No unsigned overflow, so ok?
```

  
  
Here the problem isn't that we're casting a negative value to a unsigned one – this is actually in many cases what we want. It's that we can't determine when the addition underflows and when it doesn't.
  
  
Since explicit casts encompass all of the strategies 1-3, we don't need to tie us to a particular (possibly inferior) solution. On the other hand it may take quite a bit of effort and deep understanding of the possible issues to do "the right thing". The whole idea behind making more overflow trapping is to make the default more safe. If that is the intention, then forcing the programmer to pick just the right set of casts to avoid bugs and potential attack vectors seem inconsistent.
  
  
Pros:
  
- Well defined and easy to understand.
  
- Definite result type.
  
- Free to pick the optimal strategy.
  
  
Cons:
  
- Does not work well when overflow is an error.
  
- May implicity remove safeguards.
  
- Picking the optimal set of casts is not always obvious.
  
  

### 5. "Mixed signedness type"

  
A more utopian idea is for unsigned/signed mixes to have no definite type, instead being inferred or creating multiple code paths depending on the result. The complexity and unpredictability, in particular in non-trivial examples makes it hard to view it as a reasonable solution:
  
  

```
unsigned x = ...;
int y = ...;
z = (x + y) / (x - y); // Signed or unsigned division here?
```

  
  
  
  

## The forgotten left hand side

  
  
As an example I mentioned that Zig currently uses the binary operand types when resolving arithmetics, so for example this will overflow:
  
  

```
var num1 : i8 = 16;
var num2 : i32 = 3;
var res : i32 = num2 + num1 * num1; // Boom!
```

  
  
It might feel odd that Zig chose this behaviour, but it's not strange. The reason we don't have this is because C makes an implicit widening to int for all operands first. This is why adding two ints and assigning it to a long long in C cannot result in a value larger than INT\_MAX, even though the long long might be able to contain several billion times as big.
  
  
The only difference between C and Zig is that we run into this problem more often in the latter. Rust also allows i8 \* i8, but there is no implicit widening, so it's more obvious as to what's happening.
  
  

### Left hand side widening

  
A simple algorithm for widening using the left hand side, given that all operands have the same signedness is the following:
  

1. Store the left hand side type, and assign this as the *target type*.
2. Depth first, look at the first leaf operand, which is any operand that already has a definite type (e.g. variable, explicit cast, call). If the type is larger than the *target type* this is a type error. If it is smaller, promote it to the target type.
3. Repeat on all leaf nodes.
4. Derive types of the branch nodes.
5. At this point all branch nodes should have the same type as the *target type* already (or there was a type error).

  
  
This algorithm can be modified to handle implicit conversion of mixed signedness as well.
  
  
If implicit widening is used, then it is probably a good idea to widen using the left hand side regardless of whether the overall behaviour is trapping or not.
  
  
  

## Reviewing the options

  
If we go back and look at overflow in general, it's instructive to look at what some other languages do:
  
  
**C**
  
- Implicit casts between all integer types.
  
- Implicit widening to int before arithmetics.
  
- Unsigned arithmetic wraps.
  
- Signed overflow is undefined behaviour.
  
  
**Rust**
  
- No implicit casts.
  
- Trap in debug on unsigned overflow, wrap in release.
  
- Trap in debug on signed overflow, wrap in release.
  
  
**Go**
  
- No implicit casts.
  
- Wrapping unsigned overflow.
  
- Wrapping signed overflow.
  
  
**Zig**
  
- Only safe, widening casts.
  
- Trap in debug on unsigned overflow, UB in release.
  
- Trap in debug on signed overflow, UB in release.
  
  
**Swift**
  
- No implicit casts.
  
- Trap on unsigned overflow.
  
- Trap on signed overflow.
  
  

### Downsides

  
The problems with C's system is well known: the lack of trapping overflow together with its lack of bounds checking enables buffer overflows and other attacks. This is made worse by the undefined behaviour on signed integers. While C compilers often give wrapping semantics in unoptimized builds, optimized builds may assume overflows never happen, giving different behaviour with optimization on. Implicit casts means that potentially harmful truncating casts are extremely difficult to spot. With UB sanitation it's easy to turn such UB into traps, giving similar to checks as Rust or Zig, but only for signed overflow.
  
  
On the other hand, C mostly preserves associativity and commutativity, and has few problems working with mixed signedness. The implicit widening means that overflow rarely happen in normal cases. Usually C "just works" – except when it doesn't.
  
  
With languages that trap, such as Rust, Swift and Zig we are much more likely to run into trapping behaviour for intermediate values. For Zig in particular this is problematic, since there is implicit widening and it's not obvious that the computation on the right hand side might use a much smaller bit width than the left hand side would indicate. In Rust and Swift at least it's obvious where the widening occurs. On the other hand, it can be argued that requiring explicit widening where it is safe is fairly noisy. If Zig would use the left hand side to widen all operands before calculation, the problem with implicit widening would largely go away.
  
  
Both Rust and Zig restricts overflow trapping to debug versions. While fuzz testing and regular testing is likely to use the debug version, they're not protected where it is the most sensitive: in production. Zig's choice of UB is daring – the behaviour of overflow bugs will be hard to predict.
  
  
Go with its wrapping behaviour is lacking the tools to check overflow with normal operators, but at the same time this means that like Swift the code is guaranteed to work the same regardless of debug or release mode. We can also safely use casts to use signed and unsigned numbers together, something that isn't easy in the other languages.
  
  

### A brief summary

  
Wrapping semantics offers the least protection against exploits, but works well with types of mixed signeness. Both Rust and Zig has some checks, but against undiscovered exploits in the wild they leave the protection off, trading safety for speed. Swift is the most consistent in preventing overflows, but like all the languages except for Go and C works poorly with mixed signedness in operands.
  
  
Ideally we would like both good safety and good mixed signedness use, but none of the languages above is able to provide this combination. Also, trapping is not always desired, especially for unsigned integers as this sometimes give unexpected traps when intermediate values underflow even though the expression as a whole is valid. Triggering such traps can in themselves be used to trigger DoS attacks in languages like Swift, while worse exploits are potentially possible in languages with undefined behaviour.
  
  

## Looking for solutions

  
  
Trapping overflow is the last line of defense against exploits. Since the result of a trap often is a panic, the best one can achieve is a crash. In test, this is useful for finding bugs, but when used "in production", we only gain something if the overflow is leading to something worse than crashing. As mentioned above, overflow in unsigned trapping arithmetics might actually be false errors, creating unnecessary possibilities of crashing an application.
  
  
In an ideal situation without any constraints, we would prefer to use infinitely ranged integers to perform our calculations, and then only trap if the the result does not fit in the target type. But unfortunate it is not practical to do so in most cases.
  
  
One mitigating strategy against intermediate underflow could be to promote all unsigned operands to a signed integer twice the bit width. For example an u32 could be evaluated as i64. This would also allow us to safely mix signed and unsigned arithmetics in a natural way, working like the "Widen and narrow" strategy discussed for mixed arithmetics. As we recall the downside is the need for a signed maximum type and doing arithmetics with a wider type.
  
  
With addition and subtraction we can be sure that reordering won't affect the result.
  
  

```
unsigned a, b, c, d, e, f;
...
// All the following would then behave
// identical regardless of values of a, b and c.
d = a + b - c;
e = a + (b - c);
f = (a + b) - c;
```

  
  
The actual trap here happens during the implicit narrowing before the assignment.
  
  
If we desire trapping in release builds, such can be prohibitive, even when it is just a single "branch on overflow" jump. Here the ["As-if Infinitely Ranged Integer" Model](https://resources.sei.cmu.edu/asset_files/TechnicalNote/2010_004_001_15164.pdf) offers a way for cheap release build traps. The underlying idea is that overflows do not immediately need to be detected. For example, in d = a + b + c we only need to check the overflow flag before the assignment. In this case the number of checks are cut in half, but even greater savings are possible. The paper reports an approximate slowdown around 6% for a simple implementation.
  
  
What if all integers wrapped? There are a non-trivial amount of errors in C that are due to developers erronously assuming wrapping. While wrapping allows under-checked parameters to cause follow up errors, the behaviour is well understood and matches the underlying hardware. To simplify certain need-to-be-safe expressions, without having to use functions it's possible to introduce trapping operators e.g. a ~+ b, or checked expressions e.g. checked(a + b). Operators in particular avoid the problem where unexpected trapping happens for intermediate results.
  
  

### Adding implicit conversions

  
Zig and C both have implicit conversions. While C has pervasive implicit conversions, Zig only allows "safe" widenings that preserves all values. Other languages use explicit casts.
  
  
If we decide to use a solution that sometimes do implicit widenings, such as the idea of to widen unsigned types to a signed before arithmetics, then it is fairly natural to combine this with implicit widening and even possibly implicit narrowing with tests.
  
  
Because the sizes matter for trapping purposes, it is likely better to always require explicit widenings unless all operands are promoted to the same type.
  
  

```
char a = 16;
// Surprising if a * a would trap on
// 8 multiplication overflow
int b = a * a;
```

  
  
It is possible however to use the left hand side for implicit operand widening rather than just considering the other operand. Zig could likely gain a lot by adopting such a scheme.
  
  
If instead integers wrap, then converting between unsigned and signed is safe, and having implicit widenings are largely safe. Even though wrapping integers allow lossless conversion between signed and unsigned, it will be useful to clearly indicate what sort of types are used in expressions like (a + b) / (c + d) where types are mixed. A (a + (unsigned)b) / (c + (unsigned)d) would clearly show the intent, unlike some solution that implicitly picked signed or unsigned by default.
  
  

### Summing it up

  
There are various ways to go about overflow trapping and mixed type arithmetics. In general we can split clearly between "wrap by default" and "trap by default". Even within each subgroup there are a wide range of solutions, each with its own set of advantages and drawbacks. Picking a strategy is by necessity a trade-off, not only in runtime cost but also in what sort of vulnerabilities they remain susceptible to.
  
  
Hopefully this article has provided a rough overview of the problem space as well as some novel ideas that can be explored further, such as the *maxint* promotion.