---
title: "Removing features, gaining freedom"
date: 2021-10-17
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8168-removing_features%252C_gaining_freedom](https://c3.handmade.network/blog/p/8168-removing_features%252C_gaining_freedom)*

I recently removed untyped literals, and that complexity is now leaving me free to actually add code where there's a tangible benefit to it.

It might not be immediately obvious that having untyped literals adds complexity to a language. For C3, with its C-like implicit conversions and untyped macros, it adds more complexity than in languages like Go, where explicit conversions are enforced.

The sheer amount of complexity I had added to just do this surprised even me though. For example, every expression needed to pass down a "target type" just in case the analysis encountered an untyped literal to give a type to. In some cases this was far from trivial, and analysis had to be done in a certain order to prevent unnecessary error situations, where the incorrect order would only be obvious when the expressions where combined in some special way.

As I removed the code I also discovered I could change how the "failables" (error unions) were handled, which further reduced complexity. This in turn allowed me to do simplifications in tracking constant and "pure" expressions.

Lots of code that I had left half unfinished – with special, problematic, cases to solve another day – would after refactoring easily cover all cases and be smaller.

The code now seems so much easier to grasp, and it seems crazy I didn't removed this feature - that at the most saved a little typing here and there - earlier. But the problem was that it was a gentle creep. I did the untyped literals early, so when I added more complex features I didn't have a comparison with how it would look with untyped literals removed.

When I look at the code now, I see something that more easily can accommodate added features and behaviours. The semantic analysis had before by necessity been much more coupled due to type flow going both bottom up and top down.

There's a lesson here – which is that a seemingly simple and "nice to have" feature might by accident end up making a code base more than twice as complex to read and reason about. And that *complexity cost* takes away the resources the compiler (and the language) has for other features – features that may actually have a cost that is equal to its benefits.

In removing this small feature with little practical benefit, I am now free to actually add a little complexity where it really helps the users.

## Comments


---
### Comment by Christoffer Lernö

I recently removed untyped literals, and that complexity is now leaving me free to actually add code where there's a tangible benefit to it.

It might not be immediately obvious that having untyped literals adds complexity to a language. For C3, with its C-like implicit conversions and untyped macros, it adds more complexity than in languages like Go, where explicit conversions are enforced.

The sheer amount of complexity I had added to just do this surprised even me though. For example, every expression needed to pass down a "target type" just in case the analysis encountered an untyped literal to give a type to. In some cases this was far from trivial, and analysis had to be done in a certain order to prevent unnecessary error situations, where the incorrect order would only be obvious when the expressions where combined in some special way.

As I removed the code I also discovered I could change how the "failables" (error unions) were handled, which further reduced complexity. This in turn allowed me to do simplifications in tracking constant and "pure" expressions.

Lots of code that I had left half unfinished – with special, problematic, cases to solve another day – would after refactoring easily cover all cases and be smaller.

The code now seems so much easier to grasp, and it seems crazy I didn't removed this feature - that at the most saved a little typing here and there - earlier. But the problem was that it was a gentle creep. I did the untyped literals early, so when I added more complex features I didn't have a comparison with how it would look with untyped literals removed.

When I look at the code now, I see something that more easily can accommodate added features and behaviours. The semantic analysis had before by necessity been much more coupled due to type flow going both bottom up and top down.

There's a lesson here – which is that a seemingly simple and "nice to have" feature might by accident end up making a code base more than twice as complex to read and reason about. And that *complexity cost* takes away the resources the compiler (and the language) has for other features – features that may actually have a cost that is equal to its benefits.

In removing this small feature with little practical benefit, I am now free to actually add a little complexity where it really helps the users.