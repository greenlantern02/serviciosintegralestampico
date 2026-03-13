import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | Servicios Integrales",
    default: "Servicios Integrales | Higiene y Seguridad Industrial",
  },
  description:
    "Su aliado confiable en el suministro de productos de higiene y seguridad industrial. Calidad, precios justos y servicio único. Ciudad Madero, Tamaulipas.",
  openGraph: {
    locale: "es_MX",
    type: "website",
  },
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
