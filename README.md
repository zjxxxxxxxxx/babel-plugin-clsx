# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a>

[![CI](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjxxxxxxxxx/babel-plugin-clsx)

<a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>

Automatically add [clsx](https://github.com/lukeed/clsx) for `className` in [React](https://react.dev) and have the same fun without importing and writing it.

Notably, this library supports usage in TypeScript projects. So far, no other similar library has been found to offer this.

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

Add a [Babel](https://babel.dev/docs/plugins) configuration to automatically apply `clsx` when `className` is a static `array` or static `object`.

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

If you want variable values to be automatically applied with `clsx`, place them in a static `array`.

Your code

```jsx
const cs1 = ['c1', 'c2'];
const cs2 = { c3: true, c4: true };
<div className={[cs1]} />;
<div className={[cs2]} />;
<div className={[handler('c5', 'c6')]} />;
```

After compilation

```jsx
import _clsx from 'clsx';
const cs1 = ['c1', 'c2'];
const cs2 = { c3: true, c4: true };
<div className={_clsx(cs1)} />;
<div className={_clsx(cs2)} />;
<div className={_clsx(handler('c5', 'c6'))} />;
```

## Options

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
<Component className={['c1', 'c2']} headerClassName={['c3', 'c4']} footerClassName={['c5', 'c6']} />
```

After compilation

```jsx
import _clsx from 'clsx';
<Component
  className={_clsx('c1', 'c2')}
  headerClassName={_clsx('c3', 'c4')}
  footerClassName={_clsx('c5', 'c6')}
/>;
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
        "importName": "customClsx"
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
import { customClsx as _clsx } from 'clsx';
<div className={_clsx('c1', 'c2')} />;
```

### `options.importSource`

[clsx](https://github.com/lukeed/clsx) is the default supported library. If you prefer a different one, you may replace it using the `importSource` option.

Add the [babel](https://babel.dev/docs/plugins) configuration

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

Your code

```jsx
<div className={['c1', 'c2']} />
```

After compilation

```jsx
import _clsx from '@/utils/custom-clsx';
<div className={_clsx('c1', 'c2')} />;
```

## Ignore

If you feel that there is an unnecessary transformation, you can add a comment so that it is ignored during the transformation.

### Ignore line

You can ignore the conversion of this line by adding a comment above.

Your code

```jsx
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore-line
  className={['c3', 'c4']}
/>;
```

After compilation

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div
  // @clsx-ignore-line
  className={['c3', 'c4']}
/>;
```

### Ignore file

You can omit the conversion of the entire file by adding a comment at the top of the file.

Your code

```jsx
// @clsx-ignore-file
<div className={['c1', 'c2']} />;
<div className={['c3', 'c4']} />;
```

After compilation

```jsx
// @clsx-ignore-file
<div className={['c1', 'c2']} />;
<div className={['c3', 'c4']} />;
```

## Typescript

> ⚠️ **Minimum Requirements**  
> To use this plugin in a TypeScript project, you need **React 17** and **TypeScript 4.1** at minimum, as this combination officially supports the `React.JSX` namespace.

A few small adjustments to your `tsconfig.json` are all that’s needed to enable support.

### jsx: react

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
+   "jsx": "react",
+   "paths": {
+     "react": ["node_modules/babel-plugin-clsx/react"]
+   }
  }
}
```

### jsx: react-jsx

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
+   "jsx": "react-jsx",
+   "paths": {
+     "react/jsx-runtime": ["node_modules/babel-plugin-clsx/jsx-runtime"]
+   }
  }
}
```

### jsx: react-jsxdev

```diff
{
  "compilerOptions": {
    "baseUrl": "./",
+   "jsx": "react-jsxdev",
+   "paths": {
+     "react/jsx-dev-runtime": ["node_modules/babel-plugin-clsx/jsx-dev-runtime"]
+   }
  }
}
```

### React.JSX

If your current version of `React` only supports the global `JSX` namespace, please add the following configuration to map `globalThis.JSX` to `React.JSX`.

```diff
{
  "compilerOptions": {
+   "types": ["babel-plugin-clsx/jsx-scope"],
  }
}
```

### react/index

If your current version of `React` is missing the `react/index` path, please add the additional configuration.

```diff
{
  "compilerOptions": {
    "paths": {
+     "react/index": ["node_modules/@types/react/index"]
    }
  }
}
```

## Examples

### react-v19

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)

### react-jsx-v19

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)

### react-jsxdev-v19

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19)

### react-v17

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)

### react-jsx-v17

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)

### react-jsxdev-v17

- [Source](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17)
- [StackBlitz](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17)
