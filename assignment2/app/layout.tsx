import type React from "react";
import type { Metadata } from "next";
import { Nunito, Encode_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/component/theme";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const encodeSans = Encode_Sans({
  subsets: ["latin"],
  variable: "--font-encode-sans",
});

export const metadata: Metadata = {
  title: "Agentic LinkedIn Search",
  description:
    "AI-powered Job Description Generator and LinkedIn Talent Search",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${encodeSans.variable} font-nunito bg-black`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
