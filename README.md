# NGX Pact

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

### Configuration Options

| Parameter Name      | description                                                                               | default        |
| ------------------- | ----------------------------------------------------------------------------------------- | -------------- |
| skipInstall         | Do not add pact packages as devDependency in the package.json                             | false          |
| skipWorkspaceUpdate | By Default it will generate a pact configuration in the angular.json                      | false          |
| project             | The name of the project for which you want to add pact                                    | defaultProject |
| port                | The port of the pact server                                                               | 12345          |
| consumer            | Name of the consumer                                                                      | project        |
| provider            | Name of the provider                                                                      | some-provider  |
| dir                 | The directory of the pact files                                                           | ./pact         |
| log                 | The directory of the log files                                                            | ''             |
| pactBinaryLocation  | When you are behind a cooperate proxy you might want to download the pact binary manually |                |  |
| pactDoNotTrack      | Pact by default analyze anonymously installations of the pact-node module                 |                |

## Consumer-Driven Contract Testing

## Development

For development hints, have a look at [DEVELOPMENT.md](./DEVELOPMENT.md)
