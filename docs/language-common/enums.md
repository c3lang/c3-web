---
title: Enums
description: Learn how C3 enums work
---

## Enums

Enums use the following syntax:

```c3
enum State : int
{
    WAITING,
    RUNNING,
    TERMINATED
}

// Access enum values via:
State current_state = WAITING; // or '= State.WAITING' 
```

The access requires referencing the `enum`'s name as `State.WAITING` because
an enum like `State` is a separate namespace by default, just like C++'s class `enum`.

Standard enums are always backed by an ordinal value running from zero and up, without any gaps. For enums for non-consecutive values, see [constdef](#constdef). To create enums that implement a bit-mask, you can also consider using [bitstructs](bitstructs.md#bitstructs-as-bit-masks).

### Enum associated values

It is possible to associate each enum value with one or more static values.
```c3
enum State : int (String description)
{
    WAITING    { "waiting" },
    RUNNING    { "running" },
    TERMINATED { "ended" },
}

fn void main()
{
    State process = State.RUNNING;
    io::printfn("%s", process.description);
}
```

Multiple static values can be associated with an enum value, for example:
```c3
struct Position
{
    int x;
    int y;
}

enum State : int (String desc, bool active, Position pos)
{
    WAITING    { "waiting", false, { 1, 2} },
    RUNNING    { "running", true,  {12,22} },
    TERMINATED { "ended",   false, { 0, 0} },
}

fn void main()
{
    State process = RUNNING;
    if (process.active)
    {
        io::printfn("Process is: %s", process.desc);
        io::printfn("Position x: %d", process.pos.x);
    }
}
```

### Enum type inference

When an `enum` is used where the type can be inferred, like in switch case-clauses or in variable assignment, the enum name is not required:
```c3
State process = WAITING; // State.WAITING is inferred.
switch (process)
{
    case RUNNING: // State.RUNNING is inferred
        io::printfn("Position x: %d", process.pos.x);
    default:
        io::printfn("Process is: %s", process.desc);
}

fn void test(State s) { ... }

test(RUNNING); // State.RUNNING is inferred
```

If the `enum` without its name matches with a global in the same scope, it needs the enum name to be added as a qualifier, for example:
```c3
module test;

// Global variable
// ❌ Don't do this!
const State RUNNING = State.TERMINATED;

test(RUNNING);       // Ambiguous
test(test::RUNNING); // Uses global variable.
test(State.RUNNING); // Uses enum constant.
```

### Enum to and from ordinal

You can convert an enum to its ordinal with `.ordinal`, and convert it
back with `EnumName.from_ordinal(...)`:

```c3
fn void store_enum(State s)
{
    write_int_to_file(s.ordinal);
}

fn State read_enum()
{
    return State.from_ordinal(read_int_from_file());
}
```

However, a plain cast is also valid:

```c3
fn void test(State s)
{
    int o = (int)s;
    State s2 = (State)o;
}
```


### Enum type properties 0.7.x

Enum types have the following additional properties in addition to the usual properties for
user-defined types:

1. `membersof` returns a list of member references, similar to struct's `membersof`.
2. `inner` returns the type of the ordinal as a `typeid`.
3. `lookup_field(field_name, value)` lookup an enum by associated value.
4. `names` returns a list containing the names of all enums.
5. `from_ordinal(value)` convert an integer to an enum.
6. `values` return a list containing all the enum values of an enum.
7. `len` return the number of enum values.

### Enum type properties 0.8.0+

Enum types have the following additional properties in addition to the usual properties for
user-defined types:

1. `members` returns a list of member references, similar to struct's `members`.
2. `inner` returns the type of the ordinal as a `typeid`.
3. `lookup_field(field_name, value)` lookup an enum by associated value.
4. `names` returns a list containing the names of all enums.
5. `from_ordinal(value)` convert an integer to an enum.
6. `values` return a list containing all the enum values of an enum.

## Constdef

When interfacing with C code, you may encounter enums that are not sequential. For situations like this, you can use a constdef in C3:

```c3
extern fn KeyCode get_key_code();

constdef KeyCode
{
    UNKNOWN   = 0,
    RETURN    = 13,
    ESCAPE    = 27,
    BACKSPACE = 8,
    TAB       = 9,
    SPACE     = 32,
    EXCLAIM, // automatically incremented to 33
    QUOTEDBL,
    HASH,
}

fn void main()
{
    int a = (int)KeyCode.SPACE; // assigns 32 to a
    // constdef behave like typedef and will not enforce 
    // that every value has been declared beforehand
    KeyCode b = (KeyCode)2; 
    // can safely interact with a C function that returns the same enum
    KeyCode key = get_key_code();
    // Use as cast to convert from the underlying type. 
    KeyCode conv = (KeyCode)a; 
}
```

### Inline constdef and @constinit

If you need a `constdef` to be converted to its assigned value without using a cast, `inline` can be used:
```c3
constdef ConstInline : inline String
{
    A = "Hello",
    B = "World",
}

fn void main()
{
    // implicitly converted to string due to inline
    String a = ConstInline.A; 
    ConstInline b = B;
    String b_str = b;

    io::printfn("%s, %s!", a, b_str); // Prints "Hello, World!"
}
```

We can use `@constinit` to allow the constdef to implicitly convert from a literal:
```c3
constdef ConstInline2 : String @constinit
{
    A = "Hello",
    B = "World",
}

fn void main()
{
    ConstInline2 a = "Bye";
}
```

These conversion rules are the same as for `typedef`.