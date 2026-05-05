---
title: "C3: Handling casts and overflows part 1"
date: 2021-03-01
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/7656-c3__handling_casts_and_overflows_part_1](https://c3.handmade.network/blog/p/7656-c3__handling_casts_and_overflows_part_1)*

[Previously](https://c3.handmade.network/blogs/p/7651-overflow_trapping_in_practice#23988) I've been writing about various ways of handling integer overflows. The short summary is that the best you get will be some kind of trade off. I've discussed Go, Swift, Zig and Rust and looked at consequences of their particular choices.
  
  
At the time of writing, C3 has a Zig-like system with somewhat stronger left hand inference. That said, it exhibits mostly the same behaviour as Zig currently does.
  
  
In this article series I'm going to investigate a few solutions I considered for C3, but first I need to explain what triggered the investigation in the first place.
  
  
A common occurence is the following code:
  
  

```
uptrdiff a = getIndex();
int value = ptr[a - 1];
```

  
  
In C3, like in Go, Rust, Zig etc, the 1 in this expression is not concretely typed, so the type has to derive from somewhere. Unlike in Zig, which would derive the type from a, C3 prefers to push down the type, so in this case the preferred type is iptrdiff (coming from the array index), which is then what is pushed down into the operands. Unfortunately in this case it results in the operands having different signedness. Obviously here we would have preferred that in this particular case we would have found the type of 1 using the type of a. However, it might be that a = 0 in which case the unsigned number would underflow, which with trapping unsigned underflow would be an error. In this case therefore the correct thing would be to cast a to an iptrdiff if underflow is expected.
  
  
The situation becomes even more complex if the value is a variable:
  

```
uptrdiff a = getIndex();
ushort offset = getOffset();
int value = ptr[a - offset];
```

  
  
With implicit widening, this expression happily converts offset to uptrdiff (typically a 64 bit number), and then proceeds to completely break on a = 0, offset = 1. If ptr is a pointer, then a negative value might be completely reasonable (which is why indexing uses iptrdiff as default).
  
  
This demonstrates that there is no really optimal way through this. We can note that:
  

```
int value = ptr[cast(a - offset as iptrdiff)];
```

  
  
- does not fix anything, the trapping will happen before the conversion. We need the awkward:
  

```
int value = ptr[cast(a, iptrdiff) - cast(offset as iptrdiff)];
```

  
  
An unrelated, but also problematic behaviour is this:
  

```
char x = 16;
int y = x * x;
```

  
  
If we only use the operands to determine the type, then this will overflow as the "16 \* 16" would overflow the 8 bit char type. It was for this reason C3 had added bi-directional typing, pushing down the type into the operands, so that the expression would implicitly become:
  

```
int y = cast(x as int) * cast(x as int);
```

  
  
Unfortunately this works poorly with casts:
  

```
ichar s = -128;
uint z = cast(s * s as uint);
```

  
  
What does the above mean? If we do the conventional sign extension and then bitcast the result is a very large uint, which then overflows. If we try the conversion after performing the multiplication in 8 bits, that one will overflow.
  
  
There are more examples, but this should be enough to illustrate that trapping behaviour – and especially unsigned overflow – creates huge headaches when mixing types.
  
  

### To summarize

1. Bi-directional typing does not work well in a case like an ptr index, when one needs to pick unsigned or signed depending on the operands.
2. Overflow trapping creates problems when using the left hand side to infer widening.
3. Overflow trapping is likewise problematic when *not* using the left hand side and then doing implicit widening at assignment.

  
  

## Initial attempts

  
My initial attempts tried to introduce clever ways to push down both iptrdiff and uptrdiff to pick the best alternative. But the biggest problem in doing so lies not in the technical challenge, but in creating rules that is intuitive to the programmer. Eventually this led me to investigate other solutions.
  
  
Seeing how C# promotes int + uint to long, this inspired an idea to have some default int promotion and then promote using the left hand side up to a maximum integer type.
  
  
It's similar to the "Widen and narrow" strategy discussed in a previous article, but unlike that solution the maximum integer is typically the max register size. This meant that for most platforms common things like u64 = u64 + i32 would not work. – And remember that overflow would trap, so the trick in C that relies on 2s complement to emulate negative numbers for unsigned values simply would not work.
  
  
The second change was in how casts should behave: the idea was that inside of a cast, we would basically have only wrapping semantics to that particular size and it would not matter if this wrap is done late or early. Which is true for addition and subtraction, but not for division. For division cast(a / (x + y) as u32) is not the same as cast(a, u32) / (cast(x as u32) + cast(y as u32)). With limited integer types, the latter is the best we can implement, but this may run counter intuitive to what we would expect for cast or even an alternative wrap operator.
  
  
Although promising at the outset, these examples show that the model breaks down both with mixing integers and trying to replicate wrapping behaviour in a predictable way.
  
  
The [next blog post](https://c3.handmade.network/blogs/p/7661-c3__handling_casts_and_overflows_part_2#24018) will continue discussing solutions considered and their various advantages and drawbacks.

## Comments


---
### Comment by Christoffer Lernö

[Previously](https://c3.handmade.network/blogs/p/7651-overflow_trapping_in_practice#23988) I've been writing about various ways of handling integer overflows. The short summary is that the best you get will be some kind of trade off. I've discussed Go, Swift, Zig and Rust and looked at consequences of their particular choices.
  
  
At the time of writing, C3 has a Zig-like system with somewhat stronger left hand inference. That said, it exhibits mostly the same behaviour as Zig currently does.
  
  
In this article series I'm going to investigate a few solutions I considered for C3, but first I need to explain what triggered the investigation in the first place.
  
  
A common occurence is the following code:
  
  

```
uptrdiff a = getIndex();
int value = ptr[a - 1];
```

  
  
In C3, like in Go, Rust, Zig etc, the 1 in this expression is not concretely typed, so the type has to derive from somewhere. Unlike in Zig, which would derive the type from a, C3 prefers to push down the type, so in this case the preferred type is iptrdiff (coming from the array index), which is then what is pushed down into the operands. Unfortunately in this case it results in the operands having different signedness. Obviously here we would have preferred that in this particular case we would have found the type of 1 using the type of a. However, it might be that a = 0 in which case the unsigned number would underflow, which with trapping unsigned underflow would be an error. In this case therefore the correct thing would be to cast a to an iptrdiff if underflow is expected.
  
  
The situation becomes even more complex if the value is a variable:
  

```
uptrdiff a = getIndex();
ushort offset = getOffset();
int value = ptr[a - offset];
```

  
  
With implicit widening, this expression happily converts offset to uptrdiff (typically a 64 bit number), and then proceeds to completely break on a = 0, offset = 1. If ptr is a pointer, then a negative value might be completely reasonable (which is why indexing uses iptrdiff as default).
  
  
This demonstrates that there is no really optimal way through this. We can note that:
  

```
int value = ptr[cast(a - offset as iptrdiff)];
```

  
  
- does not fix anything, the trapping will happen before the conversion. We need the awkward:
  

```
int value = ptr[cast(a, iptrdiff) - cast(offset as iptrdiff)];
```

  
  
An unrelated, but also problematic behaviour is this:
  

```
char x = 16;
int y = x * x;
```

  
  
If we only use the operands to determine the type, then this will overflow as the "16 \* 16" would overflow the 8 bit char type. It was for this reason C3 had added bi-directional typing, pushing down the type into the operands, so that the expression would implicitly become:
  

```
int y = cast(x as int) * cast(x as int);
```

  
  
Unfortunately this works poorly with casts:
  

```
ichar s = -128;
uint z = cast(s * s as uint);
```

  
  
What does the above mean? If we do the conventional sign extension and then bitcast the result is a very large uint, which then overflows. If we try the conversion after performing the multiplication in 8 bits, that one will overflow.
  
  
There are more examples, but this should be enough to illustrate that trapping behaviour – and especially unsigned overflow – creates huge headaches when mixing types.
  
  

### To summarize

1. Bi-directional typing does not work well in a case like an ptr index, when one needs to pick unsigned or signed depending on the operands.
2. Overflow trapping creates problems when using the left hand side to infer widening.
3. Overflow trapping is likewise problematic when *not* using the left hand side and then doing implicit widening at assignment.

  
  

## Initial attempts

  
My initial attempts tried to introduce clever ways to push down both iptrdiff and uptrdiff to pick the best alternative. But the biggest problem in doing so lies not in the technical challenge, but in creating rules that is intuitive to the programmer. Eventually this led me to investigate other solutions.
  
  
Seeing how C# promotes int + uint to long, this inspired an idea to have some default int promotion and then promote using the left hand side up to a maximum integer type.
  
  
It's similar to the "Widen and narrow" strategy discussed in a previous article, but unlike that solution the maximum integer is typically the max register size. This meant that for most platforms common things like u64 = u64 + i32 would not work. – And remember that overflow would trap, so the trick in C that relies on 2s complement to emulate negative numbers for unsigned values simply would not work.
  
  
The second change was in how casts should behave: the idea was that inside of a cast, we would basically have only wrapping semantics to that particular size and it would not matter if this wrap is done late or early. Which is true for addition and subtraction, but not for division. For division cast(a / (x + y) as u32) is not the same as cast(a, u32) / (cast(x as u32) + cast(y as u32)). With limited integer types, the latter is the best we can implement, but this may run counter intuitive to what we would expect for cast or even an alternative wrap operator.
  
  
Although promising at the outset, these examples show that the model breaks down both with mixing integers and trying to replicate wrapping behaviour in a predictable way.
  
  
The [next blog post](https://c3.handmade.network/blogs/p/7661-c3__handling_casts_and_overflows_part_2#24018) will continue discussing solutions considered and their various advantages and drawbacks.