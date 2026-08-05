import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AuthProvider } from "@/lib/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "MTTPL — Luxury Travel & Experiences",
  description:
    "Book flights, hotels, holidays, sightseeing, and transfers worldwide. MTTPL is your premier travel booking platform.",
  keywords: "luxury travel, flight booking, hotels, MTTPL, Malhotra's Tour & Travel, travel experiences",
  openGraph: {
    title: "MTTPL — Luxury Travel & Experiences",
    description: "Book flights, hotels, holidays, sightseeing, and transfers worldwide with MTTPL.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
