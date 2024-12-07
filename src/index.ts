import type { NodePath, PluginObj } from '@babel/core';
import { types as t } from '@babel/core';
import syntaxJSX from '@babel/plugin-syntax-jsx';
import {
  CLSX_IGNORE_GLOBAL_TOKEN,
  CLSX_IGNORE_TOKEN,
  CLASS_NAME_STRICT_RE,
  CLASS_NAME_RE,
  IMPORT_SOURCE,
  IMPORT_NAME,
  IMPORT_NAMESPACE,
} from './constants';

export interface Options {
  static?: boolean;
  strict?: boolean;
  importSource?: string;
  importName?: string;
}

export default (_: unknown, opts: Options = {}): PluginObj => {
  opts.static ??= true;
  opts.strict ??= true;
  opts.importSource ??= IMPORT_SOURCE;
  opts.importName ??= IMPORT_NAME;

  const callId = t.identifier(IMPORT_NAMESPACE);
  // default: `_clsx`
  // custom:  `{ importName as _clsx }`
  const importSpec =
    opts.importName === IMPORT_NAME
      ? t.importDefaultSpecifier(callId)
      : t.importSpecifier(callId, t.identifier(opts.importName));
  // default: `import _clsx form 'clsx'`
  // custom:  `import _clsx form '${importSource}'` or `import { importName as _clsx } from '${importSource}'`
  const importDecl = t.importDeclaration(
    [importSpec],
    t.stringLiteral(opts.importSource),
  );

  const classNameRE = opts.strict ? CLASS_NAME_STRICT_RE : CLASS_NAME_RE;
  // `<div className={...} />`
  function isDynamicClassName(node: t.JSXAttribute) {
    return (
      classNameRE.test(node.name.name as string) &&
      t.isJSXExpressionContainer(node.value)
    );
  }

  // `@clsx-ignore-global`
  function isIgnoredGlobal(nodes: t.Node[]) {
    for (const node of nodes) {
      // Comments are considered to be from the top of the file before any import
      if (t.isImportDeclaration(node)) {
        if (isIgnored(node, CLSX_IGNORE_GLOBAL_TOKEN)) return true;
      }
      // Comments are considered to be at the top of the file before the first line of expression
      else {
        return isIgnored(node, CLSX_IGNORE_GLOBAL_TOKEN);
      }
    }
    // empty
    return false;
  }

  // `@clsx-ignore`
  function isIgnored(node: t.Node, token = CLSX_IGNORE_TOKEN) {
    return node.leadingComments
      ? node.leadingComments.some((comment) => {
          const ignored = comment.value.trim() === token;
          // Removes comments for ignoring
          if (ignored) comment.ignore = ignored;

          return ignored;
        })
      : false;
  }

  function isNeedTransform(jsxExpr: t.JSXEmptyExpression | t.Expression) {
    if (opts.static) {
      // include `<div className={['c1', 'c2']} />`
      // include `<div className={{ c1: true, c2: true }} />`
      return t.isArrayExpression(jsxExpr) || t.isObjectExpression(jsxExpr);
    } else {
      // exclude `<div className={classNameHandler('c1', 'c2')} />`
      // exclude `<div className={'c1 c2'} />`
      return !t.isCallExpression(jsxExpr) && !t.isStringLiteral(jsxExpr);
    }
  }

  // code `<div className={['c1', 'c2']} />`
  // to   `<div className={_clsx('c1', 'c2')} />`
  // code `<div className={{ c1: true, c2: true }} />`
  // to   `<div className={_clsx({ c1: true, c2: true })} />`
  function replaceNode(path: NodePath<t.Node>) {
    const { node } = path;
    const args = (
      t.isArrayExpression(node) ? node.elements : [node]
    ) as t.Expression[];
    const callExpr = t.callExpression(callId, args);
    path.replaceWith(callExpr);
  }

  return {
    name: 'clsx',
    inherits: syntaxJSX,

    visitor: {
      Program: {
        enter(path, state) {
          // `@clsx-ignore-global` exists in the header of the file
          state.clsxIgnoreGlobal = isIgnoredGlobal(path.node.body);
        },
        exit(path, state) {
          if (state.clsxImport) {
            // add `import _clsx from 'clsx'`
            path.node.body.unshift(importDecl);
          }
        },
      },

      JSXAttribute(path, state) {
        const { node } = path;
        if (
          isDynamicClassName(node) &&
          !isIgnored(node) &&
          !state.clsxIgnoreGlobal &&
          isNeedTransform((node.value as t.JSXExpressionContainer).expression)
        ) {
          state.clsxImport = true;
          replaceNode(path.get('value').get('expression') as NodePath<t.Node>);
        }
      },
    },
  };
};
