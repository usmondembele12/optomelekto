// Helper to escape HTML characters for Telegram HTML mode
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatPrice(number) {
  return new Intl.NumberFormat("uz-UZ").format(number) + " so'm";
}

const DEFAULT_BOT_TOKEN = "8954426665:AAHJc94iLVpctZ0mPJfcSWqkCg4ejMSidl8";
const DEFAULT_CHAT_ID = "8038275900";

export async function sendTelegramNotification({ token, chatId, text }) {
  const activeToken = token || process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const activeChatId = chatId || process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

  if (!activeToken || !activeChatId) {
    return {
      success: false,
      error: "Telegram Bot Token yoki Chat ID ko'rsatilmagan",
    };
  }

  try {
    const url = `https://api.telegram.org/bot${activeToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: activeChatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API response error:", data);
      return {
        success: false,
        error: data.description || "Telegram API xatolik berdi",
      };
    }

    return { success: true, messageId: data.result?.message_id };
  } catch (error) {
    console.error("Telegram notification error:", error);
    return { success: false, error: error.message };
  }
}

export async function sendOrderToTelegram(order, settings = {}) {
  const token =
    settings?.telegramBotToken ||
    process.env.TELEGRAM_BOT_TOKEN ||
    DEFAULT_BOT_TOKEN;
  const chatId =
    settings?.telegramChatId ||
    process.env.TELEGRAM_CHAT_ID ||
    DEFAULT_CHAT_ID;

  if (!token || !chatId) {
    return {
      success: false,
      warning: "Bot token yoki Chat ID belgilanmagan.",
    };
  }

  const itemsList = (order.items || [])
    .map((item, index) => {
      const priceText = formatPrice(item.price);
      const subtotalText = formatPrice(item.subtotal || item.price * item.quantity);
      const wholesaleTag = item.isWholesale ? " <i>(Optom narxda)</i>" : "";
      return (
        `<b>${index + 1}. ${escapeHtml(item.name)}</b>\n` +
        `   └ ${item.quantity} ${item.unit || "dona"} × ${priceText}${wholesaleTag} = <b>${subtotalText}</b>`
      );
    })
    .join("\n");

  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = [
    `⚡ <b>YANGI BUYURTMA #${escapeHtml(order.id || "OE-YANGI")}</b> ⚡`,
    `<i>Optom Elektro Toshkent</i>\n`,
    `👤 <b>Mijoz:</b> ${escapeHtml(order.customerName)}`,
    `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(order.phone)}">${escapeHtml(order.phone)}</a>`,
    `📍 <b>Tuman/Shahar:</b> ${escapeHtml(order.district || "Toshkent shahar")}`,
    `🏢 <b>Yetkazish manzili:</b> ${escapeHtml(order.address || "Ko'rsatilmagan")}`,
    `💳 <b>To'lov turi:</b> ${escapeHtml(order.paymentMethod || "Naqd")}`,
    order.notes ? `💬 <b>Izoh:</b> ${escapeHtml(order.notes)}` : null,
    `\n📦 <b>BUYURTMA TARKIBI:</b>`,
    itemsList,
    `\n💰 <b>JAMI SUMMA:</b> <b>${formatPrice(order.totalAmount || 0)}</b>`,
    `⏰ <b>Vaqt:</b> ${formattedDate}`,
    `\n<i>Optom Elektro savdo tizimi orqali qabul qilindi.</i>`,
  ]
    .filter(Boolean)
    .join("\n");

  return await sendTelegramNotification({ token, chatId, text: message });
}

export async function testTelegramConnection(token, chatId) {
  const activeToken = token || process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const activeChatId = chatId || process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

  const testMessage = [
    `✅ <b>TABRIKLAYMIZ!</b>`,
    `<b>Optom Elektro Toshkent</b> Telegram boti muvaffaqiyatli ulandi!`,
    `\nEndi sayt orqali kelib tushadigan barcha yangi buyurtmalar darhol shu chatga yuboriladi.`,
    `\n🕒 <i>Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}</i>`,
  ].join("\n");

  return await sendTelegramNotification({ token: activeToken, chatId: activeChatId, text: testMessage });
}
