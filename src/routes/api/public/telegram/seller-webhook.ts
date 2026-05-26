import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";
import { products, categoryOrder, formatUZS, type Category } from "@/lib/products";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number; title?: string; type?: string };
    from?: { first_name?: string; username?: string };
  };
};

const SITE_URL = "https://project--efea8e7b-d887-489e-aabd-f8c233d9366f.lovable.app";

const CATEGORY_LABEL: Record<Category, string> = {
  popular: "🔥 Mashhur",
  burgers: "🍔 Burgerlar",
  chicken: "🍗 Tovuq",
  pizza: "🍕 Pitsa",
  lavash: "🌯 Lavash",
  snacks: "🍟 Snaklar",
  drinks: "🥤 Ichimliklar",
  dessert: "🍦 Desert",
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function webhookSecret() {
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_SELLER_BOT_TOKEN is not configured");
  return createHash("sha256").update(`olovfood-seller-webhook:${token}`).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

const MAIN_KEYBOARD = {
  keyboard: [
    [{ text: "📋 Menyu" }, { text: "🛒 Buyurtma berish" }],
    [{ text: "📞 Aloqa" }, { text: "ℹ️ Bot haqida" }],
  ],
  resize_keyboard: true,
};

function categoriesKeyboard() {
  const rows: { text: string }[][] = [];
  const cats = categoryOrder.filter((c) => c !== "popular");
  for (let i = 0; i < cats.length; i += 2) {
    rows.push(cats.slice(i, i + 2).map((c) => ({ text: CATEGORY_LABEL[c] })));
  }
  rows.push([{ text: "🔙 Bosh menyu" }]);
  return { keyboard: rows, resize_keyboard: true };
}

async function send(chatId: number, text: string, reply_markup?: unknown) {
  const token = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_SELLER_BOT_TOKEN is not configured");
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup,
    }),
  });
}

function welcomeText(name: string, chatId: number) {
  return (
    `🛒 <b>OlovFood sotuvchi bot</b>\n\n` +
    `Salom, ${escapeHtml(name)}!\n\n` +
    `Bu botda menyuni ko'rishingiz va buyurtma berishingiz mumkin.\n\n` +
    `📋 <b>Menyu</b> — taomlar ro'yxati\n` +
    `🛒 <b>Buyurtma berish</b> — saytga o'tish\n` +
    `📞 <b>Aloqa</b> — bog'lanish\n\n` +
    `<i>Chat ID: ${chatId}</i>`
  );
}

function renderCategory(cat: Category) {
  const list = products.filter((p) => p.category === cat);
  if (list.length === 0) return "Ushbu bo'limda mahsulot yo'q.";
  const header = `<b>${CATEGORY_LABEL[cat]}</b>\n\n`;
  const body = list
    .map((p) => {
      const old = p.oldPrice ? ` <s>${formatUZS(p.oldPrice)}</s>` : "";
      const link = `${SITE_URL}/#${p.id}`;
      return `• <b>${escapeHtml(p.name.uz)}</b> — ${formatUZS(p.price)}${old}\n  <i>${escapeHtml(p.desc.uz)}</i>\n  🛒 <a href="${link}">Saytda buyurtma berish</a>`;
    })
    .join("\n\n");
  return header + body;
}

function renderPopular() {
  const list = products.filter((p) => p.popular);
  const body = list
    .map((p) => `• <b>${escapeHtml(p.name.uz)}</b> — ${formatUZS(p.price)}`)
    .join("\n");
  return `🔥 <b>Mashhur taomlar</b>\n\n${body}\n\n🛒 Buyurtma berish: ${SITE_URL}`;
}

async function handleStartOrder(chatId: number, orderCode: string) {
  const { supabaseAdmin } = await import("@/lib/orders.server");
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .maybeSingle();
  if (!order) {
    await send(chatId, `❌ Buyurtma <b>${escapeHtml(orderCode)}</b> topilmadi.`, MAIN_KEYBOARD);
    return;
  }
  await supabaseAdmin
    .from("telegram_links")
    .upsert({ phone: order.phone, chat_id: chatId, bot: "customer" }, { onConflict: "phone,bot" });
  await supabaseAdmin.from("orders").update({ customer_chat_id: chatId }).eq("id", order.id);
  const { STATUS_LABEL, STATUS_CUSTOMER_MSG } = await import("@/lib/orders.server");
  await send(
    chatId,
    `✅ <b>${escapeHtml(orderCode)}</b> kuzatishga ulandingiz!\n\n${STATUS_CUSTOMER_MSG[order.status as keyof typeof STATUS_CUSTOMER_MSG]}\n\nHolat: <b>${STATUS_LABEL[order.status as keyof typeof STATUS_LABEL]}</b>\n\nStatus o'zgarganda sizga avtomatik xabar yuboramiz.`,
    MAIN_KEYBOARD,
  );
}

async function handleText(chatId: number, text: string, name: string) {
  const t = text.trim();

  // Deep-link: /start order_OL-XXX
  const startMatch = t.match(/^\/start(?:@\S+)?\s+order_(.+)$/);
  if (startMatch) {
    await handleStartOrder(chatId, startMatch[1]);
    return;
  }

  if (t === "/start" || t.startsWith("/start@")) {
    await send(chatId, welcomeText(name, chatId), MAIN_KEYBOARD);
    return;
  }

  if (t === "📋 Menyu" || t === "/menu") {
    await send(chatId, "Kategoriyani tanlang:", categoriesKeyboard());
    return;
  }

  if (t === "🛒 Buyurtma berish" || t === "/order") {
    await send(
      chatId,
      `🛒 <b>Buyurtma berish</b>\n\nSaytga o'ting, mahsulotni tanlang, manzil va telefoningizni kiriting:\n\n${SITE_URL}\n\nBuyurtma avtomatik shu botga keladi.`,
      MAIN_KEYBOARD,
    );
    return;
  }

  if (t === "📞 Aloqa" || t === "/contact") {
    await send(
      chatId,
      `📞 <b>Aloqa</b>\n\n☎️ +998 90 000 00 00\n🌐 ${SITE_URL}\n📍 Toshkent shahri`,
      MAIN_KEYBOARD,
    );
    return;
  }

  if (t === "ℹ️ Bot haqida" || t === "/about") {
    await send(
      chatId,
      `ℹ️ <b>OlovFood bot</b>\n\nOlovFood — tez yetkazib berish xizmati. Burger, pitsa, tovuq, lavash va boshqa taomlar.\n\nMenyu ko'rish va buyurtma berish uchun pastdagi tugmalardan foydalaning.`,
      MAIN_KEYBOARD,
    );
    return;
  }

  if (t === "🔙 Bosh menyu") {
    await send(chatId, "Bosh menyu:", MAIN_KEYBOARD);
    return;
  }

  // Mashhur
  if (t === "🔥 Mashhur" || t === "/popular") {
    await send(chatId, renderPopular(), categoriesKeyboard());
    return;
  }

  // Category click
  const matched = (Object.entries(CATEGORY_LABEL) as [Category, string][]).find(
    ([, label]) => label === t,
  );
  if (matched) {
    await send(chatId, renderCategory(matched[0]), categoriesKeyboard());
    return;
  }

  await send(
    chatId,
    "Tushunmadim. Pastdagi tugmalardan foydalaning yoki /start bosing.",
    MAIN_KEYBOARD,
  );
}

export const Route = createFileRoute("/api/public/telegram/seller-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const actualSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";
        if (!safeEqual(actualSecret, webhookSecret())) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json()) as TelegramUpdate;
        const message = update.message;
        const chatId = message?.chat?.id;
        const text = message?.text?.trim();

        if (!chatId || !text) {
          return Response.json({ ok: true, ignored: true });
        }

        const name = message.from?.first_name ?? message.from?.username ?? "do'st";
        try {
          await handleText(chatId, text, name);
        } catch (e) {
          console.error("seller bot error", e);
        }

        return Response.json({ ok: true });
      },
      GET: async () => Response.json({ ok: true, bot: "OlovFood Seller" }),
    },
  },
});
