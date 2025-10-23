import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scent2Me",
  description: "Website rekomendasi parfum",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8f6ef]`}>
        {children}

        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#f8f6ef", color: "#333" },
            success: { iconTheme: { primary: "#a3b899", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
