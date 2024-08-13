import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { type Metadata } from "next";
import Providers from "~/providers";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Multiplayer Worlde",
  description: "Multiplayer wordle party game",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const interFont = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${interFont.className}`}>
      <body>
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
