import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/navbar";

// Styles
import "./globals.css";
// import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import customTheme from "@/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Container } from "@mui/material";
// import { FormProvider } from "@/context/useFormContext";

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <AppRouterCacheProvider> */}
          <ThemeProvider theme={customTheme}>
            <CssBaseline/>
            <Navbar />
            <Container>
              {/* <FormProvider> */}
                {children}
              {/* </FormProvider> */}
            </Container>
          </ThemeProvider>
        {/* </AppRouterCacheProvider> */}
        
        
      </body>
    </html>
  );
}
