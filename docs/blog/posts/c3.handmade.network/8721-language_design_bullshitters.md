---
title: "Language design bullshitters"
date: 2023-05-31
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8721-language_design_bullshitters](https://c3.handmade.network/blog/p/8721-language_design_bullshitters)*

Inevitably people will ask "what language should I choose for my compiler?".

The answer is really: "you can use any language, so all things being equal, pick one you're good at."

Of course there are caveats:

1. You want it to go really fast? Then C is better than Python.
2. Are you making a DSL? Then you probably want to do it in the host language.
3. Do you want to experiment with some parsing techniques? Then some languages might be a
   better fit than others

... and so on.

So when someone says something like "C is a bad choice for writing a compiler" as a general
statement, you know they are just making it up as they go along.

The C3 compiler is written in C, and there is frankly no other language I could have picked
that would have been a substantially better choice. – Sure, writing it in C2 or Odin would
certainly have avoided some of C's warts, but the difference would not have been significant.
And doing an OO-style C++, or worse, Java, would just have pushed the compiler to slower and
more bloated, with no additional benefits other than there are more Java programmers than C
programmers.

#### "Say you are bad at programming without saying you're bad at programming"

So what do you think are the arguments against C?

"C memory management is hard".

*My god*, if you think your compiler has to have a lot of `free` and *that* is the hard
part about writing a compiler then you have *ABSOLUTELY ZERO* business handing out
advice on compilers - or programming.

(Memory allocation can be handled in different ways in a compiler, with the simplest
way being using arena allocators)

"C doesn't have feature X, so it will be a nightmare writing a compiler for it"

This is the prime argument for people arguing for writing the compiler in Ocaml or some
other functional language. "C doesn't have extensive support for pattern matching, how can I use
[my preferred technique] without that??? IT'S IMPOSSIBLE AND NO ONE SHOULD TRY IT"

If you point out that there are plenty of compilers written in C, the argument becomes "yes, but
they are *old* and it's not *modern* to use C".

#### A carnival of made up arguments

There is no lack of people who want to give advice on language design. Even language designers
that actually know what they talk about struggle to give good advice that are applicable to
*your* particular design if you ask about it. It's just hard.

With that in mind, guess what the quality of advice is from people who just have some theoretical
knowledge of compiler and language design? Yes, it is as bad as you might guess.

Also, somewhat unfortunately, the group that has little experience is the ones who tend to have
the most time to argue for things. Of course their arguments are made up of what they just
happen to think is true and what they read on blogs they liked.

#### To sum it up

So you want to write a compiler? Get some advice for language design? Well do ask, but just
keep in mind that most of what you read is just trash advice made up by people who actually
don't know what they talk about. Especially on forums where there aren't many people who
actually write compilers. You'll get bad advice in places dedicated to programming language
design as well, but your odds of picking up some good advice is better.

And the proof is in the pudding: if you actually look at what compilers are written and what
languages they're written in, you at least know what's been proven to be production ready.
And do look at compiler performance too, because that will matter if you're serious about
the project.

And to me, if I find out that someone is making things up, then clearly other things they say
isn't trustworthy either. Language design seems to be one of those things people like
to have opinions on because they know the risk of being called out for lying is low.

## Comments


---
### Comment by Christoffer Lernö

Inevitably people will ask "what language should I choose for my compiler?".

The answer is really: "you can use any language, so all things being equal, pick one you're good at."

Of course there are caveats:

1. You want it to go really fast? Then C is better than Python.
2. Are you making a DSL? Then you probably want to do it in the host language.
3. Do you want to experiment with some parsing techniques? Then some languages might be a
   better fit than others

... and so on.

So when someone says something like "C is a bad choice for writing a compiler" as a general
statement, you know they are just making it up as they go along.

The C3 compiler is written in C, and there is frankly no other language I could have picked
that would have been a substantially better choice. – Sure, writing it in C2 or Odin would
certainly have avoided some of C's warts, but the difference would not have been significant.
And doing an OO-style C++, or worse, Java, would just have pushed the compiler to slower and
more bloated, with no additional benefits other than there are more Java programmers than C
programmers.

#### "Say you are bad at programming without saying you're bad at programming"

So what do you think are the arguments against C?

"C memory management is hard".

*My god*, if you think your compiler has to have a lot of `free` and *that* is the hard
part about writing a compiler then you have *ABSOLUTELY ZERO* business handing out
advice on compilers - or programming.

(Memory allocation can be handled in different ways in a compiler, with the simplest
way being using arena allocators)

"C doesn't have feature X, so it will be a nightmare writing a compiler for it"

This is the prime argument for people arguing for writing the compiler in Ocaml or some
other functional language. "C doesn't have extensive support for pattern matching, how can I use
[my preferred technique] without that??? IT'S IMPOSSIBLE AND NO ONE SHOULD TRY IT"

If you point out that there are plenty of compilers written in C, the argument becomes "yes, but
they are *old* and it's not *modern* to use C".

#### A carnival of made up arguments

There is no lack of people who want to give advice on language design. Even language designers
that actually know what they talk about struggle to give good advice that are applicable to
*your* particular design if you ask about it. It's just hard.

With that in mind, guess what the quality of advice is from people who just have some theoretical
knowledge of compiler and language design? Yes, it is as bad as you might guess.

Also, somewhat unfortunately, the group that has little experience is the ones who tend to have
the most time to argue for things. Of course their arguments are made up of what they just
happen to think is true and what they read on blogs they liked.

#### To sum it up

So you want to write a compiler? Get some advice for language design? Well do ask, but just
keep in mind that most of what you read is just trash advice made up by people who actually
don't know what they talk about. Especially on forums where there aren't many people who
actually write compilers. You'll get bad advice in places dedicated to programming language
design as well, but your odds of picking up some good advice is better.

And the proof is in the pudding: if you actually look at what compilers are written and what
languages they're written in, you at least know what's been proven to be production ready.
And do look at compiler performance too, because that will matter if you're serious about
the project.

And to me, if I find out that someone is making things up, then clearly other things they say
isn't trustworthy either. Language design seems to be one of those things people like
to have opinions on because they know the risk of being called out for lying is low.

---
### Comment by Christoffer Lernö

Absolutely, I don't know if needed to add that. *General purpose* languages should all be easy to make languages in.

And while asm isn't exactly the nicest abstraction to write a compiler in, that used to be what a lot of (AST-less) compilers were written in back in the days.