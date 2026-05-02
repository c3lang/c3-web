---
title: "Unsigned sizes: a five year mistake"
date: 2026-05-02
tags: ["language-design"]
author: "Christoffer Lernö"
search:
  exclude: true
---

*A quick note for readers who don't follow C3: it's a systems language in the C tradition. Specifics below are C3's, but the tradeoffs apply to any language that has to pick a type for sizes and lengths.*

C3 is moving to signed by default, but why are we doing that? Isn't unsigned more correct for sizes at least? Let's try to answer that.

## The bugs of unsigned

Since the early days, C3 has been using unsigned sizes. And while the *name* of the unsigned type changed over time – from "usize" to "usz" (after the unification with the uptrdiff type) – its position as the default has been unchallenged.

However, unsigned has known pitfalls, the most well known being:

```c3
for (uint x = 10; x >= 0; x--) // Infinite loop!
{ ... }
```

In fact, that bug is so easy to run into that C3 explicitly rejects `x >= 0` for unsigned types outside of macros.

Another classic C bug is:

```c3
uint a = 0;
int b = -1;

if (a > b) { ... }
```

In C, both will promote to unsigned, turning `b` into a huge unsigned value, causing the comparison to fail. For this reason, C3 implemented safe unsigned/signed comparisons that wouldn't convert both sides and be safe regardless.

C, of course, allows implicit conversions between unsigned and signed. While this is a source of bugs, I felt that with some safety measures, it could mostly be kept.

It's easy to think that the bugs above are just unrelated quirks. The loop that never terminates, the broken comparison, the conversions that need to be fixed just-so... they all stem from one earlier decision: that unsigned should be the default for sizes. Most of this post is really about that decision.

### A pertinent question

You might reasonably ask "but why not just require that signed/unsigned conversion is explicit?".

The reason, it turns out, lies with unsigned sizes.

If sizes are unsigned, like in C, C++, Rust and Zig – then it follows that anything involving indexing into data will need to either be all unsigned or require casts. With C's loose semantics, the problem is largely swept under the rug, but for Rust it meant that you'd regularly need to cast back and forth when dealing with sizes.

There are two approaches to casts: one is to liberally sprinkle them all over the codebase with the idea that "it's an explicit conversion, so it's obvious what happens". The other is to minimize casts, only using them to signal that something out of the ordinary is happening: "here be dragons".

The former is easier to define, but has the downside of essentially "silencing warnings". Let's say the code was originally written to cast an `u16` to `u32`, but later the variable type changes from `u16` to `u64` and the cast is now actually silently truncating things. Here we have casts becoming a sort of "silence all warnings".

The main idea of "it's an explicit conversion" is also undermined by the practice of just putting in casts mechanically where the compiler says they're needed, rather than trying to actually examine every case.

On the other hand, minimizing casts is more challenging: rules are needed to correctly allow "safe" implicit casts, while requiring casts for what's unsafe.

C3 takes the second approach: casts should mean something, but why did it allow unsigned <-> signed? Isn't that unsafe?

It turns out that as long as you only use addition, subtraction and multiplication it's mostly quite safe if signed integers are 2s complement. And given that the conversions would need to happen often (remember: unsigned sizes!), the trade-off to make it implicit was natural.

### The best laid plans

C3 has largely kept the current conversion semantics since 2021, and had been working reasonably well without triggering any serious undesirable semantics for 5 years, until an innocent question about "(foo + a) % 2" turned those assumptions on its head.

In order to remove footguns, C3 had picked "int + uint" to promote to "int" instead of unsigned. This made a lot more cases silently signed, which tended to be the correct thing in most cases. But what if we do `(foo + a) % 2` and "foo" here happens to be over INT_MAX? Suddenly we get incomprehensible results! The right answer being `(foo + a) % 2U` instead.

This was an unacceptable problem. Not because it was hard to fix, but because it was so surprising. Almost everywhere else you could simply ignore if there was an underlying conversion to signed or not – it just worked. But `/` and `%`? Here's where the solution broke down. And because it "just worked" everywhere, it was fairly opaque what subexpression was signed or unsigned. The convenience made this minor issue into a big one.

The immediate reaction to this was to patch it: just issue an error on doing "unsigned / signed" and "unsigned % signed", but more issues were lurking in the shadows.

### The tricky wrap

If you write a ring buffer, how do you make sure that calculating offsets are wrapping?

The naive solution is this:

```c3
index = (start + offset) % length;
```

This works as long as `offset` is positive. What about negative values? Here's a common simple solution:

```c3
index = ((start + offset) % length + length) % length;
```

Since `offset` is negative, we can assume signed numbers, so barring extremely large offsets (causing signed overflow) this will work.

(Note: if `%` had yielded the modulo rather than the remainder, the naive solution would have worked)

Now, remember how we started with unsigned sizes? Unsigned first will likely lead us to using all unsigned, leading to code looking like this:

```c3
index = ((start - offset_back) % length + length) % length;
```

Which is completely wrong – but also hard to detect. It will *sometimes* wrap correctly, but mostly not.

The correct code for unsigned needs to look something like this:

```c3
index = (start + length - (offset_back % length)) % length;
```

Regardless of what rules we apply to unsigned and unsigned-signed conversions, there is simply no way for the compiler to let us know that the first "offset_back" example is broken for unsigned.

So let's back up a bit.

### The unsigned size

It seems hard to solve the problem with unsigned, so is there some faulty assumption we're making?

Let's look back in time: C initially was about using signed integers being designed around the `int` type. This all changed when the type of `sizeof` was standardized to the unsigned `size_t`.

This single change single-handedly introduced unsigned arithmetics as a common thing in C code. Finding this new shiny thing, people started to use unsigned to encode "this value can't be negative" and talk about how using unsigned helped since it allowed them to express larger sums.

That didn't mean it was without problems. In fact the problems were so significant that in the 90s, Java decided to drop unsigned types entirely in its design. Java's reaction was perhaps a little extreme, but it did achieve the goal of making a large set of common bugs – related to unsigned – just go away.

Go should give us pause: it's a low-level language, created as a reaction to problems in C++, by people who knew exactly what unsigned sizes cost - and they picked signed sizes.

With any bounded integers, problems arise when we close in on the boundaries. For a 32-bit signed int that is approximately at plus and minus 2 billion, for an unsigned 32-bit integer, it's at 0 and approximately 4 billion. The "unsafe" boundaries for unsigned lie so much closer than for signed integers – there is simply no contest.

This is exactly why we see problems for things like in the case with `%`.

But what about the range? While it's true that you get twice the range, surprisingly often the code in the range above signed-int max is quite bug-ridden. Any code doing something like `(2U * index) / 2U` in this range will have quite the surprise coming. But it's worse than that: overflow for signed values generally produces an invalid, negative number – but unsigned overflow often produces a quite plausible number, just the wrong one. Not to mention that on modern 64 bit machines, you'll run out of memory before you can use a full signed 64 bit integer.

Ok, but isn't it valuable to be in the right range by design? The answer seems to be no judging from work on verification frameworks, as unsigned only encodes modulo behaviour and actual ranges. It might be argued that you can make unsigned overflow an error (this is indeed what Rust does), but that removes useful properties of unsigned arithmetics: `(a + b) - c` is equal to `a + (b - c)` if unsigned arithmetics wrap, but is not the same if it doesn't. This is a trap in itself.

So we have unsigned quite frequently used, more or less by historical accident. It's error prone and silently hides errors. So maybe the solution isn't trying to make it more ergonomic?

### Signed first

As you might have anticipated, C3 has come to adopt signed sizes for types and lengths. Since unsigned now becomes more rare, we don't need any implicit conversions between unsigned and signed. Comparisons between unsigned and signed? – also gone.

When doing this change I started removing unrelated uint and ulong usages as well, and I discovered code that seemed suspicious or just plain wrong. Also, code just got plain simpler with just int and signed sizes everywhere. This is where I realized I had been *internalizing* the cost of using unsigned: after a while working in C or C++, you get the habit of looking for possible problems due to unsigned, and using patterns that are less obvious, but are sure to work for both unsigned and signed variables.

I'm a bit embarrassed about how long it took for me to change this, and it's a testament to how deeply ingrained the habit was. I just *assumed* unsigned sizes was the way to go, and that the problem was simply to improve ergonomics and eliminate as many pitfalls as possible. This despite both Go and Java showing the way with signed sizes.

But even after deciding on the change, converting from unsigned to signed felt awkward and wrong at first, as if I was doing something forbidden – that's how far gone I was. But seeing how each change both made the code easier to reason about and more correct, I couldn't deny the evidence.

### Some notes on the changes in C3

This change was discussed in the C3 discord before it was implemented and got the affectionate name "iszmageddon", this is in reference to the `isz` type (corresponding roughly to `ssize_t`) becoming the default type of sizes.

In order to more clearly promote the signed size, it was renamed just "sz", giving 0.8.0 the asymmetric pair `sz`/`usz`. This makes it easy to remember which one is preferred. Consequently the change was renamed "szmageddon".

Originally the implicit conversion between signed <-> unsigned was mainly left intact, but it was later completely dropped.

---

Discuss this article on [Hacker News](https://news.ycombinator.com/item?id=47989154).