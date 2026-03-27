import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DashboardProvider } from "@/contexts/DashboardContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800"],
});

export const metadata: Metadata = {
  title: "Tablero Maestro: La Bio-M\u00E1quina 2026",
  description: "Dashboard de OKRs personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </body>
    </html>
  );
}
