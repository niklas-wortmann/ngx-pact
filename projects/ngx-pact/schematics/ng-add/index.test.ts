import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as SchematicOptions } from './schema';
import { createWorkspace } from '../testing/create-workspace';

describe('ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    'ngx-pact/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: SchematicOptions = {
    project: 'bar',
    skipInstall: false,
    skipWorkspaceUpdate: false,
    port: 1234,
    consumer: 'bar',
    provider: 'foo',
    dir: '',
    log: ''
  };

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it(`should update the angular json by default`, async () => {
    const options: SchematicOptions = {
      ...defaultOptions
    };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.projects.bar.architect.pact).toBeDefined();
  });

  it(`should not update the angular json if configured`, async () => {
    const options: SchematicOptions = {
      ...defaultOptions,
      ...{ skipWorkspaceUpdate: true }
    };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const workspace = JSON.parse(tree.readContent('/angular.json'));
    expect(workspace.projects.bar.architect.pact).not.toBeDefined();
  });

  it(`should update the package json by default`, async () => {
    const options: SchematicOptions = {
      ...defaultOptions
    };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJSON = JSON.parse(tree.readContent('/package.json'));
    expect(
      packageJSON.devDependencies['@pact-foundation/karma-pact']
    ).toBeDefined();
    expect(
      packageJSON.devDependencies['@pact-foundation/pact-node']
    ).toBeDefined();

    expect(
      packageJSON.devDependencies['@pact-foundation/pact-web']
    ).toBeDefined();
  });

  it(`should not update the package json if configured`, async () => {
    const options: SchematicOptions = {
      ...defaultOptions,
      ...{ skipInstall: true }
    };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJSON = JSON.parse(tree.readContent('/package.json'));
    expect(
      packageJSON.devDependencies['@pact-foundation/karma-pact']
    ).not.toBeDefined();
    expect(
      packageJSON.devDependencies['@pact-foundation/pact-node']
    ).not.toBeDefined();

    expect(
      packageJSON.devDependencies['@pact-foundation/pact-web']
    ).not.toBeDefined();
  });
});
