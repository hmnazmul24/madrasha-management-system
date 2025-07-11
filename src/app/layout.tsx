import CursorClickEffect from "@/components/ui/click-effect";
import { ReactQueryProvider } from "@/lib/query-client/react-query";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const QuickSand = Quicksand({
  variable: "--font-sand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Darussunnah Islamia Madrasha ",
  description: "A Islamic Educational Institute At Damurhuda",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={` ${QuickSand.variable} font-sand antialiased dark`}>
        <ReactQueryProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
          <CursorClickEffect />
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
