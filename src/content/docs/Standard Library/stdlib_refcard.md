---
title: Standard Library Reference
description: Standard Library Reference
sidebar:
    order: 141
---
### libc
```c3
distinct Errno = inline CInt;
```
```c3
struct DivResult
```
```c3
struct LongDivResult
```
```c3
struct TimeSpec
```
```c3
struct Timespec
```
```c3
struct Tm
```
```c3
fn TimeSpec Duration.to_timespec(self) @inline
```
```c3
fn TimeSpec NanoDuration.to_timespec(self) @inline
```
```c3
fn Errno errno()
```
```c3
fn void errno_set(Errno e)
```
### libc @if(!env::LIBC)
```c3
fn void* calloc(usz count, usz size) @weak @extern("calloc") @nostrip
```
```c3
fn CFile fclose(CFile) @weak @extern("fclose") @nostrip
```
```c3
fn int feof(CFile stream) @weak @extern("feof") @nostrip
```
```c3
fn int fflush(CFile stream) @weak @extern("fflush") @nostrip
```
```c3
fn int fgetc(CFile stream) @weak @extern("fgetc") @nostrip
```
```c3
fn char* fgets(ZString str, int n, CFile stream) @weak @extern("fgets") @nostrip
```
```c3
fn CFile fopen(ZString filename, ZString mode) @weak @extern("fopen") @nostrip
```
```c3
fn int fputc(int c, CFile stream) @weak @extern("fputc") @nostrip
```
```c3
fn usz fread(void* ptr, usz size, usz nmemb, CFile stream) @weak @extern("fread") @nostrip
```
```c3
fn void* free(void*) @weak @extern("free")
```
```c3
fn CFile freopen(ZString filename, ZString mode, CFile stream) @weak @extern("fopen") @nostrip
```
```c3
fn int fseek(CFile stream, SeekIndex offset, int whence) @weak @extern("fseek") @nostrip
```
```c3
fn usz fwrite(void* ptr, usz size, usz nmemb, CFile stream) @weak @extern("fwrite") @nostrip
```
```c3
fn void longjmp(JmpBuf* buffer, CInt value) @weak @extern("longjmp") @nostrip
```
```c3
fn void* malloc(usz size) @weak @extern("malloc") @nostrip
```
```c3
fn void* memcpy(void* dest, void* src, usz n) @weak @extern("memcpy") @nostrip
```
```c3
fn void* memmove(void* dest, void* src, usz n) @weak @extern("memmove") @nostrip
```
```c3
fn void* memset(void* dest, CInt value, usz n) @weak @extern("memset") @nostrip
```
```c3
fn int putc(int c, CFile stream) @weak @extern("putc") @nostrip
```
```c3
fn int putchar(int c) @weak @extern("putchar") @nostrip
```
```c3
fn int puts(ZString str) @weak @extern("puts") @nostrip
```
```c3
fn void* realloc(void* ptr, usz size) @weak @extern("realloc") @nostrip
```
```c3
fn CInt setjmp(JmpBuf* buffer) @weak @extern("setjmp") @nostrip
```
### libc @if(env::DARWIN)
```c3
struct Stat
```
```c3
macro CFile stderr()
```
```c3
macro CFile stdin()
```
```c3
macro CFile stdout()
```
### libc @if(env::LIBC &amp;&amp; !env::WIN32 &amp;&amp; !env::LINUX &amp;&amp; !env::DARWIN)
```c3
macro CFile stderr() { return (CFile*)(uptr)STDERR_FD; }
```
```c3
macro CFile stdin() { return (CFile*)(uptr)STDIN_FD; }
```
```c3
macro CFile stdout() { return (CFile*)(uptr)STDOUT_FD; }
```
### libc @if(env::LINUX)
```c3
struct Stat @if(!env::X86_64)
```
```c3
struct Stat @if(env::X86_64)
```
```c3
macro usz malloc_size(void* ptr)
```
```c3
macro CFile stderr()
```
```c3
macro CFile stdin()
```
```c3
macro CFile stdout()
```
### libc @if(env::POSIX)
```c3
struct Sigaction
```
```c3
struct Stack_t
```
### libc @if(env::WIN32)
```c3
struct SystemInfo
```
```c3
macro Tm* gmtime_r(Time_t* timer, Tm* buf)
```
```c3
macro Tm* localtime_r(Time_t* timer, Tm* buf)
```
```c3
macro usz malloc_size(void* ptr)
```
```c3
macro isz read(Fd fd, void* buffer, usz buffer_size)
```
```c3
macro CInt setjmp(JmpBuf* buffer)
```
```c3
macro CFile stderr()
```
```c3
macro CFile stdin()
```
```c3
macro CFile stdout()
```
```c3
macro isz write(Fd fd, void* buffer, usz count)
```
### libc::os
```c3
fn int errno() @if(ERRNO_DEFAULT)
```
```c3
macro int errno() @if(env::DARWIN)
```
```c3
macro int errno() @if(env::LINUX)
```
```c3
macro int errno() @if(env::WIN32)
```
```c3
fn void errno_set(int err) @if(ERRNO_DEFAULT)
```
```c3
macro void errno_set(int err) @if(env::DARWIN)
```
```c3
macro void errno_set(int err) @if(env::LINUX)
```
```c3
macro void errno_set(int err) @if(env::WIN32)
```
### std::ascii
```c3
fn char char.from_hex(char c)
```
```c3
fn bool char.in_range(char c, char start, char len)
```
```c3
fn bool char.is_alnum(char c)
```
```c3
fn bool char.is_alpha(char c)
```
```c3
fn bool char.is_bdigit(char c)
```
```c3
fn bool char.is_blank(char c)
```
```c3
fn bool char.is_cntrl(char c)
```
```c3
fn bool char.is_digit(char c)
```
```c3
fn bool char.is_graph(char c)
```
```c3
fn bool char.is_lower(char c)
```
```c3
fn bool char.is_odigit(char c)
```
```c3
fn bool char.is_print(char c)
```
```c3
fn bool char.is_punct(char c)
```
```c3
fn bool char.is_space(char c)
```
```c3
fn bool char.is_upper(char c)
```
```c3
fn bool char.is_xdigit(char c)
```
```c3
fn char char.to_lower(char c)
```
```c3
fn char char.to_upper(char c)
```
```c3
fn bool in_range(char c, char start, char len)
```
```c3
macro bool in_range_m(c, start, len)
```
```c3
fn bool is_alnum(char c)
```
```c3
macro bool is_alnum_m(c)
```
```c3
fn bool is_alpha(char c)
```
```c3
macro bool is_alpha_m(c)
```
```c3
fn bool is_bdigit(char c)
```
```c3
macro bool is_bdigit_m(c)
```
```c3
fn bool is_blank(char c)
```
```c3
macro bool is_blank_m(c)
```
```c3
fn bool is_cntrl(char c)
```
```c3
macro bool is_cntrl_m(c)
```
```c3
fn bool is_digit(char c)
```
```c3
macro bool is_digit_m(c)
```
```c3
fn bool is_graph(char c)
```
```c3
macro bool is_graph_m(c)
```
```c3
fn bool is_lower(char c)
```
```c3
macro bool is_lower_m(c)
```
```c3
fn bool is_odigit(char c)
```
```c3
macro bool is_odigit_m(c)
```
```c3
fn bool is_print(char c)
```
```c3
macro bool is_print_m(c)
```
```c3
fn bool is_punct(char c)
```
```c3
macro bool is_punct_m(c)
```
```c3
fn bool is_space(char c)
```
```c3
macro bool is_space_m(c)
```
```c3
fn bool is_upper(char c)
```
```c3
macro bool is_upper_m(c)
```
```c3
fn bool is_xdigit(char c)
```
```c3
macro bool is_xdigit_m(c)
```
```c3
fn char to_lower(char c)
```
```c3
macro to_lower_m(c)
```
```c3
fn char to_upper(char c)
```
```c3
macro to_upper_m(c)
```
```c3
fn bool uint.in_range(uint c, uint start, uint len)
```
```c3
fn bool uint.is_alnum(uint c)
```
```c3
fn bool uint.is_alpha(uint c)
```
```c3
fn bool uint.is_bdigit(uint c)
```
```c3
fn bool uint.is_blank(uint c)
```
```c3
fn bool uint.is_cntrl(uint c)
```
```c3
fn bool uint.is_digit(uint c)
```
```c3
fn bool uint.is_graph(uint c)
```
```c3
fn bool uint.is_lower(uint c)
```
```c3
fn bool uint.is_odigit(uint c)
```
```c3
fn bool uint.is_print(uint c)
```
```c3
fn bool uint.is_punct(uint c)
```
```c3
fn bool uint.is_space(uint c)
```
```c3
fn bool uint.is_upper(uint c)
```
```c3
fn bool uint.is_xdigit(uint c)
```
```c3
fn uint uint.to_lower(uint c)
```
```c3
fn uint uint.to_upper(uint c)
```
### std::atomic
```c3
macro @__atomic_compare_exchange_ordering_failure(ptr, expected, desired, $success, failure, $alignment)
```
```c3
macro @__atomic_compare_exchange_ordering_success(ptr, expected, desired, success, failure, $alignment)
```
```c3
fn CInt __atomic_compare_exchange(CInt size, any ptr, any expected, any desired, CInt success, CInt failure) @extern("__atomic_compare_exchange") @export
```
```c3
macro fetch_add(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_and(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_div(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_max(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_min(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_mul(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_or(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_shift_left(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_shift_right(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_sub(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_xor(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro flag_clear(ptr, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro flag_set(ptr, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
### std::atomic::types(&lt;Type&gt;)
```c3
struct Atomic
```
```c3
macro Type Atomic.add(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.and(&self, uint value, AtomicOrdering ordering = SEQ_CONSISTENT) @if(!types::is_float(Type))
```
```c3
macro Type Atomic.div(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.load(&self, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.max(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.min(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.mul(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.or(&self, uint value, AtomicOrdering ordering = SEQ_CONSISTENT) @if(!types::is_float(Type))
```
```c3
macro Type Atomic.shift_left(&self, uint amount, AtomicOrdering ordering = SEQ_CONSISTENT) @if(!types::is_float(Type))
```
```c3
macro Type Atomic.shift_right(&self, uint amount, AtomicOrdering ordering = SEQ_CONSISTENT) @if(!types::is_float(Type))
```
```c3
macro void Atomic.store(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.sub(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
fn Type Atomic.xor(&self, uint value, AtomicOrdering ordering = SEQ_CONSISTENT) @if(!types::is_float(Type))
```
### std::bits
```c3
macro bswap(i) @builtin
```
```c3
macro char.clz(self)
```
```c3
macro char.ctz(self)
```
```c3
macro char char.fshl(hi, char lo, char shift)
```
```c3
macro char char.fshr(hi, char lo, char shift)
```
```c3
macro char.popcount(self)
```
```c3
macro char char.rotl(self, char shift)
```
```c3
macro char char.rotr(self, char shift)
```
```c3
macro char[<*>].clz(self)
```
```c3
macro char[<*>].ctz(self)
```
```c3
macro char[<*>] char[<*>].fshl(hi, char[<*>] lo, char[<*>] shift)
```
```c3
macro char[<*>] char[<*>].fshr(hi, char[<*>] lo, char[<*>] shift)
```
```c3
macro char[<*>].popcount(self)
```
```c3
macro char[<*>] char[<*>].rotl(self, char[<*>] shift)
```
```c3
macro char[<*>] char[<*>].rotr(self, char[<*>] shift)
```
```c3
macro ichar.clz(self)
```
```c3
macro ichar.ctz(self)
```
```c3
macro ichar ichar.fshl(hi, ichar lo, ichar shift)
```
```c3
macro ichar ichar.fshr(hi, ichar lo, ichar shift)
```
```c3
macro ichar.popcount(self)
```
```c3
macro ichar ichar.rotl(self, ichar shift)
```
```c3
macro ichar ichar.rotr(self, ichar shift)
```
```c3
macro ichar[<*>].clz(self)
```
```c3
macro ichar[<*>].ctz(self)
```
```c3
macro ichar[<*>] ichar[<*>].fshl(hi, ichar[<*>] lo, ichar[<*>] shift)
```
```c3
macro ichar[<*>] ichar[<*>].fshr(hi, ichar[<*>] lo, ichar[<*>] shift)
```
```c3
macro ichar[<*>].popcount(self)
```
```c3
macro ichar[<*>] ichar[<*>].rotl(self, ichar[<*>] shift)
```
```c3
macro ichar[<*>] ichar[<*>].rotr(self, ichar[<*>] shift)
```
```c3
macro int.clz(self)
```
```c3
macro int.ctz(self)
```
```c3
macro int int.fshl(hi, int lo, int shift)
```
```c3
macro int int.fshr(hi, int lo, int shift)
```
```c3
macro int.popcount(self)
```
```c3
macro int int.rotl(self, int shift)
```
```c3
macro int int.rotr(self, int shift)
```
```c3
macro int128.clz(self)
```
```c3
macro int128.ctz(self)
```
```c3
macro int128 int128.fshl(hi, int128 lo, int128 shift)
```
```c3
macro int128 int128.fshr(hi, int128 lo, int128 shift)
```
```c3
macro int128.popcount(self)
```
```c3
macro int128 int128.rotl(self, int128 shift)
```
```c3
macro int128 int128.rotr(self, int128 shift)
```
```c3
macro int128[<*>].clz(self)
```
```c3
macro int128[<*>].ctz(self)
```
```c3
macro int128[<*>] int128[<*>].fshl(hi, int128[<*>] lo, int128[<*>] shift)
```
```c3
macro int128[<*>] int128[<*>].fshr(hi, int128[<*>] lo, int128[<*>] shift)
```
```c3
macro int128[<*>].popcount(self)
```
```c3
macro int128[<*>] int128[<*>].rotl(self, int128[<*>] shift)
```
```c3
macro int128[<*>] int128[<*>].rotr(self, int128[<*>] shift)
```
```c3
macro int[<*>].clz(self)
```
```c3
macro int[<*>].ctz(self)
```
```c3
macro int[<*>] int[<*>].fshl(hi, int[<*>] lo, int[<*>] shift)
```
```c3
macro int[<*>] int[<*>].fshr(hi, int[<*>] lo, int[<*>] shift)
```
```c3
macro int[<*>].popcount(self)
```
```c3
macro int[<*>] int[<*>].rotl(self, int[<*>] shift)
```
```c3
macro int[<*>] int[<*>].rotr(self, int[<*>] shift)
```
```c3
macro long.clz(self)
```
```c3
macro long.ctz(self)
```
```c3
macro long long.fshl(hi, long lo, long shift)
```
```c3
macro long long.fshr(hi, long lo, long shift)
```
```c3
macro long.popcount(self)
```
```c3
macro long long.rotl(self, long shift)
```
```c3
macro long long.rotr(self, long shift)
```
```c3
macro long[<*>].clz(self)
```
```c3
macro long[<*>].ctz(self)
```
```c3
macro long[<*>] long[<*>].fshl(hi, long[<*>] lo, long[<*>] shift)
```
```c3
macro long[<*>] long[<*>].fshr(hi, long[<*>] lo, long[<*>] shift)
```
```c3
macro long[<*>].popcount(self)
```
```c3
macro long[<*>] long[<*>].rotl(self, long[<*>] shift)
```
```c3
macro long[<*>] long[<*>].rotr(self, long[<*>] shift)
```
```c3
macro reverse(i)
```
```c3
macro short.clz(self)
```
```c3
macro short.ctz(self)
```
```c3
macro short short.fshl(hi, short lo, short shift)
```
```c3
macro short short.fshr(hi, short lo, short shift)
```
```c3
macro short.popcount(self)
```
```c3
macro short short.rotl(self, short shift)
```
```c3
macro short short.rotr(self, short shift)
```
```c3
macro short[<*>].clz(self)
```
```c3
macro short[<*>].ctz(self)
```
```c3
macro short[<*>] short[<*>].fshl(hi, short[<*>] lo, short[<*>] shift)
```
```c3
macro short[<*>] short[<*>].fshr(hi, short[<*>] lo, short[<*>] shift)
```
```c3
macro short[<*>].popcount(self)
```
```c3
macro short[<*>] short[<*>].rotl(self, short[<*>] shift)
```
```c3
macro short[<*>] short[<*>].rotr(self, short[<*>] shift)
```
```c3
macro uint.clz(self)
```
```c3
macro uint.ctz(self)
```
```c3
macro uint uint.fshl(hi, uint lo, uint shift)
```
```c3
macro uint uint.fshr(hi, uint lo, uint shift)
```
```c3
macro uint.popcount(self)
```
```c3
macro uint uint.rotl(self, uint shift)
```
```c3
macro uint uint.rotr(self, uint shift)
```
```c3
macro uint128.clz(self)
```
```c3
macro uint128.ctz(self)
```
```c3
macro uint128 uint128.fshl(hi, uint128 lo, uint128 shift)
```
```c3
macro uint128 uint128.fshr(hi, uint128 lo, uint128 shift)
```
```c3
macro uint128.popcount(self)
```
```c3
macro uint128 uint128.rotl(self, uint128 shift)
```
```c3
macro uint128 uint128.rotr(self, uint128 shift)
```
```c3
macro uint128[<*>].clz(self)
```
```c3
macro uint128[<*>].ctz(self)
```
```c3
macro uint128[<*>] uint128[<*>].fshl(hi, uint128[<*>] lo, uint128[<*>] shift)
```
```c3
macro uint128[<*>] uint128[<*>].fshr(hi, uint128[<*>] lo, uint128[<*>] shift)
```
```c3
macro uint128[<*>].popcount(self)
```
```c3
macro uint128[<*>] uint128[<*>].rotl(self, uint128[<*>] shift)
```
```c3
macro uint128[<*>] uint128[<*>].rotr(self, uint128[<*>] shift)
```
```c3
macro uint[<*>].clz(self)
```
```c3
macro uint[<*>].ctz(self)
```
```c3
macro uint[<*>] uint[<*>].fshl(hi, uint[<*>] lo, uint[<*>] shift)
```
```c3
macro uint[<*>] uint[<*>].fshr(hi, uint[<*>] lo, uint[<*>] shift)
```
```c3
macro uint[<*>].popcount(self)
```
```c3
macro uint[<*>] uint[<*>].rotl(self, uint[<*>] shift)
```
```c3
macro uint[<*>] uint[<*>].rotr(self, uint[<*>] shift)
```
```c3
macro ulong.clz(self)
```
```c3
macro ulong.ctz(self)
```
```c3
macro ulong ulong.fshl(hi, ulong lo, ulong shift)
```
```c3
macro ulong ulong.fshr(hi, ulong lo, ulong shift)
```
```c3
macro ulong.popcount(self)
```
```c3
macro ulong ulong.rotl(self, ulong shift)
```
```c3
macro ulong ulong.rotr(self, ulong shift)
```
```c3
macro ulong[<*>].clz(self)
```
```c3
macro ulong[<*>].ctz(self)
```
```c3
macro ulong[<*>] ulong[<*>].fshl(hi, ulong[<*>] lo, ulong[<*>] shift)
```
```c3
macro ulong[<*>] ulong[<*>].fshr(hi, ulong[<*>] lo, ulong[<*>] shift)
```
```c3
macro ulong[<*>].popcount(self)
```
```c3
macro ulong[<*>] ulong[<*>].rotl(self, ulong[<*>] shift)
```
```c3
macro ulong[<*>] ulong[<*>].rotr(self, ulong[<*>] shift)
```
```c3
macro ushort.clz(self)
```
```c3
macro ushort.ctz(self)
```
```c3
macro ushort ushort.fshl(hi, ushort lo, ushort shift)
```
```c3
macro ushort ushort.fshr(hi, ushort lo, ushort shift)
```
```c3
macro ushort.popcount(self)
```
```c3
macro ushort ushort.rotl(self, ushort shift)
```
```c3
macro ushort ushort.rotr(self, ushort shift)
```
```c3
macro ushort[<*>].clz(self)
```
```c3
macro ushort[<*>].ctz(self)
```
```c3
macro ushort[<*>] ushort[<*>].fshl(hi, ushort[<*>] lo, ushort[<*>] shift)
```
```c3
macro ushort[<*>] ushort[<*>].fshr(hi, ushort[<*>] lo, ushort[<*>] shift)
```
```c3
macro ushort[<*>].popcount(self)
```
```c3
macro ushort[<*>] ushort[<*>].rotl(self, ushort[<*>] shift)
```
```c3
macro ushort[<*>] ushort[<*>].rotr(self, ushort[<*>] shift)
```
### std::collections::anylist
```c3
struct AnyList (Printable)
```
```c3
macro any AnyList.@item_at(&self, usz index) @operator([])
```
```c3
fn void AnyList.add_all(&self, AnyList* other_list)
```
```c3
fn any[] AnyList.array_view(&self)
```
```c3
fn void AnyList.clear(&self)
```
```c3
macro AnyList.first(&self, $Type)
```
```c3
fn any! AnyList.first_any(&self) @inline
```
```c3
fn void AnyList.free(&self)
```
```c3
fn void AnyList.free_element(&self, any element) @inline
```
```c3
macro AnyList.get(&self, usz index, $Type)
```
```c3
fn any AnyList.get_any(&self, usz index) @inline
```
```c3
fn bool AnyList.is_empty(&self) @inline
```
```c3
macro AnyList.last(&self, $Type)
```
```c3
fn any! AnyList.last_any(&self) @inline
```
```c3
fn usz AnyList.len(&self) @operator(len) @inline
```
```c3
fn AnyList* AnyList.new_init(&self, usz initial_capacity = 16, Allocator allocator = allocator::heap())
```
```c3
fn any! AnyList.new_pop(&self, Allocator allocator = allocator::heap())
```
```c3
fn any! AnyList.new_pop_first(&self, Allocator allocator = allocator::heap())
```
```c3
macro AnyList.pop(&self, $Type)
```
```c3
macro AnyList.pop_first(&self, $Type)
```
```c3
fn any! AnyList.pop_first_retained(&self)
```
```c3
fn any! AnyList.pop_retained(&self)
```
```c3
macro void AnyList.push(&self, element)
```
```c3
macro void AnyList.push_front(&self, type)
```
```c3
fn void AnyList.remove_at(&self, usz index)
```
```c3
fn void AnyList.remove_first(&self)
```
```c3
fn usz AnyList.remove_if(&self, AnyPredicate filter)
```
```c3
fn void AnyList.remove_last(&self)
```
```c3
fn usz AnyList.remove_using_test(&self, AnyTest filter, any context)
```
```c3
fn void AnyList.reserve(&self, usz min_capacity)
```
```c3
fn usz AnyList.retain_if(&self, AnyPredicate selection)
```
```c3
fn usz AnyList.retain_using_test(&self, AnyTest filter, any context)
```
```c3
fn void AnyList.reverse(&self)
```
```c3
macro void AnyList.set(&self, usz index, value)
```
```c3
fn void AnyList.swap(&self, usz i, usz j)
```
```c3
fn AnyList* AnyList.temp_init(&self, usz initial_capacity = 16)
```
```c3
fn any! AnyList.temp_pop(&self)
```
```c3
fn any! AnyList.temp_pop_first(&self)
```
```c3
fn usz! AnyList.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String AnyList.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn String AnyList.to_tstring(&self)
```
### std::collections::bitset(&lt;SIZE&gt;)
```c3
struct BitSet
```
```c3
fn usz BitSet.cardinality(&self)
```
```c3
fn bool BitSet.get(&self, usz i) @operator([]) @inline
```
```c3
fn usz BitSet.len(&self) @operator(len) @inline
```
```c3
fn void BitSet.set(&self, usz i)
```
```c3
fn void BitSet.set_bool(&self, usz i, bool value) @operator([]=) @inline
```
```c3
fn void BitSet.unset(&self, usz i)
```
### std::collections::enummap(&lt;Enum, ValueType&gt;)
```c3
struct EnumMap (Printable)
```
```c3
fn ValueType EnumMap.get(&self, Enum key) @operator([]) @inline
```
```c3
fn ValueType* EnumMap.get_ref(&self, Enum key) @operator(&[]) @inline
```
```c3
fn void EnumMap.init(&self, ValueType init_value)
```
```c3
fn usz EnumMap.len(&self) @operator(len) @inline
```
```c3
fn void EnumMap.set(&self, Enum key, ValueType value) @operator([]=) @inline
```
```c3
fn usz! EnumMap.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String EnumMap.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn String EnumMap.to_tstring(&self) @dynamic
```
### std::collections::enumset(&lt;Enum&gt;)
```c3
distinct EnumSet (Printable) = EnumSetType;
```
```c3
fn void EnumSet.add(&self, Enum v)
```
```c3
fn void EnumSet.add_all(&self, EnumSet s)
```
```c3
fn EnumSet EnumSet.and_of(&self, EnumSet s)
```
```c3
fn void EnumSet.clear(&self)
```
```c3
fn EnumSet EnumSet.diff_of(&self, EnumSet s)
```
```c3
fn bool EnumSet.has(&self, Enum v)
```
```c3
fn EnumSet EnumSet.or_of(&self, EnumSet s)
```
```c3
fn bool EnumSet.remove(&self, Enum v)
```
```c3
fn void EnumSet.remove_all(&self, EnumSet s)
```
```c3
fn void EnumSet.retain_all(&self, EnumSet s)
```
```c3
fn usz! EnumSet.to_format(&set, Formatter* formatter) @dynamic
```
```c3
fn String EnumSet.to_new_string(&set, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn String EnumSet.to_tstring(&set) @dynamic
```
```c3
fn EnumSet EnumSet.xor_of(&self, EnumSet s)
```
### std::collections::enumset::private
```c3
macro typeid type_for_enum_elements(usz $elements)
```
### std::collections::growablebitset(&lt;Type&gt;)
```c3
struct GrowableBitSet
```
```c3
fn usz GrowableBitSet.cardinality(&self)
```
```c3
fn void GrowableBitSet.free(&self)
```
```c3
fn bool GrowableBitSet.get(&self, usz i) @operator([]) @inline
```
```c3
fn usz GrowableBitSet.len(&self) @operator(len)
```
```c3
fn GrowableBitSet* GrowableBitSet.new_init(&self, usz initial_capacity = 1, Allocator allocator = allocator::heap())
```
```c3
fn void GrowableBitSet.set(&self, usz i)
```
```c3
fn void GrowableBitSet.set_bool(&self, usz i, bool value) @operator([]=) @inline
```
```c3
fn GrowableBitSet* GrowableBitSet.temp_init(&self, usz initial_capacity = 1)
```
```c3
fn void GrowableBitSet.unset(&self, usz i)
```
### std::collections::linkedlist(&lt;Type&gt;)
```c3
struct LinkedList
```
```c3
fn void LinkedList.clear(&self)
```
```c3
fn Type! LinkedList.first(&self)
```
```c3
fn void LinkedList.free(&self)
```
```c3
fn Type LinkedList.get(&self, usz index)
```
```c3
fn void LinkedList.insert_at(&self, usz index, Type element)
```
```c3
fn Type! LinkedList.last(&self)
```
```c3
fn usz LinkedList.len(&self) @inline
```
```c3
fn LinkedList* LinkedList.new_init(&self, Allocator allocator = allocator::heap())
```
```c3
macro Node* LinkedList.node_at_index(&self, usz index)
```
```c3
fn Type! LinkedList.peek(&self)
```
```c3
fn Type! LinkedList.peek_last(&self)
```
```c3
fn Type! LinkedList.pop(&self)
```
```c3
fn Type! LinkedList.pop_front(&self)
```
```c3
fn void LinkedList.push(&self, Type value)
```
```c3
fn void LinkedList.push_front(&self, Type value)
```
```c3
fn usz LinkedList.remove(&self, Type t) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void LinkedList.remove_at(&self, usz index)
```
```c3
fn void! LinkedList.remove_first(&self) @maydiscard
```
```c3
fn bool LinkedList.remove_first_match(&self, Type t) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void! LinkedList.remove_last(&self) @maydiscard
```
```c3
fn bool LinkedList.remove_last_match(&self, Type t)  @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void LinkedList.set(&self, usz index, Type element)
```
```c3
fn LinkedList* LinkedList.temp_init(&self)
```
### std::collections::list(&lt;Type&gt;)
```c3
struct List (Printable)
```
```c3
macro Type List.@item_at(&self, usz index) @operator([])
```
```c3
fn void List.add_all(&self, List* other_list)
```
```c3
fn void List.add_array(&self, Type[] array)
```
```c3
fn Type[] List.array_view(&self)
```
```c3
fn usz List.byte_size(&self) @inline
```
```c3
fn void List.clear(&self)
```
```c3
fn usz List.compact(&self) @if(ELEMENT_IS_POINTER)
```
```c3
fn usz List.compact_count(&self) @if(ELEMENT_IS_POINTER)
```
```c3
fn bool List.contains(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool List.equals(&self, List other_list) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn Type! List.first(&self)
```
```c3
fn void List.free(&self)
```
```c3
fn Type List.get(&self, usz index) @inline
```
```c3
fn Type* List.get_ref(&self, usz index) @operator(&[]) @inline
```
```c3
fn usz! List.index_of(&self, Type type) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void List.init_wrapping_array(&self, Type[] types, Allocator allocator = allocator::heap())
```
```c3
fn void List.insert_at(&self, usz index, Type type)
```
```c3
fn bool List.is_empty(&self) @inline
```
```c3
fn Type! List.last(&self)
```
```c3
fn usz List.len(&self) @operator(len) @inline
```
```c3
fn List* List.new_init(&self, usz initial_capacity = 16, Allocator allocator = allocator::heap())
```
```c3
fn Type! List.pop(&self)
```
```c3
fn Type! List.pop_first(&self)
```
```c3
fn void List.push(&self, Type element) @inline
```
```c3
fn void List.push_front(&self, Type type) @inline
```
```c3
fn void List.remove_all_from(&self, List* other_list) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz List.remove_all_matches(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void List.remove_at(&self, usz index)
```
```c3
fn void! List.remove_first(&self) @maydiscard
```
```c3
fn bool List.remove_first_match(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz List.remove_if(&self, ElementPredicate filter)
```
```c3
fn void! List.remove_last(&self) @maydiscard
```
```c3
fn bool List.remove_last_match(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz List.remove_using_test(&self, ElementTest filter, any context)
```
```c3
fn void List.reserve(&self, usz min_capacity)
```
```c3
fn usz List.retain_if(&self, ElementPredicate selection)
```
```c3
fn usz List.retain_using_test(&self, ElementTest filter, any context)
```
```c3
fn void List.reverse(&self)
```
```c3
fn usz! List.rindex_of(&self, Type type) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void List.set(&self, usz index, Type value) @operator([]=)
```
```c3
fn void List.set_at(&self, usz index, Type type)
```
```c3
fn void List.swap(&self, usz i, usz j)
```
```c3
fn List* List.temp_init(&self, usz initial_capacity = 16)
```
```c3
fn usz! List.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn Type[] List.to_new_array(&self, Allocator allocator = allocator::heap())
```
```c3
fn String List.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn Type[] List.to_tarray(&self)
```
```c3
fn String List.to_tstring(&self)
```
### std::collections::map(&lt;Key, Value&gt;)
```c3
struct Entry
```
```c3
struct HashMap
```
```c3
macro HashMap.@each(map; @body(key, value))
```
```c3
macro HashMap.@each_entry(map; @body(entry))
```
```c3
macro Value HashMap.@get_or_set(&map, Key key, Value #expr)
```
```c3
fn void HashMap.clear(&map)
```
```c3
fn void HashMap.free(&map)
```
```c3
fn Value! HashMap.get(&map, Key key) @operator([])
```
```c3
fn Entry*! HashMap.get_entry(&map, Key key)
```
```c3
fn Value*! HashMap.get_ref(&map, Key key)
```
```c3
fn bool HashMap.has_key(&map, Key key)
```
```c3
fn bool HashMap.has_value(&map, Value v) @if(VALUE_IS_EQUATABLE)
```
```c3
fn bool HashMap.is_empty(&map) @inline
```
```c3
fn bool HashMap.is_initialized(&map)
```
```c3
fn Key[] HashMap.key_new_list(&map, Allocator allocator = allocator::heap())
```
```c3
fn Key[] HashMap.key_tlist(&map)
```
```c3
fn usz HashMap.len(&map) @inline
```
```c3
fn HashMap* HashMap.new_init(&self, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR, Allocator allocator = allocator::heap())
```
```c3
fn HashMap* HashMap.new_init_from_map(&self, HashMap* other_map, Allocator allocator = allocator::heap())
```
```c3
fn void! HashMap.remove(&map, Key key) @maydiscard
```
```c3
fn bool HashMap.set(&map, Key key, Value value) @operator([]=)
```
```c3
fn HashMap* HashMap.temp_init(&self, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashMap* HashMap.temp_init_from_map(&map, HashMap* other_map)
```
```c3
fn Value[] HashMap.value_new_list(&map, Allocator allocator = allocator::heap())
```
```c3
fn Value[] HashMap.value_tlist(&map)
```
### std::collections::maybe(&lt;Type&gt;)
```c3
struct Maybe
```
```c3
macro Type! Maybe.get(self)
```
```c3
fn Maybe value(Type val)
```
### std::collections::object
```c3
struct Object (Printable)
```
```c3
fn void Object.free(&self)
```
```c3
fn Object*! Object.get(&self, String key)
```
```c3
fn Object* Object.get_at(&self, usz index)
```
```c3
fn bool! Object.get_bool(&self, String key)
```
```c3
fn bool! Object.get_bool_at(&self, usz index)
```
```c3
fn char! Object.get_char(&self, String key)
```
```c3
fn char! Object.get_char_at(&self, usz index)
```
```c3
macro String! Object.get_enum(&self, $EnumType, String key)
```
```c3
macro String! Object.get_enum_at(&self, $EnumType, usz index)
```
```c3
fn double! Object.get_float(&self, String key)
```
```c3
fn double! Object.get_float_at(&self, usz index)
```
```c3
fn ichar! Object.get_ichar(&self, String key)
```
```c3
fn ichar! Object.get_ichar_at(&self, usz index)
```
```c3
fn int! Object.get_int(&self, String key)
```
```c3
fn int128! Object.get_int128(&self, String key)
```
```c3
fn int128! Object.get_int128_at(&self, usz index)
```
```c3
fn int! Object.get_int_at(&self, usz index)
```
```c3
fn usz Object.get_len(&self)
```
```c3
fn long! Object.get_long(&self, String key)
```
```c3
fn long! Object.get_long_at(&self, usz index)
```
```c3
fn Object* Object.get_or_create_obj(&self, String key)
```
```c3
fn short! Object.get_short(&self, String key)
```
```c3
fn short! Object.get_short_at(&self, usz index)
```
```c3
fn String! Object.get_string(&self, String key)
```
```c3
fn String! Object.get_string_at(&self, usz index)
```
```c3
fn uint! Object.get_uint(&self, String key)
```
```c3
fn uint128! Object.get_uint128(&self, String key)
```
```c3
fn uint128! Object.get_uint128_at(&self, usz index)
```
```c3
fn uint! Object.get_uint_at(&self, usz index)
```
```c3
fn ulong! Object.get_ulong(&self, String key)
```
```c3
fn ulong! Object.get_ulong_at(&self, usz index)
```
```c3
fn short! Object.get_ushort(&self, String key)
```
```c3
fn ushort! Object.get_ushort_at(&self, usz index)
```
```c3
fn bool Object.has_key(&self, String key)
```
```c3
fn bool Object.is_array(&self) @inline
```
```c3
fn bool Object.is_bool(&self) @inline
```
```c3
fn bool Object.is_empty(&self) @inline
```
```c3
fn bool Object.is_float(&self) @inline
```
```c3
fn bool Object.is_indexable(&self)
```
```c3
fn bool Object.is_int(&self) @inline
```
```c3
fn bool Object.is_keyable(&self)
```
```c3
fn bool Object.is_map(&self) @inline
```
```c3
fn bool Object.is_null(&self) @inline
```
```c3
fn bool Object.is_string(&self) @inline
```
```c3
macro Object* Object.push(&self, value)
```
```c3
fn void Object.push_object(&self, Object* to_append)
```
```c3
macro Object* Object.set(&self, String key, value)
```
```c3
macro Object* Object.set_at(&self, usz index, String key, value)
```
```c3
fn void Object.set_object_at(&self, usz index, Object* to_set)
```
```c3
fn usz! Object.to_format(&self, Formatter* formatter) @dynamic
```
```c3
macro get_integer_value(Object* value, $Type)
```
```c3
fn Object* new_bool(bool b)
```
```c3
macro Object* new_enum(e, Allocator allocator)
```
```c3
fn Object* new_float(double f, Allocator allocator)
```
```c3
fn Object* new_int(int128 i, Allocator allocator)
```
```c3
fn Object* new_null()
```
```c3
fn Object* new_obj(Allocator allocator)
```
```c3
fn Object* new_string(String s, Allocator allocator)
```
### std::collections::priorityqueue(&lt;Type&gt;)
```c3
distinct PriorityQueue = inline PrivatePriorityQueue(<Type, false>);
```
```c3
distinct PriorityQueueMax = inline PrivatePriorityQueue(<Type, true>);
```
### std::collections::priorityqueue::private(&lt;Type, MAX&gt;)
```c3
struct PrivatePriorityQueue (Printable)
```
```c3
fn Type! PrivatePriorityQueue.first(&self)
```
```c3
fn void PrivatePriorityQueue.free(&self)
```
```c3
fn Type PrivatePriorityQueue.get(&self, usz index) @operator([])
```
```c3
fn bool PrivatePriorityQueue.is_empty(&self)
```
```c3
fn usz PrivatePriorityQueue.len(&self) @operator(len)
```
```c3
fn void PrivatePriorityQueue.new_init(&self, usz initial_capacity = 16, Allocator allocator = allocator::heap()) @inline
```
```c3
fn Type! PrivatePriorityQueue.pop(&self)
```
```c3
fn void PrivatePriorityQueue.push(&self, Type element)
```
```c3
fn void PrivatePriorityQueue.temp_init(&self, usz initial_capacity = 16) @inline
```
```c3
fn usz! PrivatePriorityQueue.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String PrivatePriorityQueue.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
### std::collections::range(&lt;Type&gt;)
```c3
struct ExclusiveRange (Printable)
```
```c3
struct Range (Printable)
```
```c3
fn bool ExclusiveRange.contains(&self, Type value) @inline
```
```c3
fn Type ExclusiveRange.get(&self, usz index) @operator([])
```
```c3
fn usz ExclusiveRange.len(&self) @operator(len)
```
```c3
fn usz! ExclusiveRange.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String ExclusiveRange.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn String ExclusiveRange.to_tstring(&self)
```
```c3
fn bool Range.contains(&self, Type value) @inline
```
```c3
fn Type Range.get(&self, usz index) @operator([])
```
```c3
fn usz Range.len(&self) @operator(len)
```
```c3
fn usz! Range.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String Range.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn String Range.to_tstring(&self)
```
### std::collections::ringbuffer(&lt;Type, SIZE&gt;)
```c3
struct RingBuffer
```
```c3
fn Type RingBuffer.get(&self, usz index) @operator([])
```
```c3
fn void RingBuffer.init(&self) @inline
```
```c3
fn Type! RingBuffer.pop(&self)
```
```c3
fn void RingBuffer.push(&self, Type c)
```
```c3
fn usz RingBuffer.read(&self, usz index, Type[] buffer)
```
```c3
fn void RingBuffer.write(&self, Type[] buffer)
```
### std::collections::triple(&lt;Type1, Type2, Type3&gt;)
```c3
struct Triple
```
### std::collections::tuple(&lt;Type1, Type2&gt;)
```c3
struct Tuple
```
### std::core::array
```c3
macro concat_new(arr1, arr2, Allocator allocator = allocator::heap())
```
```c3
macro index_of(array, element)
```
```c3
macro rindex_of(array, element)
```
```c3
macro slice2d(array, x = 0, xlen = 0, y = 0, ylen = 0)
```
```c3
macro tconcat(arr1, arr2)
```
### std::core::array::slice(&lt;Type&gt;)
```c3
struct Slice2d
```
```c3
macro void Slice2d.@each(&self; @body(usz[<2>], Type))
```
```c3
macro void Slice2d.@each_ref(&self; @body(usz[<2>], Type*))
```
```c3
fn usz Slice2d.count(&self)
```
```c3
macro Type[] Slice2d.get(self, usz idy) @operator([])
```
```c3
fn usz Slice2d.len(&self) @operator(len)
```
```c3
fn Slice2d Slice2d.slice(&self, isz x = 0, isz xlen = 0, isz y = 0, isz ylen = 0)
```
### std::core::bitorder
```c3
macro bool is_array_or_slice_of_char(bytes)
```
```c3
macro bool is_arrayptr_or_slice_of_char(bytes)
```
```c3
macro is_bitorder($Type)
```
```c3
macro read(bytes, $Type)
```
```c3
macro write(x, bytes, $Type)
```
### std::core::builtin
```c3
enum PrefetchLocality
```
```c3
fault CastResult
```
```c3
fault IteratorResult
```
```c3
fault SearchResult
```
```c3
macro char[] @as_char_view(&value) @builtin
```
```c3
macro anyfault @catch(#expr) @builtin
```
```c3
macro @expect(#value, expected, $probability = 1.0) @builtin
```
```c3
macro bool @likely(bool #value, $probability = 1.0) @builtin
```
```c3
macro bool @ok(#expr) @builtin
```
```c3
macro @prefetch(void* ptr, PrefetchLocality $locality = VERY_NEAR, bool $write = false) @builtin
```
```c3
macro void @scope(&variable; @body) @builtin
```
```c3
macro void @swap(&a, &b) @builtin
```
```c3
macro bool @unlikely(bool #value, $probability = 1.0) @builtin
```
```c3
macro uint String.hash(String c)
```
```c3
macro any.as_inner(&self)
```
```c3
macro any.retype_to(&self, typeid type)
```
```c3
macro any_make(void* ptr, typeid type) @builtin
```
```c3
macro anycast(any v, $Type) @builtin
```
```c3
macro bitcast(expr, $Type) @builtin
```
```c3
macro uint bool.hash(bool b)
```
```c3
macro uint char.hash(char c)
```
```c3
macro uint char[].hash(char[] c)
```
```c3
macro int compare_to(a, b) @builtin
```
```c3
fn void default_panic(String message, String file, String function, uint line) @if(!env::NATIVE_STACKTRACE)
```
```c3
fn void default_panic(String message, String file, String function, uint line) @if(env::NATIVE_STACKTRACE)
```
```c3
macro enum_by_name($Type, String enum_name) @builtin
```
```c3
macro bool equals(a, b) @builtin
```
```c3
macro void* get_frameaddress(int n)
```
```c3
macro void* get_returnaddress(int n)
```
```c3
macro greater(a, b) @builtin
```
```c3
macro greater_eq(a, b) @builtin
```
```c3
macro uint ichar.hash(ichar c)
```
```c3
macro uint int.hash(int i)
```
```c3
macro uint int128.hash(int128 i)
```
```c3
macro less(a, b) @builtin
```
```c3
macro less_eq(a, b) @builtin
```
```c3
macro uint long.hash(long i)
```
```c3
macro max(x, ...) @builtin
```
```c3
macro min(x, ...) @builtin
```
```c3
fn void panicf(String fmt, String file, String function, uint line, args...)
```
```c3
fn bool print_backtrace(String message, int backtraces_to_ignore) @if(env::NATIVE_STACKTRACE)
```
```c3
macro uint short.hash(short s)
```
```c3
macro swizzle(v, ...) @builtin
```
```c3
macro swizzle2(v, v2, ...) @builtin
```
```c3
macro uint typeid.hash(typeid t)
```
```c3
macro uint uint.hash(uint i)
```
```c3
macro uint uint128.hash(uint128 i)
```
```c3
macro uint ulong.hash(ulong i)
```
```c3
macro void unreachable(String string = "Unreachable statement reached.", ...) @builtin @noreturn
```
```c3
macro void unsupported(String string = "Unsupported function invoked") @builtin @noreturn
```
```c3
macro uint ushort.hash(ushort s)
```
```c3
macro uint void*.hash(void* ptr)
```
### std::core::builtin @if((env::LINUX || env::DARWIN) &amp;&amp; env::COMPILER_SAFE_MODE &amp;&amp; env::DEBUG_SYMBOLS)
```c3
fn void sig_bus_error(CInt i)
```
```c3
fn void sig_panic(String message)
```
```c3
fn void sig_segmentation_fault(CInt i)
```
### std::core::dstring
```c3
distinct DString (OutStream) = void*;
```
```c3
macro void DString.append(&self, value)
```
```c3
fn void DString.append_char(&self, char c)
```
```c3
fn void DString.append_char32(&self, Char32 c)
```
```c3
fn void DString.append_chars(&self, String str)
```
```c3
fn void DString.append_repeat(&self, char c, usz times)
```
```c3
fn void DString.append_string(&self, DString str)
```
```c3
fn void DString.append_utf32(&self, Char32[] chars)
```
```c3
fn usz! DString.appendf(&self, String format, args...) @maydiscard
```
```c3
fn usz! DString.appendfn(&self, String format, args...) @maydiscard
```
```c3
fn usz DString.capacity(self)
```
```c3
fn void DString.chop(self, usz new_size)
```
```c3
fn void DString.clear(self)
```
```c3
fn DString DString.copy(self, Allocator allocator = null)
```
```c3
fn String DString.copy_str(self, Allocator allocator = allocator::heap())
```
```c3
fn Char32[] DString.copy_utf32(&self, Allocator allocator = allocator::heap())
```
```c3
fn ZString DString.copy_zstr(self, Allocator allocator = allocator::heap())
```
```c3
fn void DString.delete(&self, usz start, usz len = 1)
```
```c3
fn void DString.delete_range(&self, usz start, usz end)
```
```c3
fn bool DString.equals(self, DString other_string)
```
```c3
fn void DString.free(&self)
```
```c3
fn void DString.insert_at(&self, usz index, String s)
```
```c3
fn usz DString.len(&self) @dynamic
```
```c3
fn bool DString.less(self, DString other_string)
```
```c3
fn DString DString.new_concat(self, DString b, Allocator allocator = allocator::heap())
```
```c3
fn DString DString.new_init(&self, usz capacity = MIN_CAPACITY, Allocator allocator = allocator::heap())
```
```c3
fn usz! DString.read_from_stream(&self, InStream reader)
```
```c3
fn void DString.reserve(&self, usz addition)
```
```c3
fn void DString.set(self, usz index, char c)
```
```c3
fn String DString.str_view(self)
```
```c3
fn DString DString.tcopy(&self)
```
```c3
fn String DString.tcopy_str(self)
```
```c3
fn DString DString.temp_concat(self, DString b)
```
```c3
fn DString DString.temp_init(&self, usz capacity = MIN_CAPACITY)
```
```c3
fn usz! DString.write(&self, char[] buffer) @dynamic
```
```c3
fn void! DString.write_byte(&self, char c) @dynamic
```
```c3
fn ZString DString.zstr_view(&self)
```
```c3
fn DString new(String c = "", Allocator allocator = allocator::heap())
```
```c3
fn DString new_join(String[] s, String joiner, Allocator allocator = allocator::heap())
```
```c3
fn DString new_with_capacity(usz capacity, Allocator allocator = allocator::heap())
```
```c3
fn DString temp_new(String s = "")
```
```c3
fn DString temp_with_capacity(usz capacity)
```
### std::core::env
```c3
enum ArchType
```
```c3
enum CompilerOptLevel
```
```c3
enum MemoryEnvironment
```
```c3
enum OsType
```
```c3
macro bool os_is_darwin()
```
```c3
macro bool os_is_posix()
```
### std::core::mem
```c3
enum AtomicOrdering : int
```
```c3
struct TempState
```
```c3
macro @atomic_load(&x, AtomicOrdering $ordering = SEQ_CONSISTENT, $volatile = false) @builtin
```
```c3
macro void @atomic_store(&x, value, AtomicOrdering $ordering = SEQ_CONSISTENT, $volatile = false) @builtin
```
```c3
macro @clone(value) @builtin @nodiscard
```
```c3
macro @gather_aligned(ptrvec, bool[<*>] mask, passthru, usz $alignment)
```
```c3
macro @masked_load_aligned(ptr, bool[<*>] mask, passthru, usz $alignment)
```
```c3
macro @masked_store_aligned(ptr, value, bool[<*>] mask, usz $alignment)
```
```c3
macro void @pool(TempAllocator* #other_temp = null; @body) @builtin
```
```c3
macro void @report_heap_allocs_in_scope(;@body())
```
```c3
macro @scatter_aligned(ptrvec, value, bool[<*>] mask, usz $alignment)
```
```c3
macro void @scoped(Allocator allocator; @body())
```
```c3
macro void @stack_mem(usz $size; @body(Allocator mem)) @builtin
```
```c3
macro void @stack_pool(usz $size; @body) @builtin
```
```c3
macro @tclone(value) @builtin @nodiscard
```
```c3
macro @volatile_load(&x) @builtin
```
```c3
macro @volatile_store(&x, y) @builtin
```
```c3
fn usz aligned_offset(usz offset, usz alignment)
```
```c3
macro void* aligned_pointer(void* ptr, usz alignment)
```
```c3
macro alloc($Type) @nodiscard
```
```c3
macro alloc_aligned($Type) @nodiscard
```
```c3
macro alloc_array($Type, usz elements) @nodiscard
```
```c3
macro alloc_array_aligned($Type, usz elements) @nodiscard
```
```c3
fn void* calloc(usz size) @builtin @inline @nodiscard
```
```c3
fn void* calloc_aligned(usz size, usz alignment) @builtin @inline @nodiscard
```
```c3
macro void clear(void* dst, usz len, usz $dst_align = 0, bool $is_volatile = false, bool $inlined = false)
```
```c3
macro void clear_inline(void* dst, usz $len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
macro compare_exchange(ptr, compare, value, AtomicOrdering $success = SEQ_CONSISTENT, AtomicOrdering $failure = SEQ_CONSISTENT, bool $volatile = true, bool $weak = false, usz $alignment = 0)
```
```c3
macro compare_exchange_volatile(ptr, compare, value, AtomicOrdering $success = SEQ_CONSISTENT, AtomicOrdering $failure = SEQ_CONSISTENT)
```
```c3
macro void copy(void* dst, void* src, usz len, usz $dst_align = 0, usz $src_align = 0, bool $is_volatile = false, bool $inlined = false)
```
```c3
macro void copy_inline(void* dst, void* src, usz $len, usz $dst_align = 0, usz $src_align = 0, bool $is_volatile = false)
```
```c3
macro bool equals(a, b, isz len = -1, usz $align = 0)
```
```c3
fn void free(void* ptr) @builtin @inline
```
```c3
fn void free_aligned(void* ptr) @builtin @inline
```
```c3
macro gather(ptrvec, bool[<*>] mask, passthru)
```
```c3
macro TrackingEnv* get_tracking_env()
```
```c3
fn void* malloc(usz size) @builtin @inline @nodiscard
```
```c3
macro masked_load(ptr, bool[<*>] mask, passthru)
```
```c3
macro masked_store(ptr, value, bool[<*>] mask)
```
```c3
macro void move(void* dst, void* src, usz len, usz $dst_align = 0, usz $src_align = 0, bool $is_volatile = false)
```
```c3
macro new($Type, ...) @nodiscard
```
```c3
macro new_aligned($Type, ...) @nodiscard
```
```c3
macro new_array($Type, usz elements) @nodiscard
```
```c3
macro new_array_aligned($Type, usz elements) @nodiscard
```
```c3
fn bool ptr_is_aligned(void* ptr, usz alignment) @inline
```
```c3
fn void* realloc(void *ptr, usz new_size) @builtin @inline @nodiscard
```
```c3
fn void* realloc_aligned(void *ptr, usz new_size, usz alignment) @builtin @inline @nodiscard
```
```c3
macro scatter(ptrvec, value, bool[<*>] mask)
```
```c3
macro void set(void* dst, char val, usz len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
macro void set_inline(void* dst, char val, usz $len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
fn void* tcalloc(usz size, usz alignment = 0) @builtin @inline @nodiscard
```
```c3
macro temp_alloc($Type) @nodiscard
```
```c3
macro temp_alloc_array($Type, usz elements) @nodiscard
```
```c3
macro temp_new($Type, ...) @nodiscard
```
```c3
macro temp_new_array($Type, usz elements) @nodiscard
```
```c3
fn void temp_pop(TempState old_state)
```
```c3
fn TempState temp_push(TempAllocator* other = null)
```
```c3
fn void* tmalloc(usz size, usz alignment = 0) @builtin @inline @nodiscard
```
```c3
fn void* trealloc(void* ptr, usz size, usz alignment = mem::DEFAULT_MEM_ALIGNMENT) @builtin @inline @nodiscard
```
```c3
macro type_alloc_must_be_aligned($Type)
```
### std::core::mem::allocator
```c3
distinct LibcAllocator (Allocator) = uptr;
```
```c3
enum AllocInitType
```
```c3
fault AllocationFailure
```
```c3
interface Allocator
```
```c3
struct AlignedBlock
```
```c3
struct Allocation
```
```c3
struct ArenaAllocator (Allocator)
```
```c3
struct DynamicArenaAllocator (Allocator)
```
```c3
struct OnStackAllocator (Allocator)
```
```c3
struct OnStackAllocatorHeader
```
```c3
struct SimpleHeapAllocator (Allocator)
```
```c3
struct TempAllocator (Allocator)
```
```c3
struct TempAllocatorPage
```
```c3
struct TrackingAllocator (Allocator)
```
```c3
struct TrackingEnv
```
```c3
struct WasmMemory
```
```c3
macro void*! @aligned_alloc(#alloc_fn, usz bytes, usz alignment)
```
```c3
macro void! @aligned_free(#free_fn, void* old_pointer)
```
```c3
macro void*! @aligned_realloc(#calloc_fn, #free_fn, void* old_pointer, usz bytes, usz alignment)
```
```c3
fn void*! ArenaAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void ArenaAllocator.clear(&self)
```
```c3
fn void ArenaAllocator.init(&self, char[] data)
```
```c3
fn usz ArenaAllocator.mark(&self) @dynamic
```
```c3
fn void ArenaAllocator.release(&self, void* ptr, bool) @dynamic
```
```c3
fn void ArenaAllocator.reset(&self, usz mark) @dynamic
```
```c3
fn void*! ArenaAllocator.resize(&self, void *old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*! DynamicArenaAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void DynamicArenaAllocator.free(&self)
```
```c3
fn void DynamicArenaAllocator.init(&self, usz page_size, Allocator allocator)
```
```c3
fn void DynamicArenaAllocator.release(&self, void* ptr, bool) @dynamic
```
```c3
fn void DynamicArenaAllocator.reset(&self, usz mark = 0) @dynamic
```
```c3
fn void*! DynamicArenaAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*! OnStackAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void OnStackAllocator.free(&self)
```
```c3
fn void OnStackAllocator.init(&self, char[] data, Allocator allocator)
```
```c3
fn void OnStackAllocator.release(&self, void* old_pointer, bool aligned) @dynamic
```
```c3
fn void*! OnStackAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*! SimpleHeapAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void SimpleHeapAllocator.init(&self, MemoryAllocFn allocator)
```
```c3
fn void SimpleHeapAllocator.release(&self, void* old_pointer, bool aligned) @dynamic
```
```c3
fn void*! SimpleHeapAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*! TempAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn usz TempAllocator.mark(&self) @dynamic
```
```c3
fn void! TempAllocator.print_pages(&self, File* f)
```
```c3
fn void TempAllocator.release(&self, void* old_pointer, bool) @dynamic
```
```c3
fn void TempAllocator.reset(&self, usz mark) @dynamic
```
```c3
fn void*! TempAllocator.resize(&self, void* pointer, usz size, usz alignment) @dynamic
```
```c3
macro bool TempAllocatorPage.is_aligned(&self)
```
```c3
macro usz TempAllocatorPage.pagesize(&self)
```
```c3
fn void*! TrackingAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn usz TrackingAllocator.allocated(&self)
```
```c3
fn usz TrackingAllocator.allocation_count(&self)
```
```c3
fn Allocation[] TrackingAllocator.allocations_tlist(&self, Allocator allocator)
```
```c3
fn void TrackingAllocator.clear(&self)
```
```c3
fn void! TrackingAllocator.fprint_report(&self, OutStream out)
```
```c3
fn void TrackingAllocator.free(&self)
```
```c3
fn void TrackingAllocator.init(&self, Allocator allocator)
```
```c3
fn void TrackingAllocator.print_report(&self)
```
```c3
fn void TrackingAllocator.release(&self, void* old_pointer, bool is_aligned) @dynamic
```
```c3
fn void*! TrackingAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn usz TrackingAllocator.total_allocated(&self)
```
```c3
fn usz TrackingAllocator.total_allocation_count(&self)
```
```c3
fn char[]! WasmMemory.allocate_block(&self, usz bytes)
```
```c3
macro alloc(Allocator allocator, $Type) @nodiscard
```
```c3
macro alloc_array(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro alloc_array_aligned(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro alloc_array_try(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro alloc_try(Allocator allocator, $Type) @nodiscard
```
```c3
macro alloc_with_padding(Allocator allocator, $Type, usz padding) @nodiscard
```
```c3
macro void* calloc(Allocator allocator, usz size) @nodiscard
```
```c3
macro void*! calloc_aligned(Allocator allocator, usz size, usz alignment) @nodiscard
```
```c3
macro void*! calloc_try(Allocator allocator, usz size) @nodiscard
```
```c3
macro clone(Allocator allocator, value) @nodiscard
```
```c3
fn any clone_any(Allocator allocator, any value) @nodiscard
```
```c3
macro void free(Allocator allocator, void* ptr)
```
```c3
macro void free_aligned(Allocator allocator, void* ptr)
```
```c3
macro Allocator heap()
```
```c3
macro void* malloc(Allocator allocator, usz size) @nodiscard
```
```c3
macro void*! malloc_aligned(Allocator allocator, usz size, usz alignment) @nodiscard
```
```c3
macro void*! malloc_try(Allocator allocator, usz size) @nodiscard
```
```c3
macro new(Allocator allocator, $Type, ...) @nodiscard
```
```c3
macro new_array(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro new_array_aligned(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro new_array_try(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
fn TempAllocator*! new_temp_allocator(usz size, Allocator allocator)
```
```c3
macro new_try(Allocator allocator, $Type, ...) @nodiscard
```
```c3
macro new_with_padding(Allocator allocator, $Type, usz padding) @nodiscard
```
```c3
macro void* realloc(Allocator allocator, void* ptr, usz new_size) @nodiscard
```
```c3
macro void*! realloc_aligned(Allocator allocator, void* ptr, usz new_size, usz alignment) @nodiscard
```
```c3
macro void*! realloc_try(Allocator allocator, void* ptr, usz new_size) @nodiscard
```
```c3
macro TempAllocator* temp()
```
### std::core::mem::allocator @if(!env::WIN32 &amp;&amp; !env::POSIX)
```c3
fn void*! LibcAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void LibcAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
```c3
fn void*! LibcAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
### std::core::mem::allocator @if(env::POSIX)
```c3
fn void*! LibcAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void LibcAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
```c3
fn void*! LibcAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
### std::core::mem::allocator @if(env::WIN32)
```c3
fn void*! LibcAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void LibcAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
```c3
fn void*! LibcAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
### std::core::runtime
```c3
struct AnyRaw
```
```c3
struct BenchmarkUnit
```
```c3
struct SliceRaw
```
```c3
struct TestContext
```
```c3
struct TestUnit
```
```c3
fn BenchmarkUnit[] benchmark_collection_create(Allocator allocator = allocator::heap())
```
```c3
fn int cmp_test_unit(TestUnit a, TestUnit b)
```
```c3
fn bool default_benchmark_runner()
```
```c3
fn bool default_test_runner()
```
```c3
fn bool run_benchmarks(BenchmarkUnit[] benchmarks)
```
```c3
fn bool run_tests(TestUnit[] tests)
```
```c3
fn void set_benchmark_max_iterations(uint value) @builtin
```
```c3
fn void set_benchmark_warmup_iterations(uint value) @builtin
```
```c3
fn TestUnit[] test_collection_create(Allocator allocator = allocator::heap())
```
```c3
fn void test_panic(String message, String file, String function, uint line)
```
### std::core::runtime @if(WASM_NOLIBC)
```c3
fn void wasm_initialize() @extern("_initialize") @wasm
```
### std::core::string
```c3
distinct WString = inline Char16*;
```
```c3
distinct ZString = inline char*;
```
```c3
fault NumberConversion
```
```c3
fault UnicodeResult
```
```c3
struct Splitter
```
```c3
fn String! Splitter.next(&self)
```
```c3
fn void Splitter.reset(&self)
```
```c3
fn String String.concat(s1, String s2, Allocator allocator = allocator::heap())
```
```c3
fn bool String.contains(s, String needle)
```
```c3
fn void String.convert_ascii_to_lower(s)
```
```c3
fn void String.convert_ascii_to_upper(s)
```
```c3
fn String String.copy(s, Allocator allocator = allocator::heap())
```
```c3
fn bool String.ends_with(string, String needle)
```
```c3
fn void String.free(&s, Allocator allocator = allocator::heap())
```
```c3
fn usz! String.index_of(s, String needle)
```
```c3
fn usz! String.index_of_char(s, char needle)
```
```c3
fn StringIterator String.iterator(s)
```
```c3
fn String String.new_ascii_to_lower(s, Allocator allocator = allocator::heap())
```
```c3
fn String String.new_ascii_to_upper(s, Allocator allocator = allocator::heap())
```
```c3
fn usz! String.rindex_of(s, String needle)
```
```c3
fn usz! String.rindex_of_char(s, char needle)
```
```c3
fn String[] String.split(s, String needle, usz max = 0, Allocator allocator = allocator::heap())
```
```c3
fn Splitter String.splitter(self, String split)
```
```c3
fn bool String.starts_with(string, String needle)
```
```c3
fn String String.strip(string, String needle)
```
```c3
fn String String.strip_end(string, String needle)
```
```c3
fn String String.tconcat(s1, String s2)
```
```c3
fn String String.tcopy(s)
```
```c3
fn String String.temp_ascii_to_lower(s, Allocator allocator = allocator::heap())
```
```c3
fn String String.temp_ascii_to_upper(s)
```
```c3
fn double! String.to_double(s)
```
```c3
fn float! String.to_float(s)
```
```c3
fn ichar! String.to_ichar(s, int base = 10)
```
```c3
fn int! String.to_int(s, int base = 10)
```
```c3
fn int128! String.to_int128(s, int base = 10)
```
```c3
macro String.to_integer(string, $Type, int base = 10)
```
```c3
fn long! String.to_long(s, int base = 10)
```
```c3
fn Char16[]! String.to_new_utf16(s, Allocator allocator = allocator::heap())
```
```c3
fn Char32[]! String.to_new_utf32(s, Allocator allocator = allocator::heap())
```
```c3
fn WString! String.to_new_wstring(s, Allocator allocator = allocator::heap())
```
```c3
fn short! String.to_short(s, int base = 10)
```
```c3
fn Char16[]! String.to_temp_utf16(s)
```
```c3
fn Char32[]! String.to_temp_utf32(s)
```
```c3
fn WString! String.to_temp_wstring(s)
```
```c3
fn char! String.to_uchar(s, int base = 10)
```
```c3
fn uint! String.to_uint(s, int base = 10)
```
```c3
fn uint128! String.to_uint128(s, int base = 10)
```
```c3
fn ulong! String.to_ulong(s, int base = 10)
```
```c3
fn ushort! String.to_ushort(s, int base = 10)
```
```c3
fn String String.trim(string, String to_trim = "\t\n\r ")
```
```c3
fn String[] String.tsplit(s, String needle, usz max = 0)
```
```c3
fn usz String.utf8_codepoints(s)
```
```c3
fn ZString String.zstr_copy(s, Allocator allocator = allocator::heap())
```
```c3
fn ZString String.zstr_tcopy(s)
```
```c3
fn usz ZString.char_len(str)
```
```c3
fn String ZString.copy(z, Allocator allocator = allocator::temp())
```
```c3
fn usz ZString.len(str)
```
```c3
fn String ZString.str_view(str)
```
```c3
fn String ZString.tcopy(z)
```
```c3
macro bool char_in_set(char c, String set)
```
```c3
macro double! decfloat(char[] chars, int $bits, int $emin, int sign)
```
```c3
macro double! hexfloat(char[] chars, int $bits, int $emin, int sign)
```
```c3
fn String join_new(String[] s, String joiner, Allocator allocator = allocator::heap())
```
```c3
macro String new_format(String fmt, ..., Allocator allocator = allocator::heap())
```
```c3
fn String! new_from_utf16(Char16[] utf16, Allocator allocator = allocator::heap())
```
```c3
fn String! new_from_utf32(Char32[] utf32, Allocator allocator = allocator::heap())
```
```c3
fn String! new_from_wstring(WString wstring, Allocator allocator = allocator::heap())
```
```c3
fn String! temp_from_utf16(Char16[] utf16)
```
```c3
fn String! temp_from_wstring(WString wstring)
```
```c3
macro String tformat(String fmt, ...)
```
### std::core::string::conv
```c3
fn void! char16_to_utf8_unsafe(Char16 *ptr, usz *available, char** output)
```
```c3
fn void char32_to_utf16_unsafe(Char32 c, Char16** output)
```
```c3
fn usz! char32_to_utf8(Char32 c, char[] output)
```
```c3
fn usz char32_to_utf8_unsafe(Char32 c, char** output)
```
```c3
fn usz utf16len_for_utf32(Char32[] utf32)
```
```c3
fn usz utf16len_for_utf8(String utf8)
```
```c3
fn void! utf16to8_unsafe(Char16[] utf16, char* utf8_buffer)
```
```c3
fn usz! utf32to8(Char32[] utf32, char[] utf8_buffer)
```
```c3
fn void utf32to8_unsafe(Char32[] utf32, char* utf8_buffer)
```
```c3
fn usz utf8_codepoints(String utf8)
```
```c3
fn Char32! utf8_to_char32(char* ptr, usz* size)
```
```c3
fn usz utf8len_for_utf16(Char16[] utf16)
```
```c3
fn usz utf8len_for_utf32(Char32[] utf32)
```
```c3
fn void! utf8to16_unsafe(String utf8, Char16* utf16_buffer)
```
```c3
fn usz! utf8to32(String utf8, Char32[] utf32_buffer)
```
```c3
fn void! utf8to32_unsafe(String utf8, Char32* utf32_buffer)
```
### std::core::string::iterator
```c3
struct StringIterator
```
```c3
fn Char32! StringIterator.next(&self)
```
```c3
fn void StringIterator.reset(&self)
```
### std::core::types
```c3
enum TypeKind : char
```
```c3
fault ConversionResult
```
```c3
struct TypeEnum
```
```c3
macro bool @has_same(#a, #b, ...)
```
```c3
fn bool TypeKind.is_int(kind) @inline
```
```c3
macro any_to_int(any v, $Type)
```
```c3
macro bool implements_copy($Type)
```
```c3
macro TypeKind inner_kind($Type)
```
```c3
macro bool is_bool($Type)
```
```c3
macro bool is_comparable_value(value)
```
```c3
macro bool is_equatable_type($Type)
```
```c3
macro bool is_equatable_value(value)
```
```c3
macro bool is_float($Type)
```
```c3
macro bool is_floatlike($Type)
```
```c3
macro bool is_int($Type)
```
```c3
macro bool is_intlike($Type)
```
```c3
macro bool is_numerical($Type)
```
```c3
macro bool is_promotable_to_float($Type)
```
```c3
macro bool is_promotable_to_floatlike($Type)
```
```c3
macro bool is_same($TypeA, $TypeB)
```
```c3
macro bool is_same_vector_type($Type1, $Type2)
```
```c3
macro bool is_slice_convertable($Type)
```
```c3
macro bool is_subtype_of($Type, $OtherType)
```
```c3
macro bool is_underlying_int($Type)
```
```c3
macro bool is_vector($Type)
```
```c3
macro lower_to_atomic_compatible_type($Type)
```
```c3
macro bool may_load_atomic($Type)
```
```c3
fn bool typeid.is_subtype_of(self, typeid other)
```
### std::core::values
```c3
macro bool @assign_to(#value1, #value2)
```
```c3
macro TypeKind @inner_kind(#value)
```
```c3
macro bool @is_bool(#value)
```
```c3
macro bool @is_float(#value)
```
```c3
macro bool @is_floatlike(#value)
```
```c3
macro bool @is_int(#value)
```
```c3
macro bool @is_promotable_to_float(#value)
```
```c3
macro bool @is_promotable_to_floatlike(#value)
```
```c3
macro bool @is_same_type(#value1, #value2)
```
```c3
macro bool @is_same_vector_type(#value1, #value2)
```
```c3
macro bool @is_vector(#value)
```
```c3
macro typeid @typeid(#value) @builtin
```
```c3
macro bool @typeis(#value, $Type) @builtin
```
```c3
macro TypeKind @typekind(#value) @builtin
```
```c3
macro promote_int(x)
```
### std::crypto::rc4
```c3
struct Rc4
```
```c3
fn void Rc4.crypt(&self, char[] in, char[] out)
```
```c3
fn void Rc4.destroy(&self)
```
```c3
fn void Rc4.init(&self, char[] key)
```
### std::encoding::base64
```c3
fault Base64Error
```
```c3
struct Base64Decoder
```
```c3
struct Base64Encoder
```
```c3
fn usz! Base64Decoder.decode(&self, char[] src, char[] dst)
```
```c3
fn usz! Base64Decoder.decode_len(&self, usz n)
```
```c3
fn void! Base64Decoder.init(&self, String alphabet, int padding = '=')
```
```c3
fn usz! Base64Encoder.encode(&self, char[] src, char[] dst)
```
```c3
fn usz Base64Encoder.encode_len(&self, usz n)
```
```c3
fn void! Base64Encoder.init(&self, String alphabet, int padding = '=')
```
### std::encoding::csv
```c3
struct CsvReader
```
```c3
macro CsvReader.@each_row(self, int rows = int.max; @body(String[] row))
```
```c3
fn void CsvReader.init(&self, InStream stream, String separator = ",")
```
```c3
fn String[]! CsvReader.read_new_row(self, Allocator allocator = allocator::heap())
```
```c3
fn String[]! CsvReader.read_new_row_with_allocator(self, Allocator allocator = allocator::heap())
```
```c3
fn String[]! CsvReader.read_temp_row(self)
```
```c3
fn void! CsvReader.skip_row(self) @maydiscard
```
### std::encoding::json
```c3
fault JsonParsingError
```
```c3
fn JsonTokenType! lex_string(JsonContext* context)
```
```c3
fn Object*! parse(InStream s, Allocator allocator = allocator::heap())
```
### std::hash::adler32
```c3
struct Adler32
```
```c3
fn uint Adler32.final(&self)
```
```c3
fn void Adler32.init(&self)
```
```c3
fn void Adler32.update(&self, char[] data)
```
```c3
fn void Adler32.updatec(&self, char c)
```
```c3
fn uint encode(char[] data)
```
### std::hash::crc32
```c3
struct Crc32
```
```c3
fn uint Crc32.final(&self)
```
```c3
fn void Crc32.init(&self, uint seed = 0)
```
```c3
fn void Crc32.update(&self, char[] data)
```
```c3
fn void Crc32.updatec(&self, char c)
```
```c3
fn uint encode(char[] data)
```
### std::hash::crc64
```c3
struct Crc64
```
```c3
fn ulong Crc64.final(&self)
```
```c3
fn void Crc64.init(&self, uint seed = 0)
```
```c3
fn void Crc64.update(&self, char[] data)
```
```c3
fn void Crc64.updatec(&self, char c)
```
```c3
fn ulong encode(char[] data)
```
### std::hash::fnv32a
```c3
distinct Fnv32a = uint;
```
```c3
fn void Fnv32a.init(&self)
```
```c3
fn void Fnv32a.update(&self, char[] data)
```
```c3
macro void Fnv32a.update_char(&self, char c)
```
```c3
fn uint encode(char[] data)
```
### std::hash::fnv64a
```c3
distinct Fnv64a = ulong;
```
```c3
fn void Fnv64a.init(&self)
```
```c3
fn void Fnv64a.update(&self, char[] data)
```
```c3
macro void Fnv64a.update_char(&self, char c)
```
```c3
fn ulong encode(char[] data)
```
### std::hash::sha1
```c3
struct Sha1
```
```c3
fn char[20] Sha1.final(&self)
```
```c3
fn void Sha1.init(&self)
```
```c3
fn void Sha1.update(&self, char[] data)
```
### std::io
```c3
enum Seek
```
```c3
fault FormattingFault
```
```c3
fault IoError
```
```c3
fault PrintFault
```
```c3
interface InStream
```
```c3
interface OutStream
```
```c3
interface Printable
```
```c3
struct BitReader
```
```c3
struct BitWriter
```
```c3
struct ByteBuffer (InStream, OutStream)
```
```c3
struct ByteReader (InStream)
```
```c3
struct ByteWriter (OutStream)
```
```c3
struct File (InStream, OutStream)
```
```c3
struct Formatter
```
```c3
struct LimitReader (InStream)
```
```c3
struct ReadBuffer (InStream)
```
```c3
struct Scanner (InStream)
```
```c3
struct WriteBuffer (OutStream)
```
```c3
macro bool @is_instream(#expr)
```
```c3
macro bool @is_outstream(#expr)
```
```c3
macro void! @pushback_using_seek(&s)
```
```c3
macro char! @read_byte_using_read(&s)
```
```c3
macro usz! @read_using_read_byte(&s, char[] buffer)
```
```c3
macro void! @write_byte_using_write(&s, char c)
```
```c3
macro usz! @write_using_write_byte(&s, char[] bytes)
```
```c3
fn void BitReader.clear(&self) @inline
```
```c3
fn void BitReader.init(&self, InStream byte_reader)
```
```c3
fn char! BitReader.read_bits(&self, uint nbits)
```
```c3
fn void! BitWriter.flush(&self)
```
```c3
fn void BitWriter.init(&self, OutStream byte_writer)
```
```c3
fn void! BitWriter.write_bits(&self, uint bits, uint nbits)
```
```c3
fn usz! ByteBuffer.available(&self) @inline @dynamic
```
```c3
fn void ByteBuffer.free(&self)
```
```c3
fn void! ByteBuffer.grow(&self, usz n)
```
```c3
fn ByteBuffer*! ByteBuffer.init_with_buffer(&self, char[] buf)
```
```c3
fn ByteBuffer*! ByteBuffer.new_init(&self, usz max_read, usz initial_capacity = 16, Allocator allocator = allocator::heap())
```
```c3
fn void! ByteBuffer.pushback_byte(&self) @dynamic
```
```c3
fn usz! ByteBuffer.read(&self, char[] bytes) @dynamic
```
```c3
fn char! ByteBuffer.read_byte(&self) @dynamic
```
```c3
fn usz! ByteBuffer.seek(&self, isz offset, Seek seek) @dynamic
```
```c3
macro ByteBuffer.shrink(&self)
```
```c3
fn ByteBuffer*! ByteBuffer.temp_init(&self, usz max_read, usz initial_capacity = 16)
```
```c3
fn usz! ByteBuffer.write(&self, char[] bytes) @dynamic
```
```c3
fn void! ByteBuffer.write_byte(&self, char c) @dynamic
```
```c3
fn usz! ByteReader.available(&self) @inline @dynamic
```
```c3
fn ByteReader* ByteReader.init(&self, char[] bytes)
```
```c3
fn usz ByteReader.len(&self) @dynamic
```
```c3
fn void! ByteReader.pushback_byte(&self) @dynamic
```
```c3
fn usz! ByteReader.read(&self, char[] bytes) @dynamic
```
```c3
fn char! ByteReader.read_byte(&self) @dynamic
```
```c3
fn usz! ByteReader.seek(&self, isz offset, Seek seek) @dynamic
```
```c3
fn usz! ByteReader.write_to(&self, OutStream writer) @dynamic
```
```c3
fn void! ByteWriter.destroy(&self) @dynamic
```
```c3
fn void! ByteWriter.ensure_capacity(&self, usz len) @inline
```
```c3
fn ByteWriter* ByteWriter.init_with_buffer(&self, char[] data)
```
```c3
fn ByteWriter* ByteWriter.new_init(&self, Allocator allocator = allocator::heap())
```
```c3
fn usz! ByteWriter.read_from(&self, InStream reader) @dynamic
```
```c3
fn String ByteWriter.str_view(&self) @inline
```
```c3
fn ByteWriter* ByteWriter.temp_init(&self)
```
```c3
fn usz! ByteWriter.write(&self, char[] bytes) @dynamic
```
```c3
fn void! ByteWriter.write_byte(&self, char c) @dynamic
```
```c3
fn void Formatter.init(&self, OutputFn out_fn, void* data = null)
```
```c3
fn usz! Formatter.print(&self, String str)
```
```c3
fn usz! Formatter.print_with_function(&self, Printable arg)
```
```c3
fn usz! Formatter.printf(&self, String format, args...)
```
```c3
fn usz! Formatter.vprintf(&self, String format, any[] anys)
```
```c3
fn usz! LimitReader.available(&self) @inline @dynamic
```
```c3
fn void! LimitReader.close(&self) @dynamic
```
```c3
fn LimitReader* LimitReader.init(&self, InStream wrapped_stream, usz limit)
```
```c3
fn usz! LimitReader.read(&self, char[] bytes) @dynamic
```
```c3
fn char! LimitReader.read_byte(&self) @dynamic
```
```c3
fn void! ReadBuffer.close(&self) @dynamic
```
```c3
fn ReadBuffer* ReadBuffer.init(&self, InStream wrapped_stream, char[] bytes)
```
```c3
fn usz! ReadBuffer.read(&self, char[] bytes) @dynamic
```
```c3
fn char! ReadBuffer.read_byte(&self) @dynamic
```
```c3
fn String ReadBuffer.str_view(&self) @inline
```
```c3
fn void! Scanner.close(&self) @dynamic
```
```c3
fn char[] Scanner.flush(&self) @dynamic
```
```c3
fn void Scanner.init(&self, InStream stream, char[] buffer)
```
```c3
fn usz! Scanner.read(&self, char[] bytes) @dynamic
```
```c3
fn char! Scanner.read_byte(&self) @dynamic
```
```c3
fn char[]! Scanner.scan(&self, String pattern = "\n")
```
```c3
fn void! WriteBuffer.close(&self) @dynamic
```
```c3
fn void! WriteBuffer.flush(&self) @dynamic
```
```c3
fn WriteBuffer* WriteBuffer.init(&self, OutStream wrapped_stream, char[] bytes)
```
```c3
fn String WriteBuffer.str_view(&self) @inline
```
```c3
fn usz! WriteBuffer.write(&self, char[] bytes) @dynamic
```
```c3
fn void! WriteBuffer.write_byte(&self, char c) @dynamic
```
```c3
fn usz! available(InStream s)
```
```c3
fn char[]! bprintf(char[] buffer, String format, args...) @maydiscard
```
```c3
fn usz! copy_to(InStream in, OutStream dst, char[] buffer = {})
```
```c3
macro void eprint(x)
```
```c3
fn usz! eprintf(String format, args...) @maydiscard
```
```c3
fn usz! eprintfn(String format, args...) @maydiscard
```
```c3
macro void eprintn(x)
```
```c3
macro usz! fprint(out, x)
```
```c3
fn usz! fprintf(OutStream out, String format, args...)
```
```c3
fn usz! fprintfn(OutStream out, String format, args...) @maydiscard
```
```c3
macro usz! fprintn(out, x = "")
```
```c3
macro void print(x)
```
```c3
fn usz! printf(String format, args...) @maydiscard
```
```c3
fn usz! printfn(String format, args...) @maydiscard
```
```c3
macro void printn(x = "")
```
```c3
macro usz! read_all(stream, char[] buffer)
```
```c3
macro usz! read_any(stream, any ref)
```
```c3
macro usz! read_varint(stream, x_ptr)
```
```c3
macro String! readline(stream = io::stdin(), Allocator allocator = allocator::heap())
```
```c3
macro String! treadline(stream = io::stdin())
```
```c3
macro usz! write_all(stream, char[] buffer)
```
```c3
macro usz! write_any(stream, any ref)
```
```c3
macro usz! write_varint(stream, x)
```
### std::io @if (env::LIBC)
```c3
fn void putchar(char c) @inline
```
```c3
fn File* stderr()
```
```c3
fn File* stdin()
```
```c3
fn File* stdout()
```
### std::io @if(!env::LIBC)
```c3
fn void putchar(char c) @inline
```
```c3
fn File* stderr()
```
```c3
fn File* stdin()
```
```c3
fn File* stdout()
```
### std::io::file
```c3
fn void! File.close(&self) @inline @dynamic
```
```c3
fn bool File.eof(&self) @inline
```
```c3
fn void! File.flush(&self) @dynamic
```
```c3
fn void! File.memopen(File* file, char[] data, String mode)
```
```c3
fn usz! File.read(&self, char[] buffer) @dynamic
```
```c3
fn char! File.read_byte(&self) @dynamic
```
```c3
fn void! File.reopen(&self, String filename, String mode)
```
```c3
fn usz! File.seek(&self, isz offset, Seek seek_mode = Seek.SET) @dynamic
```
```c3
fn usz! File.write(&self, char[] buffer) @dynamic
```
```c3
fn void! File.write_byte(&self, char c) @dynamic
```
```c3
fn void! delete(String filename)
```
```c3
fn File from_handle(CFile file)
```
```c3
fn usz! get_size(String path)
```
```c3
fn bool is_file(String path)
```
```c3
fn char[]! load_buffer(String filename, char[] buffer)
```
```c3
fn char[]! load_new(String filename, Allocator allocator = allocator::heap())
```
```c3
fn char[]! load_temp(String filename)
```
```c3
fn File! open(String filename, String mode)
```
```c3
fn File! open_path(Path path, String mode)
```
### std::io::os
```c3
macro String! getcwd(Allocator allocator = allocator::heap())
```
```c3
macro void! native_chdir(Path path)
```
```c3
fn bool native_file_or_dir_exists(String path)
```
```c3
fn usz! native_file_size(String path) @if(!env::WIN32 && !env::DARWIN)
```
```c3
fn usz! native_file_size(String path) @if(env::DARWIN)
```
```c3
fn usz! native_file_size(String path) @if(env::WIN32)
```
```c3
fn bool native_is_dir(String path)
```
```c3
fn bool native_is_file(String path)
```
```c3
macro bool! native_mkdir(Path path, MkdirPermissions permissions)
```
```c3
macro bool! native_rmdir(Path path)
```
```c3
fn void! native_stat(Stat* stat, String path) @if(env::DARWIN || env::LINUX)
```
### std::io::os @if(env::LIBC)
```c3
fn void*! native_fopen(String filename, String mode) @inline
```
```c3
fn usz! native_fread(CFile file, char[] buffer) @inline
```
```c3
fn void*! native_freopen(void* file, String filename, String mode) @inline
```
```c3
fn void! native_fseek(void* file, isz offset, Seek seek_mode) @inline
```
```c3
fn usz! native_ftell(CFile file) @inline
```
```c3
fn usz! native_fwrite(CFile file, char[] buffer) @inline
```
```c3
fn void! native_remove(String filename)
```
```c3
fn Path! native_temp_directory(Allocator allocator = allocator::heap()) @if(!env::WIN32)
```
```c3
fn Path! native_temp_directory(Allocator allocator = allocator::heap()) @if(env::WIN32)
```
### std::io::os @if(env::NO_LIBC)
```c3
fn void*! native_fopen(String filename, String mode) @inline
```
```c3
fn usz! native_fread(CFile file, char[] buffer) @inline
```
```c3
fn void*! native_freopen(void* file, String filename, String mode) @inline
```
```c3
fn void! native_fseek(void* file, isz offset, Seek seek_mode) @inline
```
```c3
fn usz! native_ftell(CFile file) @inline
```
```c3
fn usz! native_fwrite(CFile file, char[] buffer) @inline
```
```c3
fn void! native_remove(String filename) @inline
```
```c3
macro Path! native_temp_directory(Allocator allocator = allocator::heap())
```
### std::io::os @if(env::POSIX)
```c3
fn PathList! native_ls(Path dir, bool no_dirs, bool no_symlinks, String mask, Allocator allocator)
```
```c3
fn void! native_rmtree(Path dir)
```
### std::io::os @if(env::WIN32)
```c3
fn PathList! native_ls(Path dir, bool no_dirs, bool no_symlinks, String mask, Allocator allocator)
```
```c3
fn void! native_rmtree(Path path)
```
### std::io::path
```c3
enum MkdirPermissions
```
```c3
enum PathEnv
```
```c3
fault PathResult
```
```c3
struct Path (Printable)
```
```c3
fn Path! Path.absolute(self, Allocator allocator = allocator::heap())
```
```c3
fn Path! Path.append(self, String filename, Allocator allocator = allocator::heap())
```
```c3
fn ZString Path.as_zstr(self)
```
```c3
fn String Path.basename(self)
```
```c3
fn String Path.dirname(self)
```
```c3
fn bool Path.equals(self, Path p2)
```
```c3
fn String! Path.extension(self)
```
```c3
fn void Path.free(self)
```
```c3
fn bool Path.has_suffix(self, String str)
```
```c3
fn bool! Path.is_absolute(self)
```
```c3
fn Path! Path.parent(self)
```
```c3
fn String Path.root_directory(self)
```
```c3
fn String Path.str_view(self) @inline
```
```c3
fn Path! Path.tappend(self, String filename)
```
```c3
fn usz! Path.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String Path.to_new_string(&self, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn String Path.volume_name(self)
```
```c3
fn bool! Path.walk(self, PathWalker w, void* data)
```
```c3
fn void! chdir(Path path)
```
```c3
fn void! delete(Path path)
```
```c3
fn bool exists(Path path)
```
```c3
fn usz! file_size(Path path)
```
```c3
fn Path! getcwd(Allocator allocator = allocator::heap())
```
```c3
fn bool is_dir(Path path)
```
```c3
fn bool is_file(Path path)
```
```c3
macro bool is_posix_separator(char c)
```
```c3
macro bool is_reserved_path_char(char c, PathEnv path_env = DEFAULT_PATH_ENV)
```
```c3
macro bool is_reserved_win32_path_char(char c)
```
```c3
macro bool is_separator(char c, PathEnv path_env = DEFAULT_PATH_ENV)
```
```c3
macro bool is_win32_separator(char c)
```
```c3
fn PathList! ls(Path dir, bool no_dirs = false, bool no_symlinks = false, String mask = "", Allocator allocator = allocator::heap())
```
```c3
fn bool! mkdir(Path path, bool recursive = false, MkdirPermissions permissions = NORMAL)
```
```c3
fn Path! new(String path, Allocator allocator = allocator::heap(), PathEnv path_env = DEFAULT_PATH_ENV)
```
```c3
fn Path! new_posix(String path, Allocator allocator = allocator::heap())
```
```c3
fn Path! new_win32_wstring(WString path, Allocator allocator = allocator::heap())
```
```c3
fn Path! new_windows(String path, Allocator allocator = allocator::heap())
```
```c3
fn String! normalize(String path_str, PathEnv path_env = DEFAULT_PATH_ENV)
```
```c3
fn bool! rmdir(Path path)
```
```c3
fn void! rmtree(Path path)
```
```c3
fn Path! temp_directory(Allocator allocator = allocator::heap())
```
```c3
fn Path! temp_new(String path, PathEnv path_env = DEFAULT_PATH_ENV)
```
```c3
fn Path! tgetcwd()
```
### std::math
```c3
enum RoundingMode : int
```
```c3
fault MathError
```
```c3
fault MatrixError
```
```c3
fn int128 __ashlti3(int128 a, uint b) @extern("__ashlti3") @weak @nostrip
```
```c3
fn int128 __ashrti3(int128 a, uint b) @extern("__ashrti3") @weak @nostrip
```
```c3
fn int128 __divti3(int128 a, int128 b) @extern("__divti3") @weak @nostrip
```
```c3
fn int128 __fixdfti(double a) @weak @extern("__fixdfti") @nostrip
```
```c3
fn int128 __fixsfti(float a) @weak @extern("__fixsfti") @nostrip
```
```c3
fn uint128 __fixunsdfti(double a) @weak @extern("__fixunsdfti") @nostrip
```
```c3
fn uint128 __fixunssfti(float a) @weak @extern("__fixunssfti") @nostrip
```
```c3
fn double __floattidf(int128 a) @extern("__floattidf") @weak @nostrip
```
```c3
fn float __floattisf(int128 a) @extern("__floattisf") @weak @nostrip
```
```c3
fn double __floatuntidf(uint128 a) @extern("__floatuntidf") @weak @nostrip
```
```c3
fn float __floatuntisf(uint128 a) @extern("__floatuntisf") @weak @nostrip
```
```c3
fn uint128 __lshrti3(uint128 a, uint b) @extern("__lshrti3") @weak @nostrip
```
```c3
fn int128 __modti3(int128 a, int128 b) @extern("__modti3") @weak @nostrip
```
```c3
fn int128 __multi3(int128 a, int128 b) @extern("__multi3") @weak @nostrip
```
```c3
fn double __roundeven(double d) @extern("roundeven") @weak @nostrip
```
```c3
fn float __roundevenf(float f) @extern("roundevenf") @weak @nostrip
```
```c3
fn uint128 __udivti3(uint128 n, uint128 d) @extern("__udivti3") @weak @nostrip
```
```c3
fn uint128 __umodti3(uint128 n, uint128 d) @extern("__umodti3") @weak @nostrip
```
```c3
fn double _frexp(double x, int* e)
```
```c3
fn float _frexpf(float x, int* e)
```
```c3
macro abs(x)
```
```c3
macro acos(x)
```
```c3
macro acosh(x)
```
```c3
macro asin(x)
```
```c3
macro asinh(x)
```
```c3
macro atan(x)
```
```c3
macro atan2(x, y)
```
```c3
macro atanh(x)
```
```c3
macro bool bool[<*>].and(bool[<*>] x)
```
```c3
macro bool[<*>] bool[<*>].comp_eq(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_ge(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_gt(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_le(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_lt(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_ne(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool bool[<*>].max(bool[<*>] x)
```
```c3
macro bool bool[<*>].min(bool[<*>] x)
```
```c3
macro bool bool[<*>].or(bool[<*>] x)
```
```c3
macro bool bool[<*>].product(bool[<*>] x)
```
```c3
macro bool bool[<*>].sum(bool[<*>] x)
```
```c3
macro bool bool[<*>].xor(bool[<*>] x)
```
```c3
macro ceil(x)
```
```c3
macro bool char.is_even(char x)
```
```c3
macro bool char.is_odd(char x)
```
```c3
macro char! char.overflow_add(char x, char y)
```
```c3
macro char! char.overflow_mul(char x, char y)
```
```c3
macro char! char.overflow_sub(char x, char y)
```
```c3
macro char char.sat_add(char x, char y)
```
```c3
macro char char.sat_mul(char x, char y)
```
```c3
macro char char.sat_shl(char x, char y)
```
```c3
macro char char.sat_sub(char x, char y)
```
```c3
macro char char[<*>].and(char[<*>] x)
```
```c3
macro bool[<*>] char[<*>].comp_eq(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_ge(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_gt(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_le(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_lt(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_ne(char[<*>] x, char[<*>] y)
```
```c3
macro char char[<*>].max(char[<*>] x)
```
```c3
macro char char[<*>].min(char[<*>] x)
```
```c3
macro char char[<*>].or(char[<*>] x)
```
```c3
macro char char[<*>].product(char[<*>] x)
```
```c3
macro char char[<*>].sum(char[<*>] x)
```
```c3
macro char char[<*>].xor(char[<*>] x)
```
```c3
macro clamp(x, lower, upper)
```
```c3
macro copysign(mag, sgn)
```
```c3
macro cos(x)
```
```c3
macro cosec(x)
```
```c3
macro cosech(x)
```
```c3
macro cosh(x)
```
```c3
macro cotan(x)
```
```c3
macro cotanh(x)
```
```c3
macro deg_to_rad(x)
```
```c3
macro double double.ceil(double x)
```
```c3
macro double double.clamp(double x, double lower, double upper)
```
```c3
macro double double.copysign(double mag, double sgn)
```
```c3
macro double double.floor(double x)
```
```c3
macro double double.fma(double a, double b, double c)
```
```c3
macro uint double.high_word(double d)
```
```c3
macro uint double.low_word(double d)
```
```c3
macro double double.muladd(double a, double b, double c)
```
```c3
macro double double.nearbyint(double x)
```
```c3
macro double double.pow(double x, exp)
```
```c3
macro double double.rint(double x)
```
```c3
macro double double.round(double x)
```
```c3
macro double double.roundeven(double x)
```
```c3
macro double double.trunc(double x)
```
```c3
macro double[<*>] double[<*>].ceil(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].clamp(double[<*>] x, double[<*>] lower, double[<*>] upper)
```
```c3
macro bool[<*>] double[<*>].comp_eq(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_ge(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_gt(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_le(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_lt(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_ne(double[<*>] x, double[<*>] y)
```
```c3
macro double[<*>] double[<*>].copysign(double[<*>] mag, double[<*>] sgn)
```
```c3
macro double double[<*>].distance(double[<*>] x, double[<*>] y)
```
```c3
macro double double[<*>].dot(double[<*>] x, double[<*>] y)
```
```c3
macro bool double[<*>].equals(double[<*>] x, double[<*>] y)
```
```c3
macro double[<*>] double[<*>].floor(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].fma(double[<*>] a, double[<*>] b, double[<*>] c)
```
```c3
macro double double[<*>].length(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].lerp(double[<*>] x, double[<*>] y, double amount)
```
```c3
macro double double[<*>].max(double[<*>] x)
```
```c3
macro double double[<*>].min(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].nearbyint(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].normalize(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].pow(double[<*>] x, exp)
```
```c3
macro double double[<*>].product(double[<*>] x, double start = 1.0)
```
```c3
macro double[<*>] double[<*>].reflect(double[<*>] x, double[<*>] y)
```
```c3
macro double[<*>] double[<*>].rint(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].round(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].roundeven(double[<*>] x)
```
```c3
macro double double[<*>].sum(double[<*>] x, double start = 0.0)
```
```c3
macro double[<*>] double[<*>].trunc(double[<*>] x)
```
```c3
macro exp(x)
```
```c3
macro exp2(x)
```
```c3
macro float float.ceil(float x)
```
```c3
macro float float.clamp(float x, float lower, float upper)
```
```c3
macro float float.copysign(float mag, float sgn)
```
```c3
macro float float.floor(float x)
```
```c3
macro float float.fma(float a, float b, float c)
```
```c3
macro float float.muladd(float a, float b, float c)
```
```c3
macro float float.nearbyint(float x)
```
```c3
macro float float.pow(float x, exp)
```
```c3
macro float float.rint(float x)
```
```c3
macro float float.round(float x)
```
```c3
macro float float.roundeven(float x)
```
```c3
macro float float.trunc(float x)
```
```c3
macro uint float.word(float d)
```
```c3
macro float[<*>] float[<*>].ceil(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].clamp(float[<*>] x, float[<*>] lower, float[<*>] upper)
```
```c3
macro bool[<*>] float[<*>].comp_eq(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_ge(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_gt(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_le(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_lt(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_ne(float[<*>] x, float[<*>] y)
```
```c3
macro float[<*>] float[<*>].copysign(float[<*>] mag, float[<*>] sgn)
```
```c3
macro float float[<*>].distance(float[<*>] x, float[<*>] y)
```
```c3
macro float float[<*>].dot(float[<*>] x, float[<*>] y)
```
```c3
macro bool float[<*>].equals(float[<*>] x, float[<*>] y)
```
```c3
macro float[<*>] float[<*>].floor(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].fma(float[<*>] a, float[<*>] b, float[<*>] c)
```
```c3
macro float float[<*>].length(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].lerp(float[<*>] x, float[<*>] y, float amount)
```
```c3
macro float float[<*>].max(float[<*>] x)
```
```c3
macro float float[<*>].min(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].nearbyint(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].normalize(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].pow(float[<*>] x, exp)
```
```c3
macro float float[<*>].product(float[<*>] x, float start = 1.0)
```
```c3
macro float[<*>] float[<*>].reflect(float[<*>] x, float[<*>] y)
```
```c3
macro float[<*>] float[<*>].rint(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].round(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].roundeven(float[<*>] x)
```
```c3
macro float float[<*>].sum(float[<*>] x, float start = 0.0)
```
```c3
macro float[<*>] float[<*>].trunc(float[<*>] x)
```
```c3
macro floor(x)
```
```c3
macro fma(a, b, c)
```
```c3
macro frexp(x, int* e)
```
```c3
macro hypot(x, y)
```
```c3
macro bool ichar.is_even(ichar x)
```
```c3
macro bool ichar.is_odd(ichar x)
```
```c3
macro ichar! ichar.overflow_add(ichar x, ichar y)
```
```c3
macro ichar! ichar.overflow_mul(ichar x, ichar y)
```
```c3
macro ichar! ichar.overflow_sub(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_add(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_mul(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_shl(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_sub(ichar x, ichar y)
```
```c3
macro ichar ichar[<*>].and(ichar[<*>] x)
```
```c3
macro bool[<*>] ichar[<*>].comp_eq(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_ge(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_gt(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_le(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_lt(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_ne(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro ichar ichar[<*>].max(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].min(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].or(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].product(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].sum(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].xor(ichar[<*>] x)
```
```c3
macro bool int.is_even(int x)
```
```c3
macro bool int.is_odd(int x)
```
```c3
macro int! int.overflow_add(int x, int y)
```
```c3
macro int! int.overflow_mul(int x, int y)
```
```c3
macro int! int.overflow_sub(int x, int y)
```
```c3
macro int int.sat_add(int x, int y)
```
```c3
macro int int.sat_mul(int x, int y)
```
```c3
macro int int.sat_shl(int x, int y)
```
```c3
macro int int.sat_sub(int x, int y)
```
```c3
macro bool int128.is_even(int128 x)
```
```c3
macro bool int128.is_odd(int128 x)
```
```c3
macro int128! int128.overflow_add(int128 x, int128 y)
```
```c3
macro int128! int128.overflow_mul(int128 x, int128 y)
```
```c3
macro int128! int128.overflow_sub(int128 x, int128 y)
```
```c3
macro int128 int128.sat_add(int128 x, int128 y)
```
```c3
macro int128 int128.sat_mul(int128 x, int128 y)
```
```c3
macro int128 int128.sat_shl(int128 x, int128 y)
```
```c3
macro int128 int128.sat_sub(int128 x, int128 y)
```
```c3
macro int128 int128[<*>].and(int128[<*>] x)
```
```c3
macro bool[<*>] int128[<*>].comp_eq(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_ge(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_gt(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_le(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_lt(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_ne(int128[<*>] x, int128[<*>] y)
```
```c3
macro int128 int128[<*>].max(int128[<*>] x)
```
```c3
macro int128 int128[<*>].min(int128[<*>] x)
```
```c3
macro int128 int128[<*>].or(int128[<*>] x)
```
```c3
macro int128 int128[<*>].product(int128[<*>] x)
```
```c3
macro int128 int128[<*>].sum(int128[<*>] x)
```
```c3
macro int128 int128[<*>].xor(int128[<*>] x)
```
```c3
macro int int[<*>].and(int[<*>] x)
```
```c3
macro bool[<*>] int[<*>].comp_eq(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_ge(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_gt(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_le(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_lt(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_ne(int[<*>] x, int[<*>] y)
```
```c3
macro int int[<*>].max(int[<*>] x)
```
```c3
macro int int[<*>].min(int[<*>] x)
```
```c3
macro int int[<*>].or(int[<*>] x)
```
```c3
macro int int[<*>].product(int[<*>] x)
```
```c3
macro int int[<*>].sum(int[<*>] x)
```
```c3
macro int int[<*>].xor(int[<*>] x)
```
```c3
macro bool is_even(x)
```
```c3
macro bool is_finite(x)
```
```c3
macro is_inf(x)
```
```c3
macro is_nan(x)
```
```c3
macro bool is_odd(x)
```
```c3
macro bool is_power_of_2(x)
```
```c3
macro ln(x)
```
```c3
macro log(x, base)
```
```c3
macro log10(x)
```
```c3
macro log2(x)
```
```c3
macro bool long.is_even(long x)
```
```c3
macro bool long.is_odd(long x)
```
```c3
macro long! long.overflow_add(long x, long y)
```
```c3
macro long! long.overflow_mul(long x, long y)
```
```c3
macro long! long.overflow_sub(long x, long y)
```
```c3
macro long long.sat_add(long x, long y)
```
```c3
macro long long.sat_mul(long x, long y)
```
```c3
macro long long.sat_shl(long x, long y)
```
```c3
macro long long.sat_sub(long x, long y)
```
```c3
macro long long[<*>].and(long[<*>] x)
```
```c3
macro bool[<*>] long[<*>].comp_eq(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_ge(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_gt(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_le(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_lt(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_ne(long[<*>] x, long[<*>] y)
```
```c3
macro long long[<*>].max(long[<*>] x)
```
```c3
macro long long[<*>].min(long[<*>] x)
```
```c3
macro long long[<*>].or(long[<*>] x)
```
```c3
macro long long[<*>].product(long[<*>] x)
```
```c3
macro long long[<*>].sum(long[<*>] x)
```
```c3
macro long long[<*>].xor(long[<*>] x)
```
```c3
macro max(x, y, ...)
```
```c3
macro min(x, y, ...)
```
```c3
macro muladd(a, b, c)
```
```c3
macro nearbyint(x)
```
```c3
macro next_power_of_2(x)
```
```c3
macro pow(x, exp)
```
```c3
macro rint(x)
```
```c3
macro round(x)
```
```c3
macro round_to_decimals(x, int decimal_places)
```
```c3
macro roundeven(x)
```
```c3
macro double scalbn(double x, int n)
```
```c3
macro sec(x)
```
```c3
macro sech(x)
```
```c3
macro select(bool[<*>] mask, then_value, else_value)
```
```c3
macro bool short.is_even(short x)
```
```c3
macro bool short.is_odd(short x)
```
```c3
macro short! short.overflow_add(short x, short y)
```
```c3
macro short! short.overflow_mul(short x, short y)
```
```c3
macro short! short.overflow_sub(short x, short y)
```
```c3
macro short short.sat_add(short x, short y)
```
```c3
macro short short.sat_mul(short x, short y)
```
```c3
macro short short.sat_shl(short x, short y)
```
```c3
macro short short.sat_sub(short x, short y)
```
```c3
macro short short[<*>].and(short[<*>] x)
```
```c3
macro bool[<*>] short[<*>].comp_eq(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_ge(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_gt(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_le(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_lt(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_ne(short[<*>] x, short[<*>] y)
```
```c3
macro short short[<*>].max(short[<*>] x)
```
```c3
macro short short[<*>].min(short[<*>] x)
```
```c3
macro short short[<*>].or(short[<*>] x)
```
```c3
macro short short[<*>].product(short[<*>] x)
```
```c3
macro short short[<*>].sum(short[<*>] x)
```
```c3
macro short short[<*>].xor(short[<*>] x)
```
```c3
macro sign(x)
```
```c3
macro int signbit(x)
```
```c3
macro sin(x)
```
```c3
macro sincos(x, y)
```
```c3
macro sinh(x)
```
```c3
macro sqr(x)
```
```c3
macro sqrt(x)
```
```c3
macro tan(x)
```
```c3
macro tanh(x)
```
```c3
macro trunc(x)
```
```c3
macro bool uint.is_even(uint x)
```
```c3
macro bool uint.is_odd(uint x)
```
```c3
macro uint! uint.overflow_add(uint x, uint y)
```
```c3
macro uint! uint.overflow_mul(uint x, uint y)
```
```c3
macro uint! uint.overflow_sub(uint x, uint y)
```
```c3
macro uint uint.sat_add(uint x, uint y)
```
```c3
macro uint uint.sat_mul(uint x, uint y)
```
```c3
macro uint uint.sat_shl(uint x, uint y)
```
```c3
macro uint uint.sat_sub(uint x, uint y)
```
```c3
macro bool uint128.is_even(uint128 x)
```
```c3
macro bool uint128.is_odd(uint128 x)
```
```c3
macro uint128! uint128.overflow_add(uint128 x, uint128 y)
```
```c3
macro uint128! uint128.overflow_mul(uint128 x, uint128 y)
```
```c3
macro uint128! uint128.overflow_sub(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_add(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_mul(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_shl(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_sub(uint128 x, uint128 y)
```
```c3
macro uint128 uint128[<*>].and(uint128[<*>] x)
```
```c3
macro bool[<*>] uint128[<*>].comp_eq(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_ge(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_gt(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_le(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_lt(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_ne(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro uint128 uint128[<*>].max(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].min(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].or(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].product(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].sum(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].xor(uint128[<*>] x)
```
```c3
macro uint uint[<*>].and(uint[<*>] x)
```
```c3
macro bool[<*>] uint[<*>].comp_eq(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_ge(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_gt(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_le(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_lt(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_ne(uint[<*>] x, uint[<*>] y)
```
```c3
macro uint uint[<*>].max(uint[<*>] x)
```
```c3
macro uint uint[<*>].min(uint[<*>] x)
```
```c3
macro uint uint[<*>].or(uint[<*>] x)
```
```c3
macro uint uint[<*>].product(uint[<*>] x)
```
```c3
macro uint uint[<*>].sum(uint[<*>] x)
```
```c3
macro uint uint[<*>].xor(uint[<*>] x)
```
```c3
macro bool ulong.is_even(ulong x)
```
```c3
macro bool ulong.is_odd(ulong x)
```
```c3
macro ulong! ulong.overflow_add(ulong x, ulong y)
```
```c3
macro ulong! ulong.overflow_mul(ulong x, ulong y)
```
```c3
macro ulong! ulong.overflow_sub(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_add(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_mul(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_shl(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_sub(ulong x, ulong y)
```
```c3
macro ulong ulong[<*>].and(ulong[<*>] x)
```
```c3
macro bool[<*>] ulong[<*>].comp_eq(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_ge(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_gt(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_le(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_lt(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_ne(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro ulong ulong[<*>].max(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].min(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].or(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].product(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].sum(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].xor(ulong[<*>] x)
```
```c3
macro bool ushort.is_even(ushort x)
```
```c3
macro bool ushort.is_odd(ushort x)
```
```c3
macro ushort! ushort.overflow_add(ushort x, ushort y)
```
```c3
macro ushort! ushort.overflow_mul(ushort x, ushort y)
```
```c3
macro ushort! ushort.overflow_sub(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_add(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_mul(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_shl(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_sub(ushort x, ushort y)
```
```c3
macro ushort ushort[<*>].and(ushort[<*>] x)
```
```c3
macro bool[<*>] ushort[<*>].comp_eq(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_ge(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_gt(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_le(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_lt(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_ne(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro ushort ushort[<*>].max(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].min(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].or(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].product(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].sum(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].xor(ushort[<*>] x)
```
### std::math::complex(&lt;Real&gt;)
```c3
macro Complex Complex.add(self, Complex b)
```
```c3
macro Complex Complex.add_each(self, Real b)
```
```c3
macro Complex Complex.div(self, Complex b)
```
```c3
macro Complex Complex.mul(self, Complex b)
```
```c3
macro Complex Complex.scale(self, Real s)
```
```c3
macro Complex Complex.sub(self, Complex b)
```
```c3
macro Complex Complex.sub_each(self, Real b)
```
### std::math::easing
```c3
fn float back_in(float t, float b, float c, float d, float s = 1.70158f) @inline
```
```c3
fn float back_inout(float t, float b, float c, float d, float s = 1.70158f) @inline
```
```c3
fn float back_out(float t, float b, float c, float d, float s = 1.70158f) @inline
```
```c3
fn float bounce_in(float t, float b, float c, float d) @inline
```
```c3
fn float bounce_inout(float t, float b, float c, float d) @inline
```
```c3
fn float bounce_out(float t, float b, float c, float d) @inline
```
```c3
fn float circ_in(float t, float b, float c, float d) @inline
```
```c3
fn float circ_inout(float t, float b, float c, float d) @inline
```
```c3
fn float circ_out(float t, float b, float c, float d) @inline
```
```c3
fn float cubic_in(float t, float b, float c, float d) @inline
```
```c3
fn float cubic_inout(float t, float b, float c, float d) @inline
```
```c3
fn float cubic_out(float t, float b, float c, float d) @inline
```
```c3
fn float elastic_in(float t, float b, float c, float d) @inline
```
```c3
fn float elastic_inout(float t, float b, float c, float d) @inline
```
```c3
fn float elastic_out(float t, float b, float c, float d) @inline
```
```c3
fn float expo_in(float t, float b, float c, float d) @inline
```
```c3
fn float expo_inout(float t, float b, float c, float d) @inline
```
```c3
fn float expo_out(float t, float b, float c, float d) @inline
```
```c3
fn float linear_in(float t, float b, float c, float d) @inline
```
```c3
fn float linear_inout(float t, float b, float c, float d) @inline
```
```c3
fn float linear_none(float t, float b, float c, float d) @inline
```
```c3
fn float linear_out(float t, float b, float c, float d) @inline
```
```c3
fn float quad_in(float t, float b, float c, float d) @inline
```
```c3
fn float quad_inout(float t, float b, float c, float d) @inline
```
```c3
fn float quad_out(float t, float b, float c, float d) @inline
```
```c3
fn float sine_in(float t, float b, float c, float d) @inline
```
```c3
fn float sine_inout(float t, float b, float c, float d) @inline
```
```c3
fn float sine_out(float t, float b, float c, float d) @inline
```
### std::math::matrix(&lt;Real&gt;)
```c3
struct Matrix2x2
```
```c3
struct Matrix3x3
```
```c3
struct Matrix4x4
```
```c3
fn Matrix2x2 Matrix2x2.add(&self, Matrix2x2 mat2)
```
```c3
fn Matrix2x2 Matrix2x2.adjoint(&self)
```
```c3
fn Real[<2>] Matrix2x2.apply(&self, Real[<2>] vec)
```
```c3
fn Matrix2x2 Matrix2x2.component_mul(&self, Real s)
```
```c3
fn Real Matrix2x2.determinant(&self)
```
```c3
fn Matrix2x2! Matrix2x2.inverse(&self)
```
```c3
fn Matrix2x2 Matrix2x2.mul(&self, Matrix2x2 b)
```
```c3
fn Matrix2x2 Matrix2x2.sub(&self, Matrix2x2 mat2)
```
```c3
fn Real Matrix2x2.trace(&self)
```
```c3
fn Matrix2x2 Matrix2x2.transpose(&self)
```
```c3
fn Matrix3x3 Matrix3x3.add(&self, Matrix3x3 mat2)
```
```c3
fn Matrix3x3 Matrix3x3.adjoint(&self)
```
```c3
fn Real[<3>] Matrix3x3.apply(&self, Real[<3>] vec)
```
```c3
fn Matrix3x3 Matrix3x3.component_mul(&self, Real s)
```
```c3
fn Real Matrix3x3.determinant(&self)
```
```c3
fn Matrix3x3! Matrix3x3.inverse(&self)
```
```c3
fn Matrix3x3 Matrix3x3.mul(&self, Matrix3x3 b)
```
```c3
fn Matrix3x3 Matrix3x3.rotate(&self, Real r)
```
```c3
fn Matrix3x3 Matrix3x3.scale(&self, Real[<2>] v)
```
```c3
fn Matrix3x3 Matrix3x3.sub(&self, Matrix3x3 mat2)
```
```c3
fn Real Matrix3x3.trace(&self)
```
```c3
fn Matrix3x3 Matrix3x3.translate(&self, Real[<2>] v)
```
```c3
fn Matrix3x3 Matrix3x3.transpose(&self)
```
```c3
fn Matrix4x4 Matrix4x4.add(&self, Matrix4x4 mat2)
```
```c3
fn Matrix4x4 Matrix4x4.adjoint(&self)
```
```c3
fn Real[<4>] Matrix4x4.apply(&self, Real[<4>] vec)
```
```c3
fn Matrix4x4 Matrix4x4.component_mul(&self, Real s)
```
```c3
fn Real Matrix4x4.determinant(&self)
```
```c3
fn Matrix4x4! Matrix4x4.inverse(&self)
```
```c3
fn Matrix4x4 Matrix4x4.mul(Matrix4x4* a, Matrix4x4 b)
```
```c3
fn Matrix4x4 Matrix4x4.rotate_x(&self, Real r)
```
```c3
fn Matrix4x4 Matrix4x4.rotate_y(&self, Real r)
```
```c3
fn Matrix4x4 Matrix4x4.rotate_z(&self, Real r)
```
```c3
fn Matrix4x4 Matrix4x4.scale(&self, Real[<3>] v)
```
```c3
fn Matrix4x4 Matrix4x4.sub(&self, Matrix4x4 mat2)
```
```c3
fn Real Matrix4x4.trace(&self)
```
```c3
fn Matrix4x4 Matrix4x4.translate(&self, Real[<3>] v)
```
```c3
fn Matrix4x4 Matrix4x4.transpose(&self)
```
```c3
fn Matrix4x4 ortho(Real left, Real right, Real top, Real bottom, Real near, Real far)
```
```c3
fn Matrix4x4 perspective(Real fov, Real aspect_ratio, Real near, Real far)
```
### std::math::nolibc
```c3
macro double __math_oflow(ulong sign)
```
```c3
macro float __math_oflowf(uint sign)
```
```c3
macro double __math_uflow(ulong sign)
```
```c3
macro float __math_uflowf(uint sign)
```
```c3
macro __math_xflow(sign, v)
```
```c3
macro force_eval_add(x, v)
```
### std::math::nolibc @if(env::NO_LIBC)
```c3
fn double __cos(double x, double y) @extern("__cos") @weak @nostrip
```
```c3
fn float __cosdf(double x) @extern("__cosdf") @weak @nostrip
```
```c3
fn int __rem_pio2(double x, double *y)
```
```c3
fn int __rem_pio2_large(double* x, double* y, int e0, int nx, int prec)
```
```c3
fn int __rem_pio2f(float x, double *y)
```
```c3
fn double __sin(double x, double y, int iy) @extern("__sin") @weak @nostrip
```
```c3
fn float __sindf(double x) @extern("__sindf") @weak @nostrip
```
```c3
fn double __tan(double x, double y, int odd) @extern("__tan") @weak @nostrip
```
```c3
fn float __tandf(double x, int odd) @extern("__tandf") @weak @nostrip
```
```c3
fn double _atan(double x) @weak @extern("atan") @nostrip
```
```c3
fn double _atan2(double y, double x) @weak @extern("atan2") @nostrip
```
```c3
fn float _atan2f(float y, float x) @weak @extern("atan2f") @nostrip
```
```c3
fn float _atanf(float x) @weak @extern("atanf") @nostrip
```
```c3
fn double _ceil(double x) @weak @extern("ceil") @nostrip
```
```c3
fn float _ceilf(float x) @weak @extern("ceilf") @nostrip
```
```c3
fn double _cos(double x) @weak @nostrip
```
```c3
fn float _cosf(float x) @extern("cosf") @weak @nostrip
```
```c3
fn double _exp2(double x) @extern("exp2") @weak @nostrip
```
```c3
fn float _exp2f(float x) @extern("exp2f") @weak @nostrip
```
```c3
fn double _floor(double x) @weak @extern("floor") @nostrip
```
```c3
fn float _floorf(float x) @weak @extern("floorf") @nostrip
```
```c3
fn double _round(double x) @extern("round") @weak @nostrip
```
```c3
fn float _roundf(float x) @extern("roundf") @weak @nostrip
```
```c3
fn double _scalbn(double x, int n) @weak @extern("scalbn") @nostrip
```
```c3
fn float _sinf(float x) @weak @extern("sinf") @nostrip
```
```c3
fn double _trunc(double x) @weak @extern("trunc") @nostrip
```
```c3
fn float _truncf(float x) @weak @extern("truncf") @nostrip
```
```c3
fn double pow_broken(double x, double y) @extern("pow") @weak @nostrip
```
```c3
fn float powf_broken(float x, float f) @extern("powf") @weak @nostrip
```
```c3
fn double sin(double x) @extern("sin") @weak @nostrip
```
```c3
fn void sincos(double x, double *sin, double *cos) @extern("sincos") @weak @nostrip
```
```c3
fn double sincos_broken(double x) @extern("sincos") @weak @nostrip
```
```c3
fn void sincosf(float x, float *sin, float *cos) @extern("sincosf") @weak @nostrip
```
```c3
fn double tan(double x) @extern("tan") @weak @nostrip
```
```c3
fn float tanf(float x) @extern("tanf") @weak @nostrip
```
### std::math::quaternion(&lt;Real&gt;)
```c3
macro Quaternion Quaternion.add(Quaternion a, Quaternion b)
```
```c3
macro Quaternion Quaternion.add_each(Quaternion a, Real b)
```
```c3
fn Quaternion Quaternion.invert(q)
```
```c3
macro Real Quaternion.length(Quaternion q)
```
```c3
macro Quaternion Quaternion.lerp(Quaternion q1, Quaternion q2, Real amount)
```
```c3
fn Quaternion Quaternion.mul(a, Quaternion b)
```
```c3
fn Quaternion Quaternion.nlerp(Quaternion q1, Quaternion q2, Real amount)
```
```c3
macro Quaternion Quaternion.normalize(Quaternion q)
```
```c3
macro Quaternion Quaternion.scale(Quaternion a, Real s)
```
```c3
fn Quaternion Quaternion.slerp(q1, Quaternion q2, Real amount)
```
```c3
macro Quaternion Quaternion.sub(Quaternion a, Quaternion b)
```
```c3
macro Quaternion Quaternion.sub_each(Quaternion a, Real b)
```
```c3
macro Matrix4 Quaternion.to_matrix(Quaternion* q)
```
```c3
macro Matrix4f Quaternion.to_matrixf(Quaternion* q)
```
### std::math::random
```c3
distinct Lcg128Random (Random) = uint128;
```
```c3
distinct Lcg16Random (Random) = ushort;
```
```c3
distinct Lcg32Random (Random) = uint;
```
```c3
distinct Lcg64Random (Random) = ulong;
```
```c3
distinct Mcg128Random (Random) = uint128;
```
```c3
distinct Mcg16Random (Random) = ushort;
```
```c3
distinct Mcg32Random (Random) = uint;
```
```c3
distinct Mcg64Random (Random) = ulong;
```
```c3
distinct Pcg128Random (Random) = uint128;
```
```c3
distinct Pcg16Random (Random) = ushort;
```
```c3
distinct Pcg32Random (Random) = uint;
```
```c3
distinct Pcg64Random (Random) = ulong;
```
```c3
distinct Sfc128Random (Random) = uint128[4];
```
```c3
distinct Sfc16Random (Random) = ushort[4];
```
```c3
distinct Sfc32Random (Random) = uint[4];
```
```c3
distinct Sfc64Random (Random) = ulong[4];
```
```c3
distinct Sfc8Random (Random) = char[4];
```
```c3
distinct SimpleRandom (Random) = ulong;
```
```c3
interface Random
```
```c3
struct Msws128Random (Random)
```
```c3
struct Msws16Random (Random)
```
```c3
struct Msws32Random (Random)
```
```c3
struct Msws64Random (Random)
```
```c3
struct Msws8Random (Random)
```
```c3
fn void  Msws16Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Msws32Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Msws64Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Msws8Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Pcg128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Sfc128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Sfc16Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Sfc32Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Sfc64Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn void  Sfc8Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char[8 * 4] entropy()
```
```c3
macro ushort @char_to_short(#function)
```
```c3
macro ulong @int_to_long(#function)
```
```c3
macro uint128 @long_to_int128(#function)
```
```c3
macro @random_value_to_bytes(#function, char[] bytes)
```
```c3
macro uint @short_to_int(#function)
```
```c3
fn char Lcg128Random.next_byte(&self) @dynamic
```
```c3
fn void Lcg128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Lcg128Random.next_int(&self) @dynamic
```
```c3
fn uint128 Lcg128Random.next_int128(&self) @dynamic
```
```c3
fn ulong Lcg128Random.next_long(&self) @dynamic
```
```c3
fn ushort Lcg128Random.next_short(&self) @dynamic
```
```c3
fn void Lcg128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Lcg16Random.next_byte(&self) @dynamic
```
```c3
fn void Lcg16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Lcg16Random.next_int(&self) @dynamic
```
```c3
fn uint128 Lcg16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Lcg16Random.next_long(&self) @dynamic
```
```c3
fn ushort Lcg16Random.next_short(&self) @dynamic
```
```c3
fn void Lcg16Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Lcg32Random.next_byte(&self) @dynamic
```
```c3
fn void Lcg32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Lcg32Random.next_int(&self) @dynamic
```
```c3
fn uint128 Lcg32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Lcg32Random.next_long(&self) @dynamic
```
```c3
fn ushort Lcg32Random.next_short(&self) @dynamic
```
```c3
fn void Lcg32Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Lcg64Random.next_byte(&self) @dynamic
```
```c3
fn void Lcg64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Lcg64Random.next_int(&self) @dynamic
```
```c3
fn uint128 Lcg64Random.next_int128(&self) @dynamic
```
```c3
fn ulong Lcg64Random.next_long(&self) @dynamic
```
```c3
fn ushort Lcg64Random.next_short(&self) @dynamic
```
```c3
fn void Lcg64Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Mcg128Random.next_byte(&self) @dynamic
```
```c3
fn void Mcg128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Mcg128Random.next_int(&self) @dynamic
```
```c3
fn uint128 Mcg128Random.next_int128(&self) @dynamic
```
```c3
fn ulong Mcg128Random.next_long(&self) @dynamic
```
```c3
fn ushort Mcg128Random.next_short(&self) @dynamic
```
```c3
fn void Mcg128Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Mcg16Random.next_byte(&self) @dynamic
```
```c3
fn void Mcg16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Mcg16Random.next_int(&self) @dynamic
```
```c3
fn uint128 Mcg16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Mcg16Random.next_long(&self) @dynamic
```
```c3
fn ushort Mcg16Random.next_short(&self) @dynamic
```
```c3
fn void Mcg16Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Mcg32Random.next_byte(&self) @dynamic
```
```c3
fn void Mcg32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Mcg32Random.next_int(&self) @dynamic
```
```c3
fn uint128 Mcg32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Mcg32Random.next_long(&self) @dynamic
```
```c3
fn ushort Mcg32Random.next_short(&self) @dynamic
```
```c3
fn void Mcg32Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Mcg64Random.next_byte(&self) @dynamic
```
```c3
fn void Mcg64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Mcg64Random.next_int(&self) @dynamic
```
```c3
fn uint128 Mcg64Random.next_int128(&self) @dynamic
```
```c3
fn ulong Mcg64Random.next_long(&self) @dynamic
```
```c3
fn ushort Mcg64Random.next_short(&self) @dynamic
```
```c3
fn void Mcg64Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Msws128Random.next_byte(&self) @dynamic
```
```c3
fn void Msws128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Msws128Random.next_int(&self) @dynamic
```
```c3
fn uint128 Msws128Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws128Random.next_long(&self) @dynamic
```
```c3
fn ushort Msws128Random.next_short(&self) @dynamic
```
```c3
fn void Msws128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Msws16Random.next_byte(&self) @dynamic
```
```c3
fn void Msws16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Msws16Random.next_int(&self) @dynamic
```
```c3
fn uint128 Msws16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws16Random.next_long(&self) @dynamic
```
```c3
fn ushort Msws16Random.next_short(&self) @dynamic
```
```c3
fn char Msws32Random.next_byte(&self) @dynamic
```
```c3
fn void Msws32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Msws32Random.next_int(&self) @dynamic
```
```c3
fn uint128 Msws32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws32Random.next_long(&self) @dynamic
```
```c3
fn ushort Msws32Random.next_short(&self) @dynamic
```
```c3
fn char Msws64Random.next_byte(&self) @dynamic
```
```c3
fn void Msws64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Msws64Random.next_int(&self) @dynamic
```
```c3
fn uint128 Msws64Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws64Random.next_long(&self) @dynamic
```
```c3
fn ushort Msws64Random.next_short(&self) @dynamic
```
```c3
fn char Msws8Random.next_byte(&self) @dynamic
```
```c3
fn void Msws8Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Msws8Random.next_int(&self) @dynamic
```
```c3
fn uint128 Msws8Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws8Random.next_long(&self) @dynamic
```
```c3
fn ushort Msws8Random.next_short(&self) @dynamic
```
```c3
fn char Pcg128Random.next_byte(&self) @dynamic
```
```c3
fn void Pcg128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Pcg128Random.next_int(&self) @dynamic
```
```c3
fn uint128 Pcg128Random.next_int128(&self) @dynamic
```
```c3
fn ulong Pcg128Random.next_long(&self) @dynamic
```
```c3
fn ushort Pcg128Random.next_short(&self) @dynamic
```
```c3
fn char Pcg16Random.next_byte(&self) @dynamic
```
```c3
fn void Pcg16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Pcg16Random.next_int(&self) @dynamic
```
```c3
fn uint128 Pcg16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Pcg16Random.next_long(&self) @dynamic
```
```c3
fn ushort Pcg16Random.next_short(&self) @dynamic
```
```c3
fn void Pcg16Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Pcg32Random.next_byte(&self) @dynamic
```
```c3
fn void Pcg32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Pcg32Random.next_int(&self) @dynamic
```
```c3
fn uint128 Pcg32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Pcg32Random.next_long(&self) @dynamic
```
```c3
fn ushort Pcg32Random.next_short(&self) @dynamic
```
```c3
fn void Pcg32Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Pcg64Random.next_byte(&self) @dynamic
```
```c3
fn void Pcg64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Pcg64Random.next_int(&self) @dynamic
```
```c3
fn uint128 Pcg64Random.next_int128(&self) @dynamic
```
```c3
fn ulong Pcg64Random.next_long(&self) @dynamic
```
```c3
fn ushort Pcg64Random.next_short(&self) @dynamic
```
```c3
fn void Pcg64Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Sfc128Random.next_byte(&self) @dynamic
```
```c3
fn void Sfc128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Sfc128Random.next_int(&self) @dynamic
```
```c3
fn uint128 Sfc128Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc128Random.next_long(&self) @dynamic
```
```c3
fn ushort Sfc128Random.next_short(&self) @dynamic
```
```c3
fn char Sfc16Random.next_byte(&self) @dynamic
```
```c3
fn void Sfc16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Sfc16Random.next_int(&self) @dynamic
```
```c3
fn uint128 Sfc16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc16Random.next_long(&self) @dynamic
```
```c3
fn ushort Sfc16Random.next_short(&seed) @dynamic
```
```c3
fn char Sfc32Random.next_byte(&self) @dynamic
```
```c3
fn void Sfc32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Sfc32Random.next_int(&sfc) @dynamic
```
```c3
fn uint128 Sfc32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc32Random.next_long(&self) @dynamic
```
```c3
fn ushort Sfc32Random.next_short(&self) @dynamic
```
```c3
fn char Sfc64Random.next_byte(&self) @dynamic
```
```c3
fn void Sfc64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Sfc64Random.next_int(&self) @dynamic
```
```c3
fn uint128 Sfc64Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc64Random.next_long(&self) @dynamic
```
```c3
fn ushort Sfc64Random.next_short(&self) @dynamic
```
```c3
fn char Sfc8Random.next_byte(&self) @dynamic
```
```c3
fn void Sfc8Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint Sfc8Random.next_int(&self) @dynamic
```
```c3
fn uint128 Sfc8Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc8Random.next_long(&self) @dynamic
```
```c3
fn ushort Sfc8Random.next_short(&self) @dynamic
```
```c3
fn char SimpleRandom.next_byte(&self) @dynamic
```
```c3
fn void SimpleRandom.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint SimpleRandom.next_int(&self) @dynamic
```
```c3
fn uint128 SimpleRandom.next_int128(&self) @dynamic
```
```c3
fn ulong SimpleRandom.next_long(&self) @dynamic
```
```c3
fn ushort SimpleRandom.next_short(&self) @dynamic
```
```c3
fn void SimpleRandom.set_seed(&self, char[] seed) @dynamic
```
```c3
macro bool is_random(random)
```
```c3
macro make_seed($Type, char[] input)
```
```c3
macro int next(random, int max)
```
```c3
macro void next_bool(random)
```
```c3
macro double next_double(random)
```
```c3
macro float next_float(random)
```
```c3
fn int rand(int max) @builtin
```
```c3
macro void seed(random, seed)
```
```c3
macro void seed_entropy(random)
```
```c3
fn void seeder(char[] input, char[] out_buffer)
```
### std::math::vector
```c3
macro Vec2.angle(self, Vec2 v2)
```
```c3
macro Vec2.clamp_mag(self, double min, double max)
```
```c3
macro Vec2.distance_sq(self, Vec2 v2)
```
```c3
macro Vec2.length_sq(self)
```
```c3
macro Vec2.rotate(self, double angle)
```
```c3
fn Vec2 Vec2.towards(self, Vec2 target, double max_distance)
```
```c3
macro Vec2.transform(self, Matrix4 mat)
```
```c3
macro Vec2f.angle(self, Vec2f v2)
```
```c3
macro Vec2f.clamp_mag(self, float min, float max)
```
```c3
macro Vec2f.distance_sq(self, Vec2f v2)
```
```c3
macro Vec2f.length_sq(self)
```
```c3
macro Vec2f.rotate(self, float angle)
```
```c3
fn Vec2f Vec2f.towards(self, Vec2f target, float max_distance)
```
```c3
macro Vec2f.transform(self, Matrix4f mat)
```
```c3
fn double Vec3.angle(self, Vec3 v2)
```
```c3
fn Vec3 Vec3.barycenter(self, Vec3 a, Vec3 b, Vec3 c)
```
```c3
macro Vec3.clamp_mag(self, double min, double max)
```
```c3
fn Vec3 Vec3.cross(self, Vec3 v2)
```
```c3
macro Vec3.distance_sq(self, Vec3 v2)
```
```c3
macro Vec3.length_sq(self)
```
```c3
fn Vec3 Vec3.perpendicular(self)
```
```c3
fn Vec3 Vec3.refract(self, Vec3 n, double r)
```
```c3
fn Vec3 Vec3.rotate_axis(self, Vec3 axis, double angle)
```
```c3
fn Vec3 Vec3.rotate_quat(self, Quaternion q)
```
```c3
fn Vec3 Vec3.towards(self, Vec3 target, double max_distance)
```
```c3
fn Vec3 Vec3.transform(self, Matrix4 mat)
```
```c3
fn Vec3 Vec3.unproject(self, Matrix4 projection, Matrix4 view)
```
```c3
fn float Vec3f.angle(self, Vec3f v2)
```
```c3
fn Vec3f Vec3f.barycenter(self, Vec3f a, Vec3f b, Vec3f c)
```
```c3
macro Vec3f.clamp_mag(self, float min, float max)
```
```c3
fn Vec3f Vec3f.cross(self, Vec3f v2)
```
```c3
macro Vec3f.distance_sq(self, Vec3f v2)
```
```c3
macro Vec3f.length_sq(self)
```
```c3
fn Vec3f Vec3f.perpendicular(self)
```
```c3
fn Vec3f Vec3f.refract(self, Vec3f n, float r)
```
```c3
fn Vec3f Vec3f.rotate_axis(self, Vec3f axis, float angle)
```
```c3
fn Vec3f Vec3f.rotate_quat(self, Quaternionf q)
```
```c3
fn Vec3f Vec3f.towards(self, Vec3f target, float max_distance)
```
```c3
fn Vec3f Vec3f.transform(self, Matrix4f mat)
```
```c3
fn Vec3f Vec3f.unproject(self, Matrix4f projection, Matrix4f view)
```
```c3
macro Vec4.clamp_mag(self, double min, double max)
```
```c3
macro Vec4.distance_sq(self, Vec4 v2)
```
```c3
macro Vec4.length_sq(self)
```
```c3
fn Vec4 Vec4.towards(self, Vec4 target, double max_distance)
```
```c3
macro Vec4f.clamp_mag(self, float min, float max)
```
```c3
macro Vec4f.distance_sq(self, Vec4f v2)
```
```c3
macro Vec4f.length_sq(self)
```
```c3
fn Vec4f Vec4f.towards(self, Vec4f target, float max_distance)
```
```c3
fn Matrix4 matrix4_look_at(Vec3 eye, Vec3 target, Vec3 up)
```
```c3
fn Matrix4f matrix4f_look_at(Vec3f eye, Vec3f target, Vec3f up)
```
```c3
fn void ortho_normalize(Vec3f* v1, Vec3f* v2)
```
```c3
fn void ortho_normalized(Vec3* v1, Vec3* v2)
```
### std::net
```c3
enum IpProtocol : char (AIFamily ai_family)
```
```c3
fault NetError
```
```c3
struct InetAddress (Printable)
```
```c3
fn bool InetAddress.is_any_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_link_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_loopback(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_global(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_link_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_node_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_org_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_site_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_site_local(InetAddress* addr)
```
```c3
fn usz! InetAddress.to_format(InetAddress* addr, Formatter* formatter) @dynamic
```
```c3
fn String InetAddress.to_new_string(InetAddress* addr, Allocator allocator = allocator::heap()) @dynamic
```
```c3
fn AddrInfo*! addrinfo(String host, uint port, AIFamily ai_family, AISockType ai_socktype) @if(os::SUPPORTS_INET)
```
```c3
fn String! int_to_new_ipv4(uint val, Allocator allocator = allocator::heap())
```
```c3
fn String! int_to_temp_ipv4(uint val)
```
```c3
fn InetAddress! ipv4_from_str(String s)
```
```c3
fn uint! ipv4toint(String s)
```
```c3
fn InetAddress! ipv6_from_str(String s)
```
### std::net @if(os::SUPPORTS_INET)
```c3
distinct PollEvents = ushort;
```
```c3
distinct PollSubscribes = ushort;
```
```c3
enum SocketOption : char (CInt value)
```
```c3
struct Poll
```
```c3
struct Socket (InStream, OutStream)
```
```c3
macro void @loop_over_ai(AddrInfo* ai; @body(NativeSocket fd, AddrInfo* ai))
```
```c3
fn void! Socket.close(&self) @inline @dynamic
```
```c3
fn void! Socket.destroy(&self) @dynamic
```
```c3
fn bool! Socket.get_broadcast(&self)
```
```c3
fn bool! Socket.get_dontroute(&self)
```
```c3
fn bool! Socket.get_keepalive(&self)
```
```c3
fn bool! Socket.get_oobinline(&self)
```
```c3
fn bool! Socket.get_option(&self, SocketOption option)
```
```c3
fn bool! Socket.get_reuseaddr(&self)
```
```c3
fn usz! Socket.read(&self, char[] bytes) @dynamic
```
```c3
fn char! Socket.read_byte(&self) @dynamic
```
```c3
fn void! Socket.set_broadcast(&self, bool value)
```
```c3
fn void! Socket.set_dontroute(&self, bool value)
```
```c3
fn void! Socket.set_keepalive(&self, bool value)
```
```c3
fn void! Socket.set_oobinline(&self, bool value)
```
```c3
fn void! Socket.set_option(&self, SocketOption option, bool value)
```
```c3
fn void! Socket.set_reuseaddr(&self, bool value)
```
```c3
fn usz! Socket.write(&self, char[] bytes) @dynamic
```
```c3
fn void! Socket.write_byte(&self, char byte) @dynamic
```
```c3
macro Socket new_socket(fd, ai)
```
```c3
fn ulong! poll(Poll[] polls, Duration timeout)
```
```c3
fn ulong! poll_ms(Poll[] polls, long timeout_ms)
```
### std::net::os
```c3
distinct AIFamily = CInt;
```
```c3
distinct AIFlags = CInt;
```
```c3
distinct AIProtocol = CInt;
```
```c3
distinct AISockType = CInt;
```
```c3
distinct SockAddrPtr = void*;
```
```c3
struct AddrInfo
```
### std::net::os @if(env::POSIX &amp;&amp; SUPPORTS_INET)
```c3
distinct NativeSocket = inline Fd;
```
```c3
struct Posix_pollfd
```
```c3
macro void! NativeSocket.close(self)
```
```c3
macro bool NativeSocket.is_non_blocking(self)
```
```c3
macro void! NativeSocket.set_non_blocking(self, bool non_blocking)
```
```c3
fn anyfault convert_error(Errno error)
```
```c3
fn anyfault socket_error()
```
### std::net::os @if(env::WIN32)
```c3
distinct NativeSocket = uptr;
```
```c3
macro void! NativeSocket.close(self)
```
```c3
fn void! NativeSocket.set_non_blocking(self, bool non_blocking)
```
```c3
fn anyfault convert_error(WSAError error)
```
```c3
fn anyfault socket_error()
```
### std::net::tcp @if(os::SUPPORTS_INET)
```c3
distinct TcpServerSocket = inline Socket;
```
```c3
distinct TcpSocket = inline Socket;
```
```c3
fn TcpSocket! accept(TcpServerSocket* server_socket)
```
```c3
fn TcpSocket! connect(String host, uint port, Duration timeout = 0, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn TcpSocket! connect_async(String host, uint port, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn TcpSocket! connect_async_to(AddrInfo* ai, SocketOption... options)
```
```c3
fn TcpSocket! connect_to(AddrInfo* ai, SocketOption... options)
```
```c3
fn TcpServerSocket! listen(String host, uint port, uint backlog, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn TcpServerSocket! listen_to(AddrInfo* ai, uint backlog, SocketOption... options)
```
### std::net::udp @if(os::SUPPORTS_INET)
```c3
distinct UdpSocket = inline Socket;
```
```c3
fn UdpSocket! connect(String host, uint port, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn UdpSocket! connect_async(String host, uint port, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn UdpSocket! connect_async_to(AddrInfo* ai, SocketOption... options)
```
```c3
fn UdpSocket! connect_to(AddrInfo* ai, SocketOption... options)
```
### std::os @if(env::DARWIN)
```c3
fn uint num_cpu()
```
### std::os @if(env::LINUX)
```c3
fn uint num_cpu()
```
### std::os @if(env::WIN32)
```c3
fn uint num_cpu()
```
### std::os::backtrace
```c3
fault BacktraceFault
```
```c3
struct Backtrace (Printable)
```
```c3
fn void Backtrace.free(&self)
```
```c3
fn bool Backtrace.has_file(&self)
```
```c3
fn Backtrace* Backtrace.init(&self, uptr offset, String function, String object_file, String file = "", uint line = 0, Allocator allocator)
```
```c3
fn bool Backtrace.is_unknown(&self)
```
```c3
fn usz! Backtrace.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn void*[] capture_current(void*[] buffer)
```
```c3
fn BacktraceList! symbolize_backtrace(void*[] backtrace, Allocator allocator) @if(!env::NATIVE_STACKTRACE)
```
### std::os::darwin @if(env::DARWIN)
```c3
struct Darwin_Dl_info
```
```c3
struct Darwin_segment_command_64
```
```c3
fn String! executable_path(Allocator allocator)
```
```c3
fn BacktraceList! symbolize_backtrace(void*[] backtrace, Allocator allocator)
```
### std::os::env
```c3
fn bool clear_var(String name)
```
```c3
fn String! executable_path(Allocator allocator = allocator::heap())
```
```c3
fn Path! get_config_dir(Allocator allocator = allocator::heap())
```
```c3
fn String! get_home_dir(Allocator using = allocator::heap())
```
```c3
fn String! get_var(String name, Allocator allocator = allocator::heap())
```
```c3
fn String! get_var_temp(String name)
```
```c3
fn bool set_var(String name, String value, bool overwrite = true)
```
### std::os::linux @if(env::LINUX)
```c3
struct Elf32_Ehdr
```
```c3
struct Elf32_Phdr
```
```c3
struct Elf64_Ehdr
```
```c3
struct Elf64_Phdr
```
```c3
struct Linux_Dl_info
```
```c3
fn BacktraceList! symbolize_backtrace(void*[] backtrace, Allocator allocator)
```
### std::os::macos::cf @if(env::DARWIN) @link(env::DARWIN, "CoreFoundation.framework")
```c3
distinct CFAllocatorContextRef = void*;
```
```c3
distinct CFAllocatorRef = void*;
```
```c3
distinct CFArrayCallBacksRef = void*;
```
```c3
distinct CFArrayRef = void*;
```
```c3
distinct CFMutableArrayRef = void*;
```
```c3
distinct CFTypeRef = void*;
```
```c3
struct CFRange
```
```c3
macro void* CFAllocatorRef.alloc(CFAllocatorRef allocator, usz size)
```
```c3
macro void CFAllocatorRef.dealloc(CFAllocatorRef allocator, void* ptr)
```
```c3
macro usz CFAllocatorRef.get_preferred_size(CFAllocatorRef allocator, usz req_size)
```
```c3
macro void CFAllocatorRef.set_default(CFAllocatorRef allocator)
```
```c3
macro CFAllocatorRef default_allocator()
```
### std::os::macos::objc @if(env::DARWIN) @link(env::DARWIN, "CoreFoundation.framework")
```c3
distinct Class = void*;
```
```c3
distinct Ivar = void*;
```
```c3
distinct Method = void*;
```
```c3
distinct Selector = void*;
```
```c3
fault ObjcFailure
```
```c3
macro bool Class.equals(Class a, Class b)
```
```c3
macro Method Class.method(Class cls, Selector name)
```
```c3
macro ZString Class.name(Class cls)
```
```c3
macro bool Class.responds_to(Class cls, Selector sel)
```
```c3
macro Class Class.superclass(Class cls)
```
```c3
macro bool Selector.equals(Selector a, Selector b)
```
```c3
macro Class! class_by_name(ZString c)
```
```c3
macro Class[] class_get_list(Allocator allocator = allocator::heap())
```
### std::os::posix @if(env::POSIX)
```c3
distinct DIRPtr = void*;
```
```c3
distinct Pthread_t = void*;
```
```c3
struct Posix_dirent
```
```c3
struct Posix_spawn_file_actions_t
```
```c3
struct Posix_spawnattr_t
```
```c3
fn CInt backtrace(void** buffer, CInt size)
```
```c3
macro CInt wEXITSTATUS(CInt status)
```
```c3
macro bool wIFCONTINUED(CInt status)
```
```c3
macro bool wIFEXITED(CInt status)
```
```c3
macro bool wIFSIGNALED(CInt status)
```
```c3
macro bool wIFSTOPPED(CInt status)
```
```c3
macro CInt wSTOPSIG(CInt status)
```
```c3
macro CInt wTERMSIG(CInt status)
```
```c3
macro CInt wWCOREDUMP(CInt status)
```
```c3
macro CInt w_EXITCODE(CInt ret, CInt sig)
```
```c3
macro CInt w_STOPCODE(CInt sig)
```
### std::os::process @if(env::WIN32 || env::POSIX)
```c3
fault SubProcessResult
```
```c3
struct SubProcess
```
```c3
fn bool SubProcess.destroy(&self)
```
```c3
fn bool! SubProcess.is_running(&self)
```
```c3
fn CInt! SubProcess.join(&self) @if(env::POSIX)
```
```c3
fn CInt! SubProcess.join(&self) @if(env::WIN32)
```
```c3
fn usz! SubProcess.read_stderr(&self, char* buffer, usz size)
```
```c3
fn usz! SubProcess.read_stdout(&self, char* buffer, usz size)
```
```c3
fn File SubProcess.stdout(&self)
```
```c3
fn void! SubProcess.terminate(&self)
```
```c3
fn SubProcess! create(String[] command_line, SubProcessOptions options = {}, String[] environment = {}) @if(env::POSIX)
```
```c3
fn SubProcess! create(String[] command_line, SubProcessOptions options = {}, String[] environment = {}) @if(env::WIN32)
```
```c3
fn String! execute_stdout_to_buffer(char[] buffer, String[] command_line, SubProcessOptions options = {}, String[] environment = {})
```
### std::os::win32
```c3
distinct Win32_CRITICAL_SECTION = ulong[5];
```
```c3
enum Win32_ADDRESS_MODE
```
```c3
enum Win32_SYM_TYPE
```
```c3
struct Win32_ADDRESS64
```
```c3
struct Win32_AMD64_CONTEXT @align(16)
```
```c3
struct Win32_ARM64_NT_CONTEXT @align(16)
```
```c3
struct Win32_ARM64_NT_NEON128
```
```c3
struct Win32_FILETIME
```
```c3
struct Win32_GUID
```
```c3
struct Win32_IMAGEHLP_LINE64
```
```c3
struct Win32_IMAGEHLP_MODULE64
```
```c3
struct Win32_IMAGE_DATA_DIRECTORY
```
```c3
struct Win32_IMAGE_FILE_HEADER
```
```c3
struct Win32_IMAGE_NT_HEADERS
```
```c3
struct Win32_IMAGE_OPTIONAL_HEADER64
```
```c3
struct Win32_KDHELP64
```
```c3
struct Win32_M128A @align(16)
```
```c3
struct Win32_MODLOAD_DATA
```
```c3
struct Win32_MODULEINFO
```
```c3
struct Win32_OVERLAPPED
```
```c3
struct Win32_PROCESS_INFORMATION
```
```c3
struct Win32_SECURITY_ATTRIBUTES
```
```c3
struct Win32_STACKFRAME64
```
```c3
struct Win32_STARTUPINFOEXW
```
```c3
struct Win32_STARTUPINFOW
```
```c3
struct Win32_SYMBOL_INFO
```
```c3
struct Win32_SYSTEM_INFO
```
```c3
struct Win32_UNICODE_STRING
```
```c3
struct Win32_XMM_SAVE_AREA32
```
### std::os::win32 @if(env::WIN32)
```c3
distinct WSAError = int;
```
```c3
enum Win32_GET_FILEEX_INFO_LEVELS
```
```c3
struct Symbol
```
```c3
struct Win32_FILE_ATTRIBUTE_DATA
```
```c3
struct Win32_WIN32_FIND_DATAW
```
```c3
struct Win32_pollfd
```
```c3
fn Win32_DWORD! load_modules()
```
```c3
fn Backtrace! resolve_backtrace(void* addr, Win32_HANDLE process, Allocator allocator)
```
```c3
fn BacktraceList! symbolize_backtrace(void*[] backtrace, Allocator allocator)
```
### std::sort
```c3
macro bool @is_comparer(#cmp, #list)
```
```c3
macro usz @len_from_list(&list)
```
```c3
macro usz binarysearch(list, x, cmp = null) @builtin
```
```c3
macro quicksort(list, cmp = null) @builtin
```
### std::sort::qs(&lt;Type, Comparer&gt;)
```c3
fn void qsort(Type list, isz low, isz high, Comparer cmp)
```
### std::thread
```c3
distinct ConditionVariable = NativeConditionVariable;
```
```c3
distinct Mutex = NativeMutex;
```
```c3
distinct MutexType = int;
```
```c3
distinct OnceFlag = NativeOnceFlag;
```
```c3
distinct RecursiveMutex = inline Mutex;
```
```c3
distinct Thread = NativeThread;
```
```c3
distinct TimedMutex = inline Mutex;
```
```c3
distinct TimedRecursiveMutex = inline Mutex;
```
```c3
fault ThreadFault
```
```c3
macro void! ConditionVariable.broadcast(&cond)
```
```c3
macro void! ConditionVariable.destroy(&cond)
```
```c3
macro void! ConditionVariable.init(&cond)
```
```c3
macro void! ConditionVariable.signal(&cond)
```
```c3
macro void! ConditionVariable.wait(&cond, Mutex* mutex)
```
```c3
macro void! ConditionVariable.wait_timeout(&cond, Mutex* mutex, ulong timeout)
```
```c3
macro void! Mutex.destroy(&mutex)
```
```c3
macro void! Mutex.init(&mutex)
```
```c3
macro void! Mutex.lock(&mutex)
```
```c3
macro bool Mutex.try_lock(&mutex)
```
```c3
macro void! Mutex.unlock(&mutex)
```
```c3
macro void OnceFlag.call(&flag, OnceFn func)
```
```c3
macro void! RecursiveMutex.init(&mutex)
```
```c3
macro void! Thread.create(&thread, ThreadFn thread_fn, void* arg)
```
```c3
macro void! Thread.detach(thread)
```
```c3
macro bool Thread.equals(thread, Thread other)
```
```c3
macro int! Thread.join(thread)
```
```c3
macro void! TimedMutex.init(&mutex)
```
```c3
macro void! TimedMutex.lock_timeout(&mutex, ulong ms)
```
```c3
macro void! TimedRecursiveMutex.init(&mutex)
```
```c3
macro void! TimedRecursiveMutex.lock_timeout(&mutex, ulong ms)
```
```c3
macro Thread current()
```
```c3
macro void exit(int result)
```
```c3
macro void! sleep(Duration d) @maydiscard
```
```c3
macro void! sleep_ms(ulong ms) @maydiscard  
```
```c3
macro void! sleep_ns(NanoDuration ns) @maydiscard  
```
```c3
macro void yield()
```
### std::thread::cpu @if(env::DARWIN)
```c3
fn uint native_cpu()
```
### std::thread::cpu @if(env::LINUX)
```c3
fn uint native_cpu()
```
### std::thread::cpu @if(env::WIN32)
```c3
fn uint native_cpu()
```
### std::thread::os @if (!env::POSIX &amp;&amp; !env::WIN32)
```c3
distinct NativeConditionVariable = int;
```
```c3
distinct NativeMutex = int;
```
```c3
distinct NativeOnceFlag = int;
```
```c3
distinct NativeThread = int;
```
### std::thread::os @if(env::LINUX)
```c3
distinct Pthread_attr_t = ulong[7]; // 24 on 32bit
```
```c3
distinct Pthread_cond_t = ulong[6];
```
```c3
distinct Pthread_condattr_t = uint;
```
```c3
distinct Pthread_key_t = uint;
```
```c3
distinct Pthread_mutex_t = ulong[5]; // 24 on 32 bit
```
```c3
distinct Pthread_mutexattr_t = uint;
```
```c3
distinct Pthread_once_t = int;
```
```c3
distinct Pthread_rwlock_t = ulong[7]; // 32 on 3bit
```
```c3
distinct Pthread_rwlockattr_t = uint;
```
```c3
distinct Pthread_sched_param = uint;
```
### std::thread::os @if(env::POSIX &amp;&amp; !env::LINUX)
```c3
distinct Pthread_attr_t = ulong[8];
```
```c3
distinct Pthread_cond_t = ulong[6];
```
```c3
distinct Pthread_condattr_t = ulong[8];
```
```c3
distinct Pthread_key_t = ulong;
```
```c3
distinct Pthread_mutex_t = ulong[8];
```
```c3
distinct Pthread_mutexattr_t = ulong[2];
```
```c3
distinct Pthread_once_t = ulong[2];
```
```c3
distinct Pthread_rwlock_t = ulong[25];
```
```c3
distinct Pthread_rwlockattr_t = ulong[3];
```
```c3
distinct Pthread_sched_param = ulong;
```
### std::thread::os @if(env::POSIX)
```c3
struct NativeMutex
```
```c3
fn void! NativeConditionVariable.broadcast(&cond)
```
```c3
fn void! NativeConditionVariable.destroy(&cond)
```
```c3
fn void! NativeConditionVariable.init(&cond)
```
```c3
fn void! NativeConditionVariable.signal(&cond)
```
```c3
fn void! NativeConditionVariable.wait(&cond, NativeMutex* mtx)
```
```c3
fn void! NativeConditionVariable.wait_timeout(&cond, NativeMutex* mtx, ulong ms)
```
```c3
fn void! NativeMutex.destroy(&self)
```
```c3
fn void! NativeMutex.init(&self, MutexType type)
```
```c3
fn bool NativeMutex.is_initialized(&self)
```
```c3
fn void! NativeMutex.lock(&self)
```
```c3
fn void! NativeMutex.lock_timeout(&self, ulong ms)
```
```c3
fn bool NativeMutex.try_lock(&self)
```
```c3
fn void! NativeMutex.unlock(&self)
```
```c3
fn void NativeOnceFlag.call_once(&flag, OnceFn func)
```
```c3
fn void! NativeThread.create(&thread, ThreadFn thread_fn, void* arg)
```
```c3
fn void! NativeThread.detach(thread)
```
```c3
fn bool NativeThread.equals(thread, NativeThread other)
```
```c3
fn int! NativeThread.join(thread)
```
```c3
fn void! native_sleep_nano(NanoDuration nano)
```
```c3
fn NativeThread native_thread_current()
```
```c3
fn void native_thread_exit(int result)
```
```c3
fn void native_thread_yield()
```
### std::thread::os @if(env::WIN32)
```c3
distinct NativeThread = inline Win32_HANDLE;
```
```c3
struct NativeConditionVariable
```
```c3
struct NativeMutex
```
```c3
struct NativeOnceFlag
```
```c3
fn void! NativeConditionVariable.broadcast(&cond)
```
```c3
fn void! NativeConditionVariable.destroy(&cond) @maydiscard
```
```c3
fn void! NativeConditionVariable.init(&cond)
```
```c3
fn void! NativeConditionVariable.signal(&cond)
```
```c3
fn void! NativeConditionVariable.wait(&cond, NativeMutex* mtx) @inline
```
```c3
fn void! NativeConditionVariable.wait_timeout(&cond, NativeMutex* mtx, uint time) @inline
```
```c3
fn void! NativeMutex.destroy(&mtx)
```
```c3
fn void! NativeMutex.init(&mtx, MutexType type)
```
```c3
fn void! NativeMutex.lock(&mtx)
```
```c3
fn void! NativeMutex.lock_timeout(&mtx, usz ms)
```
```c3
fn bool NativeMutex.try_lock(&mtx)
```
```c3
fn void! NativeMutex.unlock(&mtx)
```
```c3
fn void NativeOnceFlag.call_once(&flag, OnceFn func)
```
```c3
fn void! NativeThread.create(&thread, ThreadFn func, void* args)
```
```c3
fn void! NativeThread.detach(thread) @inline
```
```c3
fn bool NativeThread.equals(thread, NativeThread other)
```
```c3
fn int! NativeThread.join(thread)
```
```c3
fn void! native_sleep_nano(NanoDuration ns)
```
```c3
fn NativeThread native_thread_current()
```
```c3
fn void native_thread_exit(int result) @inline
```
```c3
fn void native_thread_yield()
```
### std::thread::pool(&lt;SIZE&gt;)
```c3
struct QueueItem
```
```c3
struct ThreadPool
```
```c3
fn void! ThreadPool.destroy(&self)
```
```c3
fn void! ThreadPool.init(&self)
```
```c3
fn void! ThreadPool.push(&self, ThreadFn func, void* arg)
```
```c3
fn void! ThreadPool.stop_and_destroy(&self)
```
### std::time
```c3
distinct Clock = ulong;
```
```c3
distinct Duration = long;
```
```c3
distinct NanoDuration (Printable) = long;
```
```c3
distinct Time = long;
```
```c3
enum Month : char
```
```c3
enum Weekday : char
```
```c3
struct DateTime
```
```c3
struct TzDateTime
```
```c3
fn long Duration.to_ms(td)
```
```c3
fn NanoDuration Duration.to_nano(td)
```
```c3
fn Duration NanoDuration.to_duration(nd)
```
```c3
fn usz! NanoDuration.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn long NanoDuration.to_ms(nd)
```
```c3
fn double NanoDuration.to_sec(nd)
```
```c3
fn Time Time.add_days(time, long days)
```
```c3
fn Time Time.add_duration(time, Duration duration)
```
```c3
fn Time Time.add_hours(time, long hours)
```
```c3
fn Time Time.add_minutes(time, long minutes)
```
```c3
fn Time Time.add_seconds(time, long seconds)
```
```c3
fn Time Time.add_weeks(time, long weeks)
```
```c3
fn double Time.diff_days(time, Time other)
```
```c3
fn double Time.diff_hour(time, Time other)
```
```c3
fn double Time.diff_min(time, Time other)
```
```c3
fn double Time.diff_sec(time, Time other)
```
```c3
fn Duration Time.diff_us(time, Time other)
```
```c3
fn double Time.diff_weeks(time, Time other)
```
```c3
fn double Time.to_seconds(time)
```
```c3
fn Duration from_float(double s) @inline
```
```c3
fn Duration hour(long l) @inline
```
```c3
fn Duration min(long l) @inline
```
```c3
fn Duration ms(long l) @inline
```
```c3
fn Time now()
```
```c3
fn Duration sec(long l) @inline
```
### std::time::clock
```c3
fn NanoDuration Clock.mark(&self)
```
```c3
fn NanoDuration Clock.to_now(self)
```
```c3
fn Clock now()
```
### std::time::datetime @if(env::LIBC)
```c3
fn DateTime DateTime.add_days(&self, int days)
```
```c3
fn DateTime DateTime.add_hours(&self, int hours)
```
```c3
fn DateTime DateTime.add_minutes(&self, int minutes)
```
```c3
fn DateTime DateTime.add_months(&self, int months)
```
```c3
fn DateTime DateTime.add_seconds(&self, int seconds)
```
```c3
fn DateTime DateTime.add_weeks(&self, int weeks)
```
```c3
fn DateTime DateTime.add_years(&self, int years)
```
```c3
fn bool DateTime.after(&self, DateTime compare) @inline
```
```c3
fn bool DateTime.before(&self, DateTime compare) @inline
```
```c3
fn int DateTime.compare_to(&self, DateTime compare)
```
```c3
fn double DateTime.diff_sec(self, DateTime from)
```
```c3
fn Duration DateTime.diff_us(self, DateTime from)
```
```c3
fn int DateTime.diff_years(&self, DateTime from)
```
```c3
fn void DateTime.set_date(&self, int year, Month month = JANUARY, int day = 1, int hour = 0, int min = 0, int sec = 0, int us = 0)
```
```c3
fn void DateTime.set_time(&self, Time time)
```
```c3
fn TzDateTime DateTime.to_local(&self)
```
```c3
fn Time DateTime.to_time(&self) @inline
```
```c3
fn DateTime from_date(int year, Month month = JANUARY, int day = 1, int hour = 0, int min = 0, int sec = 0, int us = 0)
```
```c3
fn DateTime from_time(Time time)
```
```c3
fn DateTime now()
```
### std::time::os @if(env::DARWIN)
```c3
struct Darwin_mach_timebase_info
```
```c3
fn Clock native_clock()
```
### std::time::os @if(env::POSIX)
```c3
fn Clock native_clock() @if(!env::DARWIN)
```
```c3
fn Time native_timestamp()
```
### std::time::os @if(env::WIN32)
```c3
fn Clock native_clock()
```
```c3
fn Time native_timestamp()
```
