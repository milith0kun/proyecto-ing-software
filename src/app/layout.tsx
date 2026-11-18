import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Fuentes servidas desde el repositorio (src/app/fonts): el build no depende de Google Fonts.
const montserrat = localFont({
  src: "./fonts/montserrat-latin-wght-normal.woff2",
  weight: "700 900",
  style: "normal",
  variable: "--font-heading",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CGB Academy — Centro de Capacitación e Inducción",
  description: "Plataforma oficial de capacitación e inducción institucional de CGB Academy, integrando las unidades CIIP LATAM, GEOMINA LATAM y BIOMEDIC.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
