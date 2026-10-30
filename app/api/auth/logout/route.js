import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Tizimdan chiqildi" });
  response.cookies.delete("optom_user");
  response.cookies.delete("optom_guest");
  return response;
}

