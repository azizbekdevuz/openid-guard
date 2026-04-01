import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenID Guard - Privacy-Respecting Identity Verification",
  description: "Next-generation identity verification with uncompromising privacy and military-grade encryption",
  keywords: "identity verification, privacy, security, decentralized identity, web3, openid, zero-knowledge",
  metadataBase: new URL('https://github.com/azizbekdevuz/openid-guard'),
  authors: [{ name: "OpenID Guard Team" }],
  openGraph: {
    title: "OpenID Guard",
    description: "Next-generation identity verification with uncompromising privacy",
    url: "https://openid-guard.com",
    siteName: "OpenID Guard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenID Guard - Privacy-Respecting Identity Verification",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenID Guard",
    description: "Next-generation identity verification with uncompromising privacy",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}