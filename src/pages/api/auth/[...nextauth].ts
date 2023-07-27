import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleOAuthProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@solarirr/lib/db/mongodb';
import connectMongo from '@solarirr/lib/db/mongoose';
import User from '@solarirr/lib/models/user';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    GoogleOAuthProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  events: {
    async createUser(message) {
      await connectMongo();
      try {
        const now = new Date();
        await User.updateOne(
          { _id: message.user.id },
          {
            userType: 'customer',
            createdAt: now,
            updatedAt: now,
            profileComplete: false,
          },
          { multi: true, timestamps: false }
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.userType = user.userType;
        token.profileComplete = user.profileComplete;
        token.id = user.id;
        token.provider = account!.provider;
      }
      return token;
    },
    session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.userType = token.userType;
        session.user.profileComplete = token.profileComplete;
        session.user.id = token.id;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
});
