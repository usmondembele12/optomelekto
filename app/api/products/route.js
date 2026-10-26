import { NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = await getProducts();

    if (category) {
      products = products.filter(
        (p) => p.categoryId === category || p.categorySlug === category
      );
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: "Mahsulot nomi va narxi talab qilinadi" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const newProduct = {
      id: body.id || `prod-${Date.now()}`,
      name: body.name,
      slug: slug,
      categoryId: body.categoryId || "boshqa",
      categoryName: body.categoryName || "Boshqa",
      brand: body.brand || "Optom Elektro",
      sku: body.sku || `OE-${Math.floor(1000 + Math.random() * 9000)}`,
      price: Number(body.price),
      wholesalePrice: Number(body.wholesalePrice) || Number(body.price),
      minWholesaleQty: Number(body.minWholesaleQty) || 10,
      unit: body.unit || "dona",
      stock: Number(body.stock) || 100,
      inStock: body.inStock !== false,
      isFeatured: Boolean(body.isFeatured),
      badge: body.badge || "",
      image:
        body.image ||
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80",
      shortDescription: body.shortDescription || "",
      description: body.description || "",
      specs: body.specs || {},
    };

    const saved = await saveProduct(newProduct);
    return NextResponse.json({ success: true, product: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
