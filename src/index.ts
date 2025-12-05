import type { PluginObj } from '@babel/core';
import { types as t } from '@babel/core';
import syntaxJSX from '@babel/plugin-syntax-jsx';

export interface Options {
  strict?: boolean;
  importName?: string;
  importSource?: string;
}

const IMPORT_SOURCE = 'clsx';
const IMPORT_NAME = 'default';
const LOCAL_NAME = '_clsx';
const LOCAL_NAME_ERROR = `[babel-plugin-clsx]: '${LOCAL_NAME}' is a reserved identifier for clsx import. Do not declare or use '${LOCAL_NAME}' in this file.`;
const CLASS_NAME_STRICT_TOKEN = 'className';
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

  const isClassNameAttr = opts.strict
    ? (name: string) => name === CLASS_NAME_STRICT_TOKEN
    : (name: string) => CLASS_NAME_RE.test(name);

  function shouldTransform(node: t.JSXAttribute | t.JSXSpreadAttribute) {
    if (
      t.isJSXAttribute(node) &&
      t.isJSXIdentifier(node.name) &&
      isClassNameAttr(node.name.name) &&
      t.isJSXExpressionContainer(node.value)
    ) {
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
      Program(path) {
        // Skip the entire file if a `@clsx-ignore-file` comment is present at the top of the file
        if (isIgnored(CLSX_IGNORE_FILE_TOKEN, path.node.body[0]?.leadingComments)) return;

        let importModule = false;

        path.traverse({
          JSXAttribute(attrPath) {
            if (shouldTransform(attrPath.node)) {
              // Skip transformation if `@clsx-ignore-line` comment is present on this JSX attribute
              if (isIgnored(CLSX_IGNORE_LINE_TOKEN, attrPath.node.leadingComments)) return;

              importModule = true;

              // code `<div className={['c1', 'c2']} />`
              // to   `<div className={_clsx('c1', 'c2')} />`
              // code `<div className={{ c1: true, c2: true }} />`
              // to   `<div className={_clsx({ c1: true, c2: true })} />`
              const exprPath = attrPath.get('value.expression');
              const callArgs = (
                t.isArrayExpression(exprPath.node) ? exprPath.node.elements : [exprPath.node]
              ) as t.Expression[];
              const callExpr = t.callExpression(callId, callArgs);
              exprPath.replaceWith(callExpr);
            }
          },
        });

        if (importModule) {
          // Check if `_clsx` is already declared in this file.
          // If so, throw an error pointing directly to its declaration to prevent conflicts
          const existingBinding = path.scope.getBinding(LOCAL_NAME);
          if (existingBinding) {
            throw existingBinding.path.buildCodeFrameError(LOCAL_NAME_ERROR);
          }

          // add `import _clsx from 'clsx'`
          path.unshiftContainer('body', importDecl);
          path.scope.crawl();
        }
      },
    },
  };
};
