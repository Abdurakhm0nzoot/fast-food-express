import cheeseburger from "@/assets/p-cheeseburger.jpg";
import chicken from "@/assets/p-chicken.jpg";
import fries from "@/assets/p-fries.jpg";
import shawarma from "@/assets/p-shawarma.jpg";
import hotdog from "@/assets/p-hotdog.jpg";
import cola from "@/assets/p-cola.jpg";
import nuggets from "@/assets/p-nuggets.jpg";
import icecream from "@/assets/p-icecream.jpg";
import pizzaMargherita from "@/assets/p-pizza-margherita.jpg";
import chickenBurger from "@/assets/p-chicken-burger.jpg";
import salad from "@/assets/p-salad.jpg";
import milkshake from "@/assets/p-milkshake.jpg";
import heroBurger from "@/assets/hero-burger.jpg";
import heroChicken from "@/assets/hero-chicken.jpg";
import heroPizza from "@/assets/hero-pizza.jpg";
import wings from "@/assets/p-wings.jpg";
import lavash from "@/assets/p-lavash.jpg";
import smash from "@/assets/p-smash.jpg";
import pizza4cheese from "@/assets/p-pizza-4cheese.jpg";
import onionRings from "@/assets/p-onion-rings.jpg";
import lemonade from "@/assets/p-lemonade.jpg";

export type Category = "popular" | "burgers" | "chicken" | "pizza" | "snacks" | "drinks" | "dessert";

export type Product = {
  id: string;
  category: Category;
  image: string;
  price: number; // UZS
  oldPrice?: number;
  popular?: boolean;
  name: { uz: string; ru: string; en: string };
  desc: { uz: string; ru: string; en: string };
};

export const products: Product[] = [
  {
    id: "macho-double",
    category: "burgers",
    image: heroBurger,
    price: 49000,
    oldPrice: 55000,
    popular: true,
    name: { uz: "Macho Double", ru: "Мачо Дабл", en: "Macho Double" },
    desc: { uz: "Qo'sh mol go'sht kotleti, qo'sh pishloq, salat va maxsus sous", ru: "Двойная говяжья котлета, двойной сыр, салат, фирменный соус", en: "Double beef patty, double cheese, lettuce, signature sauce" },
  },
  {
    id: "cheeseburger",
    category: "burgers",
    image: cheeseburger,
    price: 22000,
    popular: true,
    name: { uz: "Cheeseburger", ru: "Чизбургер", en: "Cheeseburger" },
    desc: { uz: "Klassik mol go'sht kotleti, eritilgan pishloq, salat va pomidor", ru: "Классическая говяжья котлета, плавленый сыр, салат, помидор", en: "Classic beef patty, melted cheese, lettuce, tomato" },
  },
  {
    id: "chicken-burger",
    category: "burgers",
    image: chickenBurger,
    price: 28000,
    name: { uz: "Spicy Chicken Burger", ru: "Спайси Чикен Бургер", en: "Spicy Chicken Burger" },
    desc: { uz: "O'tkir tovuq filesi, brioche bulochka, mayonez", ru: "Острое куриное филе, бриошь, майонез", en: "Spicy chicken fillet, brioche bun, mayo" },
  },
  {
    id: "hot-crispy",
    category: "chicken",
    image: heroChicken,
    price: 89000,
    oldPrice: 99000,
    popular: true,
    name: { uz: "Hot & Crispy chelagi", ru: "Ведро Hot & Crispy", en: "Hot & Crispy Bucket" },
    desc: { uz: "8 dona qarsillama qovurilgan tovuq", ru: "8 кусочков хрустящей курицы", en: "8 pieces of crispy fried chicken" },
  },
  {
    id: "chicken-plate",
    category: "chicken",
    image: chicken,
    price: 42000,
    name: { uz: "Tovuq oyog'i (3 dona)", ru: "Куриные ножки (3 шт)", en: "Chicken drumsticks (3 pcs)" },
    desc: { uz: "Qarsillama qoplam, sersuv ichi", ru: "Хрустящая корочка, сочное мясо", en: "Crispy coating, juicy inside" },
  },
  {
    id: "nuggets",
    category: "chicken",
    image: nuggets,
    price: 24000,
    name: { uz: "Tovuq nagetslari (6 dona)", ru: "Куриные наггетсы (6 шт)", en: "Chicken nuggets (6 pcs)" },
    desc: { uz: "Sousli, bolalar uchun ham mos", ru: "С соусом, подходит и детям", en: "With sauce, kids friendly" },
  },
  {
    id: "pizza-margherita",
    category: "pizza",
    image: pizzaMargherita,
    price: 75000,
    name: { uz: "Margarita pitsa", ru: "Пицца Маргарита", en: "Margherita Pizza" },
    desc: { uz: "Pomidor sousi, motsarella, rayhon", ru: "Томатный соус, моцарелла, базилик", en: "Tomato sauce, mozzarella, basil" },
  },
  {
    id: "pizza-pepperoni",
    category: "pizza",
    image: heroPizza,
    price: 92000,
    popular: true,
    name: { uz: "Pepperoni pitsa", ru: "Пицца Пепперони", en: "Pepperoni Pizza" },
    desc: { uz: "Pepperoni kolbasa, qo'sh pishloq, achchiq qalampir", ru: "Колбаса пепперони, двойной сыр, перчик", en: "Pepperoni sausage, double cheese, chili" },
  },
  {
    id: "fries",
    category: "snacks",
    image: fries,
    price: 14000,
    popular: true,
    name: { uz: "Frantsuz kartoshkasi", ru: "Картофель фри", en: "French Fries" },
    desc: { uz: "Oltin rangli, tuzlangan, qarsillama", ru: "Золотистый, солёный, хрустящий", en: "Golden, salted, crispy" },
  },
  {
    id: "shawarma",
    category: "snacks",
    image: shawarma,
    price: 32000,
    name: { uz: "Tovuq shaurma", ru: "Шаурма с курицей", en: "Chicken Shawarma" },
    desc: { uz: "Lavashda tovuq, sabzavotlar va sous", ru: "Курица, овощи и соус в лаваше", en: "Chicken, veggies and sauce in lavash" },
  },
  {
    id: "hotdog",
    category: "snacks",
    image: hotdog,
    price: 18000,
    name: { uz: "Klassik hot dog", ru: "Классический хот-дог", en: "Classic Hot Dog" },
    desc: { uz: "Sosiska, gorchitsa, ketchup, piyoz", ru: "Сосиска, горчица, кетчуп, лук", en: "Sausage, mustard, ketchup, onion" },
  },
  {
    id: "salad",
    category: "snacks",
    image: salad,
    price: 26000,
    name: { uz: "Sezar salat", ru: "Салат Цезарь", en: "Caesar Salad" },
    desc: { uz: "Qovurilgan tovuq, kruton, parmezan", ru: "Жареная курица, крутоны, пармезан", en: "Grilled chicken, croutons, parmesan" },
  },
  {
    id: "cola",
    category: "drinks",
    image: cola,
    price: 12000,
    name: { uz: "Coca-Cola 0.5L", ru: "Coca-Cola 0.5 л", en: "Coca-Cola 0.5L" },
    desc: { uz: "Sovuq, gazlangan", ru: "Холодная, газированная", en: "Cold, carbonated" },
  },
  {
    id: "milkshake",
    category: "drinks",
    image: milkshake,
    price: 22000,
    name: { uz: "Shokoladli kokteyl", ru: "Шоколадный коктейль", en: "Chocolate Milkshake" },
    desc: { uz: "Sut, muzqaymoq, shokolad sousi", ru: "Молоко, мороженое, шоколадный соус", en: "Milk, ice cream, chocolate syrup" },
  },
  {
    id: "icecream",
    category: "dessert",
    image: icecream,
    price: 16000,
    name: { uz: "Vanilli sundae", ru: "Ванильный сандэй", en: "Vanilla Sundae" },
    desc: { uz: "Yumshoq vanilli muzqaymoq, shokolad sousi", ru: "Мягкое ванильное мороженое, шоколадный соус", en: "Soft vanilla ice cream, chocolate sauce" },
  },
  {
    id: "les-ailes-wings",
    category: "chicken",
    image: wings,
    price: 56000,
    popular: true,
    name: { uz: "Buffalo qanotlar (8 dona)", ru: "Крылышки Buffalo (8 шт)", en: "Buffalo Wings (8 pcs)" },
    desc: { uz: "O'tkir buffalo sousda, ranch sous bilan", ru: "В остром соусе Buffalo, с соусом ранч", en: "In spicy buffalo sauce with ranch dip" },
  },
  {
    id: "oqtepa-lavash",
    category: "snacks",
    image: lavash,
    price: 35000,
    popular: true,
    name: { uz: "Mahsus lavash", ru: "Фирменный лаваш", en: "Signature Lavash" },
    desc: { uz: "Grill tovuq, sabzavotlar, sirli sous, yupqa lavashda", ru: "Гриль курица, овощи, фирменный соус, тонкий лаваш", en: "Grilled chicken, veggies, secret sauce, thin lavash" },
  },
  {
    id: "big-apple-smash",
    category: "burgers",
    image: smash,
    price: 59000,
    oldPrice: 65000,
    popular: true,
    name: { uz: "Big Smash Double", ru: "Биг Смэш Дабл", en: "Big Smash Double" },
    desc: { uz: "Ikki smash kotlet, cheddar, karamellashgan piyoz, mahsus sous", ru: "Две смэш-котлеты, чеддер, карамелизованный лук, фирменный соус", en: "Two smashed patties, cheddar, caramelized onion, signature sauce" },
  },
  {
    id: "bellissimo-4cheese",
    category: "pizza",
    image: pizza4cheese,
    price: 98000,
    name: { uz: "4 Pishloq pitsa", ru: "Пицца 4 Сыра", en: "4 Cheese Pizza" },
    desc: { uz: "Motsarella, parmezan, cheddar, gorgonzola", ru: "Моцарелла, пармезан, чеддер, горгонзола", en: "Mozzarella, parmesan, cheddar, gorgonzola" },
  },
  {
    id: "onion-rings",
    category: "snacks",
    image: onionRings,
    price: 19000,
    name: { uz: "Piyoz halqachalari", ru: "Луковые кольца", en: "Onion Rings" },
    desc: { uz: "Qarsillama qoplam, mahsus sous bilan", ru: "Хрустящая корочка, с фирменным соусом", en: "Crispy coating with house sauce" },
  },
  {
    id: "max-way-lemonade",
    category: "drinks",
    image: lemonade,
    price: 18000,
    name: { uz: "Limon-yalpiz limonad", ru: "Лимонад с мятой", en: "Mint Lemonade" },
    desc: { uz: "Yangi siqilgan limon, yalpiz, muz", ru: "Свежий лимон, мята, лёд", en: "Fresh lemon, mint, ice" },
  },
];

export const categoryOrder: Category[] = ["popular", "burgers", "chicken", "pizza", "snacks", "drinks", "dessert"];

export const formatUZS = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n) + " so'm";
