import "@/styles/globals.css";

import { type Metadata } from "next";
import { Noto_Sans } from "next/font/google";

import Providers from "./_components/Providers";

export const metadata: Metadata = {
  title: "Kitsch-Kit",
  description: "Kitsch-Kit",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const notosans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-notosans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notosans.variable}`}>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
