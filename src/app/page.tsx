import { CurbieClient } from '@/components/CurbieClient';
import Script from 'next/script';

export default function Home() {
  return (
    <main>
      <CurbieClient />
      <Script
        src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js"
        type="module"
        strategy="lazyOnload"
      />
    </main>
  );
}