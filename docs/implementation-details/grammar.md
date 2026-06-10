---
title: Grammar
description: Grammar
search:
  exclude: true
---

## Keywords

The following are reserved keywords used by C3:

```c3
void        bool        char        double
float       float16     int128      ichar
int         iptr        sz          long
short       uint128     uint        ulong
uptr        ushort      usz         float128
any         fault    	typeid      assert
asm         bitstruct   break       case
catch       const       continue    alias
default     defer       typedef     do
else        enum        extern      false
for         foreach     foreach_r 	fn
tlocal      if          inline      import
macro       module      nextcase	null
return      static      struct      switch
true        try         union       var
while       attrdef
```

```
$assert     $case       $default    $defined
$echo       $else       $embed      $exec       
$expand     $endfor     $endforeach $endif
$endswitch  $eval       $error      $for        
$foreach    $if         $include    $stringify  
$switch     $vaarg      $Typefrom   $Typeof     
```

The following attributes are built in:
```c3
@align        @benchmark  @bigendian  @builtin
@cdecl        @cname      @deprecated @dynamic
@export       @extname    @inline     @interface
@littleendian @local      @maydiscard @mustinit
@naked        @nodiscard  @noinit     @noinline
@noreturn     @nostrip    @obfuscate  @operator
@overlap      @packed     @priority   @private
@public       @pure       @reflect    @section
@stdcall      @test       @unused     @used
@veccall      @wasm       @weak       @winmain
```

The following constants are defined:
```c3
$$BENCHMARK_FNS  $$BENCHMARK_NAMES $$DATE
$$FILE           $$FILEPATH        $$FUNC
$$FUNCTION       $$LINE            $$LINE_RAW
$$MODULE         $$TEST_FNS        $$TEST_NAMES
$$TIME
```
