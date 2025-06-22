import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/shared/navbar";
import React from "react";
import Suggestions from "@/components/shared/suggestions";
import Notifications from "@/components/shared/notifications";

export const metadata: Metadata = {
  title: "Slyke",
  description: "Making worlds connect differently.",
};

export default function RootLayout({
  children,
  post,
}: Readonly<{
  children: React.ReactNode;
  post: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <div className="bg-gray-200 dark:bg-black min-h-[calc(100vh-9vh)]">
              <div className="Container flex flex-col md:flex-row gap-4 pt-4">
                <div className="hidden md:block md:flex-1">
                  <Notifications />
                </div>
                <div className="flex-2">
                  {children}
                  {post}
                </div>
                <div className="hidden md:block md:flex-1">
                  <Suggestions />
                </div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
