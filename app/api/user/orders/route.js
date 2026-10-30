import { NextResponse } from "next/server";
import { getUserOrders, findUserByPhone } from "@/lib/db";

export async function GET(request) {
  try {
    const userCookie = request.cookies.get("optom_user");
    if (!userCookie?.value) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
    }

    let user = null;
    try {
      user = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json({ error: "Yaroqsiz sessiya" }, { status: 401 });
    }

    if (!user?.phone) {
      return NextResponse.json({ error: "Foydalanuvchi ma'lumoti topilmadi" }, { status: 400 });
    }

    const orders = await getUserOrders(user.phone);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("User orders error:", error);
    return NextResponse.json({ error: "Buyurtmalarni yuklashda xatolik" }, { status: 500 });
  }
}

