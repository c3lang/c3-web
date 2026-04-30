---
title: "Implementing \"defer\""
date: 2020-07-27
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/implementing-defer-3l76](https://dev.to/lerno/implementing-defer-3l76)*

The `defer` statement is going mainstream. Go has it's own special defer which only fires on function end, otherwise `defer` has consistent "execute at scope end" semantics. Swift, [Zig](https://ziglang.org/documentation/master/#defer), Jai, [Nim](https://nim-lang.org/docs/manual.html#exception-handling-defer-statement) and [Odin](https://odin-lang.org/docs/overview/#defer-statement) all use defer in this manner.

The problems with implementing `defer` is similar to implementing destructors for stack allocated objects in C++, although the presence of virtual functions complicates things.

I couldn't find anyone describing how `defer` is done in other compilers so when working on a version of it for [C2](http://www.c2lang.org) I had to make it up as I went along.

For posterity's sake I thought it might be interesting to do a writeup on how defer was implemented.

## Setting the rules

First up there are lots of different possible rules to adapt defer to. The original draft of this article would handle `goto` *across* defers. C2 retains `goto`, and for a long time, so did [C3](http://www.c3-lang.org) – so this was important to make the article complete. However `goto` adds much complexity to defer which made the article both much longer and harder to follow.

For that reason we'll limit ourselves to `return`, `continue`, `break` and labelled versions of the latter. If there is interest I can go into details on how to add defer for `goto` in another article.

## Handling early exit

The first issue in `defer` is the early exit:

```c
void test()
{
  defer printf("A");
  if (rand() % 2 == 0) return;
  printf("B");
}
```

Every `return` needs to inline the defer at the end, so this is lowered to:

```c
void test()
{
  if (rand() % 2 == 0) 
  {
    printf("A");
    return;
  }
  printf("B");
  printf("A");
}
```

For `break` and `continue` this is handled similar to `return` but only part of the defers may be inlined at the point of the break:

```c
void test()
{
  defer printf("A");
  while (true)
  {
    defer printf("B");
    {
      defer printf("C");
      if (rand() % 2 == 0) break;
    }
  }
}
```

And the inlined version:

```c
void test()
{
  while (true)
  {
    {
      if (rand() % 2 == 0) 
      {
        printf("C");
        printf("B");
        break;
      }
      printf("C");
    }
    printf("B");
  }
  printf("A");
}
```

We also have the labelled version of break. (I'll stick to the java-style labelled break syntax here)

```c
void test()
{
  defer printf("A");
  FOO: while (true)
  {
    defer printf("B");
    while (true)
    {
      defer printf("C");
      if (rand() % 2 == 0) break FOO;
    }
  }
}
```

This is again lowered to:

```c
void test()
{
  FOO: while (true)
  {
    while (true)
    {
      if (rand() % 2 == 0) 
      {
        printf("C");
        printf("B");
        break FOO;
      }
      printf("C");
    }
    printf("B");
  }
  printf("A");
}
```

So as we see it's sufficient to keep a list of the defers and then inline the defer statements in reverse order where we encounter a `break` `continue` or `return`.

## Putting it all together

So now we've listed all the things we need to solve. How do we put it together? Here's the algorithm I used:

1. For each defer, keep a pointer back to the previously active defer.
2. For each dynamic scope, keep track of the current defer.
3. On break/continue/return AST nodes, store 2 AST nodes.
4. On each scoping AST node (while, for, compound statement etc) store 2 AST nodes.

### Algorithm

1. Set `current_scope->current_defer = NULL`
2. Traverse the AST-tree.
3. When pushing a new dynamic scope
```c
current_scope->current_defer = prev_scope->current_defer;
```
4. When encountering a defer:
```c
defer->prev_defer = current_scope->current_defer;
current_scope->current_defer = defer;
```
5. When encountering a scoped statement:
```c
scoped_stmt->start_defer = current_scope->current_defer;
push_new_current_scope();
... recursively process nodes ...
scoped_stmt->end_defer = current_scope->current_defer;
pop_current_scope();
```
6. When encountering a break or continue:

```c
Ast* target_ast = find_target(break_stmt);
break_stmt->end_defer = current_scope->current_defer;
break_stmt->start_defer = target_ast->start_defer;
```

7. When encountering a return:
```c
return_stmt->defer = current_scope->current_defer;
```

This results in us being able to use each defer as the top of a linked list:

```
current_defer
   |
   v
current_defer->prev_defer
   |
   v
current_defer->prev_defer->prev_defer
   |
   v
  NULL
```

Codegen is now easy.

We introduce a helper function to inline defers:

```c
void codegen_defers(Defer *current, Defer *last)
{
  while (current_defer != last)
  {
    codegen(current_defer);
    current_defer = current_defer->prev_defer;
  }
}
```
  
1. When doing codegen for a scoped statement:

```c
codegen(scoped_stmt->inner_stmt);
codegen_defers(scoped_stmt->end_defer, scoped_stmt->start_defer);
```

2. When doing codegen for `break` or `continue`:

```c
codegen_defers(break_stmt->end_defer, break_stmt->start_defer);
codegen_break(break_stmt);
```

3. Codegen for `return`
```c
codegen_defers(return_stmt->defer, NULL);
codegen_return(return_stmt);
```

## Going further

Ok, so now we're done? Not quite, if we want to go beyond C syntax. We can imagine something looking a bit like this:

```c
if (File *f = getFile(), defer close(f)) { ... }
```

In this case we actually have two scopes: one inner scope (between `{}`) and the outer one that starts in the conditional.

The principle is the same so we can reuse the same solution as above, but it's worth taking note of this case.

### Defer after if

We have other questions to answer as well. What does this code do:

```c
if (x == 0) defer printf("x was 0\n");
```

Some people have suggested that this should be treated as:

```c
defer
{
  if (x == 0) printf("x was 0\n");
}
```

I am strongly against that idea, as it would mean that compound statements suddenly have a different meaning than regular statements.

### Defer as part of the function

Another interesting thing one can do with defer is the idea that a function may contain an implicit `defer` that is added to the scope which invokes it. [Odin](https://odin-lang.org) has that feature using "deferred attributes" (see further down from [this link](https://odin-lang.org/docs/faq/#does-odin-have-c-style-destructors)). This is simple to tie into the defer machinery.

### Defers & goto

Handling `goto` with defers is a bit more complicated as one need to conditionally invoke defers:

```c
void test(int x)
{
  if (x > 0) goto FOO;
  // When is this called?
  defer printf("A");
  FOO:
  printf("B");
}
```

The lowered code needs to look like this:
```c
void test(int x)
{
  bool _defer_1 = false;
  if (x > 0) goto FOO;
  _defer_1 = true;
  FOO:
  printf("B");
  if (_defer_1) 
  {
    printf("A");
  }
}
```

Since B can jump *into* scopes as well as out of scopes, this adds another dimension to the analysis. The solution is not *hard* but definitely not as straightforward as the structured jumps of `break` and `continue`

Non-local jumps of `setjmp` are not possible to handle at all.

### Go style defers

Go has a different style of defer. Go's defers actually store the defer code like a closure that is queued and invoked *at function end* rather than at scope end. This means a defer actually needs to allocate memory for itself. A loop like this:

```go
for() {
  ...
  defer ...
  ...
}
```

Would queue up all the defers generated in the loop in a long list and release them at function end. If the `defer` is releasing something limited like db connections then this is a bad idea. For various "gotchas" in Go due to this style of defer, see [this](https://blog.learngoprogramming.com/gotchas-of-defer-in-go-1-8d070894cb01)

While Go defers work nicely with exceptions and `goto`, it has quite a bit of quirks as well as the need to reserve memory to store the defers.

### Defers and errors

Sometimes one would prefer for defers to only occur on error:

```c
File *getAndCheckFile()
{
   File *f = getFile();
   if (!f) return NULL;
   // We want to close if we return with error.
   defer close(f);
   if (!fileIsValid(f)) return NuLL;
   if (readHeader(f) != 0xdeadbeef) return NULL;
   // oops, we will be closing f!
   return f;
}
```

For this reason Zig introduces `errdefer`, and C3 has `defer catch` / `defer try` statements.

### Being able to cancel defers

As an alternative (and complement) to special forms of defer is being able to *cancel* defers. So far I've only seen this functionality on defer implemented as RAII. Theoretically it could look something like:

```c
File *getAndCheckFile()
{
   File *f = getFile();
   if (!f) return NULL;
   FOO: defer close(f);
   if (!fileIsValid(f)) return NuLL;
   if (readHeader(f) != 0xdeadbeef) return NULL;
   undefer FOO;
   return f;
}
```

## Summary

Defer is useful functionality for languages that lack either `finally` or RAII. With structured jumps it is straightforward to implement with zero overhead.