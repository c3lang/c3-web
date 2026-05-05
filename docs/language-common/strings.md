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
`String`s are usually the typical type to use, they can be sliced , compared etc ... \
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

## Member functions:

### `String` Member Functions

```c3
fn Char16[]? String.to_new_utf16(s, Allocator allocator = mem)
```

```c3
fn Char16[]? String.to_temp_utf16(s);
```

```c3
fn WString? String.to_wstring(s, Allocator allocator)
```

```c3
fn String String.free(&s, Allocator allocator = mem)
```

```c3
fn String String.tcopy(s) => s.copy(tmem) @inline;
```

```c3
fn String String.copy(s, Allocator allocator = mem)
```

```c3
fn String String.strip_end(string, String needle);
```

```c3
fn String String.strip(string, String needle);
```

```c3
fn String String.trim(string, String to_trim);
```

```c3
fn bool String.contains(string, String needle);
```

```c3
fn bool String.starts_with(string, String needle);
```

```c3
fn bool String.ends_with(string, String needle);
```
```c3
fn usz? String.index_of_char(s, char needle);
```

```c3
fn usz? String.index_of_char_from(s, char needle, usz start_index);
```

```c3
fn usz? String.index_of(s, String needle)
```

```c3
fn usz? String.rindex_of(s, String needle)
```

```c3
fn String[] String.split(s, String needle, usz max = 0, Allocator allocator = mem);
```

```c3
fn String String.new_split(s, String needle, usz max = 0) => s.split(needle, max, mem) @inline;
```

```c3
// temporary String split
fn String String.tsplit(s, String needle, usz max = 0) => s.split(needle, max, tmem);
```

```c3
fn String String.tconcat(s1, String s2);
```

```c3
fn String String.tconcat(s1, String s2) => s1.concat(s2, tmem);
```
```c3
fn WString? String.to_temp_wstring(s) => s.to_wstring(tmem);
```
```c3
fn WString? String.to_new_wstring(s) => s.to_wstring(mem);
```
```c3
fn int128? String.to_int128(s, int base = 10) => s.to_integer(int128, base);
```
```c3
fn long? String.to_long(s, int base = 10) => s.to_integer(long, base);
```
```c3
fn int? String.to_int(s, int base = 10) => s.to_integer(int, base);
```
```c3
fn short? String.to_short(s, int base = 10) => s.to_integer(short, base);
```
```c3
fn ichar? String.to_ichar(s, int base = 10) => s.to_integer(ichar, base);
```
```c3
fn uint128? String.to_uint128(s, int base = 10) => s.to_integer(uint128, base);
```
```c3
fn ulong? String.to_ulong(s, int base = 10) => s.to_integer(ulong, base);
```
```c3
fn uint? String.to_uint(s, int base = 10) => s.to_integer(uint, base);
```
```c3
fn ushort? String.to_ushort(s, int base = 10) => s.to_integer(ushort, base);
```
```c3
fn char? String.to_uchar(s, int base = 10) => s.to_integer(char, base);
```
```c3
fn double? String.to_double(s) => s.to_real(double);
```
```c3
fn float? String.to_float(s) => s.to_real(float);
```
```c3
fn String String.new_ascii_to_upper(s, Allocator allocator = mem);
```

```c3
fn Char16[]? String.to_new_utf16(s, Allocator allocator = mem);
```

```c3
fn Char16[]? String.to_temp_utf16(s);
```

```c3
fn Char32[]? String.to_utf32(s, Allocator allocator);
```

```c3
fn Char32[]? String.to_new_utf32(s) => s.to_utf32(mem) @inline;
```

```c3
fn Char32[]? String.to_temp_utf32(s) => s.to_utf32(tmem) @inline;
```

```c3
fn WString? String.to_wstring(s, Allocator allocator);
```

```c3
fn WString? String.to_new_wstring(s) => s.to_wstring(mem);
```
```c3
fn WString? String.to_temp_wstring(s) => s.to_wstring(tmem);
```
```c3
fn StringIterator String.iterator(s);
```

### `ZString` Member Functions

```c3
fn String ZString.str_view(str);
```

```c3
fn usz ZString.char_len(str);
```

```c3
fn usz ZString.len(str);

```
```c3
fn ZString String.zstr_copy(s, Allocator allocator = mem)
```
```c3
fn ZString String.zstr_tcopy(s) => s.zstr_copy(tmem) @inline;
```
