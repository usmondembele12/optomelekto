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

    const orderPayload = {
      customerName: body.customerName,
      phone: body.phone,
      district: body.district || "Toshkent shahri",
      address: body.address || "",
      paymentMethod: body.paymentMethod || "Naqd",
      notes: body.notes || "",
      items: body.items,
      totalAmount: body.totalAmount,
    };

    // Try creating order in storage
    let order = null;
    try {
      order = await createOrder(orderPayload);
    } catch (dbErr) {
      console.error("Storage write error (safe fallback):", dbErr);
      order = {
        id: `OE-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        status: "Yangi",
        ...orderPayload,
      };
    }

    // Send Telegram Notification (Guaranteed execution)
    let telegramResult = null;
    try {
      const settings = await getSettings();
      telegramResult = await sendOrderToTelegram(order, settings);
    } catch (tgErr) {
      console.error("Telegram notification failed:", tgErr);
      telegramResult = { success: false, error: tgErr.message };
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
