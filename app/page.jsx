import Link from "next/link";
import {
  Zap,
  Cable,
  ShieldCheck,
  ToggleRight,
  Lightbulb,
  Wrench,
  Truck,
  FileText,
  BadgeCheck,
  ArrowRight,
  PhoneCall,
  Send,
  HelpCircle,
} from "lucide-react";
import { getProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

  const categoryIcons = {
    Cable: Cable,
    ShieldCheck: ShieldCheck,
    ToggleRight: ToggleRight,
    Lightbulb: Lightbulb,
    Wrench: Wrench,
    Zap: Zap,
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold">
                <Zap className="w-4 h-4 fill-current text-amber-400" />
                <span>Toshkentda 1-qo'l Zavod Narxlari</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Elektrotexnika va Kabellarning{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
                  Ulgurji Savdo Markazi
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O'zbekistonning yetakchi ishlab chiqaruvchilari va jahon brendlari (Schneider, CHINT, VIKO) mahsulotlari.
                Katta zaxira, sertifikatlangan GOST sifat, qonuniy hisob-faktura va Toshkent bo'ylab tezkor yetkazib berish.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/katalog"
                  className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base flex items-center gap-2 shadow-xl shadow-amber-500/25 transition duration-200"
                >
                  <span>Katalogni ko'rish</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="https://t.me/optomelektro_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base flex items-center gap-2 border border-slate-700 transition"
                >
                  <Send className="w-5 h-5 text-sky-400" />
                  <span>Ulgurji Prays (Telegram)</span>
                </a>
              </div>

              {/* Quick Tags for SEO */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-300">
                <span className="text-slate-500">Ommabop qidiruvlar:</span>
                <Link
                  href="/katalog?category=kabel-simlar"
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
                >
                  VVG-P 3x2.5
                </Link>
                <Link
                  href="/katalog?category=avtomatika-shitlar"
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
                >
                  Schneider 16A
                </Link>
                <Link
                  href="/katalog?category=rozetka-viklyuchatel"
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
                >
                  VIKO Carmen
                </Link>
                <Link
                  href="/katalog?category=led-yoritish"
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
                >
                  LED 100W Projektor
                </Link>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white">Do'kon va Ombor</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Toshkent shahri</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Ochiq (08:30 - 18:30)
                  </span>
                </div>

                <div className="space-y-4 py-6 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Tezkor yetkazib berish</h4>
                      <p className="text-xs text-slate-400">
                        Toshkent shahrida 1 kunda yetkazamiz. O'zbekistonning barcha viloyatlariga kuryer orqali jo'natiladi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Yuridik shaxslarga shartnoma</h4>
                      <p className="text-xs text-slate-400">
                        QQS bilan elektron hisob-faktura (Didox). Barcha sifat sertifikatlari beriladi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Ulgurji chegirmalar tizimi</h4>
                      <p className="text-xs text-slate-400">
                        Hajmga qarab 15% gacha chegirma. Doimiy mijozlar va elektr montajchilarga maxsus narxlar.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Bog'lanish uchun:</span>
                    <a
                      href="tel:+998712004545"
                      className="text-lg font-black text-amber-400 hover:underline"
                    >
                      +998 71 200 45 45
                    </a>
                  </div>

                  <Link
                    href="/aloqa"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
                  >
                    Manzilni ko'rish
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              Asosiy Yo'nalishlar
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mahsulot Kategoriyalari
            </h2>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition"
          >
            <span>Barcha toifalarni ko'rish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] || Zap;
            return (
              <Link
                key={cat.id}
                href={`/katalog?category=${cat.id}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-amber-600">
                  <span>Tovarlarga o'tish</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              Top Takliflar
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ommabop Mahsulotlar va Ulgurji Narxlar
            </h2>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition"
          >
            <span>Katalogda ko'rish ({products.length} ta mahsulot)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Wholesale Banner / CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-lg bg-slate-950 text-amber-400 text-xs font-black uppercase">
              Ulgurji Xaridorlar & Qurilish Kompaniyalari Uchun
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Katta hajmda kabel va elektr uskunalar kerakmi?
            </h2>
            <p className="text-slate-900 text-sm sm:text-base font-medium leading-relaxed">
              Biz to'g'ridan-to'g'ri ishlab chiqaruvchi zavodlar bilan ishlaymiz. Obyektingiz smetasi yoki kerakli
              tovarlar ro'yxatini bizga yuboring — 15 daqiqada eng past narxdagi hisob-kitobni taqdim etamiz.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="https://t.me/optomelektro_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg transition"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Smetani Telegramga yuborish</span>
              </a>

              <a
                href="tel:+998712004545"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl flex items-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>+998 71 200 45 45</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Savol-Javoblar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Ko'p Beriladigan Savollar
          </h2>
          <p className="text-slate-500 text-sm">
            Optom Elektro Toshkent do'konida xarid qilish bo'yicha muhim ma'lumotlar
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Ulgurji narxlarda xarid qilish shartlari qanday?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Har bir mahsulot sahifasida ulgurji narx va minimal miqdor (masalan, kabel uchun 100 metr, avtomatlar uchun 10-12 dona)
              ko'rsatilgan. Savatga ushbu miqdordan ortiq tovar kiritilganda, narx avtomatik ravishda optom narxga o'zgaradi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Toshkent bo'yicha yetkazib berish qancha vaqt oladi?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Toshkent shahri ichida buyurtmalar qabul qilingan kuni yoki ertasi kuni yetkaziladi. 1 000 000 so'mdan yuqori
              xaridlarda yetkazib berish shahar bo'yicha bepul!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Yuridik shaxslarga to'lov qanday amalga oshiriladi?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              MChJ, YaTT va barcha tashkilotlar uchun shartnoma tuziladi va elektron hisob-faktura (Didox tizimi orqali, QQS bilan)
              yuboriladi. Bank hisob-raqamiga to'lov qabul qilinadi.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Do'kon va omborni o'z ko'zim bilan ko'rishim mumkinmi?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Albatta! Toshkent shahri, Sergeli tumani, Yangi Sergeli ko'chasidagi elektr bozoriga (4-blok) tashrif buyurishingiz mumkin.
              Haftada 7 kun soat 08:30 dan 18:30 gacha ishlaymiz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
