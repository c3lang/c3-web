---
title: "Handling parsing and semantic errors in a compiler"
date: 2023-01-15
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8632-handling_parsing_and_semantic_errors_in_a_compiler](https://c3.handmade.network/blog/p/8632-handling_parsing_and_semantic_errors_in_a_compiler)*

There was recently a [question on r/ProgrammingLanguages](https://www.reddit.com/r/ProgrammingLanguages/comments/10b9c3u/error_handling_roundup/) about error handling strategies in a compiler.

The more correct errors a compiler can produce, the better for a language where compile times are long. On the other hand false positives are not helping anyone.

In my case, the language compiles fast enough, so my focus has been to avoid false positives. I use the following rules:

1. Lexing errors: these are handed over to the parser creating parser errors.
2. Parsing errors: skip forward until there is some token it is possible to safely sync on.
3. Parser sync: some tokens will always be the start of a top level statement in my language: `struct`, `import`, `module`. Those are safe to use. For some other token types indentation can help: for example in C3 `fn` is a good sync token if it appears at zero indentation, but if it's found further in, it's likely part of a function type declaration: `define Foo = fn void();`. Only sync on tokens you are really sure of.
4. No semantic analysis for code that doesn't parse: code that doesn't parse are very unlikely to semantically analyse. Pessimistic parser sync means lots of valid code may get skipped, making semantic analysis fail even though the code might pass.
5. Use *poisoning* during semantic analysis. I saw this first described by Walter Bright, the creator of the D-Language. It is simple and incredibly effective in avoiding incorrect error reporting during semantic analysis. The algorithm is simply this: if an AST-node has an error, report it and mark it as poisoned. Then proceed to mark the parent of this AST-node poisoned as well, stopping any further analysis of the node (but without reporting any further errors).

I don't do anything particularly clever in regards to error reporting, but I found that these rules are sufficient to give very robust and correct error handling.

## Comments


---
### Comment by Christoffer Lernö

There was recently a [question on r/ProgrammingLanguages](https://www.reddit.com/r/ProgrammingLanguages/comments/10b9c3u/error_handling_roundup/) about error handling strategies in a compiler.

The more correct errors a compiler can produce, the better for a language where compile times are long. On the other hand false positives are not helping anyone.

In my case, the language compiles fast enough, so my focus has been to avoid false positives. I use the following rules:

1. Lexing errors: these are handed over to the parser creating parser errors.
2. Parsing errors: skip forward until there is some token it is possible to safely sync on.
3. Parser sync: some tokens will always be the start of a top level statement in my language: `struct`, `import`, `module`. Those are safe to use. For some other token types indentation can help: for example in C3 `fn` is a good sync token if it appears at zero indentation, but if it's found further in, it's likely part of a function type declaration: `define Foo = fn void();`. Only sync on tokens you are really sure of.
4. No semantic analysis for code that doesn't parse: code that doesn't parse are very unlikely to semantically analyse. Pessimistic parser sync means lots of valid code may get skipped, making semantic analysis fail even though the code might pass.
5. Use *poisoning* during semantic analysis. I saw this first described by Walter Bright, the creator of the D-Language. It is simple and incredibly effective in avoiding incorrect error reporting during semantic analysis. The algorithm is simply this: if an AST-node has an error, report it and mark it as poisoned. Then proceed to mark the parent of this AST-node poisoned as well, stopping any further analysis of the node (but without reporting any further errors).

I don't do anything particularly clever in regards to error reporting, but I found that these rules are sufficient to give very robust and correct error handling.