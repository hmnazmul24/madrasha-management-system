import CursorClickEffect from "@/components/ui/click-effect";
import { ReactQueryProvider } from "@/lib/query-client/react-query";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const QuickSand = Quicksand({
  variable: "--font-sand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Darussunnah Islamia Madrasha ",
  description: "A Islamic Educational Institute At Damurhuda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${QuickSand.variable} font-sand antialiased dark`}>
        <ReactQueryProvider>
          {children}
          <CursorClickEffect />
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
