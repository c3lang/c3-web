---
title: "The case against a C alternative"
date: 2022-08-07
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8486-the_case_against_a_c_alternative](https://c3.handmade.network/blog/p/8486-the_case_against_a_c_alternative)*

Like several others I am writing an alternative to the C language (if you read this blog before then this shouldn't be news!). My language (C3) is fairly recent, there are others: Zig, Odin, Jai and older languages like eC. Looking at C++ alternatives there are languages like D, Rust, Nim, Crystal, Beef, Carbon and others.

But is it possible to replace C? Let's consider some arguments against.

### 1. C language toolchain

The C language is not just the language itself but all the developer tools developed for the language. Do you want to do static analysis on your source code? - There are a lot of people working on that for C. Tools for detecting memory leaks, data races and other bugs? There's a lot of those, even if your language has better tooling out of the box.

If you want to target some obscure platform, then likely it's assuming you're using C.

The status of C as the lingua franca of today's computing makes it worthwhile to write tools for it, so there are many tools being written.

If someone has a toolchain set up working, why risk it switching language? A "better C" must bring a lot of added productivity to motivate the spending time setting up a new toolchain. If it's even possible.

### 2. The uncertainties of a new language

Before a language has matured, it's likely to have bugs and might change significantly to address problems with language semantic. And is the language even as advertised? Maybe it offers something like "great compile times" or "faster than C" – only these goals turn out to be hard to reach a the language adds the full set of features.

And what about maintainers? Sure, an open source language can be forked, but I doubt many companies are interested in using a language that they further down the line might be forced to maintain.

Betting on a new language is a big risk.

### 3. The language might just not be good enough

Is the language even addressing the real pain points of C? It turns out that people don't always agree on what the pain points with C is. Memory allocation, array and string handling are often tricky, but with the right libraries and a sound memory strategy, it can be minimized. Is the language possibly addressing problems that advanced users don't really worry about – if so then its actual value might be much lower than expected.

And worse, what if the language omits crucial features that are present in C? Features that C advanced programmers rely on? This risk is increased if the language designer hasn't used C a great deal but comes from C++, Java etc.

### 4. No experienced developers

A new language will naturally have a much smaller pool of experienced developers. For any middle to large company that's a *huge* problem. The more developers there are available for a company, the better they like it.

Also, while the company has experience recruiting for C developers, it doesn't know how to recruit for this new language.

### 5. The C ABI is the standard for interoperability

If the language can't easily call – or be called - by C code, then anyone using the language will have to have to do extra work to do pretty much anything that is interfacing with outside code. This is potentially a huge disadvantage.

# "Better X" doesn't matter

So those are some of the downsides to not picking C, to be offset by the advantages of picking the alternative. However, often language designers over-estimate what how big advantages their added "features" bring. Here are some common "false advantages"

### 1. Better syntax

Having a "better syntax" than C is mostly subjective. Different syntax is also a huge disadvantage: now you can't copy code from C, you might have to rewrite every single line even. No company will adopt a language because it has slightly better syntax than C.

### 2. Safer than C

Any C alternative will be expected to be on par with C in performance. The problem is that C have practically no checks, so any safety checks put into the competing language will have a runtime cost, which often is unacceptable. This leads to a strategy of only having checks in "safe" mode. Where the "fast" mode is just as "unsafe" as C.

There are some exceptions: "foreach" avoids manually adding boundary checks and so will automatically be safer. Similarly slices helps in writing checks compared to "pointer + len" (or worse: null terminated arrays).

### 3. Programmer productivity

First of all, pretty much all languages ever will make vacuous claims of "higher programmer productivity". The problem is that for a business this usually doesn't matter. Why? Because the actual programming is not the main time sink. In a business, what takes time is to actually figure out what the task *really* is. So something like a 10% or 20% "productivity boost" won't even register. A 100% increase in productivity might show, but even that isn't guaranteed.

# What matters?

So if these don't matter, what does? For a business it's whether despite the downsides the language can help the bottom line: "Is this valuable enough to outweigh the downsides?"

But if "better x" doesn't help - what does? Well... "killer features": having unique selling points that C can't match.

Look at Java, when it was released it offered the following features that most of the competing languages couldn't give you:

* OO done cleanly (OO was hot at the time)
* Threading out of the box (uncommon at the time)
* "Write once run anywhere"
* "Run your code in the browser"
* Garbage collection built in
* Network programming
* Good standard library
* Free to use

That's not just one but eight(!) killer features. How many of those unique selling points do the C alternatives have? Less than Java did at least!

# The next killing feature

So my argument is that a common way languages gets adoption by being the *only* language in order to use something: Dart for using Flutter, JS for scripting the browser, Java for applets, ObjC for Mac and iOS apps.

Even if those monopolies disappear over time, it gives the language become known and used.

Similarly there are examples where frameworks have been popular enough to boost languages, Ruby and Python are good examples.

So looking at our example languages, Jai's strategy of bundling a game engine seems good: anyone using it will have to learn Jai, so if the engine is good enough people will learn the language too.

But aside from Jai, is anyone C alternative really looking to pursue having killer features? And if it doesn't have one, how does it prove the switch from C is worth it? It can't.

# Conclusion

The "build it and they will come" idea is tempting to believe in, but there is frankly little reason to drop C unless the alternative has important unique features an/or products that C can't hope to match.

While popularity and enthusiasm is helpful, it cannot replace proven value. In the end, all that matters is whether using a language can produce more tangible value to developers than C for at least a large subset of what C is used for. While developers may be excited by new languages, that enthusiasm doesn't translate to business value.

So no matter how exciting that C alternative may look, it probably will fail.

## Comments


---
### Comment by Christoffer Lernö

Like several others I am writing an alternative to the C language (if you read this blog before then this shouldn't be news!). My language (C3) is fairly recent, there are others: Zig, Odin, Jai and older languages like eC. Looking at C++ alternatives there are languages like D, Rust, Nim, Crystal, Beef, Carbon and others.

But is it possible to replace C? Let's consider some arguments against.

### 1. C language toolchain

The C language is not just the language itself but all the developer tools developed for the language. Do you want to do static analysis on your source code? - There are a lot of people working on that for C. Tools for detecting memory leaks, data races and other bugs? There's a lot of those, even if your language has better tooling out of the box.

If you want to target some obscure platform, then likely it's assuming you're using C.

The status of C as the lingua franca of today's computing makes it worthwhile to write tools for it, so there are many tools being written.

If someone has a toolchain set up working, why risk it switching language? A "better C" must bring a lot of added productivity to motivate the spending time setting up a new toolchain. If it's even possible.

### 2. The uncertainties of a new language

Before a language has matured, it's likely to have bugs and might change significantly to address problems with language semantic. And is the language even as advertised? Maybe it offers something like "great compile times" or "faster than C" – only these goals turn out to be hard to reach a the language adds the full set of features.

And what about maintainers? Sure, an open source language can be forked, but I doubt many companies are interested in using a language that they further down the line might be forced to maintain.

Betting on a new language is a big risk.

### 3. The language might just not be good enough

Is the language even addressing the real pain points of C? It turns out that people don't always agree on what the pain points with C is. Memory allocation, array and string handling are often tricky, but with the right libraries and a sound memory strategy, it can be minimized. Is the language possibly addressing problems that advanced users don't really worry about – if so then its actual value might be much lower than expected.

And worse, what if the language omits crucial features that are present in C? Features that C advanced programmers rely on? This risk is increased if the language designer hasn't used C a great deal but comes from C++, Java etc.

### 4. No experienced developers

A new language will naturally have a much smaller pool of experienced developers. For any middle to large company that's a *huge* problem. The more developers there are available for a company, the better they like it.

Also, while the company has experience recruiting for C developers, it doesn't know how to recruit for this new language.

### 5. The C ABI is the standard for interoperability

If the language can't easily call – or be called - by C code, then anyone using the language will have to have to do extra work to do pretty much anything that is interfacing with outside code. This is potentially a huge disadvantage.

# "Better X" doesn't matter

So those are some of the downsides to not picking C, to be offset by the advantages of picking the alternative. However, often language designers over-estimate what how big advantages their added "features" bring. Here are some common "false advantages"

### 1. Better syntax

Having a "better syntax" than C is mostly subjective. Different syntax is also a huge disadvantage: now you can't copy code from C, you might have to rewrite every single line even. No company will adopt a language because it has slightly better syntax than C.

### 2. Safer than C

Any C alternative will be expected to be on par with C in performance. The problem is that C have practically no checks, so any safety checks put into the competing language will have a runtime cost, which often is unacceptable. This leads to a strategy of only having checks in "safe" mode. Where the "fast" mode is just as "unsafe" as C.

There are some exceptions: "foreach" avoids manually adding boundary checks and so will automatically be safer. Similarly slices helps in writing checks compared to "pointer + len" (or worse: null terminated arrays).

### 3. Programmer productivity

First of all, pretty much all languages ever will make vacuous claims of "higher programmer productivity". The problem is that for a business this usually doesn't matter. Why? Because the actual programming is not the main time sink. In a business, what takes time is to actually figure out what the task *really* is. So something like a 10% or 20% "productivity boost" won't even register. A 100% increase in productivity might show, but even that isn't guaranteed.

# What matters?

So if these don't matter, what does? For a business it's whether despite the downsides the language can help the bottom line: "Is this valuable enough to outweigh the downsides?"

But if "better x" doesn't help - what does? Well... "killer features": having unique selling points that C can't match.

Look at Java, when it was released it offered the following features that most of the competing languages couldn't give you:

* OO done cleanly (OO was hot at the time)
* Threading out of the box (uncommon at the time)
* "Write once run anywhere"
* "Run your code in the browser"
* Garbage collection built in
* Network programming
* Good standard library
* Free to use

That's not just one but eight(!) killer features. How many of those unique selling points do the C alternatives have? Less than Java did at least!

# The next killing feature

So my argument is that a common way languages gets adoption by being the *only* language in order to use something: Dart for using Flutter, JS for scripting the browser, Java for applets, ObjC for Mac and iOS apps.

Even if those monopolies disappear over time, it gives the language become known and used.

Similarly there are examples where frameworks have been popular enough to boost languages, Ruby and Python are good examples.

So looking at our example languages, Jai's strategy of bundling a game engine seems good: anyone using it will have to learn Jai, so if the engine is good enough people will learn the language too.

But aside from Jai, is anyone C alternative really looking to pursue having killer features? And if it doesn't have one, how does it prove the switch from C is worth it? It can't.

# Conclusion

The "build it and they will come" idea is tempting to believe in, but there is frankly little reason to drop C unless the alternative has important unique features an/or products that C can't hope to match.

While popularity and enthusiasm is helpful, it cannot replace proven value. In the end, all that matters is whether using a language can produce more tangible value to developers than C for at least a large subset of what C is used for. While developers may be excited by new languages, that enthusiasm doesn't translate to business value.

So no matter how exciting that C alternative may look, it probably will fail.