---
title: Standard Library Reference
description: Standard Library Reference
sidebar:
    order: 141
---
### `libc`
```c3
alias WChar @if(env::WIN32) = Char16
```
```c3
alias WChar @if(!env::WIN32) = Char32
```
```c3
struct DivResult
```
```c3
struct LongDivResult
```
```c3
struct Fpos_t @if(!env::WIN32)
```
```c3
struct Mbstate_t @if(!env::WIN32)
```
```c3
fn Errno errno()
```
```c3
fn void errno_set(Errno e)
```
```c3
typedef Errno = inline CInt
```
```c3
alias TerminateFunction = fn void()
```
```c3
alias CompareFunction = fn int(void*, void*)
```
```c3
alias JmpBuf = uptr[$$JMP_BUF_SIZE]
```
```c3
alias Fd = CInt
```
```c3
alias Fpos_t @if(env::WIN32) = long
```
```c3
alias SignalFunction = fn void(CInt)
```
```c3
alias Time_t = $typefrom(env::WIN32 ? long.typeid : CLong.typeid)
```
```c3
alias Off_t = $typefrom(env::WIN32 ? int.typeid : usz.typeid)
```
```c3
alias CFile = void*
```
```c3
macro bool libc_S_ISTYPE(value, mask) @builtin
```
```c3
alias SeekIndex = CLong
```
```c3
struct Tm
```
```c3
struct TimeSpec
```
```c3
alias Clock_t @if(env::WIN32) = int
```
```c3
alias Clock_t @if(!env::WIN32) = CLong
```
```c3
alias TimeOffset @if(env::WASI) = int
```
```c3
alias TimeOffset @if(!env::WASI) = CLong
```
```c3
fn TimeSpec NanoDuration.to_timespec(self) @inline
```
```c3
fn TimeSpec Duration.to_timespec(self) @inline
```
```c3
fn TimeSpec Time.to_timespec(self) @inline
```
### `libc @if(!env::LIBC)`
```c3
fn void longjmp(JmpBuf* buffer, CInt value) @weak @cname("longjmp") @nostrip
```
```c3
fn CInt setjmp(JmpBuf* buffer) @weak @cname("setjmp") @nostrip
```
```c3
fn void* malloc(usz size) @weak @cname("malloc") @nostrip
```
```c3
fn void* calloc(usz count, usz size) @weak @cname("calloc") @nostrip
```
```c3
fn void* free(void*) @weak @cname("free")
```
```c3
fn void* realloc(void* ptr, usz size) @weak @cname("realloc") @nostrip
```
```c3
fn void* memcpy(void* dest, void* src, usz n) @weak @cname("memcpy") @nostrip
```
```c3
fn void* memmove(void* dest, void* src, usz n) @weak @cname("memmove") @nostrip
```
```c3
fn void* memset(void* dest, CInt value, usz n) @weak @cname("memset") @nostrip
```
```c3
fn int fseek(CFile stream, SeekIndex offset, int whence) @weak @cname("fseek") @nostrip
```
```c3
fn CFile fopen(ZString filename, ZString mode) @weak @cname("fopen") @nostrip
```
```c3
fn CFile freopen(ZString filename, ZString mode, CFile stream) @weak @cname("fopen") @nostrip
```
```c3
fn usz fwrite(void* ptr, usz size, usz nmemb, CFile stream) @weak @cname("fwrite") @nostrip
```
```c3
fn usz fread(void* ptr, usz size, usz nmemb, CFile stream) @weak @cname("fread") @nostrip
```
```c3
fn CFile fclose(CFile) @weak @cname("fclose") @nostrip
```
```c3
fn int fflush(CFile stream) @weak @cname("fflush") @nostrip
```
```c3
fn int fputc(int c, CFile stream) @weak @cname("fputc") @nostrip
```
```c3
fn char* fgets(ZString str, int n, CFile stream) @weak @cname("fgets") @nostrip
```
```c3
fn int fgetc(CFile stream) @weak @cname("fgetc") @nostrip
```
```c3
fn int feof(CFile stream) @weak @cname("feof") @nostrip
```
```c3
fn int putc(int c, CFile stream) @weak @cname("putc") @nostrip
```
```c3
fn int putchar(int c) @weak @cname("putchar") @nostrip
```
```c3
fn int puts(ZString str) @weak @cname("puts") @nostrip
```
### `libc @if(env::ANDROID)`
```c3
alias Blksize_t = $typefrom(env::X86_64 ? long.typeid : CInt.typeid)
```
```c3
alias Nlink_t = $typefrom(env::X86_64 ? ulong.typeid : CUInt.typeid)
```
```c3
alias Blkcnt_t = long
```
```c3
alias Ino_t = ulong
```
```c3
alias Dev_t = ulong
```
```c3
alias Mode_t = uint
```
```c3
alias Ino64_t = ulong
```
```c3
alias Blkcnt64_t = long
```
```c3
struct Stat @if(env::X86_64)
```
```c3
struct Stat @if(!env::X86_64)
```
```c3
extern fn CInt stat(ZString path, Stat* stat)
```
### `libc @if(env::DARWIN || env::FREEBSD)`
```c3
extern fn usz malloc_size(void* ptr) @if(!env::FREEBSD)
```
```c3
macro CFile stdout()
```
```c3
macro CFile stderr()
```
### `libc @if(env::DARWIN)`
```c3
alias Dev_t = int
```
```c3
alias Mode_t = ushort
```
```c3
alias Nlink_t = ushort
```
```c3
alias Blkcnt_t = long
```
```c3
alias Blksize_t = int
```
```c3
alias Ino_t = ulong
```
```c3
struct Stat
```
```c3
extern fn int stat(ZString str, Stat* stat) @cname("stat64")
```
### `libc @if(env::FREEBSD)`
```c3
alias Blksize_t = int
```
```c3
alias Nlink_t = $typefrom(env::X86_64 ? ulong.typeid : CUInt.typeid)
```
```c3
alias Dev_t = ulong
```
```c3
alias Ino_t = ulong
```
```c3
alias Mode_t = ushort
```
```c3
alias Blkcnt_t = long
```
```c3
alias Fflags_t = uint
```
```c3
struct Stat @if(env::X86_64)
```
```c3
struct Stat @if(!env::X86_64)
```
```c3
extern fn CInt stat(ZString path, Stat* stat)
```
### `libc @if(env::LIBC)`
```c3
extern fn void abort()
```
```c3
macro CFile stdout()
```
```c3
macro CFile stderr()
```
### `libc @if(env::LINUX)`
```c3
alias Blksize_t = $typefrom(env::X86_64 ? long.typeid : CInt.typeid)
```
```c3
alias Nlink_t = $typefrom(env::X86_64 ? ulong.typeid : CUInt.typeid)
```
```c3
alias Blkcnt_t = long
```
```c3
alias Ino_t = ulong
```
```c3
alias Dev_t = ulong
```
```c3
alias Mode_t = uint
```
```c3
alias Ino64_t = ulong
```
```c3
alias Blkcnt64_t = long
```
```c3
struct Stat @if(env::X86_64)
```
```c3
struct Stat @if(!env::X86_64)
```
```c3
extern fn CInt stat(ZString path, Stat* stat)
```
### `libc @if(env::OPENBSD)`
```c3
alias Blksize_t = int
```
```c3
alias Nlink_t = $typefrom(env::X86_64 ? uint.typeid : CUInt.typeid)
```
```c3
alias Dev_t = int
```
```c3
alias Ino_t = ulong
```
```c3
alias Mode_t = uint
```
```c3
alias Blkcnt_t = long
```
```c3
alias Fflags_t = uint
```
```c3
struct Stat @if(env::X86_64)
```
```c3
struct Stat @if(!env::X86_64)
```
```c3
extern fn CInt stat(ZString path, Stat* stat)
```
### `libc @if(env::POSIX)`
```c3
extern fn CInt shutdown(Fd sockfd, CInt how)
```
```c3
struct Stack_t
```
```c3
extern fn CInt sigaltstack(Stack_t* ss, Stack_t* old_ss)
```
### `libc @if(env::WIN32)`
```c3
alias fdopen = _fdopen
```
```c3
alias close = _close
```
```c3
alias fileno = _fileno
```
```c3
alias isatty = _isatty
```
```c3
alias difftime = _difftime64
```
```c3
alias fseek = _fseeki64
```
```c3
alias ftell = _ftelli64
```
```c3
alias timegm = _mkgmtime64
```
```c3
alias mktime = _mktime64
```
```c3
extern fn CFile __acrt_iob_func(CInt c)
```
```c3
extern fn CInt get_system_info(SystemInfo*) @cname("GetSystemInfo")
```
### `libc::errno`
### `libc::errno @if(!env::WIN32 && !env::DARWIN)`
### `libc::errno @if(env::DARWIN)`
### `libc::errno @if(env::WIN32)`
### `libc::os @if(env::LIBC)`
```c3
extern fn int* __errno_location() @if(env::LINUX)
```
```c3
macro void errno_set(int err) @if(env::WIN32)
```
```c3
extern fn void _get_errno(int* result) @if(env::WIN32)
```
### `libc::termios @if(!env::LIBC ||| !env::POSIX)`
```c3
typedef Cc = char
```
```c3
typedef Speed = CUInt
```
```c3
typedef Tcflags = CUInt
```
```c3
struct Termios
```
```c3
fn CInt tcgetattr(Fd fd, Termios* self)
```
```c3
fn CInt tcsetattr(Fd fd, CInt optional_actions, Termios* self)
```
```c3
fn CInt tcsendbreak(Fd fd, CInt duration)
```
```c3
fn CInt tcdrain(Fd fd)
```
```c3
fn CInt tcflush(Fd fd, CInt queue_selector)
```
```c3
fn CInt tcflow(Fd fd, CInt action)
```
```c3
fn Speed cfgetospeed(Termios* self)
```
```c3
fn Speed cfgetispeed(Termios* self)
```
```c3
fn CInt cfsetospeed(Termios* self, Speed speed)
```
```c3
fn CInt cfsetispeed(Termios* self, Speed speed)
```
```c3
fn int sendBreak(Fd fd, int duration)
```
```c3
fn int drain(Fd fd)
```
```c3
fn int flush(Fd fd, int queue_selector)
```
```c3
fn int flow(Fd fd, int action)
```
```c3
fn Speed Termios.getOSpeed(Termios* self)
```
```c3
fn Speed Termios.getISpeed(Termios* self)
```
```c3
fn int Termios.setOSpeed(Termios* self, Speed speed)
```
```c3
fn int Termios.setISpeed(Termios* self, Speed speed)
```
```c3
fn int Termios.getAttr(Termios* self, Fd fd)
```
```c3
fn int Termios.setAttr(Termios* self, Fd fd, int optional_actions)
```
### `libc::termios @if(env::LIBC &&& env::POSIX)`
```c3
fn int sendBreak(Fd fd, int duration)
```
```c3
fn int drain(Fd fd)
```
```c3
fn int flush(Fd fd, int queue_selector)
```
```c3
fn int flow(Fd fd, int action)
```
```c3
fn Speed Termios.getOSpeed(Termios* self)
```
```c3
fn Speed Termios.getISpeed(Termios* self)
```
```c3
fn int Termios.setOSpeed(Termios* self, Speed speed)
```
```c3
fn int Termios.setISpeed(Termios* self, Speed speed)
```
```c3
fn int Termios.getAttr(Termios* self, Fd fd)
```
```c3
fn int Termios.setAttr(Termios* self, Fd fd, Tcactions optional_actions)
```
### `std::ascii`
```c3
macro bool in_range_m(c, start, len)
```
```c3
macro bool is_lower_m(c)
```
```c3
macro bool is_upper_m(c)
```
```c3
macro bool is_digit_m(c)
```
```c3
macro bool is_bdigit_m(c)
```
```c3
macro bool is_odigit_m(c)
```
```c3
macro bool is_xdigit_m(c)
```
```c3
macro bool is_alpha_m(c)
```
```c3
macro bool is_print_m(c)
```
```c3
macro bool is_graph_m(c)
```
```c3
macro bool is_space_m(c)
```
```c3
macro bool is_alnum_m(c)
```
```c3
macro bool is_punct_m(c)
```
```c3
macro bool is_blank_m(c)
```
```c3
macro bool is_cntrl_m(c)
```
```c3
macro to_lower_m(c)
```
```c3
macro to_upper_m(c)
```
```c3
fn bool in_range(char c, char start, char len)
```
```c3
fn bool char.in_range(char c, char start, char len)
```
```c3
fn bool uint.in_range(uint c, uint start, uint len)
```
```c3
fn bool uint.is_lower(uint c)  @deprecated
```
```c3
fn bool uint.is_upper(uint c)  @deprecated
```
```c3
fn bool uint.is_digit(uint c)  @deprecated
```
```c3
fn bool uint.is_bdigit(uint c) @deprecated
```
```c3
fn bool uint.is_odigit(uint c) @deprecated
```
```c3
fn bool uint.is_xdigit(uint c) @deprecated
```
```c3
fn bool uint.is_alpha(uint c)  @deprecated
```
```c3
fn bool uint.is_print(uint c)  @deprecated
```
```c3
fn bool uint.is_graph(uint c)  @deprecated
```
```c3
fn bool uint.is_space(uint c)  @deprecated
```
```c3
fn bool uint.is_alnum(uint c)  @deprecated
```
```c3
fn bool uint.is_punct(uint c)  @deprecated
```
```c3
fn bool uint.is_blank(uint c)  @deprecated
```
```c3
fn bool uint.is_cntrl(uint c)  @deprecated
```
```c3
fn uint uint.to_lower(uint c)  @deprecated
```
```c3
fn uint uint.to_upper(uint c)  @deprecated
```
### `std::atomic`
```c3
macro bool is_native_atomic_type($Type)
```
```c3
macro fetch_add(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_sub(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_mul(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_div(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_or(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_xor(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_and(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_shift_right(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_shift_left(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro flag_set(ptr, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro flag_clear(ptr, AtomicOrdering $ordering = SEQ_CONSISTENT)
```
```c3
macro fetch_max(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro fetch_min(ptr, y, AtomicOrdering $ordering = SEQ_CONSISTENT, bool $volatile = false, usz $alignment = 0)
```
```c3
macro @__atomic_compare_exchange_ordering_failure(ptr, expected, desired, $success, failure, $alignment)
```
```c3
macro @__atomic_compare_exchange_ordering_success(ptr, expected, desired, success, failure, $alignment)
```
```c3
fn CInt __atomic_compare_exchange(CInt size, any ptr, any expected, any desired, CInt success, CInt failure) @weak @export("__atomic_compare_exchange")
```
### `std::atomic::types{Type}`
```c3
struct Atomic
```
```c3
macro Type Atomic.load(&self, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro void Atomic.store(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.add(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.sub(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.mul(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.div(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.max(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.min(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT)
```
```c3
macro Type Atomic.or(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) != FLOAT)
```
```c3
macro Type Atomic.xor(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) != FLOAT)
```
```c3
macro Type Atomic.and(&self, Type value, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) != FLOAT)
```
```c3
macro Type Atomic.shr(&self, Type amount, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) != FLOAT)
```
```c3
macro Type Atomic.shl(&self, Type amount, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) != FLOAT)
```
```c3
macro Type Atomic.set(&self, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) == BOOL)
```
```c3
macro Type Atomic.clear(&self, AtomicOrdering ordering = SEQ_CONSISTENT) @if(types::flat_kind(Type) == BOOL)
```
### `std::bits`
```c3
macro reverse(i)
```
```c3
macro bswap(i) @builtin
```
```c3
macro uint[<*>].popcount(self)
```
```c3
macro uint[<*>].ctz(self)
```
```c3
macro uint[<*>].clz(self)
```
```c3
macro uint[<*>] uint[<*>].fshl(hi, uint[<*>] lo, uint[<*>] shift)
```
```c3
macro uint[<*>] uint[<*>].fshr(hi, uint[<*>] lo, uint[<*>] shift)
```
```c3
macro uint[<*>] uint[<*>].rotl(self, uint[<*>] shift)
```
```c3
macro uint[<*>] uint[<*>].rotr(self, uint[<*>] shift)
```
```c3
macro int[<*>].popcount(self)
```
```c3
macro int[<*>].ctz(self)
```
```c3
macro int[<*>].clz(self)
```
```c3
macro int[<*>] int[<*>].fshl(hi, int[<*>] lo, int[<*>] shift)
```
```c3
macro int[<*>] int[<*>].fshr(hi, int[<*>] lo, int[<*>] shift)
```
```c3
macro int[<*>] int[<*>].rotl(self, int[<*>] shift)
```
```c3
macro int[<*>] int[<*>].rotr(self, int[<*>] shift)
```
```c3
macro ushort[<*>].popcount(self)
```
```c3
macro ushort[<*>].ctz(self)
```
```c3
macro ushort[<*>].clz(self)
```
```c3
macro ushort[<*>] ushort[<*>].fshl(hi, ushort[<*>] lo, ushort[<*>] shift)
```
```c3
macro ushort[<*>] ushort[<*>].fshr(hi, ushort[<*>] lo, ushort[<*>] shift)
```
```c3
macro ushort[<*>] ushort[<*>].rotl(self, ushort[<*>] shift)
```
```c3
macro ushort[<*>] ushort[<*>].rotr(self, ushort[<*>] shift)
```
```c3
macro short[<*>].popcount(self)
```
```c3
macro short[<*>].ctz(self)
```
```c3
macro short[<*>].clz(self)
```
```c3
macro short[<*>] short[<*>].fshl(hi, short[<*>] lo, short[<*>] shift)
```
```c3
macro short[<*>] short[<*>].fshr(hi, short[<*>] lo, short[<*>] shift)
```
```c3
macro short[<*>] short[<*>].rotl(self, short[<*>] shift)
```
```c3
macro short[<*>] short[<*>].rotr(self, short[<*>] shift)
```
```c3
macro char[<*>].popcount(self)
```
```c3
macro char[<*>].ctz(self)
```
```c3
macro char[<*>].clz(self)
```
```c3
macro char[<*>] char[<*>].fshl(hi, char[<*>] lo, char[<*>] shift)
```
```c3
macro char[<*>] char[<*>].fshr(hi, char[<*>] lo, char[<*>] shift)
```
```c3
macro char[<*>] char[<*>].rotl(self, char[<*>] shift)
```
```c3
macro char[<*>] char[<*>].rotr(self, char[<*>] shift)
```
```c3
macro ichar[<*>].popcount(self)
```
```c3
macro ichar[<*>].ctz(self)
```
```c3
macro ichar[<*>].clz(self)
```
```c3
macro ichar[<*>] ichar[<*>].fshl(hi, ichar[<*>] lo, ichar[<*>] shift)
```
```c3
macro ichar[<*>] ichar[<*>].fshr(hi, ichar[<*>] lo, ichar[<*>] shift)
```
```c3
macro ichar[<*>] ichar[<*>].rotl(self, ichar[<*>] shift)
```
```c3
macro ichar[<*>] ichar[<*>].rotr(self, ichar[<*>] shift)
```
```c3
macro ulong[<*>].popcount(self)
```
```c3
macro ulong[<*>].ctz(self)
```
```c3
macro ulong[<*>].clz(self)
```
```c3
macro ulong[<*>] ulong[<*>].fshl(hi, ulong[<*>] lo, ulong[<*>] shift)
```
```c3
macro ulong[<*>] ulong[<*>].fshr(hi, ulong[<*>] lo, ulong[<*>] shift)
```
```c3
macro ulong[<*>] ulong[<*>].rotl(self, ulong[<*>] shift)
```
```c3
macro ulong[<*>] ulong[<*>].rotr(self, ulong[<*>] shift)
```
```c3
macro long[<*>].popcount(self)
```
```c3
macro long[<*>].ctz(self)
```
```c3
macro long[<*>].clz(self)
```
```c3
macro long[<*>] long[<*>].fshl(hi, long[<*>] lo, long[<*>] shift)
```
```c3
macro long[<*>] long[<*>].fshr(hi, long[<*>] lo, long[<*>] shift)
```
```c3
macro long[<*>] long[<*>].rotl(self, long[<*>] shift)
```
```c3
macro long[<*>] long[<*>].rotr(self, long[<*>] shift)
```
```c3
macro uint128[<*>].popcount(self)
```
```c3
macro uint128[<*>].ctz(self)
```
```c3
macro uint128[<*>].clz(self)
```
```c3
macro uint128[<*>] uint128[<*>].fshl(hi, uint128[<*>] lo, uint128[<*>] shift)
```
```c3
macro uint128[<*>] uint128[<*>].fshr(hi, uint128[<*>] lo, uint128[<*>] shift)
```
```c3
macro uint128[<*>] uint128[<*>].rotl(self, uint128[<*>] shift)
```
```c3
macro uint128[<*>] uint128[<*>].rotr(self, uint128[<*>] shift)
```
```c3
macro int128[<*>].popcount(self)
```
```c3
macro int128[<*>].ctz(self)
```
```c3
macro int128[<*>].clz(self)
```
```c3
macro int128[<*>] int128[<*>].fshl(hi, int128[<*>] lo, int128[<*>] shift)
```
```c3
macro int128[<*>] int128[<*>].fshr(hi, int128[<*>] lo, int128[<*>] shift)
```
```c3
macro int128[<*>] int128[<*>].rotl(self, int128[<*>] shift)
```
```c3
macro int128[<*>] int128[<*>].rotr(self, int128[<*>] shift)
```
```c3
macro uint.popcount(self)
```
```c3
macro uint.ctz(self)
```
```c3
macro uint.clz(self)
```
```c3
macro uint uint.fshl(hi, uint lo, uint shift)
```
```c3
macro uint uint.fshr(hi, uint lo, uint shift)
```
```c3
macro uint uint.rotl(self, uint shift)
```
```c3
macro uint uint.rotr(self, uint shift)
```
```c3
macro int.popcount(self)
```
```c3
macro int.ctz(self)
```
```c3
macro int.clz(self)
```
```c3
macro int int.fshl(hi, int lo, int shift)
```
```c3
macro int int.fshr(hi, int lo, int shift)
```
```c3
macro int int.rotl(self, int shift)
```
```c3
macro int int.rotr(self, int shift)
```
```c3
macro ushort.popcount(self)
```
```c3
macro ushort.ctz(self)
```
```c3
macro ushort.clz(self)
```
```c3
macro ushort ushort.fshl(hi, ushort lo, ushort shift)
```
```c3
macro ushort ushort.fshr(hi, ushort lo, ushort shift)
```
```c3
macro ushort ushort.rotl(self, ushort shift)
```
```c3
macro ushort ushort.rotr(self, ushort shift)
```
```c3
macro short.popcount(self)
```
```c3
macro short.ctz(self)
```
```c3
macro short.clz(self)
```
```c3
macro short short.fshl(hi, short lo, short shift)
```
```c3
macro short short.fshr(hi, short lo, short shift)
```
```c3
macro short short.rotl(self, short shift)
```
```c3
macro short short.rotr(self, short shift)
```
```c3
macro char.popcount(self)
```
```c3
macro char.ctz(self)
```
```c3
macro char.clz(self)
```
```c3
macro char char.fshl(hi, char lo, char shift)
```
```c3
macro char char.fshr(hi, char lo, char shift)
```
```c3
macro char char.rotl(self, char shift)
```
```c3
macro char char.rotr(self, char shift)
```
```c3
macro ichar.popcount(self)
```
```c3
macro ichar.ctz(self)
```
```c3
macro ichar.clz(self)
```
```c3
macro ichar ichar.fshl(hi, ichar lo, ichar shift)
```
```c3
macro ichar ichar.fshr(hi, ichar lo, ichar shift)
```
```c3
macro ichar ichar.rotl(self, ichar shift)
```
```c3
macro ichar ichar.rotr(self, ichar shift)
```
```c3
macro ulong.popcount(self)
```
```c3
macro ulong.ctz(self)
```
```c3
macro ulong.clz(self)
```
```c3
macro ulong ulong.fshl(hi, ulong lo, ulong shift)
```
```c3
macro ulong ulong.fshr(hi, ulong lo, ulong shift)
```
```c3
macro ulong ulong.rotl(self, ulong shift)
```
```c3
macro ulong ulong.rotr(self, ulong shift)
```
```c3
macro long.popcount(self)
```
```c3
macro long.ctz(self)
```
```c3
macro long.clz(self)
```
```c3
macro long long.fshl(hi, long lo, long shift)
```
```c3
macro long long.fshr(hi, long lo, long shift)
```
```c3
macro long long.rotl(self, long shift)
```
```c3
macro long long.rotr(self, long shift)
```
```c3
macro uint128.popcount(self)
```
```c3
macro uint128.ctz(self)
```
```c3
macro uint128.clz(self)
```
```c3
macro uint128 uint128.fshl(hi, uint128 lo, uint128 shift)
```
```c3
macro uint128 uint128.fshr(hi, uint128 lo, uint128 shift)
```
```c3
macro uint128 uint128.rotl(self, uint128 shift)
```
```c3
macro uint128 uint128.rotr(self, uint128 shift)
```
```c3
macro int128.popcount(self)
```
```c3
macro int128.ctz(self)
```
```c3
macro int128.clz(self)
```
```c3
macro int128 int128.fshl(hi, int128 lo, int128 shift)
```
```c3
macro int128 int128.fshr(hi, int128 lo, int128 shift)
```
```c3
macro int128 int128.rotl(self, int128 shift)
```
```c3
macro int128 int128.rotr(self, int128 shift)
```
### `std::collections::anylist`
```c3
alias AnyPredicate = fn bool(any value)
```
```c3
alias AnyTest = fn bool(any type, any context)
```
```c3
struct AnyList (Printable)
```
```c3
fn AnyList* AnyList.init(&self, Allocator allocator, usz initial_capacity = 16)
```
```c3
fn AnyList* AnyList.tinit(&self, usz initial_capacity = 16)
```
```c3
fn bool AnyList.is_initialized(&self) @inline
```
```c3
macro void AnyList.push(&self, element)
```
```c3
fn void AnyList.free_element(&self, any element) @inline
```
```c3
macro AnyList.pop(&self, $Type)
```
```c3
fn any? AnyList.copy_pop(&self, Allocator allocator)
```
```c3
fn any? AnyList.tcopy_pop(&self)
```
```c3
fn any? AnyList.pop_retained(&self)
```
```c3
fn void AnyList.clear(&self)
```
```c3
macro AnyList.pop_first(&self, $Type)
```
```c3
fn any? AnyList.pop_first_retained(&self)
```
```c3
fn any? AnyList.copy_pop_first(&self, Allocator allocator)
```
```c3
fn any? AnyList.tcopy_pop_first(&self)
```
```c3
fn void AnyList.remove_at(&self, usz index)
```
```c3
fn void AnyList.add_all(&self, AnyList* other_list)
```
```c3
fn void AnyList.reverse(&self)
```
```c3
fn any[] AnyList.array_view(&self)
```
```c3
macro void AnyList.push_front(&self, value)
```
```c3
macro void AnyList.insert_at(&self, usz index, type)
```
```c3
fn void AnyList.remove_last(&self)
```
```c3
fn void AnyList.remove_first(&self)
```
```c3
macro AnyList.first(&self, $Type)
```
```c3
fn any? AnyList.first_any(&self) @inline
```
```c3
macro AnyList.last(&self, $Type)
```
```c3
fn any? AnyList.last_any(&self) @inline
```
```c3
fn bool AnyList.is_empty(&self) @inline
```
```c3
fn usz AnyList.len(&self) @operator(len) @inline
```
```c3
macro AnyList.get(&self, usz index, $Type)
```
```c3
fn any AnyList.get_any(&self, usz index) @inline @operator([])
```
```c3
fn void AnyList.free(&self)
```
```c3
fn void AnyList.swap(&self, usz i, usz j)
```
```c3
fn usz? AnyList.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn usz AnyList.remove_if(&self, AnyPredicate filter)
```
```c3
fn usz AnyList.retain_if(&self, AnyPredicate selection)
```
```c3
fn usz AnyList.remove_using_test(&self, AnyTest filter, any context)
```
```c3
fn usz AnyList.retain_using_test(&self, AnyTest selection, any context)
```
```c3
fn void AnyList.reserve(&self, usz min_capacity)
```
```c3
macro void AnyList.set(&self, usz index, value)
```
### `std::collections::bitset {SIZE}`
```c3
struct BitSet
```
```c3
fn usz BitSet.cardinality(&self)
```
```c3
fn void BitSet.set(&self, usz i)
```
```c3
macro BitSet BitSet.xor_self(&self, BitSet set) @operator(^=)
```
```c3
fn BitSet BitSet.xor(&self, BitSet set) @operator(^)
```
```c3
fn BitSet BitSet.or(&self, BitSet set) @operator(|)
```
```c3
macro BitSet BitSet.or_self(&self, BitSet set) @operator(|=)
```
```c3
fn BitSet BitSet.and(&self, BitSet set) @operator(&)
```
```c3
macro BitSet BitSet.and_self(&self, BitSet set) @operator(&=)
```
```c3
fn void BitSet.unset(&self, usz i)
```
```c3
fn bool BitSet.get(&self, usz i) @operator([]) @inline
```
```c3
fn usz BitSet.len(&self) @operator(len) @inline
```
```c3
fn void BitSet.set_bool(&self, usz i, bool value) @operator([]=) @inline
```
### `std::collections::elastic_array {Type, MAX_SIZE}`
```c3
alias ElementPredicate = fn bool(Type *type)
```
```c3
alias ElementTest = fn bool(Type *type, any context)
```
```c3
macro type_is_overaligned()
```
```c3
struct ElasticArray (Printable)
```
```c3
fn usz? ElasticArray.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String ElasticArray.to_tstring(&self)
```
```c3
fn void? ElasticArray.push_try(&self, Type element) @inline
```
```c3
fn void ElasticArray.push(&self, Type element) @inline
```
```c3
fn Type? ElasticArray.pop(&self)
```
```c3
fn void ElasticArray.clear(&self)
```
```c3
fn Type? ElasticArray.pop_first(&self)
```
```c3
fn void ElasticArray.remove_at(&self, usz index)
```
```c3
fn void ElasticArray.add_all(&self, ElasticArray* other_list)
```
```c3
fn usz ElasticArray.add_all_to_limit(&self, ElasticArray* other_list)
```
```c3
fn usz ElasticArray.add_array_to_limit(&self, Type[] array)
```
```c3
fn void ElasticArray.add_array(&self, Type[] array)
```
```c3
fn Type[] ElasticArray.to_aligned_array(&self, Allocator allocator)
```
```c3
macro Type[] ElasticArray.to_array(&self, Allocator allocator)
```
```c3
fn Type[] ElasticArray.to_tarray(&self)
```
```c3
fn void ElasticArray.reverse(&self)
```
```c3
fn Type[] ElasticArray.array_view(&self)
```
```c3
fn void ElasticArray.push_front(&self, Type type) @inline
```
```c3
fn void? ElasticArray.push_front_try(&self, Type type) @inline
```
```c3
fn void? ElasticArray.insert_at_try(&self, usz index, Type value)
```
```c3
fn void ElasticArray.insert_at(&self, usz index, Type type)
```
```c3
fn void ElasticArray.set_at(&self, usz index, Type type)
```
```c3
fn void? ElasticArray.remove_last(&self) @maydiscard
```
```c3
fn void? ElasticArray.remove_first(&self) @maydiscard
```
```c3
fn Type? ElasticArray.first(&self)
```
```c3
fn Type? ElasticArray.last(&self)
```
```c3
fn bool ElasticArray.is_empty(&self) @inline
```
```c3
fn usz ElasticArray.byte_size(&self) @inline
```
```c3
fn usz ElasticArray.len(&self) @operator(len) @inline
```
```c3
fn Type ElasticArray.get(&self, usz index) @inline
```
```c3
fn void ElasticArray.swap(&self, usz i, usz j)
```
```c3
fn usz ElasticArray.remove_if(&self, ElementPredicate filter)
```
```c3
fn usz ElasticArray.retain_if(&self, ElementPredicate selection)
```
```c3
fn usz ElasticArray.remove_using_test(&self, ElementTest filter, any context)
```
```c3
fn usz ElasticArray.retain_using_test(&self, ElementTest filter, any context)
```
```c3
macro Type ElasticArray.@item_at(&self, usz index) @operator([])
```
```c3
fn Type* ElasticArray.get_ref(&self, usz index) @operator(&[]) @inline
```
```c3
fn void ElasticArray.set(&self, usz index, Type value) @operator([]=)
```
```c3
fn usz? ElasticArray.index_of(&self, Type type) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz? ElasticArray.rindex_of(&self, Type type) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool ElasticArray.equals(&self, ElasticArray other_list) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool ElasticArray.contains(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool ElasticArray.remove_last_item(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool ElasticArray.remove_first_item(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz ElasticArray.remove_item(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void ElasticArray.remove_all_from(&self, ElasticArray* other_list) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz ElasticArray.compact_count(&self) @if(ELEMENT_IS_POINTER)
```
```c3
fn usz ElasticArray.compact(&self) @if(ELEMENT_IS_POINTER)
```
### `std::collections::enummap{Enum, ValueType}`
```c3
struct EnumMap (Printable)
```
```c3
fn void EnumMap.init(&self, ValueType init_value)
```
```c3
fn usz? EnumMap.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn usz EnumMap.len(&self) @operator(len) @inline
```
```c3
fn ValueType EnumMap.get(&self, Enum key) @operator([]) @inline
```
```c3
fn ValueType* EnumMap.get_ref(&self, Enum key) @operator(&[]) @inline
```
```c3
fn void EnumMap.set(&self, Enum key, ValueType value) @operator([]=) @inline
```
### `std::collections::enumset{Enum}`
```c3
typedef EnumSet (Printable) = EnumSetType
```
```c3
fn void EnumSet.add(&self, Enum v)
```
```c3
fn void EnumSet.clear(&self)
```
```c3
fn bool EnumSet.remove(&self, Enum v)
```
```c3
fn bool EnumSet.has(&self, Enum v)
```
```c3
fn void EnumSet.add_all(&self, EnumSet s)
```
```c3
fn void EnumSet.retain_all(&self, EnumSet s)
```
```c3
fn void EnumSet.remove_all(&self, EnumSet s)
```
```c3
fn EnumSet EnumSet.and_of(&self, EnumSet s)
```
```c3
fn EnumSet EnumSet.or_of(&self, EnumSet s)
```
```c3
fn EnumSet EnumSet.diff_of(&self, EnumSet s)
```
```c3
fn EnumSet EnumSet.xor_of(&self, EnumSet s)
```
```c3
fn usz? EnumSet.to_format(&set, Formatter* formatter) @dynamic
```
### `std::collections::growablebitset{Type}`
```c3
alias GrowableBitSetList = List{Type}
```
```c3
struct GrowableBitSet
```
```c3
fn GrowableBitSet* GrowableBitSet.init(&self, Allocator allocator, usz initial_capacity = 1)
```
```c3
fn GrowableBitSet* GrowableBitSet.tinit(&self, usz initial_capacity = 1)
```
```c3
fn void GrowableBitSet.free(&self)
```
```c3
fn usz GrowableBitSet.cardinality(&self)
```
```c3
fn void GrowableBitSet.set(&self, usz i)
```
```c3
fn void GrowableBitSet.unset(&self, usz i)
```
```c3
fn bool GrowableBitSet.get(&self, usz i) @operator([]) @inline
```
```c3
fn usz GrowableBitSet.len(&self) @operator(len)
```
```c3
fn void GrowableBitSet.set_bool(&self, usz i, bool value) @operator([]=) @inline
```
### `std::collections::linkedlist{Type}`
```c3
struct LinkedList
```
```c3
fn LinkedList* LinkedList.init(&self, Allocator allocator)
```
```c3
fn LinkedList* LinkedList.tinit(&self)
```
```c3
fn bool LinkedList.is_initialized(&self) @inline
```
```c3
fn void LinkedList.push_front(&self, Type value)
```
```c3
fn void LinkedList.push(&self, Type value)
```
```c3
fn Type? LinkedList.peek(&self)
```
```c3
fn Type? LinkedList.peek_last(&self)
```
```c3
fn Type? LinkedList.first(&self)
```
```c3
fn Type? LinkedList.last(&self)
```
```c3
fn void LinkedList.free(&self)
```
```c3
fn void LinkedList.clear(&self)
```
```c3
fn usz LinkedList.len(&self) @inline
```
```c3
macro Node* LinkedList.node_at_index(&self, usz index)
```
```c3
fn Type LinkedList.get(&self, usz index)
```
```c3
fn void LinkedList.set(&self, usz index, Type element)
```
```c3
fn void LinkedList.remove_at(&self, usz index)
```
```c3
fn void LinkedList.insert_at(&self, usz index, Type element)
```
```c3
fn usz LinkedList.remove(&self, Type t) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn Type? LinkedList.pop(&self)
```
```c3
fn bool LinkedList.is_empty(&self)
```
```c3
fn Type? LinkedList.pop_front(&self)
```
```c3
fn void? LinkedList.remove_last(&self) @maydiscard
```
```c3
fn void? LinkedList.remove_first(&self) @maydiscard
```
```c3
fn bool LinkedList.remove_first_match(&self, Type t) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool LinkedList.remove_last_match(&self, Type t)  @if(ELEMENT_IS_EQUATABLE)
```
### `std::collections::list_common`
```c3
macro list_to_aligned_array($Type, self, Allocator allocator)
```
```c3
macro list_to_array($Type, self, Allocator allocator)
```
```c3
macro void list_reverse(self)
```
```c3
macro usz list_remove_using_test(self, filter, bool $invert, ctx)
```
```c3
macro usz list_compact(self)
```
```c3
macro usz list_remove_item(self, value)
```
```c3
macro usz list_remove_if(self, filter, bool $invert)
```
### `std::collections::list{Type}`
```c3
alias ElementPredicate = fn bool(Type *type)
```
```c3
alias ElementTest = fn bool(Type *type, any context)
```
```c3
macro type_is_overaligned()
```
```c3
struct List (Printable)
```
```c3
fn List* List.init(&self, Allocator allocator, usz initial_capacity = 16)
```
```c3
fn List* List.tinit(&self, usz initial_capacity = 16)
```
```c3
fn List* List.init_with_array(&self, Allocator allocator, Type[] values)
```
```c3
fn List* List.tinit_with_array(&self, Type[] values)
```
```c3
fn void List.init_wrapping_array(&self, Allocator allocator, Type[] types)
```
```c3
fn bool List.is_initialized(&self) @inline
```
```c3
fn usz? List.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn void List.push(&self, Type element) @inline
```
```c3
fn Type? List.pop(&self)
```
```c3
fn void List.clear(&self)
```
```c3
fn Type? List.pop_first(&self)
```
```c3
fn void List.remove_at(&self, usz index)
```
```c3
fn void List.add_all(&self, List* other_list)
```
```c3
fn Type[] List.to_aligned_array(&self, Allocator allocator)
```
```c3
macro Type[] List.to_array(&self, Allocator allocator)
```
```c3
fn Type[] List.to_tarray(&self)
```
```c3
fn void List.reverse(&self)
```
```c3
fn Type[] List.array_view(&self)
```
```c3
fn void List.add_array(&self, Type[] array)
```
```c3
fn void List.push_front(&self, Type type) @inline
```
```c3
fn void List.insert_at(&self, usz index, Type type)
```
```c3
fn void List.set_at(&self, usz index, Type type)
```
```c3
fn void? List.remove_last(&self) @maydiscard
```
```c3
fn void? List.remove_first(&self) @maydiscard
```
```c3
fn Type? List.first(&self)
```
```c3
fn Type? List.last(&self)
```
```c3
fn bool List.is_empty(&self) @inline
```
```c3
fn usz List.byte_size(&self) @inline
```
```c3
fn usz List.len(&self) @operator(len) @inline
```
```c3
fn Type List.get(&self, usz index) @inline
```
```c3
fn void List.free(&self)
```
```c3
fn void List.swap(&self, usz i, usz j)
```
```c3
fn usz List.remove_if(&self, ElementPredicate filter)
```
```c3
fn usz List.retain_if(&self, ElementPredicate selection)
```
```c3
fn usz List.remove_using_test(&self, ElementTest filter, any context)
```
```c3
fn usz List.retain_using_test(&self, ElementTest filter, any context)
```
```c3
macro Type List.@item_at(&self, usz index) @operator([])
```
```c3
fn Type* List.get_ref(&self, usz index) @operator(&[]) @inline
```
```c3
fn void List.set(&self, usz index, Type value) @operator([]=)
```
```c3
fn void List.reserve(&self, usz added)
```
```c3
fn void List._update_size_change(&self,usz old_size, usz new_size)
```
```c3
fn usz? List.index_of(&self, Type type) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz? List.rindex_of(&self, Type type) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool List.equals(&self, List other_list) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool List.contains(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool List.remove_last_item(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn bool List.remove_first_item(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz List.remove_item(&self, Type value) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn void List.remove_all_from(&self, List* other_list) @if(ELEMENT_IS_EQUATABLE)
```
```c3
fn usz List.compact_count(&self) @if(ELEMENT_IS_POINTER)
```
```c3
fn usz List.compact(&self) @if(ELEMENT_IS_POINTER)
```
### `std::collections::map{Key, Value}`
```c3
struct Entry
```
```c3
struct HashMap (Printable)
```
```c3
fn HashMap* HashMap.init(&self, Allocator allocator, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashMap* HashMap.tinit(&self, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro HashMap* HashMap.init_with_key_values(&self, Allocator allocator, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro HashMap* HashMap.tinit_with_key_values(&self, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashMap* HashMap.init_from_keys_and_values(&self, Allocator allocator, Key[] keys, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashMap* HashMap.tinit_from_keys_and_values(&self, Key[] keys, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn bool HashMap.is_initialized(&map)
```
```c3
fn HashMap* HashMap.init_from_map(&self, Allocator allocator, HashMap* other_map)
```
```c3
fn HashMap* HashMap.tinit_from_map(&map, HashMap* other_map)
```
```c3
fn bool HashMap.is_empty(&map) @inline
```
```c3
fn usz HashMap.len(&map) @inline
```
```c3
fn Value*? HashMap.get_ref(&map, Key key)
```
```c3
fn Entry*? HashMap.get_entry(&map, Key key)
```
```c3
macro Value HashMap.@get_or_set(&map, Key key, Value #expr)
```
```c3
fn Value? HashMap.get(&map, Key key) @operator([])
```
```c3
fn bool HashMap.has_key(&map, Key key)
```
```c3
fn bool HashMap.set(&map, Key key, Value value) @operator([]=)
```
```c3
fn void? HashMap.remove(&map, Key key) @maydiscard
```
```c3
fn void HashMap.clear(&map)
```
```c3
fn void HashMap.free(&map)
```
```c3
fn Key[] HashMap.tkeys(&self)
```
```c3
fn Key[] HashMap.keys(&self, Allocator allocator)
```
```c3
macro HashMap.@each(map; @body(key, value))
```
```c3
macro HashMap.@each_entry(map; @body(entry))
```
```c3
fn Value[] HashMap.tvalues(&map)
```
```c3
fn Value[] HashMap.values(&self, Allocator allocator)
```
```c3
fn bool HashMap.has_value(&map, Value v) @if(VALUE_IS_EQUATABLE)
```
```c3
fn HashMapIterator HashMap.iter(&self)
```
```c3
fn HashMapValueIterator HashMap.value_iter(&self)
```
```c3
fn HashMapKeyIterator HashMap.key_iter(&self)
```
```c3
fn usz? HashMap.to_format(&self, Formatter* f) @dynamic
```
```c3
struct HashMapIterator
```
```c3
typedef HashMapValueIterator = HashMapIterator
```
```c3
typedef HashMapKeyIterator = HashMapIterator
```
```c3
fn Entry HashMapIterator.get(&self, usz idx) @operator([])
```
```c3
fn Value HashMapValueIterator.get(&self, usz idx) @operator([])
```
```c3
fn Key HashMapKeyIterator.get(&self, usz idx) @operator([])
```
```c3
fn usz HashMapValueIterator.len(self) @operator(len)
```
```c3
fn usz HashMapKeyIterator.len(self) @operator(len)
```
```c3
fn usz HashMapIterator.len(self) @operator(len)
```
```c3
struct LinkedEntry
```
```c3
struct LinkedHashMap (Printable)
```
```c3
fn LinkedHashMap* LinkedHashMap.init(&self, Allocator allocator, usz capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn LinkedHashMap* LinkedHashMap.tinit(&self, usz capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro LinkedHashMap* LinkedHashMap.init_with_key_values(&self, Allocator allocator, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro LinkedHashMap* LinkedHashMap.tinit_with_key_values(&self, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn LinkedHashMap* LinkedHashMap.init_from_keys_and_values(&self, Allocator allocator, Key[] keys, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn LinkedHashMap* LinkedHashMap.tinit_from_keys_and_values(&self, Key[] keys, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn bool LinkedHashMap.is_initialized(&map)
```
```c3
fn LinkedHashMap* LinkedHashMap.init_from_map(&self, Allocator allocator, LinkedHashMap* other_map)
```
```c3
fn LinkedHashMap* LinkedHashMap.tinit_from_map(&map, LinkedHashMap* other_map)
```
```c3
fn bool LinkedHashMap.is_empty(&map) @inline
```
```c3
fn usz LinkedHashMap.len(&map) @inline
```
```c3
fn Value*? LinkedHashMap.get_ref(&map, Key key)
```
```c3
fn LinkedEntry*? LinkedHashMap.get_entry(&map, Key key)
```
```c3
macro Value LinkedHashMap.@get_or_set(&map, Key key, Value #expr)
```
```c3
fn Value? LinkedHashMap.get(&map, Key key) @operator([])
```
```c3
fn bool LinkedHashMap.has_key(&map, Key key)
```
```c3
fn bool LinkedHashMap.set(&map, Key key, Value value) @operator([]=)
```
```c3
fn void? LinkedHashMap.remove(&map, Key key) @maydiscard
```
```c3
fn void LinkedHashMap.clear(&map)
```
```c3
fn void LinkedHashMap.free(&map)
```
```c3
fn Key[] LinkedHashMap.tkeys(&self)
```
```c3
fn Key[] LinkedHashMap.keys(&self, Allocator allocator)
```
```c3
macro LinkedHashMap.@each(map; @body(key, value))
```
```c3
macro LinkedHashMap.@each_entry(map; @body(entry))
```
```c3
fn Value[] LinkedHashMap.tvalues(&map)
```
```c3
fn Value[] LinkedHashMap.values(&self, Allocator allocator)
```
```c3
fn bool LinkedHashMap.has_value(&map, Value v) @if(VALUE_IS_EQUATABLE)
```
```c3
fn LinkedHashMapIterator LinkedHashMap.iter(&self)
```
```c3
fn LinkedHashMapValueIterator LinkedHashMap.value_iter(&self)
```
```c3
fn LinkedHashMapKeyIterator LinkedHashMap.key_iter(&self)
```
```c3
fn bool LinkedHashMapIterator.next(&self)
```
```c3
fn LinkedEntry*? LinkedHashMapIterator.get(&self)
```
```c3
fn Value*? LinkedHashMapValueIterator.get(&self)
```
```c3
fn Key*? LinkedHashMapKeyIterator.get(&self)
```
```c3
fn bool LinkedHashMapIterator.has_next(&self)
```
```c3
fn usz? LinkedHashMap.to_format(&self, Formatter* f) @dynamic
```
```c3
struct LinkedHashMapIterator
```
```c3
typedef LinkedHashMapValueIterator = inline LinkedHashMapIterator
```
```c3
typedef LinkedHashMapKeyIterator = inline LinkedHashMapIterator
```
```c3
fn usz LinkedHashMapValueIterator.len(self) @operator(len)
```
```c3
fn usz LinkedHashMapKeyIterator.len(self) @operator(len)
```
```c3
fn usz LinkedHashMapIterator.len(self) @operator(len)
```
### `std::collections::maybe{Type}`
```c3
struct Maybe (Printable)
```
```c3
fn usz? Maybe.to_format(&self, Formatter* f) @dynamic
```
```c3
fn void Maybe.set(&self, Type val)
```
```c3
fn void Maybe.reset(&self)
```
```c3
fn Maybe value(Type val)
```
```c3
macro Type? Maybe.get(self)
```
```c3
fn bool Maybe.equals(self, Maybe other) @operator(==) @if(types::is_equatable_type(Type))
```
### `std::collections::object`
```c3
struct Object (Printable)
```
```c3
fn usz? Object.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn Object* new_obj(Allocator allocator)
```
```c3
fn Object* new_null()
```
```c3
fn Object* new_int(int128 i, Allocator allocator)
```
```c3
macro Object* new_enum(e, Allocator allocator)
```
```c3
fn Object* new_float(double f, Allocator allocator)
```
```c3
fn Object* new_string(String s, Allocator allocator)
```
```c3
fn Object* new_bool(bool b)
```
```c3
fn void Object.free(&self)
```
```c3
fn bool Object.is_null(&self) @inline
```
```c3
fn bool Object.is_empty(&self) @inline
```
```c3
fn bool Object.is_map(&self) @inline
```
```c3
fn bool Object.is_array(&self) @inline
```
```c3
fn bool Object.is_bool(&self) @inline
```
```c3
fn bool Object.is_string(&self) @inline
```
```c3
fn bool Object.is_float(&self) @inline
```
```c3
fn bool Object.is_int(&self) @inline
```
```c3
fn bool Object.is_keyable(&self)
```
```c3
fn bool Object.is_indexable(&self)
```
```c3
macro Object* Object.set(&self, String key, value)
```
```c3
macro Object* Object.set_at(&self, usz index, String key, value)
```
```c3
macro Object* Object.push(&self, value)
```
```c3
fn Object*? Object.get(&self, String key)
```
```c3
fn bool Object.has_key(&self, String key)
```
```c3
fn Object* Object.get_at(&self, usz index)
```
```c3
fn usz Object.get_len(&self)
```
```c3
fn void Object.push_object(&self, Object* to_append)
```
```c3
fn void Object.set_object_at(&self, usz index, Object* to_set)
```
```c3
macro get_integer_value(Object* value, $Type)
```
```c3
fn ichar? Object.get_ichar(&self, String key)
```
```c3
fn short? Object.get_short(&self, String key)
```
```c3
fn int? Object.get_int(&self, String key)
```
```c3
fn long? Object.get_long(&self, String key)
```
```c3
fn int128? Object.get_int128(&self, String key)
```
```c3
fn ichar? Object.get_ichar_at(&self, usz index)
```
```c3
fn short? Object.get_short_at(&self, usz index)
```
```c3
fn int? Object.get_int_at(&self, usz index)
```
```c3
fn long? Object.get_long_at(&self, usz index)
```
```c3
fn int128? Object.get_int128_at(&self, usz index)
```
```c3
fn char? Object.get_char(&self, String key)
```
```c3
fn short? Object.get_ushort(&self, String key)
```
```c3
fn uint? Object.get_uint(&self, String key)
```
```c3
fn ulong? Object.get_ulong(&self, String key)
```
```c3
fn uint128? Object.get_uint128(&self, String key)
```
```c3
fn char? Object.get_char_at(&self, usz index)
```
```c3
fn ushort? Object.get_ushort_at(&self, usz index)
```
```c3
fn uint? Object.get_uint_at(&self, usz index)
```
```c3
fn ulong? Object.get_ulong_at(&self, usz index)
```
```c3
fn uint128? Object.get_uint128_at(&self, usz index)
```
```c3
fn String? Object.get_string(&self, String key)
```
```c3
fn String? Object.get_string_at(&self, usz index)
```
```c3
macro String? Object.get_enum(&self, $EnumType, String key)
```
```c3
macro String? Object.get_enum_at(&self, $EnumType, usz index)
```
```c3
fn bool? Object.get_bool(&self, String key)
```
```c3
fn bool? Object.get_bool_at(&self, usz index)
```
```c3
fn double? Object.get_float(&self, String key)
```
```c3
fn double? Object.get_float_at(&self, usz index)
```
```c3
fn Object* Object.get_or_create_obj(&self, String key)
```
### `std::collections::pair{Type1, Type2}`
```c3
struct Pair
```
```c3
macro void Pair.unpack(&self, a, b)
```
### `std::collections::priorityqueue::private{Type, MAX}`
```c3
struct PrivatePriorityQueue (Printable)
```
```c3
fn PrivatePriorityQueue* PrivatePriorityQueue.init(&self, Allocator allocator, usz initial_capacity = 16, ) @inline
```
```c3
fn PrivatePriorityQueue* PrivatePriorityQueue.tinit(&self, usz initial_capacity = 16) @inline
```
```c3
fn void PrivatePriorityQueue.push(&self, Type element)
```
```c3
fn void PrivatePriorityQueue.remove_at(&self, usz index)
```
```c3
fn Type? PrivatePriorityQueue.pop(&self)
```
```c3
fn Type? PrivatePriorityQueue.first(&self)
```
```c3
fn void PrivatePriorityQueue.free(&self)
```
```c3
fn usz PrivatePriorityQueue.len(&self) @operator(len)
```
```c3
fn bool PrivatePriorityQueue.is_empty(&self)
```
```c3
fn Type PrivatePriorityQueue.get(&self, usz index) @operator([])
```
```c3
fn usz? PrivatePriorityQueue.to_format(&self, Formatter* formatter) @dynamic
```
### `std::collections::priorityqueue{Type}`
```c3
typedef PriorityQueue = inline PrivatePriorityQueue{Type, false}
```
```c3
typedef PriorityQueueMax = inline PrivatePriorityQueue{Type, true}
```
### `std::collections::range{Type}`
```c3
struct Range (Printable)
```
```c3
fn usz Range.len(&self) @operator(len)
```
```c3
fn bool Range.contains(&self, Type value) @inline
```
```c3
fn Type Range.get(&self, usz index) @operator([])
```
```c3
fn usz? Range.to_format(&self, Formatter* formatter) @dynamic
```
```c3
struct ExclusiveRange (Printable)
```
```c3
fn usz ExclusiveRange.len(&self) @operator(len)
```
```c3
fn bool ExclusiveRange.contains(&self, Type value) @inline
```
```c3
fn usz? ExclusiveRange.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn Type ExclusiveRange.get(&self, usz index) @operator([])
```
### `std::collections::ringbuffer{Type}`
```c3
alias Element = $typeof((Type){}[0])
```
```c3
struct RingBuffer (Printable)
```
```c3
fn void RingBuffer.init(&self) @inline
```
```c3
fn void RingBuffer.push(&self, Element c)
```
```c3
fn Element RingBuffer.get(&self, usz index) @operator([])
```
```c3
fn Element? RingBuffer.pop(&self)
```
```c3
fn usz? RingBuffer.to_format(&self, Formatter* format) @dynamic
```
```c3
fn usz RingBuffer.read(&self, usz index, Element[] buffer)
```
```c3
fn void RingBuffer.write(&self, Element[] buffer)
```
### `std::collections::set {Value}`
```c3
struct Entry
```
```c3
struct HashSet (Printable)
```
```c3
fn int HashSet.len(&self) @operator(len)
```
```c3
fn HashSet* HashSet.init(&self, Allocator allocator, usz capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashSet* HashSet.tinit(&self, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro HashSet* HashSet.init_with_values(&self, Allocator allocator, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro HashSet* HashSet.tinit_with_values(&self, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashSet* HashSet.init_from_values(&self, Allocator allocator, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn HashSet* HashSet.tinit_from_values(&self, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn bool HashSet.is_initialized(&set)
```
```c3
fn HashSet* HashSet.init_from_set(&self, Allocator allocator, HashSet* other_set)
```
```c3
fn HashSet* HashSet.tinit_from_set(&set, HashSet* other_set)
```
```c3
fn bool HashSet.is_empty(&set) @inline
```
```c3
fn usz HashSet.add_all(&set, Value[] list)
```
```c3
fn usz HashSet.add_all_from(&set, HashSet* other)
```
```c3
fn bool HashSet.add(&set, Value value)
```
```c3
macro HashSet.@each(set; @body(value))
```
```c3
fn bool HashSet.contains(&set, Value value)
```
```c3
fn void? HashSet.remove(&set, Value value) @maydiscard
```
```c3
fn usz HashSet.remove_all(&set, Value[] values)
```
```c3
fn usz HashSet.remove_all_from(&set, HashSet* other)
```
```c3
fn void HashSet.free(&set)
```
```c3
fn void HashSet.clear(&set)
```
```c3
fn void HashSet.reserve(&set, usz capacity)
```
```c3
fn HashSet HashSet.set_union(&self, Allocator allocator, HashSet* other)
```
```c3
fn HashSet HashSet.tset_union(&self, HashSet* other)
```
```c3
fn HashSet HashSet.intersection(&self, Allocator allocator, HashSet* other)
```
```c3
fn HashSet HashSet.tintersection(&self, HashSet* other)
```
```c3
fn HashSet HashSet.difference(&self, Allocator allocator, HashSet* other)
```
```c3
fn HashSet HashSet.tdifference(&self, HashSet* other)
```
```c3
fn HashSet HashSet.symmetric_difference(&self, Allocator allocator, HashSet* other)
```
```c3
fn HashSet HashSet.tsymmetric_difference(&self, HashSet* other)
```
```c3
fn bool HashSet.is_subset(&self, HashSet* other)
```
```c3
fn usz? HashSet.to_format(&self, Formatter* f) @dynamic
```
```c3
struct HashSetIterator
```
```c3
fn HashSetIterator HashSet.iter(&set)
```
```c3
fn Value? HashSetIterator.next(&self)
```
```c3
fn usz HashSetIterator.len(&self) @operator(len)
```
```c3
struct LinkedEntry
```
```c3
struct LinkedHashSet (Printable)
```
```c3
fn int LinkedHashSet.len(&self) @operator(len)
```
```c3
fn LinkedHashSet* LinkedHashSet.init(&self, Allocator allocator, usz capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn LinkedHashSet* LinkedHashSet.tinit(&self, usz capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro LinkedHashSet* LinkedHashSet.init_with_values(&self, Allocator allocator, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
macro LinkedHashSet* LinkedHashSet.tinit_with_values(&self, ..., uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn LinkedHashSet* LinkedHashSet.init_from_values(&self, Allocator allocator, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn LinkedHashSet* LinkedHashSet.tinit_from_values(&self, Value[] values, uint capacity = DEFAULT_INITIAL_CAPACITY, float load_factor = DEFAULT_LOAD_FACTOR)
```
```c3
fn bool LinkedHashSet.is_initialized(&set)
```
```c3
fn LinkedHashSet* LinkedHashSet.init_from_set(&self, Allocator allocator, LinkedHashSet* other_set)
```
```c3
fn LinkedHashSet* LinkedHashSet.tinit_from_set(&set, LinkedHashSet* other_set)
```
```c3
fn bool LinkedHashSet.is_empty(&set) @inline
```
```c3
fn usz LinkedHashSet.add_all(&set, Value[] list)
```
```c3
fn usz LinkedHashSet.add_all_from(&set, LinkedHashSet* other)
```
```c3
fn bool LinkedHashSet.add(&set, Value value)
```
```c3
macro LinkedHashSet.@each(set; @body(value))
```
```c3
fn bool LinkedHashSet.contains(&set, Value value)
```
```c3
fn void? LinkedHashSet.remove(&set, Value value) @maydiscard
```
```c3
fn usz LinkedHashSet.remove_all(&set, Value[] values)
```
```c3
fn usz LinkedHashSet.remove_all_from(&set, LinkedHashSet* other)
```
```c3
fn void LinkedHashSet.free(&set)
```
```c3
fn void LinkedHashSet.clear(&set)
```
```c3
fn void LinkedHashSet.reserve(&set, usz capacity)
```
```c3
fn LinkedHashSet LinkedHashSet.set_union(&self, Allocator allocator, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.tset_union(&self, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.intersection(&self, Allocator allocator, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.tintersection(&self, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.difference(&self, Allocator allocator, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.tdifference(&self, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.symmetric_difference(&self, Allocator allocator, LinkedHashSet* other)
```
```c3
fn LinkedHashSet LinkedHashSet.tsymmetric_difference(&self, LinkedHashSet* other)
```
```c3
fn bool LinkedHashSet.is_subset(&self, LinkedHashSet* other)
```
```c3
fn usz? LinkedHashSet.to_format(&self, Formatter* f) @dynamic
```
```c3
struct LinkedHashSetIterator
```
```c3
fn LinkedHashSetIterator LinkedHashSet.iter(&set)
```
```c3
fn bool LinkedHashSetIterator.next(&self)
```
```c3
fn Value*? LinkedHashSetIterator.get(&self)
```
```c3
fn bool LinkedHashSetIterator.has_next(&self)
```
```c3
fn usz LinkedHashSetIterator.len(&self) @operator(len)
```
### `std::collections::triple{Type1, Type2, Type3}`
```c3
struct Triple
```
```c3
macro void Triple.unpack(&self, a, b, c)
```
### `std::collections::tuple{Type1, Type2}`
```c3
struct Tuple @deprecated("Use 'Pair' instead")
```
### `std::compression::qoi`
```c3
enum QOIColorspace : char (char id)
```
```c3
enum QOIChannels : char (char id)
```
```c3
struct QOIDesc
```
```c3
faultdef INVALID_PARAMETERS, FILE_OPEN_FAILED, FILE_WRITE_FAILED, INVALID_DATA, TOO_MANY_PIXELS
```
```c3
fn char[]? encode(Allocator allocator, char[] input, QOIDesc* desc) @nodiscard
```
```c3
fn char[]? decode(Allocator allocator, char[] data, QOIDesc* desc, QOIChannels channels = AUTO) @nodiscard
```
### `std::compression::qoi @if(!$feature(QOI_NO_STDIO))`
```c3
fn usz? write(String filename, char[] input, QOIDesc* desc)
```
```c3
fn char[]? read(Allocator allocator, String filename, QOIDesc* desc, QOIChannels channels = AUTO)
```
### `std::core::array`
```c3
macro bool contains(array, element)
```
```c3
macro index_of(array, element)
```
```c3
macro slice2d(array_ptr, x = 0, xlen = 0, y = 0, ylen = 0)
```
```c3
macro rindex_of(array, element)
```
```c3
macro concat(Allocator allocator, arr1, arr2) @nodiscard
```
```c3
macro tconcat(arr1, arr2) @nodiscard
```
### `std::core::array::slice {Type}`
```c3
struct Slice2d
```
```c3
fn usz Slice2d.len(&self) @operator(len)
```
```c3
fn usz Slice2d.count(&self)
```
```c3
macro void Slice2d.@each(&self; @body(usz[<2>], Type))
```
```c3
macro void Slice2d.@each_ref(&self; @body(usz[<2>], Type*))
```
```c3
macro Type[] Slice2d.get_row(self, usz idy) @operator([])
```
```c3
macro Type Slice2d.get_coord(self, usz[<2>] coord)
```
```c3
macro Type* Slice2d.get_coord_ref(self, usz[<2>] coord)
```
```c3
macro Type Slice2d.get_xy(self, x, y)
```
```c3
macro Type* Slice2d.get_xy_ref(self, x, y)
```
```c3
macro void Slice2d.set_coord(self, usz[<2>] coord, Type value)
```
```c3
macro void Slice2d.set_xy(self, x, y, Type value)
```
```c3
fn Slice2d Slice2d.slice(&self, isz x = 0, isz xlen = 0, isz y = 0, isz ylen = 0)
```
### `std::core::ascii`
```c3
macro bool @is_lower(c)
```
```c3
macro bool @is_upper(c)
```
```c3
macro bool @is_digit(c)
```
```c3
macro bool @is_bdigit(c)
```
```c3
macro bool @is_odigit(c)
```
```c3
macro bool @is_xdigit(c)
```
```c3
macro bool @is_alpha(c)
```
```c3
macro bool @is_print(c)
```
```c3
macro bool @is_graph(c)
```
```c3
macro bool @is_space(c)
```
```c3
macro bool @is_alnum(c)
```
```c3
macro bool @is_punct(c)
```
```c3
macro bool @is_blank(c)
```
```c3
macro bool @is_cntrl(c)
```
```c3
macro char @to_lower(c)
```
```c3
macro char @to_upper(c)
```
```c3
fn bool is_lower(char c)
```
```c3
fn bool is_upper(char c)
```
```c3
fn bool is_digit(char c)
```
```c3
fn bool is_bdigit(char c)
```
```c3
fn bool is_odigit(char c)
```
```c3
fn bool is_xdigit(char c)
```
```c3
fn bool is_alpha(char c)
```
```c3
fn bool is_print(char c)
```
```c3
fn bool is_graph(char c)
```
```c3
fn bool is_space(char c)
```
```c3
fn bool is_alnum(char c)
```
```c3
fn bool is_punct(char c)
```
```c3
fn bool is_blank(char c)
```
```c3
fn bool is_cntrl(char c)
```
```c3
fn char to_lower(char c)
```
```c3
fn char to_upper(char c)
```
```c3
macro bool char.is_lower(char c)
```
```c3
macro bool char.is_upper(char c)
```
```c3
macro bool char.is_digit(char c)
```
```c3
macro bool char.is_bdigit(char c)
```
```c3
macro bool char.is_odigit(char c)
```
```c3
macro bool char.is_xdigit(char c)
```
```c3
macro bool char.is_alpha(char c)
```
```c3
macro bool char.is_print(char c)
```
```c3
macro bool char.is_graph(char c)
```
```c3
macro bool char.is_space(char c)
```
```c3
macro bool char.is_alnum(char c)
```
```c3
macro bool char.is_punct(char c)
```
```c3
macro bool char.is_blank(char c)
```
```c3
macro bool char.is_cntrl(char c)
```
```c3
macro char char.to_lower(char c)
```
```c3
macro char char.to_upper(char c)
```
```c3
macro char char.from_hex(char c)
```
### `std::core::bitorder`
```c3
bitstruct ShortBE : short @bigendian
```
```c3
bitstruct UShortBE : ushort @bigendian
```
```c3
bitstruct IntBE : int @bigendian
```
```c3
bitstruct UIntBE : int @bigendian
```
```c3
bitstruct LongBE : long @bigendian
```
```c3
bitstruct ULongBE : ulong @bigendian
```
```c3
bitstruct Int128BE : int128 @bigendian
```
```c3
bitstruct UInt128BE : uint128 @bigendian
```
```c3
bitstruct ShortLE : short @littleendian
```
```c3
bitstruct UShortLE : ushort @littleendian
```
```c3
bitstruct IntLE : int @littleendian
```
```c3
bitstruct UIntLE : int @littleendian
```
```c3
bitstruct LongLE : long @littleendian
```
```c3
bitstruct ULongLE : ulong @littleendian
```
```c3
bitstruct Int128LE : int128 @littleendian
```
```c3
bitstruct UInt128LE : uint128 @littleendian
```
```c3
macro read(bytes, $Type)
```
```c3
macro write(x, bytes, $Type)
```
```c3
macro is_bitorder($Type)
```
```c3
macro bool is_array_or_slice_of_char(bytes) @deprecated("Use @is_array_or_slice_of_char")
```
```c3
macro bool @is_array_or_slice_of_char(#bytes) @const
```
```c3
macro bool is_arrayptr_or_slice_of_char(bytes) @deprecated("Use @is_arrayptr_or_slice_of_char")
```
```c3
macro bool @is_arrayptr_or_slice_of_char(#bytes) @const
```
### `std::core::builtin`
```c3
typedef EmptySlot = void*
```
```c3
macro @is_empty_macro_slot(#arg) @const @builtin
```
```c3
macro @is_valid_macro_slot(#arg) @const @builtin
```
```c3
macro @rnd() @const @builtin
```
```c3
faultdef NO_MORE_ELEMENT @builtin
```
```c3
faultdef NOT_FOUND @builtin
```
```c3
faultdef TYPE_MISMATCH @builtin
```
```c3
alias VoidFn = fn void()
```
```c3
macro void @scope(#variable; @body) @builtin
```
```c3
macro void @swap(#a, #b) @builtin
```
```c3
macro anycast(any v, $Type) @builtin
```
```c3
macro bool @assignable_to(#foo, $Type) @const @builtin
```
```c3
macro @addr(#val) @builtin
```
```c3
macro typeid @typeid(#value) @const @builtin
```
```c3
macro TypeKind @typekind(#value) @const @builtin
```
```c3
macro bool @typeis(#value, $Type) @const @builtin
```
```c3
fn bool print_backtrace(String message, int backtraces_to_ignore) @if
```
```c3
fn void default_panic(String message, String file, String function, uint line) @if(env::NATIVE_STACKTRACE)
```
```c3
macro void abort(String string = "Unrecoverable error reached", ...) @format(0) @builtin @noreturn
```
```c3
fn void default_panic(String message, String file, String function, uint line) @if
```
```c3
alias PanicFn = fn void(String message, String file, String function, uint line)
```
```c3
fn void panicf(String fmt, String file, String function, uint line, args...)
```
```c3
macro void unreachable(String string = "Unreachable statement reached.", ...) @builtin @noreturn
```
```c3
macro void unsupported(String string = "Unsupported function invoked") @builtin @noreturn
```
```c3
macro void breakpoint() @builtin
```
```c3
macro any_make(void* ptr, typeid type) @builtin
```
```c3
macro any.retype_to(&self, typeid type)
```
```c3
macro any.as_inner(&self)
```
```c3
macro bitcast(expr, $Type) @builtin
```
```c3
macro enum_by_name($Type, String enum_name) @builtin
```
```c3
macro @enum_from_value($Type, #value, value) @builtin @deprecated("Use Enum.lookup_field and Enum.lookup")
```
```c3
macro bool @likely(bool #value, $probability = 1.0) @builtin
```
```c3
macro bool @unlikely(bool #value, $probability = 1.0) @builtin
```
```c3
macro @expect(#value, expected, $probability = 1.0) @builtin
```
```c3
enum PrefetchLocality
```
```c3
macro @prefetch(void* ptr, PrefetchLocality $locality = VERY_NEAR, bool $write = false) @builtin
```
```c3
macro swizzle(v, ...) @builtin
```
```c3
macro swizzle2(v, v2, ...) @builtin
```
```c3
macro fault @catch(#expr) @builtin
```
```c3
macro bool @ok(#expr) @builtin
```
```c3
macro void? @try(#v, #expr) @builtin
```
```c3
macro bool? @try_catch(#v, #expr, fault expected_fault) @builtin
```
```c3
macro char[] @as_char_view(#value) @builtin
```
```c3
macro isz @str_find(String $string, String $needle) @builtin
```
```c3
macro String @str_upper(String $str) @builtin
```
```c3
macro String @str_lower(String $str) @builtin
```
```c3
macro uint @str_hash(String $str) @builtin
```
```c3
macro @generic_hash_core(h, value)
```
```c3
macro @generic_hash(value)
```
```c3
macro uint int128.hash(self)
```
```c3
macro uint uint128.hash(self)
```
```c3
macro uint long.hash(self)
```
```c3
macro uint ulong.hash(self)
```
```c3
macro uint int.hash(self)
```
```c3
macro uint uint.hash(self)
```
```c3
macro uint short.hash(self)
```
```c3
macro uint ushort.hash(self)
```
```c3
macro uint ichar.hash(self)
```
```c3
macro uint char.hash(self)
```
```c3
macro uint bool.hash(self)
```
```c3
macro uint int128[*].hash(&self)
```
```c3
macro uint uint128[*].hash(&self)
```
```c3
macro uint long[*].hash(&self)
```
```c3
macro uint ulong[*].hash(&self)
```
```c3
macro uint int[*].hash(&self)
```
```c3
macro uint uint[*].hash(&self)
```
```c3
macro uint short[*].hash(&self)
```
```c3
macro uint ushort[*].hash(&self)
```
```c3
macro uint char[*].hash(&self)
```
```c3
macro uint ichar[*].hash(&self)
```
```c3
macro uint bool[*].hash(&self)
```
```c3
macro uint int128[<*>].hash(self)
```
```c3
macro uint uint128[<*>].hash(self)
```
```c3
macro uint long[<*>].hash(self)
```
```c3
macro uint ulong[<*>].hash(self)
```
```c3
macro uint int[<*>].hash(self)
```
```c3
macro uint uint[<*>].hash(self)
```
```c3
macro uint short[<*>].hash(self)
```
```c3
macro uint ushort[<*>].hash(self)
```
```c3
macro uint char[<*>].hash(self)
```
```c3
macro uint ichar[<*>].hash(self)
```
```c3
macro uint bool[<*>].hash(self)
```
```c3
macro uint typeid.hash(typeid t)
```
```c3
macro uint String.hash(String c)
```
```c3
macro uint char[].hash(char[] c)
```
```c3
macro uint void*.hash(void* ptr)
```
```c3
macro void* get_frameaddress(int n)
```
```c3
macro void* get_returnaddress(int n)
```
```c3
macro less(a, b) @builtin
```
```c3
macro less_eq(a, b) @builtin
```
```c3
macro greater(a, b) @builtin
```
```c3
macro int compare_to(a, b) @builtin
```
```c3
macro greater_eq(a, b) @builtin
```
```c3
macro bool equals(a, b) @builtin
```
```c3
macro min(x, ...) @builtin
```
```c3
macro max(x, ...) @builtin
```
### `std::core::builtin @if((env::LINUX || env::ANDROID || env::DARWIN) && env::COMPILER_SAFE_MODE && env::DEBUG_SYMBOLS)`
```c3
fn void sig_panic(String message)
```
```c3
fn void sig_bus_error(CInt i)
```
```c3
fn void sig_segmentation_fault(CInt i)
```
### `std::core::cinterop`
```c3
alias CShort = $typefrom(signed_int_from_bitsize($$C_SHORT_SIZE))
```
```c3
alias CUShort = $typefrom(unsigned_int_from_bitsize($$C_SHORT_SIZE))
```
```c3
alias CInt = $typefrom(signed_int_from_bitsize($$C_INT_SIZE))
```
```c3
alias CUInt = $typefrom(unsigned_int_from_bitsize($$C_INT_SIZE))
```
```c3
alias CLong = $typefrom(signed_int_from_bitsize($$C_LONG_SIZE))
```
```c3
alias CULong = $typefrom(unsigned_int_from_bitsize($$C_LONG_SIZE))
```
```c3
alias CLongLong = $typefrom(signed_int_from_bitsize($$C_LONG_LONG_SIZE))
```
```c3
alias CULongLong = $typefrom(unsigned_int_from_bitsize($$C_LONG_LONG_SIZE))
```
```c3
alias CSChar = ichar
```
```c3
alias CUChar = char
```
```c3
alias CChar = $typefrom($$C_CHAR_IS_SIGNED ? ichar.typeid : char.typeid)
```
```c3
enum CBool : char
```
### `std::core::cpudetect @if(env::X86 || env::X86_64)`
```c3
struct CpuId
```
```c3
fn CpuId x86_cpuid(uint eax, uint ecx = 0)
```
```c3
enum X86Feature
```
```c3
fn void add_feature_if_bit(X86Feature feature, uint register, int bit)
```
```c3
fn void x86_initialize_cpu_features()
```
### `std::core::dstring`
```c3
typedef DString (OutStream) = DStringOpaque*
```
```c3
typedef DStringOpaque = void
```
```c3
fn DString DString.init(&self, Allocator allocator, usz capacity = MIN_CAPACITY)
```
```c3
fn DString DString.tinit(&self, usz capacity = MIN_CAPACITY)
```
```c3
fn DString new_with_capacity(Allocator allocator, usz capacity)
```
```c3
fn DString temp_with_capacity(usz capacity)
```
```c3
fn DString new(Allocator allocator, String c = "")
```
```c3
fn DString temp(String s = "")
```
```c3
fn void DString.replace_char(self, char ch, char replacement)
```
```c3
fn void DString.replace(&self, String needle, String replacement)
```
```c3
fn DString DString.concat(self, Allocator allocator, DString b) @nodiscard
```
```c3
fn DString DString.tconcat(self, DString b)
```
```c3
fn ZString DString.zstr_view(&self)
```
```c3
fn usz DString.capacity(self)
```
```c3
fn usz DString.len(&self) @dynamic @operator(len)
```
```c3
fn void DString.chop(self, usz new_size)
```
```c3
fn String DString.str_view(self)
```
```c3
fn char DString.char_at(self, usz index) @operator([])
```
```c3
fn char* DString.char_ref(&self, usz index) @operator(&[])
```
```c3
fn usz DString.append_utf32(&self, Char32[] chars)
```
```c3
fn void DString.set(self, usz index, char c) @operator([]=)
```
```c3
fn void DString.append_repeat(&self, char c, usz times)
```
```c3
fn usz DString.append_char32(&self, Char32 c)
```
```c3
fn DString DString.tcopy(&self)
```
```c3
fn DString DString.copy(self, Allocator allocator) @nodiscard
```
```c3
fn ZString DString.copy_zstr(self, Allocator allocator) @nodiscard
```
```c3
fn String DString.copy_str(self, Allocator allocator) @nodiscard
```
```c3
fn String DString.tcopy_str(self) @nodiscard
```
```c3
fn bool DString.equals(self, DString other_string)
```
```c3
fn void DString.free(&self)
```
```c3
fn bool DString.less(self, DString other_string)
```
```c3
fn void DString.append_chars(&self, String str)
```
```c3
fn Char32[] DString.copy_utf32(&self, Allocator allocator)
```
```c3
fn void DString.append_string(&self, DString str)
```
```c3
fn void DString.clear(self)
```
```c3
fn usz? DString.write(&self, char[] buffer) @dynamic
```
```c3
fn void? DString.write_byte(&self, char c) @dynamic
```
```c3
fn void DString.append_char(&self, char c)
```
```c3
fn void DString.delete_range(&self, usz start, usz end)
```
```c3
fn void DString.delete(&self, usz start, usz len = 1)
```
```c3
macro void DString.append(&self, value)
```
```c3
fn void DString.insert_chars_at(&self, usz index, String s)
```
```c3
fn void DString.insert_string_at(&self, usz index, DString str)
```
```c3
fn void DString.insert_char_at(&self, usz index, char c)
```
```c3
fn usz DString.insert_char32_at(&self, usz index, Char32 c)
```
```c3
fn usz DString.insert_utf32_at(&self, usz index, Char32[] chars)
```
```c3
macro void DString.insert_at(&self, usz index, value)
```
```c3
fn usz? DString.appendf(&self, String format, args...) @maydiscard
```
```c3
fn usz? DString.appendfn(&self, String format, args...) @maydiscard
```
```c3
fn DString join(Allocator allocator, String[] s, String joiner) @nodiscard
```
```c3
fn void DString.reverse(self)
```
```c3
fn void DString.reserve(&self, usz addition)
```
```c3
fn usz? DString.read_from_stream(&self, InStream reader)
```
### `std::core::env`
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
enum ArchType
```
```c3
macro bool os_is_darwin() @const
```
```c3
macro bool os_is_posix() @const
```
### `std::core::main_stub`
```c3
macro int @main_to_err_main(#m, int, char**)
```
```c3
macro int @main_to_int_main(#m, int, char**)
```
```c3
macro int @main_to_void_main(#m, int, char**)
```
```c3
macro int @main_to_err_main_args(#m, int argc, char** argv)
```
```c3
macro int @main_to_int_main_args(#m, int argc, char** argv)
```
```c3
macro int @_main_runner(#m, int argc, char** argv)
```
```c3
macro int @main_to_void_main_args(#m, int argc, char** argv)
```
### `std::core::main_stub @if(env::WIN32)`
```c3
extern fn Char16** _win_command_line_to_argv_w(ushort* cmd_line, int* argc_ptr) @cname("CommandLineToArgvW")
```
```c3
macro int @win_to_err_main_noargs(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_int_main_noargs(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_void_main_noargs(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_err_main_args(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_int_main_args(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_void_main_args(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_err_main(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_int_main(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @win_to_void_main(#m, void* handle, void* prev_handle, Char16* cmd_line, int show_cmd)
```
```c3
macro int @wmain_to_err_main_args(#m, int argc, Char16** argv)
```
```c3
macro int @wmain_to_int_main_args(#m, int argc, Char16** argv)
```
```c3
macro int @_wmain_runner(#m, int argc, Char16** argv)
```
```c3
macro int @wmain_to_void_main_args(#m, int argc, Char16** argv)
```
### `std::core::mem`
```c3
faultdef OUT_OF_MEMORY, INVALID_ALLOC_SIZE
```
```c3
fn usz os_pagesize()
```
```c3
macro masked_load(ptr, bool[<*>] mask, passthru)
```
```c3
macro @masked_load_aligned(ptr, bool[<*>] mask, passthru, usz $alignment)
```
```c3
macro gather(ptrvec, bool[<*>] mask, passthru)
```
```c3
macro @gather_aligned(ptrvec, bool[<*>] mask, passthru, usz $alignment)
```
```c3
macro masked_store(ptr, value, bool[<*>] mask)
```
```c3
macro @masked_store_aligned(ptr, value, bool[<*>] mask, usz $alignment)
```
```c3
macro scatter(ptrvec, value, bool[<*>] mask)
```
```c3
macro @scatter_aligned(ptrvec, value, bool[<*>] mask, usz $alignment)
```
```c3
macro @unaligned_load(#x, usz $alignment) @builtin
```
```c3
macro @unaligned_store(#x, value, usz $alignment) @builtin
```
```c3
macro @volatile_load(#x) @builtin
```
```c3
macro @volatile_store(#x, value) @builtin
```
```c3
enum AtomicOrdering : int
```
```c3
macro @atomic_load(#x, AtomicOrdering $ordering = SEQ_CONSISTENT, $volatile = false) @builtin
```
```c3
macro void @atomic_store(#x, value, AtomicOrdering $ordering = SEQ_CONSISTENT, $volatile = false) @builtin
```
```c3
macro compare_exchange(ptr, compare, value, AtomicOrdering $success = SEQ_CONSISTENT, AtomicOrdering $failure = SEQ_CONSISTENT, bool $volatile = true, bool $weak = false, usz $alignment = 0)
```
```c3
macro compare_exchange_volatile(ptr, compare, value, AtomicOrdering $success = SEQ_CONSISTENT, AtomicOrdering $failure = SEQ_CONSISTENT)
```
```c3
fn usz aligned_offset(usz offset, usz alignment)
```
```c3
macro void* aligned_pointer(void* ptr, usz alignment)
```
```c3
fn bool ptr_is_aligned(void* ptr, usz alignment) @inline
```
```c3
fn bool ptr_is_page_aligned(void* ptr) @inline
```
```c3
macro void zero_volatile(char[] data)
```
```c3
macro void clear(void* dst, usz len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
macro void clear_inline(void* dst, usz $len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
macro void copy(void* dst, void* src, usz len, usz $dst_align = 0, usz $src_align = 0, bool $is_volatile = false)
```
```c3
macro void copy_inline(void* dst, void* src, usz $len, usz $dst_align = 0, usz $src_align = 0, bool $is_volatile = false)
```
```c3
macro void move(void* dst, void* src, usz len, usz $dst_align = 0, usz $src_align = 0, bool $is_volatile = false)
```
```c3
macro void set(void* dst, char val, usz len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
macro void set_inline(void* dst, char val, usz $len, usz $dst_align = 0, bool $is_volatile = false)
```
```c3
macro bool equals(a, b, isz len = -1, usz $align = 0)
```
```c3
macro bool type_alloc_must_be_aligned($Type)
```
```c3
macro void @scoped(Allocator allocator; @body())
```
```c3
macro void @report_heap_allocs_in_scope($enabled = true; @body())
```
```c3
macro void @assert_leak($report = true; @body()) @builtin
```
```c3
macro void @stack_mem(usz $size; @body(Allocator mem)) @builtin
```
```c3
macro void @stack_pool(usz $size; @body) @builtin
```
```c3
fn PoolState temp_push()
```
```c3
fn void temp_pop(PoolState old_state)
```
```c3
macro void @pool_init(Allocator allocator, usz pool_size,
	usz reserve_size = allocator::temp_allocator_reserve_size,
	usz min_size = allocator::temp_allocator_min_size,
	usz realloc_size = allocator::temp_allocator_realloc_size; @body) @builtin
```
```c3
macro void @pool(usz reserve = 0; @body) @builtin
```
```c3
macro TrackingEnv* get_tracking_env()
```
```c3
macro @clone(value) @builtin @nodiscard
```
```c3
macro @clone_aligned(value) @builtin @nodiscard
```
```c3
macro @tclone(value) @builtin @nodiscard
```
```c3
fn void* malloc(usz size) @builtin @inline @nodiscard
```
```c3
fn void* malloc_aligned(usz size, usz alignment) @builtin @inline @nodiscard
```
```c3
fn void* tmalloc(usz size, usz alignment = 0) @builtin @inline @nodiscard
```
```c3
macro new($Type, ...) @nodiscard
```
```c3
macro new_with_padding($Type, usz padding, ...) @nodiscard
```
```c3
macro new_aligned($Type, ...) @nodiscard
```
```c3
macro alloc($Type) @nodiscard
```
```c3
macro alloc_with_padding($Type, usz padding) @nodiscard
```
```c3
macro alloc_aligned($Type) @nodiscard
```
```c3
macro tnew($Type, ...) @nodiscard
```
```c3
macro temp_with_padding($Type, usz padding, ...) @nodiscard
```
```c3
macro talloc($Type) @nodiscard
```
```c3
macro talloc_with_padding($Type, usz padding) @nodiscard
```
```c3
macro new_array($Type, usz elements) @nodiscard
```
```c3
macro new_array_aligned($Type, usz elements) @nodiscard
```
```c3
macro alloc_array($Type, usz elements) @nodiscard
```
```c3
macro alloc_array_aligned($Type, usz elements) @nodiscard
```
```c3
macro talloc_array($Type, usz elements) @nodiscard
```
```c3
macro temp_array($Type, usz elements) @nodiscard
```
```c3
fn void* calloc(usz size) @builtin @inline @nodiscard
```
```c3
fn void* calloc_aligned(usz size, usz alignment) @builtin @inline @nodiscard
```
```c3
fn void* tcalloc(usz size, usz alignment = 0) @builtin @inline @nodiscard
```
```c3
fn void* realloc(void *ptr, usz new_size) @builtin @inline @nodiscard
```
```c3
fn void* realloc_aligned(void *ptr, usz new_size, usz alignment) @builtin @inline @nodiscard
```
```c3
fn void free(void* ptr) @builtin @inline
```
```c3
fn void free_aligned(void* ptr) @builtin @inline
```
```c3
fn void* trealloc(void* ptr, usz size, usz alignment = mem::DEFAULT_MEM_ALIGNMENT) @builtin @inline @nodiscard
```
```c3
macro @unaligned_addr(#arg) @builtin
```
### `std::core::mem @if(WASM_NOLIBC)`
### `std::core::mem @if(env::NO_LIBC)`
```c3
fn CInt __memcmp(void* s1, void* s2, usz n) @weak @export("memcmp")
```
```c3
fn void* __memset(void* str, CInt c, usz n) @weak @export("memset")
```
```c3
fn void* __memcpy(void* dst, void* src, usz n) @weak @export("memcpy")
```
### `std::core::mem::alignment { Type, ALIGNMENT }`
```c3
typedef UnalignedRef = Type*
```
```c3
macro Type UnalignedRef.get(self)
```
```c3
macro Type UnalignedRef.set(&self, Type val)
```
### `std::core::mem::allocator`
```c3
struct ArenaAllocator (Allocator)
```
```c3
fn ArenaAllocator* ArenaAllocator.init(&self, char[] data)
```
```c3
fn void ArenaAllocator.clear(&self)
```
```c3
macro ArenaAllocator* wrap(char[] bytes)
```
```c3
fn usz ArenaAllocator.mark(&self)
```
```c3
fn void ArenaAllocator.reset(&self, usz mark)
```
```c3
fn void ArenaAllocator.release(&self, void* ptr, bool) @dynamic
```
```c3
fn void*? ArenaAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? ArenaAllocator.resize(&self, void *old_pointer, usz size, usz alignment) @dynamic
```
```c3
struct BackedArenaAllocator (Allocator)
```
```c3
macro usz ExtraPage.pagesize(&self)
```
```c3
macro bool ExtraPage.is_aligned(&self)
```
```c3
fn BackedArenaAllocator*? new_backed_allocator(usz size, Allocator allocator)
```
```c3
fn void BackedArenaAllocator.destroy(&self)
```
```c3
fn usz BackedArenaAllocator.mark(&self)
```
```c3
fn void BackedArenaAllocator.release(&self, void* old_pointer, bool) @dynamic
```
```c3
fn void BackedArenaAllocator.reset(&self, usz mark)
```
```c3
fn void*? BackedArenaAllocator.resize(&self, void* pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*? BackedArenaAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
struct DynamicArenaAllocator (Allocator)
```
```c3
fn void DynamicArenaAllocator.init(&self, Allocator allocator, usz page_size)
```
```c3
fn void DynamicArenaAllocator.free(&self)
```
```c3
fn void DynamicArenaAllocator.release(&self, void* ptr, bool) @dynamic
```
```c3
fn void*? DynamicArenaAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void DynamicArenaAllocator.reset(&self)
```
```c3
fn void*? DynamicArenaAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
struct SimpleHeapAllocator (Allocator)
```
```c3
fn void SimpleHeapAllocator.init(&self, MemoryAllocFn allocator)
```
```c3
fn void*? SimpleHeapAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? SimpleHeapAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void SimpleHeapAllocator.release(&self, void* old_pointer, bool aligned) @dynamic
```
```c3
struct OnStackAllocator (Allocator)
```
```c3
fn void OnStackAllocator.init(&self, char[] data, Allocator allocator)
```
```c3
fn void OnStackAllocator.free(&self)
```
```c3
struct OnStackAllocatorHeader
```
```c3
fn void OnStackAllocator.release(&self, void* old_pointer, bool aligned) @dynamic
```
```c3
fn void*? OnStackAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*? OnStackAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
struct Allocation
```
```c3
alias AllocMap = HashMap { uptr, Allocation }
```
```c3
struct TrackingAllocator (Allocator)
```
```c3
fn void TrackingAllocator.init(&self, Allocator allocator)
```
```c3
fn void TrackingAllocator.free(&self)
```
```c3
fn usz TrackingAllocator.allocated(&self)
```
```c3
fn usz TrackingAllocator.total_allocated(&self)
```
```c3
fn usz TrackingAllocator.total_allocation_count(&self)
```
```c3
fn Allocation[] TrackingAllocator.allocations_tlist(&self, Allocator allocator)
```
```c3
fn usz TrackingAllocator.allocation_count(&self)
```
```c3
fn void*? TrackingAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? TrackingAllocator.resize(&self, void* old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void TrackingAllocator.release(&self, void* old_pointer, bool is_aligned) @dynamic
```
```c3
fn void TrackingAllocator.clear(&self)
```
```c3
fn bool TrackingAllocator.has_leaks(&self)
```
```c3
fn void TrackingAllocator.print_report(&self)
```
```c3
fn void? TrackingAllocator.fprint_report(&self, OutStream out)
```
```c3
struct TrackingEnv
```
```c3
enum AllocInitType
```
```c3
alias MemoryAllocFn = fn char[]?(usz)
```
```c3
macro void* malloc(Allocator allocator, usz size) @nodiscard
```
```c3
macro void*? malloc_try(Allocator allocator, usz size) @nodiscard
```
```c3
macro void* calloc(Allocator allocator, usz size) @nodiscard
```
```c3
macro void*? calloc_try(Allocator allocator, usz size) @nodiscard
```
```c3
macro void* realloc(Allocator allocator, void* ptr, usz new_size) @nodiscard
```
```c3
macro void*? realloc_try(Allocator allocator, void* ptr, usz new_size) @nodiscard
```
```c3
macro void free(Allocator allocator, void* ptr)
```
```c3
macro void*? malloc_aligned(Allocator allocator, usz size, usz alignment) @nodiscard
```
```c3
macro void*? calloc_aligned(Allocator allocator, usz size, usz alignment) @nodiscard
```
```c3
macro void*? realloc_aligned(Allocator allocator, void* ptr, usz new_size, usz alignment) @nodiscard
```
```c3
macro void free_aligned(Allocator allocator, void* ptr)
```
```c3
macro new(Allocator allocator, $Type, ...) @nodiscard
```
```c3
macro new_try(Allocator allocator, $Type, ...) @nodiscard
```
```c3
macro new_aligned(Allocator allocator, $Type, ...) @nodiscard
```
```c3
macro new_with_padding(Allocator allocator, $Type, usz padding) @nodiscard
```
```c3
macro alloc(Allocator allocator, $Type) @nodiscard
```
```c3
macro alloc_try(Allocator allocator, $Type) @nodiscard
```
```c3
macro alloc_aligned(Allocator allocator, $Type) @nodiscard
```
```c3
macro alloc_with_padding(Allocator allocator, $Type, usz padding) @nodiscard
```
```c3
macro new_array(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro new_array_try(Allocator allocator, $Type, usz elements) @nodiscard
```
```c3
macro new_array_aligned(Allocator allocator, $Type, usz elements) @nodiscard
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
macro clone(Allocator allocator, value) @nodiscard
```
```c3
macro clone_aligned(Allocator allocator, value) @nodiscard
```
```c3
fn any clone_any(Allocator allocator, any value) @nodiscard
```
```c3
macro void*? @aligned_alloc(#alloc_fn, usz bytes, usz alignment)
```
```c3
struct AlignedBlock
```
```c3
macro void? @aligned_free(#free_fn, void* old_pointer)
```
```c3
macro void*? @aligned_realloc(#calloc_fn, #free_fn, void* old_pointer, usz bytes, usz alignment)
```
```c3
alias mem @builtin = thread_allocator
```
```c3
typedef PoolState = TempAllocator*
```
```c3
fn PoolState push_pool(usz reserve = 0)
```
```c3
fn void pop_pool(PoolState old)
```
```c3
macro Allocator heap() @deprecated("Use 'mem' instead.")
```
```c3
macro Allocator temp() @deprecated("Use 'tmem' instead")
```
```c3
alias tmem @builtin = current_temp
```
```c3
fn void destroy_temp_allocators()
```
```c3
fn void*? LazyTempAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? LazyTempAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
```c3
fn void LazyTempAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
```c3
typedef NullAllocator (Allocator) = uptr
```
```c3
fn void*? NullAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? NullAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
```c3
fn void NullAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
```c3
struct WasmMemory
```
```c3
fn char[]? WasmMemory.allocate_block(&self, usz bytes)
```
### `std::core::mem::allocator @if(!(env::POSIX || env::WIN32) || !$feature(VMEM_TEMP))`
```c3
struct TempAllocator (Allocator)
```
```c3
struct TempAllocatorPage
```
```c3
macro usz TempAllocatorPage.pagesize(&self)
```
```c3
macro bool TempAllocatorPage.is_aligned(&self)
```
```c3
fn TempAllocator*? new_temp_allocator(Allocator allocator, usz size, usz reserve = temp_allocator_reserve_size, usz min_size = temp_allocator_min_size, usz realloc_size = temp_allocator_realloc_size)
```
```c3
fn TempAllocator*? TempAllocator.derive_allocator(&self, usz reserve = 0)
```
```c3
fn void TempAllocator.reset(&self)
```
```c3
fn void TempAllocator.free(&self)
```
```c3
fn void TempAllocator.release(&self, void* old_pointer, bool) @dynamic
```
```c3
fn void*? TempAllocator.resize(&self, void* pointer, usz size, usz alignment) @dynamic
```
```c3
fn void*? TempAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
### `std::core::mem::allocator @if(!env::WIN32 && !env::POSIX && env::LIBC)`
```c3
fn void*? LibcAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? LibcAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
```c3
fn void LibcAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
### `std::core::mem::allocator @if((env::POSIX || env::WIN32) && $feature(VMEM_TEMP))`
```c3
fn TempAllocator*? new_temp_allocator(Allocator allocator, usz size, usz reserve = temp_allocator_reserve_size, usz min_size = temp_allocator_min_size, usz realloc_size = temp_allocator_realloc_size)
```
```c3
struct TempAllocator (Allocator)
```
```c3
fn void*? TempAllocator.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn TempAllocator*? TempAllocator.derive_allocator(&self, usz reserve = 0)
```
```c3
fn void TempAllocator.reset(&self)
```
```c3
fn void TempAllocator.free(&self)
```
```c3
fn void*? TempAllocator.resize(&self, void* pointer, usz size, usz alignment) @dynamic
```
```c3
fn void TempAllocator.release(&self, void* old_pointer, bool b) @dynamic
```
### `std::core::mem::allocator @if(env::LIBC)`
```c3
typedef LibcAllocator (Allocator) = uptr
```
### `std::core::mem::allocator @if(env::POSIX || env::WIN32)`
```c3
faultdef VMEM_RESERVE_FAILED
```
```c3
struct Vmem (Allocator)
```
```c3
bitstruct VmemOptions : int
```
```c3
fn void? Vmem.init(&self, usz preferred_size, usz reserve_page_size = 0, VmemOptions options = { true, true, env::COMPILER_SAFE_MODE }, usz min_size = 0)
```
```c3
fn void*? Vmem.acquire(&self, usz size, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn bool Vmem.owns_pointer(&self, void* ptr) @inline
```
```c3
fn void*? Vmem.resize(&self, void *old_pointer, usz size, usz alignment) @dynamic
```
```c3
fn void Vmem.release(&self, void* ptr, bool) @dynamic
```
```c3
fn usz Vmem.mark(&self)
```
```c3
fn void Vmem.reset(&self, usz mark)
```
```c3
fn void Vmem.free(&self)
```
### `std::core::mem::allocator @if(env::POSIX)`
```c3
fn void*? LibcAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? LibcAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
```c3
fn void LibcAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
### `std::core::mem::allocator @if(env::WIN32)`
```c3
fn void*? LibcAllocator.acquire(&self, usz bytes, AllocInitType init_type, usz alignment) @dynamic
```
```c3
fn void*? LibcAllocator.resize(&self, void* old_ptr, usz new_bytes, usz alignment) @dynamic
```
```c3
fn void LibcAllocator.release(&self, void* old_ptr, bool aligned) @dynamic
```
### `std::core::mem::rc`
```c3
struct RefCounted
```
```c3
macro retain(refcounted)
```
```c3
macro void release(refcounted)
```
### `std::core::mem::ref { Type }`
```c3
alias DeallocFn = fn void(void*)
```
```c3
fn Ref wrap(Type* ptr, Allocator allocator = mem)
```
```c3
macro Ref new(..., Allocator allocator = mem)
```
```c3
struct Ref
```
```c3
fn Ref* Ref.retain(&self)
```
```c3
fn void Ref.release(&self)
```
### `std::core::mem::vm`
```c3
struct VirtualMemory
```
```c3
faultdef RANGE_OVERFLOW, UNKNOWN_ERROR, ACCESS_DENIED, UNMAPPED_ACCESS, UNALIGNED_ADDRESS, RELEASE_FAILED, UPDATE_FAILED, INVALID_ARGS
```
```c3
enum VirtualMemoryAccess
```
```c3
fn usz aligned_alloc_size(usz size)
```
```c3
fn void*? alloc(usz size, VirtualMemoryAccess access)
```
```c3
fn void? release(void* ptr, usz size)
```
```c3
fn void? protect(void* ptr, usz len, VirtualMemoryAccess access)
```
```c3
fn void? commit(void* ptr, usz len, VirtualMemoryAccess access = READWRITE)
```
```c3
fn void? decommit(void* ptr, usz len, bool block = true)
```
```c3
fn VirtualMemory? virtual_alloc(usz size, VirtualMemoryAccess access = PROTECTED)
```
```c3
macro void? VirtualMemory.commit(self, usz offset, usz len)
```
```c3
macro void? VirtualMemory.protect(self, usz offset, usz len, VirtualMemoryAccess access)
```
```c3
fn void? VirtualMemory.decommit(self, usz offset, usz len, bool block = true)
```
```c3
fn void? VirtualMemory.destroy(&self)
```
### `std::core::mem::volatile { Type }`
```c3
typedef Volatile @structlike = Type
```
```c3
macro Type Volatile.get(&self)
```
```c3
macro Type Volatile.set(&self, Type val)
```
### `std::core::runtime`
```c3
struct ReflectedParam (Printable) @if(!$defined(ReflectedParam))
```
```c3
struct AnyRaw
```
```c3
struct SliceRaw
```
```c3
macro @enum_lookup($Type, #value, value)
```
```c3
macro @enum_lookup_new($Type, $name, value)
```
```c3
alias BenchmarkFn = fn void()
```
```c3
struct BenchmarkUnit
```
```c3
fn BenchmarkUnit[] benchmark_collection_create(Allocator allocator)
```
```c3
fn void set_benchmark_warmup_iterations(uint value) @builtin
```
```c3
fn void set_benchmark_max_iterations(uint value) @builtin
```
```c3
fn bool run_benchmarks(BenchmarkUnit[] benchmarks)
```
```c3
fn bool default_benchmark_runner(String[] args)
```
```c3
alias TestFn = fn void()
```
```c3
struct TestContext
```
```c3
struct TestUnit
```
```c3
fn TestUnit[] test_collection_create(Allocator allocator)
```
```c3
fn int cmp_test_unit(TestUnit a, TestUnit b)
```
```c3
fn bool default_test_runner(String[] args)
```
### `std::core::runtime @if(WASM_NOLIBC)`
```c3
extern fn void __wasm_call_ctors()
```
### `std::core::sanitizer`
```c3
macro void annotate_contiguous_container(void* beg, void* end, void* old_mid, void* new_mid)
```
```c3
macro void annotate_double_ended_contiguous_container(void* storage_beg, void* storage_end, void* old_container_beg, void* old_container_end, void* new_container_beg, void* new_container_end)
```
```c3
macro void print_stack_trace()
```
```c3
fn void set_death_callback(VoidFn callback)
```
### `std::core::sanitizer @if (env::ANY_SANITIZER)`
```c3
struct __Sanitizer_sandbox_arguments
```
```c3
extern fn void __sanitizer_set_report_path(ZString path)
```
### `std::core::sanitizer::asan`
```c3
alias ErrorCallback = fn void (ZString)
```
```c3
macro poison_memory_region(void* addr, usz size)
```
```c3
macro unpoison_memory_region(void* addr, usz size)
```
```c3
macro bool address_is_poisoned(void* addr)
```
```c3
macro void* region_is_poisoned(void* beg, usz size)
```
```c3
fn void set_error_report_callback(ErrorCallback callback)
```
### `std::core::sanitizer::asan @if(env::ADDRESS_SANITIZER)`
```c3
extern fn void __asan_poison_memory_region(void* addr, usz size)
```
### `std::core::sanitizer::tsan`
```c3
typedef MutexFlags = inline CUInt
```
```c3
macro void mutex_create(void* addr, MutexFlags flags)
```
```c3
macro void mutex_destroy(void* addr, MutexFlags flags)
```
```c3
macro void mutex_pre_lock(void* addr, MutexFlags flags)
```
```c3
macro void mutex_post_lock(void* addr, MutexFlags flags, CInt recursion)
```
```c3
macro CInt mutex_pre_unlock(void* addr, MutexFlags flags)
```
```c3
macro void mutex_post_unlock(void* addr, MutexFlags flags)
```
```c3
macro void mutex_pre_signal(void* addr, MutexFlags flags)
```
```c3
macro void mutex_post_signal(void* addr, MutexFlags flags)
```
```c3
macro void mutex_pre_divert(void* addr, MutexFlags flags)
```
```c3
macro void mutex_post_divert(void* addr, MutexFlags flags)
```
### `std::core::string`
```c3
typedef String @if(!$defined(String)) = inline char[]
```
```c3
typedef ZString = inline char*
```
```c3
typedef WString = inline Char16*
```
```c3
alias Char32 = uint
```
```c3
alias Char16 = ushort
```
```c3
faultdef INVALID_UTF8, INVALID_UTF16, CONVERSION_FAILED,
         EMPTY_STRING, NEGATIVE_VALUE, MALFORMED_INTEGER,
         INTEGER_OVERFLOW, MALFORMED_FLOAT, FLOAT_OUT_OF_RANGE
```
```c3
macro Char32* @wstring32(String $string) @builtin
```
```c3
macro Char32[] @char32(String $string) @builtin
```
```c3
macro WString @wstring(String $string) @builtin
```
```c3
macro Char16[] @char16(String $string) @builtin
```
```c3
macro String @sprintf(String $format, ...) @builtin @const
```
```c3
fn ZString tformat_zstr(String fmt, args...) @format(0)
```
```c3
fn String format(Allocator allocator, String fmt, args...) @format(1)
```
```c3
fn String bformat(char[] buffer, String fmt, args...) @format(1)
```
```c3
fn String tformat(String fmt, args...) @format(0)
```
```c3
macro bool char_in_set(char c, String set)
```
```c3
fn String join(Allocator allocator, String[] s, String joiner)
```
```c3
fn String String.replace(self, Allocator allocator, String needle, String new_str) @nodiscard
```
```c3
fn String String.treplace(self, String needle, String new_str)
```
```c3
fn String String.trim(self, String to_trim = "\t\n\r ")
```
```c3
fn String String.trim_left(self, String to_trim = "\t\n\r ")
```
```c3
fn String String.trim_right(self, String to_trim = "\t\n\r ")
```
```c3
fn bool String.starts_with(self, String prefix)
```
```c3
fn bool String.ends_with(self, String suffix)
```
```c3
fn String String.strip(self, String prefix)
```
```c3
fn String String.strip_end(self, String suffix)
```
```c3
fn String[] String.split(self, Allocator allocator, String delimiter, usz max = 0, bool skip_empty = false)
```
```c3
fn String[] String.tsplit(s, String delimiter, usz max = 0, bool skip_empty = false)
```
```c3
faultdef BUFFER_EXCEEDED
```
```c3
fn String[]? String.split_to_buffer(s, String delimiter, String[] buffer, usz max = 0, bool skip_empty = false)
```
```c3
fn bool String.contains(s, String substr)
```
```c3
fn usz String.count(self, String substr)
```
```c3
fn usz? String.index_of_char(self, char character)
```
```c3
fn usz? String.index_of_chars(String self, char[] characters)
```
```c3
fn usz? String.index_of_char_from(self, char character, usz start_index)
```
```c3
fn usz? String.rindex_of_char(self, char character)
```
```c3
fn usz? String.index_of(self, String substr)
```
```c3
fn usz? String.rindex_of(self, String substr)
```
```c3
fn bool ZString.eq(self, ZString other) @operator(==)
```
```c3
fn String ZString.str_view(self)
```
```c3
fn usz ZString.char_len(str)
```
```c3
fn usz ZString.len(self)
```
```c3
fn usz WString.len(self)
```
```c3
fn ZString String.zstr_copy(self, Allocator allocator)
```
```c3
fn String String.concat(self, Allocator allocator, String s2)
```
```c3
fn String String.tconcat(self, String s2)
```
```c3
fn ZString String.zstr_tcopy(self)
```
```c3
fn String String.copy(self, Allocator allocator)
```
```c3
fn void String.free(&self, Allocator allocator)
```
```c3
fn String String.tcopy(self)
```
```c3
fn String ZString.copy(self, Allocator allocator)
```
```c3
fn String ZString.tcopy(self)
```
```c3
fn Char16[]? String.to_utf16(self, Allocator allocator)
```
```c3
fn Char16[]? String.to_temp_utf16(self)
```
```c3
fn WString? String.to_wstring(self, Allocator allocator)
```
```c3
fn WString? String.to_temp_wstring(self)
```
```c3
fn Char32[]? String.to_utf32(self, Allocator allocator)
```
```c3
fn Char32[]? String.to_temp_utf32(self)
```
```c3
fn void String.convert_to_lower(self)
```
```c3
fn String String.to_lower_copy(self, Allocator allocator)
```
```c3
fn String String.to_lower_tcopy(self)
```
```c3
fn void String.convert_to_upper(self)
```
```c3
fn String String.to_upper_copy(self, Allocator allocator)
```
```c3
fn String String.capitalize_copy(self, Allocator allocator)
```
```c3
fn String String.snake_to_pascal_copy(self, Allocator allocator)
```
```c3
fn void String.convert_snake_to_pascal(&self)
```
```c3
fn String String.pascal_to_snake_copy(self, Allocator allocator)
```
```c3
fn StringIterator String.iterator(self)
```
```c3
fn String String.to_upper_tcopy(self)
```
```c3
fn String? from_utf32(Allocator allocator, Char32[] utf32)
```
```c3
fn String? from_utf16(Allocator allocator, Char16[] utf16)
```
```c3
fn String? from_wstring(Allocator allocator, WString wstring)
```
```c3
fn String? tfrom_wstring(WString wstring)
```
```c3
fn String? tfrom_utf16(Char16[] utf16)
```
```c3
fn usz String.utf8_codepoints(s)
```
```c3
fn bool String.is_zstr(self) @deprecated("Unsafe, use copy instead")
```
```c3
fn ZString String.quick_zstr(self) @deprecated("Unsafe, use zstr_tcopy instead")
```
```c3
macro String.to_integer(self, $Type, int base = 10)
```
```c3
fn int128? String.to_int128(self, int base = 10)
```
```c3
fn long? String.to_long(self, int base = 10)
```
```c3
fn int? String.to_int(self, int base = 10)
```
```c3
fn short? String.to_short(self, int base = 10)
```
```c3
fn ichar? String.to_ichar(self, int base = 10)
```
```c3
fn uint128? String.to_uint128(self, int base = 10)
```
```c3
fn ulong? String.to_ulong(self, int base = 10)
```
```c3
fn uint? String.to_uint(self, int base = 10)
```
```c3
fn ushort? String.to_ushort(self, int base = 10)
```
```c3
fn char? String.to_uchar(self, int base = 10)
```
```c3
fn double? String.to_double(self)
```
```c3
fn float? String.to_float(self)
```
```c3
fn Splitter String.tokenize(self, String split)
```
```c3
fn Splitter String.tokenize_all(self, String split, bool skip_last = false)
```
```c3
fn Splitter String.splitter(self, String split) @deprecated("Use tokenize_all instead")
```
```c3
macro String from_struct(Allocator allocator, x)
```
```c3
macro String tfrom_struct(x)
```
```c3
enum SplitterType
```
```c3
struct Splitter
```
```c3
fn void Splitter.reset(&self)
```
```c3
fn String? Splitter.next(&self)
```
```c3
faultdef INVALID_ESCAPE_SEQUENCE, UNTERMINATED_STRING, INVALID_HEX_ESCAPE, INVALID_UNICODE_ESCAPE
```
```c3
fn String String.escape(String s, Allocator allocator, bool strip_quotes = true)
```
```c3
fn String String.tescape(String s, bool strip_quotes = false)
```
```c3
fn usz escape_len(String s)
```
```c3
fn String? String.unescape(String s, Allocator allocator, bool allow_unquoted = false)
```
```c3
fn String? String.tunescape(String s, bool allow_unquoted = false)
```
```c3
fn bool needs_escape(char c)
```
```c3
macro double? decfloat(char[] chars, int $bits, int $emin, int sign)
```
```c3
macro double? hexfloat(char[] chars, int $bits, int $emin, int sign)
```
### `std::core::string::ansi`
```c3
enum Ansi : const inline String
```
```c3
macro String color_8bit(char $index, bool $bg = false) @const
```
```c3
macro String color_rgb(char $r, char $g, char $b, bool $bg = false) @const
```
```c3
macro String color(uint $rgb, bool $bg = false) @const
```
```c3
fn String make_color(Allocator mem, uint rgb, bool bg = false)
```
```c3
fn String make_tcolor(uint rgb, bool bg = false)
```
```c3
fn String make_color_rgb(Allocator mem, char r, char g, char b, bool bg = false)
```
```c3
fn String make_tcolor_rgb(char r, char g, char b, bool bg = false)
```
### `std::core::string::conv`
```c3
fn usz? char32_to_utf8(Char32 c, char[] output)
```
```c3
fn void char32_to_utf16_unsafe(Char32 c, Char16** output)
```
```c3
fn void? char16_to_utf8_unsafe(Char16 *ptr, usz *available, char** output)
```
```c3
fn usz char32_to_utf8_unsafe(Char32 c, char** output)
```
```c3
fn Char32? utf8_to_char32(char* ptr, usz* size)
```
```c3
fn usz utf8_codepoints(String utf8)
```
```c3
fn usz utf8len_for_utf32(Char32[] utf32)
```
```c3
fn usz utf8len_for_utf16(Char16[] utf16)
```
```c3
fn usz utf16len_for_utf8(String utf8)
```
```c3
fn usz utf16len_for_utf32(Char32[] utf32)
```
```c3
fn usz? utf32to8(Char32[] utf32, char[] utf8_buffer)
```
```c3
fn usz? utf8to32(String utf8, Char32[] utf32_buffer)
```
```c3
fn void? utf16to8_unsafe(Char16[] utf16, char* utf8_buffer)
```
```c3
fn void? utf8to32_unsafe(String utf8, Char32* utf32_buffer)
```
```c3
fn void? utf8to16_unsafe(String utf8, Char16* utf16_buffer)
```
```c3
fn void utf32to8_unsafe(Char32[] utf32, char* utf8_buffer)
```
### `std::core::string::iterator`
```c3
struct StringIterator
```
```c3
fn void StringIterator.reset(&self)
```
```c3
fn Char32? StringIterator.next(&self)
```
```c3
fn Char32? StringIterator.peek(&self)
```
```c3
fn bool StringIterator.has_next(&self)
```
```c3
fn Char32? StringIterator.get(&self)
```
### `std::core::test`
```c3
macro @setup(TestFn setup_fn, TestFn teardown_fn = null)
```
```c3
macro @check(#condition, String format = "", args...)
```
```c3
macro @error(#funcresult, fault error_expected)
```
```c3
macro eq(left, right)
```
```c3
macro void eq_approx(double left, double right, uint places = 7, double delta = 0, bool equal_nan = true)
```
```c3
macro void ne(left, right)
```
```c3
macro gt(left, right)
```
```c3
macro ge(left, right)
```
```c3
macro lt(left, right)
```
```c3
macro le(left, right)
```
### `std::core::types`
```c3
faultdef VALUE_OUT_OF_RANGE, VALUE_OUT_OF_UNSIGNED_RANGE
```
```c3
macro any_to_enum_ordinal(any v, $Type)
```
```c3
macro any_to_int(any v, $Type)
```
```c3
fn bool typeid.is_subtype_of(self, typeid other)
```
```c3
macro bool is_subtype_of($Type, $OtherType)
```
```c3
macro bool is_numerical($Type)
```
```c3
fn bool TypeKind.is_int(kind) @inline
```
```c3
macro bool is_slice_convertable($Type)
```
```c3
macro bool is_bool($Type) @const
```
```c3
macro bool is_int($Type) @const
```
```c3
macro bool is_signed($Type) @const
```
```c3
macro bool is_unsigned($Type) @const
```
```c3
macro typeid flat_type($Type) @const
```
```c3
macro TypeKind flat_kind($Type) @const
```
```c3
macro bool is_indexable($Type) @const
```
```c3
macro bool is_ref_indexable($Type) @const
```
```c3
macro bool is_flat_intlike($Type) @const
```
```c3
macro bool is_intlike($Type) @const
```
```c3
macro bool is_underlying_int($Type) @const
```
```c3
macro bool is_float($Type) @const
```
```c3
macro bool is_floatlike($Type) @const
```
```c3
macro bool is_vector($Type) @const
```
```c3
macro typeid inner_type($Type) @const
```
```c3
macro TypeKind inner_kind($Type) @const
```
```c3
macro bool is_same($TypeA, $TypeB) @const
```
```c3
macro bool @has_same(#a, #b, ...) @const
```
```c3
macro bool may_load_atomic($Type) @const
```
```c3
macro lower_to_atomic_compatible_type($Type) @const
```
```c3
macro bool is_promotable_to_floatlike($Type) @const
```
```c3
macro bool is_promotable_to_float($Type) @const
```
```c3
macro bool is_same_vector_type($Type1, $Type2) @const
```
```c3
macro bool is_equatable_type($Type) @const
```
```c3
macro bool implements_copy($Type) @const
```
```c3
macro bool @equatable_value(#value) @const
```
```c3
macro bool @comparable_value(#value) @const
```
```c3
enum TypeKind : char
```
```c3
struct TypeEnum
```
### `std::core::values`
```c3
macro bool @is_same_type(#value1, #value2) @const
```
```c3
macro bool @is_bool(#value) @const
```
```c3
macro bool @is_int(#value) @const
```
```c3
macro bool @is_flat_intlike(#value) @const
```
```c3
macro bool @is_floatlike(#value) @const
```
```c3
macro bool @is_float(#value) @const
```
```c3
macro bool @is_promotable_to_floatlike(#value) @const
```
```c3
macro bool @is_promotable_to_float(#value) @const
```
```c3
macro bool @is_vector(#value) @const
```
```c3
macro bool @is_same_vector_type(#value1, #value2) @const
```
```c3
macro bool @assign_to(#value1, #value2) @const
```
```c3
macro bool @is_lvalue(#value)
```
```c3
macro bool @is_const(#foo) @const @builtin
```
```c3
macro promote_int(x)
```
```c3
macro @select(bool $bool, #value_1, #value_2) @builtin
```
```c3
macro promote_int_same(x, y)
```
```c3
macro TypeKind @inner_kind(#value) @const
```
### `std::crypto`
```c3
fn bool safe_compare(void* data1, void* data2, usz len)
```
### `std::crypto::dh`
```c3
fn BigInt generate_secret(BigInt p, BigInt x, BigInt y)
```
```c3
fn BigInt public_key(BigInt p, BigInt g, BigInt x)
```
### `std::crypto::ed25519`
```c3
alias Ed25519PrivateKey = char[32]
```
```c3
alias Ed25519PublicKey = char[Ed25519PrivateKey.len]
```
```c3
alias Ed25519Signature = char[2 * Ed25519PublicKey.len]
```
```c3
fn Ed25519PublicKey public_keygen(char[] private_key)
```
```c3
fn Ed25519Signature sign(char[] message, char[] private_key, char[] public_key)
```
```c3
fn bool verify(char[] message, char[] signature, char[] public_key)
```
### `std::crypto::rc4`
```c3
struct Rc4
```
```c3
fn void Rc4.init(&self, char[] key)
```
```c3
fn void crypt(char[] key, char[] data)
```
```c3
fn void Rc4.crypt(&self, char[] in, char[] out)
```
```c3
fn void Rc4.destroy(&self)
```
### `std::encoding`
```c3
faultdef INVALID_CHARACTER, INVALID_PADDING
```
### `std::encoding::base32`
```c3
struct Base32Alphabet
```
```c3
fn String? encode(Allocator allocator, char[] src, char padding = DEFAULT_PAD, Base32Alphabet* alphabet = &STANDARD)
```
```c3
fn char[]? decode(Allocator allocator, char[] src, char padding = DEFAULT_PAD, Base32Alphabet* alphabet = &STANDARD)
```
```c3
fn String? tencode(char[] code, char padding = DEFAULT_PAD, Base32Alphabet* alphabet = &STANDARD) @inline
```
```c3
fn char[]? tdecode(char[] code, char padding = DEFAULT_PAD, Base32Alphabet* alphabet = &STANDARD) @inline
```
```c3
fn usz decode_len(usz n, char padding)
```
```c3
fn usz encode_len(usz n, char padding)
```
```c3
fn char[]? decode_buffer(char[] src, char[] dst, char padding = DEFAULT_PAD, Base32Alphabet* alphabet = &STANDARD)
```
```c3
fn String encode_buffer(char[] src, char[] dst, char padding = DEFAULT_PAD, Base32Alphabet* alphabet = &STANDARD)
```
```c3
typedef Alphabet = char[32]
```
### `std::encoding::base64`
```c3
struct Base64Alphabet
```
```c3
fn String encode(Allocator allocator, char[] src, char padding = DEFAULT_PAD, Base64Alphabet* alphabet = &STANDARD)
```
```c3
fn char[]? decode(Allocator allocator, char[] src, char padding = DEFAULT_PAD, Base64Alphabet* alphabet = &STANDARD)
```
```c3
fn String tencode(char[] code, char padding = DEFAULT_PAD, Base64Alphabet* alphabet = &STANDARD) @inline
```
```c3
fn char[]? tdecode(char[] code, char padding = DEFAULT_PAD, Base64Alphabet* alphabet = &STANDARD) @inline
```
```c3
fn usz encode_len(usz n, char padding)
```
```c3
fn usz? decode_len(usz n, char padding)
```
```c3
fn String encode_buffer(char[] src, char[] dst, char padding = DEFAULT_PAD, Base64Alphabet* alphabet = &STANDARD)
```
```c3
fn char[]? decode_buffer(char[] src, char[] dst, char padding = DEFAULT_PAD, Base64Alphabet* alphabet = &STANDARD)
```
### `std::encoding::csv`
```c3
struct CsvReader
```
```c3
struct CsvRow (Printable)
```
```c3
fn usz? CsvRow.to_format(&self, Formatter* f) @dynamic
```
```c3
fn usz CsvRow.len(&self) @operator(len)
```
```c3
fn String CsvRow.get_col(&self, usz col) @operator([])
```
```c3
fn void CsvReader.init(&self, InStream stream, String separator = ",")
```
```c3
fn CsvRow? CsvReader.read_row(self, Allocator allocator)
```
```c3
fn CsvRow? CsvReader.tread_row(self)
```
```c3
fn void CsvRow.free(&self)
```
```c3
fn void? CsvReader.skip_row(self) @maydiscard
```
```c3
macro void? @each_row(InStream stream, String separator = ",", int max_rows = int.max; @body(String[] row)) @maydiscard
```
```c3
macro void? CsvReader.@each_row(self, int rows = int.max; @body(String[] row)) @maydiscard
```
### `std::encoding::hex`
```c3
fn String encode_buffer(char[] code, char[] buffer)
```
```c3
fn char[]? decode_buffer(char[] code, char[] buffer)
```
```c3
fn String encode(Allocator allocator, char[] code)
```
```c3
fn char[]? decode(Allocator allocator, char[] code)
```
```c3
fn String tencode(char[] code) @inline
```
```c3
fn char[]? tdecode(char[] code) @inline
```
```c3
fn usz encode_len(usz n)
```
```c3
fn usz encode_bytes(char[] src, char[] dst)
```
```c3
macro usz decode_len(usz n)
```
```c3
fn usz? decode_bytes(char[] src, char[] dst)
```
### `std::encoding::json`
```c3
faultdef UNEXPECTED_CHARACTER, INVALID_ESCAPE_SEQUENCE, INVALID_NUMBER, MAX_DEPTH_REACHED
```
```c3
fn Object*? parse_string(Allocator allocator, String s)
```
```c3
fn Object*? tparse_string(String s)
```
```c3
fn Object*? parse(Allocator allocator, InStream s)
```
```c3
fn Object*? tparse(InStream s)
```
```c3
fn JsonTokenType? lex_string(JsonContext* context)
```
### `std::experimental::scheduler{Event}`
```c3
struct FrameScheduler
```
```c3
fn void FrameScheduler.init(&self)
```
```c3
macro void FrameScheduler.@destroy(&self; @destruct(Event e))
```
```c3
fn void FrameScheduler.queue_delayed_event(&self, Event event, Duration delay)
```
```c3
fn bool FrameScheduler.has_delayed(&self)
```
```c3
fn void FrameScheduler.queue_event(&self, Event event)
```
```c3
fn Event? FrameScheduler.pop_event(&self)
```
### `std::hash::a5hash`
```c3
fn ulong hash(char[] data, ulong seed = 0)
```
### `std::hash::adler32`
```c3
struct Adler32
```
```c3
fn void Adler32.init(&self)
```
```c3
fn void Adler32.updatec(&self, char c)
```
```c3
fn void Adler32.update(&self, char[] data)
```
```c3
fn uint Adler32.final(&self)
```
```c3
fn uint hash(char[] data)
```
### `std::hash::crc32`
```c3
struct Crc32
```
```c3
fn void Crc32.init(&self, uint seed = 0)
```
```c3
fn void Crc32.updatec(&self, char c)
```
```c3
fn void Crc32.update(&self, char[] data)
```
```c3
fn uint Crc32.final(&self)
```
```c3
fn uint hash(char[] data)
```
### `std::hash::crc64`
```c3
struct Crc64
```
```c3
fn void Crc64.init(&self, uint seed = 0)
```
```c3
fn void Crc64.updatec(&self, char c)
```
```c3
fn void Crc64.update(&self, char[] data)
```
```c3
fn ulong Crc64.final(&self)
```
```c3
fn ulong hash(char[] data)
```
### `std::hash::fnv32a`
```c3
typedef Fnv32a = uint
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
fn uint hash(char[] data)
```
### `std::hash::fnv64a`
```c3
typedef Fnv64a = ulong
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
fn ulong hash(char[] data)
```
### `std::hash::hmac{HashAlg, HASH_BYTES, BLOCK_BYTES}`
```c3
struct Hmac
```
```c3
fn char[HASH_BYTES] hash(char[] key, char[] message)
```
```c3
fn void pbkdf2(char[] pw, char[] salt, uint iterations, char[] output)
```
```c3
fn void Hmac.init(&self, char[] key)
```
```c3
fn void Hmac.update(&self, char[] data)
```
```c3
fn char[HASH_BYTES] Hmac.final(&self)
```
```c3
macro @derive(Hmac *hmac_start, char[] salt, uint iterations, usz index, char[] out)
```
### `std::hash::komi`
```c3
fn ulong hash(char[] data, ulong seed = 0)
```
### `std::hash::md5`
```c3
struct Md5
```
```c3
alias HmacMd5 = Hmac{Md5, HASH_BYTES, BLOCK_BYTES}
```
```c3
alias hmac = hmac::hash{Md5, HASH_BYTES, BLOCK_BYTES}
```
```c3
alias pbkdf2 = hmac::pbkdf2{Md5, HASH_BYTES, BLOCK_BYTES}
```
```c3
fn char[HASH_BYTES] hash(char[] data)
```
```c3
fn void Md5.init(&self)
```
```c3
fn void Md5.update(&ctx, char[] data)
```
```c3
fn char[HASH_BYTES] Md5.final(&ctx)
```
### `std::hash::metro128`
```c3
struct MetroHash128
```
```c3
fn uint128 hash(char[] data, ulong seed = 0)
```
```c3
fn void MetroHash128.init(&self, ulong seed = 0)
```
```c3
fn void MetroHash128.update(&self, char[] data)
```
```c3
fn uint128 MetroHash128.final(&self)
```
### `std::hash::metro64`
```c3
struct MetroHash64
```
```c3
fn ulong hash(char[] data, ulong seed = 0)
```
```c3
fn void MetroHash64.init(&self, ulong seed = 0)
```
```c3
fn void MetroHash64.update(&self, char[] data)
```
```c3
fn ulong MetroHash64.final(&self)
```
### `std::hash::sha1`
```c3
struct Sha1
```
```c3
alias HmacSha1 = Hmac{Sha1, HASH_BYTES, BLOCK_BYTES}
```
```c3
alias hmac = hmac::hash{Sha1, HASH_BYTES, BLOCK_BYTES}
```
```c3
alias pbkdf2 = hmac::pbkdf2{Sha1, HASH_BYTES, BLOCK_BYTES}
```
```c3
fn char[HASH_BYTES] hash(char[] data)
```
```c3
fn void Sha1.init(&self)
```
```c3
fn void Sha1.update(&self, char[] data)
```
```c3
fn char[HASH_BYTES] Sha1.final(&self)
```
### `std::hash::sha256`
```c3
struct Sha256
```
```c3
alias HmacSha256 = Hmac{Sha256, HASH_SIZE, BLOCK_SIZE}
```
```c3
alias hmac = hmac::hash{Sha256, HASH_SIZE, BLOCK_SIZE}
```
```c3
alias pbkdf2 = hmac::pbkdf2{Sha256, HASH_SIZE, BLOCK_SIZE}
```
```c3
fn char[HASH_SIZE] hash(char[] data)
```
```c3
fn void Sha256.init(&self)
```
```c3
fn void Sha256.update(&self, char[] data)
```
```c3
fn char[HASH_SIZE] Sha256.final(&self)
```
### `std::hash::sha512`
```c3
struct Sha512
```
```c3
alias HmacSha512    = Hmac{Sha512, HASH_SIZE, BLOCK_SIZE}
```
```c3
alias hmac          = hmac::hash{Sha512, HASH_SIZE, BLOCK_SIZE}
```
```c3
alias pbkdf2        = hmac::pbkdf2{Sha512, HASH_SIZE, BLOCK_SIZE}
```
```c3
enum HashTruncationType : uint (uint truncation_width, ulong[8] initial_state)
```
```c3
fn char[HASH_SIZE] hash(char[] data)
```
```c3
fn void Sha512.init(&self)
```
```c3
fn void Sha512.update(&self, char[] data)
```
```c3
fn char[HASH_SIZE] Sha512.final(&self)
```
### `std::hash::siphash { OutType, BLOCK_ROUNDS, FINALIZE_ROUNDS }`
```c3
struct SipHash
```
```c3
fn OutType hash(char[] data, uint128 key)
```
```c3
fn void SipHash.init(&self, uint128 key)
```
```c3
fn void SipHash.update(&self, char[] data)
```
```c3
fn OutType SipHash.final(&self)
```
### `std::hash::siphash24`
```c3
alias SipHash24 = SipHash { ulong, 2, 4 }
```
```c3
alias hash = siphash::hash { ulong, 2, 4 }
```
### `std::hash::siphash24_128`
```c3
alias SipHash24_128 = SipHash { uint128, 2, 4 }
```
```c3
alias hash = siphash::hash { uint128, 2, 4 }
```
### `std::hash::siphash48`
```c3
alias SipHash48 = SipHash { ulong, 4, 8 }
```
```c3
alias hash = siphash::hash { ulong, 4, 8 }
```
### `std::hash::siphash48_128`
```c3
alias SipHash48_128 = SipHash { uint128, 4, 8 }
```
```c3
alias hash = siphash::hash { uint128, 4, 8 }
```
### `std::hash::whirlpool`
```c3
struct Whirlpool
```
```c3
alias HmacWhirlpool = Hmac { Whirlpool, HASH_SIZE, BLOCK_SIZE }
```
```c3
alias hmac = hmac::hash { Whirlpool, HASH_SIZE, BLOCK_SIZE }
```
```c3
alias pbkdf2 = hmac::pbkdf2 { Whirlpool, HASH_SIZE, BLOCK_SIZE }
```
```c3
fn char[HASH_SIZE] hash(char[] data)
```
```c3
macro void Whirlpool.init(&self)
```
```c3
fn void Whirlpool.update(&self, char[] data)
```
```c3
fn char[HASH_SIZE] Whirlpool.final(&self)
```
### `std::hash::wyhash2`
```c3
fn ulong wyr3(char* in, usz len) @inline
```
```c3
fn ulong hash(char[] input, ulong seed = 0)
```
### `std::io`
```c3
struct BitReader
```
```c3
fn void BitReader.init(&self, InStream byte_reader)
```
```c3
fn void BitReader.clear(&self) @inline
```
```c3
fn char? BitReader.read_bits(&self, uint nbits)
```
```c3
struct BitWriter
```
```c3
fn void BitWriter.init(&self, OutStream byte_writer)
```
```c3
fn void? BitWriter.flush(&self)
```
```c3
fn void? BitWriter.write_bits(&self, uint bits, uint nbits)
```
```c3
struct File (InStream, OutStream)
```
```c3
faultdef BUFFER_EXCEEDED, INTERNAL_BUFFER_EXCEEDED, INVALID_FORMAT,
         NOT_ENOUGH_ARGUMENTS, INVALID_ARGUMENT
```
```c3
alias OutputFn = fn void?(void* buffer, char c)
```
```c3
alias FloatType = double
```
```c3
macro bool is_struct_with_default_print($Type)
```
```c3
macro usz? struct_to_format(value, Formatter* f, bool $force_dump)
```
```c3
fn usz? ReflectedParam.to_format(&self, Formatter* f) @dynamic
```
```c3
fn usz? Formatter.printf(&self, String format, args...)
```
```c3
struct Formatter
```
```c3
bitstruct PrintFlags : uint
```
```c3
fn void Formatter.init(&self, OutputFn out_fn, void* data = null)
```
```c3
fn usz? Formatter.print_with_function(&self, Printable arg)
```
```c3
macro usz? @report_fault(Formatter* f, $fault)
```
```c3
macro usz? @wrap_bad(Formatter* f, #action)
```
```c3
fn usz? Formatter.vprintf(&self, String format, any[] anys)
```
```c3
fn usz? Formatter.print(&self, String str)
```
```c3
faultdef BAD_FORMAT
```
```c3
fn usz? print_hex_chars(Formatter* f, char[] out, bool uppercase) @inline
```
```c3
macro Formatter.first_err(&self, fault f)
```
```c3
fn usz? Formatter.pad(&self, char c, isz width, isz len) @inline
```
```c3
fn char* fmt_u(uint128 x, char* s)
```
```c3
fn usz? Formatter.out_chars(&self, char[] s)
```
```c3
enum FloatFormatting
```
```c3
fn usz? Formatter.etoa(&self, double y)
```
```c3
fn usz? Formatter.ftoa(&self, double y)
```
```c3
fn usz? Formatter.gtoa(&self, double y)
```
```c3
fn usz? Formatter.atoa(&self, double y)
```
```c3
enum Seek
```
```c3
faultdef
	ALREADY_EXISTS,
	BUSY,
	CANNOT_READ_DIR,
	DIR_NOT_EMPTY,
	PARENT_DIR_MISSING,
	EOF,
	FILE_CANNOT_DELETE,
	FILE_IS_DIR,
	FILE_IS_PIPE,
	FILE_NOT_DIR,
	FILE_NOT_FOUND,
	FILE_NOT_VALID,
	GENERAL_ERROR,
	ILLEGAL_ARGUMENT,
	INCOMPLETE_WRITE,
	INTERRUPTED,
	INVALID_POSITION,
	INVALID_PUSHBACK,
	NAME_TOO_LONG,
	NOT_SEEKABLE,
	NO_PERMISSION,
	OUT_OF_SPACE,
	OVERFLOW,
	READ_ONLY,
	SYMLINK_FAILED,
	TOO_MANY_DESCRIPTORS,
	UNEXPECTED_EOF,
	UNKNOWN_ERROR,
	UNSUPPORTED_OPERATION,
	WOULD_BLOCK
```
```c3
macro String? readline(Allocator allocator, stream = io::stdin())
```
```c3
macro String? treadline(stream = io::stdin())
```
```c3
macro usz? readline_to_stream(out_stream, in_stream = io::stdin())
```
```c3
macro usz? fprint(out, x)
```
```c3
fn usz? fprintf(OutStream out, String format, args...) @format(1)
```
```c3
fn usz? fprintfn(OutStream out, String format, args...) @format(1) @maydiscard
```
```c3
macro usz? fprintn(out, x = "")
```
```c3
macro void print(x)
```
```c3
macro void printn(x = "")
```
```c3
macro void eprint(x)
```
```c3
macro void eprintn(x)
```
```c3
fn usz? printf(String format, args...) @format(0) @maydiscard
```
```c3
fn usz? printfn(String format, args...) @format(0) @maydiscard
```
```c3
fn usz? eprintf(String format, args...) @maydiscard
```
```c3
fn usz? eprintfn(String format, args...) @maydiscard
```
```c3
fn char[]? bprintf(char[] buffer, String format, args...) @maydiscard
```
```c3
fn usz? available(InStream s)
```
```c3
macro bool @is_instream(#expr)
```
```c3
macro bool @is_outstream(#expr)
```
```c3
macro usz? read_any(stream, any ref)
```
```c3
macro usz? write_any(stream, any ref)
```
```c3
macro usz? read_all(stream, char[] buffer)
```
```c3
macro char[]? read_fully(Allocator allocator, stream)
```
```c3
macro usz? write_all(stream, char[] buffer)
```
```c3
macro usz? read_using_read_byte(s, char[] buffer)
```
```c3
macro void? write_byte_using_write(s, char c)
```
```c3
macro char? read_byte_using_read(s)
```
```c3
alias ReadByteFn = fn char?()
```
```c3
macro usz? write_using_write_byte(s, char[] bytes)
```
```c3
macro void? pushback_using_seek(s)
```
```c3
fn usz? copy_to(InStream in, OutStream dst, char[] buffer = {})
```
```c3
macro usz? read_varint(stream, x_ptr)
```
```c3
macro usz? write_varint(stream, x)
```
```c3
macro ushort? read_be_ushort(stream)
```
```c3
macro short? read_be_short(stream)
```
```c3
macro void? write_be_short(stream, ushort s)
```
```c3
macro uint? read_be_uint(stream)
```
```c3
macro int? read_be_int(stream)
```
```c3
macro void? write_be_int(stream, uint s)
```
```c3
macro ulong? read_be_ulong(stream)
```
```c3
macro long? read_be_long(stream)
```
```c3
macro void? write_be_long(stream, ulong s)
```
```c3
macro uint128? read_be_uint128(stream)
```
```c3
macro int128? read_be_int128(stream)
```
```c3
macro void? write_be_int128(stream, uint128 s)
```
```c3
macro usz? write_tiny_bytearray(stream, char[] data)
```
```c3
macro char[]? read_tiny_bytearray(stream, Allocator allocator)
```
```c3
macro usz? write_short_bytearray(stream, char[] data)
```
```c3
macro char[]? read_short_bytearray(stream, Allocator allocator)
```
```c3
fn ByteReader wrap_bytes(char[] bytes)
```
```c3
struct ReadBuffer (InStream)
```
```c3
fn ReadBuffer* ReadBuffer.init(&self, InStream wrapped_stream, char[] bytes)
```
```c3
fn String ReadBuffer.str_view(&self) @inline
```
```c3
fn void? ReadBuffer.close(&self) @dynamic
```
```c3
fn usz? ReadBuffer.read(&self, char[] bytes) @dynamic
```
```c3
fn char? ReadBuffer.read_byte(&self) @dynamic
```
```c3
struct WriteBuffer (OutStream)
```
```c3
fn WriteBuffer* WriteBuffer.init(&self, OutStream wrapped_stream, char[] bytes)
```
```c3
fn String WriteBuffer.str_view(&self) @inline
```
```c3
fn void? WriteBuffer.close(&self) @dynamic
```
```c3
fn void? WriteBuffer.flush(&self) @dynamic
```
```c3
fn usz? WriteBuffer.write(&self, char[] bytes) @dynamic
```
```c3
fn void? WriteBuffer.write_byte(&self, char c) @dynamic
```
```c3
struct ByteBuffer (InStream, OutStream)
```
```c3
fn ByteBuffer* ByteBuffer.init(&self, Allocator allocator, usz max_read, usz initial_capacity = 16)
```
```c3
fn ByteBuffer* ByteBuffer.tinit(&self, usz max_read, usz initial_capacity = 16)
```
```c3
fn ByteBuffer* ByteBuffer.init_with_buffer(&self, char[] buf)
```
```c3
fn void ByteBuffer.free(&self)
```
```c3
fn usz? ByteBuffer.write(&self, char[] bytes) @dynamic
```
```c3
fn void? ByteBuffer.write_byte(&self, char c) @dynamic
```
```c3
fn usz? ByteBuffer.read(&self, char[] bytes) @dynamic
```
```c3
fn char? ByteBuffer.read_byte(&self) @dynamic
```
```c3
fn void? ByteBuffer.pushback_byte(&self) @dynamic
```
```c3
fn usz? ByteBuffer.seek(&self, isz offset, Seek seek) @dynamic
```
```c3
fn usz? ByteBuffer.available(&self) @inline @dynamic
```
```c3
fn void ByteBuffer.grow(&self, usz n)
```
```c3
macro ByteBuffer.shrink(&self)
```
```c3
struct ByteReader (InStream)
```
```c3
fn usz ByteReader.len(&self) @dynamic
```
```c3
fn ByteReader* ByteReader.init(&self, char[] bytes)
```
```c3
fn usz? ByteReader.read(&self, char[] bytes) @dynamic
```
```c3
fn char? ByteReader.read_byte(&self) @dynamic
```
```c3
fn void? ByteReader.pushback_byte(&self) @dynamic
```
```c3
fn usz? ByteReader.seek(&self, isz offset, Seek seek) @dynamic
```
```c3
fn usz? ByteReader.write_to(&self, OutStream writer) @dynamic
```
```c3
fn usz? ByteReader.available(&self) @inline @dynamic
```
```c3
struct ByteWriter (OutStream)
```
```c3
fn ByteWriter* ByteWriter.init(&self, Allocator allocator)
```
```c3
fn ByteWriter* ByteWriter.tinit(&self)
```
```c3
fn ByteWriter* ByteWriter.init_with_buffer(&self, char[] data)
```
```c3
fn void? ByteWriter.destroy(&self) @dynamic
```
```c3
fn String ByteWriter.str_view(&self) @inline
```
```c3
fn void? ByteWriter.ensure_capacity(&self, usz len) @inline
```
```c3
fn usz? ByteWriter.write(&self, char[] bytes) @dynamic
```
```c3
fn void? ByteWriter.write_byte(&self, char c) @dynamic
```
```c3
fn usz? ByteWriter.read_from(&self, InStream reader) @dynamic
```
```c3
struct LimitReader (InStream)
```
```c3
fn LimitReader* LimitReader.init(&self, InStream wrapped_stream, usz limit)
```
```c3
fn void? LimitReader.close(&self) @dynamic
```
```c3
fn usz? LimitReader.read(&self, char[] bytes) @dynamic
```
```c3
fn char? LimitReader.read_byte(&self) @dynamic
```
```c3
fn usz? LimitReader.available(&self) @inline @dynamic
```
```c3
struct MultiReader (InStream)
```
```c3
fn MultiReader* MultiReader.init(&self, Allocator allocator, InStream... readers)
```
```c3
fn MultiReader* MultiReader.tinit(&self, InStream... readers)
```
```c3
fn void MultiReader.free(&self)
```
```c3
fn usz? MultiReader.read(&self, char[] bytes) @dynamic
```
```c3
fn char? MultiReader.read_byte(&self) @dynamic
```
```c3
struct MultiWriter (OutStream)
```
```c3
fn MultiWriter* MultiWriter.init(&self, Allocator allocator, OutStream... writers)
```
```c3
fn MultiWriter* MultiWriter.tinit(&self, OutStream... writers)
```
```c3
fn void MultiWriter.free(&self)
```
```c3
fn usz? MultiWriter.write(&self, char[] bytes) @dynamic
```
```c3
fn void? MultiWriter.write_byte(&self, char c) @dynamic
```
```c3
struct Scanner (InStream)
```
```c3
fn void Scanner.init(&self, InStream stream, char[] buffer)
```
```c3
fn char[] Scanner.flush(&self) @dynamic
```
```c3
fn void? Scanner.close(&self) @dynamic
```
```c3
fn char[]? Scanner.scan(&self, String pattern = "\n")
```
```c3
fn usz? Scanner.read(&self, char[] bytes) @dynamic
```
```c3
fn char? Scanner.read_byte(&self) @dynamic
```
```c3
struct TeeReader (InStream)
```
```c3
macro TeeReader tee_reader(InStream r, OutStream w)
```
```c3
fn TeeReader* TeeReader.init(&self, InStream r, OutStream w)
```
```c3
fn usz? TeeReader.read(&self, char[] bytes) @dynamic
```
```c3
fn char? TeeReader.read_byte(&self) @dynamic
```
### `std::io @if (env::LIBC)`
```c3
fn void putchar(char c) @inline
```
```c3
fn File* stdout()
```
```c3
fn File* stderr()
```
```c3
fn File* stdin()
```
### `std::io @if(!env::LIBC)`
```c3
fn void putchar(char c) @inline
```
```c3
fn File* stdout()
```
```c3
fn File* stderr()
```
```c3
fn File* stdin()
```
### `std::io::file`
```c3
fn File? open(String filename, String mode)
```
```c3
fn File? open_path(Path path, String mode)
```
```c3
fn bool exists(String file)
```
```c3
fn File from_handle(CFile file)
```
```c3
fn bool is_file(String path)
```
```c3
fn bool is_dir(String path)
```
```c3
fn usz? get_size(String path)
```
```c3
fn void? delete(String filename)
```
```c3
fn void? File.reopen(&self, String filename, String mode)
```
```c3
fn usz? File.seek(&self, isz offset, Seek seek_mode = Seek.SET) @dynamic
```
```c3
fn void? File.write_byte(&self, char c) @dynamic
```
```c3
fn void? File.close(&self) @inline @dynamic
```
```c3
fn bool File.eof(&self) @inline
```
```c3
fn usz? File.read(&self, char[] buffer) @dynamic
```
```c3
fn usz? File.write(&self, char[] buffer) @dynamic
```
```c3
fn Fd File.fd(self) @if(env::LIBC)
```
```c3
fn bool File.isatty(self) @if(env::LIBC)
```
```c3
fn char? File.read_byte(&self) @dynamic
```
```c3
fn char[]? load_buffer(String filename, char[] buffer)
```
```c3
fn char[]? load(Allocator allocator, String filename)
```
```c3
fn char[]? load_path(Allocator allocator, Path path)
```
```c3
fn char[]? load_temp(String filename)
```
```c3
fn char[]? load_path_temp(Path path)
```
```c3
fn void? save(String filename, char[] data)
```
```c3
fn void? File.flush(&self) @dynamic
```
### `std::io::os`
```c3
macro void? native_chdir(Path path)
```
```c3
fn void? native_stat(Stat* stat, String path) @if(env::DARWIN || env::LINUX || env::ANDROID || env::BSD_FAMILY)
```
```c3
fn usz? native_file_size(String path) @if(env::WIN32)
```
```c3
fn usz? native_file_size(String path) @if(!env::WIN32 && !env::DARWIN)
```
```c3
fn usz? native_file_size(String path) @if(env::DARWIN)
```
```c3
fn bool native_file_or_dir_exists(String path)
```
```c3
fn bool native_is_file(String path)
```
```c3
fn bool native_is_dir(String path)
```
```c3
macro String? getcwd(Allocator allocator)
```
```c3
macro bool? native_mkdir(Path path, MkdirPermissions permissions)
```
```c3
macro bool? native_rmdir(Path path)
```
### `std::io::os @if(env::LIBC)`
```c3
fn void*? native_fopen(String filename, String mode) @inline
```
```c3
fn void? native_remove(String filename)
```
```c3
fn void*? native_freopen(void* file, String filename, String mode) @inline
```
```c3
fn void? native_fseek(void* file, isz offset, Seek seek_mode) @inline
```
```c3
fn usz? native_ftell(CFile file) @inline
```
```c3
fn usz? native_fwrite(CFile file, char[] buffer) @inline
```
```c3
fn void? native_fputc(CInt c, CFile stream) @inline
```
```c3
fn usz? native_fread(CFile file, char[] buffer) @inline
```
```c3
fn Path? native_temp_directory(Allocator allocator) @if(!env::WIN32)
```
```c3
fn Path? native_temp_directory(Allocator allocator) @if(env::WIN32)
```
### `std::io::os @if(env::NO_LIBC)`
```c3
alias FopenFn = fn void*?(String, String)
```
```c3
alias FreopenFn = fn void*?(void*, String, String)
```
```c3
alias FcloseFn = fn void?(void*)
```
```c3
alias FseekFn = fn void?(void*, isz, Seek)
```
```c3
alias FtellFn = fn usz?(void*)
```
```c3
alias FwriteFn = fn usz?(void*, char[] buffer)
```
```c3
alias FreadFn = fn usz?(void*, char[] buffer)
```
```c3
alias RemoveFn = fn void?(String)
```
```c3
alias FputcFn = fn void?(int, void*)
```
```c3
fn @weak @if(!$defined(native_fopen_fn))
```
```c3
fn void? native_remove(String filename) @inline
```
```c3
fn void*? native_freopen(void* file, String filename, String mode) @inline
```
```c3
fn void? native_fseek(void* file, isz offset, Seek seek_mode) @inline
```
```c3
fn usz? native_ftell(CFile file) @inline
```
```c3
fn usz? native_fwrite(CFile file, char[] buffer) @inline
```
```c3
fn usz? native_fread(CFile file, char[] buffer) @inline
```
```c3
fn void? native_fputc(CInt c, CFile stream) @inline
```
```c3
macro Path? native_temp_directory(Allocator allocator)
```
### `std::io::os @if(env::POSIX)`
```c3
fn PathList? native_ls(Path dir, bool no_dirs, bool no_symlinks, String mask, Allocator allocator)
```
```c3
fn void? native_rmtree(Path dir)
```
### `std::io::os @if(env::WIN32)`
```c3
fn PathList? native_ls(Path dir, bool no_dirs, bool no_symlinks, String mask, Allocator allocator)
```
```c3
fn void? native_rmtree(Path path)
```
### `std::io::path`
```c3
alias PathList = List { Path }
```
```c3
faultdef INVALID_PATH, NO_PARENT
```
```c3
alias Path = PathImp
```
```c3
struct PathImp (Printable)
```
```c3
enum PathEnv
```
```c3
fn Path? cwd(Allocator allocator)
```
```c3
fn bool is_dir(Path path)
```
```c3
fn bool is_file(Path path)
```
```c3
fn usz? file_size(Path path)
```
```c3
fn bool exists(Path path)
```
```c3
fn Path? tcwd()
```
```c3
macro void? chdir(path)
```
```c3
fn Path? temp_directory(Allocator allocator)
```
```c3
fn void? delete(Path path)
```
```c3
macro bool @is_pathlike(#path)
```
```c3
macro bool is_separator(char c, PathEnv path_env = DEFAULT_ENV)
```
```c3
macro bool is_posix_separator(char c)
```
```c3
macro bool is_win32_separator(char c)
```
```c3
fn PathList? ls(Allocator allocator, Path dir, bool no_dirs = false, bool no_symlinks = false, String mask = "")
```
```c3
enum MkdirPermissions
```
```c3
macro bool? mkdir(path, bool recursive = false, MkdirPermissions permissions = NORMAL)
```
```c3
macro bool? rmdir(path)
```
```c3
fn void? rmtree(Path path)
```
```c3
fn Path? new(Allocator allocator, String path, PathEnv path_env = DEFAULT_ENV)
```
```c3
fn Path? temp(String path, PathEnv path_env = DEFAULT_ENV)
```
```c3
fn Path? from_wstring(Allocator allocator, WString path)
```
```c3
fn Path? from_win32_wstring(Allocator allocator, WString path) @deprecated("Use 'from_wstring' instead")
```
```c3
fn Path? for_windows(Allocator allocator, String path)
```
```c3
fn Path? for_posix(Allocator allocator, String path)
```
```c3
fn bool Path.equals(self, Path p2) @operator(==)
```
```c3
fn Path? Path.append(self, Allocator allocator, String filename)
```
```c3
fn Path? Path.tappend(self, String filename)
```
```c3
fn bool? String.is_absolute_path(self)
```
```c3
fn bool? Path.is_absolute(self)
```
```c3
fn Path? String.to_absolute_path(self, Allocator allocator)
```
```c3
fn Path? Path.absolute(self, Allocator allocator)
```
```c3
fn String? String.file_basename(self, Allocator allocator)
```
```c3
fn String? String.file_tbasename(self)
```
```c3
fn String Path.basename(self)
```
```c3
fn String? String.path_tdirname(self)
```
```c3
fn String? String.path_dirname(self, Allocator allocator)
```
```c3
fn String Path.dirname(self)
```
```c3
fn bool Path.has_extension(self, String extension)
```
```c3
fn String? Path.extension(self)
```
```c3
fn String Path.volume_name(self)
```
```c3
fn Path? String.to_path(self, Allocator allocator)
```
```c3
fn Path? String.to_tpath(self)
```
```c3
fn Path? Path.parent(self)
```
```c3
fn String? normalize(String path_str, PathEnv path_env = DEFAULT_ENV)
```
```c3
fn ZString Path.as_zstr(self) @deprecated
```
```c3
fn String Path.root_directory(self)
```
```c3
alias PathWalker = fn bool? (Path, bool is_dir, void*)
```
```c3
fn bool? Path.walk(self, PathWalker w, void* data)
```
```c3
alias TraverseCallback = fn bool? (Path, bool is_dir, any data)
```
```c3
fn bool? traverse(Path path, TraverseCallback callback, any data)
```
```c3
fn String Path.str_view(self) @inline
```
```c3
fn bool Path.has_suffix(self, String str)
```
```c3
fn void Path.free(self)
```
```c3
fn usz? Path.to_format(&self, Formatter* formatter) @dynamic
```
```c3
macro bool is_reserved_win32_path_char(char c)
```
```c3
macro bool is_reserved_path_char(char c, PathEnv path_env = DEFAULT_ENV)
```
### `std::math`
```c3
alias Complexf = Complex {float}
```
```c3
alias Complex = Complex {double}
```
```c3
alias COMPLEX_IDENTITY  @builtin = complex::IDENTITY {double}
```
```c3
alias COMPLEXF_IDENTITY @builtin = complex::IDENTITY {float}
```
```c3
alias IMAGINARY @builtin @deprecated("Use I") = complex::IMAGINARY { double }
```
```c3
alias IMAGINARYF @builtin @deprecated("Use I_F") = complex::IMAGINARY { float }
```
```c3
alias I @builtin = complex::IMAGINARY { double }
```
```c3
alias I_F @builtin = complex::IMAGINARY { float }
```
```c3
enum RoundingMode : int
```
```c3
faultdef OVERFLOW, MATRIX_INVERSE_DOESNT_EXIST
```
```c3
macro deg_to_rad(x)
```
```c3
macro abs(x)
```
```c3
macro is_approx(x, y, eps)
```
```c3
macro is_approx_rel(x, y, eps)
```
```c3
macro sign(x)
```
```c3
macro atan2(x, y)
```
```c3
macro sincos_ref(x, sinp, cosp)
```
```c3
macro sincos(x)
```
```c3
macro atan(x)
```
```c3
macro atanh(x)
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
macro ceil(x)
```
```c3
macro @ceil($input) @const
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
macro exp(x)
```
```c3
macro exp2(x)
```
```c3
macro floor(x)
```
```c3
macro fma(a, b, c)
```
```c3
macro hypot(x, y)
```
```c3
macro ln(x)
```
```c3
macro log(x, base)
```
```c3
macro log2(x)
```
```c3
macro log10(x)
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
macro pow(x, exp)
```
```c3
macro frexp(x, int* e)
```
```c3
macro int signbit(x)
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
macro sec(x)
```
```c3
macro sech(x)
```
```c3
macro sin(x)
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
macro bool is_finite(x)
```
```c3
macro is_nan(x)
```
```c3
macro is_inf(x)
```
```c3
macro tanh(x)
```
```c3
macro trunc(x)
```
```c3
macro select(bool[<*>] mask, then_value, else_value)
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
macro float float[<*>].sum(float[<*>] x, float start = 0.0)
```
```c3
macro float float[<*>].product(float[<*>] x, float start = 1.0)
```
```c3
macro float float[<*>].max(float[<*>] x)
```
```c3
macro float float[<*>].min(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].ceil(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].clamp(float[<*>] x, float[<*>] lower, float[<*>] upper)
```
```c3
macro float[<*>] float[<*>].copysign(float[<*>] mag, float[<*>] sgn)
```
```c3
macro float[<*>] float[<*>].fma(float[<*>] a, float[<*>] b, float[<*>] c)
```
```c3
macro float[<*>] float[<*>].floor(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].nearbyint(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].pow(float[<*>] x, exp)
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
macro float[<*>] float[<*>].trunc(float[<*>] x)
```
```c3
macro float float[<*>].dot(float[<*>] x, float[<*>] y)
```
```c3
macro float float[<*>].length(float[<*>] x)
```
```c3
macro float float[<*>].distance(float[<*>] x, float[<*>] y)
```
```c3
macro float[<*>] float[<*>].normalize(float[<*>] x)
```
```c3
macro float[<*>] float[<*>].lerp(float[<*>] x, float[<*>] y, float amount)
```
```c3
macro float[<*>] float[<*>].reflect(float[<*>] x, float[<*>] y)
```
```c3
macro bool float[<*>].equals(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_lt(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_le(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_eq(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_gt(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_ge(float[<*>] x, float[<*>] y)
```
```c3
macro bool[<*>] float[<*>].comp_ne(float[<*>] x, float[<*>] y)
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
macro double double[<*>].sum(double[<*>] x, double start = 0.0)
```
```c3
macro double double[<*>].product(double[<*>] x, double start = 1.0)
```
```c3
macro double double[<*>].max(double[<*>] x)
```
```c3
macro double double[<*>].min(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].ceil(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].clamp(double[<*>] x, double[<*>] lower, double[<*>] upper)
```
```c3
macro double[<*>] double[<*>].copysign(double[<*>] mag, double[<*>] sgn)
```
```c3
macro double[<*>] double[<*>].floor(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].fma(double[<*>] a, double[<*>] b, double[<*>] c)
```
```c3
macro double[<*>] double[<*>].nearbyint(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].pow(double[<*>] x, exp)
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
macro double[<*>] double[<*>].trunc(double[<*>] x)
```
```c3
macro double double[<*>].dot(double[<*>] x, double[<*>] y)
```
```c3
macro double double[<*>].length(double[<*>] x)
```
```c3
macro double double[<*>].distance(double[<*>] x, double[<*>] y)
```
```c3
macro double[<*>] double[<*>].normalize(double[<*>] x)
```
```c3
macro double[<*>] double[<*>].reflect(double[<*>] x, double[<*>] y)
```
```c3
macro double[<*>] double[<*>].lerp(double[<*>] x, double[<*>] y, double amount)
```
```c3
macro bool double[<*>].equals(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_lt(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_le(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_eq(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_gt(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_ge(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] double[<*>].comp_ne(double[<*>] x, double[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_lt(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_le(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_eq(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_gt(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_ge(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] ichar[<*>].comp_ne(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro ichar ichar[<*>].sum(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].product(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].and(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].or(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].xor(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].max(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].min(ichar[<*>] x)
```
```c3
macro ichar ichar[<*>].dot(ichar[<*>] x, ichar[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_lt(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_le(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_eq(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_gt(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_ge(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] short[<*>].comp_ne(short[<*>] x, short[<*>] y)
```
```c3
macro short short[<*>].sum(short[<*>] x)
```
```c3
macro short short[<*>].product(short[<*>] x)
```
```c3
macro short short[<*>].and(short[<*>] x)
```
```c3
macro short short[<*>].or(short[<*>] x)
```
```c3
macro short short[<*>].xor(short[<*>] x)
```
```c3
macro short short[<*>].max(short[<*>] x)
```
```c3
macro short short[<*>].min(short[<*>] x)
```
```c3
macro short short[<*>].dot(short[<*>] x, short[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_lt(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_le(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_eq(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_gt(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_ge(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] int[<*>].comp_ne(int[<*>] x, int[<*>] y)
```
```c3
macro int int[<*>].sum(int[<*>] x)
```
```c3
macro int int[<*>].product(int[<*>] x)
```
```c3
macro int int[<*>].and(int[<*>] x)
```
```c3
macro int int[<*>].or(int[<*>] x)
```
```c3
macro int int[<*>].xor(int[<*>] x)
```
```c3
macro int int[<*>].max(int[<*>] x)
```
```c3
macro int int[<*>].min(int[<*>] x)
```
```c3
macro int int[<*>].dot(int[<*>] x, int[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_lt(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_le(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_eq(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_gt(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_ge(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] long[<*>].comp_ne(long[<*>] x, long[<*>] y)
```
```c3
macro long long[<*>].sum(long[<*>] x)
```
```c3
macro long long[<*>].product(long[<*>] x)
```
```c3
macro long long[<*>].and(long[<*>] x)
```
```c3
macro long long[<*>].or(long[<*>] x)
```
```c3
macro long long[<*>].xor(long[<*>] x)
```
```c3
macro long long[<*>].max(long[<*>] x)
```
```c3
macro long long[<*>].min(long[<*>] x)
```
```c3
macro long long[<*>].dot(long[<*>] x, long[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_lt(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_le(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_eq(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_gt(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_ge(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] int128[<*>].comp_ne(int128[<*>] x, int128[<*>] y)
```
```c3
macro int128 int128[<*>].sum(int128[<*>] x)
```
```c3
macro int128 int128[<*>].product(int128[<*>] x)
```
```c3
macro int128 int128[<*>].and(int128[<*>] x)
```
```c3
macro int128 int128[<*>].or(int128[<*>] x)
```
```c3
macro int128 int128[<*>].xor(int128[<*>] x)
```
```c3
macro int128 int128[<*>].max(int128[<*>] x)
```
```c3
macro int128 int128[<*>].min(int128[<*>] x)
```
```c3
macro int128 int128[<*>].dot(int128[<*>] x, int128[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_lt(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_le(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_eq(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_gt(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_ge(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool[<*>] bool[<*>].comp_ne(bool[<*>] x, bool[<*>] y)
```
```c3
macro bool bool[<*>].sum(bool[<*>] x)
```
```c3
macro bool bool[<*>].product(bool[<*>] x)
```
```c3
macro bool bool[<*>].and(bool[<*>] x)
```
```c3
macro bool bool[<*>].or(bool[<*>] x)
```
```c3
macro bool bool[<*>].xor(bool[<*>] x)
```
```c3
macro bool bool[<*>].max(bool[<*>] x)
```
```c3
macro bool bool[<*>].min(bool[<*>] x)
```
```c3
macro bool[<*>] char[<*>].comp_lt(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_le(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_eq(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_gt(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_ge(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] char[<*>].comp_ne(char[<*>] x, char[<*>] y)
```
```c3
macro char char[<*>].sum(char[<*>] x)
```
```c3
macro char char[<*>].product(char[<*>] x)
```
```c3
macro char char[<*>].and(char[<*>] x)
```
```c3
macro char char[<*>].or(char[<*>] x)
```
```c3
macro char char[<*>].xor(char[<*>] x)
```
```c3
macro char char[<*>].max(char[<*>] x)
```
```c3
macro char char[<*>].min(char[<*>] x)
```
```c3
macro char char[<*>].dot(char[<*>] x, char[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_lt(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_le(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_eq(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_gt(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_ge(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] ushort[<*>].comp_ne(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro ushort ushort[<*>].sum(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].product(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].and(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].or(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].xor(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].max(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].min(ushort[<*>] x)
```
```c3
macro ushort ushort[<*>].dot(ushort[<*>] x, ushort[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_lt(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_le(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_eq(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_gt(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_ge(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] uint[<*>].comp_ne(uint[<*>] x, uint[<*>] y)
```
```c3
macro uint uint[<*>].sum(uint[<*>] x)
```
```c3
macro uint uint[<*>].product(uint[<*>] x)
```
```c3
macro uint uint[<*>].and(uint[<*>] x)
```
```c3
macro uint uint[<*>].or(uint[<*>] x)
```
```c3
macro uint uint[<*>].xor(uint[<*>] x)
```
```c3
macro uint uint[<*>].max(uint[<*>] x)
```
```c3
macro uint uint[<*>].min(uint[<*>] x)
```
```c3
macro uint uint[<*>].dot(uint[<*>] x, uint[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_lt(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_le(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_eq(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_gt(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_ge(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] ulong[<*>].comp_ne(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro ulong ulong[<*>].sum(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].product(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].and(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].or(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].xor(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].max(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].min(ulong[<*>] x)
```
```c3
macro ulong ulong[<*>].dot(ulong[<*>] x, ulong[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_lt(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_le(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_eq(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_gt(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_ge(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro bool[<*>] uint128[<*>].comp_ne(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro uint128 uint128[<*>].sum(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].product(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].and(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].or(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].xor(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].max(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].min(uint128[<*>] x)
```
```c3
macro uint128 uint128[<*>].dot(uint128[<*>] x, uint128[<*>] y)
```
```c3
macro char char.sat_add(char x, char y)
```
```c3
macro char char.sat_sub(char x, char y)
```
```c3
macro char char.sat_mul(char x, char y)
```
```c3
macro char char.sat_shl(char x, char y)
```
```c3
macro char? char.overflow_add(char x, char y)
```
```c3
macro char? char.overflow_sub(char x, char y)
```
```c3
macro char? char.overflow_mul(char x, char y)
```
```c3
macro ichar ichar.sat_add(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_sub(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_mul(ichar x, ichar y)
```
```c3
macro ichar ichar.sat_shl(ichar x, ichar y)
```
```c3
macro ichar? ichar.overflow_add(ichar x, ichar y)
```
```c3
macro ichar? ichar.overflow_sub(ichar x, ichar y)
```
```c3
macro ichar? ichar.overflow_mul(ichar x, ichar y)
```
```c3
macro ushort ushort.sat_add(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_sub(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_mul(ushort x, ushort y)
```
```c3
macro ushort ushort.sat_shl(ushort x, ushort y)
```
```c3
macro ushort? ushort.overflow_add(ushort x, ushort y)
```
```c3
macro ushort? ushort.overflow_sub(ushort x, ushort y)
```
```c3
macro ushort? ushort.overflow_mul(ushort x, ushort y)
```
```c3
macro short short.sat_add(short x, short y)
```
```c3
macro short short.sat_sub(short x, short y)
```
```c3
macro short short.sat_mul(short x, short y)
```
```c3
macro short short.sat_shl(short x, short y)
```
```c3
macro short? short.overflow_add(short x, short y)
```
```c3
macro short? short.overflow_sub(short x, short y)
```
```c3
macro short? short.overflow_mul(short x, short y)
```
```c3
macro uint uint.sat_add(uint x, uint y)
```
```c3
macro uint uint.sat_sub(uint x, uint y)
```
```c3
macro uint uint.sat_mul(uint x, uint y)
```
```c3
macro uint uint.sat_shl(uint x, uint y)
```
```c3
macro uint? uint.overflow_add(uint x, uint y)
```
```c3
macro uint? uint.overflow_sub(uint x, uint y)
```
```c3
macro uint? uint.overflow_mul(uint x, uint y)
```
```c3
macro int int.sat_add(int x, int y)
```
```c3
macro int int.sat_sub(int x, int y)
```
```c3
macro int int.sat_mul(int x, int y)
```
```c3
macro int int.sat_shl(int x, int y)
```
```c3
macro int? int.overflow_add(int x, int y)
```
```c3
macro int? int.overflow_sub(int x, int y)
```
```c3
macro int? int.overflow_mul(int x, int y)
```
```c3
macro ulong ulong.sat_add(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_sub(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_mul(ulong x, ulong y)
```
```c3
macro ulong ulong.sat_shl(ulong x, ulong y)
```
```c3
macro ulong? ulong.overflow_add(ulong x, ulong y)
```
```c3
macro ulong? ulong.overflow_sub(ulong x, ulong y)
```
```c3
macro ulong? ulong.overflow_mul(ulong x, ulong y)
```
```c3
macro long long.sat_add(long x, long y)
```
```c3
macro long long.sat_sub(long x, long y)
```
```c3
macro long long.sat_mul(long x, long y)
```
```c3
macro long long.sat_shl(long x, long y)
```
```c3
macro long? long.overflow_add(long x, long y)
```
```c3
macro long? long.overflow_sub(long x, long y)
```
```c3
macro long? long.overflow_mul(long x, long y)
```
```c3
macro uint128 uint128.sat_add(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_sub(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_mul(uint128 x, uint128 y)
```
```c3
macro uint128 uint128.sat_shl(uint128 x, uint128 y)
```
```c3
macro uint128? uint128.overflow_add(uint128 x, uint128 y)
```
```c3
macro uint128? uint128.overflow_sub(uint128 x, uint128 y)
```
```c3
macro uint128? uint128.overflow_mul(uint128 x, uint128 y)
```
```c3
macro int128 int128.sat_add(int128 x, int128 y)
```
```c3
macro int128 int128.sat_sub(int128 x, int128 y)
```
```c3
macro int128 int128.sat_mul(int128 x, int128 y)
```
```c3
macro int128 int128.sat_shl(int128 x, int128 y)
```
```c3
macro int128? int128.overflow_add(int128 x, int128 y)
```
```c3
macro int128? int128.overflow_sub(int128 x, int128 y)
```
```c3
macro int128? int128.overflow_mul(int128 x, int128 y)
```
```c3
macro bool is_odd(x)
```
```c3
macro bool is_even(x)
```
```c3
macro bool char.is_even(char x)
```
```c3
macro bool char.is_odd(char x)
```
```c3
macro bool ichar.is_even(ichar x)
```
```c3
macro bool ichar.is_odd(ichar x)
```
```c3
macro bool ushort.is_even(ushort x)
```
```c3
macro bool ushort.is_odd(ushort x)
```
```c3
macro bool short.is_even(short x)
```
```c3
macro bool short.is_odd(short x)
```
```c3
macro bool uint.is_even(uint x)
```
```c3
macro bool uint.is_odd(uint x)
```
```c3
macro bool int.is_even(int x)
```
```c3
macro bool int.is_odd(int x)
```
```c3
macro bool ulong.is_even(ulong x)
```
```c3
macro bool ulong.is_odd(ulong x)
```
```c3
macro bool long.is_even(long x)
```
```c3
macro bool long.is_odd(long x)
```
```c3
macro bool uint128.is_even(uint128 x)
```
```c3
macro bool uint128.is_odd(uint128 x)
```
```c3
macro bool int128.is_even(int128 x)
```
```c3
macro bool int128.is_odd(int128 x)
```
```c3
macro bool is_power_of_2(x)
```
```c3
macro next_power_of_2(x)
```
```c3
macro uint double.high_word(double d)
```
```c3
macro uint double.low_word(double d)
```
```c3
macro uint float.word(float d)
```
```c3
macro void double.set_high_word(double* d, uint u)
```
```c3
macro void double.set_low_word(double* d, uint u)
```
```c3
macro void float.set_word(float* f, uint u)
```
```c3
macro double scalbn(double x, int n)
```
```c3
extern fn double _atan(double x) @MathLibc("atan")
```
```c3
fn void _sincosf(float a, float* s, float* c) @cname("sincosf") @if(env::WIN32)
```
```c3
extern fn double _tan(double x) @MathLibc("tan")
```
```c3
fn float _frexpf(float x, int* e)
```
```c3
macro bool overflow_add(a, b, out)
```
```c3
macro bool overflow_sub(a, b, out)
```
```c3
macro bool overflow_mul(a, b, out)
```
```c3
macro iota($Type)
```
```c3
macro char char.muldiv(self, char mul, char div)
```
```c3
macro ichar ichar.muldiv(self, ichar mul, ichar div)
```
```c3
macro short short.muldiv(self, short mul, short div)
```
```c3
macro ushort ushort.muldiv(self, ushort mul, ushort div)
```
```c3
macro int int.muldiv(self, int mul, int div)
```
```c3
macro uint uint.muldiv(self, uint mul, uint div)
```
```c3
macro long long.muldiv(self, long mul, long div)
```
```c3
macro ulong ulong.muldiv(self, ulong mul, ulong div)
```
```c3
macro char[<*>] char[<*>].muldiv(self, mul, div)
```
```c3
macro ichar[<*>] ichar[<*>].muldiv(self, mul, div)
```
```c3
macro short[<*>] short[<*>].muldiv(self, mul, div)
```
```c3
macro ushort[<*>] ushort[<*>].muldiv(self, mul, div)
```
```c3
macro int[<*>] int[<*>].muldiv(self, mul, div)
```
```c3
macro uint[<*>] uint[<*>].muldiv(self, mul, div)
```
```c3
macro long[<*>] long[<*>].muldiv(self, mul, div)
```
```c3
macro ulong[<*>] ulong[<*>].muldiv(self, mul, div)
```
```c3
macro lcm(...)
```
```c3
macro gcd(...)
```
```c3
alias Matrix2f = Matrix2x2 {float}
```
```c3
alias Matrix2  = Matrix2x2 {double}
```
```c3
alias Matrix3f = Matrix3x3 {float}
```
```c3
alias Matrix3  = Matrix3x3 {double}
```
```c3
alias Matrix4f = Matrix4x4 {float}
```
```c3
alias Matrix4  = Matrix4x4 {double}
```
```c3
alias matrix4_ortho  @builtin = matrix::ortho {double}
```
```c3
alias matrix4f_ortho @builtin = matrix::ortho {float}
```
```c3
alias matrix4_perspective  @builtin = matrix::perspective {double}
```
```c3
alias matrix4f_perspective @builtin = matrix::perspective {float}
```
```c3
alias MATRIX2_IDENTITY  @builtin = matrix::IDENTITY2 {double}
```
```c3
alias MATRIX2F_IDENTITY @builtin = matrix::IDENTITY2 {float}
```
```c3
alias MATRIX3_IDENTITY  @builtin = matrix::IDENTITY3 {double}
```
```c3
alias MATRIX3F_IDENTITY @builtin = matrix::IDENTITY3 {float}
```
```c3
alias MATRIX4_IDENTITY  @builtin = matrix::IDENTITY4 {double}
```
```c3
alias MATRIX4F_IDENTITY @builtin = matrix::IDENTITY4 {float}
```
```c3
alias Quaternionf = Quaternion {float}
```
```c3
alias Quaternion = Quaternion {double}
```
```c3
alias QUATERNION_IDENTITY  @builtin = quaternion::IDENTITY {double}
```
```c3
alias QUATERNIONF_IDENTITY @builtin = quaternion::IDENTITY {float}
```
### `std::math::bigint`
```c3
struct BigInt (Printable)
```
```c3
fn BigInt from_int(int128 val)
```
```c3
fn BigInt* BigInt.init(&self, int128 value)
```
```c3
fn BigInt* BigInt.init_with_u128(&self, uint128 value)
```
```c3
fn BigInt* BigInt.init_with_array(&self, uint[] values)
```
```c3
fn BigInt*? BigInt.init_string_radix(&self, String value, int radix)
```
```c3
fn bool BigInt.is_negative(&self)
```
```c3
fn BigInt BigInt.add(self, BigInt other) @operator(+)
```
```c3
fn void BigInt.add_this(&self, BigInt other) @operator(+=)
```
```c3
macro uint find_length(uint* data, uint length)
```
```c3
fn BigInt BigInt.mult(self, BigInt bi2) @operator(*)
```
```c3
fn void BigInt.mult_this(&self, BigInt bi2) @operator(*=)
```
```c3
fn void BigInt.negate(&self)
```
```c3
macro bool BigInt.is_zero(&self)
```
```c3
fn BigInt BigInt.sub(self, BigInt other) @operator(-)
```
```c3
fn BigInt* BigInt.sub_this(&self, BigInt other) @operator(-=)
```
```c3
fn int BigInt.bitcount(&self)
```
```c3
fn BigInt BigInt.unary_minus(&self) @operator(-)
```
```c3
macro BigInt BigInt.div(self, BigInt other) @operator(/)
```
```c3
fn void BigInt.div_this(&self, BigInt other) @operator(/=)
```
```c3
fn BigInt BigInt.mod(self, BigInt bi2) @operator(%)
```
```c3
fn void BigInt.mod_this(&self, BigInt bi2) @operator(%=)
```
```c3
fn void BigInt.bit_negate_this(&self)
```
```c3
fn BigInt BigInt.bit_negate(self) @operator(~)
```
```c3
fn BigInt BigInt.shr(self, int shift) @operator(>>)
```
```c3
fn void BigInt.shr_this(self, int shift) @operator(>>=)
```
```c3
fn BigInt BigInt.shl(self, int shift) @operator(<<)
```
```c3
macro bool BigInt.equals(&self, BigInt other) @operator(==)
```
```c3
macro bool BigInt.greater_than(&self, BigInt other)
```
```c3
macro bool BigInt.less_than(&self, BigInt other)
```
```c3
fn bool BigInt.is_odd(&self)
```
```c3
fn bool BigInt.is_one(&self)
```
```c3
macro bool BigInt.greater_or_equal(&self, BigInt other)
```
```c3
macro bool BigInt.less_or_equal(&self, BigInt)
```
```c3
fn BigInt BigInt.abs(&self)
```
```c3
fn usz? BigInt.to_format(&self, Formatter* format) @dynamic
```
```c3
fn String BigInt.to_string(&self, Allocator allocator) @dynamic
```
```c3
fn String BigInt.to_string_with_radix(&self, int radix, Allocator allocator)
```
```c3
fn BigInt BigInt.mod_pow(&self, BigInt exp, BigInt mod)
```
```c3
fn BigInt barrett_reduction(BigInt x, BigInt n, BigInt constant)
```
```c3
fn BigInt BigInt.sqrt(&self)
```
```c3
fn BigInt BigInt.bit_and(self, BigInt bi2) @operator(&)
```
```c3
fn void BigInt.bit_and_this(&self, BigInt bi2)
```
```c3
fn BigInt BigInt.bit_or(self, BigInt bi2) @operator(|)
```
```c3
fn void BigInt.bit_or_this(&self, BigInt bi2)
```
```c3
fn BigInt BigInt.bit_xor(self, BigInt bi2) @operator(^)
```
```c3
fn void BigInt.bit_xor_this(&self, BigInt bi2)
```
```c3
fn void BigInt.shl_this(&self, int shift) @operator(<<=)
```
```c3
fn BigInt BigInt.gcd(&self, BigInt other)
```
```c3
fn BigInt BigInt.lcm(&self, BigInt other)
```
```c3
fn void BigInt.randomize_bits(&self, Random random, int bits)
```
### `std::math::complex {Real}`
```c3
macro Complex Complex.add(self, Complex b) @operator(+)
```
```c3
macro Complex Complex.add_this(&self, Complex b) @operator(+=)
```
```c3
macro Complex Complex.add_real(self, Real r) @operator_s(+)
```
```c3
macro Complex Complex.add_each(self, Real b)
```
```c3
macro Complex Complex.sub(self, Complex b) @operator(-)
```
```c3
macro Complex Complex.sub_this(&self, Complex b) @operator(-=)
```
```c3
macro Complex Complex.sub_real(self, Real r) @operator(-)
```
```c3
macro Complex Complex.sub_real_inverse(self, Real r) @operator_r(-)
```
```c3
macro Complex Complex.sub_each(self, Real b)
```
```c3
macro Complex Complex.scale(self, Real r) @operator_s(*)
```
```c3
macro Complex Complex.mul(self, Complex b)@operator(*)
```
```c3
macro Complex Complex.div_real(self, Real r) @operator(/)
```
```c3
macro Complex Complex.div_real_inverse(Complex c, Real r) @operator_r(/)
```
```c3
macro Complex Complex.div(self, Complex b) @operator(/)
```
```c3
macro Complex Complex.inverse(self)
```
```c3
macro Complex Complex.conjugate(self)
```
```c3
macro Complex Complex.negate(self) @operator(-)
```
```c3
macro bool Complex.equals(self, Complex b) @operator(==)
```
```c3
macro bool Complex.equals_real(self, Real r) @operator_s(==)
```
```c3
macro bool Complex.not_equals(self, Complex b) @operator(!=)
```
```c3
fn usz? Complex.to_format(&self, Formatter* f) @dynamic
```
### `std::math::easing`
```c3
fn float linear_none(float t, float b, float c, float d) @inline
```
```c3
fn float linear_in(float t, float b, float c, float d) @inline
```
```c3
fn float linear_out(float t, float b, float c, float d) @inline
```
```c3
fn float linear_inout(float t, float b, float c, float d) @inline
```
```c3
fn float sine_in(float t, float b, float c, float d) @inline
```
```c3
fn float sine_out(float t, float b, float c, float d) @inline
```
```c3
fn float sine_inout(float t, float b, float c, float d) @inline
```
```c3
fn float circ_in(float t, float b, float c, float d) @inline
```
```c3
fn float circ_out(float t, float b, float c, float d) @inline
```
```c3
fn float circ_inout(float t, float b, float c, float d) @inline
```
```c3
fn float cubic_in(float t, float b, float c, float d) @inline
```
```c3
fn float cubic_out(float t, float b, float c, float d) @inline
```
```c3
fn float cubic_inout(float t, float b, float c, float d) @inline
```
```c3
fn float quad_in(float t, float b, float c, float d) @inline
```
```c3
fn float quad_out(float t, float b, float c, float d) @inline
```
```c3
fn float quad_inout(float t, float b, float c, float d) @inline
```
```c3
fn float expo_in(float t, float b, float c, float d) @inline
```
```c3
fn float expo_out(float t, float b, float c, float d) @inline
```
```c3
fn float expo_inout(float t, float b, float c, float d) @inline
```
```c3
fn float back_in(float t, float b, float c, float d, float s = 1.70158f) @inline
```
```c3
fn float back_out(float t, float b, float c, float d, float s = 1.70158f) @inline
```
```c3
fn float back_inout(float t, float b, float c, float d, float s = 1.70158f) @inline
```
```c3
fn float bounce_out(float t, float b, float c, float d) @inline
```
```c3
fn float bounce_in(float t, float b, float c, float d) @inline
```
```c3
fn float bounce_inout(float t, float b, float c, float d) @inline
```
```c3
fn float elastic_in(float t, float b, float c, float d) @inline
```
```c3
fn float elastic_out(float t, float b, float c, float d) @inline
```
```c3
fn float elastic_inout(float t, float b, float c, float d) @inline
```
### `std::math::math_rt`
```c3
fn int128 __divti3(int128 a, int128 b) @cname("__divti3") @weak @nostrip
```
```c3
macro uint128 @__udivmodti4(uint128 a, uint128 b, bool $return_rem)
```
```c3
fn uint128 __umodti3(uint128 n, uint128 d) @cname("__umodti3") @weak @nostrip
```
```c3
fn uint128 __udivti3(uint128 n, uint128 d) @cname("__udivti3") @weak @nostrip
```
```c3
fn int128 __modti3(int128 a, int128 b) @cname("__modti3") @weak @nostrip
```
```c3
fn uint128 __lshrti3(uint128 a, uint b) @cname("__lshrti3") @weak @nostrip
```
```c3
fn int128 __ashrti3(int128 a, uint b) @cname("__ashrti3") @weak @nostrip
```
```c3
fn int128 __ashlti3(int128 a, uint b) @cname("__ashlti3") @weak @nostrip
```
```c3
fn int128 __multi3(int128 a, int128 b) @cname("__multi3") @weak @nostrip
```
```c3
fn float __floattisf(int128 a) @cname("__floattisf") @weak @nostrip
```
```c3
fn double __floattidf(int128 a) @cname("__floattidf") @weak @nostrip
```
```c3
fn float __floatuntisf(uint128 a) @cname("__floatuntisf") @weak @nostrip
```
```c3
fn double __floatuntidf(uint128 a) @cname("__floatuntidf") @weak @nostrip
```
```c3
fn uint128 __fixunsdfti(double a) @weak @cname("__fixunsdfti") @nostrip
```
```c3
fn uint128 __fixunssfti(float a) @weak @cname("__fixunssfti") @nostrip
```
```c3
fn int128 __fixdfti(double a) @weak @cname("__fixdfti") @nostrip
```
```c3
fn int128 __fixsfti(float a) @weak @cname("__fixsfti") @nostrip
```
```c3
fn float __roundevenf(float f) @cname("roundevenf") @weak @nostrip
```
```c3
fn double __roundeven(double d) @cname("roundeven") @weak @nostrip
```
```c3
fn double __powidf2(double a, int b) @cname("__powidf2") @weak @nostrip
```
### `std::math::matrix {Real}`
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
fn Real[<2>] Matrix2x2.apply(&self, Real[<2>] vec) @operator(*)
```
```c3
fn Real[<3>] Matrix3x3.apply(&self, Real[<3>] vec) @operator(*)
```
```c3
fn Real[<4>] Matrix4x4.apply(&self, Real[<4>] vec) @operator(*)
```
```c3
fn Matrix2x2 Matrix2x2.mul(&self, Matrix2x2 b) @operator(*)
```
```c3
fn Matrix3x3 Matrix3x3.mul(&self, Matrix3x3 b) @operator(*)
```
```c3
fn Matrix4x4 Matrix4x4.mul(Matrix4x4* self, Matrix4x4 b) @operator(*)
```
```c3
fn Matrix2x2 Matrix2x2.component_mul(&self, Real s)
```
```c3
fn Matrix3x3 Matrix3x3.component_mul(&self, Real s)
```
```c3
fn Matrix4x4 Matrix4x4.component_mul(&self, Real s)
```
```c3
fn Matrix2x2 Matrix2x2.add(&self, Matrix2x2 mat2) @operator(+)
```
```c3
fn Matrix3x3 Matrix3x3.add(&self, Matrix3x3 mat2) @operator(+)
```
```c3
fn Matrix4x4 Matrix4x4.add(&self, Matrix4x4 mat2) @operator(+)
```
```c3
fn Matrix2x2 Matrix2x2.sub(&self, Matrix2x2 mat2) @operator(-)
```
```c3
fn Matrix3x3 Matrix3x3.sub(&self, Matrix3x3 mat2) @operator(-)
```
```c3
fn Matrix4x4 Matrix4x4.sub(&self, Matrix4x4 mat2) @operator(-)
```
```c3
fn Matrix2x2 Matrix2x2.negate(&self) @operator(-)
```
```c3
fn Matrix3x3 Matrix3x3.negate(&self) @operator(-)
```
```c3
fn Matrix4x4 Matrix4x4.negate(&self) @operator(-)
```
```c3
fn bool Matrix2x2.eq(&self, Matrix2x2 mat2) @operator(==)
```
```c3
fn bool Matrix3x3.eq(&self, Matrix3x3 mat2) @operator(==)
```
```c3
fn bool Matrix4x4.eq(&self, Matrix4x4 mat2) @operator(==)
```
```c3
fn bool Matrix2x2.neq(&self, Matrix2x2 mat2) @operator(!=)
```
```c3
fn bool Matrix3x3.neq(&self, Matrix3x3 mat2) @operator(!=)
```
```c3
fn bool Matrix4x4.neq(&self, Matrix4x4 mat2) @operator(!=)
```
```c3
fn Matrix4x4 look_at(Real[<3>] eye, Real[<3>] target, Real[<3>] up)
```
```c3
fn Matrix2x2 Matrix2x2.transpose(&self)
```
```c3
fn Matrix3x3 Matrix3x3.transpose(&self)
```
```c3
fn Matrix4x4 Matrix4x4.transpose(&self)
```
```c3
fn Real Matrix2x2.determinant(&self)
```
```c3
fn Real Matrix3x3.determinant(&self)
```
```c3
fn Real Matrix4x4.determinant(&self)
```
```c3
fn Matrix2x2 Matrix2x2.adjoint(&self)
```
```c3
fn Matrix3x3 Matrix3x3.adjoint(&self)
```
```c3
fn Matrix4x4 Matrix4x4.adjoint(&self)
```
```c3
fn Matrix2x2? Matrix2x2.inverse(&self)
```
```c3
fn Matrix3x3? Matrix3x3.inverse(&self)
```
```c3
fn Matrix4x4? Matrix4x4.inverse(&self)
```
```c3
fn Matrix3x3 Matrix3x3.translate(&self, Real[<2>] v)
```
```c3
fn Matrix4x4 Matrix4x4.translate(&self, Real[<3>] v)
```
```c3
fn Matrix3x3 Matrix3x3.rotate(&self, Real r)
```
```c3
fn Matrix4x4 Matrix4x4.rotate_z(&self, Real r)
```
```c3
fn Matrix4x4 Matrix4x4.rotate_y(&self, Real r)
```
```c3
fn Matrix4x4 Matrix4x4.rotate_x(&self, Real r)
```
```c3
fn Matrix3x3 Matrix3x3.scale(&self, Real[<2>] v)
```
```c3
fn Real Matrix2x2.trace(&self)
```
```c3
fn Real Matrix3x3.trace(&self)
```
```c3
fn Real Matrix4x4.trace(&self)
```
```c3
fn Matrix4x4 Matrix4x4.scale(&self, Real[<3>] v)
```
```c3
fn Matrix4x4 ortho(Real left, Real right, Real top, Real bottom, Real near, Real far)
```
```c3
fn Matrix4x4 perspective(Real fov, Real aspect_ratio, Real near, Real far)
```
### `std::math::nolibc @if(env::NO_LIBC || $feature(C3_MATH))`
```c3
fn double __cos(double x, double y) @cname("__cos") @weak @nostrip
```
```c3
fn float __cosdf(double x) @cname("__cosdf") @weak @nostrip
```
```c3
fn double fmod(double x, double y) @cname("fmod") @weak @nostrip
```
```c3
fn float fmodf(float x, float y) @cname("fmodf") @weak @nostrip
```
```c3
fn double __sin(double x, double y, int iy) @cname("__sin") @weak @nostrip
```
```c3
fn float __sindf(double x) @cname("__sindf") @weak @nostrip
```
```c3
fn double __tan(double x, double y, int odd) @cname("__tan") @weak @nostrip
```
```c3
fn float __tandf(double x, int odd) @cname("__tandf") @weak @nostrip
```
```c3
fn double _acos(double x) @weak @cname("acos") @nostrip
```
```c3
fn float _acosf(float x) @weak @cname("acosf") @nostrip
```
```c3
fn double _asin(double x) @weak @cname("asin") @nostrip
```
```c3
fn float _asinf(float x) @weak @cname("asinf") @nostrip
```
```c3
fn double _atan(double x) @weak @cname("atan") @nostrip
```
```c3
fn float _atanf(float x) @weak @cname("atanf") @nostrip
```
```c3
fn double _atan2(double y, double x) @weak @cname("atan2") @nostrip
```
```c3
fn float _atan2f(float y, float x) @weak @cname("atan2f") @nostrip
```
```c3
fn double _atanh(double x) @weak @cname("atanh") @nostrip
```
```c3
fn float _atanhf(float x) @weak @cname("atanhf") @nostrip
```
```c3
fn double _ceil(double x) @weak @cname("ceil") @nostrip
```
```c3
fn float _ceilf(float x) @weak @cname("ceilf") @nostrip
```
```c3
fn float _cosf(float x) @cname("cosf") @weak @nostrip
```
```c3
fn double _cos(double x) @cname("cos")  @weak @nostrip
```
```c3
fn double exp(double x) @cname("exp")
```
```c3
fn float expf(float x) @cname("expf")
```
```c3
fn float _exp2f(float x) @cname("exp2f") @weak @nostrip
```
```c3
fn double _exp2(double x) @cname("exp2") @weak @nostrip
```
```c3
fn double _fabs(double x) @weak @cname("fabs") @nostrip
```
```c3
fn float _fabsf(float x) @weak @cname("fabsf") @nostrip
```
```c3
fn double _floor(double x) @weak @cname("floor") @nostrip
```
```c3
fn float _floorf(float x) @weak @cname("floorf") @nostrip
```
```c3
fn double frexp(double x, int* exp) @cname("frexp")
```
```c3
fn float frexpf(float x, int* exp) @cname("frexpf")
```
```c3
fn double ldexp(double x, int exp) @cname("ldexp")
```
```c3
fn float ldexpf(float x, int exp) @cname("ldexpf")
```
```c3
fn double log(double x) @cname("log")
```
```c3
fn float logf(float x) @cname("logf")
```
```c3
fn double _log1p(double x) @weak @cname("log1p") @nostrip
```
```c3
fn float _log1pf(float x) @weak @cname("log1pf") @nostrip
```
```c3
macro float __math_uflowf(uint sign)
```
```c3
macro double __math_uflow(ulong sign)
```
```c3
macro float __math_oflowf(uint sign)
```
```c3
macro double __math_oflow(ulong sign)
```
```c3
macro __math_xflow(sign, v)
```
```c3
macro force_eval_add(x, v)
```
```c3
fn double pow(double x, double y) @cname("pow")
```
```c3
fn float powf(float x, float y) @cname("powf")
```
```c3
fn int __rem_pio2f(float x, double *y)
```
```c3
fn int __rem_pio2_large(double* x, double* y, int e0, int nx, int prec)
```
```c3
fn int __rem_pio2(double x, double *y)
```
```c3
fn double _round(double x) @cname("round") @weak @nostrip
```
```c3
fn float _roundf(float x) @cname("roundf") @weak @nostrip
```
```c3
fn double _scalbn(double x, int n) @weak @cname("scalbn") @nostrip
```
```c3
fn float _sinf(float x) @weak @cname("sinf") @nostrip
```
```c3
fn double sin(double x) @cname("sin") @weak @nostrip
```
```c3
fn void sincosf(float x, float *sin, float *cos) @cname("__sincosf") @weak @nostrip
```
```c3
fn void sincos(double x, double *sin, double *cos) @cname("__sincos") @weak @nostrip
```
```c3
fn double tan(double x) @cname("tan") @weak @nostrip
```
```c3
fn float tanf(float x) @cname("tanf") @weak @nostrip
```
```c3
fn double sincos_broken(double x) @cname("sincos") @weak @nostrip
```
```c3
fn double _trunc(double x) @weak @cname("trunc") @nostrip
```
```c3
fn float _truncf(float x) @weak @cname("truncf") @nostrip
```
### `std::math::quaternion {Real}`
```c3
macro Quaternion Quaternion.add(self, Quaternion b) @operator(+)
```
```c3
macro Quaternion Quaternion.add_each(self, Real b)
```
```c3
macro Quaternion Quaternion.sub(self, Quaternion b) @operator(-)
```
```c3
macro Quaternion Quaternion.negate(self) @operator(-)
```
```c3
macro Quaternion Quaternion.sub_each(self, Real b)
```
```c3
macro Quaternion Quaternion.scale(self, Real s) @operator_s(*)
```
```c3
macro Quaternion Quaternion.normalize(self)
```
```c3
macro Real Quaternion.length(self)
```
```c3
macro Quaternion Quaternion.lerp(self, Quaternion q2, Real amount)
```
```c3
macro Matrix4f Quaternion.to_matrixf(&self)
```
```c3
macro Matrix4 Quaternion.to_matrix(&self)
```
```c3
fn Quaternion Quaternion.nlerp(self, Quaternion q2, Real amount)
```
```c3
fn Quaternion Quaternion.invert(self)
```
```c3
fn Quaternion Quaternion.slerp(self, Quaternion q2, Real amount)
```
```c3
fn Quaternion Quaternion.mul(self, Quaternion b) @operator(*)
```
### `std::math::random`
```c3
macro void seed(random, seed)
```
```c3
macro void seed_entropy(random)
```
```c3
macro int next(random, uint range)
```
```c3
macro int next_in_range(random, int min, int max)
```
```c3
alias DefaultRandom = Sfc64Random
```
```c3
fn void srand(ulong seed) @builtin
```
```c3
fn int rand(int range) @builtin
```
```c3
fn int rand_in_range(int min, int max) @builtin
```
```c3
fn double rnd() @builtin
```
```c3
macro bool next_bool(random)
```
```c3
macro float next_float(random)
```
```c3
macro double next_double(random)
```
```c3
macro bool is_random(random)
```
```c3
macro uint128 @long_to_int128(#function)
```
```c3
macro ulong @int_to_long(#function)
```
```c3
macro uint @short_to_int(#function)
```
```c3
macro ushort @char_to_short(#function)
```
```c3
macro @random_value_to_bytes(#function, char[] bytes)
```
```c3
typedef Lcg128Random (Random) = uint128
```
```c3
fn void Lcg128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ulong Lcg128Random.next_long(&self) @dynamic
```
```c3
fn void Lcg128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Lcg128Random.next_int128(&self) @dynamic
```
```c3
fn uint Lcg128Random.next_int(&self) @dynamic
```
```c3
fn ushort Lcg128Random.next_short(&self) @dynamic
```
```c3
fn char Lcg128Random.next_byte(&self) @dynamic
```
```c3
typedef Lcg64Random (Random) = ulong
```
```c3
fn void Lcg64Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn uint Lcg64Random.next_int(&self) @dynamic
```
```c3
fn void Lcg64Random.next_bytes(&self, char[] bytes) @dynamic
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
fn char Lcg64Random.next_byte(&self) @dynamic
```
```c3
typedef Lcg32Random (Random) = uint
```
```c3
fn void Lcg32Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn ushort Lcg32Random.next_short(&self) @dynamic
```
```c3
fn void Lcg32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Lcg32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Lcg32Random.next_long(&self) @dynamic
```
```c3
fn uint Lcg32Random.next_int(&self) @dynamic
```
```c3
fn char Lcg32Random.next_byte(&self) @dynamic
```
```c3
typedef Lcg16Random (Random) = ushort
```
```c3
fn void Lcg16Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Lcg16Random.next_byte(&self) @dynamic
```
```c3
fn void Lcg16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Lcg16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Lcg16Random.next_long(&self) @dynamic
```
```c3
fn uint Lcg16Random.next_int(&self) @dynamic
```
```c3
fn ushort Lcg16Random.next_short(&self) @dynamic
```
```c3
typedef Mcg128Random (Random) = uint128
```
```c3
fn void Mcg128Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn void Mcg128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn ulong Mcg128Random.next_long(&self) @dynamic
```
```c3
fn uint128 Mcg128Random.next_int128(&self) @dynamic
```
```c3
fn uint Mcg128Random.next_int(&self) @dynamic
```
```c3
fn ushort Mcg128Random.next_short(&self) @dynamic
```
```c3
fn char Mcg128Random.next_byte(&self) @dynamic
```
```c3
typedef Mcg64Random (Random) = ulong
```
```c3
fn void Mcg64Random.set_seed(&self, char[] seed) @dynamic
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
fn char Mcg64Random.next_byte(&self) @dynamic
```
```c3
typedef Mcg32Random (Random) = uint
```
```c3
fn void Mcg32Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn ushort Mcg32Random.next_short(&self) @dynamic
```
```c3
fn void Mcg32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Mcg32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Mcg32Random.next_long(&self) @dynamic
```
```c3
fn uint Mcg32Random.next_int(&self) @dynamic
```
```c3
fn char Mcg32Random.next_byte(&self) @dynamic
```
```c3
typedef Mcg16Random (Random) = ushort
```
```c3
fn void Mcg16Random.set_seed(&self, char[] seed) @dynamic
```
```c3
fn char Mcg16Random.next_byte(&self) @dynamic
```
```c3
fn void Mcg16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Mcg16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Mcg16Random.next_long(&self) @dynamic
```
```c3
fn uint Mcg16Random.next_int(&self) @dynamic
```
```c3
fn ushort Mcg16Random.next_short(&self) @dynamic
```
```c3
struct Msws128Random (Random)
```
```c3
fn void Msws128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn uint128 Msws128Random.next_int128(&self) @dynamic
```
```c3
fn void Msws128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn ulong Msws128Random.next_long(&self) @dynamic
```
```c3
fn uint Msws128Random.next_int(&self) @dynamic
```
```c3
fn ushort Msws128Random.next_short(&self) @dynamic
```
```c3
fn char Msws128Random.next_byte(&self) @dynamic
```
```c3
struct Msws64Random (Random)
```
```c3
fn void  Msws64Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ulong Msws64Random.next_long(&self) @dynamic
```
```c3
fn void Msws64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Msws64Random.next_int128(&self) @dynamic
```
```c3
fn uint Msws64Random.next_int(&self) @dynamic
```
```c3
fn ushort Msws64Random.next_short(&self) @dynamic
```
```c3
fn char Msws64Random.next_byte(&self) @dynamic
```
```c3
struct Msws32Random (Random)
```
```c3
fn void  Msws32Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn uint Msws32Random.next_int(&self) @dynamic
```
```c3
fn void Msws32Random.next_bytes(&self, char[] bytes) @dynamic
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
fn char Msws32Random.next_byte(&self) @dynamic
```
```c3
struct Msws16Random (Random)
```
```c3
fn void  Msws16Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ushort Msws16Random.next_short(&self) @dynamic
```
```c3
fn void Msws16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Msws16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws16Random.next_long(&self) @dynamic
```
```c3
fn uint Msws16Random.next_int(&self) @dynamic
```
```c3
fn char Msws16Random.next_byte(&self) @dynamic
```
```c3
struct Msws8Random (Random)
```
```c3
fn void  Msws8Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Msws8Random.next_byte(&self) @dynamic
```
```c3
fn void Msws8Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Msws8Random.next_int128(&self) @dynamic
```
```c3
fn ulong Msws8Random.next_long(&self) @dynamic
```
```c3
fn uint Msws8Random.next_int(&self) @dynamic
```
```c3
fn ushort Msws8Random.next_short(&self) @dynamic
```
```c3
typedef Pcg128Random (Random) = uint128
```
```c3
fn void  Pcg128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ulong Pcg128Random.next_long(&self) @dynamic
```
```c3
fn void Pcg128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Pcg128Random.next_int128(&self) @dynamic
```
```c3
fn uint Pcg128Random.next_int(&self) @dynamic
```
```c3
fn ushort Pcg128Random.next_short(&self) @dynamic
```
```c3
fn char Pcg128Random.next_byte(&self) @dynamic
```
```c3
typedef Pcg64Random (Random) = ulong
```
```c3
fn void Pcg64Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn uint Pcg64Random.next_int(&self) @dynamic
```
```c3
fn void Pcg64Random.next_bytes(&self, char[] bytes) @dynamic
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
fn char Pcg64Random.next_byte(&self) @dynamic
```
```c3
typedef Pcg32Random (Random) = uint
```
```c3
fn void Pcg32Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ushort Pcg32Random.next_short(&self) @dynamic
```
```c3
fn void Pcg32Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Pcg32Random.next_int128(&self) @dynamic
```
```c3
fn ulong Pcg32Random.next_long(&self) @dynamic
```
```c3
fn uint Pcg32Random.next_int(&self) @dynamic
```
```c3
fn char Pcg32Random.next_byte(&self) @dynamic
```
```c3
typedef Pcg16Random (Random) = ushort
```
```c3
fn void Pcg16Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Pcg16Random.next_byte(&self) @dynamic
```
```c3
fn void Pcg16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Pcg16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Pcg16Random.next_long(&self) @dynamic
```
```c3
fn uint Pcg16Random.next_int(&self) @dynamic
```
```c3
fn ushort Pcg16Random.next_short(&self) @dynamic
```
```c3
fn void seeder(char[] input, char[] out_buffer)
```
```c3
fn char[8 * 4] entropy() @if(!env::WASM_NOLIBC)
```
```c3
fn char[8 * 4] entropy() @if(env::WASM_NOLIBC)
```
```c3
typedef Sfc128Random (Random) = uint128[4]
```
```c3
fn void Sfc128Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn uint128 Sfc128Random.next_int128(&self) @dynamic
```
```c3
fn void Sfc128Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn ulong Sfc128Random.next_long(&self) @dynamic
```
```c3
fn uint Sfc128Random.next_int(&self) @dynamic
```
```c3
fn ushort Sfc128Random.next_short(&self) @dynamic
```
```c3
fn char Sfc128Random.next_byte(&self) @dynamic
```
```c3
typedef Sfc64Random (Random) = ulong[4]
```
```c3
fn void  Sfc64Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ulong Sfc64Random.next_long(&self) @dynamic
```
```c3
fn void Sfc64Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Sfc64Random.next_int128(&self) @dynamic
```
```c3
fn uint Sfc64Random.next_int(&self) @dynamic
```
```c3
fn ushort Sfc64Random.next_short(&self) @dynamic
```
```c3
fn char Sfc64Random.next_byte(&self) @dynamic
```
```c3
typedef Sfc32Random (Random) = uint[4]
```
```c3
fn void  Sfc32Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn uint Sfc32Random.next_int(&sfc) @dynamic
```
```c3
fn void Sfc32Random.next_bytes(&self, char[] bytes) @dynamic
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
fn char Sfc32Random.next_byte(&self) @dynamic
```
```c3
typedef Sfc16Random (Random) = ushort[4]
```
```c3
fn void  Sfc16Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn ushort Sfc16Random.next_short(&seed) @dynamic
```
```c3
fn void Sfc16Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Sfc16Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc16Random.next_long(&self) @dynamic
```
```c3
fn uint Sfc16Random.next_int(&self) @dynamic
```
```c3
fn char Sfc16Random.next_byte(&self) @dynamic
```
```c3
typedef Sfc8Random (Random) = char[4]
```
```c3
fn void  Sfc8Random.set_seed(&self, char[] input) @dynamic
```
```c3
fn char Sfc8Random.next_byte(&self) @dynamic
```
```c3
fn void Sfc8Random.next_bytes(&self, char[] bytes) @dynamic
```
```c3
fn uint128 Sfc8Random.next_int128(&self) @dynamic
```
```c3
fn ulong Sfc8Random.next_long(&self) @dynamic
```
```c3
fn uint Sfc8Random.next_int(&self) @dynamic
```
```c3
fn ushort Sfc8Random.next_short(&self) @dynamic
```
```c3
typedef SimpleRandom (Random) = ulong
```
```c3
fn void SimpleRandom.set_seed(&self, char[] seed) @dynamic
```
```c3
fn uint SimpleRandom.next_int(&self) @dynamic
```
```c3
fn void SimpleRandom.next_bytes(&self, char[] bytes) @dynamic
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
fn char SimpleRandom.next_byte(&self) @dynamic
```
### `std::math::uuid`
```c3
typedef Uuid (Printable) = char[16]
```
```c3
fn Uuid generate()
```
```c3
fn Uuid generate_from_random(Random random)
```
```c3
fn usz? Uuid.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn String Uuid.to_string(&self, Allocator allocator)
```
### `std::math::vector`
```c3
macro double[<*>].sq_magnitude(self)
```
```c3
macro float[<*>].sq_magnitude(self)
```
```c3
macro double[<*>].distance_sq(self, double[<*>] v2)
```
```c3
macro float[<*>].distance_sq(self, float[<*>] v2)
```
```c3
macro float[<2>].transform(self, Matrix4f mat)
```
```c3
macro float[<2>].rotate(self, float angle)
```
```c3
macro float[<2>].angle(self, float[<2>] v2)
```
```c3
macro double[<2>].transform(self, Matrix4 mat)
```
```c3
macro double[<2>].rotate(self, double angle)
```
```c3
macro double[<2>].angle(self, double[<2>] v2)
```
```c3
macro float[<*>].clamp_mag(self, float min, float max)
```
```c3
macro double[<*>].clamp_mag(self, double min, double max)
```
```c3
macro float[<*>].towards(self, float[<*>] target, float max_distance)
```
```c3
macro double[<*>].towards(self, double[<*>] target, double max_distance)
```
```c3
fn float[<3>] float[<3>].cross(self, float[<3>] v2)
```
```c3
fn double[<3>] double[<3>].cross(self, double[<3>] v2)
```
```c3
fn float[<3>] float[<3>].perpendicular(self)
```
```c3
fn double[<3>] double[<3>].perpendicular(self)
```
```c3
fn float[<3>] float[<3>].barycenter(self, float[<3>] a, float[<3>] b, float[<3>] c)
```
```c3
fn double[<3>] double[<3>].barycenter(self, double[<3>] a, double[<3>] b, double[<3>] c)
```
```c3
fn float[<3>] float[<3>].transform(self, Matrix4f mat)
```
```c3
fn double[<3>] double[<3>].transform(self, Matrix4 mat)
```
```c3
fn float float[<3>].angle(self, float[<3>] v2)
```
```c3
fn double double[<3>].angle(self, double[<3>] v2)
```
```c3
fn float[<3>] float[<3>].refract(self, float[<3>] n, float r)
```
```c3
fn double[<3>] double[<3>].refract(self, double[<3>] n, double r)
```
```c3
fn float[<3>] float[<3>].rotate_quat(self, Quaternionf q)
```
```c3
fn double[<3>] double[<3>].rotate_quat(self, Quaternion q)
```
```c3
fn float[<3>] float[<3>].rotate_axis(self, float[<3>] axis, float angle)
```
```c3
fn double[<3>] double[<3>].rotate_axis(self, double[<3>] axis, double angle)
```
```c3
fn float[<3>] float[<3>].unproject(self, Matrix4f projection, Matrix4f view)
```
```c3
fn double[<3>] double[<3>].unproject(self, Matrix4 projection, Matrix4 view)
```
```c3
fn void ortho_normalize(float[<3>]* v1, float[<3>]* v2)
```
```c3
fn void ortho_normalized(double[<3>]* v1, double[<3>]* v2)
```
### `std::net`
```c3
enum IpProtocol : char (AIFamily ai_family)
```
```c3
struct InetAddress (Printable)
```
```c3
fn usz? InetAddress.to_format(InetAddress* addr, Formatter* formatter) @dynamic
```
```c3
fn String InetAddress.to_string(&self, Allocator allocator)
```
```c3
fn String InetAddress.to_tstring(&self)
```
```c3
fn InetAddress? ipv6_from_str(String s)
```
```c3
fn InetAddress? ipv4_from_str(String s)
```
```c3
fn bool InetAddress.is_loopback(InetAddress* addr)
```
```c3
fn bool InetAddress.is_any_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_link_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_site_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_global(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_node_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_site_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_org_local(InetAddress* addr)
```
```c3
fn bool InetAddress.is_multicast_link_local(InetAddress* addr)
```
```c3
fn AddrInfo*? addrinfo(String host, uint port, AIFamily ai_family, AISockType ai_socktype) @if(os::SUPPORTS_INET)
```
```c3
faultdef
	INVALID_URL,
	URL_TOO_LONG,
	INVALID_SOCKET,
	GENERAL_ERROR,
	INVALID_IP_STRING,
	ADDRINFO_FAILED,
	CONNECT_FAILED,
	LISTEN_FAILED,
	ACCEPT_FAILED,
	WRITE_FAILED,
	READ_FAILED,
	SOCKOPT_FAILED,

	SOCKETS_NOT_INITIALIZED,
	STILL_PROCESSING_CALLBACK,
	BAD_SOCKET_DESCRIPTOR,
	NOT_A_SOCKET,
	CONNECTION_REFUSED,
	CONNECTION_TIMED_OUT,
	ADDRESS_IN_USE,
	CONNECTION_ALREADY_IN_PROGRESS,
	ALREADY_CONNECTED,
	NETWORK_UNREACHABLE,
	OPERATION_NOT_SUPPORTED_ON_SOCKET,
	CONNECTION_RESET
```
```c3
fn uint? ipv4toint(String s)
```
```c3
fn String? int_to_ipv4(uint val, Allocator allocator)
```
### `std::net @if(os::SUPPORTS_INET)`
```c3
struct Socket (InStream, OutStream)
```
```c3
macro void @loop_over_ai(AddrInfo* ai; @body(NativeSocket fd, AddrInfo* ai))
```
```c3
typedef PollSubscribes = ushort
```
```c3
typedef PollEvents = ushort
```
```c3
struct Poll
```
```c3
fn ulong? poll(Poll[] polls, Duration timeout)
```
```c3
fn ulong? poll_ms(Poll[] polls, long timeout_ms)
```
```c3
macro Socket new_socket(fd, ai)
```
```c3
enum SocketOption : char (CInt value)
```
```c3
fn bool? Socket.get_broadcast(&self)
```
```c3
fn bool? Socket.get_keepalive(&self)
```
```c3
fn bool? Socket.get_reuseaddr(&self)
```
```c3
fn bool? Socket.get_dontroute(&self)
```
```c3
fn bool? Socket.get_oobinline(&self)
```
```c3
fn void? Socket.set_broadcast(&self, bool value)
```
```c3
fn void? Socket.set_keepalive(&self, bool value)
```
```c3
fn void? Socket.set_reuseaddr(&self, bool value)
```
```c3
fn void? Socket.set_dontroute(&self, bool value)
```
```c3
fn void? Socket.set_oobinline(&self, bool value)
```
```c3
fn void? Socket.set_option(&self, SocketOption option, bool value)
```
```c3
fn bool? Socket.get_option(&self, SocketOption option)
```
```c3
fn usz? Socket.read(&self, char[] bytes) @dynamic
```
```c3
fn char? Socket.read_byte(&self) @dynamic
```
```c3
fn usz? Socket.write(&self, char[] bytes) @dynamic
```
```c3
fn void? Socket.write_byte(&self, char byte) @dynamic
```
```c3
fn void? Socket.destroy(&self) @dynamic
```
```c3
fn void? Socket.close(&self) @inline @dynamic
```
```c3
fn usz? Socket.peek(&self, char[] bytes) @dynamic
```
```c3
enum SocketShutdownHow : (CInt native_value)
```
```c3
fn void? Socket.shutdown(&self, SocketShutdownHow how)
```
```c3
fn bool last_error_is_delayed_connect()
```
### `std::net::os`
```c3
typedef AIFamily = CInt
```
```c3
typedef AIProtocol = CInt
```
```c3
typedef AISockType = CInt
```
```c3
typedef AIFlags = CInt
```
```c3
alias Socklen_t @if(!env::WIN32) = CUInt
```
```c3
alias Socklen_t @if(env::WIN32)  = usz
```
```c3
typedef SockAddrPtr = void*
```
```c3
struct AddrInfo
```
```c3
extern fn CInt getaddrinfo(ZString nodename, ZString servname, AddrInfo* hints, AddrInfo** res) @if(SUPPORTS_INET)
```
### `std::net::os @if(env::ANDROID)`
### `std::net::os @if(env::DARWIN)`
### `std::net::os @if(env::LINUX)`
### `std::net::os @if(env::POSIX && SUPPORTS_INET)`
```c3
typedef NativeSocket = inline Fd
```
```c3
struct Posix_pollfd
```
```c3
alias Posix_nfds_t = CUInt
```
```c3
extern fn CInt connect(NativeSocket socket, SockAddrPtr address, Socklen_t address_len)
```
```c3
fn fault socket_error()
```
```c3
macro bool NativeSocket.is_valid(self)
```
```c3
macro void? NativeSocket.close(self)
```
```c3
macro void? NativeSocket.set_non_blocking(self, bool non_blocking)
```
```c3
macro bool NativeSocket.is_non_blocking(self)
```
### `std::net::os @if(env::WIN32)`
```c3
typedef NativeSocket = inline Win32_SOCKET
```
```c3
extern fn CInt ioctlsocket(NativeSocket, CLong cmd, CULong *argp)
```
```c3
fn void? NativeSocket.set_non_blocking(self, bool non_blocking)
```
```c3
macro void? NativeSocket.close(self)
```
```c3
fn fault convert_error(WSAError error)
```
```c3
fn fault socket_error()
```
### `std::net::tcp @if(os::SUPPORTS_INET)`
```c3
typedef TcpSocket = inline Socket
```
```c3
typedef TcpServerSocket = inline Socket
```
```c3
fn TcpSocket? connect(String host, uint port, Duration timeout = time::DURATION_ZERO, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn TcpSocket? connect_async(String host, uint port, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn TcpSocket? connect_to(AddrInfo* ai, SocketOption... options)
```
```c3
fn TcpSocket? connect_async_to(AddrInfo* ai, SocketOption... options)
```
```c3
fn TcpServerSocket? listen(String host, uint port, uint backlog, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn TcpSocket? accept(TcpServerSocket* server_socket)
```
```c3
fn TcpServerSocket? listen_to(AddrInfo* ai, uint backlog, SocketOption... options)
```
### `std::net::udp @if(os::SUPPORTS_INET)`
```c3
typedef UdpSocket = inline Socket
```
```c3
fn UdpSocket? connect(String host, uint port, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn UdpSocket? connect_to(AddrInfo* ai, SocketOption... options)
```
```c3
fn UdpSocket? connect_async(String host, uint port, SocketOption... options, IpProtocol ip_protocol = UNSPECIFIED)
```
```c3
fn UdpSocket? connect_async_to(AddrInfo* ai, SocketOption... options)
```
### `std::net::url`
```c3
faultdef
	EMPTY,
	INVALID_SCHEME,
	INVALID_USER,
	INVALID_PASSWORD,
	INVALID_HOST,
	INVALID_PATH,
	INVALID_FRAGMENT
```
```c3
struct Url(Printable)
```
```c3
fn Url? tparse(String url_string)
```
```c3
fn Url? parse(Allocator allocator, String url_string)
```
```c3
fn usz? Url.to_format(&self, Formatter* f) @dynamic
```
```c3
fn String Url.to_string(&self, Allocator allocator)
```
```c3
alias UrlQueryValueList = List{String}
```
```c3
struct UrlQueryValues
```
```c3
fn UrlQueryValues parse_query_to_temp(String query)
```
```c3
fn UrlQueryValues parse_query(Allocator allocator, String query)
```
```c3
fn UrlQueryValues* UrlQueryValues.add(&self, String key, String value)
```
```c3
fn usz? UrlQueryValues.to_format(&self, Formatter* f) @dynamic
```
```c3
fn void UrlQueryValues.free(&self)
```
```c3
fn void Url.free(&self)
```
```c3
enum UrlEncodingMode : char (String allowed)
```
```c3
faultdef INVALID_HEX
```
```c3
fn usz encode_len(String s, UrlEncodingMode mode) @inline
```
```c3
fn String encode(Allocator allocator, String s, UrlEncodingMode mode)
```
```c3
fn String tencode(String s, UrlEncodingMode mode)
```
```c3
fn usz? decode_len(String s, UrlEncodingMode mode) @inline
```
```c3
fn String? decode(Allocator allocator, String s, UrlEncodingMode  mode)
```
```c3
fn String? tdecode(String s, UrlEncodingMode  mode)
```
### `std::os`
```c3
fn void exit(int result) @weak @noreturn
```
```c3
fn void fastexit(int result) @weak @noreturn
```
### `std::os @if(env::DARWIN)`
```c3
fn uint num_cpu()
```
### `std::os @if(env::LINUX)`
```c3
fn uint num_cpu()
```
### `std::os @if(env::WIN32)`
```c3
fn uint num_cpu()
```
### `std::os::android @if(env::ANDROID)`
```c3
enum LogPriority : (CInt val)
```
```c3
enum LogId : (CInt val)
```
```c3
struct LogMessage @packed
```
```c3
extern fn CInt log_write(LogPriority prio, ZString tag, ZString text) @cname("__android_log_write")
```
```c3
extern fn CInt log_buf_write(CInt bufID, CInt prio, ZString tag, ZString text) @cname("__android_log_buf_write")
```
### `std::os::backtrace`
```c3
faultdef SEGMENT_NOT_FOUND, EXECUTABLE_PATH_NOT_FOUND, IMAGE_NOT_FOUND, NO_BACKTRACE_SYMBOLS,
         RESOLUTION_FAILED
```
```c3
struct Backtrace (Printable)
```
```c3
fn bool Backtrace.has_file(&self)
```
```c3
fn bool Backtrace.is_unknown(&self)
```
```c3
fn usz? Backtrace.to_format(&self, Formatter* formatter) @dynamic
```
```c3
fn void Backtrace.free(&self)
```
```c3
fn Backtrace* Backtrace.init(&self, Allocator allocator, uptr offset, String function, String object_file, String file = "", uint line = 0)
```
```c3
fn void*[] capture_current(void*[] buffer)
```
```c3
alias BacktraceList = List{Backtrace}
```
```c3
alias symbolize_backtrace @if(env::LINUX)  	= linux::symbolize_backtrace
```
```c3
alias symbolize_backtrace @if(env::WIN32)  	= win32::symbolize_backtrace
```
```c3
alias symbolize_backtrace @if(env::DARWIN) 	= darwin::symbolize_backtrace
```
```c3
alias symbolize_backtrace @if(env::OPENBSD)	= openbsd::symbolize_backtrace
```
```c3
fn BacktraceList? symbolize_backtrace(Allocator allocator, void*[] backtrace) @if(!env::NATIVE_STACKTRACE)
```
### `std::os::darwin @if(env::DARWIN)`
```c3
extern fn CInt sysctl(CInt *name, CUInt namelen, void *oldp, usz *oldlenp, void *newp, usz newlen)
```
```c3
struct Darwin_segment_command_64
```
```c3
struct Darwin_mach_timebase_info
```
```c3
alias Darwin_mach_timebase_info_t = Darwin_mach_timebase_info
```
```c3
alias Darwin_mach_timebase_info_data_t = Darwin_mach_timebase_info
```
```c3
extern fn void mach_timebase_info(Darwin_mach_timebase_info_data_t* timebase)
```
```c3
fn BacktraceList? symbolize_backtrace(Allocator allocator, void*[] backtrace)
```
```c3
extern fn usz malloc_size(void* ptr)
```
### `std::os::darwin::cocoa @if(env::OS_TYPE == MACOS) @link("Cocoa.framework")`
```c3
extern fn int nsApplicationMain(int argc, char **argv) @cname("NSApplicationMain")
```
### `std::os::env`
```c3
fn String? get_var(Allocator allocator, String name)
```
```c3
fn String? tget_var(String name)
```
```c3
fn bool set_var(String name, String value, bool overwrite = true)
```
```c3
fn String? get_home_dir(Allocator allocator)
```
```c3
fn Path? get_config_dir(Allocator allocator)
```
```c3
fn bool clear_var(String name)
```
```c3
fn String? executable_path()
```
### `std::os::freebsd @if(env::FREEBSD)`
### `std::os::linux @if(env::LINUX)`
```c3
extern fn usz malloc_usable_size(void* ptr)
```
```c3
extern fn isz readlink(ZString path, char* buf, usz bufsize)
```
```c3
struct Elf32_Phdr
```
```c3
alias Elf64_Addr = ulong
```
```c3
alias Elf64_Half = ushort
```
```c3
alias Elf64_Off = ulong
```
```c3
alias Elf64_Word = uint
```
```c3
alias Elf64_Sword = int
```
```c3
alias Elf64_Sxword = long
```
```c3
alias Elf64_Lword = ulong
```
```c3
alias Elf64_Xword = ulong
```
```c3
struct Elf64_Ehdr
```
```c3
struct Elf64_Phdr
```
```c3
extern fn CInt dladdr(void* addr, Linux_Dl_info* info)
```
```c3
fn Backtrace? backtrace_line_parse(Allocator allocator, String string, String obj_name, String func_name, bool is_inlined)
```
```c3
fn BacktraceList? symbolize_backtrace(Allocator allocator, void*[] backtrace)
```
### `std::os::macos::cf @if(env::DARWIN) @link(env::DARWIN, "CoreFoundation.framework")`
```c3
typedef CFAllocatorRef = void*
```
```c3
typedef CFAllocatorContextRef = void*
```
```c3
alias CFOptionFlags = usz
```
```c3
macro CFAllocatorRef default_allocator()
```
```c3
macro void CFAllocatorRef.dealloc(CFAllocatorRef allocator, void* ptr)
```
```c3
macro void* CFAllocatorRef.alloc(CFAllocatorRef allocator, usz size)
```
```c3
macro usz CFAllocatorRef.get_preferred_size(CFAllocatorRef allocator, usz req_size)
```
```c3
macro void CFAllocatorRef.set_default(CFAllocatorRef allocator)
```
```c3
extern fn CFAllocatorRef macos_CFAllocatorCreate(CFAllocatorRef allocator, CFAllocatorContextRef context) @cname("CFAllocatorCreate") @builtin
```
```c3
typedef CFArrayRef = void*
```
```c3
typedef CFArrayCallBacksRef = void*
```
```c3
typedef CFMutableArrayRef = void*
```
```c3
extern fn CFArrayRef macos_CFArrayCreate(CFAllocatorRef allocator, void** values, CFIndex num_values, CFArrayCallBacksRef callBacks) @cname("CFArrayCreate") @builtin
```
```c3
typedef CFTypeRef = void*
```
```c3
alias CFIndex = isz
```
```c3
struct CFRange
```
```c3
extern fn CFTypeRef macos_CFRetain(CFTypeRef cf) @cname("CFRetain") @builtin
```
### `std::os::macos::objc @if(env::DARWIN) @link(env::DARWIN, "CoreFoundation.framework")`
```c3
typedef ObjcClass = void*
```
```c3
typedef ObjcMethod = void*
```
```c3
typedef ObjcIvar = void*
```
```c3
typedef ObjcSelector = void*
```
```c3
alias ObjcId = void*
```
```c3
alias SendVoid = fn void*(void*, ObjcSelector)
```
```c3
faultdef CLASS_NOT_FOUND, UNKNOWN_EVENT
```
```c3
macro ZString ObjcClass.name(ObjcClass cls)
```
```c3
macro ObjcClass ObjcClass.superclass(ObjcClass cls)
```
```c3
macro bool ObjcClass.responds_to(ObjcClass cls, ObjcSelector sel)
```
```c3
macro ObjcMethod ObjcClass.method(ObjcClass cls, ObjcSelector name)
```
```c3
macro bool ObjcSelector.equals(ObjcSelector a, ObjcSelector b)
```
```c3
macro bool ObjcClass.equals(ObjcClass a, ObjcClass b)
```
```c3
fn ObjcId alloc(ObjcClass cls)
```
```c3
fn void release(ObjcId id)
```
```c3
macro ObjcClass? class_by_name(ZString c)
```
```c3
macro ObjcClass[] class_get_list(Allocator allocator)
```
```c3
extern fn void msgSend(...) @cname("objc_msgSend") @builtin
```
```c3
extern fn ObjcClass getClass(ZString name) @cname("objc_getClass")
```
```c3
enum ApplicationActivationPolicy : (int val)
```
```c3
enum WindowStyleMask : (int val)
```
```c3
enum BackingStore : (int val)
```
```c3
enum EventType : (long val)
```
```c3
fn EventType? event_type_from(int val)
```
```c3
enum EventMask : (long val)
```
```c3
enum EventModifierFlag : (int val)
```
### `std::os::netbsd @if(env::NETBSD)`
### `std::os::openbsd @if(env::OPENBSD)`
```c3
extern fn ZString* backtrace_symbols_fmt(void **addrlist, usz len, ZString fmt)
```
```c3
fn BacktraceList? symbolize_backtrace(Allocator allocator, void*[] backtrace)
```
### `std::os::posix @if(env::POSIX)`
```c3
extern fn CInt clock_gettime(int type, TimeSpec *time)
```
```c3
alias Mode_t = uint
```
```c3
typedef DIRPtr = void*
```
```c3
struct Posix_dirent
```
```c3
extern fn int rmdir(ZString)
```
```c3
extern fn CLong sysconf(CInt name)
```
```c3
extern fn CInt posix_memalign(void **memptr, usz alignment, usz size)
```
```c3
extern fn void* mmap(void*, usz, CInt, CInt, CInt, Off_t)
```
```c3
struct Posix_spawn_file_actions_t
```
```c3
struct Posix_spawnattr_t
```
```c3
extern fn CInt posix_spawn_file_actions_init(Posix_spawn_file_actions_t *file_actions)
```
```c3
alias PosixThreadFn = fn void*(void*)
```
```c3
typedef Pthread_t = void*
```
```c3
extern fn CInt pthread_create(Pthread_t*, Pthread_attr_t*, PosixThreadFn, void*)
```
### `std::os::process @if(env::WIN32 || env::POSIX)`
```c3
faultdef
	FAILED_TO_CREATE_PIPE,
	FAILED_TO_OPEN_STDIN,
	FAILED_TO_OPEN_STDOUT,
	FAILED_TO_OPEN_STDERR,
	FAILED_TO_START_PROCESS,
	FAILED_TO_INITIALIZE_ACTIONS,
	PROCESS_JOIN_FAILED,
	PROCESS_TERMINATION_FAILED,
	READ_FAILED
```
```c3
struct SubProcess
```
```c3
bitstruct SubProcessOptions : int
```
```c3
fn SubProcess? create(String[] command_line, SubProcessOptions options = {}, String[] environment = {}) @if(env::WIN32)
```
```c3
fn String? execute_stdout_to_buffer(char[] buffer, String[] command_line, SubProcessOptions options = {}, String[] environment = {})
```
```c3
fn SubProcess? create(String[] command_line, SubProcessOptions options = {}, String[] environment = {}) @if(env::POSIX)
```
```c3
fn CInt? SubProcess.join(&self) @if(env::POSIX)
```
```c3
fn File SubProcess.stdout(&self)
```
```c3
fn File SubProcess.stderr(&self)
```
```c3
fn CInt? SubProcess.join(&self) @if(env::WIN32)
```
```c3
fn bool SubProcess.destroy(&self)
```
```c3
fn void? SubProcess.terminate(&self)
```
```c3
fn usz? SubProcess.read_stdout(&self, char* buffer, usz size)
```
```c3
fn usz? SubProcess.read_stderr(&self, char* buffer, usz size)
```
```c3
fn bool? SubProcess.is_running(&self)
```
### `std::os::win32`
```c3
alias Win32_BOOL = int
```
```c3
alias Win32_BOOLEAN = Win32_BYTE
```
```c3
alias Win32_BYTE = char
```
```c3
alias Win32_CCHAR = cinterop::CChar
```
```c3
alias Win32_CHAR = cinterop::CChar
```
```c3
alias Win32_COLORREF = Win32_DWORD
```
```c3
alias Win32_DWORD = uint
```
```c3
alias Win32_DWORDLONG = ulong
```
```c3
alias Win32_DWORD_PTR = Win32_ULONG_PTR
```
```c3
alias Win32_DWORD32 = uint
```
```c3
alias Win32_DWORD64 = ulong
```
```c3
alias Win32_FLOAT = float
```
```c3
alias Win32_HACCEL = Win32_HANDLE
```
```c3
alias Win32_HALF_PTR = int
```
```c3
alias Win32_HANDLE = Win32_PVOID
```
```c3
alias Win32_HBITMAP = Win32_HANDLE
```
```c3
alias Win32_HBRUSH = Win32_HANDLE
```
```c3
alias Win32_HCOLORSPACE = Win32_HANDLE
```
```c3
alias Win32_HCONV = Win32_HANDLE
```
```c3
alias Win32_HCONVLIST = Win32_HANDLE
```
```c3
alias Win32_HCURSOR = Win32_HICON
```
```c3
alias Win32_HDC = Win32_HANDLE
```
```c3
alias Win32_HDDEDATA = Win32_HANDLE
```
```c3
alias Win32_HDESK = Win32_HANDLE
```
```c3
alias Win32_HDROP = Win32_HANDLE
```
```c3
alias Win32_HDWP = Win32_HANDLE
```
```c3
alias Win32_HFILE = int
```
```c3
alias Win32_HFONT = Win32_HANDLE
```
```c3
alias Win32_HGDIOBJ = Win32_HANDLE
```
```c3
alias Win32_HGLOBAL = Win32_HANDLE
```
```c3
alias Win32_HHOOK = Win32_HANDLE
```
```c3
alias Win32_HICON = Win32_HANDLE
```
```c3
alias Win32_HINSTANCE = Win32_HANDLE
```
```c3
alias Win32_HKEY = Win32_HANDLE
```
```c3
alias Win32_HKL = Win32_HANDLE
```
```c3
alias Win32_HLOCAL = Win32_HANDLE
```
```c3
alias Win32_HMENU = Win32_HANDLE
```
```c3
alias Win32_HMETAFILE = Win32_HANDLE
```
```c3
alias Win32_HMODULE = Win32_HANDLE
```
```c3
alias Win32_HMONITOR = Win32_HANDLE
```
```c3
alias Win32_HPALETTE = Win32_HANDLE
```
```c3
alias Win32_HPEN = Win32_HANDLE
```
```c3
alias Win32_HRESULT = Win32_LONG
```
```c3
alias Win32_HRGN = Win32_HANDLE
```
```c3
alias Win32_HRSRC = Win32_HANDLE
```
```c3
alias Win32_HSZ = Win32_HANDLE
```
```c3
alias Win32_HWINSTA = Win32_HANDLE
```
```c3
alias Win32_HWND = Win32_HANDLE
```
```c3
alias Win32_INT = int
```
```c3
alias Win32_INT_PTR = iptr
```
```c3
alias Win32_INT8 = ichar
```
```c3
alias Win32_INT16 = short
```
```c3
alias Win32_INT32 = int
```
```c3
alias Win32_INT64 = long
```
```c3
alias Win32_LANGID = Win32_WORD
```
```c3
alias Win32_LCID = Win32_DWORD
```
```c3
alias Win32_LCTYPE = Win32_DWORD
```
```c3
alias Win32_LGRPID = Win32_DWORD
```
```c3
alias Win32_LONG = int
```
```c3
alias Win32_LONGLONG = long
```
```c3
alias Win32_LONG_PTR = iptr
```
```c3
alias Win32_LONG32 = int
```
```c3
alias Win32_LONG64 = long
```
```c3
alias Win32_LPARAM = Win32_LONG_PTR
```
```c3
alias Win32_LPBOOL = Win32_BOOL*
```
```c3
alias Win32_LPBYTE = Win32_BYTE*
```
```c3
alias Win32_LPCOLORREF = Win32_DWORD*
```
```c3
alias Win32_LPCSTR = Win32_CCHAR*
```
```c3
alias Win32_LPCTSTR = Win32_LPCWSTR
```
```c3
alias Win32_LPCVOID = void*
```
```c3
alias Win32_LPCWSTR = Win32_WCHAR*
```
```c3
alias Win32_LPDWORD = Win32_DWORD*
```
```c3
alias Win32_LPHANDLE = Win32_HANDLE*
```
```c3
alias Win32_LPINT = int*
```
```c3
alias Win32_LPLONG = int*
```
```c3
alias Win32_LPSTR = Win32_CCHAR*
```
```c3
alias Win32_LPTSTR = Win32_LPWSTR
```
```c3
alias Win32_LPVOID = void*
```
```c3
alias Win32_LPWORD = Win32_WORD*
```
```c3
alias Win32_LPWSTR = Win32_WCHAR*
```
```c3
alias Win32_LRESULT = Win32_LONG_PTR
```
```c3
alias Win32_NTSTATUS = Win32_LONG
```
```c3
alias Win32_PBOOL = Win32_BOOL*
```
```c3
alias Win32_PBOOLEAN = Win32_BOOLEAN*
```
```c3
alias Win32_PBYTE = Win32_BYTE*
```
```c3
alias Win32_PCHAR = Win32_CHAR*
```
```c3
alias Win32_PCSTR = Win32_CHAR*
```
```c3
alias Win32_PCTSTR = Win32_LPCWSTR
```
```c3
alias Win32_PCUNICODE_STRING = Win32_UNICODE_STRING*
```
```c3
alias Win32_PCWSTR = WString
```
```c3
alias Win32_PDWORD = Win32_DWORD*
```
```c3
alias Win32_PDWORDLONG = Win32_DWORDLONG*
```
```c3
alias Win32_PDWORDPTR = Win32_DWORD_PTR*
```
```c3
alias Win32_PDWORD32 = Win32_DWORD32*
```
```c3
alias Win32_PDWORD64 = Win32_DWORD64*
```
```c3
alias Win32_PFLOAT = Win32_FLOAT*
```
```c3
alias Win32_PHALFPTR = Win32_HALF_PTR*
```
```c3
alias Win32_PHANDLE = Win32_HANDLE*
```
```c3
alias Win32_PHKEY = Win32_HKEY*
```
```c3
alias Win32_PINT = int*
```
```c3
alias Win32_PINTPTR = Win32_INT_PTR*
```
```c3
alias Win32_PINT8 = Win32_INT8*
```
```c3
alias Win32_PINT16 = Win32_INT16*
```
```c3
alias Win32_PINT32 = Win32_INT32*
```
```c3
alias Win32_PINT64 = Win32_INT64*
```
```c3
alias Win32_PLCID = Win32_PDWORD
```
```c3
alias Win32_PLONG = Win32_LONG*
```
```c3
alias Win32_PLONGLONG = Win32_LONGLONG*
```
```c3
alias Win32_PLONG_PTR = Win32_LONG_PTR*
```
```c3
alias Win32_PLONG32 = Win32_LONG32*
```
```c3
alias Win32_PLONG64 = Win32_LONG64*
```
```c3
alias Win32_POINTER_32 = uint
```
```c3
alias Win32_POINTER_64 = uptr
```
```c3
alias Win32_POINTER_SIGNED = iptr
```
```c3
alias Win32_POINTER_UNSIGNED = uptr
```
```c3
alias Win32_PSHORT = Win32_SHORT*
```
```c3
alias Win32_PSIZE_T = usz*
```
```c3
alias Win32_PSSIZE_T = isz*
```
```c3
alias Win32_PSTR = Win32_CHAR*
```
```c3
alias Win32_PTBYTE = Win32_TBYTE*
```
```c3
alias Win32_PTCHAR = Win32_TCHAR*
```
```c3
alias Win32_PTSTR = Win32_LPWSTR
```
```c3
alias Win32_PUCHAR = Win32_UCHAR*
```
```c3
alias Win32_PUHALFPTR = Win32_UHALF_PTR*
```
```c3
alias Win32_PUINT = Win32_UINT*
```
```c3
alias Win32_PUINTPTR = Win32_UINT_PTR*
```
```c3
alias Win32_PUINT8 = Win32_UINT8*
```
```c3
alias Win32_PUINT16 = Win32_UINT16*
```
```c3
alias Win32_PUINT32 = Win32_UINT32*
```
```c3
alias Win32_PUINT64 = Win32_UINT64*
```
```c3
alias Win32_PULONG = Win32_ULONG*
```
```c3
alias Win32_PULONGLONG = Win32_ULONGLONG*
```
```c3
alias Win32_PULONG_PTR = Win32_ULONG_PTR*
```
```c3
alias Win32_PULONG32 = Win32_ULONG32*
```
```c3
alias Win32_PULONG64 = Win32_ULONG64*
```
```c3
alias Win32_PUNICODE_STRING = Win32_UNICODE_STRING*
```
```c3
alias Win32_PUSHORT = Win32_USHORT*
```
```c3
alias Win32_PVOID = void*
```
```c3
alias Win32_PWCHAR = Win32_WCHAR*
```
```c3
alias Win32_PWORD = Win32_WORD*
```
```c3
alias Win32_PWSTR = Win32_WCHAR*
```
```c3
alias Win32_QWORD = ulong
```
```c3
alias Win32_SC_HANDLE = Win32_HANDLE
```
```c3
alias Win32_SC_LOCK = Win32_LPVOID
```
```c3
alias Win32_SERVICE_STATUS_HANDLE = Win32_HANDLE
```
```c3
alias Win32_SHORT = short
```
```c3
alias Win32_SIZE_T = usz
```
```c3
alias Win32_SOCKET = Win32_HANDLE
```
```c3
alias Win32_SSIZE_T = isz
```
```c3
alias Win32_TBYTE = Win32_WCHAR
```
```c3
alias Win32_TCHAR = Win32_WCHAR
```
```c3
alias Win32_UCHAR = char
```
```c3
alias Win32_UHALF_PTR = uint
```
```c3
alias Win32_UINT = uint
```
```c3
alias Win32_UINT_PTR = uptr
```
```c3
alias Win32_UINT8 = char
```
```c3
alias Win32_UINT16 = ushort
```
```c3
alias Win32_UINT32 = uint
```
```c3
alias Win32_UINT64 = ulong
```
```c3
alias Win32_ULONG = uint
```
```c3
alias Win32_ULONGLONG = ulong
```
```c3
alias Win32_ULONG_PTR = ulong
```
```c3
alias Win32_ULONG32 = uint
```
```c3
alias Win32_ULONG64 = ulong
```
```c3
alias Win32_USHORT = ushort
```
```c3
alias Win32_USN = Win32_LONGLONG
```
```c3
alias Win32_WCHAR = Char16
```
```c3
alias Win32_WORD = ushort
```
```c3
alias Win32_WPARAM = Win32_UINT_PTR
```
```c3
struct Win32_UNICODE_STRING
```
```c3
typedef Win32_CRITICAL_SECTION = ulong[5]
```
```c3
typedef Win32_CONDITION_VARIABLE = void*
```
```c3
typedef Win32_SRWLOCK = void*
```
```c3
typedef Win32_INIT_ONCE = void*
```
```c3
struct Win32_SECURITY_ATTRIBUTES
```
```c3
alias Win32_LPSECURITY_ATTRIBUTES = Win32_SECURITY_ATTRIBUTES*
```
```c3
alias Win32_PSECURITY_ATTRIBUTES = Win32_SECURITY_ATTRIBUTES*
```
```c3
struct Win32_STARTUPINFOW
```
```c3
struct Win32_OVERLAPPED
```
```c3
alias Win32_LPOVERLAPPED = Win32_OVERLAPPED*
```
```c3
alias Win32_LPSTARTUPINFOW = Win32_STARTUPINFOW*
```
```c3
struct Win32_STARTUPINFOEXW
```
```c3
alias Win32_LPPROC_THREAD_ATTRIBUTE_LIST = void*
```
```c3
alias Win32_LPSTARTUPINFOEXW = Win32_STARTUPINFOEXW*
```
```c3
struct Win32_FILETIME
```
```c3
struct Win32_PROCESS_INFORMATION
```
```c3
alias Win32_PPROCESS_INFORMATION = Win32_PROCESS_INFORMATION*
```
```c3
alias Win32_LPPROCESS_INFORMATION = Win32_PROCESS_INFORMATION*
```
```c3
struct Win32_SYSTEM_INFO
```
```c3
alias Win32_LPSYSTEM_INFO = Win32_SYSTEM_INFO*
```
```c3
struct Win32_MODULEINFO
```
```c3
struct Win32_IMAGEHLP_LINE64
```
```c3
enum Win32_SYM_TYPE
```
```c3
struct Win32_GUID
```
```c3
struct Win32_IMAGEHLP_MODULE64
```
```c3
alias Win32_PIMAGEHLP_MODULE64 = Win32_IMAGEHLP_MODULE64*
```
```c3
struct Win32_ARM64_NT_CONTEXT @align(16)
```
```c3
struct Win32_ARM64_NT_NEON128
```
```c3
struct Win32_XMM_SAVE_AREA32
```
```c3
struct Win32_AMD64_CONTEXT @align(16)
```
```c3
alias CONTEXT_CONTROL = CONTEXT_AMD64_CONTROL
```
```c3
alias CONTEXT_FULL = CONTEXT_AMD64_FULL
```
```c3
alias CONTEXT_ALL = CONTEXT_AMD64_ALL
```
```c3
alias Win32_CONTEXT = Win32_AMD64_CONTEXT
```
```c3
alias Win32_PCONTEXT = Win32_CONTEXT*
```
```c3
struct Win32_M128A @align(16)
```
```c3
struct Win32_IMAGE_DATA_DIRECTORY
```
```c3
struct Win32_IMAGE_OPTIONAL_HEADER64
```
```c3
alias Win32_PIMAGE_OPTIONAL_HEADER64 = Win32_IMAGE_OPTIONAL_HEADER64*
```
```c3
struct Win32_IMAGE_FILE_HEADER
```
```c3
alias Win32_PIMAGE_FILE_HEADER = Win32_IMAGE_FILE_HEADER*
```
```c3
struct Win32_IMAGE_NT_HEADERS
```
```c3
alias Win32_PIMAGE_NT_HEADERS = Win32_IMAGE_NT_HEADERS*
```
```c3
struct Win32_SYMBOL_INFO
```
```c3
alias Win32_PSYMBOL_INFO = Win32_SYMBOL_INFO*
```
```c3
struct Win32_MODLOAD_DATA
```
```c3
enum Win32_ADDRESS_MODE
```
```c3
struct Win32_ADDRESS64
```
```c3
struct Win32_KDHELP64
```
```c3
struct Win32_STACKFRAME64
```
```c3
alias Win32_PREAD_PROCESS_MEMORY_ROUTINE64 = fn Win32_BOOL(Win32_HANDLE hProcess, Win32_DWORD64 qwBaseAddress, Win32_PVOID lpBuffer, Win32_DWORD nSize, Win32_LPDWORD lpNumberOfBytesRead)
```
```c3
alias Win32_PFUNCTION_TABLE_ACCESS_ROUTINE64 = fn Win32_PVOID(Win32_HANDLE ahProcess, Win32_DWORD64 addrBase)
```
```c3
alias Win32_PGET_MODULE_BASE_ROUTINE64 = fn Win32_DWORD64(Win32_HANDLE hProcess, Win32_DWORD64 address)
```
```c3
alias Win32_PTRANSLATE_ADDRESS_ROUTINE64 = fn Win32_DWORD64(Win32_HANDLE hProcess, Win32_HANDLE hThread, Win32_LPADDRESS64 lpaddr)
```
```c3
alias Win32_PKDHELP64 = Win32_KDHELP64*
```
```c3
alias Win32_LPADDRESS64 = Win32_ADDRESS64*
```
```c3
alias Win32_LPSTACKFRAME64 = Win32_STACKFRAME64*
```
```c3
alias Win32_PMODLOAD_DATA = Win32_MODLOAD_DATA*
```
```c3
alias Win32_PIMAGEHLP_LINE64 = Win32_IMAGEHLP_LINE64*
```
```c3
alias Win32_LPMODULEINFO = Win32_MODULEINFO*
```
### `std::os::win32 @if(env::WIN32)`
```c3
extern fn void getSystemTimeAsFileTime(Win32_FILETIME* time) @cname("GetSystemTimeAsFileTime")
```
```c3
enum Win32_GET_FILEEX_INFO_LEVELS
```
```c3
struct Win32_FILE_ATTRIBUTE_DATA
```
```c3
struct Win32_WIN32_FIND_DATAW
```
```c3
alias Win32_LPWIN32_FIND_DATAW = Win32_WIN32_FIND_DATAW*
```
```c3
extern fn Win32_BOOL closeHandle(Win32_HANDLE) @cname("CloseHandle")
```
```c3
extern fn Win32_HBRUSH createSolidBrush(Win32_COLORREF) @cname("CreateSolidBrush")
```
```c3
extern fn Win32_DWORD getLastError() @cname("GetLastError")
```
```c3
extern fn void* _aligned_malloc(usz size, usz alignment)
```
```c3
enum Win32_AllocationType : const Win32_DWORD
```
```c3
enum Win32_Protect : const Win32_DWORD
```
```c3
enum Win32_FreeType : const Win32_DWORD
```
```c3
extern fn Win32_LPVOID virtualAlloc(Win32_LPVOID lpAddres, Win32_SIZE_T dwSize, Win32_AllocationType flAllocationType, Win32_Protect flProtect) @cname("VirtualAlloc")
```
```c3
alias Win32_INIT_ONCE_FN = fn Win32_BOOL(Win32_INIT_ONCE* initOnce, void* parameter, void** context)
```
```c3
extern fn void initializeCriticalSection(Win32_CRITICAL_SECTION* section) @cname("InitializeCriticalSection")
```
```c3
struct Symbol
```
```c3
fn BacktraceList? symbolize_backtrace(Allocator allocator, void*[] backtrace)
```
```c3
fn Backtrace? resolve_backtrace(Allocator allocator, void* addr, Win32_HANDLE process)
```
```c3
struct Win32_KEY_EVENT_RECORD
```
```c3
struct Win32_COORD
```
```c3
struct Win32_MOUSE_EVENT_RECORD
```
```c3
struct Win32_WINDOW_BUFFER_SIZE_RECORD
```
```c3
struct Win32_MENU_EVENT_RECORD
```
```c3
struct Win32_FOCUS_EVENT_RECORD
```
```c3
struct Win32_INPUT_RECORD
```
```c3
alias Win32_PCOORD = Win32_COORD*
```
```c3
struct Win32_RECT
```
```c3
struct Win32_POINT
```
```c3
struct Win32_SIZE
```
```c3
struct Win32_WSABUF
```
```c3
struct Win32_SOCKADDR
```
```c3
alias Win32_PSIZE = Win32_SIZE*
```
```c3
alias Win32_NPSIZE = Win32_SIZE*
```
```c3
alias Win32_LPSIZE = Win32_SIZE*
```
```c3
alias Win32_PPOINT = Win32_POINT*
```
```c3
alias Win32_NPOINT = Win32_POINT*
```
```c3
alias Win32_LPOINT = Win32_POINT*
```
```c3
alias Win32_PRECT = Win32_RECT*
```
```c3
alias Win32_NPRECT = Win32_RECT*
```
```c3
alias Win32_LPRECT = Win32_RECT*
```
```c3
alias Win32_PWSABUF = Win32_WSABUF*
```
```c3
alias Win32_LPWSABUF = Win32_WSABUF*
```
```c3
alias Win32_PSOCKADDR = Win32_SOCKADDR*
```
```c3
alias Win32_LPSOCKADDR = Win32_SOCKADDR*
```
```c3
enum Win32_MEM_EXTENDED_PARAMETER_TYPE : CInt
```
```c3
alias Win32_PMEM_EXTENDED_PARAMETER_TYPE = Win32_MEM_EXTENDED_PARAMETER_TYPE
```
```c3
enum Win32_MEM_EXTENDED_PARAMETER_ATTRIBUTE : const Win32_DWORD64
```
```c3
struct Win32_MEM_EXTENDED_PARAMETER
```
```c3
alias Win32_PMEM_EXTENDED_PARAMETER = Win32_MEM_EXTENDED_PARAMETER*
```
```c3
alias Win32_WNDPROC = fn Win32_LRESULT(Win32_HWND, Win32_UINT, Win32_WPARAM, Win32_LPARAM)
```
```c3
struct Win32_WNDCLASSEXW
```
```c3
struct Win32_MSG
```
```c3
struct Win32_PAINTSTRUCT
```
```c3
alias Win32_PWNDCLASSEXW = Win32_WNDCLASSEXW*
```
```c3
alias Win32_LPWNDCLASSEXW = Win32_WNDCLASSEXW*
```
```c3
alias Win32_NPWNDCLASSEXW = Win32_WNDCLASSEXW*
```
```c3
alias Win32_PPAINTSTRUCT = Win32_PAINTSTRUCT*
```
```c3
alias Win32_LPPAINTSTRUCT = Win32_PAINTSTRUCT*
```
```c3
alias Win32_NPPAINTSTRUCT = Win32_PAINTSTRUCT*
```
```c3
alias Win32_PMSG = Win32_MSG*
```
```c3
alias Win32_LPMSG = Win32_MSG*
```
```c3
alias Win32_NPMSG = Win32_MSG*
```
```c3
alias Win32_ATOM = ushort
```
```c3
extern fn Win32_HDC beginPaint(Win32_HWND, Win32_LPPAINTSTRUCT) @cname("BeginPaint")
```
```c3
macro setWindowLongPtr(Win32_HWND hWnd, CInt nIndex, dwNewLong)
```
```c3
struct Win32_addrinfo
```
```c3
alias Win32_ADDRINFO = Win32_addrinfo
```
```c3
alias Win32_ADDRINFOA = Win32_ADDRINFO
```
```c3
alias Win32_PADDRINFOA = Win32_ADDRINFO*
```
```c3
struct Win32_addrinfoW
```
```c3
alias Win32_ADDRINFOW = Win32_addrinfoW
```
```c3
alias Win32_PADDRINFOW = Win32_addrinfoW*
```
```c3
typedef WSAError = int
```
```c3
struct Win32_pollfd
```
```c3
alias Win32_WSAPOLLFD = Win32_pollfd
```
```c3
alias Win32_PWSAPOLLFD = Win32_WSAPOLLFD*
```
```c3
alias Win32_LPWSAPOLLFD = Win32_WSAPOLLFD*
```
```c3
struct Win32_InAddr
```
```c3
struct Win32_SOCKADDR_IN
```
```c3
struct Win32_SOCKADDR_STORAGE
```
```c3
alias Win32_WSAOVERLAPPED = Win32_OVERLAPPED
```
```c3
alias Win32_LPWSAOVERLAPPED = Win32_WSAOVERLAPPED*
```
```c3
alias Win32_LPWSAOVERLAPPED_COMPLETION_ROUTINE = fn void (
	Win32_DWORD dwError,
	Win32_DWORD cbTransferred,
	Win32_LPWSAOVERLAPPED
	lpOverlapped,
	Win32_DWORD dwFlags
)
```
```c3
alias Win32_LPFN_WSARECV = fn CInt(
	Win32_SOCKET socket,
	Win32_LPWSABUF buffers,
	Win32_DWORD buffer_count,
	Win32_LPDWORD bytes,
	Win32_LPDWORD flags,
	Win32_LPWSAOVERLAPPED overlapped,
	Win32_LPWSAOVERLAPPED_COMPLETION_ROUTINE completion_routine
)
```
```c3
alias Win32_LPFN_WSARECVFROM = fn CInt(
	Win32_SOCKET socket,
	Win32_LPWSABUF buffers,
	Win32_DWORD buffer_count,
	Win32_LPDWORD bytes,
	Win32_LPDWORD flags,
	Win32_SOCKADDR* addr,
	Win32_LPINT addr_len,
	Win32_LPWSAOVERLAPPED overlapped,
	Win32_LPWSAOVERLAPPED_COMPLETION_ROUTINE completion_routine
)
```
```c3
alias Win32_LPFn_CONNECTEX = fn bool(
	Win32_SOCKET,
	Win32_SOCKADDR*,
	Win32_INT,
	Win32_PVOID,
	Win32_DWORD,
	Win32_LPDWORD,
	void*
)
```
```c3
alias Win32_LPFn_ACCEPTEX = fn bool(
	Win32_SOCKET,
	Win32_SOCKET,
	Win32_PVOID,
	Win32_DWORD,
	Win32_DWORD,
	Win32_DWORD,
	Win32_LPDWORD,
	void*
)
```
```c3
extern fn CInt wsaPoll(Win32_LPWSAPOLLFD fdArray, Win32_ULONG fds, Win32_INT timeout) @cname("WSAPoll")
```
### `std::sort`
```c3
macro usz binarysearch(list, x, cmp = EMPTY_MACRO_SLOT, context = EMPTY_MACRO_SLOT) @builtin
```
```c3
macro countingsort(list, key_fn = EMPTY_MACRO_SLOT) @builtin
```
```c3
macro insertionsort_indexed(list, start, end, cmp = EMPTY_MACRO_SLOT, context = EMPTY_MACRO_SLOT) @builtin
```
```c3
macro quicksort_indexed(list, start, end, cmp = EMPTY_MACRO_SLOT, context = EMPTY_MACRO_SLOT) @builtin
```
```c3
macro insertionsort(list, cmp = EMPTY_MACRO_SLOT, context = EMPTY_MACRO_SLOT) @builtin @safemacro
```
```c3
macro quicksort(list, cmp = EMPTY_MACRO_SLOT, context = EMPTY_MACRO_SLOT) @builtin
```
```c3
macro quickselect(list, isz k, cmp = EMPTY_MACRO_SLOT, context = EMPTY_MACRO_SLOT) @builtin
```
```c3
macro usz len_from_list(list)
```
```c3
macro bool @is_sortable(#list)
```
```c3
macro bool @is_valid_context(#cmp, #context)
```
```c3
macro bool @is_valid_cmp_fn(#cmp, #list, #context)
```
```c3
macro bool @is_cmp_key_fn(#key_fn, #list)
```
```c3
macro bool is_sorted(list, cmp = EMPTY_MACRO_SLOT, ctx = EMPTY_MACRO_SLOT) @builtin
```
### `std::sort::cs{Type, KeyFn}`
```c3
alias ElementType = $typeof((Type){}[0])
```
```c3
alias KeyFnReturnType @if(!NO_KEY_FN) = $typefrom(KeyFn.returns)
```
```c3
alias KeyFnReturnType @if(NO_KEY_FN) = ElementType
```
```c3
alias CmpCallback @if(KEY_BY_VALUE && NO_KEY_FN) = fn int(ElementType, ElementType)
```
```c3
alias CmpCallback @if(!KEY_BY_VALUE && NO_KEY_FN) = fn int(ElementType*, ElementType*)
```
```c3
alias CmpCallback @if(KEY_BY_VALUE && !NO_KEY_FN) = fn int(ElementType, ElementType, KeyFn)
```
```c3
alias CmpCallback @if(!KEY_BY_VALUE && !NO_KEY_FN) = fn int(ElementType*, ElementType*, KeyFn)
```
```c3
fn void csort(Type list, usz low, usz high, KeyFn key_fn, uint byte_idx)
```
### `std::sort::is{Type, CmpFn, Context}`
```c3
alias ElementType = $typeof(((Type){})[0])
```
```c3
fn void isort(Type list, usz low, usz high, CmpFn comp, Context context)
```
### `std::sort::qs{Type, CmpFn, Context}`
```c3
alias ElementType = $typeof(((Type){})[0])
```
```c3
fn void qsort(Type list, isz low, isz high, CmpFn cmp, Context context)
```
```c3
fn ElementType? qselect(Type list, isz low, isz high, isz k, CmpFn cmp, Context context)
```
```c3
macro @partition(Type list, isz l, isz h, CmpFn cmp, Context context)
```
### `std::thread`
```c3
faultdef THREAD_QUEUE_FULL
```
```c3
bitstruct MutexType : int
```
```c3
typedef Mutex = NativeMutex
```
```c3
typedef RecursiveMutex = inline Mutex
```
```c3
typedef TimedMutex = NativeTimedMutex
```
```c3
typedef TimedRecursiveMutex = inline TimedMutex
```
```c3
typedef ConditionVariable = NativeConditionVariable
```
```c3
typedef Thread = inline NativeThread
```
```c3
typedef OnceFlag = NativeOnceFlag
```
```c3
alias OnceFn = fn void()
```
```c3
alias ThreadFn = fn int(void* arg)
```
```c3
faultdef
	INIT_FAILED,
	DESTROY_FAILED,
	LOCK_FAILED,
	LOCK_TIMEOUT,
	UNLOCK_FAILED,
	SIGNAL_FAILED,
	WAIT_FAILED,
	WAIT_TIMEOUT,
	DETACH_FAILED,
	JOIN_FAILED,
	INTERRUPTED,
	CHANNEL_CLOSED
```
```c3
macro void? Mutex.init(&mutex)
```
```c3
macro void? RecursiveMutex.init(&mutex)
```
```c3
macro void? Mutex.destroy(&mutex)
```
```c3
macro void? Mutex.lock(&mutex)
```
```c3
macro bool  Mutex.try_lock(&mutex)
```
```c3
macro void? Mutex.unlock(&mutex)
```
```c3
macro void? TimedMutex.init(&mutex)
```
```c3
macro void? TimedRecursiveMutex.init(&mutex)
```
```c3
macro void? TimedMutex.destroy(&mutex)
```
```c3
macro void? TimedMutex.lock(&mutex)
```
```c3
macro void? TimedMutex.lock_timeout(&mutex, ulong ms)
```
```c3
macro bool  TimedMutex.try_lock(&mutex)
```
```c3
macro void? TimedMutex.unlock(&mutex)
```
```c3
macro void fence(AtomicOrdering $ordering) @safemacro
```
```c3
macro void Mutex.@in_lock(&mutex; @body)
```
```c3
macro void? ConditionVariable.init(&cond)
```
```c3
macro void? ConditionVariable.destroy(&cond)
```
```c3
macro void? ConditionVariable.signal(&cond)
```
```c3
macro void? ConditionVariable.broadcast(&cond)
```
```c3
macro void? ConditionVariable.wait(&cond, Mutex* mutex)
```
```c3
macro void? ConditionVariable.wait_timeout(&cond, Mutex* mutex, #ms_or_duration) @safemacro
```
```c3
macro void? ConditionVariable.wait_until(&cond, Mutex* mutex, Time time)
```
```c3
macro void? Thread.create(&thread, ThreadFn thread_fn, void* arg)
```
```c3
macro void? Thread.detach(thread)
```
```c3
macro int? Thread.join(thread)
```
```c3
macro bool Thread.equals(thread, Thread other)
```
```c3
macro void OnceFlag.call(&flag, OnceFn func)
```
```c3
macro void yield()
```
```c3
macro Thread current()
```
```c3
macro void exit(int result)
```
```c3
macro void? sleep(Duration d) @maydiscard
```
```c3
macro void? sleep_ms(ulong ms) @maydiscard
```
```c3
macro void? sleep_ns(NanoDuration ns) @maydiscard
```
### `std::thread::channel {Type}`
```c3
typedef UnbufferedChannel = void*
```
```c3
fn void? UnbufferedChannel.init(&self, Allocator allocator)
```
```c3
fn void? UnbufferedChannel.destroy(&self)
```
```c3
fn void? UnbufferedChannel.push(self, Type val)
```
```c3
fn Type? UnbufferedChannel.pop(self)
```
```c3
fn void? UnbufferedChannel.close(self)
```
### `std::thread::channel{Type}`
```c3
typedef BufferedChannel = void*
```
```c3
fn void? BufferedChannel.init(&self, Allocator allocator, usz size = 1)
```
```c3
fn void? BufferedChannel.destroy(&self)
```
```c3
fn void? BufferedChannel.push(self, Type val)
```
```c3
fn Type? BufferedChannel.pop(self)
```
```c3
fn void? BufferedChannel.close(self)
```
### `std::thread::cpu @if(env::DARWIN)`
```c3
fn uint native_cpu()
```
### `std::thread::cpu @if(env::LINUX)`
```c3
fn uint native_cpu()
```
### `std::thread::cpu @if(env::WIN32)`
```c3
fn uint native_cpu()
```
### `std::thread::event`
### `std::thread::os @if (!env::POSIX && !env::WIN32)`
```c3
typedef NativeMutex = int
```
```c3
typedef NativeTimedMutex = int
```
```c3
typedef NativeConditionVariable = int
```
```c3
typedef NativeOnceFlag = int
```
```c3
typedef NativeThread = int
```
### `std::thread::os @if(env::POSIX)`
```c3
struct NativeMutex
```
```c3
alias NativeTimedMutex = NativeMutex
```
```c3
alias NativeConditionVariable = Pthread_cond_t
```
```c3
struct NativeThread
```
```c3
alias NativeOnceFlag = Pthread_once_t
```
```c3
fn void? NativeMutex.init(&self, MutexType type)
```
```c3
fn bool NativeMutex.is_initialized(&self)
```
```c3
fn void? NativeMutex.destroy(&self)
```
```c3
fn void? NativeMutex.lock(&self)
```
```c3
fn void? NativeMutex.lock_timeout(&self, ulong ms)
```
```c3
fn bool NativeMutex.try_lock(&self)
```
```c3
fn void? NativeMutex.unlock(&self)
```
```c3
fn void? NativeConditionVariable.init(&cond)
```
```c3
fn void? NativeConditionVariable.destroy(&cond)
```
```c3
fn void? NativeConditionVariable.signal(&cond)
```
```c3
fn void? NativeConditionVariable.broadcast(&cond)
```
```c3
fn void? NativeConditionVariable.wait(&cond, NativeMutex* mtx)
```
```c3
fn void? NativeConditionVariable.wait_timeout(&cond, NativeMutex* mtx, ulong ms)
```
```c3
fn void? NativeConditionVariable.wait_timeout_duration(&cond, NativeMutex* mtx, Duration duration)
```
```c3
fn void? NativeConditionVariable.wait_until(&cond, NativeMutex* mtx, Time time)
```
```c3
fn void? NativeThread.create(&thread, ThreadFn thread_fn, void* arg)
```
```c3
fn void? NativeThread.detach(thread)
```
```c3
fn void native_thread_exit(int result)
```
```c3
fn NativeThread native_thread_current()
```
```c3
fn bool NativeThread.equals(thread, NativeThread other)
```
```c3
fn int? NativeThread.join(thread)
```
```c3
fn void NativeOnceFlag.call_once(&flag, OnceFn func)
```
```c3
fn void native_thread_yield()
```
```c3
fn void? native_sleep_nano(NanoDuration nano)
```
### `std::thread::os @if(env::WIN32)`
```c3
typedef NativeThread = inline Win32_HANDLE
```
```c3
struct NativeMutex
```
```c3
struct NativeTimedMutex
```
```c3
struct NativeConditionVariable
```
```c3
struct NativeOnceFlag
```
```c3
fn void? NativeMutex.init(&mtx, MutexType type)
```
```c3
fn void? NativeMutex.destroy(&mtx)
```
```c3
fn void? NativeMutex.lock(&mtx)
```
```c3
fn bool NativeMutex.try_lock(&mtx)
```
```c3
fn void? NativeMutex.unlock(&mtx)
```
```c3
fn void? NativeTimedMutex.init(&mtx, MutexType type)
```
```c3
fn void? NativeTimedMutex.destroy(&mtx)
```
```c3
fn void? NativeTimedMutex.lock(&mtx)
```
```c3
fn void? NativeTimedMutex.lock_timeout(&mtx, ulong ms)
```
```c3
fn bool NativeTimedMutex.try_lock(&mtx)
```
```c3
fn void? NativeTimedMutex.unlock(&mtx)
```
```c3
fn void? NativeConditionVariable.init(&cond)
```
```c3
fn void? NativeConditionVariable.destroy(&cond) @maydiscard
```
```c3
fn void? NativeConditionVariable.signal(&cond)
```
```c3
fn void? NativeConditionVariable.broadcast(&cond)
```
```c3
fn void? NativeConditionVariable.wait(&cond, NativeMutex* mtx) @inline
```
```c3
fn void? NativeConditionVariable.wait_timeout(&cond, NativeMutex* mtx, ulong ms) @inline
```
```c3
fn void? NativeConditionVariable.wait_timeout_duration(&cond, NativeMutex* mtx, Duration duration) @inline
```
```c3
fn void? NativeConditionVariable.wait_until(&cond, NativeMutex* mtx, Time time) @inline
```
```c3
fn void? NativeThread.create(&thread, ThreadFn func, void* args)
```
```c3
fn void? NativeThread.detach(thread) @inline
```
```c3
fn void native_thread_exit(int result) @inline
```
```c3
fn void native_thread_yield()
```
```c3
fn void NativeOnceFlag.call_once(&flag, OnceFn func)
```
```c3
fn int? NativeThread.join(thread)
```
```c3
fn NativeThread native_thread_current()
```
```c3
fn bool NativeThread.equals(thread, NativeThread other)
```
```c3
fn void? native_sleep_nano(NanoDuration ns)
```
### `std::thread::pool{SIZE}`
```c3
struct ThreadPool
```
```c3
fn void? ThreadPool.init(&self)
```
```c3
fn void? ThreadPool.destroy(&self)
```
```c3
fn void? ThreadPool.stop_and_destroy(&self)
```
```c3
fn void? ThreadPool.push(&self, ThreadFn func, void* arg)
```
### `std::thread::threadpool @if (env::POSIX || env::WIN32)`
```c3
alias ThreadPoolFn = fn void(any[] args)
```
```c3
struct FixedThreadPool
```
```c3
fn void? FixedThreadPool.init(&self, usz threads, usz queue_size = 0)
```
```c3
fn void? FixedThreadPool.destroy(&self)
```
```c3
fn void? FixedThreadPool.stop_and_destroy(&self)
```
```c3
fn void? FixedThreadPool.push(&self, ThreadPoolFn func, args...)
```
### `std::time`
```c3
typedef Time @structlike = long
```
```c3
typedef Duration @structlike = long
```
```c3
typedef Clock @structlike = ulong
```
```c3
typedef NanoDuration (Printable) @structlike = long
```
```c3
fn Duration us(long l) @inline
```
```c3
fn Duration ms(long l) @inline
```
```c3
fn Duration sec(long l) @inline
```
```c3
fn Duration min(long l) @inline
```
```c3
fn Duration hour(long l) @inline
```
```c3
fn Duration from_float(double s) @inline
```
```c3
struct DateTime
```
```c3
struct TzDateTime
```
```c3
enum Weekday : char (String name, String abbrev)
```
```c3
enum Month : char (String name, String abbrev, int days, bool leap)
```
```c3
fn Time now()
```
```c3
fn Time Time.add_seconds(time, long seconds)
```
```c3
fn Time Time.add_minutes(time, long minutes)
```
```c3
fn Time Time.add_hours(time, long hours)
```
```c3
fn Time Time.add_days(time, long days)
```
```c3
fn Time Time.add_weeks(time, long weeks)
```
```c3
fn Time Time.add_duration(time, Duration duration) @operator_s(+) @inline
```
```c3
fn Time Time.sub_duration(time, Duration duration) @operator(-) @inline
```
```c3
fn int Time.compare_to(time, Time other)
```
```c3
fn double Time.to_seconds(time)
```
```c3
fn Duration Time.diff_us(time, Time other) @operator(-)
```
```c3
fn double Time.diff_sec(time, Time other)
```
```c3
fn double Time.diff_min(time, Time other)
```
```c3
fn double Time.diff_hour(time, Time other)
```
```c3
fn double Time.diff_days(time, Time other)
```
```c3
fn double Time.diff_weeks(time, Time other)
```
```c3
fn double NanoDuration.to_sec(nd)
```
```c3
fn long NanoDuration.to_ms(nd)
```
```c3
fn Duration NanoDuration.to_duration(nd)
```
```c3
fn NanoDuration Duration.to_nano(td)
```
```c3
fn long Duration.to_ms(td)
```
```c3
macro Duration Duration.mult(#td, long #val) @operator_s(*) @safemacro
```
```c3
fn usz? NanoDuration.to_format(&self, Formatter* formatter) @dynamic
```
### `std::time::clock`
```c3
fn Clock now()
```
```c3
fn NanoDuration Clock.mark(&self)
```
```c3
fn Clock Clock.add_nano_duration(self, NanoDuration nano) @operator_s(+) @inline
```
```c3
fn Clock Clock.sub_nano_duration(self, NanoDuration nano) @operator(-) @inline
```
```c3
fn Clock Clock.add_duration(self, Duration duration) @operator_s(+) @inline
```
```c3
fn Clock Clock.sub_duration(self, Duration duration) @operator(-) @inline
```
```c3
fn NanoDuration Clock.nano_diff(self, Clock other) @operator(-) @inline
```
```c3
fn NanoDuration Clock.to_now(self) @inline
```
### `std::time::datetime @if(env::LIBC)`
```c3
fn DateTime now()
```
```c3
fn DateTime from_date(int year, Month month = JANUARY, int day = 1, int hour = 0, int min = 0, int sec = 0, int us = 0)
```
```c3
fn TzDateTime from_date_tz(int year, Month month = JANUARY, int day = 1, int hour = 0, int min = 0, int sec = 0, int us = 0, int gmt_offset = 0)
```
```c3
fn TzDateTime DateTime.to_local(&self)
```
```c3
fn TzDateTime DateTime.with_gmt_offset(self, int gmt_offset)
```
```c3
fn TzDateTime TzDateTime.with_gmt_offset(self, int gmt_offset)
```
```c3
fn TzDateTime DateTime.to_gmt_offset(self, int gmt_offset)
```
```c3
fn TzDateTime TzDateTime.to_gmt_offset(self, int gmt_offset)
```
```c3
fn void DateTime.set_date(&self, int year, Month month = JANUARY, int day = 1, int hour = 0, int min = 0, int sec = 0, int us = 0)
```
```c3
fn void DateTime.set_time(&self, Time time)
```
```c3
fn DateTime DateTime.add_us(&self, Duration d) @operator_s(+)
```
```c3
fn DateTime DateTime.sub_us(&self, Duration d) @operator(-)
```
```c3
fn DateTime DateTime.add_seconds(&self, int seconds)
```
```c3
fn DateTime DateTime.add_minutes(&self, int minutes)
```
```c3
fn DateTime DateTime.add_hours(&self, int hours)
```
```c3
fn DateTime DateTime.add_days(&self, int days)
```
```c3
fn DateTime DateTime.add_weeks(&self, int weeks)
```
```c3
fn DateTime DateTime.add_years(&self, int years)
```
```c3
fn DateTime DateTime.add_months(&self, int months)
```
```c3
fn TzDateTime TzDateTime.add_us(&self, Duration d) @operator_s(+)
```
```c3
fn TzDateTime TzDateTime.sub_us(&self, Duration d) @operator(-)
```
```c3
fn TzDateTime TzDateTime.add_seconds(&self, int seconds)
```
```c3
fn TzDateTime TzDateTime.add_minutes(&self, int minutes)
```
```c3
fn TzDateTime TzDateTime.add_hours(&self, int hours)
```
```c3
fn TzDateTime TzDateTime.add_days(&self, int days)
```
```c3
fn TzDateTime TzDateTime.add_weeks(&self, int weeks)
```
```c3
fn TzDateTime TzDateTime.add_years(&self, int years)
```
```c3
fn TzDateTime TzDateTime.add_months(&self, int months)
```
```c3
fn DateTime from_time(Time time)
```
```c3
fn TzDateTime from_time_tz(Time time, int gmt_offset)
```
```c3
fn Time DateTime.to_time(&self) @inline
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
fn int DateTime.diff_years(&self, DateTime from)
```
```c3
fn double DateTime.diff_sec(self, DateTime from)
```
```c3
fn Duration DateTime.diff_us(self, DateTime from) @operator(-)
```
```c3
enum DateTimeFormat
```
```c3
fn String format(Allocator allocator, DateTimeFormat type, TzDateTime dt)
```
```c3
fn String tformat(DateTimeFormat dt_format, TzDateTime dt)
```
```c3
fn String TzDateTime.format(self, Allocator allocator, DateTimeFormat dt_format)
```
```c3
fn String DateTime.format(self, Allocator allocator, DateTimeFormat dt_format)
```
### `std::time::os @if(env::DARWIN)`
```c3
fn Clock native_clock()
```
### `std::time::os @if(env::POSIX)`
```c3
fn Time native_timestamp()
```
```c3
fn Clock native_clock() @if(!env::DARWIN)
```
### `std::time::os @if(env::WIN32)`
```c3
fn Clock native_clock()
```
```c3
fn Time native_timestamp()
```
