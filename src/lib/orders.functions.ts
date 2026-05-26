import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  supabaseAdmin,
  generateOrderCode,
  sendAdminOrder,
  sendSellerOrder,
  getCustomerBotUsernameServer,
} from "./orders.server";

// Tashkent bounding box (approximate)
const TASHKENT_BBOX = { latMin: 41.16, latMax: 41.42, lngMin: 69.13, lngMax: 69.55 };

const OrderItem = z.object({
  name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(99),
  price: z.number().int().min(0),
});

const CreateOrderSchema = z.object({
  phone: z.string().regex(/^\+998\d{9}$/, "Telefon +998XXXXXXXXX formatda bo'lishi kerak"),
  address: z.string().min(5).max(500),
  entrance: z.string().max(300).optional().default(""),
  lat: z.number().refine((v) => v >= TASHKENT_BBOX.latMin && v <= TASHKENT_BBOX.latMax, {
    message: "Manzil Toshkent shahar hududidan tashqarida",
  }),
  lng: z.number().refine((v) => v >= TASHKENT_BBOX.lngMin && v <= TASHKENT_BBOX.lngMax, {
    message: "Manzil Toshkent shahar hududidan tashqarida",
  }),
  note: z.string().max(500).optional().default(""),
  items: z.array(OrderItem).min(1).max(50),
  subtotal: z.number().int().min(0),
  delivery: z.number().int().min(0),
  total: z.number().int().min(0),
  source: z.enum(["site", "bot"]).optional().default("site"),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CreateOrderSchema.parse(d))
  .handler(async ({ data }) => {
    // Normalize phone (strip spaces if any leaked through)
    const phone = data.phone.replace(/\s+/g, "");
    const orderCode = generateOrderCode();

    const insert = {
      order_code: orderCode,
      phone,
      address: data.address,
      entrance: data.entrance ?? "",
      lat: data.lat,
      lng: data.lng,
      note: data.note ?? "",
      items: data.items,
      subtotal: data.subtotal,
      delivery: data.delivery,
      total: data.total,
      status: "new" as const,
      source: data.source,
    };

    const { data: created, error } = await supabaseAdmin
      .from("orders")
      .insert(insert)
      .select("*")
      .single();

    if (error || !created) {
      console.error("createOrder DB error:", error);
      throw new Error("Buyurtmani saqlab bo'lmadi");
    }

    // Check if customer has linked telegram (by phone)
    const { data: link } = await supabaseAdmin
      .from("telegram_links")
      .select("chat_id")
      .eq("phone", phone)
      .eq("bot", "customer")
      .maybeSingle();

    let customerChatId: number | null = null;
    if (link?.chat_id) {
      customerChatId = Number(link.chat_id);
      await supabaseAdmin
        .from("orders")
        .update({ customer_chat_id: customerChatId })
        .eq("id", created.id);
    }

    // Send to admin + seller (fire and forget but await for message IDs)
    const orderWithChat = { ...created, customer_chat_id: customerChatId };
    const [adminMid, sellerMid] = await Promise.all([
      sendAdminOrder(orderWithChat).catch((e) => {
        console.error("admin send fail", e);
        return null;
      }),
      sendSellerOrder(orderWithChat).catch((e) => {
        console.error("seller send fail", e);
        return null;
      }),
    ]);

    if (adminMid || sellerMid) {
      await supabaseAdmin
        .from("orders")
        .update({
          admin_message_id: adminMid ?? null,
          seller_message_id: sellerMid ?? null,
        })
        .eq("id", created.id);
    }

    return { ok: true, orderCode, orderId: created.id };
  });

export const getCustomerBotUsername = createServerFn({ method: "GET" }).handler(async () => {
  const username = await getCustomerBotUsernameServer();
  return { username };
});
