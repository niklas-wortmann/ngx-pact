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
  addPactDependencies
} from './utils/package';
import { pactifyKarmaConf } from './utils/karma';

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

const updatePackageJSON = () => {
  return (host: Tree, context: SchematicContext) => {
    addPactDependencies(host);
    context.addTask(new NodePackageInstallTask());
    return host;
  };
};

const updateKarmaConfig = (options: Schema) => {
  return (host: Tree) => pactifyKarmaConf(host, options);
};

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([
      options.pactBinaryLocation || options.pactDoNotTrack
        ? addPactConfigToPackageJSON(options)
        : noop(),
      options.skipInstall ? noop() : updatePackageJSON(),
      updateKarmaConfig(options)
    ])(tree, context);
  };
}
