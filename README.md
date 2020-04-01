# NGX Pact

[![npm](https://img.shields.io/npm/v/ngx-pact.svg)](https://www.npmjs.com/package/ngx-pact)
[![npm](https://img.shields.io/npm/l/ngx-pact.svg)](https://www.npmjs.com/package/ngx-pact)

Pact is a tool to develop Consumer-Driven Contract Tests. You can find a lot of informations on the [official docs](https://docs.pact.io/) or the [github repository](https://github.com/pact-foundation).

This Angular Schematic supports you in setting up pact for your projects and therefore do Consumer-Driven Contract Testing for your application.

## How to use

### Add the schematics to your project

For now this repository just support the initial setup of a project to perform pact tests.
This can be done by adding this library.

```sh
ng add ngx-pact
```

The `ng add` command supports a variety of configuration options. You can find a detailed list in the following section.
This will also change the `karma.conf.js`, so if you already setup pact for your project just skip this step and add `ngx-pact` as dev dependency.

### Configuration Options

| Parameter Name      | description                                                                               | default        |
| ------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| skipInstall         | Do not add pact packages as devDependency in the package.json                             | false          |
| project             | The name of the project for which you want to add pact                                    | defaultProject |
| port                | The port of the pact server                                                               | 12345          |
| dir                 | The directory of the pact files                                                           | ./pact         |
| log                 | The directory of the log files                                                            | ''             |
| pactBinaryLocation  | When you are behind a cooperate proxy you might want to download the pact binary manually |                | 
| pactDoNotTrack      | Pact by default analyze anonymously installations of the pact-node module                 |                |

### Generate a pact test

```sh
ng generate ngx-pact:service --name test
```

This will generate an angular service called test, with the normal `test.service.spec.ts`, but also a `test.service.pact.spec.ts`.
It extends the normal service schematic and adds the following configuration options:

| Parameter Name      | description                                                                               | default        |
| ------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| port                | The port of the pact server                                                               | 12345          |
| consumer            | Name of the consumer                                                                      | projectName    |
| provider            | Name of the provider                                                                      | some-provider  |

## Development

For development hints, have a look at [DEVELOPMENT.md](./DEVELOPMENT.md)
