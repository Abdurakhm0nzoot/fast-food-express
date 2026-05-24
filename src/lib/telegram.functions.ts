import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OrderItem = z.object({
  name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(99),
  price: z.number().int().min(0),
});

const OrderSchema = z.object({
  phone: z.string().min(4).max(40),
  address: z.string().min(1).max(500),
  entrance: z.string().max(300).optional().default(""),
  lat: z.number().optional(),
  lng: z.number().optional(),
  note: z.string().max(500).optional().default(""),
  items: z.array(OrderItem).min(1).max(50),
  subtotal: z.number().int().min(0),
  delivery: z.number().int().min(0),
  total: z.number().int().min(0),
});

async function sendTelegram(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  const data = (await res.json()) as { ok: boolean; description?: string };
  if (!res.ok || !data.ok) {
    throw new Error(`Telegram error [${res.status}]: ${data.description ?? "unknown"}`);
  }
}

export async function sendTelegramMessage(chatId: string | number, text: string) {
  await sendTelegram(String(chatId), text);
}

function fmtUZS(n: number) {
  return n.toLocaleString("ru-RU") + " so'm";
}

export const sendOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => OrderSchema.parse(d))
  .handler(async ({ data }) => {
    const adminChat = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!adminChat) throw new Error("TELEGRAM_ADMIN_CHAT_ID is not configured");

    const orderId = "OL-" + Date.now().toString().slice(-6);
    const lines = data.items
      .map((i) => `• ${i.name} × ${i.qty} — <b>${fmtUZS(i.price * i.qty)}</b>`)
      .join("\n");

    const mapLink =
      data.lat && data.lng
        ? `\n📍 <a href="https://maps.google.com/?q=${data.lat},${data.lng}">Xaritada ko'rish</a>`
        : "";

    const text =
      `🔥 <b>Yangi buyurtma ${orderId}</b>\n\n` +
      `👤 ${data.phone}\n` +
      `🏠 ${data.address}` +
      (data.entrance ? `\n🚪 ${data.entrance}` : "") +
      mapLink +
      (data.note ? `\n📝 ${data.note}` : "") +
      `\n\n<b>Buyurtma:</b>\n${lines}\n\n` +
      `Mahsulotlar: ${fmtUZS(data.subtotal)}\n` +
      `Yetkazib berish: ${data.delivery === 0 ? "Bepul" : fmtUZS(data.delivery)}\n` +
      `<b>Jami: ${fmtUZS(data.total)}</b>`;

    await sendTelegram(adminChat, text);
    return { ok: true, orderId };
  });
