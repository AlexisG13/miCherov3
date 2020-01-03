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

  - Decorator : Nest.JS let us use different type of decorators for different purposes like getting the body content, request parameters or for validating or authentication purposes. This decorators "wrap" the class or property we want to decorate and adds new behavior to this. The main difference between how Nest.JS applies the decorator pattern from what is tipically defined is that in Nest.JS we can use decorators on classes and not objects. 
  Another use of decorators in Nest.JS is when creating controlles , since we have to use decorators to wrap the class that defines our controller with the @Controller decorator, also the @Injectable decorator is used for defining a class as a provider (it has some other uses).

  - Chain of responsability : When wrapping various guards, pipes or middlewares to a class or property, Nest.JS "creates" a chain of responsability to decide if a request should be processed by the actual handler (middleware,pipes,guards) or pass it to the next handler or in some cases stop passing the request (in case it's an error). 
  Also it's probable (the documentation doesn't dive too much on this) that Nest.JS uses some kind of chain of responsability under the hood when running our app and creating the application structure in order to organize it, checking if all the modules, providers , imports and exports are correct. 

  - Dependency injection : Nest.JS uses dependency injection via the constructor of the class we want to inject a dependency in or via the module constructor. Nest.JS has it's own injector that is responsible for instantiating the providers of a module, this provider can be exported and used by other modules. Normally we inject into the constructor of a controller, provider or module. But we can also use the @Injector decorator to inject at a property level. When we "register" a provider or a controller on the module, the Nest injector knows that it has to perform an injection on that class. 

- Explain in your own words, what an antipattern is. Also, explain how to implement the Dependency Injection pattern    in Typescript (with an example).

  - An antipattern is any piece of code that holds back our application from being scalable, modular or hard to maintain, mainly by trying to solve a problem and while succeeding at this, it also brings more problems to our code. 


