import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const bgColor = !!(count % 2);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className={[
              'logo',
              {
                'bg-color': bgColor,
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
                'bg-color': bgColor,
              },
            ]}
            alt="React logo"
          />
        </a>
      </div>
      <h1
        className={{
          'bg-color': bgColor,
        }}
      >
        Vite + React
      </h1>
      <h2
        className={{
          'bg-color': bgColor,
        }}
      >
        react-jsxdev-v19
      </h2>
      <div
        className={[
          'card',
          {
            'bg-color': bgColor,
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
            'bg-color': bgColor,
          },
        ]}
      >
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
