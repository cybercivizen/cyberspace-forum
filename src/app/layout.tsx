import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme-provider";

import NavBar from "@/src/components/app/navbar";
import { Toaster } from "sonner";
import { getSession } from "../lib/auth/session";
import db from "../lib/db/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CYBERSPACE",
  description: "A F4A chatting application.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  const username = session?.username as string | undefined;
  const isAdmin = session?.isAdmin as boolean | undefined;

  // Fetch only profile picture URL if user is logged in
  let profilePictureUrl: string | undefined;
  if (session?.userId) {
    const [user] = await db
      .select({ profilePictureUrl: users.profile_picture_url })
      .from(users)
      .where(eq(users.id, session?.userId as number))
      .limit(1);
    profilePictureUrl = user?.profilePictureUrl ?? undefined;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/bg2.jpg" as="image" />
      </head>
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
            <NavBar
              username={username}
              isAdmin={isAdmin}
              profilePictureUrl={profilePictureUrl}
            />
            <main className="flex relative h-screen items-center justify-center flex-col">
              {children}
              <Toaster />
            </main>
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
