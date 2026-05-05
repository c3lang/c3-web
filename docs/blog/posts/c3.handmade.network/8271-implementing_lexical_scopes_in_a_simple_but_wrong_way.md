---
title: "Implementing lexical scopes in a simple but wrong way"
date: 2021-12-20
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8271-implementing_lexical_scopes_in_a_simple_but_wrong_way](https://c3.handmade.network/blog/p/8271-implementing_lexical_scopes_in_a_simple_but_wrong_way)*

The problem: implementing lexical scope in a programming language.

Here is an example.

```
fn void test(int y)
{
  int x = 123;
  for (int i = 1; i < y; i++)
  {
    int z = foo(i + x); // The first z
    if (z > 100) x++;    
  }
  // The second z
  int z = x + 1; 
  // z += i; <- Error since i is not in scope 
}
```

Formulated like this, the problem is fairly simple. One solution is like this:

```
Decl *locals[MAX_LOCALS];
Scope scopes[MAX_SCOPES];
Scope *next_scope = &scopes[0];
Decl **next_local = &locals[0];

void push_scope()
{
  *next_scope = { .local_start = next_local, .local_end = next_local };
  // TODO Check we didn't reach max 
  next_scope--;
}
void pop_scope()
{
  // Move the current local to the start.
  next_scope--;
  next_local = next_scope.local_start;
}
      
void push_local(Decl *decl)
{
  // TODO check we didn't reach max
  *next_local = decl;
  next_local++;
  next_scope[-1].local_end = next_local;
}
```

This solution isn't the simplest we could do, but it has some advantages knowing both the end and the beginning of the locals.
Doing a lookup we do a linear search back from the last local:

```
Decl *find_decl(const char *interned_name)
{
  Decl **current = next_local;
  while (current != &locals[0])
  {
    current--;
    if (current[0].name == interned_name) return current[0];
  }
  return NULL;
}
```

This might not seem super fast, but variables are often used near their definition and the number of locals are
usually fairly limited anyway.

Roughly this is what happens in this algorithm as it goes through the code above:

```
1. Push function scope

scope: [{ 0, 0 }]
decl: []

2. The param is added

scope: [{ 0, 1 }]
decl: [int y]

3. Push int x

scope: [{ 0, 2 }]
decl: [int y, int x]

4. Push "for" scope

scope: [{ 0, 2 }, { 2, 2 }]
decl: [int y, int x]

5. Push int i

scope: [{ 0, 2 }, { 2, 3 }]
decl: [int y, int x, int i]

6. Push "for body" scope

scope: [{ 0, 2 }, { 2, 3 }, { 3, 3 }]
decl: [int y, int x, int i]

7. Push int z

scope: [{ 0, 2 }, { 2, 3 }, { 3, 4 }]
decl: [int y, int x, int i, int z]

8. Pop "for body" scope

scope: [{ 0, 2 }, { 2, 3 }]
decl: [int y, int x, int i]

9. Pop "for" scope

scope: [{ 0, 2 }]
decl: [int y, int x]

10. Push int z

scope: [{ 0, 3 }]
decl: [int y, int x, int z]

11. Pop function scope

scope: []
decl: []
```

It's fairly straightforward to see how - after defining `z` - we can lookup `x` and `i` in step 7.

This model is simple and easy to understand – but we skipped something, didn't we? Yes, the lookup of the function `foo`.
In this scheme, anything not found in the locals, will then first look through the current file, then the module and then
finally any imports. (This is not how C works, but that is because in C everything is just a single flat file in the end,
so we just "look through" the file).

### Macros

So far so good, and if this was all we had, the story would end here. But there's an added complexity. What if we have macros?

Here is a simple example:

```
macro int testmacro(int x)
{
  int z = 2;
  for (int i = 0; i < x; i++)
  {
    z *= 2;
  }
  return z;
}     

fn int test(int y)
{
  int z = getValue(y);
  int x = @testmacro(z);
  return z + x;
}
```

*Assuming we want hygienic macros* we cannot simply copy the macro into the function, names and all:

```
// Broken version
fn int test(int y)
{
  int z = getValue(y);
  int x = z;
  int z = 2;
  for (int i = 0; i < x; i++)
  {
    z *= 2;
  }
  int _macro_result = z;
  int x = _macro_result;
  return z + x;
}
```

In C3 there is an expression block, working similar to a statement expression in GCC C. If this was used together with
allowing shadowing, we'd get something that halfway worked:

```
// Works but...
fn int test(int y)
{
  int z = getValue(y);
  int x = {|
    int x = z;
    int z = 2;
    for (int i = 0; i < x; i++)
    {
      z *= 2;
    }
    return z;
  |};
  return z + x;
}
```

This seems to work, but what if we wrote this incorrect macro:

```
macro testmacro(int x)
{
  return y * x;
}
```

If we fold that:

```
fn int test(int y)
{
  int z = getValue(y);
  int x = {|
    int x = z;
    return y * x;
  |};
  return z + x;
}
```

So now `y` is leaking into the macro, which is implicitly capturing `y`. This is not what we want (and as we'll
see later this is just the tip of the iceberg).

[Next](https://c3.handmade.network/blog/p/8272-fixing_lexical_scopes..._badly) I'll show a way to extend our simple scope system to make sure that the macros are indeed hygenic, and show other things that breaks.

## Comments


---
### Comment by Christoffer Lernö

The problem: implementing lexical scope in a programming language.

Here is an example.

```
fn void test(int y)
{
  int x = 123;
  for (int i = 1; i < y; i++)
  {
    int z = foo(i + x); // The first z
    if (z > 100) x++;    
  }
  // The second z
  int z = x + 1; 
  // z += i; <- Error since i is not in scope 
}
```

Formulated like this, the problem is fairly simple. One solution is like this:

```
Decl *locals[MAX_LOCALS];
Scope scopes[MAX_SCOPES];
Scope *next_scope = &scopes[0];
Decl **next_local = &locals[0];

void push_scope()
{
  *next_scope = { .local_start = next_local, .local_end = next_local };
  // TODO Check we didn't reach max 
  next_scope--;
}
void pop_scope()
{
  // Move the current local to the start.
  next_scope--;
  next_local = next_scope.local_start;
}
      
void push_local(Decl *decl)
{
  // TODO check we didn't reach max
  *next_local = decl;
  next_local++;
  next_scope[-1].local_end = next_local;
}
```

This solution isn't the simplest we could do, but it has some advantages knowing both the end and the beginning of the locals.
Doing a lookup we do a linear search back from the last local:

```
Decl *find_decl(const char *interned_name)
{
  Decl **current = next_local;
  while (current != &locals[0])
  {
    current--;
    if (current[0].name == interned_name) return current[0];
  }
  return NULL;
}
```

This might not seem super fast, but variables are often used near their definition and the number of locals are
usually fairly limited anyway.

Roughly this is what happens in this algorithm as it goes through the code above:

```
1. Push function scope

scope: [{ 0, 0 }]
decl: []

2. The param is added

scope: [{ 0, 1 }]
decl: [int y]

3. Push int x

scope: [{ 0, 2 }]
decl: [int y, int x]

4. Push "for" scope

scope: [{ 0, 2 }, { 2, 2 }]
decl: [int y, int x]

5. Push int i

scope: [{ 0, 2 }, { 2, 3 }]
decl: [int y, int x, int i]

6. Push "for body" scope

scope: [{ 0, 2 }, { 2, 3 }, { 3, 3 }]
decl: [int y, int x, int i]

7. Push int z

scope: [{ 0, 2 }, { 2, 3 }, { 3, 4 }]
decl: [int y, int x, int i, int z]

8. Pop "for body" scope

scope: [{ 0, 2 }, { 2, 3 }]
decl: [int y, int x, int i]

9. Pop "for" scope

scope: [{ 0, 2 }]
decl: [int y, int x]

10. Push int z

scope: [{ 0, 3 }]
decl: [int y, int x, int z]

11. Pop function scope

scope: []
decl: []
```

It's fairly straightforward to see how - after defining `z` - we can lookup `x` and `i` in step 7.

This model is simple and easy to understand – but we skipped something, didn't we? Yes, the lookup of the function `foo`.
In this scheme, anything not found in the locals, will then first look through the current file, then the module and then
finally any imports. (This is not how C works, but that is because in C everything is just a single flat file in the end,
so we just "look through" the file).

### Macros

So far so good, and if this was all we had, the story would end here. But there's an added complexity. What if we have macros?

Here is a simple example:

```
macro int testmacro(int x)
{
  int z = 2;
  for (int i = 0; i < x; i++)
  {
    z *= 2;
  }
  return z;
}     

fn int test(int y)
{
  int z = getValue(y);
  int x = @testmacro(z);
  return z + x;
}
```

*Assuming we want hygienic macros* we cannot simply copy the macro into the function, names and all:

```
// Broken version
fn int test(int y)
{
  int z = getValue(y);
  int x = z;
  int z = 2;
  for (int i = 0; i < x; i++)
  {
    z *= 2;
  }
  int _macro_result = z;
  int x = _macro_result;
  return z + x;
}
```

In C3 there is an expression block, working similar to a statement expression in GCC C. If this was used together with
allowing shadowing, we'd get something that halfway worked:

```
// Works but...
fn int test(int y)
{
  int z = getValue(y);
  int x = {|
    int x = z;
    int z = 2;
    for (int i = 0; i < x; i++)
    {
      z *= 2;
    }
    return z;
  |};
  return z + x;
}
```

This seems to work, but what if we wrote this incorrect macro:

```
macro testmacro(int x)
{
  return y * x;
}
```

If we fold that:

```
fn int test(int y)
{
  int z = getValue(y);
  int x = {|
    int x = z;
    return y * x;
  |};
  return z + x;
}
```

So now `y` is leaking into the macro, which is implicitly capturing `y`. This is not what we want (and as we'll
see later this is just the tip of the iceberg).

[Next](https://c3.handmade.network/blog/p/8272-fixing_lexical_scopes..._badly) I'll show a way to extend our simple scope system to make sure that the macros are indeed hygenic, and show other things that breaks.