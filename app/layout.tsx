import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/components/auth/NextAuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { CompareTray } from "@/components/compare/CompareTray";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Discovery Platform",
  description: "Find and compare the best colleges for your future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built for the Full Stack Developer Internship Demo Task.
              </p>
            </div>
          </footer>
          </div>
          <CompareTray />
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
