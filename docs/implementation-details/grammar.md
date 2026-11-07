---
title: Grammar
description: Grammar
search:
  exclude: true
---

## Keywords

The following names of built-in types are reserved keywords:

```c3
any          bfloat       bool         char
double       fault        float        float16
float128     ichar        int          int128
iptr         long         short        sz
typeid       uint         uint128      ulong
untypedlist  uptr         ushort       usz
void
```

The following are also reserved keywords:

```c3
alias      asm        assert     attrmacro
bitstruct  break      case       catch
const      constset   continue   default
defer      do         else       enum
excuse     extern     false      fn
for        foreach    foreach_r  if
import     inline     interface  lengthof
macro      module     nextcase   null
return     static     struct     switch
tlocal     true       try        typedef
union      var        while
```

### Compile-time keywords

```c3
$assert      $case        $default     $defined
$echo        $else        $embed       $endfor
$endforeach  $endif       $endswitch   $error
$eval        $exec        $expand      $feat
$for         $foreach     $if          $include
$reflect     $stringify   $switch      $Typefrom
$Typeof      $vaarg
```

## Attributes

The following attributes are built in:

```c3
@align             @allow_deprecated  @asmname           @benchmark
@bigendian         @builtin           @callconv          @cname
@compact           @const             @constinit         @deprecated
@dynamic           @export            @feat              @finalizer
@format            @if                @init              @inline
@jump              @link              @littleendian      @local
@maydiscard        @mustinit          @naked             @noalias
@nodiscard         @noinit            @noinline          @nopadding
@norecurse         @noredzone         @noreturn          @nosanitize
@nostackprobe      @nostackprotector  @nostrip           @obfuscate
@operator          @operator_r        @operator_s        @optional
@overlap           @packed            @private           @public
@pure              @reflect           @safeinfer         @safemacro
@section           @simd              @stackprobe        @stackprotector
@tag               @test              @unused            @used
@wasm              @weak              @weaklink          @winmain
```

## Constants

The following constants are defined:

```c3
$$BENCHMARK_FNS    $$BENCHMARK_NAMES  $$DATE
$$FILE             $$FILEPATH         $$FUNC
$$FUNCTION         $$LINE             $$LINE_RAW
$$MODULE           $$PANIC_FN         $$TEST_FNS
$$TEST_NAMES       $$TIME
```
