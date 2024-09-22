---
title: All features
description: A list of all features of C3.
sidebar:
    order: 801
---

Here is a summary of _all_ the features of C3 and changes from C

## Symbols and literals

Changes relating to literals, identifiers etc.

### Added

1. 0o prefix for octal.
2. 0b prefix for binary.
3. Optional "_" as digit separator.
4. Hexadecimal byte data, e.g `x"abcd"`.
5. Base64 byte data, e.g. `b64"QzM="`.
6. Type name restrictions (PascalCase).
7. Variable and function name restrictions (must start with lower case letter).
8. Constant name restrictions (no lower case).
9. Character literals may be 2, 4, 8, 16 bytes long. (2cc, 4cc etc).
10. Raw string literals between "\`".
11. `\e` escape character.
12. Source code must be UTF-8.
13. Assumes `\n` for new row `\r` is stripped from source.
14. Bit-width integer and float suffixes: `u8`/`i8`/`u16`/`i16`/... `f32`/`f64`/... 
15. The `null` literal is a pointer value of 0.
16. The `true` and `false` are boolean constants true and false.

### Removed 

1. Trigraphs / digraphs.
2. 0123-style octal.
3. `z`, `LL` and `ULL` suffixes.

## Built-in types

### Added

1. Type declaration is left to right: `int[4]*[2] a;` instead of `int (*a[2])[4];` 
2. Simd vector types using `[<>]` syntax, e.g. `float[<4>]`, use `[<*>]` for inferred length.
3. Slice type built in, using `[]` suffix, e.g. `int[]`
4. Distinct types, similar to a typedef but forms a new type. (Example: the `String` type is a distinct `char[]`)
5. Built-in 128-bit integer on all platforms.
6. `char` is an unsigned 8-bit integer. `ichar` is its signed counterpart.
7. Well-defined bitwidth for integer types: ichar/char (8 bits), short/ushort (16 bits), int/uint (32 bits), long/ulong (64 bits), int128/uint128 (128 bits)
8. Pointer-sized `iptr` and `uptr` integers.
9. `isz` and `usz` integers corresponding to the `size_t` bitwidth.
10. Optional types are formed using the `!` suffix.
11. `bool` is the boolean type.
12. `typeid` is a unique type identifier for a type, it can be used at runtime and compile time.
13. `any` contains a `typeid` and `void*` allowing it to act as a reference to any type of value.
14. `anyfault` holds any `fault` value (see below).

### Changed
1. Inferred array type uses `[*]` (e.g. `int[*] x = { 1, 2 };`).
2. Flexible array member uses `[*]`.

### Removed

1. The spiral rule type declaration (see above).
2. Complex types
3. size_t, ptrdiff_t (see above).
4. Array types do not decay.

## Types

### Added

1. `bitstruct` a struct with a container type allowing precise control over bit-layout, replacing bitfields and enum masks.
2. `fault` an enum type with unique values which are used together with optional.
3. Vector types.
4. Optional types.
5. `enum` allows a set of unique constants to be associated with each enum value.
6. Compile time reflection and limited runtime reflection on types (see "Reflection")
7. All types have a `typeid` property uniquely referring to that particular type.
8. Distinct types, which are similar to aliases, but represent distinctly different types.
9. Types may have methods. Methods can be added to any type, including built-in types.
10. Subtyping: using `inline` on a struct member allows a struct to be implicitly converted to this member type and use corresponding methods.
11. Using `inline` on a distinct type allows it to be implicitly converted *to* its base type (but not vice versa).
12. Types may add operator overloading to support `foreach` and subscript operations.
13. Generic types through generic modules, using `(< ... >)` for the generic parameter list (e.g. `List(<int>) list;`).
14. Interface types, `any` types which allows dynamic invocation of methods.

### Changed

1. `typedef` is replaced by `def` and has somewhat different syntax (e.g. `def MyTypeAlias = int;`).
2. Function pointer syntax is prefix `fn` followed by a regular function declaration without the function name.

### Removed

1. Enums, structs and unions no longer have distinct namespaces.
2. Enum, struct and union declarations should not have a trailing ';'
3. Inline `typedef` is not allowed. `def` can only be used at the top level.
4. Anonymous structs are not allowed.
5. Type qualifiers are all removed, including `const`, `restrict`, `volatile`
6. Function pointers types **cannot** be used "raw", but must always be used through a type alias.

### Introspection

Compile time type methods: `alignof`, `associated`, `elements`, `extnameof`, `inf`, `inner`, `kindof`, `len`,
`max`, `membersof`, `min`, `nan`, `names`, `params`, `returns`, `sizeof`, `typeid`, `values`,
`qnameof`, `is_eq`, `is_ordered`.

Runtime type methods: `inner`, `kind`, `len`, `names`, `sizeof`.

## Expressions

### Added

1. Expression block using `{| ... |}`. Somewhat similar to GCC statement expressions.
2. Array initializers may use ranges. (e.g. `int[256] x = { [0..128] = 1 }`)
3. `?:` operator, returning the first value if it can be converted to a boolean true, otherwise the second value is returned.
4. Orelse `??` returning the first value if it is a result, the second if the first value was an optional value.
5. Rethrow `!` suffix operator with an implicit `return` the value if it was an optional value.
6. Dynamic calls, allowing calls to be made on the `any` and interfaces dispatched using a dynamic mechanism.
7. Create a slice using a range subscript (e.g. `a[4..8]` to form a slice from element 4 to element 8).
8. Two range subscript methods: `[start..inclusive_end]` and `[start:length]`. Start, end and length may be omitted for default values.
9. Indexing from end: slices, arrays and vectors may be indexed from the end using `^`. `^1` represents the last element. This works for ranges as well.
10. Range assignment, assign a single value to an entire range e.g. `a[4..8] = 1;`.
11. Slice assignment, copy one range to the other range e.g. `a[4..8] = b[8..12];`.
12. Array, vector and slice comparison: `==` can be used to make an element-wise comparison of two containers. 
13. `?` suffix operator turns a fault into an optional value.
14. `!!` suffix panics if the value is an optional value.
15. `$defined(...)` returns true if the last expression is defined (sub-expressions must be valid).
16. `$and(...)` `$or(...)` perform compile time `&&` and `||` without semantically checking any elements after the first false/true respectively.
17. Lambdas (anonymous functions) may be defined, they work just like functions and do not capture any state.
18. Simple bitstructs (only containing booleans) may be manipulated using bit operations `& ^ | ~` and assignment.
19. Structs may implicitly convert to their `inline` member if they have one.
20. Pointers to arrays may implicitly convert to slices.
21. Any pointer may implicitly convert to an `any` with type being the pointee.
22. Optional values will implicitly invoke "flatmap" on an expression it is a subexpression of.
23. Swizzling for arrays and vectors.

### Changed

1. Compound literals use `Type { ... }` rather than `(Type) { ... }`
2. Operator precedence of bit operations is higher than `+` and `-`.
3. Well defined-evaluation order: left-to-right, assignment after expression evaluation.
4. `sizeof` is `$sizeof` and only works on expressions. Use `Type.sizeof` on types.
5. `alignof` is `$alignof` for expressions. Types use `Type.alignof`.
6. Narrowing conversions are only allowed if all sub-expressions is as small or smaller than the type.
7. Widening conversions are only allowed on simple expressions (i.e. most binary expressions and some unary may not be widened)

### Removed

1. The comma operator is removed.

### Cast changes

## Functions

### Added

1. Functions may be invoked using named arguments, the name is the dot-prefixed parameter name, e.g. `foo(name: a, len: 2)`.
2. Typed varargs are declared `Type... argument`, and will take 0 or more arguments of the given type.
3. It is possible to "splat" an array or slice into the location of a typed vararg using `...`: `foo(a, b, ...list)`
4. `any` varargs are declared `argument...`, it can take 0 or more arguments of any type which are implicitly converted to the `any` type.
5. The function declaration may have `@inline` or `@noinline` as a default.
6. Using `@inline` or `@noinline` on a function call expression will override the function default.
7. Type methods are functions defined in the form `fn void Foo.my_method(Foo* foo) { ... }`, they can be invoked using dot syntax.
8. Type methods may be attached to any type, even arrays and vectors.
9. Error handling using optional return types.

### Changed

1. Function declarations use the `fn` prefix.

### Removed

1. Functions with C-style varargs may be called, and declared as external functions, but not used for C3 functions.

## Attributes

C3 adds a long range of attributes in the form `@name(...)`. It is possible to create custom 
attribute groups using `def` (e.g. `def MyAttribute(usz align) = { @aligned(align) @weak };`) which
groups certain attributes. Empty attribute groups are permitted.

The complete list: `@align`, `@benchmark`, `@bigendian`, `@builtin`,
`@callconv`, `@deprecated`, `@dynamic`, `@export`,
`@extern`, `@if`, `@inline`, `@interface`,
`@littleendian`, `@local`, `@maydiscard`, `@naked`,
`@nodiscard`, `@noinit`, `@noreturn`, `@nostrip`,
`@obfuscate`, `@operator`, `@overlap`, `@priority`,
`@private`, `@public`, `@pure`, `@reflect`,
`@section`, `@test`, `@used`, `@unused`.

## Declarations

### Added

1. `var` declaration for type inferred variables in macros. E.g. `var a = some_value;`
2. `var` declaration for new type variables in macros. E.g. `var $Type = int;`
3. `var` declaration for compile time mutable variables in function and macros. E.g. `var $foo = 1;`
4. `const` declarations may be untyped. Such constants are not stored in the resulting binary.

### Changed

1. `tlocal` declares a variable to be thread local.
2. `static` top level declarations are replaced with `@local`. (`static` in functions is unchanged)

### Removed

1. `restrict` removed.
2. `atomic` should be replaced by atomic load/store operations.
3. `volatile` should be replaced by volatile load/store operations.

## Statements

### Added

1. Match-style variant of the `switch` statement, allows each `case` to hold an expression to test.
2. Switching over type with `typeid`.
3. Unpack `any` to the underlying type with an `any`-switch.
4. `nextcase` to fallthrough to the next case.
5. `nextcase <expr>` to jump to the case with the expression value (this may be an expression evaluated at runtime).
6. `nextcase default` to jump to the `default` clause.
7. Labelled `while`/`do`/`for`/`foreach` to use with `break` `nextcase` and `continue`.
8. `foreach` to iterate over arrays, vectors, slices and user-defined containers using operator overloading.
9. `foreach_r` to iterate in reverse.
10. `foreach` / `foreach_r` may take the element by value or reference. The index may optionally be provided.
11. `$if`, `$switch`, `$for`, `$foreach` statements executing at compile time.
12. `$echo` printing a message at compile time.
13. `$assert` compile time assert.
14. `defer` statement to execute statements at scope exit.
15. `defer catch` and `defer try` similar to `defer` but executes only on optional exit or regular exit of scope respectively.
16. `do` statements may omit `while`, behaving same as `while (0)`
17. `if` may have a label. Labelled `if` may be exited using labelled break.
18. `asm` blocks for inline assembly. 
19. if-try statements allows you to run code where an expression is a result.
20. if-catch statements runs code on fault. It can be used to implicitly unwrap variables.
21. Exhaustive switching on enums.

### Changed

1. Switch cases will have implicit break, rather than implicit fallthrough.
2. `assert` is an actual statement and may take a string or a format + arguments.
3. `static_assert` is `$assert` and is a statement.

### Removed

1. `goto` removed, replaced by labelled break, continue and nextcase.

## Compile time evaluation

### Added

1. `@if(cond)` to conditionally include a struct/union field, a user-defined type etc.
2. Compile time variables with `$` prefix e.g. `$foo`.
3. `$if...$else...$endif` and `$switch...$endswitch` inside of functions to conditionally include code.
4. `$for` and `$foreach` to loop over compile time variables and data.
5. `$typeof` determines an expression type without evaluating it.
6. Type properties may be accessed at compile time.
7. `$define` returns true if the variable, function or type exists.
8. `$error` emits an error if encountered.
9. `$embed` includes a file as binary data.
10. `$include` includes a file as text.
11. `$exec` includes the output of a program as code.
12. `$evaltype` takes a compile time string and turns it into a type.
13. `$eval` takes a string and turns it into an identifier.
14. `$extnameof` turns an identifier into its string external name.
15. `$nameof` turns an identifier into its local string name.
16. `$qnameof` turns an identifier into its local string name with the module prefixed.
17. Compile time constant values are always compile time folded for arithmetic operations and casts.
18. `$$FUNCTION` returns the current function as an identifier.

### Changed

1. `#define` for constants is replaced by untyped constants, e.g. `#define SOME_CONSTANT 1` becomes `const SOME_CONSTANT = 1;`.
2. `#define` for variable and function aliases is replaced by `def`, e.g. `#define native_foo win32_foo` becomes `def native_foo = win32_foo;`
3. In-function `#if...#else..#endif` is replaced by `$if`, `#if...#elif...#endif` is replaced by `$switch`.
4. For converting code into a string use `$stringify`.
5. Macros for date, line etc are replaced by `$$DATE`, `$$FILE`, `$$FILEPATH`, `$$FUNC`, `$$LINE`, `$$MODULE`, `$$TIME`.

### Removed

1. Top level `#if...#endif` does not have a counterpart. Use `@if` instead.
2. No `#include` directives, `$include` will include text but isn't for the same use.

## Macros

### Added

1. `macro` for defining macros.
2. "Function-like" macros have no prefix and has only regular parameters or type parameters.
3. "At"-macros are prefixed with `@` and may also have compile time values, expression and ref parameters, and may have a trailing body.
4. Type parameters have the prefix `$` and conform to the type naming standard ("$TypeFoo").
5. "ref" parameters are declared using with a `&` prefix operator. This is similar to C++ ref parameters.
6. Expression parameters are unevaluated expressions, this is similar to arguments to `#define`.
7. Compile time values have a `$` prefix and must contain compile time constant values.
8. Any macro that evaluates to a constant result can be used as if it was the resulting constant.
9. Macros may be recursively evaluated.
10. Macros are inlined at the location where they are invoked.
11. Unless resulting in a single constant, macros implicitly create a runtime scope.

### Removed

1. No `#define` macros.  
2. Macros cannot be incomplete statements.

## Features provided by builtins

Some features are provided by builtins, and appears as normal functions and macros in the standard library
but nonetheless provided unique functionality:

1. `@likely(...)` / `@unlikely(...)` on branches affects compilation optimization.
2. `@anycast(...)` casts an `any` with an optional result.
3. `unreachable(...)` marks a path as unreachable with a panic in safe mode.
4. `unsupported(...)` similar to unreachable but for functionality not implemented.
5. `@expect(...)` expect a certain value with an optional probability for the optimizer.
6. `@prefetch(...)` prefect a pointer.
7. `swizzle(...)` swizzles a vector.
8. `@volatile_load(...)` and `@volatile_store(...)` volatile load/store.
9. `@atomic_load(...)` and `@atomic_store(...)` atomic load/store.
10. `compare_exchange(...)` atomic compare exchange.
11. Saturating add, sub, mul, shl on integers.
12. Vector reduce operations: add, mul, and, or, xor, max, min.

## Modules

1. Modules are defined using `module <name>`. Where name is on the form `foo::bar::baz`
2. Modules can be split into an unlimited number of module sections, each starting with the same module name declaration.
3. The `import` statement imports a given module.
4. Each module section has its own set of import statements.
5. Importing a module gives access to the declarations that are `@public`.
6. Declarations are default `@public`, but a module section may set a different default (e.g. `module my_module @private;`)
7. `@private` means the declaration is only visible in the module.
8. `@local` means only visible to the current module section.
9. Imports are recursive. For example, `import my_lib` will implicitly also import `my_lib::net`.
10. Multiple imports may be specified with the same `import`, e.g. `import std::net, std::io;`.
11. Generic modules have a set of parameters after the module name `module arr(<Type, LEN>);`
12. Generic modules are not type checked until any of its types, functions or globals are instantiated.

## Contracts

1. Doc comments (starting with `/**`) are parsed.
2. The first part, up until the first `@` directive is ignored.
3. The `@param` directive for pointer arguments may define usage constraints `[in]` `[out]` and `[inout]`.
4. Pointer argument constraints may add a `&` prefix to indicate that they may not be `null`, e.g. `[&inout]`.
5. Contracts may be attached to generic modules, functions and macros.
6. `@require` directives are evaluated given the arguments provided. Failing them may be a compile time or runtime error.
7. The `@ensure` directive is evaluated at exit - if the return is a result and not an optional.
8. `return` can be used as a variable identifier inside of `@ensure`, and holds the return value.
9. `@return!` optionally lists the errors used. This will be checked at compile time.
10. `@pure` says that no writing to globals is allowed inside and only `@pure` functions may be called.

## Benchmarking

1. Benchmarks are indicated by `@benchmark`.
2. Marking a module section `@benchmark` makes all functions inside of it implicitly benchmarks.
3. Benchmarks are usually not compiled.
4. Benchmarks are instead only run by the compiler on request.

## Testing

1. Tests are indicated by `@test`.
2. Marking a module section `@test` makes all functions inside of it implicitly tests.
3. Tests are usually not compiled.
4. Tests are instead only run by the compiler on request.

## Safe / fast

Compilation has two modes: "safe" and "fast". Safe will insert checks for out-of-bounds access, null-pointer deref,
shifting by negative numbers, division by zero, violation of contracts and asserts.

Fast will assume all of those checks can be assumed to always pass. This means that unexpected behaviour may result
from violating those checks. It is recommended to develop in "safe" mode.

If debug symbols are available, C3 will produce a stack trace in safe mode where an error occurs.