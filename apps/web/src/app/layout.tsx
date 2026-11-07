import type { Metadata } from "next";
import "./globals.css";
import "./home.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Catlas | Find your place. Find your way.",
  description:
    "Find buildings, rooms and campus landmarks, then follow a clear walking route with Catlas.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        type: "image/png",
        url: "/icon-192.png",
        sizes: "192x192",
      },
    ],
    apple: {
      type: "image/png",
      url: "/apple-touch-icon.png",
      sizes: "180x180",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
