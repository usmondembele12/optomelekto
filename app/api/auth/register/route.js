import { NextResponse } from "next/server";
import { createUser, findUserByPhone } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, phone, password, activityType, city, address } = body || {};

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Iltimos, to'liq ism-familiyangizni kiriting" },
        { status: 400 }
      );
    }

    if (!phone || phone.replace(/[^\d]/g, "").length < 9) {
      return NextResponse.json(
        { error: "Iltimos, to'g'ri telefon raqam kiriting (masalan, +998 90 123 45 67)" },
        { status: 400 }
      );
    }

    if (!password || password.length < 4) {
      return NextResponse.json(
        { error: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    // Check if phone already registered
    const existing = await findUserByPhone(phone);
    if (existing) {
      return NextResponse.json(
        {
          error:
            "Ushbu telefon raqami allaqachon ro'yxatdan o'tgan. Iltimos, 'Kirish' bo'limidan kiring.",
          isExisting: true,
        },
        { status: 409 }
      );
    }

    const newUser = await createUser({
      fullName,
      phone,
      password,
      activityType: activityType || "Jismoniy shaxs",
      city: city || "Toshkent shahri",
      address: address || "",
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      user: newUser,
    });

    // Set cookie for 60 days
    response.cookies.set("optom_user", JSON.stringify(newUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Ro'yxatdan o'tishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring." },
      { status: 500 }
    );
  }
}

