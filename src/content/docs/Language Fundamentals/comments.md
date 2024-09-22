---
title: Comments & Documentation
description: Comments & Documentation
sidebar:
    order: 40
---
C3 uses three distinct comment types:

1. The normal `//` single line comment.
2. The classic `/* ... */` multi-line C style comment, but unlike in C they are allowed to nest.
3. Documentation comments `/** ... **/` the text within these comments will be parsed as documentation and optional [Contracts](/language-common/contracts/) on the following code.

## Doc Comments

Documentation comments start with `/**` and must be terminated using `*/`. Note that any number of `*` may follow `/**` and any number of stars may preceed `*/`. Any space and `*` in the beginning of each line will be ignored.

For example:

```c3
/**
 * Here are some docs.
 * @param foo `The number of foos.`
 * @required foo > 4 
 * @deprecated
 * @mycustom 2
 **/
void bar(int foo)
{
    io::printf("%d", foo);
}
```
 
### Doc Comments Are Parsed
The following was extracted:
- The function description: *"Here are some docs."*
- The `foo` parameter has the description: *"The number of foos"*.
- A [Contract](/language-common/contracts/) annotation for the compiler: `@required foo > 4` which tells the compiler and a user of the function that a precondition is that `foo` must be greater than 4.
- A function [Attribute](/language-common/attributes/) marking it as `@deprecated`, which displays warnings.
- A custom function [Attribute](/language-common/attributes/) `@mycustom`. The compiler is free to silently ignore custom Attributes, they can be used to optionally emit warnings, but are otherwise ignored.

### Available annotations

| Name        |                               format |
|-------------|-------------------------------------:|
| @param      |       `@param <param> <description>` |
| @return     |              `@return <description>` |
| @return!    |   `@return! <fault1>, <fault2>, ...` |
| @deprecated | `@deprecated <optional description>` |
| @require    |     `@require <expr1>, <expr2>, ...` |
| @ensure     |     `@ensure <expre1>, <expr2>, ...` |
| @pure       |                              `@pure` |
    
See [Contracts](/language-common/contracts/) for information regarding `@require`, `@ensure`, `@const`, `@pure`, `@checked`.
