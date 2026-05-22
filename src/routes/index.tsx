import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { products, categoryOrder, type Category } from "@/lib/products";
import { useI18n } from "@/lib/i18n";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FastBite — Tez yetkazib berish | Burger, Tovuq, Pitsa" },
      { name: "description", content: "Toshkent bo'ylab 45 daqiqada yetkazib berish. Burgerlar, qovurilgan tovuq, pitsa va ko'p narsa." },
      { property: "og:title", content: "FastBite — Fast food delivery" },
      { property: "og:description", content: "Order burgers, fried chicken, pizza & more in Tashkent." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, lang } = useI18n();
  const [active, setActive] = useState<Category>("popular");
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const grouped = useMemo(() => {
    const g: Record<Category, typeof products> = { popular: [], burgers: [], chicken: [], pizza: [], snacks: [], drinks: [], dessert: [] };
    products.forEach((p) => { g[p.category].push(p); if (p.popular) g.popular.push(p); });
    return g;
  }, []);

  const handleSelect = (c: Category) => {
    setActive(c);
    refs.current[c]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).id as Category); });
    }, { rootMargin: "-200px 0px -60% 0px", threshold: 0 });
    Object.values(refs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel onCta={() => refs.current.popular?.scrollIntoView({ behavior: "smooth" })} />
        <CategoryNav active={active} onSelect={handleSelect} />

        <div className="container mx-auto px-4 py-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl text-brand-dark">{t("section.menu")}</h2>
            <p className="text-muted-foreground mt-2">{t("section.menu.sub")}</p>
          </div>

          {categoryOrder.map((c) => (
            <section key={c} id={c} ref={(el) => { refs.current[c] = el; }} className="scroll-mt-32">
              <h3 className="font-display text-3xl mb-5 flex items-center gap-3">
                <span className="text-primary">●</span> {t(`cat.${c}` as const)}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {grouped[c].map((p) => <ProductCard key={`${c}-${p.id}`} product={p} />)}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
