import { MapPin, Phone, Mail, Clock, Send, Zap, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Aloqa va Do'kon Manzili — Optom Elektro Toshkent",
  description:
    "Optom Elektro Toshkent aloqa ma'lumotlari: Sergeli elektr bozori 4-blok. Telefon: (71) 200-45-45. Ish vaqti: 08:30 - 18:30.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Biz Bilan Bog'lanish
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Toshkent Do'konimiz va Ombormiz
        </h1>
        <p className="text-sm text-slate-600">
          Ulgurji xaridlar, shartnomalar yoki texnik maslahat bo'yicha biz bilan bog'laning.
          Menejerlarimiz barcha savollaringizga mamnuniyat bilan javob berishadi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3">
            Aloqa Ma'lumotlari
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Do'kon va Ombor manzili:</span>
                <span className="font-bold text-slate-900">
                  Toshkent sh., Sergeli tumani, Yangi Sergeli ko'chasi 12-uy (Sergeli elektr bozori, 4-blok, 15-do'kon)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Telefon raqamlar:</span>
                <a href="tel:+998712004545" className="font-black text-slate-900 hover:text-amber-600 block text-base">
                  +998 (71) 200-45-45
                </a>
                <a href="tel:+998901234567" className="font-semibold text-slate-600 hover:text-amber-600 block text-sm">
                  +998 (90) 123-45-67 (Menejer)
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Ish vaqti:</span>
                <span className="font-bold text-slate-900 block">Dushanba - Shanba: 08:30 - 18:30</span>
                <span className="text-xs text-slate-500 block">Yakshanba: 09:00 - 15:00 (Dam olishsiz)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Telegram:</span>
                <a
                  href="https://t.me/optomelektro_uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-600 hover:underline"
                >
                  @optomelektro_uz (Rasmiy kanal)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder & Instructions */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">
              Yetib Kelish Yo'riqnomasi
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Do'konimiz Sergeli tumani asosiy elektr bozorida joylashgan. Qulay avtoturargoh, yuk ortish va tushirish maydoni mavjud.
            </p>

            {/* Visual map styled block */}
            <div className="relative w-full h-72 rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center p-6 text-center">
              <div className="space-y-3 relative z-10 max-w-sm">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-white font-bold text-base">Optom Elektro Toshkent</h4>
                <p className="text-xs text-slate-400">
                  Sergeli tumani, Yangi Sergeli ko'chasi 12-uy (Elektr bozori 4-blok)
                </p>
                <div className="pt-2">
                  <a
                    href="https://yandex.com/maps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
                  >
                    <span>Yandex Xaritada ochish</span>
                  </a>
                </div>
              </div>

              {/* Background grid pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <span>Mo'ljal: Sergeli elektr bozori markaziy darvozasi</span>
            <span className="font-mono text-amber-600 font-bold">GPS: 41.2285, 69.2155</span>
          </div>
        </div>
      </div>
    </div>
  );
}
