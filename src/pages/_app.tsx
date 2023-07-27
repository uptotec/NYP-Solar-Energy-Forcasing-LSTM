import '@solarirr/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const x = async () => {
      if (router.pathname === '/auth/signin') return;

      const session = await getSession();
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      const res = await fetch('/api/profileComplete', { method: 'GET' });
      const { profileComplete } = await res.json();
      if (!profileComplete) router.push('/auth/create');
    };
    x();
  }, [router]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
