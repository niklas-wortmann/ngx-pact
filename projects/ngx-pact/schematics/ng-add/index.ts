import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
  url,
  SchematicsException,
  template,
  apply,
  mergeWith,
  move
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPactDependencies,
  addConfigObjectToPackageJson
} from './utils/package';
import { Schema } from './schema';
import { getWorkspacePath } from './utils/config';
import { getProject } from './utils/project';
import { getWorkspace } from './utils/config';
import { strings } from '@angular-devkit/core';

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

const updateAngularJSON = (options: Schema) => {
  return (host: Tree) => {
    const project = getProject(host, options);
    const workspace = getWorkspace(host);
    const path = getWorkspacePath(host);
    if (project['architect'] === undefined) {
      throw new SchematicsException(
        `angular.json configuration for ${options.project} is weird! Architect property is missing`
      );
    }
    const projectRoot = project.root;
    const projectSrcRoot = project.sourceRoot;
    project['architect']['pact'] = {
      builder: '@angular-devkit/build-angular:karma',
      options: {
        main: `${projectRoot}/pact/test.ts`,
        polyfills: `${projectSrcRoot}/polyfills.ts`,
        tsConfig: `${projectRoot}/tsconfig.spec.json`,
        karmaConfig: `${projectRoot}/karma.pact.conf.js`,
        assets: [`${projectSrcRoot}/favicon.ico`, `${projectSrcRoot}/assets`],
        styles: [`${projectSrcRoot}/styles.css`],
        scripts: [`./node_modules/@pact-foundation/pact-web/pact-web.js`]
      }
    };
    workspace.projects[options.project] = project;
    host.overwrite(path, JSON.stringify(workspace, null, 2));
    return host;
  };
};

const copyKarmaConf = (options: Schema) => {
  return (host: Tree) => {
    const project = getProject(host, options);
    const path = project.root;
    const sourceTemplates = url('./files');
    const parameterizedTemplate = apply(sourceTemplates, [
      template({ ...options, ...strings }),
      move(path)
    ]);
    return mergeWith(parameterizedTemplate);
  };
};

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([
      options.pactBinaryLocation || options.pactDoNotTrack
        ? addPactConfigToPackageJSON(options)
        : noop(),
      options.skipInstall ? noop() : updatePackageJSON(),
      options.skipWorkspaceUpdate ? noop() : updateAngularJSON(options),
      copyKarmaConf(options)
    ])(tree, context);
  };
}
