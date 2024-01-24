---
title: Inline Assembly
description: Inline Assembly
sidebar:
    order: 132
---

C3 provides two ways to insert inline assembly: asm strings and asm blocks. 

## Asm strings

This form takes a single compile time string and passes it directly to the underlying
backend without any changes.

    int x = 0;
    asm("nop");
    int y = x;

## Asm block

Asm blocks uses a common grammar for all types of processors. It assumes that
all assembly statements can be reduced to the format:

    instruction (arg (',' arg)*)?;
    
Where an arg is:

1. An identifier, e.g. `FOO`, `x`.
2. A numeric constant `1` `0xFF` etc.
3. A register name (always lower case with a '$' prefix) e.g. `$eax` `$r7`.
4. The address of a variable e.g. `&x`.
5. An indirect address: `[addr]` or `[addr + index * <const> + offset]`.
6. Any expression inside of "()" (will be evaluated before entering the `asm` block).
 
An example:

    int aa = 3;
    int g;
    int* gp = &g;
    int* xa = &a;
    usz asf = 1;
    asm
    {
	    movl x, 4;                  // Move 4 into the variable x
	    movl [gp], x;               // Move the value of x into the address in gp
	    movl x, 1;                  // Move 1 into x
	    movl [xa + asf * 4 + 4], x; // Move x into the address at xa[asf + 1]
	    movl $eax, (23 + x);        // Move 23 + x into EAX
	    movl x, $eax;               // Move EAX into x
        movq [&z], 33;              // Move 33 into the memory address of z
    }

The asm block will infer register clobbers and in/out parameters.

*\*Please note that the current state of inline asm is a __work in progress__,
only a subset of x86 and aarch64 instructions are available, other platforms
have no support at all. It is likely that the grammar will be extended as more 
architectures are supported. More instructions can be added as they are needed,
so please file issues when you encounter missing instructions you need.*