# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a>

[![CI](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjxxxxxxxxx/babel-plugin-clsx)

<a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>

Automatically add [clsx](https://github.com/lukeed/clsx) for `className` in [React](https://react.dev) and have the same fun without importing and writing it.

It is important to note that this library supports the use of `Typescript` projects. No other library of its kind has been found to do this.

> Before doing so, make sure that [clsx](https://github.com/lukeed/clsx) is installed or another available `className` handler exists for your project.

## Install

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

## Usage

Add the [babel](https://babel.dev/docs/plugins) configuration

```json
{
  "plugins": ["clsx"]
}
```

Your code

```jsx
<div className={['c1', 'c2']} />;
<div className={{ c1: true, c2: true }} />;
```

After compilation

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={_clsx({ c1: true, c2: true })} />;
```

## Options

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

By default, static mode is enabled, in which only `array` and `object` are converted, effectively avoiding duplicate processing of `className`. Of course, although it is not recommended to do so, you can still turn off this option, and after that, it will be up to you to handle or ignore unnecessary transformations.

Add the [babel](https://babel.dev/docs/plugins) configuration

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

Your code

```jsx
const className = ['c1', 'c2'];
<div className={className} />;
```

After compilation

```jsx
import _clsx from 'clsx';
const className = ['c1', 'c2'];
<div className={_clsx(className)} />;
```

In an existing project, there may be a lot of code like this, and if you turn off static mode, there will be a lot of duplication.

Your code

```jsx
import classNames from 'clsx';

// 👎 This will repeat the process
const className = classNames('c1', 'c2');
<div className={className} />;

// 👍 This does not repeat the process
<div className={classNames('c1', 'c2')} />;
```

After compilation

```jsx
import _clsx from 'clsx';
import classNames from 'clsx';

// 👎 This will repeat the process
const className = classNames('c1', 'c2');
<div className={_clsx(className)} />;

// 👍 This does not repeat the process
<div className={classNames('c1', 'c2')} />;
```

### `options.strict`

Strict mode is turned on by default, and you can turn it off if you want to add [clsx](https://github.com/lukeed/clsx) to any attribute suffixed by `className`.

Add the [babel](https://babel.dev/docs/plugins) configuration

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

Your code

```jsx
<Component className={['c1', 'c2']} headerClassName={['c1', 'c2']} footerClassName={['c1', 'c2']} />
```

After compilation

```jsx
import _clsx from 'clsx';
<Component
  className={_clsx('c1', 'c2')}
  headerClassName={_clsx('c1', 'c2')}
  footerClassName={_clsx('c1', 'c2')}
/>;
```

### `options.importSource`

[clsx](https://github.com/lukeed/clsx) is the supported library by default, and if you have your choice, you can replace it with `importSource`.

Add the [babel](https://babel.dev/docs/plugins) configuration

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

Your code

```jsx
<div className={['c1', 'c2']} />
```

After compilation

```jsx
import _clsx from 'classnames';
<div className={_clsx('c1', 'c2')} />;
```

### `options.importName`

If your custom import source does not have a default export available, you can specify the import name with `importName`.

Add the [babel](https://babel.dev/docs/plugins) configuration

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

Your code

```jsx
<div className={['c1', 'c2']} />
```

After compilation

```jsx
import { classNames as _clsx } from '@/utils';
<div className={_clsx('c1', 'c2')} />;
```

## Ignore

If you feel that there is an unnecessary transformation, you can add a comment so that it is ignored during the transformation.

### Local ignore

You can ignore the conversion of this line by adding a comment above.

Your code

```jsx
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore
  className={['c1', 'c2']}
/>;
```

After compilation

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={['c1', 'c2']} />;
```

### Global ignore

You can omit the conversion of the entire file by adding a comment at the top of the file.

Your code

```jsx
// @clsx-ignore-global
<div className={['c1', 'c2']} />;
<div className={['c1', 'c2']} />;
```

After compilation

```jsx
<div className={['c1', 'c2']} />;
<div className={['c1', 'c2']} />;
```

## Typescript

You only need to make minor changes to `tsconfig.json` to support the use of the plugin in `Typescript` projects.

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

If the React version you are currently using lacks React.JSX, you will need to add additional configuration.

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

If the React version you are currently using lacks React.JSX, you will need to add additional configuration.

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

## Examples

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
