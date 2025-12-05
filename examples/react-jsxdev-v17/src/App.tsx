import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const scale = !!(count % 2);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className={[
              'logo',
              {
                scale,
              },
            ]}
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className={[
              'logo',
              'react',
              {
                scale,
              },
            ]}
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>react-jsxdev-v17</h2>
      <div
        className={[
          'card',
          {
            scale,
          },
        ]}
      >
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p
        className={[
          'read-the-docs',
          {
            scale,
          },
        ]}
      >
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
