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
import pizza4cheese from "@/assets/p-pizza-4cheese.jpg";
import onionRings from "@/assets/p-onion-rings.jpg";
import lemonade from "@/assets/p-lemonade.jpg";
import strips from "@/assets/p-strips.jpg";
import wingsSpicy from "@/assets/p-wings-spicy.jpg";
import pizzaHawaiian from "@/assets/p-pizza-hawaiian.jpg";
import pizzaBbq from "@/assets/p-pizza-bbq.jpg";
import pizza4seasons from "@/assets/p-pizza-4seasons.jpg";
import pizzaStroganoff from "@/assets/p-pizza-stroganoff.jpg";
import pizzaCheese from "@/assets/p-pizza-cheese.jpg";
import lavashBig from "@/assets/p-lavash-big.jpg";
import lavashMini from "@/assets/p-lavash-mini.jpg";
import lavashCheese from "@/assets/p-lavash-cheese.jpg";
import lavashLyulya from "@/assets/p-lavash-lyulya.jpg";
import lavashHot from "@/assets/p-lavash-hot.jpg";

export type Category = "popular" | "burgers" | "chicken" | "pizza" | "lavash" | "snacks" | "drinks" | "dessert";

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
  // BURGERS
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

  // CHICKEN
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
    id: "strips-3",
    category: "chicken",
    image: strips,
    price: 22000,
    name: { uz: "Stripslar (3 dona)", ru: "Стрипсы (3 шт)", en: "Strips (3 pcs)" },
    desc: { uz: "Tovuq filesi panirovkada (3 dona, 94g)", ru: "Курица в панировке (3 шт, 94г)", en: "Breaded chicken fillet (3 pcs, 94g)" },
  },
  {
    id: "strips-6",
    category: "chicken",
    image: strips,
    price: 33000,
    name: { uz: "Stripslar (6 dona)", ru: "Стрипсы (6 шт)", en: "Strips (6 pcs)" },
    desc: { uz: "Tovuq filesi panirovkada (6 dona, 184g)", ru: "Курица в панировке (6 шт, 184г)", en: "Breaded chicken fillet (6 pcs, 184g)" },
  },
  {
    id: "spicy-wings-3",
    category: "chicken",
    image: wingsSpicy,
    price: 22000,
    name: { uz: "O'tkir qanotlar (3 dona)", ru: "Острые крылышки (3 шт)", en: "Spicy Wings (3 pcs)" },
    desc: { uz: "Nordon-shirin o'tkir sousda qovurilgan qanotlar (160g)", ru: "Крылышки в кисло-сладком остром соусе (160г)", en: "Wings in sweet-sour spicy sauce (160g)" },
  },
  {
    id: "spicy-wings-6",
    category: "chicken",
    image: wingsSpicy,
    price: 40000,
    popular: true,
    name: { uz: "O'tkir qanotlar (6 dona)", ru: "Острые крылышки (6 шт)", en: "Spicy Wings (6 pcs)" },
    desc: { uz: "Nordon-shirin o'tkir sousda qovurilgan qanotlar (320g)", ru: "Крылышки в кисло-сладком остром соусе (320г)", en: "Wings in sweet-sour spicy sauce (320g)" },
  },
  {
    id: "wings-3",
    category: "chicken",
    image: wings,
    price: 21000,
    name: { uz: "Qanotlar (3 dona)", ru: "Крылышки (3 шт)", en: "Wings (3 pcs)" },
    desc: { uz: "Qovurilgan tovuq qanotlari (870g uchun nisbat)", ru: "Жареные куриные крылышки", en: "Fried chicken wings" },
  },
  {
    id: "wings-6",
    category: "chicken",
    image: wings,
    price: 38000,
    name: { uz: "Qanotlar (6 dona)", ru: "Крылышки (6 шт)", en: "Wings (6 pcs)" },
    desc: { uz: "Qovurilgan tovuq qanotlari (1 kg)", ru: "Жареные куриные крылышки (1 кг)", en: "Fried chicken wings (1 kg)" },
  },

  // PIZZA
  {
    id: "pizza-margherita",
    category: "pizza",
    image: pizzaMargherita,
    price: 75000,
    name: { uz: "Margarita 30sm", ru: "Маргарита 30см", en: "Margherita 30cm" },
    desc: { uz: "Pomidor sousi, motsarella, rayhon", ru: "Томатный соус, моцарелла, базилик", en: "Tomato sauce, mozzarella, basil" },
  },
  {
    id: "pizza-pepperoni",
    category: "pizza",
    image: heroPizza,
    price: 92000,
    popular: true,
    name: { uz: "Pepperoni 30sm", ru: "Пепперони 30см", en: "Pepperoni 30cm" },
    desc: { uz: "Pepperoni kolbasa, qo'sh pishloq, achchiq qalampir", ru: "Колбаса пепперони, двойной сыр, перчик", en: "Pepperoni sausage, double cheese, chili" },
  },
  {
    id: "pizza-cheese",
    category: "pizza",
    image: pizzaCheese,
    price: 75000,
    name: { uz: "Pishloqli 30sm", ru: "Сырная 30см", en: "Cheese 30cm" },
    desc: { uz: "Motsarella, pomidor sousi, oregano", ru: "Моцарелла, томатный соус, орегано", en: "Mozzarella, tomato sauce, oregano" },
  },
  {
    id: "pizza-hawaiian",
    category: "pizza",
    image: pizzaHawaiian,
    price: 85000,
    name: { uz: "Havayyu 30sm", ru: "Гавайская 30см", en: "Hawaiian 30cm" },
    desc: { uz: "Vetchina, ananas, motsarella", ru: "Ветчина, ананас, моцарелла", en: "Ham, pineapple, mozzarella" },
  },
  {
    id: "pizza-4cheese",
    category: "pizza",
    image: pizza4cheese,
    price: 98000,
    name: { uz: "4 Pishloq 30sm", ru: "4 Сыра 30см", en: "4 Cheese 30cm" },
    desc: { uz: "Motsarella, parmezan, cheddar, gorgonzola", ru: "Моцарелла, пармезан, чеддер, горгонзола", en: "Mozzarella, parmesan, cheddar, gorgonzola" },
  },
  {
    id: "pizza-4seasons",
    category: "pizza",
    image: pizza4seasons,
    price: 95000,
    name: { uz: "4 Fasl 30sm", ru: "4 Сезона 30см", en: "4 Seasons 30cm" },
    desc: { uz: "Qo'ziqorin, vetchina, zaytun, qalampir", ru: "Грибы, ветчина, оливки, перец", en: "Mushrooms, ham, olives, peppers" },
  },
  {
    id: "pizza-bbq",
    category: "pizza",
    image: pizzaBbq,
    price: 99000,
    popular: true,
    name: { uz: "Chicken BBQ 30sm", ru: "Чикен BBQ 30см", en: "Chicken BBQ 30cm" },
    desc: { uz: "Grill tovuq, qizil piyoz, BBQ sous", ru: "Гриль курица, красный лук, BBQ соус", en: "Grilled chicken, red onion, BBQ sauce" },
  },
  {
    id: "pizza-stroganoff",
    category: "pizza",
    image: pizzaStroganoff,
    price: 92000,
    name: { uz: "Stroganoff 30sm", ru: "Строганов 30см", en: "Stroganoff 30cm" },
    desc: { uz: "Mol go'sht, qo'ziqorin, smetana sous", ru: "Говядина, грибы, сметанный соус", en: "Beef, mushrooms, sour cream sauce" },
  },
  {
    id: "pizza-margherita-25",
    category: "pizza",
    image: pizzaMargherita,
    price: 55000,
    name: { uz: "Margarita 25sm", ru: "Маргарита 25см", en: "Margherita 25cm" },
    desc: { uz: "Pomidor sousi, motsarella, rayhon", ru: "Томатный соус, моцарелла, базилик", en: "Tomato sauce, mozzarella, basil" },
  },
  {
    id: "pizza-pepperoni-25",
    category: "pizza",
    image: heroPizza,
    price: 68000,
    name: { uz: "Pepperoni 25sm", ru: "Пепперони 25см", en: "Pepperoni 25cm" },
    desc: { uz: "Pepperoni, qo'sh pishloq", ru: "Пепперони, двойной сыр", en: "Pepperoni, double cheese" },
  },
  {
    id: "pizza-bbq-25",
    category: "pizza",
    image: pizzaBbq,
    price: 72000,
    name: { uz: "Chicken BBQ 25sm", ru: "Чикен BBQ 25см", en: "Chicken BBQ 25cm" },
    desc: { uz: "Grill tovuq, BBQ sous, piyoz", ru: "Гриль курица, BBQ соус, лук", en: "Grilled chicken, BBQ sauce, onion" },
  },

  // LAVASH
  {
    id: "lavash-big",
    category: "lavash",
    image: lavashBig,
    price: 35000,
    popular: true,
    name: { uz: "Tovuqli katta lavash", ru: "Куриный большой лаваш", en: "Big Chicken Lavash" },
    desc: { uz: "Grill tovuq, sabzavotlar, mahsus sous, yupqa lavashda", ru: "Гриль курица, овощи, фирменный соус, тонкий лаваш", en: "Grilled chicken, veggies, signature sauce, thin lavash" },
  },
  {
    id: "lavash-mini",
    category: "lavash",
    image: lavashMini,
    price: 29000,
    name: { uz: "Tovuqli mini lavash", ru: "Куриный мини лаваш", en: "Mini Chicken Lavash" },
    desc: { uz: "Yengilroq porsiya, grill tovuq, sabzavot", ru: "Лёгкая порция, гриль курица, овощи", en: "Lighter portion, grilled chicken, veggies" },
  },
  {
    id: "lavash-cheese-big",
    category: "lavash",
    image: lavashCheese,
    price: 38000,
    name: { uz: "Tovuqli pishloqli katta lavash", ru: "Куриный сырный большой лаваш", en: "Big Cheese Chicken Lavash" },
    desc: { uz: "Grill tovuq, qo'sh pishloq, sabzavot", ru: "Гриль курица, двойной сыр, овощи", en: "Grilled chicken, double cheese, veggies" },
  },
  {
    id: "lavash-cheddar",
    category: "lavash",
    image: lavashCheese,
    price: 37000,
    name: { uz: "Tovuqli cheddar lavash", ru: "Куриный чеддер лаваш", en: "Chicken Cheddar Lavash" },
    desc: { uz: "Grill tovuq, eritilgan cheddar, sabzavot", ru: "Гриль курица, плавленый чеддер, овощи", en: "Grilled chicken, melted cheddar, veggies" },
  },
  {
    id: "lavash-big-doner",
    category: "lavash",
    image: lavashBig,
    price: 39000,
    name: { uz: "Tovuqli big doner", ru: "Куриный биг донер", en: "Chicken Big Doner" },
    desc: { uz: "Katta porsiya doner, grill tovuq, sous", ru: "Большая порция донера, гриль курица, соус", en: "Big doner portion, grilled chicken, sauce" },
  },
  {
    id: "lavash-lyulya-doner",
    category: "lavash",
    image: lavashLyulya,
    price: 33000,
    name: { uz: "Tovuqli lyulya doner", ru: "Куриный люля донер", en: "Chicken Lyulya Doner" },
    desc: { uz: "Lyulya kabob, sabzavot, sous", ru: "Люля-кебаб, овощи, соус", en: "Lyulya kebab, veggies, sauce" },
  },
  {
    id: "lavash-shaurma",
    category: "lavash",
    image: shawarma,
    price: 29000,
    name: { uz: "Tovuqli shaurma", ru: "Куриная шаурма", en: "Chicken Shawarma" },
    desc: { uz: "Klassik shaurma — tovuq, sabzavot, sous", ru: "Классическая шаурма — курица, овощи, соус", en: "Classic shawarma — chicken, veggies, sauce" },
  },
  {
    id: "lavash-hot",
    category: "lavash",
    image: lavashHot,
    price: 39000,
    name: { uz: "Tovuqli hot lavash", ru: "Куриный хот лаваш", en: "Hot Chicken Lavash" },
    desc: { uz: "O'tkir tovuq, achchiq sous, sabzavot", ru: "Острая курица, острый соус, овощи", en: "Spicy chicken, hot sauce, veggies" },
  },
  {
    id: "lavash-classic",
    category: "lavash",
    image: lavash,
    price: 32000,
    name: { uz: "Klassik lavash", ru: "Классический лаваш", en: "Classic Lavash" },
    desc: { uz: "Grill tovuq, salat, pomidor, mayonez", ru: "Гриль курица, салат, помидор, майонез", en: "Grilled chicken, lettuce, tomato, mayo" },
  },

  // SNACKS
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
    id: "onion-rings",
    category: "snacks",
    image: onionRings,
    price: 19000,
    name: { uz: "Piyoz halqachalari", ru: "Луковые кольца", en: "Onion Rings" },
    desc: { uz: "Qarsillama qoplam, mahsus sous bilan", ru: "Хрустящая корочка, с фирменным соусом", en: "Crispy coating with house sauce" },
  },

  // DRINKS
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
    id: "lemonade",
    category: "drinks",
    image: lemonade,
    price: 18000,
    name: { uz: "Limon-yalpiz limonad", ru: "Лимонад с мятой", en: "Mint Lemonade" },
    desc: { uz: "Yangi siqilgan limon, yalpiz, muz", ru: "Свежий лимон, мята, лёд", en: "Fresh lemon, mint, ice" },
  },

  // DESSERT
  {
    id: "icecream",
    category: "dessert",
    image: icecream,
    price: 16000,
    name: { uz: "Vanilli sundae", ru: "Ванильный сандэй", en: "Vanilla Sundae" },
    desc: { uz: "Yumshoq vanilli muzqaymoq, shokolad sousi", ru: "Мягкое ванильное мороженое, шоколадный соус", en: "Soft vanilla ice cream, chocolate sauce" },
  },
];

export const categoryOrder: Category[] = ["popular", "burgers", "chicken", "pizza", "lavash", "snacks", "drinks", "dessert"];

export const formatUZS = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n) + " so'm";
