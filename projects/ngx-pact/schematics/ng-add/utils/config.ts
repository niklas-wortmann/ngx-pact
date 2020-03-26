import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { experimental } from '@angular-devkit/core';

export type WorkspaceSchema = experimental.workspace.WorkspaceSchema;

export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  const path = possibleFiles.filter(filePath => host.exists(filePath))[0];

  return path;
}

export function getWorkspace(host: Tree): WorkspaceSchema {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const config = configBuffer.toString();

  return JSON.parse(config);
}
