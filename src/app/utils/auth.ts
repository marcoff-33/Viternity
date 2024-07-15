import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { server_handleNewUser } from "./serverActions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google" && profile) {
        const userId = token.sub;
        if (!userId) {
          throw new Error("No user ID found.");
        }
        await server_handleNewUser(userId);
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.userId = token.sub;
      return session;
    },
  },
});
