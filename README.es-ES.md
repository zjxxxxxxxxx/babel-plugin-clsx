

# babel-plugin-clsx <a href='https://www.npmjs.com/package/babel-plugin-clsx'><img alt="npm" src="https://img.shields.io/npm/v/babel-plugin-clsx?style=social"></a>

[![CI](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml/badge.svg)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/actions/workflows/ci.yml) ![GitHub](https://img.shields.io/github/license/zjxxxxxxxxx/babel-plugin-clsx)

<a href="./README.md">English</a> | <a href="./README.zh-CN.md">简体中文</a>

Un plugin de azúcar sintáctica para `className` diseñado para `React` que convierte automáticamente las expresiones estáticas en `array` u `object` de `className` en `JSX` en llamadas a [clsx](https://github.com/lukeed/clsx) en tiempo de compilación, eliminando la necesidad de importaciones o escritura manual y facilitando la composición de estilos.

> Antes de hacerlo, asegúrate de que [clsx](https://github.com/lukeed/clsx) esté instalado o que exista otro `manejador` de `className` disponible para tu proyecto.

## Características

- 🔌 Inyecta automáticamente `clsx`, eliminando la necesidad de importaciones repetidas.
- ⚙️ Importaciones personalizables: soporta `importName` / `importSource`, adaptable a diversas configuraciones de proyecto.
- 🧩 El modo `strict` puede coincidir con atributos `*ClassName`, ideal para bibliotecas de componentes o convenciones de sistemas de diseño.
- 🎨 Unifica el formato de `className` del equipo.
- 🎯 Soporta `@clsx-ignore-line` y `@clsx-ignore-file` para un control preciso sobre las transformaciones.
- 💠 Amigable con `TailwindCSS`: los arrays organizan naturalmente las clases de utilidad por semántica, puntos de ruptura y estados.
- 📚 Totalmente compatible con `TypeScript` y el `Runtime JSX de React` (React >= 17 / TS >= 4.1).

## Instalación

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

## Uso

Añade una configuración de [Babel](https://babel.dev/docs/plugins) para aplicar automáticamente `clsx` cuando `className` sea un `array` o un `object` estático.

```json
{
  "plugins": ["clsx"]
}
```

Tu código

```jsx
<div className={['c1', 'c2']} />;
<div className={{ c1: true, c2: true }} />;
```

Después de la compilación

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div className={_clsx({ c1: true, c2: true })} />;
```

Si deseas que los valores de las variables se apliquen automáticamente con `clsx`, colócalos dentro de un `array` estático.

Tu código

```jsx
const cs1 = ['c1', 'c2'];
const cs2 = { c3: true, c4: true };
<div className={[cs1]} />;
<div className={[cs2]} />;
<div className={[handler('c5', 'c6')]} />;
```

Después de la compilación

```jsx
import _clsx from 'clsx';
const cs1 = ['c1', 'c2'];
const cs2 = { c3: true, c4: true };
<div className={_clsx(cs1)} />;
<div className={_clsx(cs2)} />;
<div className={_clsx(handler('c5', 'c6'))} />;
```

## Opciones

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

El modo estricto está activado por defecto y puedes desactivarlo si deseas aplicar [clsx](https://github.com/lukeed/clsx) a cualquier atributo que termine con `className`.

Añade la configuración de [babel](https://babel.dev/docs/plugins)

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

Tu código

```jsx
<Component className={['c1', 'c2']} headerClassName={['c3', 'c4']} footerClassName={['c5', 'c6']} />
```

Después de la compilación

```jsx
import _clsx from 'clsx';
<Component
  className={_clsx('c1', 'c2')}
  headerClassName={_clsx('c3', 'c4')}
  footerClassName={_clsx('c5', 'c6')}
/>;
```

### `options.importName`

Si tu fuente de importación personalizada no tiene una exportación por defecto disponible, puedes especificar el nombre de importación con `importName`.

Añade la configuración de [babel](https://babel.dev/docs/plugins)

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

Tu código

```jsx
<div className={['c1', 'c2']} />
```

Después de la compilación

```jsx
import { customClsx as _clsx } from 'clsx';
<div className={_clsx('c1', 'c2')} />;
```

### `options.importSource`

[clsx](https://github.com/lukeed/clsx) es la biblioteca predeterminada compatible, pero puedes usar `importSource` para reemplazarla con otra biblioteca si es necesario.

Añade la configuración de [babel](https://babel.dev/docs/plugins)

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

Tu código

```jsx
<div className={['c1', 'c2']} />
```

Después de la compilación

```jsx
import _clsx from '@/utils/custom-clsx';
<div className={_clsx('c1', 'c2')} />;
```

## Ignorar

Si consideras que hay una transformación innecesaria, puedes añadir un comentario para que sea ignorado durante la transformación.

### Ignorar línea

Puedes ignorar la conversión de esta línea añadiendo un comentario encima.

Tu código

```jsx
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore-line
  className={['c3', 'c4']}
/>;
```

Después de la compilación

```jsx
import _clsx from 'clsx';
<div className={_clsx('c1', 'c2')} />;
<div
  // @clsx-ignore-line
  className={['c3', 'c4']}
/>;
```

### Ignorar archivo

Puedes omitir la conversión de todo el archivo añadiendo un comentario al inicio del mismo.

Tu código

```jsx
// @clsx-ignore-file
<div className={['c1', 'c2']} />;
<div className={['c3', 'c4']} />;
```

Después de la compilación

```jsx
// @clsx-ignore-file
<div className={['c1', 'c2']} />;
<div className={['c3', 'c4']} />;
```

## Configuración de TypeScript

> ⚠️ Para usar `babel-plugin-clsx` en un proyecto de TypeScript, se requiere React >= 17 y TypeScript >= 4.1.  
> Se necesitan algunos ajustes en `tsconfig.json` para asegurar que TypeScript reconozca el soporte de JSX proporcionado por el plugin.

### Mapeo de rutas del Runtime JSX

Para que `babel-plugin-clsx` funcione correctamente en un proyecto de TypeScript, configura el runtime JSX correspondiente en `compilerOptions`.

| Ajuste de JSX      | Configuración de rutas                                                           | Caso de uso                                                      |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `"react"`        | `"react": ["node_modules/babel-plugin-clsx/react"]`                           | Runtime JSX clásico, para `jsx: react`                         |
| `"react-jsx"`    | `"react/jsx-runtime": ["node_modules/babel-plugin-clsx/jsx-runtime"]`         | Nueva transformación JSX, para `jsx: react-jsx`                       |
| `"react-jsxdev"` | `"react/jsx-dev-runtime": ["node_modules/babel-plugin-clsx/jsx-dev-runtime"]` | Nueva transformación JSX (modo desarrollo), para `jsx: react-jsxdev` |

### Conversión de JSX global a JSX local (shim de React.JSX)

Si tu proyecto solo tiene definiciones de `JSX` globales, necesitas mapear `globalThis.JSX` a `React.JSX` local para que TypeScript pueda reconocerlo correctamente:

```diff
{
  "compilerOptions": {
+   "types": ["babel-plugin-clsx/jsx-scope"]
  }
}
```

### Adición de la ruta `react/index` que falta

Si a tu proyecto le falta la ruta `'react/index'`, añádela de la siguiente manera:

```diff
{
  "compilerOptions": {
    "paths": {
+     "react/index": ["node_modules/@types/react/index"]
    }
  }
}
```

## Ejemplos

| Tipo de versión     | Código fuente                                                                                                                                                                                                     | Demo en vivo                                                                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| react-v19        | [![Abrir en GitHub](https://img.shields.io/badge/Abrir%20en-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)        | [![Abrir en StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v19)        |
| react-jsx-v19    | [![Abrir en GitHub](https://img.shields.io/badge/Abrir%20en-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)    | [![Abrir en StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v19)    |
| react-jsxdev-v19 | [![Abrir en GitHub](https://img.shields.io/badge/Abrir%20en-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19) | [![Abrir en StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v19) |
| react-v17        | [![Abrir en GitHub](https://img.shields.io/badge/Abrir%20en-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)        | [![Abrir en StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-v17)        |
| react-jsx-v17    | [![Abrir en GitHub](https://img.shields.io/badge/Abrir%20en-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)    | [![Abrir en StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsx-v17)    |
| react-jsxdev-v17 | [![Abrir en GitHub](https://img.shields.io/badge/Abrir%20en-GitHub-24292F?logo=github&logoColor=white&style=for-the-badge)](https://github.com/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17) | [![Abrir en StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/zjxxxxxxxxx/babel-plugin-clsx/tree/main/examples/react-jsxdev-v17) |
