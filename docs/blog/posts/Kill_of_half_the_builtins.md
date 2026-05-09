---
title: "Let's kill off half the builtins in 0.8.0"
date: 2026-05-09
author: "Christoffer Lernö"
search:
  exclude: true
---

### Goodbye $sizeof, $alignof and all the rest

#### The problem

From the beginning, C3 mirrored C in having a `sizeof` builtin, which would take an expression and return the size. This was extended with additional similar builtins that would take an expression and return some reflection information about it.

To avoid colliding with anything else, it would get the `-of` suffix, and in line with C3's "$ means compile-time", they were prefixed with `$`.

At some point this became an actual challenge for naming things. `$paramstructof` doesn't quite roll off the tongue.

#### The solution: `$reflect`

So starting from 0.8.0, all of those are removed in favour of using the new `$reflect` builtin containing all attributes. For example, our `$sizeof(a)` becomes `$reflect(a).size`. In general, `*of(a)` becomes `$reflect(a).*`.

This might seem onerous, but first of all this allows us to store the reflection data and pass it to macros: `some_macro($reflect(a))`. But it's also trivial to construct macros that do the same thing. For example, `@sizeof` and `@alignof` are new macros that act as drop-in replacements for the previous builtins.

In 0.7.x you would use things like `$defined($sizeof(x))` to test if something had a size defined. After the changes in 0.8.0, this becomes `$defined($reflect(x).size)` instead.

This change allows us to reduce the number of keywords and overall "language surface". Without explicit keywords, compile-time reflection actually becomes more flexible as well – it's easier to introduce additional introspection at some later time in the 0.8.x cycle if needed.

### Stripping types of their properties

#### The problem

Up to 0.7.x, the corresponding type properties (related to the expression reflection previously discussed) were accessed using dot notation, e.g. `int.sizeof`. This reflected the corresponding builtin: `int.sizeof` <=> `$sizeof(x)`, `int.alignof` <=> `$alignof(x)` and so on.

It would certainly have been nicer to use `int.size`, but properties would shadow method names:

```c3
struct Foo
{
    int len;
}

fn int Foo.size(self)
{
    return self.len;
}

fn void test()
{
    Foo f;
    Foo.size(f); // Valid C3    
}
```
So the `.*of` suffix was used exactly to avoid colliding with methods and field names.

However, as previously mentioned, naming with "-of" was increasingly a blocker. Could something be done?

#### The solution: `::` to the rescue

The `::` scope operator unequivocally separates module names from an identifier, and module names are always lower case. `mymodule::submodule::Bar` always means that everything left of the last `::` is a module.

But what if we allowed `Bar::baz`?

This had no meaning in C3, because "Bar" could never be a module name.

In fact, `int::size` could not match anything. So what if we made `::` the way to get type properties?

`int::size` now works, because the only thing that can appear to the right of a type name after `::` is a type property.

```c3
// 0.7.11
const INT_SIZE = int.sizeof;
const INT_ALIGNMENT = int.alignof;
const INT_MAX = int.max;
// 0.8.0
const INT_SIZE = int::size;
const INT_ALIGNMENT = int::alignment;
const INT_MAX = int::max;
```

So the change both allows dropping "-of", and make it more consistent – like in the `int.max` case.

### The big $vaarg reduction

#### The problem

The final big removal in C3 is the elimination of `$vaexpr`, `$vacount`, `$vaconst`, `$vatype` and `$vasplat`.

These builtins helped support macro "raw" vaargs. `$vaexpr` would paste in a vaarg as if it was declared like `#foo`, `$vaconst` like `$foo` and `$vatype` like `$Foo`.

Unfortunately, most of these were sparsely used.

`$vasplat` did splat the arguments, perfectly forwarding them into an initializer or another call.

However, `$vasplat` was conceived well before most of the `...` splat functionality was in the compiler. In fact, it could be considered the precursor of most of the splat code.

The fact that it looked so very different from regular splats seemed unnecessary.

And `$vacount`? A keyword just to get the number of vaargs available?

#### The solution: one $vaarg to rule them all

While `$vaarg` did an adequate job to try to ensure that the expression was only evaluated once, the raw vaargs for macros largely behaved like lazy expression parameters ("#foo"). It was also always possible to recreate types and constants from `$vaexpr` as needed.

So if we just had `$vaexpr`, almost all functionality would still be available!

Since we already have `...` for splat and `.len` to get length, we could derive everything from a single value. We renamed `$vaexpr` and called it `$vaarg`:

```c3
// 0.7.11
$for var $i = 0; $i < $vacount; $i += 2:
    self.set($vaarg[$i], $vaarg[$i + 1]);
$endfor

call_log(CRITICAL, category, fmt, $vasplat);

// 0.8.0
$for var $i = 0; $i < $vaarg.len; $i += 2:
	self.set($vaarg[$i], $vaarg[$i + 1]);
$endfor

call_log(CRITICAL, category, fmt, ...$vaarg);
```

### Final thoughts

There is a natural contract-expand cycle to language design: first add features, then learn how they're used and how they can be simplified for the actual real use cases.

The builtins we're removing solved real problems, but they also added surface area: extra keywords, naming conventions, subtle interactions. 

These simplifications were only possible now, after things like maturing the splat functionality, observing `$vaarg` usage-patterns and reaching the point where the old type property syntax prevented growth. 

We hope you'll like them!