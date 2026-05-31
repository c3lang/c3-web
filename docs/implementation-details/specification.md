---
title: C3 Specification
description: C3 Specification
search:
exclude: true
---

# C3 Specification

## Notation

The syntax is specified using Extended Backus-Naur Form (EBNF):

```
production  ::= PRODUCTION_NAME '::=' expression?
expression  ::= alternative ("|" alternative)*
alternative ::= term term*
term        ::= PRODUCTION_NAME | TOKEN | set | group | option | repetition
set         ::= '[' (range | CHAR) (rang | CHAR)* ']'
range       ::= CHAR '-' CHAR
group       ::= '(' expression ')'
option      ::= expression '?'
repetition  ::= expression '*'
```

Productions are expressions constructed from terms and the following operators, in increasing precedence:

```
|   alternation
()  grouping
?  option (0 or 1 times)
*  repetition (0 to n times)
```

Uppercase production names are used to identify lexical tokens. Non-terminals are in lower case. Lexical tokens are enclosed in single quotes ''.

The form `a..b` represents the set of characters from a through b as alternatives.

## Source code representation

A C3 program consists of one or more *translation units*. Each translation unit is stored in a file written in the Unicode character set, encoded as a sequence of bytes using UTF-8.

Except within comments and the contents of character and string literals, all input is formed from the ASCII subset (U+0000 to U+007F) of Unicode. A compiler may reject a source file that contains bytes outside the ASCII subset in any other position.

For simplicity, this document uses the unqualified term *character* to refer to a single Unicode code point in the source text. Each code point is distinct; in particular, an upper-case letter and its lower-case counterpart are different characters.

### Characters

The following terms denote individual characters and classes of characters:

```
NEWLINE        ::= /* the code point U+000A */
UNICODE_CHAR   ::= /* any code point except NEWLINE */
```

`UNICODE_CHAR` may appear only within comments and within character and string literals. In every other position the source text is restricted to the ASCII subset.

### Letters and digits

The following terms denote the letters and digits used to form tokens:

```
UC_LETTER       ::= [A-Z]
LC_LETTER       ::= [a-z]
LETTER          ::= UC_LETTER | LC_LETTER
DIGIT           ::= [0-9]
HEX_DIGIT       ::= [0-9a-fA-F]
BINARY_DIGIT    ::= [01]
OCTAL_DIGIT     ::= [0-7]
LC_LETTER_      ::= LC_LETTER | "_"
UC_LETTER_      ::= UC_LETTER | "_"
ALPHANUM        ::= LETTER | DIGIT
ALPHANUM_       ::= ALPHANUM | "_"
UC_ALPHANUM_    ::= UC_LETTER_ | DIGIT
LC_ALPHANUM_    ::= LC_LETTER_ | DIGIT
```

The underscore character `_` (U+005F) is not a `LETTER`; it is admitted only by the productions in which it appears explicitly.

### Carriage return

The carriage return (U+000D) is treated as white space. A compiler may alternatively strip carriage return characters from the source text prior to lexical translation; both treatments are valid, so a program must not depend on whether carriage returns are preserved.

### Bidirectional markers

Unbalanced Unicode bidirectional formatting markers — such as U+202D (`LEFT-TO-RIGHT OVERRIDE`) and U+202E (`RIGHT-TO-LEFT OVERRIDE`) — are not legal in C3 source text.


## Lexical elements

This chapter describes how the source text of a translation unit is divided into tokens, and defines the lexical structure of each kind of token.

### Tokens

A translation unit is translated into a sequence of *tokens* by repeatedly removing the longest prefix of the remaining input that forms a valid token. White space, line terminators, and comments are not tokens; they are discarded during translation, but may serve to separate tokens that would otherwise combine into a single token.

Because the longest valid prefix is always taken, a tokenization is chosen even when it does not yield a grammatically correct program and another tokenization would.

> Example: `a--b` is translated as the tokens `a`, `--`, `b`, which is not a valid expression, even though the tokenization `a`, `-`, `-`, `b` would be.

There are four classes of tokens: *identifiers*, *keywords*, *operators and punctuation*, and *literals*.

### Line terminators

The compiler divides the input into lines by recognizing *line terminators*. A line is terminated by the ASCII LF character (U+000A), the *newline*. A line terminator ends a line comment, and like white space it separates tokens.

### White space

White space is any of the space character (U+0020), the horizontal tab (U+0009), and the carriage return (U+000D). White space separates tokens and is otherwise insignificant.

```
WHITESPACE   ::= " " | "\t" | "\r"
```

### Comments

There are two forms of regular comment:

1. A *line comment* begins with `//` and stops at the end of the line.
2. A *block comment* begins with `/*` and ends with `*/`. Block comments nest: every `/*` within a block comment must be matched by a corresponding `*/`.

In addition, when the first line of a translation unit begins with `#!`, that line is treated as a line comment. The `#!` form is recognized only as the first line of the file; it has no special meaning anywhere else.

A comment does not begin inside a character, string, or byte literal, nor inside another comment.

### Doc contracts

A *doc contract* is a block comment of the form `<* text *>`. Doc contracts do not nest. The text between `<*` and `*>` is optionally parsed using the contract grammar specified in *Contracts*. A conforming compiler may instead treat a doc contract as a regular block comment and discard its contents during lexical translation; in that case the contract has no effect on the program. When a doc contract is parsed, its tokens enter the token stream as specified in *Contracts*.

### Identifiers

An identifier names a program entity. C3 distinguishes several lexical classes of identifier by the case of their characters and by an optional prefix sigil.

```
IDENTIFIER       ::= "_"* LC_LETTER ALPHANUM_*
CONST_IDENT      ::= "_"* UC_LETTER UC_ALPHANUM_*
TYPE_IDENT       ::= "_"* UC_LETTER UC_ALPHANUM_* LC_LETTER ALPHANUM_*
CT_IDENT         ::= "$" IDENTIFIER
CT_CONST_IDENT   ::= "$" CONST_IDENT
CT_TYPE_IDENT    ::= "$" TYPE_IDENT
CT_BUILTIN       ::= "$$" IDENTIFIER
CT_BUILTIN_CONST ::= "$$" CONST_IDENT
AT_IDENT         ::= "@" IDENTIFIER
AT_TYPE_IDENT    ::= "@" TYPE_IDENT
HASH_IDENT       ::= "#" IDENTIFIER
PATH_SEGMENT     ::= "_"* LC_LETTER LC_ALPHANUM_*
```

A `CONST_IDENT` consists only of underscores, upper-case letters, and digits. A `TYPE_IDENT` begins like a `CONST_IDENT` but additionally contains at least one lower-case letter. A plain `IDENTIFIER` begins with an optional run of underscores followed by a lower-case letter.

A sequence consisting solely of underscores — including a single underscore `_` — is not a valid identifier; it matches none of these classes.

Identifiers are limited to 127 characters.

### Keywords

The following identifiers are reserved as keywords and may not be used otherwise.

```
alias      asm        assert     attrdef    bitstruct
break      case       catch      const      constdef
continue   default    defer      do         else
enum       extern     false      faultdef   fn
for        foreach    foreach_r  if         import
inline     interface  lengthof   macro      module
nextcase   null       return     static     struct
switch     tlocal     true       try        typedef
union      var        while
```

The built-in type names are also reserved:

```
any        bfloat     bool       char       double
fault      float      float16    float128   ichar
int        int128     iptr       long       short
sz         typeid     uint       uint128    untypedlist
uptr       ushort     usz        void
```

The following compile-time keywords, each beginning with `$`, are reserved:

```
$assert     $case       $default    $defined    $echo
$else       $embed      $endfor     $endforeach $endif
$endswitch  $error      $eval       $exec       $expand
$feature    $for        $foreach    $if         $include
$reflect    $stringify  $switch     $Typefrom   $Typeof
$vaarg
```

### Operators and punctuation

The following character sequences are operators and punctuation:

```
+    -    *    /    %
&    |    ^    ~    <<   >>
=    +=   -=   *=   /=   %=
&=   |=   ^=   <<=  >>=
==   !=   <    >    <=   >=
&&   ||   !
?    ?:   ??   !!
++   --
.    ..   ...
,    ;    :    ::
->   =>
(    )    {    }    [    ]
[<   >]
@    #    $
&&&  |||  ???  +++  +++=
```

The sequence `$$` introduces a compile-time built-in identifier, as described under *Identifiers*.

### Integer literals

An integer literal denotes an integer constant. It is written in decimal, binary, octal, or hexadecimal, and may carry a suffix fixing its type.

```
INTEGER         ::= (DECIMAL_LIT | BINARY_LIT | OCTAL_LIT | HEX_LIT) INTEGER_SUFFIX?
DECIMAL_LIT     ::= DIGIT ("_"* DIGIT)*
BINARY_LIT      ::= "0" ("b" | "B") BINARY_DIGIT ("_"* BINARY_DIGIT)*
OCTAL_LIT       ::= "0" ("o" | "O") OCTAL_DIGIT ("_"* OCTAL_DIGIT)*
HEX_LIT         ::= "0" ("x" | "X") HEX_DIGIT ("_"* HEX_DIGIT)*
INTEGER_SUFFIX  ::= ("l" | "L") ("l" | "L")?
                  | ("u" | "U") (("l" | "L") ("l" | "L")?)?
```

An underscore may appear between two digits and is insignificant; it may not appear at the start or end of the digit sequence, nor immediately after the base prefix. Underscores may be repeated.

The suffix is case-insensitive. A single `l` group selects a 64-bit literal, and a doubled `ll` group selects a 128-bit literal; a leading `u` selects the unsigned form. These widths are fixed on every platform.

### Floating-point literals

A floating-point literal denotes a real constant, written in decimal or hexadecimal form, with an optional type suffix.

```
REAL            ::= (DEC_FLOAT_LIT | HEX_FLOAT_LIT) REAL_SUFFIX?
DEC_FLOAT_LIT   ::= DECIMAL_LIT DEC_EXPONENT
                  | DECIMAL_LIT "." DECIMAL_LIT DEC_EXPONENT?
HEX_FLOAT_LIT   ::= "0" ("x" | "X") HEX_DIGITS ("." HEX_DIGITS)? HEX_EXPONENT
HEX_DIGITS      ::= HEX_DIGIT ("_"* HEX_DIGIT)*
DEC_EXPONENT    ::= ("e" | "E") ("+" | "-")? DIGIT+
HEX_EXPONENT    ::= ("p" | "P") ("+" | "-")? DIGIT+
REAL_SUFFIX     ::= "d" | "D" | "f" | "F"
```

A decimal floating-point literal either has an exponent, or has a fractional part with digits on both sides of the `.` and an optional exponent. A leading `.` or a trailing `.` is therefore not part of a floating-point literal. A hexadecimal floating-point literal always requires a `p` binary exponent.

The suffix is case-insensitive: `f` denotes the `float` type and `d` denotes the `double` type.

### Character literals

A character literal is one or more characters enclosed in single quotes.

```
CHAR_LIT     ::= "'" CHAR_ELEMENT+ "'"
CHAR_ELEMENT ::= UNICODE_CHAR_NO_QUOTE | ESCAPE_SEQUENCE
```

`UNICODE_CHAR_NO_QUOTE` is any character other than a control character (U+0000–U+001F), a backslash, or a single quote. A line terminator may not appear inside a character literal. Backslash escape sequences are described under *Backslash escapes*.

A character literal may contain 1, 2, 4, 8, or 16 bytes of character data; the resulting constant and its type are specified in *Constants*.

### String literals

A string literal is a sequence of characters enclosed in double quotes.

```
STRING_LIT   ::= '"' CHAR_ELEMENT* '"'
```

The same character and escape rules apply as for character literals: no raw control characters, no line terminator, backslash escapes permitted. A string literal therefore may not span multiple lines.

Adjacent string literals are concatenated into a single string constant; a character literal participates in the same concatenation.

### Raw string literals

A raw string literal is enclosed in backticks. No escape processing is performed on its contents: every character stands for itself, and the literal may span multiple lines. A literal backtick is written by doubling it (`` `` ``).

```
RAW_STRING_LIT ::= "`" ( RAW_CHAR | "``" )* "`"
```

`RAW_CHAR` is any character other than a backtick. A raw string literal yields an ordinary string constant and concatenates with adjacent string and character literals.

### Byte data literals

A byte data literal denotes a sequence of raw bytes. It is introduced by `x` (hexadecimal) or `b64` (Base64) and may use double-quote, single-quote, or backtick delimiters; the backtick and single-quote forms may be broken across lines, with intervening white space ignored.

```
BYTES        ::= HEX_BYTES | B64_BYTES
HEX_BYTES    ::= "x"   ( '"' ... '"' | "'" ... "'" | "`" ... "`" )
B64_BYTES    ::= "b64" ( '"' ... '"' | "'" ... "'" | "`" ... "`" )
```

A hexadecimal byte literal contains hexadecimal digits, each pair denoting one byte. A Base64 byte literal contains Base64-encoded data. Adjacent byte data literals are concatenated. The precise content rules and the resulting constant are specified in *Constants*.

### Backslash escapes

Within character literals and string literals (but not raw string literals), the backslash introduces an escape sequence:

```
\0          the zero byte (0x00)
\a          alert / bell (0x07)
\b          backspace (0x08)
\e          escape (0x1B)
\f          form feed (0x0C)
\n          newline (0x0A)
\r          carriage return (0x0D)
\t          horizontal tab (0x09)
\v          vertical tab (0x0B)
\\          backslash (0x5C)
\'          single quote (0x27)
\"          double quote (0x22)
\xNN        one byte, two hex digits
\uNNNN      a two-byte Unicode value, four hex digits
\UNNNNNNNN  a four-byte Unicode value, eight hex digits
```

### The boolean literals

The keywords `true` and `false` are the two literals of the boolean type `bool`.

### The null literal

The keyword `null` is the literal pointer value whose address is zero. Its type and conversions are specified in *Types*.

## Constants

A constant is an immutable, named value. A constant declaration binds a `CONST_IDENT` to the value of its initializer.

```
const_decl ::= "const" type? CONST_IDENT attributes? ("=" expression)?
```

A constant declaration binds exactly one name and is terminated by a semicolon. It may appear at module level or within the body of a function.

A constant declaration falls into one of three categories. A declaration preceded by `extern` declares an *extern constant*; the `extern` prefix is permitted only at module level, and the declaration has no initializer. A declaration that is not extern and specifies a type declares a *typed constant*. A declaration that is not extern and omits the type declares an *untyped constant*. A non-extern declaration must have an initializer.

A constant declared within the body of a function is a *local constant*; it has local visibility and static storage duration.

The initializer is an expression. The grammar does not restrict it, but it must evaluate to a constant value.

A constant value belongs to one of two categories. A *compile-time constant* can participate in compile-time constant folding; a *runtime constant* cannot. The classification rules are given in *Compile-time and runtime constants*.

Types, reflection values, and member references have no runtime representation. They may not be bound to a constant; they must be bound to a compile-time variable.

A constant declaration may carry attributes. The applicable attributes are listed in *Attributes*.

### Typed constants

A *typed constant* is a non-extern constant declaration that specifies a type.

```
const int LIMIT = 100;
const String GREETING = "hello";
```

The initializer must be assignable to the specified type. Assignability is defined in *Properties of types and values*.

The specified type may be an optional type. It may have an inferred length, in which case the length is taken from the initializer.

```
const int[*] PRIMES = { 2, 3, 5, 7 };
```

A typed constant exists at runtime. Its address may be taken.

### Untyped constants

An *untyped constant* is a non-extern constant declaration that omits the type.

```
const LIMIT = 100;
```

An untyped constant differs from a typed constant in three respects:

1. Its type is the type of its initializer.
2. It does not exist at runtime.
3. Its address may not be taken.

### Extern constants

An *extern constant* is a constant declaration preceded by `extern`.

```
extern const int VERSION;
```

An extern constant must specify a type, has no initializer, and may be declared only at module level.

The value of an extern constant is not available during compilation. An extern constant is therefore not a constant expression, and may not be used where a constant value is required, including as the initializer of another constant.

### Constant expressions

A *constant expression* is an expression that evaluates to a constant value.

Syntactically, a constant expression is an expression that excludes the assignment operators. Whether an expression is a constant expression, and the category of its value, is determined during semantic analysis.

The following require a compile-time constant: array lengths, vector lengths, bitstruct member ranges, enum values, attribute arguments, and the operands of `$assert`, `$error`, `$switch`, `$case`, and `$embed`.

A constant initializer and a global variable initializer accept a constant value of either category.

## Variables

A variable is a named, mutable value held in storage. A variable declaration binds an `IDENTIFIER` to a storage location of a specified or inferred type.

A variable declaration may appear at module level or within the body of a function. A variable declared at module level is a *global variable*; a variable declared in a function body is a *local variable*.

Every variable has a *storage duration* that determines its *lifetime*: the portion of program execution during which storage is reserved for the variable. A variable has a constant address and retains its last-stored value throughout its lifetime. Accessing a variable outside its lifetime is undefined behaviour.

There are three storage durations:

* A variable with *static storage duration* exists for the entire execution of the program. Its initializer, if any, is evaluated once before program startup.
* A variable with *automatic storage duration* has storage allocated for the lifetime of the enclosing function call. The variable's name is in scope only within the block in which it is declared, but its storage remains valid until the function returns. If an initializer is given, it is evaluated each time the declaration is reached during execution; otherwise the variable is zero-initialized each time the declaration is reached.
* A variable with *thread-local storage duration* exists for the lifetime of the thread for which it is created. Each thread that accesses the variable has a distinct instance, and each instance's initializer is evaluated when its thread starts.

A global variable has static storage duration by default. A local variable has automatic storage duration by default. The modifiers `static` and `tlocal` change a local variable's storage duration to static or thread-local, respectively.

A variable without an initializer is implicitly zero-initialized. The `@noinit` attribute may be used to leave a variable uninitialized; a variable whose type is marked `@mustinit` may not use `@noinit`.

Variables and constants are mutually exclusive. A constant is declared with `const` and bound to a `CONST_IDENT`; a variable is declared without `const` and bound to an `IDENTIFIER`.

A separate kind of declaration introduces *compile-time variables*, which exist only during compilation. They are described in their own subsection below.

A variable declaration may carry attributes. The applicable attributes are listed in *Attributes*. Visibility of a global variable is controlled by `@public`, `@private`, and `@local`; see *Modules*.

### Global variables

A global variable is declared at module level.

```
global_var_decl ::= "tlocal"? type IDENT ("," IDENT)* attributes? ("=" expression)? ";"
```

The type is required. Each name must be an `IDENTIFIER`. A single declaration may bind several names by separating them with commas; a declaration that binds multiple names may not have an initializer.

The initializer, if present, must be a constant expression (see *Constant expressions*). It may be either a compile-time or a runtime constant.

A global variable has static storage duration. If the declaration is preceded by `tlocal`, the variable instead has thread-local storage duration; see *Thread-local variables*.

A global variable preceded by `extern` is an *extern global variable*; see *Extern global variables*.

### Extern global variables

An *extern global variable* is a global variable whose definition is provided elsewhere and resolved at link time. It is declared with the `extern` prefix and has no initializer.

```
extern_global_var_decl ::= "extern" "tlocal"? type IDENT ("," IDENT)* attributes? ";"
```

```
extern int VERSION;
```

An extern global variable must specify a type. It is otherwise subject to the same rules as a non-extern global variable, including the use of `tlocal` to give it thread-local storage duration.

### Local variables

A local variable is declared within the body of a function.

```
local_var_decl ::= type IDENT ("," IDENT)* attributes? ("=" expression)? ";"
                 | "var" IDENT attributes? "=" expression ";"
```

In the first form the type is given explicitly. A single declaration may bind several names by separating them with commas; a declaration that binds multiple names may not have an initializer. In the second form the keyword `var` introduces the declaration and the type is inferred from the initializer; the initializer is required, and only a single name may be bound.

The initializer is an expression. It need not be constant.

A local variable has automatic storage duration. Its storage is allocated for the lifetime of the enclosing function call: the variable's name is in scope only within the block in which it is declared, but its storage remains valid until the function returns. If an initializer is given, it is evaluated each time the declaration is reached during execution; otherwise the variable is zero-initialized each time the declaration is reached.

The modifiers `static` and `tlocal` change a local variable's storage duration; see *Static local variables* and *Thread-local variables*. The two modifiers may not appear together, and neither may be combined with the `var` form.

### Thread-local variables

A variable preceded by `tlocal` has thread-local storage duration: a distinct instance of the variable exists for each thread that accesses it, and each instance is initialized when its thread starts and persists for the lifetime of that thread.

```
tlocal int counter;             // global, thread-local

fn void f()
{
    tlocal int n;               // local, thread-local
}
```

A `tlocal` local variable is, in effect, a thread-local global variable whose name is visible only within the enclosing function.

The initializer of a `tlocal` variable, if present, must be a constant expression.

### Static local variables

A local variable preceded by `static` is, in effect, a global variable whose name is visible only within the enclosing function. It has static storage duration: a single instance persists for the lifetime of the program, and its initializer is evaluated once before program startup.

```
fn int next_id()
{
    static int counter = 0;
    return counter++;
}
```

`static` is permitted only on local variable declarations; a global variable already has static storage duration.

The initializer of a `static` local variable, if present, must be a constant expression.

### Compile-time variables

A compile-time variable exists only during compilation. It has no runtime representation, and its address may not be taken.

A compile-time variable holds either a value or a type, distinguished by the case of its name:

* A *compile-time value variable* is named with a `CT_IDENT` (`$name`).
* A *compile-time type variable* is named with a `CT_TYPE_IDENT` (`$Name`).

A compile-time variable is introduced by one of the following forms:

```
ct_var_decl ::= "var" CT_IDENT ("=" expression)? ";"
              | "var" CT_TYPE_IDENT ("=" expression)? ";"
              | type CT_IDENT ("=" expression)? ";"
```

A compile-time value variable may be untyped (`var $x`), typed by the `var` form with the type inferred from the initializer, or typed explicitly by giving a type in place of `var`. A compile-time type variable may not be given an explicit type.

An initializer is optional. If present, it must be a constant expression for a value variable, or denote a type for a type variable.

Attributes may not be applied to a compile-time variable. A compile-time variable may be declared within a function body or a macro body.

## Types

A type determines a set of values together with the operations applicable to those values. A type is either *named* or expressed as a *type literal*.

The built-in types — booleans, integer types, floating-point types, `void`, `any`, `typeid`, and `fault` — are predeclared. Named user-defined types are introduced by `struct`, `union`, `bitstruct`, `enum`, `constdef`, `interface`, `typedef`, and `alias` declarations, each described below. A type literal constructs a type from existing types: pointers, arrays, slices, vectors, optionals, and function types.

```
type      ::= type_name | type_literal
type_name ::= path? TYPE_IDENT | builtin_type
path      ::= IDENTIFIER "::" (IDENTIFIER "::")*
builtin_type ::= "void" | "bool" | "any" | "typeid" | "fault"
               | "ichar" | "char" | "short" | "ushort"
               | "int" | "uint" | "long" | "ulong"
               | "int128" | "uint128"
               | "iptr" | "uptr" | "sz" | "usz"
               | "float" | "double" | "untypedlist"
```

The syntax of each type literal is given in the corresponding subsection.

### Boolean types

The type `bool` represents truth values. It has two values, `true` and `false`. A `bool` occupies one byte of storage.

### Integer types

C3 has fourteen built-in integer types: seven signed and seven unsigned. The first five pairs have fixed power-of-two widths; the remaining four are platform-dependent.

| Signed   | Unsigned  | Width                          |
|----------|-----------|--------------------------------|
| `ichar`  | `char`    | 8 bits                         |
| `short`  | `ushort`  | 16 bits                        |
| `int`    | `uint`    | 32 bits                        |
| `long`   | `ulong`   | 64 bits                        |
| `int128` | `uint128` | 128 bits                       |
| `iptr`   | `uptr`    | same width as `void*`          |
| `sz`     | `usz`     | width of the maximum pointer difference |

A signed type with N bits represents values in the range −2^(N−1) to 2^(N−1) − 1. An unsigned type with N bits represents values in the range 0 to 2^N − 1.

Integer arithmetic uses two's complement representation. Signed overflow wraps and does not produce undefined behaviour.

### Floating-point types

C3 has two floating-point types: `float` is 32 bits and `double` is 64 bits. Both follow the IEEE 754 binary representation for their respective widths.

### The void type

The type `void` represents the absence of a value. It is used as the return type of a function that produces no value, and as the pointed-to type of `void*`. A `void` value cannot be stored or named.

### Pointer types

A pointer type denotes the address of an object of a given type:

```
pointer_type ::= type "*"
```

A pointer holds the address of an object of the pointed-to type, or the literal value `null`.

The literal `null` converts implicitly to any pointer type. The type `void*` is a *wildcard pointer*: it converts implicitly to and from any other pointer type.

Pointer arithmetic follows the same rules as C: `p + i` advances `p` by `i` elements (each `T::size` bytes), `p - i` retreats by the same amount, and `p - q` for two pointers to the same element type yields a signed integer count of elements between them.

Pointer arithmetic on `void*` is supported and treats the element size as 1, identical to pointer arithmetic on `char*`.

Subscripting a pointer is equivalent to pointer arithmetic followed by a dereference. The index may be negative; pointer subscripting is never bounds-checked.

A pointer of any type may be converted losslessly to `iptr` or `uptr` and back.

A `void*` may not be directly dereferenced or subscripted; it must first be cast to a non-`void` pointer type.

### Array types

An array type holds a fixed number of values of an element type:

```
array_type ::= type "[" expression "]"
             | type "[" "*" "]"
```

The expression must be a compile-time constant expression of integer type denoting the array length. The form `type[*]` is permitted where the length can be inferred from an initializer; the inferred length becomes part of the type.

The length is part of the type, so `int[3]` and `int[4]` are distinct. An array is a value: assignment, parameter passing, and return copy the elements.

A pointer to an array, `type[N]*`, implicitly converts to a pointer to the first element, `type*`.

An array must have at least one element; `Type[0]` is not a valid type.

### Slice types

A slice type denotes a view into a contiguous sequence of elements:

```
slice_type ::= type "[" "]"
```

A slice is a pair consisting of a pointer to the element sequence and an integer length. The fields `.ptr` and `.len` provide these components.

A slice is obtained by taking the address of an array, by slicing an array, slice, or vector with a range expression, or by allocating a sequence of elements at runtime.

Indexing a slice is range-checked in safe builds.

### Vector types

A vector type holds a fixed number of values that may be operated on using SIMD instructions:

```
vector_type ::= type "[<" expression ">]"
              | type "[<" "*" ">]"
```

The element type must be one of:

* `bool`,
* an integer type,
* a floating-point type,
* a pointer type,
* an enum type,
* a typedef whose underlying type is one of the above.

The length must be a compile-time constant expression of integer type; the form `type[<*>]` is permitted where the length can be inferred from an initializer.

A plain vector such as `int[<3>]` has the same size and ABI representation as the corresponding array type (`int[3]`): element alignment, no padding. When used in arithmetic or bitwise expressions, the operations are applied elementwise using SIMD instructions where available.

The `@simd` attribute declares a *SIMD aligned vector*. A SIMD aligned vector must have a length that is a power of two, and has platform SIMD alignment (typically it will match the size of the vector). As locals and globals, plain vectors and SIMD aligned vectors are treated identically in terms of alignment; the distinction arises when the vector is embedded inside a struct or an array, or appears at the ABI boundary. In those contexts a plain vector has the alignment of the corresponding array type, while a `@simd` vector retains its SIMD alignment.

Arithmetic and bitwise operations on a vector are applied elementwise. A scalar value used with a vector is widened by replication.

A vector must have at least one element, as an example `int[<0>]` is not a valid type.

A vector implicitly converts to the corresponding array type and vice versa.

It is possible to take the address of a single element. Vectors can be sliced.

#### Field access and swizzling

The elements of a vector at indices 0, 1, 2, 3 may be referred to by the field names `x`, `y`, `z`, `w`, or by the alternate set `r`, `g`, `b`, `a`. A single field access denotes the corresponding element value: for a vector `v`, `v.x` is the element at index 0, `v.r` is also the element at index 0, and so on. Field-name indices beyond the vector's length are an error.

A *swizzle expression* concatenates several such field names to form a new vector whose elements are the corresponding elements of the source. The width of the result equals the number of field names in the swizzle:

```
int[<4>] v = { 10, 20, 30, 40 };
int[<2>] a = v.xz;          // { 10, 30 }
int[<9>] b = v.xxxzzzyyy;   // { 10, 10, 10, 30, 30, 30, 20, 20, 20 }
```

There is no restriction on the ordering of the field names within a swizzle, and the same field may be repeated. The two field name sets (`xyzw` and `rgba`) may not be mixed within a single swizzle: `v.rgz` is an error.

A swizzle expression is an lvalue when no index is repeated; assigning to such an lvalue writes the corresponding source elements. For example, `v.zy = e` is well-formed when `e` is a 2-element vector; `v.xxy = e` is not, because index 0 appears twice on the left.

#### Increment and decrement

The unary `++` and `--` operators applied to a vector are applied elementwise. For a vector `v`, `v++` returns the original vector and replaces each element with its incremented value; `++v` returns the incremented vector and stores it back into `v`. The operators are valid for vectors of integer element type.

#### Enum vectors

A vector whose element type is an `enum` is an *enum vector*. An enum vector supports the accessor `.ordinal`, which produces a vector of the enum's backing integer type holding the ordinal of each element. The static method `Ty::from_ordinal`, when invoked on an integer vector, returns an enum vector of `Ty` whose elements correspond to the supplied ordinals.

#### Vector size limit

A compiler may impose a maximum total bit width on a vector. The limit is at least as wide as the largest SIMD vector supported by the target. A typical limit is 4096 bits. For the purpose of this limit, a boolean vector is counted as 8 bits per element.

### Struct types

A struct type is a named sequence of fields stored in declaration order:

```
struct_decl ::= "struct" TYPE_IDENT ("(" type ("," type)* ")")? attributes? "{" struct_body "}"
```

(The full grammar of `struct_union_body` is given in *Declarations*.)

A struct must declare at least one member. A flexible array member (see below) does not by itself satisfy this requirement: a struct that contains a flexible array member must also declare at least one preceding member.

Field access uses dot notation. The dot operator also applies to a single level of pointer-to-struct: if `p` is of type `St*` and `f` is a field of `St`, then `p.f` denotes the field of the pointee.

A field may be declared `inline`. Such a field designates an *inline member*: values of the struct then implicitly convert to the type of that field, and methods of that type are accessible through the enclosing struct. See *Properties of types and values*.

Anonymous nested structs and unions are permitted, following C99 conventions.

Layout attributes (`@align`, `@packed`, `@compact`, `@nopadding`) control storage representation. See *Attributes*.

#### Flexible array member

The last field of a struct may be declared as an array with no specified length, of the form `Ty[*]`. Such a field is a *flexible array member*: it contributes no size to the struct itself (the struct's size is that of the preceding fields plus any required tail padding for alignment), but the storage of an instance may extend past the struct's declared size to hold elements of the array. The number of elements is determined by the size of the allocation rather than by the type.

A struct containing a flexible array member may not be embedded as a field of another struct, used as an element of an array, or copied by value; a value of such a struct is meaningful only through a pointer to underlying storage of sufficient size.

### Union types

A union type is declared like a struct, but its fields share storage:

```
union_decl ::= "union" TYPE_IDENT ("(" type ("," type)* ")")? attributes? "{" struct_union_body "}"
```

A union must declare at least one member.

All fields of a union share storage beginning at the same address. The alignment of a union is the maximum alignment requirement of any of its fields; consequently, any member access through a union pointer is correctly aligned regardless of which member is read. The size of a union is the size of its largest field rounded up to the nearest multiple of the union's alignment.

Writing a member of type Ty stores that value's bit pattern in the first `Ty::size` bytes of the union's storage. Reading a member of type Un interprets the first `Un::size` bytes of the union's storage as a value of type Un.

When the most recently written member is of type Ty:

* If `Un::size ≤ Ty::size`, all bytes read are part of Ty's written representation; the result is those bytes reinterpreted as type U. The result is fully defined.
* If `Un::size > Ty::size`, the first `Ty::size` bytes hold Ty's written representation; the bytes in the range `[Ty::size, Un::size)` hold unspecified values, and the result may be any value representable in type Un.

A union may therefore be used as a controlled way to reinterpret a bit pattern, provided the member being read is no wider than the member most recently written.

Anonymous nested structs and unions are permitted, as in struct types.

### Bitstruct types

A bitstruct type is a struct whose fields occupy specified bit ranges within a backing storage:

```
bitstruct_decl ::= "bitstruct" TYPE_IDENT ("(" type ("," type)* ")")? ":" type attributes? "{" bitstruct_body "}"
```

The backing type is either an integer type, a character array, or a typedef whose underlying type is one of these. Each field of a bitstruct must be an integer type or `bool`; each field specifies a single bit position or an inclusive bit range within the backing storage.

A bitstruct field is not addressable.

By default, fields of a bitstruct may not overlap. The `@overlap` attribute permits overlapping ranges. Endianness of the underlying storage follows the host system by default, but may be set explicitly with `@bigendian` or `@littleendian`.

#### Storage bit positions

The backing storage offers `8 * sizeof(backing)` *storage bit positions*, numbered from `0` upward. Storage bit position `n` lives at memory offset `n / 8`, at bit position `n % 8` of that byte, where bit `0` is the byte's least-significant bit.

A field declared at `bits start..end` occupies **exactly** the storage bit positions `start..end` — no others — regardless of endianness, backing type, or field size. A write to the field never touches any storage bit outside this range; adjacent fields placed in the unused bit positions of a partial byte are preserved across writes.

The mapping from the field's *value bits* (numbered LSB-first on the value) to its storage bit positions depends on the backing type and the endianness annotation, as described below.

#### Integer backing

The integer is stored in memory in the declared byte order. When that order differs from the host's, the integer is byteswapped on every load and store; the in-memory bytes therefore match the declared order on every host.

Bit positions index the loaded (post-byteswap) integer LSB-first: value bit `i` of a field at `start..end` resides at integer bit `start + i`.

#### `char[N]` backing

The `N` bytes lie at memory offsets `0..N-1` directly; no byteswap is applied to the array.

A field at `start..end` of size `S = end - start + 1` may span several memory bytes. For each memory byte `b` that the field touches, the field's bits within byte `b` occupy positions `lo_b..hi_b` (LSB-first within the byte). These positions are fixed by the declaration, independent of endianness:

| byte `b`          | `lo_b`        | `hi_b`                                          |
|-------------------|---------------|-------------------------------------------------|
| `start / 8`       | `start % 8`   | `7` (or `end % 8` if also the last byte)        |
| intermediate      | `0`           | `7`                                             |
| `end / 8`         | `0`           | `end % 8`                                       |

Let `cnt_b = hi_b - lo_b + 1` be the number of field bits in byte `b`. The endianness annotation determines which value bits go into each byte:

- **Little-endian byte order** (`@littleendian`, no annotation on a little-endian host, or `@littleendian` on a big-endian host): the first touched byte holds the value's least-significant bits, the last touched byte holds the most-significant bits. Byte `b` receives `cnt_b` value bits starting at value position `(sum of cnt_b' for all bytes b' before b)`, placed LSB-first into byte positions `lo_b..hi_b`.

- **Big-endian byte order** (`@bigendian`, no annotation on a big-endian host, or `@bigendian` on a little-endian host): the order is reversed. The first touched byte holds the value's most-significant bits, the last touched byte holds the least-significant bits. Byte `b` receives `cnt_b` value bits starting at value position `S - (sum of cnt_b' for all bytes b' up to and including b)`, placed LSB-first into byte positions `lo_b..hi_b`.

The no-spill rule from *Storage bit positions* applies in both orderings: a write to a field touches only the storage bit positions in its declared range, even when the field's size is not a multiple of 8 and the bytes it spans contain bits belonging to other fields.

#### Examples

A 16-bit field that covers the full lower half of a four-byte backing:
bitstruct A : char[4] @bigendian    { ushort v : 0..15; }
bitstruct B : char[4] @littleendian { ushort v : 0..15; }
// A.v = 0xABCD  →  memory [AB CD 00 00]
// B.v = 0xABCD  →  memory [CD AB 00 00]

A 15-bit field that leaves bit 7 of byte 1 untouched:
bitstruct C : char[4] @bigendian    { ushort v : 0..14; }
bitstruct D : char[4] @littleendian { ushort v : 0..14; }
// C.v = 0x7FFF  →  memory [FF 7F 00 00]
// D.v = 0x7FFF  →  memory [FF 7F 00 00]

A 12-bit field that occupies the low nibble of byte 1:
bitstruct E : char[3] @bigendian    { uint v : 0..11; }
bitstruct F : char[3] @littleendian { uint v : 0..11; }
// E.v = 0xABC   →  memory [AB 0C 00]
// F.v = 0xABC   →  memory [BC 0A 00]

The no-spill rule in action — a sub-byte field adjacent to another field shares the same byte, and updates to one field do not disturb the other:
bitstruct G : char[2] @bigendian
{
ushort a : 0..14;
bool   b : 15;
}
// g.b = true; g.a = 0;        // g.b is still true
// g.b = true; g.a = 0x7FFF;   // g.b is still true

#### Integer and `char[N]` backings are not interchangeable

Identical bit declarations on an integer backing and a `char[N]` backing do not in general produce the same in-memory bytes when the field does not cover the entire backing storage.

The integer backing stores the whole container in the declared byte order: a 16-bit field at bits `0..15` of `int @bigendian` lives at memory offsets `2..3` (the low-bit end of a big-endian-stored `int`). The same field at bits `0..15` of `char[4] @bigendian` lives at memory offsets `0..1` (the bottom of the declared byte range). The two backings agree byte-for-byte only when the field covers the full backing storage.

Programs that need a specific wire format should choose one backing — typically `char[N]` when the bit positions are meant to address memory bytes directly — and use it consistently.

### Enum types

An enum type is a finite ordered set of named values, optionally backed by an integer type and optionally carrying associated values:

```
enum_decl ::= "enum" TYPE_IDENT ("(" type ("," type)* ")")? (":" type? enum_param_list?)? attributes? "{" enum_body "}"
```

Each enum value has an *ordinal*: its position in the declaration, beginning at zero. Ordinals are consecutive; an enum type defines no gaps.

If a parameter list follows the backing type, each declared value supplies a value for each associated parameter; these are accessed through the value as if they were fields.

An enum is converted to and from its ordinal via the properties `.ordinal` and `from_ordinal`; explicit casts to and from the backing integer type are also permitted.

### Constdef types

A `constdef` declaration introduces a *constdef type*: a set of named constants of a backing type, with explicitly chosen values that need not be consecutive.

```
constdef_decl ::= "constdef" TYPE_IDENT ("(" type ("," type)* ")")? (":" "inline"? type)? attributes? "{" constdef_body "}"
```

If the backing type is omitted, it is taken to be `int`. Values that are not explicitly assigned take the value of the previous value plus one.

Unlike `enum`, a constdef has no ordinal: its values are those of its constants. Constdef values do not implicitly convert to or from the backing type; conversions are made by explicit cast unless `inline` is given on the backing type, in which case values convert implicitly *to* the backing type.

A `constdef` declaration may carry the attribute `@constinit` to permit literals of the backing type to implicitly convert *to* the constdef type.

### Fault types

The type `fault` is the type of fault values. Fault values are declared with `faultdef`:

```
fault_decl ::= "faultdef" CONST_IDENT ("," CONST_IDENT)* attributes? ";"
```

Each declared name is a value of type `fault`. Fault values are used as the *excuse* of an empty optional and are described further under *Optionals and faults*.

The `fault` type has the alignment, size, and underlying representation of `uptr`. The zero fault value — the absence of a fault — may be produced implicitly by casting from `null` or from `{}`. An optional constructed from the zero fault value carries the fault state but holds no useful underlying value; subsequent operations on it propagate the fault and produce unspecified underlying values.

### Optional types

An optional type holds either a *result* of a base type or an empty optional carrying a fault value as its *excuse*:

```
optional_type ::= type "?"
```

The base type may not itself be optional. The optional `void?` is permitted only as a function return type; an optional may not otherwise have base type `void`.

An optional type has the same size and alignment as its base type. The presence or absence of a result is tracked separately; it does not add overhead to the stored value.

The use, propagation, and handling of optionals is specified in *Optionals and faults*.

### Function types

A function type describes the signature of a function:

```
function_type ::= "fn" type "(" parameter_list? ")"
```

A function type is not itself a first-class type; it is used through a `typedef` or `alias` to declare a function pointer type:

```
alias Callback = fn void(int);
```

A value of an aliased function type holds the address of a function (or `null`). Function pointer types may carry default argument values and named parameters; see *Functions and methods*.

### Distinct types

A `typedef` declaration introduces a new type derived from an existing type:

```
typedef_decl ::= "typedef" TYPE_IDENT ("(" type ("," type)* ")")? attributes? "=" "inline"? type ";"
```

The new type is distinct from its underlying type: values of one do not implicitly convert to the other. Literals do not implicitly convert to a typedef type unless the typedef carries the `@constinit` attribute.

When the `inline` modifier is given, values of the typedef type implicitly convert *to* the underlying type, but not from it.

A typedef type has its own method set, and methods, attributes, and operator overloads may be defined for it.

### Type aliases

An `alias` declaration introduces a new name for an existing type:

```
type_alias_decl ::= "alias" TYPE_IDENT attributes? "=" type ";"
```

A type alias is fully equivalent to its underlying type; the two are interchangeable in every context. Unlike a `typedef`, an alias does not introduce a new type.

The `alias` keyword is also used to introduce aliases for functions, variables, and generic instantiations; those forms are described in *Declarations*.

### Interface types

An interface type names a set of method signatures:

```
interface_decl ::= "interface" TYPE_IDENT (":" type ("," type)*)? attributes? "{" interface_body "}"
```

Each entry in the body is a method signature giving a name, return type, and parameter list. A signature marked `@optional` need not be implemented by every type that implements the interface.

An interface value has the same representation as `any`: a pointer paired with a `typeid`. Its size is twice the pointer width; its alignment is the pointer alignment. An implementing type must satisfy the method requirements of the interface and all interfaces it extends.

Any user-defined type — struct, union, bitstruct, enum, constdef, or typedef — may implement one or more interfaces. The interface list is given in parentheses after the type name in the type declaration, and each non-optional method must be provided as a `@dynamic` method. Aliases may not implement interfaces, as they introduce no new type. A value of an implementing type implicitly converts to the interface type. Conversion from an interface to a concrete type, or from `any` to an interface, is explicit and may fail at runtime.

### The any type

The type `any` is a runtime-tagged reference: it pairs a pointer with a `typeid` identifying the type of the pointee. Its size is twice the pointer width; its alignment is the pointer alignment.

The fields `.ptr` and `.type` retrieve the pointer and the runtime type respectively. Any pointer type implicitly converts to `any`.

### The typeid type

The type `typeid` is the type of values identifying types at runtime. The width of `typeid` is the same as the width of `iptr`.

Every type has a corresponding `typeid` value, obtained by the property `::typeid` of the type. The `typeid` of the type identified by an `any` value is its `.type` field.

### The untypedlist type

The type `untypedlist` is the type of compile time lists which lack a definite type. An untyped list may be appended to and indexed into at compile time.

Because it is compile-time only, only compile-time variables may have this type. It may not exist at runtime.

### Generic type instantiation

A type may be parameterized by a generic module. Such a type is instantiated by writing the type name followed by a brace-delimited list of type and constant arguments:

```
generic_instantiation ::= type_name "{" generic_arg ("," generic_arg)* "}"
generic_arg ::= type | expression
```

The same syntax is used to instantiate generic functions, macros, and global variables. The rules for declaring and using generics are given in *Generics*.

## Properties of types and values

### Underlying type

Every type has an *underlying type*.

* For a predeclared type or a type literal, the underlying type is the type itself.
* For a struct, union, bitstruct, enum, constdef, fault, or interface type, the underlying type is the declared type itself.
* For a type alias, the underlying type is the underlying type of the aliased type.
* For a `typedef`, the underlying type is the underlying type of the type from which it derives.

### Inner type

For some types, an *inner type* is defined.

* The inner type of a pointer is the pointed-to type.
* The inner type of an array, slice, or vector is its element type.
* The inner type of an `enum` is its backing integer type.
* The inner type of a `constdef` is its backing type.
* The inner type of a `bitstruct` is its backing type.
* The inner type of a `typedef` is the type from which it derives.

Other types have no inner type.

### Type identity

Two types are *identical* if they have the same name (for named types) or the same structure (for type literals). Two distinct declarations of `struct`, `union`, `bitstruct`, `enum`, `constdef`, `interface`, or `typedef` produce distinct types, even when their bodies are textually identical. A type alias is identical to the type it names.

Two `typedef` types with the same underlying type are nevertheless distinct.

### Alignment

Every type has an *alignment requirement*: a positive integer power of two. An object of a given type must be stored at an address that is a multiple of the type's alignment requirement. The alignment of a type is available at compile time through its `::alignment` property.

C3 distinguishes between *ABI alignment* — used when a type appears as a struct field, array element, or function parameter — and *alloca alignment* — used when a type is allocated as a local or global variable. For most types these are identical.

Alignment depends on the platform and the ABI compiled for. However, some types are derived from others, and their alignment is given below

* **`bool`**: alignment is same as `char`
* `typeid`, `iptr`, `uptr`, `fault`, `any`, interface types: alignment is the same as for `void*`
* **`void`**: 1 byte.
* **Array types**: the alignment of the element type.
* **Slice types**: `max(alignof(void*), alignof(sz))`, equal to the pointer alignment on all supported platforms.
* **Plain vector types** (ABI — embedded in struct or array, or passed as argument): the alignment of the element type, identical to the corresponding array type.
* **Plain vector types** (alloca — as a local or global variable): same as the *SIMD aligned vector type*
* **Struct types**: the maximum alignment of any field. Fields are laid out in declaration order with padding inserted between adjacent fields as needed; trailing padding is added after the last field so that the total size is a multiple of the struct's alignment.
* **Union types**: the maximum alignment of any field. The size of a union is the size of its largest field, rounded up to the nearest multiple of the union's alignment. Fields share storage at the same address with no inter-field padding.
* **Bitstruct types**: the alignment of the backing type, unless overridden by `@align`.
* **Enum and constdef types**: the alignment of the backing integer type.
* **Optional types (`T?`)**: the alignment of `T`. An optional type has the same size as `T`; the optional status is tracked separately and does not affect storage.
* **Typedef and alias types**: the alignment of the underlying or aliased type.

The `@align(n)` attribute raises the alignment of a struct, union, bitstruct, variable, or function to at least `n`, where `n` must be a compile-time constant power of two. Alignment may only be increased, not decreased. To reduce per-member alignment, `@packed` sets all member alignments to 1; a subsequent `@align` may then restore the aggregate's overall alignment.

### Assignability

A value of type Va is *assignable* to a target of type Ty — for example, the right-hand side of an assignment, the initializer of a variable, an argument in a function call, or a value returned from a function — when any of the following holds:

1. Va is identical to Ty.
2. Va is a numeric literal whose value is representable in Ty, where Ty is a numeric type or a `typedef` or `constdef` of a numeric type with `@constinit` declared.
3. Va is the literal `null` and Ty is a pointer type.
4. Va is `void*` and Ty is any pointer type, or vice versa.
5. Va is any non-`void*` pointer and Ty is `void*`.
6. Va is any pointer type and Ty is `any`.
7. Va is an interface type and Ty is `any`.
8. Va is a numeric expression and Ty is a wider numeric type, subject to the rules in *Implicit widening*.
9. Va is a numeric expression and Ty is a narrower numeric type, subject to the rules in *Implicit narrowing*.
10. Va is a struct value or pointer with an inline member of type Ty (transitively), subject to the rules in *Substruct conversions*.
11. Va is a pointer to a value whose type implements interface Ty.
12. Va is an interface type that extends Ty (Ty is a parent interface of Va).
13. Va is a `typedef` declared `inline` and Ty is its underlying type.
14. Va is a `constdef` with a backing type declared `inline` and Ty is that backing type.
15. Va is a vector type and Ty is the corresponding array type with the same element type and length, or vice versa.
16. Va is a slice type and Ty is `void*` or a pointer to the element type of Va.

Outside these cases, conversion requires an explicit cast.

### Common arithmetic promotion

Before arithmetic, the operands of an arithmetic operation are *promoted* according to the following rules:

* A floating-point operand of width less than 32 bits is promoted to `float`.
* An integer operand narrower than the *arithmetic promotion width* is promoted to an integer of the same signedness with that width.

The arithmetic promotion width is the width of a C `int` on the target platform. This is currently 32 bits on all supported target platforms.

### Maximum type

When two operands of different numeric types appear in an operation that returns a single value, a *maximum type* is computed:

1. Both operands undergo common arithmetic promotion.
2. If the promoted types are identical, the maximum type is that type.
3. If one is floating-point and the other is integer, the maximum type is the floating-point type.
4. If both are floating-point, the maximum type is the wider type.
5. If both are integer with the same signedness, the maximum type is the wider type.
6. If both are integer with different signedness, the maximum type is determined by precedence in the list `ichar`, `char`, `short`, `ushort`, `int`, `uint`, `long`, `ulong`, `int128`, `uint128`; the operand later in the list wins.

If neither operand is a numeric type but at least one is a struct, or a pointer to a struct, with an `inline` member, the rules are applied recursively to the inline member's type. Other combinations have no defined maximum type.

### Implicit widening

A numeric expression implicitly converts to a wider numeric type only when it is a *simple expression*. An expression is *simple* if its value is invariant under the choice of evaluation width — that is, widening its operands and then evaluating yields the same result as evaluating at the source width and then widening. Non-simple expressions require an explicit cast to widen.

When the target is a wider **integer** type, the non-simple forms are:

* Binary `+`, `-`, `*` — integer overflow at the source width gives a different value than at the wider width.
* Binary `<<` and `>>` — bits shifted past the source width are lost, and sign extension depends on the source width.
* Unary `-` — negating the minimum signed integer overflows at the source width but is well-defined at a wider width.
* Unary `~` — the high-order bits of the complemented value depend on the source width.

When the target is a **floating-point** type, the non-simple forms are:

* Binary `+`, `-`, `*` — integer overflow at the source width changes the value before conversion.
* Binary `/` — integer division and floating-point division produce different values.
* Unary `-` — same corner case as for integer targets.

A binary expression bitwise `|`, `&`, `^`, the operators `%`, `??`, and (for integer targets) `/` are simple as long as their sub expressions are simple.

A ternary expression `cond ? a : b` is non-simple if either branch `a` or `b` is non-simple. Binary expressions bitwise `&`, `|`, `^`, All other expressions are simple, including identifiers, literals, function calls, member access, subscripts, comparisons, logical operators, assignment expressions and the unary operators `+`, `!`, `++`, `--`, `*` (dereference), and `&` (address-of).

Within simple expressions, the widening conversion itself is further restricted by signedness:

* Signed → wider signed: allowed.
* Unsigned → wider unsigned: allowed.
* Unsigned → wider signed: allowed (the unsigned range always fits).
* Signed → unsigned: never allowed implicitly, regardless of size; requires an explicit cast.
* Integer → float, or float → wider float: allowed.

Same-size conversions between types of different signedness (e.g., `int` → `uint`) are not widening and are not permitted implicitly.

### Implicit narrowing

A numeric expression may implicitly convert to a *narrower* target type through a recursive structural analysis. The compiler walks the expression tree and verifies that every contributing value is already narrow enough to fit in the target type.

The traversal rules are:

* **Arithmetic and bitwise operators** (`+`, `-`, `*`, `/`, `%`, `|`, `^`, `&`, `??`): both operands are checked recursively; narrowing succeeds only if all operands pass.
* **Shift operators** (`<<`, `>>`): only the left operand is checked; the right operand does not affect the result type.
* **Assignment operators**: only the left operand is checked.
* **Comparison and logical operators** (`==`, `!=`, `<`, `<=`, `>`, `>=`, `&&`, `||`): always succeed; these produce `bool`.
* **Unary operators** (`+`, `-`, `~`, `++`, `--`): the operand is checked recursively.
* **Integer and float constants**: succeed if the constant value fits in the target type.
* **Widening casts**: if the cast source type is directly compatible with the target (see below), the check succeeds; otherwise the inner expression is checked recursively.
* **All other expressions** (identifiers, calls, subscripts, etc.): succeed only if the expression's own type is *compatible* with the target type U:
  * Both types are identical.
  * Both are signed integers, and the source is no wider than U.
  * Both are unsigned integers, and the source is no wider than U.
  * Both are floats, and the source is no wider than U.
  * The source is an unsigned integer and U is a signed integer of **strictly** greater width.
  * Any other combination — including any signed-to-unsigned conversion — fails and requires an explicit cast.

### Substruct conversions

A struct may declare an `inline` member, which establishes a *subtype* relation between the struct and the inline member's type:

* A pointer to the substruct implicitly converts to a pointer to the inline member's type.
* A substruct value implicitly assigns to a variable of the inline member's type; the assignment copies only the inlined portion.
* The inverse conversions — from a value of the inline member's type to the substruct — are not implicit.
* Conversions between an array or slice of substructs and an array or slice of the inline member's type are not permitted, even by explicit cast.

These rules apply transitively through chains of inline members.

### Vector conversions

A vector type implicitly converts to and from an array type with the same element type and length. All other vector conversions require an explicit cast.

When a boolean vector value is cast to a vector with integer element type, each `true` element yields a value with all bits set and each `false` element yields zero.

### Casts

An explicit cast `(type)expression` produces a value of the specified type. A cast is permitted when any of the following holds:

* The source and target are numeric types.
* The source and target are pointer types.
* The source is a pointer type and the target is an integer type able to hold a pointer, or vice versa.
* The source and target are vector and array types with the same element type and length.
* The source and target differ only by chains of `typedef` and alias.
* The source is an interface type and the target is `any`, or vice versa.

A cast between numeric types whose result is not representable in the target type has implementation-defined behaviour.

### Method sets

Every named type has a *method set*: the set of methods declared on that type. A method is declared by attaching a type name to the function name in a function declaration; see *Functions and methods*.

The method set of a `typedef` is distinct from the method set of the type from which it derives. A type alias shares the method set of the type it names.

A struct with an `inline` member makes the methods of the inline member's type accessible through values of the enclosing struct.

### Method extension on built-in types

A method may be declared on any named type, including a built-in type. The method name is qualified by the type name in the declaration:

```
fn int int.double_it(int self) { return self * 2; }
```

A method extension on a built-in type is visible according to the same module visibility rules as any other declaration.

### Operator overloading

A method or macro method may participate in operator overloading by carrying an `@operator` attribute with one of the following arguments: `[]`, `&[]`, `[]=`, `len`, or one of the operators `+`, `-`, `*`, `/`, `%`, `^`, `|`, `&`, `<<`, `>>`, `==`, `<`. The variant attributes `@operator_s` and `@operator_r` apply to binary operators between two distinct types and produce symmetric and reverse forms respectively.

Restrictions:

* Arithmetic and bitwise operator overloads are permitted only on user-defined types.
* A bitstruct type may not overload `^`, `|`, or `&`, since these are predefined on bitstructs.
* Defining `+` implicitly defines `+=`, and similarly for the other arithmetic operators; an explicit overload of the compound-assignment form takes precedence when present.
* Defining `==` implicitly defines `!=`. Defining `<` together with `==` defines the full set of ordering operators `<`, `<=`, `>=`, `>`, `==`, `!=`.

Overload resolution proceeds as follows:

1. If an overload exactly matches the operand types, that overload is selected.
2. Otherwise, if exactly one overload matches after applying implicit conversions to the non-self operand, that overload is selected.
3. Otherwise, the operation is ambiguous and a compile-time error is reported.

## Blocks and scope

C3 source text is organized into nested *blocks*. Each block introduces a *scope* — a region of program text in which a declaration is visible. C3 distinguishes runtime blocks and compile-time blocks; the two form independent scope structures within any function or macro body.

### Runtime blocks

A runtime block is a brace-delimited sequence of declarations and statements:

```
runtime_block ::= "{" (declaration | statement)* "}"
```

Runtime blocks appear as the bodies of functions and macros and as compound statements within those bodies. Each runtime block introduces a nested runtime block scope.

### Compile-time blocks

A compile-time block is the body of a compile-time control structure. Compile-time blocks are not brace-delimited; each is opened by a `$`-prefixed keyword and closed by the matching `$end` keyword. For example:

```
$if FEATURE_X:
    int x = compute_x();
$endif
```

The full set of compile-time control structures — `$if`, `$else`, `$for`, `$foreach`, `$switch`, `$case`, `$default`, and related forms — and their precise grammar are given in *Statements*. Each compile-time block introduces a nested compile-time block scope.

A compile-time block may itself contain runtime declarations and statements as well as further compile-time blocks; conversely a runtime block may contain compile-time blocks. The two structures interleave freely in the source text but track their scopes independently.

### Scopes

A scope is a region of program text in which a declaration is visible. C3 has four kinds of scope:

**Module scope.** Module-level declarations — global variables, functions, types, constants, and macros — are visible throughout every section of the module in which they appear, regardless of textual position. Mutually recursive functions therefore require no forward declarations. Visibility across module boundaries is subject to the visibility rules described in *Modules*.

**Function scope.** Each function or macro body forms a single function scope. The function scope contains all labels declared in the body; a label is visible throughout the entire body, from the beginning of the body, regardless of where the label appears textually.

**Runtime block scope.** Each runtime block introduces a runtime block scope. A name declared within a runtime block is visible from the point of its declaration to the closing brace of the enclosing runtime block. A declaration is not visible above itself in the same block. Runtime block scopes nest in textual order and may shadow declarations in outer runtime block scopes and at module scope.

**Compile-time block scope.** Each compile-time block introduces a compile-time block scope. A compile-time variable is visible from the point of its declaration to the close of its enclosing compile-time block. If no compile-time block encloses a compile-time variable, its scope extends to the end of the function or macro body. Compile-time variables may not be declared at module scope.

The runtime block scope structure and the compile-time block scope structure are independent: the boundaries of a runtime block do not end the scope of a compile-time variable, and the boundaries of a compile-time block do not end the scope of a runtime variable.

### Module sections

Each `module` declaration in source code opens a *module section*. A single file may contain multiple sections, including sections for different modules, and a single module may span multiple files and multiple sections within each file.

```
module_section   ::= "module" path module_attributes? ";"
module_attributes ::= ("@private" | "@local" | "@public" | "@if" "(" expression ")" | generic_params)+
generic_params   ::= "<" generic_param ("," generic_param)* ">"
generic_param    ::= TYPE_IDENT | CONST_IDENT
```

A module section may carry attributes that apply as defaults to every declaration within the section:

* `@private` — declarations are `@private` by default; visible only within the same module.
* `@local` — declarations are `@local` by default; visible only within the same file.
* `@public` — declarations are `@public` by default; used to restore public visibility within a file whose other sections declare a more restrictive default.
* `@if(cond)` — declarations are conditionally compiled under `cond`, evaluated at compile time.
* `<Ty>`, `<Ty, Tu>`, `<Ty, VALUE>`, ... — opens a *generic module section* in which every supported declaration is parameterized over the listed parameters. A type parameter is a `TYPE_IDENT`; a compile-time value parameter is a `CONST_IDENT`. Declaration kinds that cannot be made generic, such as `faultdef`, may not appear in a generic section.

Multiple attributes may be combined on a single section. Within a section, an individual declaration may override the section default — for example, `@public` on a declaration reverses a section default of `@private`.

The imports declared in a section are visible only within that section. A later section of the same module, even in the same file, does not inherit those imports and must re-import as needed.

Because module sections are not bound to a single file or author, a user may extend an existing module by opening a new section of the same name elsewhere. The new section's declarations join the module under the standard visibility rules, subject to any default attributes the section declares.

### Name spaces

C3 maintains several syntactically distinct *name spaces*. Because the token kind of an identifier encodes its category, different name spaces may share the same textual name without ambiguity:

* *Ordinary identifiers* (`IDENTIFIER`): functions, variables, parameters, and macros.
* *Type names* (`TYPE_IDENT`): user-defined types.
* *Constant names* (`CONST_IDENT`): named constants.
* *Compile-time identifiers* (`CT_IDENT`, `CT_TYPE_IDENT`): compile-time variables and compile-time type variables.
* *Labels* (`CONST_IDENT` in label position): a name space separate from ordinary identifiers, type names, and constant names; scoped to the enclosing function body.
* *Struct and union members*: each struct and union has its own name space for its members, disambiguated by the type of the object being accessed.

A declaration in one name space does not conflict with a declaration of the same text in another.

### Scope nesting and shadowing

Scopes nest. An identifier visible in an outer scope may be *shadowed* by a declaration of the same identifier in an inner scope. Within the inner scope, the identifier designates the inner entity; the outer declaration is hidden until the inner scope ends.

```
fn void f()
{
    int x = 1;
    {
        int x = 2;   // shadows outer x
    }
    // outer x is 1 here again
}
```

A local variable may shadow a module-scope declaration of the same name. Shadowing operates within a single scope dimension; a runtime declaration and a compile-time declaration with the same textual name do not interact, as they occupy distinct name spaces (`IDENTIFIER` vs `CT_IDENT`).

### Storage duration and scope

The scope of a local variable (the region in which it is accessible by name) is distinct from its *storage duration* (the span for which its storage persists). A local variable's scope ends at the closing brace of the runtime block in which it is declared, but its storage remains valid for the entire lifetime of the enclosing function call. A pointer to a local variable therefore remains valid anywhere within the same function call, even after the variable's name has gone out of scope. The full rules for storage duration are given in *Variables*.

### Labels

A label names a statement as a target for `break`, `continue`, and `nextcase`. Unlike C, a label is not a separate statement form that prefixes another statement; it is part of the syntax of the statement it names, written as `LABEL:` between the statement's introducing keyword and the rest of the statement. For example:

```
if FOO: (x > 0) { ... }
```

A label is a `CONST_IDENT`. The set of statements that may carry a label is fixed: `if`, `while`, `do`, `switch`, and `foreach`. Compile-time control structures do not support labels.

Labels have function scope: a label is visible throughout the entire body of the function or macro in which it appears, from the beginning of the body, and may therefore be referenced before its textual position. A label may not shadow another label in the same function.

## Declarations

A *declaration* binds an identifier to an entity such as a variable, a constant, a type, a function, a macro, a fault value, or an alias. C3 distinguishes the following kinds of declaration:

- *Variable declarations* — globals, extern globals, thread-local globals, local variables, static local variables, and compile-time variables. See *Variables*.
- *Constant declarations* — typed and untyped named constants. See *Constants*.
- *Type declarations* — struct, union, bitstruct, enum, constdef, typedef, and interface declarations. See *Types*.
- *Function declarations* and *method declarations*. See *Functions and methods*.
- *Macro declarations*. See *Macros*.
- *Import declarations* — bringing the entities of another module into the current section. See *Modules*.
- *Attribute definitions* — introducing user-defined attributes. See *Attributes*.
- *Alias declarations* and *fault value declarations*, described in this chapter.

Type declarations, function declarations, method declarations, macro declarations, alias declarations, fault value declarations, attribute definitions, and import declarations may appear only at module scope. Variable and constant declarations may appear at module scope or within a function or macro body, with the additional restrictions given in *Variables* and *Constants*. Compile-time variables may appear only within a function or macro body.

Every declaration may carry attributes. The set of attributes recognized for a declaration depends on the declaration kind and is described in *Attributes*.

### Alias declarations

An *alias declaration* introduces an additional name for an existing entity. An alias does not introduce a new type, function, value, module, or macro; it provides an alternative name through which the same entity may be referred. C3 distinguishes three forms of alias declaration, differing in what may be aliased and in the form of the right-hand side.

#### Type aliases

A *type alias* gives an existing type an additional name. The aliased type may be any type expression, including a generic instantiation or a compile-time type expression.

```
alias_type_decl ::= "alias" TYPE_IDENT generic_decl? attributes? "=" type_expr ";"
```

A type alias does not introduce a new type and does not have its own method set; references through the alias are equivalent to references through the underlying type's name. A type alias may not independently implement interfaces.

A type alias may itself be generic, by including a `generic_decl` parameter list between the alias name and the `=`. The parameters are in scope on the right-hand side. For example:

```
alias IntList = List{int};
alias Stack {Ty} = List{Ty};
```

#### Module aliases

A *module alias* introduces an alternate name for a module.

```
module_alias_decl ::= "alias" IDENTIFIER attributes? "=" "module" module_path ";"
```

A module alias may be used wherever a module path is expected, including in `import` declarations and in qualified-name expressions.

#### Identifier, constant, and macro aliases

The remaining alias forms introduce a new name for an ordinary identifier (a function or global variable), a constant identifier (a named constant or fault value), or an `@`-prefixed identifier (a macro or user-defined attribute):

```
alias_decl     ::= "alias" alias_name generic_decl? attributes? "=" alias_source ";"
alias_name     ::= IDENTIFIER | CONST_IDENT | AT_IDENT
alias_source   ::= (path? IDENTIFIER | path? CONST_IDENT | path? AT_IDENT) generic_parameters?
```

The lexical kind of `alias_name` must match the lexical kind of `alias_source`:

- An `IDENTIFIER` alias refers to a function, macro or global variable.
- A `CONST_IDENT` alias refers to a named constant or a fault value.
- An `AT_IDENT` alias refers to a macro.

The optional `generic_parameters` on the right-hand side instantiates a generic target, producing a non-generic alias. The optional `generic_decl` on the left-hand side declares the alias itself as generic; its parameters are in scope on the right-hand side.

### Fault value declarations

A *faultdef* declaration introduces one or more named values of the built-in type `fault`.

```
faultdef_decl    ::= "faultdef" fault_definition ("," fault_definition)* ","? ";"
fault_definition ::= CONST_IDENT attributes?
```

Each `fault_definition` introduces a distinct value of type `fault`. The values are visible at module scope and obey the standard visibility rules. Each fault value may carry its own attributes. A trailing comma after the last `fault_definition` is permitted.

A faultdef does not introduce a new type — all values declared by `faultdef` have type `fault`, and any fault value from any module is comparable and assignable to a `fault`-typed variable.


## Expressions

An *expression* computes a value, possibly with side effects. Some expressions, including calls to functions returning `void`, have no value.

### Operands

An operand denotes an elementary value in an expression. An operand is a literal, a named entity, a parenthesized expression, a compound literal, a type access expression, a compile-time access expression, or a lambda.

```
operand ::= literal
          | path? entity_name
          | "(" expression ")"
          | compound_literal
          | type_access_expr
          | builtin_expr
          | lambda_expr
entity_name ::= IDENTIFIER | CONST_IDENT | TYPE_IDENT
              | CT_IDENT | CT_TYPE_IDENT | HASH_IDENT
              | AT_IDENT
              | BUILTIN_CONST | "null" | "true" | "false"
path        ::= IDENTIFIER ("::" IDENTIFIER)* "::"
```

Literals are described in *Constants*. A path-prefixed name resolves through the module path; an unprefixed name resolves through the current section's import set as described in *Modules*. The lexical kind of the identifier (`IDENTIFIER`, `CONST_IDENT`, `TYPE_IDENT`, etc.) determines the kind of entity referenced; when more than one entity could match a textual name, ambiguity is resolved by additional path qualification.

A parenthesized expression has the same value, type, and lvalue-ness as the enclosed expression. Parentheses do not introduce a new scope.

### Compound literals

A *compound literal* constructs a value of an aggregate type — struct, union, array, slice, vector, or bitstruct — from a brace-enclosed list of elements. The form follows C99 designated initializers, with three extensions: *range initializers*, *vector swizzles*, and *struct splatting*. C3 is stricter than C99 in one respect: positional and designated elements may not be mixed in a single literal.

```
compound_literal     ::= "(" type ")" initializer_list
                       | initializer_list
initializer_list     ::= "{" "}"
                       | "{" designated_form ","? "}"
                       | "{" positional_form ","? "}"
designated_form      ::= ("..." expression ",")? designated_element ("," designated_element)*
positional_form      ::= positional_element ("," positional_element)*
designated_element   ::= designator_path ("=" expression)?
positional_element   ::= expression
                       | "..." expression
designator_path      ::= designator_step+
designator_step      ::= "." IDENTIFIER
                       | "[" expression "]"
                       | "[" expression ".." expression "]"
```

The parenthesized type prefix is required when the type cannot be inferred from context; otherwise the type is inferred from the surrounding context.

A range designator step `[a..b]` may appear only as the *last* step of a designator path; preceding steps must be `.field` or `[index]`. So `.bar.x[0..1] = 3` is well-formed, but `[0..1].field = 3` is not.

#### Element kinds

An initializer list takes one of two forms:

* A **designated form**, optionally preceded by a single splat, followed by one or more designated elements.
* A **positional form**, consisting of expressions and splats in any order.

Mixing the two forms in a single literal is a compile error.

In a *positional* list, each expression initializes the corresponding member or position in source order. The number of elements must not exceed the number of positions; unspecified trailing positions are zero-initialized.

In a *designated* list, each element specifies its target by a designator path made of one or more steps:

- `.field` selects a struct, union, or bitstruct member.
- `[index]` selects an array, slice, or vector position.
- `[a..b]` selects the inclusive range of positions `[a, b]` of the enclosing array, slice, or vector. The range form may appear only as the last step of the path. The right-hand value is evaluated once and broadcast to each position.

A path may chain steps to reach a nested target: `.outer.inner = expression`, `[0].field = expression`, `.bar.x[0..1] = expression`.

A *vector swizzle initializer* `.xy = expression`, `.xyz = expression`, `.yz = expression`, etc., initializes consecutive components of a vector. The component names must be **ordered and contiguous**: `.xy`, `.yz`, `.xyzw` are valid; `.yx` (reversed) and `.xz` (non-contiguous) are not. A swizzle is lowered to the equivalent range initializer.

A designator may appear without `= expression`, in which case the designated target is set to a default appropriate to its type (for example, `true` for a one-bit bitstruct field). This shorthand is rarely needed.

Designators may appear in any order. Positions not initialized by any element are zero-initialized. If two elements initialize the same position, the one appearing later in the literal supersedes the earlier one.

A union literal contains exactly one designated initializer naming the active member.

#### Splat

A *splat* element has the form `...expression`. Its meaning depends on the surrounding form:

* In a **designated form**, exactly one splat is permitted, and it must precede every designated element. The splatted expression must be of the same type as the initializer. Its values become the defaults for every member or position of the result; subsequent designators override individual targets.

* In a **positional form**, any number of splats may appear in any position. Each splat expands to the elements of its operand in order, contributing them as positional values. For example, if `b` has length 2 and `d` has length 3, then `{ a, ...b, c, ...d }` is equivalent to `{ a, b[0], b[1], c, d[0], d[1], d[2] }`.

Splats may not appear in a literal that mixes positional and designated elements (which is itself forbidden).

The special form `...$vaarg`, valid only inside a macro body, splats the macro's variadic arguments. It is **always** a positional splat regardless of context, expanding each variadic argument as a positional element; using it in an initializer list therefore makes that list a positional form, and any designators in the same list are rejected by the no-mixing rule.

#### Evaluation order

Elements are evaluated in the order they appear in the literal, regardless of the position they initialize. For example, in `{ [1] = foo(), [0] = bar() }` the call `foo()` is evaluated before `bar()`.

### Primary expressions

A *primary expression* is built from an operand by zero or more postfix operations: member access, subscript, slice, function or method call, macro invocation, generic instantiation, optional propagation, and postfix increment or decrement.

```
primary_expr ::= operand
               | primary_expr "." access_ident
               | primary_expr "[" expression "]"
               | primary_expr "[" range_expr "]"
               | primary_expr generic_arguments
               | primary_expr "(" argument_list? ")" trailing_macro_block?
               | primary_expr "++"
               | primary_expr "--"
               | primary_expr "!"
               | primary_expr "!!"
               | primary_expr "~"
access_ident ::= IDENTIFIER | CT_IDENT | CONST_IDENT | AT_IDENT | eval_expression
generic_arguments ::= "{" type_or_value ("," type_or_value)* "}"
range_expr   ::= range_loc? (".." | ":") range_loc?
range_loc    ::= "^"? expression
```

#### Member access

The expression `a.b` accesses the member `b` of the aggregate value or pointer `a`. If `a` has pointer-to-aggregate type, the pointer is implicitly dereferenced. The result has the member's declared type and is addressable if and only if `a` is addressable (or if `a` is a pointer).

The right-hand `access_ident` may be an `IDENTIFIER` (struct field, method, or property), a `CONST_IDENT` (nested constant), an `AT_IDENT` (method-style macro), an `eval_expression` or a `CT_IDENT`.

In the case of an `eval_expression`, the resolved string expression will be resolved to an `IDENTIFIER`, `CONST_IDENT` or `AT_IDENT`.

In the case of a `CT_IDENT`, two cases exist: (1), the identifier contains a string. In this case behaviour is identical to using `eval($ident)`. (2) the identifier contains a reflected member. In this case it is as if on was to use `eval($ident.name)`, except it also will work on anonymous inner structs and unions that do not have a name. 

#### Subscript

The expression `a[i]` selects the element at index `i`. The operand `a` must be an array, slice, vector, pointer, or a type that overloads the subscript operator. The index `i` must have integer type, or `^expr` to count from the end of the operand (valid for arrays, slices, and vectors of known length).

In safe builds, an out-of-range index traps. In fast builds, the behaviour is undefined.

#### Slicing

The expression `a[i..j]` produces a slice over the inclusive index range `[i, j]` of the operand. The expression `a[i:n]` produces a slice of length `n` starting at index `i`. Either bound may be omitted to mean "from the beginning" or "to the end", and either may be expressed as `^expr` to count from the end. The result has type `S[]` where `S` is the element type of the operand.

The special case `j = i - 1` in the `i..j` form, and the special case `n = 0` in the `i:n` form, both yield a valid empty slice. For example, `a[1..0]` and `a[1:0]` are well-formed and produce an empty slice; the bound `i` may equal the length of the operand in these cases (one past the last element).

#### Generic instantiation

The expression `g{Ty, Tu, value}` instantiates a generic entity `g` with the given type and value arguments. The result is a non-generic entity that may be used directly or further composed with calls or member access. Generic arguments may be types (`TYPE_IDENT`) or compile-time expressions matching the generic's value parameters.

#### Calls

A call invokes a function, a method, or a macro:

```
argument_list ::= argument ("," argument)* ","?
argument      ::= expression
                | "..." expression
                | IDENTIFIER ":" "..."? expression
                | "." IDENTIFIER "=" expression
trailing_macro_block ::= AT_IDENT ("(" parameter_list? ")" )? compound_statement
```

Arguments may be supplied positionally, by name (`name: expression`), or by struct-field-style designator (`.field = expression`) for arguments of aggregate type. A `...expression` spreads a slice, array, or compile-time list into the variadic part of the parameter list. Named and designated arguments may appear in any order; positional arguments must come before them.

Each argument is converted to the corresponding parameter's declared type using the rules described in *Assignability*.

A macro call may carry a *trailing macro block* — a function-literal-like body attached after the parenthesized argument list. The trailing block becomes available inside the macro under the parameter name introduced after the closing parenthesis. The detailed rules are given in *Macros*.

The result type of a call is the function's, method's, or macro's return type. A call producing an optional propagates that optional status to the surrounding expression (see *Optional propagation*).

#### Postfix `++` and `--`

The expressions `lvalue++` and `lvalue--` increment and decrement `lvalue` by one and yield the value before the modification. The operand must be an addressable expression of integer, floating-point, or pointer type. For pointer operands, the change is by one element.

#### Optional propagation

The postfix operators `~`, `!`, and `!!` operate on optionals:

* `expression~` converts a fault value into an optional carrying that fault as its excuse. The operand must be of type `fault`. The result has type `void?` and represents an optional that fails with the given fault.
* `expression!` evaluates the operand; if the operand is a successful optional, the result is its underlying value, and if the operand carries a fault, the enclosing function returns immediately with that same fault, propagating the optional. The operand must have optional type and the enclosing function must be allowed to return that optional.
* `expression!!` evaluates the operand; if the operand is successful, the result is the underlying value, otherwise the program traps. Force-unwrapping should be reserved for cases where the failure carrier is statically known to be unreachable.

### Type access expressions

A type access expression uses `::` to select a member of a type rather than a value:

```
type_access_expr ::= type "::" access_ident
```

Examples include `Foo::SIZE` (a named constant on a type), `Foo::typeid` (the type's runtime type identifier — see *Properties of types and values*), and `Foo::alignment`. The set of accessible names depends on the type and is described in *Properties of types and values*.

### Compile-time access expressions

A compile-time access expression denotes a value or type known at compile time:

```
ct_arg_expr      ::= "$vaarg" ("[" range_expr "]")?
ct_analyze_expr  ::= ct_analyze_op "(" expression ")"
ct_defined_expr  ::= "$defined" "(" ct_defined_check ("," ct_defined_check)* ")"
ct_feature_expr  ::= "$feature" "(" CONST_IDENT ")"
ct_analyze_op    ::= "$eval" | "$reflect" | "$stringify" | "$expand"
ct_defined_check ::= expression
                   | type IDENTIFIER ("=" expression)?
```

The semantics of these forms are described in *Compile-time evaluation* and *Reflection*. Each operand of `$defined` is either an expression (well-formed if a value of that form would be valid) or a candidate local variable declaration (well-formed if such a declaration would be valid).

### Unary operators

```
unary_expr ::= unary_op expression
unary_op   ::= "+" | "-" | "!" | "~" | "*" | "&" | "&&" | "++" | "--" | "(" type ")"
```

* `+e` performs integer promotion: integer operands narrower than the platform `int` are promoted to `int` (with the corresponding signedness); operands of `int` or wider, and operands of floating-point or vector type, are returned unchanged. The operand must be of numeric or vector type. The result type may therefore differ from the operand type for narrow integers.
* `-e` is the arithmetic negation of `e`; its operand must be of integer, floating-point, or vector type. Signed integer negation wraps on overflow (it is defined to wrap, not undefined).
* `!e` is the logical negation of `e`; its operand must be of boolean type.
* `~e` is the bitwise complement of `e`; its operand must be of integer or vector type.
* `*p` is the value pointed to by `p`; `p` must be of pointer type, and may not be `void*`.
* `&v` is the address of `v`; the operand must be addressable (an lvalue), and the result has the type "pointer to the operand's type".
* `&&e` is a *temporary address*: it materializes the value of `e` in a fresh storage location whose lifetime extends to the end of the enclosing full expression, and yields a pointer to that location. The operand need not be addressable.
* `++lvalue` and `--lvalue` increment and decrement `lvalue` by one and yield the value after the modification. The operand must be addressable, of integer, floating-point, or pointer type.
* `(type) expression` is an explicit cast — see *Conversions*.

The unary operators have higher precedence than any binary operator. Postfix operations (member access, subscript, call, optional propagation, postfix `++`/`--`) have higher precedence than the prefix unary operators.

### Binary operators

Binary operators combine two operands and produce a value of a determined type. The table below lists operator categories in **decreasing order of precedence**; operators in the same row have equal precedence. All binary operators are left-associative except where noted.

```
Precedence     Category               Operators
-------------- ---------------------- ------------------------------------
14 (highest)   Primary                literals, names, parenthesised expr
13             Postfix                . () [] ++ -- !! ! ~
12             Unary (prefix)         ! - + ~ * & && ++ -- (type)
11             Multiplicative         *   /   %
10             Shift                  <<  >>
 9             Bitwise                &   |   ^
 8             Or-else / Elvis        ?:  ??
 7             Additive               +   -   +++
 6             Relational             <  <=  >  >=  ==  !=
 5             Logical AND            &&  &&&
 4             Logical OR             ||  |||
 3             Ternary                ? :                      (right-assoc)
 2             Assignment             =  +=  -=  *=  /=  %=
                                      &=  |=  ^=  <<=  >>=    (right-assoc)
 1 (lowest)
```

The compile-time variants `+++`, `&&&`, and `|||` sit at the same precedence levels as their runtime counterparts; they operate on compile-time-known operands (see *Compile-time evaluation*).


Although the precedence table determines the parse of every well-formed expression, certain combinations of operators are nevertheless rejected as ambiguous to read. The three operator groups below are subject to the check:

* *Group 1* — binary bitwise operators: `&`, `|`, `^`.
* *Group 2* — relational and equality operators: `==`, `!=`, `<`, `<=`, `>`, `>=`.
* *Group 3* — shift operators: `<<`, `>>`.

If the operands of a binary expression with an operator in one of these groups are themselves binary expressions with an operator from the *same* group, the program is ill-formed. Parentheses must be used to make the intended grouping explicit.

The check applies one level deep on each side of the offending operator. A subexpression separated from the operator by an operator outside the group is not subject to the check.

An exception applies in *Group 1* only: chaining the *same* bitwise operator on both sides is permitted, since the result is invariant under associativity. The other two groups have no such exception.

Examples:
```
// Well-formed
a & b == 3                    // & is group 1, == is group 2 — different groups
a == b << 4                   // == is group 2, << is group 3 — different groups
a & b & c                     // same operator in group 1 — permitted exception
// Ill-formed
a & b | c                     // & and | both in group 1, different operators
a == b != c                   // both in group 2
a << b << c                   // same shift operator, but group 3 has no exception
a < b == c                    // both in group 2
```

The rule is purely syntactic and does not depend on the types or values of the operands; it is checked after parsing and before further semantic analysis. Parenthesising either side suppresses the diagnostic: `(a & b) | c` and `a & (b | c)` are both well-formed.

This precedence order differs from C in several places:

* Shift binds **tighter** than additive. `a + b >> c` parses as `a + (b >> c)`.
* Bitwise `&`, `|`, `^` are all at one precedence level, between shift and or-else, **tighter** than relational. `a & b == c` parses as `(a & b) == c`.
* The or-else operators `??` and `?:` sit between bitwise and additive, **tighter** than additive. `a + b ?? c` parses as `a + (b ?? c)`.
* Relational and equality share one level (in C they are two levels).

For an operator `op` and operands `a`, `b`, the expression `a op b` is well-typed if `a` and `b` are of types compatible with `op` and with each other, according to the rules below.

#### Arithmetic operators

The arithmetic operators `+`, `-`, `*`, `/`, `%`, when applied to two operands of integer or floating-point type, perform arithmetic at a common type determined by *arithmetic promotion* (see *Properties of types and values*). The operators `+` and `-` are also defined for pointer arithmetic: `p + i` and `p - i` add or subtract an integer-typed offset (in element units), and `p - q` of two pointers to the same element type yields a signed integer count of elements between them.

The arithmetic and bitwise operators are defined elementwise on vector types.

Signed integer overflow in `+`, `-`, `*`, and unary `-` wraps modulo `2ⁿ` where `n` is the operand width. Unsigned overflow wraps in the natural way. Division by zero in `/` or `%` on integer operands traps in safe mode and is undefined behaviour in fast mode. Floating-point division by zero, overflow, and other exceptional cases follow IEEE 754.

#### Shift operators

The operators `<<` and `>>` shift the left operand by the number of positions given by the right operand. Both operands must be of integer type. The right operand is interpreted as an unsigned count; shifting by a count greater than or equal to the bit-width of the left operand's type, or by a negative count, is undefined behaviour. Right shift of a signed integer is an arithmetic shift (sign extending); right shift of an unsigned integer is a logical shift.

#### Bitwise operators

The operators `&`, `|`, `^` perform bitwise AND, OR, and XOR on operands of integer or vector-of-integer type. All three share the same precedence level. The result has the common type of the operands after arithmetic promotion.

#### Or-else and Elvis operators

* `a ?? b` (the *optional-else* operator) evaluates `a`; if `a` is a successful optional, its underlying value is the result. Otherwise `b` is evaluated and is the result. The operand `a` must have optional type; `b` must be assignable to the underlying type of `a` (or itself be an optional with the same underlying type).
* `a ?: b` (the *Elvis* operator) evaluates `a`; if `a` is truthy, the result is `a` (after assignability conversion); otherwise `b` is evaluated and is the result. Both operands must be of types convertible to a common type.

Both operators short-circuit; `b` is evaluated only when needed.

#### Relational operators

The operators `<`, `<=`, `>`, `>=`, `==`, `!=` compare two operands and produce a value of type `bool`. They share a single precedence level. Comparison is defined for: numeric types (after arithmetic promotion), pointer types (with the usual address ordering), boolean types (with `false < true`), enum types (by ordinal), constdef and typedef types (per their underlying type), `fault` (by identity, for `==`/`!=` only), `typeid` (by identity, for `==`/`!=` only), and vector types (elementwise, yielding a vector of `bool`).

Two pointer values are equal if they point to the same object or are both `null`. Two slices are not directly comparable; use `slice.ptr` and `slice.len` if needed.

#### Logical operators

The operators `&&` and `||` apply to operands of type `bool`. They short-circuit: in `a && b` the operand `b` is evaluated only if `a` is `true`; in `a || b` the operand `b` is evaluated only if `a` is `false`. The result has type `bool`.

### Ternary expression

```
ternary_expr ::= expression "?" expression ":" expression
```

The expression `c ? a : b` evaluates `c`; if `c` is `true`, the result is `a`, otherwise `b`. The operand `c` must have type `bool`. The operands `a` and `b` must be of compatible types and convert to a common type. Exactly one of `a` and `b` is evaluated.

### Assignment expressions

```
assign_expr ::= lvalue assign_op expression
assign_op   ::= "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "&=" | "|=" | "^=" | "<<=" | ">>="
```

An assignment stores the right-hand value into the left-hand lvalue. The right-hand operand is converted to the type of the lvalue according to the *Assignability* rules. The result of the assignment is the new value of the lvalue. The lvalue must be addressable.

A compound assignment `lvalue op= expression` is equivalent in effect to `lvalue = lvalue op expression`, except that the lvalue is evaluated only once.

A `:=` form is not supported; new bindings are introduced by `var name = expression` or by a typed declaration (see *Variables*).

### Cast expressions

An explicit cast converts a value of one type to another. The grammar of a cast expression is `( type ) expression`.

A cast is permitted between any two types for which a conversion is defined; the list of permitted conversions and their semantics is given in *Casts*. A cast that adds information not present at runtime (for example, downcasting an `any` or an interface to a more specific type) may trap in safe mode if the runtime check fails.

### Constant expressions

A *constant expression* is an expression whose value can be determined at compile time. The expression must not depend on runtime state and may use only operators and operand forms with defined compile-time semantics. The complete rules are described in *Compile-time evaluation*. Constant expressions are required in contexts such as array sizes, the values of named constants, default parameter values, attribute arguments, and the conditions of `$if`, `$for`, and other compile-time control structures.

### Lambda expressions

A *lambda expression* introduces an anonymous function or macro:

```
lambda_expr       ::= "fn" return_type? fn_parameter_list attributes? lambda_body
lambda_body       ::= "{" statement* "}"
                    | "=>" expression
```

A lambda may capture compile-time values from the enclosing scope but not runtime variables. Its type is a function type. The full rules are given in *Functions and methods*.

### Order of evaluation

Evaluation of an expression is fully sequenced. Every operand is evaluated and its side effects are complete before any operand whose source position lies to its right, except where short-circuiting suppresses evaluation.

The rules are:

1. In a call, the called function, method, or macro expression is evaluated first; arguments are then evaluated in left-to-right source order.
2. In a binary operator, the left operand is evaluated and its side effects are complete before the right operand is evaluated. The short-circuiting operators (`&&`, `||`, `??`, `?:`) evaluate the right operand only when required.
3. In an assignment, the left-hand lvalue (including any subexpressions used to compute its address) is evaluated, and its address is fixed, before the right-hand operand is evaluated; the converted right-hand value is then stored.
4. In a compound literal, elements are evaluated in source order regardless of the position they initialize.
5. The postfix operators `++` and `--` read the operand, fix the expression's value as the value before modification, and write back the new value before the next operand of the surrounding expression is evaluated.
6. The ternary expression `c ? a : b` evaluates `c` first; depending on its value, exactly one of `a` and `b` is then evaluated.

Because of these rules, expressions in C3 have no order-of-evaluation undefined behaviour. Constructs that are undefined in C, such as `i = i++ + i++`, have a defined result in C3 determined by strict left-to-right evaluation.

## Statements

A *statement* directs the flow of execution within a function or macro body. Statements compose into sequences within blocks; each statement is terminated either by a semicolon or by the closing delimiter of a structured form.

```
statement ::= block_statement
            | local_declaration_statement
            | constant_declaration_statement
            | var_statement
            | expression_statement
            | if_statement
            | switch_statement
            | while_statement
            | do_statement
            | for_statement
            | foreach_statement
            | break_statement
            | continue_statement
            | nextcase_statement
            | return_statement
            | defer_statement
            | assert_statement
            | asm_block_statement
            | ct_statement
            | ";"
```

### Block statement

A *block statement* groups a sequence of statements into a runtime block scope (see *Blocks and scope*):

```
block_statement ::= "{" statement* "}"
```

The statements within a block are executed in source order. The block introduces a new runtime scope; local declarations within the block are visible from their point of declaration to the closing brace.

### Expression statement

An *expression statement* evaluates an expression and discards its value:

```
expression_statement ::= expression ";"
```

The expression's side effects are performed. If the expression has a non-`void` type, its value is discarded.

If the expression is a call to a function or macro whose return type is an optional, or to one that carries the `@nodiscard` attribute, discarding the result is a compile-time error. A function or macro that returns an optional but whose result is intended to be safely discardable may carry `@maydiscard` to suppress this check.

### Local declaration statements

A local declaration statement introduces a local variable, a static or thread-local variable, an inferred-type variable, or a local constant. The full syntax and semantics are in *Variables* and *Constants*.

```
local_declaration_statement   ::= local_storage? optional_type local_decl_after_type ("," local_decl_after_type)* ";"
local_storage                 ::= "static" | "tlocal"
local_decl_after_type         ::= IDENTIFIER attributes? ("=" expression)?
                                | CT_IDENT ("=" constant_expression)?
var_statement                 ::= "var" (IDENTIFIER attributes? "=" expression
                                       | CT_TYPE_IDENT ("=" expression)?
                                       | CT_IDENT ("=" expression)?) ";"
constant_declaration_statement ::= "const" type? CONST_IDENT attributes? "=" expression ";"
```

A `static` local has function-call-independent storage; a `tlocal` local has per-thread storage. The `var` form infers the type from the initializer. A `const` local declares a compile-time constant; its initializer must be a constant expression.

The initializer expression of a `static` or `tlocal` local follows the same rules as the initializer of a global variable of the same form: it must be evaluable to a constant at program-image construction time. Initializers that depend on runtime values are not permitted on `static` or `tlocal` locals.

An initializer expression may reference the *address* of the variable being declared, but may not depend on its value. For example, `void* a = &a;` is well-formed, while `int a = a + 1;` is not: the right-hand side reads `a` before it has been initialized.

### Conditions

The conditional statements `if`, `while`, `do`, `switch`, `for`, and the `cond` slot of `for_stmt` all accept a *condition*, which may include one or more declarations together with an optional `try` or `catch` unwrap:

```
condition       ::= condition_repeat ("," (try_unwrap_chain | catch_unwrap))?
                  | try_unwrap_chain
                  | catch_unwrap
condition_repeat ::= decl_or_expression ("," decl_or_expression)*
decl_or_expression ::= var_decl
                     | optional_type local_decl_after_type
                     | expression
try_unwrap      ::= "try" (type? IDENTIFIER "=")? expression
try_unwrap_chain ::= try_unwrap ("&&" (try_unwrap | expression))*
catch_unwrap    ::= "catch" (type? IDENTIFIER "=")? expression ("," expression)*
```

A condition is treated as true when:

* Every plain expression in `condition_repeat` evaluates to `true` (after assignability conversion to `bool`).
* Every `try` in a `try_unwrap_chain` produces a successful optional. The unwrapped value is bound to the named identifier (if any), which is in scope for the body of the controlling statement.
* In a `catch_unwrap`, the captured optional has *failed*; the resulting fault is bound to the named identifier (if any).

The `try` and `catch` unwraps are the principal mechanism for handling optionals in conditional contexts; see *Optionals and faults*.

### If statement

```
if_statement ::= "if" label? "(" condition ")" (block_statement else_part | statement)
else_part    ::= "else" (if_statement | block_statement)
```

The condition is evaluated. If true, the *then* branch is executed; otherwise the *else* branch, if any, is executed. When the *then* branch is a single statement (not a block), an `else` clause is not permitted; in that case use a block.

The optional label has the form `LABEL:` and follows the rules in *Blocks and scope*. A label permits a labelled `break` or `continue` to target this statement.

When the then-clause is not a compound statement, it must appear on the same source line as the closing parenthesis of the condition. A non-compound then-clause on a separate line is a syntax error.

An if statement may be labelled and exited by a labelled `break`. An unlabelled `break` may not exit an if statement; it would otherwise be ambiguous between the enclosing if and any surrounding loop or switch.

### Switch statement

```
switch_statement ::= "switch" label? ("(" condition ")")? attributes? "{" switch_body? "}"
switch_body      ::= (case_clause | default_clause)+
case_clause      ::= "case" expression (".." expression)? ":" statement*
default_clause   ::= "default" ":" statement*
```

The switch evaluates its condition and selects the first `case` whose value equals the condition, or whose inclusive range `a..b` contains the condition. If no `case` matches, the `default` clause, if present, is selected.

A switch without a condition `switch { ... }` is equivalent to evaluating each case as a boolean expression in source order and selecting the first that is `true`. Such a switch is always lowered to an if-else chain (see below).

Control reaches the end of the switch statement after the selected case executes its statements; case clauses with at least one statement do not fall through automatically. A `case` (or `default`) clause whose statement list is *empty*, however, falls through to the next clause: the selected case executes the statements of the next clause that has any. Successive empty clauses chain together, so `case A: case B: case C: do_something();` runs `do_something()` for any of `A`, `B`, or `C`.

To transfer control to another case explicitly, use a `nextcase` statement.

#### Lowering

A switch statement is lowered to one of two forms:

* A **jump table**, in which the switch operand directly indexes into a table of case targets. A jump table is produced only when the operand has integer type and every case value is a compile-time constant.
* An **if-else chain**, in which each case is tested in source order. This form is used when the switch has no condition, when the operand is neither an integer nor a boolean type, or when any case value is not a compile-time constant. An if-else chain is never further reduced to a jump table.

The attribute `@jump` requests jump-table lowering. A switch carrying `@jump` must satisfy the requirements above; otherwise the compiler rejects the program.

#### Exhaustive switches

A switch is *exhaustive* when control is guaranteed to enter exactly one of its clauses for every possible value of the operand. The two cases that produce this guarantee are:

* the switch has a `default` clause, or
* the switch operand has enum type and the switch's case clauses cover every value of the enum.

If a switch is exhaustive and every clause exits the switch through a `return`, `nextcase`, `break` targeting an outer construct, or other jump (rather than falling out of the switch body normally), the code following the switch is unreachable.

### While and do statements

```
while_statement ::= "while" label? "(" condition ")" statement
do_statement    ::= "do" label? block_statement ("while" "(" expression ")")? ";"
```

A `while` statement evaluates the condition; if true, it executes the body and repeats. A `do` statement executes the body once and then evaluates the trailing condition; if true, it repeats. A `do { ... };` form without a trailing `while` clause is equivalent to `{ ... }` with a label-aware `break` target.

### For statement

```
for_statement ::= "for" label? "(" for_condition ")" statement
for_condition ::= init_list? ";" condition? ";" update_list?
init_list     ::= decl_or_expression ("," decl_or_expression)*
update_list   ::= expression ("," expression)*
```

The `init_list` is executed once; declarations within it are scoped to the entire `for` statement (including condition, update, and body). The `condition`, if present, is evaluated before each iteration; the body executes only when the condition is true. The `update_list` is evaluated after each iteration. An absent condition is treated as `true`.

### Foreach statement

```
foreach_statement ::= ("foreach" | "foreach_r") label? "(" foreach_vars ":" expression ")" statement
foreach_vars      ::= foreach_var ("," foreach_var)?
foreach_var       ::= optional_type? "&"? IDENTIFIER
```

The expression must be of an *iterable* type. The following are natively iterable:

* arrays, slices, vectors, pointers to arrays, and pointers to vectors;
* any type that overloads `len` and `[]` (iteration by value);
* any type that overloads `len` and `&[]` (iteration by reference).

The loop binds one or two variables:

* With one variable, that variable binds the element value. If the variable name is prefixed with `&`, the binding is by reference and has pointer-to-element type instead.
* With two variables, the first binds the loop index and the second binds the element (with the same `&`-reference convention as the single-variable form).

The optional type on a foreach variable is the variable's declared type; if omitted, the type is inferred from the iterable's element type. A mismatched type triggers an implicit conversion; failure to convert is a compile-time error.

The index, when present, has type `sz` by default. An explicit type on the index variable causes a direct cast of the running index to that type at each iteration. The cast may truncate the visible index value but does not affect the iteration itself, and modifying the index variable inside the body has no effect on which element is bound next.

`foreach_r` iterates in reverse: it starts with the last element and proceeds toward the first. For `foreach_r`, the running index begins at `len - 1` and decreases.

### Break, continue, nextcase

```
break_statement   ::= "break" CONST_IDENT? ";"
continue_statement ::= "continue" CONST_IDENT? ";"
nextcase_statement ::= "nextcase" ((CONST_IDENT ":")? (expression | "default"))? ";"
```

`break` exits the innermost enclosing `while`, `do`, `for`, `foreach`, or `switch` statement. An optional label names a specific labelled enclosing statement to exit.

`continue` skips to the next iteration of the innermost enclosing `while`, `do`, `for`, or `foreach`. An optional label names a specific labelled enclosing loop. `continue` may not target a `switch`.

`nextcase` transfers control to another case of the innermost enclosing `switch`, or of a labelled enclosing switch if a label is supplied. The forms are:

* `nextcase;` — transfer to the textually following case.
* `nextcase expression;` — transfer to the case selected by `expression`. In a switch lowered to a jump table or otherwise capable of direct case selection, control is transferred directly to the matching case without re-evaluating the cases. In a switch lowered to an if-else chain, the cases are re-tested against `expression` starting from the first; control transfers to the first matching case. This form may not be used in a switch that has no condition. When both the `nextcase` operand and every case value are compile-time constants, the operand must match one of the cases; a `nextcase` operand that matches no case is a compile-time error. When either side is non-constant, no compile-time check is performed; the operand is evaluated and matched at runtime.
* `nextcase default;` — transfer to the `default` clause.

### Return statement

```
return_statement ::= "return" expression? ";"
```

`return` terminates execution of the enclosing function or macro and returns control to the caller. If the function's declared return type is `void`, the operand must be omitted; otherwise it is required and must be assignable to the declared return type. A `return` from a function whose return type is an optional that carries a fault propagates that fault to the caller.

### Defer statement

```
defer_statement ::= "defer" defer_kind? statement
defer_kind      ::= "try"
                  | "catch"
                  | "(" "catch" IDENTIFIER ")"
```

A `defer` schedules the given statement to be executed when control leaves the enclosing block, regardless of how that exit occurs — fall-through, `return`, `break`, `continue`, `nextcase`, or fault propagation. Deferred statements within a block run in reverse order of their textual occurrence.

Variants:

* `defer try statement` — runs only when the enclosing block is exited without a fault.
* `defer catch statement` — runs only when the enclosing block is exited because of a fault.
* `defer (catch fault_name) statement` — runs on fault exit, binding the fault value to `fault_name` for use inside the deferred statement.

Deferred statements may not `return`, `break`, `continue`, or `nextcase` out of the function, but may execute their own internal control flow.

A defer body may not itself be a `defer` statement. However, if the body is a compound statement, that compound may contain any number of inner defer statements.

A defer body may not contain a `break`, `continue`, `return`, or rethrow that would exit the defer body itself. Such constructs are valid only when fully contained within the defer body (for example, a `break` inside a loop introduced by the defer body).

When the surrounding scope exits through `return`, the return expression is evaluated *before* the deferred statements run. The returned value, including any side effects of the return expression, is fixed before any defer body executes. For example:

```
int a = 0;
defer a++;
return a;
// Is equivalent to
int a = 0;
int temp = a;
a++;
return temp;
```

Deferred statements are run on regular exits from the enclosing scope only. A non-regular exit — `longjmp`, a panic, a signal-driven termination, or any other mechanism that bypasses normal control flow — does not run pending defers.

### Assert statement

```
assert_statement ::= "assert" "(" expression ("," expression)* ")" ";"
```

`assert(cond)` evaluates `cond`; if `cond` is `false`, the program is terminated by calling a panic function. With no message expression, the standard library's `panic` function is called. With a message and additional format arguments, `panicf` is called with the message as a format string. If `panicf` is not available (for example, when compiling without the standard library), the format arguments are discarded and `panic` is called with the message alone.

The condition is required to be present; the message and any format arguments are optional. The message must be a compile-time constant string; the format arguments are arbitrary expressions.

Assertions are active in safe builds. In fast builds, the compiler may treat the condition as a hint (an assume directive); reaching a program point where the asserted condition is false is then undefined behaviour.

### Compile-time control statements

Compile-time control statements direct compilation rather than runtime execution. Each is closed by a matching `$end` keyword. See *Compile-time evaluation* for full semantics.

```
ct_if_statement     ::= "$if" constant_expression ":" statement* ("$else" statement*)? "$endif"
ct_switch_statement ::= "$switch" constant_expression? ":" ct_case_clause+ "$endswitch"
ct_case_clause      ::= ("$case" constant_expression | "$default") ":" statement*
ct_foreach_statement ::= "$foreach" CT_IDENT ("," CT_IDENT)? ":" expression ":" statement* "$endforeach"
ct_for_statement    ::= "$for" for_condition ":" statement* "$endfor"
ct_assert_statement ::= "$assert" constant_expression ("," constant_expression)* ";"
ct_error_statement  ::= "$error" constant_expression ("," constant_expression)* ";"
ct_echo_statement   ::= "$echo" constant_expression ";"
```

`$assert` triggers a compile-time error if the condition is false. `$error` always triggers a compile-time error with the given message. `$echo` emits a compile-time diagnostic. The looping and conditional forms drive code generation at compile time and form compile-time block scopes (see *Blocks and scope*).

### Inline assembly

```
asm_block_item  ::= asm_label | asm_instruction
asm_label       ::= CONST_IDENT ":"
asm_instruction ::= asm_mnemonic (asm_arg ("," asm_arg)*)? ";"
asm_mnemonic    ::= (IDENTIFIER | "int") ("." IDENTIFIER)?
```

An `asm` block embeds platform-specific instructions. The full syntax of instructions and operands is given in *Inline assembly*.

The structured form accepts a sequence of labels and instructions in a common grammar that abstracts over the underlying processor.

A label has the form `NAME:`, where `NAME` is a `CONST_IDENT`. Labels may be jump targets for other instructions within the same `asm` block; they have no visibility outside the block.

An instruction consists of a mnemonic followed by zero or more comma-separated arguments and a terminating semicolon. The mnemonic is either an `IDENTIFIER` or the keyword `int` (permitted as a mnemonic so that the x86 `int` instruction may be written naturally), optionally followed by a `.suffix` to select an instruction variant — for example, `vmov.f32` or `cvt.u32`.

## Functions and methods

A *function* is a named, callable entity with a return type, a parameter list, and an optional body. A *method* is a function declared in a way that associates it with a particular type and is invoked using member-access syntax on receiver values of that type.

### Function declarations and definitions

```
function_declaration ::= "fn" return_type function_name fn_parameter_list generic_decl? attributes? function_body
return_type          ::= type "?"? | "void"
function_name        ::= (type ".")? IDENTIFIER
fn_parameter_list    ::= "(" parameter_list? ","? ")"
function_body        ::= compound_statement
                       | "=>" expression ";"
                       | "=>" macro_call_with_trailing_block
                       | ";"
```

A function declaration introduces a name into module scope and binds it to a function entity. The body takes one of four forms:

* A *compound statement* `{ ... }` defines the function with the given body.
* A *short body* `=> expression;` defines the function as immediately returning the value of the expression; the function's return type, if not explicitly given, is the type of the expression.
* A *short body invoking a macro with a trailing block* `=> @macro(args) { ... }` defines the function as a call to a macro whose trailing block is the function's body. The terminating `;` is omitted because the trailing `{ ... }` serves as the statement terminator. For example:

  ```
  fn void test() => @pool()
  {
      return;
  }
  ```

* A *forward declaration* `;` introduces the function but does not define it. A forward declaration must carry the `@extern` attribute (or appear in an interface body); the definition must be supplied elsewhere.

The return type may carry the `?` suffix to denote an optional return type, indicating that the function may return either a value of the underlying type or a fault.

If `function_name` is preceded by a type and a `.`, the declaration introduces a method; otherwise it introduces an ordinary function.

### Methods

A method is a function whose name is qualified by a *receiver type*:

```
fn int Foo.bar(Foo* self, int x) { ... }
fn String int.to_hex(int value) { ... }
```

A method may be invoked on a receiver of the receiver type using member-access syntax, in which case the receiver is passed as the first argument: `f.bar(7)` is equivalent to `Foo.bar(&f, 7)` when the first parameter has pointer-to-receiver type, or to `Foo.bar(f, 7)` when the first parameter has value type.

Methods may extend any user-defined type and any built-in numeric, pointer, slice, vector, array, `any`, or `typeid` type. The set of methods visible on a receiver type — its *method set* — is defined in *Properties of types and values*.

The first parameter of a method declaration is the receiver. By convention it is named `self`; the language imposes no specific name. Its declared type must be either the receiver type or a pointer to the receiver type.

### Parameters

```
parameter_list ::= parameter_decl ("," parameter_decl)*
parameter_decl ::= parameter (("=" "...") | ("=" expression))?
parameter      ::= "inline"? type ("..."? IDENTIFIER attributes?
                                 | "..."? CT_IDENT
                                 | (HASH_IDENT | "&" IDENTIFIER) attributes?
                                 | attributes?)
                 | "..."
                 | HASH_IDENT attributes?
                 | "&" IDENTIFIER attributes?
                 | IDENTIFIER "..."? attributes?
                 | CT_IDENT
                 | CT_IDENT "..."
```

The principal parameter forms are:

* `type name` — an ordinary by-value parameter of the given type.
* `type name = expression` — a parameter with a default value. The default expression is evaluated at the call site whenever no argument is supplied for this parameter.
* `type ... name` — a *typed variadic* parameter; the name binds a slice `type[]` over the variadic arguments. A function may declare at most one variadic parameter, and it must be the last positional parameter.
* `...` — an *any-typed variadic* parameter; accepts any number of arguments, each converted to `any`. Inside the function the variadic argument is accessed as `$vaarg`.
* `inline type name` — an *inline parameter*, used on a method receiver to indicate that subtype dispatch follows the parameter's inline-member chain (see *Properties of types and values*).
* `type name attributes?` — a parameter with attributes that modify how the parameter is passed (e.g., `@in`, `@out`, `@noalias`); see *Attributes*.

A parameter name may be omitted in a function declaration that has no body; the declared types alone determine the function's type. Names are required in a definition.

The parameter forms involving `HASH_IDENT`, `&IDENTIFIER`, `CT_IDENT`, and untyped identifiers are valid only in macro definitions; their semantics are described in *Macros*.

### Default arguments

A function parameter may carry a default value, written as `= expression`. The expression must be a constant expression and is evaluated at the call site whenever the corresponding argument is omitted. Default arguments are matched positionally: once a parameter with a default begins the trailing portion of the parameter list, every subsequent positional parameter must also have a default.

The special form `= ...` indicates that the parameter defaults to the value of the surrounding variadic argument pack and is valid only in macro-style contexts.

### Argument splatting

At the call site, an argument of the form `...expression` *splats* a slice, array, or vector into the argument list, expanding it into a sequence of positional arguments. Splats may appear at any position in the argument list, including before, between, and after other positional arguments, and may also appear in the variadic portion of the parameter list. Each splat operand contributes its elements in order to the positional argument sequence; the resulting expanded sequence must match the function's parameter list according to the usual rules.

### Function attributes

A function declaration may carry attributes that affect linkage, inlining, calling convention, or visible properties of the function. Some commonly used attributes are:

* `@extern` — declares an externally linked function with no body.
* `@export` — exports the function from a static or dynamic library.
* `@inline` / `@noinline` — request, respectively, that the function be inlined or not inlined at call sites.
* `@noreturn` — declares that the function never returns to its caller.
* `@naked` — declares that the function body is a bare sequence of instructions, with no compiler-generated prologue or epilogue; typically used together with inline assembly.
* `@pure` — declares that the function has no observable side effects (and may be assumed to be safely callable in contracts).
* `@deprecated` — emits a diagnostic at use sites.
* `@callconv("name")` — selects an alternative calling convention provided by the target.

The complete set of attributes and their semantics is given in *Attributes*.

### Function types and function pointers

A function type has the form `fn return_type fn_parameter_list`. A value of function type is a *function pointer* and may be assigned, passed, stored, and called like any other first-class value:

```
alias UnaryOp = fn int(int);
fn int square(int x) => x * x;
fn void main()
{
    UnaryOp op = &square;
    int y = op(5);
}
```

Function types compare by structural identity: two function types are the same if their return types, parameter types in order, and attributes agree. The unary `&` operator applied to a function name yields a function pointer of the corresponding type.

### Lambdas

A *lambda* is an expression introducing an anonymous function:

```
lambda_expr ::= "fn" optional_type? fn_parameter_list attributes? lambda_body
lambda_body ::= compound_statement
              | "=>" expression
```

A lambda evaluates to a function pointer. The return type may be omitted when it can be inferred from the body. A lambda has no access to runtime variables of the enclosing scope; only compile-time values of the enclosing scope are available within its body.

### Methods on built-in types

Methods may extend any built-in numeric, pointer, slice, vector, array, `any`, `typeid`, or `fault` type. Such methods become available through member-access syntax wherever the declaring module is imported:

```
fn int int.doubled(int self) => self * 2;

fn void main()
{
    int x = 5;
    int y = x.doubled();   // 10
}
```

A method declared on a built-in type does not modify the type itself; it adds an entry to the method set visible within the module's import graph.

### Operator overloading

Methods declared with operator-overload attributes — `@operator(+)`, `@operator([])`, `@operator(len)`, and so on — extend the corresponding operator for the receiver type. The list of overloadable operators and the signatures of their methods are given in *Properties of types and values*.

### Calling

A function call evaluates the function expression, then the arguments in left-to-right order, then transfers control to the function with the argument values bound to the corresponding parameters. The return value of the call has the function's declared return type. Order-of-evaluation rules are given in *Expressions*.

If the function returns an optional (`Ty?`) and the call expression is used in a context that does not consume the optional status, the optional must be handled either by `try` / `catch` unwrapping (see *Statements*), by the postfix `!` (rethrow) or `!!` (force-unwrap), or by the operator `??` (optional-else).

## Macros

A *macro* is a callable entity defined by source text that is expanded inline at each call site, with arguments bound according to a parameter list. Unlike a function call, a macro expansion is not a runtime call: the macro's body is integrated into the caller's body, and variables and labels introduced by the macro are hygienic (do not leak into the caller's scope, and do not capture from it except through declared parameters).

### Macro declarations

```
macro_declaration    ::= "macro" return_type? macro_name "(" macro_params ")" generic_decl? attributes? function_body
macro_name           ::= (type ".")? (IDENTIFIER | AT_IDENT)
macro_params         ::= parameter_list? (";" trailing_block_param)?
trailing_block_param ::= AT_IDENT ("(" parameter_list? ")")?
```

The `function_body` non-terminal is the same as for functions; see *Functions and methods*.

The return type is optional. When omitted, it is inferred from the body's `return` expressions; all `return` paths within the body must agree on a single type.

A macro's name is either an `IDENTIFIER` or an `AT_IDENT`. The macro **must** use an `AT_IDENT` name if any of the following holds:

* it declares one or more expression (`#`) parameters,
* it declares a trailing-block parameter, or
* it declares a raw variadic parameter (the `...` form described below).

This rule lets each call site signal — by the leading `@` — that the call may exhibit non-function-like behaviour (lazy expression binding, insertion of a caller-supplied block, or raw access to a variadic argument pack). The presence of compile-time (`$`) parameters alone does *not* require an `AT_IDENT` name.

The attribute `@safemacro` placed on a macro declaration overrides the rule above: a macro carrying `@safemacro` may use an ordinary `IDENTIFIER` name even when it uses one of the features that would otherwise require `AT_IDENT`. This is provided for cases where the author has determined that the macro behaves like an ordinary function from the caller's perspective.

If `macro_name` is qualified by a receiver type (`Foo.bar`, `Foo.@bar`), the declaration introduces a *macro method*, invocable through member-access syntax on values of the receiver type. The semantics parallel ordinary methods (*Functions and methods*).

### Macro parameters

A macro parameter binds an argument from the call site to a name visible within the macro body. The principal parameter forms are:

* `type name` — a *typed parameter*. The argument expression is evaluated once at expansion time, converted to `type`, and the result is bound to `name`.
* `name` — an *untyped parameter*. The type is inferred from the argument; otherwise the parameter behaves as a typed parameter.
* `#name` — an *expression parameter*. The argument expression is bound to `name` *without* being evaluated. Each textual use of `name` within the macro body re-evaluates the expression in the *caller's* lexical context. Use of `#` parameters requires an `AT_IDENT` macro name (unless overridden by `@safemacro`).
* `$name` (a `CT_IDENT`) — a *compile-time value parameter*. The argument must be a constant expression; the parameter is a compile-time variable in the body.
* `$Name` (a `CT_TYPE_IDENT`) — a *compile-time type parameter*. The argument must be a type; the parameter denotes that type within the body.

A parameter may carry attributes (see *Attributes*). A trailing parameter may have a default value `= expression`, with the same rules as function defaults (*Functions and methods*).

### Variadic parameters

A macro may declare a single variadic parameter as its last positional parameter, in one of three forms:

* `type... name` — a *typed slice variadic*. The arguments are collected into a slice `type[]` bound to `name`.
* `name...` — an *untyped slice variadic*. The arguments are collected into a slice of `any[]`; each element preserves its original type when accessed through `$Typefrom` and related forms.
* `...` — a *raw variadic*. The arguments are not collected into a slice; instead, they are accessible only through the compile-time accessors below.

The typed and untyped slice forms are also available for ordinary functions. The raw form is unique to macros, and its use requires an `AT_IDENT` macro name (unless overridden by `@safemacro`).

### Compile-time access to variadic arguments

Within the body of a macro declared with `...` (a raw vaarg), the following compile-time accessors are valid:

* `$vaarg.len` — the number of variadic arguments, as a compile-time constant.
* `$vaarg[i]` — the `i`-th variadic argument; `i` must be a compile-time constant integer.
* `...$vaarg` — splats all variadic arguments, in source order, into the surrounding call or compound literal. See *Expressions*.
* `$stringify($vaarg[i])` — the textual form of the `i`-th argument as a string literal.
* `$Typefrom($vaarg[i])` — the type of the `i`-th argument.

### Trailing-block parameters

A macro may declare a *trailing-block parameter* after a semicolon in the parameter list. The block parameter is an `AT_IDENT` optionally followed by a parameter list:

```
macro @foreach(a; @body(index, value))
{
    for (int i = 0; i < a.len; i++)
    {
        @body(i, a[i]);
    }
}
```

At the call site, the trailing block is supplied as a compound statement following the closing parenthesis of the macro call, optionally preceded by the names that bind the block's parameters:

```
@foreach(items; int i, T v)
{
    io::printfn("items[%d] = %s", i, v);
};
```

Within the macro body, the trailing block is invoked using the `AT_IDENT` name, like a nested macro: `@body(i, a[i])`. Each invocation expands the supplied block with the named arguments.

A macro that declares a trailing-block parameter must have an `AT_IDENT` name.

### Macro body forms

The macro body has the same forms as a function body: a compound statement, a short `=> expression;` body, or a short body invoking another macro with a trailing block. See *Functions and methods*.

A macro that produces a value uses the same `return expression;` syntax as a function and may be invoked in any context in which an expression of the macro's return type is valid; a macro with return type `void`, or with no `return` paths, is invoked as a statement.

### Constant folding

A macro is *constant-folded* at a given call site when the expansion reduces to a single compile-time constant. The conditions are:

* The body contains exactly one runtime statement, and that statement is a `return`.
* The returned expression evaluates to a compile-time constant.

Any number of compile-time statements (`$if`, `$for`, `$foreach`, `$switch`, `$assert`, and so on) may appear in the body without affecting constant folding, since they are evaluated during compilation and do not contribute runtime statements.

The attribute `@const` placed on a macro asserts that the macro folds to a compile-time constant for every valid call. The compiler verifies the assertion against the body and, if it does not hold, reports the specific construct that prevents folding.

A constant-folded macro call may appear in any context that requires a compile-time constant — array sizes, the condition of `$if`, the value of a named constant, attribute arguments, and so on.

### Invocation

A macro is invoked using the same syntax as a function call. If the macro's name is an `AT_IDENT`, the call site uses that same form:

```
@swap(a, b);
int s = @sum(1, 2, 3);
```

If the macro's name is an `IDENTIFIER`, the call uses the bare name:

```
int y = square(3);
```

Argument expressions are bound to parameters according to the parameter form: typed and untyped parameters bind to values at expansion, while `#`, `$`, and `$T` parameters bind expressions, compile-time values, and types respectively. Argument evaluation order at the call site follows the rules in *Expressions*.

### Hygiene

Identifiers introduced inside a macro body — local variables, labels, parameter names — are renamed during expansion so that they do not collide with identifiers in the caller's scope. Conversely, the macro body does not implicitly see the caller's local variables; access to caller-side names is possible only through `#`, `$`, and `$Name` parameters, which establish the binding explicitly.

### Recursion

A macro may invoke itself or other macros. The maximum depth of macro expansion is bounded by the implementation's `macro-recursion-depth` setting; exceeding the limit is a compile-time error.


## Compile-time evaluation

C3 supports a significant subset of the language at compile time. Compile-time evaluation drives conditional compilation, generic instantiation, the bodies of macros, the conditions of `$if` and `$assert`, the sizes of arrays, the values of named constants, and the arguments of attributes. This chapter describes the compile-time expression and value forms, the compile-time control structures, and the built-in compile-time operators.

### Constant expressions

A *constant expression* is an expression whose value is determined by the compiler at compile time. The result is a value of a definite type, available wherever a constant is required.

The following expressions are constant:

* Integer, floating-point, character, boolean, and string literals.
* The constants `null`, `true`, `false`.
* The result of any operator from *Expressions* applied to constant operands — including arithmetic, bitwise, shift, comparison, logical, optional-else, Elvis, ternary, and cast — together with the compile-time-only operators `+++`, `&&&`, `|||` described below.
* References to global constants whose initializer is itself a constant expression.
* Compile-time variables and compile-time type variables (see below).
* A compound literal whose elements are constant expressions.
* A member access on a compile-time-known aggregate.
* A call to a macro that folds to a constant (see *Macros*).
* The compile-time analysis expressions `$eval`, `$stringify`, `$defined`, `$feature`, `$Typeof`, `$Typefrom`, and `$reflect`.
* A `$vaarg` access, when the corresponding macro argument is itself a constant expression.
* Type-access expressions of the form `Type::typeid`, `Type::alignment`, `Type::size`, and similar (see *Properties of types and values*).

A constant expression is required in the following contexts:

* The size of an array type (`T[N]`).
* The condition of `$if`, `$switch`, and `$assert`.
* The value of a named constant declaration.
* An argument to an attribute.
* The offsets and widths of bitstruct members.
* The value of a `$case` clause within `$switch`.

### Compile-time variables and types

A *compile-time value variable* has a `CT_IDENT` name (`$name`). It holds a value known at compile time and may be reassigned within its compile-time block scope.

A *compile-time type variable* has a `CT_TYPE_IDENT` name (`$Name`). It denotes a type known at compile time.

Compile-time variables may be declared inside function or macro bodies, in compile-time control structures, and in macro parameter lists. They obey compile-time block scope as described in *Blocks and scope*. They may not be declared at module scope.

A compile-time variable has no runtime existence: no storage is reserved, and its address may not be taken. References to compile-time variables in generated code are replaced by the variable's value at the point of reference.

### Compile-time operators

Three operator variants are reserved for compile-time evaluation:

* `+++` — *compile-time concatenation*. Joins two compile-time-known arrays, slices, or strings into a new compile-time value.

  ```
  int[2] $a = { 1, 2 };
  int[3] $b = $a +++ 3;       // { 1, 2, 3 }
  ```

* `&&&` — *compile-time short-circuit AND*. Evaluates the right operand only when the left is `true`. Unlike runtime `&&`, the right operand is not even type-checked when the left is `false`; this allows referring to entities that may not exist on all paths.

* `|||` — *compile-time short-circuit OR*. The dual of `&&&`: the right operand is not type-checked when the left is `true`.

The `&&&` and `|||` operators are typically used together with `$defined` to guard the use of an entity by the existence of that entity:

```
$if $defined(@feature) &&& @feature():
    // body referencing @feature
$endif
```

The above is well-formed whether or not `@feature` exists; with ordinary `&&`, the call to `@feature()` would be type-checked even when `$defined` returns `false` and would produce a compile error.

### Compile-time control flow

The compile-time control structures direct *what code the compiler generates* rather than runtime execution. Their syntax is given in *Statements*; the semantics below specify what the compiler does at each form.

#### `$if` and `$else`

The condition is a constant boolean expression. If the condition is `true`, the body of the `$if` branch is compiled as part of the surrounding program; if `false`, the body is discarded and the `$else` branch (if present) is compiled instead. Discarded branches are not generated and are not subject to ordinary type checking — they need only be syntactically well-formed.

A declaration introduced within the selected branch enters the enclosing scope; declarations within a discarded branch do not.

#### `$switch`

The switch operand is a constant expression. Each `$case` value is a constant expression. The compiler selects the first matching `$case` (or `$default` if none matches), compiles its body, and discards the remaining cases.

If the operand is omitted (`$switch:`), each `$case` is a boolean constant expression; the compiler selects the first `$case` whose expression is `true`.

`$switch` selects one of its `$case` clauses based on a compile-time-constant cond. The following rules apply:

* The operand and case values are constant expressions. When the operand is a type, every case value must also be a type.
* If the operand is omitted (`$switch:`), each `$case` is a boolean constant expression; the first case whose expression is `true` is selected.
* A `$case` clause with no statements falls through to the next clause. Successive empty clauses chain together, and the first non-empty clause encountered supplies the statements that are processed.
* Only the selected clause is processed by the compiler; the statements of the other clauses are not semantically checked.
* `$switch` does not support ranged cases, `break`, or `nextcase`.

#### `$for`

The compiler unrolls the loop: the body is generated once per iteration, with the loop variables (which are compile-time variables) bound to compile-time-constant values for that iteration. The control expressions are evaluated at compile time.

Each unrolled iteration produces an independent compile-time block scope. Declarations introduced in one iteration do not collide with the corresponding declarations of another iteration.

#### `$foreach`

`$foreach` unrolls over a compile-time-known sequence: a compile-time array, slice, string, or other iterable available at compile time, including the member lists exposed by reflection. With one loop variable, the variable binds the element; with two, the first binds the index and the second binds the element.

### Compile-time diagnostics

The compile-time diagnostic statements take a sequence of comma-separated arguments and do not require enclosing parentheses:

```
$assert FOO > 0, "Invalid foo";
$error "Unsupported configuration";
$echo "Building with verbose mode";
```

* `$assert condition, message?, ...` — evaluates `condition` at compile time; if `false`, emits a compile-time error. The optional message expressions are evaluated at compile time and composed into the diagnostic.
* `$error message, ...` — unconditionally emits a compile-time error with the given message. Typically used in a discarded branch to flag unsupported configurations.
* `$echo message` — emits a compile-time informational diagnostic. No runtime effect.

### Compile-time analysis builtins

* `$defined(check, ...)` — yields `true` when every operand is well-formed in the current scope. Each operand is either a candidate expression or a candidate local variable declaration (`type IDENTIFIER ("=" expression)?`). See *Expressions*.
* `$feature(NAME)` — yields `true` when the build-system feature flag named `NAME` is enabled.
* `$eval(string)` — parses the compile-time string `string` as the name of an entity (a variable, function, or other named declaration), optionally qualified by a module path, and yields a reference to that entity in the current scope. The string may not contain an arbitrary expression; it names something already declared.
* `$stringify(expression)` — yields the source text of `expression` as a compile-time string. The expression is not evaluated.
* `$Typeof(expression)` — yields the type of `expression` without evaluating it.
* `$Typefrom(value)` — yields a type. The operand is either a compile-time `typeid` value or a compile-time string giving the name of a type.
* `$vaarg`, `$vaarg.len`, `$vaarg[i]`, `...$vaarg` — accessors for the raw variadic arguments of a macro; see *Macros*.

The semantics of `$reflect` and the family of reflective accessors are described in *Reflection*.

### Top-level conditional compilation

The `@if(condition)` attribute attached to a top-level declaration is the module-scope analogue of `$if`: a declaration carrying `@if(cond)` is compiled only when `cond` evaluates to `true`. A module section attribute `@if(condition)` applies the same effect to every declaration in the section (see *Blocks and scope*).

When `@if`-conditional declarations refer to one another, the evaluation order is consistent with module-level dependency resolution: a declaration that depends on another `@if`-conditional declaration sees the result of evaluating that dependency's condition.

### Compile-time execution of macros

A macro call evaluates at compile time when invoked from a constant-expression context, provided the macro folds to a constant under the rules in *Macros*. The result is the constant value produced by the macro's `return` statement. Ordinary functions do not execute at compile time; only macros and the compile-time builtins above are usable in constant-expression contexts.

### Source-text inclusion

The following top-level and statement-level compile-time directives bring source text into the current translation unit:

* `$include("path")` — includes the contents of the named file at the current point in the source, as if its text had appeared there directly. Valid only at the top level. Requires trust level `include` or higher.
* `$exec("command", args?, stdin?)` — executes an external program at compile time and includes its standard output as source text. Requires trust level `full`.
* `$expand(string)` — parses the compile-time string `string` as C3 source and inserts the resulting statements at the directive's location. When `$expand` appears at module scope, the string is parsed as a sequence of top-level declarations; when it appears inside a function or macro body, the string is parsed as a sequence of statements within the current scope.
* `$embed("path")` — embeds the contents of the named file as a compile-time byte-array value rather than as source text.

The trust level is configured by the build system; see *Modules*.

## Reflection

C3 provides compile-time access to the structure, identity, and properties of types, values, and declarations. Reflection in C3 is fully compile-time: every reflective query produces a constant expression or a compile-time-known value, and may be used wherever a constant is required.

### Type identity

Every type has a runtime *type identifier* of type `typeid`. The `typeid` of a type `Ty` is obtained as `Ty::typeid`. Two `typeid` values compare equal with `==` if and only if they identify the same type.

The type `typeid` is a built-in opaque type whose size and alignment equal the platform pointer width (see *Properties of types and values*).

A `typeid` value is itself a constant expression when its operand is a static type name; it is a runtime value when produced by `$Typeof(expr)` on an `any` or interface value, or by similar runtime queries on dynamic dispatch results.

### Type-property access

Every type supports a fixed set of compile-time accessors selected through the `::` operator. Some are defined for every type; others are restricted to specific kinds of type. Accessing a property that is not defined for the receiver's kind is a compile-time error.

```
type_access_expr ::= type "::" access_ident
```

Some accessors yield values; others yield types or compile-time-only entities such as member lists.

The accessors defined for every type are:

* `Ty::typeid` — the type's `typeid` value.
* `Ty::size` — the size of the type in bytes.
* `Ty::alignment` — the alignment of the type in bytes.
* `Ty::kind` — the type's `TypeKind` value (an enum defined in `std::core::types`).
* `Ty::name` — the type's simple name as a compile-time string.
* `Ty::qname` — the type's fully qualified name (with module path) as a compile-time string.
* `Ty::has_equals` — `true` if `==` and `!=` are defined on the type.
* `Ty::is_ordered` — `true` if `<`, `<=`, `>`, `>=` are defined on the type.
* `Ty::methods` — a compile-time array of strings giving the names of methods declared on the type.

The accessors below are restricted to the type kinds for which they make sense; using them on an unsupported kind is a compile-time error.

* `Ty::min` / `Ty::max` — the minimum and maximum representable values; defined for integer and floating-point types.
* `Ty::nan` / `Ty::inf` — NaN and infinity values; defined for floating-point types.
* `Ty::len` — the length of an array, vector, or enum-like type. For arrays and vectors it is the number of elements; for enums and constdefs it is the number of declared constants.
* `Ty::members` — a compile-time list of member descriptors. Defined for struct, union, bitstruct, and enum types. Each element is a reflective reference equivalent to `$reflect` applied to that member. Because the list is untyped at runtime, it may be iterated only at compile time.
* `Ty::inner` — the inner `typeid` of a composite type:
  * Array — the element type.
  * Vector — the element type.
  * Pointer — the pointee type.
  * Bitstruct — the backing type.
  * Enum — the backing integer type.
  * Typedef — the underlying type.
* `Ty::parent` — for typedef, constdef, bitstruct, and struct types, the typeid of the `inline` member; for struct, the typeid of the inlined substruct member, if any.
* `Ty::is_substruct` — defined for struct; `true` if the struct has an `inline` member.
* `Ty::params` — defined for function pointer types; a compile-time array of parameter descriptors (each with `.name` and `.type`).
* `Ty::returns` — defined for function pointer types; the return type as a `typeid`.
* `Ty::cname` — the external (mangled) name of the type as a compile-time string; not defined for built-in types.
* `Ty::from_ordinal(i)` — defined for enum and constdef; produces the value with the given ordinal.
* `Ty::lookup_field(field, value)` — defined for enum; returns an optional containing the first value whose associated field equals `value`, or a fault if none matches.
* `Ty::values` — defined for enum and constdef; a compile-time array of the declared values.
* `Ty::get_tag(name)` / `Ty::has_tag(name)` — query user-defined tags attached to the type.

### Reflective references and member queries

The accessor `Ty::members` yields a compile-time list of *reflective references*: opaque compile-time-only handles describing each member. A reflective reference supports a fixed set of property accesses:

* `.name` — the member's source name as a string.
* `.qname` — the qualified name as a string.
* `.type` — the member's type as a `typeid`.
* `.offset` — the member's offset within its enclosing aggregate.
* `.alignment` — the member's alignment.
* `.kind` — the member's `TypeKind`.
* `.get_tag(name)` / `.has_tag(name)` — user-defined tags attached to the member.

Reflective references may be iterated using `$foreach` (see *Statements*); they are usable only at compile time.

### Compile-time reflection of expressions

The built-in `$reflect(expression)` yields a reflective reference describing the given expression. The set of accessors available depends on what the expression refers to:

* For a variable or constant: `.name`, `.qname`, `.cname`, `.type`, `.alignment`, `.kind`, `.get_tag`/`.has_tag`.
* For a function or macro: `.name`, `.qname`, `.cname`, `.params`, `.returns`, `.get_tag`/`.has_tag`.
* For a type: the same accessors as `Type::accessor` above.

A program may check whether a particular accessor is available for an expression by combining `$defined` with `$reflect`:

```
$if $defined($reflect(x).some_property):
    ...
$endif
```

### Type queries on values

* `$Typeof(expression)` — the static type of `expression`, as a type usable in type contexts. The expression is not evaluated.

  ```
  Foo f;
  $Typeof(f) g = f;       // g has type Foo
  ```

* `$Typefrom(value)` — the type denoted by a compile-time `typeid` value or by a compile-time string giving the type's name.

  ```
  $Typefrom("float") x = 12.0;
  $Typefrom(int::typeid) y = 12;
  ```

* `$stringify(expression)` — the source text of `expression` as a compile-time string. For an `#expression` macro parameter, `$stringify` produces the text of the *argument* passed for the parameter, not the parameter's own name.

### Dynamic reflection through `any` and interfaces

A value of type `any` or an interface type carries a runtime `typeid` accessible as `.type`. This `typeid` may be compared against static `typeid` values, used as the operand of a switch, or passed to functions for runtime dispatch.

```
any a = some_value();
switch (a.type) {
    case int.typeid:   ...
    case String.typeid: ...
    default:           ...
}
```

The pointer to the underlying storage is accessible as `.ptr`. Combining `.type` with `.ptr` enables runtime reflection on heterogeneous values.

### TypeKind

The enumeration `TypeKind`, defined in `std::core::types`, enumerates the kinds of type that may appear in `Ty::kind` and reflection results. Members include `SIGNED_INT`, `UNSIGNED_INT`, `FLOAT`, `BOOL`, `POINTER`, `STRUCT`, `UNION`, `ENUM`, `CONSTDEF`, `VECTOR`, `ARRAY`, `SLICE`, `BITSTRUCT`, `INTERFACE`, `ANY`, `TYPEID`, `FAULT`, `FUNC`, and `TYPEDEF`, among others. The full enumeration is part of the standard library.

### Restrictions

Reflection is a compile-time facility. Reflective references, member lists, and type-property values that are not themselves runtime types (such as `Ty::members`) may not be assigned to runtime variables, returned from runtime code, or stored in runtime data structures. Compile-time iteration (`$foreach`) and conditional logic (`$if`) are the mechanisms for traversing reflective data.

Method introspection through `Ty::methods` is subject to the ordering caveat that methods are registered into the compiler's type tables after the types themselves; reflective queries on the method set are guaranteed consistent only when performed inside a function body.

## Attributes

An *attribute* is a piece of metadata attached to a declaration or, in a few cases, to a statement. Attributes influence compilation in ways that range from the purely informational (deprecation diagnostics) to the structural (layout, linkage, calling convention). Some attributes have a single canonical meaning fixed by the language; others may be combined and composed into named compounds via *attribute definitions*.

### Attribute syntax

An attribute is written `@name` or `@name(argument-list)`. The lexical kind of the name is `AT_IDENT`. Multiple attributes may be attached to a single declaration; they are written one after another at the position the declaration's grammar permits attributes.

```
attributes ::= attribute attribute*
attribute  ::= AT_IDENT ("(" expression_list? ")")?
```

Each declaration form specifies the precise position where its attribute list may appear (see *Declarations*, *Functions and methods*, *Variables*, *Types*). The arguments of an attribute are constant expressions; their kinds and number depend on the specific attribute. Most attributes accept zero or one argument; the attributes `@link`, `@tag`, and `@wasm` accept additional arguments as described in their entries below.

### Built-in attributes

The attributes recognized by the language are grouped below by purpose. Unless noted otherwise, an attribute is valid on the declaration forms for which it is meaningful and ignored or rejected on others.

#### Visibility

* `@public` — the declaration is visible to importers (the default for module-level declarations).
* `@private` — the declaration is visible only within the same module.
* `@local` — the declaration is visible only within the same file.
* `@builtin` — the declaration is visible without qualification across all modules; reserved for standard-library declarations.

The first three may also appear on a module section to set the default visibility for all declarations in the section (see *Blocks and scope*).

#### Linkage and storage

* `@export` — the declaration is exported as a public symbol when building a library.
* `@weaklink` — emits the symbol with weak linkage rather than global linkage. A reference to a weak-linked symbol that is unresolved at link time resolves to `null` instead of producing a link error.
* `@weak` — like `@weaklink`, but additionally: if a non-weak definition of the same symbol exists in the same compilation, the non-weak definition supersedes the weak one. For example, given

  ```
  fn void test() @weak { }

  fn void test()
  {
      io::printn("test");
  }
  ```

  a call to `test()` invokes the non-`@weak` definition.
* `@link(library)` — adds the named library to the link command.
* `@section(name)` — places the declaration in the named object-file section.
* `@cname(name)` — overrides the symbol's external name with the given string.
* `@nostrip` — prevents the symbol from being removed by dead-code stripping.

#### Inlining, calling, and control flow

* `@inline` / `@noinline` — request, respectively, that calls to this function be inlined or not.
* `@callconv(name)` — selects a calling convention. The argument is a compile-time string; the recognized values are implementation dependent, but will at least contain `"cdecl"`. The default is `"cdecl"`. If more than one `@callconv` is applied to a function or call, the last takes precedence.
* `@naked` — the function has no compiler-generated prologue or epilogue; typically used with inline assembly.
* `@noreturn` — the function never returns to its caller; reaching its textual end is an error.
* `@pure` — the function has no observable side effects and may be assumed safe to call in contracts.
* `@maydiscard` / `@nodiscard` — explicitly allow or forbid discarding the return value at call sites.
* `@finalizer` / `@finalizer(priority)` — registers the function to be called at program shutdown. The optional priority argument is an integer; lower values run earlier than higher values.
* `@init` / `@init(priority)` — registers the function to be called at program startup, before main. The optional priority argument has the same convention as @finalizer.

#### Initialization and layout

* `@noinit` — suppresses default zero-initialization of a variable; the variable's initial value is indeterminate.
* `@mustinit` — applied to a type; declares that variables of the type may not opt out of initialization.
* `@constinit` — applied to a typedef; permits implicit conversion of literal values to the typedef's name.
* `@safeinfer` — applied to a local variable declared with `var`; opts into type inference for a runtime local. The `var` form is otherwise reserved for compile-time variables and macro parameters; `var x @safeinfer = expression;` permits its use for a runtime local whose type is inferred from the initializer.
* `@align(n)` — raises the alignment of a type, variable, or function to at least `n` (a power of two).
* `@packed` — sets all field alignments of a struct or bitstruct to 1; eliminates inter-field padding.
* `@compact` — uses the smallest possible layout consistent with field requirements.
* `@nopadding` — requires that the layout introduce no padding bytes; declarations that would require padding are rejected.
* `@overlap` — permits a struct's fields to overlap (advanced; see the standard library).
* `@bigendian` / `@littleendian` — fixes the byte order of a bitstruct's backing storage.
* `@obfuscate` — applied to an enum or fault declaration; omits member-name information from reflection and runtime introspection. Useful for size-sensitive builds.

#### Macros and compile-time

* `@safemacro` — overrides the `AT_IDENT` naming requirement for a macro that uses features (raw vaargs, expression parameters, trailing-block parameters) that would otherwise require it.
* `@const` — emitted on a macro; asserts that the macro folds to a compile-time constant for every valid call. The compiler verifies the assertion and reports any non-constant construct that prevents folding.
* `@if(condition)` — conditional compilation. The declaration is compiled only when `condition` (a constant boolean expression) is `true`.
* `@tag(name, value)` — attaches a user-defined tag accessible through reflection (`Ty::get_tag(name)`).

#### Operator overloading

`@operator(op)` declares a method as the implementation of operator `op` on the receiver type. The accepted operator forms are:

* Arithmetic: `+`, `-`, `*`, `/`, `%`, and their assignment forms `+=`, `-=`, `*=`, `/=`, `%=`.
* Bitwise: `&`, `|`, `^`, and their assignment forms `&=`, `|=`, `^=`.
* Shift: `<<`, `>>`, and their assignment forms `<<=`, `>>=`.
* Unary bitwise: `~`.
* Comparison: `==` and `<`. The other relational and equality operators are derived from these and may not themselves be overloaded.
* Subscript: `[]` (read), `[]=` (write), and `&[]` (reference). The reference form returns a pointer to the element.
* Length: `len` — overloads the value queried by `Ty::len` and by `foreach` length calculations.

Increment, decrement, the dot operator, and the comparisons `!=`, `<=`, `>`, `>=` are not directly overloadable. Increment and decrement are derived from `+=` and `-=`; the missing comparisons are derived from `==` and `<`.

Two variants of `@operator` exist for binary operators where the operand order matters:

* `@operator_r(op)` — declares the right-hand-side variant: applies when the receiver appears on the right of the operator and the left-hand operand is of another type. Not valid for operators where this would be meaningless.
* `@operator_s(op)` — declares the *symmetric* variant: applies for either order of operands. Not valid for asymmetric operators (in particular, not for `<`).

The required signatures for each form are given in *Properties of types and values*.

Each overload form imposes signature requirements on the declaring method:

* `[]` — takes one parameter (the index, of integer type) and returns the element type.
* `&[]` — takes one parameter (the index, of integer type) and returns a pointer to the element type. When both `[]` and `&[]` are defined, the return of `&[]` must be a pointer to the return of `[]`.
* `[]=` — takes two parameters (the index, of integer type, and the new element value); the return type is `void`. The value parameter's type must match the return type of `[]`.
* `len` — takes no parameters; the return type must be an integer type.

The arithmetic, bitwise, shift, comparison, and unary overload forms follow the natural signature of their operator: each binary overload takes one parameter (the right-hand operand, after the receiver), each unary overload takes none, and the return type is the type of the operator's result.

#### Switch lowering

* `@jump` — applied to a switch statement; requires that the switch be lowered to a jump table. The switch must satisfy the requirements for jump-table lowering described in *Statements*.

#### Diagnostics and optimization hints

* `@deprecated` / `@deprecated(message)` — emits a compile-time diagnostic at each use of the declaration. An optional string message is included in the diagnostic.
* `@allow_deprecated` — applied to a function; suppresses `@deprecated` diagnostics for declarations referenced inside that function.
* `@unused` / `@used` — suppress or force diagnostics about an unused or unreferenced declaration.
* `@noalias` — applied to a pointer parameter; declares that the parameter does not alias any other parameter or accessible memory for the duration of the call. The compiler may use this assumption for optimization; violating it is undefined behaviour.
* `@nosanitize(check)` — opts the function out of the named runtime sanitizer; `check` is a string such as `"address"`, `"memory"`, or `"thread"`. The set of recognized checks is implementation-defined and may grow over time.
* `@format(index)` — marks a parameter (identified by its 1-based index) as a printf-style format string. The function must have an `args...` (typed variadic) parameter; the format string parameter must be of type `String`. Format mismatches diagnosed by the compiler.

#### Testing and benchmarking

* `@test` — marks the declaration as a test function, run by the test harness. See *Testing and benchmarking*.
* `@benchmark` — marks the declaration as a benchmark function, run by the benchmark harness.

#### Platform-specific

* `@wasm` / `@wasm(name)` / `@wasm(module, name)` — applied to a function, acts as `@export` for the WebAssembly target. The one-argument form sets the exported name; the two-argument form additionally sets the WebAssembly module name (the import or export module).
* `@winmain` — designates a function as the Windows GUI entry point.

#### Interface methods

* `@dynamic` — marks a method as participating in dynamic dispatch through an interface. A type's `@dynamic` methods constitute its interface implementation as described in *Types*. `@dynamic` may not be applied to methods of `any` or to methods of an interface itself; only methods of concrete user-defined types may carry it.
* `@optional` — marks an interface method as not required for every implementor.

#### Type modifiers

A small number of `@`-prefixed forms appear in type positions rather than on declarations, and so are not strictly attributes in the grammatical sense; they are listed here for reference.

* `@simd` — applied to a vector type, requests *SIMD alignment* (a power-of-two alignment derived from the vector's total byte size) in every context, including struct fields and array elements. A `@simd` vector must have a power-of-two length. The contrasting plain vector has element-natural alignment when embedded in a struct or array. See *Types*.

#### Import attributes

A small subset of attributes appears on `import` declarations rather than on entity declarations.

* `@public` — re-export the imported module's private declarations into the importing context (see *Modules*).
* `@norecurse` — prevents the import from being recursive. By default, importing a module also imports all of its submodules; `@norecurse` limits the import to the named module only (see *Modules*).

### Attribute definitions

An *attribute definition* introduces a user-defined attribute that expands to one or more built-in attributes. It is a top-level declaration:

```
attrdef_decl ::= "attrdef" AT_IDENT ("(" parameter_list? ")")? ("=" attribute_list)? ";"
attribute_list ::= attribute ("," attribute)*
```

An attribute defined by `attrdef` may have parameters; the parameters are substituted into the expansion when the attribute is applied at a use site.

```
attrdef @MyAttribute       = @noreturn, @inline;
attrdef @MyCname(x)        = @cname(x);
attrdef @TagFoo(value)     = @tag("foo", value);
attrdef @MyAttributeEmpty;
```

A use of a user-defined attribute is equivalent to the textual substitution of its expansion at the use site. The two function declarations below are equivalent:

```
fn void foo() @MyAttribute { ... }
fn void foo() @noreturn @inline { ... }
```

A user-defined attribute with no expansion is permitted and is used purely for tagging — typically combined with `@tag` for reflection.

User-defined attributes may not be applied to themselves and may not be mutually recursive.

## Contracts

A *contract* is a pre- or post-condition attached to a function or macro that a compiler may use for static analysis, for runtime checking, and for optimization. Contracts are written inside documentation comments delimited by `<* ... *>` (see *Lexical elements*).

Contract analysis is **optional in the language**. A conforming compiler may ignore contracts entirely; one may evaluate them statically and reject programs at compile time; or it may insert runtime checks. Regardless of whether the compiler verifies a contract, *violating* a contract is **unspecified behaviour**: the compiler is permitted to optimize as if every contract holds. Safe builds typically lower contract conditions to runtime assertions.

This permissive policy lets simple C3 compilers omit contract analysis entirely while still letting more sophisticated compilers exploit contracts for static checking and optimization. The language does not specify which interpretation a particular compiler must use, but the existence of a contract on a declaration is well-defined and observable through tooling.

### Contract syntax

A doc comment preceding a function or macro declaration may contain *contract clauses*. Each clause begins with a contract keyword (a `@`-prefixed identifier) and may extend over one or more lines until the next clause keyword or the closing `*>`.

```
contract_block    ::= "<*" contract_clause* "*>"
contract_clause   ::= require_clause
                    | ensure_clause
                    | param_clause
                    | pure_clause
                    | return_clause
                    | deprecated_clause
require_clause    ::= "@require" expression ("," expression)* (":" string_literal)?
ensure_clause     ::= "@ensure"  expression ("," expression)* (":" string_literal)?
param_clause      ::= "@param" ("[" param_mode "]")? IDENTIFIER (":" string_literal)?
param_mode        ::= "&"? ("in" | "out" | "inout")
pure_clause       ::= "@pure"
return_clause     ::= "@return?" return_fault ("," return_fault)* (":" string_literal)?
return_fault      ::= path? CONST_IDENT
                    | path? IDENTIFIER "!"
deprecated_clause ::= "@deprecated" (":" string_literal)?
```

Text within the doc comment that does not begin a contract clause is ordinary documentation, preserved for documentation tooling but not interpreted by the language.

### Preconditions: `@require`

A `@require` clause introduces one or more boolean expressions evaluated at the start of each call. Each expression must evaluate to `true`; the optional trailing string is the message included in a contract-violation diagnostic.

```
<*
 @require foo > 0, foo < 1000 : "foo out of range"
*>
fn int test_foo(int foo)
{
    return foo * 10;
}
```

Within a `@require` expression, the parameters of the function are in scope. The expression must be free of side effects.

### Postconditions: `@ensure`

An `@ensure` clause introduces boolean expressions evaluated immediately before the function returns. Within an `@ensure` expression, the keyword `return` denotes the value being returned (where the return type is non-`void`); the parameters of the function are in scope and refer to their values on *entry* to the function.

```
<*
 @require foo != null
 @ensure return > foo.x
*>
fn uint check_foo(Foo* foo)
{
    return abs(foo.x) + 1;
}
```

The expression must be free of side effects.

### Parameter annotations: `@param`

A `@param` clause annotates a single named parameter with access-mode constraints. The annotations apply primarily to pointer parameters and describe whether the function reads, writes, or both reads and writes through the pointer, and optionally whether the pointer is required to be non-null.

| Annotation  | Read through pointer | Write through pointer | Non-null required |
|------------:|:---:|:---:|:---:|
| (none)      | yes | yes | no |
| `[in]`      | yes | no  | no |
| `[out]`     | no  | yes | no |
| `[inout]`   | yes | yes | no |
| `[&in]`     | yes | no  | yes |
| `[&out]`    | no  | yes | yes |
| `[&inout]`  | yes | yes | yes |

When the `&` prefix is present, the parameter is required to be non-null on entry; a null argument is a contract violation. The clause may carry a trailing string used as the diagnostic message:

```
<*
 @param [&in] data : "data must be a valid, non-null buffer"
*>
fn void process(char* data) { ... }
```

A conforming compiler may, but need not, statically verify that the function body respects the declared access mode. Violation is unspecified behaviour.

### Purity: `@pure`

A `@pure` clause declares that the function neither reads from nor writes to global state. A pure function may call other pure functions but may not call functions known to be impure.

At a call site within a pure function, an otherwise-impure call may be marked `@pure` to assert that the call is, for the purposes of the surrounding contract, pure. The compiler may use the declared purity for optimization. As with `@param`, the compiler is not required to verify purity, and violations are unspecified behaviour.

### Fault declarations: `@return?`

The `@return?` clause lists the fault values that the function may propagate through an optional return type. Each entry is one of:

* A fault constant (a `CONST_IDENT`, optionally module-qualified) — adds that specific fault to the set the function may return.
* A function or macro name followed by `!` — *inherits* the `@return?` set of the named entity. Every fault that the referenced function or macro declares it may propagate is added to this function's set.

```
<*
 @return? io::EOF, test! : "Returns EOF if it runs out of tokens"
*>
fn String parse(String input) { ... }
```

In the example, `parse` declares `io::EOF` directly and additionally inherits every fault from `test`'s own `@return?` clause.

In the current implementation, the compiler statically checks that no fault is *directly* raised within the function — for example, by an expression of the form `return io::EOF~;` — unless that fault appears in the declared `@return?` set. This check is limited by what static analysis can determine: faults that arise from indirect calls or through dynamic dispatch are not generally tracked. A conforming compiler is not required to enforce `@return?` at compile time or at runtime; as with all contracts, violation is unspecified behaviour.

### Deprecation: `@deprecated`

A `@deprecated` clause within a contract block is an alternative to the `@deprecated` attribute (see *Attributes*) and has the same effect: a compile-time diagnostic is emitted at each use of the declaration. The clause may carry a message as a trailing string:

```
<*
 @deprecated : "Use parse_v2 instead"
*>
fn String parse(String input) { ... }
```

The contract form is provided so that deprecation information may live alongside the declaration's other documentation. A declaration may carry either the contract clause or the attribute form, but not both.

### Macros and contracts

Macros may carry the same contract clauses as functions. Because macros are expanded inline, contract conditions are particularly useful for constraining macro arguments in ways that cannot be expressed through the parameter list alone. The compile-time builtin `$defined` is the principal mechanism for testing argument well-formedness from within a contract:

```
<*
 @require $defined(a + b) : "operands must support +"
*>
macro add(a, b) => a + b;
```

The `@require` clause is evaluated at compile time when the macro is instantiated, allowing the constraint to be enforced before the macro body is processed.

### Runtime evaluation

When the compiler chooses to lower a contract clause to a runtime check, it inserts the equivalent of an `assert` statement at the appropriate point: at the function's entry for `@require`, immediately before each `return` for `@ensure`, and at the call site for `@pure`-related and `@param`-related checks. The form of the resulting diagnostic is implementation-defined; the program traps on contract violation.

In a non-safe build, the compiler may elide all such runtime checks, leaving only the static-analysis effect of the contract.

## Generics

C3 supports generic types, functions, and macros through *parameterization* by types and compile-time values. A parameterized declaration is *instantiated* at the point of use by supplying concrete arguments for the parameters; each unique parameterization produces a distinct entity that is compiled, type-checked, and reachable independently.

### Forms of parameterization

A parameter list `<param ("," param)*>` introduces one or more parameters of these kinds:

* A *type parameter* (`TYPE_IDENT`) names a type that is supplied at instantiation. Within the parameterized scope, the parameter is usable wherever a type is valid.
* A *value parameter* (`CONST_IDENT`) names a compile-time-constant value supplied at instantiation. The value's type must be an integer, boolean, enum, or fault type. Within the parameterized scope, the parameter is usable wherever a compile-time constant of the appropriate type is valid.

A parameter list may appear in two positions:

* On a **module section**, immediately after the module path: `module vector <Ty, Tu>;`. This form is purely a shorthand: every declaration inside the section receives the same parameter list, exactly as if it had been written individually.
* On an **individual declaration** — a type, function, or macro — between the declared name and the rest of the form: `struct Foo <Ty> { ... }`, `fn Ty add(Ty a, Ty b) <Ty> { ... }`.

The two forms are equivalent. The following are interchangeable:

```
module my_module <Ty>;

struct MyStruct { Ty a, b; }

fn Ty square(Ty t) { return t * t; }
```

```
module my_module;

struct MyStruct <Ty> { Ty a, b; }

fn Ty square(Ty t) <Ty> { return t * t; }
```

### Grouping of parameterized declarations

Within a single module, two parameterized declarations belong to the **same generic unit** when they share the *number* of parameters *and* the *names* of those parameters. Members of the same generic unit are instantiated *together*: a use of one member triggers instantiation of every other member of the unit.

```
module abc;

// Generic unit 1: parameterized by <Test>
fn Test test1(Test a) <Test> { return a + 1; }
struct Foo <Test> { Test a; }
fn Foo test2(Test b) <Test> { return (Foo) { .a = b }; }

// Generic unit 2: parameterized by <Test2> — a different parameter name
fn Test2 test3(Test2 a) <Test2> { return a * a; }

fn void main()
{
    Foo{int} a;        // Instantiates Foo, test1, and test2 for <int>.
                       // Does not instantiate test3, which is in a different unit.
}
```

A use of any member of the unit causes every member of that unit to be instantiated for the same argument tuple. This differs from C++, where each template is individually instantiated on demand; in C3, sibling members of a generic unit are kept in lock-step.

Declarations in *different* modules do not group, even if their parameter names and counts agree.

### Instantiation

A parameterized entity is *instantiated* by supplying type or value arguments inside curly braces:

```
generic_arguments ::= "{" type_or_value ("," type_or_value)* "}"
type_or_value     ::= type | constant_expression
```

For a parameterized type the result is a type; for a parameterized function or macro the result is a callable entity:

```
Foo {int, double} g;
test {int, double} (1.0, &g);
```

Each distinct argument tuple yields a separate instantiation. Two instantiations with structurally equal argument tuples are the same entity.

The argument count must match the parameter count of the targeted unit; each type parameter must be supplied a type and each value parameter a compile-time constant of one of the permitted kinds.

### Aliases

A non-parameterized alias may name a specific instantiation of a parameterized entity:

```
alias FooFloat   = Foo {float};
alias test_float = test {float, double};
```

An alias itself may be parameterized using its own parameter list; the alias parameters are then in scope on the right-hand side and may be passed to instantiations there:

```
alias List <Ty> = std::collections::list::List {Ty};
```

The `<Ty>` after the alias name declares the alias as generic. The `{Ty}` on the right-hand side instantiates the underlying parameterized entity. A form such as `alias List {Ty} = ...` is *not* permitted: the curly-brace form denotes instantiation of an existing parameterized entity, not the introduction of a new parameter.

A parameterized alias is rarely useful in practice, since a use of the alias's name with arguments resolves through to the underlying entity in the same way; the alias adds no abstraction over the original.

### Constraints on parameters

The accepted set of parameter kinds is fixed: type parameters and value parameters of integer, boolean, enum, or fault type. The language imposes no further constraint at the parameter list itself. Additional constraints are expressed through *contracts* (see *Contracts*) using compile-time predicates such as `$defined`, `$Typeof`, and the type-property accessors:

```
<*
 @require $defined((Tu)1)
 @require Ty.kindof == TypeKind.SIGNED_INT
*>
module vector <Ty, Tu>;
```

A failed contract on a parameterized declaration produces a diagnostic at the point of instantiation; the diagnostic identifies the violated `@require` clause and the parameter values that caused the failure.

Contracts placed on the module section and on individual parameterized type declarations combine and are evaluated together for the generic unit. Contracts on generic functions and macros are checked only when those functions or macros are themselves invoked: a contract that constrains a function's type parameter does not propagate to instantiations of a sibling generic type in the same unit.

### Methods on parameterized types

A method declared on a parameterized type is itself implicitly parameterized over the type's parameters; the parameters are in scope within the method's signature and body:

```
struct Foo <Ty>
{
    Ty value;
}

fn Ty Foo.add(self, Ty other) => self.value + other;
```

`Foo.add` is part of `Foo`'s generic unit and is instantiated alongside `Foo` for each argument tuple.

A method may also be declared on a *specific* instantiation of a parameterized type. In that case the parameters are not in scope; the method applies only to that one instantiation:

```
fn int Foo {int} .doubled(self) => self.value * 2;
```

This method is available on `Foo{int}` only.

### Visibility, name resolution, and ordering

Visibility rules in *Modules* apply unchanged to parameterized declarations. The compiler instantiates a parameterized declaration only when it is referenced; errors that depend on the parameter values, including unresolved references inside a method body or a contract that fails to hold, are reported at the point of instantiation.

### Identity and ABI

Two instantiations are the same entity if and only if their argument tuples are component-wise equal: types compared by type identity (see *Properties of types and values*), and values compared by constant-expression equality. Instantiations with different argument tuples are independent entities with independent symbol identities and may have different sizes, alignments, and ABIs.

A parameterized declaration is not itself a runtime value; only its instantiations are. A function pointer cannot bind to a parameterized function — it must bind to a specific instantiation.

## Modules

A *module* is the unit of namespace, visibility, and compilation in C3. Every top-level declaration belongs to exactly one module. Modules may be spread across multiple files, may be nested hierarchically, and may import declarations from other modules.

### Module names and hierarchy

A module name is a path of one or more lowercase identifiers separated by `::`:

```
module_path ::= IDENTIFIER ("::" IDENTIFIER)*
```

Each component must consist of lowercase ASCII letters, digits, and underscores, and must be no longer than 31 characters. The full module name, including the `::` separators between components, must not exceed 127 characters in total. A nested module such as `foo::bar::baz` is the submodule `baz` of `foo::bar`, which is in turn the submodule `bar` of `foo`.

A C3 source file in a normal build begins with a `module` declaration naming the module to which its top-level declarations belong:

```
module foo::bar;
```

A source file with no `module` declaration belongs entirely to an *implicit module* whose name is the file's stem in lowercase, with characters outside the identifier alphabet replaced by underscore. A file using the implicit module name must contain no `module` declaration.

### Module sections

Each `module` declaration opens a *module section*. Multiple sections may appear in one file — for the same module or for different modules — and a single module may span multiple sections and multiple files. The full grammar and the section's attribute defaults (visibility, `@if`, generic parameters) are described in *Blocks and scope*.

A section's imports and any attribute defaults apply only within that section. A subsequent section, even of the same module in the same file, must re-declare any imports it needs.

### Visibility

Each declaration has one of three visibilities:

* **public** — visible everywhere the declaration's module is in scope through `import`. Public is the default for module-level declarations.
* **private** (`@private`) — visible only within the declaration's own module.
* **local** (`@local`) — visible only within the same source file.

A module section may declare a default visibility (`@private` or `@local`) that applies to every declaration within the section unless an individual declaration overrides it with an explicit `@public`.

A declaration's visibility may be overridden at an importer's request: writing `import lib @public` makes the private declarations of `lib` accessible in the importer's section. Declarations marked `@local` are never accessible across files and cannot be re-exported by `import @public`.

### Linker visibility and exports

Visibility (`@public`, `@private`, `@local`) controls source-level access. *Linker visibility* — whether a symbol is exposed to other translation units and to external linkers — is a separate concern controlled by the attributes `@export`, `@weak`, `@weaklink`, and `@cname`, described in *Attributes*. By default, source-level public declarations have linker linkage suitable for use within the C3 program but are not exported as library symbols; `@export` opts a declaration into being a library export.

### Imports

An `import` declaration brings the declarations of another module into the current section's name space.

```
import_declaration ::= "import" import_item ("," import_item)* ";"
import_item        ::= module_path import_attr*
import_attr        ::= "@public" | "@norecurse"
```

A bare `import lib;` is *recursive*: it imports `lib` and all of its submodules, so that names declared in `lib`, `lib::sub`, `lib::sub::deep`, and so on become available without further imports. To import only a specific module without its submodules, append `@norecurse`:

```
import lib @norecurse;
import lib1 @norecurse, lib2;
```

To gain access to the private declarations of an imported module, append `@public`:

```
import internals @public;
```

`@public` may not be used to access `@local` declarations, which are never visible across files.

It is a compile-time error if the compiler cannot locate an imported module, or any submodule reached through a recursive import. Inside a module section carrying `@if`, this check is suppressed unless the `@if` condition evaluates to `true`.

### Implicit imports

Every section implicitly imports:

* The standard-library module `std::core` and its submodules. The names declared there are available without any explicit `import`.
* Every other module whose path shares the same top-level component as the current module. Within a module `foo::abc`, the modules `foo`, `foo::cde`, and so on are implicitly imported.

Implicit imports may be supplemented with explicit ones; an explicit `import` of an implicitly-imported module is permitted and harmless.

### Name resolution

Inside a section, an unqualified name resolves through the following name spaces in order:

1. The current section's declarations.
2. Other sections of the same module.
3. Declarations imported by the section's `import` declarations.
4. Implicitly-imported modules.

When more than one entity matches an unqualified name, the reference is ambiguous and must be qualified. A name is qualified by prefixing it with a module path: `foo::bar` denotes the declaration `bar` in module `foo`. Only as many leading path components as necessary to disambiguate the name need be supplied.

Type names, ordinary identifiers, constant identifiers, and attribute identifiers each form a distinct name space (see *Blocks and scope*); a name in one space does not conflict with the same text in another. Qualification by module path applies uniformly to all of them.

Imported ordinary and constant identifiers must be qualified with at least with the closest submodule path. Identifiers marked with `@builtin` is exempt from this rule. Type identifiers may be used unqualified when unambiguous.

### Module aliases

A module alias (declared by `alias name = module path;`, see *Declarations*) may stand in place of a module path in `import` declarations and in qualified-name expressions:

```
alias mc = module my::collection;

import mc;          // equivalent to import my::collection
mc::Map m;          // equivalent to my::collection::Map
```

### Source-text inclusion

A module may incorporate text from outside its source files through three compile-time directives:

* `$include("path")` — splices the contents of the named file into the current source at the directive's position, as if its text had been written there. Valid only at the top level of a module section. Requires the build to be run at trust level `include` or higher.
* `$exec("command", args?, stdin?)` — runs the named external program and splices its standard output into the source. Requires trust level `full`.
* `$embed("path")` — embeds the named file's contents as a compile-time byte-array value, not as source text. Requires `include` trust level.

The trust level is set by the build invocation and defaults to forbidding both forms. A failed trust check is a compile-time error.

### Project structure and the compiler's view

The C3 compiler is invoked on a set of source files; the build system tells the compiler which files belong to which modules. There is no fixed mapping between file names and module names beyond the single-file fallback above. A module may be implemented in any number of files arranged in any directory structure permitted by the build system.

The visibility, import, and alias rules described above are evaluated independently of the on-disk layout: only the `module` declarations in the source files determine the module structure as seen by the compiler.

## Optionals and faults

C3 represents recoverable error conditions through *optional* types — types of the form `Ty?` whose values are either a successful instance of `Ty` or a *fault*. A function that may fail returns an optional; callers use a small set of operators and conditional forms to handle the two cases. Optionals are first-class types in the language; they participate in expressions, propagate through arithmetic and calls, and integrate with the type system rather than being a library construct.

### Faults

A *fault* is a value of the built-in type `fault`. Fault values are introduced into a module by `faultdef` declarations:

```
faultdef IO_ERROR, NOT_FOUND, ACCESS_DENIED;
```

Each `faultdef` introduces one or more named fault values. Two fault values compare equal under `==` and `!=` if and only if they are the same declared fault. Faults have no inherent ordering and no associated payload; a program that needs to attach data to a fault typically wraps the fault in a richer return type.

The literal `null` denotes "no fault" — the absence-of-fault value carried by a successful optional. The literal may be used in fault comparisons (`@catch(x) == null`) and as a fault assignment.

Fault declarations follow the rules for ordinary top-level declarations and may carry attributes, visibility modifiers, and contracts (see *Declarations*).

### Optional types

The type `Ty?` denotes an *optional* `T`: a value that is either a successful instance of `Ty` or a fault. An optional `void?` carries only the fault status. Types of the form `Ty??` are not permitted: the underlying type of an optional may not itself be optional.

The optional type carries the same memory representation as `Ty`; the success/fault status is tracked alongside the value and does not change `Ty`'s size or alignment. An optional is well-formed only when accompanied by a definite success/fault state; uninitialized optional variables follow the zero-initialization rules (the zero state is a successful zero value, not a fault, for most underlying types).

A value of type `Ty` is implicitly convertible to `Ty?` as a successful optional. A fault value is converted to an optional through the postfix `~` operator: `excuse~` produces an optional whose underlying type is inferred from context, carrying `excuse` as its fault.

```
fn int? get_value(bool ok)
{
    if (ok) return 42;          // implicit success
    return IO_ERROR~;           // explicit fault
}
```

### Propagation through expressions

An optional value in an expression makes the surrounding expression's type optional. Arithmetic, calls, and other operators applied to optional operands produce optional results that propagate the fault.

Evaluation of such an expression is *conditional*. If any subexpression evaluates to a faulty optional, the remaining subexpressions are not evaluated and the surrounding expression takes that fault as its value, in left-to-right order:

```
int? c = foo() + bar();      // if foo() is faulty, bar() is not called.
abc(foo(), bar());           // if foo() is faulty, bar() is not called and abc is not invoked.
```

Function arguments may not themselves be declared with an optional type. A faulty optional supplied as an argument always triggers the conditional-call propagation above.

### Function return types

A function may declare an optional return type:

```
fn int? read_byte(...);
fn void? close_file(...);
```

A call to such a function produces an optional value that must be consumed: it may not be assigned to a non-optional variable, passed as a non-optional argument, or returned from a non-optional function without going through one of the handling forms below.

A function with return type `void?` returns no value but may return a fault. Statement-level uses of such a function — `close_file()!;`, `close_file()!!;`, or a `catch` form — must be present whenever the call appears in a non-optional context.

### Handling optionals

#### Rethrow: postfix `!`

The postfix `!` operator unwraps an optional. If the optional is successful, the result is the underlying value of type `Ty`. If the optional is faulty, the enclosing function returns immediately, propagating the fault to its own caller. The enclosing function must therefore itself have an optional return type compatible with the fault being propagated.

```
fn int? double_byte()
{
    int x = read_byte()!;       // returns the fault on failure
    return x * 2;
}
```

The expression `e!` is equivalent to:

```
if (catch excuse = e) return excuse~;
// e is unwrapped
```

#### Force unwrap: postfix `!!`

The postfix `!!` operator unwraps an optional, trapping (terminating the program with a diagnostic) if the optional is faulty. `!!` is intended for cases where the programmer asserts that the optional cannot be faulty at that point; it is not a substitute for proper handling.

#### Optional-else: `??`

The binary `??` operator yields the underlying value of a successful optional, or evaluates and returns a default expression if the optional is faulty:

```
int v = read_byte() ?? 0;
```

The right operand is evaluated only when the optional is faulty. The result type is the common type of the left operand's underlying type and the right operand. The right operand may itself be an optional, in which case `??` may be chained.

#### `try` and `catch` in conditions

The conditional forms in *Statements* permit `try` and `catch` unwraps. `try` extracts the underlying value of a successful optional; `catch` extracts the fault of a faulty optional:

```
if (try x = read_byte())
{
    // x : int, the optional was successful
}

if (catch excuse = read_byte())
{
    // excuse : fault, the optional was faulty
}
```

A `try` condition may chain multiple unwraps with `&&`:

```
if (try a = read_byte() && try b = read_byte())
{
    // a, b are both unwrapped int
}
```

A `catch` condition may bind several optionals; the binding refers to the first one that is in the fault state.

#### Implicit unwrapping

After a `catch` branch that exits the surrounding scope through `return`, `break`, `continue`, or rethrow, the compiler statically determines that the original optional variable cannot be in the fault state in the code that follows. The variable is then implicitly *unwrapped*: within the unwrapped scope, references to it have the underlying non-optional type.

```
int? foo = unreliable_function();
if (catch excuse = foo)
{
    return excuse~;
}
// foo is implicitly unwrapped to int from here to the end of the scope.
io::printfn("foo = %s", foo);
```

When the condition of an `if` is a `catch` unwrap binding one or more optionals, the `else` branch implicitly unwraps each bound optional. Reaching the `else` branch means that the catch did not match, so each operand is known to be in the success state in that branch:

```
int? a = foo();
int? b = bar();
if (catch excuse = a, b)
{
  return excuse~;
}
else
{
  int x = a + b;          // a and b are implicitly unwrapped
}
```


The same unwrapping applies after the rethrow operator: a statement of the form `int x = foo!;` both rethrows the fault and binds the unwrapped value to `x`. Subsequent references to `foo` in the same scope continue to be optional.



### `void?` and statement-level optionals

A `void?` value carries only the fault status. A `void?` may not be stored in a variable: there is no value content to retain, and the fault status alone is too ephemeral to be a useful target for assignment. The compiler rejects declarations such as `void? x = close_file();`.

`void?` calls are consumed at the statement level by one of the handling forms:

```
close_file()!;
close_file()!!;
if (catch e = close_file()) { ... }
close_file() ?? do_recovery();
```

### Faults and function-pointer types

A function-pointer type whose return type is optional matches another such type if and only if the underlying return types match. The set of faults a function may return is not part of the function-pointer type. Consequently, the set of possible faults at a call site is determined statically only for direct calls; for calls through function pointers or interface methods, the program must handle any fault propagated through the optional return.

### `@return?` and contract checking

The `@return?` contract clause (see *Contracts*) documents the faults a function may return. A conforming compiler is not required to enforce `@return?` either at compile time or at runtime; current implementations check only direct fault raising visible through static analysis (`return excuse~;` and the `!` operator on calls with known fault sets).

## Built-in functions and intrinsics

The language reserves the namespace of identifiers beginning with `$$` for compiler use. Within that namespace, two categories are distinguished:

* **Built-in compile-time constants**, listed below, are required of every conforming compiler. Each yields a value, of the specified type, at the point where the identifier appears.
* **Intrinsic functions** (other `$$`-prefixed callables) are not specified by this document. A conforming compiler may provide any number of them, none of them, or different ones across versions. User code reaches intrinsic functionality through the standard library, which exposes stable wrappers (such as `mem::copy`) over whatever intrinsics a given compiler supplies.

### Built-in compile-time constants

A conforming compiler provides the following constants. Source-location values describe the textual location of the reference; inside an expanded macro body, all such values except `$$LINE_RAW` describe the location of the call site rather than the macro source.

* `$$FILE` — the basename of the current source file, as a string.
* `$$FILEPATH` — the full path of the current source file, as a string.
* `$$LINE` — the line number of the reference, as an integer constant.
* `$$LINE_RAW` — the line number of the reference *before* macro expansion, as an integer constant.
* `$$FUNC` — the unqualified name of the enclosing function, as a string.
* `$$FUNCTION` — a reflective reference (in the sense of *Reflection*) to the enclosing function.
* `$$MODULE` — the qualified name of the enclosing module, as a string.
* `$$DATE` — the date of compilation, as a string of the form `Mon Jan  1 2025`.
* `$$TIME` — the time of compilation, as a string of the form `12:34:56`.
* `$$BENCHMARK_NAMES` — in a benchmark build, an array of strings giving the names of the benchmark functions; otherwise an empty array.
* `$$BENCHMARK_FNS` — in a benchmark build, an array of function pointers to the benchmark functions, in the same order as `$$BENCHMARK_NAMES`; otherwise an empty array.
* `$$TEST_NAMES` — in a test build, an array of strings giving the names of the test functions; otherwise an empty array.
* `$$TEST_FNS` — in a test build, an array of function pointers to the test functions, in the same order as `$$TEST_NAMES`; otherwise an empty array.

### Intrinsic functions

Intrinsic functions in the `$$` namespace — for example `$$trap`, `$$memcpy`, `$$sqrt` — are implementation details shared between a compiler and its standard library. The C3 language does not specify which intrinsic functions a compiler provides, nor their signatures or semantics; a conforming compiler may provide a different set, or none at all, while still implementing the language and its standard library faithfully.

User code accesses the underlying functionality through the stable, module-qualified names provided by the standard library, rather than by referencing intrinsic functions directly.

## Inline assembly

C3 provides two forms of inline assembly: an *assembly string*, in which a compile-time string is passed verbatim to the backend, and an *assembly block*, in which a small structured grammar lets the compiler infer register clobbers and operand directions across a sequence of instructions.

```
asm_statement   ::= asm_string_form | asm_block_form
asm_string_form ::= "asm" "(" constant_expression ")" attributes? ";"
asm_block_form  ::= "asm" attributes? "{" asm_instruction* "}"
```

The current grammar covers a subset of x86, aarch64, and riscv; other targets may have no inline-assembly support. The instruction set accepted in the structured form is a work in progress and may be extended in later language versions.

### Assembly strings

The string form takes a single compile-time string and passes it without further processing to the backend assembler. The string is responsible for any assembler directives, syntax, and operand referencing required by that backend; the compiler performs no operand substitution.

```
int x = 0;
asm("nop");
int y = x;
```

The string form is appropriate for self-contained, parameter-free fragments such as fence or no-op instructions, or for forwarding to backend-specific facilities not yet covered by the structured form.

### Assembly blocks

The structured form accepts a sequence of instructions in a common grammar that abstracts over the underlying processor. Each instruction consists of an instruction mnemonic followed by zero or more comma-separated arguments and a terminating semicolon:

```
asm_instruction ::= IDENTIFIER (asm_arg ("," asm_arg)*)? ";"
asm_arg         ::= IDENTIFIER
                  | CONST_IDENT
                  | INTEGER_LITERAL
                  | "$" IDENTIFIER
                  | "&" IDENTIFIER
                  | "[" asm_address "]"
                  | "(" expression ")"
asm_address     ::= asm_arg ( "+" asm_arg ( "*" CONST_INTEGER )? )* ( "+" CONST_INTEGER )?
```

The six argument forms are:

1. An identifier or constant identifier (`FOO`, `x`) — a C3-level name in scope at the assembly block. The compiler resolves the name and chooses a suitable operand encoding.
2. An integer literal (`1`, `0xFF`) — an immediate operand.
3. A register reference `$name` (always lowercase, e.g. `$eax`, `$r7`) — a target-specific machine register.
4. An address-of expression `&name` — the address of the named C3 variable.
5. An indirect address `[addr]`, optionally with an index and offset `[addr + index * const + offset]` — a memory operand.
6. A parenthesized expression `(expr)` — any C3 expression, evaluated before the assembly block runs; its value is used as the operand.

A complete example:

```
int aa = 3;
int g;
int* gp = &g;
int* xa = &aa;
sz asf = 1;
asm
{
    movl x, 4;                   // Move 4 into the variable x
    movl [gp], x;                // Move the value of x into the address in gp
    movl x, 1;                   // Move 1 into x
    movl [xa + asf * 4 + 4], x;  // Move x into the address at xa[asf + 1]
    movl $eax, (23 + x);         // Move 23 + x into EAX
    movl x, $eax;                // Move EAX into x
    movq [&z], 33;               // Move 33 into the memory address of z
}
```

Inside an `asm` block the compiler infers register clobbers and per-operand input/output direction from the instructions used. Operand types are checked against the requirements of each instruction.

### Interaction with surrounding code

An `asm` block is a statement (see *Statements*). Variables in scope at the block may be referenced as operands by name; doing so is equivalent to passing them through compiler-chosen operands of the appropriate kind. Register references `$name` bypass C3-level analysis and refer directly to the named hardware register.

The `@naked` function attribute (see *Attributes*) suppresses the compiler-generated prologue and epilogue around a function body; combined with `asm` blocks, it permits writing functions whose entire body is assembly.

## C interoperability

C3 follows the platform C ABI. A C3 function may call a C function without intermediate stubs, and a C function may call a C3 function whose external symbol is known. This chapter describes the language-level facilities for declaring foreign symbols, naming exported symbols, and the points where C3 and C semantics differ.

### Declaring foreign functions

A function definition introduced by the `extern` keyword has no body and refers to a function defined in another translation unit, typically a C library:

```
extern fn void puts(char*);

fn void main()
{
    puts("Hello, world!");
}
```

The function signature is given in C3 syntax; the compiler treats the call as it would any other function call but uses the platform C ABI for argument passing, return value, and stack handling. The name `puts` here is both the C3-side identifier and the external symbol name; both are looked up at link time.

The `extern` keyword may be applied to function and global variable declarations. The form does not introduce a new linkage attribute; it changes the declaration from "definition" to "external reference".

### Renaming foreign symbols

When the C3-side name should differ from the external symbol name, the `@cname` attribute selects the external name explicitly:

```
extern fn void foo_puts(char*) @cname("puts");

fn void main()
{
    foo_puts("Hello, world!");        // Calls C "puts"
}
```

`@cname` may be applied to extern declarations, to exported C3-side definitions, or to any declaration whose external linker name should differ from the source-level identifier. The argument must be a compile-time string and must form a valid identifier for the target's symbol table.

### Exporting C3 functions to C

A C3 function with linker-visible linkage may be called from C using its external symbol. To make a C3 function callable as a stable, name-stable C symbol, attach `@export` (with or without an explicit external name) and ensure the function's signature uses types whose layout matches a C declaration on the other side:

```
module foo;

fn int square(int x) @export
{
    return x * x;
}

fn int square2(int x) @export("square")
{
    return x * x;
}
```

A bare `@export` exports the function under a symbol derived from the module-qualified name (e.g. `foo__square` for `square` in module `foo`). An `@export("name")` exports the function under the named symbol exactly. The C side may then declare and call the function in the usual way:

```
extern int square(int);

void test()
{
    printf("%d\n", square(11));
}
```

Because C3 namespaces symbols by module under bare `@export`, an exported function whose C-side name must be unprefixed should use the explicit `@export("name")` form.

### Type correspondence

The following table summarises the correspondence between C and C3 types under the platform C ABI. Unless noted otherwise, the types are identical in size, alignment, and ABI representation.

| C type            | C3 type                          |
|-------------------|----------------------------------|
| `signed char`     | `ichar`                          |
| `unsigned char`   | `char`                           |
| `short`           | `short`                          |
| `unsigned short`  | `ushort`                         |
| `int`             | `CInt` (platform-defined alias)  |
| `unsigned int`    | `CUInt`                          |
| `long`            | `CLong`                          |
| `unsigned long`   | `CULong`                         |
| `long long`       | `CLongLong`                      |
| `unsigned long long` | `CULongLong`                   |
| `float`           | `float`                          |
| `double`          | `double`                         |
| `void*`           | `void*`                          |
| `T*`              | `T*`                             |
| `T[N]` (as argument) | `T[N]*` (see Arrays below)    |

C3's fixed-width integer types (`int`, `long`, etc.) have a size determined by the language rather than the platform. The `C`-prefixed aliases (`CInt`, `CLong`, ...) name the platform's C integer types and should be used whenever interoperating with a C declaration.

### Arrays in C signatures

In C, an array parameter decays to a pointer. C3 has no such decay rule: a fixed array in a C3 signature represents the array as a value (typically passed as if by struct).

To call a C function whose declaration uses an array parameter, the C3-side declaration should use a pointer type:

```
// C: void test(int a[]);
extern fn void test(int* a);

// C: void test2(int b[4]);
extern fn void test2(int[4]* b);
```

A pointer to a fixed array (`int[4]*`) is implicitly convertible to a pointer to the array's first element (`int*`), so the C3-side declaration may also use the latter form when the function takes a pointer-to-element rather than pointer-to-array.

### Other differences from C

* **Bitstructs.** A bitstruct (see *Types*) appears to C code as its backing integer type. C bit-fields cannot be expressed directly in a C3 declaration; an equivalent C3 bitstruct must be constructed manually with the correct layout for the target.
* **Enum size.** C compilers assume that an enum has the size of `int` (`CInt`). When passing enums across the boundary, ensure the C3 enum's backing type is `CInt`.
* **Atomic types.** C's `_Atomic` qualifier has no direct C3 counterpart; C3 provides generic atomic types in the standard library that are not ABI-compatible with C atomics.
* **`const` and `volatile` qualifiers.** C3 has no type qualifiers `const` or `volatile`. The C `const` qualifier on parameters is informational and does not affect ABI; the C `volatile` qualifier has no C3 equivalent at the type level, but `@volatile_load` and `@volatile_store` (see the standard library) provide the same access semantics.
* **Pass-by-value arrays.** A C3 function that passes a fixed array by value is ABI-equivalent to a C function that passes a struct containing the array, not to a function with an array-typed parameter.

### External symbol resolution

An `extern` declaration must be matched by a definition in another translation unit at link time. A program that fails to resolve an `extern` symbol is ill-formed. The mechanism by which external libraries are made available to the linker — search paths, library names, link order — is part of the build system and the system linker, not of the language.

## Program initialization and execution

A C3 program is a collection of modules linked together with a single distinguished entry point. This chapter describes how a program is started, how its global state is initialized, how user-supplied initializer and finalizer functions interact with the entry point, and how the program terminates.

### Entry point

A program declares its entry point with a function named `main` at module scope. The compiler accepts several forms:

```
fn void main()                                 { ... }
fn int  main()                                 { ... }
fn void main(String[] args)                    { ... }
fn int  main(String[] args)                    { ... }
fn void main(int argc, char** argv)            { ... }
fn int  main(int argc, char** argv)            { ... }
```

A `void`-returning `main` exits with status `0` on normal return; an `int`-returning `main` exits with the returned value.

The forms taking `String[] args` provide command-line arguments as a slice of strings; the C-style form taking `int argc, char** argv` mirrors the C entry-point signature and is intended for direct interoperation with the platform's startup conventions. The argument slice's lifetime extends for the entire run of the program.

A program has exactly one `main`. On a target whose system requires a different entry-point shape (for example, Windows `WinMain`), the `@winmain` attribute (see *Attributes*) selects that platform-specific shape; on other targets the attribute has no effect.

### Global initialization

Global variables and constants are initialized before `main` is entered. Initialization proceeds in three stages, in order:

1. *Static constant initialization.* Every named constant whose initializer is a constant expression takes its value as part of the program image. Such constants are available from the moment execution begins.
2. *Static variable initialization.* Each global variable receives its initializer's value. Initializers are evaluated in an order consistent with their dependencies: if one global's initializer reads another, the dependee is initialized first. Globals with no dependency relationship may be initialized in any order. A global with no explicit initializer is zero-initialized unless it carries `@noinit` (see *Attributes*), in which case its initial contents are indeterminate.
3. *Initializer functions.* After all globals have their initial values, every function declared with the `@init` attribute is invoked. `@init` accepts an optional priority argument; functions with a lower priority value run before those with a higher one. The relative order of `@init` functions sharing the same priority is unspecified.

`main` is entered after stage 3 completes. Any global that is read before its stage-2 initialization runs holds its zero value (or, with `@noinit`, an indeterminate value).

Globals with thread-local storage (`tlocal`) follow the same staged process for each thread independently: stage 2 and stage 3 are performed for each newly-created thread before that thread executes any user code.

### Program termination

A program terminates in one of the following ways:

* `main` returns. The return value of an `int`-returning `main` is the program's exit status; a `void`-returning `main` yields exit status `0`.
* A call to a function declared `@noreturn` exits the program (typically through a runtime trap, a system-call wrapper, or an explicit exit function).
* A trap from a contract violation, sanitizer check, or `$$trap`-derived runtime check terminates the program with an implementation-defined exit status.

Before the process exits through `main` return, every function declared with the `@finalizer` attribute is invoked. `@finalizer` accepts an optional priority argument with the same convention as `@init`: lower priority values run earlier. The relative order of finalizers sharing the same priority is unspecified. Every finalizer is guaranteed to run if termination occurs through a normal return from `main`; finalizers are *not* guaranteed to run when the program exits through a trap or `@noreturn` call.

### Static and thread-local storage lifetime

A static local (`static` storage in a function) is initialized on first entry to its declaring function. Subsequent entries see the value left by the previous execution. The variable's storage persists for the entire program lifetime.

A thread-local variable (`tlocal` storage) has independent storage per thread. Initialization follows the staged global model above, re-run for each thread the program creates. The storage is released when the thread terminates.

### Module-section evaluation order

Within a translation unit, the order of declarations does not affect initialization order: dependencies between global initializers are resolved by analysis, not by source order. Two globals with mutually-dependent initializers are a compile-time error.

Across translation units and modules, the same dependency-based ordering applies. Programs that rely on a specific initialization order between independent globals are not portable.

## Testing and benchmarking

C3 supports test and benchmark functions as a built-in feature of the language. The attributes `@test` and `@benchmark` mark functions for execution by the test and benchmark drivers; the compiler reflects the set of marked functions through compile-time constants that the standard-library driver uses to discover and invoke them.

### Test functions

A function declared with the `@test` attribute is a *test function*. The function's signature must be:

```
fn void IDENTIFIER()
```

A test function takes no arguments and returns `void`. A clean return counts as a passed test; a runtime trap encountered during execution — from a contract violation, a failed `assert`, an unhandled fault, or any other source — counts as a failure. The standard-library test driver records the test's outcome and reports it.

A test function is compiled into the program only when the compiler is invoked in a *test build* (the precise invocation depends on the build system). In a non-test build, the function and any other declarations whose only references are from test code are omitted entirely from the compiled program.

### Benchmark functions

A function declared with the `@benchmark` attribute is a *benchmark function*. Its signature requirements parallel those of test functions:

```
fn void IDENTIFIER()
```

Benchmark functions are compiled into the program only in a *benchmark build*. The standard-library benchmark driver determines how each benchmark is timed and reported.

### Section-level application

`@test` and `@benchmark` may also be applied to an entire module section (see *Blocks and scope*). When a section carries one of these attributes, every function declared within the section is treated as if it carried the same attribute individually. This is the usual way of grouping a body of tests or benchmarks without repeating the attribute on each declaration:

```
module my_module @test;

fn void test_first() { ... }
fn void test_second() { ... }
```

Both functions are test functions, and both are subject to the linkage filtering described above.

### Discovery through compile-time constants

The compiler exposes the set of marked functions through the compile-time array constants from *Built-in functions and intrinsics*:

* `$$TEST_NAMES` — an array of strings naming each `@test` function. Available only in test builds; in other builds the array is empty.
* `$$TEST_FNS` — an array of function pointers to the `@test` functions, in the same order as `$$TEST_NAMES`.
* `$$BENCHMARK_NAMES` — the analogous array of `@benchmark` function names. Available only in benchmark builds.
* `$$BENCHMARK_FNS` — the array of `@benchmark` function pointers.

The standard library uses these arrays to implement the test and benchmark drivers; user code generally need not refer to them directly.

### Effect on compilation

`@test` and `@benchmark` are linkage filters in addition to being run-time markers. Outside the corresponding build mode:

* The marked function itself is removed from compilation.
* Code that is reachable *only* from marked functions is likewise removed.
* References to marked functions from non-marked code are a compile-time error.

This rule lets a project keep its tests and benchmarks alongside the production code without paying any compilation cost or binary-size cost in non-test, non-benchmark builds.

A function may carry both `@test` and `@benchmark` only when no build mode includes both; in practice the two are mutually exclusive in standard usage.

### Visibility and module scope

`@test` and `@benchmark` functions follow ordinary visibility rules: they may be `@public`, `@private`, or `@local`, and may be declared inside any module. Tests defined in a `@private` or `@local` scope are still discoverable by the test driver, since discovery is by symbol-table inspection at compile time rather than by source-level reference. Visibility affects what the test body itself may access, not whether the test is enumerated.

## Run-time behaviour

This chapter consolidates the run-time behaviour of C3 programs: what is well-defined, what is implementation-defined, what is unspecified, and what is undefined. It also describes the two principal build modes (safe and fast), the traps used to enforce contracts and bounds, and the optional sanitizer machinery.

### Categories of behaviour

C3 distinguishes four categories of run-time behaviour. Throughout this specification:

* **Well-defined behaviour** — the result is fully determined by the language; every conforming compiler produces the same observable outcome.
* **Implementation-defined behaviour** — the result is determined by the compiler in a way that the compiler's documentation must describe. Different compilers may differ; a given compiler is consistent.
* **Unspecified behaviour** — the result is one of a set of permitted outcomes, chosen by the compiler without obligation to document the choice. A program must not depend on which outcome occurs.
* **Undefined behaviour (UB)** — the language treats the operation as a precondition that the program promises not to violate, in the same way as an unchecked contract: the compiler is permitted to assume the operation does not occur and to optimize the surrounding code on that basis (including deleting branches that lead to it as unreachable). If the operation nevertheless is reached and the compiler has not optimized it away, the run-time result is itself unspecified — the program may trap, may produce arbitrary values, may resume execution at an unrelated location, may corrupt memory, or may appear to behave correctly.

The remainder of this chapter classifies specific operations.

### Build modes

A C3 implementation provides at minimum two build modes, controlled by the build invocation:

* **Safe** — runtime checks are inserted for the categories listed under *Traps* below. A failed check terminates the program with a diagnostic. Contracts (see *Contracts*) are typically lowered to runtime asserts. In safe mode, the operations that would otherwise be undefined behaviour become well-defined traps.
* **Fast** — runtime checks are elided. Operations that would have trapped in safe mode are *undefined behaviour* in fast mode; the compiler may assume they do not occur and may optimize accordingly.

A program that runs cleanly in safe mode is not guaranteed to behave the same in fast mode if it relies on an operation that trapped in safe mode. Programs intended to be portable across build modes must avoid the undefined-behaviour categories below.

The standard library may expose additional intermediate modes; the behavioural categories above are the language-level minimum.

### Operations that are well-defined

The following operations have fully defined run-time behaviour in every build mode:

* **Signed integer overflow.** Arithmetic on signed integers wraps modulo `2ⁿ`, where `n` is the operand width. This contrasts with C, where signed overflow is UB.
* **Unsigned integer overflow.** Arithmetic on unsigned integers wraps in the natural way (no value is invalid for an unsigned type).
* **Order of evaluation.** Sub-expressions evaluate strictly left-to-right with all side effects completed before the next operand is evaluated (see *Expressions*). C-style "unsequenced side effect" UB does not arise.
* **Default initialization.** A variable without an explicit initializer is zero-initialized unless it carries `@noinit`. A zero-initialized object has the bit pattern all-zero in every byte.
* **Pointer comparison.** Two pointers may always be compared for equality with `==` and `!=`. Two pointers to the same allocation may be compared for ordering with `<`, `<=`, `>`, `>=`.
* **Optional propagation.** A faulty optional propagates through any expression that does not handle it, in left-to-right order (see *Optionals and faults*). When multiple subexpressions could supply a fault, the propagation point is determined by the order in which the language requires the subexpressions to be evaluated.
* **Order of struct fields.** Fields of a struct are laid out in declaration order. The offset of each field is at least the offset of the preceding field plus the preceding field's size (after any padding required by alignment).

### Operations that trap in safe mode and are undefined in fast mode

The following operations are *checked* in safe mode (they trap the program with a diagnostic and terminate execution) and are *undefined* in fast mode:

* **Array and slice indexing out of bounds.** An index `i` for an array or slice of length `n` is in bounds when `0 <= i < n`. An out-of-bounds index traps in safe mode and is UB in fast mode.
* **Pointer dereference of a null pointer.** `*p` or `p[i]` when `p == null` traps in safe mode and is UB in fast mode.
* **Integer division and remainder by zero.** `a / 0` and `a % 0` on integer operands trap in safe mode and are UB in fast mode.
* **Contract violations.** A failed `@require`, `@ensure`, or other contract clause traps in safe mode and is UB in fast mode (see *Contracts*).
* **`assert` failure.** A failed `assert` statement traps in safe mode. In fast mode, the compiler may treat the asserted condition as a hint and optimize accordingly; reaching a program point where the asserted condition is false is UB.

### Operations that are always undefined

The following operations are undefined behaviour in every build mode; no implementation is required to detect them. A program containing them is ill-formed in the sense that the language imposes no constraint on its execution.

* **Dereferencing a dangling pointer** (a pointer whose target has been deallocated or whose underlying object's lifetime has ended).
* **Concurrent unsynchronized access** to the same memory location from multiple threads where at least one access is a write (a *data race*; see *Concurrency* below).
* **Reaching `$$unreachable()`** or any other declared-unreachable program point.
* **Returning from a `@noreturn` function.**
* **Violating the `@noalias` contract on a parameter.** The compiler treats `@noalias`-marked pointer parameters as designating disjoint memory regions and may reorder, fuse, or eliminate accesses on that basis. If two such parameters in fact alias, the resulting behaviour typically manifests as silent data corruption, stale reads, or skipped writes; no diagnostic is required.
* **Calling a `void`-returning function through a function pointer typed to return a value, or vice versa.**

### Operations whose category depends on the build mode

A few operations are classified differently in safe and fast builds without being safe-mode traps in the strict sense above:

* **Shift by an out-of-range count.** `a << b` and `a >> b` are well-defined when `0 <= b < bit_width(a)`. Outside that range, the operation is *unspecified*. In safe mode the unspecified-ness is resolved by trapping the program; in fast mode it remains unspecified — the operation may produce any value, but does not invoke UB-style optimizations against surrounding code.
* **Reading uninitialized memory** of a variable declared `@noinit` before that memory has been written. The read is implementation-defined in safe mode (the compiler may, for example, fill with a recognizable bit pattern on entry to a function for diagnostic purposes) and undefined behaviour in fast mode.

### Implementation-defined operations

The following operations have outcomes determined by the compiler and must be documented:

* The actual sizes and alignments of platform-dependent types (`uptr`, `iptr`, `CInt`, `CLong`, etc.).
* The byte order of multi-byte primitive types (controllable for bitstructs through `@bigendian`/`@littleendian`).
* The set of `$$` intrinsics provided (see *Built-in functions and intrinsics*).
* The set of sanitizer checks recognized by `@nosanitize` (see *Attributes*).
* The form of any diagnostic printed when a safe-mode trap occurs.
* The exit status used when a trap terminates the program.

### Unspecified operations

The following operations have outcomes drawn from a permitted set, with no requirement that the choice be the same on different runs or different compilers:

* The relative order of initializer functions sharing a priority value (see *Program initialization and execution*).
* The relative order of finalizer functions sharing a priority value.
* The amount of padding inserted between fields of a struct or union to satisfy alignment, where the layout is not otherwise pinned by `@packed`, `@compact`, or related attributes.
* The result of a shift by an out-of-range count in fast mode (see *Operations whose category depends on the build mode*).

### Traps

A *trap* terminates the program at a defined point with an implementation-defined diagnostic. Traps are produced by:

* Failed safe-mode checks (the list above).
* `$$trap()` and any wrapper such as the standard library's `unreachable` macro.
* Sanitizer checks that fire (when sanitizers are enabled).
* Uncaught language-level conditions such as a `!!` force-unwrap on a faulty optional.

The exact diagnostic is implementation-defined. A trap is not catchable from within the program; once a trap fires, the program runs no further user code (in particular, finalizers are not guaranteed to run — see *Program initialization and execution*).

### Sanitizers

A compiler may provide *sanitizers* — additional run-time checks beyond the safe-mode minimum. Sanitizers are enabled at build time by mechanisms outside the language. A function may opt out of a specific sanitizer through the `@nosanitize(name)` attribute (see *Attributes*).

The standard sanitizer categories conventionally recognized are `"address"` (memory-safety errors), `"memory"` (uninitialized reads), and `"thread"` (data races). A given implementation may support a subset, a superset, or none.

### Concurrency

C3 adopts the memory model of C11 and C++11. The two language families share the same formal model — the same six memory orderings (`relaxed`, `consume`, `acquire`, `release`, `acq_rel`, `seq_cst`), the same *sequenced-before* / *synchronizes-with* / *happens-before* relations, and the same definition of a data race. C3 atomic operations interoperate with C atomic operations on the same memory location.

A *data race* occurs when two memory accesses to the same location

* are performed by different threads,
* are not ordered by *happens-before*,
* are not both atomic accesses, and
* at least one of them is a write.

A program containing a data race has undefined behaviour, in the sense defined above.

C3 does not provide an atomic type qualifier analogous to C's `_Atomic`. Atomic types and operations are provided by the standard library; each operation takes a memory-ordering argument drawn from the six orderings named above. The standard library also exposes fences (the analogue of `atomic_thread_fence`) for separating synchronization from data access.

Synchronization between threads is achieved exclusively through atomic operations, library-provided mutual-exclusion primitives, and any platform-level mechanisms exposed by the standard library. The language defines no other inter-thread visibility guarantees: in particular, ordinary loads and stores carry no implicit synchronization, and only the relations established by atomic operations and synchronization primitives provide *happens-before* across threads.

### Summary

The behavioural classes above can be read as a contract between the language and the program:

* The language guarantees the well-defined outcomes regardless of build mode.
* The language traps the safe-mode-checked operations in safe mode and reserves the right to optimize aggressively against them in fast mode.
* The language assumes the never-defined operations do not occur; programs that rely on any particular outcome from them have no guaranteed behaviour.

A portable C3 program treats every category listed under "always undefined" or "trap in safe mode" as a bug to be removed, regardless of which build mode is currently in use.
