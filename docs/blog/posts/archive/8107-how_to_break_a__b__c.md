---
title: "How to break a + b + c"
date: 2021-10-02
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8107-how_to_break_a__b__c](https://c3.handmade.network/blog/p/8107-how_to_break_a__b__c)*

When one is deviating from language semantics, one sometimes accidentally break established, well-understood semantics. One of the worst design mistakes I did when working on C3 was to accidentally break associativity for addition.

Here is some code:

```
// File foo.h
typedef struct {
   unsigned short a;
   unsigned short b;
   unsigned short c; 
} Foo;
```

```
// File bar.c
unsigned int fooIt(Foo *foo)
{
   unsigned int x = a + b + c;
   return x;
}
```

```
// File baz.c
int calculate()
{
   Foo foo = { 200, 200, 200 };
   assert(fooIt(foo) == foo.b + foo.c + foo.a);
   return fooIt(foo);
}
```

I've written this with pure C syntax, but we're going to imagine deviating from C semantics.

In particular we're going to say:

1. if two operands in a binary expression (e.g. `a + b`) are of the same bit width `n`, the operation will be performed with wrapping semantics. So if we have two variables that are `unsigned char` and we add them, then the maximum value is 255. Similar with `unsigned short` will yield a maximum of 65535.
2. Implicit widening casts will be performed as long as they do not affect signedness.

In our example above `fooIt(foo)` will return `600` regardless whether we are using C or this new language with different semantics.

But let's say someone found this code to be memory inefficient. `b` and `c` should never be used with values over 255 (for one reason or the other). They alter the file `foo.h` in the following way, which passes compilation:

```
typedef struct {
   unsigned char a;
   unsigned char b;
   unsigned short c; 
} Foo;
```

You go to work and make changes and discover that suddenly your assert is trapping. You look at `calculate` and find no changes to that code. Similarly `bar.c` with `fooIt`. You find out that `fooIt(foo)` now returns `344`, which makes no sense to you.

Finally the only candidate left is the change to `Foo`, but the data in Foo is the same and your assert is doing the same calculation as `fooIt`... or is it?

It turns out that with the non C semantics above, the computer will calculate `unsigned int x = a + b + c` in the following way:

1. `a + b` mod 2^8 => `144`
2. `144 + c` mod 2^16 => `344`

In your assert on the other hand, we swapped the order:

1. `b + c` mod 2^16 => `400`
2. `400 + a` mod 2^16 => `600`

The new semantic silently broke associativity and the compiler didn't warn us a single bit. This is a *spooky action at a distance* which you definitely don't want. Neither the writer of `Foo`, nor of `fooIt`, nor you could know that this would be a problem, it only breaks when the parts come together.

But "Wait!", you say, "There are many languages allowing this 'smaller than int size adds' addition by default, surely they can't all be broken?" – and you'd be right.

So what is the difference between our semantics and non-broken languages like Rust? If your guess is "implicit widening", then you're right.

And doesn't this seem strange? I mean it's not related to *why* the associativity breaks, but it's still the culprit. Because what happens if we don't have the widening?

Well `fooIt` would stop compiling for one:

```
unsigned int fooIt(Foo *foo)
{
   unsigned int x = a + b + c; 
   //               ^^^^^^^^^
   // Error: cannot add expression of type unsigned char
   // to expression of type unsigned short   
   return a;
}
```

And of course it would be known that changing `Foo` would be a possibly breaking change.

## So what can be learned?

Designing new language semantics isn't trivial. Few consequences are easily recognizable at the beginning. One needs to be ready to drop semantics if they later turn out to have issues one didn't count on, even if they "work in most cases".

## Comments


---
### Comment by Christoffer Lernö

When one is deviating from language semantics, one sometimes accidentally break established, well-understood semantics. One of the worst design mistakes I did when working on C3 was to accidentally break associativity for addition.

Here is some code:

```
// File foo.h
typedef struct {
   unsigned short a;
   unsigned short b;
   unsigned short c; 
} Foo;
```

```
// File bar.c
unsigned int fooIt(Foo *foo)
{
   unsigned int x = a + b + c;
   return x;
}
```

```
// File baz.c
int calculate()
{
   Foo foo = { 200, 200, 200 };
   assert(fooIt(foo) == foo.b + foo.c + foo.a);
   return fooIt(foo);
}
```

I've written this with pure C syntax, but we're going to imagine deviating from C semantics.

In particular we're going to say:

1. if two operands in a binary expression (e.g. `a + b`) are of the same bit width `n`, the operation will be performed with wrapping semantics. So if we have two variables that are `unsigned char` and we add them, then the maximum value is 255. Similar with `unsigned short` will yield a maximum of 65535.
2. Implicit widening casts will be performed as long as they do not affect signedness.

In our example above `fooIt(foo)` will return `600` regardless whether we are using C or this new language with different semantics.

But let's say someone found this code to be memory inefficient. `b` and `c` should never be used with values over 255 (for one reason or the other). They alter the file `foo.h` in the following way, which passes compilation:

```
typedef struct {
   unsigned char a;
   unsigned char b;
   unsigned short c; 
} Foo;
```

You go to work and make changes and discover that suddenly your assert is trapping. You look at `calculate` and find no changes to that code. Similarly `bar.c` with `fooIt`. You find out that `fooIt(foo)` now returns `344`, which makes no sense to you.

Finally the only candidate left is the change to `Foo`, but the data in Foo is the same and your assert is doing the same calculation as `fooIt`... or is it?

It turns out that with the non C semantics above, the computer will calculate `unsigned int x = a + b + c` in the following way:

1. `a + b` mod 2^8 => `144`
2. `144 + c` mod 2^16 => `344`

In your assert on the other hand, we swapped the order:

1. `b + c` mod 2^16 => `400`
2. `400 + a` mod 2^16 => `600`

The new semantic silently broke associativity and the compiler didn't warn us a single bit. This is a *spooky action at a distance* which you definitely don't want. Neither the writer of `Foo`, nor of `fooIt`, nor you could know that this would be a problem, it only breaks when the parts come together.

But "Wait!", you say, "There are many languages allowing this 'smaller than int size adds' addition by default, surely they can't all be broken?" – and you'd be right.

So what is the difference between our semantics and non-broken languages like Rust? If your guess is "implicit widening", then you're right.

And doesn't this seem strange? I mean it's not related to *why* the associativity breaks, but it's still the culprit. Because what happens if we don't have the widening?

Well `fooIt` would stop compiling for one:

```
unsigned int fooIt(Foo *foo)
{
   unsigned int x = a + b + c; 
   //               ^^^^^^^^^
   // Error: cannot add expression of type unsigned char
   // to expression of type unsigned short   
   return a;
}
```

And of course it would be known that changing `Foo` would be a possibly breaking change.

## So what can be learned?

Designing new language semantics isn't trivial. Few consequences are easily recognizable at the beginning. One needs to be ready to drop semantics if they later turn out to have issues one didn't count on, even if they "work in most cases".