import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchemaMarkup from "@/components/SchemaMarkup";
import { CartProvider } from "@/context/cart-context";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://optomelektro.uz"
  ),
  title: {
    default: "Optom Elektro Toshkent — Kabellar va Elektrotexnika Ulgurji Savdosi",
    template: "%s | Optom Elektro Toshkent",
  },
  description:
    "Toshkentda kabellar (VVG-P, NYM, AVVG), modulli avtomatika (Schneider, Chint, IEK), rozetkalar va sanoat LED yoritish jihozlari birinchi qo'l ulgurji va chakana narxlarda. Yetkazib berish xizmati mavjud.",
  keywords: [
    "optom elektro toshkent",
    "elektrotexnika ulgurji toshkent",
    "kabel optom narxda",
    "vvg kabel toshkent narxi",
    "avtomat schneider optom",
    "chint toshkent",
    "led projektor ulgurji",
    "rozetka viko optom",
    "elektr bozori toshkent",
    "sergeli kabel bozori",
    "abu saxiy elektr",
    "elektromontaj mahsulotlari",
  ],
  authors: [{ name: "Optom Elektro Toshkent" }],
  creator: "Optom Elektro",
  publisher: "Optom Elektro Toshkent",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://optomelektro.uz",
    siteName: "Optom Elektro Toshkent",
    title: "Optom Elektro Toshkent — Kabellar va Elektrotexnika Ulgurji Savdosi",
    description:
      "Toshkentda zavod narxlarida elektrotexnika va kabel mahsulotlari. Ulgurji va chakana savdo. Yetkazib berish mavjud.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=1200",
        width: 1200,
        height: 630,
        alt: "Optom Elektro Toshkent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Optom Elektro Toshkent — Elektrotexnika Ulgurji Savdosi",
    description:
      "Kabellar, avtomatika, rozetkalar va LED panellar ulgurji narxlarda Toshkentda.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className="h-full antialiased">
      <head>
        <SchemaMarkup />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
