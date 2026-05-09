import type { Metadata } from "next";
import { Toaster } from 'sonner'; 
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "ForeverLink | Digital Legacy",
  description: "Secure your family's legacy across generations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#0A192F] text-[#F5F5DC]`}>
        {children}
        <Toaster position="top-center" richColors expand={false} />
      </body>
    </html>
  );
}