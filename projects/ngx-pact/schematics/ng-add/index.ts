import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop,
  SchematicsException
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addPactDependencies } from './utils/package';
import { Schema } from './schema';
import { getWorkspacePath } from './utils/config';
import { getProject } from './utils/project';
import { getWorkspace } from './utils/config';

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

    project['architect']['pact'] = {
      builder: '@angular-devkit/build-angular:karma',
      options: {
        main: 'src/test.ts',
        polyfills: 'src/polyfills.ts',
        tsConfig: 'tsconfig.spec.json',
        karmaConfig: 'karma.pact.conf.js',
        assets: ['src/favicon.ico', 'src/assets'],
        styles: ['src/styles.css'],
        scripts: ['./node_modules/@pact-foundation/pact-web/pact-web.js']
      }
    };
    workspace.projects[options.project] = project;
    host.overwrite(path, JSON.stringify(workspace, null, 2));
    return host;
  };
};

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([
      options.skipInstall ? noop() : updatePackageJSON(),
      options.skipWorkspaceUpdate ? noop() : updateAngularJSON(options)
    ])(tree, context);
  };
}
