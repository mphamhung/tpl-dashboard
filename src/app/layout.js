"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import NavigationBar from "@/components/NavigationBar";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen flex flex-col`}>
        {/* Navbar pinned at the top */}
        <div className="sticky top-0 z-30 bg-white shadow">
          <NavigationBar />
        </div>
        {/* Main content area that scrolls */}
        <main className="flex-1 overflow-y-auto pt-16">{children}</main>
      </body>
    </html>
  );
}
