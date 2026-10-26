import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Zap, CheckCircle2, Shield, Box, Tag } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/db";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Mahsulot topilmadi" };
  }

  const title = `${product.name} — Toshkentda Optom Narxi`;
  const description = `${product.shortDescription} Toshkent omborimizdan ulgurji va chakana xarid qiling. Yetkazib berish xizmati.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  // Product JSON-LD for rich Google snippets
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description || product.shortDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "Optom Elektro",
    },
    offers: {
      "@type": "Offer",
      url: `https://optomelektro.uz/mahsulot/${product.slug}`,
      priceCurrency: "UZS",
      price: product.wholesalePrice || product.price,
      priceValidUntil: "2027-12-31",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Optom Elektro Toshkent",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
          <Link href="/" className="hover:text-amber-600 shrink-0">
            Bosh sahifa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/katalog" className="hover:text-amber-600 shrink-0">
            Katalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/katalog?category=${product.categoryId}`}
            className="hover:text-amber-600 shrink-0"
          >
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-800 font-semibold truncate">
            {product.name}
          </span>
        </nav>

        {/* Product Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Product Image */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl uppercase shadow">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Details & Order UI */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-lg">
                  {product.categoryName}
                </span>
                <span>Brend: <b>{product.brand}</b></span>
                <span>•</span>
                <span>Artikul: <b className="font-mono">{product.sku}</b></span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Stock status */}
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                <span>Toshkent omborida mavjud ({product.stock} {product.unit} tayyor)</span>
              </div>
            </div>

            {/* Short description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Client interactive buy & quantity component */}
            <ProductDetailClient product={product} />

            {/* Long description */}
            {product.description && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  Mahsulot haqida to'liq ma'lumot
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Technical Specifications Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h3 className="text-base font-bold text-slate-900">
                  Texnik xususiyatlari
                </h3>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs sm:text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {Object.entries(product.specs).map(([key, val], idx) => (
                        <tr
                          key={key}
                          className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
                        >
                          <td className="px-4 py-3 font-semibold text-slate-500 w-1/2">
                            {key}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              O'xshash Mahsulotlar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
