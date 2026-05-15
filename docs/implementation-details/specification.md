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

A *doc contract* begins with `<*` and ends with `*>`. Doc contracts do not nest. Unlike comments, a doc contract is not discarded during lexical translation: it is a token and is semantically significant. Its internal structure and meaning are specified in *Contracts*.

### Identifiers

An identifier names a program entity. C3 distinguishes several lexical classes of identifier by the case of their characters and by an optional prefix sigil.

```
IDENTIFIER       ::= "_"* LC_LETTER ALPHANUM_*
CONST_IDENT      ::= "_"* UC_LETTER UC_ALPHANUM_*
TYPE_IDENT       ::= "_"* UC_LETTER UC_ALPHANUM_* LC_LETTER ALPHANUM_*
CT_IDENT         ::= "$" IDENTIFIER
CT_CONST_IDENT   ::= "$" CONST_IDENT
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

A variable without an initializer is implicitly zero-initialized. The `@noinit` attribute may be used to leave a variable uninitialized; a type marked `@mustinit` may not carry `@noinit`.

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

### Constant literals
TODO
## Variables
TODO
### Global variables
TODO
#### Extern global variables
TODO
#### Thread local globals
TODO
### Local variables
TODO
#### Static locals
TODO
#### Thread local locals
TODO
#### Copying declarations
TODO
##### Macro copying
TODO
##### Defer copying
TODO

## Types

Types consist of built-in types and user-defined types (enums, structs, unions, bitstructs and typedef).

### Boolean types

`bool` may have the two values `true` and `false`. It holds a single bit of information but is
stored in a `char` type.

### Integer types

The built-in integer types:

```text
char      unsigned 8-bit
ichar     signed 8-bit
ushort    unsigned 16-bit
short     signed 16-bit
uint      unsigned 32-bit
int       signed 32-bit
ulong     unsigned 64-bit
long      signed 64-bit
uint128   unsigned 128-bit
int128    singed 128-bit
```

In addition, the following type aliases exist:

```text
uptr      unsigned pointer size
iptr      signed pointer size
usz       unsigned pointer offset / object size
sz        signed pointer offset  / object size
```

### Floating point types

Built-in floating point types:

```
float16      IEEE 16-bit*
bfloat16     Brainfloat*
float        IEEE 32-bit
double       IEEE 64-bit
float128     IEEE 128-bit*
```

(\* optionally supported)

### Vector types

A vector lowers to the platform's vector types where available. A vector has a base type and a width.

```
vector_type        ::= base-type "[<" length ">]"
```

#### Vector base type

The base type of a vector must be of boolean, pointer, enum, integer or floating point type, or a distinct type wrapping one of those types.

#### Min width

The vector width must be at least 1.

#### Element access

Vector elements are accessed using `[]`. It is possible to take the address of a single element.

#### Field access syntax

It is possible to access the index 0-3 with field access syntax. 'x', 'y', 'z', 'w' corresponds to
indices 0-3. Alternatively 'r', 'g', 'b', 'a' may be used.

#### Swizzling

It is possible to form new vectors by combining field access names of individual elements. For example
`foo.xz` constructs a new vector with the fields from the elements with index 0 and 2 from the vector "foo". There is
no restriction on ordering, and the same field may be repeated. The width of the vector is the same as the number of
elements in the swizzle. Example: `foo.xxxzzzyyy` would be a vector of width 9.

Mixing the "rgba" and "xyzw" access name sets is an error. Consequently `foo.rgz` would be invalid as "rg" is from the "rgba" set and "z" is from the "xyzw" set.

#### Swizzling assignment

A swizzled vector may be a lvalue if there is no repeat of an index. Example: `foo.zy` is a valid lvalue, but `foo.xxy` is not.

#### Alignment

Alignment of vectors have the same alignment as arrays of the same size and type.

#### Vector operations

Vectors support the same arithmetics and bit operations as its underlying type, and will perform the operation element-wise. Vector operations ignore overloads on the underlying type.

Example:

```c3
int[<2>] a = { 1, 3 };
int[<2>] b = { 2, 7 };

int[<2>] c = a * b;
// Equivalent to
int[<2>] c = { a[0] * b[0], a[1] * b[1] };
```

Vectors support `++` and `--` operators, which will be applied to each element. For example, given the `int` vector `int[<2>] x = { 1, 2 }`, the expression `x++` will return the vector `{ 1, 2 }` and update the vector `x` to `{ 2, 3 }`

#### Enum vector "ordinal"

Enum vectors support `.ordinal`, which will return the ordinal of all elements. Note that the `.from_ordinal` method of enums may take a vector and then return an enum vector.

#### Vector limits

Vectors may have a compiler defined maximum bit width. This will be at least as big as the largest supported SIMD vector. A typical value is 4096 bits. For the purpose of calculating max with, boolean vectors are considered to be 8 bits wide per element.
### Simd vectors

TODO

#### Alignment

TODO

#### Size

TODO

#### Elements

TODO

### Array types

An array has the alignment of its elements. An array must have at least one element.

### Slice types

The slice consist of a pointer, followed by an sz length, having the alignment of pointers.

### Pointer types

A pointer is an address to memory.

```text
pointer_type       ::= type "*"
```

#### Pointee type

The type of the memory pointed to is the **pointee type**. It may be any runtime type. In the case of a `void*` the pointee type is unknown.

#### Deref

Dereferencing a pointer will return the value in the memory location interpreted as the **pointee type**.

### Pointer arithmetics

An `sz` or `usz` offset may be added to a pointer resulting in a new pointer of the same type. This will offset the underlying address by the offset times the pointee size. An example: the size of a `long` is 8 bytes. Adding `3` to a pointer to a long consequently increases the address by 24 (3 * 8).

#### Subscripting

Subscripting a pointer is equal to performing pointer arithmetics by adding the index, followed by a deref.
Subscripts on pointers may be negative and will never do bounds checks.

#### `iptr` and `uptr`

A pointer may be losslessly cast to an `iptr` or `uptr`. An `iptr` or `uptr` may be cast to a pointer of any type.

#### The wildcard pointer `void*`

The `void*` may implicitly cast into any other pointer type. The `void*` pointer implicitly casts into any other pointer.

A void* pointer may never be directly dereferenced or subscripted, it must first be cast to non-void pointer type.

#### Pointer arithmetic on `void*`

Performing pointer arithmetics on void* will assume that the element size is 1.

### Struct types

A struct may not have zero members.

#### Alignment

A non-packed struct has the alignment of the member that has the highest alignment. A packed struct has alignment 1. See [align attribute](#attributes) for details on changing the alignment.

#### Flexible array member

The last member of a struct may be a flexible array member. This is a placeholder for an unknown length array. A struct must have at least one other member other than the flexible array member.

The syntax of the flexible array member is the same as arrays of inferred length: `Type[*]`. The member will contribute to alignment as if it was a one element array.

#### Struct memory layout and size

The members of a struct is laid out in memory in order of declaration. Each member will be placed at the first offset aligned to the type of the member. This may cause padding to occur between members.

Finally, the end of the struct will be padded so that the size is a multiple of its alignment.

#### Inline
TODO

### Union types

A union may not have zero members.

#### Alignment

A union has the alignment of the member that has the highest alignment. See [align attribute](#attributes) for details on changing the alignment.

#### Union size

The size of a union is the size of its largest member, padded so that the size is a multiple of its alignment.

### Bitstruct type

#### Container type
The container type is restricted to integer types and char arrays, or typedefs based on such types.



### Fault type

#### Alignment
Alignment is the same as that of the `uptr` type.

#### Size
Size is the same as that of the `uptr` type.

#### Representation
In underlying representation, the fault matches that of an `uptr`.

#### Faultdef
`faultdef` will create unique instances of the `fault` type.

#### Zero value
The zero fault type can be created implicitly casting from `null` or `{}`.

#### Assigning a zero value fault
An optional empty constructed from a zero value fault, will behave as if it was a result with an undefined value. Performing operations on an undefined value will in itself give an undefined value.

### Enum type
TODO

### Typeid type

The `typeid` type is a built-in type that represents a unique identifier for a type. In its underlying representation, it matches that of an `iptr`.
### Associated values
TODO
### Ordinal
TODO
### Inline

### Const enum type
TODO
### Value
TODO
### Inline
TODO

### Typedef
TODO
### Underlying type
TODO
### Inline
TODO

### Alias
TODO

### Interface
TODO
#### Inheritance
TODO
#### Implementing interface
TODO
#### Method lookup
TODO

## Declarations

TODO

## Expressions

TODO

### Assignment expression

```
assignment_expr    ::= unary_expr assignment_op expr
assignment_op      ::= "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | "&=" | "^=" | "|="
```

## Statements

TODO
```
stmt                ::= compound_stmt | non_compound_stmt
non_compound_stmt   ::= assert_stmt | if_stmt | while_stmt | do_stmt | foreach_stmt | foreach_r_stmt
                       | for_stmt | return_stmt | break_stmt | continue_stmt | var_stmt
                       | declaration_stmt | defer_stmt | nextcase_stmt | asm_block_stmt
                       | ct_echo_stmt | ct_error_stmt | ct_assert_stmt | ct_if_stmt | ct_switch_stmt
                       | ct_for_stmt | ct_foreach_stmt | expr_stmt | ct_assign_stmt
```

### Compile time assign statements

#### Type assign statement

This assigns a new type to a compile time type variable. The value of the expression is the type assigned.

### Asm block statement

An asm block is either a string expression or a brace enclosed list of asm statements.

```
asm_block_stmt      ::= "asm" ("(" constant_expr ")" | "{" asm_stmt* "}")
asm_stmt            ::= asm_instr asm_exprs? ";"
asm_instr           ::= ("int" | IDENTIFIER) ("." IDENTIFIER)
asm_expr            ::= CT_IDENT | CT_CONST_IDENT | "&"? IDENTIFIER | CONST_IDENT | FLOAT_LITERAL
                        | INTEGER | "(" expr ")" | "[" asm_addr "]"
asm_addr            ::= asm_expr (additive_op asm_expr asm_addr_trail?)?
asm_addr_trail      ::= "*" INTEGER (additive_op INTEGER)? | (shift_op | additive_op) INTEGER
```

TODO

### Assert statement

The assert statement will evaluate the expression and call the panic function if it evaluates
to false.

```
assert_stmt        ::= "assert" "(" expr ("," assert_message)? ")" ";"
assert_message     ::= constant_expr ("," expr)*
```

#### Conditional inclusion

`assert` statements are only included in "safe" builds. They may turn into **assume directives** for
the compiler on "fast" builds.

#### Assert message

The assert message is optional. It can be followed by an arbitrary number of expressions, in which case
the message is understood to be a format string, and the following arguments are passed as values to the
format function.

The assert message must be a compile time constant. There are no restriction on the format argument expressions.

#### Panic function

If the assert message has no format arguments or no assert message is included,
then the regular panic function is called. If it has format arguments then `panicf` is called instead.

In the case the `panicf` function does not exist (for example, compiling without the standard library),
then the format and the format arguments will be ignored and the `assert` will be treated
as if no assert message was available.

### Break statement

A break statement exits a `while`, `for`, `do`, `foreach` or `switch` scope. A labelled break
may also exit a labelled `if`.

```
break_stmt         ::= "break" label? ";"
```

#### Break labels

If a break has a label, then it will instead exit an outer scope with the label.

#### Unreachable code

Any statement following break in the same scope is considered unreachable.

### Compile time echo statement

During parsing, the compiler will output the text in the statement when it is semantically checked.
The statement will be turned into a NOP statement after checking.

```
ct_echo_stmt       ::= "$echo" constant_expr ";"
```

#### The message

The message must be a compile time constant string.

### Compile time assert statement

During parsing, the compiler will check the compile time expression
and create a compile time error with the optional message. After
evaluation, the `$assert` becomes a **NOP** statement.

```
ct_assert_stmt     ::= "$assert" constant_expr (":" constant_expr) ";"
```

#### Evaluated expression

The checked expression must evaluate to a boolean compile time constant.

#### Error message

The second parameter, which is optional, must evaluate to a constant string.

### Compile time error statement

During parsing, when semantically checked this statement will output
a compile time error with the message given.

```
ct_error_stmt      ::= "$error" constant_expr ";"
```

#### Error message

The parameter must evaluate to a constant string.

### Compile time if statement

If the cond expression is true, the then-branch is processed by the compiler. If it
evaluates to false, the else-branch is processed if it exists.

```
ct_if_stmt         ::= "$if" constant_expr ":" stmt* ("$else" stmt*)? "$endif"
```

#### Cond expression

The cond expression must be possible to evaluate to true or false at compile time.

#### Scopes

The "then" and "else" branches will add a compile time scope that is exited when reaching `$endif`.
It adds no runtime scope.

#### Evaluation

Statements in the branch not picked will not be semantically checked.

### Compile time switch statement

```
ct_switch_stmt     ::= "$switch" (ct_expr_or_type)? ":"
ct_case_stmt       ::= ("$default" | "$case" ct_expr_or_type) ":" stmt*
```

#### No cond expression switch

If the cond expression is missing, evaluation will go through each case until one case expression
evaluates to true.

#### Type expressions

If a cond expression is a type, then all case statement expressions must be types as well.

#### Ranged cases

Compile time switch does not support ranged cases.

#### Fallthrough

If a case clause has no statements, then when executing the case, rather than exiting the switch,
the next case clause immediately following it will be used. If that one should also be missing statements,
the procedure will be repeated until a case clause with statements is encountered,
or the end of the switch is reached.

#### Break and nextcase

Compile time switches do not support `break` nor `nextcase`.

#### Evaluation of statements

Only the case which is first matched has its statements processed by the compiler. All other statements
are ignored and will not be semantically checked.

### Continue statement

A continue statement jumps to the cond expression of a `while`, `for`, `do` or `foreach`

```
continue_stmt      ::= "continue" label? ";"
```

#### Continue labels

If a `continue` has a label, then it will jump to the cond of the while/for/do in the outer scope
with the corresponding label.

#### Unreachable code

Any statement following `continue` in the same scope is considered unreachable.

### Declaration statement

A declaration statement adds a new runtime or compile time variable to the current scope. It is available after the
declaration statement.

```
declaration_stmt   ::= const_declaration | local_decl_storage? optional_type decls_after_type ";"
local_decl_storage ::= "tlocal" | "static"
decls_after_type   ::= local_decl_after_type ("," local_decl_after_type)*
decl_after_type    ::= CT_IDENT ("=" constant_expr)? | IDENTIFIER opt_attributes ("=" expr)?
```

#### Thread local storage

Using `tlocal` allocates the runtime variable as a **thread local** variable. In effect this is the same as declaring
the variable as a global `tlocal` variable, but the visibility is limited to the function. `tlocal` may not be
combined with `static`.

The initializer for a `tlocal` variable must be a valid global init expression.

#### Static storage

Using `static` allocates the runtime variable as a function **global** variable. In effect this is the same as declaring
a global, but visibility is limited to the function. `static` may not be combined with `tlocal`.

The initializer for a `static` variable must be a valid global init expression.

#### Scopes

Runtime variables are added to the runtime scope, compile time variables to the compile time scope. See **var statements
**.

#### Multiple declarations

If more than one variable is declared, no init expressions are allowed for any of the variables.

#### No init expression

If no init expression is provided, the variable is **zero initialized**.

#### Opt-out of zero initialization

Using the @noinit attribute opts out of **zero initialization**.

#### Prevent opt-out of zero initialization

Using the @mustinit attribute disables the use of the @noinit attribute.

#### Self referencing initialization

An init expression may refer to the **address** of the same variable that is declared, but not the **value** of the
variable.

Example:

```c3
void* a = &a;  // Valid
int a = a + 1; // Invalid
```

### Defer statement

The defer statements are executed at (runtime) scope exit, whether through `return`, `break`, `continue` or rethrow.

```
defer_stmt         ::= "defer" ("try" | "catch")? stmt
```

#### Defer in defer

The defer body (statement) may not be a defer statement. However, if the body is a compound statement then
this may have any number of defer statements.

#### Static and tlocal variables in defer

Static and tlocal variables are allowed in a defer statement. Only a single variable is instantiated regardless of
the number of inlining locations.

#### Defer and return

If the `return` has an expression, then it is evaluated before the defer statements (due to exit from the current
function scope),
are executed.

Example:

```c3
int a = 0;
defer a++;
return a;
// This is equivalent to
int a = 0;
int temp = a;
a++;
return temp;
```

#### Defer and jump statements

A defer body may not contain a `break`, `continue`, `return` or rethrow that would exit the statement.

#### Defer execution

Defer statements are executed in the reverse order of their declaration, starting from the last declared
defer statement.

#### `defer try`

A `defer try` type of defer will only execute if the scope is left through normal fallthrough, `break`,
`continue` or a `return` with a result.

It will not execute if the exit is through a rethrow or a `return` with an optional value.

#### `defer catch`

A `defer catch` type of defer will only execute if the scope is left through a rethrow or a `return` with an optional
value

It will not execute if the exit is a normal fallthrough, `break`, `continue` or a `return` with a result.

#### Non-regular returns - longjmp, panic and other errors

Defers will not execute when doing `longjmp` terminating through a `panic` or other error. They
are only invoked on regular scope exits.

### Expr statement

An expression statement evaluates an expression.

```
expr_stmt          ::= expr ";"
```

#### No discard

If the expression is a function or macro call either returning an optional *or* annotated `@nodiscard`, then
the expression is a compile time error. A function or macro returning an optional can use the `@maydiscard`
attribute to suppress this error.

### If statement

An if statement will evaluate the cond expression, then execute the first statement (the "then clause") in the if-body
if it evaluates to "true", otherwise execute the else clause. If no else clause exists, then the
next statement is executed.

```
if_stmt            ::= "if" (label ":")? "(" cond_expr ")" if_body
if_body            ::= non_compound_stmt | compound_stmt else_clause? | "{" switch_body "}"
else_clause        ::= "else" (if_stmt | compound_stmt)

```

#### Scopes

Both the "then" clause and the else clause open new scopes, even if they are non-compound statements.
The cond expression scope is valid until the exit of the entire statement, so any declarations in the
cond expression are available both in then and else clauses. Declarations in the "then" clause is not available
in the else clause and vice versa.

#### Special parsing of the "then" clause

If the then-clause isn't a compound statement, then it must follow on the same row as the cond expression.
It may not appear on a consecutive row.

#### Break

It is possible to use labelled break to break out of an if statement. Note that an unlabelled `break` may not
be used.

#### If-try

The cond expression may be a try-unwrap chain. In this case, the unwrapped variables are
scoped to the "then" clause only.

#### If-catch

The cond expression may be a catch-unwrap. The unwrap is scoped to the "then" clause only.
If one or more variables are in the catch, then the "else" clause have these variables
implicitly unwrapped.

Example:

```c3
int? a = foo();
int? b = foo();
if (catch a, b)
{
    // Do something
}
else
{
    int x = a + b; // Valid, a and b are implicitly unwrapped.
}
```

#### If-catch implicit unwrap

If an if-catch's "then"-clause will jump out of the outer scope in all code paths and
the catch is on one or more variables, then this variable(s) will be implicitly unwrapped in the outer scope
after the if-statement.

Example:

```c3
int? a = foo();
if (catch a)
{
  return;
}
int x = a; // Valid, a is implicitly unwrapped.
```

### Nextcase statement

Nextcase will jump to another `switch` case.

```
nextcase_stmt      ::= "nextcase" ((label ":")? (expr | "default"))? ";"
```

#### Labels

When a nextcase has a label, the jump is to the switch in an outer scope with the corresponding label.

#### No expression jumps

A `nextcase` without any expression jumps to the next case clause in the current switch. It is not possible
to use no expression `nextcase` with labels.

#### Jumps to default

Using `default` jumps to the default clause of a switch.

#### Missing case

If the switch has constant case values, and the nextcase expression is constant, then the value of
the expression must match a case clause. Not matching a case is a compile time error.

If one or more cases are non-constant and/or the nextcase expression is non-constant, then no compile time check is
made.

#### Variable expression

If the nextcase has a non-constant expression, or the cases are not all constant, then first the nextcase expression
is evaluated. Next, execution will proceed *as if* the switch was invoked again, but with the nextcase expression as the
switch cond expression. See **switch statement**.

If the switch does not have a cond expression, nextcase with an expression is not allowed.

#### Unreachable code

Any statement in the same scope after a `nextcase` are considered **unreachable**.

### Switch statement

```
switch_stmt        ::= "switch" (label ":")? ("(" cond_expr ")")? switch body
switch_body        ::= "{" case_clause* "}"
case_clause        ::= default_stmt | case_stmt
default_stmt       ::= "default" ":" stmt*
case_stmt          ::= "case" label? expr (".." expr)? ":" stmt*
```

#### Regular switch

If the cond expression exists and all case statements have constant expression, then first the
cond expression is evaluated, next the case corresponding to the expression's value will be jumped to
and the statement will be executed. After reaching the end of the statements and a new case clause *or* the
end of the switch body, the execution will jump to the first statement after the switch.

#### If-switch

If the cond expression is missing or the case statements are non-constant expressions, then each case clause will
be evaluated in order after the cond expression has been evaluated (if it exists):

1. If a cond expression exists, calculate the case expression and execute the case if it is matching the
   cond expression. A default statement has no expression and will always be considered matching the cond expression
   reached.
2. If no con expression exists, calculate the case expression and execute the case if the expression evaluates to
   "true" when implicitly converted to boolean. A default statement will always be considered having the "true" result.

#### Any-switch

If the cond expression is an `any` type, the switch is handled as if switching was done over the `type`
field of the `any`. This field has the type of [typeid](#typeid-type), and the cases follows the rules
for [switching over typeid](#switching-over-typeid).

If the cond expression is a variable, then this variable is implicitly converted to a pointer with
the pointee type given by the case statement.

Example:

```c3
any a = abc();
switch (a)
{
    case int:
        int b = *a;   // a is int*
    case float:
        float z = *a; // a is float*
    case Bar:
        Bar f = *a;   // a is Bar*
    default:
        // a is not unwrapped
}
```

#### Ranged cases

Cases may be ranged. The start and end of the range must both be constant integer values. The start must
be less or equal to the end value. Using non-integers or non-constant values is a compile time error.

#### Fallthrough

If a case clause has no statements, then when executing the case, rather than exiting the switch, the next case clause
immediately following it will be executed. If that one should also be missing statement, the procedure
will be repeated until a case clause with statements is encountered (and executed), or the end of the switch is reached.

#### Exhaustive switch

If a switch case has a default clause *or* it is switching over an enum and there exists a case for each enum value
then the switch is exhaustive.

#### Break

If an unlabelled break, or a break with the switch's label is encountered,
then the execution will jump out of the switch and proceed directly after the end of the switch body.

#### Unreachable code

If a switch is exhaustive and all case clauses end with a jump instruction, containing no break statement out
of the current switch, then the code directly following the switch will be considered **unreachable**.

#### Switching over typeid

If the switch cond expression is a typeid, then case declarations may use only the type name after the case,
which will be interpreted as having an implicit `.typeid`. Example: `case int:` will be interpreted as if
written `case int.typeid`.

#### Nextcase without expression

Without a value `nextcase` will jump to the beginning of the next case clause. It is not allowed to
put `nextcase` without an expression if there are no following case clauses.

#### Nextcase with expression

Nextcase with an expression will evaluate the expression and then jump *as if* the switch was entered with
the cond expression corresponding to the value of the nextcase expression. Nextcase with an expression cannot
be used on a switch without a cond expression.

#### Do statement

The do statement first evaluates its body (inner statement), then evaluates the cond expression.
If the cond expression evaluates to true, jumps back into the body and repeats the process.

```
do_stmt            ::= "do" label? compound_stmt ("while" "(" cond_expr ")")? ";"
```

#### Unreachable code

The statement after a `do` is considered unreachable if the cond expression cannot ever be false
and there is no `break` out of the do.

#### Break

`break` will exit the do with execution continuing on the following statement.

#### Continue

`continue` will jump directly to the evaluation of the cond, as if the end of the statement had been reached.

#### Do block

If no `while` part exists, it will only execute the block once, as if it ended with `while (false)`, this is
called a "do block"

### For statement

The `for` statement will perform the (optional) init expression. The cond expression will then be tested. If
it evaluates to `true` then the body will execute, followed by the incr expression. After execution will
jump back to the cond expression and execution will repeat until the cond expression evaluates to `false`.

```
for_stmt           ::= "for" label? "(" init_expr ";" cond_expr? ";" incr_expr ")" stmt
init_expr          ::= decl_expr_list?
incr_expr          ::= expr_list?
```

#### Init expression

The init expression is only executed once before the rest of the for loop is executed.
Any declarations in the init expression will be in scope until the for loop exits.

The init expression may optionally be omitted.

#### Incr expression

The incr expression is evaluated before evaluating the cond expr every time except for the first one.

The incr expression may optionally be omitted.

#### Cond expression

The cond expression is evaluated every loop. Any declaration in the cond expression is scoped to the
current loop, i.e. it will be reinitialized at the start of every loop.

The cond expression may optionally be omitted. This is equivalent to setting the cond expression to
always return `true`.

#### Unreachable code

The statement after a `for` is considered unreachable if the cond expression cannot ever be false, or is
omitted and there is no `break` out of the loop.

#### Break

`break` will exit the `for` with execution continuing on the following statement after the `for`.

#### Continue

`continue` will jump directly to the evaluation of the cond, as if the end of the statement had been reached.

#### Equivalence of `while` and `for`

A `while` loop is functionally equivalent to a `for` loop without init and incr expressions.

### `foreach` and `foreach_r` statements

The `foreach` statement will loop over a sequence of values. The `foreach_r` is equivalent to
`foreach` but the order of traversal is reversed.
`foreach` starts with element `0` and proceeds step by step to element `len - 1`.
`foreach_r` starts starts with element `len - 1` and proceeds step by step to element `0`.

```
foreach_stmt       ::= "foreach" label? "(" foreach_vars ":" expr ")" stmt
foreach_r_stmt     ::= "foreach_r" label? "(" foreach_vars ":" expr ")" stmt
foreach_vars       ::= (foreach_index ",")? foreach_var
foreach_var        ::= type? "&"? IDENTIFIER
```

#### Break

`break` will exit the foreach statement with execution continuing on the following statement after.

#### Continue

`continue` will cause the next iteration to commence, as if the end of the statement had been reached.

#### Iteration by value or reference

Normally iteration are by value. Each element is copied into the foreach variable. If `&`
is added before the variable name, the elements will be retrieved by reference instead, and consequently
the type of the variable will be a pointer to the element type instead.

#### Foreach variable

The foreach variable may omit the type. In this case the type is inferred. If the type differs from the element
type, then an implicit conversion will be attempted. Failing this is a compile time error.

#### Foreach index

If a variable name is added before the foreach variable, then this variable will receive the index of the element.
For `foreach_r` this mean that the first value of the index will be `len - 1`.

The index type defaults to `sz`.

If an optional type is added to the index, the index will be converted to this type. The type must be an
integer type. The conversion happens as if the conversion was a direct cast. If the actual index value
would exceed the maximum representable value of the type, this does not affect the actual iteration, but
may cause the index value to take on an incorrect value due to the cast.

For example, if the optional index type is `char` and the actual index is `256`, then the index value would show `0`
as `(char)256` evaluates to zero.

Modifying the index variable will not affect the foreach iteration.

#### Foreach support

Foreach is natively supported for any slice, array, pointer to an array, vector and pointer to a vector.
These types support both iteration by value and reference.

In addition, a type with **operator overload** for `len` and `[]` will support iteration by value,
and a type with **operator overload** for `len` and `&[]` will support iteration by reference.

### Return statement

The return statement evaluates its expression (if present) and returns the result.

```
return_stmt        ::= "return" expr? ";"
```

#### Jumps in return statements

If the expression should in itself cause an implicit return, for example due to the rethrow operator `!`, then this
jump will happen before the return.

An example:

    return foo()!;
    // is equivalent to:
    int temp = foo()!;
    return temp;

#### Empty returns

An empty return is equivalent to a return with a void type. Consequently constructs like `foo(); return;`
and `return (void)foo();`
are equivalent.

#### Unreachable code

Any statement directly following a return in the same scope are considered unreachable.

### While statement

The while statement evaluates the cond expression and executes the statement if it evaluates to true.
After this the cond expression is evaluated again and the process is repeated until cond expression returns false.

```
while_stmt         ::= "while" label? "(" cond_expr ")" stmt
```

#### Unreachable code

The statement after a while is considered unreachable if the cond expression cannot ever be false
and there is no `break` out of the while.

#### Break

`break` will exit the while with execution continuing on the following statement.

#### Continue

`continue` will jump directly to the evaluation of the cond, as if the end of the statement had been reached.

### Var statement

A var statement declares a variable with inferred type, or a compile time type variable. It can be used both
for runtime and compile time variables. The use for runtime variables is limited to macros.

```
var_stmt           ::= "var" IDENTIFIER | CT_IDENT | CT_TYPE_IDENT ("=" expr)? ";"
```

#### Inferring type

In the case of a runtime variable, the type is inferred from the expression. Not providing an expression
is a compile time error. The expression must resolve to a runtime type.

For compile time variables, the expression is optional. The expression may resolve to a runtime or compile time type.

#### Scope

Runtime variables will follow the runtime scopes, identical to behaviour in a declaration statement. The compile
time variables will follow the compile time scopes which are delimited by scoping compile time
statements (`$if`, `$switch`,
`$foreach` and `$for`).

## Macros
TODO

## Attributes

Attributes are modifiers attached to modules, variables, type declarations etc.

| name            | used with                                                                         |
|-----------------|-----------------------------------------------------------------------------------|
| `@align`        | fn, const, variables, user-defined types, struct member                           |
| `@benchmark`    | module, fn                                                                        |
| `@bigendian`    | bitstruct only                                                                    |
| `@builtin`      | macro, fn, global, constant                                                       |
| `@callconv`     | fn, call                                                                          |
| `@deprecated`   | fn, macro, interface, variables, constants, user-defined types, struct member     |
| `@dynamic`      | fn                                                                                |
| `@export`       | fn, globals, constants, struct, union, enum, faultdef                             |
| `@cname`        | fn, globals, constants, user-defined types, faultdef                              |
| `@if`           | all except local variables and calls                                              |
| `@inline`       | fn, call                                                                          |
| `@interface`    | fn                                                                                |
| `@littleendian` | bitstruct only                                                                    |
| `@local`        | module, fn, macro, globals, constants, user-defined types, attributes and aliases |
| `@maydiscard`   | fn, macro                                                                         |
| `@mustinit`     | variables                                                                         |
| `@naked`        | fn                                                                                |
| `@nodiscard`    | fn, macro                                                                         |
| `@noinit`       | user-defined types
| `@noinline`     | fn, call                                                                          |
| `@noreturn`     | fn, macro                                                                         |
| `@nostrip`      | fn, globals, constants, struct, union, enum, faultdef                             |
| `@obfuscate`    | enum, faultdef                                                                    |
| `@operator`     | fn, macro                                                                         |
| `@optional`     | interface methods                                                                 |
| `@overlap`      | bitstruct only                                                                    |
| `@packed`       | struct, union                                                                     |
| `@priority`     | initializer/finalizer                                                             |
| `@private`      | module, fn, macro, globals, constants, user-defined types, attributes and aliases |
| `@public`       | module, fn, macro, globals, constants, user-defined types, attributes and aliases |
| `@pure`         | call                                                                              |
| `@reflect`      | fn, globals, constants, user-defined types                                        |
| `@section`      | fn, globals, constants                                                            |
| `@test`         | module, fn                                                                        |
| `@unused`       | all except call and initializer/finalizers                                        |
| `@used`         | all except call and initializer/finalizers                                        |
| `@weak`         | fn, globals, constants                                                            |
| `@winmain`      | fn                                                                                |

#### `@deprecated`

Takes an optional constant string.
If the node is in use, print the deprecation and add the optional string if present.

#### `@optional`

Marks an *interface* method as optional, and so does not need to be implemented by
a conforming type.

#### `@winmain`

Marks a `main` function as a win32 winmain function, which is the entrypoint for a windowed
application on Windows. This allows the main function to take a different set of
arguments than usual.

#### `@callconv`

`@callconv` can be used with a function or a call. It takes a constant string which is either "veccall", "stdcall" or "cdecl". If more than one `@callconv`
is applied to a function or call, the last one takes precedence.

By default, the call convention is "cdecl".

### User defined attributes

User defined attributes group a list of attributes.

```
attribute_decl     ::= "attrdef" AT_TYPE_IDENT ("(" parameters ")")? attribute* "=" "{" attribute* "}" ";"
```

#### Empty list of attributes

The list of attributes may be empty.

#### Parameter arguments

Arguments given to user defined attributes will be passed on to the attributes in the list.

#### Expansion

When a user defined attribute is encountered, its list of attributes is
copied and appended instead of the user defined attribute. Any argument passed to
the attribute is evaluated and passed as a constant by the name of the parameter
to the evaluation of the attribute parameters in the list.

#### Nesting

A user defined attribute can contain other user defined attributes. The definition
may not be cyclic.

## Methods

#### Operator overloading

`@operator` overloads may only be added to user defined types (typedef, unions, struct, enum and fault).

##### Indexing operator (`[]`)

This requires a return type and a method parameter, which is the index.

##### Reference indexing operator (`&[]`)

This requires a return type and a method parameter, which is the index. If `[]` is implemented,
it should return a pointer to `[]`.

##### Assigning index operator (`=[]`)

This has a void return type, and index should match that of `[]` and `&[]`. Value should match that
of `[]` and be the pointee of the result of `&[]`.

##### Len operator (`len`)

This must have an integer return type.

#### Dynamic methods

`@dynamic` may be used on methods for any type except `any` and interfaces.

## Built-in functions

## Modules

Module paths are hierarchal, with each sub-path appended with '::' + the name:

```
path               ::= PATH_SEGMENT ("::" PATH_SEGMENT)
```

Each module declaration starts its own **module section**. All imports and all `@local` declarations
are only visible in the current **module section**.

```
module_section     ::= "module" path opt_generic_params? attributes? ";"
generic_param      ::= TYPE_IDENT | CONST_IDENT
opt_generic_params ::= "{" generic_param ("," generic_param)* "}"
```

Any visibility attribute defined in a **module section** will be the default visibility in all
declarations in the section.

If the `@benchmark` attribute is applied to the **module section** then all function declarations
will implicitly have the `@benchmark` attribute.

If the `@test` attribute is applied to the **module section** then all function declarations
will implicitly have the `@test` attribute.

## Generic modules
TODO

## Program initialization
TODO

## Optionals and faults
TODO
