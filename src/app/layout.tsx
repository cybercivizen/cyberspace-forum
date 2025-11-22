import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme-provider";
import { StarsBackground } from "@/src/components/animate-ui/components/backgrounds/stars";

import NavBar from "@/src/components/navbar";
import { Toaster } from "sonner";
import { getSession } from "../lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TERMINAL CHAT",
  description: "A terminal themed chat application.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const email = session?.email as string | undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col h-screen">
            <NavBar email={email} />
            <main className="flex relative h-screen">
              {children}
              <Toaster />
            </main>
            {/* Footer - appears on all pages */}
            <footer className="p-2 border-t bg-background/80">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                © 2025 Terminal Chat. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
