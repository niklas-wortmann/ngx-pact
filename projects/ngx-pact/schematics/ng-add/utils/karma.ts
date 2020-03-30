import { SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { Schema } from '../schema';
import { commitChanges, InsertChange } from './change';
import { getProject } from './project';

const pactConfiguration = (options: Schema) => `,
pact: [
  {
    cors: true,
    port: ${options.port},
    log: ${options.log},
    dir: ${options.dir}
  }
]`;
const pactFrameworkConfiguration = `, 'pact'`;
const pluginConfiguration = `,
  require('@pact-foundation/karma-pact')`;

export const pactifyKarmaConf = (host: Tree, options: Schema) => {
  const project = getProject(host, options);
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
  const changes = getChangePositions(karmaConfig);

  const pactConfigChange = new InsertChange(
    karmaConfigPath,
    changes.end,
    pactConfiguration(options)
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
  return host;
};

interface KarmaChangePositions {
  end: number;
  frameworks: number;
  plugins: number;
}

const getChangePositions = (source: ts.SourceFile): KarmaChangePositions => {
  const moduleStatement = source.statements.find(
    node => node.kind === ts.SyntaxKind.ExpressionStatement
  );
  if (!moduleStatement) {
    throw new SchematicsException(`karma.config.js in an unexpected shape`);
  }
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
  return changes;
};
