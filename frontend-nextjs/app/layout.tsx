import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { MotionProvider } from "@/src/components/motion/MotionProvider";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "SEDEC.NEWS",
  description: "SEDEC.NEWS",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        suppressHydrationWarning
        className={`${archivo.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <MotionProvider>
          <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
            <Header />
            {children}
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
