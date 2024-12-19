import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/ui/footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const noto = Noto_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Ranked choice polls | stimmi.app",
  description: "Your app for quick and easy ranked choice polls. 🗳️",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <body
        className={`${noto.className} antialiased bg-gray-100 min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <NextTopLoader color="#0f172a" showSpinner={false} />
          <div className="flex-grow">{children}</div>
          <Toaster position="bottom-center" />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
