# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a>

[![CI](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjxxxxxxxxx/babel-plugin-clsx)

<a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>

一个专为 `React` 设计的 `className` 语法糖插件，编译时会自动将 `JSX` 中的静态 `array` 或 `object` 形式的 `className` 转换为 [clsx](https://github.com/lukeed/clsx) 调用，无需手动导入或书写，轻松管理样式组合。

> 在执行此操作之前，请确保已安装 [clsx](https://github.com/lukeed/clsx) 或项目存在其他可用的 `className` 处理程序。

## 特点

- 🔌 自动注入 `clsx`，免去重复导入。
- ⚙️ 可自定义导入：`importName` / `importSource`，灵活适配各种项目。
- 🧩 `strict` 模式可匹配 `*ClassName`，适合组件库/设计系统约定。
- 🎨 统一团队 `className` 书写风格。
- 🎯 支持 `@clsx-ignore-line` 和 `@clsx-ignore-file`，精确控制转换。
- 💠 与 `TailwindCSS` 高度契合，数组方便按语义、断点、状态组织 Utility 类。
- 📚 完全支持 `TypeScript` 与 `React JSX runtime`（React >= 17 / TS >= 4.1）。

## 安装

npm

```bash
npm i babel-plugin-clsx -D
```

yarn

```bash
yarn add babel-plugin-clsx -D
```

pnpm

```bash
pnpm add babel-plugin-clsx -D
```

## 使用

添加 [Babel](https://babel.dev/docs/plugins) 配置，使 `className` 为静态 `array` 或静态 `object` 时自动应用 `clsx`。

```json
{
  "plugins": ["clsx"]
}
```

您的代码

```jsx
<div className={['c1', 'c2']} />;
<div className={{ c3: true, c4: true }} />;
```

编译之后

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={_clsx({ c3: true, c4: true })} />;
```

如果您希望变量值也能被自动应用 `clsx`，请将其放入静态 `array` 中。

您的代码

```jsx
const cs1 = ['c1', 'c2'];
const cs2 = { c3: true, c4: true };
<div className={[cs1]} />;
<div className={[cs2]} />;
<div className={[handler('c5', 'c6')]} />;
```

编译之后

```jsx
import _clsx from 'clsx';
const cs1 = ['c1', 'c2'];
const cs2 = { c3: true, c4: true };
<div className={_clsx(cs1)} />;
<div className={_clsx(cs2)} />;
<div className={_clsx(handler('c5', 'c6'))} />;
```

## 选项

options.[ [`strict`](#optionsstrict) | [`importName`](#optionsimportname) | [`importSource`](#optionsimportsource) ]

```ts
interface Options {
  /**
   * @default true
   */
  strict?: boolean;
  /**
   * @default 'default'
   */
  importName?: string;
  /**
   * @default 'clsx'
   */
  importSource?: string;
}
```

### `options.strict`

严格模式默认是开启的，如果您想要为任意以 `className` 为后缀的属性添加 [clsx](https://github.com/lukeed/clsx)，可以关闭该模式。

添加 [babel](https://babel.dev/docs/plugins) 配置

```json
{
  "plugins": [
    [
      "clsx",
      {
        "strict": false
      }
    ]
  ]
}
```

您的代码

```jsx
<Component className={['c1', 'c2']} headerClassName={['c3', 'c4']} footerClassName={['c5', 'c6']} />
```

编译之后

```jsx
import _clsx from 'clsx';
<Component
  className={_clsx('c1', 'c2')}
  headerClassName={_clsx('c3', 'c4')}
  footerClassName={_clsx('c5', 'c6')}
/>;
```

### `options.importName`

如果您的自定义导入源没有可用的默认导出，您可以使用 `importName` 指定导入名称。

添加 [babel](https://babel.dev/docs/plugins) 配置

```json
{
  "plugins": [
    [
      "clsx",
      {
        "importName": "customClsx"
      }
    ]
  ]
}
```

您的代码

```jsx
<div className={['c1', 'c2']} />
```

编译之后

```jsx
import { customClsx as _clsx } from 'clsx';
<div className={_clsx('c1', 'c2')} />;
```

### `options.importSource`

[clsx](https://github.com/lukeed/clsx) 是默认支持的库，如果您有其他选择，您可以用 `importSource` 替换它。

添加 [babel](https://babel.dev/docs/plugins) 配置

```json
{
  "plugins": [
    [
      "clsx",
      {
        "importSource": "@/utils/custom-clsx"
      }
    ]
  ]
}
```

您的代码

```jsx
<div className={['c1', 'c2']} />
```

编译之后

```jsx
import _clsx from '@/utils/custom-clsx';
<div className={_clsx('c1', 'c2')} />;
```

## 忽略

如果您觉得有不必要的转换，可以添加注释，以便在转换过程中忽略它。

### 忽略行

您可以通过在上面添加注释来忽略此行的转换。

您的代码

```jsx
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore-line
  className={['c3', 'c4']}
/>;
```

编译之后

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div
  // @clsx-ignore-line
  className={['c3', 'c4']}
/>;
```

### 忽略文件

您可以通过在文件顶部添加注释来省略整个文件的转换。

您的代码

```jsx
// @clsx-ignore-file
<div className={['c1', 'c2']} />;
<div className={['c3', 'c4']} />;
```

编译之后

```jsx
// @clsx-ignore-file
<div className={['c1', 'c2']} />;
<div className={['c3', 'c4']} />;
```

## TypeScript 配置

> ⚠️ 为了在 TypeScript 项目中使用 `babel-plugin-clsx`，要求 React >= 17 和 TypeScript >= 4.1。  
> 需要在 `tsconfig.json` 中进行少量配置，让 TypeScript 正确识别插件提供的 JSX 支持。

### JSX Runtime 路径映射

为确保 `babel-plugin-clsx` 在 TS 项目中正常工作，需要在 `compilerOptions.paths` 中配置对应的 JSX runtime。

| jsx 配置值       | paths 配置                                                                    | 适用场景                                            |
| ---------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| `"react"`        | `"react": ["node_modules/babel-plugin-clsx/react"]`                           | 传统 JSX runtime，适用于 `jsx: react`               |
| `"react-jsx"`    | `"react/jsx-runtime": ["node_modules/babel-plugin-clsx/jsx-runtime"]`         | 新 JSX 转换，适用于 `jsx: react-jsx`                |
| `"react-jsxdev"` | `"react/jsx-dev-runtime": ["node_modules/babel-plugin-clsx/jsx-dev-runtime"]` | 新 JSX 转换（开发模式），适用于 `jsx: react-jsxdev` |

### 全局 JSX 转局部 JSX（React.JSX shim）

如果项目中仅存在全局 `JSX`，需要将 `globalThis.JSX` 转为局部 `React.JSX`，以便 TypeScript 正确识别：

```diff
{
  "compilerOptions": {
+   "types": ["babel-plugin-clsx/jsx-scope"]
  }
}
```

### 补充缺少的 react/index 路径

如果项目缺少 `'react/index'` 路径，请补充：

```diff
{
  "compilerOptions": {
    "paths": {
+     "react/index": ["node_modules/@types/react/index"]
    }
  }
}
```

## 示例

| 版本类型         | 源代码                                                                                                                                                                                                          | 在线试玩                                                                                                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react-v19        | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)        | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)        |
| react-jsx-v19    | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)    | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)    |
| react-jsxdev-v19 | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19) |
| react-v17        | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)        | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)        |
| react-jsx-v17    | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)    | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)    |
| react-jsxdev-v17 | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17) |
