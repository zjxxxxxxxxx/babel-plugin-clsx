# React

Use `babel-plugin-clsx` in `React`.

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
        plugins: [['clsx', {}]],
      },
    }),
  ],
});
```
