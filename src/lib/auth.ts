import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("User not found or password not set");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        };
      },
    }),
    // Google OAuth provider - only enabled if credentials are provided
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist user ID and username in JWT on initial sign in
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.email = user.email;
      }

      // Handle OAuth account linking
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user?.email! },
        });

        if (existingUser) {
          // User already exists, return existing data
          token.id = existingUser.id;
          token.username = existingUser.username;
          token.email = existingUser.email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add user data from token to session
      session.user = {
        ...session.user,
        id: token.id as string,
        username: token.username as string,
      };
      return session;
    },
    async signIn({ user, account }) {
      // Allow all sign-ins (customize this logic as needed)
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
