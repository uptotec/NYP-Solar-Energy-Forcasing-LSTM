import Image from 'next/image';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
  }, [router, status]);

  const signInGoogle = async () => {
    const res = await signIn('google', { callbackUrl: '/auth/create' });
  };

  return (
    <div className="grid w-full grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <p className="font-bold text-3xl text-[#1c1c1c]">Welcome Back,</p>
          <p className="font-medium text-base text-[#5a5a5a]">
            please sign in with your preferred provider
          </p>
        </div>
        <div className="flex flex-col items-center w-1/3 gap-4">
          <button
            onClick={signInGoogle}
            className="flex items-center justify-center w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow"
          >
            <Image
              className="w-12 h-6"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              loading="lazy"
              alt="google logo"
              width={0}
              height={0}
            />
            <span>Login with Google</span>
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow">
            <Image
              className="w-12 h-6"
              src="https://www.svgrepo.com/download/475647/facebook-color.svg"
              loading="lazy"
              alt="google logo"
              width={0}
              height={0}
            />
            <span>Login with Facebook</span>
          </button>
        </div>
      </div>
      <div>
        <Image
          className=""
          src="/landing.jpg"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: '100vh' }}
          alt="solar landing"
        />
      </div>
    </div>
  );
}

export default SignIn;
