import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Secret used to sign session JWTs. Prefer an env var (set AUTH_SECRET in
// Vercel for real security); fall back to a constant so the demo deploys
// without any configuration.
const AUTH_SECRET =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "peopleflow-demo-secret-change-me-in-production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: AUTH_SECRET,
  trustHost: true, // required on Vercel / behind proxies
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

        /* ── Demo credentials (no database required) ───────────── */
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
