import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hannes Duve — Developer",
    template: "%s · Hannes Duve",
  },
  description:
    "Developer portfolio — projects, skills, and contact. Built with Next.js and Tailwind CSS.",
  metadataBase: new URL("https://hannesduve.com"),
  openGraph: {
    title: "Hannes Duve — Developer",
    description:
      "Developer portfolio — projects, skills, and contact.",
    url: "https://hannesduve.com",
    siteName: "Hannes Duve",
    locale: "en_US",
    type: "website",
  },
};

const themeInit = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    if (t === "dark") document.documentElement.classList.add("dark");
    else if (t === "light") document.documentElement.classList.remove("dark");
    else if (
      t === "system" ||
      !t
    ) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <Header />
        {children}
      </body>
    </html>
  );
}
