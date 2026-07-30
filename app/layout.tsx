import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "AVIORA — The Journey Is The Destination",
  description:
    "Book flights, hotels, trains and buses worldwide. AVIORA is the world's most premium travel booking platform.",
  keywords: "luxury travel, flight booking, hotels, AVIORA, premium travel",
  openGraph: {
    title: "AVIORA — The Journey Is The Destination",
    description: "Book flights, hotels, trains and buses worldwide with AVIORA.",
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
