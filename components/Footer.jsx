import Link from "next/link";
import { Zap, Phone, MapPin, Mail, Clock, Send, ShieldCheck, Truck, CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Toshkent bo'ylab yetkazish</h4>
              <p className="text-xs text-slate-400">Buyurtma berilgan kuni yoki ertasi kuni yetkazib beramiz</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% Sifat va GOST</h4>
              <p className="text-xs text-slate-400">Barcha kabellar va avtomatlarga muvofiqlik sertifikati</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Qulay to'lov va Hisob-faktura</h4>
              <p className="text-xs text-slate-400">Naqd, Click, Payme va yuridik shaxslar uchun QQS bilan</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Zap className="w-6 h-6 fill-current text-slate-950" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                OPTOM<span className="text-amber-500">ELEKTRO</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Toshkent shahrida elektrotexnika mahsulotlari, mis va alyuminiy kabellar,
              modulli avtomatika hamda sanoat yoritish jihozlarining birinchi qo'l ulgurji savdo bazasi.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://t.me/optomelektro_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center transition shadow-lg shadow-sky-600/30"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="tel:+998712004545"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+998 71 200 45 45</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Mahsulotlar
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/katalog?category=kabel-simlar" className="hover:text-amber-400 transition">
                  Kabellar va simlar (VVG, NYM)
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=avtomatika-shitlar" className="hover:text-amber-400 transition">
                  Avtomatika va elektr shitlar
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=rozetka-viklyuchatel" className="hover:text-amber-400 transition">
                  Rozetka va viklyuchatellar
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=led-yoritish" className="hover:text-amber-400 transition">
                  LED projektorlar va panellar
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=montaj-izolyatsiya" className="hover:text-amber-400 transition">
                  Gofra quvurlar va koroblar
                </Link>
              </li>
              <li>
                <Link href="/katalog?category=transformator-stabilizator" className="hover:text-amber-400 transition">
                  Kuchlanish stabilizatorlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Kompaniya
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-amber-400 transition">
                  Barcha tovarlar ro'yxati
                </Link>
              </li>
              <li>
                <Link href="/biz-haqimizda" className="hover:text-amber-400 transition">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link href="/aloqa" className="hover:text-amber-400 transition">
                  Do'kon manzili va xarita
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition text-rose-400">
                  Admin panelga kirish
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tashkent Contacts */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Toshkent Ofisi
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>Toshkent sh., Sergeli tumani, Yangi Sergeli ko'chasi 12-uy (Elektr bozori 4-blok)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+998 71 200 45 45</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>info@optomelektro.uz</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>08:30 - 18:30 (Dam olishsiz)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Text & Copyright */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 "Optom Elektro Toshkent" — Barcha huquqlar himoyalangan.</p>
          <p className="text-center sm:text-right">
            Toshkentda ulgurji elektrotexnika, kabellar, transformatorlar va avtomatika do'koni.
          </p>
        </div>
      </div>
    </footer>
  );
}
