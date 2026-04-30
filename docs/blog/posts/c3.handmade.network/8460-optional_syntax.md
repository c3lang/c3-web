---
title: "Optional syntax"
date: 2022-07-17
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8460-optional_syntax](https://c3.handmade.network/blog/p/8460-optional_syntax)*

In C3 optionals are built into the language. They're not the run of the mill optionals as they carry a "optional result value". This makes them more like "Result" types than optionals.

In C3 you declare a variable holding an optional using the `!` suffix:

```
int! x = ...
```

We can now assign either to the real value, or to the optional result:

```
int! x = 1; // x is a real value
x = MyRes.MISSING!; // x is assigned an optional
// x = MyRes.MISSING; <- Error: cannot assign "MyRes" to int
```

If we think of it in terms of a "Result":

```
Result<int> x;
x.result = 1; // x = 1
x.error = MyRes.ERR; // x = MyRes.ERR!
x.result = MyRes.ERR; // x = MyRes.ERR - fails
```

So the "clever" `!` suffix here is used to assign to the "error" part of the Result. Unfortunately, the suffix is hard to read at the end of a line, where `!` and `;` often blurs together. For that reason I regularly try to revisit this syntax to see if I can improve on it.

It's used in two cases:

1. assignment: `x = MyRes.ERR!`
2. return: `return MyRes.ERR!`

While (2) could be replaced by something like `return! MyRes.ERR` or even `raise MyRes.ERR`, the assignment is not as easily tackled.

Naive ideas could be to use some symbol salad like:

```
int! x !!= MyRes.MISSING;
int! x <!= MyRes.MISSING;
int! x <- MyRes.MISSING;
// I'm going to exclude
// int! x := MyRes.MISSING
// as it is used as regular assign in most languages.
```

Or we could allow those return statements to have a different meaning in an assignment:

```
int! x = raise MyRes.MISSING;
int! x = return! MyRes.MISSING;
```

While it's possible, it creates an odd effect if we consider this example:

```
int! x;
return x = return! MyRes.MISSING;
```

This should also illustrate that using `x = MyRes.MISSING!` should be thought of as implicitly doing `x = { 0, MyRes.MISSING }`.

Understanding that we see how it works:

```
x = MyRes.MISSING!; // x = { 0, MyRes.MISSING }
return MyRes.MISSING!; // return { 0, MyRes.MISSING }
```

So really the proper way would be to always translate the `!`, like this:

```
x = fault MyRes.ERR;
return fault MyRes.ERR;
```

Which is a mouthful. One could of course contract that `return fault` into something like:

```
x = fault MyRes.ERR;
throw MyRes.ERR;
```

Unfortunately, this builds the assumption that a `return` may not return an optional, which it of course can:

```
int! x = ...
return x; // Optional, so it may be like a "throw" or not
```

If we want to be super clear we can do something like this:

```
int! x = ...
if (y) return? x; // Might return an optional
if (z) return! MyRes.MISSING; // Will return an optional.
if (w) return w; // Will not return an optional
```

Due to the `?` being a rethrow, we could require this:

```
int! x = ...
if (y) return x?; // Use rethrow to make the type int
if (z) return! MyRes.MISSING; // Will return an optional.
if (w) return w; // Will not return an optional
```

So the question here is if this adds anything over the original:

```
int! x = ...
if (y) return x;
if (z) return MyRes.MISSING!; 
if (w) return w;
```

These are questions that need quite a bit of C3 error handling code to decide, so for now things have to stay as they are.

## Comments


---
### Comment by Christoffer Lernö

In C3 optionals are built into the language. They're not the run of the mill optionals as they carry a "optional result value". This makes them more like "Result" types than optionals.

In C3 you declare a variable holding an optional using the `!` suffix:

```
int! x = ...
```

We can now assign either to the real value, or to the optional result:

```
int! x = 1; // x is a real value
x = MyRes.MISSING!; // x is assigned an optional
// x = MyRes.MISSING; <- Error: cannot assign "MyRes" to int
```

If we think of it in terms of a "Result":

```
Result<int> x;
x.result = 1; // x = 1
x.error = MyRes.ERR; // x = MyRes.ERR!
x.result = MyRes.ERR; // x = MyRes.ERR - fails
```

So the "clever" `!` suffix here is used to assign to the "error" part of the Result. Unfortunately, the suffix is hard to read at the end of a line, where `!` and `;` often blurs together. For that reason I regularly try to revisit this syntax to see if I can improve on it.

It's used in two cases:

1. assignment: `x = MyRes.ERR!`
2. return: `return MyRes.ERR!`

While (2) could be replaced by something like `return! MyRes.ERR` or even `raise MyRes.ERR`, the assignment is not as easily tackled.

Naive ideas could be to use some symbol salad like:

```
int! x !!= MyRes.MISSING;
int! x <!= MyRes.MISSING;
int! x <- MyRes.MISSING;
// I'm going to exclude
// int! x := MyRes.MISSING
// as it is used as regular assign in most languages.
```

Or we could allow those return statements to have a different meaning in an assignment:

```
int! x = raise MyRes.MISSING;
int! x = return! MyRes.MISSING;
```

While it's possible, it creates an odd effect if we consider this example:

```
int! x;
return x = return! MyRes.MISSING;
```

This should also illustrate that using `x = MyRes.MISSING!` should be thought of as implicitly doing `x = { 0, MyRes.MISSING }`.

Understanding that we see how it works:

```
x = MyRes.MISSING!; // x = { 0, MyRes.MISSING }
return MyRes.MISSING!; // return { 0, MyRes.MISSING }
```

So really the proper way would be to always translate the `!`, like this:

```
x = fault MyRes.ERR;
return fault MyRes.ERR;
```

Which is a mouthful. One could of course contract that `return fault` into something like:

```
x = fault MyRes.ERR;
throw MyRes.ERR;
```

Unfortunately, this builds the assumption that a `return` may not return an optional, which it of course can:

```
int! x = ...
return x; // Optional, so it may be like a "throw" or not
```

If we want to be super clear we can do something like this:

```
int! x = ...
if (y) return? x; // Might return an optional
if (z) return! MyRes.MISSING; // Will return an optional.
if (w) return w; // Will not return an optional
```

Due to the `?` being a rethrow, we could require this:

```
int! x = ...
if (y) return x?; // Use rethrow to make the type int
if (z) return! MyRes.MISSING; // Will return an optional.
if (w) return w; // Will not return an optional
```

So the question here is if this adds anything over the original:

```
int! x = ...
if (y) return x;
if (z) return MyRes.MISSING!; 
if (w) return w;
```

These are questions that need quite a bit of C3 error handling code to decide, so for now things have to stay as they are.