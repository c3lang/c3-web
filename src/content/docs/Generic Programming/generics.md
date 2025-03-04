---
title: Generics
description: Generics
sidebar:
    order: 82
---

Generic modules are parameterized modules that allow functionality for arbitrary types.

For generic modules, the generic parameters follows the module name:



```c3
// TypeA, TypeB, TypeC are generic parameters.
module vector(<TypeA, TypeB, TypeC>);
```

It is also possible to parameterize by an `int` or `bool` constant, for example:
```c3
// module custom_type(<Type, VALUE>)  
module custom_type(<float, 3>);
```


Code inside a generic module may use the generic parameters as if they were well-defined symbols:

```c3
module foo_test(<Type1, Type2>);

struct Foo 
{
   Type1 a;
}

fn Type2 test(Type2 b, Foo* foo) 
{
   return foo.a + b;
}
```

Including a generic module works as usual:

```c3
import foo_test;

def FooFloat = Foo(<float, double>);
def test_float = foo_test::test(<float, double>);

...

FooFloat f;
Foo(<int, double>) g;

...

test_float(1.0, &f);
foo_test::test(<int, double>)(1.0, &g);
```

Just like for macros, optional constraints may be added to improve compile errors:

```c3
<*
 @require $assignable(1, TypeB) && $assignable(1, TypeC)
 @require $assignable((TypeB)1, TypeA) && $assignable((TypeC)1, TypeA)
*> 
module vector(<TypeA, TypeB, TypeC>);

/* .. code  .. */
```

```c3
def testFunction = vector::testFunc(<Bar, float, int>);

// This would give the error 
// --> Parameter(s) failed validation: 
//     @require "$assignable((TypeB)1, TypeA) && $assignable((TypeC)1, TypeA)" violated.
```

