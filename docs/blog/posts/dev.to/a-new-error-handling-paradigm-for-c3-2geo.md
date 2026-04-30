---
title: "A new error handling paradigm for C3"
date: 2020-06-14
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/a-new-error-handling-paradigm-for-c3-2geo](https://dev.to/lerno/a-new-error-handling-paradigm-for-c3-2geo)*

The [C3](http://www.c3-lang.org) programming language is getting increasingly more complete (try it out [here](https://ide.judge0.com/?YOhO)!), it's a language very close to C similar to the C2 language.

#### The current state of C3

C3 of today has an error system inspired by Midori and Herb Sutter's C++ error proposal. It has lots of similarities with Zig's errors as well.

Here is an example from the documentation:

    error RandomError {
      NORMAL,
      EXCEPTIONAL
    }

    func int mayThrowError() throws RandomError {
      if (rand() > 0.5) throw RandomError.NORMAL;
      if (rand() > 0.99) throw RandomError.EXCEPTIONAL;
      return 1;
    }

    func void testMayError() throws
    {
      // all throwable sites must be annotated with "try"
      try mayThrowError(); 
    }

    func void testWithoutError() {
      try testMayError();
    
      // Catching will catch any try above in the scope.
      catch (error e) {
        case RandomError.NORMAL:
          io.printf("Normal Error\n");
        case RandomError.EXCEPTIONAL:
          io.printf("You win!\n");
        default:
          io.printf("What is this error you're talking about?\n");                 
      }
    }

This might at first glance look like exceptions, but it is value based and a function like:

    func int getFoo() throws RetrieveError;

Corresponds to the C code:

    RetrieveError getFoo(int *result);

So throws are really return values.

#### Why isn't this sufficient?

Compared to exceptions I find this pretty good. Places where errors occur are clearly marked and we're using value based return values under the sheets.

However, the flow here is clearly exception-style. Personally I like the explicit control given by C return values. However, they are not always convenient. For a function in C you usually end up with one of four cases:

1. No errors returned, just return the result.
2. It may fail, so return boolean, result as "out" parameter. Maybe use errno or similar to get details.
3. It may fail in many ways, so return the error code, result as an "out" parameter.
4. It may fail in many ways, return the result (usually a pointer), the error is an out parameter and will be set if it fails.

These are typically only simple in the case that no result is needed.

Go improves on this by using tuple returns, which folds 2-4 into a single case. However there's another problem – that of having multiple calls which would throw errors. In C it might end up looking like this:

    if (doSomething() != OK) goto ERR;
    if (doSomethingElse() != OK) goto ERR;
    cannotFailProc();
    if (blah() != OK) goto ERR;
    return true;
    ERR:
    ... error handling ...
    return false;

This contrasts with exception style code which can be much easier to read:

    try
    {
      doSomething();
      doSomethingElse();
      cannotFailProc();
      blah();
      return true;
    }
    catch
    {
       ... error handling ...
    }

Go has tried to make some efforts to improve the rather infamous cascade of `if (err != nil) { ... }` code but hasn't really made any major progress.

Designing a new language this has frustrated me: exceptions are known to have issues, but so do "return values".

There's also the idea to use sum types, e.g. `Result<MyResult, Error>` and pass them around. Swift was even built with optionals where "no value" meant an error... but that was so unergonomic that they later introduced an exception style error handling very similar to what C3 currently provides.

Using `Result` would usually mean using things like `getMaybeThrowingInt().flatMap(i => get(i)).flatMap(val => val.openFile)` where each invocation only conditionally happens if the result is a non-error.

However, this `Result` based would often look rather different from the normal "error free" code. So that looked like a dead end as well.

#### Frustrations and an idea

Trying out the error handling in C3 I was frustrated with how ugly simple functions would look in the case they had a single error.

Consider the simple task of looking up the index of an item in an array and using it.

    error SearchError {
      ELEMENT_NOT_FOUND;
    }
    func int indexOfFoo(Foo[] f, int i) throws SearchError
    { .... }

    func void test(Foo[] f)
    {
      int i = try indexOfFoo(f, 1);
      printf("Name1: %s", f[i].name);
      catch (SearchError e)
      { 
        printf("Name1 could not be found\n");
      }
    }

Using an error here like this feels all wrong. (Java infamously returns -1 rather than using an exception on this sort of code).

Some Go style tuple return would probably have given us:

    func void test(Foo[] f)
    {
      int i, bool success = indexOfFoo(f, 1);
      if (!success)
      {
        printf("Name1 could not be found\n");
        return;
      }    
      printf("Name1: %s", f[i].name);
    }

And this feels more reasonable. Not because of the code size, but because it feels weird to introduce jumps in the code just to handle the fact that there is the possibility of a special "not found" index.

So what do I really want? The Go version translates everything to *values* rather than implicit jumps. This is similar to how `Result` works. Maybe there is a way?

What if we introduce a built in sum type: "a type + error". For example `int!` would be the same as `Result<int, Error>` in languages using `Result`.

If we rewrite our code:

    error ElementNotFoundError;

    func int! indexOfFoo(Foo[] f, int i)
    { .... }

    func void test(Foo[] f)
    {
      int! i = indexOfFoo(f, 1);
      guard (i) // Only called on i is error
      {
        printf("Name1 could not be found\n");
        return;
      }
      // i implicitly becomes "int" due to the guard.
      printf("Name1: %s", f[i].name);
    }

We can do more with this though! If we define that a statement relying on a "Result" also becomes a "Result" we get this:

    func void test(Foo[] f)
    {
      int! i = indexOfFoo(f, 1);
      Foo! foo = f[i];
      printf("Name1: %s", foo.name);
    }

In a "Result" based language that would translate to something like:

    Result<int, Error> i = indexOfFoo(f, 1);
    Result<Foo, error> foo = i.flatMap(i => f[i]);
    Result<void, error> res = foo.flatMap(foo => 
      printf("Name1: %s", foo.name)
    );

Let's look at another example. Here is a sample C# program to illustrate it's exceptions:

    static void Main(string[] args)
    {
      int index;
      int value = 100;
      int[] arr = new int[10];
      try
      {
        Console.Write("Enter a number: ");
        index = Convert.ToInt32(Console.ReadLine());
        arr[index] = value;
      }
      catch (FormatException e)
      {
        Console.Write("Bad Format ");
      }
      catch (IndexOutOfRangeException e)
      {
        Console.Write("Index out of bounds ");
      }
      Console.Write("Remaining program ");
    }

C3 has no out of bounds error, but we can make a method for it:

    error IndexOutOfBoundsError;

    func void! int[].set(int[]* array, int index, int value)
    {
      if (index < 0 || index >= array.size) return! IndexOutOfBoundsError;
      array[index] = value;
    }

Let's assume `atoi` returns a `ConversionError`

    func void main()
    {
      int index;
      int value = 100;
      int[100] arr;
      console::write("Enter a number: ");
      int! index = atoi(readLine());
      guard (arr.set(index, value))
      {
        case ConversionError:
          printf("This is not a number %s\n", error.string);
        case EofError:
          printf("Input closed.\n");
        case IndexOutOfBoundsError:
          printf("Index out of bounds.\n");
        default:
          printf("Unknown error.\n");
      }
      printf("Remaining program\n");
    }

If we just want to ignore all errors:

    func void main()
    {
      int index;
      int value = 100;
      int[100] arr;
      console::write("Enter a number: ");
      int! index = atoi(readLine());
      arr.set(index, value);
      printf("Remaining program\n");
    }

If we want to be explicit about following the happy case with nesting, here's a variant:

    func void main()
    {
      int index;
      int value = 100;
      int[100] arr;
      console::write("Enter a number: ");
      int! index = atoi(readLine());
      if (index) {
        printf("Thx for the number\n");
        // Index is now int.
        // catch (index) - Invalid
        if (arr.set(index, value)) {
            printf("All worked fine!\n")
        }
      }
    }

#### Some unresolved questions

In the text above I use `guard` to "get" the error from the "Result". Other variants could be to use `catch` or `iferr` as a keyword. Maybe even use unrolling with `!`, e.g. `if (i!)`.

Similarly the conditional extraction in the `if` might have issues. If we have `Foo*! f` then `if (f)` might assume that `f` is also not null, where the correct check would be `if (f && f)`(!).

Shortcuts for defaults on error are needed. Some possibilities:

    int i = atoi(readLine()) ?: 0
    int i = atoi(readLine()) else 0;
    int i = atoi(readLine()) !! 0;
    int i = atoi(readLing()) || 0;

And for rethrows:

    int i = atoi(readLine())!;
    int i = atoi(readLine()) else return!;
    int i = atoi(readLine())!!;
    int i = try atoi(readLine());

I use `return!` for returning errors. Again, it could use `raise` `throw` or `exit` instead. Or an exclamation mark after the error, e.g. `return SomeError!`.

While there is a lot of things left to figure out I at least feel like there is a real alternative here that might be a candidate to replace the current error handling in C3.