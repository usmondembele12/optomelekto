import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/db";
import CatalogView from "@/components/CatalogView";

export const metadata = {
  title: "Barcha Mahsulotlar Katalogi — Kabellar, Avtomatika, Rozetkalar Toshkent",
  description:
    "Toshkentda elektrotexnika mahsulotlarining to'liq katalogi: GOST mis kabellar, Schneider va Chint avtomatlar, LED panellar va montaj jihozlari ulgurji narxda.",
};

export default async function CatalogPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Mahsulotlar Katalogi
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Toshkent omboridagi barcha elektrotexnika, kabellar va avtomatika jihozlari
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center text-slate-400">
            Katalog yuklanmoqda...
          </div>
        }
      >
        <CatalogView initialProducts={products} categories={categories} />
      </Suspense>
    </div>
  );
}
