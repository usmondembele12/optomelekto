"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  ShoppingCart,
  Phone,
  MapPin,
  Clock,
  Search,
  Menu,
  X,
  ShieldAlert,
  Send,
} from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function Navbar() {
  const router = useRouter();
  const { totalQuantity, totalAmount, mounted } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      {/* Top Notice Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              Toshkentda 1-qo'l ulgurji narxlar!
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Sergeli elektr bozori, Toshkent sh.
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              08:30 - 18:30 (Dam olishsiz)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://t.me/optomelektro_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition"
            >
              <Send className="w-3 h-3" />
              <span>Telegram kanal</span>
            </a>
            <a
              href="tel:+998712004545"
              className="flex items-center gap-1 text-white font-semibold hover:text-amber-400 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>(71) 200-45-45</span>
            </a>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition pl-2 border-l border-slate-700"
              title="Admin Panel"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <Zap className="w-6 h-6 fill-current text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  OPTOM
                </span>
                <span className="text-xl font-black tracking-tight text-amber-600">
                  ELEKTRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
                Toshkent Ulgurji Savdo
              </p>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-6 relative"
          >
            <input
              type="text"
              placeholder="Mahsulot nomi, kabel markasi, avtomat qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 pl-4 pr-11 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium rounded-lg flex items-center justify-center transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/savat"
              className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-sm relative group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                {mounted && totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[11px] text-slate-400 leading-none">
                  Savatcha
                </div>
                <div className="text-xs font-bold text-amber-400 leading-tight">
                  {mounted && totalAmount > 0
                    ? `${new Intl.NumberFormat("uz-UZ").format(totalAmount)} so'm`
                    : "Bo'sh"}
                </div>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden relative">
          <input
            type="text"
            placeholder="Mahsulot yoki kabel qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 text-slate-900 pl-4 pr-11 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium rounded-lg flex items-center justify-center"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Nav Menu Links */}
      <nav className="bg-slate-50 border-t border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="py-3 px-4 hover:text-amber-600 transition"
            >
              Bosh sahifa
            </Link>
            <Link
              href="/katalog"
              className="py-3 px-4 text-amber-700 bg-amber-100/60 rounded-md my-1 font-bold flex items-center gap-1.5 transition"
            >
              ⚡ Barcha mahsulotlar (Katalog)
            </Link>
            <Link
              href="/katalog?category=kabel-simlar"
              className="py-3 px-3 hover:text-amber-600 transition"
            >
              Kabellar
            </Link>
            <Link
              href="/katalog?category=avtomatika-shitlar"
              className="py-3 px-3 hover:text-amber-600 transition"
            >
              Avtomatika
            </Link>
            <Link
              href="/katalog?category=rozetka-viklyuchatel"
              className="py-3 px-3 hover:text-amber-600 transition"
            >
              Rozetkalar
            </Link>
            <Link
              href="/katalog?category=led-yoritish"
              className="py-3 px-3 hover:text-amber-600 transition"
            >
              LED yoritish
            </Link>
            <Link
              href="/biz-haqimizda"
              className="py-3 px-4 hover:text-amber-600 transition"
            >
              Biz haqimizda
            </Link>
            <Link
              href="/aloqa"
              className="py-3 px-4 hover:text-amber-600 transition"
            >
              Aloqa & Manzil
            </Link>
          </div>

          <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
            🚚 Toshkent bo'ylab 1 kunda yetkazish
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
          >
            Bosh sahifa
          </Link>
          <Link
            href="/katalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-bold text-amber-700 bg-amber-50 rounded-lg"
          >
            ⚡ Barcha mahsulotlar (Katalog)
          </Link>
          <Link
            href="/katalog?category=kabel-simlar"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg pl-6"
          >
            • Kabellar va simlar
          </Link>
          <Link
            href="/katalog?category=avtomatika-shitlar"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg pl-6"
          >
            • Avtomatika va shitlar
          </Link>
          <Link
            href="/katalog?category=rozetka-viklyuchatel"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg pl-6"
          >
            • Rozetka va viklyuchatellar
          </Link>
          <Link
            href="/katalog?category=led-yoritish"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg pl-6"
          >
            • LED yoritish va projektorlar
          </Link>
          <Link
            href="/biz-haqimizda"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
          >
            Biz haqimizda
          </Link>
          <Link
            href="/aloqa"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-slate-100 rounded-lg"
          >
            Aloqa & Manzil
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-rose-700 bg-rose-50 rounded-lg"
          >
            🔐 Admin Panel
          </Link>
        </div>
      )}
    </header>
  );
}
