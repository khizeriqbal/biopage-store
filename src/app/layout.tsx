import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "bio page.store — Monetization for Creators",
  description: "The better Stan Store. Sell products, book clients, run courses, and collect emails all on one beautiful link-in-bio page.",
  metadataBase: new URL("https://biopage.store"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        jakarta.variable,
        grotesk.variable,
        "font-body antialiased bg-dark-bg text-dark-text min-h-screen"
      )}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
