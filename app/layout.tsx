import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Yoruba Indigenes' Foundation",
    default:
      "Yoruba Indigenes' Foundation — Uniting the global Yoruba in diaspora",
  },
  description:
    "The Yoruba Indigenes' Foundation (YIF) is a UN/ECOSOC consultative status NGO uniting Yoruba people worldwide through culture, education, economic empowerment, and community development. Reg. IT 28744.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yifworldwide.org",
  ),
  openGraph: {
    siteName: "Yoruba Indigenes' Foundation",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
