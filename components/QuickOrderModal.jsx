"use client";

import { useState } from "react";
import { X, CheckCircle, Send, Phone, User, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function QuickOrderModal({ product, isOpen, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [district, setDistrict] = useState("Toshkent shahri");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const isWholesale = quantity >= (product.minWholesaleQty || 10);
  const unitPrice = isWholesale ? product.wholesalePrice : product.price;
  const totalAmount = unitPrice * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || phone.trim().length < 9) {
      setError("Iltimos, ismingiz va to'liq telefon raqamingizni kiriting!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        district,
        address: address.trim(),
        paymentMethod: "Naqd yetkazilganda",
        notes: "1 bosishda tezkor buyurtma orqali yuborildi.",
        items: [
          {
            id: product.id,
            name: product.name,
            price: unitPrice,
            originalPrice: product.price,
            isWholesale,
            unit: product.unit || "dona",
            quantity: Number(quantity),
            subtotal: totalAmount,
          },
        ],
        totalAmount,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Buyurtma yuborishda xatolik");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              ⚡
            </span>
            <div>
              <h3 className="font-bold text-lg">1 Bosishda Buyurtma</h3>
              <p className="text-xs text-slate-400">
                Operatorimiz 10 daqiqada siz bilan bog'lanadi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Buyurtmangiz qabul qilindi!
            </h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Ma'lumotlar do'kon boshqaruvchisiga va Telegram botga yuborildi.
              Tez orada menejerimiz sizga qo'ng'iroq qiladi.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl"
            >
              Yopish
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                {error}
              </div>
            )}

            {/* Product summary snippet */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-xl shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {product.name}
                </p>
                <div className="text-xs text-slate-600 mt-1 flex items-center justify-between">
                  <span>
                    Dona narxi: <b>{formatPrice(unitPrice)}</b>
                  </span>
                  {isWholesale && (
                    <span className="text-[11px] bg-emerald-600 text-white font-bold px-1.5 py-0.5 rounded">
                      Optom narx!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Miqdori ({product.unit || "dona"}):
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 text-center bg-white py-2 text-sm font-bold border-x border-slate-300 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-right flex-1">
                  <span className="text-xs text-slate-500">Jami hisob:</span>
                  <div className="text-base font-extrabold text-amber-600">
                    {formatPrice(totalAmount)}
                  </div>
                </div>
              </div>
              {product.minWholesaleQty && quantity < product.minWholesaleQty && (
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 {product.minWholesaleQty} {product.unit}dan ko'p xarid qilsangiz ulgurji narx:{" "}
                  <b>{formatPrice(product.wholesalePrice)}</b>
                </p>
              )}
            </div>

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

            {/* Address */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tuman:
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                >
                  <option value="Chilonzor tumani">Chilonzor</option>
                  <option value="Sergeli tumani">Sergeli</option>
                  <option value="Yunusobod tumani">Yunusobod</option>
                  <option value="Mirzo Ulug'bek">Mirzo Ulug'bek</option>
                  <option value="Yakkasaroy tumani">Yakkasaroy</option>
                  <option value="Mirobod tumani">Mirobod</option>
                  <option value="Shayxontohur tumani">Shayxontohur</option>
                  <option value="Uchtepa tumani">Uchtepa</option>
                  <option value="Olmazor tumani">Olmazor</option>
                  <option value="Yashnobod tumani">Yashnobod</option>
                  <option value="Yangihayot tumani">Yangihayot</option>
                  <option value="Boshqa viloyat">Boshqa viloyat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mo'ljal / Manzil:
                </label>
                <input
                  type="text"
                  placeholder="Ko'cha, uy raqami"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <span>Yuborilmoqda...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Buyurtmani tasdiqlash ({formatPrice(totalAmount)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
