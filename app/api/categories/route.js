import { NextResponse } from "next/server";
import { getCategories, saveCategory, deleteCategory } from "@/lib/db";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories });
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

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Kategoriya nomi kiritilishi shart" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const category = {
      id: body.id || slug,
      name: body.name,
      slug,
      description: body.description || "",
      icon: body.icon || "Zap",
      image:
        body.image ||
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80",
    };

    const saved = await saveCategory(category);
    return NextResponse.json({ success: true, category: saved });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID talab qilinadi" },
        { status: 400 }
      );
    }
    await deleteCategory(id);
    return NextResponse.json({ success: true, message: "Kategoriya o'chirildi" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
