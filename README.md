# babel-plugin-clsx

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
<div className={['c1', 'c2']} />
```

After compilation

```js
import _clsx from 'clsx';
<div className={_clsx(['c1', 'c2'])} />;
```

## Options

### `options.strict`

| Type      | Default value |
| --------- | ------------- |
| `boolean` | `true`        |   

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
  className={_clsx(['c1', 'c2'])}
  headerClassName={_clsx(['c1', 'c2'])}
  footerClassName={_clsx(['c1', 'c2'])}
/>;
```

### `options.importSource`

| Type     | Default value |
| -------- | ------------- |
| `string` | `'clsx'`      |  

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
<div className={_clsx(['c1', 'c2'])} />;
```

### `options.importName`

| Type     | Default value |
| -------- | ------------- |
| `string` | `'default'`   |  

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
<div className={_clsx(['c1', 'c2'])} />;
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
  className={['c1', 'c2'].join(' ')}
/>;
```

After compilation

```js
import _clsx from 'clsx';
<div className={_clsx(['c1', 'c2'])} />;
<div className={['c1', 'c2'].join(' ')} />;
```

### Global ignore

You can omit the conversion of the entire file by adding a comment at the top of the file.

Your code

```js
// @clsx-ignore-global
<div className={['c1', 'c2'].join(' ')} />;
<div className={['c1', 'c2'].join(' ')} />;
```

After compilation

```js
<div className={['c1', 'c2'].join(' ')} />;
<div className={['c1', 'c2'].join(' ')} />;
```
