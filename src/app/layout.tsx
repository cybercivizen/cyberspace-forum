import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/theme-provider";
import { BubbleBackground } from "@/src/components/animate-ui/components/backgrounds/bubble";
import { StarsBackground } from "@/src/components/animate-ui/components/backgrounds/stars";
import { Card } from "@/src/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import { Link } from "@radix-ui/react-navigation-menu";
import { Menubar } from "@radix-ui/react-menubar";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/src/components/ui/menubar";
import NavBar from "@/src/components/navbar";
import { Toaster } from "sonner";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <NavBar />
            <main className="flex-1 relative h-screen">
              <StarsBackground pointerEvents={false} className="flex z-0">
                {children}
              </StarsBackground>
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
