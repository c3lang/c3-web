---
title: Comments & Documentation
description: Comments & Documentation
sidebar:
    order: 40
---
C3 uses three distinct comment types:

1. The normal `//` line comment, which is terminated at the end of the line.
2. The classic `/* ... */` C style comment, but unlike in C they are allowed to nest.
3. Documentation comments `/** ... **/` the text within these comments will be parsed as documentation and optional contracts on the following code.

## Documentation

Documentation comments start with `/**` and must be terminated using `*/`. Note that any number of `*` may follow `/**` and any number of stars may preceed `*/`. Any space and `*` in the beginning of each line will be ignored.

Here is an example:

```
/**
 * Here are som docs.
 * @param foo The number of foos.
 * @required foo > 4 
 * @deprecated
 * @mycustom 2
 **/
void bar(int foo)
{
    io::printf("%d", foo);
}
```
 
In the example above, the following is parsed as description: *"Here are the docs."*, then there is a description associated with the `foo` parameter: *"The number of foos"*.

On top of that there are two annotations for the compiler: `@required foo > 4` which tells the compiler and a user of the function that a precondition is that `foo` must be greater than 4. It is also marked as @deprecated, which can be used to display warnings.

Finally, a custom annotation, "@mycustom" is added. The compiler is free to silently ignore such annotations, but can optionally emit warnings for them, it is otherwise ignored.
 
### Available annotations

| Name        |                               format |
|-------------|-------------------------------------:|
| @param      |       `@param <param> <description>` |
| @return     |              `@return <description>` |
| @return!    |   `@return! <fault1>, <fault2>, ...` |
| @fails      |               `@fails <description>` |
| @deprecated | `@deprecated <optional description>` |
| @require    |     `@require <expr1>, <expr2>, ...` |
| @ensure     |     `@ensure <expre1>, <expr2>, ...` |
| @pure       |                              `@pure` |
    
See [contracts](/references/docs/contracts) for information regarding `@require`, `@ensure`, `@const`, `@pure`, `@checked`.
