---
title: C3 Specification
description: C3 Specification
sidebar:
    order: 999
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

A program consists of one or more _translation units_ stored in files written in the Unicode character set, stored as a sequence of bytes using the UTF-8 encoding. Except for comments and the contents of character and string literals, all input elements are formed only from the ASCII subset (U+0000 to U+007F) of Unicode.

#### Carriage return

The carriage return (U+000D) is usually treated as white space, but may be stripped from the source code prior to lexical translation.

#### Bidirectional markers

Unbalanced bidirectional markers (such as U+202D and U+202E) is not legal.

### Lexical Translations

A raw byte stream is translated into a sequence of tokens which white space and comments are discarded. The resulting input elements form the tokens that are the terminal symbols of the syntactic grammar.

The longest possible translation is used at each step, even if the result does not ultimately make a correct program while another lexical translation would.

> Example: `a--b` is translated as `a`, `--`, `b`, which does not form a grammatically correct expression, even though the tokenization `a`, `-`, `-`, `b` could form a grammatically correct expression.

### Line Terminators

The C3 compiler divides the sequence of input bytes into lines by recognizing *line terminators*

Lines are terminated by the ASCII LF character (U+000A), also known as "newline". A line termination specifies the termination of the // form of a comment.

### Comments

There are two types of regular comments:

1. `// text` a line comment. The text between `//` and line end is ignored.
2. `/* text */` block comments. The text between `/*` and `*/` is ignored. It has nesting behaviour, so for every `/*` discovered between the first `/*` and the last `*/` a corresponding `*/` must be found.

### White Space

White space is defined as the ASCII horizontal tab character (U+0009), carriage return (U+000D), space character (U+0020) and the line terminator character (U+000D).

```text
WHITESPACE      ::= [ \t\r\n]
```

### Letters and digits

```text
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

### Identifiers

Identifiers name program entities such as variables and types. An identifier is a sequence of one or more letters and digits. The first character in an identifier must be a letter or underscore.

C3 has three groups of identifiers: const identifiers - containing only underscore and upper-case letters, type identifiers - starting with an upper case letter followed by at least one underscore letter and regular identifiers, starting with a lower case letter.

```text
IDENTIFIER       ::= "_"* LC_LETTER ALPHANUM_*
CONST_IDENT      ::= "_"* UC_LETTER UC_ALPHANUM_*
TYPE_IDENT       ::= "_"* UC_LETTER UC_ALPHANUM_* LC_LETTER ALPHANUM_*
CT_IDENT         ::= "$" IDENTIFIER
CT_BUILTIN_CONST ::= "$$" CONST_IDENT
CT_BUILTIN_FN    ::= "$$" IDENTIFIER
CT_TYPE_IDENT    ::= "$" TYPE_IDENT
AT_IDENT         ::= "@" IDENT
AT_TYPE_IDENT    ::= "@" TYPE_IDENT
HASH_IDENT       ::= "#" IDENT
PATH_SEGMENT     ::= "_"* LC_LETTER LC_ALPHANUM_*
```

### Keywords

The following keywords are reserved and may not be used as identifiers:

```text
any        bfloat      bool
char       double      fault
float      float128    float16
ichar      int         int128
iptr       isz         long
short      typeid      uint
uint128    ulong       uptr
ushort     usz         void

alias      assert      asm
attrdef    bitstruct   break
case       catch       const
continue   default     defer
do         else        enum
extern     false       faultdef
for        foreach     foreach_r
fn         tlocal      if
inline     import      macro
module     nextcase    null
interface  return      static
struct     switch      true
try        typedef     union
var        while

$alignof   $assert     $assignable
$case      $default    $defined
$echo      $else       $embed
$endfor    $endforeach $endif
$endswitch $eval       $error     
$exec      $extnameof  $feature
$for       $foreach    $if
$include   $is_const   $nameof
$offsetof  $qnameof    $sizeof
$stringify $switch     $typefrom
$typeof    $vacount    $vatype
$vaconst   $vaarg      $vaexpr
$vasplat
```

### Operators and punctuation

The following character sequences represent operators and punctuation.

```text
&       @       ~       |       ^       :
,       /       $       .       ;       =
>       <       #       {       }       -
(       )       *       [       ]       %
>=      <=      +       +=      -=      !
?       ?:      &&      ??      &=      |=
^=      /=      ..      ==      [<      >]      
++      --      %=      !=      ||      ::      
<<      >>      !!      ->      =>      ...
<<=     >>=     +++     &&&    |||      ???
```

### Backslash escapes

The following backslash escapes are available for characters and string literals:

```text
\0      0x00 zero value
\a      0x07 alert/bell
\b      0x08 backspace
\e      0x1B escape
\f      0x0C form feed
\n      0x0A newline
\r      0x0D carriage return
\t      0x09 horizontal tab
\v      0x0B vertical tab
\\      0x5C backslash
\'      0x27 single quote '
\"      0x22 double quote "
\x      Escapes a single byte hex value
\u      Escapes a two byte unicode hex value
\U      Escapes a four byte unicode hex value
```

## Constants
TODO
### Extern constants
TODO
### Untyped constants
TODO
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
isz       signed pointer offset  / object size
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

```c
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

The slice consist of a pointer, followed by an usz length, having the alignment of pointers.

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

An `usz` or `isz` offset may be added to a pointer resulting in a new pointer of the same type. This will offset the underlying address by the offset times the pointee size. An example: the size of a `long` is 8 bytes. Adding `3` to a pointer to a long consequently increases the address by 24 (3 * 8).

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
TODO

### Fault type
TODO
#### Alignment
TODO
#### Size
TODO
#### Representation
TODO

### Enum type
TODO
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

TOTO 

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

#### Self referencing initialization

An init expression may refer to the **address** of the same variable that is declared, but not the **value** of the
variable.

Example:

```c
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

```c
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

```
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

```
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

```c
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

The index type defaults to `usz`.

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
| `@naked`        | fn                                                                                |
| `@nodiscard`    | fn, macro                                                                         |
| `@noinit`       | variables                                                                         |
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
