import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";
import { sendPasswordReset } from "./send-email";

/**
 * Resolve the canonical site URL.
 * In production, BETTER_AUTH_URL MUST be set to the deployed origin
 * (e.g. https://yif.org). NEXT_PUBLIC_APP_URL is accepted as a fallback.
 */
const siteUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  "http://localhost:3000";

const trustedOrigins = Array.from(
  new Set(
    [
      siteUrl,
      process.env.BETTER_AUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      "http://localhost:3000",
    ].filter((v): v is string => Boolean(v)),
  ),
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  baseURL: siteUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordReset({
        recipientName: user.name ?? "",
        recipientEmail: user.email,
        resetUrl: url,
      });
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  trustedOrigins,
  plugins: [admin()],
});
