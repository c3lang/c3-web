---
title: Rejected Ideas
description: Rejected Ideas
sidebar:
    order: 703
---
These are ideas that will not be implemented in C3 with rationale given.


### Constructors and destructors

A fundamental concept in C3 is that data is not "active". This is to say there is no code associated with the data implicitly unlike constructors and destructors in an object oriented language. Not having constructors / destructors prevents RAII-style resource handling, but also allows the code to assume the memory can be freely allocated and initialized as it sees fit, without causing any corruption or undefined behaviour.

There is a fundamental difference between active objects and inert data, each has its advantages and disadvantages. C3 follows the C model, which is that data is passive and does not enforce any behaviour. This has very deep implications on the semantics of the language and adding constructors and destructors would change the language greatly, requiring modification of many parts of the language altering.

For that reason constructors and destructors will not be considered for C3.

### Unicode identifiers

The main argument for unicode identifiers is that "it allows people to code in their own language". However, there is no proof that this actually is used in practice. Furthermore there are practical issues, such as bidirectional text, characters with different code points that are rendered in an identical way etc.

Given the complexity and the lack of actual proven benefit, unicode identifiers will not happen for C3.