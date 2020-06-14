import { Tree, SchematicsException } from '@angular-devkit/schematics';

export function addPactDependenciesForKarma(host: Tree) {
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

export function addPactDependenciesForJest(host: Tree) {
  addPackageToPackageJson(
    host,
    'devDependencies',
    '@pact-foundation/pact',
    '^9.8.2'
  );
  addPackageToPackageJson(
    host,
    'devDependencies',
    'jest-preset-angular',
    '^8.1.2'
  );
  return host;
}

export function addPackageToPackageJson(
  host: Tree,
  type: string,
  pkg: string,
  version: string
): Tree {
  assertPackageJsonExists(host);
  const json = getPackageJson(host);
  initializeKey(json, type);

  if (!json[type][pkg]) {
    json[type][pkg] = version;
  }

  host.overwrite('package.json', JSON.stringify(json, null, 2));

  return host;
}

export function addConfigObjectToPackageJson(
  host: Tree,
  config: { pact_do_not_track?: boolean; pact_binary_location?: string }
): Tree {
  assertPackageJsonExists(host);
  const json = getPackageJson(host);
  initializeKey(json, 'config');

  json.config = { ...json.config, ...config };
  host.overwrite('package.json', JSON.stringify(json, null, 2));

  return host;
}

function initializeKey(json: any, type: string) {
  if (!json[type]) {
    json[type] = {};
  }
}

function getPackageJson(host: Tree): any {
  const sourceText = host.read('package.json')!.toString('utf-8');
  return JSON.parse(sourceText);
}

function assertPackageJsonExists(host: Tree): void | never {
  if (!host.exists('package.json')) {
    throw new SchematicsException(
      `package.json was not found in ${host.root.path}`
    );
  }
}
