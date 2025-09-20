---
title: Comments & Documentation
description: Comments & Documentation
sidebar:
    order: 40
---
C3 has four distinct comment types:

1. The normal `//` single line comment.
2. The classic `/* ... */` multi-line C style comment, but unlike in C they are allowed to nest.
3. Documentation comments `<* ... *>` the text within these comments will be parsed as documentation and optional [Contracts](/language-common/contracts/) on the following code.
4. Shebang comment `#!`, which works like a single line comment, but is only valid as the first two characters in a file.

## Doc contracts

Documentation contracts start with `<*` and must be terminated using `*>`.
Any initial text up until the first `@`-directive on a new line will be interpreted as
free text documentation.

For example:

```c3
<*
 Here are some docs.
 @param num_foo `The number of foos.`
 @require num_foo > 4
 @deprecated
 @mycustom 2
*>
void bar(int num_foo)
{
    io::printfn("%d", num_foo);
}
```

### Doc Contracts Are Parsed
The following was extracted:
- The function description: *"Here are some docs."*
- The `num_foo` parameter has the description: *"The number of foos"*.
- A [Contract](/language-common/contracts/) annotation for the compiler: `@require num_foo > 4` which tells the compiler and a user of the function that a precondition is that `num_foo` must be greater than 4.
- A function [Attribute](/language-common/attributes/) marking it as `@deprecated`, which displays warnings.
- A custom function [Attribute](/language-common/attributes/) `@mycustom`. The compiler is free to silently ignore custom Attributes, they can be used to optionally emit warnings, but are otherwise ignored.

### Available annotations

| Name          |                                              format |
|---------------|----------------------------------------------------:|
| `@param     ` |         `@param [<ref>] <param> [ : <description>]` |
| `@return    ` |                             `@return <description>` |
| `@return?   ` | `@return? <fault1>, <fault2>, ..., [<description>]` |
| `@deprecated` |                       `@deprecated [<description>]` |
| `@require   ` |   `@require <expr1>, <expr2>, ..., [<description>]` |
| `@ensure    ` |   `@ensure <expre1>, <expr2>, ..., [<description>]` |
| `@pure      ` |                                             `@pure` |

See [Contracts](/language-common/contracts/) for information regarding `@require`, `@ensure`, `@const`, `@pure`, `@checked`.

\*`[<ref>]` is an optional mutability description e.g. `[&in]`
\*`[<description>]` denotes that a description is optional.
