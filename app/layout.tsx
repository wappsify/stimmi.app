import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/ui/footer";

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
    <html lang="en" className="h-full">
      <body
        className={`${noto.className} antialiased bg-gray-100 min-h-screen flex flex-col`}
      >
        <NextTopLoader color="#0f172a" showSpinner={false} />
        <div className="flex-grow">{children}</div>
        <Toaster position="bottom-center" />
        <Footer />
      </body>
    </html>
  );
}
