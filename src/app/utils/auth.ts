import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { server_handleNewUser } from "./serverActions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        const userId = profile.sub;
        if (!userId) {
          throw new Error("No user ID found.");
        }
        token.googleId = userId;
        await server_handleNewUser(userId);
      }
      
      return token;
    },
    async session({ session, token, user }) {
      session.user.userId = token.googleId;
      
      return session;
    },
  },
});
