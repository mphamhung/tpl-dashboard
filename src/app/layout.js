"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import NavigationBar from "@/components/NavigationBar";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <NavigationBar></NavigationBar>
        <section className="justify-items-center px-2 pt-16 z-20">
          {children}
        </section>
      </body>
    </html>
  );
}
