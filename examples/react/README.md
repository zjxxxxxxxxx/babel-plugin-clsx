# React

Use `babel-plugin-clsx` in `React`.

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

## Configuration

vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['clsx']],
      },
    }),
  ],
});
```
