---
title: Structs and unions
description: Learn how C3 structs and unions work
---

## Structs

Structs are always named:

```c3
struct Person
{
    char age;
    String name;
}
```

A struct's members may be accessed using dot notation, even for pointers to structs.

```c3
fn void test()
{
    Person p;
    p.age = 21;
    p.name = "John Doe";

    io::printfn("%s is %d years old.", p.name, p.age);

    Person* p_ptr = &p;
    p_ptr.age = 20; // Ok!

    io::printfn("%s is %d years old.", p_ptr.name, p_ptr.age);
}
```
(One might wonder whether it's possible to take a `Person**` and use dot access. – It's not allowed, only one level of dereference is done.)

To change alignment and packing, [attributes](../language-common/attributes.md) such as `@packed` may be used.

### Initializing structs

Structs are typically initialized with an initializer list, which is a list of arguments inside of `{ }`. For example, we can initialize our `Person` struct above like this:

```c3
Person p = { 21, "John Doe" };
```

But we can also use so-called designated initialization, where the explicit names of the members are assigned to, with a leading `.`:

```c3
Person p = { .age = 21, .name = "John Doe" };
```

With designated initializers we do not need to initialize all fields. The rest of the fields will automatically be zeroed out:

```c3
Person p = { .name = "John Doe" }; // p.age is 0
```

If a type contains members which in turn are structs or unions or arrays, then their members may be initialized using repeated `.name` syntax:

```c3
struct Test
{
    Person owner;
    Person subscriber;
}

Test t = { .owner = { 21, "John Doe" }, .subscriber.age = 42, .subscriber.name = "Test Person" };
```

#### Struct initializer splatting

It's possible to use the `...` operator together with designated initializers to provide defaults that are overwritten by later assignments:

```c3
Person p = { 21, "John Doe" };
Person p_new = { ...p, .age = 22 };  // Same as { 22, "John Doe" }
```

### Struct subtyping

C3 allows creating struct subtypes using `inline`:

```c3
struct ImportantPerson
{
    inline Person person;
    String title;
}

fn void print_person(Person p)
{
    io::printfn("%s is %d years old.", p.name, p.age);
}


fn void test()
{
    ImportantPerson important_person;
    important_person.age = 25;
    important_person.name = "Jane Doe";
    important_person.title = "Rockstar";

    // Only the first part of the struct is copied.
    print_person(important_person);
}
```

## Union types

Union types are defined just like structs and are fully compatible with C.

```c3
union Integral
{
    char as_byte;
    short as_short;
    int as_int;
    long as_long;
}
```

As usual, unions are used to hold one of many possible values:

```c3
fn void test()
{
    Integral i;
    i.as_byte = 40; // Setting the active member to as_byte

    i.as_int = 500; // Changing the active member to as_int

    // Undefined behaviour: as_byte is not the active member,
    // so this will probably print garbage.
    io::printfn("%d\n", i.as_byte);
}
```

Note that unions only take up as much space as their largest member, so `Integral::size` is equivalent to `long::size`.


## Nested sub-structs / unions

Just like in C99 and later, nested anonymous sub-structs / unions are allowed. Note that
the placement of struct / union names is different to match the difference in declaration.

```c3
struct Person
{
    char age;
    String name;
    union
    {
        int employee_nr;
        uint other_nr;
    }
    union subname
    {
        bool b;
        Callback cb;
    }
}
```

## Union and structs type properties

Structs and unions also support the `members` property, which returns a list of struct/union members.

