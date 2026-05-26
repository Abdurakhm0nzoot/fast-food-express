// Server-only helpers for orders (Telegram messaging, status formatting)
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type OrderStatus = "new" | "accepted" | "preparing" | "on_way" | "delivered" | "cancelled";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  new: "⏳ Yangi buyurtma",
  accepted: "✅ Qabul qilindi",
  preparing: "👨‍🍳 Tayyorlanmoqda",
  on_way: "🚗 Yo'lda",
  delivered: "✅ Yetkazildi",
  cancelled: "❌ Bekor qilindi",
};

export const STATUS_CUSTOMER_MSG: Record<OrderStatus, string> = {
  new: "Buyurtmangiz qabul qilindi va ko'rib chiqilmoqda.",
  accepted: "✅ Buyurtmangiz qabul qilindi! Tez orada tayyorlashni boshlaymiz.",
  preparing: "👨‍🍳 Buyurtmangiz tayyorlanmoqda...",
  on_way: "🚗 Kuryer yo'lda! Tez orada yetkaziladi.",
  delivered: "✅ Buyurtmangiz yetkazildi. Yoqimli ishtaha! 🍽️",
  cancelled: "❌ Buyurtmangiz bekor qilindi. Batafsil ma'lumot uchun: +998 90 000 00 00",
};

export function fmtUZS(n: number) {
  return n.toLocaleString("ru-RU") + " so'm";
}

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateOrderCode() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `OL-${yy}${mm}${dd}-${rnd}`;
}

export function renderOrderText(order: {
  order_code: string;
  status: OrderStatus;
  phone: string;
  address: string;
  entrance?: string | null;
  lat?: number | null;
  lng?: number | null;
  note?: string | null;
  items: Array<{ name: string; qty: number; price: number }>;
  subtotal: number;
  delivery: number;
  total: number;
  source: string;
}) {
  const lines = order.items
    .map((i) => `• ${escapeHtml(i.name)} × ${i.qty} — <b>${fmtUZS(i.price * i.qty)}</b>`)
    .join("\n");
  const mapLink =
    order.lat && order.lng
      ? `\n📍 <a href="https://maps.google.com/?q=${order.lat},${order.lng}">Xaritada ko'rish</a>`
      : "";
  const src = order.source === "bot" ? " (Telegram bot)" : "";
  return (
    `🔥 <b>${STATUS_LABEL[order.status]}</b>\n` +
    `<b>${order.order_code}</b>${src}\n\n` +
    `👤 ${escapeHtml(order.phone)}\n` +
    `🏠 ${escapeHtml(order.address)}` +
    (order.entrance ? `\n🚪 ${escapeHtml(order.entrance)}` : "") +
    mapLink +
    (order.note ? `\n📝 ${escapeHtml(order.note)}` : "") +
    `\n\n<b>Mahsulotlar:</b>\n${lines}\n\n` +
    `Subtotal: ${fmtUZS(order.subtotal)}\n` +
    `Yetkazib berish: ${order.delivery === 0 ? "Bepul" : fmtUZS(order.delivery)}\n` +
    `<b>Jami: ${fmtUZS(order.total)}</b>`
  );
}

export function adminKeyboard(orderCode: string, currentStatus: OrderStatus) {
  // Hide buttons for terminal statuses
  if (currentStatus === "delivered" || currentStatus === "cancelled") {
    return { inline_keyboard: [[{ text: STATUS_LABEL[currentStatus], callback_data: "noop" }]] };
  }
  const btn = (label: string, status: OrderStatus) => ({
    text: label,
    callback_data: `s:${orderCode}:${status}`,
  });
  return {
    inline_keyboard: [
      [btn("✅ Qabul qilish", "accepted"), btn("👨‍🍳 Tayyorlash", "preparing")],
      [btn("🚗 Yo'lda", "on_way"), btn("✅ Yetkazildi", "delivered")],
      [btn("❌ Bekor qilish", "cancelled")],
    ],
  };
}

export async function tgRequest(token: string, method: string, body: unknown) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { ok: boolean; result?: any; description?: string };
  if (!data.ok) {
    console.error(`Telegram ${method} failed:`, data.description);
  }
  return data;
}

export async function sendAdminOrder(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chat) return null;
  const res = await tgRequest(token, "sendMessage", {
    chat_id: chat,
    text: renderOrderText(order),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: adminKeyboard(order.order_code, order.status),
  });
  return res.result?.message_id as number | undefined;
}

export async function sendSellerOrder(order: any) {
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  const chat = process.env.TELEGRAM_SELLER_CHAT_ID;
  if (!token || !chat) return null;
  const res = await tgRequest(token, "sendMessage", {
    chat_id: chat,
    text: renderOrderText(order),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
  return res.result?.message_id as number | undefined;
}

export async function updateAdminMessage(order: any) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_ADMIN_CHAT_ID;
  if (!token || !chat || !order.admin_message_id) return;
  await tgRequest(token, "editMessageText", {
    chat_id: chat,
    message_id: order.admin_message_id,
    text: renderOrderText(order),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: adminKeyboard(order.order_code, order.status),
  });
}

export async function notifyCustomer(order: any) {
  if (!order.customer_chat_id) return;
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!token) return;
  const status = order.status as OrderStatus;
  await tgRequest(token, "sendMessage", {
    chat_id: order.customer_chat_id,
    text:
      `<b>${order.order_code}</b>\n\n${STATUS_CUSTOMER_MSG[status]}\n\n` +
      `Holat: <b>${STATUS_LABEL[status]}</b>`,
    parse_mode: "HTML",
  });
}

// Cache for customer bot username (process-level)
let cachedBotUsername: string | null = null;
export async function getCustomerBotUsernameServer(): Promise<string | null> {
  if (cachedBotUsername) return cachedBotUsername;
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!token) return null;
  const res = await tgRequest(token, "getMe", {});
  const username = res.result?.username as string | undefined;
  if (username) cachedBotUsername = username;
  return cachedBotUsername;
}

export { supabaseAdmin };
