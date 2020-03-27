# NGX-Pact

## Development

### Manual Testing

To test locally, install @angular-devkit/schematics-cli globally and use the schematics command line tool. That tool acts the same as the generate command of the Angular CLI, but also has a debug mode.

Check the documentation with

```sh
schematics --help
```

### Unit Testing

```sh
npm run test
```

will run the unit tests, using jest.

### Build

```sh
npm run build
```

### Commits

Commits follow conventional commit rules. You can read about it [here](https://www.conventionalcommits.org/en/v1.0.0/). Additionally to support you with the proper format you can use

```sh
npm run commit
```
