---
title: Debugging
description: Tools and techniques for debugging C3 applications.
sidebar:
    order: 233
---

C3 provides several powerful features and compiler flags to help identify memory corruption, logic errors, and performance bottlenecks.

## Virtual Memory Temp Allocator (VMEM_TEMP)

The temporary allocator (`tmem`) is extremely fast but can lead to "use-after-scope" bugs if pointers to temporary data are stored in globals or long-lived structs.

To debug these issues, you can enable the Virtual Memory tracking mode by passing the `-D VMEM_TEMP` flag to the compiler (or adding `"VMEM_TEMP"` to your `project.json` features).

### How it works:
When `VMEM_TEMP` is enabled:
1.  **Hardware Protection**: The allocator uses the OS virtual memory system (MMU) to manage pages.
2.  **Instant Crash**: When a `@pool` or test scope ends, the memory pages are removed or marked as protected. Any attempt to access "dead" temporary data will cause an immediate **Segfault**.
3.  **Large Address Space**: It reserves a wide virtual address range (typically 4GB) to ensure allocations don't overlap, making corruption much easier to catch.

:::tip
If your program is crashing with a Segfault only when `-D VMEM_TEMP` is enabled, look for pointers pointing into `tmem` that are being accessed after the `@pool` that created them has closed.
:::

## Backtraces

In **Safe Mode** (default), C3 automatically generates detailed backtraces when a panic or crash occurs.

### Manual Backtraces:
You can capture a backtrace at any time as a string:
```c3
import std::os::backtrace;

fn void log_stack() {
    String bt = backtrace::get(tmem)!;
    io::eprint(bt);
}
```

## Sanitizers

C3 supports integration with LLVM's Address Sanitizer (ASAN) and Thread Sanitizer (TSAN).

### Address Sanitizer (ASAN)
To enable ASAN, compile with:
```bash
c3c compile --sanitize=address my_project.c3
```
ASAN will detect:
- Out-of-bounds access to heap, stack, and globals.
- Use-after-free bugs.
- Memory leaks.

### Thread Sanitizer (TSAN)
For multi-threaded applications, TSAN helps find data races:
```bash
c3c compile --sanitize=thread my_project.c3
```

## Tracking Allocator

The `TrackingAllocator` is a wrapper that can be placed around any other allocator to detect memory leaks and capture backtraces for every allocation.

```c3
fn void main() {
    TrackingAllocator tracker;
    tracker.init(mem); // Wrap the default 'mem' allocator
    defer tracker.free();

    Allocator a = &tracker;

    // Use 'allocator::new' to pass a specific allocator:
    int* p = allocator::new(a, int);

    // If not freed, tracker.print_report() will show any leaks.
    tracker.print_report();
}
```

### Allocation Tracking Macros
For convenience, C3 provides macros to automatically wrap a block of code with a tracking allocator.

#### `@report_heap_allocs_in_scope`
This macro runs the enclosed code and automatically prints a full memory report at the end of the scope.

```c3
fn void main() {
    @report_heap_allocs_in_scope()
    {
        void* p = mem::malloc(100);
        // ...
    };
}
```

#### `@assert_leak`
Similar to the report macro, but instead of just printing, it will **assert** that no memory has leaked. If leaks are found, it triggers a panic with a report.

:::note
This macro only performs tracking and assertions if debug symbols are enabled or the `-D MEMORY_ASSERTS` feature flag is used. Otherwise, it executes the code block normally with no overhead.
:::

```c3
fn void main() {
    @assert_leak()
    {
        // code that should not leak
        void* p = mem::malloc(64);
        mem::free(p);
    };
}
```

## Testing Macros

C3 includes a built-in testing framework in `std::core::test`. These macros provide descriptive failure messages, stringifying the expressions being tested.

```c3
fn void test_math() @test {
    int x = 10;
    int y = 20;
    test::eq(x + y, 40);
    // Test failed ^^^ ( example.c3:4 ) `30` != `40`
}
```

## Assertions and Unreachable

### `assert`
Used for runtime checks that should always be true.

- **Safe Mode**: triggers a panic with backtrace if the condition fails
- **Unchecked Mode**: is assumed to always be `true`, generating an LLVM `unreachable` instruction, becoming an **optimization hint** telling the compiler this path is impossible.

```c3
assert(divisor != 0, "Cannot divide by zero!");
```

:::note
Use `@assert_always` as drop-in replacement if the assertion should also happen in **Unchecked Mode**
:::

### `unreachable`
Marks a code path that logically should never be hit.

- **Safe Mode**: Triggers a panic with the provided message and a backtrace.
- **Unchecked Mode**: Generates an LLVM `unreachable` instruction. This is an **optimization hint** telling the compiler this path is impossible. If the path is actually reached, the program will have **undefined behavior** (which often manifests as a crash or very strange execution state).

```c3
switch (state) {
    case START: // ...
    case END:   // ...
    default: unreachable("Invalid state encountered");
}
```

## Contracts
C3 supports [Contracts](/language-common/contracts/) using the `@require` and `@ensure` attributes. These are checked in **Safe Mode**.

- **`@require`**: Pre-conditions that must be true when the function is called.
- **`@ensure`**: Post-conditions that must be true when the function returns.

```c3
<*
 @require b != 0 : "Divisor must not be zero"
 @ensure return == a / b
*>
fn float divide(float a, float b)
{
    return a / b;
}
```

If a contract is violated in safe mode, the program panics with a descriptive message and a backtrace.

## Safe vs. Unchecked Mode

Understanding the difference between modes is crucial for debugging:

| Feature | Safe Mode (-O0, -O1) | Unchecked Mode (-O2+) |
| :--- | :--- | :--- |
| **Bounds Checking** | Enabled | Disabled |
| **Null Checks** | Enabled | Disabled |
| **Contracts** | Evaluated | Ignored |
| **Backtraces** | Generated | Optional/None |
| **Zero-Init** | Guaranteed | Guaranteed |

Always perform your primary development and testing in **Safe Mode**. Switch to Unchecked Mode only for final releases or performance profiling once the logic is verified.
