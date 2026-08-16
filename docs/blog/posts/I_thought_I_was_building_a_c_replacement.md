---
title: "I thought I was building a C replacement. I was wrong"
date: 2026-08-16
tags: ["marketing", "c3"]
authors:
  - lerno
slug: i_thought_i_was_building_a_c_replacement
---

I made a rather fundamental mistake when I started marketing C3.

I called it a C alternative.

That seemed completely obvious to me. I had been looking for a better C for years, I found [C2](http://www.c2lang.org) to contribute to, and from that C3 was eventually born. Of course C3 was a C alternative.

But I've gradually realized that the phrase "C alternative" means something very different today from what it meant to me.

And the reason is embarrassingly simple: I'm old enough to remember when C was an application language. So to understand what I got wrong, we have to go back to the 80s and 90s.

I started in BASIC, and for the longest time, assembly and BASIC were the main options. This was during the home computer "revolution" of the 80s. With the advent of 16-bit home computers, more languages suddenly became viable — mainly Pascal and C.

At that time, the most difficult thing was actually finding a compiler if you were young and had hardly any budget. I even ended up doing serious programming in QBasic of all things, simply because it was bundled with my install of DOS! And later I ... ehem ... "got hold" of a copy of Turbo Pascal...

My Pascal days were ultra productive. If I wanted to do something, it was just a matter of sitting down and writing it. Compared to writing things with labyrinthine BASIC `goto`/`gosub`, Pascal was super nice and easy to organize. This was easy without imposing structure or architecture up front – after all, it was procedural.

I did learn a smattering of C by getting hold of GCC, and later did some introductory C++ at university. And at this point, everything I wrote on my own was procedural in style. Then I had a summer course in Java. I think this might have been 1996 and the internet was all new. 

And Java introduced OO as the core approach.

It was novel, it was interesting, and despite having written C++, I felt I hadn't really *understood* what OO was about until then. So that started my love affair with OO. Not that it was needed that much initially. Even getting a job in C++ later on gave me little room to do OO. But let's fast forward.

I ended up being exposed to Objective-C, and a job on Java game servers gave me a massive amount of practice writing Java quickly and well, but I still felt a nagging dissatisfaction. Because I never really got *the raw development speed* I had in my early days with Turbo Pascal, I was much better at programming, I was somehow slower – thinking much more about design than before for equivalent code. And this was something I didn't really reflect on that until I had a long-term contracting gig doing PHP.

The codebase was somewhat OO, but not overly so. And the interesting thing was that, at its core, it was basically:

> "The user made a call, route it to running this function and present this result."

Even if bits and pieces inside were wrapped in OO classes, it was mostly procedural. And by god, development was ruthlessly efficient.

Step by step it dawned on me that the OO parts were superfluous: – the whole thing could have been C with an arena allocator + good dynamic arrays and strings. No OO needed.

And that got me thinking. Here it was: the development speed of Turbo Pascal, so why didn't OO give me that? I discovered an answer in OOPs requirement of up-front architecture.

In OOP, you need to think about architecture from the first — what objects own what objects, what objects know of what objects. And a big part of the "best practices" in OO, such as programming to interfaces, are really ways of trying to mitigate the problem if this deep coupling.

The *methods* are fundamentally linked to this problem. As soon as we write:

```c
foo.do_something(bar)
```

we have created a hierarchy where the class of `foo` is more fundamental than `bar`.

In programming, we talk about exploring the problem space as we develop a program. As we gain a deeper understanding, we will usually restructure the program so that it more easily solves the problem. 

The problem with OOP — or, if I may spread the net wider, "methods first" — is that the up-front architecture and the use of methods inhibit these changes. When we have placed B in A, reversing that relationship doesn't just mean moving the field: it also means rewriting all the methods that rely on it. This makes us reluctant to do such refactorings, which in turn means that bad decisions made up front tend to get locked in.

This is not just a problem for OO, but for anything that is "methods first" — that is, when you think:

```c
game.run()
```

instead of:

```c
run(&game)
```

The latter is procedural thinking. The former is "methods first".

As an aside, C3 has methods because they are unreasonably effective for avoiding the need for function overloading in things like `foo.to_string()` But this also makes it harder to drag people out of the "method first" mindset.

(Here [Odin](https://odin-lang.org) has an advantage: it gets people into a good mindset from the start.)

For me, things were starting to come together. 

My PHP experience showed me that the OO parts were never actually needed to create nice abstractions. And the realization that OO — or more broadly, "methods first" — was making it harder to write good programs with good architecture gave me a better understanding of what I had been looking for all along.

C wasn't quite there, because libc was extremely bare-bones and overall didn't have the necessary ergonomics anymore. And yet a subset of C++ wasn't the solution either. It was marinated in "methods first", but above all, it was *so slow to compile*.

So yes, I was looking for a C alternative.

But what I was actually looking for was a C alternative with the ergonomics that made it suitable for current-day application development. And that distinction turned out to matter a lot.

When I would say "C3 is a C-like for people who like C", I was thinking about people who would write everything in C. People like [Sean Barrett](https://nothings.org).

But something I've gradually come to terms with is that "C-like" or "C alternative" today means something rather different. It means "a programming language for what C is predominantly used for *today*". That means OS development, embedded, and high-performance niche libraries and backends. 

People write databases in C, not their next video editor or game. For that they use C++ or something like that. Because with C++, you get the added ergonomics C lacks: dynamic strings and arrays, maps, a sprinkle of overloading. And that makes perfect sense. 

But that isn't what I was thinking about. I was thinking of C as a language for writing *programs*. General-purpose applications. The kinds of things people now reach for C++, Objective-C, Swift, Java or Kotlin to build.

I always thought of C3 as being just as nice — or better — to write those applications in. This is not because I wanted to make C3 into another C++, or another Java, or another Swift. Quite the opposite. I wanted the raw simplicity and performance of C, but with the ergonomics needed to make it pleasant to build modern software. Just a language you pick to get things done, with enough ergonomics to make that as nice and convenient as possible.

In the eyes of most programmers today, this is *not* what they associate with C. But it was what *I* associated with C, because I'm old enough to remember when that was indeed the role of C.

(And this is also why Zig's decisions are so different from C3's: Zig's primary goal seems to be to replace C where it's used *today*.)

When people would say "why do people want to replace C?", I mistakenly always took it as:

> "C is good enough, we don't need a replacement."

But what they meant was really:

> "C isn't used for anything interesting, so why bother with a replacement?"

And that's where I had misunderstood the discussion. I was using an old definition of "C alternative" in a world where C means something else. So when I marketed C3 as a C alternative, I made a pretty fundamental mistake.

C3 was always an alternative to anything from C to C++ to Swift. – I just never thought enough about how much the world had changed. Which changes how I need to talk about C3.

So moving ahead, C3 will talk less about being a C-like, and more about being a programming language for building general-purpose applications. Because the point was always:

**refreshing C to make it a pleasant general-purpose application language again.**

In other words, I spent years marketing C3 as a C replacement, but what I was really trying to build was something much broader.

I just marketed that wrong.