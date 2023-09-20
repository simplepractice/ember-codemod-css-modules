import { readFileSync, writeFileSync } from 'node:fs';
import type { Context, Options } from '../../../types/index.js';
import {
  moveFiles,
} from '@codemod-utils/files';
import postcss, { AcceptedPlugin, Plugin } from 'postcss';
import syntax from 'postcss-scss';

const localSelector = ':local(.component)';
const transformPlugin: Plugin = {
  postcssPlugin: 'Transform Plugin',
  Once(root) {
    let localRule: postcss.Rule | undefined;
    let nodesBeforeLocal: postcss.Node[] = [];
    root.walk(node => {
      if (node.type === 'rule' && node.selector === '&') {
        localRule = node;
      }

      if (!localRule) {
        nodesBeforeLocal.push(node);
      }
    });

    if (localRule) {
      localRule.selector = localSelector;
    } else {
      root.append({ selector: localSelector });
      localRule = root.nodes[root.nodes.length - 1] as postcss.Rule;
      nodesBeforeLocal = [];
    }

    root.walk(node => {
      if (node === localRule) return;
      if (node.parent === localRule) return;
      if (node.parent?.type !== 'root') return;
      if (nodesBeforeLocal.includes(node)) return;
      if (node.type === 'atrule' && node.name !== 'media') return;
      if (node.type === 'decl') return;
      if (node.type === 'comment' && node.text.startsWith('stylelint')) return;

      if (!node.raws.before) node.raws.before = '\n';
      localRule?.append(node);
    });
  },
};
const plugins: AcceptedPlugin[] = [transformPlugin];
const processor = postcss(plugins);

function moveComponentCssStylesheets(context: Context, options: Options): void {
  const pathMapping = new Map(context.map(entry => [entry.oldPath, entry.newPath]));
  moveFiles(pathMapping, options);
}

async function transformCssSyntax(filePath: string): Promise<void> {
  const contents = readFileSync(filePath).toString();
  try {
    const result = await processor.process(contents, { from: '', syntax });
    writeFileSync(filePath, result.css);
  } catch (err) {
    console.error(`PostCSS error in ${filePath}`)
    throw err;
  }
}

export async function moveStylesheets(context: Context, options: Options): Promise<void> {
  moveComponentCssStylesheets(context, options);
  await Promise.all(
    context.map(entry => transformCssSyntax(`${options.projectRoot}/${entry.newPath}`))
  );
}
