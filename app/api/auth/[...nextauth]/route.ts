import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0', // Use OAuth 2.0
      authorization: {
        params: { scope: 'tweet.read users.read offline.access' },
      },
    }),
  ],
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub!;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirecting to:', url);
      return baseUrl; // 🔹 Ensures redirection to your app
    },
    async signIn({ account, profile }) {
      console.log('Account:', account);
      console.log('Profile:', profile);
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
