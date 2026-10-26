import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const settings = await getSettings();

    const currentPassword = settings.adminPassword || "admin";

    if (password === currentPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Muvaffaqiyatli tizimga kirildi",
      });

      // Set cookie for simple admin session
      response.cookies.set("optom_admin_auth", "authenticated_token_true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Parol noto'g'ri kiritildi" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
