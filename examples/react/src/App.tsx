import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className={['logo']} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className={['logo', 'react']} alt="React logo" />
        </a>
      </div>
      <a
        href="https://github.com/zjxxxxxxxxx/babel-plugin-clsx#readme"
        target="_blank"
      >
        <h1 className={['title']}>
          <span>Vite</span>
          <span className={['split']}>+</span>
          <span>React</span>
          <span className={['split']}>+</span>
          <span>babel-plugin-clsx</span>
        </h1>
      </a>
      <div className={['card']}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={['read-the-docs']}>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
