---
title: Change logs
description: Changelogs
sidebar:
    order: 998
---

##### Revision 2024-06-13
- Updated enum syntax
- `any` -> `any*`

##### Revision 2023-10-24
- Removal of `$checks` and `@checked`
- Additional chapter on vectors.
- Addition of `$and`/`$or`.
- Added `is_eq` and `is_ordered` type properties.

##### Revision 2023-10-20
- `protocol` => `interface`
- Overall update to reflection docs.
- Updates to distinct.

##### Revision 2023-10-05
- `protocol`
- Update to `any*`

##### Revision 2023-10-03
- `exec` and `$exec`
- change of `static initializer`

##### Revision 2023-09-09
- Removal of implicit void! -> anyfault conversion.
- Change `@catchof` to `@catch`.

##### Revision 2023-07-22
- Feature list.
- Macro ref parameter update.
- Abbreviated method first arg.

##### Revision 2023-07-09
- Update with $embed information.

##### Revision 2023-07-07
- Updated generics syntax and uses.
- Moved all "ideas" to the issue tracker.

##### Revision 2023-06-23
- Distinct inline explanation.
- Module sections.

##### Revision 2023-06-11
- Updated list of attributes.
- Better @if examples.

##### Revision 2023-06-10
- Updated with @if directive.

##### Revision 2023-06-03
- Added specific compiletime page.
- Updated examples with references.
- variant -> any,

##### Revision 2023-06-05
- Chapter on dynamic code.
- Updated some pages with references to dynamic calls.

##### Revision 2023-06-02
- Suffix '?' replaced by '!' and vice versa.
- Updates to ct statements.
- Fixes to array descriptions
- Replace try? / catch? with macros
- Updates to reflection
- define/typedef is now "def"

##### Revision 2023-03-18
- try? / catch?
- println -> printn

##### Revision 2023-02-15
- Added uint128 / int128 to the documentation.
- @private, @public and @local

##### Revision 2023-02-14
- Updated typedef / define

##### Revision 2023-02-11
- Changed @extname to @extern following compiler changes.
- Document @export

##### Revision 2023-01-24
- Consistently use printfn rather than printfln
- Added [short function](/references/docs/functions) syntax.
- Added [lambdas](/references/docs/functions).

##### Revision 2023-01-07
- Direct download links added.
- Prefer "String" over char[]

##### Revision 2022-12-28
- Bitstruct documented.

##### Revision 2022-11-18
- Documented inline asm.
 
##### Revision 2022-11-16
- Move description of static initialize.
- Info on operator overload.
- More details on function pointers.
- Updated project tree.

##### Revision 2022-11-07
- Added information on enum associated values.

##### Revision 2022-10-31
- Updated project.json description.
- Added information about static initializers and finalizers.

##### Revision 2022-10-14
- libc::printf replaced with io::printf

##### Revision 2022-10-01
- Expanded and updated [types](/references/docs/types).

##### Revision 2022-07-20
- Added start + len syntax

##### Revision 2022-07-15
- Added "builtins"

##### Revision 2022-06-30
- Updates to module system

##### Revision 2022-04-05
- Removal of `@opaque`.
 
##### Revision 2022-03-26
- Remove escape macros.
- Adding stringify and first class names.
- Removing "?? jump"

##### Revision 2022-03-15
- Removal of multi-line strings

##### Revision 2022-03-04
- Updates to $sizeof.
- Addition of $eval / $evaltype.
- Removal of $unreachable.

##### Revision 2022-02-16
- Updates to imports.
- Updates to project files.

##### Revision 2022-02-09
- Major revision to bring everything up to date.

##### Revision 2021-10-20
- `func` replaced by `fn`
- Compound literal now `Type { ... }` like C++.
- Update of conversion rules
- New error syntax


##### Revision 2021-08-27
- Updated reflection functionality.
- Added documentation for multi-line strings.
- Added documentation for base64 and hex array literals.

##### Revision 2021-08-12
- Updated error type and error handling with try/catch
 
##### Revision 2021-07-13
- Added nesting to /* ... */ removed /+ ... +/
- Added primer.

##### Revision 2021-06-20
- Updated array layout.
- Revised macros for foreach.
- Removed old generic functions. 
- Added new ideas around generic, macros
- Changed macro body definition syntax.
- Introduced both $for and $foreach.

##### Revision 2021-05-31
- Removal of vararray type.
- Updated user defined attributes.
- Removed incremental arrays.
- Added information on `define`.
- Added private modules and import.

##### Revision 2021-05-18
- Change cast to (type)(expression)

##### Revision 2021-05-08
- Added rationale for some changes from C.
- Updated undefined and [undefined behaviour](/references/docs/undefinedbehaviour).
- Removed many of the fine-grained module features.
- Removed "local" visibility in [modules](/references/docs/modules).
- All modules are now distinct, parent modules do not have any special access to submodules.
- Added `as module` imports.

##### Revision 2021-04-05
- "next" is now "nextcase".
- Added link to the C3 discord.
- The [conversions](/references/docs/conversion) page updated with new conversion rules.
- Updated compound literal syntax.
- Removed [undefined behaviour](/references/docs/undefinedbehaviour) behaviour on integer overflow and added a list of unspecified behaviour.

##### Revision 2020-12-23
- Updated slice behaviour.
- Updated expression block syntax.  
- Added link to specification-in-progress.

##### Revision 2020-12-04
- Local variables are implicitly zero.
- Removed in-block declarations.
- Changed struct member initialization syntax.
- Changed named parameter syntax.
- Updated on macro syntax.
- Removed built in c types.

##### Revision 2020-08-22
- Added slice operations.
- Changed cast syntax to `cast(<expr> as <type>)`.
    
##### Revision 2020-07-08
- Additions to [error handling](/references/docs/optionals).
- Introduction of labelled `nextcase`, `break` and `continue`.
- Removal of `goto`.

##### Revision 2020-06-17
- Alternate casts in [idea](/references/docs/ideas).
- Method functions simply renamed to "method".
- Completely revised [error handling](/references/docs/optionals).

##### Revision 2020-04-23
- Updated error handling, adding try-else-jump and changed how errors are passed.
- Included [reflection](/references/docs/reflection) page

##### Revision 2020-03-30
- Added Odin and D to comparisons.
- Updated text on how to contribute.
- Updated the example on undefined behaviour.
- Updated text on conversions.
- Moved double -> float conversion to "ideas"
- Fixed some typos.

##### Revision 2020-03-29
- Type inference for enums.
- Included [macro](/references/docs/macros) page.
- Corrected precedence rules with `try` and `@`.
- Type functions.
- Managed variables back to ideas.
- Volatile moved back to ideas.
- Removed implicit lossy signed conversions.
- Introducing safe signed-unsigned comparisons.
- "Function block" renamed "expression block".
- `@` sigil removed from macros and is only used with macro invocations.
- Changed cast syntax from `@cast(Type, var)` to `cast(var, Type)`

##### Revision 2019-12-26
- Added module versioning system [idea](/references/docs/ideas). 
- Fleshed out polymorphic functions.
- Unsigned to signed promotion mentioned in "changes from C"

##### Revision 2019-12-25
- Changes how generic modules work.
- Switched so that vararrays use `Type[*]` and slices use `Type[]`.
- Added submodule granularity, partial imports (only importing selected functions and types), removal of `local`, extended aliasing. See [modules](/references/docs/modules).
- Updated "changes from C" with removal of multiple declarations.

##### Revision 2019-12-11
- Updated the [setup](/references/docs/setup) page.

##### Revision 2019-12-03
- Added page on [conversions](/references/docs/conversion).
- Added page on [undefined behaviour](/references/docs/undefinedbehaviour).

##### Revision 2019-11-01
- Updated "changes from C" with the lack of array decays.
- Added FourCC to the language 
- Added name alias to ideas
- Added align asserts to ideas
- Added built in tests to ideas
- Added [arrays page](/references/docs/arrays)
- Added function blocks to [statements page](/references/docs/statements).
- Added [expressions page](/references/docs/expressions).
- Added [variables page](/references/docs/variables).
- Moved managed pointers from idea to the [variables page](/references/docs/variables).

##### Revision 2019-09-30

- Removed references (non-nullable pointers)
- Removed idea with aliasing in import

##### Revision 2019-08-14

- Compile time run-include and include ideas.
- New module system idea.

##### Revision 2019-08-14

- Namespace separator changed to `::` instead of `.` to simplify parsing. 
- Added FourCC, Macro text interpolation to ideas.
- Added Yacc grammar (incomplete)
- Added "attribute" keyword. 
- Changed type alias declaration to use `typedef ... as ...`. 
- Introduced `type` operator. 
- Added section about attributes.

##### Revision 2019-08-02

- Added error example.
- Added generics example.
- Added method function example.
- Added idea implicit method functions
- Expanded the types page somewhat.

##### Revision 2019-07-30

- Added default and named arguments to the [functions page](/references/docs/functions).
- Added varargs to the [functions page](/references/docs/functions).
- Added idea about hierarchal memory.
- Added idea of raw dynamic safe arrays & strings.
- Volatile sections are no longer prefixed by '@'
- Added idea regarding c3 interop
- Added [page about c interop](/references/docs/cinterop).
- Removed `c_ichar` and `c_uchar` types as they are redundant.
- Updates to keywords on the [grammar page]()/references/docs/syntax).

##### Revision 2019-07-27

- Updated grammar with keywords.
- Added the [docs & comments](/references/docs/comments) page.
- Updated the [pre- and post-conditions](/references/docs/contracts).

##### Revision 2019-07-24

- Idea: typed varargs.
- Added "pure" [post condition](/references/docs/contracts)
- Updated c3c commands.
- Removed the `type` keyword for defining union/struct/enum/error.

##### Revision 2019-07-23

- Added to [generic functions](/references/docs/generics) examples for [] and []=
- Developed ideas about vectors in the [idea section](/references/docs/ideas).
- Defined 2's complement for signed integers. 
- Idea: Managed pointers.
- Updated [naming rules](/references/docs/naming) for types.
- Added more [naming rules](/references/docs/naming) + examples of them.
- Removed "defer on function signatures" from ideas.
- Removed "managed qualifier" from ideas.
- Removed "defer sugar" from ideas.
- Removed "built in dynamic arrays" from ideas.
- Added [standard_library](/references/docs/standard_library) section.
- Added more about [pre- and post-conditions](/references/docs/contracts).

##### Revision 2019-07-22

- Added "Design Principles" to the index page.

##### Revision 2019-07-21

- "return" rather than function name is used in post conditions. See [Functions](/references/docs/functions#pre-and-post-conditions)
- Added "@include" macro for textual includes. See [Modules](/references/docs/modules#textual-includes).
- Files to without `module` for single file compilations is now ok as a special case. See [Modules](/references/docs/modules)
- Added cone style array idea to the [idea section](/references/docs/ideas).
- Added idea about defer on error to the [idea section](/references/docs/ideas).
- Added idea for aliasing generic structs in the import to the [idea section](/references/docs/ideas).
- Added idea for changing automatic signed <-> unsigned conversion to the [idea section](/references/docs/ideas).
- Added [Changes from C](/references/docs/changesfromc) and [Statements](/references/docs/statements) sections.
- Removal of `volatile`. See [Changes from C](/references/docs/changesfromc) and [Statements](/references/docs/statements)
- Removal of `const` See [Changes from C](/references/docs/changesfromc)


