# Web Advanced Template

- [Introduction](./README.md#introduction)
- [Template](./README.md#template)
- [Assignment](./README.md#assignment)
- [Client](./README.md#client)
- [Server](./README.md#server)
  - [REST specification and automated testing](./README.md#rest-specification-and-automated-testing)
  - [Linting](./README.md#linting)
- [Documentation](./README.md#documentation)


## Introduction

Welcome to Web Advanced. Last year during Web Basics you learned about basic web techniques and languages such 
as HTML, CSS, Javascript and REST. These techniques are the basis of web applications today. Although these applications
can be accessed from a web browser, they tend to be a lot more dynamic than just plain old sites. Examples of these 
kinds of applications are Gmail, Netflix, WhatsApp Web and Google Docs.

The foundations for these types of applications are laid by Javascript. This programming language is built into every 
browser. Therefore, this module will put a lot of emphasis on Javascript. We will be using it client-side (within the browser) as well as server-side (using Node.js).

Though Web Basics started out as web browser applications this is no longer the case. Several frameworks have
been developed to allow web technology to be used on mobile devices such as [React native](https://reactnative.dev/). 
Also using [Electron](https://www.electronjs.org/) it is possible to build a desktop application. For example Twitch and Discord were built with Electron.

## Template

This template is the basis of the backend and front-end application you have to build as the assignment for this course.
The template contains everything you need to built both the backend and the front-end. This page explains how to use it.
Each section below explains a root directory in the template.

## Assignment

In order to receive a passing grade you need to implement the [assignment](./assignment/README.md). The assignment 
description can be found in the `assignment` directory. This directory contains the explanation if the assignment as 
well as a partial functional design. The functional design contains requirements, user stories and basic wireframes.

## Client

The `client` directory has to contain your client. The client has to be built using [Svelte](https://svelte.dev/). The 
base application has already been added, and you will **not** have to install it yourself. Teachers will run the 
`npm install` and `npm start` scripts from the `package.json` file in order to start your application. If it does not
start your entry will **not** be graded. The required scripts have already been added.

After downloading the template run `npm i` in the `client` directory to download and install the required dependencies.

## Server

As stated in the course manual the backend will be created using [node.js](https://nodejs.org/). Node js is a server 
side environment to run Javascript applications. On top of Node we will use Express 
[expressjs.com](https://expressjs.com/). Express is a framework capable of functioning as a REST server. A default hello 
world application has already been added. 

While developing you can start the server using `npm run dev` in the `server` directory. This will start the server
using the Nodemon dependency. Nodemon will restart the server if a change in the source code is detected. This means you
will not have to restart the server manually after every code change.

After downloading the template run `npm i` in the `server` directory to download and install the required dependencies.

### REST specification and automated testing
This project uses [Swagger](https://swagger.io/) for documenting the REST API. You can easily write [JSDoc](https://www.npmjs.com/package/swagger-ui-express) to document each of your routes. The overview of your API can be seen by visiting the page [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

For testing we will use the combination of [Vitest](https://vitest.dev/) and [Supertest](https://www.npmjs.com/package/supertest). The tests will be executed when you are running the command `npm run test`.

We have already provided you with an example of a API specification and a corresponding test. See `routes/example.js` and `tests/example.test.js`.

### Linting
To help keep your code clean, consistent, and free of common errors, we use ESLint, a tool called a linter. Linting automatically checks your code for style issues and potential bugs.

Why linting matters:
- It enforces a consistent code style across the project.
- It catches syntax errors or problematic patterns early.
- It makes your code easier to read and maintain.

You can run the linter by executing `npm run lint`.

## Documentation

As part of the assignment you will need to document some of your work. This documentation should be placed in the 
`documentation` directory. Documentation must be written in 
[Markdown](https://www.jetbrains.com/help/upsource/markdown-syntax.html). **Not** Word or PDF. Feel free to add images 
to explain things better. Markdown has many options to create nice documentation, and it renders well on most Git 
hosters such as Gitlab and GitHub.