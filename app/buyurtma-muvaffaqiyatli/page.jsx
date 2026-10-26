import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, PhoneCall, Send, ShoppingBag } from "lucide-react";

function OrderSuccessContent({ searchParams }) {
  const orderId = searchParams?.orderId || "OE-YANGI";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Buyurtma qabul qilindi
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Rahmat! Buyurtmangiz jo'natildi
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Buyurtma raqamingiz: <b className="text-amber-600 font-mono text-base">{orderId}</b>
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 text-left space-y-3 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm">Keyingi qadamlar nima bo'ladi?</h3>
        <ul className="text-xs text-slate-600 space-y-2.5">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <span>
              Buyurtma tafsilotlari darhol menejerimizning <b>Telegram boti</b>ga yetib bordi.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <span>
              Menejerimiz 10-15 daqiqa ichida siz bilan bog'lanib, tovarlarni ombordan jo'natish vaqtini kelishadi.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <span>
              Toshkent bo'ylab tovarlar kuryer orqali ko'rsatilgan manzilga yetkazib beriladi.
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/katalog"
          className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Katalogga qaytish</span>
        </Link>
        <a
          href="tel:+998712004545"
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <PhoneCall className="w-4 h-4 text-amber-400" />
          <span>(71) 200-45-45</span>
        </a>
      </div>
    </div>
  );
}

export default async function OrderSuccessPage(props) {
  const searchParams = await props.searchParams;
  return (
    <Suspense fallback={<div className="py-20 text-center">Yuklanmoqda...</div>}>
      <OrderSuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
