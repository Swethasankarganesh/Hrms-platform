import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email    = credentials.email    as string;
        const password = credentials.password as string;

        /* ── Try the database first ────────────────────────────── */
        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return null;
            return { id: user.id, email: user.email, name: user.name };
          }
        } catch {
          /* DB not configured yet — fall through to demo credentials */
        }

        /* ── Demo fallback (works without a database) ──────────── */
        if (
          email    === "sweshinisankar@gmail.com" &&
          password === "swetha123"
        ) {
          return { id: "demo", email, name: "Swetha Sankar" };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id   = token.id   as string;
      session.user.name = token.name as string;
      return session;
    },
  },
});
