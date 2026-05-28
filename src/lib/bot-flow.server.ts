// Customer bot conversation flow: menu with photos, cart, checkout, place order.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { products, categoryOrder, formatUZS, type Category, type Product } from "@/lib/products";
import {
  generateOrderCode,
  sendAdminOrder,
  STATUS_LABEL,
  STATUS_CUSTOMER_MSG,
  tgRequest,
} from "@/lib/orders.server";

const SITE_URL = "https://project--efea8e7b-d887-489e-aabd-f8c233d9366f.lovable.app";
const DELIVERY_FEE = 15000;
const TASHKENT_BBOX = { latMin: 41.16, latMax: 41.42, lngMin: 69.13, lngMax: 69.55 };

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

type CartItem = { id: string; qty: number };
type Step = "idle" | "await_phone" | "await_location" | "await_address" | "confirm";
type Session = {
  cart: CartItem[];
  step: Step;
  phone?: string;
  lat?: number;
  lng?: number;
  address?: string;
  entrance?: string;
};

function emptySession(): Session {
  return { cart: [], step: "idle" };
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function loadSession(chatId: number): Promise<Session> {
  const { data } = await supabaseAdmin
    .from("bot_sessions")
    .select("state")
    .eq("chat_id", chatId)
    .maybeSingle();
  if (!data?.state) return emptySession();
  const s = data.state as Partial<Session>;
  return { cart: s.cart ?? [], step: s.step ?? "idle", phone: s.phone, lat: s.lat, lng: s.lng, address: s.address, entrance: s.entrance };
}

async function saveSession(chatId: number, s: Session) {
  await supabaseAdmin
    .from("bot_sessions")
    .upsert({ chat_id: chatId, bot: "customer", state: s, updated_at: new Date().toISOString() });
}

async function clearSession(chatId: number) {
  await supabaseAdmin.from("bot_sessions").delete().eq("chat_id", chatId);
}

function token() {
  const t = process.env.TELEGRAM_SELLER_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_SELLER_BOT_TOKEN is not configured");
  return t;
}

async function tg(method: string, body: unknown) {
  return tgRequest(token(), method, body);
}

const MAIN_KB = {
  keyboard: [
    [{ text: "📋 Menyu" }, { text: "🛒 Savat" }],
    [{ text: "📦 Buyurtmalarim" }, { text: "📞 Aloqa" }],
  ],
  resize_keyboard: true,
};

async function send(chatId: number, text: string, reply_markup: unknown = MAIN_KB) {
  await tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup,
  });
}

async function sendPhoto(chatId: number, photo: string, caption: string, reply_markup?: unknown) {
  await tg("sendPhoto", {
    chat_id: chatId,
    photo,
    caption,
    parse_mode: "HTML",
    reply_markup,
  });
}

async function answerCallback(id: string, text?: string) {
  await tg("answerCallbackQuery", { callback_query_id: id, text: text ?? "" });
}

function findProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

function cartTotal(cart: CartItem[]) {
  let subtotal = 0;
  for (const ci of cart) {
    const p = findProduct(ci.id);
    if (p) subtotal += p.price * ci.qty;
  }
  return subtotal;
}

function renderCart(cart: CartItem[]) {
  if (cart.length === 0) return "🛒 Savatingiz bo'sh.\n\n📋 Menyu tugmasini bosib mahsulot qo'shing.";
  const lines = cart
    .map((ci) => {
      const p = findProduct(ci.id);
      if (!p) return "";
      return `• ${esc(p.name.uz)} × ${ci.qty} — <b>${formatUZS(p.price * ci.qty)}</b>`;
    })
    .filter(Boolean)
    .join("\n");
  const sub = cartTotal(cart);
  const total = sub + DELIVERY_FEE;
  return (
    `🛒 <b>Savat</b>\n\n${lines}\n\n` +
    `Subtotal: ${formatUZS(sub)}\n` +
    `Yetkazib berish: ${formatUZS(DELIVERY_FEE)}\n` +
    `<b>Jami: ${formatUZS(total)}</b>`
  );
}

function cartKeyboard(cart: CartItem[]) {
  if (cart.length === 0) return undefined;
  const rows: any[][] = cart.map((ci) => {
    const p = findProduct(ci.id);
    const name = p ? p.name.uz.slice(0, 20) : ci.id;
    return [
      { text: "➖", callback_data: `dec:${ci.id}` },
      { text: `${name} (${ci.qty})`, callback_data: `p:${ci.id}` },
      { text: "➕", callback_data: `inc:${ci.id}` },
      { text: "🗑", callback_data: `rm:${ci.id}` },
    ];
  });
  rows.push([
    { text: "🗑 Tozalash", callback_data: "clr" },
    { text: "✅ Buyurtma berish", callback_data: "co" },
  ]);
  return { inline_keyboard: rows };
}

function categoriesKeyboard() {
  const cats = categoryOrder;
  const rows: any[][] = [];
  for (let i = 0; i < cats.length; i += 2) {
    rows.push(
      cats.slice(i, i + 2).map((c) => ({ text: CATEGORY_LABEL[c], callback_data: `cat:${c}` })),
    );
  }
  return { inline_keyboard: rows };
}

function categoryProductsKeyboard(cat: Category) {
  const list = cat === "popular" ? products.filter((p) => p.popular) : products.filter((p) => p.category === cat);
  const rows = list.map((p) => [
    { text: `${p.name.uz} — ${formatUZS(p.price)}`, callback_data: `p:${p.id}` },
  ]);
  rows.push([{ text: "🔙 Kategoriyalar", callback_data: "menu" }]);
  return { inline_keyboard: rows };
}

function productDetailKeyboard(productId: string, qty: number) {
  return {
    inline_keyboard: [
      [
        { text: "➖", callback_data: `dec:${productId}` },
        { text: `${qty}`, callback_data: "noop" },
        { text: "➕", callback_data: `inc:${productId}` },
      ],
      [{ text: `🛒 Savatga qo'shish`, callback_data: `add:${productId}` }],
      [{ text: "🔙 Menyuga", callback_data: "menu" }, { text: "🛒 Savat", callback_data: "cart" }],
    ],
  };
}

async function showMenu(chatId: number) {
  await send(chatId, "📋 <b>Menyu</b>\n\nKategoriyani tanlang:", MAIN_KB);
  await tg("sendMessage", {
    chat_id: chatId,
    text: "Quyidagi kategoriyalardan birini tanlang 👇",
    reply_markup: categoriesKeyboard(),
  });
}

async function showCategory(chatId: number, cat: Category) {
  const text = `<b>${CATEGORY_LABEL[cat]}</b>\n\nMahsulotni tanlang:`;
  await tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: categoryProductsKeyboard(cat),
  });
}

async function showProduct(chatId: number, productId: string, session: Session) {
  const p = findProduct(productId);
  if (!p) return;
  const inCart = session.cart.find((c) => c.id === productId)?.qty ?? 1;
  const old = p.oldPrice ? `  <s>${formatUZS(p.oldPrice)}</s>` : "";
  const caption =
    `<b>${esc(p.name.uz)}</b>\n\n` +
    `${esc(p.desc.uz)}\n\n` +
    `💰 <b>${formatUZS(p.price)}</b>${old}`;
  const photoUrl = `${SITE_URL}${p.image}`;
  await sendPhoto(chatId, photoUrl, caption, productDetailKeyboard(productId, inCart || 1));
}

async function startCheckout(chatId: number, session: Session) {
  if (session.cart.length === 0) {
    await send(chatId, "🛒 Savat bo'sh. Avval mahsulot qo'shing.");
    return;
  }
  session.step = "await_phone";
  await saveSession(chatId, session);
  await send(
    chatId,
    `📞 <b>Telefon raqamingizni yuboring</b>\n\nPastdagi tugmani bosing yoki +998XXXXXXXXX formatida yozing.`,
    {
      keyboard: [
        [{ text: "📞 Telefonni yuborish", request_contact: true }],
        [{ text: "❌ Bekor qilish" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  );
}

async function askLocation(chatId: number) {
  await send(
    chatId,
    `📍 <b>Yetkazish manzilini yuboring</b>\n\nPastdagi tugmani bosib joriy lokatsiyani yuboring (Toshkent ichida).`,
    {
      keyboard: [
        [{ text: "📍 Lokatsiyani yuborish", request_location: true }],
        [{ text: "❌ Bekor qilish" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  );
}

async function askAddressText(chatId: number) {
  await send(
    chatId,
    `🏠 <b>Manzilni yozing</b>\n\nKo'cha, uy raqami, kvartira, mo'ljal. Masalan: <i>Amir Temur 12, 5-uy, 33-xonadon</i>`,
    {
      keyboard: [[{ text: "❌ Bekor qilish" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  );
}

async function showConfirm(chatId: number, session: Session) {
  const lines = session.cart
    .map((ci) => {
      const p = findProduct(ci.id);
      return p ? `• ${esc(p.name.uz)} × ${ci.qty} — <b>${formatUZS(p.price * ci.qty)}</b>` : "";
    })
    .filter(Boolean)
    .join("\n");
  const sub = cartTotal(session.cart);
  const total = sub + DELIVERY_FEE;
  const text =
    `✅ <b>Buyurtmani tasdiqlang</b>\n\n` +
    `${lines}\n\n` +
    `📞 ${esc(session.phone ?? "")}\n` +
    `🏠 ${esc(session.address ?? "")}\n` +
    `📍 ${session.lat?.toFixed(5)}, ${session.lng?.toFixed(5)}\n\n` +
    `Subtotal: ${formatUZS(sub)}\n` +
    `Yetkazish: ${formatUZS(DELIVERY_FEE)}\n` +
    `<b>Jami: ${formatUZS(total)}</b>`;
  await tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "✅ Tasdiqlash", callback_data: "ok" }, { text: "❌ Bekor", callback_data: "cancel" }],
      ],
    },
  });
}

async function placeOrder(chatId: number, session: Session) {
  const items = session.cart
    .map((ci) => {
      const p = findProduct(ci.id);
      return p ? { name: p.name.uz, qty: ci.qty, price: p.price } : null;
    })
    .filter(Boolean) as { name: string; qty: number; price: number }[];

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = DELIVERY_FEE;
  const total = subtotal + delivery;
  const orderCode = generateOrderCode();

  const { data: created, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_code: orderCode,
      phone: session.phone!,
      address: session.address!,
      entrance: "",
      lat: session.lat!,
      lng: session.lng!,
      note: "",
      items,
      subtotal,
      delivery,
      total,
      status: "new",
      source: "bot",
      customer_chat_id: chatId,
    })
    .select("*")
    .single();

  if (error || !created) {
    console.error("bot placeOrder error", error);
    await send(chatId, "❌ Buyurtmani saqlashda xatolik. Iltimos, keyinroq urinib ko'ring.");
    return;
  }

  // Link phone ↔ chat_id for future status notifications
  await supabaseAdmin
    .from("telegram_links")
    .upsert(
      { phone: session.phone!, chat_id: chatId, bot: "customer" },
      { onConflict: "phone,bot" },
    );

  const adminMid = await sendAdminOrder(created).catch((e) => {
    console.error("admin send fail", e);
    return null;
  });
  if (adminMid) {
    await supabaseAdmin.from("orders").update({ admin_message_id: adminMid }).eq("id", created.id);
  }

  await clearSession(chatId);

  const trackUrl = `${SITE_URL}/order/${orderCode}`;
  await send(
    chatId,
    `🎉 <b>Buyurtmangiz qabul qilindi!</b>\n\n` +
      `Raqam: <b>${orderCode}</b>\n` +
      `Holat: <b>${STATUS_LABEL.new}</b>\n\n` +
      `${STATUS_CUSTOMER_MSG.new}\n\n` +
      `🌐 Saytda kuzatish: ${trackUrl}\n\n` +
      `Status o'zgarganda sizga avtomatik xabar yuboramiz.`,
    MAIN_KB,
  );
}

async function showMyOrders(chatId: number) {
  const { data } = await supabaseAdmin
    .from("orders")
    .select("order_code, status, total, created_at")
    .eq("customer_chat_id", chatId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (!data || data.length === 0) {
    await send(chatId, "📦 Sizda hali buyurtma yo'q.\n\nBirinchi buyurtmangizni 📋 Menyu orqali bering!");
    return;
  }
  const lines = data
    .map((o: any) => `• <b>${o.order_code}</b> — ${STATUS_LABEL[o.status as keyof typeof STATUS_LABEL]} — ${formatUZS(o.total)}\n  🌐 ${SITE_URL}/order/${o.order_code}`)
    .join("\n\n");
  await send(chatId, `📦 <b>Buyurtmalaringiz</b>\n\n${lines}`);
}

async function handleStartDeepLink(chatId: number, orderCode: string) {
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_code", orderCode)
    .maybeSingle();
  if (!order) {
    await send(chatId, `❌ Buyurtma <b>${esc(orderCode)}</b> topilmadi.`);
    return;
  }
  await supabaseAdmin
    .from("telegram_links")
    .upsert({ phone: order.phone, chat_id: chatId, bot: "customer" }, { onConflict: "phone,bot" });
  await supabaseAdmin.from("orders").update({ customer_chat_id: chatId }).eq("id", order.id);
  const st = order.status as keyof typeof STATUS_LABEL;
  await send(
    chatId,
    `✅ <b>${esc(orderCode)}</b> kuzatishga ulandingiz!\n\n${STATUS_CUSTOMER_MSG[st]}\n\nHolat: <b>${STATUS_LABEL[st]}</b>\n\nStatus o'zgarganda avtomatik xabar yuboramiz.`,
  );
}

// ========== MAIN HANDLERS ==========

export async function handleMessage(message: any) {
  const chatId = message.chat?.id as number | undefined;
  if (!chatId) return;
  const text: string = (message.text ?? "").trim();
  const contact = message.contact;
  const location = message.location;
  const name = message.from?.first_name ?? "do'st";

  const session = await loadSession(chatId);

  // Cancel from anywhere
  if (text === "❌ Bekor qilish") {
    session.step = "idle";
    await saveSession(chatId, session);
    await send(chatId, "Bekor qilindi.", MAIN_KB);
    return;
  }

  // Deep link
  const dl = text.match(/^\/start(?:@\S+)?\s+order_(.+)$/);
  if (dl) {
    await handleStartDeepLink(chatId, dl[1]);
    return;
  }

  if (text === "/start" || text.startsWith("/start@")) {
    await clearSession(chatId);
    await send(
      chatId,
      `👋 Salom, ${esc(name)}!\n\n🔥 <b>OlovFood</b>ga xush kelibsiz!\n\n` +
        `Botdan to'g'ridan-to'g'ri buyurtma berishingiz mumkin:\n` +
        `📋 Menyu → mahsulot tanlash\n` +
        `🛒 Savat → buyurtma berish\n` +
        `📦 Buyurtmalarim → tarix va status\n\n` +
        `Boshlash uchun 📋 Menyu tugmasini bosing.`,
      MAIN_KB,
    );
    return;
  }

  // Phone step
  if (session.step === "await_phone") {
    let phone = "";
    if (contact?.phone_number) phone = contact.phone_number;
    else phone = text.replace(/\s+/g, "");
    if (!phone.startsWith("+")) phone = "+" + phone;
    if (!/^\+998\d{9}$/.test(phone)) {
      await send(chatId, "❌ Telefon noto'g'ri. Format: +998XXXXXXXXX. Qaytadan urinib ko'ring yoki '📞 Telefonni yuborish' tugmasini bosing.");
      return;
    }
    session.phone = phone;
    session.step = "await_location";
    await saveSession(chatId, session);
    await askLocation(chatId);
    return;
  }

  // Location step
  if (session.step === "await_location") {
    if (!location?.latitude || !location?.longitude) {
      await send(chatId, "❌ Lokatsiya kerak. '📍 Lokatsiyani yuborish' tugmasini bosing.");
      return;
    }
    const { latitude: lat, longitude: lng } = location;
    if (lat < TASHKENT_BBOX.latMin || lat > TASHKENT_BBOX.latMax || lng < TASHKENT_BBOX.lngMin || lng > TASHKENT_BBOX.lngMax) {
      await send(chatId, "❌ Manzil Toshkent shahar hududidan tashqarida. Iltimos, Toshkent ichidagi lokatsiyani yuboring.");
      return;
    }
    session.lat = lat;
    session.lng = lng;
    session.step = "await_address";
    await saveSession(chatId, session);
    await askAddressText(chatId);
    return;
  }

  // Address step
  if (session.step === "await_address") {
    if (text.length < 5) {
      await send(chatId, "❌ Manzil juda qisqa. Kamida 5 belgi kiriting.");
      return;
    }
    session.address = text.slice(0, 500);
    session.step = "confirm";
    await saveSession(chatId, session);
    await showConfirm(chatId, session);
    return;
  }

  // Main menu commands
  if (text === "📋 Menyu" || text === "/menu") {
    await showMenu(chatId);
    return;
  }
  if (text === "🛒 Savat" || text === "/cart") {
    await send(chatId, renderCart(session.cart), MAIN_KB);
    if (session.cart.length > 0) {
      await tg("sendMessage", { chat_id: chatId, text: "Boshqarish:", reply_markup: cartKeyboard(session.cart) });
    }
    return;
  }
  if (text === "📦 Buyurtmalarim" || text === "/orders") {
    await showMyOrders(chatId);
    return;
  }
  if (text === "📞 Aloqa" || text === "/contact") {
    await send(chatId, `📞 <b>Aloqa</b>\n\n☎️ +998 90 000 00 00\n🌐 ${SITE_URL}\n📍 Toshkent shahri`);
    return;
  }

  await send(chatId, "Tushunmadim. 📋 Menyu yoki /start bosing.", MAIN_KB);
}

export async function handleCallback(cq: any) {
  const chatId = cq.message?.chat?.id as number | undefined;
  const data: string = cq.data ?? "";
  if (!chatId) return;
  await answerCallback(cq.id);

  const session = await loadSession(chatId);

  if (data === "noop") return;
  if (data === "menu") {
    await showMenu(chatId);
    return;
  }
  if (data === "cart") {
    await send(chatId, renderCart(session.cart), MAIN_KB);
    if (session.cart.length > 0) {
      await tg("sendMessage", { chat_id: chatId, text: "Boshqarish:", reply_markup: cartKeyboard(session.cart) });
    }
    return;
  }
  if (data === "clr") {
    session.cart = [];
    await saveSession(chatId, session);
    await send(chatId, "🗑 Savat tozalandi.", MAIN_KB);
    return;
  }
  if (data === "co") {
    await startCheckout(chatId, session);
    return;
  }
  if (data === "ok") {
    if (session.step !== "confirm") {
      await send(chatId, "Sessiya tugagan. Qaytadan boshlang.");
      return;
    }
    await placeOrder(chatId, session);
    return;
  }
  if (data === "cancel") {
    await clearSession(chatId);
    await send(chatId, "❌ Buyurtma bekor qilindi.", MAIN_KB);
    return;
  }

  if (data.startsWith("cat:")) {
    await showCategory(chatId, data.slice(4) as Category);
    return;
  }
  if (data.startsWith("p:")) {
    await showProduct(chatId, data.slice(2), session);
    return;
  }
  if (data.startsWith("add:")) {
    const id = data.slice(4);
    const item = session.cart.find((c) => c.id === id);
    if (item) item.qty += 1;
    else session.cart.push({ id, qty: 1 });
    await saveSession(chatId, session);
    const p = findProduct(id);
    await answerCallback(cq.id, `✅ ${p?.name.uz ?? "Mahsulot"} qo'shildi`);
    await send(chatId, `✅ <b>${esc(p?.name.uz ?? "")}</b> savatga qo'shildi.\n\n🛒 Savat: ${formatUZS(cartTotal(session.cart))}`);
    return;
  }
  if (data.startsWith("inc:")) {
    const id = data.slice(4);
    const item = session.cart.find((c) => c.id === id);
    if (item) item.qty += 1;
    else session.cart.push({ id, qty: 1 });
    await saveSession(chatId, session);
    if (cq.message?.message_id) {
      await tg("editMessageReplyMarkup", {
        chat_id: chatId,
        message_id: cq.message.message_id,
        reply_markup: cartKeyboard(session.cart),
      }).catch(() => {});
    }
    return;
  }
  if (data.startsWith("dec:")) {
    const id = data.slice(4);
    const item = session.cart.find((c) => c.id === id);
    if (item) {
      item.qty -= 1;
      if (item.qty <= 0) session.cart = session.cart.filter((c) => c.id !== id);
    }
    await saveSession(chatId, session);
    if (cq.message?.message_id) {
      await tg("editMessageReplyMarkup", {
        chat_id: chatId,
        message_id: cq.message.message_id,
        reply_markup: cartKeyboard(session.cart),
      }).catch(() => {});
    }
    return;
  }
  if (data.startsWith("rm:")) {
    const id = data.slice(3);
    session.cart = session.cart.filter((c) => c.id !== id);
    await saveSession(chatId, session);
    if (cq.message?.message_id) {
      await tg("editMessageReplyMarkup", {
        chat_id: chatId,
        message_id: cq.message.message_id,
        reply_markup: cartKeyboard(session.cart),
      }).catch(() => {});
    }
    return;
  }
}
