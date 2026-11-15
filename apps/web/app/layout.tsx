
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pantube – Connect. Share. Grow.",
    template: "%s | Pantube"
  },
  description:
    "Pantube is a social platform where people connect, share ideas, discover communities and grow together.",
  applicationName: "Pantube",
  keywords: [
    "Pantube",
    "Social network",
    "Connect",
    "Share",
    "Community",
    "Nigeria"
  ],
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
