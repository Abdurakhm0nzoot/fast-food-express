## Reja — buyurtmalar tizimi v2

### 1. Lovable Cloud yoqamiz
Buyurtmalar va statuslarni saqlash uchun DB kerak.

### 2. Ma'lumotlar bazasi
- `orders` jadvali: id, order_code, phone, address, lat, lng, entrance, note, items (jsonb), subtotal, delivery, total, status (`new` → `accepted` → `on_way` → `delivered` / `cancelled`), customer_chat_id, admin_message_id, seller_message_id, created_at, updated_at
- `telegram_links` jadvali: phone ↔ chat_id (mijoz botni /start qilganda yoziladi)
- RLS: anon insert/select faqat o'z order_code bo'yicha

### 3. Manzil validatsiyasi (`AddressModal` + `CheckoutModal`)
- lat/lng majburiy — qo'lda yozsa, Google geocode orqali tasdiqlaymiz
- Toshkent bounding box tekshiruvi (41.16–41.42, 69.13–69.45) — tashqarida bo'lsa toast bilan rad
- Telefon: `+998XXXXXXXXX` format, regex bilan
- Manzil 5+ belgi, entrance 100 belgi max

### 4. Mijoz boti tasdiq oqimi
- Checkout muvaffaqiyatdan keyin: "📱 Telegram orqali kuzatish" tugmasi → `https://t.me/<bot>?start=order_<code>`
- Mijoz bot ichida /start order_XXX bosadi → biz chat_id ni shu orderga + telefonga bog'laymiz
- Avtomatik: "✅ Buyurtmangiz qabul qilindi: ORDER-123" yuboriladi
- Status o'zgarsa avtomatik yangi xabar boradi

### 5. Admin bot tugmalari
Yangi buyurtma kelganda admin botga inline tugmalar bilan xabar:
```
[✅ Qabul qilish] 
[🚗 Yo'lda]      [✅ Yetkazildi]
[❌ Bekor qilish]
```
- Webhook `callback_query` ni qabul qiladi
- Bosilganda: order status DB'da yangilanadi, admin xabari edit qilinadi ("Status: Yo'lda"), mijozga yangi xabar yuboriladi, sayt Realtime orqali yangilanadi

### 6. Saytda real vaqt status
- Buyurtma berilgandan keyin `/order/$code` sahifasi ochiladi (yoki modal)
- Supabase Realtime subscription orderga: status o'zgarsa UI yangilanadi
- Progress bar: Qabul qilindi → Tayyorlanmoqda → Yo'lda → Yetkazildi
- "Mening buyurtmalarim" sahifasi — telefon bo'yicha tarix

### 7. Sotuvchi botdan to'liq buyurtma
Sotuvchi bot ichida menyu → mahsulot → savat → 📍 lokatsiya yuborish → telefon raqam → tasdiq → DB'ga order yoziladi va admin botga boradi (saytdagi kabi).
- In-memory session (chat_id → cart, step)
- Telegram `request_location` va `request_contact` tugmalaridan foydalanamiz

### 8. Server fayllar
- `src/lib/orders.functions.ts` — `createOrder`, `getOrderByCode` (realtime uchun publika), `updateOrderStatus`
- `src/routes/api/public/telegram/admin-webhook.ts` — admin bot callback_query handler (yangi token!)
- `src/routes/api/public/telegram/seller-webhook.ts` — refactor: bot ichida buyurtma flow
- `src/routes/order.$code.tsx` — realtime status sahifasi
- `src/components/CheckoutModal.tsx` — validatsiya + telegram link

### 9. Sozlash qadamlari (men qilaman)
1. Lovable Cloud yoqish
2. Migration: jadvallar + RLS + GRANTs
3. Admin bot uchun yangi token kerak bo'ladi (yoki mavjud `TELEGRAM_BOT_TOKEN`ni admin bot sifatida ishlatamiz) — buni siz allaqachon qo'shgansiz
4. Har 2 botga webhook qaytadan setWebhook qilamiz (callback_query allowed_updates qo'shilgani uchun)
5. Front + back kod

### Eslatma
Bu juda katta ish — 3 botli oqim + DB + realtime + bot ichidan buyurtma. Bir necha qadamda qilaman, har qadam tugagach sinaymiz. Davom etaymi?