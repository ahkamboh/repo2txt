import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Repo to TXT || ahkamboh",
  description: "Download text file to train your LLM for repository-specific conversations",
  openGraph: {
    title: "Repo to TXT",
    description: "Download text file to train your LLM for repository-specific conversations",
    images: [
      {
        url: "https://i0.wp.com/mattruma.com/wp-content/uploads/2019/04/528389819366_e7a0672f0480b3e98d21_512.png",
        width: 512,
        height: 512,
        alt: "Repo to TXT Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repo to TXT || ahkamboh",
    description: "Download text file to train your LLM for repository-specific conversations",
    images: ["https://i0.wp.com/mattruma.com/wp-content/uploads/2019/04/528389819366_e7a0672f0480b3e98d21_512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
