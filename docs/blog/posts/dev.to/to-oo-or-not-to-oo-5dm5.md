---
title: "To OO or not to OO"
date: 2020-01-18
author: "Christoffer Lernö"
search:
  exclude: true
---

*Originally from: [https://dev.to/lerno/to-oo-or-not-to-oo-5dm5](https://dev.to/lerno/to-oo-or-not-to-oo-5dm5)*

---
title: To OO or not to OO
published: true
description: A discussion of Object Oriented Design
tags: object oriented, procedural, programming languages, java
---
*(a previous version of this text was posted on Medium)*

Around 2018, partly due to following Jonathan Blow’s work on Jai and the obvious lack of OO in the language, I started to re-think about whether OO is a good thing or not. I ended up listening to — and reading — various criticisms leveled towards OO and pondered the problem quite a bit. I had also started following Bob Nystrom’s [“Crafting Interpreters”](https://craftinginterpreters.com) series that had the second part written in a very clear and easy to understand procedural C. It reminded me how directly aimed at the problem code used to be for me.

### Before OO there was just writing code
I started programming in 1982. I was 9 years old and programming on home computers was almost always BASIC (or assembler, when you wanted to get some speed). It was the era of the first “home computers”. Computer magazines would print listings of games and applications. This was part “getting programs on the cheap” and part “learning to program”.

BASIC isn’t exactly structured programming, at least not those early versions. “Structured programming” was limited to statements like `GOSUB 1340`. Still, you could definitely build things with it. Games and applications, all were written in BASIC. The limitation was usually the memory of the machine (typically 16 kb) rather than the structure. It might not have been elegant code, but it got things done.

Eventually I would pick up Pascal, and even though later iterations of BASIC would improve much of the 8-bit implementations, Pascal was just so much better. It was more powerful, a more importantly it was really easy to write clear and structured code. But even so, program design just wasn’t much different from writing assembler or BASIC. You started in one end and built things until they were done. It was really easy to just "get things done".

I eventually learned a bit C++, but the OO part of the language mostly escaped me. It wasn’t until I got to Java that things changed — and at the time I believed it to be for the better...

### Java and “real” OO
I used to tell people that I didn’t understand object oriented programming until I learned Java. That might not be quite accurate, but it’s true that I didn’t attempt any “Object Oriented Design” until I learned Java.

Java really forced you to do objects. I myself started out when applets was the new hot thing, and the language was still in its 1.0.2 version. It was cool and magical. Objects where these small units you could craft to do things, almost like programming small robots. Instead of just plain programming you did this *design* where independent objects were talking and producing a result. It was awesome. And of course, it was also a lie.

With Java going mainstream, the articles and books on how to do *real OO* flourished. The point seemed to be that one should throw away most things about procedural programming. It was supposedly bad in the same way unstructured programming was to the procedural programming. The more we thought in terms of objects, the better things were. It was clear that *nirvana* was near — accessible to those lucky people who could get program Java for a living.

###Object Oriented modelling nightmares
In my free time I was working on the next iteration of a complex online game that was initially written as BBS door (BBS online games back when we used dial-up modems). The original version had been written in QBasic, and I also had done a rewrite in Turbo Pascal that covered about 80% of the game. Writing the game had taken evenings and weekends spread over about half a year.

The QBasic version was tricky as you had to pass all global data explicitly between implementation files, and each file had a size limit — so it had to be split with this huge declaration of globals on top of each file. The Pascal version was so much easier to write. You didn’t need to explicitly pass globals and it was straightforward to pass things to procedures — whereas for QBasic you had to pass parameters and results in global variables you especially set aside for the purpose. Obviously the Java version — with OO goodness — must be even *easier* than Pascal to implement!

That turned out to be “not quite true”. I wrote page after page on the design of the classes, how each entity would know what, and what state each would contain and how to act on other entities. It felt really cool, but it was also complex and every version of the object model seemed to have *some* problem where eventually everything needed to know everything and every single class would be hideously complex with little way to ensure consistency. It felt like an impossible task.

###Doing real things
Meanwhile I started working professionally as a programmer. I wrote in Perl, Java, learned Objective-C and Ruby. With Objective-C I discovered that the “OO” of Java/C++ was just one brand of OO. In Java the idea was to create tiny classes that were assembled to a whole, but in ObjC objects were instead used as high level “glue” between larger components written internally in straight procedural C code. The fine grained classes of Java would be considered the very opposite of good design for Objective-C. So, if OO was to be to procedural programming as procedural was to unstructured — how come there wasn’t even a consensus on how to do “proper OO”?

My pet project was still a failure. I still tried to model things the Java way and I kept failing. But then I tried writing it in Ruby and something unexpected happened.

###Getting things done
In Java it’s easy to just get caught in the work of writing your classes. Java is comparatively verbose, so just writing a bunch of classes, writing getters and setters seems like you got quite a bit of work done. That’s why it was easy just to waste time testing out models and still feel like you’re getting somewhere.

In Ruby, on the other hand, writing a class is trivial. Even modelling a lot of them isn’t much work. If you’re lazy you can even generate a bunch of them using metaprogramming. Ruby is very, very quick to do prototyping in.

Suddenly I couldn’t fool myself anymore. After implementing parts of the model in Ruby it was suddenly clear that I wasn’t adding anything of value by creating those game model classes. It was work, but it wasn’t real work. I needed a new idea.

At the time I was working professionally on poker servers, and it was clear a poker game instance was simply a data structure with the deck, the current bets and players. Player actions were simply commands acting on this data according to certain rules. Maybe this idea could work…?
As a prototype in my Ruby code I simply used a nested hash map — no model objects at all. Each action the player would simply invoke the corresponding method which would directly edit values of the branches of the map. A very procedural approach — even though I didn’t think of it like that at the time.

Some good things immediately resulted from this design: it was dead simple to add an “undo”-functionality, where the changes to the data could be rolled back. The data tree was naturally dead simple to serialize and deserialize (compare the headache of my old designs where each single class needed to implement serialization/deserialization on its own), and I could also track exactly what changes were made in order to assemble updates to logged in players.

I had solved my big OO problem… by adopting a more procedural mindset.

###Not quite there yet
Despite solving the problem, I didn’t actually *realize* that the problem was OO. I just thought I had found a very clever solution.

Professionally, even though I could do all the “fancy” OO solutions with reflection, polymorphism etc, my own OO style tended to favour simple, explicit and *obvious* solutions. But I would pick the solutions because my experience showed me they were the best, not because I realized there was any problems with OO.

###A new problem
I had built my game server and it was fine. It was trivial to extend and dead simple to add more features. There was just one problem: the client.

I had written clients before, but on a smaller. As long as you have no more than say 10–15 screens you can get away with most designs. My game client had over 50 distinct dialog screens and many different states. Things were getting messy.

I had my model and my views and my controllers and still I felt I had no control there *was just so much state everywhere*. Because this is the essence of Java/C++ style OO: split state into small pieces and let each object manage their specific part of the application state. It’s really a spectacularly bad idea as complexity roughly correspond to the square of different interacting states. In addition, it’s very tempting to simply let the state be implicit in some (combination of) member variable values. “Why have an explicit state when you can check the value of a variable to figure it out?”

###A conclusion
In procedural programming you tend to keep your state where you can see it. Unlike OO, where you’re encouraged to split the state and hide it, you pretty much have to keep it explicit and that really is a good thing.
That’s not to say that using objects is necessarily a bad thing. It’s a very powerful tool for building UI rendering hierarchies for one thing, and the *namespacing* together with chaining can create very smooth and readable code, compare: `urlescape(substr(string, 0, strlen(string) - 2)` to `string.substr(0, -2).urlescape()` (there can still be an argument that the former is clearer though!). However, the object oriented *design* with objects that keep state or act on other objects — here is where OO goes all wrong.

There is also the (mostly forgotten) Objective-C style of OO which happens to be even better for building GUIs than Java/C++, as the late binding of the dispatch and the runtime pushes it significantly closer to being a scripting language. Sadly Apple, the former champions of Objective-C, have largely forgotten what the idea behind ObjC really was, and are now replacing it with Swift which adopts the OO style of Java/C++.

Still, there are languages trying to get back to the basics. Golang is one, and many of the other new “system programming languages” also qualifies. Go in particular (despite my reservations regarding the language) disproves the myth that “it’s not possible to build large scale products with procedural programming”. The increasing popularity of the language might create a crack in the idea that OO is “inevitable”

However, Java-style OO is deeply entrenched and shows little inclination of disappearing anytime soon. It will be interesting to see what the future brings.