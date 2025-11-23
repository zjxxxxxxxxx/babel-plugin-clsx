# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a>

[![CI](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjxxxxxxxxx/babel-plugin-clsx)

<a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>

在 [React](https://react.dev) 中为 `className` 自动添加 [clsx](https://github.com/lukeed/clsx)，无需导入和编写，享受同样的乐趣。

值得注意的是，该库支持使用 `Typescript` 项目。目前尚未发现其他同类库可以做到这一点。

> 在执行此操作之前，请确保已安装 [clsx](https://github.com/lukeed/clsx) 或项目存在其他可用的 `className` 处理程序。

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

添加 [babel](https://babel.dev/docs/plugins) 配置

```json
{
  "plugins": ["clsx"]
}
```

您的代码

```jsx
<div className={['c1', 'c2']} />;
<div className={{ c1: true, c2: true }} />;
```

编译之后

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={_clsx({ c1: true, c2: true })} />;
```

## 选项

options.[ [`static`](#optionsstatic) | [`strict`](#optionsstrict) | [`importSource`](#optionsimportsource) | [`importName`](#optionsimportname) ]

```ts
interface Options {
  /**
   * @default true
   */
  static?: boolean;
  /**
   * @default true
   */
  strict?: boolean;
  /**
   * @default 'clsx'
   */
  importSource?: string;
  /**
   * @default 'default'
   */
  importName?: string;
}
```

### `options.static`

默认情况下，启用静态模式，该模式下仅转换 `array` 和 `object`，有效避免了 `className` 的重复处理。当然，虽然不建议这样做，但你仍然可以关闭此选项，此后，由你来处理或忽略不必要的转换。

添加 [babel](https://babel.dev/docs/plugins) 配置

```json
{
  "plugins": [
    [
      "clsx",
      {
        "static": false
      }
    ]
  ]
}
```

您的代码

```jsx
const className = ['c1', 'c2'];
<div className={className} />;
```

编译之后

```jsx
import _clsx from 'clsx';
const className = ['c1', 'c2'];
<div className={_clsx(className)} />;
```

在现有的项目中，可能有很多这样的代码，如果关闭静态模式，就会有很多重复。

您的代码

```jsx
import classNames from 'clsx';

// 👎 这将重复该过程
const className = classNames('c1', 'c2');
<div className={className} />;

// 👍 这并不重复过程
<div className={classNames('c1', 'c2')} />;
```

编译之后

```jsx
import _clsx from 'clsx';
import classNames from 'clsx';

// 👎 这将重复该过程
const className = classNames('c1', 'c2');
<div className={_clsx(className)} />;

// 👍 这并不重复过程
<div className={classNames('c1', 'c2')} />;
```

### `options.strict`

严格模式默认是开启的，如果你想要为任意以 `className` 为后缀的属性添加 [clsx](https://github.com/lukeed/clsx)，可以关闭该模式。

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
<Component className={['c1', 'c2']} headerClassName={['c1', 'c2']} footerClassName={['c1', 'c2']} />
```

编译之后

```jsx
import _clsx from 'clsx';
<Component
  className={_clsx('c1', 'c2')}
  headerClassName={_clsx('c1', 'c2')}
  footerClassName={_clsx('c1', 'c2')}
/>;
```

### `options.importSource`

[clsx](https://github.com/lukeed/clsx) 是默认支持的库，如果您有其他选择，你可以用 `importSource` 替换它。

添加 [babel](https://babel.dev/docs/plugins) 配置

```json
{
  "plugins": [
    [
      "clsx",
      {
        "importSource": "classnames"
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
import _clsx from 'classnames';
<div className={_clsx('c1', 'c2')} />;
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
        "importSource": "@/utils",
        "importName": "classNames"
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
import { classNames as _clsx } from '@/utils';
<div className={_clsx('c1', 'c2')} />;
```

## 忽略

如果您觉得有不必要的转换，可以添加注释，以便在转换过程中忽略它。

### 局部忽略

您可以通过在上面添加注释来忽略此行的转换。

您的代码

```jsx
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore
  className={['c1', 'c2']}
/>;
```

编译之后

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={['c1', 'c2']} />;
```

### 全局忽略

您可以通过在文件顶部添加注释来省略整个文件的转换。

您的代码

```jsx
// @clsx-ignore-global
<div className={['c1', 'c2']} />;
<div className={['c1', 'c2']} />;
```

编译之后

```jsx
<div className={['c1', 'c2']} />;
<div className={['c1', 'c2']} />;
```

## Typescript

只需要对`tsconfig.json`进行少量修改，即可支持在`Typescript`项目中使用该插件。

- react-jsx

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
    "jsx": "react-jsx",
+   "paths": {
+     "react/jsx-runtime": ["node_modules/babel-plugin-clsx/jsx-runtime"]
+   }
  }
}
```

如果您当前使用的`React`版本缺少`React.JSX`则需添加额外的配置。

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
    "jsx": "react-jsx",
+   "types": ["babel-plugin-clsx/jsx-scope"],
    "paths": {
      "react/jsx-runtime": ["node_modules/babel-plugin-clsx/jsx-runtime"]
    }
  }
}
```

- react-jsxdev

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
    "jsx": "react-jsxdev",
+   "paths": {
+     "react/jsx-dev-runtime": ["node_modules/babel-plugin-clsx/jsx-dev-runtime"]
+   }
  }
}
```

如果您当前使用的`React`版本缺少`React.JSX`则需添加额外的配置。

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
    "jsx": "react-jsx",
+   "types": ["babel-plugin-clsx/jsx-scope"],
    "paths": {
      "react/jsx-dev-runtime": ["node_modules/babel-plugin-clsx/jsx-dev-runtime"]
    }
  }
}
```

## 实例

### react-jsx-v19

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)

### react-jsxdev-v19

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19)

### react-jsx-v17

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)

### react-jsxdev-v17

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17)
