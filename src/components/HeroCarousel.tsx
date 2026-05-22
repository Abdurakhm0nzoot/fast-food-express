import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import heroBurger from "@/assets/hero-burger.jpg";
import heroChicken from "@/assets/hero-chicken.jpg";
import heroPizza from "@/assets/hero-pizza.jpg";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { img: heroBurger, key: 1 as const },
  { img: heroChicken, key: 2 as const },
  { img: heroPizza, key: 3 as const },
];

export function HeroCarousel({ onCta }: { onCta: () => void }) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(0.35_0.12_25),transparent_50%),radial-gradient(circle_at_80%_70%,oklch(0.3_0.1_15),transparent_60%)]" />
      <div className="relative container mx-auto px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[420px]">
          {slides.map((s, i) => {
            const slideKey = s.key;
            const active = i === idx;
            return (
              <div
                key={i}
                className={`col-span-full grid md:grid-cols-2 gap-8 items-center transition-all duration-700 ${active ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0 px-4"}`}
                style={{ gridRow: 1, gridColumn: "1 / -1" }}
              >
                <div className="space-y-5 z-10">
                  <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    ★ {t("hero.tag")}
                  </span>
                  <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-white">
                    {t(`hero.slide${slideKey}.title` as const)}
                  </h1>
                  <p className="text-white/80 text-base md:text-lg max-w-md">
                    {t(`hero.slide${slideKey}.sub` as const)}
                  </p>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={onCta} size="lg" className="brand-gradient text-brand-foreground hover:opacity-90 shadow-[var(--shadow-glow)]">
                      {t("hero.cta")} →
                    </Button>
                    <Button onClick={onCta} size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                      {t("hero.menu")}
                    </Button>
                  </div>
                </div>
                <div className="relative flex justify-center md:justify-end">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                  <img
                    src={s.img}
                    alt=""
                    width={600}
                    height={600}
                    className="relative w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 relative z-10">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-10 bg-primary" : "w-5 bg-white/30"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={prev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeft className="size-5" /></button>
            <button onClick={next} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronRight className="size-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
