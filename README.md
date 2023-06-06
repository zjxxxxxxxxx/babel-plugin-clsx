# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a> 

[![CI](https://github.com/zjx0905/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjx0905/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjx0905/babel-plugin-clsx)

Automatically adds [clsx](https://github.com/lukeed/clsx) for `className`, You can enjoy the joy of importing without importing.

> Before doing so, make sure that [clsx](https://github.com/lukeed/clsx) is installed or another available `className` handler exists for your project.

## Install

npm

```bash
npm i --save-dev babel-plugin-clsx
```

yarn

```bash
yarn add --save-dev babel-plugin-clsx
```

pnpm

```bash
pnpm add --save-dev babel-plugin-clsx
```

## Usage

Add the [babel](https://babel.dev/docs/plugins) configuration

```json
{
  "plugins": ["clsx"]
}
```

Your code

```js
<div className={['c1', 'c2']} />;
<div className={{ c1: true, c2: true }} />;
```

After compilation

```js
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={_clsx({ c1: true, c2: true })} />;
```

## Options

### `options.static`

| Type      | Default |
| --------- | ------- |
| `boolean` | `true`  |

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

```js
const className = ['c1', 'c2'];
<div className={className} />;
```

After compilation

```js
import _clsx from 'clsx';
const className = ['c1', 'c2'];
<div className={_clsx(className)} />;
```

In an existing project, there may be a lot of code like this, and if you turn off static mode, there will be a lot of duplication.

Your code

```js
import classNames from 'clsx';

// 👎 This will repeat the process
const className = classNames('c1', 'c2');
<div className={className} />;

// 👍 This does not repeat the process
<div className={classNames('c1', 'c2')} />;
```

After compilation

```js
import _clsx from 'clsx';
import classNames from 'clsx';

// 👎 This will repeat the process
const className = classNames('c1', 'c2');
<div className={_clsx(className)} />;

// 👍 This does not repeat the process
<div className={classNames('c1', 'c2')} />;
```

### `options.strict`

| Type      | Default |
| --------- | ------- |
| `boolean` | `true`  |

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

```js
<Component
  className={['c1', 'c2']}
  headerClassName={['c1', 'c2']}
  footerClassName={['c1', 'c2']}
/>
```

After compilation

```js
import _clsx from 'clsx';
<Component
  className={_clsx('c1', 'c2')}
  headerClassName={_clsx('c1', 'c2')}
  footerClassName={_clsx('c1', 'c2')}
/>;
```

### `options.importSource`

| Type     | Default  |
| -------- | -------- |
| `string` | `'clsx'` |

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

```js
<div className={['c1', 'c2']} />
```

After compilation

```js
import _clsx from 'classnames';
<div className={_clsx('c1', 'c2')} />;
```

### `options.importName`

| Type     | Default     |
| -------- | ----------- |
| `string` | `'default'` |

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

```js
<div className={['c1', 'c2']} />
```

After compilation

```js
import { classNames as _clsx } from '@/utils';
<div className={_clsx('c1', 'c2')} />;
```

## Ignore

If you feel that there is an unnecessary transformation, you can add a comment so that it is ignored during the transformation.

### Local ignore

You can ignore the conversion of this line by adding a comment above.

Your code

```js
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore
  className={['c1', 'c2']}
/>;
```

After compilation

```js
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={['c1', 'c2']} />;
```

### Global ignore

You can omit the conversion of the entire file by adding a comment at the top of the file.

Your code

```js
// @clsx-ignore-global
<div className={['c1', 'c2']} />;
<div className={['c1', 'c2']} />;
```

After compilation

```js
<div className={['c1', 'c2']} />;
<div className={['c1', 'c2']} />;
```


## Typescript

You only need to make minor changes to `tsconfig.json` to support the use of the plug-in in `Typescript` projects.

react-jsxdev

```json
{
  "compilerOptions": {
    "jsx": "react-jsxdev",
    "jsxImportSource": "babel-plugin-clsx/react"
  }
}
```

react-jsx

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "babel-plugin-clsx/react"
  }
}
```