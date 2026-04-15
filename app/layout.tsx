import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../src/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata = {
  title: 'TaskManager - Gestion de tâches',
  description: 'Application de gestion de tâches pour organiser votre quotidien efficacement.',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#F2EDE4]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
