import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/cart";
import { FinanceDrawerProvider } from "@/context/cardManager";
// import { FormProvider } from "@/context/useFormContext";

// Styles
import "./globals.css";
import customTheme from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/material";

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
  title: "Skywings",
  description: "Reserva de vuelos de Skywings",
};

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider theme={customTheme}>
          <CssBaseline />
          <CartProvider>
            <FinanceDrawerProvider>
            <Navbar />
            <Container>{children}</Container>
            </FinanceDrawerProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
