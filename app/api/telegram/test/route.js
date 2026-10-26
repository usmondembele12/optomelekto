import { NextResponse } from "next/server";
import { testTelegramConnection } from "@/lib/telegram";
import { getSettings } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    let token = body.token;
    let chatId = body.chatId;

    if (!token || !chatId) {
      const settings = await getSettings();
      token = token || settings.telegramBotToken;
      chatId = chatId || settings.telegramChatId;
    }

    if (!token || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Telegram Bot Token yoki Chat ID topilmadi. Avval ularni kiriting.",
        },
        { status: 400 }
      );
    }

    const result = await testTelegramConnection(token, chatId);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Telegramga xabar yuborib bo'lmadi",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test xabari Telegramga muvaffaqiyatli yuborildi!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
