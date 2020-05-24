import { strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  move,
  SchematicsException,
  template,
  Tree,
  url,
  SchematicContext
} from '@angular-devkit/schematics';
import { Schema } from '../schema';
import { getProject, WorkspaceProject } from './project';

export const pactifyJestConf = (
  host: Tree,
  options: Schema,
  context: SchematicContext
) => {
  const project = getProject(host, options);

  if (!project.architect) {
    throw new SchematicsException(
      `angular.json is wrongly configured for ${options.project}`
    );
  }

  const sourceParametrizedTemplates = apply(url('./files'), [
    template({ ...options, ...strings }),
    move(project.root)
  ]);

  patchTSConfigSpec(project, host, context);

  return mergeWith(sourceParametrizedTemplates);
};

function patchTSConfigSpec(
  project: WorkspaceProject,
  host: Tree,
  context: SchematicContext
) {
  let tsConfigSpecFile = host
    .read(`${project.root}/tsconfig.spec.json`)
    ?.toString();

  if (tsConfigSpecFile) {
    tsConfigSpecFile = JSON.parse(tsConfigSpecFile);
    (tsConfigSpecFile as any).emitDecoratorMetadata = true;
    host.overwrite(
      `${project.root}/tsconfig.spec.json`,
      JSON.stringify(tsConfigSpecFile)
    );
  } else {
    context.logger.warn('Unable to read tsconfig.spec.json');
  }
}
