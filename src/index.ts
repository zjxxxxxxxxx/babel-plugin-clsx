import type { BabelFile, NodePath, PluginObj, PluginPass } from '@babel/core';
import { types as t } from '@babel/core';
import syntaxJSX from '@babel/plugin-syntax-jsx';

const CLSX_IGNORE_GLOBAL_TOKEN = '@clsx-ignore-global';
const CLSX_IGNORE_TOKEN = '@clsx-ignore';

const CLASS_NAME_STRICT_RE = /^className$/;
const CLASS_NAME_RE = /^(className|\w+ClassName)$/;

const IMPORT_SOURCE = 'clsx';
const IMPORT_NAME = 'default';
const IMPORT_NAMESPACE = '_clsx';

export interface Options {
  strict?: boolean;
  importSource?: string;
  importName?: string;
}

export default (_: any, opts: Options = {}): PluginObj => {
  opts.strict = typeof opts.strict === 'boolean' ? opts.strict : true;
  opts.importSource = opts.importSource || IMPORT_SOURCE;
  opts.importName = opts.importName || IMPORT_NAME;

  const callId = t.identifier(IMPORT_NAMESPACE);
  // default: _clsx
  // custom:  { importName as _clsx }
  const importSpec =
    opts.importName === IMPORT_NAME
      ? t.importDefaultSpecifier(callId)
      : t.importSpecifier(callId, t.identifier(opts.importName));
  // default: import _clsx form 'clsx'
  // custom:  import _clsx form importSource or import { importName as _clsx } from importSource
  const importDecl = t.importDeclaration(
    [importSpec],
    t.stringLiteral(opts.importSource),
  );

  /*
   * // @clsx-ignore-global
   * <div className={customClsx('c1', 'c2')} />;
   */
  function isIgnoredGlobal(nodes: t.Node[]) {
    return nodes.some((item) => isIgnored(item, CLSX_IGNORE_GLOBAL_TOKEN));
  }

  /*
   * <div
   *  // @clsx-ignore
   *  className={customClsx('c1', 'c2')}
   * />;
   */
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

  const classNameRE = opts.strict ? CLASS_NAME_STRICT_RE : CLASS_NAME_RE;
  function isDynamicClassName(node: t.JSXAttribute) {
    return (
      classNameRE.test(node.name.name as string) &&
      // exclude <div className='...' /> & <div className={'...'} />;
      t.isJSXExpressionContainer(node.value) &&
      !t.isStringLiteral(node.value.expression)
    );
  }

  // add import _clsx from 'clsx'
  function importLibrary(state: PluginPass) {
    if (!state.clsxImported) {
      state.clsxImported = true;

      getFileBody(state.file).unshift(importDecl);
    }
  }

  function getFileBody(file: BabelFile) {
    return file.path.node.body;
  }

  // code <div className={['c1', 'c2']} />;
  // to   <div className={_clsx(['c1', 'c2'])} />;
  function replaceNode(path: NodePath<t.Node>) {
    const callExpr = t.callExpression(callId, [path.node] as Parameters<
      typeof t.callExpression
    >[1]);
    path.replaceWith(callExpr);
  }

  return {
    name: 'clsx',
    inherits: syntaxJSX,

    pre(file) {
      this.clsxIgnoreGlobal = isIgnoredGlobal(getFileBody(file));
    },

    visitor: {
      JSXAttribute(path) {
        if (
          isDynamicClassName(path.node) &&
          !isIgnored(path.node) &&
          !this.clsxIgnoreGlobal
        ) {
          importLibrary(this);
          replaceNode(path.get('value').get('expression') as NodePath<t.Node>);
        }
      },
    },
  };
};
