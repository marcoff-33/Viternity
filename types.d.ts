import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    userId?: string;
  }
}
