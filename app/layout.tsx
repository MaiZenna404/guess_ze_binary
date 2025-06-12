import type { Metadata } from "next";
import { pixelFont } from "./fonts";
import "./globals.css";

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const metadata: Metadata = {
  title: "Guess Ze Binary",
  description: "Guess Ze Binary is a fun game where you guess the binary representation of a number.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pixelFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
