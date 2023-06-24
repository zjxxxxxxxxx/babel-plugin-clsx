import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  return <Component {...pageProps} />;
}
