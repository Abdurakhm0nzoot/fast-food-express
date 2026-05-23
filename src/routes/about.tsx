import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Biz haqimizda — OlovFood" }, { name: "description", content: "OlovFood — Toshkentdagi tezkor yetkazib berish xizmati." }] }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="font-display text-5xl text-brand-dark mb-6">Biz haqimizda</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          OlovFood — Toshkent bo'ylab tezkor va sifatli yetkazib berish xizmati. Bizning oshxonalarimizda har bir taom buyurtma berilganidan keyin yangidan tayyorlanadi va 45 daqiqa ichida sizning eshigingizgacha yetib boradi.
        </p>
      </main>
      <Footer />
    </div>
  ),
});
