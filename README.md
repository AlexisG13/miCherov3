<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

# <center> Mi Chero </center> 

---
  
## Description

A simple API for news searching on the New York Times API and The Guardian API!. You can also save articles by providing an URL. 

## Installation

```bash
$ npm install
```
## Database
### 1- Create the database "miChero" on Postgresql

### 2- Restore the dump included in the scripts directory

```bash
  $psql miChero < scripts/DB_BACKUP
```
## Enviroment variables

### A sample .env file is included on the root directory; if you wish to provide your own .env file you should include all the required variables in the sample .env file.

## Running the app

```bash

$ npm run start:dev

```
## Built With

- Node.js
- Typescript
- NestJS
- Postgresql
- Prettier and Eslint where used, both for linting a formatting the code.

### API Usage: 
The documentation can be found on the following link: 
https://documenter.getpostman.com/view/9661494/SWLb8URc?version=latest

For testing purposes the following user is available for Signin in : 
username : torty
password : 123456
id : 7

## Homework Week 7

- Which patterns does Nest.JS use? Why? How are they implemented? 

  - Singleton: Every module that we use in  Nest.JS is a singleton by default, because of this every time we reuse a provider from an imported module, we are actually using the same instance of this provider all across our application. 

  - Factory method: Whenever we create an instance of our application , we have to call NestFactory.create method(), and we can provide the type of application we want in order to have specific methods available for our app object. Thus the logic that our app providers is delegated to the child classes dependending on the method we provide. 

  - Decorator : Nest.JS let us use different type of decorators for different purposes like getting the body content, request parameters or for validating or authentication purposes. This decorators "wrap" the class or property we want to decorate and adds new behavior to this. The main difference between how Nest.JS applies the decorator pattern from what is tipically defined is that in Nest.JS we can use decorators on classes, properties and parameters and not objects. 
  Another use of decorators in Nest.JS is when creating controlles , since we have to use decorators to wrap the class that defines our controller with the @Controller decorator, also the @Injectable decorator is used for defining a class as a provider (it has some other uses).

  - Chain of responsability : When wrapping various guards, pipes or middlewares to a class or property, Nest.JS "creates" a chain of responsability to decide if a request should be processed by the actual handler (middleware,pipes,guards) or pass it to the next handler or in some cases stop passing the request (in case it's an error). 
  Also it's probable (the documentation doesn't dive too much on this) that Nest.JS uses some kind of chain of responsability under the hood when running our app and creating the application structure in order to organize it, checking if all the modules, providers , imports and exports are correct. 

  - Dependency injection : Nest.JS uses dependency injection via the constructor of the class we want to inject a dependency in or via the module constructor. Nest.JS has it's own injector that is responsible for instantiating the providers of a module, this provider can be exported and used by other modules. Normally we inject into the constructor of a controller, provider or module. But we can also use the @Injector decorator to inject at a property level. When we "register" a provider or a controller on the module, the Nest injector knows that it has to perform an injection on that class. 

- Explain in your own words, what an antipattern is. Also, explain how to implement the Dependency Injection pattern    in Typescript (with an example).

  - An antipattern is any piece of code that holds back our application from being scalable, modular or hard to maintain, mainly by trying to solve a problem and while succeeding at this, it also brings more problems to our code. 

  - Dependency injection example: 
  ```typescript
  //First we define an interface that is able to tell us what an object is an instance of. 
    interface Type<T> {
    new (...args: any[]): T;
  }

  // Here we define a generic type of decorator that will need the type of an object.
  type GenericClassDecorator<T> = (target: T) => void;

  // Now we can create a decorator in order to decorate all our service classes to get their metadata. 
  const Service = (): GenericClassDecorator<Type<object>> => {
    return (target: Type<object>) => {};
  };

  export const Injector = new (class {
    // Resolving instances
    resolve<T>(target: Type<any>): T {
      // Tokens are required dependencies
      const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
      // Injections are resolved tokens from the        Injector
      const injections = tokens.map(token => Injector.resolve<any>(token));

      return new target(...injections);
    }
  })();

  // Example class to be injected into another
  @Service()
  class InjectableExample {
    doSomething() {
      console.log('foo');
    }
  }

  // Now we can inject via the constructor of the class!
  @Service()
  class Test {
    constructor(public example: InjectableExample) {}
  }

  // We instantiate the Test class
  const test = Injector.resolve<Test>(Test);
  // We are able to use the doSomething method since a InjectableExample object is now a property via constructor injection .
  test.example.doSomething();

- 1. Implement at least 2 design patterns in your API (the ones implemented by Nest.js won't be taken into account). Document: Why did you use them?
  - Repository Pattern : I decided to use the repository pattern since TypeORM already provides  a base repository class, and thus I could extend from it and create my own repositories. This allows me to separate the database logic from business logic (respecting the single responsability principle), and also make my database functionality reusable in other class and not just on my service class.

  - Observer Pattern : When we use the httpModule provided by Nest.JS to make an http request it returns an observable, though we can convert this 
  observable to a promise, I decided to use it as an observable since we can transform our data to the shape we need , by using various methods on the pipe method from the observer. Also Nest.JS is able to resolve observables by itself, so I didn't have to do focus on that part.

  - Strategy: When using the PassPort module we have to decide which "strategy" we want to use, or in other words we have to decide which kind of behaviour we want our passport strategy to use. I decided to implement the strategy by telling PassPort to use the 'JWT' strategy, because of that the "parsing" behaviour behind passport (to get data from a token) worked as JWT token parser, and we could implement different behaviours by giving different strategies. 

2. Remove all antipatterns that you can found on your API side. Document: 1. Why did you think it is an antipattern?

  - Lava Flow : I removed some interfaces and code that I wasn't using anymore, I think this is an antipattern because I shouldn't have unused code in my application, since it just makes it more disorganized and confusing. 

  - Functional Decompositition: I also had some "loose" functions and instances of objects in different files, which means I was following a more procedural style, instead of distributing responsabilities and modularizing my design.  

3. Document: 1. Which patterns did you use? 2. Which antipatterns did you remove (if any)

- Patterns: 

  - Repository
  - Strategy
  - Observer

- Antipatterns removed: 
  - Lava Flow.
  - Functional Decomposition
