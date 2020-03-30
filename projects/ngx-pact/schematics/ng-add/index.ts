import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import * as ts from 'typescript';
import { Schema } from './schema';
import {
  addConfigObjectToPackageJson,
  addPactDependencies
} from './utils/package';
import { getProject } from './utils/project';
import {
  InsertChange,
  createChangeRecorder,
  commitChanges
} from './utils/change';
import { CurrencyPipe } from '@angular/common';

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

const updateKarmaConf = (options: Schema) => {
  return (host: Tree) => {
    const project = getProject(host, options);
    const path = project.root;
    if (!project.architect) {
      throw new SchematicsException(
        `angular.json is wrongly configured for ${options.project}`
      );
    }
    const karmaConfigPath = project.architect.test.options.karmaConfig;
    const karmaConfigBuffer = host.read(karmaConfigPath);
    if (karmaConfigBuffer === null) {
      throw new SchematicsException(`Could not find (${karmaConfigPath})`);
    }
    const karmaConfig = ts.createSourceFile(
      'karma.conf.js',
      karmaConfigBuffer.toString('utf-8'),
      ts.ScriptTarget.Latest,
      false,
      ts.ScriptKind.JS
    );
    const moduleStatement = karmaConfig.statements.find(
      node => node.kind === ts.SyntaxKind.ExpressionStatement
    );
    if (moduleStatement) {
      const [
        changes
      ] = (moduleStatement as any).expression.right.body.statements.map(
        (node: any) => {
          const [iteration] = node.expression.arguments.map((prop: any) => {
            const confKeys = prop.properties.reduce((acc: any, curr: any) => {
              if (['frameworks', 'plugins'].includes(curr.name.escapedText)) {
                return {
                  ...acc,
                  ...{ [curr.name.escapedText]: curr.initializer.elements.end }
                };
              }
              return acc;
            }, {});
            return { ...confKeys, ...{ end: prop.properties.end } };
          });
          return iteration;
        }
      );
      const pactConfiguration = `,
    pact: [
      {
        cors: true,
        port: 1234,
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), '../../pacts')
      }
    ]`;
      const pactFrameworkConfiguration = `, 'pact'`;
      const pluginConfiguration = `,
      require('@pact-foundation/karma-pact')`;

      const pactConfigChange = new InsertChange(
        karmaConfigPath,
        changes.end,
        pactConfiguration
      );
      const frameWorkChange = new InsertChange(
        karmaConfigPath,
        changes.frameworks,
        pactFrameworkConfiguration
      );
      const pluginChange = new InsertChange(
        karmaConfigPath,
        changes.plugins,
        pluginConfiguration
      );
      commitChanges(host, karmaConfigPath, [
        pactConfigChange,
        frameWorkChange,
        pluginChange
      ]);
    }
    return host;
  };
};

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([
      // options.pactBinaryLocation || options.pactDoNotTrack
      //   ? addPactConfigToPackageJSON(options)
      //   : noop(),
      // options.skipInstall ? noop() : updatePackageJSON(),
      updateKarmaConf(options)
    ])(tree, context);
  };
}
