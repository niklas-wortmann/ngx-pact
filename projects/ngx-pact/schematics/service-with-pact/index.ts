import {
  chain,
  Rule,
  Tree,
  externalSchematic,
  noop,
  apply,
  applyTemplates,
  move,
  url,
  mergeWith
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from './schema';
import { Schema as ServiceOptions } from '@schematics/angular/service/schema';
import { parseName } from '@schematics/angular/utility/parse-name';
import { createDefaultPath } from '@schematics/angular/utility/workspace';

type SchemaOptions = Schema & ServiceOptions;

export const createService = (options: SchemaOptions): Rule => {
  return async (tree: Tree) => {
    if (options.path === undefined) {
      options.path = await createDefaultPath(tree, options.project as string);
    }
    const template = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options
      }),
      move(parseName(options.path, options.name).path)
    ]);
    return chain([
      externalSchematic('@schematics/angular', 'service', options),
      mergeWith(template)
    ]);
  };
};
