import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, password } = body || {};

    if (!phone) {
      return NextResponse.json(
        { error: "Telefon raqamingizni kiriting" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Parolingizni kiriting" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(phone, password);
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Telefon raqam yoki parol noto'g'ri. Agar hisobingiz bo'lmasa, ro'yxatdan o'ting.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz!",
      user,
    });

    response.cookies.set("optom_user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 60,
    });

    response.cookies.delete("optom_guest");

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Tizimga kirishda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}

