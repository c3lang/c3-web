---
title: Generics
description: Generics
sidebar:
    order: 82
---

**NOTE** This section is updated for 0.7.9 and later. If you use a method before 0.7.9, use generic modules instead, which offers the same functionality but less granularity.

Generics allow you to create code that works with arbitrary types.

```c3
// If the module section is generic,
// then all its declarations are as well
// Note that previous to 0.7.9, this would be written "module my_module {Type};"
module my_module <Type>;

// Parameterized struct
struct MyStruct
{
    Type a, b;
}

// Parameterized function
fn Type square(Type t)
{
    return t * t;
}
```

We can rewrite this with individual generic declarations (note that this is not available before 0.7.9):

```c3
module my_module;

struct MyStruct <Type>
{
    Type a, b;
}

fn Type square(Type t) <Type>
{
    return t * t;
}
```

### Parameter types

Generic parameters may be types or int, bool and enum constants. In the case of types, they are written as if it was a regular type alias, e.g `Type`. Constant parameters are written as if they were constant aliases, e.g. `MY_CONST`, `COUNT` etc.

```c3
// TypeA, TypeB, TypeC are generic parameters.
module vector <TypeA, TypeB, TypeC>;
```

An example parameterized by a constant as well as a type:
```c3
module custom_type <Type, VALUE>;

struct Example
{
    Type[VALUE] arr;
}
```

### Using generic parameters

The code in a generic declaration uses the parameters as if they were types / constant aliases in the scope:

```c3
module foo_test <Type1, MY_CONST>;

struct Foo
{
   Type1 a;
}

fn Type2 test(Type2 b, Foo* foo)
{
   return foo.a + b + MY_CONST;
}
```

### Using generics

To use a generic function or type, we can either define an alias for it, or invoke it directly with its parameters:

```c3
import foo_test;

alias FooFloat = Foo {float, double};
alias test_float = foo_test::test {float, double};

...

FooFloat f;
Foo{int, double} g;

...

test_float(1.0, &f);
foo_test::test{int, double} (1.0, &g);
```

### Generics are grouped

All generics that are defined in the same parameterized module section are instantiated together, but so are any other generics in the same module that has identical parameters:

```c3
module abc <Test>;
// Belongs to generic 1
fn Test test1(Test a)
{
    return a + 1;
}

module efg;

// Belongs to generic 1
struct Foo <Test>
{
    Test a;
}

// Belongs to generic 1
fn Foo test2(Test b) <Test>
{
    return (Foo) { .a = b };
}

// Different parameter name, defines a new generic 2
fn Test2 test3(Test2 a) <Test2>
{
    return a * a;
}

fn void main()
{
    // This will instantiate Foo, test2 and test1, 
    // but not test3
    Foo{int} a;
}
```

### Generic contracts

Just like for macros, optional constraints may be added to improve compile errors:

```c3
<*
 @require $assignable(1, TypeB) && $assignable(1, TypeC)
 @require $assignable((TypeB)1, TypeA) && $assignable((TypeC)1, TypeA)
*>
module vector <TypeA, TypeB, TypeC>;

/* .. code  .. */
```

```c3
alias test_function = vector::test_func {Bar, float, int};

// This would give the error
// --> Parameter(s) failed validation:
//     @require "$assignable((TypeB)1, TypeA) && $assignable((TypeC)1, TypeA)" violated.
```

In general, contracts placed on types and identifiers will combine. However, contracts on generic functions and macros do not carry over to the aggregated generic contract:

```c3
module foo;

<* @require Test.kindof == INTEGER *>
struct Foo <Test>
{
    Test a;
}

<* @require Test.sizeof < 4 *>
fn Test testme(Test t) <Test>
{
    return t * 2;
}

fn void main()
{
    // This would trigger the generic contract, placed on Foo:
    // testme{float}(2.0f);
    // However this is fine, since
    // the function contract is not checked unless invoked:
    Foo{long} x;
}
```

### Methods on generic types

Adding methods to a generic type extends it with the method for all generic, allowing the use of the generic parameters associated with creating the type:

```c3
module foo;

struct Foo <Type>
{
    Type a;
}

module bar;
import foo, std::io;

fn Type Foo.add(self, Type b) => self.a + b;

fn void main()
{
    Foo{int} f1 = { 3 };
    Foo{double} f2 = { 3.4 };
    io::printn(f1.add(5));
    io::printn(f2.add(5));
}
```

We can also extend a particular instance, but in that case we do not access the parameterization.

```c3
module foo;
struct Foo <Type> { Type a; }

module bar;
import foo, std::io;

fn int Foo{int}.add(self, int b) => self.a + b;

// The below code would print "Error: 'Type' could not be found, did you spell it right?"
// fn Type Foo{int}.sub(self, Type b) => self.a - b; 

fn void main()
{
    Foo{int} f1 = { 3 };
    Foo{double} f2 = { 3.4 };
    io::printn(f1.add(5));
    // io::printn(f2.add(5)); ERROR - There is no field or method 'Foo{double}.add'
}
```
