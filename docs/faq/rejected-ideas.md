---
title: Rejected Ideas
description: Rejected Ideas
sidebar:
    order: 703
---
These are ideas that will not be implemented in C3. 

The rationale for each is also given below.


### Constructors and destructors

A fundamental concept in C3 is that data is not "active". This is to say there is no code associated with the data implicitly, unlike constructors and destructors in an object oriented language. Not having constructors / destructors prevents RAII-style resource handling, but also allows the code to assume the memory can be freely allocated and initialized as it sees fit, without causing any corruption or undefined behaviour.

There is a fundamental difference between active objects and inert data. Each has its advantages and disadvantages. C3 follows the C model, which is that data is passive and does not enforce any behaviour. This has very deep implications on the semantics of the language and adding constructors and destructors would change the language greatly, requiring many parts of the language to be altered.

For that reason, constructors and destructors will not be considered for C3.

### Unicode identifiers

The main argument for unicode identifiers is that "it allows people to code in their own language". However, there is no proof that this actually is used in practice. Furthermore there are practical issues, such as bidirectional text, characters with different code points that are rendered in an identical way, etc.

Given the complexity and the lack of actual proven benefit, unicode identifiers will not happen for C3.

### Builtin type-name variants

A common request is to change the builtin type names from `char`, `int`, `long` etc, to some other standard, such as `u8` `i32` or `uint8`, `int32`. Various rationales are usually given for each, but ultimately it is a matter of taste and habit.

Because C3 limits user-defined names to PascalCase in order to easily resolve the language grammar, it is not possible to create type aliases for such names, which leads to requests to build them into the language itself. (`Int32` is fine, but `int32` is not, nor are `INT32` and `I32`).

Originally, C3 was going to have both bit-fixed type names (like today, where `int` is always 32 bits, `long` always 64 bits and so on) as well as explicit bitsize-names like `u8`, `i32` that aliased to the same types. Ultimately this was shelved, because it would mean that libraries would end up standardizing on one style or the other, creating friction when used. Ultimately the language would end up with one style being the "accepted" way to name things anyway. So after quite a bit of deliberation, the C naming scheme was chosen. This was mainly for the following two reasons:

1. It's familiar from C, so one would need to rewrite and learn less coming from C/C++/C#/Java, the code would also look more C-like.
2. `i32` have readability problems when combined with `i` for index in for loops, which was considered a major drawback.
3. While the `int32` scheme does not have readability issues, it is longer than the C names in almost every case.

After this decision was made and the types established, someone mentioned that `s32` could have been an alternative to consider as well, and indeed it is far superior as a prefix for bitsize-names. However, it's not obvious that for example `sptr` is better than `iptr`, plus the decision was made.

Over the years, requests for builtin types have occasionally appeared, but interestingly, not always arguing for the same scheme. Some would say iXX was the only possibility, others thought such naming was out of the question and an intXX scheme the only right decision and so on. Given that, it's rather clear that the preference for *any* naming scheme is subjective, and one is pretty much as good as the other.

So, the C3 naming scheme will not change, although small tweaks are not ruled out.
