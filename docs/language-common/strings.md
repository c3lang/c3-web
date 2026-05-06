---
title: Strings
description: Strings
---
In C3, multiple string types are available, each suited to different use cases.

### `String`

```c3

typedef String = inline char[];

```
\
`String`s are usually the typical type to use, they can be sliced, compared etc ... \
It is possible to access the length of a `String` instance through the  ` .len  `  operator.


### `ZString`

```c3

typedef ZString = inline char*;
```


`ZString` is used when working with C code, which expects null-terminated C-style strings of type `char*`.
It is a `typedef` so converting to a `ZString` requires an explicit cast. This helps to remind the user to check there is appropriate `\0` termination of the string data.

The [`ZString` methods](#zstring-member-functions) are outlined below.

!!! caution
    Ensure the terminal `\0` when converting from `String` to `ZString`.

#### `WString`

```c3

typedef WString = inline Char16*;
```

\
The `WString` type is similar to `ZString` but uses `Char16*`, typically for UTF-16 encoded strings. This type is useful for applications where 16-bit character encoding is required.

#### `DString`

```c3

typedef DString (OutStream) = void*;
```

\
`DString` is a dynamic string builder that supports various string operations at runtime, allowing for flexible manipulation without the need for manual memory allocation.

