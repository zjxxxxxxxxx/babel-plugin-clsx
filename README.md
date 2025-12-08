# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a>

[![CI](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjxxxxxxxxx/babel-plugin-clsx)

<a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>

A `className` syntax-sugar plugin designed for `React` that automatically converts static `array` or `object` forms of `className` in `JSX` into [clsx](https://github.com/lukeed/clsx) calls at compile time, eliminating the need for manual imports or writing, and making style composition effortless.

> Before doing so, make sure that [clsx](https://github.com/lukeed/clsx) is installed or another available `className` handler exists for your project.

## Features

- 🔌 Automatically injects `clsx`, removing the need for repeated imports.
- ⚙️ Customizable imports: supports `importName` / `importSource`, adaptable to various project setups.
- 🧩 `strict` mode can match `*ClassName` attributes, ideal for component libraries or design system conventions.
- 🎨 Unifies team `className` formatting.
- 🎯 Supports `@clsx-ignore-line` and `@clsx-ignore-file` for precise control over transformations.
- 💠 `TailwindCSS` friendly: arrays naturally organize utility classes by semantics, breakpoints, and states.
- 📚 Fully compatible with `TypeScript` and `React JSX runtime` (React >= 17 / TS >= 4.1).

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

[clsx](https://github.com/lukeed/clsx) is the default supported library, but you can use `importSource` to substitute it with another library if needed.

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

## TypeScript Configuration

> ⚠️ To use `babel-plugin-clsx` in a TypeScript project, React >= 17 and TypeScript >= 4.1 are required.  
> A few adjustments in `tsconfig.json` are needed to ensure TypeScript recognizes the JSX support provided by the plugin.

### JSX Runtime Path Mapping

To make `babel-plugin-clsx` work correctly in a TypeScript project, configure the corresponding JSX runtime in `compilerOptions.paths`.

| JSX Setting      | Paths Configuration                                                           | Use Case                                                      |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `"react"`        | `"react": ["node_modules/babel-plugin-clsx/react"]`                           | Classic JSX runtime, for `jsx: react`                         |
| `"react-jsx"`    | `"react/jsx-runtime": ["node_modules/babel-plugin-clsx/jsx-runtime"]`         | New JSX transform, for `jsx: react-jsx`                       |
| `"react-jsxdev"` | `"react/jsx-dev-runtime": ["node_modules/babel-plugin-clsx/jsx-dev-runtime"]` | New JSX transform (development mode), for `jsx: react-jsxdev` |

### Converting Global JSX to Local JSX (React.JSX shim)

If your project only has global `JSX` definitions, you need to map the `globalThis.JSX` to the local `React.JSX` so that TypeScript can correctly recognize it:

```diff
{
  "compilerOptions": {
+   "types": ["babel-plugin-clsx/jsx-scope"]
  }
}
```

### Adding Missing react/index Path

If your project is missing the `'react/index'` path, add it as follows:

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

| Version Type     | Source Code                                                                                                                                                                                                     | Live Demo                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react-v19        | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)        | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)        |
| react-jsx-v19    | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)    | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)    |
| react-jsxdev-v19 | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19) |
| react-v17        | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)        | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)        |
| react-jsx-v17    | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)    | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)    |
| react-jsxdev-v17 | [![Open in GitHub](https://img.shields.io/badge/Open%20in-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17) | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17) |
