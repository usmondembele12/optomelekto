import { NextResponse } from "next/server";
import { findUserByPhone } from "@/lib/db";

export async function GET(request) {
  try {
    const userCookie = request.cookies.get("optom_user");
    if (!userCookie?.value) {
      return NextResponse.json({ user: null });
    }

    let parsed = null;
    try {
      parsed = JSON.parse(userCookie.value);
    } catch {
      return NextResponse.json({ user: null });
    }

    if (parsed?.phone) {
      const dbUser = await findUserByPhone(parsed.phone);
      if (dbUser) {
        const { password, ...safe } = dbUser;
        return NextResponse.json({ user: safe });
      }
    }

    return NextResponse.json({ user: parsed });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
