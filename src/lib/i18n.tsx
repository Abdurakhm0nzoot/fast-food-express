import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "ru" | "en";

type Dict = Record<string, { uz: string; ru: string; en: string }>;

export const dict = {
  // header
  "nav.menu": { uz: "Menyu", ru: "Меню", en: "Menu" },
  "nav.about": { uz: "Biz haqimizda", ru: "О нас", en: "About" },
  "nav.branches": { uz: "Filiallar", ru: "Филиалы", en: "Branches" },
  "nav.contacts": { uz: "Aloqa", ru: "Контакты", en: "Contacts" },
  "header.address": { uz: "Manzilingizni kiriting", ru: "Введите адрес", en: "Enter address" },
  "header.cart": { uz: "Savat", ru: "Корзина", en: "Cart" },
  "header.login": { uz: "Kirish", ru: "Войти", en: "Sign in" },
  "header.logout": { uz: "Chiqish", ru: "Выйти", en: "Sign out" },
  "header.myorders": { uz: "Buyurtmalarim", ru: "Мои заказы", en: "My orders" },
  "header.profile": { uz: "Mening ma'lumotlarim", ru: "Мои данные", en: "My profile" },

  // hero
  "hero.tag": { uz: "Yangi", ru: "Новинка", en: "New" },
  "hero.cta": { uz: "Buyurtma berish", ru: "Заказать", en: "Order now" },
  "hero.menu": { uz: "Bizning menyu", ru: "Наше меню", en: "Our menu" },

  "hero.slide1.title": { uz: "Macho Double — qo'sh porsiya go'sht", ru: "Macho Double — двойная порция мяса", en: "Macho Double — twice the beef" },
  "hero.slide1.sub": { uz: "Tishlamda yanada ko'proq lazzat. Faqat yetkazib berishda.", ru: "В каждом укусе вдвое больше вкуса. Только в доставке.", en: "Twice the flavor in every bite. Delivery only." },
  "hero.slide2.title": { uz: "Hot & Crispy chelagi", ru: "Ведро Hot & Crispy", en: "Hot & Crispy bucket" },
  "hero.slide2.sub": { uz: "8 dona qarsillama tovuq — butun oila uchun", ru: "8 кусочков хрустящей курицы для всей семьи", en: "8 crispy pieces for the whole family" },
  "hero.slide3.title": { uz: "Pizza yetkazib berish", ru: "Доставка пиццы", en: "Pizza delivery" },
  "hero.slide3.sub": { uz: "Toshkent bo'ylab 45 daqiqada", ru: "По Ташкенту за 45 минут", en: "Across Tashkent in 45 minutes" },

  // categories
  "cat.popular": { uz: "Mashhur", ru: "Популярное", en: "Popular" },
  "cat.burgers": { uz: "Burgerlar", ru: "Бургеры", en: "Burgers" },
  "cat.chicken": { uz: "Tovuq", ru: "Курица", en: "Chicken" },
  "cat.pizza": { uz: "Pitsa", ru: "Пицца", en: "Pizza" },
  "cat.snacks": { uz: "Yengil taomlar", ru: "Закуски", en: "Snacks" },
  "cat.drinks": { uz: "Ichimliklar", ru: "Напитки", en: "Drinks" },
  "cat.dessert": { uz: "Desert", ru: "Десерты", en: "Desserts" },

  "section.menu": { uz: "Bizning menyu", ru: "Наше меню", en: "Our menu" },
  "section.menu.sub": { uz: "Yangi pishirilgan, issiq holatda yetkaziladi", ru: "Свежеприготовленное, доставляется горячим", en: "Freshly cooked, delivered hot" },

  // product
  "product.add": { uz: "Qo'shish", ru: "Добавить", en: "Add" },
  "product.from": { uz: "dan", ru: "от", en: "from" },

  // cart
  "cart.empty": { uz: "Savat bo'sh", ru: "Корзина пуста", en: "Cart is empty" },
  "cart.empty.sub": { uz: "Menyudan biror narsa qo'shing", ru: "Добавьте что-нибудь из меню", en: "Add something from the menu" },
  "cart.subtotal": { uz: "Jami", ru: "Сумма", en: "Subtotal" },
  "cart.delivery": { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" },
  "cart.delivery.free": { uz: "Bepul", ru: "Бесплатно", en: "Free" },
  "cart.total": { uz: "Umumiy", ru: "Итого", en: "Total" },
  "cart.checkout": { uz: "Buyurtma berish", ru: "Оформить заказ", en: "Checkout" },
  "cart.title": { uz: "Sizning savatingiz", ru: "Ваша корзина", en: "Your cart" },

  // login
  "login.title": { uz: "Saytga kirish", ru: "Вход на сайт", en: "Sign in" },
  "login.phone": { uz: "Telefon raqam", ru: "Номер телефона", en: "Phone number" },
  "login.agree1": { uz: "Shaxsiy ma'lumotlarimni ulashishga roziman", ru: "Согласен на обработку персональных данных", en: "I agree to share my personal data" },
  "login.agree2": { uz: "Ommaviy taklifga roziman", ru: "Согласен с публичной офертой", en: "I agree to the public offer" },
  "login.button": { uz: "Kirish", ru: "Войти", en: "Sign in" },
  "login.welcome": { uz: "Xush kelibsiz", ru: "Добро пожаловать", en: "Welcome" },

  // address
  "addr.title": { uz: "Yetkazib berish manzili", ru: "Адрес доставки", en: "Delivery address" },
  "addr.search": { uz: "Manzilni qidiring yoki xaritada tanlang", ru: "Найдите адрес или выберите на карте", en: "Search address or pick on map" },
  "addr.search.placeholder": { uz: "Ko'cha, uy raqami…", ru: "Улица, дом…", en: "Street, house number…" },
  "addr.confirm": { uz: "Manzilni tasdiqlash", ru: "Подтвердить адрес", en: "Confirm address" },
  "addr.edit": { uz: "Tahrirlash", ru: "Изменить", en: "Edit" },
  "addr.entrance": { uz: "Podyezd / Kvartira (ixtiyoriy)", ru: "Подъезд / Квартира (необязательно)", en: "Entrance / Apt (optional)" },
  "addr.detect": { uz: "Joriy joylashuv", ru: "Моё местоположение", en: "My location" },
  "addr.set": { uz: "Manzil belgilang", ru: "Укажите адрес", en: "Set address" },

  // checkout
  "checkout.title": { uz: "Buyurtmani rasmiylashtirish", ru: "Оформление заказа", en: "Checkout" },
  "checkout.delivery": { uz: "Yetkazib berish manzili", ru: "Адрес доставки", en: "Delivery address" },
  "checkout.time": { uz: "Yetkazib berish vaqti", ru: "Время доставки", en: "Delivery time" },
  "checkout.time.fast": { uz: "Tezroq (~45 daqiqa)", ru: "Как можно быстрее (~45 мин)", en: "ASAP (~45 min)" },
  "checkout.note": { uz: "Izoh (ixtiyoriy)", ru: "Комментарий (необязательно)", en: "Note (optional)" },
  "checkout.submit": { uz: "Buyurtmani tasdiqlash", ru: "Подтвердить заказ", en: "Place order" },
  "checkout.success": { uz: "Buyurtmangiz qabul qilindi!", ru: "Ваш заказ принят!", en: "Order received!" },

  // footer
  "footer.tag": { uz: "Toshkent bo'ylab tezkor yetkazib berish", ru: "Быстрая доставка по Ташкенту", en: "Fast delivery across Tashkent" },
  "footer.rights": { uz: "Barcha huquqlar himoyalangan", ru: "Все права защищены", en: "All rights reserved" },
} satisfies Dict;

type Key = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "uz",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (saved && ["uz", "ru", "en"].includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: Key) => dict[k]?.[lang] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
