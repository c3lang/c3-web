---
title: "Your users will do what you make easy"
date: 2021-11-07
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://c3.handmade.network/blog/p/8208-your_users_will_do_what_you_make_easy](https://c3.handmade.network/blog/p/8208-your_users_will_do_what_you_make_easy)*

Recently was thinking about Java and reflection and how it actually ended up causing the proliferation of "enterprise-y frameworks" written in the language.

#### Java reflection & serialization

Java early on had built-in serialization. It was very generic but could serialize basically anything in the object graph. The output was also very verbose.

This functionality sort of set the bar for what was to come. So when there came more libraries that wanted to serialize and deserialize with Java, then everyone said "oh, yeah this is cool, it's better than what's built in!".

And then someone said "hey, now that we have this easy serialization and deserialization - guess what, we can do it from config files, that way we get more flexibility!" – And people were at this point already accepting that they were serializing and deserializing from some generic format that wasn't really tailored for their code. So what could go wrong with a generic configuration that wasn't tailored for their code?

Next you got the proliferation of configs everywhere, where you have to mess around with config files in Java because no one builds APIs to actually programmatically configure things.

– And this just comes from the easy accessibility of reflection and serialization in early Java.

Contrast this to C, where you don't have all those tools and have to build your config readers by hand. – So you'll again start shopping for libraries, but since there is no vertically integrated stack that does everything from reading your config to assembling your objects, odds are that you'll at least limit yourself to what you need. Heck, you might even build it yourself.

#### The tragedy of Objective-C

A similar thing occurred with ObjC in the iPhone gold rush. A lot of Java/C++ programmers arrived to the platform, and in Java/C++, OO is usually objects all the way down. – Because hey there's no problem doing that and in fact that's how things are built with OO in those languages: just split things into increasingly finer grained classes and objects.

ObjC was intended to be used in a different way though. ObjC OO is C with an OO layer for interop. You're supposed to write 95+% C with ObjC as the high level "script-like" glue, you don't have to be afraid of C structs or enums.

Also, writing ObjC classes takes more time than doing the same with Java/C++, and again that wasn't a problem because you weren't supposed to use ObjC classes in the same way.

So then all the C++/Java folks showed up and boy did they moan about how hard ObjC was to use... well because they tried to use 5% C and 95% OO. The result was both slow to write and slow to execute. Basically they were trying to write Java in Objective–C.

Now what did Apple do?

1. Automated refcounting - don't let the poor Java developers think about memory management of their gazillion objects, where before (in canonical ObjC projects) memory management had been a very small concern (objects were rarely allocated/deallocated as they were large scale structures in sane ObjC programs) this became a huge problem with Java style OO.
2. Properties - if you use ObjC classes instead of normal C structs where you should be using C structs, then it's a pain writing accessors. So add code to automate that to allow people to easier write bad ObjC code in a Java style!
3. Since these devs continued to complain, introduce Swift, which was advertised as "ObjC without the C" but was "C++ without the C". Swift allowed devs to work in a C++/Java way the way they were used to. Swift was also a hugely complex language that was slower than ObjC and lacked a lot of good stuff that ObjC had, but hey, you can't have everything, right?

#### Where did it go wrong?

It seems that as soon as you create an alternative that is easier than doing it in some other way, people will flock around that alternative, even if it is isn't very good practice in the long run (like the built in Java serialization). And in fact trying to "fix" that to make the wrong choice less problematic is just legitimizing the wrong choice - like Apple did when they made it easier to write Java-style Objective-C.

As a language designer, one often runs into "that's easy to add" sort of features. But it seems to me that one has to be careful to not make things easy people aren't suppose to use.

If I add objects and classes to C3, but say "I only include this for doing things that really works well with OO, like GUI toolkits", then should I really blame people coming form an OO background that they start building everything with objects? If I make it just as easy as building with the preferred procedural style?

#### Conclusion

I don't really like opinionated languages, but I also realize that one does have some responsibility to make things easy that should be used, and hard if they shouldn't be used (often).

As an example, let's say there are two ways to solve a problem in a language: *A* and *B*. If *A* is the best way (maintainability, fit with the other language mechanisms etc), then it should always be easier to do, even if it that means deliberately making *B* harder than it needs to be. *"Making B easier because it has very low cost for me to implement"* is not a neutral act of design, but an implicit endorsement.

The user will look at the programming language and think that *what is the easiest thing to do is the best thing to do*, and violating that is really letting the users down.

## Comments


---
### Comment by Christoffer Lernö

Recently was thinking about Java and reflection and how it actually ended up causing the proliferation of "enterprise-y frameworks" written in the language.

#### Java reflection & serialization

Java early on had built-in serialization. It was very generic but could serialize basically anything in the object graph. The output was also very verbose.

This functionality sort of set the bar for what was to come. So when there came more libraries that wanted to serialize and deserialize with Java, then everyone said "oh, yeah this is cool, it's better than what's built in!".

And then someone said "hey, now that we have this easy serialization and deserialization - guess what, we can do it from config files, that way we get more flexibility!" – And people were at this point already accepting that they were serializing and deserializing from some generic format that wasn't really tailored for their code. So what could go wrong with a generic configuration that wasn't tailored for their code?

Next you got the proliferation of configs everywhere, where you have to mess around with config files in Java because no one builds APIs to actually programmatically configure things.

– And this just comes from the easy accessibility of reflection and serialization in early Java.

Contrast this to C, where you don't have all those tools and have to build your config readers by hand. – So you'll again start shopping for libraries, but since there is no vertically integrated stack that does everything from reading your config to assembling your objects, odds are that you'll at least limit yourself to what you need. Heck, you might even build it yourself.

#### The tragedy of Objective-C

A similar thing occurred with ObjC in the iPhone gold rush. A lot of Java/C++ programmers arrived to the platform, and in Java/C++, OO is usually objects all the way down. – Because hey there's no problem doing that and in fact that's how things are built with OO in those languages: just split things into increasingly finer grained classes and objects.

ObjC was intended to be used in a different way though. ObjC OO is C with an OO layer for interop. You're supposed to write 95+% C with ObjC as the high level "script-like" glue, you don't have to be afraid of C structs or enums.

Also, writing ObjC classes takes more time than doing the same with Java/C++, and again that wasn't a problem because you weren't supposed to use ObjC classes in the same way.

So then all the C++/Java folks showed up and boy did they moan about how hard ObjC was to use... well because they tried to use 5% C and 95% OO. The result was both slow to write and slow to execute. Basically they were trying to write Java in Objective–C.

Now what did Apple do?

1. Automated refcounting - don't let the poor Java developers think about memory management of their gazillion objects, where before (in canonical ObjC projects) memory management had been a very small concern (objects were rarely allocated/deallocated as they were large scale structures in sane ObjC programs) this became a huge problem with Java style OO.
2. Properties - if you use ObjC classes instead of normal C structs where you should be using C structs, then it's a pain writing accessors. So add code to automate that to allow people to easier write bad ObjC code in a Java style!
3. Since these devs continued to complain, introduce Swift, which was advertised as "ObjC without the C" but was "C++ without the C". Swift allowed devs to work in a C++/Java way the way they were used to. Swift was also a hugely complex language that was slower than ObjC and lacked a lot of good stuff that ObjC had, but hey, you can't have everything, right?

#### Where did it go wrong?

It seems that as soon as you create an alternative that is easier than doing it in some other way, people will flock around that alternative, even if it is isn't very good practice in the long run (like the built in Java serialization). And in fact trying to "fix" that to make the wrong choice less problematic is just legitimizing the wrong choice - like Apple did when they made it easier to write Java-style Objective-C.

As a language designer, one often runs into "that's easy to add" sort of features. But it seems to me that one has to be careful to not make things easy people aren't suppose to use.

If I add objects and classes to C3, but say "I only include this for doing things that really works well with OO, like GUI toolkits", then should I really blame people coming form an OO background that they start building everything with objects? If I make it just as easy as building with the preferred procedural style?

#### Conclusion

I don't really like opinionated languages, but I also realize that one does have some responsibility to make things easy that should be used, and hard if they shouldn't be used (often).

As an example, let's say there are two ways to solve a problem in a language: *A* and *B*. If *A* is the best way (maintainability, fit with the other language mechanisms etc), then it should always be easier to do, even if it that means deliberately making *B* harder than it needs to be. *"Making B easier because it has very low cost for me to implement"* is not a neutral act of design, but an implicit endorsement.

The user will look at the programming language and think that *what is the easiest thing to do is the best thing to do*, and violating that is really letting the users down.