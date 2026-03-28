import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "BP Reversal <noreply@bpreversal.com>",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=true",
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      // After sign-in, go to /today (not back to /login)
      if (url.startsWith(baseUrl + "/login") || url === baseUrl + "/") {
        return baseUrl + "/today";
      }
      // Allow relative URLs
      if (url.startsWith("/")) return baseUrl + url;
      // Allow same-origin URLs
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/today";
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
