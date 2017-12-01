## lepus

> Convenience wrapper around amqplib.

[![Greenkeeper badge](https://badges.greenkeeper.io/sammler/lepus.svg)](https://greenkeeper.io/)
[![CircleCI](https://img.shields.io/circleci/project/github/sammler/lepus.svg)](https://circleci.com/gh/sammler/lepus)

---

> This is work in progress, just some sugar functions on top of amqplib I use in some of my projects.
> That's it, stay tuned ...

---

## Features

## Install

```
$ npm install lepus --save
```

## Usage

### Basic Usage

### API

See [API docs](./docs/api-docs.md)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/stefanwalther/lepus/issues). The process for contributing is outlined below:

1. Create a fork of the project
2. Work on whatever bug or feature you wish
3. Create a pull request (PR)

I cannot guarantee that I will merge all PRs but I will evaluate them all.

### Run tests

Unit tests:

```bash
$ npm run test:unit
```

Integration tests:

First start RabbitMQ locally:
```sh
$ docker-compose up -d
```

Then run the integration tests:
```bash
$ npm run test:unit
```

### Updating docs

```sh
$ make gen-readme
```

## References

Here are links & libraries that helped me:
- https://github.com/lanetix/node-lanetix-amqp-easy
- https://github.com/nowait/amqp
- https://github.com/dial-once/node-bunnymq

## About

### Author
**Stefan Walther**

* [twitter](http://twitter.com/waltherstefan)
* [github.com/stefanwalther](http://github.com/stefanwalther) 
* [LinkedIn](https://www.linkedin.com/in/stefanwalther/)

### License
MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on December 01, 2017._

