import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"], 
  variable: "--font-poppins" 
});
const robotoMono = Roboto_Mono({ 
  subsets: ["latin"], 
  variable: "--font-roboto-mono" 
});

export const metadata: Metadata = {
  title: "Prometheus - Life Gamification",
  description: "Level up your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${poppins.variable} ${robotoMono.variable} font-sans bg-background text-foreground`}>
          <AppShell>
            {children}
          </AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
