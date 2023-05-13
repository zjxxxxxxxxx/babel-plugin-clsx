import type { NodePath, PluginObj, PluginPass } from '@babel/core';
import syntaxJSX from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';

const CLASS_NAME = 'className';
const CLSX_IGNORE = '@clsx-ignore';
const DEFAULT_SOURCE = 'clsx';
const DEFAULT_NAME = 'default';

export interface Options {
  importSource?: string;
  importName?: string;
}

export default (_: any, opts: Options = {}): PluginObj => {
  opts.importSource = opts.importSource || DEFAULT_SOURCE;
  opts.importName = opts.importName || DEFAULT_NAME;

  const callId = t.identifier('clsx_');
  // default: clsx_
  // custom:  { name as clsx_ }
  const importId =
    opts.importName === DEFAULT_NAME
      ? t.importDefaultSpecifier(callId)
      : t.importSpecifier(callId, t.identifier(opts.importName));
  // default: import clsx_ form 'clsx'
  // custom:  import clsx_ form 'source' or import { name as clsx_ } from 'source'
  const importDecl = t.importDeclaration(
    [importId],
    t.stringLiteral(opts.importSource),
  );

  function isDynamicClassName(node: t.JSXAttribute) {
    return (
      node.name.name === CLASS_NAME &&
      // exclude <div className='...'></div> <div className={'...'}></div>
      t.isJSXExpressionContainer(node.value) &&
      !t.isStringLiteral(node.value.expression)
    );
  }

  function isIgnored(node: t.JSXAttribute) {
    return node.leadingComments
      ? node.leadingComments.some(
          (comment) => comment.value.trim() === CLSX_IGNORE,
        )
      : false;
  }

  // add import clsx_ from 'clsx'
  function importLibrary(state: PluginPass) {
    if (!state.imported) {
      state.imported = true;
      state.file.path.node.body.unshift(importDecl);
    }
  }

  // original <div className={['className1', 'className2']}></div>
  // to       <div className={clsx_(['className1', 'className2'])}></div>
  function replaceNode(path: NodePath<t.Node>) {
    const callExpr = t.callExpression(callId, [path.node] as Parameters<
      typeof t.callExpression
    >[1]);
    path.replaceWith(callExpr);
  }

  return {
    name: 'transform-clsx',
    inherits: syntaxJSX,

    visitor: {
      JSXAttribute(path) {
        if (isDynamicClassName(path.node) && !isIgnored(path.node)) {
          importLibrary(this);
          replaceNode(path.get('value').get('expression') as NodePath<t.Node>);
        }
      },
    },
  };
};
