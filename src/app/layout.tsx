"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html suppressHydrationWarning={true} className="!scroll-smooth" lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
              enableColorScheme={false}
              forcedTheme="light"
            >
              <ToasterContext />
              {pathname !== "/review" && <Header />}
              {children}
              {/* <Footer /> */}
              <ScrollToTop />
            </ThemeProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
