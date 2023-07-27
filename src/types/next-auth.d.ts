import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      _id: string;
      userType: ['customer', 'admin'];
      profileComplete: boolean;
      name: string;
      image: string;
    };
  }

  interface User {
    profileComplete: boolean;
    id: string;
    _id: string;
    userType: ['customer', 'admin'];
    image: string;
    name: string;
  }
  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  interface Account {}
}
