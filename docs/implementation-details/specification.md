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

Pointer arithmetic is supported on pointers to non-`void` types and follows the same rules as C.

### Array types

An array type holds a fixed number of values of an element type:

```
array_type ::= type "[" expression "]"
             | type "[" "*" "]"
```

The expression must be a compile-time constant expression of integer type denoting the array length. The form `type[*]` is permitted where the length can be inferred from an initializer; the inferred length becomes part of the type.

The length is part of the type, so `int[3]` and `int[4]` are distinct. An array is a value: assignment, parameter passing, and return copy the elements.

A pointer to an array, `type[N]*`, implicitly converts to a pointer to the first element, `type*`.

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

The element type must be a boolean, integer, floating-point, or pointer type. The length must be a compile-time constant expression of integer type; the form `type[<*>]` is permitted where the length can be inferred from an initializer.

A plain vector such as `int[<3>]` has the same size and ABI representation as the corresponding array type (`int[3]`): element alignment, no padding. When used in arithmetic or bitwise expressions, the operations are applied elementwise using SIMD instructions where available.

The `@simd` attribute declares a *SIMD aligned vector*. A SIMD aligned vector must have a length that is a power of two, and has platform SIMD alignment (typically it will match the size of the vector). As locals and globals, plain vectors and SIMD aligned vectors are treated identically in terms of alignment; the distinction arises when the vector is embedded inside a struct or an array, or appears at the ABI boundary. In those contexts a plain vector has the alignment of the corresponding array type, while a `@simd` vector retains its SIMD alignment.

Arithmetic and bitwise operations on a vector are applied elementwise. A scalar value used with a vector is widened by replication.

A vector implicitly converts to the corresponding array type and vice versa.

### Struct types

A struct type is a named sequence of fields stored in declaration order:

```
struct_decl ::= "struct" TYPE_IDENT ("(" type ("," type)* ")")? attributes? "{" struct_body "}"
```

(The full grammar of `struct_union_body` is given in *Declarations*.)

Field access uses dot notation. The dot operator also applies to a single level of pointer-to-struct: if `p` is of type `St*` and `f` is a field of `St`, then `p.f` denotes the field of the pointee.

A field may be declared `inline`. Such a field designates an *inline member*: values of the struct then implicitly convert to the type of that field, and methods of that type are accessible through the enclosing struct. See *Properties of types and values*.

Anonymous nested structs and unions are permitted, following C99 conventions.

Layout attributes (`@align`, `@packed`, `@compact`, `@nopadding`) control storage representation. See *Attributes*.

### Union types

A union type is declared like a struct, but its fields share storage:

```
union_decl ::= "union" TYPE_IDENT ("(" type ("," type)* ")")? attributes? "{" struct_union_body "}"
```

All fields of a union share storage beginning at the same address. The alignment of a union is the maximum alignment requirement of any of its fields; consequently, any member access through a union pointer is correctly aligned regardless of which member is read. The size of a union is the size of its largest field rounded up to the nearest multiple of the union's alignment.

Writing a member of type Ty stores that value's bit pattern in the first `sizeof(Ty)` bytes of the union's storage. Reading a member of type Un interprets the first `sizeof(Un)` bytes of the union's storage as a value of type Un.

When the most recently written member is of type Ty:

* If `sizeof(Un) ≤ sizeof(Ty)`, all bytes read are part of Ty's written representation; the result is those bytes reinterpreted as type U. The result is fully defined.
* If `sizeof(Un) > sizeof(Ty)`, the first `sizeof(Ty)` bytes hold Ty's written representation; the bytes in the range `[sizeof(Ty), sizeof(Un))` hold unspecified values, and the result may be any value representable in type Un.

A union may therefore be used as a controlled way to reinterpret a bit pattern, provided the member being read is no wider than the member most recently written.

Anonymous nested structs and unions are permitted, as in struct types.

### Bitstruct types

A bitstruct type is a struct whose fields occupy specified bit ranges within a backing storage:

```
bitstruct_decl ::= "bitstruct" TYPE_IDENT ("(" type ("," type)* ")")? ":" type attributes? "{" bitstruct_body "}"
```

The backing type is either an integer type or a character array. Each field of a bitstruct must be an integer type or `bool`; each field specifies a single bit position or an inclusive bit range within the backing storage.

A bitstruct field is not addressable.

By default, fields of a bitstruct may not overlap. The `@overlap` attribute permits overlapping ranges. Endianness of the underlying storage follows the host system by default, but may be set explicitly with `@bigendian` or `@littleendian`.

### Enum types

An enum type is a finite ordered set of named values, optionally backed by an integer type and optionally carrying associated values:

```
enum_decl ::= "enum" TYPE_IDENT ("(" type ("," type)* ")")? (":" "inline"? integer_type? enum_param_list?)? attributes? "{" enum_body "}"
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

A ternary expression `cond ? a : b` is non-simple if either branch `a` or `b` is non-simple. All other expressions are simple, including identifiers, literals, function calls, member access, subscripts, comparisons, logical operators, assignment expressions, bitwise `&`, `|`, `^`, the operators `%`, `??`, and (for integer targets) `/`, and the unary operators `+`, `!`, `++`, `--`, `*` (dereference), and `&` (address-of).

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



---


















---

#### Field access syntax

Vectors allow access the index 0-3 with field access syntax. 'x', 'y', 'z', 'w' corresponds to
indices 0-3. Alternatively 'r', 'g', 'b', 'a' may be used.

#### Swizzling

It is possible to form new vectors by combining field access names of individual elements. For example
`foo.xz` constructs a new vector with the fields from the elements with index 0 and 2 from the vector "foo". There is
no restriction on ordering, and the same field may be repeated. The width of the vector is the same as the number of
elements in the swizzle. Example: `foo.xxxzzzyyy` would be a vector of width 9.

Mixing the "rgba" and "xyzw" access name sets is an error. Consequently `foo.rgz` would be invalid as "rg" is from the "rgba" set and "z" is from the "xyzw" set.

#### Swizzling assignment

A swizzled vector may be a lvalue if there is no repeat of an index. Example: `foo.zy` is a valid lvalue, but `foo.xxy` is not.

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
