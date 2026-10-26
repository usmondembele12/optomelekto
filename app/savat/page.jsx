"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Send,
  User,
  Phone,
  MapPin,
  CreditCard,
  Building,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    totalQuantity,
    totalAmount,
    totalSavings,
    updateQuantity,
    removeFromCart,
    clearCart,
    mounted,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [district, setDistrict] = useState("Toshkent shahri (Chilonzor)");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Naqd yetkazilganda");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Savatcha yuklanmoqda...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          Savatchangiz hozircha bo'sh
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Katalogimizdan kerakli elektrotexnika, kabellar yoki avtomatlarni tanlab,
          savatchaga qo'shishingiz mumkin.
        </p>
        <div className="pt-4">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || phone.trim().length < 9) {
      setError("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        district,
        address: address.trim(),
        paymentMethod,
        notes: notes.trim(),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.retailPrice,
          isWholesale: item.isWholesale,
          unit: item.unit,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        totalAmount,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Buyurtma berishda xatolik yuz berdi");
      }

      clearCart();
      router.push(`/buyurtma-muvaffaqiyatli?orderId=${data.order.id}`);
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Savatcha va Buyurtmani Rasmiylashtirish
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jami {totalQuantity} ta mahsulot tanlandi
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Savatni tozalash</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {totalSavings > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
              <div className="text-xs sm:text-sm">
                <b>Ulgurji narx chegirmasi faollashtirildi!</b> Siz ushbu buyurtmada{" "}
                <span className="font-extrabold underline">
                  {formatPrice(totalSavings)}
                </span>{" "}
                tejadingiz.
              </div>
            </div>
          )}

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-2xl bg-slate-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/mahsulot/${item.slug}`}
                      className="font-bold text-slate-900 text-sm hover:text-amber-600 transition block truncate"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{formatPrice(item.price)}/{item.unit}</span>
                      {item.isWholesale && (
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          Optom narx!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity and subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-xs font-bold bg-white py-1.5 border-x border-slate-200">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[100px]">
                    <span className="text-sm font-black text-slate-900 block">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Checkout Details Form */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 sticky top-28">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Buyurtmachi Ma'lumotlari
            </h3>

            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ism va familiyangiz: *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Sardor Aliyev"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Telefon raqamingiz: *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+998 90 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* District & Address */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Yetkazish hududi:
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  >
                    <option value="Toshkent shahri (Chilonzor)">Toshkent - Chilonzor</option>
                    <option value="Toshkent shahri (Sergeli)">Toshkent - Sergeli</option>
                    <option value="Toshkent shahri (Yunusobod)">Toshkent - Yunusobod</option>
                    <option value="Toshkent shahri (Mirzo Ulug'bek)">Toshkent - Mirzo Ulug'bek</option>
                    <option value="Toshkent shahri (Yakkasaroy)">Toshkent - Yakkasaroy</option>
                    <option value="Toshkent shahri (Mirobod)">Toshkent - Mirobod</option>
                    <option value="Toshkent shahri (Shayxontohur)">Toshkent - Shayxontohur</option>
                    <option value="Toshkent shahri (Uchtepa)">Toshkent - Uchtepa</option>
                    <option value="Toshkent shahri (Olmazor)">Toshkent - Olmazor</option>
                    <option value="Toshkent shahri (Yashnobod)">Toshkent - Yashnobod</option>
                    <option value="Toshkent viloyati">Toshkent viloyati</option>
                    <option value="Boshqa viloyat (Kuryer orqali)">Boshqa viloyat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Aniq manzil va mo'ljal:
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Ko'cha, bino raqami, mo'ljal"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  To'lov usuli:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label
                    className={`p-3 rounded-xl border cursor-pointer font-bold flex items-center gap-2 transition ${
                      paymentMethod === "Naqd yetkazilganda"
                        ? "border-amber-500 bg-amber-50/50 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Naqd yetkazilganda"}
                      onChange={() => setPaymentMethod("Naqd yetkazilganda")}
                      className="hidden"
                    />
                    <span>💵 Naqd to'lov</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border cursor-pointer font-bold flex items-center gap-2 transition ${
                      paymentMethod === "Click / Payme"
                        ? "border-amber-500 bg-amber-50/50 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Click / Payme"}
                      onChange={() => setPaymentMethod("Click / Payme")}
                      className="hidden"
                    />
                    <span>💳 Click / Payme</span>
                  </label>

                  <label
                    className={`col-span-2 p-3 rounded-xl border cursor-pointer font-bold flex items-center gap-2 transition ${
                      paymentMethod === "Pul o'tkazish (Hisob-faktura)"
                        ? "border-amber-500 bg-amber-50/50 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Pul o'tkazish (Hisob-faktura)"}
                      onChange={() => setPaymentMethod("Pul o'tkazish (Hisob-faktura)")}
                      className="hidden"
                    />
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>Yuridik shaxs (Schet-faktura / QQS bilan)</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Qo'shimcha izoh yoki talablar:
                </label>
                <textarea
                  rows="2"
                  placeholder="Masalan: Katta buxtada berilsin, ertalab yetkazilsin..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Summary details */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tovarlar jami:</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(totalAmount + totalSavings)}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Ulgurji tejov:</span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Toshkent bo'ylab yetkazish:</span>
                  <span className="font-semibold text-emerald-600">
                    {totalAmount >= 1000000 ? "Bepul" : "Kelishilgan holda"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>To'lanadigan summa:</span>
                  <span className="text-amber-600">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 transition shadow-xl shadow-amber-500/25 disabled:opacity-50 text-base"
              >
                {loading ? (
                  <span>Buyurtma yuborilmoqda...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Buyurtmani Tasdiqlash</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Buyurtma berilgach, ma'lumotlar avtomatik ravishda do'kon boshqaruvchisi Telegramiga yuboriladi.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
