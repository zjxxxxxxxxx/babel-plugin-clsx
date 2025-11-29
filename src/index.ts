import type { PluginObj } from '@babel/core';
import { types as t } from '@babel/core';
import syntaxJSX from '@babel/plugin-syntax-jsx';

export interface Options {
  strict?: boolean;
  importName?: string;
  importSource?: string;
}

const IMPORT_NAME = 'default';
const LOCAL_NAME = '_clsx';
const IMPORT_SOURCE = 'clsx';
const CLASS_NAME_STRICT_RE = /^className$/;
const CLASS_NAME_RE = /^(className|\w+ClassName)$/;
const CLSX_IGNORE_FILE_TOKEN = '@clsx-ignore-file';
const CLSX_IGNORE_LINE_TOKEN = '@clsx-ignore-line';

export default (_: unknown, opts: Options = {}) => {
  opts.strict ??= true;
  opts.importName ??= IMPORT_NAME;
  opts.importSource ??= IMPORT_SOURCE;

  const callId = t.identifier(LOCAL_NAME);
  // default: `import _clsx form 'clsx'`
  // custom:  `import _clsx form '${importSource}'` or `import { ${importName} as _clsx } from '${importSource}'`
  const importDecl = t.importDeclaration(
    [
      opts.importName === IMPORT_NAME
        ? t.importDefaultSpecifier(callId)
        : t.importSpecifier(callId, t.identifier(opts.importName)),
    ],
    t.stringLiteral(opts.importSource),
  );

  function isIgnored(token: string, comments?: t.Comment[] | null) {
    return comments ? comments.some((comment) => comment.value.trim().startsWith(token)) : false;
  }

  const classNameRE = opts.strict ? CLASS_NAME_STRICT_RE : CLASS_NAME_RE;
  function shouldTransform(node: t.JSXAttribute) {
    if (classNameRE.test(node.name.name as string) && t.isJSXExpressionContainer(node.value)) {
      // include `<div className={['c1', 'c2']} />`
      // include `<div className={{ c1: true, c2: true }} />`
      const jsxExpr = node.value.expression;
      return t.isArrayExpression(jsxExpr) || t.isObjectExpression(jsxExpr);
    }
    return false;
  }

  return <PluginObj>{
    name: 'clsx',
    inherits: syntaxJSX,

    visitor: {
      Program: {
        enter(path, state) {
          state.clsxImportModule = false;

          // `@clsx-ignore-file` exists in the header of the file
          const firstNode = path.node.body[0];
          state.clsxIgnoreFile = isIgnored(CLSX_IGNORE_FILE_TOKEN, firstNode?.leadingComments);
        },
        exit(path, state) {
          if (state.clsxImportModule) {
            // add `import _clsx from 'clsx'`
            const reversedPaths = path.get('body').reverse();
            const importPath = reversedPaths.find((itemPath) =>
              t.isImportDeclaration(itemPath.node),
            );
            if (importPath) {
              importPath.insertAfter(importDecl);
            } else {
              path.unshiftContainer('body', importDecl);
            }
          }
        },
      },

      JSXAttribute(path, state) {
        const { node } = path;
        if (
          !state.clsxIgnoreFile &&
          !isIgnored(CLSX_IGNORE_LINE_TOKEN, node.leadingComments) &&
          shouldTransform(node)
        ) {
          state.clsxImportModule = true;

          // code `<div className={['c1', 'c2']} />`
          // to   `<div className={_clsx('c1', 'c2')} />`
          // code `<div className={{ c1: true, c2: true }} />`
          // to   `<div className={_clsx({ c1: true, c2: true })} />`
          const exprPath = path.get('value').get('expression');
          const callArgs = (
            t.isArrayExpression(exprPath.node) ? exprPath.node.elements : [exprPath.node]
          ) as t.Expression[];
          const callExpr = t.callExpression(callId, callArgs);
          exprPath.replaceWith(callExpr);
        }
      },
    },
  };
};
