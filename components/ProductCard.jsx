"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Zap, Check, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import QuickOrderModal from "./QuickOrderModal";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [quickOrderOpen, setQuickOrderOpen] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent =
    product.wholesalePrice && product.price
      ? Math.round(((product.price - product.wholesalePrice) / product.price) * 100)
      : 0;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition duration-300 flex flex-col overflow-hidden relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm">
              -{discountPercent}% Optom
            </span>
          )}
        </div>

        {/* Image Container */}
        <Link
          href={`/mahsulot/${product.slug}`}
          className="block relative aspect-square overflow-hidden bg-slate-50"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Batafsil ko'rish
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-amber-600">{product.brand}</span>
            <span className="font-mono text-[11px]">{product.sku}</span>
          </div>

          {/* Title */}
          <Link
            href={`/mahsulot/${product.slug}`}
            className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-amber-600 transition line-clamp-2 mb-2"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Pricing Box */}
          <div className="mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between gap-1">
              <div>
                <span className="text-[11px] text-slate-400 block">Chakana:</span>
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-slate-500 ml-1">/{product.unit}</span>
              </div>

              {product.wholesalePrice && (
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    Ulgurji narx:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    (≥{product.minWholesaleQty} {product.unit})
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Qo'shildi</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Savatga</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setQuickOrderOpen(true)}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 flex items-center justify-center gap-1 shadow-sm transition"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>1 bosishda</span>
              </button>
            </div>
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
