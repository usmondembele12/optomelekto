import { NextResponse } from "next/server";
import { updateOrderStatus, getOrders, getSettings } from "@/lib/db";
import { sendOrderToTelegram } from "@/lib/telegram";

export async function PATCH(request, context) {
  try {
    const authCookie = request.cookies.get("optom_admin_auth");
    if (authCookie?.value !== "authenticated_token_true") {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiyadan o'tilmagan" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { success: false, error: "Status talab qilinadi" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Buyurtma topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Resend telegram notification
export async function POST(request, context) {
  try {
    const { id } = await context.params;
    const orders = await getOrders();
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Buyurtma topilmadi" },
        { status: 404 }
      );
    }

    const settings = await getSettings();
    const telegramResult = await sendOrderToTelegram(order, settings);

    return NextResponse.json({
      success: true,
      telegram: telegramResult,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
