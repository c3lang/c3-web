---
title: "Some language design lessons learned"
date: 2023-04-03
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8682-some_language_design_lessons_learned](https://c3.handmade.network/blog/p/8682-some_language_design_lessons_learned)*

# Language design lessons learned

As you work on a programming language, you'll come to realize things about language design that isn't easy to come by any other way than *actually working on a language*.

Here are some lessons I learned that was applicable for C3.

### 1. Make the language easy to parse for the compiler and it will be easy to read for the programmer

If you stop and think about it, this isn't strange: when we read we do so in a way similar to that of a parser, scanning ahead visually. So if the parser needs little lookahead, so does a human reader.

Lots of people approaching language design are often obsessed with finding the parser algorithm that can accept the most types of grammars.

This is then completely counterproductive: better restrict your grammar to LL(1) to make it easy to read.

### 2. Lexing, parsing and codegen are all well covered by textbooks. But how to model types and do semantic analysis can only be found in by studying compilers.

This has a lot to do with the fact that semantic analysis and types are intrinsically linked to the language semantics, so it's not possible to establish general rules that apply to all languages.

This means that the best resources when starting out is to actually look at compilers for similar languages. The design space here is huge, so lots of different designs are possible even for the same language, but having some references when starting out is invaluable.

For C3 I looked at Clang, TCC, C2 and Cone.

### 3. Inventing a completely new language construct should only be done if it is absolutely necessary.

This is might seem controversial: why would one build a language that isn't *inventing* something?

But it turns out there is a lot of value in remixes: C++ is C + Simula, C is B + types, Kotlin is an evolved Java etc.

Value is in the combination of features, not in some perceived "new" functionality. Also, for established features it's often possible to make improvements *because the problems are known*, but with a new feature you will have to figure them out as you go along. The first language with a particular feature is rarely the language which implements it the best.

### 4. Don’t take advice from other language designers

What is good for one language might be a horrible idea in another. It is hard to describe a language's goals and ideas, so even if they take the time, they will not understand the nuances of your design.

I have seen so much bad advice over the years.

There is also a lot unsolicited advice. People who will tell you:

1. What features *must* be in included a "modern" language.
2. What type of parser you *must* use (everything else is old and bad)
3. What programming language to write the compiler in (e.g. "it's impossible to write a compiler in C")
4. What paradigm all new languages must be (OO, functional etc)

### 5. “Better syntax” is subjective and never a selling point.

What you see over and over again is people spending a lot of time doing languages that are reskins of existing languages: e.g. "like java but with *better syntax*".

What they have in common is that some superficial changes to syntax is argued to be a huge selling point for the language. Often these changes are things that most people would disagree with but for the individual designer this is elegant or "simple".

### 6. Macros are easy to make powerful but hard to make readable.

The difficulty designing macros is not to make them flexible enough but rather to make them limited in the right way, so that they are readable while still being useful.

There is a difficult trade-off to be made, as greater flexibility makes it harder to know what the macro can do, which reduces readability. Different languages will naturally make different trade-offs, but "macros can do *anything*!" is rarely a good idea.

### 7. There will always be people who hate your language no matter what.

It's the wrong paradigm, it has the declarations in the wrong order, it doesn't have a GC or it has a GC, it has RAII or it doesn't have RAII. Anything may be a reason for others to dismiss any language.

Keep in mind that there are people who hate each of these languages as well: C, C++, Go, Rust, Pascal, Haskell, OCaml, Swift, Objective-C, Ruby, Python, Java, C#, JavaScript, Typescript, PHP, Kotlin, Scala, and any other popular language.

### 8. It is much easier to iterate semantics before they're implemented

Doing a writeup of some semantics allow you to iterate quickly on the design. Changing semantics often means lots of changes to a compiler, so it's painful to change it once it's already in the language. Writing code for your imagined semantics is a powerful tool to experiment with lots of variations.

### 9. It is much easier to evaluate syntax using it for a real task

In contrast to (8), no amount of bike-shedding of syntax can replace actually trying out syntax for some real examples. Often the conclusions are surprising, with the a priori "best" syntax having problems in real life scenarios.

## Summary

These are some lessons I've learned while I've been working on C3. Are they are applicable in general or not? Maybe, maybe not. After all (4) says not to take advice from other language designers, so if you're a language designer do keep in mind they might not apply. 😜

## Comments


---
### Comment by Christoffer Lernö

# Language design lessons learned

As you work on a programming language, you'll come to realize things about language design that isn't easy to come by any other way than *actually working on a language*.

Here are some lessons I learned that was applicable for C3.

### 1. Make the language easy to parse for the compiler and it will be easy to read for the programmer

If you stop and think about it, this isn't strange: when we read we do so in a way similar to that of a parser, scanning ahead visually. So if the parser needs little lookahead, so does a human reader.

Lots of people approaching language design are often obsessed with finding the parser algorithm that can accept the most types of grammars.

This is then completely counterproductive: better restrict your grammar to LL(1) to make it easy to read.

### 2. Lexing, parsing and codegen are all well covered by textbooks. But how to model types and do semantic analysis can only be found in by studying compilers.

This has a lot to do with the fact that semantic analysis and types are intrinsically linked to the language semantics, so it's not possible to establish general rules that apply to all languages.

This means that the best resources when starting out is to actually look at compilers for similar languages. The design space here is huge, so lots of different designs are possible even for the same language, but having some references when starting out is invaluable.

For C3 I looked at Clang, TCC, C2 and Cone.

### 3. Inventing a completely new language construct should only be done if it is absolutely necessary.

This is might seem controversial: why would one build a language that isn't *inventing* something?

But it turns out there is a lot of value in remixes: C++ is C + Simula, C is B + types, Kotlin is an evolved Java etc.

Value is in the combination of features, not in some perceived "new" functionality. Also, for established features it's often possible to make improvements *because the problems are known*, but with a new feature you will have to figure them out as you go along. The first language with a particular feature is rarely the language which implements it the best.

### 4. Don’t take advice from other language designers

What is good for one language might be a horrible idea in another. It is hard to describe a language's goals and ideas, so even if they take the time, they will not understand the nuances of your design.

I have seen so much bad advice over the years.

There is also a lot unsolicited advice. People who will tell you:

1. What features *must* be in included a "modern" language.
2. What type of parser you *must* use (everything else is old and bad)
3. What programming language to write the compiler in (e.g. "it's impossible to write a compiler in C")
4. What paradigm all new languages must be (OO, functional etc)

### 5. “Better syntax” is subjective and never a selling point.

What you see over and over again is people spending a lot of time doing languages that are reskins of existing languages: e.g. "like java but with *better syntax*".

What they have in common is that some superficial changes to syntax is argued to be a huge selling point for the language. Often these changes are things that most people would disagree with but for the individual designer this is elegant or "simple".

### 6. Macros are easy to make powerful but hard to make readable.

The difficulty designing macros is not to make them flexible enough but rather to make them limited in the right way, so that they are readable while still being useful.

There is a difficult trade-off to be made, as greater flexibility makes it harder to know what the macro can do, which reduces readability. Different languages will naturally make different trade-offs, but "macros can do *anything*!" is rarely a good idea.

### 7. There will always be people who hate your language no matter what.

It's the wrong paradigm, it has the declarations in the wrong order, it doesn't have a GC or it has a GC, it has RAII or it doesn't have RAII. Anything may be a reason for others to dismiss any language.

Keep in mind that there are people who hate each of these languages as well: C, C++, Go, Rust, Pascal, Haskell, OCaml, Swift, Objective-C, Ruby, Python, Java, C#, JavaScript, Typescript, PHP, Kotlin, Scala, and any other popular language.

### 8. It is much easier to iterate semantics before they're implemented

Doing a writeup of some semantics allow you to iterate quickly on the design. Changing semantics often means lots of changes to a compiler, so it's painful to change it once it's already in the language. Writing code for your imagined semantics is a powerful tool to experiment with lots of variations.

### 9. It is much easier to evaluate syntax using it for a real task

In contrast to (8), no amount of bike-shedding of syntax can replace actually trying out syntax for some real examples. Often the conclusions are surprising, with the a priori "best" syntax having problems in real life scenarios.

## Summary

These are some lessons I've learned while I've been working on C3. Are they are applicable in general or not? Maybe, maybe not. After all (4) says not to take advice from other language designers, so if you're a language designer do keep in mind they might not apply. 😜