import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from '@/lib/SupabaseProvider';
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interrank",
  description: "AI-Powered Automated Interview Training Webapp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <SupabaseProvider>
          <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
            <Header />
            <main className="flex-1 h-full w-full">
              {children}
            </main>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
