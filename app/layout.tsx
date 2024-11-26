import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const noto = Noto_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Ranked choice polls | stimmi.app",
  description: "Your app for quick and easy ranked choice polls. 🗳️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${noto.className} antialiased bg-gray-100`}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
