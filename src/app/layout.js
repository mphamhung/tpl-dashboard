"use client";
import { Inter } from "next/font/google";
import "./globals.css";

import NavigationBar from "@/components/NavigationBar";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // wake api
    const queryApi = async () => {
      const _ = await fetch("https://tplapp.onrender.com/");
      setApiReady(true);
    };

    queryApi();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar></NavigationBar>
        <section className="justify-items-center px-2 pt-16 z-20">
          {apiReady ? children : "Fetching data from server"}
        </section>
      </body>
    </html>
  );
}
