---
title: "The downsides of compile time evaluation"
date: 2022-11-20
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8590-the_downsides_of_compile_time_evaluation](https://c3.handmade.network/blog/p/8590-the_downsides_of_compile_time_evaluation)*

Macros and compile time evaluation are popular ways to extend a language. While macros
fell out of favour by the time Java was created, they've returned to the mainstream
in Nim and Rust. Zig has compile time and JAI has both compile time execution and macros.

At one point in time I was assuming that the more power macros and compile time execution provided the better. I'll try to break down why I don't think so anymore.

## Code with meta programming are hard to read

Macros and compile time form a set of meta programming tools, and in general meta programming has very strong downsides in terms of maintaining and refactoring code. To understand code with meta programming you have to first resolve the meta program in your head, and not until you do so you can think about the runtime code. This is exponentially harder than reading normal code.

## Bye bye, refactoring tools

It's not just you as a programmer that need to resolve the meta programming – any refactoring tool would need to do the same in order to safely do refactorings – even simple ones as variable name changes.

And if the name is created through some meta code, the refactoring tool would basically need to reprogram your meta program to be correct, which is unreasonably complex. This is why everything from preprocessing macros to reflection code simply won't refactor correctly with tools.

## Making it worse: arbitrary type creation

Some languages allow that arbitrary types are created at compile time. Now the IDE can't even know how types look unless it runs the meta code. If the meta code is arbitrarily complex, so will the IDE need to be in order to "understand" the code. While the meta programming evalution might be nicely ordered when running the compiler, a responsive IDE will try to iteratively compile source files. This means the IDE will need to compile more code to get the correct ordering.

## Code and meta code living together.

Many languages try to make the code and meta code look very similar. This leads to lots of potential confusion. Is `a` a compile time variable (and thus may change during compilation, and any expression containing it might be compile time resolved) or is it a real variable?

Here's some code, how easy is it to identify the meta code?

```
fn performFn(comptime prefix_char: u8, start_value: i32) i32  {
    var result: i32 = start_value;
    comptime var i = 0;
    inline while (i < cmd_fns.len) : (i += 1) {
        if (cmd_fns[i].name[0] == prefix_char) {
            result = cmd_fns[i].func(result);
        }
    } 
    return result;
}
```

I've tried to make it easier in C3 by not mixing meta and runtime code syntax. This is similar
how macros in C are encouraged to be all upper case to avoid confusion:

```
macro int performFn(char $prefix_char, int start_value)
{
    int result = start_value;
    // Prefix $ all compile time vars and statements
    $for (var $i = 0; $i < CMD_FNS.len, $i++):
        $if (CMD_FNS[$i].name[0] == $prefix_char):
            result = CMD_FNS[$i].func(result);
        $endif;   
    $endfor;   
    return result;
}
```

The intention with the C3 separate syntax is that the approximate runtime code can be found by removing all rows starting with `$`:

```
macro int performFn(char $prefix_char, int start_value)
{
    int result = start_value;


            result = CMD_FNS[$i].func(result);


    return result;
}
```

Not elegant, but the intention is to maximize readability. In particular, look at the
"if/$if" statement. In the top example you can only infer that it is compile time evaluated and folded by looking at i and prefix\_char definitions. In the C3 example, the `$if` itself guarantees the contant folding and will return an error if the boolean expression inside of () isn't compile time folded.

## Extending syntax for the win?

A popular use for macros is for extending syntax, but this often goes wrong. Even if you have a language with a macro system that is doing this well, what does it mean? It means that suddenly you can't look at something like `foo(x)` and be able to make assumptions about it. In C without macros we can make the assumption that neither x nor other local variables will not changed (unless they have been passed by reference to some function prior to this), and the code will resume running after the `foo` call (except if setjmp/longjmp is used). With C++ we can asume less, since foo may throw an exception, and x might implicitly be passed by reference.

The more powerful the macro system the less we can assume. Maybe it's pulling variables from the calling scope and changing them? Maybe it's returning from the current context? Maybe it's formatting the drive? Who knows. You need to know the exact definition or you can't read the local code and this undermines the idea of most languages.

Because in a typical language you will what "breaks the rules": all the built in statements like `if`, `for` and `return`. Then there is a way to extend the language that follows certain rules: functions and types. This forms the common language understood by a developer to be what "knowing a language is about": you know the syntax and semantics of the built-in statements.

If the language extends its syntax, then every code base becomes a DSL which you have to learn from scratch. This is similar to having to buy into some huge framework in the JS/Java-space, just worse.

The point is that while we're always extending the syntax of the language, doing this through certain limited mechanisms like functions works well, but the more unbounded the extension mechanisms the harder the code will be to read and understand.

## When meta programming is needed

In some cases meta programming can make code more readable. If the problem is something like having a pre-calculated list for fast calculations or types defined from a protocol, then code generation can often solve the problem. Languages can improve this by better compiler support for triggering
codegen.

In other cases the meta programming can be replaced by running code at startup. Having "static init" like Java `static` blocks can help for cases when libraries need to do initialization.

If none of those options work, there is always copy-paste.

## Summary

So to summarize:

* Code with meta programming is hard to read (so minimize and support readability).
* Meta programming is hard to refactor (so adopt a subset that can work with IDEs).
* Arbitrary type creation is hard for tools (so restrict it to generics).
* Same syntax is bad (so make meta code distinct).
* Extending syntax with macros is bad (so don't do it).
* Codegen and init at runtime can replace some use of compile time.

Macros and compile time can be made extremely powerful, but this power is tempered by the huge drawbacks, good macros are not what you can do with them, but if it manages to balance readability with necessary features.

## Comments


---
### Comment by Christoffer Lernö

Macros and compile time evaluation are popular ways to extend a language. While macros
fell out of favour by the time Java was created, they've returned to the mainstream
in Nim and Rust. Zig has compile time and JAI has both compile time execution and macros.

At one point in time I was assuming that the more power macros and compile time execution provided the better. I'll try to break down why I don't think so anymore.

## Code with meta programming are hard to read

Macros and compile time form a set of meta programming tools, and in general meta programming has very strong downsides in terms of maintaining and refactoring code. To understand code with meta programming you have to first resolve the meta program in your head, and not until you do so you can think about the runtime code. This is exponentially harder than reading normal code.

## Bye bye, refactoring tools

It's not just you as a programmer that need to resolve the meta programming – any refactoring tool would need to do the same in order to safely do refactorings – even simple ones as variable name changes.

And if the name is created through some meta code, the refactoring tool would basically need to reprogram your meta program to be correct, which is unreasonably complex. This is why everything from preprocessing macros to reflection code simply won't refactor correctly with tools.

## Making it worse: arbitrary type creation

Some languages allow that arbitrary types are created at compile time. Now the IDE can't even know how types look unless it runs the meta code. If the meta code is arbitrarily complex, so will the IDE need to be in order to "understand" the code. While the meta programming evalution might be nicely ordered when running the compiler, a responsive IDE will try to iteratively compile source files. This means the IDE will need to compile more code to get the correct ordering.

## Code and meta code living together.

Many languages try to make the code and meta code look very similar. This leads to lots of potential confusion. Is `a` a compile time variable (and thus may change during compilation, and any expression containing it might be compile time resolved) or is it a real variable?

Here's some code, how easy is it to identify the meta code?

```
fn performFn(comptime prefix_char: u8, start_value: i32) i32  {
    var result: i32 = start_value;
    comptime var i = 0;
    inline while (i < cmd_fns.len) : (i += 1) {
        if (cmd_fns[i].name[0] == prefix_char) {
            result = cmd_fns[i].func(result);
        }
    } 
    return result;
}
```

I've tried to make it easier in C3 by not mixing meta and runtime code syntax. This is similar
how macros in C are encouraged to be all upper case to avoid confusion:

```
macro int performFn(char $prefix_char, int start_value)
{
    int result = start_value;
    // Prefix $ all compile time vars and statements
    $for (var $i = 0; $i < CMD_FNS.len, $i++):
        $if (CMD_FNS[$i].name[0] == $prefix_char):
            result = CMD_FNS[$i].func(result);
        $endif;   
    $endfor;   
    return result;
}
```

The intention with the C3 separate syntax is that the approximate runtime code can be found by removing all rows starting with `$`:

```
macro int performFn(char $prefix_char, int start_value)
{
    int result = start_value;


            result = CMD_FNS[$i].func(result);


    return result;
}
```

Not elegant, but the intention is to maximize readability. In particular, look at the
"if/$if" statement. In the top example you can only infer that it is compile time evaluated and folded by looking at i and prefix\_char definitions. In the C3 example, the `$if` itself guarantees the contant folding and will return an error if the boolean expression inside of () isn't compile time folded.

## Extending syntax for the win?

A popular use for macros is for extending syntax, but this often goes wrong. Even if you have a language with a macro system that is doing this well, what does it mean? It means that suddenly you can't look at something like `foo(x)` and be able to make assumptions about it. In C without macros we can make the assumption that neither x nor other local variables will not changed (unless they have been passed by reference to some function prior to this), and the code will resume running after the `foo` call (except if setjmp/longjmp is used). With C++ we can asume less, since foo may throw an exception, and x might implicitly be passed by reference.

The more powerful the macro system the less we can assume. Maybe it's pulling variables from the calling scope and changing them? Maybe it's returning from the current context? Maybe it's formatting the drive? Who knows. You need to know the exact definition or you can't read the local code and this undermines the idea of most languages.

Because in a typical language you will what "breaks the rules": all the built in statements like `if`, `for` and `return`. Then there is a way to extend the language that follows certain rules: functions and types. This forms the common language understood by a developer to be what "knowing a language is about": you know the syntax and semantics of the built-in statements.

If the language extends its syntax, then every code base becomes a DSL which you have to learn from scratch. This is similar to having to buy into some huge framework in the JS/Java-space, just worse.

The point is that while we're always extending the syntax of the language, doing this through certain limited mechanisms like functions works well, but the more unbounded the extension mechanisms the harder the code will be to read and understand.

## When meta programming is needed

In some cases meta programming can make code more readable. If the problem is something like having a pre-calculated list for fast calculations or types defined from a protocol, then code generation can often solve the problem. Languages can improve this by better compiler support for triggering
codegen.

In other cases the meta programming can be replaced by running code at startup. Having "static init" like Java `static` blocks can help for cases when libraries need to do initialization.

If none of those options work, there is always copy-paste.

## Summary

So to summarize:

* Code with meta programming is hard to read (so minimize and support readability).
* Meta programming is hard to refactor (so adopt a subset that can work with IDEs).
* Arbitrary type creation is hard for tools (so restrict it to generics).
* Same syntax is bad (so make meta code distinct).
* Extending syntax with macros is bad (so don't do it).
* Codegen and init at runtime can replace some use of compile time.

Macros and compile time can be made extremely powerful, but this power is tempered by the huge drawbacks, good macros are not what you can do with them, but if it manages to balance readability with necessary features.

---
### Comment by Christoffer Lernö

Having macro meta syntax that is different from the regular syntax helps, but whenever compile time and runtime code mix, the readability goes down. Trying to keep two sets of states in your head at the same time is not trivial and affects code reading.

If you do plain code generation with a code generator (and actually produce a final source file), you have less restrictions on the how you express this code generation as opposed to having code generation in the same code you're running the code in.

If you run code at startup, rather than run it during compile time you will have an easier time understanding it and inspecting what it produces.

And so on.

Using compile time evaluation for these things is creating a very generic in-language tool, and such tools will by necessity be less easy to work with than a specialized tool (such as a custom code generator). These drawbacks need to be taken into account and be balanced against advantages.