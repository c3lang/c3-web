---
title: "C3: Block comments and mega comments."
date: 2021-06-23
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/7908-c3__block_comments_and_mega_comments.](https://c3.handmade.network/blog/p/7908-c3__block_comments_and_mega_comments.)*

For C3 I wanted to address the problem of commenting out code using block comments.
  
  
In a good [overview](https://web.archive.org/web/20210502105754/http://www.gavilan.edu/csis/languages/comments.html), Dennie Van Tassel outlined four different types of comments:
  
  

1. Full line comments, this is exemplified by REM in **BASIC**: The line only contains the comment and it runs to the end of the line.
2. End-of-Line comments, in C/C++ that would be //
3. Block comments, '/\* ... \*/' in C/C++
4. Mega comments, which in C/C++ can be emulated by using // on every line or using the preprocessor with #if 0 ... #endif

  
  
We can ignore the full line comments, they're completely covered by end-of-line comments, and C3 already has those and /\* ... \*/ block comments.
  
  
However, the *mega comments* poses a problem. In C3 the analogue to #if 0 ... #endif is $if 0 ... $endif, but it would require the code inside to parse.
  
  
Since a typical case for using *mega comments* would actually be to copy a slab of C code inside of comments and then convert it piecemeal $if 0 doesn't work.
  
  
What about making /\* ... \*/ nesting?
  
  
In an article from 2017 titled [Block Comments are a Bad Idea](https://futhark-lang.org/blog/2017-10-10-block-comments-are-a-bad-idea.html) Troels Henriksen argues that *adding nesting* to block comments does not really solve the problem and shows the following example from Haskell which uses {- ... -} for nested comments:
  
  

```
{-
s = "{-";
-}
```

  
  
In the above example the {- inside of the string inadvertently opens a new nested comment. He rejects the idea that the lexer (or even worse, \*the parser\*) should track strings inside of comments. Instead Henriksen argues for either using #if 0 or // on every line. While the latter is exactly what Zig picked, it relies too much on the text editor for my taste.
  
  
Looking at D, it introduces a new nested comment /+ ... +/. It acts just like /\* ... \*/ except it is nested. Initially this was what I picked for C3.
  
  
However it has drawbacks:
  
  

1. It introduces another comment type that is only *marginally* different from the others.
2. It can have the s = "/+" problem just like "/\*" – we just moved the problem.
3. For beginners coming from C it's not obvious that this comment type is available, so it may get under used.
4. It does not visually indicate that it should be used for *mega comments* rather than regular comments.

  
  
There's another point as well: #if 0 ... #endif can never have the s = "/\*" issue by virtue of always starting and ending on its own line.
  
  
Doing some research I tried to determine if there was some "obvious" syntax that could convey the #if 0 ... #endif behaviour. I had a lot of examples (that I hated), like /--- ... ---/ /--> ... /<--- and even ideas of a [heredoc](https://en.wikipedia.org/wiki/Here_document) style comment like /$FOO ... /$$FOO.
  
  
Ultimately I decided to pick /# ... #/ for these block comments, which acted like nested comments but were required to be on a new line which bypasses this problem:
  
  

```
/#
s = "/#"; <- not recognized
#/
```

  
  
But it turns out that this has issues of its own. What if you by accident write something like:
  
  

```
/#
int x;
int y = foo(); #/
```

  
  
or
  
  

```
foo() /#
int x;
#/
```

  
  
You need a good heuristic to figure out a nice error message for these. For example you could either *always* decide that /#foo is /# + foo or maybe it's only like that if the /# starts a line, otherwise it's interpreted as / + #foo (which can be valid C3).
  
  
But after playing around with this for a while, I had to say that the *value* from this seemed much less than I had hoped. Yes, it's distinct, but it has most of the problems with /+ ... +/ in terms of lack of familiarity. And if I'm honest with myself, I'm personally still mostly using /\* ... \*/ over #if 0 ... #endif where I can.
  
  
So we've come full circle: nesting /\* \*/ to distinct nesting block comments, to #if 0 ... #endif and now back to perhaps nesting /\* ... \*/?
  
  
For now at least, C3 will add nesting to /\* ... \*/ and remove /+ ... +/. This is an imperfect solution, but possibly also a reasonable trade off to keep the language familiar with features that pull their weight.

## Comments


---
### Comment by Christoffer Lernö

For C3 I wanted to address the problem of commenting out code using block comments.
  
  
In a good [overview](https://web.archive.org/web/20210502105754/http://www.gavilan.edu/csis/languages/comments.html), Dennie Van Tassel outlined four different types of comments:
  
  

1. Full line comments, this is exemplified by REM in **BASIC**: The line only contains the comment and it runs to the end of the line.
2. End-of-Line comments, in C/C++ that would be //
3. Block comments, '/\* ... \*/' in C/C++
4. Mega comments, which in C/C++ can be emulated by using // on every line or using the preprocessor with #if 0 ... #endif

  
  
We can ignore the full line comments, they're completely covered by end-of-line comments, and C3 already has those and /\* ... \*/ block comments.
  
  
However, the *mega comments* poses a problem. In C3 the analogue to #if 0 ... #endif is $if 0 ... $endif, but it would require the code inside to parse.
  
  
Since a typical case for using *mega comments* would actually be to copy a slab of C code inside of comments and then convert it piecemeal $if 0 doesn't work.
  
  
What about making /\* ... \*/ nesting?
  
  
In an article from 2017 titled [Block Comments are a Bad Idea](https://futhark-lang.org/blog/2017-10-10-block-comments-are-a-bad-idea.html) Troels Henriksen argues that *adding nesting* to block comments does not really solve the problem and shows the following example from Haskell which uses {- ... -} for nested comments:
  
  

```
{-
s = "{-";
-}
```

  
  
In the above example the {- inside of the string inadvertently opens a new nested comment. He rejects the idea that the lexer (or even worse, \*the parser\*) should track strings inside of comments. Instead Henriksen argues for either using #if 0 or // on every line. While the latter is exactly what Zig picked, it relies too much on the text editor for my taste.
  
  
Looking at D, it introduces a new nested comment /+ ... +/. It acts just like /\* ... \*/ except it is nested. Initially this was what I picked for C3.
  
  
However it has drawbacks:
  
  

1. It introduces another comment type that is only *marginally* different from the others.
2. It can have the s = "/+" problem just like "/\*" – we just moved the problem.
3. For beginners coming from C it's not obvious that this comment type is available, so it may get under used.
4. It does not visually indicate that it should be used for *mega comments* rather than regular comments.

  
  
There's another point as well: #if 0 ... #endif can never have the s = "/\*" issue by virtue of always starting and ending on its own line.
  
  
Doing some research I tried to determine if there was some "obvious" syntax that could convey the #if 0 ... #endif behaviour. I had a lot of examples (that I hated), like /--- ... ---/ /--> ... /<--- and even ideas of a [heredoc](https://en.wikipedia.org/wiki/Here_document) style comment like /$FOO ... /$$FOO.
  
  
Ultimately I decided to pick /# ... #/ for these block comments, which acted like nested comments but were required to be on a new line which bypasses this problem:
  
  

```
/#
s = "/#"; <- not recognized
#/
```

  
  
But it turns out that this has issues of its own. What if you by accident write something like:
  
  

```
/#
int x;
int y = foo(); #/
```

  
  
or
  
  

```
foo() /#
int x;
#/
```

  
  
You need a good heuristic to figure out a nice error message for these. For example you could either *always* decide that /#foo is /# + foo or maybe it's only like that if the /# starts a line, otherwise it's interpreted as / + #foo (which can be valid C3).
  
  
But after playing around with this for a while, I had to say that the *value* from this seemed much less than I had hoped. Yes, it's distinct, but it has most of the problems with /+ ... +/ in terms of lack of familiarity. And if I'm honest with myself, I'm personally still mostly using /\* ... \*/ over #if 0 ... #endif where I can.
  
  
So we've come full circle: nesting /\* \*/ to distinct nesting block comments, to #if 0 ... #endif and now back to perhaps nesting /\* ... \*/?
  
  
For now at least, C3 will add nesting to /\* ... \*/ and remove /+ ... +/. This is an imperfect solution, but possibly also a reasonable trade off to keep the language familiar with features that pull their weight.