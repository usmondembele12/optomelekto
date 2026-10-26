"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Zap,
  Check,
  Truck,
  ShieldCheck,
  FileText,
  PhoneCall,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import QuickOrderModal from "./QuickOrderModal";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);

  const isWholesale = quantity >= (product.minWholesaleQty || 10);
  const currentUnitPrice = isWholesale ? product.wholesalePrice : product.price;
  const totalPrice = currentUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Price Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 block font-medium">
                Chakana narx (dona/metr):
              </span>
              <div className="text-3xl font-black text-slate-950">
                {formatPrice(product.price)}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  /{product.unit}
                </span>
              </div>
            </div>

            {product.wholesalePrice && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-2 text-right">
                <span className="text-xs font-bold text-emerald-700 block">
                  Ulgurji (Optom) narx:
                </span>
                <span className="text-xl font-black text-emerald-700">
                  {formatPrice(product.wholesalePrice)}
                </span>
                <span className="text-[11px] text-emerald-600 block">
                  (Kamida {product.minWholesaleQty} {product.unit} xariddan boshlab)
                </span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Kerakli miqdor ({product.unit}):
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-2xl bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-slate-100 text-slate-700 font-extrabold text-lg transition"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-20 text-center py-3 text-base font-black border-x border-slate-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-slate-100 text-slate-700 font-extrabold text-lg transition"
                >
                  +
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[10, 50, 100, 500].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 hover:border-amber-300 transition"
                  >
                    +{num} {product.unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtotal preview */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600">
              Jami summa:
            </span>
            <div className="text-2xl font-black text-amber-600">
              {formatPrice(totalPrice)}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Savatga qo'shildi!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <span>Savatga qo'shish</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setQuickOrderOpen(true)}
              className="py-4 px-6 rounded-2xl font-black text-sm bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>1 bosishda buyurtma</span>
            </button>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-amber-500 shrink-0" />
            <span>Toshkentda 1 kunda yetkazish</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>GOST sertifikatli mahsulot</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-500 shrink-0" />
            <span>QQS bilan hisob-faktura</span>
          </div>
        </div>
      </div>

      <QuickOrderModal
        product={product}
        isOpen={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
      />
    </>
  );
}
