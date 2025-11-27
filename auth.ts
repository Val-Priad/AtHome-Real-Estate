import { db } from "@/lib/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import NextAuth, { CredentialsSignin } from "next-auth";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import bcrypt from "bcrypt";

import type { Adapter } from "next-auth/adapters";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          throw new CredentialsSignin("Invalid credentials");
        }

        const { email, password } = credentials;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email as string),
        });

        if (!user) {
          throw new CredentialsSignin("User not found");
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          throw new CredentialsSignin("Invalid password");
        }

        return {
          id: user.id,
          role: user.role,
          image: user.image,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
