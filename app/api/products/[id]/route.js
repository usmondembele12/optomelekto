import { NextResponse } from "next/server";
import { getProductById, saveProduct, deleteProduct } from "@/lib/db";

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Mahsulot topilmadi" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const product = await saveProduct({
      ...body,
      id,
      price: Number(body.price),
      wholesalePrice: Number(body.wholesalePrice) || Number(body.price),
      minWholesaleQty: Number(body.minWholesaleQty) || 10,
      stock: Number(body.stock) || 0,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Mahsulot o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
