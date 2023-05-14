import type { BabelFile, NodePath, PluginObj, PluginPass } from '@babel/core';
import syntaxJSX from '@babel/plugin-syntax-jsx';
import { types as t } from '@babel/core';

const CLASS_NAME_STRICT_RE = /^className$/;
const CLASS_NAME_COMMON_RE = /^(className|\w+ClassName)$/;
const CLSX_IGNORE_GLOBAL = '@clsx-ignore-global';
const CLSX_IGNORE = '@clsx-ignore';
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
  // default: clsx_
  // custom:  { importName as clsx_ }
  const importId =
    opts.importName === IMPORT_NAME
      ? t.importDefaultSpecifier(callId)
      : t.importSpecifier(callId, t.identifier(opts.importName));
  // default: import clsx_ form 'clsx'
  // custom:  import clsx_ form importSource or import { importName as clsx_ } from importSource
  const importDecl = t.importDeclaration(
    [importId],
    t.stringLiteral(opts.importSource),
  );

  function getFileBody(file: BabelFile) {
    return file.path.node.body;
  }

  const classNameRE = opts.strict ? CLASS_NAME_STRICT_RE : CLASS_NAME_COMMON_RE;
  function isDynamicClassName(node: t.JSXAttribute) {
    return (
      classNameRE.test(node.name.name as string) &&
      // exclude <div className='...' /> & <div className={'...'} />
      t.isJSXExpressionContainer(node.value) &&
      !t.isStringLiteral(node.value.expression)
    );
  }

  /*
   * <div
   *  // @clsx-ignore
   *  className={customClsx('c1', 'c2')}
   * />
   */
  function isIgnored(node: t.Node, content = CLSX_IGNORE) {
    return node.leadingComments
      ? node.leadingComments.some((comment) => {
          const ignored = comment.value.trim() === content;
          comment.ignore = true;
          return ignored;
        })
      : false;
  }

  function isIgnoredGlobal(nodes: t.Node[]) {
    return nodes.some((item) => isIgnored(item, CLSX_IGNORE_GLOBAL));
  }

  // add import clsx_ from 'clsx'
  function importLibrary(state: PluginPass) {
    if (!state.imported) {
      state.imported = true;
      getFileBody(state.file).unshift(importDecl);
    }
  }

  // original <div className={['className1', 'className2']} />
  // to       <div className={clsx_(['className1', 'className2'])} />
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
      this.ignoreGlobal = isIgnoredGlobal(getFileBody(file));
    },

    visitor: {
      JSXAttribute(path) {
        if (
          isDynamicClassName(path.node) &&
          !isIgnored(path.node) &&
          !this.ignoreGlobal
        ) {
          importLibrary(this);
          replaceNode(path.get('value').get('expression') as NodePath<t.Node>);
        }
      },
    },
  };
};
