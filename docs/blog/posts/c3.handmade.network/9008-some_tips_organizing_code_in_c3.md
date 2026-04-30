---
title: "Some tips organizing code in C3"
date: 2025-03-27
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/9008-some_tips_organizing_code_in_c3](https://c3.handmade.network/blog/p/9008-some_tips_organizing_code_in_c3)*

I occasionally get requests for aliasing modules in C3, so something like `import foo::mylongname = ml;`. Often the
use case is to get a shorter prefix for their types, as they're doing `foo::mylongname::MyType` everywhere.

This is a fundamental misunderstanding of how you are supposed to organize code in C3.

## The reason for mandatory module prefixing of functions and globals

In C, we typically have some name spacing scheme in place. For example one might have `settings_parse_options(...)`
`settings_print_help(...)`, `settings_apply_options(...)` and so on.

What C3 tries to do is to formalize this informal style using the *last* component of the module path:

```
import app::settings;

fn void something(String[] args)
{
    SettingOptions? options = settings::parse_options(args);
    if (catch options)
    {
        settings::print_help();
        os::exit(1);
    }
    ...
}
```

## How to pick a good module name

This scheme puts a lot of responsibility on the author of the module to pick a submodule name that actually is succinct
and nice enough to use repeatedly. The submodule is not just for *organizing* code, but to be part of the identifier.

In a language where imports are typically aliased, the submodule name is fairly insignificant, but in C3 it should
give you all the necessary context without being overly verbose. This is also why the C3 standard library generally
goes for shorter names and the occasional abbreviation.

So to repeat: *it is bad practice* in C3 to use long submodule names. However, the *top* module should ensure that
the name is unique.

```
module com.foo.mylib.io;
       ------------- --
       ^ unique part  ^ prefix to keep succinct
```

## Good type names

Type names does not require a prefix, because they are intended to keep the initial prefix as part of the name, e.g.
`SettingOptions`, `HttpContext`, `IntList` etc. It is *bad practice* to add the submodule. So `settings::Options` and
`http::Context` are both *bad* in the context of C3.

So a good C3 type name should be clearly distinguishable all others. So no `http::Context` vs `parsing::Context` and so on,
it's just bad practice. And again this violates how you'd typically write it in C: `http::Context` is
`http_Context`, which few will use.

## Organizing your own code

In C3, prefer making modules as big as possible inside of your app. There is no intrinsic gain in creating
module hierarchies. You can use submodules to delineate subsystems in your app, but that should be done as need arises,
not up front.

This is also why types should be unique: if you rely on submodule names to disambiguate them, then you're forced
to create submodules you do not need.

## Summary

Coming from other languages with other conventions, it's natural to not find best practices in a new language, but try to stick with these rules and you'll probably feel a lot less need for module name aliasing.

Let's summarize the above in a few do/don'ts

#### Don't

Create module names that people will want to alias:

```
module com::mysite::thecanvasrenderinglib;

fn Canvas? create_a_new_rendering_canvas()
{ ... }

module foo;
import com::mysite::thecanvasrenderinglib;

fn void test()
{
    Canvas? c = thecanvasrenderinglib::create_a_new_rendering_canvas();
    ...
}
```

#### Do

Create submodule names that are succinct and work with the function name:

```
module com::mysite::thecanvasrenderinglib::canvas;

fn Canvas? create_new_for_rendering()
{ ... }

module foo;
import com::mysite::thecanvasrenderinglib;

fn void test()
{
    Canvas? c = canvas::create_new_for_rendering();
    ...
}
```

#### Don't

Use type names that are ambiguous:

```
module abc::http;

struct Context { ... }

module abc::file;

struct Context { ... }

module foo;
import abc;

fn void main()
{
  http::Context hc = http::get_context();
  file::Context fc = hc.get_file_context();  
  ...
}
```

#### Do

Use type names that are distinct and clear what they're used for:

```
module abc::http;

struct HttpContext { ... }

module abc::file;

struct FileContext { ... }

module foo;
import abc;

fn void main()
{
  HttpContext hc = http::get_context();
  FileContext fc = hc.get_file_context();  
  ...
}
```

#### Don't

Add unnecessary module paths.

```
import std::io;

fn void main()
{
    std::io::File f = std::io::file::open("foo.txt", "rb");
    char[]? data = std::io::read_fully(mem, &f);
    ...
}
```

#### Do

Use as short module paths as permitted:

```
import std::io;

fn void main()
{
    File f = file::open("foo.txt", "rb");
    char[]? data = io::read_fully(mem, &f);
    ...
}
```

And that's it. Happy coding!

## Comments


---
### Comment by Christoffer Lernö

I occasionally get requests for aliasing modules in C3, so something like `import foo::mylongname = ml;`. Often the
use case is to get a shorter prefix for their types, as they're doing `foo::mylongname::MyType` everywhere.

This is a fundamental misunderstanding of how you are supposed to organize code in C3.

## The reason for mandatory module prefixing of functions and globals

In C, we typically have some name spacing scheme in place. For example one might have `settings_parse_options(...)`
`settings_print_help(...)`, `settings_apply_options(...)` and so on.

What C3 tries to do is to formalize this informal style using the *last* component of the module path:

```
import app::settings;

fn void something(String[] args)
{
    SettingOptions? options = settings::parse_options(args);
    if (catch options)
    {
        settings::print_help();
        os::exit(1);
    }
    ...
}
```

## How to pick a good module name

This scheme puts a lot of responsibility on the author of the module to pick a submodule name that actually is succinct
and nice enough to use repeatedly. The submodule is not just for *organizing* code, but to be part of the identifier.

In a language where imports are typically aliased, the submodule name is fairly insignificant, but in C3 it should
give you all the necessary context without being overly verbose. This is also why the C3 standard library generally
goes for shorter names and the occasional abbreviation.

So to repeat: *it is bad practice* in C3 to use long submodule names. However, the *top* module should ensure that
the name is unique.

```
module com.foo.mylib.io;
       ------------- --
       ^ unique part  ^ prefix to keep succinct
```

## Good type names

Type names does not require a prefix, because they are intended to keep the initial prefix as part of the name, e.g.
`SettingOptions`, `HttpContext`, `IntList` etc. It is *bad practice* to add the submodule. So `settings::Options` and
`http::Context` are both *bad* in the context of C3.

So a good C3 type name should be clearly distinguishable all others. So no `http::Context` vs `parsing::Context` and so on,
it's just bad practice. And again this violates how you'd typically write it in C: `http::Context` is
`http_Context`, which few will use.

## Organizing your own code

In C3, prefer making modules as big as possible inside of your app. There is no intrinsic gain in creating
module hierarchies. You can use submodules to delineate subsystems in your app, but that should be done as need arises,
not up front.

This is also why types should be unique: if you rely on submodule names to disambiguate them, then you're forced
to create submodules you do not need.

## Summary

Coming from other languages with other conventions, it's natural to not find best practices in a new language, but try to stick with these rules and you'll probably feel a lot less need for module name aliasing.

Let's summarize the above in a few do/don'ts

#### Don't

Create module names that people will want to alias:

```
module com::mysite::thecanvasrenderinglib;

fn Canvas? create_a_new_rendering_canvas()
{ ... }

module foo;
import com::mysite::thecanvasrenderinglib;

fn void test()
{
    Canvas? c = thecanvasrenderinglib::create_a_new_rendering_canvas();
    ...
}
```

#### Do

Create submodule names that are succinct and work with the function name:

```
module com::mysite::thecanvasrenderinglib::canvas;

fn Canvas? create_new_for_rendering()
{ ... }

module foo;
import com::mysite::thecanvasrenderinglib;

fn void test()
{
    Canvas? c = canvas::create_new_for_rendering();
    ...
}
```

#### Don't

Use type names that are ambiguous:

```
module abc::http;

struct Context { ... }

module abc::file;

struct Context { ... }

module foo;
import abc;

fn void main()
{
  http::Context hc = http::get_context();
  file::Context fc = hc.get_file_context();  
  ...
}
```

#### Do

Use type names that are distinct and clear what they're used for:

```
module abc::http;

struct HttpContext { ... }

module abc::file;

struct FileContext { ... }

module foo;
import abc;

fn void main()
{
  HttpContext hc = http::get_context();
  FileContext fc = hc.get_file_context();  
  ...
}
```

#### Don't

Add unnecessary module paths.

```
import std::io;

fn void main()
{
    std::io::File f = std::io::file::open("foo.txt", "rb");
    char[]? data = std::io::read_fully(mem, &f);
    ...
}
```

#### Do

Use as short module paths as permitted:

```
import std::io;

fn void main()
{
    File f = file::open("foo.txt", "rb");
    char[]? data = io::read_fully(mem, &f);
    ...
}
```

And that's it. Happy coding!