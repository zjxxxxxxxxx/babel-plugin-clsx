import { useState } from 'react';
import reactLogo from '/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [gray, setGray] = useState(false);

  return (
    <div
      className={[
        'main',
        {
          gray,
        },
      ]}
      onClick={() => setGray((v) => !v)}
    >
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img
            src={viteLogo}
            className={['logo', 'babel-plugin-clsx']}
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className={['logo', { react: true }, 'babel-plugin-clsx']}
            alt="React logo"
          />
        </a>
      </div>
      <a href="https://github.com/zjxxxxxxxxx/babel-plugin-clsx">
        <h1>babel-plugin-clsx</h1>
      </a>
      <div className={['card', 'babel-plugin-clsx']}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={['read-the-docs', 'babel-plugin-clsx']}>
        Click on the babel-plugin-clsx to learn more
      </p>
    </div>
  );
}

export default App;
