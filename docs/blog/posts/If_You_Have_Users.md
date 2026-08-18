---
title: "If You Have Users, You Have to Market Your Programming Language"
date: 2026-08-17
tags: ["marketing", "programming-languages", "language-design"]
authors:
  - lerno
slug: you_have_to_market_your_programming_language
---
I don't like to think about marketing. I think few programmers do. We tend to dream of a [“build it and they will come”](https://www.imdb.com/title/tt0097351/) situation, where if we just make something great then it will be picked up and get the recognition it deserves. But real life doesn't work like that.

We know of what's popular and that occupies most of our attention. It is a useful evolutionary trait: often what's popular is popular because it managed to out-compete the alternatives, so it saves us from diving into details for everything.

Also, by virtue of being popular it falls under greater scrutiny, so where something less used might have problems few know about, the popular thing's downsides will usually be well explored. It might not be *the best* but it communicates a lot, just being popular.

The *fact* that something or someone has the money/influence to do marketing is in itself a signal of quality: you don't get money/influence without having demonstrated some kind of success. And you get successful by doing something right. Marketing something you don't believe would sell would mean you're making the wrong decision, which you then – by virtue of being successful – have fewer reasons to do. This boils down to the message that someone spending money on marketing, on average, means that the product is good!

This doesn't mean that only good products are marketed of course! But it is what it strongly signals to us. That's why we respond to it even if we don't resonate with the marketing message itself. Without digging into the subject too deeply: just keep in mind that popularity and marketing shape people's opinions on many levels. It creates *trust*.

Now let's get to the main point: programming languages and marketing. I'm not going to talk about *how* to market programming languages or what's difficult about it. No, I want to talk about the effects of marketing, or **not** marketing your language.

People have different goals: it might be a hobby project for their own consumption or ...ahem... a way to world domination in the domain of programming 😄. It might be reasonable to think that marketing isn't needed for the former, but what I'd like to demonstrate is that the case is not clear-cut.

For the sake of argument, let's say I neither go to the extreme of “the goal is to make this language the most popular in the world” nor “only I will ever lay my eyes on this language”. If so, you're building a language for yourself and others to use. – You might tell yourself: “it doesn't matter if this becomes popular, it's enough that I can use it”. This seems to be a pretty common attitude: trying to be realistic about success without closing the door to success. I'm going to tell you this is the wrong thing to do. You should try to make it popular no matter what!

We need to approach this at an uncommon angle: Let's say you have a few people also using your language, what value are you providing them? The language certainly, and usually the toolchain and standard library.

Now, what does the quality of those tools depend on? Roughly: (1) the amount of time people dedicate to them (2) the quality of the effort (3) how much testing has gone into them.

No matter how good your language is, no matter how well you've selected features for the standard libraries for the toolchain: the more people you have using your language, the more people you will have testing it (but the more people, the fewer bugs a single user will encounter!), finding missing functionality in your standard library, or just finding ways the toolchain fails on their particular setup.

What editor are you using? It might be reasonable that you'd make sure that this one has syntax highlighting, but what about all the many different editors people use? Editors you might not even have heard of?

Tutorials? You might do great tutorials, but they will be from your point of view, for tasks *you* think are relevant.

Even if your users produce these for themselves, the extent of how *those* tools are tested also depends on the number of users. We can look at anything: platform support, library bindings, sample projects. Your users will benefit the more users there are. It will just be a better experience and raise the value of everything your users do: if they make a library, they will know others will use it, same for editor syntax highlighting, tutorials and bindings. This is a virtuous cycle where everyone can benefit.

This also explains why people get invested in their language of choice and might become zealous in their promotion of it. We can't just dismiss it with people being “cultish”: they're actually sometimes simply doing what is in their power to improve the value in their favorite investment: it is their way to try bringing better tooling, libraries and other things to the language they enjoy.

Tsoding once remarked:

> “Majority of people treat Programming Languages as some sort of Cryptocurrencies.”

For new languages this is a fairly accurate description of what's happening. Users are aware on some level that more focus on their language of choice will mean a better experience using that language.

We might not like this, but it is what it is.

While your users can contribute, they can't decide on the central marketing message. This is intrinsically tied to the author of the language. If the author says “I don't care if it just remains a hobby project” that might seem self-deprecating and humble. But what it means in practice is: “I don't care about providing value to my users”.

It's the *“build it and they will come”*. Well your users arrived and you thought that was the end of your responsibility. All you need to do is just make the language really good and your job is done. Right? Except your users put effort into learning and contributing, and you're wasting this potential. *“I'm fine with it being a hobby project”* is the excuse. Your language is abandonware. It's not humility, it's failing to understand your obligations.

Marketing is not about making your language “win”. It's not about aggrandisement. It's about fulfilling the obligation to your users, the ones who liked what you did, and had the courtesy of investing time in using it. Your language might never catch on, that is fine, but there is a difference between trying and failing, and not trying at all. If you don't do it, you can hardly expect them to fork the compiler and continue the work. You've shown the world you don't think the language is good enough to market. That's a signal too, a very strong one.

So language designers: we should either make it clear that something is just a toy language which isn't going anywhere – or we should take responsibility and do the marketing as much as we can. Do or do not, there is no try.

---

Discuss this article on [Reddit](https://www.reddit.com/r/ProgrammingLanguages/s/5n5587RRqD).