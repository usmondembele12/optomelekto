import { NextResponse } from "next/server";
import { getOrders, createOrder, getSettings } from "@/lib/db";
import { sendOrderToTelegram } from "@/lib/telegram";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, orders });
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

    if (!body.customerName || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Ism va telefon raqami kiritilishi shart" },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Savatda mahsulotlar yo'q" },
        { status: 400 }
      );
    }

    // Save order
    const order = await createOrder({
      customerName: body.customerName,
      phone: body.phone,
      district: body.district || "Toshkent shahri",
      address: body.address || "",
      paymentMethod: body.paymentMethod || "Naqd",
      notes: body.notes || "",
      items: body.items,
      totalAmount: body.totalAmount,
    });

    // Send Telegram Notification
    const settings = await getSettings();
    let telegramResult = null;
    if (settings.telegramBotToken && settings.telegramChatId) {
      try {
        telegramResult = await sendOrderToTelegram(order, settings);
      } catch (tgErr) {
        console.error("Telegram notification failed:", tgErr);
        telegramResult = { success: false, error: tgErr.message };
      }
    } else {
      telegramResult = {
        success: false,
        warning: "Telegram bot sozlanmagan. Buyurtma faqat admin panelga saqlandi.",
      };
    }

    return NextResponse.json({
      success: true,
      order,
      telegram: telegramResult,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
