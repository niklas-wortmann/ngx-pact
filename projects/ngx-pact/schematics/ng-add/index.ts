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
        end
      ] = (moduleStatement as any).expression.right.body.statements.map(
        (node: any) => {
          const [bla] = node.expression.arguments.map((prop: any) => {
            return prop.properties.end;
          });
          return bla;
        }
      );
      console.log({ end });
      const pactConfiguration = `,
    pact: [
      {
        cors: true,
        port: 1234,
        log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), '../../pacts')
      }
    ]`;
      const change = new InsertChange(karmaConfigPath, end, pactConfiguration);
      commitChanges(host, karmaConfigPath, [change]);
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
