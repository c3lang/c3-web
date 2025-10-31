---
title: "C3 Language at 0.7.7: Vector ABI, RISCV improvements and more"
date: 2025-10-30
tags: ["release", "language-features", "compiler"]
author: "Christoffer Lernö"
---
0.7.7 is a major advance in C3 usability with vector ABI changes. It also contains several small quality-of-life additions, such as the ability to splat structs into an initializer, and implicit subscript dereferencing. Fairly few bugs were discovered during this development cycle, which is why the fixed bugs are unusually low.

Let's look at what 0.7.7 brings in more detail:

## Vector ABI changes
The most significant change in this release is the ABI change for vectors, which now store and pass vectors as arrays in function calls and structs. While vectors still use SIMD, their equality to arrays on the ABI level means that C graphical libraries will directly match vector types.

Where before you needed to work with C structs defining vectors and then converting them to SIMD vectors for actual computation, it now works out of the box. Another problem with vectors prior to 0.7.7 was their space and alignment requirements over structs. From 0.7.7 alignment matches that of structs and arrays, making them extremely convenient to work with.

For cases where SIMD vectors are actually expected, it's possible to create distinct types using `typedef` with a new `@simd` attribute to exactly match standard C SIMD vectors, e.g. `typedef V4si = int[<4>] @simd;`. This then exactly matches the corresponding C SIMD type.

This makes it easier than ever to use SIMD with C3.

An example:
```c3
// Pre 0.7.7
union Vec3
{
    struct
    {
        float x, y, z;
    }
    float[3] arr;
}
extern fn void draw_image(Image* image, Vec3 pos);

fn void update()
{
    ...
    // Speed and position is stored as Vec3
    float[<3>] speed = ball.speed.arr; // Implicit conversion array to vector 
    float[<3>] position = ball.position.arr; // Implicit conversion array to vector
    ball.position = (position + speed);
}
// 0.7.7+
alias Vec3 = float[<3>]; // Equivalent to the struct due to ABI change
extern fn void draw_image(Image* image, Vec3 pos);

fn void update()
{
    ...
    // Speed and position is stored as Vec3
    ball.position += ball.speed; // SIMD add
}
```

## Struct initializer splats

This feature enables using the splat operator `...` to give a designated initializer default values that are overridden by the following arguments.

```c3
struct Foo
{
    int a;
    double b;
    String c;
}

fn void test()
{
    Foo f = { 1, 2.3, "Hi" };
    Foo f2 = { ...f, .a = 8, .c = "Bye" }; // Results in { 8, 2.3, "Bye" }
}
```

## Subscript deref

When passing arrays or lists by reference, the `[]` operator tend to behave in an undesirable way, dereferencing the pointer instead of the underlying array/list:

```c3
fn void test(List{int}* list_ref, int[3]* array_ref, int[3] array)
{
    // WRONG, would yield a 'List{int}' not an int
    // int val = list_ref[1]; 
    int val = (*list_ref)[1]; // Correct
    int val2 = list_ref.get(1); // Also correct, uses implicit deref of '.'
    // Wrong, would yield an 'int[3]', not an int
    // int val3 = array_ref[1]; 
    int val3 = (*array_ref)[1]; // Correct
    int val4 = array[1];
}
```

Subscript deref addresses this. Using `.[1]` will dereference *if needed*:

```c3
fn void test(List{int}* list_ref, int[3]* array_ref, int[3] array)
{
    int val = list_ref.[1]; 
    int val2 = array_ref.[1];
    int val3 = array.[1]; // Works even though it isn't a pointer.
}
```

This is helpful when writing macros and such that will want to accept both elements by reference and by value:
```c3
macro third_element(x)
{
    return x.[2];
}
fn void test()
{
    int[3] arr;
    int[] slice = &arr;
    third_element(arr);   // Works
    third_element(slice); // Works
    third_element(&arr);  // Also works thanks to subscript deref
}
```

## Typedef with alignment

A new feature for `typedef` is to allow creating a type with a specific alignment without wrapping it in a struct. We may, for example, create an integer that is 16 bit aligned using `typedef Int2 = int @align(2);`. This is an alternative way safely work with references to under-aligned members in packed structs.

```c3
// Pre 0.7.7
struct Foo @packed
{
    char a;
    int b;
}
fn void test()
{
    Foo f = { 'a', 1 };
    int* b_ref = &f.b;
    @unaligned_store(*b_ref, 2, 1); // Valid
    *b_ref = 2; // Error at runtime in safe mode, unaligned access
}
// 0.7.7+
typedef IntAlign1 = int @align(1);
struct Foo @packed
{
    char a;
    IntAlign1 b;
}
fn void test()
{
    Foo f = { 'a', 1 };
    IntAlign1* b_ref = &f.b;
    *b_ref = 2;
}
```

## More string functions at compile time
`@str_snakecase`, `@str_constantcase`, `@str_pascalcase` and `@str_replace` macros are added to modify strings at compile time efficiently for certain macro manipulation at compile time.

```c3
fn void test()
{
	String $test = "HelloWorld";
	$echo @str_snakecase($test);               // echoes "hello_world"
	$echo @str_constantcase($test);            // echoes "HELLO_WORLD"
	String $test2 = "hello_world";
	$echo @str_pascalcase($test2);             // echoes "HelloWorld"
	$echo @str_replace($test, "Hello", "Bye"); // echoes "ByeWorld"
}
```

## Small but important changes

Aliases which alias `@local` variables must also be `@local`. `@extern` is renamed `@cname` as it was frequently misunderstood. Generic inference now works better in initializers. For slices with the `..` syntax, it's now possible to have the end index be one less than the starting index, so that zero size slices can be expressed with the `..` syntax as well.

## Cross-Platform and Architecture Support Expansion
This release significantly strengthens C3C's cross-platform capabilities, particularly for RISC-V architecture support. It's now possible to set individual CPU features using `--cpu-flags`, e.g. `--cpu-flags +avx,-sse`. For RISC-V, `--riscv-cpu` has been added, as well as renaming the RISC-V abi flag the more correct `--riscv-abi`.

## Stdlib changes
The sorting macros accidentally only took non-slices by value, which would work in some cases but not in others. This has been fixed, but might mean that some code needs to update as well. TcpSocketPair to create a bidirectional local socket pair was added to the tcp module, and on Windows, using sockets should implicitly initialize the underlying socket subsystem.

## Fixes
0.7.7 has only about 11 fixes, which reflects the relatively few bugs encountered in the 0.7.7 cycle. There are outstanding bugs on the inline asm, which has a significant update planned. The most important fix is patching a regression for MacOS which prevented backtrace printing.

## Looking Forward
With the updated Vector ABI and the change from `@extern` to `@cname` there are a lot of vendor libraries that will need a refresh. There is also a new matrix library in development that hopefully might get included in the next release. There is more functionality to add for fine-tuning processor capabilities for both RISC-V, but also AArch64. There have also been requests for 32-bit Arm support, but the lack of CI tests for different Arm processors is blocking it at the moment.

## Community and Contributions
This release wouldn't have been possible without the C3 community. I'd like to extend a deep thank you to all who have contributed, both through filed issues, PRs and just plain discussions.

### Change Log
<details>
	<summary class="
		text-black 
		dark:text-white
		font-medium
		text-lg
		"
	>
		Click for full change log
	</summary>

### Changes / improvements
- Error when using $vaarg/$vacount/$vasplat and similar in a macro without vaargs #2510.
- Add splat defaults for designated initialization #2441.
- Add new builtins `$$str_snakecase` `$$str_replace` and `$$str_pascalcase`.
- `"build-dir"` option now available for `project.json`, added to project. #2323
- Allow `..` ranges to use "a..a-1" in order to express zero length.
- Disallow aliasing of `@local` symbols with a higher visibility in the alias.
- Add `--max-macro-iterations` to set macro iteration limit.
- Improved generic inference in initializers #2541.
- "Maybe-deref" subscripting `foo.[i] += 1` #2540.
- ABI change for vectors: store and pass them as arrays #2542.
- Add @simd and @align attributes to typedef #2543.
- Rename `@extern` to `@cname`, deprecating the old name #2493.
- Allow `(Foo)0` bitstruct casts even if type sizes do not match.
- The option `--riscvfloat` renamed `--riscv-abi`.
- Add initial `--cpu-flags` allowing fine grained control over CPU features.
- Add `--riscv-cpu` settings for RISC-V processors #2549.

### Fixes
- Bug in `io::write_using_write_byte`.
- Bitstruct value cannot be used to index a const array in compile time. #2512
- Compiler fails to stop error print in recursive macro, and also prints unnecessary "inline at" #2513.
- Bitstruct truncated constant error escapes `$defined` #2515.
- Compiler segfault when accessing member of number cast to bitstruct #2516.
- Compiler assert when getting a member of a `bitstruct : char @bigendian` #2517.
- Add ??? and +++= to list-precedence.
- Fix issues with linking when using symbol aliases. #2519
- Splatting optional compile-time macro parameter from inside lambda expression does not work #2532.
- Compiler segfault when getting a nonexistant member from an unnamed struct #2533.
- Correctly mention aliased type when method is not implemented #2534.
- Regression: Not printing backtrace when tests fail for MacOS #2536.

### Stdlib changes
- Sorting functions correctly took slices by value, but also other types by value. Now, only slices are accepted by value, other containers are always by ref.
- Added `@str_snakecase`, `@str_replace` and `@str_pascalcase` builtin compile time macros based on the `$$` builtins.
- Add TcpSocketPair to create a bidirectional local socket pair.
- Add `extern fn CInt socketpair(AIFamily domain, AISockType type, CInt protocol, NativeSocket[2]* sv)` binding to posix.
- Add `extern fn getsockname(NativeSocket socket, SockAddrPtr address, Socklen_t* address_len)` binding to win32.

</details>

### Want To Dive Into C3?

Check out the [documentation](/getting-started) or [download it and try it out](/getting-started/prebuilt-binaries).

Have questions? Come and chat with us on [Discord](https://discord.gg/qN76R87).