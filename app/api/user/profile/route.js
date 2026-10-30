import { NextResponse } from "next/server";
import { updateUser, findUserByPhone } from "@/lib/db";

export async function PUT(request) {
  try {
    const userCookie = request.cookies.get("optom_user");
    if (!userCookie?.value) {
      return NextResponse.json({ error: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
    }

    let currentUser = null;
    try {
      currentUser = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json({ error: "Yaroqsiz sessiya" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, activityType, city, address } = body || {};

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Ismingiz kamida 2 ta belgidan iborat bo'lishi kerak" }, { status: 400 });
    }

    const updated = await updateUser(currentUser.phone, {
      fullName,
      activityType,
      city,
      address,
    });

    if (!updated) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      message: "Profil ma'lumotlari muvaffaqiyatli saqlandi!",
      user: updated,
    });

    // Update cookie with latest user details
    response.cookies.set("optom_user", JSON.stringify(updated), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });

    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Profilni yangilashda xatolik yuz berdi" }, { status: 500 });
  }
}

