---
title: "Syntax - when in doubt, don't innovate"
date: 2024-01-17
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8851-syntax_-_when_in_doubt%252C_don%2527t_innovate](https://c3.handmade.network/blog/p/8851-syntax_-_when_in_doubt%252C_don%2527t_innovate)*

One of the most attractive things about language design is to be able to tweak the syntax of a language on its fundamental level, so not surprisingly you'll see language designers coming up with all sorts of alternatives to conventional syntax.

The problem is that it takes a while – I'd say a year at least – to figure out if some particular new syntax is good. It often takes less time figure out if it's *bad*, but in some cases it might not be obvious until very late. So just because it's not immediately bad, it doesn't mean you won't find out something later.

Even worse, it's hard to weed out false negatives: sometimes syntax might appear to be "bad" simply because it is unfamiliar.

For that reason I think a good rule of thumb when working on syntax might be ***"when in doubt, do not innovate"***.

Just like other language features should "carry their weight" (that is, their value should outweigh their cost), so should syntax. "It's setting the language apart" or "I like how it looks" is fairly low on the value scale if the language is intended for use by others. If you're not sure whether some new syntax is *necessary* then it's better to wait until you know if it is. Meanwhile, there are established syntax conventions out there you can lean on.

New syntax shines where it enables (possibly new and innovative) language features to be expressed cleanly and clearly. It is probably better to prioritize such syntax innovations than, say, innovate new symbol combinations for arithmetics.

## Comments


---
### Comment by Christoffer Lernö

One of the most attractive things about language design is to be able to tweak the syntax of a language on its fundamental level, so not surprisingly you'll see language designers coming up with all sorts of alternatives to conventional syntax.

The problem is that it takes a while – I'd say a year at least – to figure out if some particular new syntax is good. It often takes less time figure out if it's *bad*, but in some cases it might not be obvious until very late. So just because it's not immediately bad, it doesn't mean you won't find out something later.

Even worse, it's hard to weed out false negatives: sometimes syntax might appear to be "bad" simply because it is unfamiliar.

For that reason I think a good rule of thumb when working on syntax might be ***"when in doubt, do not innovate"***.

Just like other language features should "carry their weight" (that is, their value should outweigh their cost), so should syntax. "It's setting the language apart" or "I like how it looks" is fairly low on the value scale if the language is intended for use by others. If you're not sure whether some new syntax is *necessary* then it's better to wait until you know if it is. Meanwhile, there are established syntax conventions out there you can lean on.

New syntax shines where it enables (possibly new and innovative) language features to be expressed cleanly and clearly. It is probably better to prioritize such syntax innovations than, say, innovate new symbol combinations for arithmetics.