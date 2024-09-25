import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nama Bayi 2025 - Inspirasi dan Ide Nama Unik untuk Bayi Anda",
  description: "Temukan inspirasi nama bayi 2025 yang unik, modern, dan penuh makna. Pilih nama yang cocok untuk bayi Anda dari berbagai pilihan nama terbaik.",
  keywords: "nama bayi 2025, nama bayi unik, nama bayi modern, inspirasi nama bayi, ide nama bayi",
  openGraph: {
    title: "Nama Bayi 2025 - Inspirasi Nama Bayi Unik dan Modern",
    description: "Dapatkan ide dan inspirasi untuk nama bayi 2025 yang unik, indah, dan penuh makna.",
    url: "https://namabuahhati.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nama Buah Hati" />
        <link rel="canonical" href="https://namabuahhati.com" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-blue-950 to-fuchsia-950`}>{children}</body>
    </html>
  );
}
