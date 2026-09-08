import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kamel Faour — Software Developer",
  description:
    "Software developer building reliable web and mobile applications with a focus on clean architecture, practical solutions, and user experience.",
  keywords: [
    "Kamel Faour",
    "Software Developer",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Laravel",
    "Flutter",
    "PostgreSQL",
    "Portfolio",
  ],
  authors: [{ name: "Kamel Faour" }],
  openGraph: {
    title: "Kamel Faour — Software Developer",
    description:
      "Software developer building reliable web and mobile applications with a focus on clean architecture, practical solutions, and user experience.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamel Faour — Software Developer",
    description:
      "Software developer building reliable web and mobile applications.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-[#1F1F1C] bg-[#F7F6F2]">
        {children}
      </body>
    </html>
  );
}
