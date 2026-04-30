---
title: "C3: Handling casts and overflows part 2"
date: 2021-03-03
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/7661-c3__handling_casts_and_overflows_part_2](https://c3.handmade.network/blog/p/7661-c3__handling_casts_and_overflows_part_2)*

Continuing from our [previous article](https://c3.handmade.network/blogs/p/7656-c3__handling_casts_and_overflows_part_1#24006), let's look are some more possibilities and maybe find a solution.
  
  

## An even more ambitious widening strategy

  
The previous idea with both a maximum and minimum promotion type didn't pan out, but what if we went much further?
  
  
We use the idea of a *maxint* which is a signed-only integer type that is wider than the widest ordinary type. If i128 is supported natively on the target, then the *maxint* is i256, if the max normal int type is long (defined as 64 bits in C3), the *maxint* becomes an i128.
  
  
We also have a minimum arithmetic integer type, which is usually will be the exact same as the size of C's int. The algorithm is then as following:
  
  
1. Determine the type of the left hand side. This is the *target type*. If the target type is unsigned, promote it to the next power-of-two type. E.g. uint -> long.
  
2. Check the *leaf* operands (variables, integer literals, casts, functions). If they exceed the *target type* this is a compile time error.
  
3. Promote the operands to at least the minimum arithmetic integer type.
  
4. If the resulting type is more narrow than the *target type*, promote to the target type.
  
5. Trap all operations.
  
6. Trap the truncation of the right hand side down to the actual type of the left hand side.
  
  
Our u64 = u64 + i32 works now, it is implicitly converted to something like u64 = safeCastWithTrap(addWithTrap(cast(u64 as i128), cast(i32 as i128)), ulong).
  
  
So far so good, but something like u64 = u64 + u64 will also need i128. This adds a certain level of safety at a potential cost of performance, even though usually a compiler will optimize away the use of the extra 64 bits for simpler expressions.
  
  
This looks promising, but what about wrapping behaviour? We can use the wrapping operators to resolve this using both sides against each other, so that in the case of u64 = i32 +% i16this becomes u64 = safeCastWithTrap(addWrap(i32, cast(i16 as i32)). We prevent implicit unsigned and signed mixing without explicit cast if we cannot convert to either operand: i16 +% u32 would for example be an error.
  
  
We allow u32 = i32. This converts into u32 = safeCastWithTrap(i32, u32).
  
  

## Back to basics, no overflow trapping

  
Another venue of exploration is to simplify and go back to C. There are some simple changes one can make: implicit widening to use the left hand side, make signed integer overflow wrapping, require casts for mixed unsigned and signed arithmetics to make it more obvious.
  
  
We can allow implicit conversion if back from the automatically promoted type, so in the case of i16 = i16 + i16, using C arithmetic promotion rules the operands would for example to i32 before calculation. We can allow implicit truncation back in those cases, but perhaps require explicit casts in all other cases. So i16 = i16 + i32 would require some kind of cast. What simplifies things is that we only need a truncating cast here.
  
  
We can introduce trapping arithmetics as well as a trapping assign that requires both arguments already having the same type:
  
  

```
short x = 1;
char b = 16;
int y = 0x7FFF;
// x = x + y; // ERROR, must have explicit cast.
x = x + b;

// The following are not necessary but may be interesting:
x = b ~+ b; // This will trap in due to 16 * 16 > MAX_CHAR
// x = x ~+ b; // ERROR both operands must be the same
x ~= y + 1; // Will trap as the value would overflow
x ~= y; // Would work
```

  
  

## Some evaluation

  
  
Let us evaluate the different examples using some examples. Here are some code examples that contain vulnerabilities:
  
  

```
func void readpgm(char* name, Pixmap* p)
{
  /* ... */
  pnm_readpaminit(fp, &inpam);
  p.x = inpam.width;
  p.y = inpam.height;
  // Possible overflow
  if (!(p.p = malloc(p.x * p.y)))
  {
    @report("Error at malloc");
  }
  for (int i = 0; i < inpam.height; i++)
  {
    pnm_readpamrow(&inpam, tuplerow);
    for (int j = 0; j < inpam.width; j++)
    {
      // Possible overflow
      p.p[i * inpam.width + j] = sample;
    }
  }
}
```

  
  

```
func void getComm(uint len, char* src)
{
  uint size;
  // Underflow if len < 2
  size = len - 2;
  // Overflow if size = UINT_MAX
  char* comm = malloc(size + 1);
  memcpy(comm, src, size);
}
```

  
  

```
func uint* decode_fh(uint* p, SvcFh* fhp)
{
  int size;
  fh_init(fhp, NFS3_FHSIZE);
  size = ntohl(*p++);
  if (size > NFS3_FHSIZE) return NULL;
  // size may be < 0, this converts into a huge size
  memcpy(&fhp.fh_handle.fh_base, p, size);
  fhp.fh_handle.fh_size = size;
  return p + XDR_QUADLEN(size);
}
```

  
  
With those examples presented, let's see how they work out using the two strategies:
  
  
**The widening strategy**
  

```
func void readpgm(char* name, Pixmap* p)
{
  /* ... */
  pnm_readpaminit(fp, &inpam);
  p.x = inpam.width;
  p.y = inpam.height;
  // Will trap in debug:
  if (!(p.p = malloc(p.x * p.y)))
  {
    @report("Error at malloc");
  }
  for (int i = 0; i < inpam.height; i++)
  {
    pnm_readpamrow(&inpam, tuplerow);
    for (int j = 0; j < inpam.width; j++)
    {
      // Will trap in debug;
      p.p[i * inpam.width + j] = sample;
    }
  }
}
```

  
  

```
func void getComm(uint len, char* src)
{
  uint size;
  // Will trap in debug
  size = len - 2;
  char* comm = malloc(size + 1);
  memcpy(comm, src, size);
}
```

  
  

```
func uint* decode_fh(uint* p, SvcFh* fhp)
{
  int size;
  fh_init(fhp, NFS3_FHSIZE);
  size = ntohl(*p++);
  if (size > NFS3_FHSIZE) return null;
  // Will trap in debug
  memcpy(&fhp.fh_handle.fh_base, p, size);
  fhp.fh_handle.fh_size = size;
  return p + XDR_QUADLEN(size);
}
```

  
  
The widening strategy clearly works perfectly in these examples, all overflows are correctly trapped with zero need for additional annotations. It "just works".
  
  
**2s complement wrapping**
  
  

```
func void readpgm(char* name, Pixmap* p)
{
  /* ... */
  pnm_readpaminit(fp, &inpam);
  p.x = inpam.width;
  p.y = inpam.height;
  // Unchecked, except for negative values, 
  // use "p.p = malloc(convert(p.x ~* p.y as usize))"
  // to trap in both release and debug
  if (!(p.p = malloc(convert(p.x + p.y as usize))))
  {
    @report("Error at malloc");
  }
  for (int i = 0; i < inpam.height; i++)
  {
    pnm_readpamrow(&inpam, tuplerow);
    for (int j = 0; j < inpam.width; j++)
    {
      // Unchecked, use "i ~* inpam.width ~+ j"
      // to trap in both release and debug
      // but the problem lies in the earlier malloc check.
      p.p[i * inpam.width + j] = sample;
    }
  }
}
```

  
  
  

```
func void getComm(uint len, char* src)
{
  uint size;
  // Not checked, use
  // len ~- 2 to trap in both release and debug
  // but it is more natural to check this with
  // preconditions, e.g. assert(len >= 2)
  // So trapping is probably the wrong decision
  size = len - 2;
  char* comm = malloc(size + 1);
  memcpy(comm, src, size);
}
```

  
  

```
func uint* decode_fh(uint* p, SvcFh* fhp)
{
  int size;
  fh_init(fhp, NFS3_FHSIZE);
  size = ntohl(*p++);
  if (size > NFS3_FHSIZE) return null;
  // Here we are forced to convert
  // it's natural to use a trapping conversion
  // that protects in both release and debug
  memcpy(&fhp.fh_handle.fh_base, p, convert(size as usize));
  fhp.fh_handle.fh_size = size;
  return p + XDR_QUADLEN(size);
}
```

  
  
In these cases we see that the widening strategy has a very clear advantage in detecting errors. This is not surprising, since it's exactly what it's built for. On the other hand the explicit trapping operators give us stronger protection where it's used and the type model is so much simpler.
  
  
That last argument is the strongest in favour of "wrapping". Although we in *this* particular example manage to demonstrate that "widening" works, it introduces a lot of machinery to add the traps and there are enough implicit checks that we can't prove for sure that the behaviour isn't without problems. And yes u32 = u32 + i32 will make implicit checks for overflow, but maybe that should be checked *before* the assignment? The traps are very useful during testing, but they're no replacement for code that *correctly* checks arguments. In C3's case there is already support for *contracts* which catches many of the errors above as long as the function are properly *documented*, so unlike other languages it already has a somewhat higher level of security.
  
  

## Summary

  
I've presented two quite different models, each with its own advantages and disadvantages. Ultimately what decides what to use is not just the security concerns, but how well it fits with the language in general. Other features may interact in a surprising manner, so it's only after working with a model in practice one can see the real effects on the language as a whole.

## Comments


---
### Comment by Christoffer Lernö

Continuing from our [previous article](https://c3.handmade.network/blogs/p/7656-c3__handling_casts_and_overflows_part_1#24006), let's look are some more possibilities and maybe find a solution.
  
  

## An even more ambitious widening strategy

  
The previous idea with both a maximum and minimum promotion type didn't pan out, but what if we went much further?
  
  
We use the idea of a *maxint* which is a signed-only integer type that is wider than the widest ordinary type. If i128 is supported natively on the target, then the *maxint* is i256, if the max normal int type is long (defined as 64 bits in C3), the *maxint* becomes an i128.
  
  
We also have a minimum arithmetic integer type, which is usually will be the exact same as the size of C's int. The algorithm is then as following:
  
  
1. Determine the type of the left hand side. This is the *target type*. If the target type is unsigned, promote it to the next power-of-two type. E.g. uint -> long.
  
2. Check the *leaf* operands (variables, integer literals, casts, functions). If they exceed the *target type* this is a compile time error.
  
3. Promote the operands to at least the minimum arithmetic integer type.
  
4. If the resulting type is more narrow than the *target type*, promote to the target type.
  
5. Trap all operations.
  
6. Trap the truncation of the right hand side down to the actual type of the left hand side.
  
  
Our u64 = u64 + i32 works now, it is implicitly converted to something like u64 = safeCastWithTrap(addWithTrap(cast(u64 as i128), cast(i32 as i128)), ulong).
  
  
So far so good, but something like u64 = u64 + u64 will also need i128. This adds a certain level of safety at a potential cost of performance, even though usually a compiler will optimize away the use of the extra 64 bits for simpler expressions.
  
  
This looks promising, but what about wrapping behaviour? We can use the wrapping operators to resolve this using both sides against each other, so that in the case of u64 = i32 +% i16this becomes u64 = safeCastWithTrap(addWrap(i32, cast(i16 as i32)). We prevent implicit unsigned and signed mixing without explicit cast if we cannot convert to either operand: i16 +% u32 would for example be an error.
  
  
We allow u32 = i32. This converts into u32 = safeCastWithTrap(i32, u32).
  
  

## Back to basics, no overflow trapping

  
Another venue of exploration is to simplify and go back to C. There are some simple changes one can make: implicit widening to use the left hand side, make signed integer overflow wrapping, require casts for mixed unsigned and signed arithmetics to make it more obvious.
  
  
We can allow implicit conversion if back from the automatically promoted type, so in the case of i16 = i16 + i16, using C arithmetic promotion rules the operands would for example to i32 before calculation. We can allow implicit truncation back in those cases, but perhaps require explicit casts in all other cases. So i16 = i16 + i32 would require some kind of cast. What simplifies things is that we only need a truncating cast here.
  
  
We can introduce trapping arithmetics as well as a trapping assign that requires both arguments already having the same type:
  
  

```
short x = 1;
char b = 16;
int y = 0x7FFF;
// x = x + y; // ERROR, must have explicit cast.
x = x + b;

// The following are not necessary but may be interesting:
x = b ~+ b; // This will trap in due to 16 * 16 > MAX_CHAR
// x = x ~+ b; // ERROR both operands must be the same
x ~= y + 1; // Will trap as the value would overflow
x ~= y; // Would work
```

  
  

## Some evaluation

  
  
Let us evaluate the different examples using some examples. Here are some code examples that contain vulnerabilities:
  
  

```
func void readpgm(char* name, Pixmap* p)
{
  /* ... */
  pnm_readpaminit(fp, &inpam);
  p.x = inpam.width;
  p.y = inpam.height;
  // Possible overflow
  if (!(p.p = malloc(p.x * p.y)))
  {
    @report("Error at malloc");
  }
  for (int i = 0; i < inpam.height; i++)
  {
    pnm_readpamrow(&inpam, tuplerow);
    for (int j = 0; j < inpam.width; j++)
    {
      // Possible overflow
      p.p[i * inpam.width + j] = sample;
    }
  }
}
```

  
  

```
func void getComm(uint len, char* src)
{
  uint size;
  // Underflow if len < 2
  size = len - 2;
  // Overflow if size = UINT_MAX
  char* comm = malloc(size + 1);
  memcpy(comm, src, size);
}
```

  
  

```
func uint* decode_fh(uint* p, SvcFh* fhp)
{
  int size;
  fh_init(fhp, NFS3_FHSIZE);
  size = ntohl(*p++);
  if (size > NFS3_FHSIZE) return NULL;
  // size may be < 0, this converts into a huge size
  memcpy(&fhp.fh_handle.fh_base, p, size);
  fhp.fh_handle.fh_size = size;
  return p + XDR_QUADLEN(size);
}
```

  
  
With those examples presented, let's see how they work out using the two strategies:
  
  
**The widening strategy**
  

```
func void readpgm(char* name, Pixmap* p)
{
  /* ... */
  pnm_readpaminit(fp, &inpam);
  p.x = inpam.width;
  p.y = inpam.height;
  // Will trap in debug:
  if (!(p.p = malloc(p.x * p.y)))
  {
    @report("Error at malloc");
  }
  for (int i = 0; i < inpam.height; i++)
  {
    pnm_readpamrow(&inpam, tuplerow);
    for (int j = 0; j < inpam.width; j++)
    {
      // Will trap in debug;
      p.p[i * inpam.width + j] = sample;
    }
  }
}
```

  
  

```
func void getComm(uint len, char* src)
{
  uint size;
  // Will trap in debug
  size = len - 2;
  char* comm = malloc(size + 1);
  memcpy(comm, src, size);
}
```

  
  

```
func uint* decode_fh(uint* p, SvcFh* fhp)
{
  int size;
  fh_init(fhp, NFS3_FHSIZE);
  size = ntohl(*p++);
  if (size > NFS3_FHSIZE) return null;
  // Will trap in debug
  memcpy(&fhp.fh_handle.fh_base, p, size);
  fhp.fh_handle.fh_size = size;
  return p + XDR_QUADLEN(size);
}
```

  
  
The widening strategy clearly works perfectly in these examples, all overflows are correctly trapped with zero need for additional annotations. It "just works".
  
  
**2s complement wrapping**
  
  

```
func void readpgm(char* name, Pixmap* p)
{
  /* ... */
  pnm_readpaminit(fp, &inpam);
  p.x = inpam.width;
  p.y = inpam.height;
  // Unchecked, except for negative values, 
  // use "p.p = malloc(convert(p.x ~* p.y as usize))"
  // to trap in both release and debug
  if (!(p.p = malloc(convert(p.x + p.y as usize))))
  {
    @report("Error at malloc");
  }
  for (int i = 0; i < inpam.height; i++)
  {
    pnm_readpamrow(&inpam, tuplerow);
    for (int j = 0; j < inpam.width; j++)
    {
      // Unchecked, use "i ~* inpam.width ~+ j"
      // to trap in both release and debug
      // but the problem lies in the earlier malloc check.
      p.p[i * inpam.width + j] = sample;
    }
  }
}
```

  
  
  

```
func void getComm(uint len, char* src)
{
  uint size;
  // Not checked, use
  // len ~- 2 to trap in both release and debug
  // but it is more natural to check this with
  // preconditions, e.g. assert(len >= 2)
  // So trapping is probably the wrong decision
  size = len - 2;
  char* comm = malloc(size + 1);
  memcpy(comm, src, size);
}
```

  
  

```
func uint* decode_fh(uint* p, SvcFh* fhp)
{
  int size;
  fh_init(fhp, NFS3_FHSIZE);
  size = ntohl(*p++);
  if (size > NFS3_FHSIZE) return null;
  // Here we are forced to convert
  // it's natural to use a trapping conversion
  // that protects in both release and debug
  memcpy(&fhp.fh_handle.fh_base, p, convert(size as usize));
  fhp.fh_handle.fh_size = size;
  return p + XDR_QUADLEN(size);
}
```

  
  
In these cases we see that the widening strategy has a very clear advantage in detecting errors. This is not surprising, since it's exactly what it's built for. On the other hand the explicit trapping operators give us stronger protection where it's used and the type model is so much simpler.
  
  
That last argument is the strongest in favour of "wrapping". Although we in *this* particular example manage to demonstrate that "widening" works, it introduces a lot of machinery to add the traps and there are enough implicit checks that we can't prove for sure that the behaviour isn't without problems. And yes u32 = u32 + i32 will make implicit checks for overflow, but maybe that should be checked *before* the assignment? The traps are very useful during testing, but they're no replacement for code that *correctly* checks arguments. In C3's case there is already support for *contracts* which catches many of the errors above as long as the function are properly *documented*, so unlike other languages it already has a somewhat higher level of security.
  
  

## Summary

  
I've presented two quite different models, each with its own advantages and disadvantages. Ultimately what decides what to use is not just the security concerns, but how well it fits with the language in general. Other features may interact in a surprising manner, so it's only after working with a model in practice one can see the real effects on the language as a whole.