import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

// ✅ Import Inter & Sora fonts with CSS variable setup
import { Inter, Sora } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "BullBear AI",
  description: "Your AI-supercharged trading intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${sora.variable} scroll-smooth dark`}>
        <body className="font-sans bg-background text-foreground">
          {children}
          <Toaster theme="dark" richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
