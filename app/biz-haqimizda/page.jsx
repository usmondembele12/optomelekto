import Link from "next/link";
import { Zap, ShieldCheck, Award, Users, CheckCircle, Truck, FileCheck } from "lucide-react";

export const metadata = {
  title: "Biz haqimizda — Optom Elektro Toshkent",
  description:
    "Optom Elektro Toshkent — 2018-yildan buyon elektrotexnika, kabellar va avtomatika mahsulotlarining ulgurji savdosi bilan shug'ullanuvchi ishonchli ta'minotchi.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>Optom Elektro Toshkent</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Sifatli Elektrotexnika Bo'yicha Sizning Ishonchli Hamkoringiz
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Biz O'zbekiston bo'ylab yirik qurilish obyektlari, montaj brigadalari, usta va do'konlarni
          birinchi qo'l zavod narxlarida elektrotexnika mahsulotlari bilan ta'minlaymiz.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="text-3xl sm:text-4xl font-black text-amber-600">5000+</div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">Mahsulot turlari</div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="text-3xl sm:text-4xl font-black text-amber-600">8+ yil</div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">Toshkent bozorida</div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="text-3xl sm:text-4xl font-black text-amber-600">12 000+</div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">Muvaffaqiyatli buyurtmalar</div>
        </div>
        <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
          <div className="text-3xl sm:text-4xl font-black text-amber-600">100%</div>
          <div className="text-xs text-slate-500 mt-1 font-semibold">GOST va Sertifikat</div>
        </div>
      </div>

      {/* Values */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 text-center">
          Nima Uchun Bizni Tanlashadi?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Faqat Original Mahsulotlar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Biz O'zkabel, Prottok, Schneider Electric, CHINT, VIKO, IEK kabi rasmiy zavodlar bilan to'g'ridan-to'g'ri ishlaymiz.
              Qalbaki yoki standartga to'g'ri kelmaydigan tovarlar mutlaqo sotilmaydi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">O'z Logistika Tizimimiz</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toshkent shahri va Toshkent viloyati bo'ylab o'z transport vositalarimiz orqali tovarlar bir kunda
              to'g'ridan-to'g'ri obyektga yetkazib beriladi.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">To'liq Qonuniy Shartnoma</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Barcha to'lovlar shartnoma, elektron hisob-faktura (Didox) orqali amalga oshiriladi.
              Har bir mahsulot partiyasiga muvofiqlik sertifikati ilova qilinadi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
