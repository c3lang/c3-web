---
title: "Macros in C3 - a status update"
date: 2020-07-18
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/macros-in-c3-a-status-update-1m1n](https://dev.to/lerno/macros-in-c3-a-status-update-1m1n)*

I'm going to share a bit of the C3 design process here for people who might be interested.

Like error handling, macros are one of the few truly *new* things in C3 compared to C. Consequently I've been going back and forth with the design trying to cover all angles. 

I always wanted to make macros sufficiently safe that people could use them without worries, which means that some macro use from C would have to go, but which one?

After doing an inventory of what macros *could* do, I roughly end up with this "feature ladder" for macros – from easily understandable and readable to more "dangerous" in terms of how easy it would be to abuse:

1. Inlining
2. Lazy evaluation of arguments
3. Polymorphic parameters
4. Non-local jumps
5. Implicit capture
6. Declarations escaping scope
7. Arbitrary code generation
8. Code fragment replacement

One has to make the cut somewhere, and for C3 I think it's reasonable to either stop at (4) or (5).

(5) - implicit capture - is a bit related to (8) but can often be extremely useful in local code. 

One hard-to-place feature is taking a name or a function invocation and then generating statements from that.

Consider the following:

    #define FOO(X) do { X(0); X(1); X(2); } while 0;
    void doX(int i) { ... }
    FOO(doX);

In C3 this is sort of covered at the (2) level, even though for C that would be (7).

Because macros are mainstream tools in C3 rather than advanced tools it’s important that the syntax is geared towards writing code for 1-3 in particular.

This naturally makes it more natural to require that the macros should resemble functions as much as possible.

(6), (7) and (8) are, when used, usually clever ways to twist C into being more brief or to have an in-code DSL.

This flexibility can create pretty neat hacks, but it’s unclear whether this is a good idea in the large. Are these just clever solutions or are they important ones? My bet is on the former: that the legitimate uses more are about closing holes in C. And if it is, then the macros are basically a poor man's syntax extensions. 

If syntax extensions are desired, [Kit](https://www.kitlang.org) shows how that can be done in a very elegant manner. However, syntax extensions will always sacrifice readability for power, and here C3 makes a different tradeoff so that no matter what macro you see, you should be able to make a good guess as to what it could be doing.

For comparison, here are some C macros and their counterpart in C3 (as the design currently stands):

C:
```c
#define nodesGet(nodes, index) ((INode**)((nodes)+1))[index]
```

C3:
```c
macro INode *nodesGet(nodes, index)
{
  return cast(node + 1, INode**)[index];
}
```

C3 allows trailing body in macros, which makes for slightly different look from C in "foreach" style macros:

```c
#define namespaceFor(ns) for (size_t __i = 0; __i < (ns)->avail; ++__i)

namespaceFor(ns) {
  NameNode *nn = &ns->namenodes[__i];
  if (nn->name == NULL)
    continue;
  nametblHookNode(nn->name, nn->node);
}
```

C3 (note that the declaration for trailing body is very much undecided):

```c
macro namespaceFor(ns; void(usize i) $body)
{
  for (usize index = 0; index < ns.avail; index++)
  {
    body(index);
  }
}
    
@namespaceFor(ns; usize i) 
{
  NameNode *nn = &ns->namenodes[i];
  if (nn->name == NULL) continue;
  nametblHookNode(nn->name, nn->node);
}
```
Using implicit capture of variables from the surrounding scope:

```c
#define lexReturnPuncTok(tok, skip) { \
  lex->toktype = tok; \
  lex->tokp = srcp; \
  lex->srcp = srcp + (skip); \
  return; \
}
```
C3:
```c
macro lexReturnPuncTok!(tok, skip, implicit lex, implicit srcp)
{
  lex.toktype = tok;
  lex.tokp = srcp;
  lex.srcp = srcp + skip;
  return;
}
```

Creating a good macro system that is simple enough not to be dangerous requires difficult trade offs, and it's easy to just make it as flexible as possible. That might be a mistake though, with macros becoming an advanced feature reserved for special situations instead of a regular tool in the toolkit.