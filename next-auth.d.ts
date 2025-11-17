import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      image?: string | null;
      name: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    image?: string | null;
    name: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    image?: string | null;
    name: string | null;
  }
}
