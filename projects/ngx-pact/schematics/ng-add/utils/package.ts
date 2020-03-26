import { Tree } from '@angular-devkit/schematics';

export function addPactDependencies(host: Tree) {
  addPackageToPackageJson(
    host,
    'devDependencies',
    '@pact-foundation/karma-pact',
    '^2.3.1'
  );
  addPackageToPackageJson(
    host,
    'devDependencies',
    '@pact-foundation/pact-node',
    '^10.7.1'
  );
  addPackageToPackageJson(
    host,
    'devDependencies',
    '@pact-foundation/pact-web',
    '^9.8.2'
  );
  return host;
}

export function addPackageToPackageJson(
  host: Tree,
  type: string,
  pkg: string,
  version: string
): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json[type]) {
      json[type] = {};
    }

    if (!json[type][pkg]) {
      json[type][pkg] = version;
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}
