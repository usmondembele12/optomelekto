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

export async function sendTelegramNotification({ token, chatId, text }) {
  if (!token || !chatId) {
    return {
      success: false,
      error: "Telegram Bot Token yoki Chat ID ko'rsatilmagan",
    };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
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

export async function sendOrderToTelegram(order, settings) {
  const token = settings.telegramBotToken;
  const chatId = settings.telegramChatId;

  if (!token || !chatId) {
    return {
      success: false,
      warning: "Bot token yoki Chat ID belgilanmagan. Buyurtma faqat admin panelga saqlandi.",
    };
  }

  const itemsList = order.items
    .map((item, index) => {
      const priceText = formatPrice(item.price);
      const subtotalText = formatPrice(item.subtotal || item.price * item.quantity);
      const wholesaleTag = item.isWholesale ? " <i>(Optom)</i>" : "";
      return (
        `<b>${index + 1}. ${escapeHtml(item.name)}</b>\n` +
        `   └ ${item.quantity} ${item.unit || "dona"} × ${priceText}${wholesaleTag} = <b>${subtotalText}</b>`
      );
    })
    .join("\n");

  const formattedDate = new Date(order.createdAt).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = [
    `⚡ <b>YANGI BUYURTMA #${escapeHtml(order.id)}</b> ⚡`,
    `<i>Optom Elektro Toshkent</i>\n`,
    `👤 <b>Mijoz:</b> ${escapeHtml(order.customerName)}`,
    `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(order.phone)}">${escapeHtml(order.phone)}</a>`,
    `📍 <b>Tuman/Shahar:</b> ${escapeHtml(order.district || "Toshkent shahar")}`,
    `🏢 <b>Yetkazish manzili:</b> ${escapeHtml(order.address || "Ko'rsatilmagan")}`,
    `💳 <b>To'lov turi:</b> ${escapeHtml(order.paymentMethod || "Naqd")}`,
    order.notes ? `💬 <b>Izoh:</b> ${escapeHtml(order.notes)}` : null,
    `\n📦 <b>BUYURTMA TARKIBI:</b>`,
    itemsList,
    `\n💰 <b>JAMI SUMMA:</b> <b>${formatPrice(order.totalAmount)}</b>`,
    `⏰ <b>Vaqt:</b> ${formattedDate}`,
    `\n<i>Buyurtmani ko'rish uchun sayt admin paneliga kiring!</i>`,
  ]
    .filter(Boolean)
    .join("\n");

  return await sendTelegramNotification({ token, chatId, text: message });
}

export async function testTelegramConnection(token, chatId) {
  const testMessage = [
    `✅ <b>TABRIKLAYMIZ!</b>`,
    `<b>Optom Elektro Toshkent</b> Telegram boti muvaffaqiyatli ulandi!`,
    `\nEndi sayt orqali kelib tushadigan barcha yangi buyurtmalar darhol shu chatga yuboriladi.`,
    `\n🕒 <i>Vaqt: ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}</i>`,
  ].join("\n");

  return await sendTelegramNotification({ token, chatId, text: testMessage });
}
