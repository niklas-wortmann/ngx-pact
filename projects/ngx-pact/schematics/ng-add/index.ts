import {
  chain,
  Rule,
  SchematicContext,
  Tree,
  noop
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import {
  addConfigObjectToPackageJson,
  addPactDependenciesForKarma,
  addPactDependenciesForJest
} from './utils/package';
import { pactifyKarmaConf } from './utils/karma';
import { pactifyJestConf } from './utils/jest';
import { getProjetTestFramework } from './utils/project';

const addPactConfigToPackageJSON = ({
  pactBinaryLocation,
  pactDoNotTrack
}: Schema) => {
  return (host: Tree) => {
    const config = {
      ...(pactBinaryLocation
        ? { pact_binary_location: pactBinaryLocation }
        : {}),
      ...(pactDoNotTrack ? { pact_do_not_track: true } : {})
    };
    addConfigObjectToPackageJson(host, config);
    return host;
  };
};

const updatePackageJSON = (isJest: boolean) => {
  return (host: Tree, context: SchematicContext) => {
    isJest
      ? addPactDependenciesForJest(host)
      : addPactDependenciesForKarma(host);
    context.addTask(new NodePackageInstallTask());
    return host;
  };
};

const updateKarmaConfig = (options: Schema) => {
  return (host: Tree) => pactifyKarmaConf(host, options);
};

const updateJestConfig = (options: Schema, context: SchematicContext) => {
  return (host: Tree) => pactifyJestConf(host, options, context);
};

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const isJest = getProjetTestFramework(tree, options) === 'jest';

    return chain([
      options.pactBinaryLocation || options.pactDoNotTrack
        ? addPactConfigToPackageJSON(options)
        : noop(),
      options.skipInstall ? noop() : updatePackageJSON(isJest),
      isJest ? updateJestConfig(options, context) : updateKarmaConfig(options)
    ])(tree, context);
  };
}
